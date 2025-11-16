# Game Tracker - AI Coding Agent Instructions

## Architecture Overview

This is a **React + TypeScript + Vite** single-page application for tracking board game events, player stats, and leaderboards. Uses **Firebase** (Firestore, Auth, Storage) as the backend and **Tailwind CSS v4** for styling.

**Feature-based architecture**: Code is organized by domain (`features/players`, `features/games`, `features/events`, `features/stats`, `features/leaderboard`) with shared utilities in `common/`.

## Critical Context Provider Pattern

The app uses a **nested provider architecture** (see `src/main.tsx`):

```tsx
<AuthProvider>
	<PlayersProvider>
		<GamesProvider>
			<EventsProvider>
				<ResultsProvider>
					<UIProvider>
						<ModalProvider>
							<ReadyGate>{/* app content */}</ReadyGate>
						</ModalProvider>
					</UIProvider>
				</ResultsProvider>
			</EventsProvider>
		</GamesProvider>
	</PlayersProvider>
</AuthProvider>
```

**Key behaviors:**

- Each provider uses Firebase `onSnapshot` for real-time data sync
- Data flows one-way from providers → context → hooks
- `ReadyGate` component blocks rendering until all providers finish loading (`useAppReady` hook)
- All providers expose a `loading` boolean and CRUD methods

## Data Model

**Core entities** (Firestore collections):

- **Players** (`IPlayer`): `firstName`, `lastName`, `preferredName`, `pictureUrl`, `color`
- **Games** (`IGame`): `name`, `points` (base point value)
- **Events** (`IEvent`): `location`, `date`, `gameIds[]`, `playerIds[]`
- **Results** (`IResult`): `eventId`, `gameId`, `order`, `playerResults[]`
    - `IPlayerResult`: `playerId`, `rank`, `isWinner`, `isLoser`

**Winner logic** (see `common/utils/gameHelpers.ts`):

```typescript
isPlayerWinner = (result) => result.isWinner || result.rank === 1;
```

## Import Path Convention

**Use absolute imports from `src/`** (configured in `tsconfig.app.json` with `"baseUrl": "src"`):

```typescript
// ✅ Correct
import { usePlayers } from "features/players/context/PlayersContext";
import { getDisplayName } from "features/players/utils/helpers";

// ❌ Avoid relative paths like "../../../"
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

- Custom colors via CSS variables: `var(--color-primary)`, `var(--color-secondary)`
- Player colors stored as hex strings in database and applied via inline styles
- Responsive grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Firebase Integration

**Firebase config is in `src/firebase.ts`** (exports `db`, `auth`, `storage`).

**Real-time listeners pattern**:

```typescript
useEffect(() => {
	const unsubscribe = onSnapshot(collection(db, "players"), (snapshot) => {
		const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		setPlayers(data);
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
