'use client'
import { Button } from '@/components/ui/button'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export const suggestions = [
  { title: 'Create New Trip', icon: '🌐' },
  { title: 'Suggest me some good places to visit', icon: '📍' },
  { title: 'Discover hidden gems', icon: '💎' },
  { title: 'Adventure Destination', icon: '🏔️' }
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();
  const [userInput, setUserInput] = useState('');

  const onSend = (text?: string) => {
    const promptValue = text || userInput;
    if (!user) return router.push('/sign-in');

    if (promptValue.trim()) {
      // ✅ Always pass the prompt via URL
      router.push(`/create-new-trip?prompt=${encodeURIComponent(promptValue)}`);
    } else {
      router.push('/create-new-trip');
    }
  }

  return (
    <div className="mt-24 w-full flex justify-center px-5">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Hey! I'm Your Personal <span className="text-primary">Trip Planner</span>
        </h1>
        <div className='border-2 shadow-lg rounded-2xl p-4 relative bg-white'>
          <Textarea
            placeholder="Where do you want to go?"
            className="w-full h-28 rounded-xl border-none text-lg focus-visible:ring-0 resize-none p-2"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />
          <Button size={'icon'} className='absolute bottom-6 right-6 rounded-full w-12 h-12' onClick={() => onSend()}>
            <Send className='h-5 w-5' />
          </Button>
        </div>
        <div className='flex flex-wrap justify-center gap-3 mt-6'>
          {suggestions.map((item, index) => (
            <div 
              key={index} 
              onClick={() => onSend(item.title)} // ✅ Pass specific suggestion text
              className='flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-50 transition-all shadow-sm'
            >
              <span className="text-sm font-medium text-gray-700">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Hero;