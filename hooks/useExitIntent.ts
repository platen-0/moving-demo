'use client';

import { useEffect, useRef } from 'react';

export function useExitIntent(callback: () => void, enabled: boolean = true) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) {
        callbackRef.current();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        callbackRef.current();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);
}
