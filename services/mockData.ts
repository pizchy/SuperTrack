import { TaxBreakdown } from './taxCalculator';

export interface IncomeTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  taxBreakdown: TaxBreakdown;
  receiptUrl?: string;
  platform?: string;
}

export interface ExpenseTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  deductibleAmount: number;
  deductiblePercent: number;
  hasReceipt: boolean;
  notes?: string;
}

export interface VirtualAccount {
  accountNumber: string;
  bsb: string;
  accountName: string;
  balance: number;
  taxReserve: number;
  superReserve: number;
  availableBalance: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  abn: string;
  taxFileNumber: string;
  gstRegistered: boolean;
  hasStudentLoan: boolean;
  studentLoanRate: number;
  superFund: string;
  superMemberNumber: string;
  plan: 'free' | 'monthly' | 'annual';
  joinDate: string;
}

export const MOCK_USER: UserProfile = {
  id: 'usr_001',
  name: 'Alex Thompson',
  email: 'alex.thompson@gmail.com',
  abn: '12 345 678 901',
  taxFileNumber: '***-***-***',
  gstRegistered: true,
  hasStudentLoan: false,
  studentLoanRate: 0.02,
  superFund: 'Australian Super',
  superMemberNumber: 'AUS-2847391',
  plan: 'monthly',
  joinDate: '2024-07-01',
};

export const MOCK_VIRTUAL_ACCOUNT: VirtualAccount = {
  accountNumber: '1247 8831',
  bsb: '062-101',
  accountName: 'Alex Thompson — SuperTrack',
  balance: 28450.00,
  taxReserve: 5230.00,
  superReserve: 3270.00,
  availableBalance: 19950.00,
};

export const MOCK_INCOME: IncomeTransaction[] = [
  {
    id: 'inc_001',
    date: '2025-09-20',
    description: 'Website Development — Buildify Pty Ltd',
    category: 'contract',
    amount: 4500.00,
    platform: 'Direct Transfer',
    taxBreakdown: {
      grossIncome: 4500,
      incomeTax: 810,
      medicareLevy: 90,
      gst: 409.09,
      studentLoan: 0,
      superContribution: 517.50,
      totalDeductions: 1826.59,
      netIncome: 2673.41,
      effectiveTaxRate: 28.9,
    },
  },
  {
    id: 'inc_002',
    date: '2025-09-15',
    description: 'Uber Driver Earnings — Week 37',
    category: 'rideshare',
    amount: 1240.00,
    platform: 'Uber',
    taxBreakdown: {
      grossIncome: 1240,
      incomeTax: 217,
      medicareLevy: 24.8,
      gst: 112.73,
      studentLoan: 0,
      superContribution: 142.60,
      totalDeductions: 497.13,
      netIncome: 742.87,
      effectiveTaxRate: 28.5,
    },
  },
  {
    id: 'inc_003',
    date: '2025-09-10',
    description: 'Consulting Fee — Q3 Strategy Report',
    category: 'consulting',
    amount: 3200.00,
    platform: 'Direct Transfer',
    taxBreakdown: {
      grossIncome: 3200,
      incomeTax: 576,
      medicareLevy: 64,
      gst: 290.91,
      studentLoan: 0,
      superContribution: 368.00,
      totalDeductions: 1298.91,
      netIncome: 1901.09,
      effectiveTaxRate: 28.8,
    },
  },
  {
    id: 'inc_004',
    date: '2025-09-05',
    description: 'Plumbing — Commercial Fitout',
    category: 'trade',
    amount: 2800.00,
    platform: 'Direct Transfer',
    taxBreakdown: {
      grossIncome: 2800,
      incomeTax: 490,
      medicareLevy: 56,
      gst: 254.55,
      studentLoan: 0,
      superContribution: 322.00,
      totalDeductions: 1122.55,
      netIncome: 1677.45,
      effectiveTaxRate: 28.6,
    },
  },
  {
    id: 'inc_005',
    date: '2025-08-28',
    description: 'DoorDash Delivery — August',
    category: 'delivery',
    amount: 890.00,
    platform: 'DoorDash',
    taxBreakdown: {
      grossIncome: 890,
      incomeTax: 148,
      medicareLevy: 17.8,
      gst: 80.91,
      studentLoan: 0,
      superContribution: 102.35,
      totalDeductions: 349.06,
      netIncome: 540.94,
      effectiveTaxRate: 27.7,
    },
  },
];

export const MOCK_EXPENSES: ExpenseTransaction[] = [
  {
    id: 'exp_001',
    date: '2025-09-18',
    description: 'Fuel — Work trips',
    category: 'vehicle',
    amount: 145.00,
    deductibleAmount: 145.00,
    deductiblePercent: 100,
    hasReceipt: true,
    notes: 'BP Station — Chatswood',
  },
  {
    id: 'exp_002',
    date: '2025-09-16',
    description: 'MacBook Pro Accessories',
    category: 'equipment',
    amount: 289.00,
    deductibleAmount: 231.20,
    deductiblePercent: 80,
    hasReceipt: true,
  },
  {
    id: 'exp_003',
    date: '2025-09-12',
    description: 'Adobe Creative Cloud — Annual',
    category: 'software',
    amount: 79.99,
    deductibleAmount: 79.99,
    deductiblePercent: 100,
    hasReceipt: true,
  },
  {
    id: 'exp_004',
    date: '2025-09-08',
    description: 'Mobile Phone Plan',
    category: 'phone',
    amount: 69.00,
    deductibleAmount: 55.20,
    deductiblePercent: 80,
    hasReceipt: false,
  },
  {
    id: 'exp_005',
    date: '2025-09-02',
    description: 'Public Liability Insurance',
    category: 'insurance',
    amount: 420.00,
    deductibleAmount: 420.00,
    deductiblePercent: 100,
    hasReceipt: true,
  },
];

export const MOCK_ALLOCATION_SETTINGS = {
  enableGST: true,
  enableStudentLoan: false,
  studentLoanRate: 0.02,
  superRate: 0.115,
  customSuperRate: false,
};
