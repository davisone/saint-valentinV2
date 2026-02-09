export type UniverseIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface UniverseConfig {
  index: UniverseIndex;
  name: string;
  slug: string;
  description: string;
  buttonComfortRadius: number;
  buttonTrust: number;
  buttonBehaviors: ButtonBehaviorType[];
  audioLayers: string[];
  ambientColor: string;
  transitionDuration: number;
}

export type ButtonBehaviorType =
  | 'flee'
  | 'feint'
  | 'hesitate'
  | 'hide'
  | 'appear'
  | 'trustGrow'
  | 'disguise'
  | 'reflection'
  | 'serene'
  | 'flicker'
  | 'waxSeal'
  | 'still'
  | 'vulnerable';

export interface PuzzleState {
  isActive: boolean;
  isSolved: boolean;
  attempts: number;
  data: Record<string, unknown>;
}

export interface UniverseState {
  isActive: boolean;
  isCompleted: boolean;
  puzzle: PuzzleState;
  startedAt: number | null;
  completedAt: number | null;
}
