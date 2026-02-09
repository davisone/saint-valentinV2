export type NarrationTrigger =
  | 'idle'
  | 'progression'
  | 'failure'
  | 'proximity'
  | 'time'
  | 'buttonInteraction';

export interface NarrationCue {
  id: string;
  trigger: NarrationTrigger;
  triggerThreshold: number;
  effects: NarrationEffect[];
  once: boolean;
  fired: boolean;
}

export type NarrationEffectType =
  | 'wind'
  | 'light'
  | 'sound'
  | 'particles'
  | 'fog'
  | 'camera'
  | 'color';

export interface NarrationEffect {
  type: NarrationEffectType;
  params: Record<string, unknown>;
  duration: number;
  easing?: string;
}
