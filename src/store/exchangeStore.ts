import { create } from 'zustand';
import { ExchangePath, ExchangeStep } from '../types';

interface ExchangeState {
  currentPath: ExchangePath | null;
  setExchangePath: (path: ExchangePath) => void;
  clearExchangePath: () => void;
}

export const useExchangeStore = create<ExchangeState>((set) => ({
  currentPath: null,
  setExchangePath: (path) => set({ currentPath: path }),
  clearExchangePath: () => set({ currentPath: null }),
}));