import React, { useState, useEffect, useCallback } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import styles from "./sorting.module.css";
import { Direction } from "../../types/direction";
import { DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { Column } from "../ui/column/column";
import { ArrayElementType } from "../../types/sortingArr";

export const SortingPage: React.FC = () => {

  const [array, setArray] = useState<{ value: number; state: ElementStates; }[]>([]);
  const [sortType, setSortType] = useState('Выбор');
  const [sortDirection, setSortDirection] = useState(Direction.Ascending);
  const [isAscendingLoading, setIsAscendingLoading] = useState(false);
  const [isDescendingLoading, setIsDescendingLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  const randomArr = () => {
    const minLen = 3;
    const maxLen = 17;
    const len = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 101));
    setArray(arr.map((item) => ({ value: item, state: ElementStates.Default })));
  };

  useEffect(() => {
    randomArr();
  }, []);


  const handleNewArrayClick = () => {
    randomArr();
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const sort = useCallback(async (direction: Direction) => {
    console.log('sort function started');

    if (direction === Direction.Ascending) {
      setIsAscendingLoading(true);
      setIsProcessing(true);
    } else {
      setIsDescendingLoading(true);
      setIsProcessing(true);
    }
    let sortedArray = [...array];
    const updateArray = async (arr: ArrayElementType[]) => {
      await delay(DELAY_IN_MS);
      setArray([...arr]);
    };

    if (sortType === 'Выбор') {
      let sortedArray = [];
      let workingArray = [...array];

      while (workingArray.length > 0) {
        let minIndex = 0;
        workingArray[0].state = ElementStates.Changing;
        await updateArray([...sortedArray, ...workingArray]);

        for (let j = 1; j < workingArray.length; j++) {
          workingArray[j].state = ElementStates.Changing;
          await updateArray([...sortedArray, ...workingArray]);

          if ((direction === Direction.Ascending && workingArray[j].value < workingArray[minIndex].value) ||
            (direction === Direction.Descending && workingArray[j].value > workingArray[minIndex].value)) {
            workingArray[minIndex].state = ElementStates.Default;
            minIndex = j;
          } else {
            workingArray[j].state = ElementStates.Default;
          }

          await updateArray([...sortedArray, ...workingArray]);
        }

        workingArray[minIndex].state = ElementStates.Modified;
        const [selectedElement] = workingArray.splice(minIndex, 1);
        sortedArray.push(selectedElement);

        await updateArray([...sortedArray, ...workingArray]);
      }

    } else {

      for (let i = 0; i < sortedArray.length; i++) {
        for (let j = 0; j < sortedArray.length - 1 - i; j++) {
          sortedArray[j].state = sortedArray[j + 1].state = ElementStates.Changing;
          await updateArray(sortedArray);
          if ((direction === Direction.Ascending && sortedArray[j].value > sortedArray[j + 1].value) ||
            (direction === Direction.Descending && sortedArray[j].value < sortedArray[j + 1].value)) {
            [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
          }
          sortedArray[j].state = ElementStates.Default;
          await updateArray(sortedArray);
        }
        sortedArray[sortedArray.length - 1 - i].state = ElementStates.Modified;
        await updateArray(sortedArray);

      }

    }

    if (direction === Direction.Ascending) {
      setIsAscendingLoading(false);
      setIsProcessing(false);

    } else {
      setIsDescendingLoading(false);
      setIsProcessing(false);

    }

  }, [sortType, array]);

  const handleSortDirectionClick = (direction: Direction) => {
    setSortDirection(direction);
    sort(direction);
  };


  return (
    <SolutionLayout title="Сортировка массива" extraClass="pb-2">
      <div className={styles.content}>
        <div className={styles.radio}>
          <RadioInput label="Выбор" name="sortType" onChange={() => setSortType('Выбор')} checked={sortType === 'Выбор'} disabled={isProcessing} />
          <RadioInput label="Пузырёк" name="sortType" onChange={() => setSortType('Пузырёк')} checked={sortType === 'Пузырёк'} disabled={isProcessing} />
        </div>
        <div className={styles.boxes}>
          <Button text="По возрастанию" onClick={() => handleSortDirectionClick(Direction.Ascending)} isLoader={isAscendingLoading} sorting={Direction.Ascending} disabled={isProcessing} />
          <Button text="По убыванию" onClick={() => handleSortDirectionClick(Direction.Descending)} isLoader={isDescendingLoading} sorting={Direction.Descending} disabled={isProcessing} />
        </div>
        <Button text="Новый массив" onClick={handleNewArrayClick} disabled={isProcessing} />
      </div>
      <div className={styles.array__container}>
        {array.map((item, index) => (
          <Column key={index} index={item.value} state={item.state} />
        ))}
      </div>

    </SolutionLayout>
  );
};
