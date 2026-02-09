import { CrossfadeConfig } from '../types/audio';

export const AUDIO_CONFIG = {
  masterVolume: 0.8,
  maxSimultaneousLayers: 8,
  defaultFadeIn: 2000,
  defaultFadeOut: 2000,
  heartbeatBPM: 72,
};

export const CROSSFADE_PRESETS: Record<string, CrossfadeConfig> = {
  default: { duration: 3000, curve: 'cosine' },
  quick: { duration: 1500, curve: 'linear' },
  dramatic: { duration: 4000, curve: 'exponential' },
};

// Placeholder paths — replace with actual royalty-free audio files
export const AUDIO_SOURCES = {
  heartbeat: '/assets/audio/sfx/heartbeat.mp3',
  ambientForest: '/assets/audio/ambient/forest.mp3',
  ambientOcean: '/assets/audio/ambient/ocean.mp3',
  ambientClockwork: '/assets/audio/ambient/clockwork.mp3',
  ambientLibrary: '/assets/audio/ambient/library.mp3',
  ambientMirrors: '/assets/audio/ambient/mirrors.mp3',
  ambientStars: '/assets/audio/ambient/stars.mp3',
  ambientFireplace: '/assets/audio/ambient/fireplace.mp3',
  ambientDigital: '/assets/audio/ambient/digital.mp3',
  ambientDesert: '/assets/audio/ambient/desert.mp3',
  ambientGolden: '/assets/audio/ambient/golden.mp3',
  musicMain: '/assets/audio/music/main-theme.mp3',
  musicApotheose: '/assets/audio/music/apotheose.mp3',
  sfxClick: '/assets/audio/sfx/click.mp3',
  sfxWhoosh: '/assets/audio/sfx/whoosh.mp3',
  sfxChime: '/assets/audio/sfx/chime.mp3',
  sfxGlass: '/assets/audio/sfx/glass-break.mp3',
  sfxSeal: '/assets/audio/sfx/wax-seal.mp3',
  sfxPlantGrow: '/assets/audio/sfx/plant-grow.mp3',
  sfxExplosion: '/assets/audio/sfx/golden-explosion.mp3',
};
