import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { FloatingText } from '../../components/ui/FloatingText';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import { useGameStore } from '../../store/useGameStore';
import { randomInRange, distance, clamp } from '../../utils/math';
import { clampToViewport } from '../../utils/dom';
import styles from './U01_CoursePoursuite.module.css';

interface Props {
  mouse: MouseState;
}

type Phase = 'intro' | 'chase' | 'missionPassed' | 'completing';

const CLICKS_TO_WIN = 5;
const BASE_SPEED = 2;
const SPEED_INCREMENT = 0.5;
const FLEE_DISTANCE = 150;
const TARGET_REACH = 50;
const FREEZE_DURATION = 150;

function U01_CoursePoursuite({ mouse }: Props) {
  const { complete, startPuzzle } = useUniversePuzzle(1);
  const incrementInteraction = useGameStore((s) => s.incrementButtonInteraction);

  const [phase, setPhase] = useState<Phase>('intro');
  const [clicks, setClicks] = useState(0);
  const [hitFlashes, setHitFlashes] = useState<{ id: number; x: number; y: number }[]>([]);

  // Car state stored in refs for rAF performance
  const carPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const carAngle = useRef(0);
  const targetPos = useRef({ x: randomInRange(100, window.innerWidth - 100), y: randomInRange(100, window.innerHeight - 100) });
  const frozenUntil = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const clicksRef = useRef(0);
  const phaseRef = useRef<Phase>('intro');
  const mouseRef = useRef(mouse);
  const rafRef = useRef(0);
  const flashIdRef = useRef(0);

  // Position state for React rendering (updated from rAF)
  const [renderPos, setRenderPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [renderAngle, setRenderAngle] = useState(0);

  // Keep refs in sync
  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Start puzzle & transition to chase after intro
  useEffect(() => {
    startPuzzle();
    const timer = setTimeout(() => setPhase('chase'), 4000);
    return () => clearTimeout(timer);
  }, [startPuzzle]);

  // Pick a new random target
  const pickNewTarget = useCallback(() => {
    targetPos.current = clampToViewport(
      randomInRange(80, window.innerWidth - 80),
      randomInRange(80, window.innerHeight - 80),
      80,
    );
  }, []);

  // requestAnimationFrame loop
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      if (phaseRef.current !== 'chase') return;

      const now = performance.now();
      if (now < frozenUntil.current) return;

      const pos = carPos.current;
      const target = targetPos.current;
      const currentSpeed = speedRef.current;
      const m = mouseRef.current;

      // Steering toward target
      let desiredAngle = Math.atan2(target.y - pos.y, target.x - pos.x);

      // After 3rd click, flee from mouse if close
      if (clicksRef.current >= 3) {
        const distToMouse = distance(pos.x, pos.y, m.x, m.y);
        if (distToMouse < FLEE_DISTANCE) {
          const fleeAngle = Math.atan2(pos.y - m.y, pos.x - m.x);
          desiredAngle = fleeAngle;
        }
      }

      // Smooth steering
      let angleDiff = desiredAngle - carAngle.current;
      // Normalize to [-PI, PI]
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      carAngle.current += angleDiff * 0.08;

      // Move
      pos.x += Math.cos(carAngle.current) * currentSpeed;
      pos.y += Math.sin(carAngle.current) * currentSpeed;

      // Clamp to viewport
      const clamped = clampToViewport(pos.x, pos.y, 40);
      pos.x = clamped.x;
      pos.y = clamped.y;

      // Check if reached target
      if (distance(pos.x, pos.y, target.x, target.y) < TARGET_REACH) {
        pickNewTarget();
      }

      // Update React state for render (~60fps is fine, rAF handles it)
      setRenderPos({ x: pos.x, y: pos.y });
      setRenderAngle(carAngle.current);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pickNewTarget]);

  // Handle car click
  const handleCarClick = useCallback(() => {
    if (phaseRef.current !== 'chase') return;

    incrementInteraction(1);

    const newClicks = clicksRef.current + 1;
    clicksRef.current = newClicks;
    setClicks(newClicks);

    // Speed up
    speedRef.current = BASE_SPEED + SPEED_INCREMENT * newClicks;

    // Freeze briefly
    frozenUntil.current = performance.now() + FREEZE_DURATION;

    // Hit flash at car position
    const id = ++flashIdRef.current;
    setHitFlashes((prev) => [...prev, { id, x: carPos.current.x, y: carPos.current.y }]);
    setTimeout(() => {
      setHitFlashes((prev) => prev.filter((f) => f.id !== id));
    }, 500);

    // Pick new target after freeze
    setTimeout(() => {
      pickNewTarget();
    }, FREEZE_DURATION);

    // Win condition
    if (newClicks >= CLICKS_TO_WIN) {
      setPhase('missionPassed');
      setTimeout(() => {
        setPhase('completing');
        complete();
      }, 3500);
    }
  }, [complete, pickNewTarget]);

  // Computed display speed (km/h)
  const displaySpeed = Math.round(clamp(speedRef.current * 40 + randomInRange(-5, 5), 60, 220));

  // Minimap dot position (normalized)
  const minimapDotX = (renderPos.x / window.innerWidth) * 80;
  const minimapDotY = (renderPos.y / window.innerHeight) * 80;

  return (
    <UniverseShell ambientColor="#0a0a12">
      {/* City backdrop */}
      <div className={styles.cityGrid} />
      <div className={styles.roadMarkings} />
      <div className={styles.buildings} />

      {/* Neon signs */}
      <div className={styles.neonSign} />
      <div className={styles.neonSign} />
      <div className={styles.neonSign} />
      <div className={styles.neonSign} />

      {/* ── Intro phase ── */}
      <AnimatePresence>
        {phase === 'intro' && (
          <>
            <div className={`${styles.cinematicBar} ${styles.cinematicBarTop} ${styles.cinematicBarVisible}`} />
            <div className={`${styles.cinematicBar} ${styles.cinematicBarBottom} ${styles.cinematicBarVisible}`} />
            <motion.div
              className={styles.missionBriefing}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FloatingText
                text="ATTRAPE LA VOITURE"
                letterByLetter
                fontSize="2.2rem"
                color="#ffd700"
                delay={0.8}
              />
              <motion.div
                className={styles.missionBriefingSub}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
              >
                Course-Poursuite
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HUD (visible during chase) ── */}
      {phase === 'chase' && (
        <>
          {/* Wanted stars */}
          <div className={styles.wantedStars}>
            {Array.from({ length: CLICKS_TO_WIN }).map((_, i) => (
              <span
                key={i}
                className={`${styles.star} ${i < clicks ? styles.starActive : ''}`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Mission text */}
          <div className={styles.missionText}>
            <div className={styles.missionLabel}>Mission</div>
            <div className={styles.missionObjective}>
              Attrape le Oui ({clicks}/{CLICKS_TO_WIN})
            </div>
          </div>

          {/* Speedometer */}
          <div className={styles.speedometer}>
            {displaySpeed} km/h
          </div>

          {/* Minimap */}
          <div className={styles.minimap}>
            <div
              className={styles.minimapDot}
              style={{ left: minimapDotX, top: minimapDotY }}
            />
          </div>
        </>
      )}

      {/* ── Car (native button during chase, OuiButton during missionPassed) ── */}
      {phase === 'chase' && (
        <button
          className={styles.carButton}
          style={{
            left: renderPos.x,
            top: renderPos.y,
            transform: `translate(-50%, -50%) rotate(${renderAngle}rad)`,
          }}
          onClick={handleCarClick}
        />
      )}

      {phase === 'missionPassed' && (
        <OuiButton
          onClick={() => {}}
          label="Oui"
          disableAI
          overridePosition={{ x: renderPos.x, y: renderPos.y }}
          className={styles.carRevealed}
        />
      )}

      {/* ── Hit flashes ── */}
      {hitFlashes.map((flash) => (
        <div
          key={flash.id}
          className={styles.hitFlash}
          style={{ left: flash.x, top: flash.y }}
        />
      ))}

      {/* ── Mission Passed overlay ── */}
      <AnimatePresence>
        {phase === 'missionPassed' && (
          <motion.div
            className={styles.missionPassedOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={styles.missionPassedText}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
            >
              Mission Passed
            </motion.div>
            <motion.div
              className={styles.respectText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              + AMOUR
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UniverseShell>
  );
}

export default U01_CoursePoursuite;
