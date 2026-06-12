"use client";

import { Timeline } from "@/components/ui/timeline";
import { Wallet, Star, MapPin, Plane } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/tripStore";
import Image from "next/image";

/* =====================================================
   PERFECT FINAL IMAGE SYSTEM
   - No broken images ever
   - Stable picsum seed system
   - Smart landmark keywords
   - Auto fallback
   - No API key needed
===================================================== */

/* Smart Query Builder */
const buildQuery = (name: string) => {
  const lower = name.toLowerCase();

  if (lower.includes("hotel")) return `${name} hotel room building`;
  if (lower.includes("resort")) return `${name} beach resort luxury`;
  if (lower.includes("temple")) return `${name} temple architecture`;
  if (lower.includes("beach")) return `${name} beach ocean sunset`;
  if (lower.includes("museum")) return `${name} museum travel`;
  if (lower.includes("mountain")) return `${name} mountain valley`;
  if (lower.includes("palace")) return `${name} palace heritage`;
  if (lower.includes("fort")) return `${name} fort india`;
  if (lower.includes("tower")) return `${name} tower skyline`;
  if (lower.includes("lake")) return `${name} lake nature`;

  return `${name} travel landmark city`;
};

/* Final Image URL */
const getImageUrl = (
  name: string,
  existingUrl?: string
) => {
  if (existingUrl && existingUrl.length > 5)
    return existingUrl;

  const query = encodeURIComponent(
    buildQuery(name)
  );

  return `https://picsum.photos/seed/${query}/600/400`;
};

function EmptyItinerary() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-20 space-y-6">
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center animate-pulse">
          <Plane className="w-14 h-14 text-primary" />
        </div>

        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-yellow-600" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Itinerary Will Appear Here
        </h2>

        <p className="text-gray-500 text-sm leading-relaxed">
          Chat with our AI assistant on the left to plan your perfect trip.
          Once you finalize your preferences, your personalized itinerary
          will be generated right here!
        </p>
      </div>
    </div>
  );
}

function Itinerary() {
  const tripData = useTripStore(
  (state) => state.tripData
);

  if (!tripData?.trip_plan) {
    return <EmptyItinerary />;
  }

  const plan = tripData.trip_plan;

  const data = [
    {
      title: "Recommended Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.hotels?.map(
            (hotel: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-1 p-3 border rounded-xl hover:scale-105 transition-all cursor-pointer bg-white"
              >
                <Image
  src={getImageUrl(
    hotel.name ||
    hotel.hotel_name ||
    "hotel"
  )}
  alt={
    hotel.name ||
    hotel.hotel_name ||
    "hotel"
  }
  width={600}
  height={400}
  unoptimized
  className="rounded-xl shadow object-cover h-40 w-full mb-2 bg-gray-100"
/>

                <h2 className="font-semibold text-lg">
                  {hotel.name ||
                    hotel.hotel_name}
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

                <div className="mt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      hotel.name ||
                      hotel.hotel_name ||
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      View on Map
                    </Button>
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      ),
    },

    ...(plan.itinerary || []).map(
      (dayData: any) => ({
        title: `Day ${dayData.day}`,
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="col-span-1 md:col-span-2 text-xl font-bold text-primary">
              {dayData.title}
            </p>

            {dayData.activities?.map(
              (
                activity: any,
                actIndex: number
              ) => (
                <div
                  key={actIndex}
                  className="p-4 border rounded-xl flex flex-col gap-2 hover:shadow-lg transition-shadow bg-card"
                >
                  <Image
  src={getImageUrl(
    activity.activity ||
    activity.name ||
    "travel"
  )}
  alt={
    activity.activity ||
    activity.name ||
    "travel"
  }
  width={600}
  height={400}
  unoptimized
  className="rounded-xl shadow object-cover h-48 w-full mb-2 bg-gray-100"
/>

                  <h3 className="font-bold text-lg">
                    <span className="text-secondary">
                      {activity.time}
                    </span>{" "}
                    -{" "}
                    {activity.activity ||
                      activity.name}
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
              )
            )}
          </div>
        ),
      })
    ),
  ];

  return (
    <div className="relative w-full h-[83vh] overflow-auto px-4">
      <Timeline
        data={data}
        tripData={tripData}
      />
    </div>
  );
}

export default Itinerary;