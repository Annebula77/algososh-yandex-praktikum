import React, { useState, useCallback } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './stack.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates, StackArr } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";


export const StackPage: React.FC = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [symbol, setSymbol] = useState<number | string | null>('');
  const [stackArray, setStackArray] = useState<StackArr[]>([]);

  const handleAdd = useCallback(() => {
    if (symbol !== '' && symbol !== null) {
      setIsLoading(true);
      setTimeout(() => {
        setStackArray(prevState => [...prevState, { value: symbol, type: ElementStates.Changing }]);
        setSymbol(null);
        setIsLoading(false);

        setTimeout(() => {
          setStackArray(prevState => {
            let newState = [...prevState];
            newState[newState.length - 1].type = ElementStates.Default;
            return newState;
          });
        }, SHORT_DELAY_IN_MS);
      }, SHORT_DELAY_IN_MS);
    }
  }, [symbol]);

  const handleDelete = useCallback(() => {
    if (stackArray.length > 0) {
      setIsLoading(true);
      setStackArray(prevState => {
        let newState = [...prevState];
        newState[newState.length - 1].type = ElementStates.Changing;
        return newState;
      });
      setTimeout(() => {
        setStackArray(prevState => {
          let newState = [...prevState];
          newState.pop();
          return newState;
        });
        setIsLoading(false);
      }, SHORT_DELAY_IN_MS);
    }
  }, [stackArray.length]);

  const handleClear = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setStackArray([]);
      setIsLoading(false);
    }, SHORT_DELAY_IN_MS);
  }, []);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value);
  }


  return (
    <SolutionLayout title="Стек">
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
