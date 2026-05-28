import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

interface UIStoreState {
  alerts: Alert[];
  addAlert: (message: string, type?: AlertType) => void;
  removeAlert: (id: string) => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  alerts: [],
  addAlert: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      alerts: [...state.alerts, { id, type, message }],
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        alerts: state.alerts.filter((a) => a.id !== id),
      }));
    }, 5000);
  },
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
}));
