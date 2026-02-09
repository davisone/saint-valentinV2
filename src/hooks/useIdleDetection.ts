import { useCallback, useEffect, useRef, useState } from 'react';

export function useIdleDetection(thresholdMs = 5000) {
  const [idleTime, setIdleTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const resetIdle = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsIdle(false);
    setIdleTime(0);
  }, []);

  useEffect(() => {
    const onActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', onActivity);
    window.addEventListener('mousedown', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('touchstart', onActivity);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      setIdleTime(elapsed);
      setIsIdle(elapsed >= thresholdMs);
    }, 500);

    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('mousedown', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('touchstart', onActivity);
      clearInterval(intervalRef.current);
    };
  }, [thresholdMs]);

  return { idleTime, isIdle, resetIdle };
}
