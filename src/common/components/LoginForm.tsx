import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebase";
import { LogIn, Mail, Lock } from "lucide-react";

interface ILoginFormProps {
	onSuccess?: () => void;
}

export const LoginForm: React.FC<ILoginFormProps> = ({ onSuccess }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const inputCls =
		"w-full rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, email.trim(), password);
			onSuccess?.();
		} catch (err: unknown) {
			let msg = "Login failed. Please try again.";
			if (err instanceof Error) msg = err.message;
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleLogin} className="m-0 flex w-full flex-col gap-4 p-0">
			<div className="flex items-center gap-2 text-gray-300">
				<LogIn className="h-4 w-4 text-[var(--color-primary)]" />
				<h3 className="text-sm font-semibold text-white">Login</h3>
			</div>

			<div>
				<label htmlFor="email" className="mb-1 block text-xs text-gray-400">
					Email
				</label>
				<div className="relative">
					<input
						id="email"
						type="email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={`${inputCls} pr-9`}
						placeholder="you@example.com"
						required
					/>
					<Mail className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--color-primary)]" />
				</div>
			</div>

			<div>
				<label htmlFor="password" className="mb-1 block text-xs text-gray-400">
					Password
				</label>
				<div className="relative">
					<input
						id="password"
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={`${inputCls} pr-9`}
						placeholder="••••••••"
						required
					/>
					<Lock className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--color-primary)]" />
				</div>
			</div>

			{error && <p className="-mt-2 text-xs text-red-400">{error}</p>}

			<button
				type="submit"
				disabled={loading}
				className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				{loading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
};
