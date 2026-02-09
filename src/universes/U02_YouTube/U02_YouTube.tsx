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

const RECOMMENDED_VIDEOS: Video[] = [
  { id: 101, title: 'Comment répondre vite aux messages', channel: 'LifeHacks', views: '1,2M vues', date: 'il y a 2 semaines', thumbnail: '💬' },
  { id: 102, title: 'Roy le chat qui dort 20h par jour', channel: 'ChatsMarrants', views: '5M vues', date: 'il y a 3 mois', thumbnail: '😴' },
  { id: 103, title: 'Les comptables ont-ils des sentiments ?', channel: 'Philosophie', views: '800K vues', date: 'il y a 1 mois', thumbnail: '🤔' },
  { id: 104, title: 'Nadine vs les réseaux sociaux', channel: 'MamansTV', views: '2M vues', date: 'il y a 5 mois', thumbnail: '📱' },
  { id: 105, title: '10 façons de dire Oui sans parler', channel: 'Communication', views: '3,5M vues', date: 'il y a 2 mois', thumbnail: '🙋' },
  { id: 106, title: 'Pourquoi ton chat te fixe', channel: 'PetLovers', views: '12M vues', date: 'il y a 6 mois', thumbnail: '👀' },
];

const COMMENTS = [
  { id: 1, author: 'Roy_LeChatFan', avatar: '🐱', text: 'Miaou ! (traduction: super vidéo)', likes: '1,2K', time: 'il y a 2 heures' },
  { id: 2, author: 'Nadine_Officiel', avatar: '👩‍🦳', text: 'Ma fille m\'a envoyé cette vidéo, je comprends pas pourquoi 🤔', likes: '856', time: 'il y a 5 heures' },
  { id: 3, author: 'ComptableAnxieux', avatar: '📊', text: 'En tant que comptable, j\'approuve ce message. Les chiffres disent Oui.', likes: '423', time: 'il y a 1 jour' },
  { id: 4, author: 'JulieFan2024', avatar: '❤️', text: 'Quelqu\'un peut m\'expliquer ? Je suis perdue...', likes: '2,1K', time: 'il y a 3 heures' },
  { id: 5, author: 'EricLeFrere', avatar: '👦', text: 'Ptdr c\'est trop elle 😂😂😂', likes: '567', time: 'il y a 30 minutes' },
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
  menu: 'Le menu c\'est pas la solution',
  history: 'Ton historique ? Que des vidéos de chats',
  downloads: 'Tu télécharges quoi ? La réponse ?',
  yourVideos: 'T\'as pas de chaîne, cherche la bonne vidéo',
  watchLater: 'Plus tard ? Non maintenant !',
  likedVideos: 'Tu likes avant de trouver ?',
  settings: 'Les paramètres vont pas t\'aider',
  fullscreen: 'Tu veux voir ma tête en grand ?',
  volume: 'Monte le son pour entendre "Oui" 🔊',
  dislike: 'Eh ! Sois gentille quand même...',
  share: 'Partager quoi ? T\'as même pas liké !',
  more: 'Plus d\'options = plus de temps perdu',
  subscribe: 'T\'abonner ? Commence par liker !',
  recommendedVideo: 'C\'est pas cette vidéo qu\'il faut regarder !',
  comment: 'Commente pas, like !',
  commentInput: 'Écris pas, clique sur J\'aime !',
};

function U02_YouTube({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(2);
  const [phase, setPhase] = useState<Phase>('homepage');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([]);
  const eggIdRef = useRef(0);

  // New states for interactivity
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(21);
  const [volume, setVolume] = useState(80);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    startPuzzle();
  }, [startPuzzle]);

  // Simulate video progress when playing
  useEffect(() => {
    if (!isPlaying || phase !== 'watching') return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, phase]);

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

  const handleVideoClick = useCallback((video: Video, e: React.MouseEvent) => {
    if (video.isTarget) {
      setPhase('watching');
    } else {
      const message = WRONG_VIDEO_MESSAGES[Math.floor(Math.random() * WRONG_VIDEO_MESSAGES.length)];
      showCustomMessage(message, e);
    }
  }, [showCustomMessage]);

  const handleLikeClick = useCallback(() => {
    setPhase('done');
    setTimeout(() => {
      complete();
    }, 2000);
  }, [complete]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setVideoProgress(Math.max(0, Math.min(100, percent)));
  }, []);

  const formatTime = (percent: number) => {
    const totalSeconds = Math.floor((percent / 100) * 213); // 3:33 = 213 seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
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
        <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarCollapsed : ''}`}>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('home', e)}>
            <HomeIcon className={styles.sidebarIconSvg} />
            {sidebarOpen && <span>Accueil</span>}
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('shorts', e)}>
            <PlayIcon className={styles.sidebarIconSvg} />
            {sidebarOpen && <span>Shorts</span>}
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('subscriptions', e)}>
            <PlayIcon className={styles.sidebarIconSvg} />
            {sidebarOpen && <span>Abonnements</span>}
          </button>

          {sidebarOpen && <div className={styles.sidebarDivider} />}

          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('library', e)}>
            <span className={styles.sidebarIconEmoji}>📚</span>
            {sidebarOpen && <span>Bibliothèque</span>}
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('history', e)}>
            <span className={styles.sidebarIconEmoji}>🕐</span>
            {sidebarOpen && <span>Historique</span>}
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('yourVideos', e)}>
            <span className={styles.sidebarIconEmoji}>🎬</span>
            {sidebarOpen && <span>Vos vidéos</span>}
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('watchLater', e)}>
            <span className={styles.sidebarIconEmoji}>⏰</span>
            {sidebarOpen && <span>À regarder plus tard</span>}
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('likedVideos', e)}>
            <span className={styles.sidebarIconEmoji}>👍</span>
            {sidebarOpen && <span>Vidéos likées</span>}
          </button>
          <button className={styles.sidebarItem} onClick={(e) => showEasterEgg('downloads', e)}>
            <span className={styles.sidebarIconEmoji}>⬇️</span>
            {sidebarOpen && <span>Téléchargements</span>}
          </button>

          {sidebarOpen && (
            <>
              <div className={styles.sidebarDivider} />
              <p className={styles.sidebarSectionTitle}>Abonnements</p>
              <button className={styles.sidebarItem} onClick={(e) => showCustomMessage('Roy a pas de chaîne YouTube... enfin pas encore', e)}>
                <span className={styles.sidebarIconEmoji}>🐱</span>
                <span>Roy le Chat</span>
              </button>
              <button className={styles.sidebarItem} onClick={(e) => showCustomMessage('Nadine poste que des photos de plats', e)}>
                <span className={styles.sidebarIconEmoji}>👩‍🦳</span>
                <span>Nadine</span>
              </button>
            </>
          )}
        </aside>

        {/* Video grid */}
        <main className={`${styles.videoGrid} ${!sidebarOpen ? styles.videoGridExpanded : ''}`}>
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
          <button className={styles.menuBtn} onClick={(e) => showEasterEgg('menu', e)}>
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
          <button className={styles.iconBtn} onClick={(e) => showEasterEgg('bell', e)}>
            <BellIcon className={styles.bellIconSvg} />
          </button>
          <button className={styles.profileBtn} onClick={(e) => showEasterEgg('profile', e)}>
            <span>J</span>
          </button>
        </div>
      </header>

      <div className={styles.watchContent}>
        <div className={styles.watchMain}>
          <div className={styles.videoPlayerContainer}>
            <div className={styles.videoPlayer}>
              <div
                className={styles.playerArea}
                onClick={() => setIsPlaying(!isPlaying)}
              >
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

                {/* Play/Pause overlay */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      className={styles.playOverlay}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <div className={styles.bigPlayButton}>▶</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.playerControls}>
                <div
                  className={styles.progressBar}
                  onClick={handleProgressClick}
                >
                  <div
                    className={styles.progressFilled}
                    style={{ width: `${videoProgress}%` }}
                  />
                  <div
                    className={styles.progressHandle}
                    style={{ left: `${videoProgress}%` }}
                  />
                </div>
                <div className={styles.controlButtons}>
                  <div className={styles.leftControls}>
                    <button
                      className={styles.controlBtn}
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className={styles.controlBtn}>⏭</button>

                    <div
                      className={styles.volumeContainer}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <button
                        className={styles.controlBtn}
                        onClick={(e) => {
                          setVolume(volume === 0 ? 80 : 0);
                          showEasterEgg('volume', e);
                        }}
                      >
                        {volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
                      </button>
                      {showVolumeSlider && (
                        <div className={styles.volumeSlider}>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className={styles.volumeInput}
                          />
                        </div>
                      )}
                    </div>

                    <span className={styles.timeDisplay}>
                      {formatTime(videoProgress)} / 3:33
                    </span>
                  </div>
                  <div className={styles.rightControls}>
                    <button className={styles.controlBtn} onClick={(e) => showEasterEgg('settings', e)}>⚙</button>
                    <button className={styles.controlBtn} onClick={(e) => showEasterEgg('fullscreen', e)}>⛶</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video info and actions */}
            <div className={styles.videoDetails}>
              <h1 className={styles.watchTitle}>TUTO : Comment dire Oui (simple)</h1>

              {/* Action buttons row */}
              <div className={styles.actionButtonsRow}>
                <OuiButton
                  label="👍 J'aime"
                  className={styles.likeButton}
                  onClick={handleLikeClick}
                  disableAI
                  overridePosition={{ x: 0, y: 0 }}
                />
                <button className={styles.actionBtn} onClick={(e) => showEasterEgg('dislike', e)}>
                  <ThumbDownIcon className={styles.actionIconSvg} />
                </button>
                <button className={styles.actionBtn} onClick={(e) => showEasterEgg('share', e)}>
                  Partager
                </button>
                <button className={styles.actionBtn} onClick={(e) => showEasterEgg('more', e)}>
                  ⋯
                </button>
              </div>

              <div className={styles.channelRow}>
                <div className={styles.channelAvatarLarge}>P</div>
                <div className={styles.channelMeta}>
                  <p className={styles.channelNameLarge}>PasComplique</p>
                  <p className={styles.subscriberCount}>1 abonné</p>
                </div>
                <button
                  className={styles.subscribeBtn}
                  onClick={(e) => showEasterEgg('subscribe', e)}
                >
                  S'abonner
                </button>
              </div>

              {/* Expandable description */}
              <div className={`${styles.descriptionBox} ${descriptionExpanded ? styles.descriptionExpanded : ''}`}>
                <p className={styles.descriptionStats}>1 vue · il y a 1 jour</p>
                <p className={styles.descriptionText}>
                  Cette vidéo a été faite pour quelqu'un qui sait pas
                  cliquer sur le bon bouton. Même Roy saurait faire.
                  {descriptionExpanded && (
                    <>
                      <br /><br />
                      📌 Dans cette vidéo tu vas apprendre :
                      <br />- Comment trouver le bouton "J'aime"
                      <br />- Comment cliquer dessus (c'est dur je sais)
                      <br />- Pourquoi tu devrais le faire MAINTENANT
                      <br /><br />
                      🔔 N'oublie pas de t'abonner ! (après avoir liké)
                      <br /><br />
                      #Oui #Valentine #RoyLeChatApprouve
                      <br /><br />
                      Musique : "Click Click Boom" par Les Comptables
                    </>
                  )}
                </p>
                <button
                  className={styles.descriptionToggle}
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                >
                  {descriptionExpanded ? 'Moins' : 'Plus'}
                </button>
              </div>

              {/* Comments section */}
              <div className={styles.commentsSection}>
                <h3 className={styles.commentsTitle}>
                  {COMMENTS.length} commentaires
                </h3>

                <div className={styles.commentInput}>
                  <div className={styles.commentAvatar}>J</div>
                  <input
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onClick={(e) => showEasterEgg('commentInput', e)}
                    className={styles.commentTextInput}
                  />
                </div>

                <div className={styles.commentsList}>
                  {COMMENTS.map((comment) => (
                    <div
                      key={comment.id}
                      className={styles.comment}
                      onClick={(e) => showEasterEgg('comment', e)}
                    >
                      <div className={styles.commentAvatar}>{comment.avatar}</div>
                      <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>{comment.author}</span>
                          <span className={styles.commentTime}>{comment.time}</span>
                        </div>
                        <p className={styles.commentText}>{comment.text}</p>
                        <div className={styles.commentActions}>
                          <button className={styles.commentActionBtn}>
                            <ThumbUpIcon className={styles.commentIcon} />
                            {comment.likes}
                          </button>
                          <button className={styles.commentActionBtn}>
                            <ThumbDownIcon className={styles.commentIcon} />
                          </button>
                          <button className={styles.commentActionBtn}>Répondre</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended videos sidebar */}
          <div className={styles.recommendedSidebar}>
            <h3 className={styles.recommendedTitle}>Vidéos recommandées</h3>
            <div className={styles.recommendedList}>
              {RECOMMENDED_VIDEOS.map((video) => (
                <button
                  key={video.id}
                  className={styles.recommendedCard}
                  onClick={(e) => showEasterEgg('recommendedVideo', e)}
                >
                  <div className={styles.recommendedThumbnail}>
                    <span className={styles.recommendedEmoji}>{video.thumbnail}</span>
                    <span className={styles.recommendedDuration}>10:32</span>
                  </div>
                  <div className={styles.recommendedInfo}>
                    <h4 className={styles.recommendedVideoTitle}>{video.title}</h4>
                    <p className={styles.recommendedChannel}>{video.channel}</p>
                    <p className={styles.recommendedStats}>{video.views} · {video.date}</p>
                  </div>
                </button>
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
