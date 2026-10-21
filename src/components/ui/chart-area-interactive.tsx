"use client";

import React, { useState } from "react";
import { YearlyBreakdown, formatCurrency, CurrencyCode } from "@/utils/compound-interest";
import { TrendingUp, Layers, BarChart2, Sparkles } from "lucide-react";

interface ChartProps {
  breakdown: YearlyBreakdown[];
  initialCapital: number;
  currency: CurrencyCode;
  crossoverYear: number | null;
}

export function ChartAreaInteractive({
  breakdown,
  initialCapital,
  currency,
  crossoverYear,
}: ChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [chartType, setChartType] = useState<"area" | "bars">("area");

  if (!breakdown || breakdown.length === 0) return null;

  const width = 800;
  const height = 340;
  const padLeft = 70;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const maxBalance = Math.max(...breakdown.map((d) => d.endBalance), 1);
  const yearsCount = breakdown.length;

  // Scale helpers
  const getX = (idx: number) => padLeft + (idx / Math.max(yearsCount - 1, 1)) * chartWidth;
  const getY = (val: number) => padTop + chartHeight - (val / maxBalance) * chartHeight;

  // Paths generation for Area Chart
  // Total line (top of interest)
  const totalPoints = breakdown.map((d, i) => `${getX(i)},${getY(d.endBalance)}`);
  // Contribution line (principal + contributions)
  const contribPoints = breakdown.map((d, i) => `${getX(i)},${getY(d.cumulativeContribution)}`);
  // Initial capital line
  const initialPoints = breakdown.map((_, i) => `${getX(i)},${getY(initialCapital)}`);

  // Area: Interest (between Total and Contributions)
  const interestAreaD = [
    `M ${getX(0)},${getY(breakdown[0].endBalance)}`,
    ...totalPoints.slice(1).map((pt) => `L ${pt}`),
    ...contribPoints.slice().reverse().map((pt) => `L ${pt}`),
    "Z",
  ].join(" ");

  // Area: Contributions (between Contributions and Initial)
  const contribAreaD = [
    `M ${getX(0)},${getY(breakdown[0].cumulativeContribution)}`,
    ...contribPoints.slice(1).map((pt) => `L ${pt}`),
    ...initialPoints.slice().reverse().map((pt) => `L ${pt}`),
    "Z",
  ].join(" ");

  // Area: Initial capital (between Initial and Base 0)
  const initialAreaD = [
    `M ${getX(0)},${getY(initialCapital)}`,
    ...initialPoints.slice(1).map((pt) => `L ${pt}`),
    `L ${getX(yearsCount - 1)},${getY(0)}`,
    `L ${getX(0)},${getY(0)}`,
    "Z",
  ].join(" ");

  // Active hover data point
  const activePoint = hoverIndex !== null ? breakdown[hoverIndex] : breakdown[breakdown.length - 1];

  // Grid tick marks for Y axis
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    val: maxBalance * pct,
    y: padTop + chartHeight - pct * chartHeight,
  }));

  return (
    <div className="bg-[#0e131a] rounded-3xl border border-white/10 p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      
      {/* Background glow gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header controls & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Curva de Proyección Temporal
            </span>
            {crossoverYear && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" />
                Inflexión: Año {crossoverYear}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight mt-0.5">
            Evolución del Patrimonio & Interés Ganado
          </h3>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setChartType("area")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartType === "area"
                ? "bg-emerald-500 text-black font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Área Acumulada</span>
          </button>
          <button
            onClick={() => setChartType("bars")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartType === "bars"
                ? "bg-emerald-500 text-black font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Barras Anuales</span>
          </button>
        </div>
      </div>

      {/* Floating Active Point HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 relative z-10">
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[10px] font-mono text-white/50 block">Punto Inspeccionado</span>
          <span className="text-sm font-mono font-bold text-white">
            Año {activePoint.year}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <span className="text-[10px] font-mono text-emerald-400 block flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Saldo Final Estimado
          </span>
          <span className="text-sm sm:text-base font-mono font-bold text-white">
            {formatCurrency(activePoint.endBalance, currency)}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-[10px] font-mono text-cyan-400 block flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Intereses Ganados
          </span>
          <span className="text-sm sm:text-base font-mono font-bold text-cyan-300">
            {formatCurrency(activePoint.cumulativeInterest, currency)}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[10px] font-mono text-white/50 block flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Total Aportado
          </span>
          <span className="text-sm sm:text-base font-mono font-bold text-slate-200">
            {formatCurrency(activePoint.cumulativeContribution, currency)}
          </span>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="w-full aspect-[16/8] sm:aspect-[16/7] relative z-10 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="initialGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Y Axis labels */}
          {yTicks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={t.y}
                x2={width - padRight}
                y2={t.y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 10}
                y={t.y + 4}
                textAnchor="end"
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(255, 255, 255, 0.4)"
              >
                {t.val >= 1_000_000
                  ? `$${(t.val / 1_000_000).toFixed(1)}M`
                  : t.val >= 1_000
                  ? `$${(t.val / 1_000).toFixed(0)}k`
                  : `$${t.val.toFixed(0)}`}
              </text>
            </g>
          ))}

          {/* Crossover Milestone Vertical Indicator Line */}
          {crossoverYear && (
            <g>
              <line
                x1={getX(crossoverYear - 1)}
                y1={padTop}
                x2={getX(crossoverYear - 1)}
                y2={padTop + chartHeight}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={getX(crossoverYear - 1)}
                y={padTop - 8}
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fill="#10b981"
                fontWeight="bold"
              >
                ★ Inflexión
              </text>
            </g>
          )}

          {/* AREA CHART MODE */}
          {chartType === "area" && (
            <g>
              {/* Initial Capital Fill */}
              <path d={initialAreaD} fill="url(#initialGrad)" />

              {/* Contributions Fill */}
              <path d={contribAreaD} fill="url(#contribGrad)" />

              {/* Interest Fill */}
              <path d={interestAreaD} fill="url(#interestGrad)" />

              {/* Glowing Strokes */}
              <path
                d={`M ${totalPoints.join(" L ")}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${contribPoints.join(" L ")}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </g>
          )}

          {/* STACKED BARS MODE */}
          {chartType === "bars" && (
            <g>
              {breakdown.map((d, i) => {
                const barWidth = Math.max((chartWidth / yearsCount) * 0.7, 4);
                const xPos = getX(i) - barWidth / 2;

                const hTotal = ((d.endBalance) / maxBalance) * chartHeight;
                const hInvested = (d.cumulativeContribution / maxBalance) * chartHeight;
                const hInterest = hTotal - hInvested;

                const yTop = padTop + chartHeight - hTotal;
                const yContrib = padTop + chartHeight - hInvested;

                return (
                  <g key={i}>
                    {/* Invested Bar Segment */}
                    <rect
                      x={xPos}
                      y={yContrib}
                      width={barWidth}
                      height={Math.max(hInvested, 0)}
                      fill="#06b6d4"
                      opacity="0.8"
                      rx="2"
                    />
                    {/* Interest Bar Segment */}
                    <rect
                      x={xPos}
                      y={yTop}
                      width={barWidth}
                      height={Math.max(hInterest, 0)}
                      fill="#10b981"
                      opacity="0.9"
                      rx="2"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* X Axis Labels (Years) */}
          {breakdown.map((d, i) => {
            // Show every year if <= 10 years, every 2-5 years if longer
            const interval = yearsCount <= 10 ? 1 : yearsCount <= 20 ? 2 : 5;
            const isVisible = d.year === 1 || d.year % interval === 0 || d.year === yearsCount;

            if (!isVisible) return null;

            return (
              <text
                key={i}
                x={getX(i)}
                y={padTop + chartHeight + 20}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(255, 255, 255, 0.5)"
              >
                A{d.year}
              </text>
            );
          })}

          {/* Interactive Scrubbing Columns */}
          {breakdown.map((d, i) => {
            const colWidth = chartWidth / yearsCount;
            const xLeft = getX(i) - colWidth / 2;

            return (
              <rect
                key={i}
                x={xLeft}
                y={padTop}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}

          {/* Active Hover Guide & Dot */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padTop}
                x2={getX(hoverIndex)}
                y2={padTop + chartHeight}
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.5"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(breakdown[hoverIndex].endBalance)}
                r="6"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
                filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.9))"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
            <span className="text-white/80">Interés Compuesto Generado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-cyan-400" />
            <span className="text-white/80">Tus Aportaciones Periódicas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-500" />
            <span className="text-white/80">Capital Inicial</span>
          </div>
        </div>

        <span className="text-[11px] text-white/40">
          Desliza el cursor sobre el gráfico para ver el valor exacto de cada año.
        </span>
      </div>

    </div>
  );
}
