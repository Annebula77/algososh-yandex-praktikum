import React, { useState, ChangeEvent, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from './string.module.css';
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";

const animateSortReverse = async (word: string, setLetters: (letters: string[]) => void, setHighlightedIndexes: (indexes: number[]) => void, setChangingIndexes: (indexes: number[]) => void) => {
  let lettersArray = word.split("");
  let highlightedIndexes = [];

  for (let i = 0; i < Math.floor(lettersArray.length / 2); i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setChangingIndexes([i, lettersArray.length - 1 - i]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setChangingIndexes([]);
    const temp = lettersArray[i];
    lettersArray[i] = lettersArray[lettersArray.length - 1 - i];
    lettersArray[lettersArray.length - 1 - i] = temp;
    setLetters([...lettersArray]);
    highlightedIndexes.push(i, lettersArray.length - 1 - i);
    setHighlightedIndexes([...highlightedIndexes]);
  }

  setHighlightedIndexes(Array.from({ length: lettersArray.length }, (_, i) => i));
};

export const StringComponent: React.FC = () => {

  const [word, setWord] = useState<string>("");
  const [letters, setLetters] = useState<string[]>([]);
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);
  const [changingIndexes, setChangingIndexes] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [isAnimationDone, setIsAnimationDone] = useState<boolean>(false);


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
    animateSortReverse(word, setLetters, setHighlightedIndexes, setChangingIndexes).then(() => {
      setIsSorting(false);
      setIsAnimationDone(true);
    });
  };
  useEffect(() => {
    if (startAnimation) {
      setLetters(word.split(""));
      setHighlightedIndexes([]);
      setChangingIndexes([]);
    }
  }, [startAnimation]);

  return (
    <SolutionLayout title="Строка">
      <div className={styles.content}>
        <Input extraClass={styles.input__extra} maxLength={11} onChange={handleInputChange} value={word} />
        <Button text="Развернуть" extraClass={styles.button__extra} onClick={handleButtonClick} isLoader={isSorting} disabled={isSorting} />
      </div>
      <p className={styles.text}>Максимум — 11 символов</p>
      <div className={styles.circle__container}>
        {startAnimation && letters.map((letter, index) => (
          <Circle
            key={index}
            letter={letter}
            state={
              highlightedIndexes.includes(index)
                ? ElementStates.Modified
                : changingIndexes.includes(index)
                  ? ElementStates.Changing
                  : ElementStates.Default
            }
          />
        ))}
      </div>
    </SolutionLayout>
  );
};
