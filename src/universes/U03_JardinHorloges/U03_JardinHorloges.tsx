import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { Vignette } from '../../components/ui/Vignette';
import { FloatingText } from '../../components/ui/FloatingText';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import { randomInRange } from '../../utils/math';
import styles from './U03_JardinHorloges.module.css';

interface Props {
  mouse: MouseState;
}

const CLICKS_TO_WIN = 4;
const APPEAR_DURATION = 2000;
const DISAPPEAR_DURATION = 800;

function U03_JardinHorloges({ mouse }: Props) {
  const { complete, startPuzzle } = useUniversePuzzle(3);
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [clicks, setClicks] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    startPuzzle();
    const timer = setTimeout(() => setPhase('play'), 3500);
    return () => clearTimeout(timer);
  }, [startPuzzle]);

  const spawnButton = useCallback(() => {
    const margin = 100;
    const x = randomInRange(margin, window.innerWidth - margin);
    const y = randomInRange(margin, window.innerHeight - margin);
    setButtonPos({ x, y });
    setButtonVisible(true);

    timerRef.current = setTimeout(() => {
      setButtonVisible(false);
      timerRef.current = setTimeout(() => {
        if (clicksRef.current < CLICKS_TO_WIN) {
          spawnButton();
        }
      }, DISAPPEAR_DURATION);
    }, APPEAR_DURATION);
  }, []);

  useEffect(() => {
    if (phase !== 'play') return;
    spawnButton();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, spawnButton]);

  const handleClick = useCallback(() => {
    if (phase !== 'play') return;

    if (timerRef.current) clearTimeout(timerRef.current);

    const newClicks = clicksRef.current + 1;
    clicksRef.current = newClicks;
    setClicks(newClicks);
    setButtonVisible(false);

    if (newClicks >= CLICKS_TO_WIN) {
      setPhase('done');
      setTimeout(() => complete(), 2000);
    } else {
      timerRef.current = setTimeout(() => {
        spawnButton();
      }, DISAPPEAR_DURATION);
    }
  }, [phase, complete, spawnButton]);

  // Decorative clock angles
  const clockAngles = useRef(
    Array.from({ length: 6 }, () => Math.random() * 360),
  ).current;

  const clockPositions = useRef([
    { x: 0.2, y: 0.2 }, { x: 0.5, y: 0.15 }, { x: 0.8, y: 0.25 },
    { x: 0.15, y: 0.6 }, { x: 0.5, y: 0.55 }, { x: 0.85, y: 0.65 },
  ]).current;

  return (
    <UniverseShell ambientColor="#1a0f2e">
      {/* Garden background */}
      <div className={styles.garden} />

      {/* Tick overlay */}
      <div className={styles.tickOverlay} />

      {/* Decorative clocks */}
      {clockPositions.map((pos, i) => (
        <div
          key={i}
          className={styles.clock}
          style={{
            left: `${pos.x * 100}%`,
            top: `${pos.y * 100}%`,
          }}
        >
          <div className={styles.clockFace}>
            <div
              className={styles.hourHand}
              style={{ transform: `rotate(${clockAngles[i]}deg)` }}
            />
            <div className={styles.clockCenter} />
          </div>
        </div>
      ))}

      {/* Intro */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            className={styles.introContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <FloatingText
              text="Le temps presse"
              letterByLetter
              fontSize="1.8rem"
              color="rgba(200, 180, 255, 0.8)"
              delay={0.5}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      {phase === 'play' && (
        <div className={styles.progress}>
          {Array.from({ length: CLICKS_TO_WIN }).map((_, i) => (
            <span
              key={i}
              className={`${styles.clockIcon} ${i < clicks ? styles.clockIconActive : ''}`}
            >
              &#x23F0;
            </span>
          ))}
        </div>
      )}

      {/* Appearing/disappearing Oui button */}
      <AnimatePresence>
        {phase === 'play' && buttonVisible && (
          <motion.div
            key={`btn-${clicks}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ position: 'fixed', left: 0, top: 0, width: 0, height: 0, zIndex: 50 }}
          >
            <OuiButton
              onClick={handleClick}
              label="Oui"
              disableAI
              overridePosition={buttonPos}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            className={styles.doneMessage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            A quoi sert le million si tu prends perpet ?
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sundial */}
      <div className={styles.sundial}>
        <div className={styles.sundialShadow} />
      </div>

      <Vignette color="#1a0f2e" intensity={0.6} />
    </UniverseShell>
  );
}

export default U03_JardinHorloges;
