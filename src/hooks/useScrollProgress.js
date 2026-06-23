import { useState, useEffect } from 'react';

/**
 * Tracks scroll progress as a value between 0 and 1.
 * @returns {{ progress: number, scrollY: number }}
 */
export function useScrollProgress() {
  const [state, setState] = useState({ progress: 0, scrollY: 0 });

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      setState({ progress, scrollY });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return state;
}
