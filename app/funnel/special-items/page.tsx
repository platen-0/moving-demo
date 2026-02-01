'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import { useConfetti } from '@/components/gamification/CelebrationConfetti';
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

// Expert tips for high-value items
const EXPERT_TIPS: Record<string, { title: string; tips: string[]; specialists: number }> = {
  piano: {
    title: 'Piano Moving Expert Tips',
    tips: [
      'Professional piano movers use specialized dollies and straps',
      'Climate-controlled trucks prevent wood warping',
      'Tuning is recommended 2 weeks after the move',
    ],
    specialists: 3,
  },
  'pool-table': {
    title: 'Pool Table Moving Tips',
    tips: [
      'Slate tables must be disassembled by professionals',
      'Felt should be protected or replaced after moving',
      'Re-leveling is included with professional movers',
    ],
    specialists: 2,
  },
  'grandfather-clock': {
    title: 'Grandfather Clock Care',
    tips: [
      'Pendulum and weights must be removed separately',
      'Movement mechanism needs professional securing',
      'Allow 24 hours before restarting after the move',
    ],
    specialists: 2,
  },
  'fine-art': {
    title: 'Fine Art Protection',
    tips: [
      'Custom crating recommended for valuable pieces',
      'Climate control prevents paint cracking',
      'Insurance documentation advised before moving',
    ],
    specialists: 4,
  },
  antiques: {
    title: 'Antique Handling',
    tips: [
      'Specialized wrapping materials prevent finish damage',
      'Photos before packing document condition',
      'White-glove service recommended for heirlooms',
    ],
    specialists: 3,
  },
};

// Items that trigger special handling indicator
const PREMIUM_ITEMS = ['piano', 'pool-table', 'grandfather-clock', 'fine-art', 'antiques', 'safe', 'hot-tub', 'wine-collection'];

function SpecialItemCard({
  item,
  onToggle,
  onQuantityChange,
  showPriceAnimation,
}: {
  item: SpecialItem;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
  showPriceAnimation?: boolean;
}) {
  const isPremium = PREMIUM_ITEMS.includes(item.id);
  const avgPrice = Math.round((item.priceRange.min + item.priceRange.max) / 2);

  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        item.selected
          ? isPremium
            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-amber-100'
            : 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Premium item spotlight effect */}
      {item.selected && isPremium && (
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-md animate-bounce">
          <span>⚠️</span>
          <span>Special Handling</span>
        </div>
      )}

      {/* Price animation floating text */}
      {showPriceAnimation && (
        <div className="absolute -top-8 right-4 text-primary font-bold text-lg animate-float-up pointer-events-none">
          +${avgPrice}
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <button
          onClick={onToggle}
          className="flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{item.name}</span>
            {isPremium && !item.selected && (
              <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">Premium</span>
            )}
          </div>
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
            className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors"
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

// Expert tips panel component
function ExpertTipsPanel({ itemId, onClose }: { itemId: string; onClose: () => void }) {
  const tips = EXPERT_TIPS[itemId];
  if (!tips) return null;

  return (
    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 animate-slide-down">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h4 className="font-semibold text-blue-900">{tips.title}</h4>
        </div>
        <button onClick={onClose} className="text-blue-400 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <ul className="space-y-2 mb-4">
        {tips.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
            <span className="text-blue-500 mt-0.5">✓</span>
            {tip}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-lg">
        <span className="text-lg">🏆</span>
        <span className="text-sm font-medium text-blue-900">
          {tips.specialists} of your matched movers specialize in this!
        </span>
      </div>
    </div>
  );
}

export default function SpecialItemsPage() {
  const router = useRouter();
  const { state, toggleSpecialItem, setSpecialItemQuantity, completeStep } = useMove();
  const [mounted, setMounted] = useState(false);
  const [activeExpertTip, setActiveExpertTip] = useState<string | null>(null);
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  const { fire: fireConfetti } = useConfetti();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle item toggle with animation
  const handleToggle = useCallback((itemId: string) => {
    const item = state.specialItems.find(i => i.id === itemId);
    if (!item) return;

    // If selecting (not deselecting)
    if (!item.selected) {
      // Trigger price animation
      setAnimatingItemId(itemId);
      setTimeout(() => setAnimatingItemId(null), 1000);

      // Show expert tips for premium items
      if (EXPERT_TIPS[itemId]) {
        setActiveExpertTip(itemId);
        fireConfetti('room-complete');
      }
    } else {
      // Deselecting - hide expert tip if showing
      if (activeExpertTip === itemId) {
        setActiveExpertTip(null);
      }
    }

    toggleSpecialItem(itemId);
  }, [state.specialItems, toggleSpecialItem, activeExpertTip, fireConfetti]);

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
                    onToggle={() => handleToggle(item.id)}
                    onQuantityChange={(qty) => setSpecialItemQuantity(item.id, qty)}
                    showPriceAnimation={animatingItemId === item.id}
                  />
                ))}
              </div>
              {/* Expert tips panel for this category */}
              {itemsByCategory[category]?.some(item => item.id === activeExpertTip && item.selected) && (
                <ExpertTipsPanel
                  itemId={activeExpertTip!}
                  onClose={() => setActiveExpertTip(null)}
                />
              )}
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

        {/* Good News Card - shown when no items selected */}
        {selectedItems.length === 0 && (
          <div className={`mt-8 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 ${mounted ? 'fade-in-up stagger-4' : 'opacity-0'}`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🎉</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-900 text-lg">Good News!</h3>
                <p className="text-emerald-700">
                  No special items means a simpler, more affordable move. Your quote stays lean!
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-emerald-100 rounded-full">
                <span className="text-emerald-600 font-semibold">$0</span>
                <span className="text-emerald-500 text-sm">extra</span>
              </div>
            </div>
          </div>
        )}

        {/* Skip option */}
        {selectedItems.length === 0 && (
          <div className={`mt-6 text-center ${mounted ? 'fade-in-up stagger-5' : 'opacity-0'}`}>
            <p className="text-sm text-muted-foreground">
              Continue to the next step when ready, or select any special items above.
            </p>
          </div>
        )}
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
