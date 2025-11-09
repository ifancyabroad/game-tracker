import { createContext, useContext } from "react";
import type { IEvent } from "features/events/types";

interface IEventsContext {
	events: IEvent[];
	eventById: Map<string, IEvent>;
	addEvent: (event: Omit<IEvent, "id">) => Promise<void>;
	editEvent: (id: string, event: Omit<IEvent, "id">) => Promise<void>;
	deleteEvent: (id: string) => Promise<void>;
}

export const EventsContext = createContext<IEventsContext | null>(null);

export const useEvents = (): IEventsContext => {
	const context = useContext(EventsContext);
	if (!context) {
		throw new Error("useEvents must be used within an EventsProvider");
	}
	return context;
};
