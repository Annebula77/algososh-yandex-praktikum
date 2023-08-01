import React, { useState, useEffect, useCallback } from "react";
import styles from "./sorting.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { ArrayElement } from "../../types/sortingArr";
import { pause } from "../../constants/delays";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { sortBubble, sortSelection, randomArr } from "./utils";

export const SortingPage: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>(randomArr());
  const [sortType, setSortType] = useState<'Выбор' | 'Пузырёк'>('Выбор');
  const [sortDirection, setSortDirection] = useState<Direction>(Direction.Ascending);
  const [isAscendingLoading, setIsAscendingLoading] = useState(false);
  const [isDescendingLoading, setIsDescendingLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setArray(randomArr());
  }, []);

  const handleNewArrayClick = () => {
    setArray(randomArr());
  };

  const handleSortDirectionClick = (direction: Direction) => {
    setSortDirection(direction);
    sort(direction);
  };

  const sort = useCallback(async (direction: Direction) => {
    setIsProcessing(true);
    direction === Direction.Ascending ? setIsAscendingLoading(true) : setIsDescendingLoading(true);

    let generator: Generator<ArrayElement[]>;

    if (sortType === 'Выбор') {
      generator = sortSelection(array, direction);
    } else {
      generator = sortBubble(array, direction);
    }

    for (let result = generator.next(); !result.done; result = generator.next()) {
      setArray(result.value);
      await pause(SHORT_DELAY_IN_MS);
    }
    setIsProcessing(false);
    direction === Direction.Ascending ? setIsAscendingLoading(false) : setIsDescendingLoading(false);
  }, [sortType, array]);

  return (
    <SolutionLayout title="Сортировка массива" extraClass="pb-2">
      <div className={styles.content}>
        <div className={styles.radio}>
          <RadioInput label="Выбор" name="sortType" onChange={() => setSortType('Выбор')} checked={sortType === 'Выбор'} disabled={isProcessing} />
          <RadioInput label="Пузырёк" name="sortType" onChange={() => setSortType('Пузырёк')} checked={sortType === 'Пузырёк'} disabled={isProcessing} />
        </div>
        <div className={styles.boxes}>
          <Button text="По возрастанию" onClick={() => handleSortDirectionClick(Direction.Ascending)} isLoader={isAscendingLoading} disabled={isProcessing} />
          <Button text="По убыванию" onClick={() => handleSortDirectionClick(Direction.Descending)} isLoader={isDescendingLoading} disabled={isProcessing} />
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