import React from "react";
import type { IPlayer } from "types/models";

export const DataContext = React.createContext<IPlayer[]>([]);
