import { useCallback, useEffect, useRef, useState } from 'react';
import { isTouchDevice } from '../utils/dom';

export interface MouseState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  isMoving: boolean;
}

export function useMousePhysics() {
  const [mouse, setMouse] = useState<MouseState>({
    x: 0, y: 0,
    velocityX: 0, velocityY: 0,
    speed: 0, isMoving: false,
  });

  const prevRef = useRef({ x: 0, y: 0, time: Date.now() });

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const now = Date.now();
    const dt = Math.max(1, now - prevRef.current.time) / 1000;
    const vx = (clientX - prevRef.current.x) / dt;
    const vy = (clientY - prevRef.current.y) / dt;
    const speed = Math.sqrt(vx * vx + vy * vy);

    prevRef.current = { x: clientX, y: clientY, time: now };

    setMouse({
      x: clientX,
      y: clientY,
      velocityX: vx,
      velocityY: vy,
      speed,
      isMoving: speed > 5,
    });
  }, []);

  useEffect(() => {
    const isTouch = isTouchDevice();

    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };

    if (isTouch) {
      window.addEventListener('touchmove', onTouch, { passive: true });
      window.addEventListener('touchstart', onTouch, { passive: true });
    } else {
      window.addEventListener('mousemove', onMouse);
    }

    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
    };
  }, [handleMove]);

  return mouse;
}
