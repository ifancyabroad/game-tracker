import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSettings } from "common/context/SettingsContext";
import { Button } from "common/components";
import { useToast } from "common/context/ToastContext";
import { THEMES } from "common/utils/themes";
import { APP_DEFAULTS } from "common/utils/constants";
import { themeSettingsSchema, type ThemeSettingsFormData } from "common/utils/validation";

export const ThemeSettingsForm: React.FC = () => {
	const { settings, updateSettings } = useSettings();
	const toast = useToast();

	const {
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { isDirty, isSubmitting },
	} = useForm<ThemeSettingsFormData>({
		resolver: zodResolver(themeSettingsSchema),
		defaultValues: {
			themeName: settings?.themeName || "game-table",
		},
	});

	const selectedTheme = watch("themeName");

	// Reset form when settings load to update the baseline for isDirty
	useEffect(() => {
		if (settings?.themeName) {
			reset({ themeName: settings.themeName });
		}
	}, [settings?.themeName, reset]);

	const onSubmit = async (data: ThemeSettingsFormData) => {
		try {
			await updateSettings({
				themeName: data.themeName,
			});
			toast.success("Theme updated successfully");
		} catch (error) {
			console.error("Failed to update theme:", error);
			toast.error("Failed to update theme. Please check your permissions.");
			// Reset form to current saved value on error
			setValue("themeName", settings?.themeName || APP_DEFAULTS.THEME_NAME);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="grid gap-2 sm:gap-3 lg:grid-cols-2 xl:grid-cols-3">
				{Object.values(THEMES).map((theme) => {
					const isSelected = selectedTheme === theme.name;
					const isActive = settings?.themeName === theme.name;
					return (
						<button
							key={theme.name}
							type="button"
							onClick={() => setValue("themeName", theme.name, { shouldDirty: true })}
							className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
								isSelected
									? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
									: "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]"
							}`}
						>
							<div className="flex items-start gap-3">
								{/* Color Preview Swatches */}
								<div className="flex shrink-0 gap-1">
									<div
										className="h-10 w-2.5 rounded"
										style={{ backgroundColor: theme.preview.primary }}
									/>
									<div className="h-10 w-2.5 rounded" style={{ backgroundColor: theme.preview.bg }} />
									<div
										className="h-10 w-2.5 rounded"
										style={{ backgroundColor: theme.preview.surface }}
									/>
								</div>

								{/* Theme Info */}
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<h3 className="font-medium text-[var(--color-text)]">{theme.label}</h3>
										{isActive && (
											<span className="rounded bg-[var(--color-primary)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary-contrast)]">
												Active
											</span>
										)}
									</div>
									<p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
										{theme.description}
									</p>
								</div>

								{/* Selection Radio */}
								<div className="flex shrink-0 items-center">
									<div
										className={`h-4 w-4 rounded-full border-2 ${
											isSelected
												? "border-[var(--color-primary)] bg-[var(--color-primary)]"
												: "border-[var(--color-border)]"
										}`}
									>
										{isSelected && (
											<div className="flex h-full w-full items-center justify-center">
												<div className="h-1.5 w-1.5 rounded-full bg-white" />
											</div>
										)}
									</div>
								</div>
							</div>
						</button>
					);
				})}
			</div>

			<Button type="submit" disabled={!isDirty || isSubmitting} className="w-full sm:w-auto">
				{isSubmitting ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
};
