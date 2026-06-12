import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Wallet, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

function HotelCardItem({hotel, index}: {hotel: any, index?: number}) {
  if (!hotel) return null;
  return (
    <div key={index} className='flex flex-col gap-1'>
      <Image src={`https://image.pollinations.ai/prompt/${encodeURIComponent(hotel?.name || hotel?.hotel_name || 'hotel lobby')}?width=400&height=200&nologo=true`} alt='place-image' width={400} height={200} unoptimized={true}
        className='rounded-xl shadow object-cover mb-2'
      />
      <h2 className='font-semibold text-lg'>{hotel?.name || hotel?.hotel_name}</h2>
      <h2 className='text-gray-500 line-clamp-2'>{hotel?.description || hotel?.hotel_address}</h2>
      <p className='flex gap-2 text-green-600'><Wallet />{hotel?.pricePerNight || hotel?.price_per_night}</p>
      <p className='text-yellow-500 flex gap-2'><Star /> {hotel?.rating}</p>
      <Link href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(hotel?.name || hotel?.hotel_name || '')} target='_blank'>
        <Button variant={'outline'} size='sm' className='w-full mt-2'>View on Map</Button>
      </Link>
    </div>
  )
}

export default HotelCardItem