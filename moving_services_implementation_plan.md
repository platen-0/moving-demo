# Moving Services Lead Generation Funnel: Implementation Plan
## Technical Specification for Claude Code

---

## Project Overview

**What we're building:** A delightful, interactive moving quote funnel that feels like a useful planning tool rather than a lead form. Users build their move visually, see real-time estimates, and feel prepared — then connect with movers who already understand their needs.

**Core thesis:** Moving is stressful. A funnel that reduces stress by providing clarity, organization, and a sense of control will dramatically outperform traditional "fill out this form, get 10 calls" experiences.

**Key messaging frame:** "Don't get ripped off calling movers one by one. Get top movers competing for YOUR business in one place — and keep your move plan whether you book or not."

**The "Keep Your Data" Promise:**
Unlike traditional lead gen where users give data and get nothing back, we flip the script:
- Users build a comprehensive move plan (inventory, timeline, box estimates)
- This plan is THEIRS — they can download/email it regardless of whether they request mover quotes
- The report has standalone value (worth $50-100 if they paid a move consultant)
- This builds trust, reduces friction at conversion, and creates a nurture path for non-converters

**Key differentiators:**
1. **Visual Move Builder** — Interactive room-by-room inventory with drag-and-drop
2. **AI Room Scanner** — Upload a photo, get instant inventory estimate
3. **Live Cost Estimator** — Watch your quote update as you add items
4. **Move Complexity Score** — Gamified assessment that educates while qualifying
5. **Route Visualization** — See your move on a map with distance/time
6. **Smart Packing Planner** — AI-generated timeline and box estimates

**Tech stack:**
- Frontend: Next.js 14+ with App Router
- Styling: Tailwind CSS + shadcn/ui + Framer Motion (animations)
- State: React Context + localStorage
- Maps: Google Maps JavaScript API (or Mapbox)
- Charts: Recharts
- AI: Claude API (room scanning, chat, recommendations)
- Drag & Drop: dnd-kit
- Deployment: Vercel

**Demo scope:** Fully interactive frontend with mocked mover data. AI features use real Claude API. Map integration with real geocoding.

---

## File Structure

```
/moving-quote-demo
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   ├── globals.css
│   ├── funnel/
│   │   ├── layout.tsx              # Funnel layout (progress, sidebar)
│   │   ├── basics/page.tsx         # Move basics (from/to, date, size)
│   │   ├── inventory/page.tsx      # Room-by-room inventory builder
│   │   ├── special-items/page.tsx  # Special handling items
│   │   ├── services/page.tsx       # Additional services selection
│   │   ├── summary/page.tsx        # Move summary + estimate
│   │   ├── contact/page.tsx        # Contact information
│   │   └── quotes/page.tsx         # Mover quotes/matches
│   └── api/
│       ├── geocode/route.ts        # Address geocoding
│       ├── estimate/route.ts       # Cost estimation
│       ├── scan-room/route.ts      # AI room photo analysis
│       ├── chat/route.ts           # AI moving assistant
│       └── generate-checklist/route.ts
├── components/
│   ├── ui/                         # shadcn components
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── MovingTicker.tsx
│   │   ├── TestimonialCards.tsx
│   │   └── SeasonalBanner.tsx
│   ├── funnel/
│   │   ├── ProgressSidebar.tsx
│   │   ├── AddressInput.tsx
│   │   ├── RouteMap.tsx
│   │   ├── MoveDatePicker.tsx
│   │   ├── HomeSizeSelector.tsx
│   │   ├── RoomSelector.tsx
│   │   ├── RoomInventory.tsx
│   │   ├── ItemCard.tsx
│   │   ├── DraggableFurniture.tsx
│   │   ├── RoomPhotoUploader.tsx
│   │   ├── SpecialItemsGrid.tsx
│   │   ├── ServicesChecklist.tsx
│   │   ├── LiveEstimateBar.tsx
│   │   ├── MoveSummaryCard.tsx
│   │   ├── ComplexityMeter.tsx
│   │   ├── BoxEstimator.tsx
│   │   ├── PackingTimeline.tsx
│   │   ├── MoverCard.tsx
│   │   └── MovingAssistant.tsx
│   ├── engagement/
│   │   ├── ExitIntentModal.tsx
│   │   ├── RoomBadge.tsx
│   │   ├── ProgressCelebration.tsx
│   │   └── UrgencyBanner.tsx
│   └── shared/
│       ├── Button.tsx
│       ├── Slider.tsx
│       ├── Counter.tsx
│       └── Modal.tsx
├── lib/
│   ├── constants.ts                # Room types, furniture items, etc.
│   ├── calculations.ts             # Weight, volume, cost calculations
│   ├── inventory.ts                # Inventory management utilities
│   └── maps.ts                     # Google Maps helpers
├── context/
│   └── MoveContext.tsx
├── hooks/
│   ├── useEstimate.ts
│   ├── useGeocoding.ts
│   └── useRoomProgress.ts
└── types/
    └── index.ts
```

---

## The Funnel Philosophy: "Plan Your Move"

Traditional moving lead gen: "Enter your info, get quotes"
Our approach: **"Plan your move — and get quotes from movers who already understand it"**

The user isn't filling out a form. They're using a **move planning tool** that happens to connect them with movers at the end. This reframing changes everything:

- Adding inventory = planning, not data extraction
- The estimate = useful information, not bait
- Contact info = "send my plan to movers," not "sell my data"

---

## Screen-by-Screen Implementation

---

### LANDING PAGE (`app/page.tsx`)

**Purpose:** Capture attention, establish the tool-first value prop, drive to move planner

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ [HEADER: Logo | "Summer 2025 Rates" | ★ 4.8 Rating]                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [SEASONAL BANNER - if applicable]                                  │
│  "🚚 Summer moving season is here! Book early for best rates"      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [HERO SECTION]                                                     │
│                                                                     │
│  "Stop calling movers one by one."                                 │
│  "Make them compete for you instead."                              │
│                                                                     │
│  Plan your move in minutes. Get quotes from top-rated movers       │
│  competing for your business — and keep your move plan forever,    │
│  whether you book or not.                                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  Where are you moving from?                                 │   │
│  │  [📍 Enter address or zip code________________] [autocomplete]│   │
│  │                                                              │   │
│  │  Where are you moving to?                                   │   │
│  │  [📍 Enter address or zip code________________]              │   │
│  │                                                              │   │
│  │  [Start My Move Plan →]                                     │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ✓ Free move plan you keep forever                                 │
│  ✓ Top movers compete — you save                                   │
│  ✓ No obligation, no spam                                          │
│                                                                     │
│  "2,847 moves planned this week" [animated ticker]                 │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [HOW IT WORKS - 4 steps with icons]                               │
│                                                                     │
│  📦 Build your inventory    🧮 Get your move plan                  │
│  Add rooms & items          Boxes, costs, timeline                 │
│  (takes ~4 minutes)         (yours to keep forever)                │
│                                                                     │
│  🏆 Movers compete for you  💰 You save time & money              │
│  Top-rated movers bid       No calling around, no                  │
│  on YOUR move               getting ripped off                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [LIVE ACTIVITY FEED]                                              │
│                                                                     │
│  "Sarah in Austin just planned a 2BR move to Denver — $2,340"      │
│  "Mike's 3BR move from NYC to Boston: 127 items, 4 hours"          │
│  "Jennifer saved $800 comparing 4 mover quotes"                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [TESTIMONIALS - 3 cards]                                          │
│                                                                     │
│  "I was quoted $3,200 by a mover I called directly. Posted my      │
│   move here and got 4 quotes — ended up paying $2,450. Same move!" │
│   — Amanda K., moved from Chicago to Nashville                     │
│                                                                     │
│  "The move plan alone was worth it. I used the box estimates and   │
│   packing timeline even though I ended up using a friend's truck." │
│   — Marcus T., Austin                                              │
│                                                                     │
│  "Calling movers individually was a nightmare. Here, I filled out  │
│   my inventory once and had 4 companies competing. So much easier."│
│   — Jennifer L., Denver                                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [TRUST BAR]                                                        │
│  "500,000+ moves planned" | "4,200+ verified movers" | "4.8★"      │
│  [Logos: BBB, Yelp, Google Reviews]                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [SECONDARY CTA]                                                    │
│  "Ready to plan your move?" [Start Free Move Planner]              │
└─────────────────────────────────────────────────────────────────────┘
```

#### Components to Build

**1. `SeasonalBanner.tsx`**
```typescript
// Dynamic urgency based on time of year
// 
// Summer (May-Aug): "🚚 Peak moving season! Book 4-6 weeks ahead for best rates"
// End of month: "📅 End-of-month moves book fast — plan early"
// Winter (Nov-Feb): "❄️ Winter rates are 20-30% lower — great time to move"
// Default: "🏠 Over 500,000 moves planned — join them"
//
// This is REAL urgency (seasonal pricing is genuine)
// Not manufactured (no fake countdown)
```

**2. `HeroSection.tsx` with Embedded Address Inputs**
```typescript
interface HeroSectionProps {
  onStartPlan: (from: string, to: string) => void;
}

// Features:
// - Google Places Autocomplete on both address fields
// - Validates addresses before proceeding
// - "Start My Move Plan" enabled when both addresses valid
// - Shows distance estimate after both entered (e.g., "~850 miles")
```

**3. `MovingTicker.tsx`**
```typescript
// Engagement: Social proof theater (moderate)
//
// Rotating messages every 5 seconds emphasizing SAVINGS and COMPETITION:
//
// - "Sarah in Austin saved $750 when 4 movers competed for her Denver move"
// - "Mike's 3BR move from NYC: 4 quotes ranged $2,400-$3,200 — chose lowest"
// - "Jennifer got her move report AND saved $800 vs. calling around"
// - "A family in Portland just had 5 movers compete for their July move"
// - "David saved 6 hours by getting all his quotes in one place"
// - "2,847 moves planned this week — $400 average savings vs. single quotes"
//
// Mix of:
// - Savings stories (dollar amounts are key)
// - Competition stories (X movers competed)
// - Time savings stories (hours saved)
// - Report value stories (kept the plan)
// - Aggregate stats (X moves, $Y average savings)
//
// Variables randomized within realistic ranges:
// - Names from common name list
// - Cities from major metros
// - Savings: $200-$1,000 range (believable)
// - Number of competing movers: 3-5
// - Time saved: 4-8 hours
```

**4. `HowItWorks.tsx`**
```typescript
// 4-step visual process with icons
// Each step has icon, title, 1-line description
// Animated entrance on scroll
// 
// Steps emphasize: YOU keep the plan, MOVERS compete for you
// 1. 📦 Build your inventory — "Add rooms and items (~4 min)"
// 2. 🧮 Get your move plan — "Box estimates, costs, timeline — yours forever"
// 3. 🏆 Movers compete for you — "Top-rated movers bid on YOUR move"
// 4. 💰 You save — "No calling around, no getting ripped off"
```

#### Value Proposition Component

**5. `ValueProps.tsx`**
```typescript
// Three-column layout emphasizing user benefits:
//
// Column 1: "Your Plan, Forever"
// Icon: 📋
// "Build a detailed move plan with inventory, box counts, and timeline.
//  It's yours to keep and use — even if you don't book through us."
//
// Column 2: "Movers Compete For You"  
// Icon: 🏆
// "Stop calling movers one by one. Top-rated companies see your move 
//  details and compete to win your business with their best price."
//
// Column 3: "Save Time & Money"
// Icon: 💰
// "Users save an average of $400 and 5+ hours vs. calling movers 
//  individually. No spam, no pressure, no obligation."
```

#### Engagement Tactics on Landing

| Tactic | Implementation |
|--------|----------------|
| Real urgency | Seasonal banner (genuine pricing patterns) |
| Social proof | Activity ticker, testimonials, trust badges |
| Low friction | Address inputs in hero (familiar pattern) |
| Value framing | "Plan your move" not "get quotes" |
| Specificity | "4 minutes" / "2,847 this week" |

---

### FUNNEL LAYOUT (`app/funnel/layout.tsx`)

**Purpose:** Persistent sidebar showing progress, estimate, and room completion

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ [HEADER: Logo | Live Estimate: $2,340 | Save Progress]             │
├─────────────────────┬───────────────────────────────────────────────┤
│                     │                                               │
│  [PROGRESS SIDEBAR] │  [MAIN CONTENT AREA]                         │
│                     │                                               │
│  Your Move Plan     │                                               │
│  ═══════════════    │                                               │
│                     │                                               │
│  ✓ Basics           │                                               │
│    Austin → Denver  │                                               │
│    850 miles        │                                               │
│                     │                                               │
│  ● Inventory        │                                               │
│    ┌─────────────┐  │                                               │
│    │ Living ✓    │  │                                               │
│    │ Bedroom ✓   │  │                                               │
│    │ Kitchen ●   │  │                                               │
│    │ Bathroom    │  │                                               │
│    │ Office      │  │                                               │
│    │ Garage      │  │                                               │
│    └─────────────┘  │                                               │
│                     │                                               │
│  ○ Special Items    │                                               │
│  ○ Services         │                                               │
│  ○ Summary          │                                               │
│  ○ Get Quotes       │                                               │
│                     │                                               │
│  ─────────────────  │                                               │
│                     │                                               │
│  LIVE ESTIMATE      │                                               │
│  ┌─────────────────┐│                                               │
│  │ $2,340          ││                                               │
│  │ ↑ $180 from     ││                                               │
│  │   kitchen items ││                                               │
│  │                 ││                                               │
│  │ 94 boxes est.   ││                                               │
│  │ ~6,200 lbs      ││                                               │
│  └─────────────────┘│                                               │
│                     │                                               │
│  [💬 Moving Help?]  │                                               │
│                     │                                               │
└─────────────────────┴───────────────────────────────────────────────┘
```

#### Component: `ProgressSidebar.tsx`

```typescript
interface ProgressSidebarProps {
  currentStep: string;
  moveDetails: {
    from: string;
    to: string;
    distance: number;
    date?: Date;
  };
  rooms: Room[];
  estimate: Estimate;
}

// Features:
// - Collapsible on mobile (slides in from left)
// - Room list shows completion status (✓ done, ● in progress, ○ not started)
// - Live estimate updates with animation when items added
// - Shows "+$X from [last action]" feedback
// - "Save Progress" button (captures email)
```

#### Component: `LiveEstimateBar.tsx`

```typescript
// Fixed element showing current estimate
// Updates in real-time as user adds items
// 
// Animation: Number rolls up/down when estimate changes
// Micro-feedback: "+$45" floats up when item added
//
// Shows:
// - Total estimate (prominent)
// - Box count
// - Weight estimate
// - Last change indicator
```

#### Engagement Tactic: Progress Manipulation

```typescript
// Progress weighting for moving funnel:
//
// Basics (from/to/date/size): 0% → 25%  (big jump for easy info)
// Inventory:
//   - First room completed: 25% → 40%
//   - Each additional room: +8-10%
//   - Max from inventory: 70%
// Special Items: 70% → 78%
// Services: 78% → 85%
// Summary: 85% → 90%
// Contact: 90% → 97%
// Quotes: 97% → 100%
//
// Room completion shown visually with badges/checkmarks
// Creates gamification loop: "Complete kitchen to unlock badge"
```

---

### STEP 1: Move Basics (`app/funnel/basics/page.tsx`)

**Purpose:** Capture essential move details with interactive map

#### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Progress: 15%] Let's plan your move                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │                    [INTERACTIVE MAP]                         │   │
│  │                                                              │   │
│  │         📍 Austin, TX                                       │   │
│  │              \                                               │   │
│  │               \  850 miles                                  │   │
│  │                \ ~12 hours drive                            │   │
│  │                 \                                           │   │
│  │                  📍 Denver, CO                              │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  Moving from:                                                      │
│  [📍 1234 Oak Street, Austin, TX 78701_____] ✓                    │
│                                                                     │
│  Moving to:                                                        │
│  [📍 567 Pine Ave, Denver, CO 80202________] ✓                    │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  When are you moving?                                              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [    CALENDAR PICKER    ]                                  │   │
│  │                                                              │   │
│  │  June 2025                              💡 Tip: Midweek     │   │
│  │  Su Mo Tu We Th Fr Sa                   moves are 15-20%    │   │
│  │           1  2  3  4  5                 cheaper!            │   │
│  │   6  7  8  9 10 11 12                                      │   │
│  │  13 14 [15] 16 17 18 19  ← Selected                        │   │
│  │  20 21 22 23 24 25 26                                      │   │
│  │  27 28 29 30                                               │   │
│  │                                                              │   │
│  │  ○ Flexible (+/- a few days)                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  What size is your current home?                                   │
│                                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │ Studio  │ │   1BR   │ │   2BR   │ │   3BR   │ │   4BR+  │     │
│  │  🏠     │ │  🏠     │ │  🏠🏠   │ │ 🏠🏠🏠  │ │🏠🏠🏠🏠 │     │
│  │  ~$800  │ │ ~$1,200 │ │ ~$2,100 │ │ ~$3,200 │ │ ~$4,500 │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│              [Selected]                                           │
│                                                                     │
│  [Continue to Inventory →]                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Components to Build

**1. `RouteMap.tsx`**
```typescript
// Google Maps integration showing:
// - Origin marker with address
// - Destination marker with address  
// - Route line between them
// - Distance and drive time overlay
//
// Updates dynamically as addresses change
// Zoom level adjusts to fit both points
```

**2. `AddressInput.tsx`**
```typescript
// Google Places Autocomplete integration
// - Autocomplete dropdown as user types
// - Validates address exists
// - Extracts structured address data
// - Shows checkmark when valid
```

**3. `MoveDatePicker.tsx`**
```typescript
// Calendar picker with smart features:
// - Highlights weekends (more expensive) in different color
// - Shows price indicator ($$$ weekend, $ midweek)
// - "Flexible" checkbox for ±3 days
// - Tip callout: "Midweek moves are 15-20% cheaper"
// - Blocks dates in the past
```

**4. `HomeSizeSelector.tsx`**
```typescript
// Visual home size selection
// - 5 options: Studio, 1BR, 2BR, 3BR, 4BR+
// - Each shows icon representation (scaled houses)
// - Shows estimated cost range for selected distance
// - Selection determines default room list
```

#### Data Flow

```typescript
// On home size selection, auto-populate room list:
const ROOM_PRESETS = {
  studio: ['Living/Bedroom', 'Kitchen', 'Bathroom'],
  '1br': ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom'],
  '2br': ['Living Room', 'Master Bedroom', 'Bedroom 2', 'Kitchen', 'Bathroom'],
  '3br': ['Living Room', 'Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Garage'],
  '4br+': ['Living Room', 'Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Bedroom 4', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Dining Room', 'Office', 'Garage'],
};
```

---

### STEP 2: Room Inventory Builder (`app/funnel/inventory/page.tsx`)

**THIS IS THE CORE INTERACTIVE EXPERIENCE**

**Purpose:** Build comprehensive inventory room-by-room with engaging, game-like interface

#### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Progress: 40%] Build your inventory                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ YOUR ROOMS                                          [+ Add] │   │
│  │                                                              │   │
│  │ [Living ✓] [Master ✓] [Bed 2 ●] [Kitchen] [Bath] [Garage]  │   │
│  │                         ↑ Current                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  BEDROOM 2                                          [📸 Scan Room] │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  FURNITURE                                                  │   │
│  │                                                              │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │  🛏️    │ │  🛏️    │ │  📦    │ │  🪑    │           │   │
│  │  │  Bed    │ │ Bed     │ │ Dresser │ │  Desk   │           │   │
│  │  │ (Queen) │ │ (Twin)  │ │         │ │         │           │   │
│  │  │ [1][-+] │ │ [0][-+] │ │ [1][-+] │ │ [1][-+] │           │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │
│  │                                                              │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │  🪞    │ │  💡    │ │  📺    │ │  🗄️    │           │   │
│  │  │ Mirror  │ │  Lamp   │ │   TV    │ │Bookshelf│           │   │
│  │  │         │ │         │ │         │ │         │           │   │
│  │  │ [0][-+] │ │ [2][-+] │ │ [0][-+] │ │ [1][-+] │           │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │
│  │                                                              │   │
│  │  [+ Add custom item]                                        │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  BOXES & MISC                                               │   │
│  │                                                              │   │
│  │  Clothes & linens:    [======●==========] 3 boxes           │   │
│  │  Books & media:       [===●===============] 1 box            │   │
│  │  Decor & misc:        [=====●=============] 2 boxes          │   │
│  │                                                              │   │
│  │  Total for this room: 6 boxes, ~420 lbs                     │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  THIS ROOM: 8 items • 6 boxes • ~620 lbs • +$280 to estimate│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [← Previous Room]              [Mark Complete ✓] [Next Room →]   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Components to Build

**1. `RoomSelector.tsx`**
```typescript
// Horizontal scrollable room tabs
// - Shows completion status (✓ done, ● current, empty = not started)
// - Click to switch rooms
// - "+ Add Room" button at end
// - Rooms can be renamed or removed
// - Swipe navigation on mobile
```

**2. `RoomInventory.tsx`**
```typescript
interface RoomInventoryProps {
  room: Room;
  onUpdateItems: (items: InventoryItem[]) => void;
  onMarkComplete: () => void;
}

// Main inventory interface for a single room
// Contains: Furniture grid, Box sliders, Room summary
```

**3. `ItemCard.tsx`**
```typescript
interface ItemCardProps {
  item: FurnitureItem;
  count: number;
  onCountChange: (count: number) => void;
}

// Visual card for each furniture type:
// - Icon (emoji or custom SVG)
// - Name
// - Size variant if applicable (Queen bed vs Twin bed)
// - Counter with +/- buttons
// - Tap to expand for size variants
//
// Animation: Satisfying bounce when count changes
// Sound: Optional subtle click (can be disabled)
```

**4. `BoxSlider.tsx`**
```typescript
interface BoxSliderProps {
  category: string; // "Clothes & linens", "Books", etc.
  value: number;
  max: number;
  onChange: (value: number) => void;
}

// Slider for estimating boxes by category
// - Visual slider with current value displayed
// - Helper text: "1 box ≈ a standard moving box"
// - Smart defaults based on room type
```

**5. `RoomPhotoUploader.tsx` (AI Feature)**
```typescript
// "📸 Scan Room" button
// 
// Flow:
// 1. User clicks "Scan Room" → opens camera/file picker
// 2. User uploads photo of room
// 3. Processing animation: "Analyzing your room..."
//    - "Detecting furniture..."
//    - "Estimating items..."
//    - "Almost done..."
// 4. AI returns inventory estimate
// 5. Items auto-populate with "AI suggested" badge
// 6. User can adjust/confirm
//
// AI Implementation (Claude API):
// - Send image with prompt asking to identify furniture and estimate quantities
// - Return structured JSON of detected items
// - Map to our inventory categories
```

**AI Room Scanning Prompt:**
```typescript
const ROOM_SCAN_PROMPT = `
Analyze this photo of a room and identify furniture and belongings.

Return a JSON object with:
{
  "room_type": "bedroom" | "living_room" | "kitchen" | "bathroom" | "office" | "other",
  "furniture": [
    { "item": "bed", "size": "queen", "quantity": 1 },
    { "item": "dresser", "quantity": 1 },
    ...
  ],
  "estimated_boxes": {
    "clothes_linens": 3,
    "books_media": 1,
    "decor_misc": 2
  },
  "notes": "Any special observations about the room"
}

Be conservative in estimates. Only identify items you can clearly see.
`;
```

**6. `RoomBadge.tsx` (Gamification)**
```typescript
// Shown when room is marked complete
// 
// "🎉 Bedroom 2 Complete!"
// "8 items • 6 boxes • 620 lbs"
// 
// Brief celebration animation (confetti optional)
// Badge appears in sidebar
//
// Engagement: Creates micro-achievements throughout funnel
```

#### Inventory Data Structure

```typescript
interface Room {
  id: string;
  name: string;
  type: RoomType;
  status: 'not_started' | 'in_progress' | 'complete';
  furniture: FurnitureItem[];
  boxes: {
    clothes_linens: number;
    books_media: number;
    decor_misc: number;
    fragile: number;
  };
}

interface FurnitureItem {
  id: string;
  name: string;
  icon: string;
  category: 'furniture' | 'appliance' | 'electronics';
  size?: 'small' | 'medium' | 'large' | 'extra_large';
  weight: number; // in lbs
  volume: number; // in cubic feet
  count: number;
  aiSuggested?: boolean;
}

// Pre-defined furniture by room type
const BEDROOM_ITEMS: FurnitureItem[] = [
  { id: 'bed_king', name: 'Bed (King)', icon: '🛏️', weight: 150, volume: 80, ... },
  { id: 'bed_queen', name: 'Bed (Queen)', icon: '🛏️', weight: 120, volume: 60, ... },
  { id: 'bed_twin', name: 'Bed (Twin)', icon: '🛏️', weight: 80, volume: 40, ... },
  { id: 'dresser', name: 'Dresser', icon: '📦', weight: 100, volume: 30, ... },
  { id: 'nightstand', name: 'Nightstand', icon: '🗄️', weight: 30, volume: 8, ... },
  { id: 'desk', name: 'Desk', icon: '🪑', weight: 60, volume: 20, ... },
  // ... more items
];
```

#### Engagement Tactics in Inventory

| Tactic | Implementation |
|--------|----------------|
| Gamification | Room completion badges, progress celebration |
| Sunk cost | Each room completed = more investment |
| Immediate feedback | Live estimate updates as items added |
| Progress manipulation | First room = big progress jump |
| AI value | Room scanning feels magical/useful |

---

### STEP 3: Special Items (`app/funnel/special-items/page.tsx`)

**Purpose:** Capture high-value/complex items that affect pricing significantly

#### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Progress: 72%] Any special items?                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  These items need special handling and affect your quote.          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  LARGE & HEAVY                                              │   │
│  │                                                              │   │
│  │  ☐ Piano (upright)         +$200-400                       │   │
│  │  ☐ Piano (grand)           +$400-800                       │   │
│  │  ☐ Pool table              +$300-500                       │   │
│  │  ☐ Safe (heavy)            +$150-300                       │   │
│  │  ☐ Hot tub                 +$400-600                       │   │
│  │  ☐ Gym equipment           +$100-200                       │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  FRAGILE & VALUABLE                                         │   │
│  │                                                              │   │
│  │  ☐ Artwork (large)         +$50-150 per piece              │   │
│  │  ☐ Antiques                +$100-300                       │   │
│  │  ☐ Wine collection         +$50-200                        │   │
│  │  ☐ Chandelier              +$75-150                        │   │
│  │  ☐ Aquarium                +$100-250                       │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  OUTDOOR & OTHER                                            │   │
│  │                                                              │   │
│  │  ☐ Riding mower            +$100-200                       │   │
│  │  ☐ Motorcycle              +$150-300                       │   │
│  │  ☐ Large plants            +$30-50 per plant               │   │
│  │  ☐ Swing set               +$150-300                       │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ☐ None of the above — I don't have special items                 │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  💡 TIP: Let movers know about special items upfront.              │
│     It ensures proper equipment and accurate pricing.              │
│                                                                     │
│  [Continue →]                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Component: `SpecialItemsGrid.tsx`

```typescript
// Checkbox grid with pricing indicators
// - Each item shows price range impact
// - Selecting updates live estimate immediately
// - "None of the above" clears selections and advances
// - Items grouped by category
```

---

### STEP 4: Additional Services (`app/funnel/services/page.tsx`)

**Purpose:** Upsell additional services (increases lead value for movers)

#### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Progress: 78%] Need any extra help?                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Most movers offer these services. Select what you need:           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  ☑ PACKING SERVICE                              +$300-600  │   │
│  │    Movers pack all your belongings                          │   │
│  │    📦 Saves 1-2 days of work                                │   │
│  │                                                              │   │
│  │  ☐ Partial packing (kitchen + fragile only)     +$150-300  │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  ☐ UNPACKING SERVICE                            +$200-400  │   │
│  │    Movers unpack and set up at destination                  │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  ☐ STORAGE (if needed)                                      │   │
│  │    ○ Short-term (< 1 month)                     +$200-400  │   │
│  │    ○ Long-term (1+ months)                      +$150/mo   │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  ☐ FURNITURE DISASSEMBLY/REASSEMBLY             +$100-200  │   │
│  │    Beds, tables, shelving units                             │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ☐ No additional services needed                                  │
│                                                                     │
│  [Continue to Summary →]                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Engagement Tactics

| Tactic | Implementation |
|--------|----------------|
| Anchoring | Packing service pre-checked (common, high-margin for movers) |
| Value framing | "Saves 1-2 days of work" justifies cost |
| Decoy | Full packing vs. partial packing (partial is decoy) |

---

### STEP 5: Move Summary (`app/funnel/summary/page.tsx`)

**Purpose:** Show comprehensive summary, deliver "planning value," prepare for conversion

#### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Progress: 88%] Your Move Plan                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  MOVE OVERVIEW                                              │   │
│  │                                                              │   │
│  │  📍 Austin, TX → Denver, CO                                 │   │
│  │  📏 850 miles • ~12 hours drive                             │   │
│  │  📅 June 15, 2025 (Sunday)                                  │   │
│  │  🏠 2 Bedroom                                               │   │
│  │                                                              │   │
│  │  [Mini route map]                                           │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  YOUR INVENTORY                                             │   │
│  │                                                              │   │
│  │  📦 Total Items: 127                                        │   │
│  │  📦 Estimated Boxes: 94                                     │   │
│  │  ⚖️ Estimated Weight: 6,240 lbs                            │   │
│  │  📐 Estimated Volume: 820 cubic feet                        │   │
│  │                                                              │   │
│  │  Rooms completed: 6/6 ✓                                     │   │
│  │  Special items: Piano (upright), Large artwork (2)          │   │
│  │  Services: Packing, Furniture assembly                      │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  MOVE COMPLEXITY SCORE                                      │   │
│  │                                                              │   │
│  │  [=========●===========] 6.5 / 10                           │   │
│  │                                                              │   │
│  │  Moderate complexity                                        │   │
│  │  ✓ Long distance (higher cost)                              │   │
│  │  ✓ Piano requires specialist                                │   │
│  │  ✓ Weekend move (peak pricing)                              │   │
│  │  ✓ Packing service included                                 │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  💰 ESTIMATED COST                                          │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │     [PIE CHART: Cost Breakdown]                        │ │   │
│  │  │                                                        │ │   │
│  │  │     Base move:        $1,840  ███████████              │ │   │
│  │  │     Packing:          $420    ████                     │ │   │
│  │  │     Piano:            $280    ██                       │ │   │
│  │  │     Assembly:         $120    █                        │ │   │
│  │  │     ─────────────────────────                          │ │   │
│  │  │     TOTAL:            $2,660                           │ │   │
│  │  │                                                        │ │   │
│  │  │     Range: $2,200 - $3,100 depending on mover          │ │   │
│  │  │                                                        │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📦 PACKING PLAN                                            │   │
│  │                                                              │   │
│  │  Based on your inventory, here's what you'll need:          │   │
│  │                                                              │   │
│  │  Small boxes (books, heavy items):     28                   │   │
│  │  Medium boxes (general):               42                   │   │
│  │  Large boxes (light, bulky items):     18                   │   │
│  │  Wardrobe boxes (clothes):             6                    │   │
│  │                                                              │   │
│  │  📅 Recommended packing timeline:                           │   │
│  │  • 2 weeks before: Non-essentials, decor, books            │   │
│  │  • 1 week before: Most clothes, kitchen items              │   │
│  │  • Day before: Essentials bag, last items                  │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📄 YOUR MOVE REPORT — KEEP IT FOREVER                      │   │
│  │  ══════════════════════════════════════════════════════════ │   │
│  │                                                              │   │
│  │  This is YOUR report. Whether you get mover quotes or not,  │   │
│  │  you can download and keep your complete move plan:         │   │
│  │                                                              │   │
│  │  ✓ Full inventory list (127 items across 6 rooms)          │   │
│  │  ✓ Box estimates by type (94 boxes total)                  │   │
│  │  ✓ Weight & volume calculations (6,240 lbs)                │   │
│  │  ✓ Cost estimate breakdown ($2,200 - $3,100)               │   │
│  │  ✓ Personalized packing timeline                           │   │
│  │  ✓ Move day checklist                                      │   │
│  │  ✓ Address change reminder list                            │   │
│  │                                                              │   │
│  │  [📥 Download My Move Report (PDF)]                         │   │
│  │  [📧 Email Me My Report]                                    │   │
│  │                                                              │   │
│  │  No mover quotes needed. This is yours.                     │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  Want movers to compete for your business?                         │
│                                                                     │
│  Your detailed inventory means accurate quotes — no surprises.     │
│  Top-rated movers will see your move and bid to win it.           │
│                                                                     │
│  [Get Competing Quotes from Top Movers →]                          │
│                                                                     │
│  or [Just send me my report — I'll handle it myself]              │
│                                                                     │
│  [💬 Ask a moving question]                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Components to Build

**1. `MoveSummaryCard.tsx`**
```typescript
// Comprehensive summary of move details
// - Route info with mini map
// - Date and timing
// - Home size
```

**2. `ComplexityMeter.tsx`**
```typescript
// Visual "complexity score" 1-10
// - Calculated from: distance, weight, special items, services, timing
// - Shows contributing factors
// - Educates user about what affects pricing
//
// Gamification: Makes the move feel "scored" and understood
```

**3. `CostBreakdownChart.tsx`**
```typescript
// Recharts PieChart showing cost components:
// - Base move (distance + weight)
// - Packing services
// - Special items
// - Additional services
//
// Shows total and range
// Hover/tap for details
```

**4. `BoxEstimator.tsx`**
```typescript
// Calculated from inventory:
// - Small boxes: Books, heavy items (weight-limited)
// - Medium boxes: General items
// - Large boxes: Light, bulky items (clothes, linens)
// - Wardrobe boxes: Based on dresser/closet count
//
// Shows specific counts with icons
```

**5. `PackingTimeline.tsx`**
```typescript
// AI-generated packing schedule based on:
// - Move date
// - Inventory size
// - Packing service selection
//
// If they have packing service: "Movers will handle this!"
// If DIY: Specific timeline with tasks by week
```

**6. `MoveReportCard.tsx` (Key Trust Builder)**
```typescript
// The "Keep Your Data" promise materialized
//
// Shows everything included in their report:
// - Full inventory list
// - Box estimates
// - Weight/volume
// - Cost estimate
// - Packing timeline
// - Move day checklist
// - Address change list
//
// Two CTAs:
// - "Download My Move Report (PDF)" — opens email capture modal
// - "Email Me My Report" — same capture, different framing
//
// Key copy: "This is YOUR report. Whether you get mover quotes or not,
//           you can download and keep your complete move plan."
//
// This builds massive trust because user sees they get value regardless
```

**7. Move Report PDF Generator**
```typescript
// Generates comprehensive PDF report containing:
//
// Page 1: Move Overview
// - From/To addresses with map
// - Move date
// - Distance and estimated drive time
// - Home size and room count
//
// Page 2: Complete Inventory
// - Room-by-room item list
// - Item counts and estimated weights
// - Total items, weight, volume
//
// Page 3: Box Estimates & Supplies
// - Box counts by type
// - Recommended supplies list (tape, markers, padding)
// - Where to get free boxes (tips)
//
// Page 4: Cost Estimate
// - Breakdown pie chart
// - Range estimate with explanation
// - Factors affecting price
//
// Page 5: Packing Timeline
// - Week-by-week task list
// - Room priority order
// - Pro tips for each phase
//
// Page 6: Move Day Checklist
// - Day-before tasks
// - Morning-of tasks  
// - Walkthrough checklist
// - Essentials bag packing list
//
// Page 7: Address Change Checklist
// - USPS
// - Banks & credit cards
// - Insurance
// - Subscriptions
// - Utilities
// - DMV
// - Employer/schools
//
// Branded footer: "Your Move Report — Created with [Logo]"
// But NOT pushy about movers — this is their document
```

---

### STEP 6: Contact Information (`app/funnel/contact/page.tsx`)

**Purpose:** Capture lead with high investment already made — framed as "letting movers compete"

#### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Progress: 94%] Get movers competing for you                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  "Your Austin → Denver move is ready for quotes"                   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📊 YOUR MOVE AT A GLANCE                                   │   │
│  │                                                              │   │
│  │  127 items • 94 boxes • 6,240 lbs                          │   │
│  │  Estimated range: $2,200 - $3,100                          │   │
│  │                                                              │   │
│  │  This detailed inventory means:                             │   │
│  │  ✓ Movers can give accurate quotes (not guesses)           │   │
│  │  ✓ No surprises on moving day                              │   │
│  │  ✓ Companies compete knowing exactly what's involved       │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Enter your info and we'll have top movers compete for your move:  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  First Name:     [________________]                         │   │
│  │  Last Name:      [________________]                         │   │
│  │  Email:          [________________]                         │   │
│  │  Phone:          [________________]                         │   │
│  │                                                              │   │
│  │  Best time to reach you:                                    │   │
│  │  ○ Morning  ○ Afternoon  ○ Evening  ○ Anytime              │   │
│  │                                                              │   │
│  │  ☑ Call me — I want to hear their best offers              │   │
│  │  ☐ Email only (takes longer to get quotes)                 │   │
│  │                                                              │   │
│  │  ☑ I agree to receive quotes from up to 4 matched movers.  │   │
│  │    [View terms]                                             │   │
│  │                                                              │   │
│  │  [Get Competing Quotes →]                                   │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  🔒 Your info is only shared with movers competing for your move.  │
│     No spam, no selling your data to random companies.            │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  Not ready for movers yet?                                         │
│  [Just email me my Move Report — I'll reach out when ready]       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Engagement Tactics

| Tactic | Implementation |
|--------|----------------|
| Sunk cost | Shows inventory summary — they built all this |
| Competitive framing | "Movers compete" not "get quotes" |
| Value reinforcement | "Detailed inventory = accurate quotes, no surprises" |
| Pre-checked consent | ☑ Call me, ☑ Agree to contact |
| Soft exit path | "Just email me my report" — still captures email, nurture lead |
| Trust building | "No spam, no selling your data to random companies" |

**Key insight:** The "Just email me my report" exit captures email for nurturing while respecting user autonomy. These users may convert later, or refer others.

---

### STEP 7: Mover Quotes (`app/funnel/quotes/page.tsx`)

**Purpose:** Show matched movers competing for user's business

#### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Progress: 100%] 🎉 Movers Are Competing For Your Move             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  "[Name], 4 top-rated movers want your Austin → Denver move"       │
│                                                                     │
│  They've seen your detailed inventory and are ready to compete.    │
│  Select who you want to hear from — they'll contact you with       │
│  their best offer.                                                 │
│                                                                     │
│  [MOVER CARD 1: Two Men and a Truck] ☑ Selected                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  🚚 TWO MEN AND A TRUCK                    Match: 94%       │   │
│  │     Long-distance specialists                               │   │
│  │                                                              │   │
│  │  THEIR QUOTE RANGE: $2,400 - $2,800                         │   │
│  │  (Based on your 127 items, 6,240 lbs inventory)             │   │
│  │                                                              │   │
│  │  WHY THEY'RE COMPETING FOR YOUR MOVE:                       │   │
│  │  ✓ Highly rated for Austin → Denver route                   │   │
│  │  ✓ Piano moving specialists on staff                        │   │
│  │  ✓ Available June 15 (your date)                            │   │
│  │  ✓ Includes packing service you requested                   │   │
│  │                                                              │   │
│  │  ★★★★★ 4.8/5 (2,340 reviews) | A+ BBB Rating               │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [MOVER CARD 2: Allied Van Lines] ☐                               │
│  [MOVER CARD 3: College Hunks] ☐                                  │
│  [MOVER CARD 4: Local Austin Movers] ☐                            │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  [Let Selected Movers Contact Me →]                                │
│                                                                     │
│  What happens next:                                                │
│  1. Selected movers see your detailed inventory                   │
│  2. They'll contact you within 24-48 hours with their best offer  │
│  3. Compare, negotiate, and choose the best deal                  │
│  4. You're in control — no obligation to book anyone              │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  📄 YOUR MOVE REPORT                                               │
│                                                                     │
│  Regardless of which movers you choose (or if you choose none),   │
│  your complete move plan is yours to keep:                        │
│                                                                     │
│  [📥 Download Full Report (PDF)]   [📧 Email Me My Report]        │
│                                                                     │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  💬 Questions? [Chat with our moving advisor]                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Component: `MoverCard.tsx`

```typescript
interface MoverCardProps {
  mover: Mover;
  moveDetails: MoveDetails;
  matchScore: number;
  selected: boolean;
  onToggleSelect: () => void;
}

// Key features:
// - Quote range (calculated from their rates + user's inventory)
// - "WHY THEY'RE COMPETING" not "why they match" — active framing
// - Shows quote is based on user's specific inventory weight/items
// - Rating and credential badges
// - Selection checkbox
//
// The framing is crucial: movers WANT this business and are COMPETING
// User is the prize, not the product
```

#### Final Report Download Section

```typescript
// Always visible at bottom of quotes page
// Reinforces that user keeps their data regardless of outcome
//
// "Regardless of which movers you choose (or if you choose none),
//  your complete move plan is yours to keep"
//
// Two buttons side by side:
// - Download Full Report (PDF) — generates/downloads immediately
// - Email Me My Report — sends to their email address
//
// This removes anxiety about "losing" the work they've done
// And creates goodwill that increases conversion
```

---

## The "Keep Your Data" System

### Report Contents

The Move Report is a comprehensive, valuable document the user keeps regardless of conversion:

```
MOVE REPORT CONTENTS:

Page 1: Move Overview
├── Route map (visual)
├── From/To addresses
├── Move date
├── Distance & estimated drive time
└── Home size summary

Page 2-3: Complete Inventory
├── Room-by-room item list
├── Item counts with icons
├── Estimated weight per room
├── Special items highlighted
└── Total: X items, X lbs, X cubic feet

Page 4: Box & Supply Estimates
├── Small boxes: X (for books, heavy items)
├── Medium boxes: X (general items)
├── Large boxes: X (light, bulky)
├── Wardrobe boxes: X (hanging clothes)
├── Total boxes: X
├── Recommended supplies list
│   ├── Packing tape (X rolls)
│   ├── Bubble wrap (X feet)
│   ├── Markers (X)
│   └── etc.
└── Pro tip: Where to get free boxes

Page 5: Cost Estimate Breakdown
├── Visual pie chart
├── Base move cost: $X
├── Packing services: $X
├── Special items: $X
├── Other services: $X
├── Estimated total: $X - $Y range
└── Factors that affect final price

Page 6: Personalized Packing Timeline
├── 4 weeks before: [tasks]
├── 3 weeks before: [tasks]
├── 2 weeks before: [tasks]
├── 1 week before: [tasks]
├── Day before: [tasks]
└── Moving day: [tasks]

Page 7: Move Day Checklist
├── □ Final walkthrough of old home
├── □ Check all closets and cabinets
├── □ Read meters (utilities)
├── □ Essentials box accessible
├── □ [15+ items...]
└── □ Keys handed off

Page 8: Address Change Checklist
├── □ USPS mail forwarding
├── □ Banks & credit cards
├── □ Insurance (auto, health, home)
├── □ Employer / HR
├── □ Schools
├── □ DMV / vehicle registration
├── □ Voter registration
├── □ Subscriptions (Netflix, etc.)
├── □ Utilities (electric, gas, water, internet)
├── □ Doctor / dentist / pharmacy
└── □ [10+ more items...]

Footer: "Created with [Brand] — Your Move Planning Partner"
```

### Conversion Path Options

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER COMPLETES INVENTORY                    │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SUMMARY PAGE                              │
│                                                                     │
│   "Your Move Report is ready"                                       │
│                                                                     │
│   ┌─────────────────┐    ┌─────────────────────────────────────┐   │
│   │ DOWNLOAD REPORT │    │   GET MOVERS COMPETING FOR YOU     │   │
│   │   (email req)   │    │        (primary CTA)                │   │
│   └────────┬────────┘    └──────────────────┬──────────────────┘   │
│            │                                 │                      │
└────────────┼─────────────────────────────────┼──────────────────────┘
             │                                 │
             ▼                                 ▼
┌────────────────────────┐    ┌─────────────────────────────────────┐
│   NON-CONVERTER PATH   │    │       CONVERTER PATH                │
│                        │    │                                     │
│   Gets full report     │    │   Contact info → Mover quotes      │
│   Email captured       │    │   Gets full report                 │
│   Nurture sequence:    │    │   High-quality lead delivered      │
│                        │    │                                     │
│   Day 1: Report email  │    │   Post-conversion:                 │
│   Day 3: "Ready for    │    │   - Confirmation email             │
│          quotes?"      │    │   - Report attached                │
│   Day 7: "Movers are   │    │   - "How to compare quotes" tips   │
│          booking up    │    │                                     │
│          for June"     │    │                                     │
│   Day 14: Seasonal tip │    │                                     │
│   Day 30: "Still       │    │                                     │
│           planning?"   │    │                                     │
│                        │    │                                     │
└────────────────────────┘    └─────────────────────────────────────┘
```

### Why "Keep Your Data" Works

1. **Removes friction at conversion**: Users aren't afraid of losing their work
2. **Builds trust**: "They're not just trying to sell my info"
3. **Creates referrals**: Users share the tool even if they don't convert
4. **Enables nurture**: Non-converters give email, may convert later
5. **Differentiates from competitors**: Most lead gen gives nothing back
6. **Increases completion**: Users want to finish to get the report

---

## AI Integration Points

### 1. Room Photo Scanner (`/api/scan-room`)

```typescript
// POST: Analyze room photo for inventory
// Input: FormData with image
// Output: {
//   room_type: string,
//   furniture: { item: string, size?: string, quantity: number }[],
//   estimated_boxes: { category: string, count: number }[],
//   confidence: number,
//   notes: string,
// }

// Claude API prompt:
const ROOM_SCAN_SYSTEM = `
You are an expert moving inventory analyst. Analyze room photos to identify 
furniture and estimate packing needs.

When analyzing an image:
1. Identify the room type (bedroom, living room, kitchen, etc.)
2. List all visible furniture with quantities
3. Estimate boxes needed for non-furniture items visible
4. Note any special items (antiques, fragile, oversized)

Be conservative — only count what you can clearly see.
Return structured JSON matching the provided schema.
`;
```

### 2. Moving Assistant Chat (`/api/chat`)

```typescript
// Conversational AI for moving questions
// 
// System prompt context includes:
// - Current move details (from/to, date, size)
// - Inventory summary
// - Estimated cost
// - Services selected
//
// Can answer:
// - "What size truck do I need?"
// - "Should I get packing service?"
// - "How do I prepare my piano for moving?"
// - "What's the best time to move for cheaper rates?"
// - "How do I change my address?"

const MOVING_ASSISTANT_SYSTEM = `
You are a helpful moving advisor. The user is planning a move with these details:
- From: {from_city} to {to_city}
- Distance: {distance} miles
- Date: {move_date}
- Home size: {home_size}
- Current estimate: ${estimate}
- Items: {item_count} items, {box_count} boxes
- Services: {services}

You can:
- Answer moving questions
- Provide packing tips
- Explain pricing factors
- Suggest ways to reduce costs
- Recommend preparations

Be friendly, practical, and specific to their situation.
`;
```

### 3. Packing Plan Generator (`/api/generate-checklist`)

```typescript
// Generate personalized packing checklist and timeline
//
// Input: Move date, inventory, services selected
// Output: {
//   timeline: [
//     { week: -4, tasks: ["Sort items to donate/sell", "Order packing supplies"] },
//     { week: -3, tasks: ["Pack off-season items", "Books and media"] },
//     ...
//   ],
//   supply_list: [
//     { item: "Small boxes", quantity: 28, purpose: "Books, heavy items" },
//     ...
//   ],
//   tips: string[],
// }
```

---

## Engagement Tactics Summary

| Stage | Tactics Implemented |
|-------|---------------------|
| Landing | Real urgency (seasonal), Social proof (ticker), Competitive framing ("stop calling one by one"), Value promise ("keep your plan forever") |
| Basics | Map visualization (engaging), Price hints on home size (anchoring) |
| Inventory | Gamification (room badges), Live estimate (feedback), AI scanning (value), Sunk cost (building) |
| Special Items | Price anchoring (ranges shown), Easy completion option |
| Services | Pre-checked upsell, Value framing ("saves 2 days") |
| Summary | Value delivery (full plan), "Keep your data" report prominent, PDF = email capture, Complexity gamification |
| Contact | Competitive framing ("movers compete"), Pre-checked consent, Soft exit ("just send report") |
| Quotes | "Movers competing for YOU" language, Report download always available, User in control |
| Global | Progress manipulation, Exit intent, Live estimate sidebar |

### Key Messaging Throughout

**Landing/Entry:**
- "Stop calling movers one by one — make them compete for you"
- "Your move plan is yours to keep, whether you book or not"

**Mid-funnel:**
- "Building your inventory so movers can compete with accurate quotes"
- "The more detail you add, the more accurate your quotes will be"

**Conversion:**
- "4 movers want to compete for your move"
- "They'll see your detailed inventory and give you their best price"

**Post-conversion:**
- "Your Move Report is ready — download it anytime"
- "Movers are competing — expect their best offers soon"

---

## Development Sequence for Claude Code

### Phase 1: Core Structure (Day 1-2)
1. Initialize Next.js project
2. Set up Tailwind + shadcn/ui + Framer Motion
3. Create file structure
4. Implement MoveContext
5. Build progress sidebar with live estimate

### Phase 2: Landing + Basics (Day 3-4)
6. Build landing page with hero
7. Implement Google Maps integration
8. Build AddressInput with Places Autocomplete
9. Build RouteMap component
10. Build MoveDatePicker with smart hints
11. Build HomeSizeSelector
12. Implement MovingTicker

### Phase 3: Inventory Builder (Day 5-8) — CORE FEATURE
13. Build RoomSelector with tabs
14. Build ItemCard with counters
15. Build BoxSlider component
16. Build room inventory data structure
17. Implement room-by-room navigation
18. Build RoomPhotoUploader UI
19. Implement AI room scanning API
20. Build RoomBadge celebrations
21. Implement live estimate calculations

### Phase 4: Special Items + Services (Day 9-10)
22. Build SpecialItemsGrid
23. Build ServicesChecklist
24. Wire up estimate impacts

### Phase 5: Summary (Day 11-12)
25. Build MoveSummaryCard
26. Build ComplexityMeter
27. Build CostBreakdownChart
28. Build BoxEstimator
29. Build PackingTimeline
30. Implement PDF generation (or mock)

### Phase 6: Contact + Quotes (Day 13-14)
31. Build contact form
32. Build MoverCard
33. Build quotes page with selections
34. Implement mock mover matching

### Phase 7: AI + Chat (Day 15-16)
35. Implement room scanning with Claude API
36. Build MovingAssistant chat component
37. Implement chat API endpoint
38. Implement packing plan generator

### Phase 8: Engagement + Polish (Day 17-18)
39. Implement exit intent modal
40. Fine-tune progress percentages
41. Add animations and transitions
42. Mobile responsiveness pass
43. Testing and bug fixes

---

## Environment Variables

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_DEMO_MODE=true
```

---

## Calculations Reference

### Weight Estimation
```typescript
// Base weights by item (in lbs)
const ITEM_WEIGHTS = {
  bed_king: 180,
  bed_queen: 140,
  bed_twin: 80,
  sofa_3seat: 280,
  sofa_2seat: 180,
  dining_table: 120,
  dining_chair: 20,
  dresser: 120,
  desk: 80,
  bookshelf: 80,
  tv_large: 50,
  refrigerator: 250,
  washer: 150,
  dryer: 125,
  // ... etc
};

// Box weights by type
const BOX_WEIGHTS = {
  small: 30,    // Books, heavy items
  medium: 25,   // General
  large: 15,    // Light, bulky
  wardrobe: 35, // Full of clothes
};
```

### Cost Estimation
```typescript
function estimateMoveCost(move: MoveDetails): CostEstimate {
  // Base rate per mile for long distance
  const perMileRate = move.distance > 100 ? 0.50 : 0;
  const distanceCost = move.distance * perMileRate;
  
  // Weight-based cost (for local, rate per lb; for long distance, per lb per mile)
  const weightCost = move.totalWeight * 0.50;
  
  // Base labor (loading/unloading)
  const laborHours = Math.ceil(move.totalWeight / 500); // ~500 lbs per hour
  const laborCost = laborHours * 150; // $150/hr for crew
  
  // Special items
  const specialCost = move.specialItems.reduce((sum, item) => sum + item.avgCost, 0);
  
  // Services
  const servicesCost = move.services.reduce((sum, svc) => sum + svc.avgCost, 0);
  
  // Weekend/peak premium
  const timingMultiplier = move.isWeekend ? 1.15 : 1.0;
  const seasonalMultiplier = move.isPeakSeason ? 1.20 : 1.0;
  
  const subtotal = (distanceCost + weightCost + laborCost + specialCost + servicesCost);
  const total = subtotal * timingMultiplier * seasonalMultiplier;
  
  return {
    low: Math.round(total * 0.85),
    mid: Math.round(total),
    high: Math.round(total * 1.15),
    breakdown: { ... }
  };
}
```

### Box Estimation
```typescript
function estimateBoxes(inventory: Room[]): BoxEstimate {
  let small = 0, medium = 0, large = 0, wardrobe = 0;
  
  inventory.forEach(room => {
    // Boxes from sliders
    small += room.boxes.books_media * 1; // Books = small boxes
    medium += room.boxes.decor_misc * 1;
    large += room.boxes.clothes_linens * 0.5;
    wardrobe += room.boxes.clothes_linens * 0.3;
    
    // Additional boxes based on furniture (contents)
    room.furniture.forEach(item => {
      if (item.name.includes('dresser')) medium += item.count * 2;
      if (item.name.includes('desk')) small += item.count * 1;
      if (item.name.includes('bookshelf')) small += item.count * 3;
    });
  });
  
  return {
    small: Math.ceil(small),
    medium: Math.ceil(medium),
    large: Math.ceil(large),
    wardrobe: Math.ceil(wardrobe),
    total: Math.ceil(small + medium + large + wardrobe),
  };
}
```

---

## Notes for Claude Code

1. **The inventory builder is the hero feature** — spend the most time here. Make it delightful with smooth animations, satisfying counters, and the AI scanning wow factor.

2. **Maps integration is essential** — the route visualization makes the move feel "real" and planned. Worth the Google Maps API setup.

3. **Live estimate creates engagement** — seeing the number change as you add items is addictive. Make the updates smooth and visible.

4. **Gamification is appropriate here** — moving is stressful; room completion badges and complexity scores make it feel manageable and even fun.

5. **AI room scanning is the magic moment** — even if accuracy isn't perfect, the "upload photo, get inventory" feature feels futuristic and useful.

6. **Mobile is critical** — people often browse moving quotes on their phone. The inventory builder needs to work well on small screens.

7. **Pre-checked boxes are intentional** — packing service and call consent per the engagement doc.

8. **Real urgency over fake** — seasonal pricing IS real. Use that instead of fake countdowns.

---

*Implementation plan v1.0 — Ready for Claude Code execution*
