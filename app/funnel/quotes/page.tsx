'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import { MOCK_MOVERS } from '@/lib/constants';
import type { Mover } from '@/types';

// Generate quote ranges for movers based on the user's estimate range
function generateMoverQuotes(movers: Mover[], estimateMin: number, estimateMax: number): Mover[] {
  return movers.map((mover, index) => {
    const rangeSpan = estimateMax - estimateMin;
    const variationFactors = [
      { minOffset: 0.0, maxOffset: 0.3 },
      { minOffset: 0.2, maxOffset: 0.5 },
      { minOffset: 0.1, maxOffset: 0.4 },
      { minOffset: 0.15, maxOffset: 0.45 },
    ];
    const factor = variationFactors[index] || variationFactors[3];
    const quoteMin = Math.round(estimateMin + rangeSpan * factor.minOffset);
    const quoteMax = Math.round(estimateMin + rangeSpan * factor.maxOffset);
    return {
      ...mover,
      quoteRange: {
        min: Math.max(estimateMin, quoteMin),
        max: Math.min(estimateMax, quoteMax),
      },
    };
  });
}

function MoverCard({
  mover,
  isSelected,
  onToggle,
  rank,
}: {
  mover: Mover;
  isSelected: boolean;
  onToggle: () => void;
  rank: number;
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-2 ring-primary/20'
          : 'border-border bg-white hover:border-primary/40 hover:shadow-md'
      }`}
    >
      {/* Best Match Banner */}
      {rank === 1 && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 text-center">
          <span className="text-sm font-semibold flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Best Match for Your Move
          </span>
        </div>
      )}

      <div className="p-6 lg:p-8">
        {/* Header: Logo + Company Info + Quote */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-20 lg:w-40 lg:h-24 relative bg-white rounded-xl border border-border p-2 flex items-center justify-center">
              <Image
                src={mover.logo}
                alt={`${mover.name} logo`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-1">{mover.name}</h3>
                <p className="text-base text-muted-foreground">{mover.specialty}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(mover.rating) ? 'text-amber-400' : 'text-gray-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-semibold text-amber-700">{mover.rating}</span>
                <span className="text-sm text-amber-600">({mover.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>

            {/* Credentials Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mover.credentials.map((cred, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted/80 text-muted-foreground"
                >
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {cred}
                </span>
              ))}
              {mover.availableOnDate && (
                <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Available for your date
                </span>
              )}
            </div>

            {/* Match Reasons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mover.matchReasons.slice(0, 4).map((reason, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote & Select - Right side on desktop */}
          <div className="flex-shrink-0 lg:text-right lg:min-w-[180px]">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Estimated Quote</p>
              <p className="text-3xl lg:text-4xl font-serif text-primary font-semibold">
                ${mover.quoteRange.min.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                to ${mover.quoteRange.max.toLocaleString()}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className={`w-full px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {isSelected ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Selected
                  </span>
                ) : (
                  'Select'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuotesPage() {
  const router = useRouter();
  const { state, toggleMover, completeStep, reset } = useMove();
  const [mounted, setMounted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setMounted(true);
    completeStep('quotes');
  }, [completeStep]);

  const moversWithQuotes = useMemo(() => {
    const estimateMin = state.estimate?.costRange.min || 2000;
    const estimateMax = state.estimate?.costRange.max || 4000;
    return generateMoverQuotes(MOCK_MOVERS, estimateMin, estimateMax);
  }, [state.estimate?.costRange.min, state.estimate?.costRange.max]);

  const sortedMovers = [...moversWithQuotes].sort((a, b) => b.matchScore - a.matchScore);

  const handleRequestQuotes = () => {
    setShowConfirmation(true);
  };

  const handleStartOver = () => {
    reset();
    router.push('/');
  };

  if (showConfirmation) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-3">
            You&apos;re all set!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {state.selectedMovers.length} mover{state.selectedMovers.length !== 1 ? 's' : ''} will contact you soon with detailed quotes.
          </p>
          <div className="p-4 rounded-xl bg-muted/50 mb-6 text-left">
            <p className="text-sm text-muted-foreground mb-2">What happens next:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                Movers review your move plan
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                You&apos;ll receive quotes within 24 hours
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                Compare and book when you&apos;re ready
              </li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Check your email at <strong>{state.contactInfo?.email}</strong> for confirmation
          </p>
          <Button onClick={handleStartOver} variant="outline">
            Plan Another Move
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className={`text-center mb-10 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-base font-medium text-primary mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {sortedMovers.length} Movers Ready to Compete
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
            Your Matched Movers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These top-rated movers are ready to give you their best price. Select which ones you&apos;d like quotes from.
          </p>
        </div>

        {/* Estimate Banner */}
        <div className={`mb-8 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 flex items-center justify-between ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your estimated range</p>
              <p className="text-lg font-semibold text-primary">
                ${state.estimate?.costRange.min.toLocaleString()} - ${state.estimate?.costRange.max.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            All quotes below fall within this range
          </p>
        </div>

        {/* Mover Cards */}
        <div className={`space-y-6 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
          {sortedMovers.map((mover, index) => (
            <MoverCard
              key={mover.id}
              mover={mover}
              isSelected={state.selectedMovers.includes(mover.id)}
              onToggle={() => toggleMover(mover.id)}
              rank={index + 1}
            />
          ))}
        </div>

        {/* Select All / Recommendation */}
        <div className={`mt-8 flex items-center justify-between ${mounted ? 'fade-in-up stagger-2' : 'opacity-0'}`}>
          <button
            onClick={() => {
              const allSelected = sortedMovers.every((m) => state.selectedMovers.includes(m.id));
              if (allSelected) {
                sortedMovers.forEach((m) => {
                  if (state.selectedMovers.includes(m.id)) {
                    toggleMover(m.id);
                  }
                });
              } else {
                sortedMovers.forEach((m) => {
                  if (!state.selectedMovers.includes(m.id)) {
                    toggleMover(m.id);
                  }
                });
              }
            }}
            className="text-base text-primary font-medium hover:underline"
          >
            {sortedMovers.every((m) => state.selectedMovers.includes(m.id))
              ? 'Deselect all'
              : 'Select all movers'}
          </button>
          <p className="text-base text-muted-foreground flex items-center gap-2">
            <span className="text-lg">💡</span>
            Pro tip: More quotes = better deals
          </p>
        </div>

        {/* Floating Summary Bar */}
        {state.selectedMovers.length > 0 && (
          <div className={`mt-10 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-white to-primary/10 border border-primary/20 shadow-lg ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xl font-semibold text-foreground">
                  {state.selectedMovers.length} mover{state.selectedMovers.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-muted-foreground">
                  They&apos;ll compete to give you their best price
                </p>
              </div>
              <Button onClick={handleRequestQuotes} className="btn-primary px-8 py-4 text-lg">
                Request Quotes
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer (only if no movers selected) */}
      {state.selectedMovers.length === 0 && (
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-5 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => router.push('/funnel/contact')}
              className="text-muted-foreground hover:text-foreground transition-colors text-lg"
            >
              Back
            </button>
            <p className="text-base text-muted-foreground">
              Select at least one mover to continue
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
