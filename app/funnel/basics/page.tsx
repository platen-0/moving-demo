'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import type { Room, RoomType } from '@/types';

// Room types users can add/remove
const ROOM_TYPES: { type: RoomType; name: string; icon: string; defaultBoxes: { small: number; medium: number; large: number } }[] = [
  { type: 'bedroom', name: 'Bedroom', icon: '🛏️', defaultBoxes: { small: 3, medium: 5, large: 2 } },
  { type: 'bathroom', name: 'Bathroom', icon: '🚿', defaultBoxes: { small: 2, medium: 1, large: 0 } },
  { type: 'kitchen', name: 'Kitchen', icon: '🍳', defaultBoxes: { small: 8, medium: 6, large: 3 } },
  { type: 'living_room', name: 'Living Room', icon: '🛋️', defaultBoxes: { small: 4, medium: 6, large: 4 } },
  { type: 'dining_room', name: 'Dining Room', icon: '🪑', defaultBoxes: { small: 3, medium: 4, large: 2 } },
  { type: 'office', name: 'Office', icon: '💼', defaultBoxes: { small: 5, medium: 4, large: 2 } },
  { type: 'garage', name: 'Garage', icon: '🚗', defaultBoxes: { small: 3, medium: 5, large: 6 } },
  { type: 'basement', name: 'Basement', icon: '📦', defaultBoxes: { small: 2, medium: 4, large: 5 } },
  { type: 'laundry', name: 'Laundry', icon: '🧺', defaultBoxes: { small: 2, medium: 2, large: 1 } },
  { type: 'other', name: 'Other', icon: '📦', defaultBoxes: { small: 2, medium: 3, large: 2 } },
];

const BOX_WEIGHTS = { small: 30, medium: 25, large: 15 }; // lbs per box

// Home size comparisons - dynamically calculated based on actual box estimate
function getHomeSizeInfo(totalRooms: number, totalBoxes: number): { description: string; typicalBoxes: string } {
  // Determine home description based on room count
  let description: string;
  if (totalRooms <= 2) description = 'Studio/1BR';
  else if (totalRooms <= 4) description = '1-2BR apartment';
  else if (totalRooms <= 6) description = '2-3BR home';
  else if (totalRooms <= 8) description = '3-4BR home';
  else description = '4BR+ home';

  // Create a range around the actual calculated boxes (±20%)
  const minBoxes = Math.round(totalBoxes * 0.8);
  const maxBoxes = Math.round(totalBoxes * 1.2);

  return {
    description,
    typicalBoxes: `${minBoxes}-${maxBoxes} boxes`,
  };
}

// Unlock message component
function UnlockMessage({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 fade-in-up">
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary text-white shadow-lg">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-xl">🎉</span>
        </div>
        <div>
          <div className="font-semibold">Move Plan Started!</div>
          <div className="text-sm text-white/80">3 movers already notified</div>
        </div>
      </div>
    </div>
  );
}

// Ahead of others badge
function AheadBadge({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium fade-in-up">
      <span>🏆</span>
      <span>You&apos;re ahead of 90% of planners!</span>
    </div>
  );
}

export default function BasicsPage() {
  const router = useRouter();
  const { state, setRooms, setBoxCounts, completeStep } = useMove();

  // Room counts - how many of each type
  const [roomCounts, setRoomCounts] = useState<Record<RoomType, number>>(() => {
    // Initialize from existing rooms if any
    const counts: Record<RoomType, number> = {} as Record<RoomType, number>;
    ROOM_TYPES.forEach(r => counts[r.type] = 0);
    state.rooms.forEach(room => {
      if (counts[room.type] !== undefined) {
        counts[room.type]++;
      }
    });
    return counts;
  });

  // Box counts - editable
  const [boxes, setBoxes] = useState({
    small: state.boxCounts?.small || 0,
    medium: state.boxCounts?.medium || 0,
    large: state.boxCounts?.large || 0,
  });

  const [mounted, setMounted] = useState(false);
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);
  const [showAheadBadge, setShowAheadBadge] = useState(false);
  const [hasShownUnlock, setHasShownUnlock] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate box estimates based on room counts
  const estimatedBoxes = useMemo(() => {
    let small = 0, medium = 0, large = 0;
    ROOM_TYPES.forEach(roomType => {
      const count = roomCounts[roomType.type] || 0;
      small += roomType.defaultBoxes.small * count;
      medium += roomType.defaultBoxes.medium * count;
      large += roomType.defaultBoxes.large * count;
    });
    return { small, medium, large };
  }, [roomCounts]);

  // Update box counts when room counts change (only if user hasn't manually edited)
  const [userEditedBoxes, setUserEditedBoxes] = useState(false);
  useEffect(() => {
    if (!userEditedBoxes) {
      setBoxes(estimatedBoxes);
    }
  }, [estimatedBoxes, userEditedBoxes]);

  const totalRooms = Object.values(roomCounts).reduce((sum, count) => sum + count, 0);
  const totalBoxes = boxes.small + boxes.medium + boxes.large;
  const totalWeight = boxes.small * BOX_WEIGHTS.small + boxes.medium * BOX_WEIGHTS.medium + boxes.large * BOX_WEIGHTS.large;

  // Show unlock message when first room is added
  useEffect(() => {
    if (totalRooms === 1 && !hasShownUnlock) {
      setHasShownUnlock(true);
      setShowUnlockMessage(true);
      setTimeout(() => setShowUnlockMessage(false), 3000);
    }
  }, [totalRooms, hasShownUnlock]);

  // Show ahead badge when 3+ rooms added
  useEffect(() => {
    if (totalRooms >= 3 && !showAheadBadge) {
      setShowAheadBadge(true);
    }
  }, [totalRooms, showAheadBadge]);

  // Calculate estimated cost range based on rooms
  const estimatedCost = useMemo(() => {
    const baseCost = 800;
    const perRoomCost = 350;
    const perBoxCost = 5;
    const min = baseCost + (totalRooms * perRoomCost * 0.8) + (totalBoxes * perBoxCost * 0.8);
    const max = baseCost + (totalRooms * perRoomCost * 1.3) + (totalBoxes * perBoxCost * 1.2);
    return { min: Math.round(min), max: Math.round(max) };
  }, [totalRooms, totalBoxes]);

  // Movers estimate (starts high, decreases as user provides more info)
  const moverCount = Math.max(3, 8 - Math.floor(totalRooms / 2));

  // Get home size context
  const homeSizeInfo = getHomeSizeInfo(totalRooms, totalBoxes);

  const updateRoomCount = (type: RoomType, delta: number) => {
    setRoomCounts(prev => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) + delta),
    }));
  };

  const updateBoxCount = (type: 'small' | 'medium' | 'large', delta: number) => {
    setUserEditedBoxes(true);
    setBoxes(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const canContinue = totalRooms > 0;

  const handleContinue = () => {
    // Build rooms array from counts
    const newRooms: Room[] = [];
    let roomIndex = 0;
    ROOM_TYPES.forEach(roomType => {
      const count = roomCounts[roomType.type] || 0;
      for (let i = 0; i < count; i++) {
        roomIndex++;
        const name = count > 1 ? `${roomType.name} ${i + 1}` : roomType.name;
        newRooms.push({
          id: `room-${roomIndex}`,
          name,
          type: roomType.type,
          status: 'not_started',
          furniture: [],
          boxes: { clothes_linens: 0, books_media: 0, decor_misc: 0, fragile: 0 },
        });
      }
    });

    setRooms(newRooms);
    setBoxCounts({
      small: boxes.small,
      medium: boxes.medium,
      large: boxes.large,
      wardrobe: Math.ceil(roomCounts.bedroom * 2) || 0, // 2 wardrobe boxes per bedroom
      total: totalBoxes,
    });

    completeStep('basics');
    router.push('/funnel/inventory');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Unlock Message Toast */}
      <UnlockMessage show={showUnlockMessage} />

      {/* Running Quote Banner */}
      {totalRooms > 0 && (
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
      )}

      <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-4 lg:py-6">
        {/* Header */}
        <div className={`text-center mb-6 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-2">
            What does your home look like?
          </h1>
          <p className="text-lg text-muted-foreground">
            Add and remove rooms to match your space
          </p>
        </div>

        {/* Room Selection Grid */}
        <div className={`mb-6 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ROOM_TYPES.map((room) => {
              const count = roomCounts[room.type] || 0;
              const isActive = count > 0;
              return (
                <div
                  key={room.type}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-white hover:border-primary/30'
                  }`}
                >
                  <div className="text-center mb-2">
                    <span className="text-3xl">{room.icon}</span>
                    <p className="font-semibold text-sm text-foreground mt-1">{room.name}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateRoomCount(room.type, -1)}
                      disabled={count === 0}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                        count === 0
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      -
                    </button>
                    <span className={`text-2xl font-bold w-8 text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {count}
                    </span>
                    <button
                      onClick={() => updateRoomCount(room.type, 1)}
                      className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold hover:bg-[#15803d] transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Home Size Context Card */}
        {totalRooms > 0 && (
          <div className={`mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 ${mounted ? 'fade-in-up stagger-2' : 'opacity-0'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl">🏠</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base text-foreground">
                  {homeSizeInfo.description} typically has {homeSizeInfo.typicalBoxes}
                </p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll count yours exactly in the next step
                </p>
              </div>
              {showAheadBadge && (
                <AheadBadge show={showAheadBadge} />
              )}
            </div>
          </div>
        )}

        {/* Box Estimation Card */}
        {totalRooms > 0 && (
          <div className={`p-4 rounded-xl bg-white border-2 border-border shadow-sm ${mounted ? 'fade-in-up stagger-3' : 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Estimated Boxes & Weight</h3>
                <p className="text-sm text-muted-foreground">Adjust if you think you&apos;ll need more or less</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Small Boxes */}
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">Small Boxes</p>
                <p className="text-xs text-muted-foreground mb-2">Books, heavy items</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateBoxCount('small', -1)}
                    className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted text-base"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-foreground w-10 text-center">{boxes.small}</span>
                  <button
                    onClick={() => updateBoxCount('small', 1)}
                    className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted text-base"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{boxes.small * BOX_WEIGHTS.small} lbs</p>
              </div>

              {/* Medium Boxes */}
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">Medium Boxes</p>
                <p className="text-xs text-muted-foreground mb-2">General items</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateBoxCount('medium', -1)}
                    className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted text-base"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-foreground w-10 text-center">{boxes.medium}</span>
                  <button
                    onClick={() => updateBoxCount('medium', 1)}
                    className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted text-base"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{boxes.medium * BOX_WEIGHTS.medium} lbs</p>
              </div>

              {/* Large Boxes */}
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">Large Boxes</p>
                <p className="text-xs text-muted-foreground mb-2">Light, bulky items</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateBoxCount('large', -1)}
                    className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted text-base"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-foreground w-10 text-center">{boxes.large}</span>
                  <button
                    onClick={() => updateBoxCount('large', 1)}
                    className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted text-base"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{boxes.large * BOX_WEIGHTS.large} lbs</p>
              </div>
            </div>

            {/* Totals */}
            <div className="flex items-center justify-center gap-8 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalBoxes}</p>
                <p className="text-sm text-muted-foreground">Total Boxes</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalWeight.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Est. lbs</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        {totalRooms > 0 && (
          <div className={`mt-8 p-5 rounded-xl bg-primary/5 border border-primary/20 ${mounted ? 'fade-in-up stagger-4' : 'opacity-0'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-lg text-foreground">
                  Your {totalRooms}-room home estimate: <span className="text-primary">${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}</span>
                </p>
                <p className="text-base text-muted-foreground">
                  We&apos;ll refine this based on your actual inventory in the next step
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            Back
          </button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="btn-primary px-10 py-3 text-lg"
          >
            Continue to Inventory
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
