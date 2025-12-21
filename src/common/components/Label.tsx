import type { LabelHTMLAttributes } from "react";

interface ILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean;
}

export const Label: React.FC<ILabelProps> = ({ children, className = "", required = false, ...props }) => {
	return (
		<label className={`mb-1 block text-xs text-[var(--color-text-secondary)] ${className}`} {...props}>
			{children}
			{required && <span className="ml-0.5 text-red-400">*</span>}
		</label>
	);
};
