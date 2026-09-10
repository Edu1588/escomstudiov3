import React from 'react';

interface LiquidImageProps {
  src: string;
  className?: string;
  alt?: string;
}

export default function LiquidImage({ src, className = "", alt = "" }: LiquidImageProps) {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img loading="lazy" 
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
