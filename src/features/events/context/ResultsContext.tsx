import { createContext, useContext } from "react";
import type { IResult } from "features/events/types";

interface IResultsContext {
	results: IResult[];
	addResult: (result: Omit<IResult, "id">) => Promise<void>;
	editResult: (id: string, result: Omit<IResult, "id">) => Promise<void>;
	deleteResult: (id: string) => Promise<void>;
}

export const ResultsContext = createContext<IResultsContext | null>(null);

export const useResults = (): IResultsContext => {
	const context = useContext(ResultsContext);
	if (!context) {
		throw new Error("useResults must be used within a ResultsProvider");
	}
	return context;
};
