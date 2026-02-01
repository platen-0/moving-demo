'use client';

import { useEffect, useState } from 'react';
import { TICKER_NAMES, TICKER_CITIES, TICKER_DESTINATIONS } from '@/lib/constants';
import { useConfetti } from '@/components/gamification/CelebrationConfetti';

interface HeroSectionProps {
  onCtaClick: () => void;
}

// Home size options for savings calculator
const HOME_SIZES = [
  { label: 'Studio', value: 'studio', savings: { min: 150, max: 300 } },
  { label: '1BR', value: '1br', savings: { min: 250, max: 450 } },
  { label: '2BR', value: '2br', savings: { min: 340, max: 580 } },
  { label: '3BR', value: '3br', savings: { min: 450, max: 750 } },
  { label: '4BR+', value: '4br+', savings: { min: 600, max: 1000 } },
];

// Distance options
const DISTANCE_OPTIONS = [
  { label: 'Local', value: 'local', multiplier: 1 },
  { label: '100-500mi', value: 'medium', multiplier: 1.3 },
  { label: '500+ mi', value: 'long', multiplier: 1.6 },
];

// Cost ranges for interactive preview
const COST_PREVIEW: Record<string, { min: number; max: number }> = {
  studio: { min: 400, max: 900 },
  '1br': { min: 800, max: 1500 },
  '2br': { min: 1200, max: 2500 },
  '3br': { min: 2000, max: 4000 },
  '4br+': { min: 3500, max: 7000 },
};

function generateMovingTickerMessage(): string {
  const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
  const fromCity = TICKER_CITIES[Math.floor(Math.random() * TICKER_CITIES.length)];
  let toCity = TICKER_DESTINATIONS[Math.floor(Math.random() * TICKER_DESTINATIONS.length)];
  while (toCity === fromCity) {
    toCity = TICKER_DESTINATIONS[Math.floor(Math.random() * TICKER_DESTINATIONS.length)];
  }

  const savings = 200 + Math.floor(Math.random() * 800);
  const movers = 3 + Math.floor(Math.random() * 3);

  const templates = [
    `${name} in ${fromCity} saved $${savings} when ${movers} movers competed for their ${toCity} move`,
    `${name}'s ${fromCity} to ${toCity} move: ${movers} quotes ranged $${1800 + Math.floor(Math.random() * 1000)}-$${3000 + Math.floor(Math.random() * 1200)}`,
    `${name} got their move report AND saved $${savings} vs. calling around`,
    `A family in ${fromCity} just had ${movers} movers compete for their move`,
    `${name} saved ${4 + Math.floor(Math.random() * 4)} hours by getting all quotes in one place`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function getTodayMoveCount(): string {
  const baseCount = 180 + Math.floor(Math.random() * 60);
  return baseCount.toLocaleString();
}

// Animated truck component - static image that drives across the screen
function AnimatedTruck() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Truck animation - drives across screen */}
      <div
        className="absolute top-[12%] sm:top-[15%] left-0"
        style={{
          animation: 'truck-drive 4s ease-out forwards',
        }}
      >
        {imageError ? (
          // Fallback: styled emoji truck if image not found
          <div className="flex items-center">
            <span className="text-4xl sm:text-5xl md:text-6xl">🚚</span>
            <span className="text-xl opacity-60 ml-1">💨</span>
          </div>
        ) : (
          // Static truck image that animates across
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/moving-asset-no-bg.png"
            alt="Moving truck"
            className="h-28 sm:h-36 md:h-44 w-auto object-contain"
            style={{
              filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.2))',
            }}
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </div>
  );
}

// Quick Savings Calculator Component
function SavingsCalculator({ onComplete }: { onComplete: (savings: { min: number; max: number }) => void }) {
  const [step, setStep] = useState(0);
  const [homeSize, setHomeSize] = useState<string | null>(null);
  const { fire: fireConfetti } = useConfetti();

  const handleHomeSizeSelect = (size: string) => {
    setHomeSize(size);
    setStep(1);
  };

  const handleDistanceSelect = (dist: string) => {
    fireConfetti('milestone');

    // Calculate savings
    const sizeOption = HOME_SIZES.find(h => h.value === homeSize);
    const distOption = DISTANCE_OPTIONS.find(d => d.value === dist);
    if (sizeOption && distOption) {
      const savings = {
        min: Math.round(sizeOption.savings.min * distOption.multiplier),
        max: Math.round(sizeOption.savings.max * distOption.multiplier),
      };
      onComplete(savings);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border-2 border-border shadow-lg">
      <div className="text-center mb-5">
        <p className="text-lg font-semibold text-foreground">
          {step === 0 ? "What size home?" : "How far are you moving?"}
        </p>
        <p className="text-sm text-muted-foreground">
          {step === 0 ? "Quick 2-question savings estimate" : "Almost done!"}
        </p>
      </div>

      {step === 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {HOME_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => handleHomeSizeSelect(size.value)}
              className="px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all font-medium"
            >
              {size.label}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {DISTANCE_OPTIONS.map((dist) => (
            <button
              key={dist.value}
              onClick={() => handleDistanceSelect(dist.value)}
              className="px-4 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all font-medium"
            >
              {dist.label}
            </button>
          ))}
        </div>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4">
        <div className={`w-2 h-2 rounded-full transition-colors ${step >= 0 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
      </div>
    </div>
  );
}

// Interactive Cost Preview on hover
function InteractiveCostPreview({ onCtaClick }: { onCtaClick: () => void }) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);

  return (
    <div className="p-5 rounded-xl bg-muted/50 border border-border">
      <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
        Hover for instant estimate <span className="text-xs">(local moves &lt;100mi)</span>
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {HOME_SIZES.map((size) => (
          <button
            key={size.value}
            onMouseEnter={() => setHoveredSize(size.value)}
            onMouseLeave={() => setHoveredSize(null)}
            onClick={onCtaClick}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              hoveredSize === size.value
                ? 'bg-primary text-white scale-105'
                : 'bg-white border border-border hover:border-primary'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
      <div className="h-12 flex items-center justify-center">
        {hoveredSize && COST_PREVIEW[hoveredSize] ? (
          <div className="text-center fade-in-up">
            <p className="text-lg font-semibold text-primary">
              ${COST_PREVIEW[hoveredSize].min.toLocaleString()} - ${COST_PREVIEW[hoveredSize].max.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">estimated range</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Select a size to see estimate</p>
        )}
      </div>
    </div>
  );
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const [tickerMessage, setTickerMessage] = useState('');
  const [todayCount, setTodayCount] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorResult, setCalculatorResult] = useState<{ min: number; max: number } | null>(null);
  const [showTruckAnimation, setShowTruckAnimation] = useState(true);

  useEffect(() => {
    setTickerMessage(generateMovingTickerMessage());
    setTodayCount(getTodayMoveCount());
    setFadeIn(true);
    setMounted(true);

    // Hide truck animation after it completes
    const truckTimer = setTimeout(() => setShowTruckAnimation(false), 4000);

    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setTickerMessage(generateMovingTickerMessage());
        setFadeIn(true);
      }, 300);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(truckTimer);
    };
  }, []);

  const handleCalculatorComplete = (savings: { min: number; max: number }) => {
    setCalculatorResult(savings);
  };

  return (
    <section className="relative overflow-hidden bg-subtle-pattern">
      {/* Animated truck on load */}
      {showTruckAnimation && <AnimatedTruck />}

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />

      <div className="relative w-full max-w-7xl mx-auto px-8 py-4 lg:py-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Trust badges row */}
          <div className={`flex flex-wrap items-center justify-center gap-3 mb-8 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="trust-badge">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified Movers
            </div>
            <div className="trust-badge-navy">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Keep Your Plan Forever
            </div>
            <div className="trust-badge-gold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Takes 4 Minutes
            </div>
          </div>

          {/* Main headline */}
          <h1 className={`font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
            <span className="text-foreground">Stop calling movers</span>
            <br className="hidden sm:block" />
            <span className="text-foreground">one by one.</span>
            <br />
            <span className="text-primary">Let them compete.</span>
          </h1>

          {/* Subheadline */}
          <p className={`text-xl sm:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed ${mounted ? 'fade-in-up stagger-2' : 'opacity-0'}`}>
            Plan your move in minutes. Get quotes from top-rated movers &mdash;
            <br className="hidden sm:block" />
            and <span className="text-foreground font-semibold">keep your move plan forever</span>, whether you book or not.
          </p>

          {/* Savings Calculator OR CTA */}
          <div className={`max-w-md mx-auto ${mounted ? 'fade-in-up stagger-3' : 'opacity-0'}`}>
            {!showCalculator && !calculatorResult && (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={onCtaClick}
                  className="btn-primary btn-primary-lg group"
                >
                  <span>Start My Move Plan</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="text-base text-primary hover:underline flex items-center gap-1.5 font-medium"
                >
                  <span>💰</span> How much could I save? (2 questions)
                </button>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  Free move plan you keep forever&nbsp;&bull;&nbsp;Top movers compete&nbsp;&bull;&nbsp;No obligation
                </p>
              </div>
            )}

            {showCalculator && !calculatorResult && (
              <div className="space-y-4">
                <SavingsCalculator onComplete={handleCalculatorComplete} />
                <button
                  onClick={() => setShowCalculator(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Skip to move plan
                </button>
              </div>
            )}

            {calculatorResult && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-primary/10 border-2 border-primary">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-3">
                      <span>✨</span> Your Potential Savings
                    </div>
                    <div className="text-4xl font-serif text-primary mb-2">
                      ${calculatorResult.min} - ${calculatorResult.max}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      by having movers compete for your business
                    </p>
                  </div>
                </div>
                <button
                  onClick={onCtaClick}
                  className="btn-primary btn-primary-lg group w-full"
                >
                  <span>Let&apos;s Get Started!</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Cost Preview */}
          <div className={`mt-8 max-w-sm mx-auto ${mounted ? 'fade-in-up stagger-4' : 'opacity-0'}`}>
            <InteractiveCostPreview onCtaClick={onCtaClick} />
          </div>

          {/* Social proof ticker */}
          <div className={`mt-10 ${mounted ? 'fade-in-up stagger-5' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-border shadow-sm">
              {/* Live indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16a34a]" />
                </span>
                <span className="text-sm font-medium text-[#16a34a]">Live</span>
              </div>

              <div className="w-px h-5 bg-border" />

              {/* Ticker message */}
              <p className={`text-sm text-muted-foreground transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                {tickerMessage}
              </p>
            </div>

            {todayCount && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="text-primary font-semibold">{todayCount}</span> moves planned this week &bull; $400 average savings
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
