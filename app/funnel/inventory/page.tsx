'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMove } from '@/context/MoveContext';
import { Button } from '@/components/ui/button';
import { FURNITURE_BY_ROOM } from '@/lib/constants';
import { useConfetti } from '@/components/gamification/CelebrationConfetti';
import type { Room, FurnitureItem, RoomType } from '@/types';

const ROOM_ICONS: Record<RoomType, string> = {
  living_room: '🛋️',
  master_bedroom: '🛏️',
  bedroom: '🛏️',
  kitchen: '🍳',
  bathroom: '🚿',
  dining_room: '🪑',
  office: '💼',
  garage: '🚗',
  basement: '📦',
  attic: '📦',
  laundry: '🧺',
  other: '📦',
};

// Achievement badges
const ACHIEVEMENTS = [
  { id: 'first_room', name: 'First Room!', icon: '🎯', description: 'Completed your first room' },
  { id: 'halfway', name: 'Halfway There!', icon: '🚀', description: 'Completed half of your rooms' },
  { id: 'inventory_master', name: 'Inventory Master', icon: '👑', description: 'Completed all rooms' },
  { id: 'detail_oriented', name: 'Detail Oriented', icon: '🔍', description: 'Added 20+ items' },
];

// Achievement Badge Component
function AchievementBadge({ achievement, show }: { achievement: typeof ACHIEVEMENTS[0]; show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 fade-in-up">
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-2xl">{achievement.icon}</span>
        </div>
        <div>
          <div className="text-xs font-medium text-white/80">Achievement Unlocked!</div>
          <div className="font-bold text-lg">{achievement.name}</div>
          <div className="text-sm text-white/80">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
}

// Streak Counter Component
function StreakCounter({ streak }: { streak: number }) {
  if (streak < 2) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
      <span>🔥</span>
      <span>{streak} rooms in a row!</span>
    </div>
  );
}

// Movers Watching Component
function MoversWatching({ itemCount }: { itemCount: number }) {
  const moverCount = Math.min(6, Math.max(3, Math.floor(itemCount / 5) + 3));

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm">
      <div className="flex -space-x-2">
        {Array.from({ length: Math.min(3, moverCount) }).map((_, i) => (
          <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-xs">
            {['👷', '🚚', '📦'][i]}
          </div>
        ))}
      </div>
      <span className="font-medium">{moverCount} movers watching your inventory grow...</span>
    </div>
  );
}

function RoomCard({
  room,
  onSelect,
  isSelected,
}: {
  room: Room;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const itemCount = room.furniture.reduce((sum, f) => sum + f.count, 0);
  const hasItems = itemCount > 0;

  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : hasItems
          ? 'border-primary/30 bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ROOM_ICONS[room.type]}</span>
          <div>
            <div className="font-semibold text-foreground text-base">{room.name}</div>
            <div className="text-sm text-muted-foreground">
              {itemCount > 0 ? `${itemCount} items` : 'Tap to add'}
            </div>
          </div>
        </div>
        {hasItems && (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

function FurnitureSelector({
  room,
  onUpdateFurniture,
}: {
  room: Room;
  onUpdateFurniture: (furniture: FurnitureItem[]) => void;
}) {
  const availableItems = FURNITURE_BY_ROOM[room.type] || FURNITURE_BY_ROOM.other;

  const getItemCount = (itemId: string) => {
    const item = room.furniture.find((f) => f.id === itemId);
    return item?.count || 0;
  };

  const updateCount = (item: typeof availableItems[0], delta: number) => {
    const existing = room.furniture.find((f) => f.id === item.id);
    if (existing) {
      const newCount = existing.count + delta;
      if (newCount <= 0) {
        onUpdateFurniture(room.furniture.filter((f) => f.id !== item.id));
      } else {
        onUpdateFurniture(
          room.furniture.map((f) =>
            f.id === item.id ? { ...f, count: newCount } : f
          )
        );
      }
    } else if (delta > 0) {
      onUpdateFurniture([...room.furniture, { ...item, count: 1 }]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-4xl">{ROOM_ICONS[room.type]}</span>
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{room.name}</h3>
          <p className="text-base text-muted-foreground">Use +/- to add or remove items</p>
        </div>
      </div>

      {/* Items Grid with +/- controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableItems.map((item) => {
          const count = getItemCount(item.id);
          const isSelected = count > 0;
          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span className="text-sm font-medium flex-1 min-w-0 leading-tight">{item.name}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => updateCount(item, -1)}
                    disabled={count === 0}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-medium transition-all ${
                      count === 0
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    -
                  </button>
                  <span className={`w-6 text-center font-bold text-base ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {count}
                  </span>
                  <button
                    onClick={() => updateCount(item, 1)}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-base font-medium hover:bg-[#15803d] transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Toast notification component for room completion
function RoomCompleteToast({ roomName, show }: { roomName: string; show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border-2 border-primary shadow-lg">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-foreground">{roomName} Complete!</div>
          <div className="text-sm text-muted-foreground">Great job - keep going!</div>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const router = useRouter();
  const { state, updateRoomFurniture, setRoomStatus, completeStep } = useMove();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [completedRoomToast, setCompletedRoomToast] = useState<string | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [roomStreak, setRoomStreak] = useState(0);
  const previousRoomStatuses = useRef<Map<string, Room['status']>>(new Map());
  const { fire: fireConfetti } = useConfetti();

  useEffect(() => {
    setMounted(true);
    if (state.rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(state.rooms[0].id);
    }
  }, [state.rooms, selectedRoomId]);

  // Calculate completed rooms count
  const completedRoomsCount = state.rooms.filter(r => r.status === 'complete').length;
  const totalRoomsCount = state.rooms.length;
  const totalItemsCount = state.rooms.reduce(
    (sum, room) => sum + room.furniture.reduce((s, f) => s + f.count, 0),
    0
  );

  // Check for achievements
  useEffect(() => {
    // First Room achievement
    if (completedRoomsCount >= 1 && !unlockedAchievements.has('first_room')) {
      const achievement = ACHIEVEMENTS.find(a => a.id === 'first_room')!;
      setCurrentAchievement(achievement);
      setUnlockedAchievements(prev => new Set([...prev, 'first_room']));
      setTimeout(() => setCurrentAchievement(null), 3000);
    }

    // Halfway achievement
    if (completedRoomsCount >= Math.ceil(totalRoomsCount / 2) && totalRoomsCount > 1 && !unlockedAchievements.has('halfway')) {
      setTimeout(() => {
        const achievement = ACHIEVEMENTS.find(a => a.id === 'halfway')!;
        setCurrentAchievement(achievement);
        setUnlockedAchievements(prev => new Set([...prev, 'halfway']));
        fireConfetti('milestone');
        setTimeout(() => setCurrentAchievement(null), 3000);
      }, 500);
    }

    // Inventory Master achievement
    if (completedRoomsCount === totalRoomsCount && totalRoomsCount > 1 && !unlockedAchievements.has('inventory_master')) {
      setTimeout(() => {
        const achievement = ACHIEVEMENTS.find(a => a.id === 'inventory_master')!;
        setCurrentAchievement(achievement);
        setUnlockedAchievements(prev => new Set([...prev, 'inventory_master']));
        fireConfetti('milestone');
        setTimeout(() => setCurrentAchievement(null), 3000);
      }, 1000);
    }

    // Detail Oriented achievement
    if (totalItemsCount >= 20 && !unlockedAchievements.has('detail_oriented')) {
      const achievement = ACHIEVEMENTS.find(a => a.id === 'detail_oriented')!;
      setCurrentAchievement(achievement);
      setUnlockedAchievements(prev => new Set([...prev, 'detail_oriented']));
      setTimeout(() => setCurrentAchievement(null), 3000);
    }
  }, [completedRoomsCount, totalRoomsCount, totalItemsCount, unlockedAchievements, fireConfetti]);

  // Track room status changes to trigger celebration and streak
  useEffect(() => {
    state.rooms.forEach(room => {
      const prevStatus = previousRoomStatuses.current.get(room.id);
      // Trigger celebration when a room transitions to 'complete' from any other status
      if (room.status === 'complete' && prevStatus !== 'complete' && prevStatus !== undefined) {
        fireConfetti('room-complete');
        setCompletedRoomToast(room.name);
        setRoomStreak(prev => prev + 1);
        // Hide toast after 2.5 seconds
        setTimeout(() => setCompletedRoomToast(null), 2500);
      }
      previousRoomStatuses.current.set(room.id, room.status);
    });
  }, [state.rooms, fireConfetti]);

  // Initialize room statuses on mount
  useEffect(() => {
    state.rooms.forEach(room => {
      if (!previousRoomStatuses.current.has(room.id)) {
        previousRoomStatuses.current.set(room.id, room.status);
      }
    });
  }, [state.rooms]);

  const selectedRoom = state.rooms.find((r) => r.id === selectedRoomId);

  // Calculate stats
  const stats = useMemo(() => {
    const totalItems = state.rooms.reduce(
      (sum, room) => sum + room.furniture.reduce((s, f) => s + f.count, 0),
      0
    );
    const totalWeight = state.rooms.reduce(
      (sum, room) => sum + room.furniture.reduce((s, f) => s + f.weight * f.count, 0),
      0
    );
    const roomsWithItems = state.rooms.filter((r) => r.furniture.length > 0).length;
    return { totalItems, totalWeight, roomsWithItems };
  }, [state.rooms]);

  // Calculate running quote
  const estimatedCost = useMemo(() => {
    const baseCost = 800;
    const perRoomCost = 350;
    const itemCost = stats.totalItems * 15;
    const weightCost = stats.totalWeight * 0.5;
    const min = Math.round(baseCost + perRoomCost * state.rooms.length * 0.7 + itemCost * 0.8 + weightCost * 0.6);
    const max = Math.round(baseCost + perRoomCost * state.rooms.length * 1.2 + itemCost * 1.1 + weightCost * 0.9);
    return { min, max };
  }, [state.rooms.length, stats.totalItems, stats.totalWeight]);

  const moverCount = Math.max(3, 7 - Math.floor(stats.totalItems / 15));

  // Auto-save: when switching rooms, mark the previous room as having items if it does
  const handleSelectRoom = useCallback((roomId: string) => {
    if (selectedRoomId && selectedRoomId !== roomId) {
      const prevRoom = state.rooms.find(r => r.id === selectedRoomId);
      if (prevRoom && prevRoom.furniture.length > 0 && prevRoom.status !== 'complete') {
        setRoomStatus(selectedRoomId, 'complete');
      }
    }
    setSelectedRoomId(roomId);
  }, [selectedRoomId, state.rooms, setRoomStatus]);

  const handleUpdateFurniture = (furniture: FurnitureItem[]) => {
    if (selectedRoomId) {
      updateRoomFurniture(selectedRoomId, furniture);
      // Auto-mark as having content
      if (furniture.length > 0) {
        setRoomStatus(selectedRoomId, 'in_progress');
      }
    }
  };

  const handleContinue = () => {
    // Mark current room complete if it has items
    if (selectedRoomId) {
      const currentRoom = state.rooms.find(r => r.id === selectedRoomId);
      if (currentRoom && currentRoom.furniture.length > 0) {
        setRoomStatus(selectedRoomId, 'complete');
      }
    }
    completeStep('inventory');
    router.push('/funnel/special-items');
  };

  // Build running tally of all items across rooms
  const allSelectedItems = useMemo(() => {
    const itemMap = new Map<string, { name: string; icon: string; count: number; weight: number }>();
    state.rooms.forEach(room => {
      room.furniture.forEach(item => {
        const existing = itemMap.get(item.id);
        if (existing) {
          existing.count += item.count;
          existing.weight += item.weight * item.count;
        } else {
          itemMap.set(item.id, {
            name: item.name,
            icon: item.icon,
            count: item.count,
            weight: item.weight * item.count,
          });
        }
      });
    });
    return Array.from(itemMap.values());
  }, [state.rooms]);

  // Redirect if no rooms
  if (state.rooms.length === 0) {
    router.push('/funnel/basics');
    return null;
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Room Complete Toast */}
      <RoomCompleteToast roomName={completedRoomToast || ''} show={!!completedRoomToast} />

      {/* Achievement Badge */}
      {currentAchievement && <AchievementBadge achievement={currentAchievement} show={true} />}

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
        <div className={`text-center mb-8 ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-3">
            What&apos;s in each room?
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Don&apos;t worry about every small item — just the big stuff for an accurate estimate
          </p>
          {/* Gamification elements */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <StreakCounter streak={roomStreak} />
            {stats.totalItems > 0 && <MoversWatching itemCount={stats.totalItems} />}
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-8 ${mounted ? 'fade-in-up stagger-1' : 'opacity-0'}`}>
          {/* Room List (Left Sidebar) */}
          <div className="space-y-3 lg:order-1">
            <p className="text-base font-semibold text-muted-foreground px-1 mb-3">Your Rooms</p>
            {state.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSelect={() => handleSelectRoom(room.id)}
                isSelected={selectedRoomId === room.id}
              />
            ))}
          </div>

          {/* Furniture Selector (Center) */}
          <div className="p-6 rounded-2xl bg-white border border-border shadow-sm min-h-[500px] lg:order-2">
            {selectedRoom ? (
              <FurnitureSelector
                room={selectedRoom}
                onUpdateFurniture={handleUpdateFurniture}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
                Select a room to add items
              </div>
            )}
          </div>

          {/* Inventory Breakdown (Right Sidebar) */}
          <div className="space-y-5 lg:order-3">
            {/* Stats Card */}
            <div className="p-5 rounded-2xl bg-muted/50 border border-border">
              <p className="text-base font-semibold text-muted-foreground mb-4">Inventory Summary</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl bg-white">
                  <div className="text-3xl font-bold text-primary">{stats.totalItems}</div>
                  <div className="text-sm text-muted-foreground">Items</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white">
                  <div className="text-3xl font-bold text-primary">{Math.round(stats.totalWeight).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">lbs</div>
                </div>
              </div>
            </div>

            {/* Running Tally */}
            {allSelectedItems.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-border max-h-[350px] overflow-y-auto">
                <p className="text-base font-semibold text-foreground mb-4">All Selected Items</p>
                <div className="space-y-3">
                  {allSelectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">x{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {allSelectedItems.length === 0 && (
              <div className="p-5 rounded-2xl bg-muted/30 border border-dashed border-border text-center">
                <p className="text-base text-muted-foreground">
                  Start adding items from your rooms to see them here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/funnel/basics')}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            Back
          </button>
          <div className="flex items-center gap-4">
            <p className="text-base text-muted-foreground hidden sm:block">
              Next: Add special items (pianos, antiques, etc.)
            </p>
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
    </div>
  );
}
