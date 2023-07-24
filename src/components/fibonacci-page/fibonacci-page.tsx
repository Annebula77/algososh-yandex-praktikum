import React, { useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from './fibonacci.module.css';
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";


export const FibonacciPage: React.FC = () => {
  const [number, setNumber] = useState(0);
  const [fibonacciSequence, setFibonacciSequence] = useState<number[]>([]);
  const [displayedIndexes, setDisplayedIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateFibonacci = async (n: number) => {
    const sequence = [1, 1];
    while (sequence.length <= n) {
      const nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
      sequence.push(nextNumber);
    }
    return sequence;
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setNumber(value);
  };

  const handleClick = async () => {
    if (number < 0 || number > 19) {
      alert("Введенное число должно быть от 1 до 19");
      return;
    }
    setIsLoading(true);
    const sequence = await calculateFibonacci(number);
    setFibonacciSequence(sequence);
    displayNumbers(0, sequence.length);
  };

  const displayNumbers = (index: number, total: number) => {
    if (index < total) {
      setTimeout(() => {
        setDisplayedIndexes((prev) => [...prev, index]);
        displayNumbers(index + 1, total);
      }, SHORT_DELAY_IN_MS);
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (fibonacciSequence.length > 0) {
      displayNumbers(0, fibonacciSequence.length);
    }
  }, [fibonacciSequence]);

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={styles.content}>
        <Input
          extraClass={styles.input__extra}
          max={19}
          onChange={handleChange}
          type="number"
        />
        <Button
          text="Рассчитать"
          extraClass={styles.button__extra}
          onClick={handleClick}
          isLoader={isLoading}
          disabled={isLoading}
        />
      </div>
      <p className={styles.text}>Максимальное число — 19</p>
      <div className={styles.circle__container}>
        {fibonacciSequence.map((num, index) => (
          displayedIndexes.includes(index) && (
            <Circle
              key={index}
              letter={num.toString()}
              index={index}
            />
          )
        ))}
      </div>
    </SolutionLayout>
  );
};