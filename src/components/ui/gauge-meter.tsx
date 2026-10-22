"use client";

import React from "react";

interface GaugeMeterProps {
  value: number; // e.g. 3.4 for 3.4x
  max?: number;
  label?: string;
  className?: string;
}

/**
 * GaugeMeter (21st.dev signature)
 * Semi-circular radial gauge for multiplier and financial velocity.
 */
export function GaugeMeter({
  value,
  max = 8,
  label = "Multiplicador de Riqueza",
  className = "",
}: GaugeMeterProps) {
  const clampedValue = Math.min(Math.max(value, 1), max);
  const percentage = (clampedValue - 1) / (max - 1); // 0 to 1

  // Semi-circle angles (-180 to 0 degrees)
  const angle = -180 + percentage * 180;

  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength * (1 - percentage);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-[150px] h-[85px] flex items-center justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${size} ${size / 2 + 10}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background track arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active colored arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Central Counter Display */}
        <div className="absolute bottom-0 text-center flex flex-col items-center">
          <span className="font-mono text-2xl font-black text-amber-300 tracking-tight leading-none">
            {value.toFixed(1)}x
          </span>
          <span className="text-[9px] font-mono uppercase text-white/40 tracking-wider mt-1">
            Retorno Total
          </span>
        </div>
      </div>
      <span className="text-[10px] font-mono text-white/50 text-center mt-1">
        {label}
      </span>
    </div>
  );
}
