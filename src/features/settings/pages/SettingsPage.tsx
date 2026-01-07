import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader, Card } from "common/components";
import { BrandingSettingsForm } from "features/settings/components/BrandingSettingsForm";
import { ThemeSettingsForm } from "features/settings/components/ThemeSettingsForm";
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

			<div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:items-start">
				<Card className="p-4 sm:p-6 md:col-span-2">
					<h2 className="mb-4 text-lg font-semibold">Theme</h2>
					<ThemeSettingsForm />
				</Card>

				<Card className="p-4 sm:p-6">
					<h2 className="mb-4 text-lg font-semibold">Branding</h2>
					<BrandingSettingsForm />
				</Card>
			</div>
		</div>
	);
};
