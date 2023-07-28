import React, { useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './list.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { CircleWithArrow } from "../ui/circle-with-arrow/circle-with-arrow";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { LinkedList } from "./linked-list";
import { ListNode } from "./list-node";
import { nanoid } from 'nanoid';


export const ListPage: React.FC = () => {

  const initialList = new LinkedList<string>();
  initialList.addToTail("0");
  initialList.addToTail("34");
  initialList.addToTail("8");
  initialList.addToTail("1");

  const [isLoadingAddToHead, setIsLoadingAddToHead] = useState(false);
  const [isLoadingAddToTail, setIsLoadingAddToTail] = useState(false);
  const [isLoadingDeleteHead, setIsLoadingDeleteHead] = useState(false);
  const [isLoadingDeleteTail, setIsLoadingDeleteTail] = useState(false);
  const [isLoadingByIndex, setIsLoadingByIndex] = useState(false);
  const [isLoadingDeleteByIndex, setIsLoadingDeleteByIndex] = useState(false);

  const [list, setList] = useState(initialList);
  const [inputValue, setInputValue] = useState("");
  const [indexValue, setIndexValue] = useState(""); // новое состояние для индекса
  const [newHead, setNewHead] = useState<ListNode<string> | null>(null);
  const [animationIndex, setAnimationIndex] = useState<number | null>(null);
  const [tempElement, setTempElement] = useState<string | null>(null);
  const [deleteAnimationIndex, setDeleteAnimationIndex] = useState<number | null>(null);
  const [isAddingToTail, setIsAddingToTail] = useState(false);
  const [isAddingToHead, setIsAddingToHead] = useState(false);
  type RemovingNode = { id: string, value: string } | null;
  const [removingHead, setRemovingHead] = useState<RemovingNode>(null);
  const [removingTail, setRemovingTail] = useState<RemovingNode>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [delitionIndex, setDelitionIndex] = useState<number | null>(null);

  const [modifiedElementId, setModifiedElementId] = useState<string | null>(null); // Добавляем новое состояние





  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndexValue(event.target.value);
  };

  const handleAddToHead = async () => {
    const newItem = new ListNode(inputValue);
    setIsAddingToHead(true);
    setIsLoadingAddToHead(true);

    await setTimeout(() => {
      list.addToHead(newItem.value);
      setList(list);
      setInputValue("");
      setIsLoadingAddToHead(false);
      setIsAddingToHead(false);
      setModifiedElementId(newItem.id); // Обновляем modifiedElementId
    }, SHORT_DELAY_IN_MS);

    // // Добавляем другую функцию setTimeout
    // setTimeout(() => {
    //   setModifiedElementId(null); // Возвращаем modifiedElementId к состоянию по умолчанию
    // }, SHORT_DELAY_IN_MS + 2000);
  };

  const handleAddToTail = () => {
    const newItem = new ListNode(inputValue);
    setIsAddingToTail(true);
    setIsLoadingAddToTail(true);


    setTimeout(() => {
      list.addToTail(newItem.value);
      setList(list);
      setInputValue("");
      setIsLoadingAddToTail(false);
    }, SHORT_DELAY_IN_MS);

    setTimeout(() => {

      setIsAddingToTail(false);
    }, SHORT_DELAY_IN_MS * 2);
  };

  const handleRemoveFromHead = () => {
    setIsLoadingDeleteHead(true);
    const removedValue = list.removeHead();
    if (removedValue !== null) {
      setRemovingHead({
        id: nanoid(),
        value: removedValue
      });
      setTimeout(() => {
        setList(list);
        setIsLoadingDeleteHead(false);
        setRemovingHead(null);
      }, SHORT_DELAY_IN_MS);
    }
  };

  const handleRemoveFromTail = () => {
    setIsLoadingDeleteTail(true);
    const removedValue = list.removeTail();
    if (removedValue !== null) {
      setRemovingTail({
        id: nanoid(),
        value: removedValue
      });
      setTimeout(() => {
        setList(list);
        setIsLoadingDeleteTail(false);
        setRemovingTail(null);
      }, SHORT_DELAY_IN_MS);
    }
  };
  const handleInsertAtIndex = () => {
    setIsLoadingByIndex(true);
    setTempElement(inputValue); // устанавливаем временный элемент
    setInsertionIndex(Number(indexValue));
    let i = 0;
    const animation = setInterval(() => {
      setAnimationIndex(i);
      i++;
      if (i > Number(indexValue)) {
        clearInterval(animation);
        list.insertAtIndex(inputValue, Number(indexValue));
        setList(list);
        setInputValue("");
        setIndexValue("");
        setIsLoadingByIndex(false);
        setAnimationIndex(null);
        setTempElement(null);
        setInsertionIndex(null);
      }
    }, SHORT_DELAY_IN_MS);
  };

  const handleRemoveAtIndex = () => {
    setIsLoadingDeleteByIndex(true);
    setDelitionIndex(Number(indexValue));
    let i = 0;
    const animation = setInterval(() => {
      setDeleteAnimationIndex(i);
      if (i === Number(indexValue)) {
        list.removeAtIndex(Number(indexValue));
        setList(list);
        setIndexValue("");
        setIsLoadingDeleteByIndex(false);
        setDeleteAnimationIndex(null);
        clearInterval(animation);
        setDelitionIndex(null);
      }
      i++;
    }, SHORT_DELAY_IN_MS);
  };


  const listArray = list.toArray();





  return (
    <SolutionLayout title="Связный список">
      <div className={styles.content}>
        <div className={styles.wrap}>
          <div className={styles.input}>
            <Input
              placeholder="Введите значение"
              value={inputValue}
              extraClass={styles.input__extra}
              maxLength={4}
              onChange={handleInputChange}
            />
            <p className={styles.text}>Максимум — 4 символа</p>
          </div>
          <div className={styles.boxes}>
            <Button text="Добавить в head" extraClass={styles.button__extra_top} onClick={handleAddToHead} isLoader={isLoadingAddToHead} disabled={!inputValue.trim()} />
            <Button text="Добавить в tail" extraClass={styles.button__extra_top} onClick={handleAddToTail} isLoader={isLoadingAddToTail} disabled={!inputValue.trim()} />
            <Button text="Удалить из head" extraClass={styles.button__extra_top} onClick={handleRemoveFromHead} isLoader={isLoadingDeleteHead} disabled={isLoadingDeleteHead} />
            <Button text="Удалить из tail" extraClass={styles.button__extra_top} onClick={handleRemoveFromTail} isLoader={isLoadingDeleteTail} disabled={isLoadingDeleteTail} />
          </div>
        </div>
        <div className={styles.wrap}>
          <div className={styles.input}>
            <Input
              extraClass={styles.input__extra}
              maxLength={4}
              placeholder="Введите индекс"
              value={indexValue} // связываем input с состоянием indexValue
              onChange={handleIndexChange} // связываем input с обработчиком handleIndexChange
            />
          </div>
          <div className={styles.boxes}>
            <Button text="Добавить по индексу" extraClass={styles.button__extra_bottom} onClick={handleInsertAtIndex} isLoader={isLoadingByIndex} disabled={isLoadingByIndex} />
            <Button text="Удалить по индексу" extraClass={styles.button__extra_bottom} onClick={handleRemoveAtIndex} isLoader={isLoadingDeleteByIndex} disabled={isLoadingDeleteByIndex} />
          </div>
        </div>
      </div>
      <div className={styles.circle__container}>
        {listArray.map((node, index) => (
          <CircleWithArrow
            key={node.id}
            letter={node.value}
            index={index}
            showArrow={index !== listArray.length - 1}
            state={node.id === modifiedElementId ? ElementStates.Modified : ElementStates.Default} // Изменяем состояние в зависимости от modifiedElementId
            head={
              (index === 0 && isAddingToHead && !isAddingToTail) || // For adding to the head
                (index === listArray.length - 1 && isAddingToTail && !isAddingToHead) || // For adding to the tail
                (index === insertionIndex && !isAddingToHead && !isAddingToTail)
                ? (
                  <Circle
                    key={newHead?.id || nanoid()}
                    letter={newHead?.value || inputValue}
                    state={ElementStates.Changing}
                    isSmall={true}
                  />
                )
                : index === 0 && !(isAddingToHead || isAddingToTail || isLoadingByIndex) // For showing "head" on the first element during the first render
                  ? "head"
                  : undefined
            }

            tail={
              // Если удаляем голову и текущий элемент станет новой головой
              (index === 0 && isLoadingDeleteHead)
                ? (
                  <Circle
                    key={removingHead?.id || nanoid()}
                    letter={removingHead?.value || listArray[index].value}
                    state={ElementStates.Changing}
                    isSmall={true}
                  />
                )
                // Если удаляем хвост и текущий элемент станет новым хвостом
                : (index === listArray.length - 1 && isLoadingDeleteTail)
                  ? (
                    <Circle
                      key={removingTail?.id || nanoid()}
                      letter={removingTail?.value || listArray[index].value}
                      state={ElementStates.Changing}
                      isSmall={true}
                    />
                  )
                  : (index === delitionIndex)
                    ? (
                      <Circle
                        key={removingTail?.id || nanoid()}
                        letter={removingTail?.value || listArray[index].value}
                        state={ElementStates.Changing}
                        isSmall={true}
                      />
                    )
                    // Если ничего не добавляем или не удаляем, и текущий элемент является последним
                    : (index === listArray.length - 1 && !(isAddingToHead || isAddingToTail || isLoadingDeleteHead || isLoadingDeleteTail))
                      ? "tail"
                      : undefined
            }
          />
        ))}

      </div>
    </SolutionLayout >
  );
};
