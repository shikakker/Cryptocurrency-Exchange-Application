import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    // In a real app, this would make an API call
    set({ user: { email, id: Math.random().toString() } });
  },
  register: async (email: string, password: string) => {
    // In a real app, this would make an API call
    set({ user: { email, id: Math.random().toString() } });
  },
  logout: () => set({ user: null }),
}));