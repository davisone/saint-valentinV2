import { ReactNode, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './UniverseShell.module.css';

interface UniverseShellProps {
  children: ReactNode;
  ambientColor: string;
  className?: string;
}

export function UniverseShell({ children, ambientColor, className = '' }: UniverseShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shellRef.current) {
      shellRef.current.style.setProperty('--ambient-color', ambientColor);
    }
  }, [ambientColor]);

  return (
    <motion.div
      ref={shellRef}
      className={`${styles.shell} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
}
