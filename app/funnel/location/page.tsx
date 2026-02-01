'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConfetti } from '@/components/gamification/CelebrationConfetti';
import dynamic from 'next/dynamic';

// Dynamically import Google Maps components to avoid SSR issues
const GoogleMapsWrapper = dynamic(
  () => import('@/components/maps/GoogleMapsWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-2xl min-h-[450px]">
        <div className="text-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

const PlacesAutocomplete = dynamic(
  () => import('@/components/maps/PlacesAutocomplete'),
  {
    ssr: false,
    loading: () => (
      <div className="h-14 bg-muted/50 rounded-lg animate-pulse" />
    ),
  }
);

interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default function LocationPage() {
  const router = useRouter();
  const { state, setBasics, completeStep } = useMove();

  const [fromInput, setFromInput] = useState(state.basics.fromAddress?.fullAddress || '');
  const [toInput, setToInput] = useState(state.basics.toAddress?.fullAddress || '');
  const [fromLocation, setFromLocation] = useState<Location | null>(
    state.basics.fromAddress ? {
      address: state.basics.fromAddress.fullAddress,
      lat: state.basics.fromAddress.lat || 0,
      lng: state.basics.fromAddress.lng || 0,
      city: state.basics.fromAddress.city,
      state: state.basics.fromAddress.state,
      zip: state.basics.fromAddress.zip,
    } : null
  );
  const [toLocation, setToLocation] = useState<Location | null>(
    state.basics.toAddress ? {
      address: state.basics.toAddress.fullAddress,
      lat: state.basics.toAddress.lat || 0,
      lng: state.basics.toAddress.lng || 0,
      city: state.basics.toAddress.city,
      state: state.basics.toAddress.state,
      zip: state.basics.toAddress.zip,
    } : null
  );
  const [moveDate, setMoveDate] = useState(state.basics.moveDate || '');
  const [isFlexible, setIsFlexible] = useState(state.basics.isFlexible);

  const [routeDistance, setRouteDistance] = useState<number | null>(state.basics.routeInfo?.distance || null);
  const [routeDuration, setRouteDuration] = useState<number | null>(state.basics.routeInfo?.duration || null);
  const [hasShownRouteConfetti, setHasShownRouteConfetti] = useState(false);
  const [showDateTip, setShowDateTip] = useState(false);

  const [mounted, setMounted] = useState(false);
  const { fire: fireConfetti } = useConfetti();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFromPlaceSelect = useCallback((place: {
    address: string;
    lat: number;
    lng: number;
    city: string;
    state: string;
    zip: string;
  }) => {
    setFromLocation(place);
    setFromInput(place.address);
  }, []);

  const handleToPlaceSelect = useCallback((place: {
    address: string;
    lat: number;
    lng: number;
    city: string;
    state: string;
    zip: string;
  }) => {
    setToLocation(place);
    setToInput(place.address);
  }, []);

  const handleRouteCalculated = useCallback((distance: number, duration: number) => {
    setRouteDistance(distance);
    setRouteDuration(duration);
    // Fire confetti when route is first calculated
    if (!hasShownRouteConfetti) {
      setHasShownRouteConfetti(true);
      fireConfetti('room-complete');
    }
  }, [hasShownRouteConfetti, fireConfetti]);

  // Calculate estimated cost including distance
  const estimatedCost = useMemo(() => {
    const baseCost = 800;
    const perRoomCost = 350 * state.rooms.length;
    const distanceCost = routeDistance ? routeDistance * 2.5 : 0;
    const min = Math.round((baseCost + perRoomCost + distanceCost) * 0.8);
    const max = Math.round((baseCost + perRoomCost + distanceCost) * 1.3);
    return { min, max };
  }, [state.rooms.length, routeDistance]);

  const moverCount = useMemo(() => {
    let count = 6;
    if (routeDistance) {
      if (routeDistance > 100) count -= 1;
      if (routeDistance > 500) count -= 1;
    }
    return Math.max(3, count);
  }, [routeDistance]);

  const isLongDistance = routeDistance ? routeDistance > 100 : false;
  const canContinue = fromLocation && toLocation;
  const today = new Date().toISOString().split('T')[0];

  // Format drive time
  const formatDriveTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours % 1) * 60);
    return `${h}h ${m}m`;
  };

  const handleContinue = () => {
    setBasics({
      fromAddress: fromLocation ? {
        fullAddress: fromLocation.address,
        city: fromLocation.city,
        state: fromLocation.state,
        zip: fromLocation.zip,
        lat: fromLocation.lat,
        lng: fromLocation.lng,
      } : null,
      toAddress: toLocation ? {
        fullAddress: toLocation.address,
        city: toLocation.city,
        state: toLocation.state,
        zip: toLocation.zip,
        lat: toLocation.lat,
        lng: toLocation.lng,
      } : null,
      moveDate: moveDate || null,
      isFlexible,
      routeInfo: routeDistance ? {
        distance: routeDistance,
        duration: routeDuration || 0,
        isLongDistance,
      } : null,
    });

    completeStep('location');
    router.push('/funnel/services');
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

      <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-8 lg:py-10">
        {/* Header */}
        <div className={`text-center mb-10 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
            Where are you moving?
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground">
            Enter your locations to see the route and refine your quote
          </p>
        </div>

        {/* Main Content */}
        <div className={`grid lg:grid-cols-2 gap-10 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
          {/* Left: Address Inputs */}
          <div className="space-y-8">
            {/* From Address */}
            <div>
              <label className="block text-lg font-semibold text-foreground mb-3">
                <span className="inline-flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-primary text-white text-base flex items-center justify-center font-bold">1</span>
                  <span className="text-xl">Moving From</span>
                </span>
              </label>
              <PlacesAutocomplete
                value={fromInput}
                onChange={setFromInput}
                onPlaceSelect={handleFromPlaceSelect}
                placeholder="Enter your current address"
                icon={<span className="text-2xl">📍</span>}
                isSelected={!!fromLocation}
              />
            </div>

            {/* To Address */}
            <div>
              <label className="block text-lg font-semibold text-foreground mb-3">
                <span className="inline-flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-primary text-white text-base flex items-center justify-center font-bold">2</span>
                  <span className="text-xl">Moving To</span>
                </span>
              </label>
              <PlacesAutocomplete
                value={toInput}
                onChange={setToInput}
                onPlaceSelect={handleToPlaceSelect}
                placeholder="Enter your new address"
                icon={<span className="text-2xl">🏠</span>}
                isSelected={!!toLocation}
              />
            </div>

            {/* Move Date */}
            <div>
              <label className="block text-lg font-semibold text-foreground mb-3">
                <span className="inline-flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-secondary text-white text-xl flex items-center justify-center">📅</span>
                  <span className="text-xl">When are you moving?</span>
                </span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="date"
                  value={moveDate}
                  min={today}
                  onChange={(e) => {
                    setMoveDate(e.target.value);
                    if (e.target.value && !showDateTip) {
                      setShowDateTip(true);
                    }
                  }}
                  className="h-14 text-lg flex-1"
                />
                <label className="flex items-center gap-3 cursor-pointer px-5 py-3 rounded-xl border border-border hover:bg-muted transition-colors">
                  <input
                    type="checkbox"
                    checked={isFlexible}
                    onChange={(e) => setIsFlexible(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-lg text-foreground">I&apos;m flexible</span>
                </label>
              </div>

              {/* Smart Date Tip */}
              {moveDate && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Pro tip: Tuesdays & Wednesdays are typically 15-20% cheaper!
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      {new Date(moveDate).getDay() === 2 || new Date(moveDate).getDay() === 3
                        ? "Great choice! You picked a budget-friendly day 💰"
                        : "Consider a mid-week move to save on your quote"}
                    </p>
                  </div>
                </div>
              )}

              {!moveDate && (
                <p className="text-base text-muted-foreground mt-3">
                  Don&apos;t know yet? No problem — you can skip this.
                </p>
              )}
            </div>

            {/* Route Info Card */}
            {routeDistance && routeDuration && (
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-2xl">
                      {routeDistance.toLocaleString()} miles
                    </p>
                    <p className="text-lg text-muted-foreground">
                      ~{formatDriveTime(routeDuration)} drive
                    </p>
                  </div>
                  {isLongDistance && (
                    <div className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-base font-semibold">
                      Long Distance
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Map */}
          <div className="rounded-2xl overflow-hidden border-2 border-border shadow-lg min-h-[450px] lg:min-h-[550px]">
            <GoogleMapsWrapper
              fromLocation={fromLocation ? { lat: fromLocation.lat, lng: fromLocation.lng, address: fromLocation.address } : null}
              toLocation={toLocation ? { lat: toLocation.lat, lng: toLocation.lng, address: toLocation.address } : null}
              onRouteCalculated={handleRouteCalculated}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/funnel/special-items')}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            Back
          </button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="btn-primary px-10 py-3 text-lg"
          >
            Continue
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
