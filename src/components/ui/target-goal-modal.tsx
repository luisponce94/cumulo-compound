"use client";

import React, { useState } from "react";
import {
  calculateRequiredMonthlyContribution,
  formatCurrency,
  CurrencyCode,
} from "@/utils/compound-interest";
import { Target, X, Calculator, ArrowRight, Sparkles, Check } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onApplyPlan: (params: {
    initial: number;
    contribution: number;
    rate: number;
    years: number;
  }) => void;
}

export function TargetGoalModal({
  isOpen,
  onClose,
  currency,
  onApplyPlan,
}: ModalProps) {
  const [targetGoal, setTargetGoal] = useState<number>(1_000_000);
  const [initialCapital, setInitialCapital] = useState<number>(20_000);
  const [annualRate, setAnnualRate] = useState<number>(10);
  const [targetYears, setTargetYears] = useState<number>(10);

  if (!isOpen) return null;

  const requiredMonthly = calculateRequiredMonthlyContribution(
    targetGoal,
    initialCapital,
    annualRate,
    targetYears,
    12
  );

  const totalOutOfPocket = initialCapital + requiredMonthly * targetYears * 12;
  const interestContribution = Math.max(targetGoal - totalOutOfPocket, 0);
  const interestPercentage = targetGoal > 0 ? Math.round((interestContribution / targetGoal) * 100) : 0;

  const handleApply = () => {
    onApplyPlan({
      initial: initialCapital,
      contribution: requiredMonthly,
      rate: annualRate,
      years: targetYears,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        
        {/* Glow ambiance */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -z-0" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 relative z-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-800 font-bold flex items-center gap-1.5">
              <Target className="h-3 w-3" />
              Calculadora Inversa de Metas
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-slate-900 tracking-tight mt-0.5">
              ¿Cuánto necesitas aportar para tu meta?
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Define tu objetivo financiero y el algoritmo calculará tu aportación mensual exacta.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input Parameters Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <label className="text-[11px] font-mono text-slate-700 block font-medium">
              Meta Patrimonial Deseada
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-slate-400">$</span>
              <input
                type="number"
                min={10_000}
                step={50_000}
                value={targetGoal}
                onChange={(e) => setTargetGoal(Number(e.target.value))}
                className="w-full bg-transparent font-mono text-lg font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold block">
              {formatCurrency(targetGoal, currency)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <label className="text-[11px] font-mono text-slate-700 block font-medium">
              Capital Inicial Disponible
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-slate-400">$</span>
              <input
                type="number"
                min={0}
                step={5_000}
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full bg-transparent font-mono text-lg font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 block">
              {formatCurrency(initialCapital, currency)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <label className="text-[11px] font-mono text-slate-700 block font-medium">
              Plazo para Lograrlo (Años)
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={targetYears}
              onChange={(e) => setTargetYears(Number(e.target.value))}
              className="w-full bg-transparent font-mono text-lg font-bold text-slate-900 focus:outline-none"
            />
            <span className="text-[10px] font-mono text-slate-500 block">
              {targetYears} años ({targetYears * 12} mensualidades)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <label className="text-[11px] font-mono text-slate-700 block font-medium">
              Tasa de Rendimiento Anual (%)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              step={0.5}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full bg-transparent font-mono text-lg font-bold text-emerald-700 focus:outline-none"
            />
            <span className="text-[10px] font-mono text-emerald-700 block font-medium">
              {annualRate}% anual estimado
            </span>
          </div>

        </div>

        {/* Calculated Result Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-300 space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 block font-bold">
                Aportación Mensual Requerida
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-950">
                {formatCurrency(requiredMonthly, currency)} / mes
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono text-slate-500 block">Interés que te regala el mercado</span>
              <span className="text-sm font-mono font-bold text-emerald-700">
                {interestPercentage}% del total ({formatCurrency(interestContribution, currency)})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 font-mono leading-relaxed pt-1 border-t border-emerald-200">
            De los {formatCurrency(targetGoal, currency)} finales, tú solo habrás aportado {formatCurrency(totalOutOfPocket, currency)}. El resto ({formatCurrency(interestContribution, currency)}) se genera por el poder del interés compuesto.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 relative z-10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-mono text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <span>Cargar Este Plan en la Calculadora</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
