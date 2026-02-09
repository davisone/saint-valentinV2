import { useEffect, useRef } from 'react';
import { transitionOrchestrator } from '../../systems/TransitionOrchestrator';
import styles from './TransitionOverlay.module.css';

export function TransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      transitionOrchestrator.setOverlay(overlayRef.current);
    }
  }, []);

  return <div ref={overlayRef} className={styles.overlay} />;
}
