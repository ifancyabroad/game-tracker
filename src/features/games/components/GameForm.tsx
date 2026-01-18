import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IGame } from "features/games/types";
import { Gamepad2, X } from "lucide-react";
import { ColorPicker, Input, Label, Button, FormHeader, ErrorMessage, Chip } from "common/components";
import { gameSchema, type GameFormData } from "common/utils/validation";
import { useSettings } from "common/context/SettingsContext";

interface IGameFormProps {
	initialData?: IGame;
	onSubmit: (game: Omit<IGame, "id">) => Promise<void> | void;
}

export const GameForm: React.FC<IGameFormProps> = ({ initialData, onSubmit }) => {
	const { settings } = useSettings();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isDirty, isSubmitting },
	} = useForm({
		resolver: zodResolver(gameSchema),
		defaultValues: {
			name: initialData?.name || "",
			points: initialData?.points || 1,
			tags: initialData?.tags || [],
			color: initialData?.color || "#6366f1",
		},
	});

	const tagsValue = watch("tags");
	const colorValue = watch("color");

	const availableTags = settings?.gameTags || [];

	const toggleTag = (tag: string) => {
		const currentTags = tagsValue || [];
		if (currentTags.includes(tag)) {
			setValue(
				"tags",
				currentTags.filter((t) => t !== tag),
				{ shouldDirty: true },
			);
		} else {
			setValue("tags", [...currentTags, tag], { shouldDirty: true });
		}
	};

	const onFormSubmit = async (data: GameFormData) => {
		await onSubmit(data);
		if (!initialData) {
			reset();
		} else {
			// Reset form with new values to clear dirty state
			reset(data);
		}
	};

	const isEditMode = !!initialData;
	const isSubmitDisabled = isSubmitting || (isEditMode && !isDirty);

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="m-0 flex flex-col gap-4 p-0">
			<FormHeader icon={<Gamepad2 />} title={initialData ? "Edit Game" : "Add Game"} />

			<div>
				<Label required>Name</Label>
				<Input type="text" {...register("name")} placeholder="Game Name" maxLength={100} />
				{errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
			</div>

			<div>
				<Label required>Points</Label>
				<Input
					type="number"
					{...register("points", { valueAsNumber: true })}
					placeholder="Game Points"
					min={1}
					max={3}
				/>
				{errors.points && <ErrorMessage>{errors.points.message}</ErrorMessage>}
			</div>

			<div>
				<Label>Tags</Label>
				{availableTags.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{availableTags.map((tag) => (
							<Chip
								key={tag}
								label={tag}
								active={tagsValue?.includes(tag)}
								onClick={() => toggleTag(tag)}
								icon={tagsValue?.includes(tag) ? <X className="h-3 w-3" /> : undefined}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-[var(--color-text-secondary)]">
						No tags available. Admins can add tags in Settings.
					</p>
				)}
				{errors.tags && <ErrorMessage>{errors.tags.message}</ErrorMessage>}
			</div>

			<div>
				<ColorPicker
					label="Game colour"
					value={colorValue}
					onChange={(newColor) => setValue("color", newColor, { shouldDirty: true })}
					showInput
				/>
				{errors.color && <ErrorMessage>{errors.color.message}</ErrorMessage>}
			</div>

			<Button type="submit" disabled={isSubmitDisabled}>
				{isEditMode ? "Save Changes" : "Add Game"}
			</Button>
		</form>
	);
};
