import { Dices } from "lucide-react";
import { motion } from "framer-motion";

export const PageLoader: React.FC = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: "linear",
				}}
				className="rounded-full bg-[var(--color-primary)] p-4"
			>
				<Dices className="h-8 w-8 text-white" />
			</motion.div>
		</div>
	);
};
