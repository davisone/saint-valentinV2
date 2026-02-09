import { ButtonBehaviorType } from './universe';

export interface ButtonEmotionalState {
  trust: number;       // 0-100, grows across universes
  curiosity: number;   // 0-100
  courage: number;     // 0-100
  playfulness: number; // 0-100
  fatigue: number;     // 0-100
}

export interface ButtonPosition {
  x: number;
  y: number;
}

export interface ButtonState {
  position: ButtonPosition;
  isVisible: boolean;
  isClickable: boolean;
  currentBehavior: ButtonBehaviorType;
  emotionalState: ButtonEmotionalState;
  comfortRadius: number;
  escapeAttempts: number;
  trail: ButtonPosition[];
}

export interface ButtonAIConfig {
  universeIndex: number;
  comfortRadius: number;
  behaviors: ButtonBehaviorType[];
  initialTrust: number;
}
