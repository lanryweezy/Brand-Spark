
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Budget, Expense, Invoice } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface FinancialsContextType {
  budgets: Budget[];
  brandBudgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (budgetId: string, updatedBudget: Partial<Budget>) => Promise<void>;
  deleteBudget: (budgetId: string) => Promise<void>;
  
  expenses: Expense[];
  brandExpenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expenseId: string, updatedExpense: Partial<Expense>) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  
  invoices: Invoice[];
  brandInvoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (invoiceId: string, updatedInvoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (invoiceId: string) => Promise<void>;

  getExpensesForBudget: (budgetId: string) => Expense[];
  isLoading: boolean;
}

const FinancialsContext = createContext<FinancialsContextType | undefined>(undefined);

export const FinancialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFinancials = async () => {
        setIsLoading(true);
        try {
            const [fetchedBudgets, fetchedExpenses, fetchedInvoices] = await Promise.all([
                apiService.fetchBudgets(),
                apiService.fetchExpenses(),
                apiService.fetchInvoices(),
            ]);
            setBudgets(fetchedBudgets);
            setExpenses(fetchedExpenses);
            setInvoices(fetchedInvoices);
        } catch (error) {
            console.error("Failed to load financial data", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadFinancials();
  }, []);

  // Budget CRUD
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    const newBudget = await apiService.addBudget(budget);
    setBudgets(prev => [...prev, newBudget]);
  };
  const updateBudget = async (id: string, updated: Partial<Budget>) => {
    const result = await apiService.updateBudget(id, updated);
    setBudgets(p => p.map(b => b.id === id ? result : b));
  };
  const deleteBudget = async (id: string) => {
    await apiService.deleteBudget(id);
    setBudgets(p => p.filter(b => b.id !== id));
  };

  // Expense CRUD
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense = await apiService.addExpense(expense);
    setExpenses(prev => [...prev, newExpense]);
  };
  const updateExpense = async (id: string, updated: Partial<Expense>) => {
    const result = await apiService.updateExpense(id, updated);
    setExpenses(p => p.map(e => e.id === id ? result : e));
  };
  const deleteExpense = async (id: string) => {
    await apiService.deleteExpense(id);
    setExpenses(p => p.filter(e => e.id !== id));
  };
  
  // Invoice CRUD
  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = await apiService.addInvoice(invoice);
    setInvoices(prev => [...prev, newInvoice]);
  };
  const updateInvoice = async (id: string, updated: Partial<Invoice>) => {
    const result = await apiService.updateInvoice(id, updated);
    setInvoices(p => p.map(i => i.id === id ? result : i));
  };
  const deleteInvoice = async (id: string) => {
    await apiService.deleteInvoice(id);
    setInvoices(p => p.filter(i => i.id !== id));
  };

  // Memoized selectors for current brand
  const brandBudgets = useMemo(() => budgets.filter(b => b.brandId === currentBrand?.id), [budgets, currentBrand]);
  const brandExpenses = useMemo(() => expenses.filter(e => e.brandId === currentBrand?.id), [expenses, currentBrand]);
  const brandInvoices = useMemo(() => invoices.filter(i => i.brandId === currentBrand?.id), [invoices, currentBrand]);

  const getExpensesForBudget = (budgetId: string) => {
      return brandExpenses.filter(e => e.budgetId === budgetId);
  }

  const value = useMemo(() => ({
    budgets, brandBudgets, addBudget, updateBudget, deleteBudget,
    expenses, brandExpenses, addExpense, updateExpense, deleteExpense,
    invoices, brandInvoices, addInvoice, updateInvoice, deleteInvoice,
    getExpensesForBudget,
    isLoading
  }), [budgets, expenses, invoices, brandBudgets, brandExpenses, brandInvoices, isLoading]);

  return (
    <FinancialsContext.Provider value={value}>
      {children}
    </FinancialsContext.Provider>
  );
};

export const useFinancials = (): FinancialsContextType => {
  const context = useContext(FinancialsContext);
  if (context === undefined) {
    throw new Error('useFinancials must be used within a FinancialsProvider');
  }
  return context;
};
