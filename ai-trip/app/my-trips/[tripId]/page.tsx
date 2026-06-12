"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Timeline } from "@/components/ui/timeline";
import { Wallet, Star, ArrowLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";



/* =====================================================
   DETAIL PAGE FINAL
   - Real hotel images
   - Real activity images
   - Unsplash API
   - Cache images
   - Skeleton loading
   - Production Ready
===================================================== */

/*
Create .env.local

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=YOUR_KEY
*/

/* Search Query Optimizer */
const smartQuery = (name: string) => {
  const lower = name.toLowerCase();

  if (lower.includes("hotel")) return `${name} luxury hotel`;
  if (lower.includes("hostel")) return `${name} hostel room`;
  if (lower.includes("beach")) return `${name} beach tourism`;
  if (lower.includes("museum")) return `${name} museum`;
  if (lower.includes("tower")) return `${name} landmark`;
  if (lower.includes("temple")) return `${name} temple architecture`;

  return `${name} travel landmark city`;
};

/* =====================================================
   IMAGE COMPONENT
===================================================== */

function SmartImage({
  name,
  height = "h-40",
}: {
  name: string;
  height?: string;
}) {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      const cacheKey = `detail-image-${name}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setImage(cached);
        setLoading(false);
        return;
      }

      try {
        const query = smartQuery(name);

        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query
          )}&per_page=1&orientation=landscape&client_id=${
            process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
          }`
        );

        const data = await res.json();

        if (data.results?.length > 0) {
          const img = data.results[0].urls.regular;
          setImage(img);
          localStorage.setItem(cacheKey, img);
        } else {
          setImage(
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          );
        }
      } catch {
        setImage(
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        );
      }

      setLoading(false);
    };

    loadImage();
  }, [name]);

  if (loading) {
    return (
      <div
        className={`w-full ${height} animate-pulse bg-gray-200 rounded-xl`}
      />
    );
  }

  return (
    <img
      src={image}
      alt={name}
      className={`rounded-xl shadow object-cover ${height} w-full mb-2`}
      loading="lazy"
    />
  );
}

/* =====================================================
   MAIN PAGE
===================================================== */

function TripDetailPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  const [trip, setTrip] = useState<any>(null);
  useEffect(() => {
  const fetchTrip = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/trips/${tripId}`
      );

      setTrip(res.data);
    } catch (err) {
      console.error("Failed to fetch trip:", err);
      setTrip(null);
    } finally {
      setLoading(false);
    }
  };

  if (tripId) {
    fetchTrip();
  }
}, [tripId]);const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin h-8 w-8 text-primary" />
          <p className="text-gray-500">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (trip === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-700">
          Trip not found
        </h2>

        <Link href="/my-trips">
          <Button className="mt-6 rounded-full px-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to My Trips
          </Button>
        </Link>
      </div>
    );
  }

  const plan = trip.tripData;
  const tripData = plan?.trip_plan ? plan : { trip_plan: plan };
  

  const data = [
    {
      title: "Recommended Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(tripData.trip_plan?.hotels || []).map(
            (hotel: any, index: number) => {
              const hotelName =
                hotel.name || hotel.hotel_name || "Hotel";

              return (
                <div
                  key={index}
                  className="flex flex-col gap-1 p-3 border rounded-xl hover:shadow-lg transition-all bg-white"
                >
                  <SmartImage
                    name={hotelName}
                    height="h-40"
                  />

                  <h2 className="font-semibold text-lg">
                    {hotelName}
                  </h2>

                  <h2 className="text-gray-500 line-clamp-2 text-sm">
                    {hotel.description ||
                      hotel.hotel_address}
                  </h2>

                  <div className="flex justify-between items-center mt-2">
                    <p className="flex gap-1 items-center text-green-600 font-medium">
                      <Wallet size={16} />
                      {hotel.pricePerNight ||
                        hotel.price_per_night}
                    </p>

                    <p className="text-yellow-500 flex gap-1 items-center font-medium">
                      <Star
                        size={16}
                        fill="currentColor"
                      />
                      {hotel.rating}
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      hotelName
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View on Map
                    </Button>
                  </a>
                </div>
              );
            }
          )}
        </div>
      ),
    },

    ...(tripData.trip_plan?.itinerary || []).map(
      (dayData: any) => ({
        title: `Day ${dayData.day}`,
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="col-span-1 md:col-span-2 text-xl font-bold text-primary">
              {dayData.title}
            </p>

            {(dayData.activities || []).map(
              (activity: any, actIndex: number) => {
                const actName =
                  activity.activity ||
                  activity.name ||
                  "Travel";

                return (
                  <div
                    key={actIndex}
                    className="p-4 border rounded-xl flex flex-col gap-2 hover:shadow-lg transition-shadow bg-white"
                  >
                    <SmartImage
                      name={actName}
                      height="h-48"
                    />

                    <h3 className="font-bold text-lg">
                      <span className="text-secondary">
                        {activity.time}
                      </span>{" "}
                      - {actName}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {activity.description}
                    </p>

                    <p className="text-sm font-semibold text-green-600 mt-2 bg-green-50 w-fit px-2 py-1 rounded">
                      Estimated Cost:{" "}
                      {activity.estimatedCost ||
                        activity.estimated_cost ||
                        "Free"}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        ),
      })
    ),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link href="/my-trips">
        <Button
          variant="ghost"
          className="mb-4 gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to My Trips
        </Button>
      </Link>
      
      <>
  

  <Timeline
    data={data}
    tripData={tripData}
  />
</>
    </div>
  );
}

export default TripDetailPage;