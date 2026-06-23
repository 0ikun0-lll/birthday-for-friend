import { useRef, useCallback } from 'react';

/**
 * Detects long press / long touch on an element.
 *
 * @param {Function} onLongPress - callback when long press threshold is reached
 * @param {number} ms - threshold in milliseconds (default 3000)
 * @returns {{ handlers: { onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd },
 *             wasLongPress: React.RefObject<boolean> }}
 */
export function useLongPress(onLongPress, ms = 3000) {
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);
  const wasLongPressRef = useRef(false);
  const onLongPressRef = useRef(onLongPress);
  onLongPressRef.current = onLongPress;

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    isLongPressRef.current = false;
    wasLongPressRef.current = false;
    clear();
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      wasLongPressRef.current = true;
      onLongPressRef.current();
    }, ms);
  }, [clear, ms]);

  const stop = useCallback(() => {
    clear();
  }, [clear]);

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: stop,
    },
    wasLongPress: wasLongPressRef,
  };
}
