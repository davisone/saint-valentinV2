import { useMemo } from 'react';
import { MouseState } from './useMousePhysics';

export interface ParallaxLayer {
  x: number;
  y: number;
  depth: number;
}

export function useParallax(
  mouse: MouseState,
  layers: number = 3,
  intensity: number = 30,
): ParallaxLayer[] {
  return useMemo(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = (mouse.x - centerX) / centerX;
    const dy = (mouse.y - centerY) / centerY;

    return Array.from({ length: layers }, (_, i) => {
      const depth = (i + 1) / layers;
      return {
        x: -dx * intensity * depth,
        y: -dy * intensity * depth,
        depth,
      };
    });
  }, [mouse.x, mouse.y, layers, intensity]);
}
