import { HOME_SIZE_CONFIG, BOX_WEIGHTS } from './constants';
import type { Room, SpecialItem, AdditionalService, MoveEstimate, BoxCounts, MoveState } from '@/types';

/**
 * Calculate total items from rooms.
 */
export function calculateTotalItems(rooms: Room[]): number {
  return rooms.reduce(
    (sum, room) => sum + room.furniture.reduce((s, f) => s + f.count, 0),
    0
  );
}

/**
 * Calculate total weight from rooms.
 */
export function calculateTotalWeight(rooms: Room[]): number {
  return rooms.reduce(
    (sum, room) => sum + room.furniture.reduce((s, f) => s + f.weight * f.count, 0),
    0
  );
}

/**
 * Calculate total volume from rooms.
 */
export function calculateTotalVolume(rooms: Room[]): number {
  return rooms.reduce(
    (sum, room) => sum + room.furniture.reduce((s, f) => s + f.volume * f.count, 0),
    0
  );
}

/**
 * Estimate box counts based on home size.
 */
export function estimateBoxCounts(homeSize: string): BoxCounts {
  const multiplier = {
    studio: 1,
    '1br': 1.5,
    '2br': 2,
    '3br': 3,
    '4br_plus': 4,
  }[homeSize] || 2;

  const boxes = {
    small: Math.ceil(10 * multiplier),
    medium: Math.ceil(15 * multiplier),
    large: Math.ceil(8 * multiplier),
    wardrobe: Math.ceil(2 * multiplier),
    total: 0,
  };
  boxes.total = boxes.small + boxes.medium + boxes.large + boxes.wardrobe;

  return boxes;
}

/**
 * Calculate box weight from box counts.
 */
export function calculateBoxWeight(boxes: BoxCounts): number {
  return (
    boxes.small * BOX_WEIGHTS.small +
    boxes.medium * BOX_WEIGHTS.medium +
    boxes.large * BOX_WEIGHTS.large +
    boxes.wardrobe * BOX_WEIGHTS.wardrobe
  );
}

/**
 * Calculate special items cost.
 */
export function calculateSpecialItemsCost(specialItems: SpecialItem[]): number {
  return specialItems
    .filter((i) => i.selected)
    .reduce((sum, item) => sum + ((item.priceRange.min + item.priceRange.max) / 2) * item.quantity, 0);
}

/**
 * Calculate services cost.
 */
export function calculateServicesCost(services: AdditionalService[]): number {
  return services
    .filter((s) => s.selected)
    .reduce((sum, service) => {
      if (service.subOptions?.some((sub) => sub.selected)) {
        return sum + service.subOptions
          .filter((sub) => sub.selected)
          .reduce((s, sub) => s + (sub.priceRange.min + sub.priceRange.max) / 2, 0);
      }
      return sum + (service.priceRange.min + service.priceRange.max) / 2;
    }, 0);
}

/**
 * Generate full move estimate.
 */
export function generateMoveEstimate(state: MoveState): MoveEstimate {
  const totalItems = calculateTotalItems(state.rooms);
  const totalWeight = calculateTotalWeight(state.rooms);
  const totalVolume = calculateTotalVolume(state.rooms);

  const boxes = estimateBoxCounts(state.basics.homeSize || '2br');
  const boxWeight = calculateBoxWeight(boxes);

  const specialItemsCost = calculateSpecialItemsCost(state.specialItems);
  const servicesCost = calculateServicesCost(state.services);

  const baseRange = HOME_SIZE_CONFIG[state.basics.homeSize || '2br']?.estimateRange || { min: 1500, max: 3000 };
  const baseCost = (baseRange.min + baseRange.max) / 2;

  const totalMin = baseRange.min + specialItemsCost * 0.8 + servicesCost * 0.8;
  const totalMax = baseRange.max + specialItemsCost * 1.2 + servicesCost * 1.2;

  return {
    totalItems,
    totalBoxes: boxes.total,
    totalWeight: totalWeight + boxWeight,
    totalVolume,
    costRange: { min: Math.round(totalMin), max: Math.round(totalMax) },
    costBreakdown: {
      baseCost,
      packingCost: 0,
      specialItemsCost,
      servicesCost,
      total: (totalMin + totalMax) / 2,
    },
    complexityScore: Math.min(10, Math.ceil(totalItems / 20) + (specialItemsCost > 0 ? 2 : 0)),
  };
}

/**
 * Format currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency with cents.
 */
export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get a future date string from today + days.
 */
export function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Calculate days until a date.
 */
export function daysUntil(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
