import React, { useState } from "react";
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

export type LinkedArrItem = { value: string; state: ElementStates }; //change name

export const defaultArray: LinkedArrItem[] = [
  { value: '0', state: ElementStates.Default },
  { value: '34', state: ElementStates.Default },
  { value: '8', state: ElementStates.Default },
  { value: '1', state: ElementStates.Default }
] //change name

type RemovingNode = { id: string, value: string } | null;


export const ListPage: React.FC = () => {
  const [linkedArray, setLinkedArray] = useState<LinkedList<LinkedArrItem>>(new LinkedList(defaultArray));

  const [onAddLoading, setOnAddLoading] = useState({
    index: false,
    tail: false,
    head: false,
  });

  const [onDeleteLoading, setOnDeleteLoading] = useState({
    index: false,
    tail: false,
    head: false,
  });



  const [addCircle, setAddCircle] = useState({
    index: -1,
    value: "",
    state: ElementStates.Changing,
  });
  const [deleteCircle, setDeleteCircle] = useState({
    index: -1,
    value: "",
    state: ElementStates.Changing,
  });
  const [inputValue, setInputValue] = useState("");
  const [indexValue, setIndexValue] = useState(""); // новое состояние для индекса
  const [newHead, setNewHead] = useState<ListNode<string> | null>(null);
  const [animationIndex, setAnimationIndex] = useState<number | null>(null);
  const [tempElement, setTempElement] = useState<string | null>(null);
  const [deleteAnimationIndex, setDeleteAnimationIndex] = useState<number | null>(null);
  const [isAddingToTail, setIsAddingToTail] = useState(false);
  const [isAddingToHead, setIsAddingToHead] = useState(false);
  const [removingHead, setRemovingHead] = useState<RemovingNode>(null);
  const [removingTail, setRemovingTail] = useState<RemovingNode>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [delitionIndex, setDelitionIndex] = useState<number | null>(null);






  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndexValue(event.target.value);
  };

  const listArray = React.useRef(new LinkedList(defaultArray));
  const data = listArray.current.getData(); //change name

  const handleAddToHead = () => {
    setOnAddLoading({ ...onAddLoading, head: true });
    setIsAddingToHead(true);

    setAddCircle({
      index: 0,
      value: inputValue,
      state: ElementStates.Changing,
    });

    setTimeout(() => {
      const newItem = new ListNode(inputValue);
      const newItemForList = { value: newItem.value, state: ElementStates.Modified };

      listArray.current.addToHead(newItemForList);

      setAddCircle({
        index: -1,
        value: "",
        state: ElementStates.Modified,
      });

      setTimeout(() => {
        setAddCircle({
          index: -1,
          value: "",
          state: ElementStates.Default,
        });
      }, SHORT_DELAY_IN_MS);
    }, SHORT_DELAY_IN_MS);

    setTimeout(() => {
      setInputValue("");
      setOnAddLoading({ ...onAddLoading, head: false });
      setIsAddingToHead(false);
    }, SHORT_DELAY_IN_MS);
  };


  const handleAddToTail = () => {
    setOnAddLoading({ ...onAddLoading, tail: true });
    setIsAddingToTail(true);

    const newItem = new ListNode(inputValue);
    const newItemForList = { value: newItem.value, state: ElementStates.Changing }; // Замените ElementStates.Changing на соответствующий статус

    listArray.current.addToTail(newItemForList);

    const lastIndex = listArray.current.getLength() - 1;

    setAddCircle({
      index: lastIndex, // Предполагая, что индекс последнего элемента равен длине списка
      value: inputValue,
      state: ElementStates.Changing,
    });

    setTimeout(() => {
      setInputValue("");
      setOnAddLoading({ ...onAddLoading, tail: false });
      setIsAddingToTail(false);
      setAddCircle({
        index: -1,
        value: "",
        state: ElementStates.Default,
      });
    }, SHORT_DELAY_IN_MS);
  };


  const handleRemoveFromHead = () => {
    setOnDeleteLoading({ ...onDeleteLoading, head: true });

    setTimeout(() => {
      setRemovingHead({
        id: nanoid(),
        value: newHead ? newHead.value : "",
      });
      setDeleteCircle({
        index: 0,
        value: newHead ? newHead.value : "",
        state: ElementStates.Changing,
      });
      setNewHead(null);
      setOnDeleteLoading({ ...onDeleteLoading, head: false });
      setDeleteCircle({
        index: -1,
        value: "",
        state: ElementStates.Default,
      });
    }, SHORT_DELAY_IN_MS);
  };

  const handleRemoveFromTail = () => {
    setOnDeleteLoading({ ...onDeleteLoading, tail: true });

    const removedItem = listArray.current.removeTail(); // Теперь это объект типа LinkedArrItem
    if (removedItem !== null) {
      setRemovingTail({
        id: nanoid(),
        value: removedItem.value // Извлекаем значение из объекта
      });

      const lastIndex = listArray.current.getLength() - 1;

      setDeleteCircle({
        index: lastIndex,
        value: removedItem.value, // Извлекаем значение из объекта
        state: ElementStates.Changing,
      });

      setTimeout(() => {
        setOnDeleteLoading({ ...onDeleteLoading, tail: false });
        setDeleteCircle({
          index: -1,
          value: "",
          state: ElementStates.Default,
        });
        setRemovingTail(null);
      }, SHORT_DELAY_IN_MS);
    }
  };

  const handleInsertAtIndex = () => {
    setOnAddLoading({ ...onAddLoading, index: true });
    setInsertionIndex(Number(indexValue));

    const newItem = new ListNode(inputValue);
    const newItemForList = { value: newItem.value, state: ElementStates.Changing };

    listArray.current.insertAtIndex(newItemForList, Number(indexValue));


    setAddCircle({
      index: Number(indexValue),
      value: inputValue,
      state: ElementStates.Changing,
    });

    let i = 0;
    const animation = setInterval(() => {
      setAnimationIndex(i);
      i++;
      if (i > Number(indexValue)) {
        clearInterval(animation);
        setInputValue("");
        setIndexValue("");
        setOnAddLoading({ ...onAddLoading, index: false });
        setAnimationIndex(null);
        setAddCircle({
          index: -1,
          value: "",
          state: ElementStates.Default,
        });
        setInsertionIndex(null);
      }
    }, SHORT_DELAY_IN_MS);
  };

  const handleRemoveAtIndex = () => {
    setOnDeleteLoading({ ...onDeleteLoading, index: true });
    setDelitionIndex(Number(indexValue));

    const removedItem = listArray.current.removeAtIndex(Number(indexValue));
    if (removedItem !== null) {
      setDeleteCircle({
        index: Number(indexValue),
        value: removedItem.value, // изменил на removedItem.value
        state: ElementStates.Changing,
      });
    }

    let i = 0;
    const animation = setInterval(() => {
      setDeleteAnimationIndex(i);
      if (i === Number(indexValue)) {
        clearInterval(animation);
        setIndexValue("");
        setOnDeleteLoading({ ...onDeleteLoading, index: false });
        setDeleteAnimationIndex(null);
        setDeleteCircle({
          index: -1,
          value: "",
          state: ElementStates.Default,
        });
        setDelitionIndex(null);
      }
      i++;
    }, SHORT_DELAY_IN_MS);
  };




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
            <Button text="Добавить в head" extraClass={styles.button__extra_top} onClick={handleAddToHead} isLoader={onAddLoading.head} disabled={!inputValue.trim()} />
            <Button text="Добавить в tail" extraClass={styles.button__extra_top} onClick={handleAddToTail} isLoader={onAddLoading.tail} disabled={!inputValue.trim()} />
            <Button text="Удалить из head" extraClass={styles.button__extra_top} onClick={handleRemoveFromHead} isLoader={onDeleteLoading.head} disabled={onDeleteLoading.head} />
            <Button text="Удалить из tail" extraClass={styles.button__extra_top} onClick={handleRemoveFromTail} isLoader={onDeleteLoading.tail} disabled={onDeleteLoading.tail} />
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
            <Button text="Добавить по индексу" extraClass={styles.button__extra_bottom} onClick={handleInsertAtIndex} isLoader={onAddLoading.index} disabled={onAddLoading.index} />
            <Button text="Удалить по индексу" extraClass={styles.button__extra_bottom} onClick={handleRemoveAtIndex} isLoader={onDeleteLoading.index} disabled={onDeleteLoading.index} />
          </div>
        </div>
      </div>
      <div className={styles.circle__container}>
        {data.array.map((node, index) => (
          <CircleWithArrow
            key={node.id}
            letter={node.value.value}
            index={index}
            showArrow={index !== listArray.current.getLength() - 1}
            state={node.value.state}
            head={
              (index === 0 && isAddingToHead && !isAddingToTail) || // For adding to the head
                (index === listArray.current.getLength() - 1 && isAddingToTail && !isAddingToHead) || // For adding to the tail
                (index === insertionIndex && !isAddingToHead && !isAddingToTail)
                ? (
                  <Circle
                    key={newHead?.id || nanoid()}
                    letter={newHead?.value || inputValue}
                    state={ElementStates.Changing}
                    isSmall={true}
                  />
                )
                : index === 0 && !(isAddingToHead || isAddingToTail || onAddLoading.index) // For showing "head" on the first element during the first render
                  ? "head"
                  : undefined
            }

            tail={
              // Если удаляем голову и текущий элемент станет новой головой
              (index === 0 && onDeleteLoading.head)
                ? (
                  <Circle
                    key={removingHead?.id || nanoid()}
                    letter={removingHead?.value || String(data.array[index].value)}
                    state={ElementStates.Changing}
                    isSmall={true}
                  />
                )
                // Если удаляем хвост и текущий элемент станет новым хвостом
                : (index === listArray.current.getLength() - 1 && onDeleteLoading.tail)
                  ? (
                    <Circle
                      key={removingTail?.id || nanoid()}
                      letter={removingTail?.value || String(data.array[index].value)}
                      state={ElementStates.Changing}
                      isSmall={true}
                    />
                  )
                  : (index === delitionIndex)
                    ? (
                      <Circle
                        key={removingTail?.id || nanoid()}
                        letter={removingTail?.value || String(data.array[index].value)}
                        state={ElementStates.Changing}
                        isSmall={true}
                      />
                    )
                    // Если ничего не добавляем или не удаляем, и текущий элемент является последним
                    : (index === listArray.current.getLength() - 1 && !(isAddingToHead || isAddingToTail || onDeleteLoading.head || onDeleteLoading.tail))
                      ? "tail"
                      : undefined
            }
          />
        ))}

      </div>
    </SolutionLayout >
  );
};
