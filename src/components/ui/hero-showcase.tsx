"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Compass, Zap, Target, TrendingUp, Layers, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { NumberTicker } from "./number-ticker";
import { BorderBeam } from "./border-beam";
import { ShimmerButton } from "./shimmer-button";
import { CurrencyCode, formatCurrency } from "@/utils/compound-interest";

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

/**
 * HeroShowcase (Editorial Light Theme standard)
 * 3 distinct visual architectures, light chromatic palettes, and rich typography.
 */
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
          <Layers className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-slate-900">Explorador de Dirección Visual:</span>
          <span className="text-slate-500 hidden md:inline">
            (3 arquitecturas de fondo, jerarquía y atmósfera cromática)
          </span>
        </div>

        {/* 3 Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveVariant("aurora")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeVariant === "aurora"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-600/20"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>1. Aurora Seda</span>
          </button>

          <button
            onClick={() => setActiveVariant("swiss")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeVariant === "swiss"
                ? "bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold shadow-md shadow-sky-600/20"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>2. Topografía Suiza</span>
          </button>

          <button
            onClick={() => setActiveVariant("quantum")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeVariant === "quantum"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-md shadow-amber-600/20"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>3. Haz Solar</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VARIANTE 1: AURORA SEDA (Luminous Mesh & Kinetic Grid) */}
      {/* ============================================================== */}
      {activeVariant === "aurora" && (
        <div className="relative rounded-3xl border border-emerald-200/90 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-xl shadow-emerald-950/[0.04] transition-all duration-500">
          {/* Layer 1: Multi-chromatic Mesh Field */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f2faf5] via-[#faf8f4] to-[#f0f9ff] -z-20" />
          <div className="absolute top-[-30%] left-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-400/15 blur-[120px] pointer-events-none animate-pulse-slow -z-10" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-300/15 blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-[20%] right-[25%] w-[400px] h-[400px] rounded-full bg-sky-300/15 blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-[30%] w-[350px] h-[350px] rounded-full bg-amber-300/15 blur-[110px] pointer-events-none -z-10" />

          {/* Layer 2: Geometric Grid Pattern with Radial Gradient Mask */}
          <div 
            className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-40 -z-10"
            style={{
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-4xl space-y-6">
            {/* Pill Badge & Visual Artwork Indicator */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-mono font-medium shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                <span className="font-bold tracking-wider uppercase">Motor de Crecimiento Compuesto</span>
                <span className="text-emerald-400">•</span>
                <span className="text-emerald-800">Rendimiento continuo 2026</span>
              </div>

              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/90 border border-emerald-200 text-slate-800 text-xs font-mono shadow-xs">
                <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-emerald-300">
                  <Image
                    src="/images/compound-growth-sculpture.jpg"
                    alt="Escultura Exponencial"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[11px] font-semibold text-emerald-900">Escultura 3D Activa</span>
              </div>
            </div>

            {/* Monumental Swiss Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-[-0.05em] leading-[1.05]">
              El tiempo como{" "}
              <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                multiplicador
              </span>{" "}
              exponencial de tu patrimonio.
            </h1>

            {/* Dynamic Editorial Takeaway Narrative */}
            <p className="text-base sm:text-lg font-mono text-slate-700 max-w-2xl leading-relaxed">
              En <strong className="text-slate-950 font-bold">{years} años</strong> de reinversión disciplinada, tu capital alcanzará{" "}
              <span className="text-emerald-700 font-bold underline decoration-emerald-500/40">
                {formatCurrency(finalBalance, currency)}
              </span>
              . El <strong className="text-sky-800 font-bold">{interestPct}%</strong> del monto final será ganancia pura creada por la bola de nieve del interés sobre interés.
            </p>

            {/* Micro-metrics Live Horizon */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
                <span className="text-slate-500">Multiplicador:</span>
                <span className="text-amber-800 font-bold text-sm sm:text-base">
                  {wealthMultiplier}x tu dinero
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
                <span className="text-slate-500">Tasa Anual Simulada:</span>
                <span className="text-emerald-700 font-bold text-sm sm:text-base">
                  {annualInterestRate}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShimmerButton
                  onClick={onOpenTargetModal}
                  className="text-xs text-white"
                  background="linear-gradient(135deg, #059669 0%, #0d9488 100%)"
                >
                  <Target className="h-3.5 w-3.5 text-white" />
                  <span className="text-white font-bold">Calcular Meta Personal</span>
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
        <div className="relative rounded-3xl border border-sky-200/90 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-900/[0.04] transition-all duration-500">
          {/* Layer 1: Swiss Alabaster Gradient Field */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] -z-20" />
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none -z-10" />

          {/* Layer 2: Vectorial Topographic Elevation Contours (SVG Waves) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25 pointer-events-none -z-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
          >
            <path d="M 0,100 Q 250,50 500,120 T 1000,80" fill="none" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M 0,160 Q 250,90 500,180 T 1000,140" fill="none" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M 0,220 Q 250,140 500,240 T 1000,200" fill="none" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M 0,280 Q 250,190 500,300 T 1000,260" fill="none" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M 0,340 Q 250,240 500,360 T 1000,320" fill="none" stroke="#0284c7" strokeWidth="1.2" />
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
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white font-bold bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
                  ÍNDICE PATRIMONIAL INSTITUCIONAL
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  MATEMÁTICA DISCRETA
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-serif text-slate-950 tracking-tight leading-[1.08]">
                Arquitectura del Capital{" "}
                <span className="italic font-normal text-sky-800">
                  Compuesto
                </span>
                .
              </h1>

              <p className="text-sm sm:text-base font-mono text-slate-700 max-w-xl leading-relaxed">
                Diseñado bajo estándares de banca privada internacional y modelos de preservación de poder adquisitivo real ante la inflación.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onOpenCompareModal}
                  className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-sky-700/20"
                >
                  <Compass className="h-4 w-4" />
                  <span>Comparar Escenarios A/B</span>
                </button>

                <button
                  onClick={onOpenTargetModal}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-mono text-xs uppercase tracking-wider transition-all border border-slate-300 cursor-pointer shadow-xs font-semibold"
                >
                  Planificar Meta
                </button>
              </div>
            </div>

            {/* Right 5 cols: Architectural Financial Monolith Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white/95 border border-sky-300 shadow-2xl shadow-sky-950/[0.08] relative">
              <BorderBeam size={180} duration={10} colorFrom="#0284c7" colorTo="#059669" />
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-sky-200 shadow-xs shrink-0">
                    <Image
                      src="/images/wealth-compass.jpg"
                      alt="Brújula Patrimonial"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sky-800 uppercase tracking-wider font-bold">Proyección a {years} Años</span>
                </div>
                <span className="text-emerald-700 font-bold">+{interestPct}% Rendimiento</span>
              </div>

              <div className="py-4 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest block font-medium">
                  Patrimonio Neto Estimado
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                  $<NumberTicker value={finalBalance} />
                </div>
                <span className="text-xs font-mono text-sky-800 block font-semibold">
                  Interés puro: +${totalInterest.toLocaleString()} {currency}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Inversión Propia:</span>
                  <span className="text-slate-900 font-bold">${totalInvested.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Factor Multiplicador:</span>
                  <span className="text-amber-800 font-bold">{wealthMultiplier}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VARIANTE 3: HAZ SOLAR & TERMINAL AEROESPACIAL */}
      {/* ============================================================== */}
      {activeVariant === "quantum" && (
        <div className="relative rounded-3xl border border-amber-200/90 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-xl shadow-amber-950/[0.04] transition-all duration-500 text-center flex flex-col items-center">
          {/* Layer 1: Warm Radiant Silk */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#fffdf5] via-[#fef9c3]/30 to-[#fed7aa]/20 -z-20" />

          {/* Layer 2: Overhead God Ray (Conic Overhead Spotlight) */}
          <div 
            className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] pointer-events-none -z-10 opacity-30"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent 40%, rgba(245, 158, 11, 0.45) 50%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />

          {/* Layer 3: Central Radial Flash Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-400/15 via-orange-300/10 to-transparent blur-[80px] pointer-events-none -z-10" />

          {/* Layer 4: Dense Dot Matrix Field */}
          <div 
            className="absolute inset-0 bg-dot-matrix opacity-35 pointer-events-none -z-10"
            style={{
              maskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 80%)",
            }}
          />

          {/* Content: High Impact Centered Terminal */}
          <div className="relative z-10 max-w-3xl space-y-5 flex flex-col items-center">
            {/* Visual Icon Art */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl shadow-amber-500/20">
              <Image
                src="/images/exponential-tree.jpg"
                alt="Árbol Fractal de la Riqueza"
                fill
                className="object-cover"
              />
            </div>

            {/* Aerospace Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
              <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
              <span>Velocidad de Interés Compuesto • Modo Turbo</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-[-0.06em] leading-[1.02]">
              Multiplica tu capital hasta{" "}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                {wealthMultiplier}x
              </span>{" "}
              en {years} años.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-mono text-slate-700 max-w-xl leading-relaxed">
              La aceleración de rendimientos reinvertidos sobrepasa la velocidad del ahorro tradicional. Proyecta tu libertad financiera con precisión matemática.
            </p>

            {/* Live Numerical Telemetry Strip */}
            <div className="p-4 rounded-2xl bg-white/95 border border-amber-200/90 shadow-xl shadow-amber-950/[0.04] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-2xl">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-medium">Saldo Final</span>
                <span className="text-base sm:text-xl font-mono font-bold text-slate-950">
                  ${(finalBalance / 1_000_000).toFixed(2)}M
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-800 uppercase block font-bold">Interés Ganado</span>
                <span className="text-base sm:text-xl font-mono font-bold text-amber-700">
                  +{interestPct}%
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-medium">Aportes Propios</span>
                <span className="text-base sm:text-xl font-mono font-bold text-slate-900">
                  ${(totalInvested / 1_000).toFixed(0)}k
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-orange-800 uppercase block font-bold">Renta Pasiva</span>
                <span className="text-base sm:text-xl font-mono font-bold text-orange-700">
                  ${Math.round((finalBalance * 0.05) / 12).toLocaleString()}/m
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <ShimmerButton
                onClick={onOpenTargetModal}
                shimmerColor="#f59e0b"
                background="linear-gradient(135deg, #d97706 0%, #b45309 100%)"
                className="text-white font-bold"
              >
                <Flame className="h-4 w-4 text-white" />
                <span className="text-white">Simular Retiro Anticipado</span>
              </ShimmerButton>

              <button
                onClick={onOpenCompareModal}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider transition-all border border-slate-300 cursor-pointer shadow-xs"
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
