# Game Tracker - AI Coding Agent Instructions

## Architecture Overview

**React + TypeScript + Vite** SPA for tracking board game events, player stats, and leaderboards. Backend: **Firebase** (Firestore, Auth, Storage). Styling: **Tailwind CSS v4** via Vite plugin (not PostCSS).

**Feature-based structure**: Domain-driven folders (`features/players`, `features/games`, `features/events`, `features/stats`, `features/leaderboard`) + shared utilities in `common/`.

**Routing**: React Router v7 (from `react-router` package) routes defined inline in [src/main.tsx](src/main.tsx). All forms/modals are JSX components, not separate routes.

**Form validation**: Uses `react-hook-form` + `zod` schemas + `@hookform/resolvers` for type-safe form handling.

**Notifications**: `react-hot-toast` via `ToastProvider` for success/error messages.

## Critical Context Provider Pattern

**Nested provider architecture** with strict ordering (see `src/main.tsx`):

```tsx
<ErrorBoundary>
  <AuthProvider>
    <PlayersProvider>
      <GamesProvider>
        <EventsProvider>
          <ResultsProvider>
            <UIProvider>
              <ModalProvider>
                <ToastProvider>
                  <ReadyGate>{/* app content */}</ReadyGate>
```

**Key behaviors:**

- Each provider uses Firebase `onSnapshot` for real-time sync
- Data flows: providers → context → hooks (one-way)
- `ReadyGate` blocks rendering until all providers load (`useAppReady` checks `loading` flags)
- All providers expose: `loading` boolean, data arrays, `*ById` Maps, CRUD methods
- **Provider-to-Map pattern**: Use `createMapBy()` helper for O(1) lookups (e.g., `playerById.get(id)`)
- **Year filtering**: `UIProvider` manages global `selectedYear` state, initialized to most recent year on load (see [common/utils/yearFilter.ts](common/utils/yearFilter.ts))
- **Theme management**: `UIProvider` handles dark/light mode via `theme` state, persisted in localStorage, applied to `document.documentElement.classList`

## Data Model

**Core entities** (Firestore collections):

- **Players** (`IPlayer`): `firstName`, `lastName`, `preferredName`, `pictureUrl`, `color`
- **Games** (`IGame`): `name`, `points` (base value), `type` ("board" | "video")
- **Events** (`IEvent`): `location`, `date` (ISO string), `gameIds[]`, `playerIds[]`
- **Results** (`IResult`): `eventId`, `gameId`, `order`, `playerResults[]`
    - `IPlayerResult`: `playerId`, `rank`, `isWinner`, `isLoser` (all nullable except `playerId`)

**Winner logic** (`common/utils/gameHelpers.ts`):

```typescript
isPlayerWinner = (result) => result.isWinner || result.rank === 1;
```

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

**Each feature has its own context hooks** (e.g., `usePlayers()`, `useGames()`, `useEvents()`, `useResults()`). Access them via:

```typescript
import { usePlayers } from "features/players/context/PlayersContext";
const { players, playerById, addPlayer, editPlayer, deletePlayer } = usePlayers();
```

**Provider-to-Map pattern**: All providers expose both array (`players`) and Map (`playerById`) for O(1) lookups. Use `createMapBy` helper from [common/utils/helpers.ts](common/utils/helpers.ts) (note: named `createMapBy`, not `createMapById`).

## Modal System

**Global modal controlled by `ModalProvider`** (see [common/context/ModalProvider.tsx](common/context/ModalProvider.tsx)):

```typescript
const { openModal, closeModal } = useModal();
openModal(<PlayerForm onSubmit={handleSubmit} />);
```

Forms are rendered as modal content, not separate routes. See [features/players/pages/PlayersList.tsx](features/players/pages/PlayersList.tsx) for reference.
**Toast notifications** via `useToast()` hook:

```typescript
import { useToast } from "common/context/ToastContext";
const { showToast } = useToast();
showToast("Player added successfully", "success");
```

## Year Filtering Pattern

**Global year filter managed by `UIProvider`** (see [common/context/UIProvider.tsx](common/context/UIProvider.tsx)):

- `selectedYear` state defaults to most recent year from events on initial load
- Set to `null` for "All Years" view
- Use filtering utilities from [common/utils/yearFilter.ts](common/utils/yearFilter.ts):
    - `filterEventsByYear(events, year)` - Filter events by year
    - `filterResultsByYear(results, events, year)` - Filter results based on event dates
    - `getAvailableYears(events)` - Extract unique years, sorted descending

**Access pattern**:

```typescript
const { selectedYear, setSelectedYear, availableYears } = useUI();
const filteredEvents = filterEventsByYear(events, selectedYear);
```

## Stats & Aggregation

**Player stats are computed on-the-fly** in [features/players/utils/stats.ts](features/players/utils/stats.ts). Key functions:

- `getPlayerData()`: Calculates wins, games played, win rate, points from results
- `getPlayerAggregates()`: Game-specific stats, rank distribution, recent form
- `getHeadToHeadRecord()`: Player vs player matchups
  **Dark mode**: Toggle via `.dark` class on `document.documentElement`, managed by `UIProvider`
- **Always filter results by player/game** before aggregating to avoid expensive full-table scans.

## Styling with Tailwind v4

Uses **Tailwind CSS v4** (imported via Vite plugin, not PostCSS):

- Custom colors via CSS variables in [src/index.css](src/index.css): `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`
- Player colors stored as hex strings in database and applied via inline styles
- Responsive grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Use `@theme` directive in CSS for defining design tokens (see [src/index.css](src/index.css))

## Firebase Integration

**Firebase config is in [src/firebase.ts](src/firebase.ts)** (exports `db`, `auth`, `storage`).

**Real-time listeners pattern** (see [features/players/context/PlayersProvider.tsx](features/players/context/PlayersProvider.tsx) for reference):

```typescript
useEffect(() => {
	const unsubscribe = onSnapshot(collection(db, "players"), (snapshot) => {
		const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		setPlayers(data);
		setLoading(false); // Always update loading state
	});
	return () => unsubscribe();
}, []);
```

**Image uploads** use Firebase Storage with cache control headers (see `PlayersProvider.uploadImage`).

## Development Workflow

**Commands** (from [package.json](package.json)):

- `npm run dev` - Start Vite dev server (default port 5173)
- `npm run build` - TypeScript compile + Vite production build
- `npm run lint` - ESLint check
- `npm run preview` - Preview production build locally

**Deployment**: AWS S3 + CloudFront via [buildspec.yml](buildspec.yml) (CodeBuild pipeline). Invalidates `/index.html` after deploy.

**Git hooks**: Husky + lint-staged runs Prettier and ESLint on staged files before commit.

## Common Patterns to Follow

1. **Display names**: Use `getDisplayName(player)` (from [features/players/utils/helpers.ts](features/players/utils/helpers.ts)) - prefers `preferredName` over `firstName`
2. **Icons**: Use `lucide-react` for all icons
3. **Animations**: Use `framer-motion` for modal transitions (see [common/components/Modal.tsx](common/components/Modal.tsx))
4. **Date handling**: Use `date-fns` library (already in dependencies)
5. **Charts**: Use `recharts` for all data visualizations (see [features/stats/components/](features/stats/components/))
6. **Form validation**: Use `react-hook-form` with `zodResolver` from `@hookform/resolvers/zod` for schema validation
7. **Error handling**: All components wrapped in `ErrorBoundary` (see [common/components/ErrorBoundary.tsx](common/components/ErrorBoundary.tsx))
8. **Percentage formatting**: Use `formatPct()` from [common/utils/helpers.ts](common/utils/helpers.ts) (rounds to whole number)

## Key Files Reference

- **Provider setup**: [src/main.tsx](src/main.tsx)
- **Type definitions**: `src/features/*/types.d.ts`
- **Stat calculations**: `src/features/*/utils/stats.ts`
- **Reusable components**: [src/common/components/](src/common/components/)
- **Routing**: All routes defined in [src/main.tsx](src/main.tsx) (no separate router config)
