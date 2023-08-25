import { sortBubble, sortSelection, randomArr } from './utils';
import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";


describe('sortBubble', () => {
  it('корректно сортирует пустой массив', () => {
    const results = Array.from(sortBubble([], Direction.Ascending));
    expect(results).toEqual([]);
  });

  it('корректно сортирует массив из одного элемента', () => {
    const singleElement = { value: 5, state: ElementStates.Default };
    const results = Array.from(sortBubble([singleElement], Direction.Ascending));
    expect(results).toHaveLength(1);
    expect(results[0][0].state).toEqual(ElementStates.Modified);
    expect(results[0][0].value).toEqual(5);
  });

  it('корректно сортирует массив из нескольких элементов', () => {
    const array = randomArr(5, 5); // генерируем массив из 5 элементов
    const result = Array.from(sortBubble(array, Direction.Ascending));
    const lastSortedArray = result[result.length - 1];
    // Проверяем, что каждый элемент меньше или равен следующему
    for (let i = 0; i < lastSortedArray.length - 1; i++) {
      expect(lastSortedArray[i].value).toBeLessThanOrEqual(lastSortedArray[i + 1].value);
    }
  });
});

describe('sortSelection', () => {
  it('корректно сортирует пустой массив', () => {
    const results = Array.from(sortSelection([], Direction.Ascending));
    expect(results).toEqual([]);
  });

  it('корректно сортирует массив из одного элемента', () => {
    const singleElement = { value: 5, state: ElementStates.Default };
    const results = Array.from(sortSelection([singleElement], Direction.Ascending));
    expect(results).toHaveLength(1);
    expect(results[0][0].state).toEqual(ElementStates.Modified);
    expect(results[0][0].value).toEqual(5);
  });

  it('корректно сортирует массив из нескольких элементов', () => {
    const array = randomArr(5, 5);
    const result = Array.from(sortSelection(array, Direction.Ascending));
    const lastSortedArray = result[result.length - 1];
    for (let i = 0; i < lastSortedArray.length - 1; i++) {
      expect(lastSortedArray[i].value).toBeLessThanOrEqual(lastSortedArray[i + 1].value);
    }
  });
});