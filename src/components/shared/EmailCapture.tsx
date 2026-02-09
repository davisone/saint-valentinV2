import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import styles from './EmailCapture.module.css';

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export function EmailCapture({ onSubmit, isLoading = false }: EmailCaptureProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <label className={styles.label}>Adresse ta lettre...</label>
      <input
        type="email"
        className={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ton@email.com"
        required
        autoFocus
      />
      <motion.button
        type="submit"
        className={styles.sealButton}
        disabled={isLoading || !email.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? '...' : '⊛ Sceller'}
      </motion.button>
    </motion.form>
  );
}
