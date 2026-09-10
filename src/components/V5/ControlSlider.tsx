import React from 'react';

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export default function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue = (v) => v.toString()
}: ControlSliderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] uppercase tracking-[2px] text-[#8B8578] font-mono">
          {label}
        </label>
        <span className="text-[10px] font-mono text-[#F0EDE6]">
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none focus:outline-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #ff4d16 ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.1) ${(value - min) / (max - min) * 100}%)`
        }}
      />
    </div>
  );
}
