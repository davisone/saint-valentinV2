import { useEffect, useRef } from 'react';
import { audioEngine } from '../systems/AudioEngine';
import { useAudioStore } from '../store/useAudioStore';

interface AmbientAudioConfig {
  id: string;
  src: string;
  volume?: number;
  loop?: boolean;
  fadeIn?: number;
  layer?: string;
}

export function useAmbientAudio(configs: AmbientAudioConfig[], active = true) {
  const isMuted = useAudioStore((s) => s.isMuted);
  const playedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!active) return;

    audioEngine.initialize();

    for (const config of configs) {
      if (!playedRef.current.has(config.id)) {
        audioEngine.play(config.id, config.src, {
          volume: config.volume ?? 0.3,
          loop: config.loop ?? true,
          fadeIn: config.fadeIn ?? 2000,
          layer: config.layer ?? 'ambient',
        });
        playedRef.current.add(config.id);
      }
    }

    return () => {
      for (const config of configs) {
        audioEngine.stop(config.id, 2000);
        playedRef.current.delete(config.id);
      }
    };
  }, [configs, active]);

  useEffect(() => {
    audioEngine.mute(isMuted);
  }, [isMuted]);
}
