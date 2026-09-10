import React, { useState } from 'react';

interface PaperBurnCardProps {
  name: string;
  role: string;
  img: string;
  onClick?: () => void;
  className?: string;
}

export const PaperBurnCard: React.FC<PaperBurnCardProps> = ({
  name,
  role,
  img,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative aspect-[3/4] w-full cursor-pointer overflow-hidden select-none group transition-all duration-300 bg-[#050505] border ${
        isHovered ? 'border-[#ff4d16] shadow-[0_0_35px_rgba(255,77,22,0.3)]' : 'border-white/10'
      } ${className}`}
    >
      {/* Photo Container with subtle zoom and grayscale/color transition */}
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={img}
          alt={name}
          loading="lazy"
          className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
            isHovered
              ? 'filter-none scale-105 brightness-100 contrast-105'
              : 'filter grayscale contrast-110 brightness-90 scale-100'
          }`}
        />

        {/* Ambient Dark Gradient for readability */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.6) 40%, rgba(5, 5, 5, 0.05) 70%, transparent 100%)'
          }}
        />

        {/* Ember Edge / Fire Glow on Hover */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(255, 77, 22, 0.22) 0%, transparent 70%)',
            boxShadow: 'inset 0 0 40px rgba(255, 77, 22, 0.15)'
          }}
        />
      </div>

      {/* Top-Right Corner Icon (4 orange dots) */}
      <div className="p-3 absolute top-0 right-0 z-10">
        <div className="grid grid-cols-2 gap-1 w-3 h-3">
          <div className="bg-[#ff4d16] w-1 h-1 shadow-[0_0_4px_#ff4d16]" />
          <div className="bg-[#ff4d16] w-1 h-1 shadow-[0_0_4px_#ff4d16]" />
          <div className="bg-[#ff4d16] w-1 h-1 shadow-[0_0_4px_#ff4d16]" />
          <div className="bg-[#ff4d16] w-1 h-1 shadow-[0_0_4px_#ff4d16]" />
        </div>
      </div>

      {/* Top Left Status Corner Marker */}
      <div className="p-3 absolute top-0 left-0 z-10">
        <span className="text-[9px] font-mono text-stone-500 tracking-widest uppercase block">
          &lt;TEAM&gt;
        </span>
      </div>

      {/* Bottom Label Container */}
      <div 
        className={`absolute bottom-0 inset-x-0 p-5 border-t border-white/10 backdrop-blur-md transition-all duration-300 ${
          isHovered ? 'bg-[#ff4d16]/10 border-[#ff4d16]/40' : 'bg-[#050505]/85'
        }`}
      >
        <h4 
          className={`text-base font-bold font-mono tracking-wider uppercase transition-colors duration-300 ${
            isHovered ? 'text-[#ff4d16]' : 'text-white'
          }`}
        >
          {name}
        </h4>
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase mt-1">
          {role}
        </p>
      </div>

      {/* Crosshair accents on corners */}
      <span className="absolute top-1.5 left-1.5 text-stone-700 text-[9px] font-mono select-none pointer-events-none">+</span>
      <span className="absolute bottom-1.5 right-1.5 text-stone-700 text-[9px] font-mono select-none pointer-events-none">+</span>
    </div>
  );
};

export default PaperBurnCard;
