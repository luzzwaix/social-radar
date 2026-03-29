import { create } from "zustand";

export const useUiStore = create((set) => ({
  activePanel: "overview",
  sidebarOpen: true,
  mapLayer: "all",
  explainabilityExpanded: false,
  toasts: [],
  turnFlashKey: 0,
  setActivePanel: (activePanel) => set({ activePanel }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMapLayer: (mapLayer) => set({ mapLayer }),
  toggleExplainability: () =>
    set((state) => ({ explainabilityExpanded: !state.explainabilityExpanded })),
  openExplainability: () => set({ explainabilityExpanded: true }),
  closeExplainability: () => set({ explainabilityExpanded: false }),
  addToast: ({ title, description, type = "info", duration = 2600 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [...state.toasts, { id, title, description, type }]
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id)
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    })),
  pulseTurnFlash: () =>
    set((state) => ({
      turnFlashKey: state.turnFlashKey + 1
    }))
}));
