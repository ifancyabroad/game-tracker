import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChromePicker, type ColorResult } from "react-color";
import { Droplets } from "lucide-react";

type Hex = string;

export interface ColorPickerProps {
	/** Controlled value (hex like #RRGGBB or #RRGGBBAA) */
	value: Hex;
	onChange: (hex: Hex) => void;
	label?: string;
	/** Show the picker inline instead of a popover */
	inline?: boolean;
	/** Show a text input next to the swatch */
	showInput?: boolean;
	/** Disable interactions */
	disabled?: boolean;
	/** Custom preset swatches */
	presets?: Hex[];
	/** Optional className for the container */
	className?: string;
}

const DEFAULT_PRESETS: Hex[] = [
	"#6366f1",
	"#22c55e",
	"#ef4444",
	"#eab308",
	"#06b6d4",
	"#f97316",
	"#a855f7",
	"#94a3b8",
	"#111827",
	"#ffffff",
];

/** Basic hex sanitizer: returns a valid #rrggbb or falls back */
function normalizeHex(value: string, fallback: string): Hex {
	const v = value?.trim().toLowerCase();
	if (!v) return fallback;
	const hex = v.startsWith("#") ? v.slice(1) : v;
	if (hex.length === 3 || hex.length === 4) {
		const r = hex[0],
			g = hex[1],
			b = hex[2];
		const expanded = `#${r}${r}${g}${g}${b}${b}`;
		return /^#[0-9a-f]{6}$/.test(expanded) ? expanded : fallback;
	}
	if (hex.length === 6 || hex.length === 8) {
		const six = `#${hex.slice(0, 6)}`;
		return /^#[0-9a-f]{6}$/.test(six) ? six : fallback;
	}
	return fallback;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
	value,
	onChange,
	label,
	inline = false,
	showInput = true,
	disabled = false,
	presets,
	className,
}) => {
	const [open, setOpen] = useState(inline ? true : false);
	const [input, setInput] = useState<Hex>(value || "#6366f1");
	const containerRef = useRef<HTMLDivElement | null>(null);
	const pickerRef = useRef<HTMLDivElement | null>(null);

	const swatches = useMemo(() => (presets && presets.length ? presets : DEFAULT_PRESETS), [presets]);

	useEffect(() => {
		setInput(value);
	}, [value]);

	useEffect(() => {
		if (inline || !open) return;
		function onDocClick(e: MouseEvent) {
			const t = e.target as Node;
			if (containerRef.current?.contains(t)) return;
			if (pickerRef.current?.contains(t)) return;
			setOpen(false);
		}
		document.addEventListener("mousedown", onDocClick);
		return () => document.removeEventListener("mousedown", onDocClick);
	}, [open, inline]);

	const handleColor = (res: ColorResult) => {
		onChange(res.hex);
	};

	const applyInput = () => {
		const normalized = normalizeHex(input, value || "#6366f1");
		setInput(normalized);
		onChange(normalized);
	};

	const inputCls =
		"w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

	return (
		<div ref={containerRef} className={className}>
			{label && <label className="mb-1 block text-xs text-[var(--color-text-secondary)]">{label}</label>}

			<div
				className={`flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] p-2 ${disabled ? "opacity-60" : ""}`}
			>
				<button
					type="button"
					disabled={disabled || inline}
					onClick={() => setOpen((v) => !v)}
					className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-[var(--color-border-strong)]"
					title={value}
					aria-label="Open color picker"
					style={{ backgroundColor: value }}
				>
					<span className="absolute inset-0 rounded-md ring-1 ring-black/20" />
				</button>

				{showInput && (
					<div className="flex items-center gap-2">
						<Droplets className="h-4 w-4 text-[var(--color-primary)]" />
						<input
							disabled={disabled}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onBlur={applyInput}
							onKeyDown={(e) => {
								if (e.key === "Enter") applyInput();
								if (e.key === "Escape") setInput(value);
							}}
							className={`${inputCls} h-8 w-36`}
							placeholder="#6366f1"
						/>
					</div>
				)}

				<div className="ml-auto hidden gap-1 sm:flex">
					{swatches.slice(0, 8).map((c) => (
						<button
							key={c}
							type="button"
							disabled={disabled}
							onClick={() => onChange(c)}
							title={c}
							className="h-6 w-6 rounded-md border border-[var(--color-border-strong)] ring-1 ring-black/20"
							style={{ backgroundColor: c }}
						/>
					))}
				</div>
			</div>

			{open && !disabled && (
				<div
					ref={pickerRef}
					className={`${inline ? "mt-2" : "absolute z-50 mt-2"} rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-2 shadow-xl`}
					style={!inline ? { position: "absolute" as const } : undefined}
				>
					<ChromePicker
						color={value}
						onChange={handleColor}
						disableAlpha={true}
						styles={{
							default: {
								picker: { background: "transparent", boxShadow: "none" },
							},
						}}
					/>
					<div className="mt-2 grid grid-cols-10 gap-1 sm:hidden">
						{swatches.map((c) => (
							<button
								key={c}
								type="button"
								onClick={() => onChange(c)}
								title={c}
								className="h-6 w-full rounded-md border border-[var(--color-border-strong)] ring-1 ring-black/20"
								style={{ backgroundColor: c }}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
