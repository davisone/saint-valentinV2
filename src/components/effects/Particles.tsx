import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// FLOATING HEARTS - For romantic scenes
// ============================================

interface FloatingHeart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export const FloatingHearts: React.FC<{
  count?: number;
  colors?: string[];
}> = ({ count = 15, colors = ['#FF3B30', '#FF6B6B', '#FF9999', '#FFB6C1'] }) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6,
      size: 12 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            position: 'absolute',
            left: `${heart.x}%`,
            bottom: '-50px',
            fontSize: heart.size,
            opacity: heart.opacity,
            color: colors[Math.floor(Math.random() * colors.length)],
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(heart.id) * 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// SPARKLES - For magical effects
// ============================================

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export const Sparkles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 20, color = '#FFD700' }) => {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 3,
    }));
  }, [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          style={{
            position: 'absolute',
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${sparkle.size * 2}px ${color}`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// CONFETTI - For celebrations
// ============================================

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

export const Confetti: React.FC<{
  active?: boolean;
  duration?: number;
}> = ({ active = true, duration = 5000 }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#FF3B30', '#34C759', '#007AFF', '#FFCC00', '#FF9500', '#5856D6', '#FF2D55'];
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8,
      }));
      setPieces(newPieces);

      const timeout = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [active, duration]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1000 }}>
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              style={{
                position: 'absolute',
                left: `${piece.x}%`,
                top: '-20px',
                width: piece.size,
                height: piece.size * 0.6,
                background: piece.color,
                borderRadius: '2px',
              }}
              initial={{ y: 0, rotate: piece.rotation, opacity: 1 }}
              animate={{
                y: window.innerHeight + 50,
                rotate: piece.rotation + 720,
                x: [0, Math.sin(piece.id) * 100, Math.cos(piece.id) * 50],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: piece.delay,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// SNOW - For winter/Netflix vibes
// ============================================

export const Snow: React.FC<{
  count?: number;
}> = ({ count = 50 }) => {
  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 10,
      drift: -20 + Math.random() * 40,
    }));
  }, [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {flakes.map((flake) => (
        <motion.div
          key={flake.id}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            background: 'white',
            borderRadius: '50%',
            opacity: 0.8,
            boxShadow: '0 0 4px white',
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            x: [0, flake.drift],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// STARS - For night sky/space
// ============================================

export const TwinklingStars: React.FC<{
  count?: number;
}> = ({ count = 100 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 2,
    }));
  }, [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: 'white',
            borderRadius: '50%',
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// BUBBLES - For underwater/fun effects
// ============================================

export const Bubbles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 20, color = 'rgba(135, 206, 235, 0.5)' }) => {
  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 10 + Math.random() * 30,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
    }));
  }, [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          style={{
            position: 'absolute',
            left: `${bubble.x}%`,
            bottom: '-50px',
            width: bubble.size,
            height: bubble.size,
            background: color,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(bubble.id) * 30],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// MINECRAFT PARTICLES
// ============================================

export const MinecraftParticles: React.FC<{
  type?: 'xp' | 'hearts' | 'smoke';
  x?: number;
  y?: number;
}> = ({ type = 'xp', x = 50, y = 50 }) => {
  const [particles, setParticles] = useState<{ id: number; offsetX: number; offsetY: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      offsetX: -20 + Math.random() * 40,
      offsetY: -20 + Math.random() * 40,
    }));
    setParticles(newParticles);

    const timeout = setTimeout(() => setParticles([]), 1000);
    return () => clearTimeout(timeout);
  }, [x, y]);

  const getParticleContent = () => {
    switch (type) {
      case 'xp':
        return '✨';
      case 'hearts':
        return '❤️';
      case 'smoke':
        return '💨';
      default:
        return '✨';
    }
  };

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'fixed',
            left: `${x}%`,
            top: `${y}%`,
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: particle.offsetX,
            y: particle.offsetY - 30,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {getParticleContent()}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// ============================================
// PULSE RING - For click feedback
// ============================================

export const PulseRing: React.FC<{
  x: number;
  y: number;
  color?: string;
  onComplete?: () => void;
}> = ({ x, y, color = '#FF3B30', onComplete }) => {
  return (
    <motion.div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    />
  );
};

// ============================================
// TYPING INDICATOR - For chat apps
// ============================================

export const TypingIndicator: React.FC<{
  color?: string;
}> = ({ color = '#8E8E93' }) => {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '8px 12px' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
          }}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// LOADING BAR - Minecraft style
// ============================================

export const MinecraftLoadingBar: React.FC<{
  progress: number;
  width?: number;
}> = ({ progress, width = 300 }) => {
  return (
    <div
      style={{
        width,
        height: 20,
        background: '#1a1a1a',
        border: '3px solid',
        borderColor: '#555 #222 #222 #555',
        position: 'relative',
        imageRendering: 'pixelated',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 3,
          top: 3,
          bottom: 3,
          width: `${Math.min(100, progress)}%`,
          background: 'linear-gradient(180deg, #5c8a2f 0%, #3d5c1f 100%)',
          transition: 'width 0.3s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 10,
          textShadow: '1px 1px 0 #000',
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
};
