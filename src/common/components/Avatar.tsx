interface AvatarProps {
	src?: string;
	alt?: string;
	name?: string;
	size?: number; // e.g., 32, 40, 48
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, name = "", size = 40 }) => {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div
			style={{ width: size, height: size }}
			className="relative flex items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent)] text-sm font-medium text-[var(--color-text)]"
		>
			{src ? <img src={src} alt={alt || name} className="h-full w-full object-cover" /> : <span>{initials}</span>}
		</div>
	);
};
