"use client";

import React, { useState } from "react";
import { formatCurrency, CurrencyCode } from "@/utils/compound-interest";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Layers,
  Zap,
  Activity,
  Flame,
  Globe,
  Sliders,
  Target,
} from "lucide-react";

export type HeroVariant = "aurora" | "swiss" | "quantum";

interface HeroShowcaseProps {
  finalBalance: number;
  totalInterest: number;
  totalInvested: number;
  wealthMultiplier: number;
  interestPct: number;
  years: number;
  annualInterestRate: number;
  currency: CurrencyCode;
  onOpenTargetModal: () => void;
  onOpenCompareModal: () => void;
}

export function HeroShowcase({
  finalBalance,
  totalInterest,
  totalInvested,
  wealthMultiplier,
  interestPct,
  years,
  annualInterestRate,
  currency,
  onOpenTargetModal,
  onOpenCompareModal,
}: HeroShowcaseProps) {
  const [activeVariant, setActiveVariant] = useState<HeroVariant>("aurora");

  return (
    <section className="relative w-full space-y-4">
      {/* 0. INTERACTIVE VARIANT SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-mono text-white/70">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-white">Explorador de Dirección Visual:</span>
          <span className="text-white/40 hidden md:inline">
            (3 arquitecturas de fondo, jerarquía y atmósfera cromática)
          </span>
        </div>

        {/* 3 Pills */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveVariant("aurora")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeVariant === "aurora"
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold shadow-lg shadow-emerald-500/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>1. Aurora Mesh</span>
          </button>

          <button
            onClick={() => setActiveVariant("swiss")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeVariant === "swiss"
                ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>2. Topografía Suiza</span>
          </button>

          <button
            onClick={() => setActiveVariant("quantum")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeVariant === "quantum"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold shadow-lg shadow-amber-500/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>3. Haz Cuántico</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VARIANTE 1: AURORA PATRIMONIAL (Luminous Mesh & Kinetic Grid) */}
      {/* ============================================================== */}
      {activeVariant === "aurora" && (
        <div className="relative rounded-3xl border border-emerald-500/30 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-500">
          {/* Layer 1: Multi-chromatic Mesh Field */}
          <div className="absolute inset-0 bg-[#06090e] -z-20" />
          <div className="absolute top-[-30%] left-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-500/25 blur-[120px] pointer-events-none animate-pulse-slow -z-10" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-[20%] right-[25%] w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-[30%] w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[110px] pointer-events-none -z-10" />

          {/* Layer 2: Geometric Grid Pattern with Radial Gradient Mask */}
          <div 
            className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-40 -z-10"
            style={{
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
            }}
          />

          {/* Layer 3: Noise & Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080a0f]/80 pointer-events-none -z-10" />

          {/* Content */}
          <div className="relative z-10 max-w-4xl space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold tracking-wider uppercase">Motor de Crecimiento Compuesto</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-200">Rendimiento continuo 2026</span>
            </div>

            {/* Monumental Swiss Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-[-0.05em] leading-[1.05]">
              El tiempo como{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                multiplicador
              </span>{" "}
              exponencial de tu patrimonio.
            </h1>

            {/* Dynamic Editorial Takeaway Narrative */}
            <p className="text-base sm:text-lg font-mono text-white/70 max-w-2xl leading-relaxed">
              En <strong className="text-white font-bold">{years} años</strong> de reinversión disciplinada, tu capital alcanzará{" "}
              <span className="text-emerald-300 font-bold underline decoration-emerald-400/40">
                {formatCurrency(finalBalance, currency)}
              </span>
              . El <strong className="text-cyan-300 font-bold">{interestPct}%</strong> del monto final será ganancia pura creada por la bola de nieve del interés sobre interés.
            </p>

            {/* Micro-metrics Live Horizon */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <span className="text-white/50">Multiplicador:</span>
                <span className="text-amber-300 font-bold text-sm sm:text-base">
                  {wealthMultiplier}x tu dinero
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <span className="text-white/50">Tasa Anual Simulada:</span>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">
                  {annualInterestRate}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShimmerButton onClick={onOpenTargetModal} className="text-xs">
                  <Target className="h-3.5 w-3.5" />
                  <span>Calcular Meta Personal</span>
                </ShimmerButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VARIANTE 2: MONOLITO SUIZO & TOPOGRAFÍA VECTORIAL */}
      {/* ============================================================== */}
      {activeVariant === "swiss" && (
        <div className="relative rounded-3xl border border-sky-500/30 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-500">
          {/* Layer 1: Ceramic Cobalt Gradient Field */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#071329] via-[#091b3a] to-[#040813] -z-20" />
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none -z-10" />

          {/* Layer 2: Vectorial Topographic Elevation Contours (SVG Waves) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none -z-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
          >
            <path d="M 0,100 Q 250,50 500,120 T 1000,80" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M 0,160 Q 250,90 500,180 T 1000,140" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M 0,220 Q 250,140 500,240 T 1000,200" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M 0,280 Q 250,190 500,300 T 1000,260" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M 0,340 Q 250,240 500,360 T 1000,320" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
          </svg>

          {/* Layer 3: Fine Dot Matrix Grid */}
          <div 
            className="absolute inset-0 bg-dot-matrix opacity-25 pointer-events-none -z-10"
            style={{
              maskImage: "linear-gradient(to right, black 50%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 50%, transparent 100%)",
            }}
          />

          {/* Content: Asymmetric Split Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Editorial Monumental Typography */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-sky-400 font-bold bg-sky-950/60 border border-sky-500/30 px-3 py-1 rounded-md">
                  ÍNDICE PATRIMONIAL INSTITUCIONAL
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  MATEMÁTICA DISCRETA
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.08]">
                Arquitectura del Capital{" "}
                <span className="italic font-normal text-sky-300">
                  Compuesto
                </span>
                .
              </h1>

              <p className="text-sm sm:text-base font-mono text-slate-300 max-w-xl leading-relaxed">
                Diseñado bajo estándares de banca privada internacional y modelos de preservación de poder adquisitivo real ante la inflación.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onOpenCompareModal}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <Compass className="h-4 w-4" />
                  <span>Comparar Escenarios A/B</span>
                </button>

                <button
                  onClick={onOpenTargetModal}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all border border-white/15 cursor-pointer"
                >
                  Planificar Meta
                </button>
              </div>
            </div>

            {/* Right 5 cols: Architectural Financial Monolith Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-sky-400/30 backdrop-blur-xl shadow-2xl relative">
              <BorderBeam size={180} duration={10} colorFrom="#38bdf8" colorTo="#818cf8" />
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <span className="text-sky-300 uppercase tracking-wider font-semibold">Proyección a {years} Años</span>
                <span className="text-emerald-400 font-bold">+{interestPct}% Rendimiento</span>
              </div>

              <div className="py-4 space-y-1">
                <span className="text-[10px] font-mono uppercase text-white/50 tracking-widest block">
                  Patrimonio Neto Estimado
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  $<NumberTicker value={finalBalance} />
                </div>
                <span className="text-xs font-mono text-sky-400/90 block">
                  Interés puro: +${totalInterest.toLocaleString()} {currency}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-black/30">
                  <span className="text-white/40 block">Inversión Propia:</span>
                  <span className="text-white font-semibold">${totalInvested.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-lg bg-black/30">
                  <span className="text-white/40 block">Factor Multiplicador:</span>
                  <span className="text-amber-400 font-bold">{wealthMultiplier}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VARIANTE 3: HAZ CUÁNTICO & TERMINAL AEROESPACIAL */}
      {/* ============================================================== */}
      {activeVariant === "quantum" && (
        <div className="relative rounded-3xl border border-amber-500/30 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-500 text-center flex flex-col items-center">
          {/* Layer 1: Deep Obsidian Vacuum */}
          <div className="absolute inset-0 bg-[#050608] -z-20" />

          {/* Layer 2: Overhead God Ray (Conic Overhead Spotlight) */}
          <div 
            className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] pointer-events-none -z-10 opacity-30"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent 40%, rgba(245, 158, 11, 0.4) 50%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />

          {/* Layer 3: Central Radial Flash Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-[80px] pointer-events-none -z-10" />

          {/* Layer 4: Dense Dot Matrix Field */}
          <div 
            className="absolute inset-0 bg-dot-matrix opacity-35 pointer-events-none -z-10"
            style={{
              maskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 80%)",
            }}
          />

          {/* Content: High Impact Centered Terminal */}
          <div className="relative z-10 max-w-3xl space-y-6 flex flex-col items-center">
            {/* Aerospace Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase shadow-md shadow-amber-500/10">
              <Zap className="h-3.5 w-3.5 fill-amber-400" />
              <span>Velocidad de Interés Compuesto • Modo Turbo</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-[-0.06em] leading-[1.02]">
              Multiplica tu capital hasta{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-500 bg-clip-text text-transparent">
                {wealthMultiplier}x
              </span>{" "}
              en {years} años.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-mono text-white/70 max-w-xl leading-relaxed">
              La aceleración de rendimientos reinvertidos sobrepasa la velocidad del ahorro tradicional. Proyecta tu libertad financiera con precisión matemática.
            </p>

            {/* Live Numerical Telemetry Strip */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-2xl">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Saldo Final</span>
                <span className="text-base sm:text-xl font-mono font-bold text-white">
                  ${(finalBalance / 1_000_000).toFixed(2)}M
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase block">Interés Ganado</span>
                <span className="text-base sm:text-xl font-mono font-bold text-amber-300">
                  +{interestPct}%
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Aportes Propios</span>
                <span className="text-base sm:text-xl font-mono font-bold text-slate-300">
                  ${(totalInvested / 1_000).toFixed(0)}k
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-orange-400 uppercase block">Renta Pasiva</span>
                <span className="text-base sm:text-xl font-mono font-bold text-orange-300">
                  ${Math.round((finalBalance * 0.05) / 12).toLocaleString()}/m
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <ShimmerButton
                onClick={onOpenTargetModal}
                shimmerColor="#f59e0b"
                background="radial-gradient(ellipse 80% 50% at 50% 120%, rgba(245, 158, 11, 0.8), rgba(8, 10, 15, 0.95))"
              >
                <Flame className="h-4 w-4" />
                <span>Simular Retiro Anticipado</span>
              </ShimmerButton>

              <button
                onClick={onOpenCompareModal}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/15 cursor-pointer"
              >
                Comparar Tasas de Retorno
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
