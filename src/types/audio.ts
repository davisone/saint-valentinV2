export type AudioLayerType =
  | 'ambientBase'
  | 'ambientSecondary'
  | 'reactive'
  | 'music'
  | 'sfx'
  | 'heartbeat'
  | 'positional'
  | 'transition';

export interface AudioLayer {
  id: string;
  type: AudioLayerType;
  src: string;
  volume: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
  rate?: number;
}

export interface AudioState {
  isMuted: boolean;
  masterVolume: number;
  activeLayers: Map<string, AudioLayer>;
  isInitialized: boolean;
}

export interface CrossfadeConfig {
  duration: number;
  curve: 'linear' | 'exponential' | 'cosine';
}
