import { create } from 'zustand';
import { NarrationCue, NarrationEffect } from '../types/narration';

interface NarrationStoreState {
  activeCues: NarrationCue[];
  activeEffects: NarrationEffect[];
  idleTime: number;

  setCues: (cues: NarrationCue[]) => void;
  fireCue: (id: string) => void;
  addEffect: (effect: NarrationEffect) => void;
  removeEffect: (type: string) => void;
  clearEffects: () => void;
  setIdleTime: (t: number) => void;
  resetIdleTime: () => void;
}

export const useNarrationStore = create<NarrationStoreState>((set, get) => ({
  activeCues: [],
  activeEffects: [],
  idleTime: 0,

  setCues: (cues) => set({ activeCues: cues }),
  fireCue: (id) => set({
    activeCues: get().activeCues.map((c) =>
      c.id === id ? { ...c, fired: true } : c
    ),
  }),
  addEffect: (effect) => set({ activeEffects: [...get().activeEffects, effect] }),
  removeEffect: (type) => set({
    activeEffects: get().activeEffects.filter((e) => e.type !== type),
  }),
  clearEffects: () => set({ activeEffects: [] }),
  setIdleTime: (t) => set({ idleTime: t }),
  resetIdleTime: () => set({ idleTime: 0 }),
}));
