import { useAppReady } from "common/utils/hooks";
import { PageLoader } from "./PageLoader";

export const ReadyGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { loading } = useAppReady();
	if (loading) return <PageLoader />;
	return <>{children}</>;
};
