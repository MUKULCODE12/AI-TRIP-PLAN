"use client";

import React, { useEffect, useState } from "react";
import { useUserDetail } from "@/app/provider";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Users,
  Wallet2,
  Trash2,
  Eye,
  Plane,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/* =====================================================
   UNSPLASH FINAL SYSTEM
   - Real city / landmark images
   - Cache image URLs
   - Loading skeleton
   - No repeated API calls
   - Works for any city
===================================================== */

/* IMPORTANT:
Create .env.local

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=YOUR_KEY_HERE

Get key:
https://unsplash.com/developers
*/

/* Search Keywords for Better Results */
const cityQueries: Record<string, string> = {
  "Paris, France": "Eiffel Tower Paris",
  "New York, USA": "Times Square Manhattan New York",
  "Toronto, Canada": "CN Tower Toronto skyline",
  "Delhi, India": "India Gate Delhi",
  "Mumbai, India": "Gateway of India Mumbai",
  "Pune, India": "Pune city India",
  "Las Vegas, USA": "Las Vegas Strip night",
  "London, UK": "Big Ben London",
  "Dubai, UAE": "Burj Khalifa Dubai",
  "Tokyo, Japan": "Tokyo skyline Japan",
};

function TripImage({ destination }: { destination: string }) {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      const cacheKey = `trip-image-${destination}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setImage(cached);
        setLoading(false);
        return;
      }

      const query =
        cityQueries[destination] ||
        `${destination} famous landmark city travel`;

      try {
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
  }, [destination]);

  if (loading) {
    return (
      <div className="w-full h-full animate-pulse bg-gray-200" />
    );
  }

  return (
    <img
      src={image}
      alt={destination}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
  );
}

/* =====================================================
   MAIN PAGE
===================================================== */

function MyTripsPage() {
  const { userDetail, loading: userLoading } = useUserDetail();

  const [trips, setTrips] = useState<any[]>([]);
const [loadingTrips, setLoadingTrips] = useState(true);

useEffect(() => {
  const fetchTrips = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/trips"
      );

      setTrips(res.data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoadingTrips(false);
    }
  };

  fetchTrips();
}, []);

const handleDelete = async (tripId: string) => {
  if (!confirm("Are you sure you want to delete this trip?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/trips/${tripId}`
    );

    setTrips((prev) =>
      prev.filter((trip) => trip.tripId !== tripId)
    );
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <Plane className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">
          Sign in to view your trips
        </h2>
      </div>
    );
  }

  if (loadingTrips) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          My Trips
        </h1>

        <p className="text-gray-500 mt-2">
          All your AI-planned adventures in one place.
        </p>
      </div>

      {/* EMPTY STATE */}
      {trips.length === 0 ? (
        <div className="text-center py-20">
          <Plane className="w-14 h-14 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold">No trips yet</h2>

          <Link href="/create-new-trip">
            <Button className="mt-5 rounded-full px-8">
              Plan Your First Trip
            </Button>
          </Link>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: any) => {
            const plan = trip.tripData;

            const destination =
              plan?.destination ||
              plan?.trip_plan?.destination ||
              "Unknown";

            const origin =
              plan?.origin ||
              plan?.trip_plan?.origin ||
              "";

            const duration =
              plan?.duration ||
              plan?.trip_plan?.duration ||
              "";

            const budget =
              plan?.budget ||
              plan?.trip_plan?.budget ||
              "";

            const groupSize =
              plan?.groupSize ||
              plan?.group_size ||
              "";

            const totalCost =
              plan?.estimatedTotalCost ||
              plan?.estimated_total_cost ||
              "";

            return (
              <div
                key={trip.id}
                className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all group"
              >
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden">
                  <TripImage destination={destination} />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">
                      {destination}
                    </h3>

                    {origin && (
                      <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        From {origin}
                      </p>
                    )}
                  </div>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {duration && (
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                        <Calendar size={14} />
                        {duration}
                      </div>
                    )}

                    {budget && (
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                        <Wallet2 size={14} />
                        {budget}
                      </div>
                    )}

                    {groupSize && (
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                        <Users size={14} />
                        {groupSize}
                      </div>
                    )}
                  </div>

                  {totalCost && (
                    <p className="text-green-600 font-semibold text-sm">
                      Total: ₹{totalCost}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/my-trips/${trip.tripId}`}
                      className="flex-1"
                    >
                      <Button className="w-full rounded-xl gap-2">
                        <Eye size={16} />
                        View Trip
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl text-red-500"
                      onClick={() => handleDelete(trip.tripId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyTripsPage;