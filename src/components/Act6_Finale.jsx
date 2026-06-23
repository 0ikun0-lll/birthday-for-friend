import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { meteorEgg, fireworkMessageEgg } from '../data/easterEggData';

/**
 * Act 6 — Grand finale.
 * Fireworks end → particles gather → "黄水玲" → "生日快乐" → meteors → final message.
 * Easter Egg #1: Click stars 5 times → meteor wish.
 * Easter Egg #4: Click after fireworks → second round → "谢谢你的陪伴".
 *
 * @param {{ onMeteorClick?: () => void }} props
 */
export default function Act6_Finale({ onMeteorClick }) {
  const [phase, setPhase] = useState('name'); // name | birthday | final
  const [showMeteor, setShowMeteor] = useState(false);
  const [showFireworkMsg, setShowFireworkMsg] = useState(false);

  const starClicksRef = useRef(0);
  const { discovered: meteorDiscovered, markDiscovered: markMeteor } =
    useEasterEgg('meteor_wish');
  const { discovered: fwDiscovered, markDiscovered: markFw } =
    useEasterEgg('firework_message');

  // Sequence: name → birthday → final message
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('birthday'), 2500);
    const t2 = setTimeout(() => setPhase('final'), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Easter Egg #1 — handle star clicks
  const handleStarClick = useCallback(() => {
    if (meteorDiscovered) return;
    starClicksRef.current += 1;
    if (starClicksRef.current >= meteorEgg.triggerClicks) {
      setShowMeteor(true);
      markMeteor();
      if (onMeteorClick) onMeteorClick();

      // Auto-hide meteor message
      setTimeout(() => setShowMeteor(false), 5000);
    }
  }, [meteorDiscovered, markMeteor, onMeteorClick]);

  // Easter Egg #4 — second firework round after clicking
  const handleFinaleClick = useCallback(() => {
    if (fwDiscovered || showFireworkMsg) return;

    setShowFireworkMsg(true);
    markFw();

    // Second round of confetti
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.5 },
        colors: ['#ffd700', '#ff6b6b', '#ffffff'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.5 },
        colors: ['#ffd700', '#ffb3ba', '#ffffff'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    confetti({
      particleCount: 300,
      spread: 360,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ffd700', '#ffb3ba', '#a8c8ff', '#ffffff'],
      ticks: 200,
    });
  }, [fwDiscovered, showFireworkMsg, markFw]);

  // Small particle burst on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 180,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#ffd700', '#a8c8ff', '#ffb3ba', '#ffffff'],
        ticks: 80,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6"
      onClick={handleFinaleClick}
    >
      {/* ✦ Twinkling stars — clickable for Easter Egg #1 ✦ */}
      {!meteorDiscovered && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const positions = [
              { top: '8%', left: '15%' },
              { top: '12%', left: '75%' },
              { top: '25%', left: '85%' },
              { top: '30%', left: '8%' },
              { top: '45%', left: '92%' },
              { top: '55%', left: '5%' },
              { top: '68%', left: '88%' },
              { top: '78%', left: '20%' },
            ];
            const { top, left } = positions[i];
            return (
              <motion.button
                key={`star-${i}`}
                className="fixed z-30 cursor-pointer bg-transparent border-0 outline-none
                           flex items-center justify-center"
                style={{ top, left, width: 44, height: 44 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarClick();
                }}
                animate={{
                  scale: [1, 1.25, 1],
                  filter: [
                    'drop-shadow(0 0 3px rgba(255,215,0,0.4))',
                    'drop-shadow(0 0 8px rgba(255,215,0,0.8))',
                    'drop-shadow(0 0 3px rgba(255,215,0,0.4))',
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + i * 0.35,
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.5 }}
                aria-label="星星"
              >
                <span className="text-xl sm:text-2xl text-starlight-gold select-none">
                  ✦
                </span>
              </motion.button>
            );
          })}
        </>
      )}

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-starlight-gold/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main text sequence */}
      <div className="text-center relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'name' && (
            <motion.h1
              key="name"
              className="text-5xl sm:text-7xl md:text-8xl font-serif
                         bg-gradient-to-b from-starlight via-starlight-blue to-warm-pink
                         bg-clip-text text-transparent
                         animate-glow tracking-widest"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, type: 'spring', stiffness: 50 }}
            >
              黄水玲
            </motion.h1>
          )}

          {phase === 'birthday' && (
            <motion.h1
              key="birthday"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif
                         bg-gradient-to-b from-starlight-gold via-warm-pink to-starlight-gold
                         bg-clip-text text-transparent
                         tracking-widest"
              initial={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 60 }}
            >
              生日快乐
            </motion.h1>
          )}

          {phase === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl font-serif text-starlight
                           tracking-wider leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                愿未来的每一天
              </motion.p>
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl font-serif
                           bg-gradient-to-r from-starlight-gold via-warm-pink to-starlight-gold
                           bg-clip-text text-transparent
                           tracking-wider mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                都闪闪发光。
              </motion.p>

              {/* Click hint for Easter Egg #4 */}
              {!fwDiscovered && (
                <motion.p
                  className="text-starlight/30 text-xs mt-8 tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                >
                  点击任意位置
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Easter Egg #1 — Meteor */}
      <AnimatePresence>
        {showMeteor && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center
                       bg-night/50 backdrop-blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            {/* Meteor streak */}
            <motion.div
              className="absolute w-1 h-20 bg-gradient-to-b from-white via-starlight-blue to-transparent
                         rounded-full blur-sm"
              style={{ top: '20%', left: '70%' }}
              animate={{
                x: -400,
                y: 400,
                opacity: [1, 0],
              }}
              transition={{ duration: 2, ease: 'easeIn' }}
            />
            <motion.h2
              className="text-2xl sm:text-3xl font-serif text-starlight-gold animate-glow mb-3"
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.5 }}
            >
              {meteorEgg.title}
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-starlight/80 font-serif"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {meteorEgg.blessing}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg #4 — Firework message */}
      <AnimatePresence>
        {showFireworkMsg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center
                       pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
          >
            <motion.h2
              className="text-3xl sm:text-5xl md:text-6xl font-serif
                         bg-gradient-to-r from-starlight-gold via-warm-pink to-starlight-gold
                         bg-clip-text text-transparent
                         tracking-widest"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 60, delay: 0.5 }}
            >
              {fireworkMessageEgg.message}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
