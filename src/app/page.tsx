"use client";

import React, { useState, useMemo } from "react";
import {
  InvestmentParams,
  calculateCompoundInterest,
  formatCurrency,
  ContributionFrequency,
  CompoundFrequency,
  CurrencyCode,
  PresetScenario,
} from "@/utils/compound-interest";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { BreakdownTable } from "@/components/ui/breakdown-table";
import { TargetGoalModal } from "@/components/ui/target-goal-modal";
import { ScenarioPresets } from "@/components/ui/scenario-presets";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  RefreshCw,
  Target,
  Sparkles,
  HelpCircle,
  Share2,
  Check,
  ShieldCheck,
  ArrowUpRight,
  Sliders,
  PieChart,
} from "lucide-react";

export default function CompoundCalculatorPage() {
  // Main calculation inputs state
  const [initialCapital, setInitialCapital] = useState<number>(50_000);
  const [periodicContribution, setPeriodicContribution] = useState<number>(3_500);
  const [contributionFrequency, setContributionFrequency] = useState<ContributionFrequency>("mensual");
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(10.5);
  const [years, setYears] = useState<number>(15);
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundFrequency>(12);
  const [annualInflationRate, setAnnualInflationRate] = useState<number>(4.0);
  const [currency, setCurrency] = useState<CurrencyCode>("MXN");

  // UI state
  const [activePresetId, setActivePresetId] = useState<string | null>("cetes");
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Recalculate projection live on every input change
  const results = useMemo(() => {
    return calculateCompoundInterest({
      initialCapital,
      periodicContribution,
      contributionFrequency,
      annualInterestRate,
      years,
      compoundFrequency,
      annualInflationRate,
      currency,
    });
  }, [
    initialCapital,
    periodicContribution,
    contributionFrequency,
    annualInterestRate,
    years,
    compoundFrequency,
    annualInflationRate,
    currency,
  ]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetScenario) => {
    setActivePresetId(preset.id);
    setAnnualInterestRate(preset.defaultRate);
    setCompoundFrequency(preset.compoundFrequency);
  };

  // Handle Target Goal Plan Applied
  const handleApplyTargetPlan = (plan: {
    initial: number;
    contribution: number;
    rate: number;
    years: number;
  }) => {
    setInitialCapital(plan.initial);
    setPeriodicContribution(plan.contribution);
    setContributionFrequency("mensual");
    setAnnualInterestRate(plan.rate);
    setYears(plan.years);
    setActivePresetId(null);
  };

  // Quick years presets
  const quickYears = [5, 10, 15, 20, 25, 30];

  // The Rule of 72: Years to double money
  const yearsToDouble = annualInterestRate > 0 ? Number((72 / annualInterestRate).toFixed(1)) : 0;

  // Percentage breakdown of final balance
  const interestPct = results.finalBalance > 0
    ? Math.round((results.totalInterest / results.finalBalance) * 100)
    : 0;
  const principalPct = 100 - interestPct;

  // Share calculation summary snapshot
  const handleShare = () => {
    const text = `Proyección de Interés Compuesto en Cúmulo:
• Saldo Final: ${formatCurrency(results.finalBalance, currency)}
• Intereses Ganados: ${formatCurrency(results.totalInterest, currency)} (${interestPct}%)
• Capital Aportado: ${formatCurrency(results.totalInvested, currency)}
• Tasa: ${annualInterestRate}% a ${years} años.
Multiplicador: ${results.wealthMultiplier}x`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#f1f5f9] font-sans noise-texture flex flex-col justify-between">
      
      {/* 1. TOP NAVIGATION & HEADER */}
      <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#080a0f] rounded-[10px] flex items-center justify-center text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-wider text-white">
                  CÚMULO
                </span>
                <span className="text-[9px] font-mono uppercase bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold tracking-wider">
                  COMPOUND ENGINE
                </span>
              </div>
              <p className="text-[10px] text-white/50 font-mono hidden sm:block">
                Proyección Patrimonial & Multiplicador de Riqueza Exponencial
              </p>
            </div>
          </div>

          {/* Currency Switcher & Goal Action */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 text-xs font-mono">
              {(["MXN", "USD", "EUR"] as CurrencyCode[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    currency === cur
                      ? "bg-emerald-500 text-black font-bold shadow-xs"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Target className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Definir Meta</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Copiar resumen al portapapeles"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* Preset Benchmark Portfolios Bar */}
        <ScenarioPresets
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* 4 PRIMARY IMPACT KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Final Balance */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-[#0e131a] to-[#0e131a] border border-emerald-500/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -z-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300 block font-bold">
              Saldo Final Proyectado
            </span>
            <div className="mt-2">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {formatCurrency(results.finalBalance, currency)}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/50">Poder real (inflación):</span>
              <span className="text-emerald-400 font-bold">
                {formatCurrency(results.realFinalBalance, currency)}
              </span>
            </div>
          </div>

          {/* Card 2: Interest Earned */}
          <div className="p-6 rounded-3xl bg-[#0e131a] border border-white/10 shadow-xl relative">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block font-bold flex items-center justify-between">
              <span>Interés Ganado (Ganancia Neta)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                {interestPct}% del total
              </span>
            </span>
            <div className="mt-2">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-emerald-400 tracking-tight">
                +{formatCurrency(results.totalInterest, currency)}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Dinero creado por el tiempo:</span>
              <span className="text-white font-medium">Efecto bola de nieve</span>
            </div>
          </div>

          {/* Card 3: Total Invested Out of Pocket */}
          <div className="p-6 rounded-3xl bg-[#0e131a] border border-white/10 shadow-xl relative">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 block font-bold flex items-center justify-between">
              <span>Total Invertido de tu Bolsillo</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                {principalPct}% del total
              </span>
            </span>
            <div className="mt-2">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-200 tracking-tight">
                {formatCurrency(results.totalInvested, currency)}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Capital inicial + {years * (contributionFrequency === "quincenal" ? 24 : contributionFrequency === "mensual" ? 12 : 1)} aportes</span>
            </div>
          </div>

          {/* Card 4: Wealth Multiplier & Monthly Passive Income */}
          <div className="p-6 rounded-3xl bg-[#0e131a] border border-white/10 shadow-xl relative">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 block font-bold flex items-center justify-between">
              <span>Multiplicador de Riqueza</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {results.wealthMultiplier}x tu dinero
              </span>
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-amber-400 tracking-tight">
                {results.wealthMultiplier}x
              </span>
              <span className="text-xs font-mono text-white/50">
                retorno total
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/50">Renta pasiva estimada:</span>
              <span className="text-amber-300 font-bold">
                {formatCurrency(results.monthlyPassiveIncome, currency)}/mes
              </span>
            </div>
          </div>

        </div>

        {/* 3. SPLIT WORKSPACE: CONTROLS (Left 5 cols) & CHARTS/VISUALS (Right 7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: SLIDERS & CONTROLS DASHBOARD */}
          <div className="lg:col-span-5 bg-[#0e131a] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <h3 className="font-serif text-lg text-white font-normal">
                  Variables de Inversión
                </h3>
              </div>
              <button
                onClick={() => {
                  setInitialCapital(50_000);
                  setPeriodicContribution(3_500);
                  setAnnualInterestRate(10.5);
                  setYears(15);
                  setCompoundFrequency(12);
                  setAnnualInflationRate(4.0);
                  setActivePresetId("cetes");
                }}
                className="text-[11px] font-mono text-white/40 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Restablecer</span>
              </button>
            </div>

            {/* CONTROL 1: Capital Inicial */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white/70">
                  Capital Inicial
                </label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/15 px-3 py-1 rounded-xl text-xs font-mono font-bold text-white">
                  <span>$</span>
                  <input
                    type="number"
                    min={0}
                    step={5_000}
                    value={initialCapital}
                    onChange={(e) => {
                      setInitialCapital(Math.max(0, Number(e.target.value)));
                      setActivePresetId(null);
                    }}
                    className="w-24 bg-transparent text-right focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={1_000_000}
                step={5_000}
                value={initialCapital}
                onChange={(e) => {
                  setInitialCapital(Number(e.target.value));
                  setActivePresetId(null);
                }}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>$0</span>
                <span>$500k</span>
                <span>$1M+</span>
              </div>
            </div>

            {/* CONTROL 2: Aportación Periódica & Frecuencia */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white/70">
                  Aportación Regular
                </label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/15 px-3 py-1 rounded-xl text-xs font-mono font-bold text-cyan-400">
                  <span>$</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={periodicContribution}
                    onChange={(e) => {
                      setPeriodicContribution(Math.max(0, Number(e.target.value)));
                      setActivePresetId(null);
                    }}
                    className="w-20 bg-transparent text-right focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={50_000}
                step={250}
                value={periodicContribution}
                onChange={(e) => {
                  setPeriodicContribution(Number(e.target.value));
                  setActivePresetId(null);
                }}
                className="w-full cursor-pointer"
              />
              
              {/* Contribution Frequency Pills */}
              <div className="flex gap-1.5 pt-1">
                {(["quincenal", "mensual", "anual"] as ContributionFrequency[]).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setContributionFrequency(freq)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-mono capitalize transition-colors cursor-pointer ${
                      contributionFrequency === freq
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                        : "bg-white/5 text-white/60 hover:text-white border border-transparent"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTROL 3: Tasa de Interés Anual */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white/70">
                  Tasa de Rendimiento Anual
                </label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/15 px-3 py-1 rounded-xl text-xs font-mono font-bold text-emerald-400">
                  <input
                    type="number"
                    min={0.1}
                    max={40}
                    step={0.1}
                    value={annualInterestRate}
                    onChange={(e) => {
                      setAnnualInterestRate(Number(e.target.value));
                      setActivePresetId(null);
                    }}
                    className="w-16 bg-transparent text-right focus:outline-none"
                  />
                  <span>%</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.25}
                value={annualInterestRate}
                onChange={(e) => {
                  setAnnualInterestRate(Number(e.target.value));
                  setActivePresetId(null);
                }}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>1%</span>
                <span>10% (S&P/Cetes)</span>
                <span>20%</span>
                <span>30%</span>
              </div>
            </div>

            {/* CONTROL 4: Plazo en Años */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white/70">
                  Plazo de Inversión
                </label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/15 px-3 py-1 rounded-xl text-xs font-mono font-bold text-white">
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={years}
                    onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value))))}
                    className="w-12 bg-transparent text-right focus:outline-none"
                  />
                  <span className="text-white/40">años</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              
              {/* Quick Year Selection Pills */}
              <div className="flex gap-1.5 pt-1">
                {quickYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setYears(yr)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                      years === yr
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                        : "bg-white/5 text-white/60 hover:text-white border border-transparent"
                    }`}
                  >
                    {yr}a
                  </button>
                ))}
              </div>
            </div>

            {/* CONTROL 5: Capitalización & Inflación */}
            <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-white/60 block">
                  Capitalización
                </label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => {
                    setCompoundFrequency(Number(e.target.value) as CompoundFrequency);
                    setActivePresetId(null);
                  }}
                  className="w-full px-2.5 py-1.5 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value={365} className="bg-[#0e131a] text-white">Diaria (365/año)</option>
                  <option value={12} className="bg-[#0e131a] text-white">Mensual (12/año)</option>
                  <option value={4} className="bg-[#0e131a] text-white">Trimestral (4/año)</option>
                  <option value={2} className="bg-[#0e131a] text-white">Semestral (2/año)</option>
                  <option value={1} className="bg-[#0e131a] text-white">Anual (1/año)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-white/60 block">
                  Inflación Anual (%)
                </label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-mono text-white">
                  <input
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={annualInflationRate}
                    onChange={(e) => setAnnualInflationRate(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  <span className="text-white/40">%</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: INTERACTIVE DYNAMIC CHART (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <ChartAreaInteractive
              breakdown={results.breakdown}
              initialCapital={initialCapital}
              currency={currency}
              crossoverYear={results.crossoverYear}
            />

            {/* MILESTONE INSIGHTS STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  La Regla del 72
                </span>
                <p className="text-xs font-mono text-white/80">
                  Al <strong className="text-emerald-400">{annualInterestRate}%</strong> anual, tu capital se duplica automáticamente cada <strong className="text-white">{yearsToDouble} años</strong> sin necesidad de aportar más.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Punto de Inflexión Financiera
                </span>
                <p className="text-xs font-mono text-white/80">
                  {results.crossoverYear ? (
                    <>
                      En el <strong className="text-cyan-400">Año {results.crossoverYear}</strong>, los intereses generados superan todo el dinero que depositaste de tu bolsillo.
                    </>
                  ) : (
                    <>
                      Aumenta el plazo o la tasa para ver el año donde el interés supera tus aportaciones acumuladas.
                    </>
                  )}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* 4. YEAR-BY-YEAR TABULAR PROJECTION WITH CSV EXPORT */}
        <BreakdownTable
          breakdown={results.breakdown}
          currency={currency}
          crossoverYear={results.crossoverYear}
          firstMillionYear={results.firstMillionYear}
        />

        {/* 5. EDUCATIONAL FINANCIAL INTELLIGENCE */}
        <div className="bg-[#0e131a] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-emerald-400" />
            <h3 className="font-serif text-xl text-white font-normal">
              Principios Clave del Interés Compuesto
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs font-mono text-white/60 leading-relaxed">
            <div className="space-y-1.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">
                1. El Tiempo es tu Mayor Activo
              </h4>
              <p>
                El interés compuesto genera una curva parabólica. En los primeros 5 años los rendimientos parecen lentos, pero a partir del año 10 el crecimiento de los intereses supera con creces cualquier aportación individual.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-cyan-400">
                2. Frecuencia de Reinversión
              </h4>
              <p>
                Entre más frecuente sea la capitalización (mensual o diaria vs. anual), más rápido tus propios intereses generan nuevos intereses sobre sí mismos, acelerando el valor futuro acumulado.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                3. Descontar la Inflación
              </h4>
              <p>
                Tener $10,000,000 en 25 años no comprará lo mismo que hoy. Por eso calculamos el saldo real ajustado por inflación, permitiéndote tomar decisiones patrimoniales basadas en poder adquisitivo tangible.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* 6. TARGET GOAL MODAL */}
      <TargetGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currency={currency}
        onApplyPlan={handleApplyTargetPlan}
      />

      {/* 7. FOOTER */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-8 text-center text-xs font-mono text-white/40 space-y-2">
        <p className="font-semibold text-white/60">
          CÚMULO — Motor de Inteligencia Financiera & Interés Compuesto
        </p>
        <p className="text-[11px]">
          Fórmulas matemáticas de matemática financiera exacta basadas en anualidades ordinarias y valor futuro discreto.
        </p>
      </footer>

    </div>
  );
}
