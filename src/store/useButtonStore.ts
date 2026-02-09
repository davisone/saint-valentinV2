import { create } from 'zustand';
import { ButtonEmotionalState, ButtonPosition } from '../types/button';
import { ButtonBehaviorType } from '../types/universe';

interface ButtonStoreState {
  position: ButtonPosition;
  isVisible: boolean;
  isClickable: boolean;
  currentBehavior: ButtonBehaviorType;
  emotionalState: ButtonEmotionalState;
  comfortRadius: number;
  escapeAttempts: number;
  trail: ButtonPosition[];
  isCaught: boolean;

  setPosition: (pos: ButtonPosition) => void;
  setVisible: (v: boolean) => void;
  setClickable: (v: boolean) => void;
  setBehavior: (b: ButtonBehaviorType) => void;
  updateEmotion: (partial: Partial<ButtonEmotionalState>) => void;
  setComfortRadius: (r: number) => void;
  incrementEscape: () => void;
  addTrailPoint: (pos: ButtonPosition) => void;
  setCaught: (v: boolean) => void;
  resetForUniverse: (comfortRadius: number, trust: number, behaviors: ButtonBehaviorType[]) => void;
}

export const useButtonStore = create<ButtonStoreState>((set, get) => ({
  position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  isVisible: true,
  isClickable: false,
  currentBehavior: 'flee',
  emotionalState: {
    trust: 0,
    curiosity: 50,
    courage: 20,
    playfulness: 80,
    fatigue: 0,
  },
  comfortRadius: 300,
  escapeAttempts: 0,
  trail: [],
  isCaught: false,

  setPosition: (pos) => {
    const trail = [...get().trail, pos].slice(-30);
    set({ position: pos, trail });
  },
  setVisible: (v) => set({ isVisible: v }),
  setClickable: (v) => set({ isClickable: v }),
  setBehavior: (b) => set({ currentBehavior: b }),
  updateEmotion: (partial) => set({
    emotionalState: { ...get().emotionalState, ...partial },
  }),
  setComfortRadius: (r) => set({ comfortRadius: r }),
  incrementEscape: () => set({ escapeAttempts: get().escapeAttempts + 1 }),
  addTrailPoint: (pos) => set({ trail: [...get().trail, pos].slice(-30) }),
  setCaught: (v) => set({ isCaught: v }),

  resetForUniverse: (comfortRadius, trust, behaviors) => set({
    comfortRadius,
    escapeAttempts: 0,
    trail: [],
    isCaught: false,
    isVisible: true,
    isClickable: false,
    currentBehavior: behaviors[0] || 'flee',
    emotionalState: {
      ...get().emotionalState,
      trust,
      fatigue: 0,
    },
  }),
}));
