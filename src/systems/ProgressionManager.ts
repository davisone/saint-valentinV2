import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { UniverseIndex } from '../types/universe';
import { SessionData, UniverseCompletion } from '../types/progression';

const STORAGE_KEY = 'saint-valentin-session';

export class ProgressionManager {
  private session: SessionData | null = null;

  async initialize(): Promise<SessionData> {
    // Try to restore from localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.session = JSON.parse(stored);
        // Sync with Firebase if configured
        if (isFirebaseConfigured() && this.session) {
          await this.syncToFirebase();
        }
        return this.session!;
      } catch {
        // Corrupted data, start fresh
      }
    }

    // Create new session
    this.session = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentUniverse: 0,
      isComplete: false,
      emailSent: false,
      emailAddress: null,
      totalTimeSeconds: 0,
      secretCode: null,
    };

    this.saveLocal();

    if (isFirebaseConfigured()) {
      await this.createFirebaseSession();
    }

    return this.session;
  }

  getSession(): SessionData | null {
    return this.session;
  }

  async updateUniverse(index: UniverseIndex): Promise<void> {
    if (!this.session) return;
    this.session.currentUniverse = index;
    this.session.updatedAt = new Date().toISOString();
    this.saveLocal();

    if (isFirebaseConfigured() && db) {
      await updateDoc(doc(db, 'sessions', this.session.id), {
        current_universe: index,
        updated_at: this.session.updatedAt,
      });
    }
  }

  async completeUniverse(completion: UniverseCompletion): Promise<void> {
    if (!this.session) return;
    this.saveLocal();

    if (isFirebaseConfigured() && db) {
      await addDoc(collection(db, 'universe_completions'), {
        session_id: this.session.id,
        universe_index: completion.universeIndex,
        universe_name: completion.universeName,
        started_at: completion.startedAt,
        completed_at: completion.completedAt,
        time_spent_seconds: completion.timeSpentSeconds,
        puzzle_attempts: completion.puzzleAttempts,
        puzzle_solved: completion.puzzleSolved,
        button_interactions: completion.buttonInteractions,
        idle_time_seconds: completion.idleTimeSeconds,
      });
    }
  }

  async setEmailSent(email: string): Promise<void> {
    if (!this.session) return;
    this.session.emailSent = true;
    this.session.emailAddress = email;
    this.saveLocal();

    if (isFirebaseConfigured() && db) {
      await updateDoc(doc(db, 'sessions', this.session.id), {
        email_sent: true,
        email_address: email,
      });
    }
  }

  async setSecretCode(code: string): Promise<void> {
    if (!this.session) return;
    this.session.secretCode = code;
    this.saveLocal();
  }

  async markComplete(): Promise<void> {
    if (!this.session) return;
    this.session.isComplete = true;
    this.session.updatedAt = new Date().toISOString();
    this.session.totalTimeSeconds = Math.floor(
      (Date.now() - new Date(this.session.createdAt).getTime()) / 1000,
    );
    this.saveLocal();

    if (isFirebaseConfigured() && db) {
      await updateDoc(doc(db, 'sessions', this.session.id), {
        is_complete: true,
        updated_at: this.session.updatedAt,
        total_time_seconds: this.session.totalTimeSeconds,
      });
    }
  }

  private saveLocal(): void {
    if (this.session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
    }
  }

  private async syncToFirebase(): Promise<void> {
    if (!db || !this.session) return;
    const snap = await getDoc(doc(db, 'sessions', this.session.id));
    if (!snap.exists()) {
      await this.createFirebaseSession();
    }
  }

  private async createFirebaseSession(): Promise<void> {
    if (!db || !this.session) return;
    await setDoc(doc(db, 'sessions', this.session.id), {
      created_at: this.session.createdAt,
      updated_at: this.session.updatedAt,
      current_universe: this.session.currentUniverse,
      is_complete: false,
      email_sent: false,
    });
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.session = null;
  }
}

export const progressionManager = new ProgressionManager();
