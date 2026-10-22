"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { CompositionDonut } from "@/components/ui/composition-donut";
import { FireCalculatorCard } from "@/components/ui/fire-calculator-card";
import { ComparisonDrawer } from "@/components/ui/comparison-drawer";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { GaugeMeter } from "@/components/ui/gauge-meter";
import { EngineeringHarness } from "@/components/ui/engineering-harness";
import { HeroShowcase } from "@/components/ui/hero-showcase";
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
  GitCompare,
  Flame,
  Plus,
  Cpu,
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
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showHarness, setShowHarness] = useState(false);

  // URL Query Sync on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    const m = params.get("m");
    const r = params.get("r");
    const y = params.get("y");
    const cur = params.get("cur") as CurrencyCode | null;

    if (c) setInitialCapital(Number(c));
    if (m) setPeriodicContribution(Number(m));
    if (r) setAnnualInterestRate(Number(r));
    if (y) setYears(Number(y));
    if (cur && ["MXN", "USD", "EUR"].includes(cur)) setCurrency(cur);
  }, []);

  // Sync state to URL without refreshing
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    params.set("c", initialCapital.toString());
    params.set("m", periodicContribution.toString());
    params.set("r", annualInterestRate.toString());
    params.set("y", years.toString());
    params.set("cur", currency);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }, [initialCapital, periodicContribution, annualInterestRate, years, currency]);

  // Current calculation params
  const currentParams: InvestmentParams = useMemo(
    () => ({
      initialCapital,
      periodicContribution,
      contributionFrequency,
      annualInterestRate,
      years,
      compoundFrequency,
      annualInflationRate,
      currency,
    }),
    [
      initialCapital,
      periodicContribution,
      contributionFrequency,
      annualInterestRate,
      years,
      compoundFrequency,
      annualInflationRate,
      currency,
    ]
  );

  // Recalculate projection live on every input change
  const results = useMemo(() => {
    return calculateCompoundInterest(currentParams);
  }, [currentParams]);

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
    const text = `Proyección Patrimonial en Cúmulo:
• Saldo Final: ${formatCurrency(results.finalBalance, currency)}
• Intereses Ganados: ${formatCurrency(results.totalInterest, currency)} (${interestPct}% del total)
• Capital Aportado: ${formatCurrency(results.totalInvested, currency)}
• Tasa: ${annualInterestRate}% a ${years} años
• Multiplicador: ${results.wealthMultiplier}x
${window.location.href}`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#f1f5f9] font-sans noise-texture flex flex-col justify-between">
      
      {/* 1. TOP NAVIGATION & HEADER */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
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
                  21ST EDITION
                </span>
              </div>
              <p className="text-[10px] text-white/50 font-mono hidden sm:block">
                Proyección Patrimonial & Harness de Ingeniería Financiera
              </p>
            </div>
          </div>

          {/* Currency Switcher & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
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

            {/* Toggle Engineering Harness */}
            <button
              onClick={() => setShowHarness(!showHarness)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                showHarness
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Eval Harness</span>
            </button>

            {/* A/B Comparator Toggle Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-3 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Comparar A/B</span>
            </button>

            {/* Shimmer Button Target Goal */}
            <ShimmerButton
              onClick={() => setIsGoalModalOpen(true)}
              className="py-1.5 px-3.5 text-xs text-black"
              background="radial-gradient(ellipse 80% 50% at 50% 120%, rgba(16, 185, 129, 0.9), rgba(6, 182, 212, 0.95))"
            >
              <Target className="h-3.5 w-3.5 text-black" />
              <span className="text-black font-bold">Definir Meta</span>
            </ShimmerButton>

            {/* Share Snapshot */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Copiar enlace con parámetros al portapapeles"
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

        {/* HERO SHOWCASE (3 EXPLORATORY DIRECTIONS - ATMOSPHERIC LAYERED DESIGN) */}
        <HeroShowcase
          finalBalance={results.finalBalance}
          totalInterest={results.totalInterest}
          totalInvested={results.totalInvested}
          wealthMultiplier={results.wealthMultiplier}
          interestPct={interestPct}
          years={years}
          annualInterestRate={annualInterestRate}
          currency={currency}
          onOpenTargetModal={() => setIsGoalModalOpen(true)}
          onOpenCompareModal={() => setIsCompareOpen(true)}
        />

        {/* 4 PRIMARY IMPACT KPI CARDS (Enhanced with 21st Spotlight & BorderBeam) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Final Balance with BorderBeam */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-[#0e131a] to-[#0e131a] border border-emerald-500/40 shadow-xl relative overflow-hidden">
            <BorderBeam size={250} duration={8} colorFrom="#10b981" colorTo="#34d399" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300 block font-bold">
              Saldo Final Proyectado
            </span>
            <div className="mt-2 font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              $<NumberTicker value={results.finalBalance} />
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/50">Poder real (inflación):</span>
              <span className="text-emerald-400 font-bold">
                ${results.realFinalBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 2: Interest Earned */}
          <SpotlightCard className="p-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block font-bold flex items-center justify-between">
              <span>Interés Ganado (Ganancia)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {interestPct}% del total
              </span>
            </span>
            <div className="mt-2 font-mono text-3xl sm:text-4xl font-bold text-emerald-400 tracking-tight">
              +$<NumberTicker value={results.totalInterest} />
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Efecto bola de nieve:</span>
              <span className="text-white font-medium">Dinero generado</span>
            </div>
          </SpotlightCard>

          {/* Card 3: Total Invested Out of Pocket */}
          <SpotlightCard className="p-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 block font-bold flex items-center justify-between">
              <span>Total Invertido Propio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                {principalPct}% del total
              </span>
            </span>
            <div className="mt-2 font-mono text-3xl sm:text-4xl font-bold text-slate-200 tracking-tight">
              $<NumberTicker value={results.totalInvested} />
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Ahorro de tu bolsillo:</span>
              <span className="text-white font-medium">{years} años</span>
            </div>
          </SpotlightCard>

          {/* Card 4: Wealth Multiplier with GaugeMeter */}
          <SpotlightCard className="p-6 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 block font-bold flex items-center justify-between">
              <span>Velocidad de Riqueza</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {results.wealthMultiplier}x
              </span>
            </span>
            <div className="my-1 flex justify-center">
              <GaugeMeter value={results.wealthMultiplier} max={8} />
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/50">Renta pasiva:</span>
              <span className="text-amber-300 font-bold">
                ${results.monthlyPassiveIncome.toLocaleString()}/mes
              </span>
            </div>
          </SpotlightCard>

        </div>

        {/* OPTIONAL: HARNESS ENGINEERING PANEL */}
        {showHarness && (
          <EngineeringHarness currency={currency} />
        )}

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
              {/* Stepper Quick Increments */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <div className="flex gap-1.5">
                  {[10_000, 50_000, 100_000].map((step) => (
                    <button
                      key={step}
                      onClick={() => setInitialCapital((prev) => prev + step)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-0.5"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      ${step / 1000}k
                    </button>
                  ))}
                </div>
                <span>Máx $1M+</span>
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
              {/* Stepper Quick Increments */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <div className="flex gap-1.5">
                  {[500, 1_000, 2_500, 5_000].map((step) => (
                    <button
                      key={step}
                      onClick={() => setPeriodicContribution((prev) => prev + step)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-300/80 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-0.5"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      ${step}
                    </button>
                  ))}
                </div>
                <span>Máx $50k</span>
              </div>
              
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
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  La Regla del 72
                </span>
                <p className="text-xs font-mono text-white/80">
                  Al <strong className="text-emerald-400">{annualInterestRate}%</strong> anual, tu capital se duplica automáticamente cada <strong className="text-white">{yearsToDouble} años</strong> sin necesidad de aportar más.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
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

        {/* 4. VISUAL BENTO GRID: COMPOSITION DONUT & FIRE FREEDOM SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <CompositionDonut
            initialCapital={initialCapital}
            totalContributions={results.totalInvested - initialCapital}
            totalInterest={results.totalInterest}
            finalBalance={results.finalBalance}
            currency={currency}
          />

          <FireCalculatorCard
            finalBalance={results.finalBalance}
            breakdown={results.breakdown}
            currency={currency}
          />
        </div>

        {/* 5. YEAR-BY-YEAR TABULAR PROJECTION WITH CSV EXPORT */}
        <BreakdownTable
          breakdown={results.breakdown}
          currency={currency}
          crossoverYear={results.crossoverYear}
          firstMillionYear={results.firstMillionYear}
        />

        {/* 6. EDUCATIONAL FINANCIAL INTELLIGENCE */}
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

      {/* 7. TARGET GOAL MODAL */}
      <TargetGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currency={currency}
        onApplyPlan={handleApplyTargetPlan}
      />

      {/* 8. COMPARISON DRAWER (A/B SCENARIOS) */}
      <ComparisonDrawer
        baseParams={currentParams}
        currency={currency}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />

      {/* 9. FOOTER */}
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
