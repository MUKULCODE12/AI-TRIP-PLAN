"use client";

import React from "react";
import ChatBox from "./_components/ChatBox";
import Itinerary from "./_components/Itinerary";


/**
 * CreateTripPage Component
 * This page implements a split-screen layout:
 * - Left Pane: The interactive AI Chat interface for collecting trip details.
 * - Right Pane: The generated itinerary display.
 */
function CreateTripPage() {
  return (
   <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
    <div className="w-full md:w-[35%] border-r bg-white overflow-y-auto">
      <ChatBox />
    </div>

    <div className="w-full md:w-[65%] overflow-y-auto bg-gray-50/50">
      <Itinerary />
    </div>
  </div>
  );
}

export default CreateTripPage;