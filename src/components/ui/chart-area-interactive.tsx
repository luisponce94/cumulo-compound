"use client";

import React, { useState } from "react";
import { YearlyBreakdown, formatCurrency, CurrencyCode } from "@/utils/compound-interest";
import { TrendingUp, Layers, BarChart2, Sparkles, ShieldCheck } from "lucide-react";

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
  const [adjustInflation, setAdjustInflation] = useState<boolean>(false);

  if (!breakdown || breakdown.length === 0) return null;

  const width = 800;
  const height = 340;
  const padLeft = 70;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const maxBalance = Math.max(
    ...breakdown.map((d) => (adjustInflation ? d.realEndBalance : d.endBalance)),
    1
  );
  const yearsCount = breakdown.length;

  // Scale helpers
  const getX = (idx: number) => padLeft + (idx / Math.max(yearsCount - 1, 1)) * chartWidth;
  const getY = (val: number) => padTop + chartHeight - (val / maxBalance) * chartHeight;

  // Paths generation for Area Chart
  const totalPoints = breakdown.map((d, i) =>
    `${getX(i)},${getY(adjustInflation ? d.realEndBalance : d.endBalance)}`
  );
  const contribPoints = breakdown.map((d, i) => `${getX(i)},${getY(d.cumulativeContribution)}`);
  const initialPoints = breakdown.map((_, i) => `${getX(i)},${getY(initialCapital)}`);

  // Area: Interest (between Total and Contributions)
  const interestAreaD = [
    `M ${getX(0)},${getY(adjustInflation ? breakdown[0].realEndBalance : breakdown[0].endBalance)}`,
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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xl shadow-slate-900/[0.03] relative overflow-hidden flex flex-col justify-between">
      {/* Background glow gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header controls & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-800 font-bold flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Curva de Proyección Temporal
            </span>
            {crossoverYear && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-bold">
                <Sparkles className="h-2.5 w-2.5" />
                Inflexión: Año {crossoverYear}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-slate-900 tracking-tight mt-0.5">
            Evolución del Patrimonio & Multiplicador Exponencial
          </h3>
        </div>

        {/* Chart View Switcher & Inflation Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Inflation Toggle */}
          <button
            onClick={() => setAdjustInflation(!adjustInflation)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
              adjustInflation
                ? "bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-xs"
                : "border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{adjustInflation ? "Poder Real (Inflación Activa)" : "Nominal"}</span>
          </button>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartType === "area"
                  ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Área Acumulada</span>
            </button>
            <button
              onClick={() => setChartType("bars")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartType === "bars"
                  ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Barras Anuales</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Active Point HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 relative z-10">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-mono text-slate-500 block">Punto Inspeccionado</span>
          <span className="text-sm font-mono font-bold text-slate-900">
            Año {activePoint.year}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-mono text-emerald-800 block flex items-center gap-1 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Saldo Final {adjustInflation ? "(Poder Real)" : "(Nominal)"}
          </span>
          <span className="text-sm sm:text-base font-mono font-bold text-slate-900">
            {formatCurrency(adjustInflation ? activePoint.realEndBalance : activePoint.endBalance, currency)}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
          <span className="text-[10px] font-mono text-sky-800 block flex items-center gap-1 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
            Intereses Ganados
          </span>
          <span className="text-sm sm:text-base font-mono font-bold text-sky-800">
            +{formatCurrency(activePoint.cumulativeInterest, currency)}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-mono text-slate-500 block flex items-center gap-1 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            Total Aportado
          </span>
          <span className="text-sm sm:text-base font-mono font-bold text-slate-800">
            {formatCurrency(activePoint.cumulativeContribution, currency)}
          </span>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="w-full aspect-[16/8] sm:aspect-[16/7] relative z-10 select-none touch-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
          onTouchStart={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const pct = Math.max(0, Math.min(1, touchX / rect.width));
            setHoverIndex(Math.min(yearsCount - 1, Math.max(0, Math.round(pct * (yearsCount - 1)))));
          }}
          onTouchMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const pct = Math.max(0, Math.min(1, touchX / rect.width));
            setHoverIndex(Math.min(yearsCount - 1, Math.max(0, Math.round(pct * (yearsCount - 1)))));
          }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.04" />
            </linearGradient>

            <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.04" />
            </linearGradient>

            <linearGradient id="initialGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.03" />
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
                stroke="rgba(15, 23, 42, 0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 10}
                y={t.y + 4}
                textAnchor="end"
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(15, 23, 42, 0.55)"
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
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={getX(crossoverYear - 1)}
                y={padTop - 8}
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fill="#059669"
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

              {/* Clean Lines */}
              <path
                d={`M ${totalPoints.join(" L ")}`}
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${contribPoints.join(" L ")}`}
                fill="none"
                stroke="#0284c7"
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

                const val = adjustInflation ? d.realEndBalance : d.endBalance;
                const hTotal = (val / maxBalance) * chartHeight;
                const hInvested = (d.cumulativeContribution / maxBalance) * chartHeight;
                const hInterest = Math.max(hTotal - hInvested, 0);

                const yTop = padTop + chartHeight - hTotal;
                const yContrib = padTop + chartHeight - Math.min(hInvested, hTotal);

                return (
                  <g key={i}>
                    {/* Invested Bar Segment */}
                    <rect
                      x={xPos}
                      y={yContrib}
                      width={barWidth}
                      height={Math.max(Math.min(hInvested, hTotal), 0)}
                      fill="#0284c7"
                      opacity="0.85"
                      rx="2"
                    />
                    {/* Interest Bar Segment */}
                    <rect
                      x={xPos}
                      y={yTop}
                      width={barWidth}
                      height={Math.max(hInterest, 0)}
                      fill="#059669"
                      opacity="0.95"
                      rx="2"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* X Axis Labels (Years) */}
          {breakdown.map((d, i) => {
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
                fill="rgba(15, 23, 42, 0.55)"
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
                stroke="#0f172a"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.4"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(adjustInflation ? breakdown[hoverIndex].realEndBalance : breakdown[hoverIndex].endBalance)}
                r="6"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="2.5"
                filter="drop-shadow(0 2px 6px rgba(5, 150, 105, 0.4))"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-600 shadow-xs shadow-emerald-600/30" />
            <span className="text-slate-700 font-medium">Interés Compuesto Generado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-600" />
            <span className="text-slate-700 font-medium">Tus Aportaciones Periódicas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-400" />
            <span className="text-slate-700 font-medium">Capital Inicial</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-500">
          Desliza el cursor sobre el gráfico para ver el valor exacto de cada año.
        </span>
      </div>
    </div>
  );
}
