import styles from './VirusPopup.module.css';

export type VirusPopupType = 'windows' | 'terminal' | 'bsod' | 'emoji' | 'warning';

export interface VirusPopupData {
  id: number;
  type: VirusPopupType;
  position: { x: number; y: number };
  message: string;
  rotation: number;
  zIndex: number;
  isDisappearing: boolean;
  isShaking: boolean;
}

interface VirusPopupProps {
  popup: VirusPopupData;
  onClose: (id: number) => void;
}

export function VirusPopup({ popup, onClose }: VirusPopupProps) {
  const { id, type, position, message, rotation, zIndex, isDisappearing, isShaking } = popup;

  const containerStyle: React.CSSProperties = {
    left: position.x,
    top: position.y,
    zIndex,
    transform: `rotate(${rotation}deg)`,
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(id);
  };

  const cls = [
    styles.popup,
    isDisappearing ? styles.disappearing : '',
    isShaking ? styles.shaking : '',
  ].filter(Boolean).join(' ');

  switch (type) {
    case 'windows':
      return (
        <div className={cls} style={containerStyle}>
          <div className={styles.windowsTitleBar}>
            <span>⚠️ Alerte Windows</span>
            <button className={styles.closeBtn} onClick={handleClose}>✕</button>
          </div>
          <div className={styles.windowsBody}>
            <span className={styles.windowsIcon}>⚠️</span>
            <span>{message}</span>
          </div>
          <div className={styles.windowsButtons}>
            <button className={styles.windowsBtn} onClick={handleClose}>OK</button>
            <button className={styles.windowsBtn} onClick={handleClose}>Annuler</button>
          </div>
        </div>
      );

    case 'terminal':
      return (
        <div className={`${cls} ${styles.terminal}`} style={containerStyle}>
          <div className={styles.terminalPrompt}>root@cupidon:~#</div>
          <div>{message}</div>
          <span className={styles.cursor}>█</span>
        </div>
      );

    case 'bsod':
      return (
        <div className={`${cls} ${styles.bsod}`} style={containerStyle}>
          <div className={styles.bsodFrown}>:(</div>
          <div className={styles.bsodText}>{message}</div>
          <div className={styles.bsodPercent}>0% complete</div>
        </div>
      );

    case 'emoji':
      return (
        <div className={`${cls} ${styles.emoji}`} style={containerStyle}>
          <span className={styles.emojiIcon}>🦠🐛💀</span>
          <div>{message}</div>
        </div>
      );

    case 'warning':
      return (
        <div className={`${cls} ${styles.warning}`} style={containerStyle}>
          <button className={styles.closeBtnWarning} onClick={handleClose}>✕</button>
          <div>🚨 {message} 🚨</div>
        </div>
      );
  }
}
