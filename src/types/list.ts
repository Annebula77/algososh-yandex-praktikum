import { ElementStates } from "./element-states";

export type LinkedArrElement = { value: string; state: ElementStates };
export type RemovingNode = { id: string, value: string } | null;