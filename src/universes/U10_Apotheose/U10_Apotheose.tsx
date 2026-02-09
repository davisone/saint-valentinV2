import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { UniverseShell } from '../../components/core/UniverseShell';
import { ParticleField } from '../../components/ui/ParticleField';
import { Vignette } from '../../components/ui/Vignette';
import { useGameStore } from '../../store/useGameStore';
import { MouseState } from '../../hooks/useMousePhysics';
import styles from './U10_Apotheose.module.css';

interface Props {
  mouse: MouseState;
}

function U10_Apotheose({ mouse }: Props) {
  const [phase, setPhase] = useState<'approach' | 'click' | 'explosion' | 'message'>('approach');
  const [showNon, setShowNon] = useState(true);
  const setComplete = useGameStore((s) => s.setComplete);
  const explosionRef = useRef<HTMLDivElement>(null);

  // Fade out "Non" button
  useEffect(() => {
    const timer = setTimeout(() => setShowNon(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = useCallback(() => {
    setPhase('click');

    // Explosion sequence
    setTimeout(() => {
      setPhase('explosion');

      if (explosionRef.current) {
        gsap.fromTo(
          explosionRef.current,
          { scale: 0, opacity: 1 },
          {
            scale: 5,
            opacity: 0,
            duration: 3,
            ease: 'power2.out',
            onComplete: () => setPhase('message'),
          },
        );
      } else {
        setTimeout(() => setPhase('message'), 3000);
      }
    }, 500);

    setTimeout(() => {
      setComplete(true);
    }, 8000);
  }, [setComplete]);

  return (
    <UniverseShell ambientColor="#1a1000">
      <div className={styles.goldenGradient} />
      <ParticleField
        count={80}
        colors={['#ffd700', '#ffaa00', '#fff8dc', '#ff6b8a']}
        speed={0.3}
        sizeRange={[1, 3]}
      />
      <Vignette color="rgba(50, 40, 0, 1)" intensity={0.4} />

      {/* Approach phase — button is vulnerable, center screen */}
      {phase === 'approach' && (
        <>
          <motion.button
            className={styles.ouiButton}
            onClick={handleClick}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 1 }}
            whileHover={{ scale: 1.08 }}
          >
            Oui
          </motion.button>

          <AnimatePresence>
            {showNon && (
              <motion.div
                className={styles.nonButton}
                initial={{ opacity: 0.5 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 3 }}
              >
                Non
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Explosion */}
      {(phase === 'click' || phase === 'explosion') && (
        <div ref={explosionRef} className={styles.explosion} />
      )}

      {/* Final message */}
      <AnimatePresence>
        {phase === 'message' && (
          <motion.div
            className={styles.messageContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
          >
            <motion.div
              className={styles.loveMessage}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 2 }}
            >
              <p className={styles.messageTitle}>Julie,</p>
              <p className={styles.messageBody}>
                T'as mis le temps quand même
                T'as galéré un peu sur tous je pense,mais tkt c'est pas grave.
              </p>
              <p className={styles.messageBody}>
                Mais t'as réussi. Bravo.
                Même Roy aurait fait plus vite.
                Enfin bon, c'est fait maintenant.
              </p>
              <p className={styles.messageSignature}>
                Bonne Saint-Valentin quand même.
              </p>
            </motion.div>

            <ParticleField
              count={120}
              colors={['#ffd700', '#ff6b8a', '#fff', '#ffaa00']}
              speed={0.8}
              sizeRange={[2, 6]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </UniverseShell>
  );
}

export default U10_Apotheose;
