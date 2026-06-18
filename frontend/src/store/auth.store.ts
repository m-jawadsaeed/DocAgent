import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;

  setAuth: (user: User, accessToken: string) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,

      user: null,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
