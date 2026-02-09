import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import styles from './ProgressIndicator.module.css';

export function ProgressIndicator() {
  const currentUniverse = useGameStore((s) => s.currentUniverse);

  return (
    <div className={styles.container}>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          className={`${styles.dot} ${i === currentUniverse ? styles.active : ''} ${
            i < currentUniverse ? styles.completed : ''
          }`}
          initial={false}
          animate={{
            scale: i === currentUniverse ? 1.3 : 1,
            opacity: i <= currentUniverse ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
