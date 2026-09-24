import { TAX_BRACKETS, APP_CONFIG, LMITO_OFFSET } from '@/constants/config';

export interface TaxBreakdown {
  grossIncome: number;
  incomeTax: number;
  medicareLevy: number;
  gst: number;
  studentLoan: number;
  superContribution: number;
  totalDeductions: number;
  netIncome: number;
  effectiveTaxRate: number;
}

export interface AllocationSettings {
  enableGST: boolean;
  enableStudentLoan: boolean;
  studentLoanRate: number; // HELP/HECS repayment rate
  superRate: number;
  customSuperRate: boolean;
}

export function calculateIncomeTax(annualIncome: number): number {
  if (annualIncome <= 18200) return 0;

  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (annualIncome > bracket.min) {
      const taxableInBracket = Math.min(annualIncome, bracket.max === Infinity ? annualIncome : bracket.max) - bracket.min;
      if (taxableInBracket > 0) {
        tax = bracket.base + (annualIncome - bracket.min) * bracket.rate;
        // Only take the result if income falls in this bracket
        if (annualIncome <= (bracket.max === Infinity ? Infinity : bracket.max)) {
          break;
        }
      }
    }
  }

  // Low Income Tax Offset (LITO)
  let lito = 0;
  if (annualIncome <= 37500) {
    lito = 700;
  } else if (annualIncome <= 45000) {
    lito = 700 - (annualIncome - 37500) * 0.05;
  } else if (annualIncome <= 66667) {
    lito = 325 - (annualIncome - 45000) * 0.015;
  }

  tax = Math.max(0, tax - lito);
  return Math.round(tax);
}

export function calculateMedicare(annualIncome: number): number {
  if (annualIncome <= APP_CONFIG.medicareThreshold) return 0;
  return Math.round(annualIncome * APP_CONFIG.medicareLevy);
}

export function calculateGST(amount: number): number {
  // GST component from GST-inclusive amount
  return Math.round(amount * (APP_CONFIG.gstRate / (1 + APP_CONFIG.gstRate)));
}

export function calculateStudentLoan(annualIncome: number, rate: number): number {
  const threshold = 51550; // 2024-25 threshold
  if (annualIncome < threshold) return 0;
  return Math.round(annualIncome * rate);
}

export function calculateTaxBreakdownForIncome(
  singleIncome: number,
  ytdIncome: number,
  settings: AllocationSettings
): TaxBreakdown {
  const projectedAnnual = ytdIncome + singleIncome;

  // Calculate annual amounts and find per-dollar rate
  const annualIncomeTax = calculateIncomeTax(projectedAnnual);
  const prevIncomeTax = calculateIncomeTax(ytdIncome);
  const marginalIncomeTax = Math.max(0, annualIncomeTax - prevIncomeTax);

  const annualMedicare = calculateMedicare(projectedAnnual);
  const prevMedicare = calculateMedicare(ytdIncome);
  const marginalMedicare = Math.max(0, annualMedicare - prevMedicare);

  const gst = settings.enableGST ? calculateGST(singleIncome) : 0;
  const studentLoan = settings.enableStudentLoan
    ? calculateStudentLoan(singleIncome, settings.studentLoanRate)
    : 0;

  const superContribution = Math.round(singleIncome * settings.superRate);

  const totalDeductions = marginalIncomeTax + marginalMedicare + gst + studentLoan + superContribution;
  const netIncome = singleIncome - totalDeductions;

  const totalTaxable = marginalIncomeTax + marginalMedicare + gst + studentLoan;
  const effectiveTaxRate = singleIncome > 0 ? (totalTaxable / singleIncome) * 100 : 0;

  return {
    grossIncome: singleIncome,
    incomeTax: marginalIncomeTax,
    medicareLevy: marginalMedicare,
    gst,
    studentLoan,
    superContribution,
    totalDeductions,
    netIncome: Math.max(0, netIncome),
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
  };
}

export function calculateYTDSummary(
  transactions: Array<{ amount: number; taxBreakdown?: TaxBreakdown }>
): TaxBreakdown {
  return transactions.reduce(
    (acc, t) => {
      if (!t.taxBreakdown) return acc;
      return {
        grossIncome: acc.grossIncome + t.taxBreakdown.grossIncome,
        incomeTax: acc.incomeTax + t.taxBreakdown.incomeTax,
        medicareLevy: acc.medicareLevy + t.taxBreakdown.medicareLevy,
        gst: acc.gst + t.taxBreakdown.gst,
        studentLoan: acc.studentLoan + t.taxBreakdown.studentLoan,
        superContribution: acc.superContribution + t.taxBreakdown.superContribution,
        totalDeductions: acc.totalDeductions + t.taxBreakdown.totalDeductions,
        netIncome: acc.netIncome + t.taxBreakdown.netIncome,
        effectiveTaxRate: 0,
      };
    },
    {
      grossIncome: 0,
      incomeTax: 0,
      medicareLevy: 0,
      gst: 0,
      studentLoan: 0,
      superContribution: 0,
      totalDeductions: 0,
      netIncome: 0,
      effectiveTaxRate: 0,
    }
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(0)}`;
}
