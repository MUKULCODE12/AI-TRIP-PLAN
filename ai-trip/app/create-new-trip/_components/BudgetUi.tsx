'use client'
import { BudgetOption } from "@/types/trip";
import React from "react";

export const SelectBudgetOptions: BudgetOption[] = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💵",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on average side",
    icon: "👌",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don’t worry about cost",
    icon: "💎",
    color: "bg-purple-100 text-purple-600",
  },
];

function BudgetUi({ onSelectedOption }: { onSelectedOption: (option: string) => void }) {
  return (
    <div className="mt-3">
      {/* Fixed grid-cols-2 typo */}
      <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
        {SelectBudgetOptions.map((item, index) => (
          <div 
            key={index} 
            className='p-4 border rounded-2xl bg-white hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col items-start'
            onClick={() => onSelectedOption(item.title)}
          >
            <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${item.color}`}>
              {item.icon}
            </div>
            <h2 className="text-md font-bold mt-3 text-gray-800">{item.title}</h2>
            <p className="text-xs text-gray-500 leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetUi;