import { useForm } from "react-hook-form";
import { Trophy } from "lucide-react";
import { Button, Input, Label, ErrorMessage, FormHeader, Chip, Switch } from "common/components";
import { useSettings } from "common/context/SettingsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { getDisplayName } from "features/players/utils/helpers";
import type { ILeaderboard } from "features/settings/types";

interface LeaderboardFormData {
	name: string;
	gameTags: string[];
	playerIds: string[];
	startDate: string;
	endDate: string;
	isDefault: boolean;
}

interface ILeaderboardFormProps {
	initialData?: ILeaderboard;
	onSubmit: (data: Omit<ILeaderboard, "id">) => Promise<void> | void;
}

export const LeaderboardForm: React.FC<ILeaderboardFormProps> = ({ initialData, onSubmit }) => {
	const { settings } = useSettings();
	const { players } = usePlayers();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isDirty, isSubmitting },
	} = useForm<LeaderboardFormData>({
		defaultValues: {
			name: initialData?.name || "",
			gameTags: initialData?.gameTags || [],
			playerIds: initialData?.playerIds || [],
			startDate: initialData?.startDate || "",
			endDate: initialData?.endDate || "",
			isDefault: initialData?.isDefault || false,
		},
	});

	const gameTagsValue = watch("gameTags");
	const playerIdsValue = watch("playerIds");
	const startDateValue = watch("startDate");
	const endDateValue = watch("endDate");
	const isDefaultValue = watch("isDefault");

	const availableTags = settings?.gameTags || [];
	const sortedPlayers = [...players].sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));

	const toggleGameTag = (tag: string) => {
		const current = gameTagsValue || [];
		if (current.includes(tag)) {
			setValue(
				"gameTags",
				current.filter((t) => t !== tag),
				{ shouldDirty: true },
			);
		} else {
			setValue("gameTags", [...current, tag], { shouldDirty: true });
		}
	};

	const togglePlayer = (playerId: string) => {
		const current = playerIdsValue || [];
		if (current.includes(playerId)) {
			setValue(
				"playerIds",
				current.filter((id) => id !== playerId),
				{ shouldDirty: true },
			);
		} else {
			setValue("playerIds", [...current, playerId], { shouldDirty: true });
		}
	};

	const onFormSubmit = async (data: LeaderboardFormData) => {
		// Convert empty strings to undefined for optional date fields
		const leaderboardData: Omit<ILeaderboard, "id"> = {
			name: data.name,
			gameTags: data.gameTags,
			playerIds: data.playerIds,
			startDate: data.startDate || undefined,
			endDate: data.endDate || undefined,
			isDefault: data.isDefault,
		};

		await onSubmit(leaderboardData);
		if (!initialData) {
			reset();
		} else {
			reset(data);
		}
	};

	const isEditMode = !!initialData;
	const isSubmitDisabled = isSubmitting || (isEditMode && !isDirty);

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="m-0 flex flex-col gap-4 p-0">
			<FormHeader icon={<Trophy />} title={isEditMode ? "Edit Leaderboard" : "Add Leaderboard"} />

			<div>
				<Label required>Name</Label>
				<Input
					type="text"
					{...register("name", { required: "Name is required" })}
					placeholder="e.g., Board Games, Core Group, Summer 2025"
					maxLength={100}
				/>
				{errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
			</div>

			<div>
				<Label>Game Tags</Label>
				<p className="mb-2 text-xs text-[var(--color-text-secondary)]">Leave empty to include all games</p>
				{availableTags.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{availableTags.map((tag) => (
							<Chip
								key={tag}
								label={tag}
								active={gameTagsValue?.includes(tag)}
								onClick={() => toggleGameTag(tag)}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-[var(--color-text-secondary)]">No tags available</p>
				)}
			</div>

			<div>
				<Label>Players</Label>
				<p className="mb-2 text-xs text-[var(--color-text-secondary)]">Leave empty to include all players</p>
				{sortedPlayers.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{sortedPlayers.map((player) => (
							<Chip
								key={player.id}
								label={getDisplayName(player)}
								active={playerIdsValue?.includes(player.id)}
								onClick={() => togglePlayer(player.id)}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-[var(--color-text-secondary)]">No players available</p>
				)}
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Label>Start Date (Optional)</Label>
					<Input type="date" {...register("startDate")} />
				</div>
				<div>
					<Label>End Date (Optional)</Label>
					<Input type="date" {...register("endDate")} />
				</div>
			</div>

			{startDateValue && endDateValue && startDateValue > endDateValue && (
				<ErrorMessage>End date must be after start date</ErrorMessage>
			)}

			<div>
				<Switch
					label="Set as default leaderboard"
					checked={isDefaultValue}
					onChange={(checked) => setValue("isDefault", checked, { shouldDirty: true })}
				/>
				<p className="mt-1 text-xs text-[var(--color-text-secondary)]">
					The default leaderboard is shown on the homepage and opens first on the leaderboard page
				</p>
			</div>

			<Button type="submit" disabled={isSubmitDisabled}>
				{isEditMode ? "Save Changes" : "Add Leaderboard"}
			</Button>
		</form>
	);
};
