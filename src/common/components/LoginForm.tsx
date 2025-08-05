import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebase";

interface ILoginFormProps {
	onSuccess?: () => void;
}

export const LoginForm: React.FC<ILoginFormProps> = ({ onSuccess }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			if (onSuccess) onSuccess();
		} catch (err) {
			setError("Login failed. Please check your credentials.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleLogin} className="flex flex-col gap-4">
			<h3 className="text-lg font-bold text-[var(--color-primary)]">Login</h3>

			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
			/>

			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
			/>

			{error && <p className="text-sm text-red-400">{error}</p>}

			<button
				type="submit"
				disabled={loading}
				className="w-full rounded bg-[var(--color-primary)] py-2 font-semibold text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				{loading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
};
