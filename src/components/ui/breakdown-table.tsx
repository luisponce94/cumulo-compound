"use client";

import React, { useState } from "react";
import { YearlyBreakdown, formatCurrency, CurrencyCode } from "@/utils/compound-interest";
import { Download, Table, Check, ChevronDown, ChevronUp, Copy, Sparkles } from "lucide-react";

interface TableProps {
  breakdown: YearlyBreakdown[];
  currency: CurrencyCode;
  crossoverYear: number | null;
  firstMillionYear: number | null;
}

export function BreakdownTable({
  breakdown,
  currency,
  crossoverYear,
  firstMillionYear,
}: TableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Show first 10 rows by default, or all if expanded
  const displayedRows = isExpanded ? breakdown : breakdown.slice(0, 10);
  const maxEndBalance = Math.max(...breakdown.map((d) => d.endBalance), 1);

  const handleExportCSV = () => {
    const headers = [
      "Año",
      "Saldo Inicial",
      "Aportación del Año",
      "Total Aportado Acumulado",
      "Interés del Año",
      "Interés Total Acumulado",
      "Saldo Final Nominal",
      "Saldo Final Real (Ajustado por Inflación)",
    ];

    const rows = breakdown.map((d) => [
      d.year,
      d.startBalance,
      d.annualContribution,
      d.cumulativeContribution,
      d.interestEarnedYear,
      d.cumulativeInterest,
      d.endBalance,
      d.realEndBalance,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `proyeccion_interes_compuesto_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopySummary = () => {
    const lastRow = breakdown[breakdown.length - 1];
    if (!lastRow) return;

    const text = `📊 RESUMEN PATRIMONIAL - CÚMULO
• Plazo: ${lastRow.year} años
• Capital Propio Aportado: ${formatCurrency(lastRow.cumulativeContribution, currency)}
• Intereses Ganados: ${formatCurrency(lastRow.cumulativeInterest, currency)}
• Saldo Final Proyectado: ${formatCurrency(lastRow.endBalance, currency)}
• Poder Adquisitivo Real: ${formatCurrency(lastRow.realEndBalance, currency)}
${crossoverYear ? `• Año de Inflexión (Interés supera aporte): Año ${crossoverYear}` : ""}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="bg-[#0e131a] rounded-3xl border border-white/10 p-5 sm:p-7 shadow-2xl space-y-5">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold flex items-center gap-1.5">
            <Table className="h-3 w-3" />
            Auditoría Numérica Detallada (Dashboard Standard)
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight mt-0.5">
            Desglose Financiero Año por Año
          </h3>
          <p className="text-xs text-white/50 mt-1 font-mono">
            Barras proporcionales en celda para visualizar el peso del interés frente al capital.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Copiar resumen al portapapeles"
          >
            {copiedSummary ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copiar Resumen</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>¡Descargado!</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Exportar CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/30">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 font-mono bg-white/[0.02]">
              <th className="py-3 px-3.5">Año</th>
              <th className="py-3 px-3.5">Saldo Inicial</th>
              <th className="py-3 px-3.5">Aportación Anual</th>
              <th className="py-3 px-3.5">Interés Ganado (Año)</th>
              <th className="py-3 px-3.5">Interés Acumulado</th>
              <th className="py-3 px-3.5">Capital Aportado</th>
              <th className="py-3 px-3.5 font-bold text-emerald-400">Saldo Final</th>
              <th className="py-3 px-3.5 text-white/50 min-w-[130px]">Composición</th>
              <th className="py-3 px-3.5 text-white/40">Poder Real</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-white/80">
            {displayedRows.map((row) => {
              const isCrossover = row.year === crossoverYear;
              const isFirstMillion = row.year === firstMillionYear;

              // In-cell bar proportions
              const interestShare =
                row.endBalance > 0
                  ? Math.round((row.cumulativeInterest / row.endBalance) * 100)
                  : 0;
              const principalShare = 100 - interestShare;

              return (
                <tr
                  key={row.year}
                  className={`hover:bg-white/[0.03] transition-colors ${
                    isCrossover
                      ? "bg-emerald-500/10 border-l-4 border-l-emerald-400"
                      : isFirstMillion
                      ? "bg-cyan-500/10 border-l-4 border-l-cyan-400"
                      : ""
                  }`}
                >
                  <td className="py-3 px-3.5 font-bold text-white flex items-center gap-2">
                    <span>A{row.year}</span>
                    {isCrossover && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500 text-black font-bold uppercase tracking-wider">
                        Inflexión
                      </span>
                    )}
                    {isFirstMillion && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-cyan-400 text-black font-bold uppercase tracking-wider">
                        1er Millón
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-white/60">
                    {formatCurrency(row.startBalance, currency)}
                  </td>
                  <td className="py-3 px-3.5 text-cyan-300">
                    +{formatCurrency(row.annualContribution, currency)}
                  </td>
                  <td className="py-3 px-3.5 text-emerald-300 font-semibold">
                    +{formatCurrency(row.interestEarnedYear, currency)}
                  </td>
                  <td className="py-3 px-3.5 text-emerald-400 font-medium">
                    {formatCurrency(row.cumulativeInterest, currency)}
                  </td>
                  <td className="py-3 px-3.5 text-white/60">
                    {formatCurrency(row.cumulativeContribution, currency)}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-white">
                    {formatCurrency(row.endBalance, currency)}
                  </td>
                  {/* In-Cell Visual Progress Bar */}
                  <td className="py-3 px-3.5">
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-cyan-500 transition-all duration-300"
                          style={{ width: `${principalShare}%` }}
                          title={`Capital propio: ${principalShare}%`}
                        />
                        <div
                          className="h-full bg-emerald-400 transition-all duration-300"
                          style={{ width: `${interestShare}%` }}
                          title={`Interés ganado: ${interestShare}%`}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-white/40">
                        <span className="text-cyan-400">{principalShare}% cap</span>
                        <span className="text-emerald-400">{interestShare}% int</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-white/40">
                    {formatCurrency(row.realEndBalance, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expand / Collapse Button if more than 10 rows */}
      {breakdown.length > 10 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 hover:text-white border border-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Mostrar solo los primeros 10 años</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Ver los {breakdown.length} años completos</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
