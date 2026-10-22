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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b0e14] border border-white/15 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-white tracking-tight">
                Comparador Multi-Escenario (A vs B)
              </h3>
              <p className="text-xs font-mono text-white/50">
                Evalúa el impacto de aumentar tu tasa de rendimiento o tu aportación periódica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="py-6 space-y-6 overflow-y-auto pr-1">
          {/* Controls for Scenario B */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold block">
              Ajustar Variables para el Escenario Alternativo (B)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tasa B */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/70">Tasa de Rendimiento Anual (B):</span>
                  <span className="font-bold text-cyan-400">{rateB}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={rateB}
                  onChange={(e) => setRateB(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Aportación B */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/70">Aportación Periódica (B):</span>
                  <span className="font-bold text-cyan-400">
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
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario A Card */}
            <div className="p-5 rounded-2xl bg-[#0e131a] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-wider">
                  Escenario A (Actual)
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {baseParams.annualInterestRate}% • {formatCurrency(baseParams.periodicContribution, currency)}/{baseParams.contributionFrequency}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-white/50 block">Saldo Final Proyectado</span>
                <span className="font-mono text-3xl font-bold text-white">
                  {formatCurrency(resultsA.finalBalance, currency)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-white/40 block">Interés Ganado:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(resultsA.totalInterest, currency)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-white/40 block">Multiplicador:</span>
                  <span className="font-bold text-amber-400">
                    {resultsA.wealthMultiplier}x
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario B Card */}
            <div className="p-5 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Escenario B (Optimizado)
                </span>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-full">
                  {rateB}% • {formatCurrency(contributionB, currency)}/{baseParams.contributionFrequency}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyan-400/80 block">Saldo Final Proyectado</span>
                <span className="font-mono text-3xl font-bold text-cyan-300">
                  {formatCurrency(resultsB.finalBalance, currency)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-cyan-500/10">
                  <span className="text-[10px] text-cyan-400/60 block">Interés Ganado:</span>
                  <span className="font-bold text-cyan-300">
                    {formatCurrency(resultsB.totalInterest, currency)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-500/10">
                  <span className="text-[10px] text-cyan-400/60 block">Multiplicador:</span>
                  <span className="font-bold text-amber-300">
                    {resultsB.wealthMultiplier}x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Differential Impact Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#0e131a] to-cyan-500/15 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Ganancia Neta Adicional del Escenario B
              </span>
              <p className="text-sm font-mono text-white">
                Diferencia total a tu favor:{" "}
                <strong className="text-emerald-400 text-lg">
                  +{formatCurrency(diffBalance, currency)}
                </strong>{" "}
                ({diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`})
              </p>
              <p className="text-xs font-mono text-white/50">
                Intereses extras acumulados: +{formatCurrency(diffInterest, currency)}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono text-white/40 block">Renta pasiva mensual extra:</span>
              <span className="font-mono text-lg font-bold text-amber-400">
                +{formatCurrency(resultsB.monthlyPassiveIncome - resultsA.monthlyPassiveIncome, currency)}/mes
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
