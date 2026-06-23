import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import blessings from '../data/blessings';

/**
 * Act 4 — Envelope and letter.
 * Envelope appears, click to open, letter unfolds, paragraphs fade in one by one.
 */
export default function Act4_Letter() {
  const [opened, setOpened] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);

  const handleOpen = useCallback(() => {
    setOpened(true);
    // Reveal paragraphs sequentially
    blessings.paragraphs.forEach((_, i) => {
      setTimeout(() => {
        setVisibleParagraphs((prev) => prev + 1);
      }, 800 + i * 1200);
    });
  }, []);

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {!opened ? (
            /* ——— ENVELOPE ——— */
            <motion.div
              key="envelope"
              className="flex flex-col items-center cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpen}
            >
              {/* Envelope shape */}
              <motion.div
                className="relative w-64 h-40 sm:w-80 sm:h-48"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                {/* Envelope body */}
                <div className="absolute inset-0 bg-gradient-to-br from-warm-pink/20 to-warm-rose/10
                                backdrop-blur-md border border-starlight-blue/30 rounded-lg
                                shadow-xl shadow-starlight-blue/5" />
                {/* Envelope flap (triangle) */}
                <div
                  className="absolute top-0 left-0 right-0 h-3/5
                             bg-gradient-to-b from-warm-pink/30 to-transparent
                             border-b border-starlight-blue/20 rounded-t-lg"
                  style={{
                    clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                  }}
                />
                {/* Seal / wax stamp */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2
                                w-10 h-10 rounded-full bg-warm-rose/40
                                border-2 border-starlight-gold/50
                                flex items-center justify-center
                                shadow-lg shadow-warm-rose/20">
                  <span className="text-starlight-gold text-sm">💌</span>
                </div>
              </motion.div>
              <p className="mt-6 text-starlight/60 text-sm tracking-widest">
                点击打开信封
              </p>
            </motion.div>
          ) : (
            /* ——— LETTER ——— */
            <motion.div
              key="letter"
              className="relative"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, type: 'spring', stiffness: 60 }}
            >
              {/* Letter paper */}
              <div className="bg-gradient-to-br from-[#fefefe] to-[#faf5ef]
                              rounded-sm shadow-2xl p-8 sm:p-12 md:p-16
                              border border-amber-100/50
                              relative overflow-hidden">
                {/* Subtle paper texture lines */}
                <div className="absolute inset-0 opacity-[0.03]"
                     style={{
                       backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, #000 28px, #000 29px)',
                     }} />

                <div className="relative">
                  {/* Greeting */}
                  <motion.p
                    className="text-xl sm:text-2xl font-serif text-gray-800 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {blessings.greeting}
                  </motion.p>

                  {/* Paragraphs */}
                  {blessings.paragraphs.map((para, i) => (
                    <motion.p
                      key={i}
                      className="text-base sm:text-lg font-serif text-gray-700 leading-relaxed mb-5
                                 indent-8"
                      initial={{ opacity: 0, y: 15 }}
                      animate={
                        i < visibleParagraphs
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 15 }
                      }
                      transition={{ duration: 0.6 }}
                    >
                      {para}
                    </motion.p>
                  ))}

                  {/* Closing */}
                  {visibleParagraphs >= blessings.paragraphs.length && (
                    <motion.div
                      className="mt-10 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      <p className="text-base font-serif text-gray-600">
                        {blessings.closing}
                      </p>
                      <p className="text-2xl mt-2">{blessings.signature}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Scroll down hint after all paragraphs visible */}
              {visibleParagraphs >= blessings.paragraphs.length && (
                <motion.p
                  className="text-center text-starlight/40 text-sm mt-8 tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  继续往下，还有惊喜 ↓
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
