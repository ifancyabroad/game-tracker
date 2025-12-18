import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebase";
import { LogIn, Mail, Lock } from "lucide-react";
import { Input, Label, Button, FormHeader, ErrorMessage } from "common/components";

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
			<FormHeader icon={<LogIn />} title="Login" />

			<div>
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					icon={<Mail />}
					required
				/>
			</div>

			<div>
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					icon={<Lock />}
					required
				/>
			</div>

			<ErrorMessage className="-mt-2">{error}</ErrorMessage>

			<Button type="submit" disabled={loading}>
				{loading ? "Logging in..." : "Login"}
			</Button>
		</form>
	);
};
