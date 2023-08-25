import React, { useState, useRef } from "react";
import styles from './queue.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { Queue } from "./queue-class";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { StackArr } from "../../types/stackArr";


export const QueuePage: React.FC = () => {
  const queue = useRef(new Queue());
  const [queueArray, setQueueArray] = useState<StackArr[]>(new Array(7).fill({ value: null, type: ElementStates.Default }));
  const [symbol, setSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  const handleAdd = () => {
    setIsLoading(true);
    const index = queue.current.add(symbol);
    if (index !== null) {
      setTimeout(() => {
        setQueueArray((prevState) => {
          let newState = [...prevState];
          newState[index] = { value: symbol, type: ElementStates.Changing };
          return newState;
        });
        setTimeout(() => {
          setQueueArray((prevState) => {
            let newState = [...prevState];
            newState[index].type = ElementStates.Default;
            return newState;
          });
          setSymbol('');
          setIsLoading(false);
        }, SHORT_DELAY_IN_MS);
      }, SHORT_DELAY_IN_MS);
    }
  };

  const handleDelete = () => {
    setIsLoading(true);
    const index = queue.current.delete();
    if (index !== null) {
      setTimeout(() => {
        setQueueArray((prevState) => {
          let newState = [...prevState];
          newState[index] = { value: null, type: ElementStates.Default };
          return newState;
        });
        setIsLoading(false);
      }, SHORT_DELAY_IN_MS);
    }
  };

  const handleClear = () => {
    setIsLoading(true);
    queue.current.clear();
    setTimeout(() => {
      setQueueArray(new Array(7).fill({ value: null, type: ElementStates.Default }));
      setIsLoading(false);
    }, SHORT_DELAY_IN_MS);
  };

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
          <Button data-test-id="addToQueue" text="Добавить" onClick={handleAdd} disabled={isLoading || !symbol} />
          <Button data-test-id="removeFromQueue" text="Удалить" onClick={handleDelete} disabled={symbol?.trim() !== ''} />
        </div>
        <Button data-test-id="clearQueue" text="Очистить" onClick={handleClear} disabled={isLoading} />
      </div>
      <div data-test-id="queueCircleContainer" className={styles.circle__container}>
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