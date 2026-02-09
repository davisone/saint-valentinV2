import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseShell } from '../../components/core/UniverseShell';
import { useUniversePuzzle } from '../../hooks/useUniversePuzzle';
import { MouseState } from '../../hooks/useMousePhysics';
import {
  SignalBars,
  BatteryIcon,
  VideoIcon,
  PhoneIcon,
  PlusIcon,
  EmojiIcon,
  SendIcon,
  MicIcon,
  ChevronLeft,
  MessagesIcon,
  SearchIcon,
  CameraIcon,
} from '../../components/icons/SvgIcons';
import styles from './U08_iMessage.module.css';

interface Props {
  mouse: MouseState;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  reaction?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isMain?: boolean;
}

interface EasterEgg {
  id: number;
  message: string;
  x: number;
  y: number;
}

type View = 'list' | 'chat';

const CONVERSATIONS: Conversation[] = [
  { id: 'Evan', name: 'Evan', avatar: 'E❤️', lastMessage: 'Abuse dis', time: '14:36', unread: 0, isMain: true },
  { id: 'nadine', name: 'Nadine', avatar: 'N', lastMessage: 'Tu manges quoi ce soir?', time: '12:15', unread: 2 },
  { id: 'roy', name: 'Roy 🐱', avatar: '🐱', lastMessage: 'Miaou', time: 'Hier', unread: 0 },
  { id: 'Alexis', name: 'Alexis', avatar: 'A', lastMessage: 'Ok je regarde', time: 'Hier', unread: 0 },
  { id: 'papa', name: 'Papa', avatar: 'P', lastMessage: 'Appelle moi', time: 'Lun', unread: 1 },
  { id: 'travail', name: 'Groupe Travail', avatar: '👔', lastMessage: 'Eric: Reunion a 14h', time: 'Lun', unread: 5 },
];

const TAPBACK_OPTIONS = ['❤️', '👍', '👎', '😂', '‼️', '❓'];

const ATTACHMENT_OPTIONS = [
  { id: 'camera', icon: '📷', label: 'Camera' },
  { id: 'photos', icon: '🖼️', label: 'Photos' },
  { id: 'stickers', icon: '😀', label: 'Stickers' },
  { id: 'cash', icon: '💵', label: 'Apple Cash' },
  { id: 'audio', icon: '🎵', label: 'Audio' },
  { id: 'location', icon: '📍', label: 'Position' },
];

const EMOJI_CATEGORIES = ['😀', '❤️', '🐱', '🍕', '⚽', '🚗', '💡', '🎉'];

const EMOJIS = [
  ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍'],
  ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💕', '💞', '💓', '💗', '💖'],
  ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  ['🍕', '🍔', '🍟', '🌭', '🍿', '🧀', '🥚', '🍳', '🥓', '🥐', '🍞', '🥖'],
];

const EASTER_EGGS: Record<string, string> = {
  video: 'FaceTime avec Julie? Plus tard.',
  phone: 'Elle va pas décrocher',
  backToList: 'Reviens a la conversation!',
  nadine: 'Nadine veut savoir si tu manges bien',
  roy: 'Roy a faim. Comme d\'hab.',
  evan: 'Evan est occupé',
  papa: 'Rappelle Papa!',
  travail: 'Encore une reunion...',
  camera: 'Pas de selfie maintenant',
  photos: 'Tes photos sont moches',
  stickers: 'Les stickers c\'est pour les gamins',
  cash: 'T\'as pas d\'argent',
  audio: 'Ta voix est bizarre',
  location: 'On sait ou t\'es',
  search: 'Cherche "oui"',
  edit: 'Y\'a rien a editer',
  newMessage: 'T\'as qu\'une personne a qui parler',
  contactInfo: 'Julie - L\'amour de ta vie',
  muteToggle: 'Notifications activees',
};

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: 'Julie ?', sender: 'me', time: '14:32', status: 'read' },
  { id: 2, text: 'Quoi', sender: 'them', time: '14:33' },
  { id: 3, text: 'T\'es ou la', sender: 'me', time: '14:33', status: 'read' },
  { id: 4, text: 'Chez moi pq', sender: 'them', time: '14:34' },
  { id: 5, text: 'J\'ai un truc a te demander', sender: 'me', time: '14:35', status: 'read' },
  { id: 6, text: 'Vas-y', sender: 'them', time: '14:35' },
  { id: 7, text: 'Attends je reflechis a comment formuler', sender: 'me', time: '14:35', status: 'read' },
  { id: 8, text: 'Abuse dis', sender: 'them', time: '14:36' },
];

const TYPING_MESSAGE: Message = {
  id: 100,
  text: 'Veux-tu être ma Valentine ?',
  sender: 'me',
  time: '14:37',
  status: 'delivered',
};

const RESPONSE_MESSAGES: Message[] = [
  { id: 101, text: '...', sender: 'them', time: '14:37' },
  { id: 102, text: 'BTRD ?', sender: 'them', time: '14:38' },
  { id: 103, text: 'Réponds', sender: 'them', time: '14:38' },
];

const QUICK_REPLIES = ['Oui', 'Non', 'Jsp', '🤔'];

function U08_iMessage({ mouse }: Props) {
  const { startPuzzle, complete } = useUniversePuzzle(8);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [phase, setPhase] = useState<'intro' | 'typing' | 'waiting' | 'done'>('intro');
  const [currentTime, setCurrentTime] = useState('14:37');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [view, setView] = useState<View>('chat');
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(0);
  const [tapbackMessage, setTapbackMessage] = useState<number | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Intro sequence - user types the question
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        setPhase('typing');
        // Focus input
        inputRef.current?.focus();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // After typing the question, show responses
  useEffect(() => {
    if (phase === 'waiting') {
      let delay = 1500;
      RESPONSE_MESSAGES.forEach((msg, index) => {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, { ...msg, time: currentTime }]);
            if (index === RESPONSE_MESSAGES.length - 1) {
              setShowQuickReplies(true);
            }
          }, 800 + Math.random() * 500);
        }, delay);
        delay += 2000;
      });
    }
  }, [phase, currentTime]);

  const handleSendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    if (phase === 'typing') {
      // User is sending "Veux-tu etre ma Valentine?"
      const newMessage: Message = {
        id: Date.now(),
        text: text,
        sender: 'me',
        time: currentTime,
        status: 'delivered',
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputValue('');

      // Move to waiting phase
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'read' } : m))
        );
        setPhase('waiting');
      }, 1000);
    }
  }, [inputValue, phase, currentTime]);

  const handleQuickReply = useCallback((reply: string) => {
    const isPositive = reply === 'Oui';

    const newMessage: Message = {
      id: Date.now(),
      text: reply,
      sender: 'me',
      time: currentTime,
      status: 'delivered',
    };
    setMessages((prev) => [...prev, newMessage]);
    setShowQuickReplies(false);

    if (isPositive) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const finalMessage: Message = {
            id: Date.now() + 1,
            text: 'Ba enfin 😂',
            sender: 'them',
            time: currentTime,
          };
          setMessages((prev) => [...prev, finalMessage]);
          setPhase('done');
          setTimeout(() => {
            complete();
          }, 2000);
        }, 1000);
      }, 800);
    } else {
      // Wrong answer
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const wrongMessage: Message = {
            id: Date.now() + 1,
            text: 'Mauvaise réponse. Réessaye.',
            sender: 'them',
            time: currentTime,
          };
          setMessages((prev) => [...prev, wrongMessage]);
          setShowQuickReplies(true);
        }, 800);
      }, 500);
    }
  }, [currentTime, complete]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleTapback = useCallback((messageId: number, reaction: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, reaction } : m))
    );
    setTapbackMessage(null);
  }, []);

  const handleAttachmentClick = useCallback((attachmentId: string, e: React.MouseEvent) => {
    setShowAttachments(false);
    showEasterEgg(attachmentId, e);
  }, [showEasterEgg]);

  const handleEmojiClick = useCallback((emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  const handleConversationClick = useCallback((conv: Conversation, e: React.MouseEvent) => {
    if (conv.isMain) {
      setView('chat');
    } else {
      showEasterEgg(conv.id, e);
    }
  }, [showEasterEgg]);

  const renderStatusBar = () => (
    <div className={styles.statusBar}>
      <div className={styles.statusLeft}>
        <span className={styles.time}>{currentTime}</span>
      </div>
      <div className={styles.statusCenter}>
        <div className={styles.dynamicIsland}></div>
      </div>
      <div className={styles.statusRight}>
        <SignalBars className={styles.signalBarsSvg} bars={4} />
        <span className={styles.carrier}>5G</span>
        <BatteryIcon className={styles.batterySvg} level={80} />
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={(e) => { if (phase !== 'done') setView('list'); else showEasterEgg('backToList', e); }}>
        <ChevronLeft className={styles.backChevronSvg} />
        <span className={styles.backText}>Messages</span>
      </button>
      <button className={styles.contactInfo} onClick={() => setShowContactInfo(true)}>
        <div className={styles.avatar}>J</div>
        <div className={styles.contactDetails}>
          <span className={styles.contactName}>Julie</span>
          <span className={styles.contactStatus}>En ligne</span>
        </div>
      </button>
      <div className={styles.headerActions}>
        <button className={styles.headerBtn} onClick={(e) => showEasterEgg('video', e)}>
          <VideoIcon className={styles.headerIconSvg} />
        </button>
        <button className={styles.headerBtn} onClick={(e) => showEasterEgg('phone', e)}>
          <PhoneIcon className={styles.headerIconSvg} />
        </button>
      </div>
    </div>
  );

  const renderConversationList = () => (
    <motion.div
      className={styles.conversationList}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
    >
      <div className={styles.listHeader}>
        <button className={styles.editBtn} onClick={(e) => showEasterEgg('edit', e)}>Modifier</button>
        <span className={styles.listTitle}>Messages</span>
        <button className={styles.newMessageBtn} onClick={(e) => showEasterEgg('newMessage', e)}>
          <span className={styles.newMessageIcon}>✏️</span>
        </button>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <SearchIcon className={styles.searchIconSvg} />
          <input
            type="text"
            placeholder="Rechercher"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.conversations}>
        {CONVERSATIONS.filter((c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((conv) => (
          <motion.button
            key={conv.id}
            className={`${styles.conversationItem} ${conv.isMain ? styles.mainConversation : ''}`}
            onClick={(e) => handleConversationClick(conv, e)}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`${styles.convAvatar} ${conv.isMain ? styles.convAvatarMain : ''}`}>
              {conv.avatar.length === 1 ? conv.avatar : <span>{conv.avatar}</span>}
            </div>
            <div className={styles.convContent}>
              <div className={styles.convHeader}>
                <span className={styles.convName}>{conv.name}</span>
                <span className={styles.convTime}>{conv.time}</span>
              </div>
              <div className={styles.convPreview}>
                <span className={styles.convMessage}>{conv.lastMessage}</span>
                {conv.unread > 0 && (
                  <span className={styles.unreadBadge}>{conv.unread}</span>
                )}
              </div>
            </div>
            <ChevronLeft className={styles.convChevronSvg} />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderContactInfo = () => (
    <motion.div
      className={styles.contactInfoOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowContactInfo(false)}
    >
      <motion.div
        className={styles.contactInfoCard}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.contactInfoHeader}>
          <div className={styles.contactInfoAvatar}>J</div>
          <h2 className={styles.contactInfoName}>Julie</h2>
          <p className={styles.contactInfoPhone}>+33 6 12 34 56 78</p>
        </div>

        <div className={styles.contactInfoActions}>
          <button className={styles.contactAction} onClick={(e) => showEasterEgg('phone', e)}>
            <span className={styles.contactActionIcon}>📞</span>
            <span>Appeler</span>
          </button>
          <button className={styles.contactAction} onClick={(e) => showEasterEgg('video', e)}>
            <span className={styles.contactActionIcon}>📹</span>
            <span>FaceTime</span>
          </button>
          <button className={styles.contactAction} onClick={(e) => showEasterEgg('contactInfo', e)}>
            <span className={styles.contactActionIcon}>ℹ️</span>
            <span>Infos</span>
          </button>
        </div>

        <div className={styles.contactInfoOptions}>
          <div className={styles.contactOption}>
            <span>Notifications</span>
            <button className={styles.toggleBtn} onClick={(e) => showEasterEgg('muteToggle', e)}>
              <span className={styles.toggleOn}></span>
            </button>
          </div>
          <div className={styles.contactOption}>
            <span>Partager ma position</span>
            <span className={styles.optionValue}>Desactive</span>
          </div>
          <div className={styles.contactOption}>
            <span>Envoyer en tant que SMS</span>
            <span className={styles.optionValue}>Non</span>
          </div>
        </div>

        <button className={styles.closeContactBtn} onClick={() => setShowContactInfo(false)}>
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      className={`${styles.messageWrapper} ${message.sender === 'me' ? styles.sent : styles.received}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={styles.messageBubbleWrapper}
        onDoubleClick={() => setTapbackMessage(tapbackMessage === message.id ? null : message.id)}
      >
        <div className={styles.messageBubble}>
          <span className={styles.messageText}>{message.text}</span>
        </div>
        {message.reaction && (
          <motion.div
            className={styles.messageReaction}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {message.reaction}
          </motion.div>
        )}
        <AnimatePresence>
          {tapbackMessage === message.id && (
            <motion.div
              className={styles.tapbackMenu}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
            >
              {TAPBACK_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className={styles.tapbackOption}
                  onClick={() => handleTapback(message.id, emoji)}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {message.sender === 'me' && message.status && (
        <span className={styles.messageStatus}>
          {message.status === 'read' ? 'Lu' : message.status === 'delivered' ? 'Distribué' : ''}
        </span>
      )}
    </motion.div>
  );

  const renderTypingIndicator = () => (
    <motion.div
      className={`${styles.messageWrapper} ${styles.received}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.typingBubble}>
        <div className={styles.typingDots}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.div>
  );

  const renderInputBar = () => (
    <div className={styles.inputBarWrapper}>
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            className={styles.attachmentsMenu}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {ATTACHMENT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={styles.attachmentOption}
                onClick={(e) => handleAttachmentClick(opt.id, e)}
              >
                <span className={styles.attachmentIcon}>{opt.icon}</span>
                <span className={styles.attachmentLabel}>{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            className={styles.emojiPicker}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className={styles.emojiCategories}>
              {EMOJI_CATEGORIES.map((cat, index) => (
                <button
                  key={cat}
                  className={`${styles.emojiCategory} ${selectedEmojiCategory === index ? styles.active : ''}`}
                  onClick={() => setSelectedEmojiCategory(index)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.emojiGrid}>
              {(EMOJIS[selectedEmojiCategory] || EMOJIS[0]).map((emoji) => (
                <button
                  key={emoji}
                  className={styles.emojiOption}
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.inputBar}>
        <button
          className={`${styles.inputBtn} ${showAttachments ? styles.active : ''}`}
          onClick={() => { setShowAttachments(!showAttachments); setShowEmojiPicker(false); }}
        >
          <PlusIcon className={styles.plusIconSvg} />
        </button>
        <button className={styles.cameraBtn} onClick={(e) => showEasterEgg('camera', e)}>
          <CameraIcon className={styles.cameraIconSvg} />
        </button>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.textInput}
            placeholder={phase === 'typing' ? 'Pose ta question...' : 'iMessage'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={phase !== 'typing'}
          />
          <button
            className={`${styles.emojiBtn} ${showEmojiPicker ? styles.active : ''}`}
            onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachments(false); }}
          >
            <EmojiIcon className={styles.emojiIconSvg} />
          </button>
        </div>
        {inputValue.trim() ? (
          <motion.button
            className={styles.sendBtn}
            onClick={handleSendMessage}
            whileTap={{ scale: 0.9 }}
          >
            <SendIcon className={styles.sendIconSvg} />
          </motion.button>
        ) : (
          <button className={styles.micBtn} onClick={(e) => showEasterEgg('audio', e)}>
            <MicIcon className={styles.micIconSvg} />
          </button>
        )}
      </div>
    </div>
  );

  const renderQuickReplies = () => (
    <motion.div
      className={styles.quickReplies}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {QUICK_REPLIES.map((reply) => (
        <motion.button
          key={reply}
          className={`${styles.quickReplyBtn} ${(reply === 'Oui' || reply === '❤️') ? styles.positive : ''}`}
          onClick={() => handleQuickReply(reply)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {reply}
        </motion.button>
      ))}
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
        <MessagesIcon className={styles.doneIconSvg} size={80} />
        <p className={styles.doneMessage}>T'as mis le temps quand même...</p>
      </motion.div>
    </motion.div>
  );

  return (
    <UniverseShell ambientColor="#000000">
      <div className={styles.iphone}>
        {renderStatusBar()}

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div key="list" className={styles.viewContainer}>
              {renderConversationList()}
            </motion.div>
          ) : (
            <motion.div key="chat" className={styles.viewContainer}>
              {renderHeader()}

              <div className={styles.messagesContainer} onClick={() => { setTapbackMessage(null); setShowAttachments(false); setShowEmojiPicker(false); }}>
                <div className={styles.dateHeader}>
                  <span>Aujourd'hui</span>
                </div>

                {messages.map(renderMessage)}

                <AnimatePresence>
                  {isTyping && renderTypingIndicator()}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              <AnimatePresence>
                {showQuickReplies && renderQuickReplies()}
              </AnimatePresence>

              {renderInputBar()}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContactInfo && renderContactInfo()}
        </AnimatePresence>
      </div>

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

export default U08_iMessage;
