import { motion } from 'framer-motion';
import styles from './FloatingText.module.css';

interface FloatingTextProps {
  text: string;
  x?: number;
  y?: number;
  delay?: number;
  duration?: number;
  fontSize?: string;
  color?: string;
  letterByLetter?: boolean;
}

export function FloatingText({
  text,
  x,
  y,
  delay = 0,
  duration = 2,
  fontSize = '2rem',
  color = 'white',
  letterByLetter = false,
}: FloatingTextProps) {
  if (letterByLetter) {
    return (
      <div
        className={styles.container}
        style={{ left: x, top: y, fontSize, color }}
      >
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + i * 0.08, duration: 0.3 }}
            className={styles.letter}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={styles.container}
      style={{ left: x, top: y, fontSize, color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay, duration }}
    >
      {text}
    </motion.div>
  );
}
