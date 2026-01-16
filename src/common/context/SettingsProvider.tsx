import { useEffect, useState, type PropsWithChildren } from "react";
import { db, storage } from "firebase";
import { doc, onSnapshot, setDoc, serverTimestamp, getDocs, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import type { IAppSettings, ILeaderboard } from "features/settings/types";
import { SettingsContext } from "common/context/SettingsContext";
import { applyThemeColors } from "common/utils/themes";
import { useAuth } from "common/context/AuthContext";
import { APP_DEFAULTS, STORAGE_KEYS } from "common/utils/constants";

const DEFAULT_SETTINGS: IAppSettings = {
	appName: APP_DEFAULTS.APP_NAME,
	logoUrl: null,
	themeName: APP_DEFAULTS.THEME_NAME,
	gameTags: ["Board Game", "Video Game"],
	leaderboards: [
		{
			id: "default",
			name: "Overall",
			gameTags: [],
			playerIds: [],
			isDefault: true,
		},
	],
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
		const unsubscribe = onSnapshot(doc(db, "settings", APP_DEFAULTS.SETTINGS_DOC_ID), async (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.data() as IAppSettings;

				// Auto-migrate: Add default gameTags and leaderboards if missing
				let needsMigration = false;
				const updates: Partial<IAppSettings> = {};

				if (!data.gameTags || data.gameTags.length === 0) {
					updates.gameTags = DEFAULT_SETTINGS.gameTags;
					needsMigration = true;
				}

				if (!data.leaderboards || data.leaderboards.length === 0) {
					updates.leaderboards = DEFAULT_SETTINGS.leaderboards;
					needsMigration = true;
				}

				if (needsMigration) {
					const settingsRef = doc(db, "settings", APP_DEFAULTS.SETTINGS_DOC_ID);
					await setDoc(settingsRef, updates, { merge: true });
					// The snapshot listener will fire again with the merged data
					return;
				}

				setSettings(data);
				saveCachedSettings(data); // Update cache
			} else {
				// Initialize with defaults if document doesn't exist
				const settingsRef = doc(db, "settings", APP_DEFAULTS.SETTINGS_DOC_ID);
				await setDoc(settingsRef, DEFAULT_SETTINGS);
				// The snapshot listener will fire again with the new document
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

	// Tag management methods
	async function addGameTag(tag: string) {
		if (!settings) return;
		const trimmedTag = tag.trim();
		if (!trimmedTag || settings.gameTags.includes(trimmedTag)) {
			throw new Error("Tag already exists or is empty");
		}

		const updatedTags = [...settings.gameTags, trimmedTag];
		await updateSettings({ gameTags: updatedTags });
	}

	async function deleteGameTag(tag: string): Promise<{ usageCount: number; affectedGames: string[] }> {
		if (!settings) throw new Error("Settings not loaded");

		// Check usage in games collection
		const gamesSnapshot = await getDocs(collection(db, "games"));
		const affectedGames: string[] = [];
		gamesSnapshot.docs.forEach((doc) => {
			const game = doc.data();
			if (game.tags?.includes(tag)) {
				affectedGames.push(doc.id);
			}
		});

		// Check usage in leaderboards
		const usedInLeaderboards = settings.leaderboards.some((lb) => lb.gameTags.includes(tag));

		if (usedInLeaderboards) {
			throw new Error("Cannot delete tag: used in one or more leaderboard configurations");
		}

		// Remove tag from settings
		const updatedTags = settings.gameTags.filter((t) => t !== tag);

		// Remove tag from all affected games
		if (affectedGames.length > 0) {
			const updatePromises = affectedGames.map(async (gameId) => {
				const gameRef = doc(db, "games", gameId);
				const gameDoc = gamesSnapshot.docs.find((d) => d.id === gameId);
				if (gameDoc) {
					const currentTags = gameDoc.data().tags || [];
					const newTags = currentTags.filter((t: string) => t !== tag);
					await updateDoc(gameRef, { tags: newTags });
				}
			});
			await Promise.all(updatePromises);
		}

		await updateSettings({ gameTags: updatedTags });

		return { usageCount: affectedGames.length, affectedGames };
	}

	// Leaderboard management methods
	async function addLeaderboard(leaderboard: Omit<ILeaderboard, "id">) {
		if (!settings) return;

		const newLeaderboard: ILeaderboard = {
			...leaderboard,
			id: `lb-${Date.now()}`,
		};

		// If new leaderboard is default, clear isDefault from all existing leaderboards
		const updatedLeaderboards = newLeaderboard.isDefault
			? [...settings.leaderboards.map((lb) => ({ ...lb, isDefault: false })), newLeaderboard]
			: [...settings.leaderboards, newLeaderboard];

		await updateSettings({ leaderboards: updatedLeaderboards });
	}

	async function editLeaderboard(id: string, updates: Partial<Omit<ILeaderboard, "id">>) {
		if (!settings) return;

		// If setting this leaderboard as default, clear isDefault from all others
		const updatedLeaderboards = settings.leaderboards.map((lb) =>
			lb.id === id ? { ...lb, ...updates } : updates.isDefault === true ? { ...lb, isDefault: false } : lb,
		);
		await updateSettings({ leaderboards: updatedLeaderboards });
	}

	async function deleteLeaderboard(id: string) {
		if (!settings) return;

		const updatedLeaderboards = settings.leaderboards.filter((lb) => lb.id !== id);
		await updateSettings({ leaderboards: updatedLeaderboards });
	}

	async function setDefaultLeaderboard(id: string) {
		if (!settings) return;

		const updatedLeaderboards = settings.leaderboards.map((lb) => ({
			...lb,
			isDefault: lb.id === id,
		}));
		await updateSettings({ leaderboards: updatedLeaderboards });
	}

	return (
		<SettingsContext.Provider
			value={{
				settings,
				loading,
				updateSettings,
				uploadLogo,
				addGameTag,
				deleteGameTag,
				addLeaderboard,
				editLeaderboard,
				deleteLeaderboard,
				setDefaultLeaderboard,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
