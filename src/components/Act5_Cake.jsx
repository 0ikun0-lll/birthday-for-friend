import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const WISH_WAIT = 3000;

/**
 * Act 5 — 3D birthday cake with candle interaction.
 * Light candles → warm glow → "许个愿吧。" → blow out → fireworks.
 *
 * @param {{ onFireworks: () => void }} props
 */
export default function Act5_Cake({ onFireworks }) {
  const [candlesLit, setCandlesLit] = useState(false);
  const [showingWish, setShowingWish] = useState(false);
  const [blownOut, setBlownOut] = useState(false);
  const [canBlow, setCanBlow] = useState(false);

  // Light the candles
  const handleLight = useCallback(() => {
    setCandlesLit(true);
    setShowingWish(true);

    setTimeout(() => {
      setCanBlow(true);
    }, WISH_WAIT);
  }, []);

  // Blow out candles → massive fireworks
  const handleBlow = useCallback(() => {
    if (!canBlow) return;
    setBlownOut(true);
    setCandlesLit(false);
    setShowingWish(false);

    // Massive fireworks burst
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.5 },
        colors: ['#ffd700', '#ff6b6b', '#a8c8ff', '#ffffff'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.5 },
        colors: ['#ffd700', '#ffb3ba', '#ffe4b5', '#ffffff'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Also big burst
    confetti({
      particleCount: 400,
      spread: 360,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ffd700', '#ffb3ba', '#a8c8ff', '#ffe4b5', '#ff6b6b', '#ffffff'],
      ticks: 300,
      shapes: ['circle', 'star'],
    });

    // Notify parent after delay
    setTimeout(onFireworks, 4000);
  }, [canBlow, onFireworks]);

  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24">
      {/* Warm glow overlay when candles are lit */}
      <AnimatePresence>
        {candlesLit && !blownOut && (
          <motion.div
            className="fixed inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,180,100,0.15) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl font-serif text-starlight mb-12 tracking-wider">
          许个心愿吧
        </h2>

        {/* Cake */}
        <motion.div
          className="relative mx-auto mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto">
            {/* Cake base (bottom layer) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                            w-48 h-20 sm:w-56 sm:h-24
                            rounded-xl rounded-b-2xl
                            bg-gradient-to-b from-[#f5e6d3] to-[#e8d5c0]
                            shadow-xl shadow-black/20
                            border-t-4 border-[#ffe4c4]" />

            {/* Cake middle layer */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2
                            w-36 h-16 sm:w-40 sm:h-20
                            rounded-xl rounded-b-2xl
                            bg-gradient-to-b from-[#fff5ee] to-[#f5e6d3]
                            shadow-lg shadow-black/10
                            border-t-4 border-[#ffe4c4]" />

            {/* Cake top layer */}
            <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2
                            w-24 h-12 sm:w-28 sm:h-14
                            rounded-xl rounded-b-2xl
                            bg-gradient-to-b from-[#ffffff] to-[#fff5ee]
                            shadow-md shadow-black/10
                            border-t-2 border-[#ffe4c4]" />

            {/* Frosting drips */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-36 sm:w-40">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-3 h-6 rounded-full bg-[#fff5ee]"
                  style={{ left: `${20 + i * 25}%` }}
                  animate={{ height: [6, 10, 6] * 4 }}
                  transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
                />
              ))}
            </div>

            {/* Candles */}
            <div className="absolute bottom-[100px] sm:bottom-[110px] left-1/2 -translate-x-1/2 flex gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {/* Candle body */}
                  <div className="w-3 h-12 sm:h-14 rounded-full
                                  bg-gradient-to-b from-[#ffecd2] to-[#ffb3ba]
                                  shadow-sm" />
                  {/* Flame */}
                  <AnimatePresence>
                    {candlesLit && (
                      <motion.div
                        className="absolute -top-5 sm:-top-6"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.9, 1, 0.9],
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          scale: { repeat: Infinity, duration: 0.6 + i * 0.1, repeatType: 'reverse' },
                          opacity: { repeat: Infinity, duration: 0.4 + i * 0.1, repeatType: 'reverse' },
                        }}
                      >
                        {/* Outer glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                        w-8 h-8 rounded-full bg-orange-400/30 blur-md" />
                        {/* Inner flame */}
                        <div className="w-3 h-5 rounded-full
                                        bg-gradient-to-t from-orange-400 via-yellow-300 to-white"
                             style={{ clipPath: 'ellipse(50% 100% at 50% 0%)' }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {!candlesLit && !blownOut && (
              <motion.button
                key="light"
                onClick={handleLight}
                className="px-8 py-3 rounded-full
                           bg-gradient-to-r from-warm-pink/30 to-warm-rose/30
                           backdrop-blur-md border border-warm-pink/50
                           text-starlight text-lg font-serif tracking-wider
                           hover:from-warm-pink/40 hover:to-warm-rose/40
                           transition-all shadow-lg shadow-warm-pink/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                点亮蜡烛
              </motion.button>
            )}

            {showingWish && !blownOut && (
              <motion.div
                key="wish"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xl sm:text-2xl font-serif text-starlight-gold animate-pulse-soft mb-6">
                  许个愿吧。
                </p>
                {canBlow && (
                  <motion.button
                    onClick={handleBlow}
                    className="px-8 py-3 rounded-full
                               bg-white/10 backdrop-blur-md border border-starlight/30
                               text-starlight text-lg font-serif tracking-wider
                               hover:bg-white/20 transition-all"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    吹灭蜡烛
                  </motion.button>
                )}
              </motion.div>
            )}

            {blownOut && (
              <motion.p
                key="blown"
                className="text-xl font-serif text-starlight-gold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                🎂 生日快乐！🎂
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
