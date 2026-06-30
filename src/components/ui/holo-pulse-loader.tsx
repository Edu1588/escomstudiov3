'use client'
import React from 'react'
import { PlusIcon } from 'lucide-react'

export function HoloPulse() {
  const [dots, setDots] = React.useState('')

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='w-full flex flex-col justify-center items-center gap-4 mt-6'>
      {/* Compact Mini-Hologram Loader */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#00d1ff]/10 blur-xl rounded-full scale-150 animate-pulse" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="absolute w-[1px] h-16 bg-[#00d1ff]" />
            <div className="absolute w-16 h-[1px] bg-[#00d1ff]" />
        </div>

        {/* Main Ring System */}
        <div className="relative p-2 border border-dashed border-[#00d1ff]/20 rounded-full animate-[spin_2s_linear_infinite]">
            
            <div className="w-14 h-14 border border-dashed border-[#00d1ff]/40 rounded-full flex justify-center items-center animate-[spin_1.2s_linear_infinite_reverse]">
                <div className="relative z-10 p-1 bg-background rounded-full border border-[#00d1ff]/30 shadow-[0_0_15px_-5px_#00d1ff]">
                    <PlusIcon size={16} className="text-[#00d1ff] animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
            </div>
            
            {/* 4 Orbiting Dots at Cardinal Points */}
            {/* Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00d1ff] rounded-full shadow-[0_0_8px_#00d1ff]" />
            {/* Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-[#00d1ff] rounded-full shadow-[0_0_8px_#00d1ff]" />
            {/* Left */}
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00d1ff] rounded-full shadow-[0_0_8px_#00d1ff]" />
            {/* Right */}
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00d1ff] rounded-full shadow-[0_0_8px_#00d1ff]" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-[10px] font-mono tracking-[0.3em] text-[#00d1ff] uppercase">
          Loading{dots}
        </p>
      </div>
    </div>
  )
}
