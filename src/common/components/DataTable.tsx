import React from "react";
import { Card } from "./Card";

export interface DataTableColumn<T> {
	key: string;
	label: string;
	align?: "left" | "center" | "right";
	width?: string;
	headerClassName?: string;
	cellClassName?: string;
	hideOnMobile?: boolean;
	render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
	data: T[];
	columns: DataTableColumn<T>[];
	title?: string;
	subtitle?: string;
	onRowClick?: (row: T) => void;
	getRowKey: (row: T) => string;
	limit?: number;
	emptyMessage?: string;
	className?: string;
}

export const DataTable = <T,>({
	data,
	columns,
	title,
	subtitle,
	onRowClick,
	getRowKey,
	limit,
	emptyMessage = "No data yet.",
	className,
}: DataTableProps<T>) => {
	const displayData = limit ? data.slice(0, limit) : data;
	const totalColumns = columns.length;

	const getAlignClass = (align?: "left" | "center" | "right") => {
		if (align === "center") return "text-center";
		if (align === "right") return "text-right";
		return "text-left";
	};

	const getCellValue = (row: T, column: DataTableColumn<T>): React.ReactNode => {
		if (column.render) {
			return column.render(row);
		}
		const value = (row as Record<string, unknown>)[column.key];
		return value as React.ReactNode;
	};

	return (
		<Card className={`p-0 ${className || ""}`}>
			{(title || subtitle) && (
				<div className="border-b border-[var(--color-border)] px-3 py-2.5 sm:px-4 sm:py-3">
					{title && <h3 className="text-sm font-bold text-[var(--color-text)] md:text-base">{title}</h3>}
					{subtitle && <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
				</div>
			)}
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-[var(--color-accent)] text-left text-[var(--color-text-secondary)]">
						<tr>
							{columns.map((column) => (
								<th
									key={column.key}
									className={`${column.hideOnMobile ? "hidden sm:table-cell" : ""} ${
										column.width || ""
									} px-3 py-2 sm:px-4 ${
										column.width ? "px-2 sm:px-4" : ""
									} ${getAlignClass(column.align)} ${column.headerClassName || ""}`}
								>
									{column.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{displayData.length > 0 ? (
							displayData.map((row) => (
								<tr
									key={getRowKey(row)}
									className={`border-b border-[var(--color-border)] last:border-b-0 hover:hover:bg-[var(--color-hover)] ${
										onRowClick ? "cursor-pointer" : ""
									}`}
									onClick={() => onRowClick?.(row)}
								>
									{columns.map((column) => (
										<td
											key={column.key}
											className={`${column.hideOnMobile ? "hidden sm:table-cell" : ""} ${
												column.width ? "px-2 py-2 tabular-nums sm:px-4" : "px-3 py-2 sm:px-4"
											} text-[var(--color-text)] ${getAlignClass(column.align)} ${
												column.cellClassName || ""
											}`}
										>
											{getCellValue(row, column)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={totalColumns}
									className="px-4 py-6 text-center text-[var(--color-text-secondary)]"
								>
									{emptyMessage}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</Card>
	);
};
