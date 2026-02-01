'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ProgressBar } from '@/components/funnel/ProgressBar';
import { ExitIntentModal } from '@/components/engagement/ExitIntentModal';
import { UrgencyBanner } from '@/components/engagement/UrgencyBanner';
import { ChatAssistant } from '@/components/engagement/ChatAssistant';
import { useExitIntent } from '@/hooks/useExitIntent';
import { useMove } from '@/context/MoveContext';
import { STEP_CONFIG } from '@/lib/constants';

function getStepFromPath(pathname: string): string {
  // Extract step name from path like /funnel/basics, /funnel/inventory, etc.
  const parts = pathname.split('/');
  const step = parts[parts.length - 1];
  return step || 'basics';
}

function getStepProgress(step: string): number {
  return STEP_CONFIG[step]?.progress || 0;
}

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = getStepFromPath(pathname);
  const progress = getStepProgress(currentStep);
  const { state, setExitIntentShown, setEmailCaptured } = useMove();
  const [showExitModal, setShowExitModal] = useState(false);

  // Show exit intent after basics step (when they've invested time)
  const shouldShowExitIntent = !state.exitIntentShown &&
    currentStep !== 'basics' &&
    currentStep !== 'quotes';

  const handleExitIntent = useCallback(() => {
    if (shouldShowExitIntent) {
      setShowExitModal(true);
      setExitIntentShown();
    }
  }, [shouldShowExitIntent, setExitIntentShown]);

  useExitIntent(handleExitIntent, shouldShowExitIntent);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-subtle-pattern pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <ProgressBar currentStep={currentStep} progress={progress} />
        <UrgencyBanner currentStep={currentStep} />
        <main className="flex-1 flex flex-col">{children}</main>
        <ChatAssistant />
        <ExitIntentModal
          open={showExitModal}
          onClose={() => setShowExitModal(false)}
          currentStep={currentStep}
          onSaveProgress={(email) => {
            setEmailCaptured(email);
            setShowExitModal(false);
          }}
          onContinue={() => setShowExitModal(false)}
        />
      </div>
    </div>
  );
}
