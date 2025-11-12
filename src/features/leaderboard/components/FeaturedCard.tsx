import type { IPlayer } from "features/players/types";
import { getDisplayName } from "features/players/utils/helpers";
import { Link } from "react-router";

export const FeaturedCard: React.FC<{
	label: string;
	player: IPlayer;
	value: string;
	icon: React.ReactNode;
}> = ({ label, player, value, icon }) => {
	const name = getDisplayName(player);

	return (
		<Link to={`/players/${player.id}`}>
			<div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm transition-colors hover:bg-white/[0.03]">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_240px_at_100%_-60%,rgb(99_102_241/0.18),transparent_60%)]" />
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-white/5 text-white">
						{icon}
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-[11px] tracking-wide text-gray-400 uppercase">{label}</p>
						<p className="truncate text-sm font-semibold text-white">{name}</p>
					</div>
					<div className="shrink-0 rounded-full border border-gray-700 bg-[var(--color-bg)] px-2.5 py-1 text-xs font-semibold text-gray-200">
						{value}
					</div>
				</div>
			</div>
		</Link>
	);
};
