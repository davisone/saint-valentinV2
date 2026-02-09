import { useEffect, useRef } from 'react';
import { MouseState } from '../../hooks/useMousePhysics';
import styles from './CursorTrail.module.css';

interface CursorTrailProps {
  mouse: MouseState;
  color?: string;
  enabled?: boolean;
}

export function CursorTrail({ mouse, color = 'rgba(255, 215, 0, 0.5)', enabled = false }: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Array<{ x: number; y: number; age: number }>>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    pointsRef.current.push({ x: mouse.x, y: mouse.y, age: 0 });
    if (pointsRef.current.length > 50) {
      pointsRef.current.shift();
    }
  }, [mouse.x, mouse.y, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      for (let i = 0; i < points.length; i++) {
        points[i].age += 0.02;
      }

      // Remove old points
      pointsRef.current = points.filter((p) => p.age < 1);

      if (pointsRef.current.length < 2) {
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.beginPath();
      ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);

      for (let i = 1; i < pointsRef.current.length; i++) {
        const p = pointsRef.current[i];
        const alpha = 1 - p.age;
        ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.lineWidth = (1 - p.age) * 4;
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [enabled, color]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
