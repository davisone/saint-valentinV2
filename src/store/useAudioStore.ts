import { create } from 'zustand';

interface AudioStoreState {
  isMuted: boolean;
  masterVolume: number;
  isInitialized: boolean;
  activeLayerIds: string[];

  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;
  setInitialized: (value: boolean) => void;
  addLayer: (id: string) => void;
  removeLayer: (id: string) => void;
  clearLayers: () => void;
}

export const useAudioStore = create<AudioStoreState>((set, get) => ({
  isMuted: false,
  masterVolume: 0.8,
  isInitialized: false,
  activeLayerIds: [],

  toggleMute: () => set({ isMuted: !get().isMuted }),
  setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
  setInitialized: (value) => set({ isInitialized: value }),
  addLayer: (id) => set({ activeLayerIds: [...new Set([...get().activeLayerIds, id])] }),
  removeLayer: (id) => set({ activeLayerIds: get().activeLayerIds.filter((l) => l !== id) }),
  clearLayers: () => set({ activeLayerIds: [] }),
}));
