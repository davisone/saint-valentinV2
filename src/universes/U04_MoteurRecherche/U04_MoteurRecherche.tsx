import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
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
  { text: 'recette gâteau chocolat', romantic: false },
  { text: 'valentin cadeau idée', romantic: true },
  { text: 'audit consultant avis', romantic: false },
  { text: 'A quoi sert le million si tu prend perpet ?', romantic: true },
];

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
  gmail: 'Tu as 1 nouveau message de Nadine',
  images: 'Y\'a pas d\'images à voir ici, cherche ailleurs',
  grid: 'Non c\'est pas la non plus',
  profile: 'Oui c\'est ton profil, et alors ?',
  mic: 'Parler ca marche pas, faut cliquer',
  france: 'Oui on est en France, bien joue',
  confidentialité: 'T\'as vraiment cliqué sur confidentialité ? Sérieux ?',
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
  const eggIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsInputRef = useRef<HTMLInputElement>(null);

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
      className={`${styles.googlePage} ${styles.googleHomepage}`}
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
        <button className={styles.navIcon} onClick={(e) => showEasterEgg('grid', e)}>
          &#9783;
        </button>
        <button className={styles.profileIcon} onClick={(e) => showEasterEgg('profile', e)}>
          E
        </button>
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
            onClick={(e) => showEasterEgg('mic', e)}
          >
            &#127908;
          </button>
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className={styles.suggestions}>
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
            <button className={styles.footerLink}>Conditions</button>
          </div>
          <div>
            <button className={styles.footerLink}>Paramètres</button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Results page
  const renderResults = () => {
    const romantic = isRomantic(query);

    return (
      <motion.div
        className={`${styles.googlePage} ${styles.googleResults}`}
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
        </div>

        {/* Tabs */}
        <div className={styles.resultsTabs}>
          <button className={styles.resultsTab}>Tous</button>
          <button className={styles.resultsTab}>Images</button>
          <button className={styles.resultsTab}>Vidéos</button>
          <button className={styles.resultsTab}>Actualités</button>
        </div>

        {romantic ? (
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
                  <button className={styles.resultTitle} onClick={() => {
                    // Non-oui results: show easter egg
                    const id = ++eggIdRef.current;
                    setEasterEggs((prev) => [
                      ...prev,
                      { id, message: 'Continue de chercher...', x: window.innerWidth / 2, y: window.innerHeight / 2 },
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

            <button
              className={styles.nonResultLink}
              onClick={goBackToHomepage}
            >
              Non merci
            </button>
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>
              Aucun résultat pour <strong>&quot;{query}&quot;</strong>
            </p>
            <p className={styles.noResultsHint}>
              Recherche autre chose, ça c'est nul comme recherche.
            </p>
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
              transform: 'translate(-50%, -100%)',
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
