import { useState, useCallback } from 'react';

/**
 * Manages easter egg discovery state.
 * State resets on page reload — every visit is a fresh chance to discover eggs.
 *
 * @param {string} eggId - unique identifier for this easter egg
 * @returns {{ discovered: boolean, markDiscovered: () => void, reset: () => void }}
 */
export function useEasterEgg(eggId) {
  const [discovered, setDiscovered] = useState(false);

  const markDiscovered = useCallback(() => {
    setDiscovered(true);
  }, []);

  const reset = useCallback(() => {
    setDiscovered(false);
  }, []);

  return { discovered, markDiscovered, reset };
}
