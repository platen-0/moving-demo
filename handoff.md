# Moving Services Funnel - Handoff

## Quick Start
```bash
cd moving-demo
npm run dev     # http://localhost:3000
```

## Tech Stack
Next.js 16 (App Router) | TypeScript | Tailwind CSS v4 + shadcn/ui

## Current State

### Landing Page
- Rolling partner logo ticker (35s animation, seamless loop)
- Activity ticker showing real-time moving actions
- Trust badges and social proof elements

### Funnel Flow
1. **Basics** - From/to addresses, move date, home size
2. **Inventory** - Room-by-room furniture selection
3. **Special Items** - Piano, pool table, safes, etc.
4. **Services** - Packing, storage, assembly
5. **Summary** - Move plan X-ray with cost estimate
6. **Contact** - User info and preferences
7. **Quotes** - Matched mover selection

### Key Features
- Room-based furniture selector with pre-populated items
- Special items with quantity controls
- Service options with sub-options
- Cost estimation based on home size and selections
- Mover matching with ratings and credentials

## Key Learnings

**Seamless ticker animation:**
```css
.animate-scroll { animation: ticker-scroll 35s linear infinite; width: fit-content; }
@keyframes ticker-scroll { to { transform: translateX(-50%); } }
```
Requires duplicated content (two identical sets).

**Square vs wide logos:** Use conditional container sizing based on logo shape.

**Image caching:** Hard refresh (Cmd+Shift+R) needed after logo file updates.

## Key Files
- `context/MoveContext.tsx` - Global state management
- `types/index.ts` - All TypeScript interfaces
- `lib/constants.ts` - Home sizes, furniture, services, mock movers
- `components/landing/` - Landing page sections
- `components/funnel/ProgressBar.tsx` - Step progress indicator
- `components/engagement/` - Chat assistant, exit intent, urgency
- `app/funnel/*/page.tsx` - Individual funnel step pages

## Design System
- **Primary**: Green (#166534)
- **Secondary**: Navy (#1e3a5f)
- **Accent**: Gold (#d4a574)
- **Font**: Playfair Display (serif headings) + system sans
