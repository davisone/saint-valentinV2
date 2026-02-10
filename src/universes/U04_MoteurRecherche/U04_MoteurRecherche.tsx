import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import {
  GoogleLogo,
  GoogleAppsIcon,
  GoogleSearchIcon,
  GoogleMicIcon,
  GoogleCameraIcon,
  GmailIcon,
  YouTubeIconFull,
  GoogleDriveIcon,
  GoogleMapsIcon,
  GoogleCalendarIcon,
} from '../../components/icons/SvgIcons';
import styles from './U04_MoteurRecherche.module.css';

interface Props {
  mouse: MouseState;
}

type Phase = 'homepage' | 'results' | 'done';

const ROMANTIC_KEYWORDS = [
  'oui', 'amour', 'love', 'valentin', 'valentine', 'coeur', 'heart',
  "je t'aime", 'bisous', 'kiss', 'tendresse', 'romantique', 'romantic', 'aimer',
];

const SUGGESTIONS = [
  { text: 'comment dire oui', romantic: true },
  { text: 'meteo paris', romantic: false },
  { text: 'chat qui dort toute la journée', romantic: false },
  { text: 'recette kinder country', romantic: false },
  { text: 'valentin cadeau idée', romantic: true },
  { text: 'audit consultant avis', romantic: false },
  { text: 'A quoi sert le million si tu prend perpet ?', romantic: true },
];

const GOOGLE_APPS = [
  { id: 'account', name: 'Compte', icon: '👤', color: '#4285F4' },
  { id: 'search', name: 'Recherche', icon: '🔍', color: '#4285F4' },
  { id: 'maps', name: 'Maps', icon: '🗺️', color: '#34A853' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000' },
  { id: 'play', name: 'Play', icon: '🎮', color: '#34A853' },
  { id: 'news', name: 'Actualités', icon: '📰', color: '#4285F4' },
  { id: 'gmail', name: 'Gmail', icon: '✉️', color: '#EA4335' },
  { id: 'meet', name: 'Meet', icon: '📹', color: '#00897B' },
  { id: 'chat', name: 'Chat', icon: '💬', color: '#34A853' },
  { id: 'contacts', name: 'Contacts', icon: '📇', color: '#4285F4' },
  { id: 'drive', name: 'Drive', icon: '📁', color: '#FBBC05' },
  { id: 'calendar', name: 'Agenda', icon: '📅', color: '#4285F4' },
];

const TRENDING_SEARCHES = [
  { text: 'Saint Valentin idées', trend: '🔥 Tendance' },
  { text: 'Roy chat mignon', trend: '+500%' },
  { text: 'Evan beuteu', trend: '+200%' },
  { text: 'Comment dire oui', trend: '🔥 Tendance' },
];

const RELATED_SEARCHES = [
  'comment dire oui a quelqu\'un',
  'saint valentin 2025',
  'idee cadeau copin',
  'message romantique',
  'declaration amour',
  'surprise saint valentin',
];

const KNOWLEDGE_PANEL = {
  title: 'Saint-Valentin',
  subtitle: 'Fête des amoureux',
  description: 'La Saint-Valentin est une fête célébrée le 14 février. C\'est l\'occasion de dire "Oui" à la personne qu\'on aime',
  date: '14 février 2026',
  facts: [
    { label: 'Date', value: '14 février' },
    { label: 'Type', value: 'Fête des amoureux' },
    { label: 'Réponse attendue', value: 'Oui' },
  ],
};

interface SearchResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  isOui?: boolean;
}

const SEARCH_RESULTS: SearchResult[] = [
  {
    title: "Comment faire quand ta copine fait sa difficile",
    url: 'https://www.conseil-couple.fr/copine-tetue',
    domain: 'conseil-couple.fr',
    snippet: "Guide complet pour gérer quelqu'un qui sait jamais ce qu'elle veut",
  },
  {
    title: 'Roy est obèse',
    url: 'https://www.chats-et-problemes.com/roy',
    domain: 'chats-et-problemes.com',
    snippet: "Quand même ton chat t'ignore. Roy préfère dormir que de t'aider apparemment",
  },
  {
    title: 'Fouette moiiiiiiiiiii',
    url: 'https://www.la-reponse.fr/cest-pas-complique',
    domain: 'la-reponse.fr',
    snippet: "Tu es au bon endroit, vas tu trouver la solution ?",
    isOui: true,
  },
  {
    title: "Saint-Valentin 2025 : survivre a une copine indecise",
    url: 'https://www.survie-couple.fr/saint-valentin',
    domain: 'survie-couple.fr',
    snippet: "Guide de survie pour ceux dont la copine met 45 minutes a choisir une graile",
  },
  {
    title: 'Nadine ne propose pas elle met l\'argent direct dans la poche',
    url: 'https://www.maman-inquiete.fr/message',
    domain: 'maman-inquiete.fr',
    snippet: "Spoiler : elle va rappeler dans 5 minutes si tu réponds pas",
  },
];

interface EasterEgg {
  id: number;
  message: string;
  x: number;
  y: number;
}

const EASTER_EGGS: Record<string, string> = {
  logoHeart: 'Doodle du jour : Roy qui fait la sieste',
  gmail: 'Tu as 3 nouveaux messages de Nadine',
  images: 'Y\'a pas d\'images à voir ici, cherche ailleurs',
  grid: 'Clique pour voir les apps Google',
  profile: 'Connecté en tant que Julie',
  mic: 'Parler ca marche pas, faut cliquer',
  france: 'Oui on est en France, bien joue',
  confidentialité: 'T\'as vraiment cliqué sur confidentialité ? Sérieux ?',
  account: 'Gérer ton compte Google? Plus tard.',
  search: 'T\'es déjà sur la recherche...',
  maps: 'Julie habite quelque part par là',
  youtube: 'Regarde pas de vidéos, cherche!',
  play: 'Pas de jeux maintenant',
  news: 'Actualité: Quelqu\'un cherche "oui"',
  meet: 'Pas de réunion prévue',
  chat: 'Message de Roy: Miaou',
  contacts: 'Julie - ❤️ Favori',
  drive: 'Dossier "Secret" - 1 fichier',
  calendar: '14 février - Saint Valentin ❤️',
  conditions: 'Personne lit ça de toute façon',
  parametres: 'Y\'a rien à régler',
  darkMode: 'Mode sombre activé',
  lightMode: 'Mode clair activé',
  trending: 'Tout le monde cherche "oui"',
  related: 'Bonne idée de recherche!',
  knowledge: 'La réponse est dans la recherche',
  signOut: 'Tu peux pas te déconnecter',
  addAccount: 'Un compte suffit',
  tabImages: 'Pas d\'images romantiques ici',
  tabVideos: 'Pas de vidéos non plus',
  tabActus: 'Actu: Julie attend ta réponse',
  tabShopping: 'On achète pas l\'amour',
  tabMaps: 'Le chemin vers le oui',
  clearHistory: 'Historique effacé (non)',
  voiceSearch: 'Dis "Oui" à voix haute',
};

const LUCKY_MESSAGES = [
  'T\'as vraiment besoin d\'aide ?',
  'Bon ok je vais t\'aider, reclique',
];

function U04_MoteurRecherche({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(4);
  const [phase, setPhase] = useState<Phase>('homepage');
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [luckyCount, setLuckyCount] = useState(0);
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([]);
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [searchHistory] = useState(['chat mignon', 'recette gateau', 'meteo paris']);
  const eggIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startPuzzle();
  }, [startPuzzle]);

  const handleAppClick = useCallback((appId: string, e: React.MouseEvent) => {
    setShowAppsMenu(false);
    showEasterEgg(appId, e);
  }, []);

  const toggleDarkMode = useCallback((e: React.MouseEvent) => {
    setDarkMode(!darkMode);
    showEasterEgg(darkMode ? 'lightMode' : 'darkMode', e);
  }, [darkMode]);

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

  const isRomantic = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();
    return ROMANTIC_KEYWORDS.some((kw) => lower.includes(kw));
  }, []);

  const doSearch = useCallback((searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;
    setQuery(q);
    setShowSuggestions(false);
    setPhase('results');
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  }, [query, doSearch]);

  const handleLucky = useCallback((e: React.MouseEvent) => {
    if (luckyCount < 2) {
      // Show progressive hints
      const id = ++eggIdRef.current;
      setEasterEggs((prev) => [
        ...prev,
        { id, message: LUCKY_MESSAGES[luckyCount], x: e.clientX, y: e.clientY },
      ]);
      setTimeout(() => {
        setEasterEggs((prev) => prev.filter((egg) => egg.id !== id));
      }, 2600);
      setLuckyCount((c) => c + 1);
    } else {
      // 3rd click: auto-fill "oui" and search
      setQuery('oui');
      setTimeout(() => {
        doSearch('oui');
      }, 400);
    }
  }, [luckyCount, doSearch]);

  const handleSuggestionClick = useCallback((text: string) => {
    setQuery(text);
    doSearch(text);
  }, [doSearch]);

  const handleOuiClick = useCallback(() => {
    setPhase('done');
    setTimeout(() => {
      complete();
    }, 2000);
  }, [complete]);

  const goBackToHomepage = useCallback(() => {
    setPhase('homepage');
    setQuery('');
  }, []);

  // Homepage
  const renderHomepage = () => (
    <motion.div
      className={`${styles.googlePage} ${styles.googleHomepage} ${darkMode ? styles.darkMode : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Navbar */}
      <div className={styles.navbar}>
        <button className={styles.navLink} onClick={(e) => showEasterEgg('gmail', e)}>
          Gmail
        </button>
        <button className={styles.navLink} onClick={(e) => showEasterEgg('images', e)}>
          Images
        </button>
        <button
          className={styles.navIcon}
          onClick={() => setShowAppsMenu(!showAppsMenu)}
        >
          &#9783;
        </button>
        <button
          className={styles.profileIcon}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          E
        </button>

        {/* Apps Menu Dropdown */}
        {showAppsMenu && (
          <div className={styles.appsMenu}>
            <div className={styles.appsMenuHeader}>Applications Google</div>
            <div className={styles.appsGrid}>
              {GOOGLE_APPS.map((app) => (
                <button
                  key={app.id}
                  className={styles.appItem}
                  onClick={(e) => handleAppClick(app.id, e)}
                >
                  <span className={styles.appIcon} style={{ background: app.color }}>
                    {app.icon}
                  </span>
                  <span className={styles.appName}>{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Menu Dropdown */}
        {showProfileMenu && (
          <div className={styles.profileMenu}>
            <div className={styles.profileMenuHeader}>
              <div className={styles.profileMenuAvatar}>E</div>
              <div className={styles.profileMenuInfo}>
                <div className={styles.profileMenuName}>Evan Davison</div>
                <div className={styles.profileMenuEmail}>evan@google.com</div>
              </div>
            </div>
            <div className={styles.profileMenuDivider} />
            <button className={styles.profileMenuItem} onClick={(e) => showEasterEgg('addAccount', e)}>
              ➕ Ajouter un compte
            </button>
            <button className={styles.profileMenuItem} onClick={(e) => showEasterEgg('signOut', e)}>
              🚪 Déconnexion
            </button>
            <div className={styles.profileMenuDivider} />
            <button className={styles.profileMenuItem} onClick={toggleDarkMode}>
              {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
            </button>
          </div>
        )}
      </div>

      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoG}>G</span>
        <span
          className={styles.logoHeart}
          onClick={(e) => showEasterEgg('logoHeart', e)}
          role="img"
          aria-label="coeur"
        >
          &#10084;
        </span>
        <span className={styles.logoO2}>o</span>
        <span className={styles.logoG}>g</span>
        <span className={styles.logoL}>l</span>
        <span className={styles.logoE}>e</span>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className={styles.searchBarWrapper}>
        <div className={`${styles.searchBar} ${searchBarFocused ? styles.searchBarFocused : ''}`}>
          <span className={styles.searchIcon}>&#128269;</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setSearchBarFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setSearchBarFocused(false);
              // Delay hiding so click on suggestion registers
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Rechercher..."
            autoComplete="off"
          />
          <button
            type="button"
            className={styles.micIcon}
            onClick={() => setShowVoiceSearch(true)}
          >
            &#127908;
          </button>
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className={styles.suggestions}>
            {/* Search History */}
            {searchHistory.length > 0 && (
              <>
                <div className={styles.suggestionsSection}>
                  <span className={styles.sectionLabel}>Recherches récentes</span>
                  <button
                    className={styles.clearHistory}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      showEasterEgg('clearHistory', e);
                    }}
                  >
                    Effacer
                  </button>
                </div>
                {searchHistory.map((h, i) => (
                  <div
                    key={`history-${i}`}
                    className={styles.suggestionItem}
                    onMouseDown={() => handleSuggestionClick(h)}
                  >
                    <span className={styles.suggestionIcon}>🕐</span>
                    {h}
                  </div>
                ))}
                <div className={styles.suggestionsDivider} />
              </>
            )}
            {/* Trending */}
            <div className={styles.suggestionsSection}>
              <span className={styles.sectionLabel}>Tendances</span>
            </div>
            {TRENDING_SEARCHES.map((t, i) => (
              <div
                key={`trending-${i}`}
                className={styles.suggestionItem}
                onMouseDown={() => handleSuggestionClick(t.text)}
              >
                <span className={styles.suggestionIcon}>📈</span>
                <span className={styles.suggestionText}>{t.text}</span>
                <span className={styles.trendBadge}>{t.trend}</span>
              </div>
            ))}
            <div className={styles.suggestionsDivider} />
            {/* Regular suggestions */}
            {SUGGESTIONS.map((s, i) => (
              <div
                key={i}
                className={styles.suggestionItem}
                onMouseDown={() => handleSuggestionClick(s.text)}
              >
                <span className={styles.suggestionIcon}>&#128269;</span>
                {s.text}
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Buttons */}
      <div className={styles.buttonsRow}>
        <button className={styles.googleButton} type="button" onClick={handleSearchSubmit as unknown as React.MouseEventHandler}>
          Recherche Google
        </button>
        <button className={styles.googleButton} type="button" onClick={handleLucky}>
          J&apos;ai de la chance
        </button>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerTop}>
          <button className={styles.footerLink} onClick={(e) => showEasterEgg('france', e)}>
            France
          </button>
        </div>
        <div className={styles.footerBottom}>
          <div>
            <button className={styles.footerLink} onClick={(e) => showEasterEgg('confidentialité', e)}>
              Confidentialité
            </button>
            <button className={styles.footerLink} onClick={(e) => showEasterEgg('conditions', e)}>
              Conditions
            </button>
          </div>
          <div>
            <button className={styles.footerLink} onClick={(e) => showEasterEgg('parametres', e)}>
              Paramètres
            </button>
          </div>
        </div>
      </div>

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <div className={styles.voiceSearchOverlay} onClick={() => setShowVoiceSearch(false)}>
          <div className={styles.voiceSearchModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.voiceSearchMic}>
              <div className={styles.voiceSearchPulse} />
              🎤
            </div>
            <div className={styles.voiceSearchText}>Parlez maintenant...</div>
            <div className={styles.voiceSearchHint} onClick={(e) => showEasterEgg('voiceSearch', e)}>
              (Dis &quot;Oui&quot; à voix haute)
            </div>
            <button
              className={styles.voiceSearchClose}
              onClick={() => setShowVoiceSearch(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  // Results page
  const renderResults = () => {
    const romantic = isRomantic(query);

    return (
      <motion.div
        className={`${styles.googlePage} ${styles.googleResults} ${darkMode ? styles.darkMode : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsLogo} onClick={goBackToHomepage}>
            <span className={styles.logoG} style={{ fontSize: 'inherit' }}>G</span>
            <span className={styles.logoHeart} style={{ fontSize: '22px', top: 0 }}>&#10084;</span>
            <span className={styles.logoO2} style={{ fontSize: 'inherit' }}>o</span>
            <span className={styles.logoG} style={{ fontSize: 'inherit' }}>g</span>
            <span className={styles.logoL} style={{ fontSize: 'inherit' }}>l</span>
            <span className={styles.logoE} style={{ fontSize: 'inherit' }}>e</span>
          </div>
          <form onSubmit={handleSearchSubmit} className={styles.resultsSearchBar}>
            <input
              ref={resultsInputRef}
              type="text"
              className={styles.resultsSearchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            <span className={styles.searchIcon}>&#128269;</span>
          </form>
          <div className={styles.resultsHeaderRight}>
            <button
              className={styles.navIcon}
              onClick={() => setShowAppsMenu(!showAppsMenu)}
            >
              &#9783;
            </button>
            <button
              className={styles.profileIcon}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              E
            </button>
          </div>

          {/* Apps Menu in Results */}
          {showAppsMenu && (
            <div className={styles.appsMenu} style={{ top: '50px', right: '60px' }}>
              <div className={styles.appsMenuHeader}>Applications Google</div>
              <div className={styles.appsGrid}>
                {GOOGLE_APPS.map((app) => (
                  <button
                    key={app.id}
                    className={styles.appItem}
                    onClick={(e) => handleAppClick(app.id, e)}
                  >
                    <span className={styles.appIcon} style={{ background: app.color }}>
                      {app.icon}
                    </span>
                    <span className={styles.appName}>{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Profile Menu in Results */}
          {showProfileMenu && (
            <div className={styles.profileMenu} style={{ top: '50px', right: '10px' }}>
              <div className={styles.profileMenuHeader}>
                <div className={styles.profileMenuAvatar}>E</div>
                <div className={styles.profileMenuInfo}>
                  <div className={styles.profileMenuName}>Evan Davison</div>
                  <div className={styles.profileMenuEmail}>evan@google.com</div>
                </div>
              </div>
              <div className={styles.profileMenuDivider} />
              <button className={styles.profileMenuItem} onClick={toggleDarkMode}>
                {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.resultsTabs}>
          <button className={`${styles.resultsTab} ${styles.resultsTabActive}`}>
            🔍 Tous
          </button>
          <button className={styles.resultsTab} onClick={(e) => showEasterEgg('tabImages', e)}>
            🖼️ Images
          </button>
          <button className={styles.resultsTab} onClick={(e) => showEasterEgg('tabVideos', e)}>
            🎬 Vidéos
          </button>
          <button className={styles.resultsTab} onClick={(e) => showEasterEgg('tabActus', e)}>
            📰 Actualités
          </button>
          <button className={styles.resultsTab} onClick={(e) => showEasterEgg('tabShopping', e)}>
            🛒 Shopping
          </button>
          <button className={styles.resultsTab} onClick={(e) => showEasterEgg('tabMaps', e)}>
            📍 Maps
          </button>
        </div>

        {romantic ? (
          <div className={styles.resultsContainer}>
            <div className={styles.resultsBody}>
              <div className={styles.resultStats}>
                Environ 14 200 000 résultats (0,42 secondes)
              </div>

              {SEARCH_RESULTS.map((result, i) => (
                <div key={i} className={styles.resultItem}>
                  <div className={styles.resultUrl}>
                    <span className={styles.resultUrlFavicon}>
                      {result.domain.charAt(0).toUpperCase()}
                    </span>
                    <span className={styles.resultUrlText}>{result.url}</span>
                  </div>
                  {result.isOui ? (
                    <OuiButton
                      label={result.title}
                      className={styles.ouiResultLink}
                      onClick={handleOuiClick}
                      disableAI
                      overridePosition={{ x: 0, y: 0 }}
                    />
                  ) : (
                    <button className={styles.resultTitle} onClick={(e) => {
                      // Non-oui results: show easter egg at click position
                      const id = ++eggIdRef.current;
                      setEasterEggs((prev) => [
                        ...prev,
                        { id, message: 'Continue de chercher', x: e.clientX, y: e.clientY },
                      ]);
                      setTimeout(() => {
                        setEasterEggs((prev) => prev.filter((egg) => egg.id !== id));
                      }, 2600);
                    }}>
                      {result.title}
                    </button>
                  )}
                  <div className={styles.resultSnippet}>{result.snippet}</div>
                </div>
              ))}

              {/* Related Searches */}
              <div className={styles.relatedSearches}>
                <div className={styles.relatedTitle}>Recherches associées</div>
                <div className={styles.relatedGrid}>
                  {RELATED_SEARCHES.map((search, i) => (
                    <button
                      key={i}
                      className={styles.relatedItem}
                      onClick={(e) => {
                        showEasterEgg('related', e);
                        handleSuggestionClick(search);
                      }}
                    >
                      🔍 {search}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={styles.nonResultLink}
                onClick={goBackToHomepage}
              >
                Non merci
              </button>
            </div>

            {/* Knowledge Panel */}
            <div className={styles.knowledgePanel} onClick={(e) => showEasterEgg('knowledge', e)}>
              <div className={styles.knowledgePanelImage}>
                💕
              </div>
              <div className={styles.knowledgePanelTitle}>{KNOWLEDGE_PANEL.title}</div>
              <div className={styles.knowledgePanelSubtitle}>{KNOWLEDGE_PANEL.subtitle}</div>
              <div className={styles.knowledgePanelDescription}>
                {KNOWLEDGE_PANEL.description}
              </div>
              <div className={styles.knowledgePanelFacts}>
                {KNOWLEDGE_PANEL.facts.map((fact, i) => (
                  <div key={i} className={styles.knowledgePanelFact}>
                    <span className={styles.factLabel}>{fact.label}</span>
                    <span className={styles.factValue}>{fact.value}</span>
                  </div>
                ))}
              </div>
              <div className={styles.knowledgePanelDate}>
                📅 {KNOWLEDGE_PANEL.date}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>
              Aucun résultat pour <strong>&quot;{query}&quot;</strong>
            </p>
            <p className={styles.noResultsHint}>
              Recherche autre chose, ça c'est nul comme recherche.
            </p>
            {/* Trending searches when no results */}
            <div className={styles.trendingSection}>
              <div className={styles.trendingTitle}>🔥 Recherches tendances</div>
              {TRENDING_SEARCHES.map((t, i) => (
                <button
                  key={i}
                  className={styles.trendingItem}
                  onClick={(e) => {
                    showEasterEgg('trending', e);
                    handleSuggestionClick(t.text);
                  }}
                >
                  {t.text}
                  <span className={styles.trendBadge}>{t.trend}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Done overlay
  const renderDone = () => (
    <motion.div
      className={styles.doneOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className={styles.doneMessage}>
        Ba voilà, c'était pas si dur...
      </div>
    </motion.div>
  );

  return (
    <UniverseShell ambientColor="#ffffff">
      <AnimatePresence mode="wait">
        {phase === 'homepage' && renderHomepage()}
        {phase === 'results' && renderResults()}
        {phase === 'done' && renderDone()}
      </AnimatePresence>

      {/* Easter egg tooltips */}
      <AnimatePresence>
        {easterEggs.map((egg) => (
          <div
            key={egg.id}
            className={styles.easterEggTooltip}
            style={{
              left: egg.x,
              top: egg.y,
            }}
          >
            {egg.message}
          </div>
        ))}
      </AnimatePresence>
    </UniverseShell>
  );
}

export default U04_MoteurRecherche;
