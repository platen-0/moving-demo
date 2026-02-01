// ============================================================
// Core Types for Moving Services Funnel
// ============================================================

// ============== Address & Location ==============

export interface Address {
  street?: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  lat?: number;
  lng?: number;
}

export interface RouteInfo {
  distance: number; // miles
  duration: number; // hours
  isLongDistance: boolean; // > 100 miles
}

// ============== Move Basics ==============

export type HomeSize = 'studio' | '1br' | '2br' | '3br' | '4br_plus';

export interface MoveBasics {
  fromAddress: Address | null;
  toAddress: Address | null;
  routeInfo: RouteInfo | null;
  moveDate: string | null; // ISO date string
  isFlexible: boolean;
  homeSize: HomeSize | null;
}

// ============== Inventory ==============

export type RoomType =
  | 'living_room'
  | 'master_bedroom'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'dining_room'
  | 'office'
  | 'garage'
  | 'basement'
  | 'attic'
  | 'laundry'
  | 'other';

export interface FurnitureItem {
  id: string;
  name: string;
  icon: string;
  category: 'furniture' | 'appliance' | 'electronics' | 'other';
  size?: 'small' | 'medium' | 'large' | 'extra_large';
  weight: number; // lbs
  volume: number; // cubic feet
  count: number;
  aiSuggested?: boolean;
}

export interface BoxEstimates {
  clothes_linens: number;
  books_media: number;
  decor_misc: number;
  fragile: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  status: 'not_started' | 'in_progress' | 'complete';
  furniture: FurnitureItem[];
  boxes: BoxEstimates;
}

// ============== Special Items ==============

export interface SpecialItem {
  id: string;
  name: string;
  category: 'large_heavy' | 'fragile_valuable' | 'outdoor';
  priceRange: { min: number; max: number };
  selected: boolean;
  quantity: number;
}

// ============== Services ==============

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  priceRange: { min: number; max: number };
  selected: boolean;
  subOptions?: {
    id: string;
    label: string;
    priceRange: { min: number; max: number };
    selected: boolean;
  }[];
}

// ============== Estimates ==============

export interface CostBreakdown {
  baseCost: number;
  packingCost: number;
  specialItemsCost: number;
  servicesCost: number;
  total: number;
}

export interface MoveEstimate {
  totalItems: number;
  totalBoxes: number;
  totalWeight: number; // lbs
  totalVolume: number; // cubic feet
  costRange: { min: number; max: number };
  costBreakdown: CostBreakdown;
  complexityScore: number; // 1-10
}

export interface BoxCounts {
  small: number;
  medium: number;
  large: number;
  wardrobe: number;
  total: number;
}

// ============== Contact & Movers ==============

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ContactPreferences {
  method: 'call' | 'text' | 'email';
  bestTime: 'morning' | 'afternoon' | 'evening' | 'anytime';
  consentToContact: boolean;
}

export interface Mover {
  id: string;
  name: string;
  logo: string;
  specialty: string;
  quoteRange: { min: number; max: number };
  matchScore: number;
  matchReasons: string[];
  rating: number;
  reviewCount: number;
  credentials: string[];
  availableOnDate: boolean;
}

// ============== Full State ==============

export interface MoveState {
  // Progress
  currentStep: string;
  completedSteps: string[];

  // Move basics
  basics: MoveBasics;

  // Inventory
  rooms: Room[];

  // Special items & services
  specialItems: SpecialItem[];
  services: AdditionalService[];

  // Estimates
  estimate: MoveEstimate | null;
  boxCounts: BoxCounts | null;

  // Contact
  contactInfo: ContactInfo | null;
  contactPreferences: ContactPreferences;

  // Movers
  selectedMovers: string[];

  // Engagement tracking
  exitIntentShown: boolean;
  emailCaptured: boolean;
  capturedEmail: string;

  // AI
  aiInsight: string | null;
}

// ============== Chat ==============

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ============== API Response Types ==============

export interface GeocodeResponse {
  success: boolean;
  address?: Address;
  error?: string;
}

export interface RouteResponse {
  success: boolean;
  route?: RouteInfo;
  error?: string;
}

export interface RoomScanResponse {
  success: boolean;
  roomType?: RoomType;
  furniture?: { item: string; size?: string; quantity: number }[];
  estimatedBoxes?: Partial<BoxEstimates>;
  confidence?: number;
  notes?: string;
  error?: string;
}

export interface EstimateResponse {
  success: boolean;
  estimate?: MoveEstimate;
  boxCounts?: BoxCounts;
  error?: string;
}
