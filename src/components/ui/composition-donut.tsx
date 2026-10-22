"use client";

import React, { useState } from "react";
import { formatCurrency, CurrencyCode } from "@/utils/compound-interest";
import { PieChart, Sparkles } from "lucide-react";

interface DonutProps {
  initialCapital: number;
  totalContributions: number; // excluding initial
  totalInterest: number;
  finalBalance: number;
  currency: CurrencyCode;
}

export function CompositionDonut({
  initialCapital,
  totalContributions,
  totalInterest,
  finalBalance,
  currency,
}: DonutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (finalBalance <= 0) return null;

  const data = [
    {
      label: "Interés Compuesto",
      shortLabel: "Interés Ganado",
      value: totalInterest,
      color: "#10b981", // Emerald
      bg: "bg-emerald-500",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      description: "Dinero multiplicado por el tiempo",
    },
    {
      label: "Aportaciones Periódicas",
      shortLabel: "Aportaciones",
      value: Math.max(totalContributions, 0),
      color: "#06b6d4", // Cyan
      bg: "bg-cyan-500",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      description: "Ahorro constante acumulado",
    },
    {
      label: "Capital Inicial",
      shortLabel: "Inicial",
      value: initialCapital,
      color: "#64748b", // Slate
      bg: "bg-slate-500",
      border: "border-slate-500/30",
      text: "text-slate-300",
      description: "Tu punto de partida",
    },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  // SVG Donut geometry
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const segments = data.map((item, idx) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += percent;

    return {
      ...item,
      percent: Math.round(percent),
      strokeDasharray,
      strokeDashoffset,
      index: idx,
    };
  });

  const activeItem = hoveredIndex !== null ? segments[hoveredIndex] : segments[0];

  return (
    <div className="bg-[#0e131a] rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-emerald-400" />
          <h3 className="font-serif text-lg text-white font-normal">
            Composición del Saldo
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
          {segments[0].percent}% generado por interés
        </span>
      </div>

      {/* Center Donut Graphic & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 my-auto">
        {/* SVG Graphic */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center shrink-0">
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={hoveredIndex === seg.index ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>

          {/* Central Counter Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
            <span className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
              {activeItem.shortLabel}
            </span>
            <span className="font-mono text-2xl font-extrabold text-white tracking-tight">
              {activeItem.percent}%
            </span>
            <span className={`text-[11px] font-mono font-bold ${activeItem.text}`}>
              {formatCurrency(activeItem.value, currency)}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-3 w-full max-w-[240px]">
          {segments.map((seg) => (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredIndex(seg.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                hoveredIndex === seg.index
                  ? `${seg.border} bg-white/[0.04] scale-[1.02]`
                  : "border-transparent hover:border-white/10 bg-white/[0.01]"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-white/80">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  {seg.label}
                </span>
                <span className={`font-bold ${seg.text}`}>{seg.percent}%</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-white/40 pl-4.5">
                <span>{formatCurrency(seg.value, currency)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Takeaway Banner */}
      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-200/90 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>
          Por cada $1.00 de tu bolsillo, el interés compuesto aporta{" "}
          <strong className="text-white">
            ${(totalInterest / Math.max(initialCapital + totalContributions, 1)).toFixed(2)}
          </strong>{" "}
          adicionales.
        </span>
      </div>
    </div>
  );
}
