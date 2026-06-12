'use client'
import React from 'react'

export const SelectTravelesList = [
  { id: 1, title: 'Just Me', desc: 'A sole traveler in exploration', icon: '✈️', people: '1' },
  { id: 2, title: 'A Couple', desc: 'Two travelers in tandem', icon: '🥂', people: '2 People' },
  { id: 3, title: 'Family', desc: 'A group of fun loving adventurers', icon: '🏡', people: '3 to 5 People' },
  { id: 4, title: 'Friends', desc: 'A bunch of thrill-seekers', icon: '🚩', people: '5 to 10 People' },
];

function GroupSizeUi({ onSelectedOption }: { onSelectedOption: (option: string) => void }) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-2'>
      {SelectTravelesList.map((item, index) => (
        <div 
          key={index} 
          className='p-4 border rounded-2xl bg-white hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center'
          onClick={() => onSelectedOption(`${item.title} (${item.people})`)}
        >
          <div className="text-3xl mb-2">{item.icon}</div>
          <h2 className="text-sm font-bold text-gray-800">{item.title}</h2>
          <p className="text-[10px] text-gray-400 mt-1">{item.people}</p>
        </div>
      ))}
    </div>
  )
}

export default GroupSizeUi