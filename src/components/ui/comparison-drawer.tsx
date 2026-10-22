"use client";

import React, { useState, useMemo } from "react";
import {
  InvestmentParams,
  calculateCompoundInterest,
  formatCurrency,
  CurrencyCode,
} from "@/utils/compound-interest";
import {
  GitCompare,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Sliders,
  X,
} from "lucide-react";

interface ComparatorProps {
  baseParams: InvestmentParams;
  currency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
}

export function ComparisonDrawer({
  baseParams,
  currency,
  isOpen,
  onClose,
}: ComparatorProps) {
  // Scenario B inputs
  const [rateB, setRateB] = useState<number>(() => Number((baseParams.annualInterestRate + 2).toFixed(1)));
  const [contributionB, setContributionB] = useState<number>(() => baseParams.periodicContribution + 1_500);

  // Recalculate Scenario A and Scenario B
  const resultsA = useMemo(() => calculateCompoundInterest(baseParams), [baseParams]);
  const resultsB = useMemo(
    () =>
      calculateCompoundInterest({
        ...baseParams,
        annualInterestRate: rateB,
        periodicContribution: contributionB,
      }),
    [baseParams, rateB, contributionB]
  );

  if (!isOpen) return null;

  const diffBalance = resultsB.finalBalance - resultsA.finalBalance;
  const diffPercent = resultsA.finalBalance > 0
    ? Math.round((diffBalance / resultsA.finalBalance) * 100)
    : 0;

  const diffInterest = resultsB.totalInterest - resultsA.totalInterest;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-slate-900 tracking-tight">
                Comparador Multi-Escenario (A vs B)
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Evalúa el impacto de aumentar tu tasa de rendimiento o tu aportación periódica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="py-6 space-y-6 overflow-y-auto pr-1">
          {/* Controls for Scenario B */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-800 font-bold block">
              Ajustar Variables para el Escenario Alternativo (B)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tasa B */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700 font-medium">Tasa de Rendimiento Anual (B):</span>
                  <span className="font-bold text-sky-700">{rateB}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={rateB}
                  onChange={(e) => setRateB(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Aportación B */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700 font-medium">Aportación Periódica (B):</span>
                  <span className="font-bold text-sky-700">
                    {formatCurrency(contributionB, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={50_000}
                  step={500}
                  value={contributionB}
                  onChange={(e) => setContributionB(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario A Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                  Escenario A (Actual)
                </span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  {baseParams.annualInterestRate}% • {formatCurrency(baseParams.periodicContribution, currency)}/{baseParams.contributionFrequency}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 block">Saldo Final Proyectado</span>
                <span className="font-mono text-3xl font-bold text-slate-900">
                  {formatCurrency(resultsA.finalBalance, currency)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 block">Interés Ganado:</span>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(resultsA.totalInterest, currency)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 block">Multiplicador:</span>
                  <span className="font-bold text-amber-800">
                    {resultsA.wealthMultiplier}x
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario B Card */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
                <span className="text-xs font-mono font-bold text-sky-900 uppercase tracking-wider">
                  Escenario B (Optimizado)
                </span>
                <span className="text-[11px] font-mono text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full font-medium">
                  {rateB}% • {formatCurrency(contributionB, currency)}/{baseParams.contributionFrequency}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-sky-700 block font-medium">Saldo Final Proyectado</span>
                <span className="font-mono text-3xl font-bold text-sky-900">
                  {formatCurrency(resultsB.finalBalance, currency)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white border border-sky-200/60">
                  <span className="text-[10px] text-sky-700 block">Interés Ganado:</span>
                  <span className="font-bold text-sky-900">
                    {formatCurrency(resultsB.totalInterest, currency)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200/60">
                  <span className="text-[10px] text-amber-800 block">Multiplicador:</span>
                  <span className="font-bold text-amber-800">
                    {resultsB.wealthMultiplier}x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Differential Impact Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-800 font-bold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                Ganancia Neta Adicional del Escenario B
              </span>
              <p className="text-sm font-mono text-slate-900">
                Diferencia total a tu favor:{" "}
                <strong className="text-emerald-700 text-lg">
                  +{formatCurrency(diffBalance, currency)}
                </strong>{" "}
                ({diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`})
              </p>
              <p className="text-xs font-mono text-slate-500">
                Intereses extras acumulados: +{formatCurrency(diffInterest, currency)}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono text-slate-500 block">Renta pasiva mensual extra:</span>
              <span className="font-mono text-lg font-bold text-amber-800">
                +{formatCurrency(resultsB.monthlyPassiveIncome - resultsA.monthlyPassiveIncome, currency)}/mes
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md shadow-emerald-600/20"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
