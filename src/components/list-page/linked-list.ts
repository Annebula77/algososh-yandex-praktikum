import { ListNode } from "./list-node";


export class LinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;

  constructor(values?: T[]) {
    if (values) {
      for (let value of values) {
        this.addToTail(value);
      }
    }
  }

  addToHead(value: T) {
    const newNode = new ListNode(value);
    newNode.next = this.head
    this.head = newNode;
    if (!this.tail) this.tail = newNode;
  }

  addToTail(value: T) {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  removeHead() {
    if (!this.head) return null;
    const removedValue = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return removedValue;
  }

  removeTail() {
    if (!this.head) return null;
    if (this.head === this.tail) {
      const removedValue = this.head.value;
      this.head = this.tail = null;
      return removedValue;
    }
    let currentNode = this.head;
    while (currentNode.next && currentNode.next !== this.tail) {
      currentNode = currentNode.next;
    }
    const removedValue = currentNode.next!.value;
    currentNode.next = null;
    this.tail = currentNode;
    return removedValue;
  }

  toArray() {
    let arr: ListNode<T>[] = [];
    let currentNode = this.head;
    while (currentNode) {
      arr.push(currentNode);
      currentNode = currentNode.next;
    }
    return arr;
  }
  insertAtIndex(value: T, index: number) {
    // Специальные случаи: пустой список или вставка в начало
    if (index === 0 || !this.head) {
      this.addToHead(value);
      return;
    }

    // Инициализация счетчика и начального узла
    let i = 0;
    let node = this.head;

    // Перемещение к нужной позиции
    while (i < index - 1 && node.next) {
      i++;
      node = node.next;
    }

    // Вставка нового узла
    const newNode = new ListNode(value, node.next);
    node.next = newNode;

    // Обновление хвоста, если нужно
    if (newNode.next === null) {
      this.tail = newNode;
    }
  }

  removeAtIndex(index: number) {
    // Специальные случаи: пустой список или удаление из начала
    if (index === 0 || !this.head) {
      this.removeHead();
      return;
    }

    // Инициализация счетчика и начального узла
    let i = 0;
    let node = this.head;

    // Перемещение к нужной позиции
    while (i < index - 1 && node.next) {
      i++;
      node = node.next;
    }

    // Удаление узла
    if (node.next) {
      node.next = node.next.next;
    }

    // Обновление хвоста, если нужно
    if (node.next === null) {
      this.tail = node;
    }
  }

  getData() {
    const array = this.toArray();  // заменили this.array на вызов метода toArray()
    const tail = this.tail;
    const head = this.head;
    return { array, tail, head };
  }


}