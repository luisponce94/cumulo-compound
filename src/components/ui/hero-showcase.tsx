"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Compass, Zap, Target, TrendingUp, Layers, ArrowRight, ShieldCheck, Flame, Mountain } from "lucide-react";
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
  const [activeVariant, setActiveVariant] = useState<HeroVariant>("swiss");

  // Metáfora de altitud alpina basada en el multiplicador de riqueza
  // 1x = 550m (Base de valle), 2x = 1,450m (Plateau), 3.5x = 2,800m (Col Alpin), 5x+ = 4,478m (Matterhorn Peak)
  const alpineAltitude = Math.min(4478, Math.max(550, Math.round(550 + (wealthMultiplier - 1) * 980)));
  const alpineZone =
    alpineAltitude >= 4200
      ? "Cumbre Matterhorn (Soberanía Absoluta)"
      : alpineAltitude >= 3000
      ? "Zona Glaciar (Aceleración Parabólica)"
      : alpineAltitude >= 1800
      ? "Meseta de Capitalización Continua"
      : "Campamento Base (Ahorro Disciplinado)";

  return (
    <section className="relative w-full space-y-4">
      {/* 0. INTERACTIVE VARIANT SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
          <Layers className="h-4 w-4 text-sky-700" />
          <span className="font-semibold text-slate-900">Dirección Visual Activa:</span>
          <span className="text-slate-500 hidden md:inline">
            (Topografía Suiza Cartográfica de Alta Precisión)
          </span>
        </div>

        {/* 3 Pills con Topografía Suiza priorizada */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveVariant("swiss")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeVariant === "swiss"
                ? "bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white font-bold shadow-md shadow-sky-700/25 ring-1 ring-white/30"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>2. Topografía Suiza (Activo)</span>
          </button>

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
      {/* VARIANTE 2: MONOLITO SUIZO & TOPOGRAFÍA ALPINO-VECTORIAL */}
      {/* ============================================================== */}
      {activeVariant === "swiss" && (
        <div className="relative rounded-3xl border border-sky-300/80 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-900/[0.04] transition-all duration-500">
          {/* Layer 1: Swiss Glacial Alabaster Gradient Field */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f0f6fa] to-[#e4eef6] -z-20" />
          <div className="absolute top-[-25%] right-[-10%] w-[550px] h-[550px] rounded-full bg-sky-400/12 blur-[140px] pointer-events-none -z-10" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none -z-10" />

          {/* Layer 2: Authentic Swiss Topographic Elevation Contours (Swisstopo Isohypses) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35 pointer-events-none -z-10 select-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 480"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="swissContourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0369a1" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Geodetic Grid Crosses (Swiss Coordinates CH1903+) */}
            <g stroke="#64748b" strokeWidth="1" opacity="0.6">
              <path d="M 45 40 L 55 40 M 50 35 L 50 45" />
              <path d="M 345 40 L 355 40 M 350 35 L 350 45" />
              <path d="M 645 40 L 655 40 M 650 35 L 650 45" />
              <path d="M 945 40 L 955 40 M 950 35 L 950 45" />
              <path d="M 1145 40 L 1155 40 M 1150 35 L 1150 45" />
              <path d="M 45 440 L 55 440 M 50 435 L 50 445" />
              <path d="M 645 440 L 655 440 M 650 435 L 650 445" />
              <path d="M 1145 440 L 1155 440 M 1150 435 L 1150 445" />
            </g>

            {/* Swiss Alpine Isohypses (Curvas de Nivel con Desnivel de 20m) */}
            {/* Ligne 1: Base Valle +550m */}
            <path
              d="M 0 460 C 250 450, 450 470, 700 430 C 900 400, 1050 450, 1200 420"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="0.8"
            />
            {/* Ligne 2: +900m */}
            <path
              d="M 0 410 C 200 390, 480 430, 750 380 C 950 340, 1080 390, 1200 360"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4 4"
            />
            {/* Ligne 3: Master Contour +1'200m (Plateau d'Investissement) */}
            <path
              d="M 0 360 C 220 330, 500 370, 780 320 C 980 280, 1100 330, 1200 300"
              fill="none"
              stroke="url(#swissContourGrad)"
              strokeWidth="1.6"
            />
            <text x="70" y="352" fill="#0369a1" fontSize="9" fontFamily="monospace" fontWeight="700">
              1'200 m · PALIER DE CAPITAL INICIAL
            </text>

            {/* Ligne 4: +1'600m */}
            <path
              d="M 0 310 C 240 270, 520 320, 800 260 C 1000 220, 1120 270, 1200 240"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.9"
            />
            {/* Ligne 5: Master Contour +1'950m (Point d'Inflexion) */}
            <path
              d="M 0 260 C 260 210, 550 260, 830 200 C 1020 160, 1140 210, 1200 180"
              fill="none"
              stroke="url(#swissContourGrad)"
              strokeWidth="1.6"
            />
            <text x="320" y="222" fill="#0369a1" fontSize="9" fontFamily="monospace" fontWeight="700">
              1'950 m · POINT D'INFLEXION EXPONENTIELLE
            </text>

            {/* Ligne 6: +2'400m */}
            <path
              d="M 0 210 C 280 160, 580 200, 860 140 C 1040 100, 1150 150, 1200 120"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.9"
            />
            {/* Ligne 7: Master Contour +2'840m (Col d'Accélération) */}
            <path
              d="M 0 160 C 300 110, 600 150, 890 90 C 1060 50, 1160 100, 1200 70"
              fill="none"
              stroke="url(#swissContourGrad)"
              strokeWidth="1.8"
            />
            <text x="640" y="112" fill="#0369a1" fontSize="9" fontFamily="monospace" fontWeight="700">
              2'840 m · COL D'ACCÉLÉRATION COMPOSÉE
            </text>

            {/* Ligne 8: Zone Glaciaire +3'600m */}
            <path
              d="M 0 110 C 320 60, 620 100, 920 45 C 1080 20, 1170 50, 1200 30"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.2"
            />
            <text x="180" y="80" fill="#0284c7" fontSize="9" fontFamily="monospace" fontWeight="600">
              3'600 m · ZONE GLACIAIRE D'INTÉRÊTS PURS
            </text>

            {/* Ligne 9: Sommet Matterhorn / Cúmulo +4'478m */}
            <path
              d="M 50 60 C 220 20, 480 35, 720 15 C 890 0, 1050 20, 1180 5"
              fill="none"
              stroke="#0369a1"
              strokeWidth="2.2"
            />
            <text x="820" y="25" fill="#0f172a" fontSize="10" fontFamily="monospace" fontWeight="800">
              ▲ 4'478 m · SOMMET MATTERHORN (SOBERANÍA FINANCIERA)
            </text>

            {/* Swisstopo Scale Bar & Coordinates */}
            <g transform="translate(60, 445)">
              <line x1="0" y1="0" x2="150" y2="0" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" strokeWidth="1.5" />
              <line x1="75" y1="-3" x2="75" y2="3" stroke="#475569" strokeWidth="1.2" />
              <line x1="150" y1="-4" x2="150" y2="4" stroke="#475569" strokeWidth="1.5" />
              <text x="0" y="14" fill="#64748b" fontSize="8" fontFamily="monospace">0 km</text>
              <text x="65" y="14" fill="#64748b" fontSize="8" fontFamily="monospace">2.5 km</text>
              <text x="135" y="14" fill="#64748b" fontSize="8" fontFamily="monospace">5 km</text>
              <text x="175" y="6" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="600">
                ÉCHELLE 1:25'000 · CARTE NATIONALE DE LA SUISSE · CH1903+ / LV95
              </text>
            </g>
          </svg>

          {/* Layer 3: Swiss Geodetic Micro-Dot Matrix */}
          <div 
            className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none -z-10"
            style={{
              maskImage: "linear-gradient(to right, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 60%, transparent 100%)",
            }}
          />

          {/* Content: Asymmetric Swiss Architectural Grid Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Monumental Swiss International Typography */}
            <div className="lg:col-span-7 space-y-5">
              {/* Swiss Federal Emblem & Standards Pill */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-red-600 text-white font-black text-xs shadow-xs select-none">
                  +
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-800 font-bold bg-white/95 border border-slate-300 px-2.5 py-1 rounded-md shadow-2xs">
                  SWISSTOPO CARTOGRAPHIE PATRIMONIALE
                </span>
                <span className="text-[10px] font-mono text-sky-800 font-semibold hidden sm:inline">
                  CH1903+ / LV95 · MATÉMATIQUE DISCRÈTE
                </span>
              </div>

              {/* Monumental Headline */}
              <h1 className="text-4xl sm:text-6xl font-serif text-slate-950 tracking-[-0.04em] leading-[1.05]">
                Topografía del Capital{" "}
                <span className="italic font-normal text-sky-800">
                  Compuesto
                </span>
                .
              </h1>

              {/* Dynamic Alpine Altimeter Gauge */}
              <div className="inline-flex flex-wrap items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/95 border border-sky-200/90 shadow-2xs text-xs font-mono">
                <div className="flex items-center gap-1.5 text-sky-800 font-bold">
                  <Mountain className="h-4 w-4 text-sky-700" />
                  <span>Altitud Alcanzada:</span>
                </div>
                <span className="text-slate-950 font-extrabold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  +{alpineAltitude.toLocaleString()} m s.n.m.
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-semibold hidden md:inline">
                  {alpineZone}
                </span>
              </div>

              <p className="text-sm sm:text-base font-mono text-slate-700 max-w-xl leading-relaxed">
                Diseñado con los principios de cartografía topográfica suiza: cada aportación periódica eleva la cota patrimonial hasta alcanzar la cresta exponencial donde los rendimientos superan al esfuerzo humano.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenCompareModal}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-slate-900/15"
                >
                  <Compass className="h-4 w-4 text-sky-400" />
                  <span>Comparar Escenarios A/B</span>
                </button>

                <button
                  onClick={onOpenTargetModal}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-mono text-xs uppercase tracking-wider transition-all border border-slate-300 cursor-pointer shadow-xs font-semibold flex items-center gap-2"
                >
                  <Target className="h-3.5 w-3.5 text-sky-700" />
                  <span>Planificar Meta Personal</span>
                </button>
              </div>

              {/* Swiss Technical Index Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-600">
                <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                  HORIZONTE: <strong className="text-slate-900">{years} AÑOS</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                  TASA DE RENDIMIENTO: <strong className="text-sky-800">{annualInterestRate}% ANUAL</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                  ACELERACIÓN: <strong className="text-emerald-700">{wealthMultiplier}x</strong>
                </span>
              </div>
            </div>

            {/* Right 5 cols: Architectural Swiss Banking Monolith Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white/95 border border-sky-300/90 shadow-2xl shadow-sky-950/[0.08] relative">
              <BorderBeam size={180} duration={10} colorFrom="#0284c7" colorTo="#059669" />
              
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-sky-300 shadow-xs shrink-0">
                    <Image
                      src="/images/wealth-compass.jpg"
                      alt="Astrolabio Topográfico Suizo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-sky-950 uppercase tracking-wider font-extrabold text-[11px] block">
                      MONOLITO PATRIMONIAL SUIZO
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Proyección a {years} Años · Retorno {annualInterestRate}%
                    </span>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px]">
                  +{interestPct}% Rendimiento
                </span>
              </div>

              <div className="py-4 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest block font-medium">
                  Saldo Final Acumulado
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                  $<NumberTicker value={finalBalance} />
                </div>
                <span className="text-xs font-mono text-sky-800 block font-semibold">
                  Masa de Interés Puro: +${totalInterest.toLocaleString()} {currency}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Capital Propio:</span>
                  <span className="text-slate-900 font-bold">${totalInvested.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Factor Multiplicador:</span>
                  <span className="text-amber-800 font-bold">{wealthMultiplier}x</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Cota Altimétrica:</span>
                  <span className="text-sky-800 font-bold">+{alpineAltitude.toLocaleString()}m</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Frecuencia:</span>
                  <span className="text-slate-900 font-bold">Capitalización Continua</span>
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
