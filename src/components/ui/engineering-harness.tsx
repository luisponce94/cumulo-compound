"use client";

import React, { useState, useMemo } from "react";
import {
  calculateCompoundInterest,
  InvestmentParams,
  formatCurrency,
  CurrencyCode,
} from "@/utils/compound-interest";
import {
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
  ChevronRight,
} from "lucide-react";

interface TestCase {
  id: string;
  name: string;
  description: string;
  params: InvestmentParams;
  assertion: (res: ReturnType<typeof calculateCompoundInterest>) => {
    passed: boolean;
    actual: string;
    expected: string;
  };
}

export function EngineeringHarness({ currency }: { currency: CurrencyCode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    iterations: number;
    totalMs: number;
    opsPerSec: number;
  } | null>(null);

  const [testResults, setTestResults] = useState<
    Array<{
      id: string;
      name: string;
      passed: boolean;
      actual: string;
      expected: string;
      durationMs: number;
    }>
  >([]);

  // Ground truth evaluation harness suite
  const testSuite: TestCase[] = useMemo(
    () => [
      {
        id: "T1",
        name: "Prueba de Valor Futuro Base (Lump Sum)",
        description: "$100,000 al 10% anual capitalizable anualmente a 10 años sin aportes.",
        params: {
          initialCapital: 100_000,
          periodicContribution: 0,
          contributionFrequency: "anual",
          annualInterestRate: 10,
          years: 10,
          compoundFrequency: 1,
          annualInflationRate: 0,
          currency: "MXN",
        },
        assertion: (res) => {
          // FV = 100000 * (1.10)^10 = 259,374.24
          const expectedNum = 259_374;
          const passed = Math.abs(res.finalBalance - expectedNum) <= 2;
          return {
            passed,
            actual: `$${res.finalBalance.toLocaleString()}`,
            expected: `~$259,374 (±$2)`,
          };
        },
      },
      {
        id: "T2",
        name: "Prueba de Anualidad Ordinaria Mensual",
        description: "$0 inicial + $1,000 mensuales al 12% anual por 5 años con capitalización mensual.",
        params: {
          initialCapital: 0,
          periodicContribution: 1_000,
          contributionFrequency: "mensual",
          annualInterestRate: 12,
          years: 5,
          compoundFrequency: 12,
          annualInflationRate: 0,
          currency: "MXN",
        },
        assertion: (res) => {
          // r = 0.01/mes, n = 60 meses. FV = 1000 * ((1.01)^60 - 1) / 0.01 = 81,669.67
          const expectedNum = 81_670;
          const passed = Math.abs(res.finalBalance - expectedNum) <= 50;
          return {
            passed,
            actual: `$${res.finalBalance.toLocaleString()}`,
            expected: `~$81,670 (±$50)`,
          };
        },
      },
      {
        id: "T3",
        name: "Límite de Inflexión (Crossover Milestone)",
        description: "Verifica que el año de inflexión se detecte exactamente cuando el interés supere el capital depositado.",
        params: {
          initialCapital: 10_000,
          periodicContribution: 2_000,
          contributionFrequency: "mensual",
          annualInterestRate: 15,
          years: 15,
          compoundFrequency: 12,
          annualInflationRate: 3.5,
          currency: "MXN",
        },
        assertion: (res) => {
          const crossoverRow = res.breakdown.find((b) => b.year === res.crossoverYear);
          const passed =
            res.crossoverYear !== null &&
            crossoverRow !== undefined &&
            crossoverRow.cumulativeInterest >= crossoverRow.cumulativeContribution;
          return {
            passed: Boolean(passed),
            actual: `Año ${res.crossoverYear} (Int: $${crossoverRow?.cumulativeInterest.toLocaleString()} >= Cap: $${crossoverRow?.cumulativeContribution.toLocaleString()})`,
            expected: "Interés acumulado >= Total depositado",
          };
        },
      },
      {
        id: "T4",
        name: "Invarianza de Cero Rendimiento (Tasa 0%)",
        description: "Con 0% de interés, el saldo final debe ser idéntico al total de aportaciones de bolsillo.",
        params: {
          initialCapital: 50_000,
          periodicContribution: 5_000,
          contributionFrequency: "mensual",
          annualInterestRate: 0,
          years: 5,
          compoundFrequency: 12,
          annualInflationRate: 0,
          currency: "MXN",
        },
        assertion: (res) => {
          const expected = 50_000 + 5_000 * 12 * 5; // 350,000
          const passed = res.finalBalance === expected && res.totalInterest === 0;
          return {
            passed,
            actual: `Saldo: $${res.finalBalance.toLocaleString()}, Int: $${res.totalInterest}`,
            expected: `Saldo: $${expected.toLocaleString()}, Int: $0`,
          };
        },
      },
      {
        id: "T5",
        name: "Erosión Inflacionaria Negativa (Poder Real)",
        description: "Verifica que el saldo real sea estrictamente menor que el nominal cuando la inflación es positiva.",
        params: {
          initialCapital: 100_000,
          periodicContribution: 1_000,
          contributionFrequency: "mensual",
          annualInterestRate: 8,
          years: 20,
          compoundFrequency: 12,
          annualInflationRate: 5,
          currency: "MXN",
        },
        assertion: (res) => {
          const passed = res.realFinalBalance < res.finalBalance && res.realFinalBalance > 0;
          return {
            passed,
            actual: `Nominal: $${res.finalBalance.toLocaleString()} > Real: $${res.realFinalBalance.toLocaleString()}`,
            expected: "Real < Nominal (Descuento inflacionario)",
          };
        },
      },
    ],
    []
  );

  // Run the full verification suite
  const runVerificationSuite = () => {
    setIsRunning(true);
    const results = [];

    for (const test of testSuite) {
      const t0 = performance.now();
      const calcResult = calculateCompoundInterest(test.params);
      const t1 = performance.now();
      const assertOutcome = test.assertion(calcResult);

      results.push({
        id: test.id,
        name: test.name,
        passed: assertOutcome.passed,
        actual: assertOutcome.actual,
        expected: assertOutcome.expected,
        durationMs: Number((t1 - t0).toFixed(3)),
      });
    }

    // Stress test: 5,000 iterations for benchmark
    const benchStart = performance.now();
    const benchIterations = 5_000;
    const sampleParam = testSuite[0].params;
    for (let i = 0; i < benchIterations; i++) {
      calculateCompoundInterest(sampleParam);
    }
    const benchEnd = performance.now();
    const totalMs = benchEnd - benchStart;
    const opsPerSec = Math.round((benchIterations / totalMs) * 1000);

    setBenchmarkResult({
      iterations: benchIterations,
      totalMs: Number(totalMs.toFixed(2)),
      opsPerSec,
    });

    setTestResults(results);
    setIsRunning(false);
  };

  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

  return (
    <div className="bg-[#0e1e36]/90 backdrop-blur-sm rounded-3xl border border-white/12 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-serif text-white tracking-tight">
                Harness Engineering & Suite de Verificación
              </h3>
              <span className="text-[9px] font-mono uppercase bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold tracking-wider">
                EVAL HARNESS
              </span>
            </div>
            <p className="text-xs font-mono text-white/50 mt-0.5">
              Auditoría matemática determinista, pruebas de estrés y benchmark de latencia en milisegundos.
            </p>
          </div>
        </div>

        <button
          onClick={runVerificationSuite}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50 self-start sm:self-auto"
        >
          <Play className="h-3.5 w-3.5 fill-black" />
          <span>{isRunning ? "Auditando..." : "Ejecutar Eval Harness"}</span>
        </button>
      </div>

      {/* Benchmark Telemetry Strip */}
      {benchmarkResult && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-white/40 block">Throughput de Cálculo:</span>
              <span className="font-bold text-amber-300">
                {benchmarkResult.opsPerSec.toLocaleString()} simulaciones/seg
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-white/40 block">Tiempo de 5,000 ciclos:</span>
              <span className="font-bold text-cyan-300">{benchmarkResult.totalMs} ms</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-white/40 block">Estado de Integridad:</span>
              <span className="font-bold text-emerald-400">
                {allPassed ? "100% Determinista (PASS)" : "Fallas detectadas"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Table */}
      {testResults.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b182d]/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 font-mono bg-white/[0.02]">
                <th className="py-2.5 px-4">Test ID</th>
                <th className="py-2.5 px-4">Caso de Prueba</th>
                <th className="py-2.5 px-4">Esperado</th>
                <th className="py-2.5 px-4">Valor Obtenido</th>
                <th className="py-2.5 px-4 text-right">Latencia</th>
                <th className="py-2.5 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-white/80">
              {testResults.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-400">{r.id}</td>
                  <td className="py-3 px-4 text-white font-medium">{r.name}</td>
                  <td className="py-3 px-4 text-white/50">{r.expected}</td>
                  <td className="py-3 px-4 text-emerald-300 font-semibold">{r.actual}</td>
                  <td className="py-3 px-4 text-right text-white/40">{r.durationMs}ms</td>
                  <td className="py-3 px-4 text-center">
                    {r.passed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        <CheckCircle2 className="h-3 w-3" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                        <XCircle className="h-3 w-3" /> FAIL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-white/15 text-center space-y-3">
          <Terminal className="h-8 w-8 text-white/30 mx-auto" />
          <p className="text-xs font-mono text-white/60">
            El arnés de verificación está listo. Haz clic en <strong>Ejecutar Eval Harness</strong> para verificar la fidelidad matemática de las fórmulas frente a casos base de matemática financiera.
          </p>
        </div>
      )}
    </div>
  );
}
