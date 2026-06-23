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
 * If user stays on page for 60+ seconds, a subtle hidden message appears.
 */
function TimeBonusOverlay() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0); // 0: line1, 1: line2, 2: fade
  const { discovered, markDiscovered } = useEasterEgg('time_bonus');
  const timerRef = useRef(null);

  useEffect(() => {
    if (discovered) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      markDiscovered();
      setPhase(0);

      // Show line 2 after pause
      setTimeout(() => setPhase(1), timeBonusEgg.pauseBetween);
      // Fade out
      setTimeout(() => setPhase(2), timeBonusEgg.pauseBetween + 3000);
      // Remove
      setTimeout(() => setVisible(false), timeBonusEgg.pauseBetween + timeBonusEgg.fadeOutDelay);
    }, timeBonusEgg.delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [discovered, markDiscovered]);

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

  // Act 1 → Act 2
  const handleOpenGift = useCallback(() => {
    setScene(1);
  }, []);

  // Act 2 → scroll to Acts 3-6
  const handleGiftOpened = useCallback(() => {
    setShowActs36(true);
    // Smooth scroll to the photo wall
    setTimeout(() => {
      const photoSection = document.getElementById('act3-photowall');
      if (photoSection) {
        photoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }, []);

  // Act 5 → Act 6
  const handleFireworks = useCallback(() => {
    const finaleSection = document.getElementById('act6-finale');
    if (finaleSection) {
      finaleSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll reveal for Acts 3-6
  return (
    <div className="relative min-h-screen bg-night overflow-x-hidden">
      {/* Persistent starry background */}
      <StarryBackground />

      {/* Music player */}
      <MusicPlayer />

      {/* Advanced Easter Egg #5 — 60-second bonus */}
      <TimeBonusOverlay />

      {/* ——— SCENE 0-1: Full-screen acts ——— */}
      <AnimatePresence mode="wait">
        {!showActs36 && (
          <motion.div key={`scene-${scene}`}>
            {scene === 0 && <Act1_Opening onComplete={handleOpenGift} />}
            {scene === 1 && <Act2_GiftBox onOpened={handleGiftOpened} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ——— SCENES 3-6: Scroll-based sections ——— */}
      {showActs36 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div id="act3-photowall">
            <Act3_PhotoWall />
          </div>
          <div id="act4-letter">
            <Act4_Letter />
          </div>
          <div id="act5-cake">
            <Act5_Cake onFireworks={handleFireworks} />
          </div>
          <div id="act6-finale">
            <Act6_Finale />
          </div>

          {/* Footer */}
          <footer className="relative z-10 text-center py-16 text-starlight/20 text-xs tracking-[0.2em] font-serif">
            Made with 💛 for 黄水玲 · {new Date().getFullYear()}
          </footer>
        </motion.div>
      )}
    </div>
  );
}
