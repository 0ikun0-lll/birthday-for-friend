import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLongPress } from '../hooks/useLongPress';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { giftLongPressEgg } from '../data/easterEggData';

/**
 * Act 2 — Floating gift box.
 * Supports regular click (open with confetti) and long-press easter egg (#3).
 *
 * @param {{ onOpened: () => void }} props
 */
export default function Act2_GiftBox({ onOpened }) {
  const [opened, setOpened] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const { discovered, markDiscovered } = useEasterEgg('gift_long_press');

  // Long-press easter egg #3 — defined first so useLongPress can reference it
  const handleLongPress = useCallback(() => {
    if (opened || discovered) return;
    setShowEasterEgg(true);
    markDiscovered();

    // Golden particle burst
    confetti({
      particleCount: giftLongPressEgg.particleCount,
      spread: 360,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ffd700', '#ffec8b', '#daa520', '#ffb90f'],
      ticks: 200,
      shapes: ['star'],
    });

    setTimeout(() => {
      setShowEasterEgg(false);
    }, 4000);
  }, [opened, discovered, markDiscovered]);

  const { handlers: longPressHandlers, wasLongPress } = useLongPress(
    handleLongPress,
    giftLongPressEgg.duration
  );

  // Regular click — open the gift (skip if was a long press)
  const handleOpen = useCallback(() => {
    if (opened) return;
    if (wasLongPress.current) {
      wasLongPress.current = false;
      return;
    }
    setOpened(true);

    // Burst confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ffd700', '#ffb3ba', '#a8c8ff', '#ffe4b5', '#ffffff'],
      ticks: 100,
    });

    setTimeout(() => setShowTip(true), 1200);
  }, [opened, wasLongPress]);

  const handleContinue = useCallback(() => {
    onOpened();
  }, [onOpened]);

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <AnimatePresence mode="wait">
        {!opened ? (
          /* ——— CLOSED GIFT BOX ——— */
          <motion.div
            key="closed"
            className="relative cursor-pointer select-none"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            whileHover={{ scale: 1.08 }}
            onClick={handleOpen}
            {...longPressHandlers}
          >
            {/* Gift box rendered with CSS */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              {/* Box body */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-32 sm:w-48 sm:h-36
                              rounded-xl bg-gradient-to-br from-warm-rose to-warm-pink
                              shadow-2xl shadow-warm-pink/30" />
              {/* Box lid */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-14 sm:w-52 sm:h-16
                            rounded-xl bg-gradient-to-br from-warm-pink to-warm-rose
                            shadow-lg shadow-warm-pink/20
                            flex items-center justify-center"
                whileHover={{ y: -3 }}
              >
                {/* Ribbon bow */}
                <div className="flex gap-1">
                  <div className="w-5 h-5 rounded-full bg-starlight-gold shadow-md"
                       style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                  <div className="w-5 h-5 rounded-full bg-starlight-gold shadow-md"
                       style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                </div>
              </motion.div>
              {/* Ribbon vertical */}
              <div className="absolute left-1/2 -translate-x-1/2 top-12 w-3 h-20 sm:h-24
                              bg-starlight-gold/80 rounded-full shadow-inner" />
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-starlight-gold/10 blur-2xl animate-pulse-soft" />
            </div>
            <p className="text-center text-starlight/50 text-sm mt-4 tracking-wider">
              点击打开礼物
            </p>
          </motion.div>
        ) : (
          /* ——— OPENED STATE ——— */
          <motion.div
            key="opened"
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <motion.p
              className="text-xl sm:text-2xl md:text-3xl font-serif text-starlight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              在打开最后的祝福前
            </motion.p>
            <motion.p
              className="text-lg sm:text-xl text-starlight-blue mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              先看一点神秘图片吧
            </motion.p>

            <AnimatePresence>
              {showTip && (
                <motion.button
                  onClick={handleContinue}
                  className="mt-4 px-8 py-3 rounded-full
                             bg-white/10 backdrop-blur-md border border-starlight/30
                             text-starlight text-base font-serif tracking-wider
                             hover:bg-white/20 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  继续 →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg #3 overlay */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center
                       bg-night/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <motion.h2
              className="text-3xl sm:text-5xl font-serif text-starlight-gold animate-glow mb-4"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            >
              {giftLongPressEgg.title}
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-starlight/80 font-serif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {giftLongPressEgg.blessing}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
