import { useEffect } from 'react';
import { useNarrationStore } from '../../store/useNarrationStore';
import { narrationEngine } from '../../systems/NarrationEngine';
import styles from './NarrationLayer.module.css';

export function NarrationLayer() {
  const activeEffects = useNarrationStore((s) => s.activeEffects);

  useEffect(() => {
    const unsub = narrationEngine.onEffectsChange((effects) => {
      useNarrationStore.getState().clearEffects();
      for (const e of effects) {
        useNarrationStore.getState().addEffect(e);
      }
    });
    return unsub;
  }, []);

  return (
    <div className={styles.layer}>
      {activeEffects.map((effect, i) => {
        switch (effect.type) {
          case 'fog':
            return (
              <div
                key={i}
                className={styles.fog}
                style={{ opacity: (effect.params.intensity as number) ?? 0.5 }}
              />
            );
          case 'light':
            return (
              <div
                key={i}
                className={styles.lightFlash}
                style={{
                  background: `radial-gradient(circle, ${
                    (effect.params.color as string) ?? 'white'
                  } 0%, transparent 70%)`,
                  opacity: (effect.params.intensity as number) ?? 0.3,
                }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
