import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader, Card } from "common/components";
import { BrandingSettingsForm } from "features/settings/components/BrandingSettingsForm";
import { ThemeSettingsForm } from "features/settings/components/ThemeSettingsForm";
import { GameTagsManager } from "features/settings/components/GameTagsManager";
import { LeaderboardsManager } from "features/settings/components/LeaderboardsManager";
import { useAuth } from "common/context/AuthContext";
import { Navigate } from "react-router";

export const SettingsPage: React.FC = () => {
	const { isAdmin } = useAuth();

	// Redirect non-admin users
	if (!isAdmin) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader icon={<SettingsIcon />} title="App Settings" />

			<div className="grid gap-4 sm:gap-6">
				{/* Branding Settings */}
				<Card className="p-4 sm:p-6">
					<div className="mb-6">
						<h2 className="mb-2 text-lg font-semibold">Branding</h2>
						<p className="text-sm text-[var(--color-text-secondary)]">
							Customize your app's name and logo.
						</p>
					</div>
					<BrandingSettingsForm />
				</Card>

				{/* Theme Settings */}
				<Card className="p-4 sm:p-6">
					<div className="mb-6">
						<h2 className="mb-2 text-lg font-semibold">Theme</h2>
						<p className="text-sm text-[var(--color-text-secondary)]">
							Choose a color scheme for your site.
						</p>
					</div>
					<ThemeSettingsForm />
				</Card>

				{/* Game Tags */}
				<Card className="p-4 sm:p-6">
					<div className="mb-6">
						<h2 className="mb-2 text-lg font-semibold">Game Tags</h2>
						<p className="text-sm text-[var(--color-text-secondary)]">
							Manage tags that can be applied to games for categorization and filtering.
						</p>
					</div>
					<GameTagsManager />
				</Card>

				{/* Leaderboards */}
				<Card className="p-4 sm:p-6">
					<div className="mb-6">
						<h2 className="mb-2 text-lg font-semibold">Leaderboards</h2>
						<p className="text-sm text-[var(--color-text-secondary)]">
							Configure custom leaderboards with specific game tags, players, and date ranges.
						</p>
					</div>
					<LeaderboardsManager />
				</Card>
			</div>
		</div>
	);
};
