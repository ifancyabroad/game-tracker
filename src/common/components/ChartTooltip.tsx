import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
	payload?: {
		name: NameType;
		value: ValueType;
		color?: string;
	}[];
	label?: string;
}

export const ChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
	if (!active || !payload?.length) return null;

	return (
		<div className="rounded bg-gray-900 px-3 py-2 text-sm text-white shadow">
			<p className="font-semibold">{label}</p>
			{payload.map((entry, index) => (
				<p key={index} className="text-gray-300">
					{entry.name}: <span className="font-medium">{entry.value}</span>
				</p>
			))}
		</div>
	);
};
