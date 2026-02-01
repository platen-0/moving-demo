import type { SpecialItem, AdditionalService, RoomType, FurnitureItem, Mover } from '@/types';

// ============== Home Size Presets ==============

export const HOME_SIZE_CONFIG: Record<string, { label: string; icon: string; rooms: { name: string; type: RoomType }[]; estimateRange: { min: number; max: number } }> = {
  studio: {
    label: 'Studio',
    icon: '🏠',
    rooms: [
      { name: 'Living/Bedroom', type: 'living_room' },
      { name: 'Kitchen', type: 'kitchen' },
      { name: 'Bathroom', type: 'bathroom' },
    ],
    estimateRange: { min: 600, max: 1200 },
  },
  '1br': {
    label: '1 Bedroom',
    icon: '🏠',
    rooms: [
      { name: 'Living Room', type: 'living_room' },
      { name: 'Bedroom', type: 'bedroom' },
      { name: 'Kitchen', type: 'kitchen' },
      { name: 'Bathroom', type: 'bathroom' },
    ],
    estimateRange: { min: 1000, max: 1800 },
  },
  '2br': {
    label: '2 Bedroom',
    icon: '🏠',
    rooms: [
      { name: 'Living Room', type: 'living_room' },
      { name: 'Master Bedroom', type: 'master_bedroom' },
      { name: 'Bedroom 2', type: 'bedroom' },
      { name: 'Kitchen', type: 'kitchen' },
      { name: 'Bathroom', type: 'bathroom' },
    ],
    estimateRange: { min: 1800, max: 2800 },
  },
  '3br': {
    label: '3 Bedroom',
    icon: '🏠',
    rooms: [
      { name: 'Living Room', type: 'living_room' },
      { name: 'Master Bedroom', type: 'master_bedroom' },
      { name: 'Bedroom 2', type: 'bedroom' },
      { name: 'Bedroom 3', type: 'bedroom' },
      { name: 'Kitchen', type: 'kitchen' },
      { name: 'Bathroom 1', type: 'bathroom' },
      { name: 'Bathroom 2', type: 'bathroom' },
      { name: 'Garage', type: 'garage' },
    ],
    estimateRange: { min: 2800, max: 4200 },
  },
  '4br_plus': {
    label: '4+ Bedroom',
    icon: '🏠',
    rooms: [
      { name: 'Living Room', type: 'living_room' },
      { name: 'Master Bedroom', type: 'master_bedroom' },
      { name: 'Bedroom 2', type: 'bedroom' },
      { name: 'Bedroom 3', type: 'bedroom' },
      { name: 'Bedroom 4', type: 'bedroom' },
      { name: 'Kitchen', type: 'kitchen' },
      { name: 'Bathroom 1', type: 'bathroom' },
      { name: 'Bathroom 2', type: 'bathroom' },
      { name: 'Dining Room', type: 'dining_room' },
      { name: 'Office', type: 'office' },
      { name: 'Garage', type: 'garage' },
    ],
    estimateRange: { min: 4000, max: 6500 },
  },
};

// ============== Furniture Items by Room Type ==============

export const FURNITURE_BY_ROOM: Record<RoomType, Omit<FurnitureItem, 'count' | 'aiSuggested'>[]> = {
  living_room: [
    { id: 'sofa_3seat', name: 'Sofa (3-seat)', icon: '🛋️', category: 'furniture', size: 'large', weight: 280, volume: 60 },
    { id: 'sofa_2seat', name: 'Loveseat', icon: '🛋️', category: 'furniture', size: 'medium', weight: 180, volume: 40 },
    { id: 'armchair', name: 'Armchair', icon: '🪑', category: 'furniture', size: 'medium', weight: 80, volume: 25 },
    { id: 'coffee_table', name: 'Coffee Table', icon: '🪵', category: 'furniture', size: 'medium', weight: 50, volume: 15 },
    { id: 'end_table', name: 'End Table', icon: '🪵', category: 'furniture', size: 'small', weight: 30, volume: 8 },
    { id: 'bookshelf', name: 'Bookshelf', icon: '📚', category: 'furniture', size: 'large', weight: 100, volume: 30 },
    { id: 'tv_stand', name: 'TV Stand', icon: '📺', category: 'furniture', size: 'medium', weight: 60, volume: 20 },
    { id: 'tv_large', name: 'TV (50"+)', icon: '📺', category: 'electronics', size: 'large', weight: 50, volume: 10 },
    { id: 'tv_small', name: 'TV (under 50")', icon: '📺', category: 'electronics', size: 'medium', weight: 30, volume: 6 },
    { id: 'floor_lamp', name: 'Floor Lamp', icon: '💡', category: 'other', size: 'small', weight: 15, volume: 5 },
    { id: 'rug_large', name: 'Area Rug', icon: '🟫', category: 'other', size: 'medium', weight: 40, volume: 8 },
  ],
  master_bedroom: [
    { id: 'bed_king', name: 'Bed (King)', icon: '🛏️', category: 'furniture', size: 'extra_large', weight: 180, volume: 100 },
    { id: 'bed_queen', name: 'Bed (Queen)', icon: '🛏️', category: 'furniture', size: 'large', weight: 140, volume: 80 },
    { id: 'dresser', name: 'Dresser', icon: '🗄️', category: 'furniture', size: 'large', weight: 120, volume: 35 },
    { id: 'nightstand', name: 'Nightstand', icon: '🗄️', category: 'furniture', size: 'small', weight: 35, volume: 10 },
    { id: 'armoire', name: 'Armoire', icon: '🚪', category: 'furniture', size: 'extra_large', weight: 200, volume: 60 },
    { id: 'vanity', name: 'Vanity/Desk', icon: '💄', category: 'furniture', size: 'medium', weight: 80, volume: 25 },
    { id: 'mirror_full', name: 'Full Mirror', icon: '🪞', category: 'other', size: 'medium', weight: 40, volume: 8 },
    { id: 'table_lamp', name: 'Table Lamp', icon: '💡', category: 'other', size: 'small', weight: 8, volume: 3 },
  ],
  bedroom: [
    { id: 'bed_queen', name: 'Bed (Queen)', icon: '🛏️', category: 'furniture', size: 'large', weight: 140, volume: 80 },
    { id: 'bed_full', name: 'Bed (Full)', icon: '🛏️', category: 'furniture', size: 'medium', weight: 120, volume: 65 },
    { id: 'bed_twin', name: 'Bed (Twin)', icon: '🛏️', category: 'furniture', size: 'small', weight: 80, volume: 45 },
    { id: 'dresser', name: 'Dresser', icon: '🗄️', category: 'furniture', size: 'large', weight: 120, volume: 35 },
    { id: 'nightstand', name: 'Nightstand', icon: '🗄️', category: 'furniture', size: 'small', weight: 35, volume: 10 },
    { id: 'desk', name: 'Desk', icon: '🖥️', category: 'furniture', size: 'medium', weight: 80, volume: 25 },
    { id: 'desk_chair', name: 'Desk Chair', icon: '🪑', category: 'furniture', size: 'small', weight: 30, volume: 12 },
    { id: 'bookshelf_small', name: 'Small Bookshelf', icon: '📚', category: 'furniture', size: 'medium', weight: 60, volume: 18 },
  ],
  kitchen: [
    { id: 'dining_table', name: 'Dining Table', icon: '🪑', category: 'furniture', size: 'large', weight: 120, volume: 40 },
    { id: 'dining_chair', name: 'Dining Chair', icon: '🪑', category: 'furniture', size: 'small', weight: 20, volume: 8 },
    { id: 'kitchen_cart', name: 'Kitchen Cart', icon: '🛒', category: 'furniture', size: 'medium', weight: 50, volume: 15 },
    { id: 'bar_stool', name: 'Bar Stool', icon: '🪑', category: 'furniture', size: 'small', weight: 25, volume: 10 },
    { id: 'microwave', name: 'Microwave', icon: '📻', category: 'appliance', size: 'small', weight: 35, volume: 4 },
    { id: 'toaster_oven', name: 'Toaster Oven', icon: '🍞', category: 'appliance', size: 'small', weight: 15, volume: 2 },
    { id: 'coffee_maker', name: 'Coffee Maker', icon: '☕', category: 'appliance', size: 'small', weight: 10, volume: 2 },
  ],
  bathroom: [
    { id: 'bathroom_cabinet', name: 'Storage Cabinet', icon: '🗄️', category: 'furniture', size: 'small', weight: 40, volume: 12 },
    { id: 'hamper', name: 'Laundry Hamper', icon: '🧺', category: 'other', size: 'small', weight: 10, volume: 6 },
  ],
  dining_room: [
    { id: 'dining_table_large', name: 'Dining Table (6+)', icon: '🪑', category: 'furniture', size: 'extra_large', weight: 180, volume: 60 },
    { id: 'dining_table', name: 'Dining Table (4)', icon: '🪑', category: 'furniture', size: 'large', weight: 120, volume: 40 },
    { id: 'dining_chair', name: 'Dining Chair', icon: '🪑', category: 'furniture', size: 'small', weight: 20, volume: 8 },
    { id: 'china_cabinet', name: 'China Cabinet', icon: '🗄️', category: 'furniture', size: 'extra_large', weight: 200, volume: 50 },
    { id: 'buffet', name: 'Buffet/Sideboard', icon: '🗄️', category: 'furniture', size: 'large', weight: 150, volume: 40 },
  ],
  office: [
    { id: 'desk_large', name: 'Office Desk', icon: '🖥️', category: 'furniture', size: 'large', weight: 100, volume: 35 },
    { id: 'desk', name: 'Small Desk', icon: '🖥️', category: 'furniture', size: 'medium', weight: 80, volume: 25 },
    { id: 'office_chair', name: 'Office Chair', icon: '🪑', category: 'furniture', size: 'medium', weight: 40, volume: 15 },
    { id: 'filing_cabinet', name: 'Filing Cabinet', icon: '🗄️', category: 'furniture', size: 'medium', weight: 80, volume: 12 },
    { id: 'bookshelf', name: 'Bookshelf', icon: '📚', category: 'furniture', size: 'large', weight: 100, volume: 30 },
    { id: 'computer', name: 'Desktop Computer', icon: '🖥️', category: 'electronics', size: 'small', weight: 30, volume: 5 },
    { id: 'monitor', name: 'Monitor', icon: '🖥️', category: 'electronics', size: 'small', weight: 15, volume: 4 },
    { id: 'printer', name: 'Printer', icon: '🖨️', category: 'electronics', size: 'small', weight: 25, volume: 4 },
  ],
  garage: [
    { id: 'tool_chest', name: 'Tool Chest', icon: '🧰', category: 'other', size: 'large', weight: 150, volume: 25 },
    { id: 'workbench', name: 'Workbench', icon: '🔧', category: 'furniture', size: 'large', weight: 100, volume: 30 },
    { id: 'shelving_unit', name: 'Shelving Unit', icon: '🗄️', category: 'furniture', size: 'large', weight: 60, volume: 25 },
    { id: 'lawn_mower', name: 'Push Mower', icon: '🌱', category: 'other', size: 'medium', weight: 70, volume: 15 },
    { id: 'bicycle', name: 'Bicycle', icon: '🚲', category: 'other', size: 'medium', weight: 30, volume: 20 },
    { id: 'grill', name: 'BBQ Grill', icon: '🍖', category: 'other', size: 'large', weight: 100, volume: 30 },
  ],
  basement: [
    { id: 'shelving_unit', name: 'Shelving Unit', icon: '🗄️', category: 'furniture', size: 'large', weight: 60, volume: 25 },
    { id: 'storage_bin', name: 'Storage Bins (set)', icon: '📦', category: 'other', size: 'medium', weight: 30, volume: 15 },
    { id: 'exercise_bike', name: 'Exercise Bike', icon: '🚴', category: 'other', size: 'medium', weight: 80, volume: 20 },
    { id: 'treadmill', name: 'Treadmill', icon: '🏃', category: 'other', size: 'extra_large', weight: 200, volume: 40 },
    { id: 'weight_bench', name: 'Weight Bench', icon: '🏋️', category: 'other', size: 'large', weight: 100, volume: 25 },
  ],
  attic: [
    { id: 'storage_bin', name: 'Storage Bins (set)', icon: '📦', category: 'other', size: 'medium', weight: 30, volume: 15 },
  ],
  laundry: [
    { id: 'washer', name: 'Washer', icon: '🧺', category: 'appliance', size: 'large', weight: 150, volume: 25 },
    { id: 'dryer', name: 'Dryer', icon: '🌀', category: 'appliance', size: 'large', weight: 125, volume: 25 },
    { id: 'laundry_shelf', name: 'Shelving', icon: '🗄️', category: 'furniture', size: 'medium', weight: 40, volume: 15 },
  ],
  other: [
    { id: 'misc_furniture', name: 'Misc Furniture', icon: '🪑', category: 'furniture', size: 'medium', weight: 50, volume: 20 },
    { id: 'misc_boxes', name: 'Misc Items', icon: '📦', category: 'other', size: 'small', weight: 25, volume: 10 },
  ],
};

// ============== Special Items ==============

export const DEFAULT_SPECIAL_ITEMS: SpecialItem[] = [
  // Large & Heavy
  { id: 'piano_upright', name: 'Piano (upright)', category: 'large_heavy', priceRange: { min: 200, max: 400 }, selected: false, quantity: 1 },
  { id: 'piano_grand', name: 'Piano (grand)', category: 'large_heavy', priceRange: { min: 400, max: 800 }, selected: false, quantity: 1 },
  { id: 'pool_table', name: 'Pool Table', category: 'large_heavy', priceRange: { min: 300, max: 500 }, selected: false, quantity: 1 },
  { id: 'safe_heavy', name: 'Safe (heavy)', category: 'large_heavy', priceRange: { min: 150, max: 300 }, selected: false, quantity: 1 },
  { id: 'hot_tub', name: 'Hot Tub', category: 'large_heavy', priceRange: { min: 400, max: 600 }, selected: false, quantity: 1 },
  { id: 'gym_equipment', name: 'Gym Equipment', category: 'large_heavy', priceRange: { min: 100, max: 200 }, selected: false, quantity: 1 },

  // Fragile & Valuable
  { id: 'artwork_large', name: 'Artwork (large)', category: 'fragile_valuable', priceRange: { min: 50, max: 150 }, selected: false, quantity: 1 },
  { id: 'antiques', name: 'Antiques', category: 'fragile_valuable', priceRange: { min: 100, max: 300 }, selected: false, quantity: 1 },
  { id: 'wine_collection', name: 'Wine Collection', category: 'fragile_valuable', priceRange: { min: 50, max: 200 }, selected: false, quantity: 1 },
  { id: 'chandelier', name: 'Chandelier', category: 'fragile_valuable', priceRange: { min: 75, max: 150 }, selected: false, quantity: 1 },
  { id: 'aquarium', name: 'Aquarium', category: 'fragile_valuable', priceRange: { min: 100, max: 250 }, selected: false, quantity: 1 },

  // Outdoor
  { id: 'riding_mower', name: 'Riding Mower', category: 'outdoor', priceRange: { min: 100, max: 200 }, selected: false, quantity: 1 },
  { id: 'motorcycle', name: 'Motorcycle', category: 'outdoor', priceRange: { min: 150, max: 300 }, selected: false, quantity: 1 },
  { id: 'large_plants', name: 'Large Plants', category: 'outdoor', priceRange: { min: 30, max: 50 }, selected: false, quantity: 1 },
  { id: 'swing_set', name: 'Swing Set', category: 'outdoor', priceRange: { min: 150, max: 300 }, selected: false, quantity: 1 },
];

// ============== Additional Services ==============

export const DEFAULT_SERVICES: AdditionalService[] = [
  {
    id: 'packing_full',
    name: 'Full Packing Service',
    description: 'Movers pack all your belongings professionally',
    priceRange: { min: 300, max: 600 },
    selected: true, // Pre-checked per engagement spec
  },
  {
    id: 'packing_partial',
    name: 'Partial Packing',
    description: 'Kitchen and fragile items only',
    priceRange: { min: 150, max: 300 },
    selected: false,
  },
  {
    id: 'unpacking',
    name: 'Unpacking Service',
    description: 'Movers unpack and set up at destination',
    priceRange: { min: 200, max: 400 },
    selected: false,
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Temporary storage if needed',
    priceRange: { min: 200, max: 400 },
    selected: false,
    subOptions: [
      { id: 'storage_short', label: 'Short-term (< 1 month)', priceRange: { min: 200, max: 400 }, selected: false },
      { id: 'storage_long', label: 'Long-term (1+ months)', priceRange: { min: 150, max: 250 }, selected: false },
    ],
  },
  {
    id: 'assembly',
    name: 'Furniture Disassembly/Reassembly',
    description: 'Beds, tables, shelving units',
    priceRange: { min: 100, max: 200 },
    selected: false,
  },
];

// ============== Progress Configuration ==============

export const STEP_CONFIG: Record<string, { progress: number; label: string }> = {
  basics: { progress: 15, label: 'Your Rooms' },
  inventory: { progress: 30, label: 'Your Inventory' },
  'special-items': { progress: 45, label: 'Special Items' },
  location: { progress: 60, label: 'Your Route' },
  services: { progress: 75, label: 'Services' },
  summary: { progress: 88, label: 'Your Move Plan' },
  contact: { progress: 96, label: 'Get Quotes' },
  quotes: { progress: 100, label: 'Your Quotes' },
};

// ============== Movers (Mock Data) ==============

export const MOCK_MOVERS: Mover[] = [
  {
    id: 'two_men_truck',
    name: 'Two Men and a Truck',
    logo: '/logos/two-men.jpg',
    specialty: 'Long-distance specialists',
    quoteRange: { min: 2400, max: 2800 },
    matchScore: 94,
    matchReasons: [
      'Highly rated for your route',
      'Piano moving specialists on staff',
      'Available on your date',
      'Includes packing service',
    ],
    rating: 4.8,
    reviewCount: 2340,
    credentials: ['A+ BBB', 'Licensed & Insured'],
    availableOnDate: true,
  },
  {
    id: 'allied',
    name: 'Allied Van Lines',
    logo: '/logos/allied.png',
    specialty: 'Full-service moving',
    quoteRange: { min: 2600, max: 3200 },
    matchScore: 88,
    matchReasons: [
      'National network coverage',
      'Premium packing materials',
      'Tracking technology',
    ],
    rating: 4.6,
    reviewCount: 1890,
    credentials: ['A+ BBB', 'ProMover Certified'],
    availableOnDate: true,
  },
  {
    id: 'college_hunks',
    name: 'College Hunks',
    logo: '/logos/college-hunks.png',
    specialty: 'Local & long-distance',
    quoteRange: { min: 2200, max: 2600 },
    matchScore: 85,
    matchReasons: [
      'Competitive pricing',
      'Eco-friendly options',
      'Junk removal available',
    ],
    rating: 4.5,
    reviewCount: 3200,
    credentials: ['Licensed & Insured'],
    availableOnDate: true,
  },
  {
    id: 'local_movers',
    name: 'Austin Pro Moving',
    logo: '/logos/austin-pro-moving.png',
    specialty: 'Local experts',
    quoteRange: { min: 2100, max: 2500 },
    matchScore: 82,
    matchReasons: [
      'Local expertise',
      'Flexible scheduling',
      'Family-owned business',
    ],
    rating: 4.7,
    reviewCount: 890,
    credentials: ['Licensed & Insured', 'Local Chamber Member'],
    availableOnDate: true,
  },
];

// ============== Activity Ticker ==============

export const TICKER_NAMES = [
  'Sarah', 'Mike', 'Jennifer', 'David', 'Amanda',
  'Chris', 'Lisa', 'Marcus', 'Emily', 'Jason',
  'Rachel', 'Kevin', 'Nicole', 'Brandon', 'Ashley',
];

export const TICKER_CITIES = [
  'Austin', 'Denver', 'Phoenix', 'Portland', 'Seattle',
  'Nashville', 'Charlotte', 'Atlanta', 'Dallas', 'Chicago',
  'NYC', 'Boston', 'Miami', 'San Diego', 'Minneapolis',
];

export const TICKER_DESTINATIONS = [
  'Denver', 'Austin', 'Phoenix', 'Seattle', 'Portland',
  'Nashville', 'Atlanta', 'Charlotte', 'Dallas', 'Chicago',
  'Boston', 'Tampa', 'San Francisco', 'Raleigh', 'Salt Lake City',
];

// ============== Seasonal Messages ==============

export function getSeasonalBanner(): { message: string; icon: string } | null {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // End of month (last 5 days)
  const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();
  if (day > daysInMonth - 5) {
    return {
      message: 'End-of-month moves book fast — plan early',
      icon: '📅',
    };
  }

  // Summer (May-August) - peak season
  if (month >= 4 && month <= 7) {
    return {
      message: 'Peak moving season! Book 4-6 weeks ahead for best rates',
      icon: '🚚',
    };
  }

  // Winter (November-February) - lower rates
  if (month >= 10 || month <= 1) {
    return {
      message: 'Winter rates are 20-30% lower — great time to move',
      icon: '❄️',
    };
  }

  return null;
}

// ============== Box Weights ==============

export const BOX_WEIGHTS = {
  small: 30,    // Books, heavy items
  medium: 25,   // General items
  large: 15,    // Light, bulky items
  wardrobe: 35, // Full of clothes
};
