import React, { useState, useCallback } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './queue.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates, StackArr } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const QueuePage: React.FC = () => {
  const emptyElement: StackArr = { value: null, type: ElementStates.Default };
  const [queueArray, setQueueArray] = useState<StackArr[]>(new Array(7).fill(emptyElement));
  const [symbol, setSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  }, []);

  const handleAdd = useCallback(() => {
    const lastFilledIndex = queueArray.reduce((maxIndex, item, i) => item.value !== null ? i : maxIndex, -1);
    if (symbol !== '' && symbol !== null && lastFilledIndex < queueArray.length - 1) {
      setIsLoading(true);
      setTimeout(() => {
        setQueueArray(prevState => {
          let newState = [...prevState];
          newState[lastFilledIndex + 1] = { value: symbol, type: ElementStates.Changing };
          return newState;
        });
        setSymbol(null);
        setIsLoading(false);
        setTimeout(() => {
          setQueueArray(prevState => {
            let newState = [...prevState];
            newState[lastFilledIndex + 1].type = ElementStates.Default;
            return newState;
          });
        }, SHORT_DELAY_IN_MS);
      }, SHORT_DELAY_IN_MS);
    }
  }, [symbol, queueArray]);

  const handleDelete = useCallback(() => {
    const firstFilledIndex = queueArray.findIndex(item => item.value !== null);
    if (firstFilledIndex !== -1) {
      setIsLoading(true);
      setQueueArray(prevState => {
        let newState = [...prevState];
        newState[firstFilledIndex] = { ...newState[firstFilledIndex], type: ElementStates.Changing };
        return newState;
      });
      setTimeout(() => {
        setQueueArray(prevState => {
          let newState = [...prevState];
          newState[firstFilledIndex] = emptyElement;
          return newState;
        });
        setIsLoading(false);
      }, SHORT_DELAY_IN_MS);
    }
  }, [queueArray]);


  const handleClear = useCallback(() => {
    setIsLoading(true);
    setQueueArray(new Array(7).fill(emptyElement));
    setIsLoading(false);
  }, []);
  return (
    <SolutionLayout title="Очередь">
      <div className={styles.content}>
        <div className={styles.input}>
          <Input
            extraClass={styles.input__extra}
            maxLength={4}
            onChange={handleInputChange}
            value={symbol || ''}
            disabled={isLoading}
          />
          <p className={styles.text}>Максимум — 4 символа</p>
        </div>
        <div className={styles.boxes}>
          <Button text="Добавить" onClick={handleAdd} disabled={isLoading} />
          <Button text="Удалить" onClick={handleDelete} disabled={isLoading} />
        </div>
        <Button text="Очистить" onClick={handleClear} disabled={isLoading} />
      </div>
      <div className={styles.circle__container}>
        {queueArray.map((item, index) =>
          <Circle
            key={index}
            letter={item.value?.toString() || ''}
            index={index}
            head={index === queueArray.findIndex(item => item.value !== null) ? 'head' : null}
            tail={index === queueArray.reduce((maxIndex, item, i) => item.value !== null ? i : maxIndex, -1) ? 'tail' : null}
            state={item.type}
          />
        )}
      </div>

    </SolutionLayout>
  );
};
