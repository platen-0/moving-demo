'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import type { SpecialItem } from '@/types';

const CATEGORY_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  large_heavy: {
    label: 'Large & Heavy Items',
    icon: '🏋️',
    description: 'Items requiring special equipment or multiple movers',
  },
  fragile_valuable: {
    label: 'Fragile & Valuable',
    icon: '🎨',
    description: 'Items needing extra care and custom crating',
  },
  outdoor: {
    label: 'Outdoor & Specialty',
    icon: '🌳',
    description: 'Outdoor equipment and specialty items',
  },
};

function SpecialItemCard({
  item,
  onToggle,
  onQuantityChange,
}: {
  item: SpecialItem;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${
        item.selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={onToggle}
          className="flex-1 text-left"
        >
          <div className="font-medium text-foreground">{item.name}</div>
          <div className="text-sm text-muted-foreground">
            +${item.priceRange.min} - ${item.priceRange.max}
          </div>
        </button>

        {item.selected ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
            >
              -
            </button>
            <span className="w-6 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:border-primary"
          >
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function SpecialItemsPage() {
  const router = useRouter();
  const { state, toggleSpecialItem, setSpecialItemQuantity, completeStep } = useMove();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, SpecialItem[]> = {};
    state.specialItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [state.specialItems]);

  const selectedItems = state.specialItems.filter((item) => item.selected);
  const additionalCost = selectedItems.reduce(
    (sum, item) => sum + ((item.priceRange.min + item.priceRange.max) / 2) * item.quantity,
    0
  );

  // Calculate estimated cost
  const estimatedCost = useMemo(() => {
    const baseCost = 800;
    const perRoomCost = 350 * state.rooms.length;
    const furnitureCost = state.rooms.reduce((sum, room) => {
      return sum + room.furniture.reduce((roomSum, item) => roomSum + item.weight * 0.5 * item.count, 0);
    }, 0);
    const specialItemsCost = additionalCost;
    const min = Math.round((baseCost + perRoomCost + furnitureCost + specialItemsCost) * 0.8);
    const max = Math.round((baseCost + perRoomCost + furnitureCost + specialItemsCost) * 1.3);
    return { min, max };
  }, [state.rooms, additionalCost]);

  const moverCount = useMemo(() => {
    const roomCount = state.rooms.length;
    if (roomCount <= 2) return 6;
    if (roomCount <= 4) return 5;
    return 4;
  }, [state.rooms.length]);

  const handleContinue = () => {
    completeStep('special-items');
    router.push('/funnel/location');
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
            Any special items?
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground">
            These items need special handling and may add to your quote
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {Object.entries(CATEGORY_LABELS).map(([category, config], index) => (
            <div
              key={category}
              className={mounted ? `fade-in-up stagger-${index + 1}` : 'opacity-0'}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h2 className="font-semibold text-foreground">{config.label}</h2>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {itemsByCategory[category]?.map((item) => (
                  <SpecialItemCard
                    key={item.id}
                    item={item}
                    onToggle={() => toggleSpecialItem(item.id)}
                    onQuantityChange={(qty) => setSpecialItemQuantity(item.id, qty)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {selectedItems.length > 0 && (
          <div className={`mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {selectedItems.length} special item{selectedItems.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-muted-foreground">
                  These add approximately ${Math.round(additionalCost).toLocaleString()} to your move
                </p>
              </div>
              <div className="text-2xl font-serif text-amber-600">
                +${Math.round(additionalCost).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Skip option */}
        <div className={`mt-6 text-center ${mounted ? 'fade-in-up stagger-4' : 'opacity-0'}`}>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have any special items?{' '}
            <button
              onClick={handleContinue}
              className="text-primary hover:underline"
            >
              Skip this step
            </button>
          </p>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/funnel/inventory')}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            Back
          </button>
          <Button
            onClick={handleContinue}
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
