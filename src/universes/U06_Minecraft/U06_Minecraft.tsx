import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { OuiButton } from '../../components/core/OuiButton';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import {
  DiamondIcon,
  RedstoneIcon,
  GoldIcon,
  HeartIcon,
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
  CraftingTableIcon,
} from '../../components/icons/SvgIcons';
import styles from './U06_Minecraft.module.css';

interface Props {
  mouse: MouseState;
}

type Phase = 'menu' | 'world' | 'crafting' | 'done';

interface CollectibleItem {
  id: string;
  name: string;
  icon: string;
  collected: boolean;
  x: number;
  y: number;
}

interface EasterEgg {
  id: number;
  message: string;
  x: number;
  y: number;
}

interface BreakingBlock {
  id: number;
  x: number;
  y: number;
  type: string;
  breakProgress: number;
}

interface Mob {
  id: number;
  type: 'pig' | 'cow' | 'chicken' | 'sheep';
  x: number;
  direction: 1 | -1;
}

const SPLASH_TEXTS = [
  'Roy à mangé les croquettes!',
  '100% de chance de galérer!',
  'Craft le truc!',
  'Nadine a appele 3 fois!',
  'Mode facile active!',
  'Achievement: T\'as trouve un bouton!',
  'Comptable vs Creeper: Creeper gagne',
  'Mode peaceful pour les nuls!',
  'Julie a demandé où t\'es!',
  'Pas de wifi dans le Nether!',
  'Alt+F4 pour diamants infinis!',
  'Le loup de Roy!',
];

const EASTER_EGGS: Record<string, string> = {
  logo: 'Minecraft Comptable Edition',
  multiplayer: 'Tu joues solo la',
  realms: 'T\'as même pas de realm',
  settings: 'Les settings c\'est pas la',
  quit: 'Non tu quittes pas',
  wrongBlock: 'C\'est pas le bon bloc',
  tree: 'Oui c\'est un arbre, bravo',
  cloud: 'Un nuage. Roy s\'en fout.',
  sun: 'Le soleil. Impressionnant.',
  moon: 'La lune. Romantique.',
  pig: 'Oink! C\'est pas Roy.',
  cow: 'Meuh. Ca te ressemble.',
  chicken: 'Cot cot. Julie au réveil.',
  sheep: 'Bêê. Mouton de panurge.',
  hunger: 'T\'as faim? Va manger.',
  health: 'Plein de vie!',
  xp: 'XP: T\'en as pas besoin.',
  hotbar: 'Slot sélectionné!',
  creeper: 'BOOM! Ah non c\'est juste toi.',
  steve: 'Steve? Non c\'est Julie.',
  night: 'Les monstres arrivent!',
  day: 'Le jour se lève sur ton incompétence.',
  language: 'Oui oui français.',
  accessibility: 'Tu vois bien là ?',
  skins: 'T\'as pas de skin premium.',
  achievements: 'Achievement: Lire ce message.',
  worldSelect: 'Pas d\'autre monde pour toi.',
};

function U06_Minecraft({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(6);
  const [phase, setPhase] = useState<Phase>('menu');
  const [splashText, setSplashText] = useState('');
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>([
    { id: 'diamond', name: 'Diamant', icon: 'diamond', collected: false, x: 15, y: 60 },
    { id: 'redstone', name: 'Redstone', icon: 'redstone', collected: false, x: 45, y: 70 },
    { id: 'gold', name: 'Or', icon: 'gold', collected: false, x: 75, y: 55 },
  ]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState(0); // 0-100, 0=dawn, 25=noon, 50=dusk, 75=midnight
  const [breakingBlocks, setBreakingBlocks] = useState<BreakingBlock[]>([]);
  const [brokenBlocks, setBrokenBlocks] = useState<Set<string>>(new Set());
  const [mobs, setMobs] = useState<Mob[]>([
    { id: 1, type: 'pig', x: 25, direction: 1 },
    { id: 2, type: 'cow', x: 55, direction: -1 },
    { id: 3, type: 'chicken', x: 70, direction: 1 },
    { id: 4, type: 'sheep', x: 35, direction: -1 },
  ]);
  const [health] = useState(10);
  const [hunger] = useState(9);
  const [xp] = useState(27);
  const [craftingAnimation, setCraftingAnimation] = useState(false);
  const eggIdRef = useRef(0);
  const breakingRef = useRef<number | null>(null);
  const breakingBlockRef = useRef<string | null>(null);

  useEffect(() => {
    startPuzzle();
    setSplashText(SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)]);
  }, [startPuzzle]);

  // Day/night cycle
  useEffect(() => {
    if (phase !== 'world') return;
    const interval = setInterval(() => {
      setTimeOfDay((prev) => (prev + 0.5) % 100);
    }, 200);
    return () => clearInterval(interval);
  }, [phase]);

  // Mob movement
  useEffect(() => {
    if (phase !== 'world') return;
    const interval = setInterval(() => {
      setMobs((prev) =>
        prev.map((mob) => {
          let newX = mob.x + mob.direction * 0.3;
          let newDirection = mob.direction;
          if (newX < 10 || newX > 85) {
            newDirection = (mob.direction * -1) as 1 | -1;
            newX = mob.x + newDirection * 0.3;
          }
          return { ...mob, x: newX, direction: newDirection };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // Keyboard controls for hotbar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'world') return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        setSelectedSlot(num - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

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

  const handleCollectItem = useCallback((item: CollectibleItem) => {
    if (item.collected) return;
    setCollectibles((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, collected: true } : c))
    );
    setInventory((prev) => [...prev, item.id]);
  }, []);

  const canCraft = useMemo(() => {
    return inventory.includes('diamond') && inventory.includes('redstone') && inventory.includes('gold');
  }, [inventory]);

  const handleCraft = useCallback(() => {
    setCraftingAnimation(true);
    setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        complete();
      }, 2500);
    }, 1500);
  }, [complete]);

  const handleBlockClick = useCallback((e: React.MouseEvent, blockKey: string, x: number, y: number, type: string) => {
    // Start breaking block
    if (breakingBlockRef.current === blockKey) {
      // Continue breaking
      setBreakingBlocks((prev) => {
        const existing = prev.find((b) => `${b.x}-${b.y}` === blockKey);
        if (existing) {
          const newProgress = existing.breakProgress + 25;
          if (newProgress >= 100) {
            // Block broken!
            setBrokenBlocks((prevBroken) => new Set([...prevBroken, blockKey]));
            showEasterEgg('wrongBlock', e);
            return prev.filter((b) => `${b.x}-${b.y}` !== blockKey);
          }
          return prev.map((b) =>
            `${b.x}-${b.y}` === blockKey ? { ...b, breakProgress: newProgress } : b
          );
        }
        return prev;
      });
    } else {
      // Start breaking new block
      breakingBlockRef.current = blockKey;
      setBreakingBlocks((prev) => [
        ...prev.filter((b) => `${b.x}-${b.y}` !== blockKey),
        { id: Date.now(), x, y, type, breakProgress: 25 },
      ]);
    }

    // Reset if not clicked again
    if (breakingRef.current) clearTimeout(breakingRef.current);
    breakingRef.current = window.setTimeout(() => {
      breakingBlockRef.current = null;
      setBreakingBlocks([]);
    }, 500);
  }, [showEasterEgg]);

  const handleMobClick = useCallback((e: React.MouseEvent, mobType: string) => {
    showEasterEgg(mobType, e);
  }, [showEasterEgg]);

  const handleHotbarClick = useCallback((e: React.MouseEvent, index: number) => {
    setSelectedSlot(index);
    showEasterEgg('hotbar', e);
  }, [showEasterEgg]);

  // Generate terrain blocks
  const terrainBlocks = useMemo(() => {
    const blocks: { x: number; y: number; type: string; key: string }[] = [];
    // Ground layer
    for (let x = 0; x < 20; x++) {
      blocks.push({ x: x * 5, y: 80, type: 'grass', key: `${x * 5}-80` });
      blocks.push({ x: x * 5, y: 85, type: 'dirt', key: `${x * 5}-85` });
      blocks.push({ x: x * 5, y: 90, type: 'dirt', key: `${x * 5}-90` });
      blocks.push({ x: x * 5, y: 95, type: 'stone', key: `${x * 5}-95` });
    }
    // Some random stone/ore blocks
    blocks.push({ x: 10, y: 75, type: 'stone', key: '10-75' });
    blocks.push({ x: 30, y: 70, type: 'cobblestone', key: '30-70' });
    blocks.push({ x: 60, y: 75, type: 'stone', key: '60-75' });
    blocks.push({ x: 85, y: 70, type: 'cobblestone', key: '85-70' });
    // Extra blocks
    blocks.push({ x: 20, y: 75, type: 'coal', key: '20-75' });
    blocks.push({ x: 50, y: 75, type: 'iron', key: '50-75' });
    return blocks;
  }, []);

  // Get sky color based on time of day
  const getSkyGradient = useCallback(() => {
    if (timeOfDay < 25) {
      // Dawn to noon
      const t = timeOfDay / 25;
      return `linear-gradient(180deg,
        rgb(${135 + t * 0}, ${206 + t * 30}, ${235 + t * 20}) 0%,
        rgb(${176 + t * 30}, ${224 + t * 20}, ${230}) 100%)`;
    } else if (timeOfDay < 50) {
      // Noon to dusk
      const t = (timeOfDay - 25) / 25;
      return `linear-gradient(180deg,
        rgb(${135 - t * 100}, ${236 - t * 150}, ${255 - t * 150}) 0%,
        rgb(${206 - t * 100}, ${244 - t * 144}, ${230 - t * 130}) 100%)`;
    } else if (timeOfDay < 75) {
      // Dusk to midnight
      const t = (timeOfDay - 50) / 25;
      return `linear-gradient(180deg,
        rgb(${35 - t * 25}, ${86 - t * 70}, ${105 - t * 85}) 0%,
        rgb(${106 - t * 86}, ${100 - t * 80}, ${100 - t * 80}) 100%)`;
    } else {
      // Midnight to dawn
      const t = (timeOfDay - 75) / 25;
      return `linear-gradient(180deg,
        rgb(${10 + t * 125}, ${16 + t * 190}, ${20 + t * 215}) 0%,
        rgb(${20 + t * 156}, ${20 + t * 204}, ${20 + t * 210}) 100%)`;
    }
  }, [timeOfDay]);

  const isNight = timeOfDay >= 50 && timeOfDay < 100;

  const renderMenu = () => (
    <motion.div
      className={styles.menuPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background */}
      <div className={styles.menuBackground}>
        <div className={styles.panorama}></div>
      </div>

      {/* Logo */}
      <div className={styles.logoContainer}>
        <button className={styles.minecraftLogo} onClick={(e) => showEasterEgg('logo', e)}>
          <span className={styles.logoM}>M</span>
          <span className={styles.logoI}>I</span>
          <span className={styles.logoN}>N</span>
          <span className={styles.logoE}>E</span>
          <span className={styles.logoHeart}><HeartIcon className={styles.logoHeartSvg} filled /></span>
          <span className={styles.logoC}>C</span>
          <span className={styles.logoR}>R</span>
          <span className={styles.logoA}>A</span>
          <span className={styles.logoF}>F</span>
          <span className={styles.logoT}>T</span>
        </button>
        <motion.div
          className={styles.splashText}
          animate={{ rotate: [-2, 2, -2], scale: [1, 1.02, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {splashText}
        </motion.div>
      </div>

      {/* Menu buttons */}
      <div className={styles.menuButtons}>
        <button className={styles.menuButton} onClick={() => setPhase('world')}>
          Singleplayer
        </button>
        <button className={styles.menuButton} onClick={(e) => showEasterEgg('multiplayer', e)}>
          Multiplayer
        </button>
        <button className={styles.menuButton} onClick={(e) => showEasterEgg('realms', e)}>
          Minecraft Realms
        </button>
        <div className={styles.menuButtonRow}>
          <button className={styles.menuButtonSmall} onClick={(e) => showEasterEgg('settings', e)}>
            Options...
          </button>
          <button className={styles.menuButtonSmall} onClick={(e) => showEasterEgg('quit', e)}>
            Quit Game
          </button>
        </div>
      </div>

      {/* Bottom links */}
      <div className={styles.menuFooter}>
        <button className={styles.menuLink} onClick={(e) => showEasterEgg('language', e)}>
          Francais
        </button>
        <button className={styles.menuLink} onClick={(e) => showEasterEgg('accessibility', e)}>
          Accessibilite...
        </button>
      </div>

      {/* Side buttons */}
      <div className={styles.menuSide}>
        <button className={styles.menuSideBtn} onClick={(e) => showEasterEgg('skins', e)}>
          <div className={styles.skinIcon}></div>
        </button>
        <button className={styles.menuSideBtn} onClick={(e) => showEasterEgg('achievements', e)}>
          <div className={styles.achievementIcon}></div>
        </button>
      </div>

      {/* Version */}
      <div className={styles.versionText}>Minecraft Love Edition v1.14.2</div>
      <div className={styles.copyrightText}>Copyleft Mojang Studios. Ne pas distribuer!</div>
    </motion.div>
  );

  const renderWorld = () => (
    <motion.div
      className={styles.worldPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sky with day/night cycle */}
      <div className={styles.sky} style={{ background: getSkyGradient() }}>
        {/* Sun (visible during day) */}
        {!isNight && (
          <motion.button
            className={styles.sun}
            style={{
              right: `${15 + Math.sin((timeOfDay / 50) * Math.PI) * 30}%`,
              top: `${10 + (1 - Math.sin((timeOfDay / 50) * Math.PI)) * 30}%`,
            }}
            onClick={(e) => showEasterEgg('sun', e)}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {/* Moon (visible during night) */}
        {isNight && (
          <motion.button
            className={styles.moon}
            style={{
              right: `${15 + Math.sin(((timeOfDay - 50) / 50) * Math.PI) * 30}%`,
              top: `${10 + (1 - Math.sin(((timeOfDay - 50) / 50) * Math.PI)) * 30}%`,
            }}
            onClick={(e) => showEasterEgg('moon', e)}
          />
        )}
        {/* Stars (visible at night) */}
        {isNight && (
          <div className={styles.stars}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.star}
                style={{ left: `${5 + (i * 17) % 90}%`, top: `${5 + (i * 13) % 40}%` }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() }}
              />
            ))}
          </div>
        )}
        {/* Clouds */}
        <motion.button
          className={styles.cloud}
          style={{ top: '15%' }}
          animate={{ left: ['10%', '90%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          onClick={(e) => showEasterEgg('cloud', e)}
        />
        <motion.button
          className={styles.cloud}
          style={{ top: '20%' }}
          animate={{ left: ['70%', '-10%'] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          onClick={(e) => showEasterEgg('cloud', e)}
        />
        <motion.button
          className={styles.cloud}
          style={{ top: '10%' }}
          animate={{ left: ['40%', '120%'] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          onClick={(e) => showEasterEgg('cloud', e)}
        />
      </div>

      {/* Trees */}
      <button className={styles.tree} style={{ left: '5%' }} onClick={(e) => showEasterEgg('tree', e)}>
        <div className={styles.treeLeaves}></div>
        <div className={styles.treeTrunk}></div>
      </button>
      <button className={styles.tree} style={{ left: '90%' }} onClick={(e) => showEasterEgg('tree', e)}>
        <div className={styles.treeLeaves}></div>
        <div className={styles.treeTrunk}></div>
      </button>

      {/* Mobs */}
      {mobs.map((mob) => (
        <motion.button
          key={mob.id}
          className={`${styles.mob} ${styles[mob.type]}`}
          style={{ left: `${mob.x}%`, transform: `scaleX(${mob.direction})` }}
          onClick={(e) => handleMobClick(e, mob.type)}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className={styles.mobBody}></div>
          <div className={styles.mobHead}></div>
          {mob.type !== 'chicken' && <div className={styles.mobLegs}></div>}
          {mob.type === 'chicken' && <div className={styles.chickenLegs}></div>}
        </motion.button>
      ))}

      {/* Terrain blocks */}
      {terrainBlocks
        .filter((block) => !brokenBlocks.has(block.key))
        .map((block) => {
          const breaking = breakingBlocks.find((b) => `${b.x}-${b.y}` === block.key);
          return (
            <div
              key={block.key}
              className={`${styles.block} ${styles[block.type]} ${breaking ? styles.breaking : ''}`}
              style={{ left: `${block.x}%`, top: `${block.y}%` }}
              onClick={(e) => handleBlockClick(e, block.key, block.x, block.y, block.type)}
            >
              {breaking && (
                <div
                  className={styles.breakOverlay}
                  style={{ '--break-progress': `${breaking.breakProgress}%` } as React.CSSProperties}
                />
              )}
            </div>
          );
        })}

      {/* Collectible items */}
      {collectibles.map((item) => (
        !item.collected && (
          <motion.button
            key={item.id}
            className={`${styles.collectible} ${styles[item.id]}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => handleCollectItem(item)}
            whileHover={{ scale: 1.2 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {item.id === 'diamond' && <DiamondIcon className={styles.collectibleIcon} />}
            {item.id === 'redstone' && <RedstoneIcon className={styles.collectibleIcon} />}
            {item.id === 'gold' && <GoldIcon className={styles.collectibleIcon} />}
          </motion.button>
        )
      ))}

      {/* Crosshair */}
      <div className={styles.crosshair}>
        <div className={styles.crosshairH}></div>
        <div className={styles.crosshairV}></div>
      </div>

      {/* Health, Hunger, XP bars */}
      <div className={styles.healthBar}>
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            className={`${styles.heart} ${i < health ? styles.full : styles.empty}`}
            onClick={(e) => showEasterEgg('health', e)}
          />
        ))}
      </div>
      <div className={styles.hungerBar}>
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            className={`${styles.hunger} ${i < hunger ? styles.full : styles.empty}`}
            onClick={(e) => showEasterEgg('hunger', e)}
          />
        ))}
      </div>
      <div className={styles.xpBar} onClick={(e: React.MouseEvent) => showEasterEgg('xp', e)}>
        <div className={styles.xpFill} style={{ width: `${(xp % 100)}%` }}></div>
        <span className={styles.xpLevel}>{Math.floor(xp / 10)}</span>
      </div>

      {/* HUD with selectable hotbar */}
      <div className={styles.hud}>
        <div className={styles.hotbar}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
            const items = ['diamond', 'redstone', 'gold'];
            const itemId = items[index];
            const hasItem = itemId && inventory.includes(itemId);
            return (
              <button
                key={index}
                className={`${styles.hotbarSlot} ${hasItem ? styles.filled : ''} ${selectedSlot === index ? styles.selected : ''}`}
                onClick={(e) => handleHotbarClick(e, index)}
              >
                {hasItem && (
                  <span className={styles.hotbarIcon}>
                    {itemId === 'diamond' && <DiamondIcon className={styles.slotIconSvg} />}
                    {itemId === 'redstone' && <RedstoneIcon className={styles.slotIconSvg} />}
                    {itemId === 'gold' && <GoldIcon className={styles.slotIconSvg} />}
                  </span>
                )}
                <span className={styles.slotNumber}>{index + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instruction */}
      <div className={styles.instruction}>
        {!canCraft ? (
          <span>Collecte les 3 ingredients: Diamant, Redstone, Or (clique pour casser les blocs!)</span>
        ) : (
          <span>Ingredients collectes! Ouvre la table de craft</span>
        )}
      </div>

      {/* Crafting table button */}
      {canCraft && (
        <motion.button
          className={styles.craftingTableBtn}
          onClick={() => setPhase('crafting')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <CraftingTableIcon className={styles.craftingTableSvg} size={32} />
          <span>Table de Craft</span>
        </motion.button>
      )}

      {/* Time indicator */}
      <div className={styles.timeIndicator}>
        {isNight ? 'Nuit' : 'Jour'} ({Math.floor(timeOfDay)}%)
      </div>
    </motion.div>
  );

  const renderCrafting = () => (
    <motion.div
      className={styles.craftingPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.craftingOverlay}>
        <div className={styles.craftingWindow}>
          <div className={styles.craftingTitle}>Table de Craft</div>

          <div className={styles.craftingContent}>
            {/* Crafting grid */}
            <div className={styles.craftingGrid}>
              <div className={styles.craftingRow}>
                <div className={styles.craftingSlot}></div>
                <motion.div
                  className={`${styles.craftingSlot} ${styles.filled}`}
                  animate={craftingAnimation ? { scale: [1, 0], opacity: [1, 0] } : {}}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <DiamondIcon className={styles.craftSlotIcon} />
                </motion.div>
                <div className={styles.craftingSlot}></div>
              </div>
              <div className={styles.craftingRow}>
                <motion.div
                  className={`${styles.craftingSlot} ${styles.filled}`}
                  animate={craftingAnimation ? { scale: [1, 0], opacity: [1, 0] } : {}}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <GoldIcon className={styles.craftSlotIcon} />
                </motion.div>
                <motion.div
                  className={`${styles.craftingSlot} ${styles.filled}`}
                  animate={craftingAnimation ? { scale: [1, 0], opacity: [1, 0] } : {}}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <RedstoneIcon className={styles.craftSlotIcon} />
                </motion.div>
                <motion.div
                  className={`${styles.craftingSlot} ${styles.filled}`}
                  animate={craftingAnimation ? { scale: [1, 0], opacity: [1, 0] } : {}}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <GoldIcon className={styles.craftSlotIcon} />
                </motion.div>
              </div>
              <div className={styles.craftingRow}>
                <div className={styles.craftingSlot}></div>
                <motion.div
                  className={`${styles.craftingSlot} ${styles.filled}`}
                  animate={craftingAnimation ? { scale: [1, 0], opacity: [1, 0] } : {}}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <DiamondIcon className={styles.craftSlotIcon} />
                </motion.div>
                <div className={styles.craftingSlot}></div>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              className={styles.craftingArrow}
              animate={craftingAnimation ? { x: [0, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ArrowRightIcon className={styles.arrowSvg} />
            </motion.div>

            {/* Result */}
            <div className={styles.craftingResult}>
              <motion.div
                className={styles.resultSlot}
                animate={craftingAnimation ? { scale: [1, 1.3, 1], rotate: [0, 360] } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div
                  animate={craftingAnimation ? { opacity: [0, 1] } : { opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1 }}
                >
                  <HeartIcon className={styles.heartResultSvg} filled />
                </motion.div>
              </motion.div>
              <div className={styles.resultLabel}>Le Oui</div>
            </div>
          </div>

          {/* Craft button (OuiButton) */}
          {!craftingAnimation && (
            <OuiButton
              label="Crafter"
              className={styles.craftButton}
              onClick={handleCraft}
              disableAI
              overridePosition={{ x: 0, y: 0 }}
            />
          )}

          {craftingAnimation && (
            <motion.div
              className={styles.craftingStatus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Crafting en cours...
            </motion.div>
          )}

          <button className={styles.closeBtn} onClick={() => setPhase('world')} disabled={craftingAnimation}>
            Retour
          </button>
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
      <motion.div
        className={styles.doneContent}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.3 }}
      >
        <StarIcon className={styles.doneStarSvg} filled />
        <div className={styles.doneText}>
          <span className={styles.achievementTitle}>[Achievement Get!]</span>
          <span className={styles.achievementName}>T'as Reussi A Crafter</span>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <UniverseShell ambientColor="#87CEEB">
      <AnimatePresence mode="wait">
        {phase === 'menu' && renderMenu()}
        {phase === 'world' && renderWorld()}
        {phase === 'crafting' && renderCrafting()}
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

export default U06_Minecraft;
