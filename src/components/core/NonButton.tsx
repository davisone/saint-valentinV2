import { motion, AnimatePresence } from 'framer-motion';
import styles from './NonButton.module.css';

interface NonButtonProps {
  visible?: boolean;
  onClick?: () => void;
}

export function NonButton({ visible = true, onClick }: NonButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className={styles.nonButton}
          onClick={onClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          whileHover={{ opacity: 0.3 }}
        >
          Non
        </motion.button>
      )}
    </AnimatePresence>
  );
}
