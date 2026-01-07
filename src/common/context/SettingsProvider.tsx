import { useEffect, useState, type PropsWithChildren } from "react";
import { db, storage } from "firebase";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import type { IAppSettings } from "features/settings/types";
import { SettingsContext } from "common/context/SettingsContext";
import { applyThemeColors } from "common/utils/themes";
import { useAuth } from "common/context/AuthContext";
import { APP_DEFAULTS, STORAGE_KEYS } from "common/utils/constants";

const DEFAULT_SETTINGS: IAppSettings = {
	appName: APP_DEFAULTS.APP_NAME,
	logoUrl: null,
	themeName: APP_DEFAULTS.THEME_NAME,
};

/**
 * Load settings from localStorage cache
 */
function loadCachedSettings(): IAppSettings | null {
	try {
		const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
		if (cached) {
			return JSON.parse(cached) as IAppSettings;
		}
	} catch (error) {
		console.error("Failed to load cached settings:", error);
	}
	return null;
}

/**
 * Save settings to localStorage cache
 */
function saveCachedSettings(settings: IAppSettings): void {
	try {
		localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
	} catch (error) {
		console.error("Failed to save cached settings:", error);
	}
}

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [settings, setSettings] = useState<IAppSettings | null>(() => {
		// Initialize with cached settings if available, otherwise use defaults
		const cached = loadCachedSettings();
		const initialSettings = cached || DEFAULT_SETTINGS;

		// Apply theme and title synchronously during initialization
		applyThemeColors(initialSettings.themeName);
		document.title = initialSettings.appName;

		return initialSettings;
	});
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	// Listen to Firebase and sync with cache
	useEffect(() => {
		const unsubscribe = onSnapshot(doc(db, "settings", APP_DEFAULTS.SETTINGS_DOC_ID), (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.data() as IAppSettings;
				setSettings(data);
				saveCachedSettings(data); // Update cache
			} else {
				// Initialize with defaults if document doesn't exist
				setSettings(DEFAULT_SETTINGS);
				saveCachedSettings(DEFAULT_SETTINGS);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	// Apply theme colors when settings change from Firebase
	useEffect(() => {
		if (settings?.themeName) {
			applyThemeColors(settings.themeName);
		}
	}, [settings?.themeName]);

	// Update document title when app name changes from Firebase
	useEffect(() => {
		if (settings?.appName) {
			document.title = settings.appName;
		}
	}, [settings?.appName]);

	async function updateSettings(updates: Partial<IAppSettings>) {
		const settingsRef = doc(db, "settings", APP_DEFAULTS.SETTINGS_DOC_ID);
		await setDoc(
			settingsRef,
			{
				...updates,
				updatedAt: serverTimestamp(),
				updatedBy: user?.id || null,
			},
			{ merge: true },
		);
	}

	async function uploadLogo(file: File, onProgress?: (progress: number) => void): Promise<string> {
		const imageRef = ref(storage, `settings/logo-${Date.now()}`);

		const uploadTask = uploadBytesResumable(imageRef, file, {
			cacheControl: "public,max-age=31536000",
		});

		return new Promise<string>((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					onProgress?.(progress);
				},
				(error) => reject(error),
				async () => {
					const url = await getDownloadURL(uploadTask.snapshot.ref);
					resolve(url);
				},
			);
		});
	}

	return (
		<SettingsContext.Provider value={{ settings, loading, updateSettings, uploadLogo }}>
			{children}
		</SettingsContext.Provider>
	);
};
