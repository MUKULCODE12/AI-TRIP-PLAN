'use client'
import React from "react";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalUiProps {
  viewTrip: () => void;
  disable?: boolean;
}

function FinalUi({ viewTrip, disable }: FinalUiProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-5 p-8 bg-white rounded-3xl border-2 border-dashed border-primary/20 text-center max-w-sm">
      
      <div className="bg-primary/10 p-4 rounded-full">
        <Globe2 className="text-primary w-10 h-10 animate-pulse" />
      </div>

      <h2 className="mt-4 text-xl font-bold text-gray-800">
        Ready to fly? ✈️
      </h2>

      <p className="text-gray-500 text-sm mt-2 px-4">
        I've gathered all your preferences. Ready to see your personalized itinerary?
      </p>

      <Button
        onClick={viewTrip}
        disabled={disable}
        className="mt-6 w-full rounded-full py-6 text-lg shadow-lg hover:shadow-primary/20 transition-all"
      >
        {disable ? "Generating Plan..." : "View My Trip"}
      </Button>
    </div>
  );
}

export default FinalUi;