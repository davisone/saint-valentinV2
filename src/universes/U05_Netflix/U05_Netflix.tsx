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
  ChevronLeftIcon,
  ChevronRightIcon,
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
  { id: 3, name: 'Nadine', icon: '👩‍🦳', message: 'Ta mère ?' },
  { id: 4, name: 'Alexis', icon: '👦', message: 'Ton frère a son propre compte normalement.' },
  { id: 5, name: 'Eric', icon: '👦', message: 'Il regarde encore la casa de papel' },
];

interface Show {
  id: number;
  title: string;
  isTarget?: boolean;
  emoji?: string;
  match?: number;
  year?: string;
  duration?: string;
  description?: string;
}

const CONTINUE_WATCHING: Show[] = [
  { id: 1, title: 'Dis Oui - Le Film', isTarget: true, emoji: '❤️', match: 100 },
  { id: 2, title: 'Comment Répondre Vite', emoji: '⏰', match: 72 },
];

const TOP_10: Show[] = [
  { id: 10, title: 'Dis Oui - Le Film', isTarget: true, emoji: '❤️' },
  { id: 11, title: 'Roy : Le Documentaire', emoji: '🐱' },
  { id: 12, title: 'Nadine Appelle (3h)', emoji: '📞' },
  { id: 13, title: 'Comptable Anonyme', emoji: '📊' },
  { id: 14, title: 'La Saga Du Kinder', emoji: '🍫' },
  { id: 15, title: 'Les Mystères de Julie', emoji: '🔮' },
  { id: 16, title: 'Eric vs Le Monde', emoji: '🌍' },
  { id: 17, title: 'Alexis En Cuisine', emoji: '👨‍🍳' },
  { id: 18, title: 'Le Chat Qui Fixe', emoji: '👀' },
  { id: 19, title: 'Minuit À Paris (Avec Nadine)', emoji: '🗼' },
];

const TRENDING: Show[] = [
  { id: 20, title: 'Roy : Le Chat Qui Dort', emoji: '😴', match: 85 },
  { id: 21, title: '404: Decision Not Found', emoji: '💻', match: 67 },
  { id: 22, title: 'Ctrl+Alt+Réponds', emoji: '⌨️', match: 78 },
  { id: 23, title: 'Audit Impossible', emoji: '📋', match: 45 },
  { id: 24, title: 'Les Courgettes de Roy', emoji: '🥒', match: 92 },
  { id: 25, title: 'Nadine : Origins', emoji: '👩‍🦳', match: 56 },
];

const ROMANTIC_COMEDIES: Show[] = [
  { id: 30, title: 'Dis Oui - Le Film', isTarget: true, emoji: '❤️', match: 100 },
  { id: 31, title: 'Swipe Left Par Erreur', emoji: '📱', match: 88 },
  { id: 32, title: 'Vu À 14h, Répond À 23h', emoji: '💬', match: 73 },
  { id: 33, title: 'Premier Message Jamais Lu', emoji: '✉️', match: 61 },
  { id: 34, title: 'La Liste Des Restos', emoji: '🍽️', match: 94 },
  { id: 35, title: 'Il A Dit Quoi ?', emoji: '🤔', match: 82 },
];

const BECAUSE_YOU_WATCHED: Show[] = [
  { id: 40, title: 'La Suite (si tu cliques)', emoji: '➡️', match: 89 },
  { id: 41, title: 'Chapitre 2 (en attente)', emoji: '📖', match: 76 },
  { id: 42, title: 'Eric Demande Des Nouvelles', emoji: '👋', match: 68 },
  { id: 43, title: 'Gabin A Déjà Fini Le Jeu', emoji: '🏆', match: 54 },
  { id: 44, title: 'Les Conseils De Nadine', emoji: '💡', match: 41 },
  { id: 45, title: 'Roy Approuve', emoji: '🐱', match: 99 },
];

const MY_LIST: Show[] = [
  { id: 50, title: 'À Regarder Un Jour', emoji: '📺', match: 77 },
  { id: 51, title: 'Jamais Commencé', emoji: '🎬', match: 65 },
  { id: 52, title: 'Recommandé Par Roy', emoji: '🐱', match: 88 },
];

const EPISODES = [
  { id: 1, title: 'Le Prélude', duration: '45 min', description: 'Tout commence par un simple "Veux-tu être ma Valentine ?"' },
  { id: 2, title: 'La Poursuite', duration: '38 min', description: 'Une course-poursuite épique dans les rues de la ville.' },
  { id: 3, title: 'Le Tutoriel', duration: '42 min', description: 'Apprendre à cliquer sur le bon bouton, tout un art.' },
  { id: 4, title: 'Le Jardin', duration: '35 min', description: 'Le temps presse, les horloges tournent.' },
  { id: 5, title: 'La Recherche', duration: '40 min', description: 'Google a toutes les réponses... ou presque.' },
  { id: 6, title: 'Le Streaming', duration: '44 min', description: 'Trouve le bon film parmi tous ces choix.' },
];

interface EasterEgg {
  id: number;
  message: string;
  x: number;
  y: number;
}

const EASTER_EGGS: Record<string, string> = {
  logo: 'Netflix t\'es pas là pour mater des séries',
  bell: 'Nadine a liké ta story il y a 3h',
  wrongShow: 'Non c\'est pas celui-là, continue.',
  heroInfo: 'C\'est pas là qu\'il faut cliquer',
  trending: 'Roy est plus tendance que toi',
  search: 'Tape "Oui" dans la recherche... non je rigole',
  profile: 'Oui c\'est ton profil, bien joué',
  navAccueil: 'T\'es déjà sur l\'accueil, cherche le film !',
  navSeries: 'C\'est un film qu\'on cherche, pas une série',
  navFilms: 'Oui c\'est dans les films, bien vu',
  navNouveautes: 'Y\'a rien de nouveau, cherche le bon film',
  navMaListe: 'Ta liste ? Elle est vide comme ta réponse',
  addToList: 'Tu l\'ajoutes à ta liste mais tu le regardes pas ?',
  like: 'T\'aimes bien mais tu cliques pas sur Lecture ?',
  dislike: 'Comment tu peux pas aimer ça ?!',
  mute: 'Tu coupes le son de l\'amour ?',
  episode: 'Commence par l\'épisode 1 : clique sur Lecture',
  manageProfiles: 'Gérer quoi ? Y\'a que Julie qui compte',
  heroPlay: 'Non c\'est pas le bon film, cherche "Dis Oui"',
  top10: 'Le numéro 1 c\'est "Dis Oui", évidemment',
};

function U05_Netflix({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(5);
  const [phase, setPhase] = useState<Phase>('profiles');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([]);
  const eggIdRef = useRef(0);

  // New states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredShow, setHoveredShow] = useState<Show | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  // Refs for row scrolling
  const continueRef = useRef<HTMLDivElement>(null);
  const top10Ref = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const romanticRef = useRef<HTMLDivElement>(null);
  const becauseRef = useRef<HTMLDivElement>(null);
  const myListRef = useRef<HTMLDivElement>(null);

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

  const showCustomMessage = useCallback((message: string, e: React.MouseEvent) => {
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

  const scrollRow = useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = 600;
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  const handleShowHover = useCallback((show: Show, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredShow(show);
    setHoveredPosition({ x: rect.left + rect.width / 2, y: rect.top });
  }, []);

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
      <button
        className={styles.manageProfiles}
        onClick={(e) => showEasterEgg('manageProfiles', e)}
      >
        Gérer les profils
      </button>
    </motion.div>
  );

  const renderShowCard = (show: Show, isTop10?: boolean, rank?: number) => (
    <button
      key={show.id}
      className={`${styles.showCard} ${show.isTarget ? styles.targetShow : ''} ${isTop10 ? styles.top10Card : ''}`}
      onClick={(e) => handleShowClick(show, e)}
      onMouseEnter={(e) => handleShowHover(show, e)}
      onMouseLeave={() => setHoveredShow(null)}
    >
      {isTop10 && rank !== undefined && (
        <span className={styles.top10Rank}>{rank}</span>
      )}
      <div className={styles.showThumbnail}>
        {show.isTarget ? (
          <HeartIcon className={styles.showHeartSvg} />
        ) : (
          <span className={styles.showEmoji}>{show.emoji || '🎬'}</span>
        )}
      </div>
      {!isTop10 && <span className={styles.showTitle}>{show.title}</span>}
    </button>
  );

  const renderRow = (
    title: string,
    shows: Show[],
    ref: React.RefObject<HTMLDivElement | null>,
    isTop10?: boolean,
    easterEggKey?: string
  ) => (
    <div className={styles.row}>
      <h2
        className={styles.rowTitle}
        onClick={easterEggKey ? (e) => showEasterEgg(easterEggKey, e) : undefined}
      >
        {title}
      </h2>
      <div className={styles.rowWrapper}>
        <button
          className={`${styles.rowArrow} ${styles.rowArrowLeft}`}
          onClick={() => scrollRow(ref, 'left')}
        >
          <ChevronLeftIcon className={styles.arrowIcon} />
        </button>
        <div className={styles.rowContent} ref={ref}>
          {shows.map((show, index) => renderShowCard(show, isTop10, isTop10 ? index + 1 : undefined))}
        </div>
        <button
          className={`${styles.rowArrow} ${styles.rowArrowRight}`}
          onClick={() => scrollRow(ref, 'right')}
        >
          <ChevronRightIcon className={styles.arrowIcon} />
        </button>
      </div>
    </div>
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
            <button className={styles.navItem} onClick={(e) => showEasterEgg('navAccueil', e)}>
              Accueil
            </button>
            <button className={styles.navItem} onClick={(e) => showEasterEgg('navSeries', e)}>
              Séries
            </button>
            <button className={styles.navItem} onClick={(e) => showEasterEgg('navFilms', e)}>
              Films
            </button>
            <button className={styles.navItem} onClick={(e) => showEasterEgg('navNouveautes', e)}>
              Nouveautés
            </button>
            <button className={styles.navItem} onClick={(e) => showEasterEgg('navMaListe', e)}>
              Ma liste
            </button>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <div className={`${styles.searchContainer} ${searchOpen ? styles.searchOpen : ''}`}>
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <SearchIcon className={styles.headerIconSvg} />
            </button>
            {searchOpen && (
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Titres, personnes, genres"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onClick={(e) => showEasterEgg('search', e)}
              />
            )}
          </div>
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
            C'est pas compliqué Julie, y'a qu'un seul film à trouver...
            <br />
            <span className={styles.heroHint}>Indice : il est dans les comédies romantiques 💕</span>
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.playBtn} onClick={(e) => showEasterEgg('heroPlay', e)}>
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
          <h2 className={styles.rowTitle}>Continuer à regarder pour {selectedProfile?.name || 'Julie'}</h2>
          <div className={styles.rowWrapper}>
            <div className={styles.rowContent} ref={continueRef}>
              {CONTINUE_WATCHING.map((show) => (
                <button
                  key={show.id}
                  className={`${styles.showCard} ${styles.continueCard} ${show.isTarget ? styles.targetShow : ''}`}
                  onClick={(e) => handleShowClick(show, e)}
                  onMouseEnter={(e) => handleShowHover(show, e)}
                  onMouseLeave={() => setHoveredShow(null)}
                >
                  <div className={styles.showThumbnail}>
                    {show.isTarget ? (
                      <HeartIcon className={styles.showHeartSvg} />
                    ) : (
                      <span className={styles.showEmoji}>{show.emoji}</span>
                    )}
                  </div>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarFill} style={{ width: show.isTarget ? '80%' : '35%' }}></div>
                  </div>
                  <span className={styles.showTitle}>{show.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top 10 */}
        {renderRow('Top 10 en France aujourd\'hui', TOP_10, top10Ref, true, 'top10')}

        {/* Trending */}
        {renderRow('Tendances actuelles', TRENDING, trendingRef, false, 'trending')}

        {/* Romantic Comedies */}
        {renderRow('Comédies romantiques', ROMANTIC_COMEDIES, romanticRef)}

        {/* Because you watched */}
        {renderRow('Parce que vous avez regardé "Le Prélude"', BECAUSE_YOU_WATCHED, becauseRef)}

        {/* My List */}
        {renderRow('Ma liste', MY_LIST, myListRef, false, 'navMaListe')}
      </div>

      {/* Hover Preview Card */}
      <AnimatePresence>
        {hoveredShow && !hoveredShow.isTarget && (
          <motion.div
            className={styles.hoverCard}
            style={{
              left: hoveredPosition.x,
              top: hoveredPosition.y,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.hoverThumbnail}>
              <span className={styles.hoverEmoji}>{hoveredShow.emoji || '🎬'}</span>
            </div>
            <div className={styles.hoverInfo}>
              <div className={styles.hoverButtons}>
                <button className={styles.hoverPlayBtn}>▶</button>
                <button className={styles.hoverIconBtn}>+</button>
                <button className={styles.hoverIconBtn}>👍</button>
              </div>
              <div className={styles.hoverMeta}>
                <span className={styles.hoverMatch}>{hoveredShow.match || 75}% pour vous</span>
              </div>
              <p className={styles.hoverTitle}>{hoveredShow.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
            <button
              className={styles.addBtn}
              onClick={(e) => showEasterEgg('addToList', e)}
            >
              <PlusIcon className={styles.addIconSvg} />
            </button>
            <button
              className={styles.likeBtn}
              onClick={(e) => showEasterEgg('like', e)}
            >
              <ThumbUpIcon className={styles.likeIconSvg} />
            </button>
            <button
              className={styles.muteBtn}
              onClick={(e) => showEasterEgg('mute', e)}
            >
              🔇
            </button>
          </div>

          <p className={styles.detailDescription}>
            L'histoire d'une fille qui met 45 minutes à choisir un resto
            et qui galère à cliquer sur le bon bouton.
            Spoiler : elle finit par dire oui (si elle trouve le bouton).
          </p>

          <div className={styles.detailExtra}>
            <div className={styles.detailCast}>
              <span className={styles.detailLabel}>Distribution :</span> Toi, Roy (le chat), Nadine (qui appelle)
            </div>
            <div className={styles.detailGenres}>
              <span className={styles.detailLabel}>Genres :</span> Comédie, Suspense, Patience
            </div>
          </div>

          {/* Episodes Section */}
          <div className={styles.episodesSection}>
            <div className={styles.episodesHeader}>
              <h2 className={styles.episodesTitle}>Épisodes</h2>
              <span className={styles.seasonBadge}>Saison 1</span>
            </div>
            <div className={styles.episodesList}>
              {EPISODES.map((episode) => (
                <div
                  key={episode.id}
                  className={styles.episodeCard}
                  onClick={(e) => showEasterEgg('episode', e)}
                >
                  <div className={styles.episodeThumbnail}>
                    <span className={styles.episodeNumber}>{episode.id}</span>
                    <div className={styles.episodePlayOverlay}>▶</div>
                  </div>
                  <div className={styles.episodeInfo}>
                    <div className={styles.episodeHeader}>
                      <h3 className={styles.episodeName}>{episode.title}</h3>
                      <span className={styles.episodeDuration}>{episode.duration}</span>
                    </div>
                    <p className={styles.episodeDescription}>{episode.description}</p>
                  </div>
                </div>
              ))}
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
          Bravo, t'as trouvé le bon film.
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
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {egg.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </UniverseShell>
  );
}

export default U05_Netflix;
