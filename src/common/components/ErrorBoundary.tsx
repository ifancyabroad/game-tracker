import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
					<div className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-lg">
						<div className="mb-4 flex justify-center">
							<div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
								<AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
							</div>
						</div>

						<h1 className="mb-2 text-xl font-bold text-[var(--color-text)]">Something went wrong</h1>

						<p className="mb-4 text-sm text-[var(--color-text-secondary)]">
							An unexpected error occurred. Please try refreshing the page or returning to the home page.
						</p>

						{this.state.error && (
							<details className="mb-4 text-left">
								<summary className="cursor-pointer text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
									Error details
								</summary>
								<pre className="mt-2 overflow-auto rounded bg-[var(--color-accent)] p-2 text-xs text-[var(--color-text-secondary)]">
									{this.state.error.message}
								</pre>
							</details>
						)}

						<div className="flex gap-2">
							<Button
								onClick={() => window.location.reload()}
								variant="secondary"
								size="md"
								className="flex-1"
							>
								<RefreshCw className="h-4 w-4" /> Refresh Page
							</Button>
							<Button onClick={this.handleReset} variant="primary" size="md" className="flex-1">
								Go Home
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
