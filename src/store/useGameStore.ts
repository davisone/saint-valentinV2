import { create } from 'zustand';
import { UniverseIndex, PuzzleState } from '../types/universe';

interface GameState {
  currentUniverse: UniverseIndex;
  isTransitioning: boolean;
  isComplete: boolean;
  sessionId: string | null;
  secretCode: string | null;
  emailSent: boolean;
  emailAddress: string | null;
  startTime: number;
  universeStates: Record<number, {
    isCompleted: boolean;
    puzzle: PuzzleState;
    startedAt: number | null;
    completedAt: number | null;
    buttonInteractions: number;
  }>;

  // Actions
  setUniverse: (index: UniverseIndex) => void;
  setTransitioning: (value: boolean) => void;
  completeUniverse: (index: UniverseIndex) => void;
  advanceToNextUniverse: () => void;
  setSessionId: (id: string) => void;
  setSecretCode: (code: string) => void;
  setEmailSent: (sent: boolean, address?: string) => void;
  updatePuzzle: (index: UniverseIndex, puzzle: Partial<PuzzleState>) => void;
  incrementButtonInteraction: (index: UniverseIndex) => void;
  setComplete: (value: boolean) => void;
  reset: () => void;
}

const createInitialUniverseStates = () => {
  const states: GameState['universeStates'] = {};
  for (let i = 0; i <= 9; i++) {
    states[i] = {
      isCompleted: false,
      puzzle: { isActive: false, isSolved: false, attempts: 0, data: {} },
      startedAt: null,
      completedAt: null,
      buttonInteractions: 0,
    };
  }
  return states;
};

export const useGameStore = create<GameState>((set, get) => ({
  currentUniverse: 0,
  isTransitioning: false,
  isComplete: false,
  sessionId: null,
  secretCode: null,
  emailSent: false,
  emailAddress: null,
  startTime: Date.now(),
  universeStates: createInitialUniverseStates(),

  setUniverse: (index) => set({
    currentUniverse: index,
    universeStates: {
      ...get().universeStates,
      [index]: {
        ...get().universeStates[index],
        startedAt: get().universeStates[index].startedAt ?? Date.now(),
      },
    },
  }),

  setTransitioning: (value) => set({ isTransitioning: value }),

  completeUniverse: (index) => set({
    universeStates: {
      ...get().universeStates,
      [index]: {
        ...get().universeStates[index],
        isCompleted: true,
        completedAt: Date.now(),
        puzzle: { ...get().universeStates[index].puzzle, isSolved: true },
      },
    },
  }),

  advanceToNextUniverse: () => {
    const current = get().currentUniverse;
    if (current < 9) {
      const next = (current + 1) as UniverseIndex;
      get().completeUniverse(current);
      set({ isTransitioning: true });
      // The TransitionOrchestrator will call setUniverse after animation
      setTimeout(() => {
        set({
          currentUniverse: next,
          isTransitioning: false,
          universeStates: {
            ...get().universeStates,
            [next]: {
              ...get().universeStates[next],
              startedAt: Date.now(),
            },
          },
        });
      }, 3500);
    } else {
      get().completeUniverse(current);
      set({ isComplete: true });
    }
  },

  setSessionId: (id) => set({ sessionId: id }),
  setSecretCode: (code) => set({ secretCode: code }),
  setEmailSent: (sent, address) => set({ emailSent: sent, emailAddress: address ?? get().emailAddress }),

  updatePuzzle: (index, puzzle) => set({
    universeStates: {
      ...get().universeStates,
      [index]: {
        ...get().universeStates[index],
        puzzle: { ...get().universeStates[index].puzzle, ...puzzle },
      },
    },
  }),

  incrementButtonInteraction: (index) => set({
    universeStates: {
      ...get().universeStates,
      [index]: {
        ...get().universeStates[index],
        buttonInteractions: get().universeStates[index].buttonInteractions + 1,
      },
    },
  }),

  setComplete: (value) => set({ isComplete: value }),

  reset: () => set({
    currentUniverse: 0,
    isTransitioning: false,
    isComplete: false,
    secretCode: null,
    emailSent: false,
    emailAddress: null,
    startTime: Date.now(),
    universeStates: createInitialUniverseStates(),
  }),
}));
