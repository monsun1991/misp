import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IPState {
  clientIP: string | null;
  setClientIP: (ip: string | null) => void;
}

export const useIPStore = create<IPState>()(
  persist(
    set => ({
      clientIP: null,
      setClientIP: ip => set({ clientIP: ip }),
    }),
    {
      name: "ip-storage",
    }
  )
);
