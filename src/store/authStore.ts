import { create } from "zustand";

interface AuthState {
  user: unknown;
  isAuthenticated: boolean;
  isChecking: boolean;
  setUser: (user: unknown) => void;
  logout: () => void;
  setChecking: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isChecking: true,
  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
      isChecking: false,
    });
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isChecking: false,
    });
  },
  setChecking: (value) => set({ isChecking: value }),
}));
