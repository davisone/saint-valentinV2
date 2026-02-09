import styles from './Vignette.module.css';

interface VignetteProps {
  color?: string;
  intensity?: number;
}

export function Vignette({ color = 'black', intensity = 0.6 }: VignetteProps) {
  return (
    <div
      className={styles.vignette}
      style={{
        background: `radial-gradient(ellipse at center, transparent 50%, ${color} 100%)`,
        opacity: intensity,
      }}
    />
  );
}
