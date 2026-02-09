import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import {
  AppleLogo,
  FinderIcon,
  SafariIcon,
  MessagesIcon,
  PhotosIcon,
  MusicIcon,
  NotesIcon,
  CalendarIcon,
  SettingsIcon,
  TrashIcon,
  LaunchpadIcon,
  MailIcon,
  SearchIcon,
  WifiIcon,
  BatteryIcon,
  PlayIcon,
  ChevronLeft,
  ChevronRight,
} from '../../components/icons/SvgIcons';
import styles from './U07_Apple.module.css';

interface Props {
  mouse: MouseState;
}

type Phase = 'desktop' | 'done';
type OpenApp = 'finder' | 'notes' | 'photos' | 'messages' | 'music' | 'spotlight' | null;

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  children?: FolderItem[];
  content?: string;
  isTarget?: boolean;
}

interface EasterEgg {
  id: number;
  message: string;
  x: number;
  y: number;
}

const FILE_SYSTEM: FolderItem[] = [
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    icon: '📁',
    children: [
      {
        id: 'work',
        name: 'Travail',
        type: 'folder',
        icon: '📁',
        children: [
          { id: 'report', name: 'Rapport.pdf', type: 'file', icon: '📄', content: 'Rien d\'interessant ici' },
          { id: 'budget', name: 'Budget.xlsx', type: 'file', icon: '📊', content: 'Des chiffres, encore des chiffres' },
        ],
      },
      {
        id: 'personal',
        name: 'Personnel',
        type: 'folder',
        icon: '📁',
        children: [
          {
            id: 'secret',
            name: 'Secret',
            type: 'folder',
            icon: '🔒',
            children: [
              {
                id: 'love',
                name: 'Pour toi',
                type: 'folder',
                icon: '❤️',
                children: [
                  {
                    id: 'letter',
                    name: 'Oui.txt',
                    type: 'file',
                    icon: '💌',
                    isTarget: true,
                    content: 'La reponse a toutes tes questions est ici...',
                  },
                ],
              },
              { id: 'diary', name: 'Journal.txt', type: 'file', icon: '📓', content: 'Aujourd\'hui, j\'ai pensé a ton tarpe' },
            ],
          },
          { id: 'photos', name: 'Photos Vacances', type: 'folder', icon: '🖼️', children: [] },
        ],
      },
    ],
  },
  {
    id: 'downloads',
    name: 'Telechargements',
    type: 'folder',
    icon: '📁',
    children: [
      { id: 'song', name: 'Playlist-2024.mp3', type: 'file', icon: '🎵', content: 'Ta playlist Spotify' },
      { id: 'image', name: 'Roy-dort.jpg', type: 'file', icon: '🖼️', content: 'Roy en train de dormir. Comme d\'hab.' },
    ],
  },
  {
    id: 'applications',
    name: 'Applications',
    type: 'folder',
    icon: '📁',
    children: [
      { id: 'app1', name: 'Excel.app', type: 'file', icon: '📊', content: 'Tu passes deja assez de temps dessus au boulot.' },
    ],
  },
];

const NOTES_CONTENT = [
  { id: 1, title: 'Liste de courses', content: 'Croquettes pour Roy\nLait, Pain, Chocolat' },
  { id: 2, title: 'Rappels', content: '- Rappeler Nadine\n- Cliquer sur le bon bouton\n- Donner a manger a Roy' },
  { id: 3, title: 'INDICE', content: 'Chemin: Documents > Personnel > Secret > Pour toi\n\nAllez c\'est pas dur.' },
];

const MESSAGES_CONTENT = [
  { id: 1, sender: 'Moi', text: 'T\'es la ?', time: '14:02' },
  { id: 2, sender: 'Elle', text: 'Oui pq', time: '14:03' },
  { id: 3, sender: 'Moi', text: 'Regarde dans le Finder', time: '14:05' },
  { id: 4, sender: 'Elle', text: 'C\'est ou le Finder', time: '14:05' },
  { id: 5, sender: 'Moi', text: 'Documents > Personnel > Secret > Pour toi. Meme Roy trouverait.', time: '14:06' },
];

const PHOTOS_CONTENT = [
  { id: 1, icon: '🐱', caption: 'Roy qui dort (encore)' },
  { id: 2, icon: '📸', caption: 'Photo floue comme d\'hab' },
  { id: 3, icon: '👩‍🦳', caption: 'Nadine qui fait coucou' },
  { id: 4, icon: '🍕', caption: 'Pizza du vendredi' },
  { id: 5, icon: '🐱', caption: 'Roy sur le clavier' },
  { id: 6, icon: '📊', caption: 'Screenshot Excel (pq?)' },
];

const EASTER_EGGS: Record<string, string> = {
  apple: 'Oui c\'est une pomme, bravo',
  finder: 'La reponse est dans les dossiers',
  trash: 'Tu vas pas jeter des trucs quand meme',
  safari: 'C\'est pas le moment de surfer',
  mail: '3 mails de Evan non lus',
  calendar: 'RDV: Rappeler Eric a 18h',
  settings: 'Les reglages c\'est pas la',
  launchpad: 'Non c\'est pas la non plus',
  wrongFile: 'C\'est pas le bon fichier...',
  music: 'Tu peux ecouter de la musique plus tard',
};

const DOCK_APPS = [
  { id: 'finder', name: 'Finder' },
  { id: 'launchpad', name: 'Launchpad' },
  { id: 'safari', name: 'Safari' },
  { id: 'messages', name: 'Messages' },
  { id: 'mail', name: 'Mail' },
  { id: 'photos', name: 'Photos' },
  { id: 'music', name: 'Musique' },
  { id: 'notes', name: 'Notes' },
  { id: 'calendar', name: 'Calendrier' },
  { id: 'settings', name: 'Preferences' },
];

const getDockIcon = (appId: string) => {
  const iconClass = styles.dockIconSvg;
  switch (appId) {
    case 'finder': return <FinderIcon className={iconClass} size={40} />;
    case 'launchpad': return <LaunchpadIcon className={iconClass} size={40} />;
    case 'safari': return <SafariIcon className={iconClass} size={40} />;
    case 'messages': return <MessagesIcon className={iconClass} size={40} />;
    case 'mail': return <MailIcon className={iconClass} size={40} />;
    case 'photos': return <PhotosIcon className={iconClass} size={40} />;
    case 'music': return <MusicIcon className={iconClass} size={40} />;
    case 'notes': return <NotesIcon className={iconClass} size={40} />;
    case 'calendar': return <CalendarIcon className={iconClass} size={40} />;
    case 'settings': return <SettingsIcon className={iconClass} size={40} />;
    default: return null;
  }
};

function U07_Apple({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(7);
  const [phase, setPhase] = useState<Phase>('desktop');
  const [openApp, setOpenApp] = useState<OpenApp>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FolderItem[]>(FILE_SYSTEM);
  const [selectedFile, setSelectedFile] = useState<FolderItem | null>(null);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([]);
  const [menuTime, setMenuTime] = useState('');
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({});
  const eggIdRef = useRef(0);

  useEffect(() => {
    startPuzzle();
    const updateTime = () => {
      const now = new Date();
      setMenuTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
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

  const findFolderByPath = useCallback((path: string[]): FolderItem[] => {
    let current = FILE_SYSTEM;
    for (const segment of path) {
      const folder = current.find((f) => f.id === segment);
      if (folder && folder.children) {
        current = folder.children;
      }
    }
    return current;
  }, []);

  const handleFolderOpen = useCallback((item: FolderItem) => {
    if (item.type === 'folder' && item.children) {
      setCurrentPath((prev) => [...prev, item.id]);
      setCurrentFolder(item.children);
      setSelectedFile(null);
    } else {
      setSelectedFile(item);
    }
  }, []);

  const handlePathClick = useCallback((index: number) => {
    if (index === -1) {
      setCurrentPath([]);
      setCurrentFolder(FILE_SYSTEM);
    } else {
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);
      setCurrentFolder(findFolderByPath(newPath));
    }
    setSelectedFile(null);
  }, [currentPath, findFolderByPath]);

  const handleDockClick = useCallback((appId: string, e: React.MouseEvent) => {
    if (appId === 'finder') {
      setOpenApp('finder');
      setCurrentPath([]);
      setCurrentFolder(FILE_SYSTEM);
      setSelectedFile(null);
    } else if (appId === 'notes') {
      setOpenApp('notes');
    } else if (appId === 'photos') {
      setOpenApp('photos');
    } else if (appId === 'messages') {
      setOpenApp('messages');
    } else if (appId === 'music') {
      setOpenApp('music');
    } else if (['safari', 'mail', 'calendar', 'settings', 'launchpad'].includes(appId)) {
      showEasterEgg(appId, e);
    }
  }, [showEasterEgg]);

  const handleSpotlightSearch = useCallback(() => {
    const query = spotlightQuery.toLowerCase();
    if (query.includes('oui') || query.includes('amour') || query.includes('love') || query.includes('secret')) {
      // Give a hint
      setOpenApp('finder');
      setCurrentPath(['documents', 'personal']);
      setCurrentFolder(findFolderByPath(['documents', 'personal']));
    }
    setOpenApp(null);
    setSpotlightQuery('');
  }, [spotlightQuery, findFolderByPath]);

  const handleOpenTargetFile = useCallback(() => {
    setPhase('done');
    setTimeout(() => {
      complete();
    }, 2500);
  }, [complete]);

  const handleFileClick = useCallback((item: FolderItem, e: React.MouseEvent) => {
    if (item.type === 'file' && !item.isTarget) {
      showEasterEgg('wrongFile', e);
    }
    setSelectedFile(item);
  }, [showEasterEgg]);

  const renderMenuBar = () => (
    <div className={styles.menuBar}>
      <div className={styles.menuLeft}>
        <button className={styles.appleBtn} onClick={(e) => showEasterEgg('apple', e)}>
          <AppleLogo className={styles.appleLogoSvg} />
        </button>
        <span className={styles.menuAppName}>Finder</span>
        <button className={styles.menuItem}>Fichier</button>
        <button className={styles.menuItem}>Edition</button>
        <button className={styles.menuItem}>Presentation</button>
        <button className={styles.menuItem}>Aller</button>
        <button className={styles.menuItem}>Fenetre</button>
        <button className={styles.menuItem}>Aide</button>
      </div>
      <div className={styles.menuRight}>
        <button className={styles.menuIcon}><BatteryIcon className={styles.menuIconSvg} /></button>
        <button className={styles.menuIcon}><WifiIcon className={styles.menuIconSvg} /></button>
        <button className={styles.menuIcon} onClick={() => setOpenApp('spotlight')}><SearchIcon className={styles.menuIconSvg} /></button>
        <span className={styles.menuTime}>{menuTime}</span>
      </div>
    </div>
  );

  const renderDesktopIcons = () => (
    <div className={styles.desktopIcons}>
      <button className={styles.desktopIcon} onClick={() => { setOpenApp('finder'); setCurrentPath([]); setCurrentFolder(FILE_SYSTEM); }}>
        <span className={styles.iconEmoji}>💻</span>
        <span className={styles.iconLabel}>Macintosh HD</span>
      </button>
      <button className={styles.desktopIcon} onClick={() => { setOpenApp('finder'); handlePathClick(-1); }}>
        <span className={styles.iconEmoji}>📁</span>
        <span className={styles.iconLabel}>Documents</span>
      </button>
    </div>
  );

  const renderDock = () => (
    <div className={styles.dock}>
      <div className={styles.dockContainer}>
        {DOCK_APPS.map((app) => (
          <motion.button
            key={app.id}
            className={`${styles.dockItem} ${openApp === app.id ? styles.dockItemActive : ''}`}
            onClick={(e) => handleDockClick(app.id, e)}
            whileHover={{ scale: 1.3, y: -10 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {getDockIcon(app.id)}
          </motion.button>
        ))}
        <div className={styles.dockDivider}></div>
        <motion.button
          className={styles.dockItem}
          onClick={(e) => showEasterEgg('trash', e)}
          whileHover={{ scale: 1.3, y: -10 }}
        >
          <TrashIcon className={styles.dockIconSvg} size={40} />
        </motion.button>
      </div>
    </div>
  );

  const renderFinderWindow = () => (
    <motion.div
      className={styles.window}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      style={{ width: 700, height: 450 }}
    >
      <div className={styles.windowHeader}>
        <div className={styles.windowButtons}>
          <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
          <button className={styles.windowBtnMinimize}></button>
          <button className={styles.windowBtnMaximize}></button>
        </div>
        <div className={styles.windowTitle}>
          <span>📁</span> Finder
        </div>
      </div>

      <div className={styles.finderToolbar}>
        <button className={styles.finderBtn} onClick={() => handlePathClick(currentPath.length - 2)}><ChevronLeft className={styles.navArrowSvg} /></button>
        <button className={styles.finderBtn}><ChevronRight className={styles.navArrowSvg} /></button>
        <div className={styles.finderPath}>
          <button onClick={() => handlePathClick(-1)} className={styles.pathSegment}>
            💻
          </button>
          {currentPath.map((segment, index) => (
            <span key={segment}>
              <span className={styles.pathSeparator}>/</span>
              <button onClick={() => handlePathClick(index)} className={styles.pathSegment}>
                {FILE_SYSTEM.find(f => f.id === segment)?.name ||
                 findFolderByPath(currentPath.slice(0, index)).find(f => f.id === segment)?.name || segment}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.finderContent}>
        <div className={styles.finderSidebar}>
          <div className={styles.sidebarSection}>
            <span className={styles.sidebarTitle}>Favoris</span>
            <button className={styles.sidebarItem} onClick={() => { setCurrentPath([]); setCurrentFolder(FILE_SYSTEM); }}>
              🏠 Bureau
            </button>
            <button className={styles.sidebarItem} onClick={() => { setCurrentPath(['documents']); setCurrentFolder(findFolderByPath(['documents'])); }}>
              📁 Documents
            </button>
            <button className={styles.sidebarItem} onClick={() => { setCurrentPath(['downloads']); setCurrentFolder(findFolderByPath(['downloads'])); }}>
              ⬇️ Telechargements
            </button>
          </div>
        </div>

        <div className={styles.finderMain}>
          <div className={styles.finderGrid}>
            {currentFolder.map((item) => (
              <button
                key={item.id}
                className={`${styles.finderItem} ${selectedFile?.id === item.id ? styles.selected : ''}`}
                onClick={(e) => handleFileClick(item, e)}
                onDoubleClick={() => handleFolderOpen(item)}
              >
                <span className={styles.finderItemIcon}>{item.icon}</span>
                <span className={styles.finderItemName}>{item.name}</span>
              </button>
            ))}
          </div>

          {selectedFile && (
            <div className={styles.finderPreview}>
              <div className={styles.previewIcon}>{selectedFile.icon}</div>
              <div className={styles.previewName}>{selectedFile.name}</div>
              {selectedFile.content && <div className={styles.previewContent}>{selectedFile.content}</div>}
              {selectedFile.isTarget && (
                <OuiButton
                  label="Ouvrir"
                  className={styles.openButton}
                  onClick={handleOpenTargetFile}
                  disableAI
                  overridePosition={{ x: 0, y: 0 }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderNotesWindow = () => (
    <motion.div
      className={styles.window}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      style={{ width: 600, height: 400 }}
    >
      <div className={styles.windowHeader}>
        <div className={styles.windowButtons}>
          <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
          <button className={styles.windowBtnMinimize}></button>
          <button className={styles.windowBtnMaximize}></button>
        </div>
        <div className={styles.windowTitle}>
          <span>📝</span> Notes
        </div>
      </div>
      <div className={styles.notesContent}>
        <div className={styles.notesList}>
          {NOTES_CONTENT.map((note) => (
            <div key={note.id} className={styles.noteItem}>
              <div className={styles.noteTitle}>{note.title}</div>
              <div className={styles.notePreview}>{note.content.substring(0, 30)}...</div>
            </div>
          ))}
        </div>
        <div className={styles.noteDetail}>
          <div className={styles.noteDetailTitle}>{NOTES_CONTENT[2].title}</div>
          <div className={styles.noteDetailContent}>{NOTES_CONTENT[2].content}</div>
        </div>
      </div>
    </motion.div>
  );

  const renderMessagesWindow = () => (
    <motion.div
      className={styles.window}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      style={{ width: 600, height: 450 }}
    >
      <div className={styles.windowHeader}>
        <div className={styles.windowButtons}>
          <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
          <button className={styles.windowBtnMinimize}></button>
          <button className={styles.windowBtnMaximize}></button>
        </div>
        <div className={styles.windowTitle}>
          <span>💬</span> Messages
        </div>
      </div>
      <div className={styles.messagesContent}>
        <div className={styles.messagesSidebar}>
          <div className={styles.messagesContact}>
            <div className={styles.contactAvatar}>❤️</div>
            <div className={styles.contactInfo}>
              <div className={styles.contactName}>Mon Amour</div>
              <div className={styles.contactLastMsg}>Regarde dans le Finder...</div>
            </div>
          </div>
        </div>
        <div className={styles.messagesMain}>
          <div className={styles.messagesHeader}>
            <span className={styles.messagesTo}>Mon Amour</span>
          </div>
          <div className={styles.messagesList}>
            {MESSAGES_CONTENT.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${msg.sender === 'Moi' ? styles.messageSent : styles.messageReceived}`}>
                <div className={styles.messageBubble}>{msg.text}</div>
                <div className={styles.messageTime}>{msg.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPhotosWindow = () => (
    <motion.div
      className={styles.window}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      style={{ width: 650, height: 450 }}
    >
      <div className={styles.windowHeader}>
        <div className={styles.windowButtons}>
          <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
          <button className={styles.windowBtnMinimize}></button>
          <button className={styles.windowBtnMaximize}></button>
        </div>
        <div className={styles.windowTitle}>
          <span>🌈</span> Photos
        </div>
      </div>
      <div className={styles.photosContent}>
        <div className={styles.photosGrid}>
          {PHOTOS_CONTENT.map((photo) => (
            <div key={photo.id} className={styles.photoItem}>
              <div className={styles.photoThumb}>{photo.icon}</div>
              <div className={styles.photoCaption}>{photo.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderMusicWindow = () => (
    <motion.div
      className={styles.window}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      style={{ width: 500, height: 350 }}
    >
      <div className={styles.windowHeader}>
        <div className={styles.windowButtons}>
          <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
          <button className={styles.windowBtnMinimize}></button>
          <button className={styles.windowBtnMaximize}></button>
        </div>
        <div className={styles.windowTitle}>
          <span>🎵</span> Musique
        </div>
      </div>
      <div className={styles.musicContent}>
        <div className={styles.musicPlayer}>
          <div className={styles.albumArt}>❤️</div>
          <div className={styles.songInfo}>
            <div className={styles.songTitle}>Notre Chanson</div>
            <div className={styles.songArtist}>Toi & Moi</div>
          </div>
          <div className={styles.musicProgress}>
            <div className={styles.musicProgressBar}>
              <div className={styles.musicProgressFill}></div>
            </div>
            <div className={styles.musicTime}>
              <span>1:42</span>
              <span>3:33</span>
            </div>
          </div>
          <div className={styles.musicControls}>
            <button className={styles.musicBtn}><ChevronLeft className={styles.musicControlSvg} /></button>
            <button className={styles.musicBtn}><PlayIcon className={styles.musicControlSvg} /></button>
            <button className={styles.musicBtn}><ChevronRight className={styles.musicControlSvg} /></button>
          </div>
        </div>
        <div className={styles.playlist}>
          <div className={styles.playlistItem}>
            <span>🎵</span> Notre Chanson - Toi & Moi
          </div>
          <div className={styles.playlistItem}>
            <span>🎵</span> Ensemble - Pour Toujours
          </div>
          <div className={styles.playlistItem}>
            <span>🎵</span> La Reponse - C'est Oui
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSpotlight = () => (
    <motion.div
      className={styles.spotlightOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setOpenApp(null)}
    >
      <motion.div
        className={styles.spotlightBox}
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <SearchIcon className={styles.spotlightIconSvg} />
        <input
          type="text"
          className={styles.spotlightInput}
          placeholder="Recherche Spotlight"
          value={spotlightQuery}
          onChange={(e) => setSpotlightQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSpotlightSearch()}
          autoFocus
        />
      </motion.div>
      {spotlightQuery && (
        <motion.div
          className={styles.spotlightResults}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.spotlightResult}>
            <span>📁</span> Documents
          </div>
          <div className={styles.spotlightResult}>
            <span>🔒</span> Secret
          </div>
          <div className={styles.spotlightResult}>
            <span>💌</span> Oui.txt
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderDone = () => (
    <motion.div
      className={styles.doneOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className={styles.doneContent}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      >
        <AppleLogo className={styles.doneAppleSvg} color="#fff" />
        <div className={styles.doneMessage}>
          Ba voila...<br />
          <span className={styles.doneHeart}>C'etait pas si dur.</span>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <UniverseShell ambientColor="#1e1e1e">
      {phase === 'desktop' && (
        <div className={styles.desktop}>
          {/* Wallpaper */}
          <div className={styles.wallpaper}></div>

          {/* Menu bar */}
          {renderMenuBar()}

          {/* Desktop icons */}
          {renderDesktopIcons()}

          {/* Windows */}
          <AnimatePresence>
            {openApp === 'finder' && renderFinderWindow()}
            {openApp === 'notes' && renderNotesWindow()}
            {openApp === 'messages' && renderMessagesWindow()}
            {openApp === 'photos' && renderPhotosWindow()}
            {openApp === 'music' && renderMusicWindow()}
            {openApp === 'spotlight' && renderSpotlight()}
          </AnimatePresence>

          {/* Dock */}
          {renderDock()}
        </div>
      )}

      {phase === 'done' && renderDone()}

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

export default U07_Apple;
