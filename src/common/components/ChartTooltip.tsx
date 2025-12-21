interface IChartTooltipProps {
	active?: boolean;
	payload?: Array<{
		name?: string;
		value: number;
		dataKey?: string;
		payload?: Record<string, unknown>;
	}>;
	label?: string;
	formatter?: (value: number, name?: string) => string;
	labelFormatter?: (label: string) => string;
}

export const ChartTooltip: React.FC<IChartTooltipProps> = ({ active, payload, label, formatter, labelFormatter }) => {
	if (!active || !payload || !payload.length) return null;

	const data = payload[0];
	const displayValue = formatter ? formatter(data.value, data.name) : data.value;
	const rawLabel = label ?? data.name ?? "";
	const displayLabel = labelFormatter ? labelFormatter(String(rawLabel)) : rawLabel;

	return (
		<div className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] shadow">
			{displayLabel && <strong>{displayLabel}</strong>}
			<div>{displayValue}</div>
		</div>
	);
};
