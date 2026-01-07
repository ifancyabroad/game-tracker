import { useSettings } from "common/context/SettingsContext";
import { APP_DEFAULTS } from "common/utils/constants";
import Logo from "assets/logo.svg?react";

interface AppBrandingProps {
	/** Optional className for the logo container */
	logoClassName?: string;
	/** Optional className for the app name text */
	textClassName?: string;
}

export const AppBranding: React.FC<AppBrandingProps> = ({ logoClassName, textClassName }) => {
	const { settings } = useSettings();

	if (settings?.logoUrl) {
		return (
			<div className="flex h-9 items-center">
				<img
					src={settings.logoUrl}
					alt={settings.appName}
					className="h-full w-auto max-w-[200px] object-contain"
				/>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2.5">
			<div className={logoClassName || "flex h-9 w-9 items-center justify-center"}>
				<Logo className="h-full w-full" />
			</div>
			<h1 className={textClassName || "font-display text-base text-[var(--color-text)] uppercase"}>
				{settings?.appName || APP_DEFAULTS.APP_NAME}
			</h1>
		</div>
	);
};
