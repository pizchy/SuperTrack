import React, { createContext, useState, ReactNode, useCallback } from 'react';
import {
  MOCK_USER,
  MOCK_VIRTUAL_ACCOUNT,
  MOCK_INCOME,
  MOCK_EXPENSES,
  MOCK_ALLOCATION_SETTINGS,
  IncomeTransaction,
  ExpenseTransaction,
  VirtualAccount,
  UserProfile,
} from '@/services/mockData';
import {
  calculateTaxBreakdownForIncome,
  calculateYTDSummary,
  TaxBreakdown,
} from '@/services/taxCalculator';

export interface AllocationSettings {
  enableGST: boolean;
  enableStudentLoan: boolean;
  studentLoanRate: number;
  superRate: number;
  customSuperRate: boolean;
}

export interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Onboarding
  hasOnboarded: boolean;
  completeOnboarding: () => void;

  // Account
  virtualAccount: VirtualAccount;

  // Income
  incomeTransactions: IncomeTransaction[];
  addIncome: (
    amount: number,
    description: string,
    category: string,
    platform?: string
  ) => void;

  // Expenses
  expenseTransactions: ExpenseTransaction[];
  addExpense: (
    amount: number,
    description: string,
    category: string,
    deductiblePercent: number
  ) => void;

  // Allocations
  allocationSettings: AllocationSettings;
  updateAllocationSettings: (settings: Partial<AllocationSettings>) => void;

  // YTD Summary
  ytdSummary: TaxBreakdown;

  // Loading
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [user] = useState<UserProfile>(MOCK_USER);
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount>(MOCK_VIRTUAL_ACCOUNT);
  const [incomeTransactions, setIncomeTransactions] = useState<IncomeTransaction[]>(MOCK_INCOME);
  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseTransaction[]>(MOCK_EXPENSES);
  const [allocationSettings, setAllocationSettings] = useState<AllocationSettings>(MOCK_ALLOCATION_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const ytdSummary = calculateYTDSummary(incomeTransactions);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === 'alex@supertrack.com.au' && password === '123456') {
      setIsAuthenticated(true);
      return true;
    }
    if (email.length > 0 && password.length >= 6) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasOnboarded(true);
  }, []);

  const addIncome = useCallback(
    (amount: number, description: string, category: string, platform?: string) => {
      const ytdTotal = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const breakdown = calculateTaxBreakdownForIncome(amount, ytdTotal, allocationSettings);

      const newTransaction: IncomeTransaction = {
        id: `inc_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description,
        category,
        amount,
        platform: platform || 'Direct Transfer',
        taxBreakdown: breakdown,
      };

      setIncomeTransactions((prev) => [newTransaction, ...prev]);

      // Update virtual account
      setVirtualAccount((prev) => ({
        ...prev,
        balance: prev.balance + amount,
        taxReserve: prev.taxReserve + breakdown.incomeTax + breakdown.medicareLevy + breakdown.gst,
        superReserve: prev.superReserve + breakdown.superContribution,
        availableBalance: prev.availableBalance + breakdown.netIncome,
      }));
    },
    [incomeTransactions, allocationSettings]
  );

  const addExpense = useCallback(
    (amount: number, description: string, category: string, deductiblePercent: number) => {
      const deductibleAmount = amount * (deductiblePercent / 100);
      const newExpense: ExpenseTransaction = {
        id: `exp_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description,
        category,
        amount,
        deductibleAmount,
        deductiblePercent,
        hasReceipt: false,
      };
      setExpenseTransactions((prev) => [newExpense, ...prev]);
    },
    []
  );

  const updateAllocationSettings = useCallback((settings: Partial<AllocationSettings>) => {
    setAllocationSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        hasOnboarded,
        completeOnboarding,
        virtualAccount,
        incomeTransactions,
        addIncome,
        expenseTransactions,
        addExpense,
        allocationSettings,
        updateAllocationSettings,
        ytdSummary,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
