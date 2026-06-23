import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Fixed-position music toggle button.
 * Renders in the bottom-right corner with a spinning animation when playing.
 * Defaults to muted. Reads from public/music/bg-music.mp3.
 */
export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/music/bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (playing) {
        audio.pause();
      } else {
        // On first play, handle autoplay restrictions
        if (audio.readyState === 0) {
          await audio.play().catch(() => {
            // Autoplay blocked — set a flag for user to click again
          });
        } else {
          await audio.play();
        }
      }
      setPlaying(!audio.paused);
    } catch {
      // If autoplay blocked, we simply toggle the visual state
      // The user will need to interact again
    }
  };

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
                 bg-white/10 backdrop-blur-md border border-white/20
                 flex items-center justify-center
                 hover:bg-white/20 transition-colors
                 shadow-lg shadow-black/20"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={playing ? '暂停音乐' : '播放音乐'}
      aria-label={playing ? '暂停音乐' : '播放音乐'}
    >
      <motion.span
        animate={{ rotate: playing ? 360 : 0 }}
        transition={{
          rotate: playing
            ? { repeat: Infinity, duration: 8, ease: 'linear' }
            : { duration: 0.3 },
        }}
        className="text-xl"
      >
        {playing ? '🎵' : '🔇'}
      </motion.span>
    </motion.button>
  );
}
