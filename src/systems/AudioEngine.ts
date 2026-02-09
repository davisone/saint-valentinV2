import { Howl, Howler } from 'howler';
import { AUDIO_CONFIG, CROSSFADE_PRESETS } from '../config/audio';

interface ManagedSound {
  howl: Howl;
  id: string;
  layer: string;
  targetVolume: number;
}

export class AudioEngine {
  private sounds: Map<string, ManagedSound> = new Map();
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    Howler.volume(AUDIO_CONFIG.masterVolume);
    this.initialized = true;
  }

  isReady(): boolean {
    return this.initialized;
  }

  play(
    id: string,
    src: string,
    options: {
      layer?: string;
      volume?: number;
      loop?: boolean;
      fadeIn?: number;
      rate?: number;
    } = {},
  ): void {
    if (!this.initialized) this.initialize();

    // Don't re-create if already playing
    if (this.sounds.has(id)) return;

    const volume = options.volume ?? 0.5;
    const howl = new Howl({
      src: [src],
      loop: options.loop ?? true,
      volume: options.fadeIn ? 0 : volume,
      rate: options.rate ?? 1,
      onend: () => {
        if (!options.loop) this.sounds.delete(id);
      },
    });

    howl.play();

    if (options.fadeIn) {
      howl.fade(0, volume, options.fadeIn);
    }

    this.sounds.set(id, {
      howl,
      id,
      layer: options.layer ?? 'default',
      targetVolume: volume,
    });
  }

  stop(id: string, fadeOut?: number): void {
    const sound = this.sounds.get(id);
    if (!sound) return;

    if (fadeOut) {
      sound.howl.fade(sound.howl.volume(), 0, fadeOut);
      setTimeout(() => {
        sound.howl.stop();
        sound.howl.unload();
        this.sounds.delete(id);
      }, fadeOut);
    } else {
      sound.howl.stop();
      sound.howl.unload();
      this.sounds.delete(id);
    }
  }

  stopLayer(layer: string, fadeOut?: number): void {
    for (const [id, sound] of this.sounds) {
      if (sound.layer === layer) {
        this.stop(id, fadeOut);
      }
    }
  }

  stopAll(fadeOut?: number): void {
    for (const id of this.sounds.keys()) {
      this.stop(id, fadeOut);
    }
  }

  crossfade(
    fromId: string,
    toId: string,
    toSrc: string,
    options: {
      duration?: number;
      toVolume?: number;
      toLoop?: boolean;
      layer?: string;
    } = {},
  ): void {
    const duration = options.duration ?? CROSSFADE_PRESETS.default.duration;
    const fromSound = this.sounds.get(fromId);

    // Fade out the old sound
    if (fromSound) {
      fromSound.howl.fade(fromSound.howl.volume(), 0, duration);
      setTimeout(() => {
        fromSound.howl.stop();
        fromSound.howl.unload();
        this.sounds.delete(fromId);
      }, duration);
    }

    // Fade in the new sound
    this.play(toId, toSrc, {
      layer: options.layer,
      volume: options.toVolume ?? 0.5,
      loop: options.toLoop ?? true,
      fadeIn: duration,
    });
  }

  setVolume(id: string, volume: number, duration?: number): void {
    const sound = this.sounds.get(id);
    if (!sound) return;

    if (duration) {
      sound.howl.fade(sound.howl.volume(), volume, duration);
    } else {
      sound.howl.volume(volume);
    }
    sound.targetVolume = volume;
  }

  setMasterVolume(volume: number): void {
    Howler.volume(volume);
  }

  mute(muted: boolean): void {
    Howler.mute(muted);
  }

  isPlaying(id: string): boolean {
    const sound = this.sounds.get(id);
    return sound?.howl.playing() ?? false;
  }

  getActiveSoundCount(): number {
    return this.sounds.size;
  }

  destroy(): void {
    this.stopAll();
    this.initialized = false;
  }
}

// Singleton
export const audioEngine = new AudioEngine();
