'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export type ConfettiType = 'room-complete' | 'plan-complete' | 'milestone';

interface CelebrationConfettiProps {
  trigger: boolean;
  type?: ConfettiType;
  onComplete?: () => void;
}

const confettiConfigs: Record<ConfettiType, () => void> = {
  'room-complete': () => {
    // Brief, satisfying burst for room completion
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#16a34a', '#15803d', '#fbbf24', '#f59e0b'],
      ticks: 150,
      gravity: 1.2,
      scalar: 0.9,
    });
  },
  'plan-complete': () => {
    // Major celebration for completing the move plan
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const colors = ['#22c55e', '#16a34a', '#15803d', '#fbbf24', '#f59e0b', '#3b82f6'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    });

    // Continuous side streams
    frame();
  },
  'milestone': () => {
    // Medium celebration for milestones (achievements, streaks)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#22c55e', '#16a34a', '#fbbf24', '#f59e0b'],
      ticks: 200,
    });
  },
};

export function CelebrationConfetti({ trigger, type = 'room-complete', onComplete }: CelebrationConfettiProps) {
  const hasTriggered = useRef(false);

  const fireConfetti = useCallback(() => {
    const config = confettiConfigs[type];
    if (config) {
      config();
      // Call onComplete after animation
      if (onComplete) {
        const delay = type === 'plan-complete' ? 2500 : 500;
        setTimeout(onComplete, delay);
      }
    }
  }, [type, onComplete]);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;
      fireConfetti();
    }
    // Reset when trigger becomes false
    if (!trigger) {
      hasTriggered.current = false;
    }
  }, [trigger, fireConfetti]);

  // This component doesn't render anything - confetti is added to the page directly
  return null;
}

// Hook for imperative confetti triggering
export function useConfetti() {
  const fire = useCallback((type: ConfettiType = 'room-complete') => {
    const config = confettiConfigs[type];
    if (config) {
      config();
    }
  }, []);

  return { fire };
}
