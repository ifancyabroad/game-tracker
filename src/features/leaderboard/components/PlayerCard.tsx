import { Link } from "react-router";
import type { PlayerWithData } from "features/players/utils/stats";
import { Avatar } from "common/components";

const getTintBg = (rank: number) => {
	if (rank === 1) return "bg-yellow-500/10";
	if (rank === 2) return "bg-slate-500/10";
	if (rank === 3) return "bg-amber-500/10";
	return "bg-white/5";
};

const getTintBar = (rank: number) => {
	if (rank === 1) return "bg-yellow-400/60";
	if (rank === 2) return "bg-slate-300/60";
	if (rank === 3) return "bg-amber-500/60";
	return "bg-white/25";
};

export const PlayerCard: React.FC<{
	row: PlayerWithData;
	rank: number;
	maxPoints: number;
}> = ({ row, rank, maxPoints }) => {
	const {
		id,
		pictureUrl,
		data: { points, wins, games, winRatePercent, name },
	} = row;
	const tintBg = getTintBg(rank);
	const tintBar = getTintBar(rank);
	const pct = maxPoints ? Math.round((points / maxPoints) * 100) : 0;

	return (
		<div key={id} className="relative">
			<div className="pointer-events-none absolute -top-1 -left-1 z-10 rounded-full border border-gray-700 bg-[var(--color-bg)] px-2 py-0.5 text-[11px] font-semibold text-gray-200 shadow select-none">
				{rank}
			</div>

			<Link
				to={`/players/${id}`}
				className={`group block w-full rounded-xl border border-gray-700 ${tintBg} p-2.5 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:p-3`}
			>
				<div className="flex items-center gap-2.5 sm:gap-3">
					<Avatar src={pictureUrl || undefined} name={name} size={56} />

					<div className="min-w-0 flex-1">
						<div className="flex items-center justify-between gap-2">
							<p className="truncate font-medium text-white">{name}</p>
							<p className="shrink-0 text-base font-semibold text-white tabular-nums sm:text-lg">
								{points}
								<span className="ml-1 text-[11px] font-normal text-gray-300">pts</span>
							</p>
						</div>

						<div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
							<span className="rounded-full border border-gray-700 bg-[var(--color-bg)] px-2 py-0.5 text-gray-300">
								{`${winRatePercent}%`}
							</span>
							<span className="text-gray-500">•</span>
							<span>{wins} wins</span>
							<span className="text-gray-500">•</span>
							<span>{games} played</span>
						</div>

						<div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-black/30">
							<div className={`h-full ${tintBar}`} style={{ width: `${pct}%` }} />
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};
