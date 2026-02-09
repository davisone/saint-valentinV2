import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { useGameStore } from '../../store/useGameStore';
import { MouseState } from '../../hooks/useMousePhysics';
import styles from './U10_Apotheose.module.css';

interface Props {
  mouse: MouseState;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  message?: string;
  particles: Particle[];
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

const FIREWORK_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF',
  '#5856D6', '#FF2D55', '#AF52DE', '#00C7BE', '#FFD700',
];

const HIDDEN_MESSAGES = [
  "T'as mis le temps...",
  "Mais t'as réussi !",
  "Roy est fier",
  "Nadine aussi",
  "❤️",
  "Bravo Julie",
  "C'était pas si dur",
  "Enfin...",
  "Je t'aime",
  "Bonne Saint-Valentin",
];

function U10_Apotheose({ mouse }: Props) {
  const [phase, setPhase] = useState<'intro' | 'fireworks' | 'finale'>('intro');
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [revealedMessages, setRevealedMessages] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const setComplete = useGameStore((s) => s.setComplete);

  // Generate stars for the night sky
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleDelay: Math.random() * 3,
    }));
  }, []);

  // Start fireworks phase after intro
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setPhase('fireworks'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Hide hint after first click
  useEffect(() => {
    if (clickCount > 0) {
      setShowHint(false);
    }
  }, [clickCount]);

  // Trigger finale after enough clicks
  useEffect(() => {
    if (clickCount >= 10 && phase === 'fireworks') {
      const timer = setTimeout(() => {
        setPhase('finale');
        setTimeout(() => setComplete(true), 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount, phase, setComplete]);

  const createFirework = useCallback((e: React.MouseEvent) => {
    if (phase !== 'fireworks') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const id = Date.now() + Math.random();

    // Get next message if available
    const messageIndex = clickCount % HIDDEN_MESSAGES.length;
    const message = HIDDEN_MESSAGES[messageIndex];

    // Create particles for the firework
    const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i / 20) * 360,
      distance: 50 + Math.random() * 100,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.2,
    }));

    const newFirework: Firework = { id, x, y, color, message, particles };

    setFireworks(prev => [...prev, newFirework]);
    setClickCount(prev => prev + 1);

    if (!revealedMessages.includes(message)) {
      setRevealedMessages(prev => [...prev, message]);
    }

    // Remove firework after animation
    setTimeout(() => {
      setFireworks(prev => prev.filter(f => f.id !== id));
    }, 2500);
  }, [phase, clickCount, revealedMessages]);

  return (
    <UniverseShell ambientColor="#0a0a20">
      {/* Night sky background */}
      <div className={styles.nightSky}>
        {/* Stars */}
        {stars.map(star => (
          <motion.div
            key={star.id}
            className={styles.star}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: star.twinkleDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Clickable area for fireworks */}
      <div className={styles.fireworksArea} onClick={createFirework}>
        {/* Intro message */}
        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div
              className={styles.introMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <h1>Bravo, t'as réussi !</h1>
              <p>Maintenant, crée ton feu d'artifice...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint to click */}
        <AnimatePresence>
          {phase === 'fireworks' && showHint && (
            <motion.div
              className={styles.clickHint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                👆 Clique partout !
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click counter */}
        {phase === 'fireworks' && clickCount > 0 && (
          <motion.div
            className={styles.clickCounter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {clickCount}/10
          </motion.div>
        )}

        {/* Fireworks */}
        <AnimatePresence>
          {fireworks.map(firework => (
            <motion.div
              key={firework.id}
              className={styles.firework}
              style={{ left: firework.x, top: firework.y }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Central flash */}
              <motion.div
                className={styles.fireworkCenter}
                style={{ background: firework.color }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 0.3 }}
              />

              {/* Particles */}
              {firework.particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className={styles.particle}
                  style={{
                    background: firework.color,
                    width: particle.size,
                    height: particle.size,
                    boxShadow: `0 0 ${particle.size * 2}px ${firework.color}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(particle.angle * Math.PI / 180) * particle.distance,
                    y: Math.sin(particle.angle * Math.PI / 180) * particle.distance,
                    opacity: [1, 1, 0],
                    scale: [1, 1.2, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Sparkle trails */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`trail-${i}`}
                  className={styles.sparkleTrail}
                  style={{ background: firework.color }}
                  initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
                  animate={{
                    x: Math.cos((i / 8) * 360 * Math.PI / 180) * 150,
                    y: Math.sin((i / 8) * 360 * Math.PI / 180) * 150 + 50,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 2,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Message */}
              {firework.message && (
                <motion.div
                  className={styles.fireworkMessage}
                  initial={{ opacity: 0, y: -20, scale: 0.5 }}
                  animate={{ opacity: 1, y: -60, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {firework.message}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Revealed messages sidebar */}
        {phase === 'fireworks' && revealedMessages.length > 0 && (
          <motion.div
            className={styles.messagesSidebar}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {revealedMessages.map((msg, i) => (
              <motion.div
                key={i}
                className={styles.revealedMessage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {msg}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Finale */}
        <AnimatePresence>
          {phase === 'finale' && (
            <motion.div
              className={styles.finale}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              {/* Big firework burst */}
              <div className={styles.finaleBurst}>
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={styles.finaleParticle}
                    style={{
                      background: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos((i / 50) * 360 * Math.PI / 180) * (150 + Math.random() * 150),
                      y: Math.sin((i / 50) * 360 * Math.PI / 180) * (150 + Math.random() * 150),
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>

              {/* Final message */}
              <motion.div
                className={styles.finaleMessage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
              >
                <motion.h1
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  Bonne Saint-Valentin
                </motion.h1>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  Julie ❤️
                </motion.p>
                <motion.p
                  className={styles.finaleSubtext}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.7 }}
                  transition={{ delay: 2.4 }}
                >
                  T'as mis {clickCount} clics quand même...
                </motion.p>
              </motion.div>

              {/* Continuous small fireworks in finale */}
              <div className={styles.finaleFireworks}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={styles.miniFirework}
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                      background: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UniverseShell>
  );
}

export default U10_Apotheose;
