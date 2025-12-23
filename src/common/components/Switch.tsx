import React from "react";

interface SwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	label?: string;
	description?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled = false, label, description }) => {
	const handleToggle = () => {
		if (!disabled) {
			onChange(!checked);
		}
	};

	return (
		<div className="flex items-center justify-between gap-3">
			{(label || description) && (
				<div className="flex-1">
					{label && <div className="text-sm font-medium text-[var(--color-text)]">{label}</div>}
					{description && <div className="text-xs text-[var(--color-text-secondary)]">{description}</div>}
				</div>
			)}
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={handleToggle}
				disabled={disabled}
				className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none ${
					checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
				} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
			>
				<span
					className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
						checked ? "translate-x-5" : "translate-x-0"
					}`}
				/>
			</button>
		</div>
	);
};
