'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import { useConfetti } from '@/components/gamification/CelebrationConfetti';
import type { AdditionalService } from '@/types';

// Service level configurations
interface ServiceLevel {
  name: string;
  icon: string;
  description: string;
  stressLevel: number;
  timeHours: number;
  features: string[];
  notIncluded: string[];
  popular?: boolean;
  recommended?: boolean;
}

const SERVICE_LEVELS: Record<string, ServiceLevel> = {
  diy: {
    name: 'DIY Move',
    icon: '🏋️',
    description: 'You pack, we move',
    stressLevel: 85,
    timeHours: 20,
    features: ['Loading & unloading', 'Transport only', 'Basic protection'],
    notIncluded: ['Packing materials', 'Packing labor', 'Unpacking'],
  },
  partial: {
    name: 'Partial Service',
    icon: '🤝',
    description: 'We pack fragiles, you pack the rest',
    stressLevel: 50,
    timeHours: 10,
    popular: true,
    features: ['Fragile item packing', 'Loading & unloading', 'Basic unpacking'],
    notIncluded: ['Full packing', 'Complete unpacking'],
  },
  full: {
    name: 'Full Service',
    icon: '✨',
    description: 'We handle everything',
    stressLevel: 15,
    timeHours: 2,
    recommended: true,
    features: ['Complete packing', 'All materials included', 'Full unpacking', 'Debris removal'],
    notIncluded: [],
  },
};

// Stress meter component
function StressMeter({ level, label }: { level: number; label: string }) {
  const getColor = (level: number) => {
    if (level <= 30) return 'bg-emerald-500';
    if (level <= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getEmoji = (level: number) => {
    if (level <= 30) return '😌';
    if (level <= 60) return '😐';
    return '😰';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span>{getEmoji(level)}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(level)}`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

// Time saved calculator
function TimeSavedBadge({ hours }: { hours: number }) {
  if (hours <= 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
      <span>⏰</span>
      <span>Get {hours}+ hours back</span>
    </div>
  );
}

// Popular service IDs
const POPULAR_SERVICES = ['packing', 'storage'];
const RECOMMENDED_SERVICES = ['packing'];

function ServiceCard({
  service,
  onToggle,
  onToggleSubOption,
}: {
  service: AdditionalService;
  onToggle: () => void;
  onToggleSubOption?: (subOptionId: string) => void;
}) {
  const isPopular = POPULAR_SERVICES.includes(service.id);
  const isRecommended = RECOMMENDED_SERVICES.includes(service.id);

  return (
    <div
      className={`relative p-5 rounded-xl border-2 transition-all ${
        service.selected
          ? isRecommended
            ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg shadow-emerald-100'
            : 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Popular badge */}
      {isPopular && !service.selected && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
          ⭐ Most Popular
        </div>
      )}

      {/* Recommended badge */}
      {isRecommended && service.selected && (
        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
          ✓ Great Choice!
        </div>
      )}

      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            service.selected
              ? 'border-primary bg-primary'
              : 'border-border'
          }`}
        >
          {service.selected && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <button onClick={onToggle} className="text-left w-full">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{service.name}</span>
                  {isPopular && (
                    <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                      85% choose this
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{service.description}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-primary">
                  ${service.priceRange.min} - ${service.priceRange.max}
                </div>
              </div>
            </div>
          </button>

          {/* Sub-options */}
          {service.selected && service.subOptions && service.subOptions.length > 0 && (
            <div className="mt-4 pl-2 space-y-2 border-l-2 border-primary/20">
              {service.subOptions.map((subOption) => (
                <button
                  key={subOption.id}
                  onClick={() => onToggleSubOption?.(subOption.id)}
                  className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-muted/50"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      subOption.selected
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}
                  >
                    {subOption.selected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="flex-1 text-sm">{subOption.label}</span>
                  <span className="text-sm text-muted-foreground">
                    ${subOption.priceRange.min} - ${subOption.priceRange.max}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const router = useRouter();
  const { state, toggleService, toggleServiceSuboption, completeStep } = useMove();
  const [mounted, setMounted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'diy' | 'partial' | 'full' | null>(null);
  const { fire: fireConfetti } = useConfetti();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate stress level based on selected services
  const stressReduction = useMemo(() => {
    const hasPackingService = state.services.find(s => s.id === 'packing')?.selected;
    const hasUnpackingService = state.services.find(s => s.id === 'unpacking')?.selected;
    const hasCleaningService = state.services.find(s => s.id === 'cleaning')?.selected;

    let reduction = 0;
    if (hasPackingService) reduction += 35;
    if (hasUnpackingService) reduction += 20;
    if (hasCleaningService) reduction += 15;

    return Math.min(reduction, 70);
  }, [state.services]);

  // Calculate time saved
  const timeSaved = useMemo(() => {
    let hours = 0;
    state.services.forEach(s => {
      if (s.selected) {
        if (s.id === 'packing') hours += 12;
        if (s.id === 'unpacking') hours += 6;
        if (s.id === 'cleaning') hours += 4;
        if (s.id === 'disassembly') hours += 3;
      }
    });
    return hours;
  }, [state.services]);

  // Handle service level selection
  const handleLevelSelect = useCallback((level: 'diy' | 'partial' | 'full') => {
    setSelectedLevel(level);

    // Auto-select relevant services based on level
    const packingService = state.services.find(s => s.id === 'packing');
    const unpackingService = state.services.find(s => s.id === 'unpacking');

    if (level === 'full') {
      if (packingService && !packingService.selected) toggleService('packing');
      if (unpackingService && !unpackingService.selected) toggleService('unpacking');
      fireConfetti('milestone');
    } else if (level === 'partial') {
      if (packingService && !packingService.selected) toggleService('packing');
      if (unpackingService && unpackingService.selected) toggleService('unpacking');
    } else {
      // DIY - deselect packing services
      if (packingService && packingService.selected) toggleService('packing');
      if (unpackingService && unpackingService.selected) toggleService('unpacking');
    }
  }, [state.services, toggleService, fireConfetti]);

  const selectedServices = state.services.filter((s) => s.selected);
  const serviceCost = useMemo(() => {
    let total = 0;
    selectedServices.forEach((service) => {
      if (service.subOptions?.some((sub) => sub.selected)) {
        // Use sub-option pricing
        service.subOptions.forEach((sub) => {
          if (sub.selected) {
            total += (sub.priceRange.min + sub.priceRange.max) / 2;
          }
        });
      } else {
        total += (service.priceRange.min + service.priceRange.max) / 2;
      }
    });
    return total;
  }, [selectedServices]);

  // Calculate special items cost
  const specialItemsCost = useMemo(() => {
    return state.specialItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + ((item.priceRange.min + item.priceRange.max) / 2) * item.quantity, 0);
  }, [state.specialItems]);

  // Calculate estimated cost including services
  const estimatedCost = useMemo(() => {
    const baseCost = 800;
    const perRoomCost = 350 * state.rooms.length;
    const furnitureCost = state.rooms.reduce((sum, room) => {
      return sum + room.furniture.reduce((roomSum, item) => roomSum + item.weight * 0.5 * item.count, 0);
    }, 0);
    const distanceCost = state.basics.routeInfo?.distance ? state.basics.routeInfo.distance * 2.5 : 0;
    const min = Math.round((baseCost + perRoomCost + furnitureCost + specialItemsCost + serviceCost + distanceCost) * 0.8);
    const max = Math.round((baseCost + perRoomCost + furnitureCost + specialItemsCost + serviceCost + distanceCost) * 1.3);
    return { min, max };
  }, [state.rooms, state.basics.routeInfo, specialItemsCost, serviceCost]);

  const moverCount = useMemo(() => {
    let count = 6;
    const distance = state.basics.routeInfo?.distance || 0;
    if (distance > 100) count -= 1;
    if (distance > 500) count -= 1;
    return Math.max(3, count);
  }, [state.basics.routeInfo]);

  const handleContinue = () => {
    completeStep('services');
    router.push('/funnel/summary');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Running Quote Banner */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-[#15803d] text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base">Estimated Cost:</span>
              <span className="text-2xl font-bold">
                ${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-base">{moverCount}+ movers ready to compete</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-8 lg:py-12">
        {/* Header */}
        <div className={`text-center mb-10 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
            Additional services
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground">
            Select any services you&apos;d like included in your quotes
          </p>
        </div>

        {/* Service Level Comparison */}
        <div className={`mb-8 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Choose your service level</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {Object.entries(SERVICE_LEVELS).map(([key, level]) => (
              <button
                key={key}
                onClick={() => handleLevelSelect(key as 'diy' | 'partial' | 'full')}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  selectedLevel === key
                    ? level.recommended
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                      : 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {level.recommended && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                    ✨ Recommended
                  </div>
                )}
                {level.popular && !level.recommended && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                    ⭐ Popular
                  </div>
                )}
                <div className="text-center mb-3">
                  <span className="text-3xl">{level.icon}</span>
                  <h3 className="font-semibold text-foreground mt-2">{level.name}</h3>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
                <div className="space-y-3">
                  <StressMeter level={level.stressLevel} label="Your stress level" />
                  <div className="text-center">
                    <TimeSavedBadge hours={20 - level.timeHours} />
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {level.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-emerald-700">
                      <span>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Reduction Indicator */}
        {stressReduction > 0 && (
          <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">😌</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-emerald-900">Stress reduced by {stressReduction}%</span>
                  {timeSaved > 0 && <TimeSavedBadge hours={timeSaved} />}
                </div>
                <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${stressReduction}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className={`space-y-4 ${mounted ? 'fade-in-up stagger-2' : 'opacity-0'}`}>
          {state.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onToggle={() => toggleService(service.id)}
              onToggleSubOption={(subId) => toggleServiceSuboption(service.id, subId)}
            />
          ))}
        </div>

        {/* Cost Summary with Bundle Discount */}
        {selectedServices.length > 0 && (
          <div className={`mt-8 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/20 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Added to your quote requests
                </p>
                {/* Bundle discount indicator */}
                {selectedServices.length >= 2 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    <span>🎁</span>
                    <span>Bundle discount applied! (Save 10%)</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                {selectedServices.length >= 2 && (
                  <div className="text-sm text-muted-foreground line-through">
                    ~${Math.round(serviceCost * 1.1).toLocaleString()}
                  </div>
                )}
                <div className="text-2xl font-serif text-primary">
                  ~${Math.round(serviceCost).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">estimated addition</div>
              </div>
            </div>
          </div>
        )}

        {/* Skip option */}
        <div className={`mt-6 text-center ${mounted ? 'fade-in-up stagger-3' : 'opacity-0'}`}>
          <p className="text-sm text-muted-foreground">
            Just need the move?{' '}
            <button
              onClick={() => {
                // Deselect all services and continue
                state.services.forEach((s) => {
                  if (s.selected) toggleService(s.id);
                });
                handleContinue();
              }}
              className="text-primary hover:underline"
            >
              Continue without add-ons
            </button>
          </p>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/funnel/location')}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            Back
          </button>
          <Button
            onClick={handleContinue}
            className="btn-primary px-10 py-3 text-lg"
          >
            See My Move Plan
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
