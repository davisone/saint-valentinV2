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
}

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
  { id: 103, text: 'Réponds', sender: 'th<em', time: '14:38' },
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startPuzzle();
  }, [startPuzzle]);

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
      <button className={styles.backButton}>
        <ChevronLeft className={styles.backChevronSvg} />
        <span className={styles.backText}>Messages</span>
      </button>
      <div className={styles.contactInfo}>
        <div className={styles.avatar}>J</div>
        <div className={styles.contactDetails}>
          <span className={styles.contactName}>Julie</span>
        </div>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.headerBtn}>
          <VideoIcon className={styles.headerIconSvg} />
        </button>
        <button className={styles.headerBtn}>
          <PhoneIcon className={styles.headerIconSvg} />
        </button>
      </div>
    </div>
  );

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      className={`${styles.messageWrapper} ${message.sender === 'me' ? styles.sent : styles.received}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.messageBubble}>
        <span className={styles.messageText}>{message.text}</span>
      </div>
      {message.sender === 'me' && message.status && (
        <span className={styles.messageStatus}>
          {message.status === 'read' ? 'Lu' : message.status === 'delivered' ? 'Distribue' : ''}
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
    <div className={styles.inputBar}>
      <button className={styles.inputBtn}>
        <PlusIcon className={styles.plusIconSvg} />
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
        <button className={styles.emojiBtn}><EmojiIcon className={styles.emojiIconSvg} /></button>
      </div>
      {inputValue.trim() ? (
        <button className={styles.sendBtn} onClick={handleSendMessage}>
          <SendIcon className={styles.sendIconSvg} />
        </button>
      ) : (
        <button className={styles.micBtn}>
          <MicIcon className={styles.micIconSvg} />
        </button>
      )}
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
        {renderHeader()}

        <div className={styles.messagesContainer}>
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
      </div>

      {phase === 'done' && renderDone()}
    </UniverseShell>
  );
}

export default U08_iMessage;
