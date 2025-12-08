# Game Tracker - AI Coding Agent Instructions

## Architecture Overview

**React + TypeScript + Vite** SPA for tracking board game events, player stats, and leaderboards. Backend: **Firebase** (Firestore, Auth, Storage). Styling: **Tailwind CSS v4** via Vite plugin.

**Feature-based structure**: Domain-driven folders (`features/players`, `features/games`, `features/events`, `features/stats`, `features/leaderboard`) + shared utilities in `common/`.

## Critical Context Provider Pattern

**Nested provider architecture** with strict ordering (see `src/main.tsx`):

```tsx
<AuthProvider>
  <PlayersProvider>
    <GamesProvider>
      <EventsProvider>
        <ResultsProvider>
          <UIProvider>
            <ModalProvider>
              <ReadyGate>{/* app content */}</ReadyGate>
```

**Key behaviors:**

- Each provider uses Firebase `onSnapshot` for real-time sync
- Data flows: providers → context → hooks (one-way)
- `ReadyGate` blocks rendering until all providers load (`useAppReady` checks `loading` flags)
- All providers expose: `loading` boolean, data arrays, `*ById` Maps, CRUD methods
- **Provider-to-Map pattern**: Use `createMapById()` helper for O(1) lookups (e.g., `playerById.get(id)`)

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

**Provider-to-Map pattern**: All providers expose both array (`players`) and Map (`playerById`) for O(1) lookups. Use `createMapById` helper from `common/utils/helpers.ts`.

## Modal System

**Global modal controlled by `ModalProvider`** (see `common/context/ModalProvider.tsx`):

```typescript
const { openModal, closeModal } = useModal();
openModal(<PlayerForm onSubmit={handleSubmit} />);
```

Forms are rendered as modal content, not separate routes. See `features/players/pages/PlayersList.tsx` for reference.

## Stats & Aggregation

**Player stats are computed on-the-fly** in `features/players/utils/stats.ts`. Key functions:

- `getPlayerData()`: Calculates wins, games played, win rate, points from results
- `getPlayerAggregates()`: Game-specific stats, rank distribution, recent form
- `getHeadToHeadRecord()`: Player vs player matchups

**Always filter results by player/game** before aggregating to avoid expensive full-table scans.

## Styling with Tailwind v4

Uses **Tailwind CSS v4** (imported via Vite plugin, not PostCSS):

- Custom colors via CSS variables in `src/index.css`: `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`
- Player colors stored as hex strings in database and applied via inline styles
- Responsive grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Use `@theme` directive in CSS for defining design tokens (see `src/index.css`)

## Firebase Integration

**Firebase config is in `src/firebase.ts`** (exports `db`, `auth`, `storage`).

**Real-time listeners pattern** (see `PlayersProvider.tsx` for reference):

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

**Commands** (from `package.json`):

- `npm run dev` - Start Vite dev server (default port 5173)
- `npm run build` - TypeScript compile + Vite production build
- `npm run lint` - ESLint check
- `npm run preview` - Preview production build locally

**Deployment**: AWS S3 + CloudFront via `buildspec.yml` (CodeBuild pipeline). Invalidates `/index.html` after deploy.

**Git hooks**: Husky + lint-staged runs Prettier and ESLint on staged files before commit.

## Common Patterns to Follow

1. **Display names**: Use `getDisplayName(player)` (from `features/players/utils/helpers.ts`) - prefers `preferredName` over `firstName`
2. **Icons**: Use `lucide-react` for all icons
3. **Animations**: Use `framer-motion` for modal transitions (see `common/components/Modal.tsx`)
4. **Date handling**: Use `date-fns` library (already in dependencies)
5. **Charts**: Use `recharts` for all data visualizations (see `features/stats/components/`)
6. **Percentage formatting**: Use `formatPct()` from `common/utils/helpers.ts` (rounds to whole number)

## Key Files Reference

- **Provider setup**: `src/main.tsx`
- **Type definitions**: `src/features/*/types.d.ts`
- **Stat calculations**: `src/features/*/utils/stats.ts`
- **Reusable components**: `src/common/components/`
- **Routing**: All routes defined in `src/main.tsx` (no separate router config)
