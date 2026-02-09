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

const SPLASH_TEXTS = [
  'Roy à mangé les croquettes!',
  '100% de chance de galérer!',
  'Craft le truc!',
  'Nadine a appele 3 fois!',
  'Mode facile active!',
  'Achievement: T\'as trouve un bouton!',
  'Comptable vs Creeper: Creeper gagne',
  'Mode peaceful pour les nuls!',
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
  const eggIdRef = useRef(0);

  useEffect(() => {
    startPuzzle();
    setSplashText(SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)]);
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
    setPhase('done');
    setTimeout(() => {
      complete();
    }, 2500);
  }, [complete]);

  const handleBlockClick = useCallback((e: React.MouseEvent) => {
    showEasterEgg('wrongBlock', e);
  }, [showEasterEgg]);

  // Generate terrain blocks
  const terrainBlocks = useMemo(() => {
    const blocks: { x: number; y: number; type: string }[] = [];
    // Ground layer
    for (let x = 0; x < 20; x++) {
      blocks.push({ x: x * 5, y: 80, type: 'grass' });
      blocks.push({ x: x * 5, y: 85, type: 'dirt' });
      blocks.push({ x: x * 5, y: 90, type: 'dirt' });
      blocks.push({ x: x * 5, y: 95, type: 'stone' });
    }
    // Some random stone/ore blocks
    blocks.push({ x: 10, y: 75, type: 'stone' });
    blocks.push({ x: 30, y: 70, type: 'stone' });
    blocks.push({ x: 60, y: 75, type: 'stone' });
    blocks.push({ x: 85, y: 70, type: 'stone' });
    return blocks;
  }, []);

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

      {/* Version */}
      <div className={styles.versionText}>Minecraft Love Edition</div>
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
      {/* Sky */}
      <div className={styles.sky}>
        <button className={styles.sun} onClick={(e) => showEasterEgg('sun', e)}></button>
        <button className={styles.cloud} style={{ left: '20%', top: '15%' }} onClick={(e) => showEasterEgg('cloud', e)}></button>
        <button className={styles.cloud} style={{ left: '60%', top: '20%' }} onClick={(e) => showEasterEgg('cloud', e)}></button>
        <button className={styles.cloud} style={{ left: '80%', top: '10%' }} onClick={(e) => showEasterEgg('cloud', e)}></button>
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

      {/* Terrain blocks */}
      {terrainBlocks.map((block, i) => (
        <div
          key={i}
          className={`${styles.block} ${styles[block.type]}`}
          style={{ left: `${block.x}%`, top: `${block.y}%` }}
          onClick={handleBlockClick}
        ></div>
      ))}

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

      {/* HUD */}
      <div className={styles.hud}>
        <div className={styles.hotbar}>
          {['diamond', 'redstone', 'gold'].map((itemId) => (
            <div
              key={itemId}
              className={`${styles.hotbarSlot} ${inventory.includes(itemId) ? styles.filled : ''}`}
            >
              {inventory.includes(itemId) && (
                <span className={styles.hotbarIcon}>
                  {itemId === 'diamond' && <DiamondIcon className={styles.slotIconSvg} />}
                  {itemId === 'redstone' && <RedstoneIcon className={styles.slotIconSvg} />}
                  {itemId === 'gold' && <GoldIcon className={styles.slotIconSvg} />}
                </span>
              )}
            </div>
          ))}
          <div className={styles.hotbarSlot}></div>
          <div className={styles.hotbarSlot}></div>
          <div className={styles.hotbarSlot}></div>
          <div className={styles.hotbarSlot}></div>
          <div className={styles.hotbarSlot}></div>
          <div className={styles.hotbarSlot}></div>
        </div>
      </div>

      {/* Instruction */}
      <div className={styles.instruction}>
        {!canCraft ? (
          <span>Collecte les 3 ingredients: Diamant, Redstone, Or</span>
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
                <div className={`${styles.craftingSlot} ${styles.filled}`}>
                  <DiamondIcon className={styles.craftSlotIcon} />
                </div>
                <div className={styles.craftingSlot}></div>
              </div>
              <div className={styles.craftingRow}>
                <div className={`${styles.craftingSlot} ${styles.filled}`}>
                  <GoldIcon className={styles.craftSlotIcon} />
                </div>
                <div className={`${styles.craftingSlot} ${styles.filled}`}>
                  <RedstoneIcon className={styles.craftSlotIcon} />
                </div>
                <div className={`${styles.craftingSlot} ${styles.filled}`}>
                  <GoldIcon className={styles.craftSlotIcon} />
                </div>
              </div>
              <div className={styles.craftingRow}>
                <div className={styles.craftingSlot}></div>
                <div className={`${styles.craftingSlot} ${styles.filled}`}>
                  <DiamondIcon className={styles.craftSlotIcon} />
                </div>
                <div className={styles.craftingSlot}></div>
              </div>
            </div>

            {/* Arrow */}
            <div className={styles.craftingArrow}>
              <ArrowRightIcon className={styles.arrowSvg} />
            </div>

            {/* Result */}
            <div className={styles.craftingResult}>
              <div className={styles.resultSlot}>
                <CheckIcon className={styles.checkResultSvg} />
              </div>
              <div className={styles.resultLabel}>Le Oui</div>
            </div>
          </div>

          {/* Craft button (OuiButton) */}
          <OuiButton
            label="Crafter"
            className={styles.craftButton}
            onClick={handleCraft}
            disableAI
            overridePosition={{ x: 0, y: 0 }}
          />

          <button className={styles.closeBtn} onClick={() => setPhase('world')}>
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
