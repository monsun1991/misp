import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DarkModeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleDarkMode: () => {
        const newDarkMode = !get().isDarkMode;
        set({ isDarkMode: newDarkMode });
        
        // Apply dark mode class to document
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      },
      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
        
        // Apply dark mode class to document
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      },
    }),
    {
      name: 'dark-mode-storage', // unique name for localStorage key
      onRehydrateStorage: () => (state) => {
        // Apply dark mode class when rehydrating from localStorage
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      },
    }
  )
);
