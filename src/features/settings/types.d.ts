export interface IAppSettings {
	appName: string;
	logoUrl: string | null;
	themeName: string; // One of the THEMES keys
	updatedAt?: string;
	updatedBy?: string;
}
