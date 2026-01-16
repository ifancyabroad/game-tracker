# Game Tracker - AI Coding Agent Instructions

## Code Quality Principles

**CRITICAL: Code must be clean, modular, and maintainable.** Follow these principles rigorously:

1. **Single Responsibility**: Each function/component should do ONE thing well
2. **DRY (Don't Repeat Yourself)**: Extract reusable logic into utilities, hooks, or components
3. **Separation of Concerns**: Keep UI, business logic, and data fetching separate
4. **Type Safety**: Use TypeScript strictly - avoid `any`, prefer interfaces over types for extensibility
5. **Consistent Naming**: Use clear, descriptive names that reveal intent
6. **File Organization**: Put code in the correct feature folder - respect boundaries
7. **Small Functions**: Keep functions focused and under 50 lines when possible
8. **Pure Functions**: Prefer pure functions in utilities - no side effects
9. **Composition over Complexity**: Build complex features from simple, composable parts
10. **Document Decisions**: Add comments for "why", not "what" - code should be self-explanatory

## UI/UX Consistency & Design System

**CRITICAL: The application must have a cohesive, professional appearance across all pages and components.** AI-generated code often creates components in isolation - you MUST ensure consistency.

### Design System Hierarchy

1. **CSS Variables First** (see [src/index.css](src/index.css)):
    - `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`
    - `--color-error`, `--color-success`, `--color-warning`
    - These change based on theme selection - NEVER hardcode colors

2. **Tailwind Utilities Second**:
    - Use Tailwind classes for spacing, typography, layouts
    - Consistent spacing scale: `p-4`, `p-6`, `gap-4`, `space-y-4`
    - Typography: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

3. **Component Library Third** (see [common/components/index.ts](common/components/index.ts)):
    - **ALWAYS check if a component already exists before creating a new one**
    - Reuse: `Button`, `Card`, `Modal`, `Input`, `Select`, `Badge`, `Chip`, `Avatar`, etc.
    - Creating duplicate components with slightly different styles breaks cohesion

### Mandatory Consistency Rules

**Colors**:

- ✅ Use CSS variables: `bg-[var(--color-primary)]`, `text-[var(--color-text)]`
- ✅ Use Tailwind semantic colors: `bg-surface`, `text-primary`
- ❌ NEVER hardcode: `#3B82F6`, `rgb(59, 130, 246)`, or arbitrary hex values
- ❌ NEVER use inline styles for colors (except player-specific colors from database)

**Spacing**:

- ✅ Consistent padding: Cards use `p-6`, small elements use `p-4`, tight spacing uses `p-2`
- ✅ Consistent gaps: `gap-4` for grids, `gap-6` for larger layouts, `space-y-4` for vertical stacks
- ✅ Consistent margins: Prefer `gap` and `space-*` utilities over manual margins
- ❌ NEVER use arbitrary values like `p-[13px]` or `mt-[22px]`

**Typography**:

- ✅ Headings: `text-3xl font-bold` (h1), `text-2xl font-bold` (h2), `text-xl font-semibold` (h3)
- ✅ Body text: `text-base` for normal text, `text-sm` for secondary info
- ✅ Use `font-semibold` and `font-bold` consistently - not `font-[600]`
- ❌ NEVER mix font weights randomly or use arbitrary line heights

**Border Radius**:

- ✅ Cards and containers: `rounded-lg`
- ✅ Buttons and inputs: `rounded-lg`
- ✅ Small elements (badges, chips): `rounded-full` or `rounded-md`
- ❌ NEVER use inconsistent values like `rounded-xl` in one place and `rounded-sm` in similar components

**Shadows**:

- ✅ Cards: `shadow-sm` for subtle elevation
- ✅ Modals: `shadow-xl` for prominent overlays
- ✅ Hover states: `hover:shadow-md` for interactive elements
- ❌ NEVER use arbitrary shadows like `shadow-[0_2px_8px_rgba(0,0,0,0.1)]`

**Interactive States**:

- ✅ Hover: `hover:bg-opacity-90`, `hover:shadow-md`
- ✅ Active: `active:scale-95` for buttons
- ✅ Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- ✅ Focus: `focus:ring-2 focus:ring-primary focus:ring-offset-2`

### Component Reuse Checklist

Before creating ANY new UI component, answer these questions:

1. **Does a similar component already exist in [common/components/](common/components/)?**
    - Check `Button`, `Card`, `Input`, `Badge`, `Chip`, `Avatar`, `Modal`, etc.
    - If yes, USE IT - do not recreate

2. **Can I compose existing components?**
    - Example: `<Card><Badge /></Card>` instead of creating `BadgeCard`

3. **Is this component truly reusable?**
    - If used in only one place, it might belong in feature-specific `components/`
    - If reusable across features, it belongs in `common/components/`

4. **Does it follow the same patterns as existing components?**
    - Same prop naming conventions (`variant`, `size`, `className`, etc.)
    - Same style patterns (colors, spacing, typography)
    - Same accessibility patterns (ARIA labels, keyboard navigation)

### Page Layout Consistency

All pages should follow this structure:

```tsx
<div className="container mx-auto space-y-6 p-6">
	<PageHeader icon={Icon} title="Page Name" count={items.length} action={<Button />} />

	{/* Filters or controls */}
	<div className="flex items-center gap-4">
		<SegmentedControl />
		<Select />
	</div>

	{/* Main content */}
	<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{items.map((item) => (
			<Card key={item.id} />
		))}
	</div>
</div>
```

**Container patterns**:

- Root container: `container mx-auto p-6 space-y-6`
- Content sections: `space-y-4` or `space-y-6` for vertical rhythm
- Grid layouts: `grid gap-4` or `gap-6` for consistent spacing

### Professional Polish

- **Loading states**: Use `PageLoader` component, not custom spinners
- **Empty states**: Use `EmptyState` component with consistent messaging
- **Error states**: Use `ErrorMessage` component, not ad-hoc error displays
- **Responsive design**: Always test mobile (`md:`, `lg:` breakpoints)
- **Accessibility**: Proper ARIA labels, keyboard navigation, focus states
- **Animations**: Use `framer-motion` variants from existing components (Modal, etc.)

### When in Doubt

1. Look at existing pages in the same feature for patterns
2. Look at similar components in [common/components/](common/components/)
3. Check [src/index.css](src/index.css) for available CSS variables
4. Review [common/utils/themes.ts](common/utils/themes.ts) for theme values
5. **Ask yourself: "Does this match the rest of the app?"**

## Architecture Overview

**React + TypeScript + Vite** SPA for tracking board game events, player stats, and leaderboards. Backend: **Firebase** (Firestore, Auth, Storage). Styling: **Tailwind CSS v4** via Vite plugin (not PostCSS).

**Strict feature-based structure**: Domain-driven folders (`features/players`, `features/games`, `features/events`, `features/stats`, `features/leaderboard`, `features/users`, `features/settings`, `features/dashboard`) with shared utilities in `common/`. **Do not cross feature boundaries** - use context/hooks to access other feature data.

**Routing**: React Router v7 (from `react-router` package) routes defined inline in [src/main.tsx](src/main.tsx). All forms/modals are JSX components, not separate routes.

**Form validation**: Uses `react-hook-form` + `zod` schemas + `@hookform/resolvers` for type-safe form handling. All schemas in [common/utils/validation.ts](common/utils/validation.ts).

**Notifications**: `react-hot-toast` via `ToastProvider` for success/error messages.

## File Organization & Structure

**Feature folder anatomy** (consistent across all features):

```
features/[feature-name]/
  types.d.ts          # TypeScript interfaces (IPlayer, IGame, etc.)
  components/         # UI components specific to this feature
  context/            # Provider & Context for this feature's data
    [Feature]Provider.tsx  # Firebase integration, CRUD methods
    [Feature]Context.tsx   # React context export
  pages/              # Route components (e.g., PlayersList.tsx)
  utils/              # Feature-specific utilities
    helpers.ts        # Pure functions (formatting, transformations)
    hooks.ts          # Custom React hooks
    calculations/     # Complex calculation logic (subdirectory)
      index.ts        # Re-export all calculations
      [specific].ts   # Individual calculation modules
```

**Common folder structure** (shared across features):

```
common/
  components/         # Reusable UI components (Button, Modal, Card, etc.)
  context/            # Global providers (Auth, UI, Settings, Modal, Toast)
  utils/              # Shared utilities
    constants.ts      # App-wide constants (STATS_THRESHOLDS, DISPLAY_LIMITS)
    helpers.ts        # Generic helpers (formatPct, createMapBy, pluralize)
    validation.ts     # All Zod schemas (playerSchema, gameSchema, etc.)
    calculations.ts   # Generic math helpers (calculateWinRate, etc.)
    yearFilter.ts     # Year filtering logic
    sorting.ts        # Sorting utilities
    theme.ts          # Dark/light mode logic
    themes.ts         # Color theme system
    hooks.ts          # Shared custom hooks (useAppReady, useFilteredData)
```

**Critical rules for file placement**:

- **Feature-specific code stays in its feature folder** - no cross-contamination
- **Access other features via context/hooks only** - never import directly from another feature
- **Put calculations in `/calculations` subdirectories** when they exceed ~100 lines or contain multiple related functions
- **Use index.ts for re-exports** - keep imports clean (`import { X, Y } from "path"`)
- **Types go in types.d.ts** at the feature level, NOT in individual files
- **One component per file** - file name matches component name exactly

## Critical Context Provider Pattern

**Nested provider architecture** with strict dependency ordering (see [src/main.tsx](src/main.tsx)):

```tsx
<ErrorBoundary>
  <AuthProvider>
    <SettingsProvider>      {/* NEW: Global app settings */}
      <UsersProvider>
        <PlayersProvider>
          <GamesProvider>
            <EventsProvider>
              <ResultsProvider>
                <UIProvider>   {/* Depends on Events for year filtering */}
                  <ModalProvider>
                    <ToastProvider>
                      <ReadyGate>{/* Waits for all providers */}</ReadyGate>
```

**Provider responsibilities** (each provider is self-contained):

- **Real-time sync**: Uses Firebase `onSnapshot` for automatic updates
- **CRUD operations**: Exposes `add*`, `edit*`, `delete*` methods
- **Computed data**: Provides both array (`players`) and Map (`playerById`) for O(1) lookups
- **Loading states**: Manages its own `loading` flag
- **Error handling**: Catches and logs errors, uses toast notifications
- **Data caching**: Some providers use localStorage for instant load (see `SettingsProvider`)

**Data access pattern** (strictly enforced):

1. Providers fetch data from Firebase and manage state
2. Context exposes data via React Context API
3. Hooks (`use[Feature]()`) provide typed access to context
4. Components consume hooks - never access Firebase directly
5. **One-way data flow**: Providers → Context → Hooks → Components
6. **Provider-to-Map**: All providers expose both arrays and Maps via `createMapBy()` for O(1) lookups

**Critical dependencies**:

- `UIProvider` depends on `EventsProvider` (needs events for year calculation)
- `ReadyGate` blocks rendering until ALL providers finish loading
- `useAppReady()` hook checks all provider `loading` flags
- Order matters - do not rearrange providers without understanding dependencies

**Key global state managers**:

- **UIProvider**: Year filtering (`selectedYear`, `setSelectedYear`, `availableYears`), dark/light mode (`theme`, `toggleTheme`)
- **SettingsProvider**: App branding, themes, game tags, leaderboard configurations (see [features/settings/types.d.ts](features/settings/types.d.ts))
- **AuthProvider**: Authentication state, user role, permissions
- **ModalProvider**: Global modal management (`openModal`, `closeModal`)
- **ToastProvider**: Toast notifications (`showToast`)

## Data Model

**Core entities** (Firestore collections):

- **Users** (`IUser`): `email`, `role` ("admin" | "user"), `linkedPlayerId`, `createdAt`
- **Players** (`IPlayer`): `firstName`, `lastName`, `preferredName`, `pictureUrl`, `color`, `linkedUserId`
- **Games** (`IGame`): `name`, `points` (base value), `tags` (string array)
- **Events** (`IEvent`): `location`, `date` (ISO string), `gameIds[]`, `playerIds[]`
- **Results** (`IResult`): `eventId`, `gameId`, `order`, `playerResults[]`
    - `IPlayerResult`: `playerId`, `rank`, `isWinner`, `isLoser` (all nullable except `playerId`)
- **Settings** (`IAppSettings`): `appName`, `logoUrl`, `themeName`, `gameTags`, `leaderboards[]` (see [features/settings/types.d.ts](features/settings/types.d.ts))

**User-Player Relationship**:

- Users and Players are separate entities with optional bidirectional linking
- Users = app accounts with authentication and permissions (email, role only)
- Players = game participants with profile data (names, photos, colors)
- Link via `linkedPlayerId` on User and `linkedUserId` on Player
- Admins manage linking via Users page
- Users edit their profile via `/profile` page, which updates their linked player data directly

**Winner logic** ([common/utils/gameHelpers.ts](common/utils/gameHelpers.ts)):

```typescript
isPlayerWinner = (result) => result.isWinner || result.rank === 1;
```

**Game tags system** (NEW):

- Tags defined globally in Settings (`IAppSettings.gameTags`)
- Games can have multiple tags (`IGame.tags[]`)
- Default tags: `["Board Game", "Video Game"]`
- Used for filtering in leaderboards and stats

## Import Path Convention

**Use absolute imports from `src/`** (enabled via `vite-tsconfig-paths` plugin + `"baseUrl": "src"` in `tsconfig.app.json`):

```typescript
// ✅ Correct
import { usePlayers } from "features/players/context/PlayersContext";
import { getDisplayName } from "features/players/utils/helpers";

// ❌ Avoid relative paths
import { usePlayers } from "../../../features/players/context/PlayersContext";
```

## Context Access Pattern

**Each feature has context hooks**: `useUsers()`, `usePlayers()`, `useGames()`, `useEvents()`, `useResults()`, `useSettings()`

```typescript
import { usePlayers } from "features/players/context/PlayersContext";
const { players, playerById, addPlayer, editPlayer, deletePlayer } = usePlayers();
```

**All providers expose**: array, Map (by ID), loading flag, CRUD methods (`add*`, `edit*`, `delete*`)

## Authentication & Authorization

**Role-based access control** via `AuthProvider`:

```typescript
import { useAuth } from "common/context/AuthContext";
const { authUser, user, isAdmin, canEdit, currentUserPlayerId } = useAuth();
```

**Permissions**: Unauthenticated (read-only) | Users (edit own profile) | Admins (full CRUD)

**UI pattern**: Use `isAdmin` to conditionally render controls: `{isAdmin && <Button>Edit</Button>}`

## Modal & Toast System

**Modal**: Use `useModal()` to open forms as modal content, not routes
**Toast**: Use `useToast()` for success/error notifications

```typescript
const { openModal } = useModal();
const { showToast } = useToast();
openModal(<PlayerForm onSubmit={handleSubmit} />);
showToast("Player added successfully", "success");
```

## Year Filtering Pattern

**Global year filter** via `UIProvider` (defaults to most recent year, `null` = all years):

```typescript
const { selectedYear, setSelectedYear, availableYears } = useUI();
const filteredEvents = filterEventsByYear(events, selectedYear);
```

Utilities: `filterEventsByYear`, `filterResultsByYear`, `getAvailableYears` ([common/utils/yearFilter.ts](common/utils/yearFilter.ts))

## Stats & Aggregation

**Player stats are computed on-the-fly** using calculation utilities in feature-specific `/utils/calculations/` folders:

**Players feature** ([features/players/utils/calculations/](features/players/utils/calculations/)):

- `playerData.ts`: Core stats (wins, games, win rate, points)
- `aggregates.ts`: Game-specific stats, rank distribution, recent form
- `entries.ts`: Game entries and participation data
- `streaks.ts`: Win/loss streaks, form trends

**Events feature** ([features/events/utils/calculations/](features/events/utils/calculations/)):

- `playerStats.ts`: Player performance within events
- `gameStats.ts`: Game statistics for events

**Dashboard feature** ([features/dashboard/utils/calculations/](features/dashboard/utils/calculations/)):

- `lastEventTopScorers.ts`: Top scorers from most recent event
- `longestDrought.ts`: Players with longest time since win

**Calculation best practices**:

- Always filter results by player/game **before** aggregating to avoid expensive full-table scans
- Use Map lookups (`playerById.get()`, `gameById.get()`) for O(1) access
- Extract complex logic (>100 lines or multiple functions) into `/calculations` subdirectory
- Re-export all calculations from `index.ts` for clean imports
- Keep pure functions for testability and reusability
- Use constants from [common/utils/constants.ts](common/utils/constants.ts) for thresholds

## Styling with Tailwind v4

**Tailwind CSS v4** via `@tailwindcss/vite` plugin (not PostCSS):

- CSS variables: `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text` ([src/index.css](src/index.css))
- 5 theme presets: Default, Ocean, Forest, Sunset, Purple ([common/utils/themes.ts](common/utils/themes.ts))
- Dark mode: `.dark` class on `document.documentElement` via `UIProvider`
- Responsive: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Firebase Integration

**Config**: [src/firebase.ts](src/firebase.ts) exports `db`, `auth`, `storage`

**Real-time sync**: All providers use `onSnapshot` listeners (see [features/players/context/PlayersProvider.tsx](features/players/context/PlayersProvider.tsx))

**Image uploads**: Firebase Storage with cache control headers (see `PlayersProvider.uploadImage`)

## Development Workflow

**Commands**: `npm run dev` | `build` | `lint` | `preview`

**Deployment**: AWS S3 + CloudFront via CodeBuild ([buildspec.yml](buildspec.yml))

**Git hooks**: Husky + lint-staged (Prettier + ESLint on commit)

**Key dependencies**: React 19 + Router 7 + Firebase 12 + Tailwind 4 + react-hook-form + zod + recharts + lucide-react + framer-motion

## Common Patterns to Follow

1. **Display names**: Use `getDisplayName(player)` (from [features/players/utils/helpers.ts](features/players/utils/helpers.ts)) - prefers `preferredName` over `firstName`
2. **Icons**: Use `lucide-react` for all icons
3. **Animations**: Use `framer-motion` for modal transitions (see [common/components/Modal.tsx](common/components/Modal.tsx))
4. **Date handling**: Use `date-fns` library (already in dependencies)
5. **Charts**: Use `recharts` for all data visualizations (see [features/stats/components/](features/stats/components/))
6. **Form validation**: Use `react-hook-form` with `zodResolver` from `@hookform/resolvers/zod` for schema validation
7. **Error handling**: All components wrapped in `ErrorBoundary` (see [common/components/ErrorBoundary.tsx](common/components/ErrorBoundary.tsx))
8. **Percentage formatting**: Use `formatPct()` from [common/utils/helpers.ts](common/utils/helpers.ts) (rounds to whole number)
9. **Constants**: Use values from [common/utils/constants.ts](common/utils/constants.ts) for thresholds and display limits
10. **Component exports**: All common components re-exported via [common/components/index.ts](common/components/index.ts) - import from there, not individual files

## Key Files Reference

- **Provider setup**: [src/main.tsx](src/main.tsx)
- **Type definitions**: `src/features/*/types.d.ts` (6 feature types files)
- **Calculation modules**: `src/features/*/utils/calculations/` (players, events, dashboard)
- **Reusable components**: [src/common/components/](src/common/components/)
- **Shared utilities**: [src/common/utils/](src/common/utils/)
- **Routing**: All routes defined in [src/main.tsx](src/main.tsx) (no separate router config)
- **Constants**: [src/common/utils/constants.ts](src/common/utils/constants.ts) - thresholds and display limits
- **Validation schemas**: [src/common/utils/validation.ts](src/common/utils/validation.ts) - all Zod schemas
