import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import {
  NetflixN,
  SearchIcon,
  BellIcon,
  PlayButtonFilled,
  InfoIcon,
  PlusIcon,
  ThumbUpIcon,
  CloseIcon,
  HeartIcon,
} from '../../components/icons/SvgIcons';
import styles from './U05_Netflix.module.css';

interface Props {
  mouse: MouseState;
}

type Phase = 'profiles' | 'browse' | 'detail' | 'done';

interface Profile {
  id: number;
  name: string;
  icon: string;
  message: string;
}

const PROFILES: Profile[] = [
  { id: 1, name: 'Julie', icon: '👩', message: 'Allez c\'est parti.' },
  { id: 2, name: 'Roy', icon: '🐱', message: 'C\'est ton chat ca, il sait pas cliquer.' },
  { id: 3, name: 'Nadine', icon: '👩‍🦳', message: 'Ta mère ?'},
  { id: 4, name: 'Alexis', icon: '👦', message: 'Ton frère a son propre compte normalement.' },
  { id: 5, name: 'Eric', icon: '👦', message: 'Il regarde encore la casa de papel' },

];

interface Show {
  id: number;
  title: string;
  isTarget?: boolean;
}

const TRENDING: Show[] = [
  { id: 1, title: 'Roy : Le Chat Qui Dort' },
  { id: 2, title: '404: Decision Not Found' },
  { id: 3, title: 'Ctrl+Alt+Réponds' },
  { id: 4, title: 'Audit Impossible' },
];

const ROMANTIC_COMEDIES: Show[] = [
  { id: 5, title: 'Dis Oui - Le Film', isTarget: true },
  { id: 6, title: 'Swipe Left Par Erreur' },
  { id: 7, title: 'Vu À 14h, Répond À 23h' },
  { id: 8, title: 'Premier Message Jamais Lu' },
];

const BECAUSE_YOU_WATCHED: Show[] = [
  { id: 9, title: 'La Suite (si tu cliques)' },
  { id: 10, title: 'Chapitre 2 (en attente)' },
  { id: 11, title: 'Eric Demande Des Nouvelles' },
  { id: 12, title: 'Gabin A Deja Fini Le Jeu' },
];

const CONTINUE_WATCHING: Show[] = [
  { id: 13, title: 'Dis Oui - Le Film', isTarget: true },
];

interface EasterEgg {
  id: number;
  message: string;
  x: number;
  y: number;
}

const EASTER_EGGS: Record<string, string> = {
  logo: 'Netflix t\'es pas là pour mater des séries',
  bell: '1 notif de Nadine',
  wrongShow: 'Non c\'est pas celui-la continue.',
  heroInfo: 'C\'est pas la qu\'il faut cliquer',
  trending: 'Roy est plus tendance que toi',
  search: 'Tu cherches quoi ? Le bon film est juste la',
  profile: 'Oui c\'est ton profil, bien joue',
};

function U05_Netflix({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(5);
  const [phase, setPhase] = useState<Phase>('profiles');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([]);
  const eggIdRef = useRef(0);

  useEffect(() => {
    startPuzzle();
  }, [startPuzzle]);

  const showEasterEgg = useCallback((key: string, e: React.MouseEvent) => {
    const message = EASTER_EGGS[key];
    if (!message) return;
    const id = ++eggIdRef.current;
    setEasterEggs((prev) => [
      ...prev,
      { id, message, x: e.clientX, y: e.clientY },
    ]);
    setTimeout(() => {
      setEasterEggs((prev) => prev.filter((egg) => egg.id !== id));
    }, 2600);
  }, []);

  const handleProfileSelect = useCallback((profile: Profile, e: React.MouseEvent) => {
    setSelectedProfile(profile);
    // Show profile easter egg
    const id = ++eggIdRef.current;
    setEasterEggs((prev) => [
      ...prev,
      { id, message: profile.message, x: e.clientX, y: e.clientY },
    ]);
    setTimeout(() => {
      setEasterEggs((prev) => prev.filter((egg) => egg.id !== id));
      setPhase('browse');
    }, 1500);
  }, []);

  const handleShowClick = useCallback((show: Show, e: React.MouseEvent) => {
    if (show.isTarget) {
      setPhase('detail');
    } else {
      showEasterEgg('wrongShow', e);
    }
  }, [showEasterEgg]);

  const handlePlayClick = useCallback(() => {
    setPhase('done');
    setTimeout(() => {
      complete();
    }, 2000);
  }, [complete]);

  const renderProfiles = () => (
    <motion.div
      className={styles.profilesPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className={styles.profilesTitle}>Qui regarde ?</h1>
      <div className={styles.profilesGrid}>
        {PROFILES.map((profile) => (
          <button
            key={profile.id}
            className={styles.profileCard}
            onClick={(e) => handleProfileSelect(profile, e)}
          >
            <div className={styles.profileAvatar}>
              <span>{profile.icon}</span>
            </div>
            <span className={styles.profileName}>{profile.name}</span>
          </button>
        ))}
      </div>
      <button className={styles.manageProfiles}>Gerer les profils</button>
    </motion.div>
  );

  const renderBrowse = () => (
    <motion.div
      className={styles.browsePage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.logoBtn} onClick={(e) => showEasterEgg('logo', e)}>
            <NetflixN className={styles.netflixLogo} />
          </button>
          <nav className={styles.nav}>
            <button className={styles.navItem}>Accueil</button>
            <button className={styles.navItem}>Séries</button>
            <button className={styles.navItem}>Films</button>
            <button className={styles.navItem}>Nouveautés</button>
            <button className={styles.navItem}>Ma liste</button>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} onClick={(e) => showEasterEgg('search', e)}>
            <SearchIcon className={styles.headerIconSvg} />
          </button>
          <button className={styles.iconBtn} onClick={(e) => showEasterEgg('bell', e)}>
            <BellIcon className={styles.headerIconSvg} />
          </button>
          <button className={styles.profileBtnSmall} onClick={(e) => showEasterEgg('profile', e)}>
            <span>{selectedProfile?.icon || '❤️'}</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Trouve Le Bon Film</h1>
          <p className={styles.heroDescription}>
            C'est pas complique Julie, y'a qu'un seul film a trouver...
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.playBtn}>
              <PlayButtonFilled className={styles.playIconSvg} /> Lecture
            </button>
            <button className={styles.infoBtn} onClick={(e) => showEasterEgg('heroInfo', e)}>
              <InfoIcon className={styles.infoIconSvg} /> Plus d'infos
            </button>
          </div>
        </div>
        <div className={styles.heroGradient}></div>
      </div>

      {/* Rows */}
      <div className={styles.rowsContainer}>
        {/* Continue Watching */}
        <div className={styles.row}>
          <h2 className={styles.rowTitle}>Continuer a regarder</h2>
          <div className={styles.rowContent}>
            {CONTINUE_WATCHING.map((show) => (
              <button
                key={show.id}
                className={`${styles.showCard} ${show.isTarget ? styles.targetShow : ''}`}
                onClick={(e) => handleShowClick(show, e)}
              >
                <div className={styles.showThumbnail}>
                  {show.isTarget && <HeartIcon className={styles.showHeartSvg} />}
                </div>
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressBarFill} style={{ width: '80%' }}></div>
                </div>
                <span className={styles.showTitle}>{show.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className={styles.row}>
          <h2 className={styles.rowTitle} onClick={(e) => showEasterEgg('trending', e)}>
            Tendances
          </h2>
          <div className={styles.rowContent}>
            {TRENDING.map((show) => (
              <button
                key={show.id}
                className={styles.showCard}
                onClick={(e) => handleShowClick(show, e)}
              >
                <div className={styles.showThumbnail}>
                  <span className={styles.showIcon}>&#127909;</span>
                </div>
                <span className={styles.showTitle}>{show.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Romantic Comedies */}
        <div className={styles.row}>
          <h2 className={styles.rowTitle}>Comedies romantiques</h2>
          <div className={styles.rowContent}>
            {ROMANTIC_COMEDIES.map((show) => (
              <button
                key={show.id}
                className={`${styles.showCard} ${show.isTarget ? styles.targetShow : ''}`}
                onClick={(e) => handleShowClick(show, e)}
              >
                <div className={styles.showThumbnail}>
                  {show.isTarget ? (
                    <HeartIcon className={styles.showHeartSvg} />
                  ) : (
                    <HeartIcon className={styles.showIconSvg} />
                  )}
                </div>
                <span className={styles.showTitle}>{show.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Because you watched */}
        <div className={styles.row}>
          <h2 className={styles.rowTitle}>Parce que vous avez regarde "Le Prelude"</h2>
          <div className={styles.rowContent}>
            {BECAUSE_YOU_WATCHED.map((show) => (
              <button
                key={show.id}
                className={styles.showCard}
                onClick={(e) => handleShowClick(show, e)}
              >
                <div className={styles.showThumbnail}>
                  <span className={styles.showIcon}>&#127916;</span>
                </div>
                <span className={styles.showTitle}>{show.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderDetail = () => (
    <motion.div
      className={styles.detailOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.detailModal}>
        <button className={styles.closeBtn} onClick={() => setPhase('browse')}>
          <CloseIcon className={styles.closeIconSvg} />
        </button>

        <div className={styles.detailHero}>
          <motion.div
            className={styles.detailHeroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <HeartIcon className={styles.detailHeartSvg} />
          </motion.div>
        </div>

        <div className={styles.detailInfo}>
          <h1 className={styles.detailTitle}>Dis Oui - Le Film</h1>
          <div className={styles.detailMeta}>
            <span className={styles.matchScore}>100% pour toi</span>
            <span className={styles.detailYear}>2024</span>
            <span className={styles.detailRating}>Comptables Only</span>
            <span className={styles.detailSeasons}>1 saison</span>
          </div>

          <div className={styles.detailButtons}>
            <OuiButton
              label="&#9654; Lecture"
              className={styles.playButton}
              onClick={handlePlayClick}
              disableAI
              overridePosition={{ x: 0, y: 0 }}
            />
            <button className={styles.addBtn}><PlusIcon className={styles.addIconSvg} /></button>
            <button className={styles.likeBtn}><ThumbUpIcon className={styles.likeIconSvg} /></button>
          </div>

          <p className={styles.detailDescription}>
            L'histoire d'une fille qui met 45 minutes a choisir un resto
            et qui galere a cliquer sur le bon bouton.
            Spoiler : elle finit par dire oui (si elle trouve le bouton).
          </p>

          <div className={styles.detailExtra}>
            <div className={styles.detailCast}>
              <span className={styles.detailLabel}>Distribution :</span> Toi, Roy (le chat), Nadine (qui appelle)
            </div>
            <div className={styles.detailGenres}>
              <span className={styles.detailLabel}>Genres :</span> Comedie, Suspense, Patience
            </div>
            <div className={styles.detailEpisodes}>
              <span className={styles.detailLabel}>Episodes :</span> 10 (si t'arrives au bout)
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderDone = () => (
    <motion.div
      className={styles.doneOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className={styles.doneContent}>
        <motion.div
          className={styles.doneHeart}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
        >
          🎬
        </motion.div>
        <motion.p
          className={styles.doneMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Bravo, t'as trouve le bon film.
        </motion.p>
      </div>
    </motion.div>
  );

  return (
    <UniverseShell ambientColor="#141414">
      <AnimatePresence mode="wait">
        {phase === 'profiles' && renderProfiles()}
        {phase === 'browse' && renderBrowse()}
        {phase === 'detail' && renderDetail()}
        {phase === 'done' && renderDone()}
      </AnimatePresence>

      {/* Easter egg tooltips */}
      <AnimatePresence>
        {easterEggs.map((egg) => (
          <motion.div
            key={egg.id}
            className={styles.easterEggTooltip}
            style={{
              left: egg.x,
              top: egg.y,
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {egg.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </UniverseShell>
  );
}

export default U05_Netflix;
