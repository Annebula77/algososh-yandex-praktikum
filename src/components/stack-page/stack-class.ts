import { StackArr } from "../../types/stackArr";

interface IStack {
  stackArray: StackArr[];
  add(symbol: string | null): number | null;
  delete(): number | null;
  clear(): void;
}

export class Stack implements IStack {
  stackArray: StackArr[] = [];

  add(symbol: string | null): number | null {
    if (symbol !== "") {
      this.stackArray.push({ value: symbol }); // type не нужен здесь
      return this.stackArray.length - 1; // Return index where element was added
    }
    return null;
  }

  delete(): number | null {
    if (this.stackArray.length > 0) {
      this.stackArray.pop();
      return this.stackArray.length;
    }
    return null;
  }

  clear(): void {
    this.stackArray = [];
  }
}