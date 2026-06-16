"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Timeline } from "@/components/ui/timeline";
import { Wallet, Star, ArrowLeft, Loader, Plane, Map, Cloud, Lightbulb, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

const smartQuery = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("hotel")) return `${name} luxury hotel`;
  if (lower.includes("beach")) return `${name} beach tourism`;
  if (lower.includes("museum")) return `${name} museum`;
  if (lower.includes("tower")) return `${name} landmark`;
  if (lower.includes("temple")) return `${name} temple architecture`;
  return `${name} travel landmark city`;
};

function SmartImage({ name, height = "h-40" }: { name: string; height?: string }) {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      const cacheKey = `detail-image-${name}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) { setImage(cached); setLoading(false); return; }
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(smartQuery(name))}&per_page=1&orientation=landscape&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        );
        const data = await res.json();
        const img = data.results?.length > 0 ? data.results[0].urls.regular : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
        setImage(img);
        localStorage.setItem(cacheKey, img);
      } catch {
        setImage("https://images.unsplash.com/photo-1507525428034-b723cf961d3e");
      }
      setLoading(false);
    };
    loadImage();
  }, [name]);

  if (loading) return <div className={`w-full ${height} animate-pulse bg-gray-200 rounded-xl`} />;
  return <img src={image} alt={name} className={`rounded-xl shadow object-cover ${height} w-full mb-2`} loading="lazy" />;
}

// ✈️ Flight Booking
function FlightBookingSection({ origin, destination, duration }: { origin: string; destination: string; duration: string }) {
  const encode = encodeURIComponent;
  const [nearestAirport, setNearestAirport] = useState("");
  const [loadingAirport, setLoadingAirport] = useState(true);

  useEffect(() => {
    const fetchNearestAirport = async () => {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ 
              role: "user", 
              content: `What is the nearest airport to "${destination}"? If there is no airport in ${destination}, give the nearest city with an airport. Reply in this exact JSON format only, nothing else: {"city": "City Name", "airport": "Airport Full Name", "code": "IATA Code", "distance": "X km from ${destination}"}` 
            }],
            max_tokens: 200,
          })
        });
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        setNearestAirport(parsed.city ? `${parsed.airport} (${parsed.code}) — ${parsed.distance}` : "");
      } catch {
        setNearestAirport("");
      }
      setLoadingAirport(false);
    };
    fetchNearestAirport();
  }, [destination]);

  const flightDestination = nearestAirport ? nearestAirport.split("(")[1]?.split(")")[0] || destination : destination;
  const isIndia = origin.includes("India") && destination.includes("India");

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-600 text-white p-2 rounded-full"><Plane size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Book Your Travel</h2>
          <p className="text-sm text-gray-500">{origin} → {destination} • {duration}</p>
        </div>
      </div>

      {/* Nearest Airport Info */}
      {loadingAirport ? (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Loader className="animate-spin" size={14} />
          Finding nearest airport...
        </div>
      ) : nearestAirport ? (
        <div className="bg-blue-100 border border-blue-200 rounded-xl px-4 py-2 mb-4 text-sm text-blue-800 flex items-center gap-2">
          ✈️ <span>Nearest Airport to <b>{destination}</b>: <b>{nearestAirport}</b></span>
        </div>
      ) : null}

      {/* ✈️ Flights */}
      <p className="text-sm font-semibold text-gray-600 mb-2">✈️ Flights</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <a href={`https://www.google.com/travel/flights?q=flights+from+${encode(origin)}+to+${encode(nearestAirport || destination)}`} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2"><Plane size={16} /> Google Flights</Button>
        </a>
        <a href="https://www.makemytrip.com/flights/" target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-red-500 hover:bg-red-600 gap-2"><Plane size={16} /> MakeMyTrip</Button>
        </a>
        <a href={`https://www.skyscanner.co.in/`} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"><Plane size={16} /> Skyscanner</Button>
        </a>
      </div>

      {/* 🚌 Bus & Train */}
      {isIndia && (
        <>
          <p className="text-sm font-semibold text-gray-600 mb-2">🚌 Bus & Train</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <a href={`https://www.redbus.in/bus-tickets/${encode(origin.split(",")[0].toLowerCase())}-to-${encode(destination.split(",")[0].toLowerCase())}`} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-red-600 hover:bg-red-700 gap-2">🚌 RedBus</Button>
            </a>
            <a href={`https://www.makemytrip.com/bus-tickets/`} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 gap-2">🚌 MMT Bus</Button>
            </a>
            <a href={`https://www.irctc.co.in/nget/train-search`} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-blue-800 hover:bg-blue-900 gap-2">🚂 IRCTC Train</Button>
            </a>
          </div>
        </>
      )}

      {/* 🚗 Cab */}
      <p className="text-sm font-semibold text-gray-600 mb-2">🚗 Cab & Self Drive</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href="https://www.olacabs.com/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full gap-2">🚗 Ola Outstation</Button>
        </a>
        <a href="https://www.uber.com/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full gap-2">🚗 Uber</Button>
        </a>
        <a href="https://www.zoomcar.com/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full gap-2">🚗 Zoomcar</Button>
        </a>
      </div>
    </div>
  );
}

// 🗺️ Map
function MapSection({ destination }: { destination: string }) {
  return (
    <div className="border rounded-2xl overflow-hidden mb-8">
      <div className="flex items-center gap-2 p-4 bg-gray-50 border-b">
        <Map size={20} className="text-green-600" />
        <h2 className="text-lg font-bold">Trip Map — {destination}</h2>
        <a href={`https://www.google.com/maps/search/${encodeURIComponent(destination)}`} target="_blank" rel="noopener noreferrer" className="ml-auto">
          <Button variant="outline" size="sm">Open in Google Maps</Button>
        </a>
      </div>
      <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}

// 🌤️ Weather
function WeatherSection({ destination }: { destination: string }) {
  const city = destination.split(",")[0];
  const [weather, setWeather] = useState<any>(null);
  const [bestTime, setBestTime] = useState("");
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingBestTime, setLoadingBestTime] = useState(true);

  useEffect(() => {
    // Fetch current weather
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await res.json();
        if (data.cod === 200) setWeather(data);
      } catch {
        setWeather(null);
      }
      setLoadingWeather(false);
    };

    // Fetch best time via Groq
    const fetchBestTime = async () => {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: `What is the best time to visit ${destination}? Give a 2-3 line practical answer for tourists.` }],
            max_tokens: 150,
          })
        });
        const data = await res.json();
        setBestTime(data.choices?.[0]?.message?.content || "");
      } catch {
        setBestTime("");
      }
      setLoadingBestTime(false);
    };

    fetchWeather();
    fetchBestTime();
  }, [city, destination]);

  const getWeatherIcon = (main: string) => {
    const icons: Record<string, string> = {
      Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Snow: "❄️",
      Thunderstorm: "⛈️", Drizzle: "🌦️", Mist: "🌫️", Fog: "🌫️"
    };
    return icons[main] || "🌡️";
  };

  return (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-sky-500 text-white p-2 rounded-full"><Cloud size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Weather & Best Time to Visit</h2>
          <p className="text-sm text-gray-500">{destination}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Weather */}
        <div className="bg-white rounded-xl p-4 border border-sky-100">
          <p className="text-sm font-semibold text-gray-600 mb-2">🌡️ Current Weather</p>
          {loadingWeather ? (
            <div className="flex items-center gap-2"><Loader className="animate-spin" size={16} /><span className="text-sm text-gray-500">Loading...</span></div>
          ) : weather ? (
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getWeatherIcon(weather.weather[0].main)}</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(weather.main.temp)}°C</p>
                <p className="text-sm text-gray-500 capitalize">{weather.weather[0].description}</p>
                <p className="text-xs text-gray-400">Humidity: {weather.main.humidity}% • Wind: {Math.round(weather.wind.speed)} km/h</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Weather data unavailable</p>
          )}
        </div>

        {/* Best Time to Visit */}
        <div className="bg-white rounded-xl p-4 border border-sky-100">
          <p className="text-sm font-semibold text-gray-600 mb-2">📅 Best Time to Visit</p>
          {loadingBestTime ? (
            <div className="flex items-center gap-2"><Loader className="animate-spin" size={16} /><span className="text-sm text-gray-500">Loading...</span></div>
          ) : bestTime ? (
            <p className="text-sm text-gray-700 leading-relaxed">{bestTime}</p>
          ) : (
            <p className="text-sm text-gray-500">Information unavailable</p>
          )}
        </div>
      </div>
    </div>
  );
}

// 💡 Local Tips Modal (AI powered)
function LocalTipsSection({ destination }: { destination: string }) {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchTips = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: `Give me 8 local tips and hidden gems for visiting ${destination}. Return ONLY a JSON array of strings, no other text. Example: ["tip1", "tip2"]` }],
          max_tokens: 1000,
        })
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setTips(parsed);
      setLoaded(true);
    } catch {
      setTips(["Check local tourist offices for free maps", "Use public transport to save money", "Try local street food", "Visit early morning to avoid crowds", "Download offline maps before you go"]);
      setLoaded(true);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-amber-500 text-white p-2 rounded-full"><Lightbulb size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Local Tips & Hidden Gems</h2>
          <p className="text-sm text-gray-500">AI-powered insider knowledge for {destination}</p>
        </div>
        {!loaded && (
          <Button onClick={fetchTips} disabled={loading} className="ml-auto bg-amber-500 hover:bg-amber-600 gap-2">
            {loading ? <Loader className="animate-spin" size={16} /> : <Lightbulb size={16} />}
            {loading ? "Loading..." : "Get Tips"}
          </Button>
        )}
      </div>
      {tips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-2 bg-white p-3 rounded-xl border border-amber-100">
              <span className="text-amber-500 font-bold text-sm mt-0.5">💡</span>
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🔍 Activity Detail Modal (AI powered)
function ActivityDetailModal({ activity, destination, onClose }: { activity: string; destination: string; onClose: () => void }) {
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: `Give me detailed information about "${activity}" in ${destination}. Include: what it is, why it's famous, best time to visit, tips, nearby attractions, and approximate cost. Keep it concise and practical for a tourist.` }],
            max_tokens: 1000,
          })
        });
        const data = await res.json();
        setInfo(data.choices?.[0]?.message?.content || "No information available.");
      } catch {
        setInfo("Could not load information. Please try again.");
      }
      setLoading(false);
    };
    fetchInfo();
  }, [activity, destination]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{activity}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10"><Loader className="animate-spin h-8 w-8 text-primary" /></div>
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{info}</p>
        )}
        <Button onClick={onClose} className="w-full mt-4">Close</Button>
      </div>
    </div>
  );
}

// 🏨 Hotel Detail Modal (AI powered)
function HotelDetailModal({ hotel, destination, onClose }: { hotel: string; destination: string; onClose: () => void }) {
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: `Give me detailed information about "${hotel}" hotel in ${destination}. Include: amenities, location, nearby attractions, check-in/out times, what makes it special, and booking tips.` }],
            max_tokens: 1000,
          })
        });
        const data = await res.json();
        setInfo(data.choices?.[0]?.message?.content || "No information available.");
      } catch {
        setInfo("Could not load information. Please try again.");
      }
      setLoading(false);
    };
    fetchInfo();
  }, [hotel, destination]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{hotel}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10"><Loader className="animate-spin h-8 w-8 text-primary" /></div>
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{info}</p>
        )}
        <Button onClick={onClose} className="w-full mt-4">Close</Button>
      </div>
    </div>
  );
}

function TripDetailPage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<{ name: string; destination: string } | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<{ name: string; destination: string } | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/trips/${tripId}`);
        setTrip(res.data);
      } catch (err) {
        console.error("Failed to fetch trip:", err);
        setTrip(null);
      } finally {
        setLoading(false);
      }
    };
    if (tripId) fetchTrip();
  }, [tripId]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <p className="text-gray-500">Loading trip details...</p>
      </div>
    </div>
  );

  if (trip === null) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <h2 className="text-2xl font-bold text-gray-700">Trip not found</h2>
      <Link href="/my-trips"><Button className="mt-6 rounded-full px-8"><ArrowLeft size={16} className="mr-2" />Back to My Trips</Button></Link>
    </div>
  );

  const plan = trip.tripData;
  const tripData = plan?.trip_plan ? plan : { trip_plan: plan };
  const origin = tripData.trip_plan?.origin || "Delhi, India";
  const destination = tripData.trip_plan?.destination || "Unknown";
  const duration = tripData.trip_plan?.duration || "";

  const data = [
    {
      title: "Recommended Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(tripData.trip_plan?.hotels || []).map((hotel: any, index: number) => {
            const hotelName = hotel.name || hotel.hotel_name || "Hotel";
            return (
              <div key={index} className="flex flex-col gap-1 p-3 border rounded-xl hover:shadow-lg transition-all bg-white">
                <SmartImage name={hotelName} height="h-40" />
                <h2 className="font-semibold text-lg">{hotelName}</h2>
                <h2 className="text-gray-500 line-clamp-2 text-sm">{hotel.description || hotel.hotel_address}</h2>
                <div className="flex justify-between items-center mt-2">
                  <p className="flex gap-1 items-center text-green-600 font-medium"><Wallet size={16} />{hotel.pricePerNight || hotel.price_per_night}</p>
                  <p className="text-yellow-500 flex gap-1 items-center font-medium"><Star size={16} fill="currentColor" />{hotel.rating}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName)}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full gap-1"><Map size={14} /> Map</Button>
                  </a>
                  <Button className="flex-1 gap-1" onClick={() => setSelectedHotel({ name: hotelName, destination })}>
                    <Info size={14} /> Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    ...(tripData.trip_plan?.itinerary || []).map((dayData: any) => ({
      title: `Day ${dayData.day}`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="col-span-1 md:col-span-2 text-xl font-bold text-primary">{dayData.title}</p>
          {(dayData.activities || []).map((activity: any, actIndex: number) => {
            const actName = activity.activity || activity.name || "Travel";
            return (
              <div key={actIndex} className="p-4 border rounded-xl flex flex-col gap-2 hover:shadow-lg transition-shadow bg-white">
                <SmartImage name={actName} height="h-48" />
                <h3 className="font-bold text-lg"><span className="text-secondary">{activity.time}</span> - {actName}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
                <p className="text-sm font-semibold text-green-600 mt-2 bg-green-50 w-fit px-2 py-1 rounded">
                  Estimated Cost: {activity.estimatedCost || activity.estimated_cost || "Free"}
                </p>
                <div className="flex gap-2 mt-1">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(actName + " " + destination)}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1"><Map size={14} /> Map</Button>
                  </a>
                  <Button size="sm" className="flex-1 gap-1" onClick={() => setSelectedActivity({ name: actName, destination })}>
                    <Info size={14} /> Deep Info
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ),
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {selectedActivity && (
        <ActivityDetailModal activity={selectedActivity.name} destination={selectedActivity.destination} onClose={() => setSelectedActivity(null)} />
      )}
      {selectedHotel && (
        <HotelDetailModal hotel={selectedHotel.name} destination={selectedHotel.destination} onClose={() => setSelectedHotel(null)} />
      )}

      <Link href="/my-trips">
        <Button variant="ghost" className="mb-4 gap-2 text-gray-600 hover:text-gray-900"><ArrowLeft size={18} />Back to My Trips</Button>
      </Link>

      <FlightBookingSection origin={origin} destination={destination} duration={duration} />
      <WeatherSection destination={destination} />
      <LocalTipsSection destination={destination} />
      <MapSection destination={destination} />
      <Timeline data={data} tripData={tripData} />
    </div>
  );
}

export default TripDetailPage;