interface ChartData {
	name: string;
	value?: number;
	count?: number;
	winRate?: number;
}

interface IChartTooltipProps<T = ChartData> {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number;
		payload: T;
	}>;
	label?: string;
	formatter?: (value: number) => string;
	suffix?: string;
}

export const ChartTooltip: React.FC<IChartTooltipProps> = ({ active, payload, label, formatter, suffix }) => {
	if (!active || !payload || !payload.length) return null;

	const data = payload[0];
	const rawValue = data?.payload?.value ?? data?.payload?.count ?? data?.payload?.winRate ?? data?.value;

	return (
		<div className="rounded bg-gray-800 px-3 py-2 text-sm text-white shadow">
			<strong>{label ?? data.name}</strong>
			<div>
				{formatter ? formatter(rawValue) : rawValue}
				{suffix ? ` ${suffix}` : ""}
			</div>
		</div>
	);
};
