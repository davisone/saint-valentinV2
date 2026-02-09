import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import {
  YouTubePlayButton,
  MenuIcon,
  SearchIcon,
  MicIcon,
  BellIcon,
  HomeIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  PlayIcon,
} from '../../components/icons/SvgIcons';
import styles from './U02_YouTube.module.css';

interface Props {
  mouse: MouseState;
}

type Phase = 'homepage' | 'watching' | 'done';

interface Video {
  id: number;
  title: string;
  channel: string;
  views: string;
  date: string;
  isTarget?: boolean;
  thumbnail: string;
}

const VIDEOS: Video[] = [
  { id: 1, title: 'Comment savoir si sa copine est indécise', channel: 'RelationshipTips', views: '2,3M vues', date: 'il y a 3 mois', thumbnail: '👫' },
  { id: 2, title: 'Mon chat Roy mange que des courgette que faire ?', channel: 'ChatsMarrants', views: '15M vues', date: 'il y a 1 an', thumbnail: '🐱' },
  { id: 3, title: 'TUTO : Comment dire Oui (simple)', channel: 'PasComplique', views: '1 vue', date: 'il y a 1 jour', isTarget: true, thumbnail: '👆' },
  { id: 4, title: 'Top 10 des remarques de con de Julie', channel: 'AuditFails', views: '8M vues', date: 'il y a 6 mois', thumbnail: '😂' },
  { id: 5, title: 'Recette Kinder Country Facile (impossible)', channel: 'CuisineRapide', views: '500K vues', date: 'il y a 2 semaines', thumbnail: '🍰' },
  { id: 6, title: 'Pourquoi les comptables sont comptables', channel: 'MysteresTV', views: '42K vues', date: 'il y a 1 mois', thumbnail: '🌌' },
  { id: 7, title: 'Nadine appelle à 6h', channel: 'MamansTV', views: '3M vues', date: 'il y a 8 mois', thumbnail: '📞' },
  { id: 8, title: 'Compilation Chats Droles (feat. Roy)', channel: 'PetLovers', views: '20M vues', date: 'il y a 4 mois', thumbnail: '🐱' },
];

const ROMANTIC_SUGGESTIONS = [
  'tuto répondre oui',
  'pourquoi elle répond pas',
  'chat qui clc',
  'convaincre quelqu\'un de têtu',
  'comptable qui compte',
];

interface EasterEgg {
  id: number;
  message: string;
  x: number;
  y: number;
}

const WRONG_VIDEO_MESSAGES = [
  'Sérieux ? T\'es nulle là',
  'Non mais t\'as vu le titre ou pas ?',
  'Allez, concentre-toi un peu !',
  'C\'est pas ça réfléchis.',
  'Même Roy aurait trouvé',
  'Mais non ! Cherche mieux.',
  'Dommage.',
  'Tu fais exprès ?',
];

const EASTER_EGGS: Record<string, string> = {
  logo: 'Bravo t\'as trouvé le logo YouTube',
  bell: 'Non y\'a pas de notif importante ici',
  profile: 'C\'est pas là qu\'il faut cliquer',
  shorts: 'Les Shorts c\'est pas le sujet là',
  subscriptions: 'T\'es pas abonnée à la bonne chaîne',
  mic: 'Parler ça sert à rien, clique sur la bonne vidéo',
  home: 'T\'es déjà sur l\'accueil, cherche la vidéo !',
  library: 'Y\'a que des vidéos de chèvres pour Roy dedans',
};

function U02_YouTube({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(2);
  const [phase, setPhase] = useState<Phase>('homepage');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const handleVideoClick = useCallback((video: Video, e: React.MouseEvent) => {
    if (video.isTarget) {
      setPhase('watching');
    } else {
      // Show random wrong video message
      const message = WRONG_VIDEO_MESSAGES[Math.floor(Math.random() * WRONG_VIDEO_MESSAGES.length)];
      const id = ++eggIdRef.current;
      setEasterEggs((prev) => [
        ...prev,
        { id, message, x: e.clientX, y: e.clientY },
      ]);
      setTimeout(() => {
        setEasterEggs((prev) => prev.filter((egg) => egg.id !== id));
      }, 2600);
    }
  }, []);

  const handleLikeClick = useCallback(() => {
    setPhase('done');
    setTimeout(() => {
      complete();
    }, 2000);
  }, [complete]);

  const renderHomepage = () => (
    <motion.div
      className={styles.youtubePage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuBtn}>
            <MenuIcon className={styles.menuIconSvg} />
          </button>
          <button className={styles.logoBtn} onClick={(e) => showEasterEgg('logo', e)}>
            <YouTubePlayButton className={styles.ytLogo} />
            <span className={styles.logoText}>YouTube</span>
          </button>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Rechercher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button className={styles.searchBtn}>
              <SearchIcon className={styles.searchIconSvg} />
            </button>
          </div>
          <button className={styles.micBtn} onClick={(e) => showEasterEgg('mic', e)}>
            <MicIcon className={styles.micIconSvg} />
          </button>
          {showSuggestions && (
            <div className={styles.suggestions}>
              {ROMANTIC_SUGGESTIONS.map((s, i) => (
                <div key={i} className={styles.suggestionItem}>
                  <SearchIcon className={styles.suggestionIconSvg} />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.headerRight}>
          <button className={styles.iconBtn}>
            <span>+</span>
          </button>
          <button className={styles.iconBtn} onClick={(e) => showEasterEgg('bell', e)}>
            <BellIcon className={styles.bellIconSvg} />
            <span className={styles.notifBadge}>1</span>
          </button>
          <button className={styles.profileBtn} onClick={(e) => showEasterEgg('profile', e)}>
            <span>J</span>
          </button>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('home', e)}>
            <HomeIcon className={styles.sidebarIconSvg} />
            <span>Accueil</span>
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('shorts', e)}>
            <PlayIcon className={styles.sidebarIconSvg} />
            <span>Shorts</span>
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('subscriptions', e)}>
            <PlayIcon className={styles.sidebarIconSvg} />
            <span>Abonnements</span>
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('library', e)}>
            <PlayIcon className={styles.sidebarIconSvg} />
            <span>Bibliotheque</span>
          </button>
        </aside>

        {/* Video grid */}
        <main className={styles.videoGrid}>
          {VIDEOS.map((video) => (
            <button
              key={video.id}
              className={`${styles.videoCard} ${video.isTarget ? styles.targetVideo : ''}`}
              onClick={(e) => handleVideoClick(video, e)}
            >
              <div className={styles.thumbnail}>
                <span className={styles.thumbnailEmoji}>{video.thumbnail}</span>
                <span className={styles.duration}>{video.isTarget ? '3:33' : '10:32'}</span>
              </div>
              <div className={styles.videoInfo}>
                <div className={styles.channelAvatar}>
                  {video.channel.charAt(0)}
                </div>
                <div className={styles.videoMeta}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.channelName}>{video.channel}</p>
                  <p className={styles.videoStats}>{video.views} · {video.date}</p>
                </div>
              </div>
            </button>
          ))}
        </main>
      </div>
    </motion.div>
  );

  const renderWatching = () => (
    <motion.div
      className={styles.watchingPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuBtn}>
            <MenuIcon className={styles.menuIconSvg} />
          </button>
          <button className={styles.logoBtn} onClick={() => setPhase('homepage')}>
            <YouTubePlayButton className={styles.ytLogo} />
            <span className={styles.logoText}>YouTube</span>
          </button>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input type="text" className={styles.searchInput} placeholder="Rechercher" />
            <button className={styles.searchBtn}><SearchIcon className={styles.searchIconSvg} /></button>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}><span>+</span></button>
          <button className={styles.iconBtn}><BellIcon className={styles.bellIconSvg} /></button>
          <button className={styles.profileBtn}><span>J</span></button>
        </div>
      </header>

      <div className={styles.watchContent}>
        <div className={styles.videoPlayerContainer}>
          <div className={styles.videoPlayer}>
            <div className={styles.playerArea}>
              <motion.div
                className={styles.romanticMessage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className={styles.messageHeart}>👆</div>
                <p className={styles.messageText}>
                  Bon t'as trouve la video...<br />
                  C'etait pas si dur non ?
                </p>
              </motion.div>
            </div>

            <div className={styles.playerControls}>
              <div className={styles.progressBar}>
                <div className={styles.progressFilled}></div>
              </div>
              <div className={styles.controlButtons}>
                <button className={styles.controlBtn}><PlayIcon className={styles.controlIconSvg} /></button>
                <span className={styles.timeDisplay}>0:42 / 3:33</span>
                <div className={styles.rightControls}>
                  <button className={styles.controlBtn}>⚙</button>
                  <button className={styles.controlBtn}>⛶</button>
                </div>
              </div>
            </div>
          </div>

          {/* Video info and actions - BELOW the video */}
          <div className={styles.videoDetails}>
            <h1 className={styles.watchTitle}>TUTO : Comment dire Oui (simple)</h1>

            {/* Action buttons row - Like button here */}
            <div className={styles.actionButtonsRow}>
              <OuiButton
                label="👍 J'aime"
                className={styles.likeButton}
                onClick={handleLikeClick}
                disableAI
                overridePosition={{ x: 0, y: 0 }}
              />
              <button className={styles.actionBtn}>
                <ThumbDownIcon className={styles.actionIconSvg} />
              </button>
              <button className={styles.actionBtn}>Partager</button>
              <button className={styles.actionBtn}>⋯</button>
            </div>

            <div className={styles.channelRow}>
              <div className={styles.channelAvatarLarge}>P</div>
              <div className={styles.channelMeta}>
                <p className={styles.channelNameLarge}>PasComplique</p>
                <p className={styles.subscriberCount}>1 abonné</p>
              </div>
              <button className={styles.subscribeBtn}>S'abonner</button>
            </div>

            <div className={styles.descriptionBox}>
              <p>1 vue · il y a 1 jour</p>
              <p className={styles.descriptionText}>
                Cette vidéo a été faite pour quelqu'un qui sait pas
                cliquer sur le bon bouton. Même Roy saurait faire.
              </p>
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
        <div className={styles.doneHeart}>
          <ThumbUpIcon className={styles.doneThumbSvg} filled />
        </div>
        <p className={styles.doneMessage}>Ba enfin ! T'as mis le temps quand même...</p>
      </div>
    </motion.div>
  );

  return (
    <UniverseShell ambientColor="#0f0f0f">
      <AnimatePresence mode="wait">
        {phase === 'homepage' && renderHomepage()}
        {phase === 'watching' && renderWatching()}
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

export default U02_YouTube;
