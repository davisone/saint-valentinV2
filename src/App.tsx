import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import { useMousePhysics } from './hooks/useMousePhysics';
import { useButtonBehavior } from './hooks/useButtonBehavior';
import { TransitionOverlay } from './components/core/TransitionOverlay';
import { NarrationLayer } from './components/core/NarrationLayer';
import { CursorTrail } from './components/core/CursorTrail';
import { ProgressIndicator } from './components/shared/ProgressIndicator';
import { progressionManager } from './systems/ProgressionManager';
import { UniverseIndex } from './types/universe';
import type { MouseState } from './hooks/useMousePhysics';

// Lazy load universes
const U00_Prelude = lazy(() => import('./universes/U00_Prelude/U00_Prelude'));
const U01_CoursePoursuite = lazy(() => import('./universes/U01_CoursePoursuite/U01_CoursePoursuite'));
const U02_YouTube = lazy(() => import('./universes/U02_YouTube/U02_YouTube'));
const U03_JardinHorloges = lazy(() => import('./universes/U03_JardinHorloges/U03_JardinHorloges'));
const U04_MoteurRecherche = lazy(() => import('./universes/U04_MoteurRecherche/U04_MoteurRecherche'));
const U05_Netflix = lazy(() => import('./universes/U05_Netflix/U05_Netflix'));
const U06_Minecraft = lazy(() => import('./universes/U06_Minecraft/U06_Minecraft'));
const U07_Apple = lazy(() => import('./universes/U07_Apple/U07_Apple'));
const U08_iMessage = lazy(() => import('./universes/U08_iMessage/U08_iMessage'));
const U10_Apotheose = lazy(() => import('./universes/U10_Apotheose/U10_Apotheose'));

const UNIVERSE_COMPONENTS: Record<number, React.LazyExoticComponent<React.ComponentType<{ mouse: MouseState }>>> = {
  0: U00_Prelude,
  1: U01_CoursePoursuite,
  2: U02_YouTube,
  3: U03_JardinHorloges,
  4: U04_MoteurRecherche,
  5: U05_Netflix,
  6: U06_Minecraft,
  7: U07_Apple,
  8: U08_iMessage,
  9: U10_Apotheose,
};

export function App() {
  const currentUniverse = useGameStore((s) => s.currentUniverse);
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const setUniverse = useGameStore((s) => s.setUniverse);
  const setSessionId = useGameStore((s) => s.setSessionId);
  const mouse = useMousePhysics();
  useButtonBehavior(mouse);

  // Initialize progression
  useEffect(() => {
    progressionManager.initialize().then((session) => {
      setSessionId(session.id);
      if (session.currentUniverse > 0) {
        setUniverse(session.currentUniverse as UniverseIndex);
      }
    });
  }, [setSessionId, setUniverse]);

  const UniverseComponent = UNIVERSE_COMPONENTS[currentUniverse];

  return (
    <>
      <TransitionOverlay />
      <NarrationLayer />
      <CursorTrail
        mouse={mouse}
        enabled={currentUniverse === 9}
        color="rgba(255, 215, 0, 0.5)"
      />

      <AnimatePresence mode="wait">
        {!isTransitioning && UniverseComponent && (
          <Suspense
            fallback={
              <div style={{
                position: 'fixed',
                inset: 0,
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Georgia, serif' }}>
                  ...
                </div>
              </div>
            }
          >
            <UniverseComponent key={currentUniverse} mouse={mouse} />
          </Suspense>
        )}
      </AnimatePresence>

      {currentUniverse > 0 && <ProgressIndicator />}
    </>
  );
}
