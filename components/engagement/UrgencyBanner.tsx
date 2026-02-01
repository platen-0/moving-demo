'use client';

import { useMove } from '@/context/MoveContext';
import { getSeasonalBanner } from '@/lib/constants';

interface UrgencyBannerProps {
  currentStep: string;
}

export function UrgencyBanner({ currentStep }: UrgencyBannerProps) {
  const { state } = useMove();

  // Show urgency banner on summary and contact steps
  if (!['summary', 'contact'].includes(currentStep)) return null;

  const seasonal = getSeasonalBanner();

  // If user selected a date, show date-specific urgency
  if (state.basics.moveDate) {
    const moveDate = new Date(state.basics.moveDate);
    const now = new Date();
    const daysUntilMove = Math.ceil((moveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilMove < 14) {
      return (
        <div className="bg-red-50 border-b border-red-100 px-4 py-2 text-center">
          <p className="text-xs text-red-700 font-medium">
            Your move date is in {daysUntilMove} days — Book soon to secure your preferred movers
          </p>
        </div>
      );
    }

    if (daysUntilMove < 30) {
      return (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-center">
          <p className="text-xs text-amber-700">
            Your move date is in {daysUntilMove} days — Most movers book 2-4 weeks in advance
          </p>
        </div>
      );
    }
  }

  // Fall back to seasonal banner
  if (seasonal) {
    return (
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-center">
        <p className="text-xs text-amber-700">
          <span className="mr-1">{seasonal.icon}</span>
          {seasonal.message}
        </p>
      </div>
    );
  }

  return null;
}
