import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { useScrollProgress } from '../hooks/useScrollProgress';
import photos from '../data/photos';
import { photoFlipEgg } from '../data/easterEggData';

/**
 * A single polaroid-style photo card.
 * Supports flip on click (Easter Egg #2) revealing hidden text.
 */
function PolaroidCard({ photo, index, total }) {
  const [flipped, setFlipped] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const { discovered, markDiscovered } = useEasterEgg(`photo_flip_${index}`);
  const cardRef = useRef(null);

  const handleFlip = useCallback(() => {
    if (flipped) return;

    setFlipped(true);

    if (!discovered) {
      markDiscovered();
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    }
  }, [flipped, discovered, markDiscovered]);

  // Random entrance angle
  const rotateAngle = (() => {
    const seed = (index * 7 + 3) % 11;
    return seed - 5; // -5 to +5 degrees
  })();

  const directionX = (() => {
    const dirs = [-200, 200, -150, 150, -100, 100];
    return dirs[index % dirs.length];
  })();

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      initial={{ opacity: 0, x: directionX, rotate: rotateAngle }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 60,
        damping: 14,
      }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      onClick={handleFlip}
    >
      {/* 3D flip container */}
      <motion.div
        className="relative w-56 sm:w-64"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — Polaroid photo */}
        <div
          className="bg-white/95 rounded-sm shadow-xl p-3 pb-10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-sm overflow-hidden">
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%231a1a3e" width="400" height="300"/><text fill="%23a8c8ff" x="200" y="150" text-anchor="middle" font-size="20">📷</text></svg>';
              }}
            />
          </div>
          <p className="text-gray-600 text-sm text-center mt-3 font-serif tracking-wider">
            {photo.caption}
          </p>
        </div>

        {/* Back — Hidden message */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-warm-pink/90 to-warm-rose/90
                     rounded-sm shadow-xl p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-white text-lg font-serif text-center leading-relaxed">
            {photo.flipText || '💛'}
          </p>
          <div className="mt-3 text-white/60 text-2xl">💛</div>
        </div>
      </motion.div>

      {/* Floating hearts on flip easter egg */}
      <AnimatePresence>
        {showHearts && (
          <>
            {Array.from({ length: photoFlipEgg.heartParticleCount }).map((_, i) => {
              const angle = (i / photoFlipEgg.heartParticleCount) * 360;
              const dist = 60 + Math.random() * 100;
              const color = photoFlipEgg.heartColors[
                i % photoFlipEgg.heartColors.length
              ];
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 text-lg pointer-events-none"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: Math.cos((angle * Math.PI) / 180) * dist,
                    y: Math.sin((angle * Math.PI) / 180) * dist - 30,
                    opacity: 0,
                    scale: 1.2,
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ color }}
                >
                  💛
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Act 3 — Polaroid photo wall with masonry-like layout.
 * Scroll-triggered entrance animations. Each photo flips on click (Easter Egg #2).
 */
export default function Act3_PhotoWall() {
  const { progress } = useScrollProgress();
  const sectionRef = useRef(null);

  // Randomize photo order for visual interest
  const [shuffledPhotos] = useState(() => {
    const arr = [...photos];
    // Don't actually shuffle — preserve original order for flipText matching
    return arr;
  });

  return (
    <section ref={sectionRef} className="relative z-10 min-h-screen py-24 px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-starlight tracking-wider">
          我们的回忆
        </h2>
        <p className="text-starlight-blue/60 mt-3 text-sm tracking-widest">
          找找彩蛋吧
        </p>
      </motion.div>

      {/* Masonry grid */}
      <div className="max-w-5xl mx-auto columns-1 sm:columns-2 lg:columns-3">
        {shuffledPhotos.map((photo, i) => (
          <div key={i} className="break-inside-avoid flex justify-center mb-6">
            <PolaroidCard photo={photo} index={i} total={shuffledPhotos.length} />
          </div>
        ))}
      </div>

      {/* Progress-indicator line */}
      <motion.div
        className="fixed bottom-0 left-0 h-0.5 bg-gradient-to-r from-starlight-gold/50 to-warm-pink/50 z-40"
        style={{ width: `${(progress * 100).toFixed(1)}%` }}
      />
    </section>
  );
}
