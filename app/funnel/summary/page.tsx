'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import { HOME_SIZE_CONFIG, BOX_WEIGHTS } from '@/lib/constants';
import { useConfetti } from '@/components/gamification/CelebrationConfetti';

export default function SummaryPage() {
  const router = useRouter();
  const { state, setEstimate, setBoxCounts, completeStep } = useMove();
  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { fire: fireConfetti } = useConfetti();
  const celebrationFired = useRef(false);

  useEffect(() => {
    setMounted(true);
    // Fire celebration confetti on first mount (plan complete!)
    if (!celebrationFired.current) {
      celebrationFired.current = true;
      // Small delay for better visual impact
      setTimeout(() => {
        fireConfetti('plan-complete');
      }, 300);
    }
  }, [fireConfetti]);

  // Calculate all the stats - MUST match services page calculation exactly
  const stats = useMemo(() => {
    // Items and weight
    const totalItems = state.rooms.reduce(
      (sum, room) => sum + room.furniture.reduce((s, f) => s + f.count, 0),
      0
    );
    const totalWeight = state.rooms.reduce(
      (sum, room) => sum + room.furniture.reduce((s, f) => s + f.weight * f.count, 0),
      0
    );
    const totalVolume = state.rooms.reduce(
      (sum, room) => sum + room.furniture.reduce((s, f) => s + f.volume * f.count, 0),
      0
    );

    // Box estimates based on room count
    const roomCount = state.rooms.length;
    const boxes = {
      small: Math.ceil(5 * roomCount),
      medium: Math.ceil(8 * roomCount),
      large: Math.ceil(4 * roomCount),
      wardrobe: Math.ceil(1 * roomCount),
      total: 0,
    };
    boxes.total = boxes.small + boxes.medium + boxes.large + boxes.wardrobe;

    const boxWeight =
      boxes.small * BOX_WEIGHTS.small +
      boxes.medium * BOX_WEIGHTS.medium +
      boxes.large * BOX_WEIGHTS.large +
      boxes.wardrobe * BOX_WEIGHTS.wardrobe;

    // Special items cost
    const specialItemsCost = state.specialItems
      .filter((i) => i.selected)
      .reduce((sum, item) => sum + ((item.priceRange.min + item.priceRange.max) / 2) * item.quantity, 0);

    // Services cost - same calculation as services page
    const servicesCost = state.services
      .filter((s) => s.selected)
      .reduce((sum, service) => {
        if (service.subOptions?.some((sub) => sub.selected)) {
          return sum + service.subOptions
            .filter((sub) => sub.selected)
            .reduce((s, sub) => s + (sub.priceRange.min + sub.priceRange.max) / 2, 0);
        }
        return sum + (service.priceRange.min + service.priceRange.max) / 2;
      }, 0);

    // SAME calculation as services page
    const baseCost = 800;
    const perRoomCost = 350 * state.rooms.length;
    const furnitureCost = state.rooms.reduce((sum, room) => {
      return sum + room.furniture.reduce((roomSum, item) => roomSum + item.weight * 0.5 * item.count, 0);
    }, 0);
    const distanceCost = state.basics.routeInfo?.distance ? state.basics.routeInfo.distance * 2.5 : 0;

    // Total estimate - same formula as services page
    const totalMin = Math.round((baseCost + perRoomCost + furnitureCost + specialItemsCost + servicesCost + distanceCost) * 0.8);
    const totalMax = Math.round((baseCost + perRoomCost + furnitureCost + specialItemsCost + servicesCost + distanceCost) * 1.3);

    return {
      totalItems,
      totalWeight: totalWeight + boxWeight,
      totalVolume,
      boxes,
      specialItemsCost,
      servicesCost,
      baseCost: baseCost + perRoomCost + furnitureCost + distanceCost,
      distanceCost,
      costRange: { min: totalMin, max: totalMax },
    };
  }, [state]);

  // Save estimate to context - use primitive values to avoid infinite loop
  useEffect(() => {
    setEstimate({
      totalItems: stats.totalItems,
      totalBoxes: stats.boxes.total,
      totalWeight: stats.totalWeight,
      totalVolume: stats.totalVolume,
      costRange: stats.costRange,
      costBreakdown: {
        baseCost: stats.baseCost,
        packingCost: 0,
        specialItemsCost: stats.specialItemsCost,
        servicesCost: stats.servicesCost,
        total: (stats.costRange.min + stats.costRange.max) / 2,
      },
      complexityScore: Math.min(10, Math.ceil(stats.totalItems / 20) + (stats.specialItemsCost > 0 ? 2 : 0)),
    });
    setBoxCounts(stats.boxes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.totalItems, stats.costRange.min, stats.costRange.max]);

  const handleContinue = () => {
    completeStep('summary');
    router.push('/funnel/contact');
  };

  const selectedSpecialItems = state.specialItems.filter((i) => i.selected);
  const selectedServices = state.services.filter((s) => s.selected);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-8 lg:py-12">
        {/* Header */}
        <div className={`text-center mb-10 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-base font-medium text-primary mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your Move Plan is Ready
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
            Your Move at a Glance
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground">
            This plan is yours to keep, whether you get quotes or not
          </p>
        </div>

        {/* Cost Estimate Hero */}
        <div className={`p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-8 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">Estimated Cost Range</p>
            <div className="text-4xl lg:text-5xl font-serif text-primary mb-2">
              ${stats.costRange.min.toLocaleString()} - ${stats.costRange.max.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {state.rooms.length} rooms, {stats.totalItems} items{state.basics.routeInfo?.distance ? `, ${state.basics.routeInfo.distance} miles` : ''}
            </p>
          </div>

          {/* Cost Breakdown Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 w-full text-center text-sm text-primary hover:underline flex items-center justify-center gap-1"
          >
            {showDetails ? 'Hide' : 'Show'} cost breakdown
            <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-primary/20 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base move ({state.rooms.length} rooms)</span>
                <span className="font-medium">${Math.round(stats.baseCost - stats.distanceCost).toLocaleString()}</span>
              </div>
              {stats.distanceCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance ({state.basics.routeInfo?.distance} mi)</span>
                  <span className="font-medium">+${Math.round(stats.distanceCost).toLocaleString()}</span>
                </div>
              )}
              {stats.specialItemsCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Special items</span>
                  <span className="font-medium">+${Math.round(stats.specialItemsCost).toLocaleString()}</span>
                </div>
              )}
              {stats.servicesCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-medium">+${Math.round(stats.servicesCost).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${mounted ? 'fade-in-up stagger-2' : 'opacity-0'}`}>
          <div className="p-4 rounded-xl bg-white border border-border text-center">
            <div className="text-3xl font-serif text-foreground">{stats.totalItems}</div>
            <div className="text-sm text-muted-foreground">Furniture Items</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-border text-center">
            <div className="text-3xl font-serif text-foreground">{stats.boxes.total}</div>
            <div className="text-sm text-muted-foreground">Estimated Boxes</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-border text-center">
            <div className="text-3xl font-serif text-foreground">{Math.round(stats.totalWeight).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Est. lbs</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-border text-center">
            <div className="text-3xl font-serif text-foreground">{state.rooms.length}</div>
            <div className="text-sm text-muted-foreground">Rooms</div>
          </div>
        </div>

        {/* Move Details */}
        <div className={`space-y-4 ${mounted ? 'fade-in-up stagger-3' : 'opacity-0'}`}>
          {/* Route */}
          <div className="p-4 rounded-xl bg-white border border-border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                📍
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Route</div>
                <div className="font-medium">
                  {state.basics.fromAddress?.fullAddress || 'Origin'} → {state.basics.toAddress?.fullAddress || 'Destination'}
                </div>
              </div>
            </div>
          </div>

          {/* Date */}
          {state.basics.moveDate && (
            <div className="p-4 rounded-xl bg-white border border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  📅
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Move Date</div>
                  <div className="font-medium">
                    {new Date(state.basics.moveDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {state.basics.isFlexible && (
                      <span className="ml-2 text-sm text-muted-foreground">(Flexible)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Special Items */}
          {selectedSpecialItems.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                  ⚠️
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Special Items</div>
                  <div className="font-medium">
                    {selectedSpecialItems.map((item) => item.name).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services */}
          {selectedServices.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  ✨
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Services Requested</div>
                  <div className="font-medium">
                    {selectedServices.map((s) => s.name).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section - Refined gradient card */}
        <div className={`mt-8 relative overflow-hidden rounded-2xl border border-primary/20 ${mounted ? 'fade-in-up stagger-4' : 'opacity-0'}`}>
          {/* Layered gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Decorative top element */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>

            <h2 className="text-2xl font-serif text-foreground mb-2">Ready to get real quotes?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Top-rated movers will compete for your business with accurate, binding quotes
            </p>

            {/* Trust badges in pill format */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-sm text-muted-foreground shadow-sm">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No obligation
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-sm text-muted-foreground shadow-sm">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free to compare
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-sm text-muted-foreground shadow-sm">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified movers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/funnel/services')}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            Back
          </button>
          <Button
            onClick={handleContinue}
            className="btn-primary px-10 py-3 text-lg"
          >
            Get Competing Quotes
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
