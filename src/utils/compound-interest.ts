export type ContributionFrequency = "mensual" | "quincenal" | "anual";
export type CompoundFrequency = 1 | 2 | 4 | 12 | 365; // Anual, Semestral, Trimestral, Mensual, Diaria
export type CurrencyCode = "MXN" | "USD" | "EUR" | "CHF";

export interface InvestmentParams {
  initialCapital: number;
  periodicContribution: number;
  contributionFrequency: ContributionFrequency;
  annualInterestRate: number; // e.g. 10 for 10%
  years: number; // e.g. 15
  compoundFrequency: CompoundFrequency;
  annualInflationRate: number; // e.g. 4 for 4%
  currency: CurrencyCode;
}

export interface YearlyBreakdown {
  year: number;
  startBalance: number;
  annualContribution: number;
  cumulativeContribution: number;
  interestEarnedYear: number;
  cumulativeInterest: number;
  endBalance: number;
  realEndBalance: number; // adjusted for inflation
}

export interface CalculationResult {
  finalBalance: number;
  totalInvested: number;
  totalInterest: number;
  wealthMultiplier: number; // finalBalance / totalInvested
  realFinalBalance: number; // purchasing power adjusted
  monthlyPassiveIncome: number; // 4% rule annual / 12 or annualInterestRate yield / 12
  crossoverYear: number | null; // year where cumulative interest exceeds total invested
  firstMillionYear: number | null; // year reaching 1,000,000
  breakdown: YearlyBreakdown[];
}

export interface PresetScenario {
  id: string;
  name: string;
  tagline: string;
  defaultRate: number;
  compoundFrequency: CompoundFrequency;
  description: string;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "cetes",
    name: "CETES / Renta Fija Gubernamental",
    tagline: "Bajo Riesgo • Deuda Soberana",
    defaultRate: 10.5,
    compoundFrequency: 12,
    description: "Inversión en bonos del tesoro con capitalización mensual y respaldo soberano.",
  },
  {
    id: "sp500",
    name: "S&P 500 / ETFs Indexados",
    tagline: "Renta Variable Global • Crecimiento",
    defaultRate: 10.0,
    compoundFrequency: 1,
    description: "Rendimiento promedio histórico en las 500 empresas líderes de EE. UU.",
  },
  {
    id: "fibras",
    name: "FIBRAS / Bienes Raíces",
    tagline: "Rentas Inmobiliarias • Flujo",
    defaultRate: 8.5,
    compoundFrequency: 4,
    description: "Distribución trimestral por rentas comerciales, naves industriales y oficinas.",
  },
  {
    id: "sofipos",
    name: "SOFIPOs / Cuentas de Rendimiento",
    tagline: "Tasa Promocional Regulada",
    defaultRate: 13.5,
    compoundFrequency: 365,
    description: "Cuentas a la vista o a plazo en entidades financieras populares con rendimiento diario.",
  },
  {
    id: "conservador",
    name: "Portafolio Conservador Multi-Activo",
    tagline: "Preservación Patrimonial",
    defaultRate: 6.5,
    compoundFrequency: 12,
    description: "Estrategia mixta de bonos, fondos de liquidez y cobertura inflacionaria.",
  },
];

/**
 * Calculates compound interest with granular sub-period cash flows,
 * inflation adjustment, crossover milestone detection, and yearly breakdown.
 */
export function calculateCompoundInterest(params: InvestmentParams): CalculationResult {
  const {
    initialCapital,
    periodicContribution,
    contributionFrequency,
    annualInterestRate,
    years,
    compoundFrequency,
    annualInflationRate,
  } = params;

  // Determine periods per year for contributions
  const contribsPerYear =
    contributionFrequency === "quincenal"
      ? 24
      : contributionFrequency === "mensual"
      ? 12
      : 1;

  const r = annualInterestRate / 100;
  const infl = annualInflationRate / 100;
  const n = compoundFrequency; // times compounded per year

  // Effective rate per day to handle discrete periods consistently
  // We simulate month-by-month (12 sub-steps per year) for precision and clean yearly accumulation
  const subPeriodsPerYear = 12;
  const subPeriodRate = Math.pow(1 + r / n, n / subPeriodsPerYear) - 1;

  // Contributions per sub-period (month)
  const contribPerMonth =
    contributionFrequency === "quincenal"
      ? periodicContribution * 2
      : contributionFrequency === "mensual"
      ? periodicContribution
      : periodicContribution / 12;

  let currentBalance = initialCapital;
  let totalDeposited = initialCapital;
  let cumulativeInterest = 0;
  let crossoverYear: number | null = null;
  let firstMillionYear: number | null = null;

  const breakdown: YearlyBreakdown[] = [];

  for (let year = 1; year <= years; year++) {
    const startBalanceOfYear = currentBalance;
    let interestEarnedInYear = 0;
    let contributionInYear = 0;

    for (let m = 1; m <= subPeriodsPerYear; m++) {
      // Interest on balance at start of month
      const monthInterest = currentBalance * subPeriodRate;
      interestEarnedInYear += monthInterest;
      currentBalance += monthInterest;

      // Contribution added at end of month
      currentBalance += contribPerMonth;
      contributionInYear += contribPerMonth;
      totalDeposited += contribPerMonth;
    }

    cumulativeInterest += interestEarnedInYear;

    // Purchasing power adjusted for inflation
    const inflationDiscount = Math.pow(1 + infl, year);
    const realEndBalance = currentBalance / inflationDiscount;

    // Check milestones
    if (crossoverYear === null && cumulativeInterest >= totalDeposited) {
      crossoverYear = year;
    }
    if (firstMillionYear === null && currentBalance >= 1_000_000) {
      firstMillionYear = year;
    }

    breakdown.push({
      year,
      startBalance: Math.round(startBalanceOfYear),
      annualContribution: Math.round(contributionInYear),
      cumulativeContribution: Math.round(totalDeposited),
      interestEarnedYear: Math.round(interestEarnedInYear),
      cumulativeInterest: Math.round(cumulativeInterest),
      endBalance: Math.round(currentBalance),
      realEndBalance: Math.round(realEndBalance),
    });
  }

  const finalBalance = Math.round(currentBalance);
  const finalTotalInvested = Math.round(totalDeposited);
  const totalInterest = Math.round(cumulativeInterest);
  const wealthMultiplier = finalTotalInvested > 0 ? Number((finalBalance / finalTotalInvested).toFixed(2)) : 0;
  const realFinalBalance = breakdown.length > 0 ? breakdown[breakdown.length - 1].realEndBalance : finalBalance;

  // Monthly passive income assuming a safe 4% withdrawal rate (SWR) or 6% conservative dividend yield
  const monthlyPassiveIncome = Math.round((finalBalance * 0.05) / 12);

  return {
    finalBalance,
    totalInvested: finalTotalInvested,
    totalInterest,
    wealthMultiplier,
    realFinalBalance,
    monthlyPassiveIncome,
    crossoverYear,
    firstMillionYear,
    breakdown,
  };
}

/**
 * Inverse calculation: Given a target wealth and time horizon,
 * calculates the required monthly contribution.
 */
export function calculateRequiredMonthlyContribution(
  targetAmount: number,
  initialCapital: number,
  annualInterestRate: number,
  years: number,
  compoundFrequency: CompoundFrequency = 12
): number {
  if (years <= 0 || targetAmount <= initialCapital) return 0;

  const r = annualInterestRate / 100;
  const n = compoundFrequency;
  const months = years * 12;

  // Future value of initial capital: FV_init = P * (1 + r/n)^(n*t)
  const fvInitial = initialCapital * Math.pow(1 + r / n, n * years);
  const remainingTarget = targetAmount - fvInitial;

  if (remainingTarget <= 0) return 0;

  // Rate per month
  const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;

  // FV of annuity = PMT * [ ( (1 + i)^months - 1 ) / i ]
  if (monthlyRate === 0) {
    return Math.round(remainingTarget / months);
  }

  const annuityFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return Math.round(remainingTarget / annuityFactor);
}

export function formatCurrency(amount: number, currency: CurrencyCode = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
