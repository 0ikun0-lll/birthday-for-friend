import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPING_SPEED = 80; // ms per character
const PAUSE_BETWEEN = 2000;

const lines = [
  '嘿，黄水玲!',
  '今天是一个特别的日子。',
  '所以我准备了一份礼物。',
  '希望你会喜欢。',
];

/**
 * Act 1 — Typewriter opening sequence.
 * Lines appear one by one with a typewriter effect, then a CTA button fades in.
 *
 * @param {{ onComplete: () => void }} props
 */
export default function Act1_Opening({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(-1);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Start the sequence on mount
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setCurrentLine(0);
    }, 800);
    return () => clearTimeout(startTimeout);
  }, []);

  // Type each character
  useEffect(() => {
    if (currentLine < 0 || currentLine >= lines.length) return;

    const line = lines[currentLine];
    if (charIndex < line.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + line[charIndex]);
        setCharIndex((i) => i + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timer);
    } else {
      // Line complete — pause, then next
      const timer = setTimeout(() => {
        if (currentLine < lines.length - 1) {
          setCurrentLine((l) => l + 1);
          setCharIndex(0);
          setDisplayedText((prev) => prev + '\n');
        } else {
          // All lines done
          const btnTimer = setTimeout(() => setShowButton(true), 500);
          return () => clearTimeout(btnTimer);
        }
      }, PAUSE_BETWEEN);
      return () => clearTimeout(timer);
    }
  }, [currentLine, charIndex]);

  const handleOpen = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <motion.div
        className="max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <pre className="font-serif text-xl sm:text-2xl md:text-3xl text-starlight leading-relaxed whitespace-pre-wrap text-left inline-block">
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, repeatType: 'reverse' }}
            className="inline-block w-[2px] h-[1em] bg-starlight ml-0.5 align-middle"
          />
        </pre>
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.button
            onClick={handleOpen}
            className="mt-12 px-10 py-4 rounded-full
                       bg-white/10 backdrop-blur-md border border-starlight-gold/50
                       text-starlight-gold text-lg font-serif tracking-wider
                       hover:bg-white/20 hover:border-starlight-gold
                       transition-all duration-300
                       shadow-lg shadow-starlight-gold/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            打开礼物
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
