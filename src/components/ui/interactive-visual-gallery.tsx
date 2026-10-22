"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Compass, TreePine, Layers, SlidersHorizontal, Info, Check } from "lucide-react";
import { CurrencyCode, formatCurrency } from "@/utils/compound-interest";

interface VisualGalleryProps {
  finalBalance: number;
  totalInterest: number;
  totalInvested: number;
  years: number;
  currency: CurrencyCode;
}

interface ArtItem {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  src: string;
  badge: string;
  badgeColor: string;
  description: string;
  hotspots: {
    x: number; // percentage
    y: number;
    title: string;
    text: string;
  }[];
}

const ARTWORKS: ArtItem[] = [
  {
    id: "compass",
    title: "Astrolabio Patrimonial & Topografía Suiza",
    subtitle: "Precisión Cartográfica & Retorno Compuesto",
    tagline: "Instrumento suizo de alta montaña para navegar el horizonte de acumulación a largo plazo.",
    src: "/images/wealth-compass.jpg",
    badge: "CARTOGRAFÍA TOPOGRÁFICA SUIZA",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    description:
      "Inspirado en la cartografía de alta precisión de la Confederación Suiza. Mide la velocidad de ascenso de tu capital por las curvas de nivel del interés compuesto, preservando el poder adquisitivo real ante la inflación.",
    hotspots: [
      {
        x: 50,
        y: 50,
        title: "Pivote Central Altimétrico",
        text: "Tasa de rendimiento real ajustada a la inflación interanual.",
      },
      {
        x: 72,
        y: 35,
        title: "Aguja Guía de Acumulación",
        text: "Vector de crecimiento patrimonial orientado hacia la cumbre financiera.",
      },
      {
        x: 32,
        y: 65,
        title: "Retícula Geodésica",
        text: "Frecuencia de capitalización continua que compacta el tiempo de ascenso.",
      },
    ],
  },
  {
    id: "sculpture",
    title: "Escultura Exponencial de Cristal",
    subtitle: "Arquitectura del Interés Compuesto",
    tagline: "El salto cuántico entre el esfuerzo propio y los rendimientos reinvertidos.",
    src: "/images/compound-growth-sculpture.jpg",
    badge: "ESCULTURA EDITORIAL 3D",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description:
      "Cada peldaño de cristal traslúcido representa un ciclo de reinversión donde el capital anterior produce una masa de intereses aún mayor.",
    hotspots: [
      {
        x: 28,
        y: 72,
        title: "Base de Ahorro Propio",
        text: "Los primeros años dependen de tu disciplina de ahorro mensual constante.",
      },
      {
        x: 52,
        y: 46,
        title: "Punto de Inflexión",
        text: "El momento donde los intereses generados superan tu salario o aportación anual.",
      },
      {
        x: 76,
        y: 22,
        title: "Cresta Exponencial",
        text: "Curva parabólica de libertad financiera donde el dinero trabaja 24/7.",
      },
    ],
  },
  {
    id: "tree",
    title: "Árbol Fractal de la Riqueza",
    subtitle: "25 Años de Capitalización Continua",
    tagline: "Ramificaciones que multiplican tu poder adquisitivo real ante la inflación.",
    src: "/images/exponential-tree.jpg",
    badge: "MONOLITO BIÓNICO",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    description:
      "Una semilla financiera pequeña plantada a tiempo genera una estructura patrimonial masiva que protege y alimenta a futuras generaciones.",
    hotspots: [
      {
        x: 50,
        y: 85,
        title: "Capital Semilla",
        text: "La inversión inicial con la que arranca el generador de riqueza.",
      },
      {
        x: 35,
        y: 45,
        title: "Ramas de Reinversión",
        text: "Dividendos y rendimientos que se vuelven a integrar al saldo total.",
      },
      {
        x: 65,
        y: 28,
        title: "Nodos de Renta Pasiva",
        text: "Rendimientos mensuales vitalicios que puedes retirar sin tocar tu capital.",
      },
    ],
  },
];

/**
 * InteractiveVisualGallery
 * 3D Parallax Tilt, Interactive Hotspots, and Horizon Split Reveal Slider.
 */
export function InteractiveVisualGallery({
  finalBalance,
  totalInterest,
  totalInvested,
  years,
  currency,
}: VisualGalleryProps) {
  const [selectedArtIndex, setSelectedArtIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isComparing, setIsComparing] = useState(false);

  const activeArtwork = ARTWORKS[selectedArtIndex];

  // 3D Tilt Card physics with Framer Motion
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;
    const xPct = touchX / rect.width - 0.5;
    const yPct = touchY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Interactive Horizon Drag
  const handleSplitDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - container.left;
    const pct = Math.max(5, Math.min(95, (offset / container.width) * 100));
    setSliderPosition(pct);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xl shadow-slate-900/[0.03] space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-800 font-bold flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            Galería Escultórica Interactiva
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-slate-900 tracking-tight mt-0.5">
            Visualización Tangible de tu Crecimiento Financiero
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Mueve tu cursor o desliza con el dedo para experimentar la tridimensionalidad y los hitos del interés compuesto.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start sm:self-auto overflow-x-auto max-w-full">
          {ARTWORKS.map((art, idx) => (
            <button
              key={art.id}
              onClick={() => {
                setSelectedArtIndex(idx);
                setActiveHotspot(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedArtIndex === idx
                  ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {art.id === "compass" && <Compass className="h-3 w-3" />}
              {art.id === "sculpture" && <Layers className="h-3 w-3" />}
              {art.id === "tree" && <TreePine className="h-3 w-3" />}
              <span>{art.title.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left 7 cols: 3D Perspective Card with Image and Hotspots */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200 cursor-grab active:cursor-grabbing select-none"
          >
            {/* The Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeArtwork.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeArtwork.src}
                  alt={activeArtwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                />

                {/* Subtle glass vignette border */}
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl pointer-events-none" />

                {/* Interactive Hotspot Pins */}
                {activeArtwork.hotspots.map((spot, idx) => {
                  const isActive = activeHotspot === idx;

                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(idx);
                      }}
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="absolute z-20 group cursor-pointer focus:outline-none"
                      title={spot.title}
                    >
                      {/* Pulse Ring */}
                      <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
                      
                      {/* Pin Circle */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all shadow-lg ${
                          isActive
                            ? "bg-emerald-600 text-white ring-4 ring-white scale-110"
                            : "bg-white/95 text-slate-800 ring-2 ring-emerald-500/50 hover:scale-105"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Specular Light Flare Follower */}
            <motion.div
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60 mix-blend-overlay"
              style={{
                transform: "translateZ(30px)",
              }}
            />
          </motion.div>

          <span className="text-[11px] font-mono text-slate-400 mt-3 flex items-center gap-1.5 text-center">
            <Info className="h-3.5 w-3.5 text-emerald-600" />
            Toca los números (1, 2, 3) sobre la obra para explorar los principios financieros interactivos.
          </span>
        </div>

        {/* Right 5 cols: Educational Financial Telemetry & Hotspot Detail */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Badge & Title */}
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border ${activeArtwork.badgeColor}`}>
              {activeArtwork.badge}
            </span>
            <h4 className="text-2xl font-serif text-slate-900 font-normal tracking-tight mt-2">
              {activeArtwork.title}
            </h4>
            <p className="text-xs font-mono text-emerald-800 font-medium mt-0.5">
              {activeArtwork.subtitle}
            </p>
          </div>

          <p className="text-xs font-mono text-slate-600 leading-relaxed">
            {activeArtwork.description}
          </p>

          {/* Active Hotspot Deep Dive Card */}
          {activeHotspot !== null && activeArtwork.hotspots[activeHotspot] && (
            <motion.div
              key={activeHotspot}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {activeHotspot + 1}
                </span>
                <h5 className="font-mono text-xs font-bold text-slate-900">
                  {activeArtwork.hotspots[activeHotspot].title}
                </h5>
              </div>
              <p className="text-xs font-mono text-slate-700 leading-relaxed pl-7">
                {activeArtwork.hotspots[activeHotspot].text}
              </p>
            </motion.div>
          )}

          {/* Live Compound Impact Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Tu Meta a {years} Años:</span>
              <span className="font-bold text-slate-900">{formatCurrency(finalBalance, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Interés Ganado (Regalo del tiempo):</span>
              <span className="font-bold text-emerald-700">+{formatCurrency(totalInterest, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-200">
              <span className="text-slate-500">Ahorro propio desembolsado:</span>
              <span className="font-bold text-sky-800">{formatCurrency(totalInvested, currency)}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
