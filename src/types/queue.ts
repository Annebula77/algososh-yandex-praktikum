import { StackArr } from "./stackArr";


export interface IQueue {
  queueArray: (string | null)[];
  add(symbol: string | null): number | null;
  delete(): number | null;
  clear(): void;
}
export type NullableStackArr = StackArr | null;