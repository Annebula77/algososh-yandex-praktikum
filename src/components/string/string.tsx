import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
import styles from './string.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { getReversingStringSteps, getLetterState } from "./utils";
import { DELAY_IN_MS, SHORT_DELAY_IN_MS } from "../../constants/delays";



export const StringComponent: React.FC = () => {

  const [word, setWord] = useState<string>("");
  const [letters, setLetters] = useState<string[]>([]);
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);
  const [changingIndexes, setChangingIndexes] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [isAnimationDone, setIsAnimationDone] = useState<boolean>(false);
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isAnimationDone) {
      setStartAnimation(false);
      setHighlightedIndexes([]);
      setChangingIndexes([]);
      setIsAnimationDone(false);
    }
    setWord(event.target.value);
  };

  const handleButtonClick = () => {
    setIsSorting(true);
    setStartAnimation(true);

    setTimeout(() => {
      const reversedSteps = getReversingStringSteps(word);
      reversedSteps.forEach((step, index) => {
        const timeoutChanging = setTimeout(() => {
          setChangingIndexes([index, word.length - 1 - index]);
          const timeoutModified = setTimeout(() => {
            setLetters(step);
            setChangingIndexes([]);
            setHighlightedIndexes(prevIndexes => [...prevIndexes, index, word.length - 1 - index]);
          }, SHORT_DELAY_IN_MS);
          setTimeouts(prevTimeouts => [...prevTimeouts, timeoutModified]);
        }, index * DELAY_IN_MS);
        setTimeouts(prevTimeouts => [...prevTimeouts, timeoutChanging]);
      });

      setTimeout(() => {
        setIsSorting(false);
        setIsAnimationDone(true);
        setHighlightedIndexes(Array.from({ length: word.length }, (_, i) => i));
      }, reversedSteps.length * DELAY_IN_MS);
    }, SHORT_DELAY_IN_MS);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleButtonClick();
  };


  useEffect(() => {
    if (startAnimation) {
      setLetters(word.split(""));
      setHighlightedIndexes([]);
      setChangingIndexes([]);
    }
  }, [startAnimation]);

  useEffect(() => {
    if (!startAnimation) {
      timeouts.forEach(timeout => clearTimeout(timeout));
      setTimeouts([]);
    }
  }, [startAnimation]);

  return (
    <SolutionLayout title="Строка">
      <form onSubmit={handleSubmit} className={styles.content}>
        <Input data-test-id="inputExtra" extraClass={styles.input__extra} maxLength={11} onChange={handleInputChange} value={word} />
        <Button data-test-id="buttonExtra" text="Развернуть" extraClass={styles.button__extra} type="submit" isLoader={isSorting} disabled={isSorting || !word} />
      </form>
      <p className={styles.text}>Максимум — 11 символов</p>
      <div className={styles.circle__container}>
        {startAnimation && letters.map((letter, index) => (
          <Circle
            key={index}
            letter={letter}
            state={getLetterState(index, highlightedIndexes, changingIndexes)}
          />
        ))}
      </div>
    </SolutionLayout>
  );
};


