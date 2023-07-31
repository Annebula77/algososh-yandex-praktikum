import { ArrayElement } from "../../types/sortingArr";
import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";



export const randomArr = (minLen: number = 3, maxLen: number = 17): ArrayElement[] => {
  const len = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
  const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 101));
  return arr.map((item) => ({ value: item, state: ElementStates.Default }));
};

export const updateElementState = (arr: ArrayElement[], index: number, state: ElementStates): ArrayElement[] => {
  const updatedArray = [...arr];
  updatedArray[index] = { ...updatedArray[index], state };
  return updatedArray;
};

export function* sortBubble(arr: ArrayElement[], direction: Direction): Generator<ArrayElement[]> {
  let sortedArray = [...arr];

  for (let i = 0; i < sortedArray.length; i++) {
    for (let j = 0; j < sortedArray.length - 1 - i; j++) {
      sortedArray = updateElementState(sortedArray, j, ElementStates.Changing);
      sortedArray = updateElementState(sortedArray, j + 1, ElementStates.Changing);

      yield sortedArray;

      if ((direction === Direction.Ascending && sortedArray[j].value > sortedArray[j + 1].value) ||
        (direction === Direction.Descending && sortedArray[j].value < sortedArray[j + 1].value)) {
        [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
      }

      sortedArray = updateElementState(sortedArray, j, ElementStates.Default);
      yield sortedArray;
    }

    sortedArray = updateElementState(sortedArray, sortedArray.length - 1 - i, ElementStates.Modified);
    yield sortedArray;
  }

  return sortedArray;
};

export function* sortSelection(arr: ArrayElement[], direction: Direction): Generator<ArrayElement[]> {
  let workingArray = [...arr];

  for (let i = 0; i < workingArray.length - 1; i++) {
    let minIndex = i;
    workingArray = updateElementState(workingArray, i, ElementStates.Changing);
    yield workingArray;

    for (let j = i + 1; j < workingArray.length; j++) {
      workingArray = updateElementState(workingArray, j, ElementStates.Changing);
      yield workingArray;

      if ((direction === Direction.Ascending && workingArray[j].value < workingArray[minIndex].value) ||
        (direction === Direction.Descending && workingArray[j].value > workingArray[minIndex].value)) {
        workingArray = updateElementState(workingArray, minIndex, ElementStates.Default);
        minIndex = j;
      } else {
        workingArray = updateElementState(workingArray, j, ElementStates.Default);
      }
      yield workingArray;
    }

    // Если минимальный элемент не на своем месте, перемещаем его туда
    if (minIndex !== i) {
      [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];
    }
    // Обновляем состояние элемента после окончания итерации
    workingArray = updateElementState(workingArray, i, ElementStates.Modified);
    yield workingArray;
  }

  // Обновляем состояние последнего элемента
  workingArray = updateElementState(workingArray, workingArray.length - 1, ElementStates.Modified);
  yield workingArray;
};