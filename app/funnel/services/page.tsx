'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import type { AdditionalService } from '@/types';

function ServiceCard({
  service,
  onToggle,
  onToggleSubOption,
}: {
  service: AdditionalService;
  onToggle: () => void;
  onToggleSubOption?: (subOptionId: string) => void;
}) {
  return (
    <div
      className={`p-5 rounded-xl border-2 transition-all ${
        service.selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
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
                <div className="font-semibold text-foreground">{service.name}</div>
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

  useEffect(() => {
    setMounted(true);
  }, []);

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

        {/* Popular recommendation */}
        <div className={`mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Most popular choice</p>
              <p className="text-sm text-muted-foreground">
                85% of customers choose Full Packing Service
              </p>
            </div>
          </div>
        </div>

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

        {/* Cost Summary */}
        {selectedServices.length > 0 && (
          <div className={`mt-8 p-4 rounded-xl bg-muted/50 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Added to your quote requests
                </p>
              </div>
              <div className="text-right">
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
