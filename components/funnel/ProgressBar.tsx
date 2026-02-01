'use client';

import { STEP_CONFIG } from '@/lib/constants';

interface ProgressBarProps {
  currentStep: string;
  progress: number;
}

const STEP_ORDER = ['basics', 'inventory', 'special-items', 'services', 'summary', 'contact', 'quotes'];

export function ProgressBar({ currentStep, progress }: ProgressBarProps) {
  const stepInfo = STEP_CONFIG[currentStep];
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  if (!stepInfo || currentIndex < 0) return null;

  return (
    <div className="w-full bg-white border-b border-border px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Step indicator */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white text-lg">🚚</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Step {currentIndex + 1} of {STEP_ORDER.length}
                </span>
                <h3 className="text-sm font-semibold text-foreground -mt-0.5">
                  {stepInfo.label}
                </h3>
              </div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif text-primary">
              {progress}%
            </span>
            <span className="text-xs text-muted-foreground">complete</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track h-2">
          <div
            className="progress-fill h-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between mt-3">
          {STEP_ORDER.map((step, index) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                index <= currentIndex ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index < currentIndex
                    ? 'bg-primary'
                    : index === currentIndex
                    ? 'bg-primary scale-125 ring-4 ring-primary/20'
                    : 'bg-border'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
