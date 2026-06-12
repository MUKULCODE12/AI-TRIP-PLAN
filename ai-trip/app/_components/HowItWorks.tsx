"use client";

import React from "react";
import { MessageSquare, Sparkles, MapPin } from "lucide-react";

const steps = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Chat with AI",
    description:
      "Tell our AI where you want to go, your budget, group size, and travel duration through a simple chat interface.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI Generates Your Plan",
    description:
      "Our AI creates a detailed day-by-day itinerary with activities, hotel recommendations, and cost estimates.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Explore & Travel",
    description:
      "View your saved trips anytime, check hotel locations on Google Maps, and travel with confidence.",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gray-50/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            How It Works
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Plan your dream vacation in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md">
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-5 text-primary group-hover:scale-110 transition-transform`}
              >
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
