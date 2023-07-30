import { IQueue } from "../../types/queue";

export class Queue implements IQueue {
  queueArray: (string | null)[] = new Array(7).fill(null);

  add(symbol: string | null): number | null {
    const lastFilledIndex = this.queueArray.reduce(
      (maxIndex, item, i) => (item !== null ? i : maxIndex),
      -1
    );

    if (symbol !== "" && symbol !== null && lastFilledIndex < this.queueArray.length - 1) {
      this.queueArray[lastFilledIndex + 1] = symbol;
      return lastFilledIndex + 1; // Return index where element was added
    }
    return null;
  }

  delete(): number | null {
    const firstFilledIndex = this.queueArray.findIndex((item) => item !== null);
    if (firstFilledIndex !== -1) {
      this.queueArray[firstFilledIndex] = null;
      return firstFilledIndex; // 
    }
    return null;
  }

  clear(): void {
    this.queueArray = new Array(7).fill(null);
  }
}