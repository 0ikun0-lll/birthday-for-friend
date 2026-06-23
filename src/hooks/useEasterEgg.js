import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY_PREFIX = 'birthday_easter_egg_';

/**
 * Manages easter egg discovery state with localStorage persistence.
 *
 * @param {string} eggId - unique identifier for this easter egg
 * @returns {{ discovered: boolean, markDiscovered: () => void, reset: () => void }}
 */
export function useEasterEgg(eggId) {
  const key = STORAGE_KEY_PREFIX + eggId;

  const [discovered, setDiscovered] = useState(() => {
    try {
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  });

  const markDiscovered = useCallback(() => {
    setDiscovered(true);
    try {
      localStorage.setItem(key, 'true');
    } catch {
      // localStorage unavailable — ignore
    }
  }, [key]);

  const reset = useCallback(() => {
    setDiscovered(false);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key]);

  return { discovered, markDiscovered, reset };
}

/**
 * Hook that fires a callback once when all conditions are met.
 * Resets when resetDeps change.
 */
export function useConditionalTrigger(condition, callback, resetDeps = []) {
  const triggeredRef = useState(() => new Set())[0];

  useEffect(() => {
    triggeredRef.clear();
  }, resetDeps);

  useEffect(() => {
    if (condition && !triggeredRef.has('fired')) {
      triggeredRef.add('fired');
      callback();
    }
  }, [condition, callback]);
}
