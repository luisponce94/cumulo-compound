"use client";

import React from "react";
import { PRESET_SCENARIOS, PresetScenario } from "@/utils/compound-interest";
import { Sparkles } from "lucide-react";

interface PresetsProps {
  activePresetId: string | null;
  onSelectPreset: (preset: PresetScenario) => void;
}

export function ScenarioPresets({
  activePresetId,
  onSelectPreset,
}: PresetsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          Estrategias de Inversión Preconfiguradas
        </span>
        <span className="text-[11px] font-mono text-white/40">
          Tasas de referencia 2026
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PRESET_SCENARIOS.map((scenario) => {
          const isActive = activePresetId === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectPreset(scenario)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-[1.02]"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20 text-white/70 hover:text-white"
              }`}
            >
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
                  {scenario.tagline.split("•")[0]}
                </span>
                <h4 className="text-xs font-mono font-bold text-white mt-0.5 line-clamp-1">
                  {scenario.name.split("/")[0]}
                </h4>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-baseline justify-between">
                <span className="font-mono text-base font-bold text-emerald-400">
                  {scenario.defaultRate}%
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  anual
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
