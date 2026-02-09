export const getViewportSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const isInViewport = (x: number, y: number, margin = 0): boolean => {
  const { width, height } = getViewportSize();
  return x >= -margin && x <= width + margin && y >= -margin && y <= height + margin;
};

export const clampToViewport = (
  x: number,
  y: number,
  padding = 50,
): { x: number; y: number } => {
  const { width, height } = getViewportSize();
  return {
    x: Math.max(padding, Math.min(width - padding, x)),
    y: Math.max(padding, Math.min(height - padding, y)),
  };
};

export const isTouchDevice = (): boolean =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
