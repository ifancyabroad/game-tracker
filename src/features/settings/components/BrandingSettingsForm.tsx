import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload as UploadIcon } from "lucide-react";
import { useSettings } from "common/context/SettingsContext";
import { Input, Label, Button, ErrorMessage } from "common/components";
import { useToast } from "common/context/ToastContext";
import { APP_DEFAULTS } from "common/utils/constants";
import { brandingSettingsSchema, type BrandingSettingsFormData } from "common/utils/validation";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

export const BrandingSettingsForm: React.FC = () => {
	const { settings, updateSettings, uploadLogo } = useSettings();
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(settings?.logoUrl || null);
	const toast = useToast();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isDirty, isSubmitting },
	} = useForm<BrandingSettingsFormData>({
		resolver: zodResolver(brandingSettingsSchema),
		defaultValues: {
			appName: settings?.appName || APP_DEFAULTS.APP_NAME,
			logoUrl: settings?.logoUrl || "",
		},
	});

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			toast.error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
			return;
		}

		// Validate file type
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			toast.error("Please select a PNG, JPG, or SVG image");
			return;
		}

		try {
			setUploadProgress(0);
			const url = await uploadLogo(file, setUploadProgress);
			setValue("logoUrl", url, { shouldDirty: true });
			setPreviewUrl(url);
			setUploadProgress(null);
			toast.success("Logo uploaded successfully");
		} catch (error) {
			console.error("Upload failed:", error);
			toast.error("Failed to upload logo");
			setUploadProgress(null);
		}
	};

	const handleRemoveLogo = () => {
		setValue("logoUrl", null, { shouldDirty: true });
		setPreviewUrl(null);
	};

	const onSubmit = async (data: BrandingSettingsFormData) => {
		try {
			await updateSettings({
				appName: data.appName,
				logoUrl: data.logoUrl,
			});
			toast.success("Branding settings updated successfully");
		} catch (error) {
			console.error("Failed to update settings:", error);
			toast.error("Failed to update settings");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="max-w-md">
				<Label htmlFor="appName" required>
					App Name
				</Label>
				<Input
					id="appName"
					{...register("appName")}
					placeholder={APP_DEFAULTS.APP_NAME}
					error={!!errors.appName}
				/>
				{errors.appName && <ErrorMessage>{errors.appName.message}</ErrorMessage>}
				<p className="mt-1 text-sm text-[var(--color-text-muted)]">
					This name will appear in the header, sidebar, and browser tab
				</p>
			</div>

			<div>
				<Label htmlFor="logo">Logo</Label>
				<div className="space-y-3">
					{previewUrl ? (
						<div className="flex items-center gap-4">
							<img
								src={previewUrl}
								alt="Logo preview"
								className="h-16 w-auto max-w-[200px] rounded border border-[var(--color-border)] bg-[var(--color-surface)] object-contain p-2"
							/>
							<Button type="button" variant="secondary" onClick={handleRemoveLogo}>
								Remove Logo
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-4">
							<div className="flex h-16 w-16 items-center justify-center rounded border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
								<UploadIcon className="h-6 w-6 text-[var(--color-text-muted)]" />
							</div>
							<div>
								<label htmlFor="logo-upload">
									<Button
										type="button"
										variant="secondary"
										onClick={() => document.getElementById("logo-upload")?.click()}
									>
										Upload Logo
									</Button>
									<input
										id="logo-upload"
										type="file"
										accept={ACCEPTED_IMAGE_TYPES.join(",")}
										onChange={handleFileSelect}
										className="hidden"
									/>
								</label>
							</div>
						</div>
					)}
					{uploadProgress !== null && (
						<div className="w-full rounded-full bg-[var(--color-border)] p-1">
							<div
								className="h-2 rounded-full bg-[var(--color-primary)] transition-all duration-300"
								style={{ width: `${uploadProgress}%` }}
							/>
						</div>
					)}
					<p className="text-sm text-[var(--color-text-muted)]">
						Recommended: Wide format (e.g., 200×60px). Accepts PNG, JPG, or SVG. Max 2MB.
					</p>
				</div>
			</div>

			<Button type="submit" disabled={!isDirty || isSubmitting} className="w-full sm:w-auto">
				{isSubmitting ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
};
