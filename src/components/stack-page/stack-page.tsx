import React, { useState } from "react";
import styles from './stack.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { StackArr } from "../../types/stackArr";
import { SHORT_DELAY_IN_MS, pause } from "../../constants/delays";
import { Stack } from "./stack-class";



export const StackPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<string>("");
  const [stackArray, setStackArray] = useState<StackArr[]>([]);
  const stack = new Stack();


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value);
  };

  const handleAdd = async () => {
    if (symbol !== "" && !isLoading) {
      setIsLoading(true);

      // Сначала создаем элемент со статусом Changing и добавляем его в локальный стейт
      const elementToAdd = { value: symbol, type: ElementStates.Changing };
      setStackArray(prevState => [...prevState, elementToAdd]);

      // Добавляем значение в класс Stack
      stack.add(symbol);

      // Пауза перед сменой статуса
      await pause(SHORT_DELAY_IN_MS);

      // Затем обновляем элемент в локальном стейте, меняя его статус на Default
      setStackArray(prevState => prevState.map((item, i) =>
        i === prevState.length - 1 ? { ...item, type: ElementStates.Default } : item
      ));

      setSymbol("");
      setIsLoading(false);
    }
  };


  const handleDelete = async () => {
    if (stackArray.length > 0) {
      setIsLoading(true);
      const index = stackArray.length - 1;
      let newArr = [...stackArray];
      newArr[index].type = ElementStates.Changing;
      setStackArray(newArr);
      await pause(SHORT_DELAY_IN_MS);
      stack.delete();
      newArr.pop();
      setStackArray(newArr);
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    await stack.clear();
    setStackArray([]);
    setIsLoading(false);
  };
  return (
    <SolutionLayout title="Стек">
      <div className={styles.content}>
        <div className={styles.input}>
          <Input
            extraClass={styles.input__extra}
            maxLength={4}
            onChange={handleInputChange}
            value={symbol}
            disabled={isLoading}
          />
          <p className={styles.text}>Максимум — 4 символа</p>
        </div>
        <div className={styles.boxes}>
          <Button data-test-id="addToStack" text="Добавить" onClick={handleAdd} disabled={isLoading || !symbol} />
          <Button data-test-id="removeFromStack" text="Удалить" onClick={handleDelete} disabled={symbol.trim() !== ''} />
        </div>
        <Button data-test-id="clearStack" text="Очистить" onClick={handleClear} disabled={isLoading} />
      </div>
      <div data-test-id="stackCircleContainer" className={styles.circle__container}>
        {stackArray.map((item, index) =>
          <Circle
            key={index}
            letter={item.value?.toString() || ''}
            index={index}
            head={index === stackArray.length - 1 ? 'top' : null}
            state={item.type}
          />
        )}
      </div>

    </SolutionLayout>
  );
};


