import { NarrationCue, NarrationEffect, NarrationTrigger } from '../types/narration';

export class NarrationEngine {
  private cues: NarrationCue[] = [];
  private activeEffects: NarrationEffect[] = [];
  private listeners: Array<(effects: NarrationEffect[]) => void> = [];

  setCues(cues: NarrationCue[]): void {
    this.cues = cues.map((c) => ({ ...c, fired: false }));
  }

  addCue(cue: NarrationCue): void {
    this.cues.push({ ...cue, fired: false });
  }

  evaluate(trigger: NarrationTrigger, value: number): void {
    for (const cue of this.cues) {
      if (cue.fired && cue.once) continue;
      if (cue.trigger !== trigger) continue;
      if (value < cue.triggerThreshold) continue;

      cue.fired = true;
      this.fireEffects(cue.effects);
    }
  }

  private fireEffects(effects: NarrationEffect[]): void {
    for (const effect of effects) {
      this.activeEffects.push(effect);
      this.notifyListeners();

      // Auto-remove after duration
      if (effect.duration > 0) {
        setTimeout(() => {
          this.activeEffects = this.activeEffects.filter((e) => e !== effect);
          this.notifyListeners();
        }, effect.duration);
      }
    }
  }

  onEffectsChange(listener: (effects: NarrationEffect[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener([...this.activeEffects]);
    }
  }

  getActiveEffects(): NarrationEffect[] {
    return [...this.activeEffects];
  }

  clear(): void {
    this.cues = [];
    this.activeEffects = [];
    this.notifyListeners();
  }
}

export const narrationEngine = new NarrationEngine();
