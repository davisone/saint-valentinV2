import { UniverseIndex } from './universe';

export interface SessionData {
  id: string;
  createdAt: string;
  updatedAt: string;
  currentUniverse: UniverseIndex;
  isComplete: boolean;
  emailSent: boolean;
  emailAddress: string | null;
  totalTimeSeconds: number;
  secretCode: string | null;
}

export interface UniverseCompletion {
  universeIndex: UniverseIndex;
  universeName: string;
  startedAt: string;
  completedAt: string | null;
  timeSpentSeconds: number;
  puzzleAttempts: number;
  puzzleSolved: boolean;
  buttonInteractions: number;
  idleTimeSeconds: number;
}

export interface InteractionEvent {
  sessionId: string;
  universeIndex: UniverseIndex;
  timestamp: string;
  eventType: string;
  eventData: Record<string, unknown>;
}
