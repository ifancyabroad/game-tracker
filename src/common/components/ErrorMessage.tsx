interface IErrorMessageProps {
	children: React.ReactNode;
	className?: string;
}

export const ErrorMessage: React.FC<IErrorMessageProps> = ({ children, className = "" }) => {
	if (!children) return null;

	return <p className={`mt-1 text-xs text-red-400 ${className}`}>{children}</p>;
};
