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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-900/[0.03] space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-serif text-slate-900 tracking-tight">
                Harness Engineering & Suite de Verificación
              </h3>
              <span className="text-[9px] font-mono uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200 font-bold tracking-wider">
                EVAL HARNESS
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Auditoría matemática determinista, pruebas de estrés y benchmark de latencia en milisegundos.
            </p>
          </div>
        </div>

        <button
          onClick={runVerificationSuite}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-full bg-sky-700 hover:bg-sky-800 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-sky-700/20 disabled:opacity-50 self-start sm:self-auto"
        >
          <Play className="h-3.5 w-3.5 fill-white" />
          <span>{isRunning ? "Auditando..." : "Ejecutar Eval Harness"}</span>
        </button>
      </div>

      {/* Benchmark Telemetry Strip */}
      {benchmarkResult && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-amber-600" />
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Throughput de Cálculo:</span>
              <span className="font-bold text-amber-800">
                {benchmarkResult.opsPerSec.toLocaleString()} simulaciones/seg
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-sky-600" />
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Tiempo de 5,000 ciclos:</span>
              <span className="font-bold text-sky-800">{benchmarkResult.totalMs} ms</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Estado de Integridad:</span>
              <span className="font-bold text-emerald-700">
                {allPassed ? "100% Determinista (PASS)" : "Fallas detectadas"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Table */}
      {testResults.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono bg-slate-100/70">
                <th className="py-2.5 px-4">Test ID</th>
                <th className="py-2.5 px-4">Caso de Prueba</th>
                <th className="py-2.5 px-4">Esperado</th>
                <th className="py-2.5 px-4">Valor Obtenido</th>
                <th className="py-2.5 px-4 text-right">Latencia</th>
                <th className="py-2.5 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
              {testResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-100/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-sky-800">{r.id}</td>
                  <td className="py-3 px-4 text-slate-900 font-medium">{r.name}</td>
                  <td className="py-3 px-4 text-slate-500">{r.expected}</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">{r.actual}</td>
                  <td className="py-3 px-4 text-right text-slate-500">{r.durationMs}ms</td>
                  <td className="py-3 px-4 text-center">
                    {r.passed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        <CheckCircle2 className="h-3 w-3" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 border border-rose-300 font-bold">
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
        <div className="p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3 bg-slate-50/50">
          <Terminal className="h-8 w-8 text-slate-400 mx-auto" />
          <p className="text-xs font-mono text-slate-600">
            El arnés de verificación está listo. Haz clic en <strong>Ejecutar Eval Harness</strong> para verificar la fidelidad matemática de las fórmulas frente a casos base de matemática financiera.
          </p>
        </div>
      )}
    </div>
  );
}
