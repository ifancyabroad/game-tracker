import { Avatar } from "common/components/Avatar";
import type { IPlayer } from "features/players/types";
import { getDisplayName } from "features/players/utils/helpers";

export const FeaturedCard: React.FC<{
	label: string;
	player?: IPlayer;
	value: string;
	icon: React.ReactNode;
}> = ({ label, player, value, icon }) => {
	const name = getDisplayName(player);
	return (
		<div className="group relative flex items-center gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm transition-transform hover:-translate-y-0.5">
			<div className="relative">
				<Avatar src={player?.pictureUrl || undefined} name={name} size={48} />
			</div>
			<div className="min-w-0">
				<p className="text-[11px] tracking-wide text-gray-400 uppercase">{label}</p>
				<p className="truncate text-sm font-semibold text-white">{name}</p>
				<p className="flex items-center gap-1 text-xs text-gray-300">
					{icon}
					{value}
				</p>
			</div>
		</div>
	);
};
