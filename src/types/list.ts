import { ElementStates } from "./element-states";
import { ListNode } from "../components/list-page/list-node";

export type LinkedArrElement = { value: string; state: ElementStates };
export type RemovingNode = { id: string, value: string } | null;

export interface ILinkedList<T extends LinkedArrElement> {
  head: ListNode<T> | null;
  tail: ListNode<T> | null;

  addToHead(value: T): void;

  addToTail(value: T): void;

  removeHead(): T | null;

  removeTail(): T | null;

  toArray(): ListNode<T>[];

  insertAtIndex(value: T, index: number): void;

  removeAtIndex(index: number): LinkedArrElement | null;

  getLength(): number;

  clearNodeValue(index: number): void;

  getNodeAtIndex(index: number): ListNode<T> | null;

  changeState(index: number, state: ElementStates): void;

  getData(): { array: ListNode<T>[]; tail: ListNode<T> | null; head: ListNode<T> | null; };
}