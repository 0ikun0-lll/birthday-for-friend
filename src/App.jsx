import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarryBackground from './components/StarryBackground';
import Act1_Opening from './components/Act1_Opening';
import Act2_GiftBox from './components/Act2_GiftBox';
import Act3_PhotoWall from './components/Act3_PhotoWall';
import Act4_Letter from './components/Act4_Letter';
import Act5_Cake from './components/Act5_Cake';
import Act6_Finale from './components/Act6_Finale';
import MusicPlayer from './components/MusicPlayer';
import { useEasterEgg } from './hooks/useEasterEgg';
import { timeBonusEgg } from './data/easterEggData';

/**
 * Advanced Easter Egg #5 — 60-second auto-trigger.
 * Timer starts only after candles are blown out (when `started` becomes true).
 */
function TimeBonusOverlay({ started }) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);
  const { discovered, markDiscovered } = useEasterEgg('time_bonus');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!started || discovered) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      markDiscovered();
      setPhase(0);

      setTimeout(() => setPhase(1), timeBonusEgg.pauseBetween);
      setTimeout(() => setPhase(2), timeBonusEgg.pauseBetween + 3000);
      setTimeout(() => setVisible(false), timeBonusEgg.pauseBetween + timeBonusEgg.fadeOutDelay);
    }, timeBonusEgg.delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [started, discovered, markDiscovered]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center
                 bg-night/60 backdrop-blur-sm pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase < 2 ? 1 : 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="text-center px-6">
        {phase >= 0 && (
          <motion.p
            className="text-xl sm:text-2xl md:text-3xl font-serif text-starlight tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {timeBonusEgg.line1}
          </motion.p>
        )}
        {phase >= 1 && (
          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-serif
                       bg-gradient-to-r from-starlight-gold via-warm-pink to-starlight-gold
                       bg-clip-text text-transparent
                       tracking-wider mt-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: phase < 2 ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            {timeBonusEgg.line2}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Main application — orchestrates the 6-act story.
 *
 * Flow:
 *   Scene 0 (Act 1) → click → Scene 1 (Act 2) → open gift → scroll to Acts 3-6
 */
export default function App() {
  const [scene, setScene] = useState(0);
  const [showActs36, setShowActs36] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  // Act 1 → Act 2
  const handleOpenGift = useCallback(() => {
    setScene(1);
  }, []);

  // Act 2 → scroll to Acts 3-6
  const handleGiftOpened = useCallback(() => {
    setShowActs36(true);
    setTimeout(() => {
      const photoSection = document.getElementById('act3-photowall');
      if (photoSection) {
        photoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }, []);

  // Act 5 candles blown → scroll to finale + start 60s timer
  const handleFireworks = useCallback(() => {
    setTimerStarted(true);
    setTimeout(() => {
      const finaleSection = document.getElementById('act6-finale');
      if (finaleSection) {
        finaleSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-night overflow-x-hidden">
      {/* Persistent starry background */}
      <StarryBackground />

      {/* Music player */}
      <MusicPlayer />

      {/* Easter Egg #5 — 60s timer starts after blowing out candles */}
      <TimeBonusOverlay started={timerStarted} />

      {/* ——— SCENE 0-1: Full-screen acts ——— */}
      <AnimatePresence mode="wait">
        {!showActs36 && (
          <motion.div key={`scene-${scene}`}>
            {scene === 0 && <Act1_Opening onComplete={handleOpenGift} />}
            {scene === 1 && <Act2_GiftBox onOpened={handleGiftOpened} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ——— SCENES 3-6: Scroll-based sections with snap ——— */}
      {showActs36 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* ====== Photo Wall ====== */}
          <section id="act3-photowall" className="snap-section">
            <Act3_PhotoWall />
            {/* Pause hint at the bottom of photo grid */}
            <motion.div
              className="text-center pb-24"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-starlight/25 text-sm tracking-[0.3em] font-serif">
                继续往下翻，还有惊喜
              </p>
              <motion.p
                className="text-starlight/15 text-lg mt-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                ↓
              </motion.p>
            </motion.div>
          </section>

          {/* ====== Letter ====== */}
          <section id="act4-letter" className="snap-section">
            <Act4_Letter />
          </section>

          {/* ====== Cake ====== */}
          <section id="act5-cake" className="snap-section">
            <Act5_Cake onFireworks={handleFireworks} />
          </section>

          {/* ====== Finale ====== */}
          <section id="act6-finale" className="snap-section">
            <Act6_Finale />
          </section>

          {/* Footer */}
          <footer className="relative z-10 text-center py-24 text-starlight/20 text-xs tracking-[0.2em] font-serif">
            Made with 💛 for 黄水玲 · {new Date().getFullYear()}
          </footer>
        </motion.div>
      )}
    </div>
  );
}
