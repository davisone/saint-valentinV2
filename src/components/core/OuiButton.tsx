import { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useButtonStore } from '../../store/useButtonStore';
import { useGameStore } from '../../store/useGameStore';
import styles from './OuiButton.module.css';

interface OuiButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Override position from store */
  overridePosition?: { x: number; y: number } | null;
  /** Disable the default AI-driven positioning */
  disableAI?: boolean;
}

export function OuiButton({
  onClick,
  label = 'Oui',
  className = '',
  style = {},
  overridePosition = null,
  disableAI = false,
}: OuiButtonProps) {
  const position = useButtonStore((s) => s.position);
  const isVisible = useButtonStore((s) => s.isVisible);
  const currentBehavior = useButtonStore((s) => s.currentBehavior);
  const emotionalState = useButtonStore((s) => s.emotionalState);
  const trail = useButtonStore((s) => s.trail);
  const incrementInteraction = useGameStore((s) => s.incrementButtonInteraction);
  const currentUniverse = useGameStore((s) => s.currentUniverse);

  const pos = disableAI && overridePosition ? overridePosition : position;

  const handleClick = useCallback(() => {
    incrementInteraction(currentUniverse);
    onClick?.();
  }, [onClick, incrementInteraction, currentUniverse]);

  const buttonStyle = useMemo(() => {
    const trustGlow = emotionalState.trust / 100;
    return {
      left: pos.x,
      top: pos.y,
      transform: 'translate(-50%, -50%)',
      boxShadow: `0 0 ${10 + trustGlow * 30}px rgba(255, 215, 0, ${trustGlow * 0.5})`,
      ...style,
    };
  }, [pos.x, pos.y, emotionalState.trust, style]);

  const behaviorClass = useMemo(() => {
    switch (currentBehavior) {
      case 'flicker': return styles.flicker;
      case 'hesitate': return styles.hesitate;
      case 'serene': return styles.serene;
      case 'vulnerable': return styles.vulnerable;
      default: return '';
    }
  }, [currentBehavior]);

  return (
    <>
      {/* Light trail */}
      {trail.length > 2 && currentBehavior === 'flee' && (
        <svg className={styles.trailSvg}>
          <polyline
            points={trail.map((p) => `${p.x},${p.y}`).join(' ')}
            className={styles.trailLine}
          />
        </svg>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.button
            className={`${styles.ouiButton} ${behaviorClass} ${className}`}
            style={buttonStyle}
            onClick={handleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {label}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
