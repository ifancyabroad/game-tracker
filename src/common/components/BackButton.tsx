import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
	label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ label = "Back" }) => {
	const navigate = useNavigate();

	return (
		<button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
			<ArrowLeft className="h-4 w-4" />
			<span className="text-sm">{label}</span>
		</button>
	);
};
