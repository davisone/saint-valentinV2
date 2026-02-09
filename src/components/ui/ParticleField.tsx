import { useEffect, useRef } from 'react';
import { randomInRange } from '../../utils/math';
import styles from './ParticleField.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  speed?: number;
  sizeRange?: [number, number];
  className?: string;
}

export function ParticleField({
  count = 50,
  colors = ['#ffd700', '#fff', '#ff6b8a'],
  speed = 0.5,
  sizeRange = [1, 4],
  className = '',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: randomInRange(0, canvas.width),
      y: randomInRange(0, canvas.height),
      vx: randomInRange(-speed, speed),
      vy: randomInRange(-speed, speed),
      size: randomInRange(sizeRange[0], sizeRange[1]),
      opacity: randomInRange(0.2, 0.8),
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: randomInRange(100, 300),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulse opacity
        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * Math.sin(lifeRatio * Math.PI);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        // Fallback for hex colors
        if (p.color.startsWith('#')) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
        }
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.life >= p.maxLife) {
          p.life = 0;
          p.x = randomInRange(0, canvas.width);
          p.y = randomInRange(0, canvas.height);
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count, colors, speed, sizeRange]);

  return <canvas ref={canvasRef} className={`${styles.canvas} ${className}`} />;
}
