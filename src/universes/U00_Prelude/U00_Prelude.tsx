import { useEffect, useRef, useState, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { FloatingText } from '../../components/ui/FloatingText';
import { Vignette } from '../../components/ui/Vignette';
import { VirusPopup, VirusPopupData, VirusPopupType } from '../../components/core/VirusPopup';
import { useGameStore } from '../../store/useGameStore';
import { EMAILJS_CONFIG, isEmailJSConfigured, generateSecretCode } from '../../config/emailjs';
import { MouseState } from '../../hooks/useMousePhysics';
import styles from './U00_Prelude.module.css';

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type Phase = 'intro' | 'fleeing' | 'stopped' | 'virus' | 'leaving';

const POPUP_TYPES: VirusPopupType[] = ['windows', 'terminal', 'bsod', 'emoji', 'warning'];

const VIRUS_MESSAGES: Record<VirusPopupType, string[]> = {
  windows: [
    'VIRUS DÉTECTÉ : Trop chiante',
    'Impossible de supprimer la stubbornness.dll',
    'BoutonOui.exe ne répond pas (comme d\'hab)',
    'Roy le chat a marché sur le clavier',
    'Audit_Consultant.exe a planté',
    'Excuses.dll a causé une erreur fatale',
  ],
  terminal: [
    '$ sudo rm -rf /excuses/*\nPermission denied: user is stubborn',
    'Scanning... 420 menaces trouvées\nroy_fait_des_betises.exe running...',
    '$ cat /var/log/reponse.log\nERROR: still waiting for OUI',
    '$ ls /home/roy/\ncroquettes.txt  sieste.log  betises/',
    '$ ping reponse.local\n64 bytes: ttl=??? time=toujours',
    '$ top\nPID 1  comptabilite.exe  99.9% CPU  unkillable',
  ],
  bsod: [
    'Votre PC à rencontré un problème\nINDECISION_OVERFLOW_EXCEPTION',
    'CRITICAL_PROCESS_DIED\nReponse.sys has stopped working',
    'IRQL_NOT_LESS_OR_EQUAL\nOui.dll is missing (comme par hasard)',
  ],
  emoji: [
    '🦠🐛💀 VIRUS DE L\'HÉSITATION DÉTECTÉ 🦠🐛💀',
    '🐱 Roy a pris le contrôle du système 🐱',
    '🔥 SYSTÈME EN ATTENTE DE RÉPONSE 🔥',
    '💀 R.I.P. ma patience 💀',
  ],
  warning: [
    'ALERTE : Taux d\'hésitation trop élevé',
    'ERREUR 404 : Réponse non trouvée',
    'DANGER : Mode comptable activé - trop de calculs',
    'CRITICAL ERROR : Decision.dll is corrupted',
    'Nadine a appelé, elle veut savoir si t\'as répondu',
  ],
};

const MAX_POPUPS = 30;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let nextPopupId = 0;

function createRandomPopup(baseZIndex: number): VirusPopupData {
  const type = POPUP_TYPES[Math.floor(Math.random() * POPUP_TYPES.length)];
  const messages = VIRUS_MESSAGES[type];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: nextPopupId++,
    type,
    position: {
      x: Math.random() * (window.innerWidth - 350) + 20,
      y: Math.random() * (window.innerHeight - 250) + 20,
    },
    message,
    rotation: Math.random() * 30 - 15,
    zIndex: baseZIndex,
    isDisappearing: false,
    isShaking: Math.random() > 0.7,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  mouse: MouseState;
}

function U00_Prelude({ mouse }: Props) {
  // Phase state
  const [phase, setPhase] = useState<Phase>('intro');

  // Non button click tracking
  const [nonClickCount, setNonClickCount] = useState(0);
  const [nonShaking, setNonShaking] = useState(false);

  // Virus popup state
  const [popups, setPopups] = useState<VirusPopupData[]>([]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showRepairInput, setShowRepairInput] = useState(false);
  const [repairCode, setRepairCode] = useState('');
  const [repairError, setRepairError] = useState('');

  // Store
  const advanceToNextUniverse = useGameStore((s) => s.advanceToNextUniverse);
  const setSecretCode = useGameStore((s) => s.setSecretCode);
  const setEmailSent = useGameStore((s) => s.setEmailSent);
  const secretCode = useGameStore((s) => s.secretCode);
  const emailAddress = useGameStore((s) => s.emailAddress);

  // Refs
  const popupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAdvancedRef = useRef(false);

  // -----------------------------------------------------------------------
  // Phase progression: intro → fleeing (on mouse proximity) → stopped
  // -----------------------------------------------------------------------

  // intro → fleeing: triggered when mouse approaches the Oui button
  useEffect(() => {
    if (phase !== 'intro') return;
    const bx = (typeof window !== 'undefined' ? window.innerWidth / 2 : 500) - 70;
    const by = typeof window !== 'undefined' ? window.innerHeight * 0.52 : 416;
    const dx = mouse.x - bx;
    const dy = mouse.y - by;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      setPhase('fleeing');
    }
  }, [phase, mouse.x, mouse.y]);

  // fleeing → stopped: 10s after fleeing starts
  useEffect(() => {
    if (phase !== 'fleeing') return;
    const timer = setTimeout(() => setPhase('stopped'), 10000);
    return () => clearTimeout(timer);
  }, [phase]);

  // -----------------------------------------------------------------------
  // Start popup spawning (virus phase)
  // -----------------------------------------------------------------------
  const startPopupSpawning = useCallback(() => {
    setPopups([createRandomPopup(1000)]);

    popupIntervalRef.current = setInterval(() => {
      setPopups((prev) => {
        if (prev.length >= MAX_POPUPS) {
          if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
          return prev;
        }
        return [...prev, createRandomPopup(1000 + prev.length)];
      });
    }, 500);
  }, []);

  // -----------------------------------------------------------------------
  // Send email with repair code
  // -----------------------------------------------------------------------
  const sendRepairEmail = useCallback(
    (email: string, code: string) => {
      if (isEmailJSConfigured()) {
        emailjs
          .send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
              to_email: email,
              secret_code: code,
              title: 'Code de réparation requis',
              name: 'Cupidon Anti-Virus',
              email: 'noreply@cupidon.sys',
              message:
                'ALERTE VIRUS ! Voici votre code de réparation pour sauver le système.',
            },
            EMAILJS_CONFIG.publicKey,
          )
          .then(() => setEmailSent(true, email))
          .catch((err) => {
            console.warn('EmailJS send failed:', err);
            console.log('Code de réparation (fallback):', code);
          });
      } else {
        console.log('Code de réparation (dev):', code);
      }
    },
    [setEmailSent],
  );

  // -----------------------------------------------------------------------
  // Handle Oui click → virus phase
  // -----------------------------------------------------------------------
  const handleOuiClick = useCallback(() => {
    if (phase !== 'stopped') return;

    const code = generateSecretCode();
    setSecretCode(code);

    setPhase('virus');
    startPopupSpawning();

    if (emailAddress) {
      sendRepairEmail(emailAddress, code);
      setTimeout(() => setShowRepairInput(true), 5000);
    } else {
      setTimeout(() => setShowEmailCapture(true), 3000);
    }
  }, [phase, setSecretCode, emailAddress, sendRepairEmail, startPopupSpawning]);

  // -----------------------------------------------------------------------
  // Handle email submit (during virus phase)
  // -----------------------------------------------------------------------
  const handleEmailSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const email = emailInput.trim();
      if (!email || !secretCode) return;

      sendRepairEmail(email, secretCode);
      setShowEmailCapture(false);
      setTimeout(() => setShowRepairInput(true), 2000);
    },
    [emailInput, secretCode, sendRepairEmail],
  );

  // -----------------------------------------------------------------------
  // Handle popup close → spawn 2 more
  // -----------------------------------------------------------------------
  const handlePopupClose = useCallback((_id: number) => {
    setPopups((prev) => [
      ...prev,
      createRandomPopup(1000 + prev.length),
      createRandomPopup(1000 + prev.length + 1),
    ]);
  }, []);

  // -----------------------------------------------------------------------
  // Handle repair code submit
  // -----------------------------------------------------------------------
  const handleRepairSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!secretCode) return;

      if (repairCode.toUpperCase().trim() === secretCode) {
        // Correct code – stop spawning
        if (popupIntervalRef.current) {
          clearInterval(popupIntervalRef.current);
          popupIntervalRef.current = null;
        }
        setShowRepairInput(false);

        // Remove popups one by one
        const removeInterval = setInterval(() => {
          setPopups((prev) => {
            if (prev.length <= 1) {
              clearInterval(removeInterval);
              return [];
            }
            return prev.slice(0, -1);
          });
        }, 100);

        // After cleanup, transition
        setTimeout(() => {
          setPopups([]);
          setPhase('leaving');
          setTimeout(() => {
            if (!hasAdvancedRef.current) {
              hasAdvancedRef.current = true;
              advanceToNextUniverse();
            }
          }, 2000);
        }, 4000);
      } else {
        // Wrong code – more chaos
        setRepairError('MAUVAIS CODE - INFECTION AGGRAVÉE');
        setPopups((prev) => {
          const extras: VirusPopupData[] = [];
          for (let i = 0; i < 5; i++) {
            extras.push(createRandomPopup(1000 + prev.length + i));
          }
          return [...prev, ...extras];
        });
        setTimeout(() => setRepairError(''), 2500);
      }
    },
    [repairCode, secretCode, advanceToNextUniverse],
  );

  // -----------------------------------------------------------------------
  // Cleanup on unmount
  // -----------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
    };
  }, []);

  // -----------------------------------------------------------------------
  // Non button click handler
  // -----------------------------------------------------------------------
  const NON_LABELS = [
    'Non',
    'T\'es sûre ?',
    'Sérieux ?',
    'Tu fais exprès là',
    'Mauvaise réponse',
    'L\'autre bouton.',
    'Même Roy saurait',
    'Clique à droite, pas dur',
    'T\'es relou',
    'OUI.',
  ];

  const handleNonClick = useCallback(() => {
    setNonClickCount((c) => c + 1);
    setNonShaking(true);
    setTimeout(() => setNonShaking(false), 500);
  }, []);

  const nonLabel = NON_LABELS[Math.min(nonClickCount, NON_LABELS.length - 1)];
  const ouiScale = 1 + nonClickCount * 0.15;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const buttonY = typeof window !== 'undefined' ? window.innerHeight * 0.52 : 416;

  return (
    <UniverseShell ambientColor="#000000">
      <Vignette intensity={0.8} />

      {/* Heartbeat pulse */}
      <AnimatePresence>
        {(phase === 'intro' || phase === 'fleeing' || phase === 'stopped') && (
          <motion.div
            className={styles.heartbeat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Question text */}
      <AnimatePresence>
        {(phase === 'intro' || phase === 'fleeing' || phase === 'stopped') && (
          <motion.div
            className={styles.textContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FloatingText
              text="Veux-tu être ma Valentine ?"
              letterByLetter
              fontSize="2.5rem"
              color="rgba(255, 255, 255, 0.9)"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Oui button – intro (centered left, static, grows on Non clicks) */}
      {phase === 'intro' && (
        <OuiButton
          onClick={() => {}}
          disableAI
          overridePosition={{ x: centerX - 70, y: buttonY }}
          style={{ transform: `translate(-50%, -50%) scale(${ouiScale})` }}
        />
      )}

      {/* Oui button – fleeing (AI-driven, not clickable) */}
      {phase === 'fleeing' && (
        <OuiButton
          onClick={() => {}}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Oui button – stopped (center, trembles, clickable) */}
      {phase === 'stopped' && (
        <OuiButton
          onClick={handleOuiClick}
          disableAI
          overridePosition={{ x: centerX - 70, y: buttonY }}
          className={styles.stoppedButton}
          style={{ transform: `translate(-50%, -50%) scale(${ouiScale})` }}
        />
      )}

      {/* Non button – custom centered (visible dès l'intro, reste fixe) */}
      <AnimatePresence>
        {(phase === 'intro' || phase === 'fleeing' || phase === 'stopped') && (
          <motion.button
            className={`${styles.centerNonButton} ${nonShaking ? styles.nonShake : ''}`}
            style={{
              left: centerX + 70,
              top: buttonY,
              fontSize: `${Math.max(0.7, 1.2 - nonClickCount * 0.05)}rem`,
            }}
            onClick={handleNonClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: Math.max(0.6, 1 - nonClickCount * 0.05), opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: Math.max(0.6, 1 - nonClickCount * 0.05) * 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {nonLabel}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Virus popups */}
      {phase === 'virus' &&
        popups.map((p) => (
          <VirusPopup key={p.id} popup={p} onClose={handlePopupClose} />
        ))}

      {/* Email capture (virus phase, if email unknown) */}
      <AnimatePresence>
        {phase === 'virus' && showEmailCapture && (
          <motion.div
            className={styles.emailContainer}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className={styles.emailTitle}>
              ⚠ DIAGNOSTIC SYSTÈME ⚠
              <br />
              Donne ton email, y'a un code à récupérer
            </div>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                className={styles.emailInput}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="votre@email.com"
                autoFocus
                required
              />
              <button type="submit" className={styles.emailSubmit}>
                ENVOYER LE CODE DE RÉPARATION
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repair code input (virus phase) */}
      <AnimatePresence>
        {phase === 'virus' && showRepairInput && (
          <motion.div
            className={styles.repairContainer}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className={styles.repairTerminal}>
              <div className={styles.repairTitle}>
                {'>'} SYSTÈME DE RÉPARATION v2.14
                <br />
                {'>'} Entrez le code reçu par email
              </div>
              <form onSubmit={handleRepairSubmit}>
                <input
                  className={styles.repairInput}
                  value={repairCode}
                  onChange={(e) => setRepairCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  maxLength={6}
                  autoFocus
                />
                <button type="submit" className={styles.repairSubmit}>
                  RÉPARER LE SYSTÈME
                </button>
              </form>
              {repairError && (
                <div className={styles.repairError}>{repairError}</div>
              )}
              {!isEmailJSConfigured() && secretCode && (
                <div className={styles.devCode}>[DEV] Code : {secretCode}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaving phase: "Système réparé" */}
      <AnimatePresence>
        {phase === 'leaving' && (
          <>
            <motion.div
              className={styles.repairedMessage}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              SYSTÈME RÉPARÉ
            </motion.div>
            <motion.div
              className={styles.leavingFlash}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5 }}
            />
          </>
        )}
      </AnimatePresence>
    </UniverseShell>
  );
}

export default U00_Prelude;
