import { nanoid } from 'nanoid';
export class ListNode<T> {
  id: string;
  value: T;
  next: ListNode<T> | null;

  constructor(value: T, next: ListNode<T> | null = null) {
    this.value = value;
    this.id = nanoid();
    this.next = next;
  }

}