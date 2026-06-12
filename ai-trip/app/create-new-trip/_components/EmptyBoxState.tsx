import { suggestions } from "@/app/_components/Hero";
import React from "react";

function EmptyBoxState({ onSelectOption }: { onSelectOption: (option: string) => void }) {
  return (
    <div className="mt-7 px-4">
      <h2 className="font-bold text-2xl text-center">
        Start planning new{" "}
        <span className="text-primary">Trip</span> using AI
      </h2>

      <p className="text-center text-gray-400 mt-2 max-w-2xl mx-auto">
        From choosing destinations to crafting detailed itineraries, our AI
        helps you plan trips faster and smarter. Travel planning made simple,
        personalized, and effortless.
      </p>

      {/* Suggestions */}
      <div className="flex flex-col gap-4 mt-8 max-w-xl mx-auto">
        {suggestions.map((item, index) => (
          <div key={index}
            onClick={()=>onSelectOption(item.title)}
            className="
              flex items-center gap-3
              border rounded-xl p-4
              cursor-pointer
              transition-all
              hover:border-primary
  
              hover:text-primary
            "
          >
            <span className="text-xl">{item.icon}</span>
            <h2 className="text-lg font-medium">{item.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmptyBoxState;
