import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  notificationTimes: string[];
  currency: string;
  cigaretteCost: number;
  cigarettesPerDay: number;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationTimes: (times: string[]) => void;
  setCurrency: (currency: string) => void;
  setCigaretteCost: (cost: number) => void;
  setCigarettesPerDay: (count: number) => void;
  updateSettings: (settings: Partial<Omit<SettingsStore, 'updateSettings' | 'setTheme' | 'setNotificationsEnabled' | 'setNotificationTimes' | 'setCurrency' | 'setCigaretteCost' | 'setCigarettesPerDay'>>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'system',
      notificationsEnabled: true,
      notificationTimes: ['09:00', '14:00', '20:00'],
      currency: 'USD',
      cigaretteCost: 0,
      cigarettesPerDay: 0,

      // Actions
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationTimes: (times) => set({ notificationTimes: times }),
      setCurrency: (currency) => set({ currency }),
      setCigaretteCost: (cost) => set({ cigaretteCost: cost }),
      setCigarettesPerDay: (count) => set({ cigarettesPerDay: count }),
      updateSettings: (settings) => set(settings),
    }),
    {
      name: 'settings-storage',
    }
  )
);
