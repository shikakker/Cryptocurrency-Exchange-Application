import { create } from 'zustand';
import { Transaction } from '../types';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        {
          ...transaction,
          id: Math.random().toString(),
          timestamp: Date.now(),
        },
        ...state.transactions,
      ],
    })),
}));