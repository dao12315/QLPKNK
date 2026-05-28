import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/src/types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isHydrated: boolean;
  isSessionChecked: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken?: string | null) => void;
  logout: () => void;
  setHydrated: (state: boolean) => void;
  setSessionChecked: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      isAuthenticated: false,
      isHydrated: false,
      isSessionChecked: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isSessionChecked: true,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      setTokens: (accessToken, refreshToken) =>
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        })),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isSessionChecked: true,
        }),

      setHydrated: (state) =>
        set({
          isHydrated: state,
        }),

      setSessionChecked: (state) =>
        set({
          isSessionChecked: state,
        }),
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.setHydrated(true);
      },
    },
  ),
);
