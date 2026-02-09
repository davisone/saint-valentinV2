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
type OpenApp = 'finder' | 'notes' | 'photos' | 'messages' | 'music' | 'spotlight' | 'safari' | 'calendar' | 'terminal' | 'launchpad' | 'settings' | null;
type OpenMenu = 'apple' | 'file' | 'edit' | 'view' | 'go' | 'window' | 'help' | 'control' | null;

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

const SAFARI_BOOKMARKS = [
  { id: 1, name: 'Google', url: 'google.com', icon: '🔍' },
  { id: 2, name: 'YouTube', url: 'youtube.com', icon: '▶️' },
  { id: 3, name: 'Amazon', url: 'amazon.fr', icon: '📦' },
  { id: 4, name: 'Netflix', url: 'netflix.com', icon: '🎬' },
];

const SAFARI_HISTORY = [
  { id: 1, title: 'Comment dire oui a quelqu\'un', url: 'google.com/search?q=...' },
  { id: 2, title: 'Croquettes chat prix', url: 'amazon.fr/croquettes' },
  { id: 3, title: 'Nadine Facebook', url: 'facebook.com/nadine' },
];

const CALENDAR_EVENTS = [
  { id: 1, day: 14, title: 'Saint Valentin ❤️', time: 'Toute la journee', color: '#ff6b6b' },
  { id: 2, day: 10, title: 'Rappeler Eric', time: '18:00', color: '#007aff' },
  { id: 3, day: 15, title: 'Croquettes Roy', time: '10:00', color: '#ff9500' },
  { id: 4, day: 20, title: 'Diner Nadine', time: '19:30', color: '#5856d6' },
];

const TERMINAL_COMMANDS: Record<string, string> = {
  'help': 'Commandes: ls, cd, cat, pwd, whoami, clear, love',
  'ls': 'Documents  Downloads  Desktop  secret.txt',
  'pwd': '/Users/julie',
  'whoami': 'julie (mais t\'es qui toi?)',
  'cat secret.txt': 'La reponse est dans le Finder... Documents > Personnel > Secret',
  'love': '❤️ Oui ❤️',
  'cd': 'Ou tu veux aller comme ca?',
  'clear': '',
  'sudo': 'T\'es pas admin ici',
  'rm': 'NON! On supprime rien!',
  'exit': 'Tu peux pas partir',
};

const LAUNCHPAD_APPS = [
  { id: 'finder', name: 'Finder', row: 0 },
  { id: 'safari', name: 'Safari', row: 0 },
  { id: 'messages', name: 'Messages', row: 0 },
  { id: 'mail', name: 'Mail', row: 0 },
  { id: 'photos', name: 'Photos', row: 0 },
  { id: 'music', name: 'Musique', row: 0 },
  { id: 'notes', name: 'Notes', row: 1 },
  { id: 'calendar', name: 'Calendrier', row: 1 },
  { id: 'settings', name: 'Preferences', row: 1 },
  { id: 'terminal', name: 'Terminal', row: 1 },
  { id: 'facetime', name: 'FaceTime', row: 1 },
  { id: 'appstore', name: 'App Store', row: 1 },
];

const SETTINGS_PANELS = [
  { id: 'general', name: 'General', icon: '⚙️' },
  { id: 'desktop', name: 'Bureau', icon: '🖼️' },
  { id: 'dock', name: 'Dock', icon: '⬇️' },
  { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
  { id: 'bluetooth', name: 'Bluetooth', icon: '🔵' },
  { id: 'sound', name: 'Son', icon: '🔊' },
  { id: 'notifications', name: 'Notifications', icon: '🔔' },
  { id: 'users', name: 'Utilisateurs', icon: '👤' },
];

const EASTER_EGGS: Record<string, string> = {
  apple: 'Oui c\'est une pomme, bravo',
  finder: 'La reponse est dans les dossiers',
  trash: 'Tu vas pas jeter des trucs quand meme',
  mail: '3 mails de Nadine non lus',
  wrongFile: 'C\'est pas le bon fichier...',
  aboutMac: 'MacBook Pro de Julie - Achete avec l\'argent de Nadine',
  systemPrefs: 'Y\'a rien a regler',
  appStore: 'T\'as pas besoin d\'apps',
  recentItems: 'T\'as rien fait recemment',
  forceQuit: 'Ca marche tres bien!',
  sleep: 'Pas le moment de dormir',
  restart: 'Non on redemarre pas',
  shutdown: 'Tu quittes pas',
  lockScreen: 'Reste la',
  fileNew: 'Nouveau quoi?',
  fileOpen: 'Ouvre le Finder plutot',
  fileSave: 'Rien a sauvegarder',
  editUndo: 'Trop tard',
  editCopy: 'Copie de quoi?',
  editPaste: 'Rien dans le presse-papier',
  viewIcons: 'Deja en icones',
  viewList: 'C\'est mieux en icones',
  goBack: 'Tu peux pas revenir en arriere',
  goHome: 'T\'es deja chez toi',
  windowMinimize: 'Faut garder la fenetre ouverte',
  helpSearch: 'L\'aide c\'est dans Notes',
  facetime: 'Appelle pas Nadine maintenant',
  wifi: 'WiFi: MaisonDeJulie - Mot de passe: Roy123',
  bluetooth: 'AirPods de Julie connectes',
  battery: 'Batterie: 69% (nice)',
  volumeUp: 'C\'est deja assez fort',
  volumeDown: 'On baisse pas le son',
  brightness: 'Luminosite parfaite',
  airdrop: 'Personne autour de toi',
  focus: 'Mode Concentration: Desactive (comme toi)',
  safariBack: 'Y\'a rien derriere',
  safariForward: 'Y\'a rien devant',
  bookmark: 'Deja dans les favoris',
  newTab: 'Un onglet suffit',
  calendarToday: 'Aujourd\'hui: Saint Valentin!',
  calendarEvent: 'Evenement important!',
  terminalError: 'Commande inconnue',
  settingsPanel: 'Rien a configurer ici',
  notification: 'Tu as vu la notification?',
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
  const [menuDate, setMenuDate] = useState('');
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [safariUrl, setSafariUrl] = useState('google.com');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['Bienvenue dans Terminal', 'Tape "help" pour les commandes']);
  const [terminalInput, setTerminalInput] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [notifications, setNotifications] = useState<{ id: number; title: string; message: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [selectedSettingsPanel, setSelectedSettingsPanel] = useState('general');
  const eggIdRef = useRef(0);
  const notificationIdRef = useRef(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startPuzzle();
    const updateTime = () => {
      const now = new Date();
      setMenuTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setMenuDate(now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startPuzzle]);

  // Show notification on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      showNotification('Messages', 'Julie: Regarde dans le Finder...');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = useCallback((title: string, message: string) => {
    const id = ++notificationIdRef.current;
    setNotifications((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

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
    setOpenMenu(null);
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
    } else if (appId === 'safari') {
      setOpenApp('safari');
    } else if (appId === 'calendar') {
      setOpenApp('calendar');
    } else if (appId === 'settings') {
      setOpenApp('settings');
    } else if (appId === 'launchpad') {
      setOpenApp('launchpad');
    } else if (appId === 'terminal') {
      setOpenApp('terminal');
    } else if (['mail', 'facetime', 'appstore'].includes(appId)) {
      showEasterEgg(appId === 'mail' ? 'mail' : appId === 'facetime' ? 'facetime' : 'appStore', e);
    }
  }, [showEasterEgg]);

  const handleMenuClick = useCallback((menu: OpenMenu, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenu(openMenu === menu ? null : menu);
  }, [openMenu]);

  const handleMenuItemClick = useCallback((action: string, e: React.MouseEvent) => {
    setOpenMenu(null);
    showEasterEgg(action, e);
  }, [showEasterEgg]);

  const handleTerminalCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim();
    const response = TERMINAL_COMMANDS[cmd] || 'Commande inconnue. Tape "help"';

    if (cmd === 'clear') {
      setTerminalHistory(['Terminal efface']);
    } else {
      setTerminalHistory((prev) => [...prev, `$ ${command}`, response]);
    }
    setTerminalInput('');

    // Scroll to bottom
    setTimeout(() => {
      terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
    }, 50);
  }, []);

  const handleTerminalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTerminalCommand(terminalInput);
    }
  }, [terminalInput, handleTerminalCommand]);

  const getCalendarDays = useCallback(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [calendarMonth, calendarYear]);

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
    <div className={styles.menuBar} onClick={() => setOpenMenu(null)}>
      <div className={styles.menuLeft}>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.appleBtn} onClick={(e) => handleMenuClick('apple', e)}>
            <AppleLogo className={styles.appleLogoSvg} />
          </button>
          {openMenu === 'apple' && (
            <div className={styles.menuDropdown}>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('aboutMac', e)}>A propos de ce Mac</button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('systemPrefs', e)}>Preferences Systeme...</button>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('appStore', e)}>App Store...</button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('recentItems', e)}>Elements recents</button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('forceQuit', e)}>Forcer a quitter...</button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('sleep', e)}>Suspendre</button>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('restart', e)}>Redemarrer...</button>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('shutdown', e)}>Eteindre...</button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('lockScreen', e)}>Verrouiller l'ecran</button>
            </div>
          )}
        </div>
        <span className={styles.menuAppName}>{openApp === 'safari' ? 'Safari' : openApp === 'terminal' ? 'Terminal' : 'Finder'}</span>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.menuItem} onClick={(e) => handleMenuClick('file', e)}>Fichier</button>
          {openMenu === 'file' && (
            <div className={styles.menuDropdown}>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('fileNew', e)}>Nouvelle fenetre <span className={styles.shortcut}>⌘N</span></button>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('fileOpen', e)}>Ouvrir... <span className={styles.shortcut}>⌘O</span></button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('fileSave', e)}>Enregistrer <span className={styles.shortcut}>⌘S</span></button>
            </div>
          )}
        </div>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.menuItem} onClick={(e) => handleMenuClick('edit', e)}>Edition</button>
          {openMenu === 'edit' && (
            <div className={styles.menuDropdown}>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('editUndo', e)}>Annuler <span className={styles.shortcut}>⌘Z</span></button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('editCopy', e)}>Copier <span className={styles.shortcut}>⌘C</span></button>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('editPaste', e)}>Coller <span className={styles.shortcut}>⌘V</span></button>
            </div>
          )}
        </div>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.menuItem} onClick={(e) => handleMenuClick('view', e)}>Presentation</button>
          {openMenu === 'view' && (
            <div className={styles.menuDropdown}>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('viewIcons', e)}>Icones</button>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('viewList', e)}>Liste</button>
            </div>
          )}
        </div>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.menuItem} onClick={(e) => handleMenuClick('go', e)}>Aller</button>
          {openMenu === 'go' && (
            <div className={styles.menuDropdown}>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('goBack', e)}>Precedent <span className={styles.shortcut}>⌘[</span></button>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('goHome', e)}>Dossier personnel <span className={styles.shortcut}>⇧⌘H</span></button>
            </div>
          )}
        </div>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.menuItem} onClick={(e) => handleMenuClick('window', e)}>Fenetre</button>
          {openMenu === 'window' && (
            <div className={styles.menuDropdown}>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('windowMinimize', e)}>Minimiser <span className={styles.shortcut}>⌘M</span></button>
            </div>
          )}
        </div>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.menuItem} onClick={(e) => handleMenuClick('help', e)}>Aide</button>
          {openMenu === 'help' && (
            <div className={styles.menuDropdown}>
              <button className={styles.dropdownItem} onClick={(e) => handleMenuItemClick('helpSearch', e)}>Recherche</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.menuRight}>
        <button className={styles.menuIcon} onClick={(e) => showEasterEgg('battery', e)}><BatteryIcon className={styles.menuIconSvg} level={69} /></button>
        <button className={styles.menuIcon} onClick={(e) => showEasterEgg('wifi', e)}><WifiIcon className={styles.menuIconSvg} /></button>
        <button className={styles.menuIcon} onClick={() => setOpenApp('spotlight')}><SearchIcon className={styles.menuIconSvg} /></button>
        <div className={styles.menuDropdownContainer}>
          <button className={styles.menuIcon} onClick={(e) => handleMenuClick('control', e)}>
            <span className={styles.controlCenterIcon}>≡</span>
          </button>
          {openMenu === 'control' && (
            <div className={styles.controlCenter} onClick={(e) => e.stopPropagation()}>
              <div className={styles.ccRow}>
                <button className={styles.ccTile} onClick={(e) => showEasterEgg('wifi', e)}>
                  <span className={styles.ccIcon}>📶</span>
                  <span className={styles.ccLabel}>Wi-Fi</span>
                  <span className={styles.ccStatus}>MaisonDeJulie</span>
                </button>
                <button className={styles.ccTile} onClick={(e) => showEasterEgg('bluetooth', e)}>
                  <span className={styles.ccIcon}>🔵</span>
                  <span className={styles.ccLabel}>Bluetooth</span>
                  <span className={styles.ccStatus}>Connecte</span>
                </button>
              </div>
              <div className={styles.ccRow}>
                <button className={styles.ccTile} onClick={(e) => showEasterEgg('airdrop', e)}>
                  <span className={styles.ccIcon}>📡</span>
                  <span className={styles.ccLabel}>AirDrop</span>
                </button>
                <button className={styles.ccTile} onClick={(e) => showEasterEgg('focus', e)}>
                  <span className={styles.ccIcon}>🌙</span>
                  <span className={styles.ccLabel}>Concentration</span>
                </button>
              </div>
              <div className={styles.ccSlider}>
                <span>🔆</span>
                <input type="range" min="0" max="100" defaultValue="80" onClick={(e) => showEasterEgg('brightness', e)} />
              </div>
              <div className={styles.ccSlider}>
                <span>🔊</span>
                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
              </div>
            </div>
          )}
        </div>
        <span className={styles.menuDateTime}>
          <span className={styles.menuDate}>{menuDate}</span>
          <span className={styles.menuTime}>{menuTime}</span>
        </span>
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
      style={{ width: 500, height: 380 }}
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
          <motion.div
            className={styles.albumArt}
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            ❤️
          </motion.div>
          <div className={styles.songInfo}>
            <div className={styles.songTitle}>Notre Chanson</div>
            <div className={styles.songArtist}>Toi & Moi</div>
          </div>
          <div className={styles.musicProgress}>
            <div className={styles.musicProgressBar}>
              <motion.div
                className={styles.musicProgressFill}
                animate={isPlaying ? { width: '100%' } : {}}
                transition={{ duration: 30, ease: 'linear' }}
              />
            </div>
            <div className={styles.musicTime}>
              <span>1:42</span>
              <span>3:33</span>
            </div>
          </div>
          <div className={styles.musicControls}>
            <button className={styles.musicBtn}><ChevronLeft className={styles.musicControlSvg} /></button>
            <button className={styles.musicBtn} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸️' : <PlayIcon className={styles.musicControlSvg} />}
            </button>
            <button className={styles.musicBtn}><ChevronRight className={styles.musicControlSvg} /></button>
          </div>
          <div className={styles.volumeSlider}>
            <span>🔈</span>
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            <span>🔊</span>
          </div>
        </div>
        <div className={styles.playlist}>
          <div className={`${styles.playlistItem} ${styles.playlistItemActive}`}>
            <span>🎵</span> Notre Chanson - Toi & Moi
          </div>
          <div className={styles.playlistItem}>
            <span>🎵</span> Ensemble - Pour Toujours
          </div>
          <div className={styles.playlistItem}>
            <span>🎵</span> La Reponse - C'est Oui
          </div>
          <div className={styles.playlistItem}>
            <span>🎵</span> Roy's Theme - Miaou Mix
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSafariWindow = () => (
    <motion.div
      className={styles.window}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      style={{ width: 750, height: 500 }}
    >
      <div className={styles.windowHeader}>
        <div className={styles.windowButtons}>
          <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
          <button className={styles.windowBtnMinimize}></button>
          <button className={styles.windowBtnMaximize}></button>
        </div>
        <div className={styles.windowTitle}>
          <span>🧭</span> Safari
        </div>
      </div>
      <div className={styles.safariToolbar}>
        <button className={styles.safariNavBtn} onClick={(e) => showEasterEgg('safariBack', e)}>
          <ChevronLeft className={styles.navArrowSvg} />
        </button>
        <button className={styles.safariNavBtn} onClick={(e) => showEasterEgg('safariForward', e)}>
          <ChevronRight className={styles.navArrowSvg} />
        </button>
        <div className={styles.safariUrlBar}>
          <span className={styles.safariLock}>🔒</span>
          <input
            type="text"
            value={safariUrl}
            onChange={(e) => setSafariUrl(e.target.value)}
            className={styles.safariUrlInput}
          />
        </div>
        <button className={styles.safariNavBtn} onClick={(e) => showEasterEgg('bookmark', e)}>⭐</button>
        <button className={styles.safariNavBtn} onClick={(e) => showEasterEgg('newTab', e)}>+</button>
      </div>
      <div className={styles.safariContent}>
        <div className={styles.safariPage}>
          <div className={styles.safariStartPage}>
            <div className={styles.safariSection}>
              <h3>Favoris</h3>
              <div className={styles.safariBookmarks}>
                {SAFARI_BOOKMARKS.map((bookmark) => (
                  <button
                    key={bookmark.id}
                    className={styles.safariBookmark}
                    onClick={() => setSafariUrl(bookmark.url)}
                  >
                    <span className={styles.bookmarkIcon}>{bookmark.icon}</span>
                    <span className={styles.bookmarkName}>{bookmark.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.safariSection}>
              <h3>Historique recent</h3>
              <div className={styles.safariHistory}>
                {SAFARI_HISTORY.map((item) => (
                  <div key={item.id} className={styles.historyItem}>
                    <span className={styles.historyTitle}>{item.title}</span>
                    <span className={styles.historyUrl}>{item.url}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCalendarWindow = () => {
    const days = getCalendarDays();
    const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
    const today = new Date().getDate();
    const isCurrentMonth = calendarMonth === new Date().getMonth() && calendarYear === new Date().getFullYear();

    return (
      <motion.div
        className={styles.window}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        drag
        dragMomentum={false}
        style={{ width: 700, height: 500 }}
      >
        <div className={styles.windowHeader}>
          <div className={styles.windowButtons}>
            <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
            <button className={styles.windowBtnMinimize}></button>
            <button className={styles.windowBtnMaximize}></button>
          </div>
          <div className={styles.windowTitle}>
            <span>📅</span> Calendrier
          </div>
        </div>
        <div className={styles.calendarContent}>
          <div className={styles.calendarSidebar}>
            <div className={styles.calendarMiniMonth}>
              <div className={styles.calendarNav}>
                <button onClick={() => setCalendarMonth((m) => m === 0 ? 11 : m - 1)}>
                  <ChevronLeft className={styles.navArrowSvg} />
                </button>
                <span>{monthNames[calendarMonth]} {calendarYear}</span>
                <button onClick={() => setCalendarMonth((m) => m === 11 ? 0 : m + 1)}>
                  <ChevronRight className={styles.navArrowSvg} />
                </button>
              </div>
            </div>
            <div className={styles.calendarList}>
              <h4>Evenements</h4>
              {CALENDAR_EVENTS.map((event) => (
                <button
                  key={event.id}
                  className={styles.calendarEventItem}
                  style={{ borderLeftColor: event.color }}
                  onClick={(e) => showEasterEgg('calendarEvent', e)}
                >
                  <span className={styles.eventTitle}>{event.title}</span>
                  <span className={styles.eventTime}>{event.day} - {event.time}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.calendarMain}>
            <div className={styles.calendarHeader}>
              <div className={styles.dayName}>Lun</div>
              <div className={styles.dayName}>Mar</div>
              <div className={styles.dayName}>Mer</div>
              <div className={styles.dayName}>Jeu</div>
              <div className={styles.dayName}>Ven</div>
              <div className={styles.dayName}>Sam</div>
              <div className={styles.dayName}>Dim</div>
            </div>
            <div className={styles.calendarGrid}>
              {days.map((day, index) => {
                const event = CALENDAR_EVENTS.find((e) => e.day === day);
                return (
                  <button
                    key={index}
                    className={`${styles.calendarDay} ${day === today && isCurrentMonth ? styles.today : ''} ${day === 14 ? styles.valentine : ''}`}
                    onClick={(e) => day && showEasterEgg('calendarToday', e)}
                  >
                    {day && (
                      <>
                        <span className={styles.dayNumber}>{day}</span>
                        {event && (
                          <div className={styles.dayEvent} style={{ background: event.color }}>
                            {event.title.substring(0, 10)}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTerminalWindow = () => (
    <motion.div
      className={styles.window}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      style={{ width: 600, height: 400 }}
    >
      <div className={`${styles.windowHeader} ${styles.terminalHeader}`}>
        <div className={styles.windowButtons}>
          <button className={styles.windowBtnClose} onClick={() => setOpenApp(null)}></button>
          <button className={styles.windowBtnMinimize}></button>
          <button className={styles.windowBtnMaximize}></button>
        </div>
        <div className={styles.windowTitle}>
          Terminal - julie@MacBook-Pro
        </div>
      </div>
      <div className={styles.terminalContent} ref={terminalRef}>
        {terminalHistory.map((line, index) => (
          <div key={index} className={styles.terminalLine}>
            {line}
          </div>
        ))}
        <div className={styles.terminalInputLine}>
          <span className={styles.terminalPrompt}>julie@MacBook-Pro ~ $</span>
          <input
            type="text"
            className={styles.terminalInput}
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyDown={handleTerminalKeyDown}
            autoFocus
          />
        </div>
      </div>
    </motion.div>
  );

  const renderLaunchpad = () => (
    <motion.div
      className={styles.launchpadOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setOpenApp(null)}
    >
      <div className={styles.launchpadSearch}>
        <SearchIcon className={styles.launchpadSearchIcon} />
        <input type="text" placeholder="Rechercher" className={styles.launchpadSearchInput} />
      </div>
      <div className={styles.launchpadGrid} onClick={(e) => e.stopPropagation()}>
        {LAUNCHPAD_APPS.map((app) => (
          <motion.button
            key={app.id}
            className={styles.launchpadApp}
            onClick={(e) => {
              setOpenApp(null);
              setTimeout(() => handleDockClick(app.id, e), 100);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {getDockIcon(app.id) || <div className={styles.launchpadAppIcon}>📱</div>}
            <span className={styles.launchpadAppName}>{app.name}</span>
          </motion.button>
        ))}
      </div>
      <div className={styles.launchpadDots}>
        <span className={styles.launchpadDotActive}></span>
        <span className={styles.launchpadDot}></span>
      </div>
    </motion.div>
  );

  const renderSettingsWindow = () => (
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
          <span>⚙️</span> Preferences Systeme
        </div>
      </div>
      <div className={styles.settingsContent}>
        <div className={styles.settingsSidebar}>
          {SETTINGS_PANELS.map((panel) => (
            <button
              key={panel.id}
              className={`${styles.settingsSidebarItem} ${selectedSettingsPanel === panel.id ? styles.active : ''}`}
              onClick={() => setSelectedSettingsPanel(panel.id)}
            >
              <span className={styles.settingsItemIcon}>{panel.icon}</span>
              <span>{panel.name}</span>
            </button>
          ))}
        </div>
        <div className={styles.settingsMain}>
          <div className={styles.settingsHeader}>
            <span className={styles.settingsHeaderIcon}>
              {SETTINGS_PANELS.find((p) => p.id === selectedSettingsPanel)?.icon}
            </span>
            <span className={styles.settingsHeaderTitle}>
              {SETTINGS_PANELS.find((p) => p.id === selectedSettingsPanel)?.name}
            </span>
          </div>
          <div className={styles.settingsPanel}>
            {selectedSettingsPanel === 'general' && (
              <>
                <div className={styles.settingsRow}>
                  <span>Apparence</span>
                  <div className={styles.settingsOptions}>
                    <button className={styles.settingsOption}>Clair</button>
                    <button className={`${styles.settingsOption} ${styles.active}`}>Sombre</button>
                    <button className={styles.settingsOption}>Auto</button>
                  </div>
                </div>
                <div className={styles.settingsRow}>
                  <span>Couleur d'accentuation</span>
                  <div className={styles.colorPicker}>
                    <button className={styles.colorDot} style={{ background: '#007aff' }}></button>
                    <button className={styles.colorDot} style={{ background: '#5856d6' }}></button>
                    <button className={styles.colorDot} style={{ background: '#ff2d55' }}></button>
                    <button className={styles.colorDot} style={{ background: '#ff9500' }}></button>
                  </div>
                </div>
              </>
            )}
            {selectedSettingsPanel === 'wifi' && (
              <div className={styles.wifiPanel}>
                <div className={styles.wifiStatus}>
                  <span>📶</span>
                  <span>Connecte a MaisonDeJulie</span>
                </div>
                <div className={styles.wifiNetworks}>
                  <div className={styles.wifiNetwork}>
                    <span>📶 MaisonDeJulie</span>
                    <span className={styles.wifiConnected}>✓</span>
                  </div>
                  <div className={styles.wifiNetwork}>
                    <span>📶 VoisinDeJulie</span>
                    <span className={styles.wifiLocked}>🔒</span>
                  </div>
                  <div className={styles.wifiNetwork}>
                    <span>📶 Freebox-ABC123</span>
                    <span className={styles.wifiLocked}>🔒</span>
                  </div>
                </div>
              </div>
            )}
            {selectedSettingsPanel !== 'general' && selectedSettingsPanel !== 'wifi' && (
              <div className={styles.settingsPlaceholder}>
                <span>Rien a configurer ici pour le moment</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <AnimatePresence>
      {notifications.map((notif) => (
        <motion.div
          key={notif.id}
          className={styles.notification}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className={styles.notificationIcon}>💬</div>
          <div className={styles.notificationContent}>
            <div className={styles.notificationTitle}>{notif.title}</div>
            <div className={styles.notificationMessage}>{notif.message}</div>
          </div>
          <button className={styles.notificationClose} onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}>×</button>
        </motion.div>
      ))}
    </AnimatePresence>
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
            {openApp === 'safari' && renderSafariWindow()}
            {openApp === 'calendar' && renderCalendarWindow()}
            {openApp === 'terminal' && renderTerminalWindow()}
            {openApp === 'settings' && renderSettingsWindow()}
            {openApp === 'spotlight' && renderSpotlight()}
            {openApp === 'launchpad' && renderLaunchpad()}
          </AnimatePresence>

          {/* Notifications */}
          {renderNotifications()}

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

export default U07_Apple;
