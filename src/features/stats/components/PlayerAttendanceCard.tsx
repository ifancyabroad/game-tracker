import { Card, Avatar, EmptyState } from "common/components";
import { Users } from "lucide-react";
import { Link } from "react-router";

export interface PlayerAttendance {
	playerId: string;
	playerName: string;
	pictureUrl?: string;
	color: string;
	eventsAttended: number;
	totalEvents: number;
	attendanceRate: number; // 0-100
}

interface PlayerAttendanceCardProps {
	attendances: PlayerAttendance[];
}

export const PlayerAttendanceCard: React.FC<PlayerAttendanceCardProps> = ({ attendances }) => {
	if (attendances.length === 0) {
		return (
			<Card className="p-4">
				<div className="mb-3 flex items-center gap-2">
					<Users size={20} className="text-[var(--color-primary)]" />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">Player Attendance</h3>
				</div>
				<EmptyState>
					<Users size={32} className="mx-auto mb-2 text-[var(--color-text-secondary)]" />
					<p>No attendance data available</p>
				</EmptyState>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden">
			<div className="border-b border-[var(--color-border)] p-3 sm:p-4">
				<div className="flex items-center gap-2">
					<Users size={20} className="text-[var(--color-primary)]" />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">Player Attendance</h3>
				</div>
				<p className="mt-1 text-xs text-[var(--color-text-secondary)]">
					Most active players by event participation
				</p>
			</div>

			<div className="divide-y divide-[var(--color-border)]">
				{attendances.map((attendance) => (
					<Link
						key={attendance.playerId}
						to={`/players/${attendance.playerId}`}
						className="block p-3 transition-colors hover:bg-[var(--color-hover)] sm:p-4"
					>
						{/* Player Info */}
						<div className="mb-3 flex items-center justify-between gap-3">
							<div className="flex items-center gap-2">
								<Avatar src={attendance.pictureUrl} name={attendance.playerName} size={40} />
								<div>
									<div className="text-sm font-semibold text-[var(--color-text)]">
										{attendance.playerName}
									</div>
									<div className="text-xs text-[var(--color-text-secondary)]">
										{attendance.totalEvents} games · {attendance.eventsAttended} events
									</div>
								</div>
							</div>
							<div className="text-right">
								<div className="text-lg font-bold tabular-nums" style={{ color: attendance.color }}>
									{Math.round(attendance.attendanceRate)}%
								</div>
							</div>
						</div>

						{/* Attendance Bar */}
						<div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-accent)]">
							<div
								className="h-full transition-all"
								style={{
									width: `${attendance.attendanceRate}%`,
									backgroundColor: attendance.color,
								}}
							/>
						</div>
					</Link>
				))}
			</div>
		</Card>
	);
};
