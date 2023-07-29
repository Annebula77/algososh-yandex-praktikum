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
    state: ElementStates.Default,
  });
  const [deleteCircle, setDeleteCircle] = useState({
    index: -1,
    value: "",
    state: ElementStates.Default,
  });

  const [, reset] = useState({});


  const [inputValue, setInputValue] = useState("");
  const [indexValue, setIndexValue] = useState(""); // новое состояние для индекса
  const [isAddingToTail, setIsAddingToTail] = useState(false);
  const [isAddingToHead, setIsAddingToHead] = useState(false);
  const [removingHead, setRemovingHead] = useState<RemovingNode>(null);
  const [removingTail, setRemovingTail] = useState<RemovingNode>(null);
  const [removingByIndex, setRemovingByIndex] = useState<RemovingNode>(null);
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

  const pause = (duration: number) => new Promise(resolve => setTimeout(resolve, duration));

  const handleAddToHead = async () => {
    setOnAddLoading({ ...onAddLoading, head: true });
    setIsAddingToHead(true);

    setAddCircle({
      index: 0,
      value: inputValue,
      state: ElementStates.Changing,
    });

    await pause(SHORT_DELAY_IN_MS);
    setIsAddingToHead(false);
    const newItem = new ListNode(inputValue);
    const newItemForList = { value: newItem.value, state: ElementStates.Modified };
    listArray.current.addToHead(newItemForList);
    setAddCircle({ ...addCircle, index: -1 });

    await pause(SHORT_DELAY_IN_MS);
    listArray.current.changeState(0, ElementStates.Default);
    setInputValue("");
    setOnAddLoading({ ...onAddLoading, head: false });

  };


  const handleAddToTail = async () => {
    setOnAddLoading({ ...onAddLoading, tail: true });
    setIsAddingToTail(true);

    const lastIndex = listArray.current.getLength();

    setAddCircle({
      index: lastIndex, // Предполагая, что индекс последнего элемента равен длине списка
      value: inputValue,
      state: ElementStates.Changing,
    });

    await pause(SHORT_DELAY_IN_MS);
    setIsAddingToTail(false);
    const newItem = new ListNode(inputValue);
    const newItemForList = { value: newItem.value, state: ElementStates.Modified }; // Замените ElementStates.Changing на соответствующий статус
    listArray.current.addToTail(newItemForList);
    setAddCircle({ ...addCircle, index: -1 });

    await pause(SHORT_DELAY_IN_MS);
    listArray.current.changeState(lastIndex, ElementStates.Default);
    setInputValue("");
    setOnAddLoading({ ...onAddLoading, tail: false });

  };


  const handleRemoveFromHead = async () => {
    setOnDeleteLoading({ ...onDeleteLoading, head: true });
    const headNod = data.head;

    if (headNod !== null) {
      setRemovingHead({
        id: nanoid(),
        value: headNod.value.value,
      });
      listArray.current.changeState(0, ElementStates.Default);
      listArray.current.clearNodeValue(Number(indexValue));

      setDeleteCircle({
        index: 0,
        value: headNod.value.value,
        state: ElementStates.Default,
      });

      await pause(SHORT_DELAY_IN_MS);

      listArray.current.removeHead();

      await pause(SHORT_DELAY_IN_MS);

      setRemovingHead(null);
      setOnDeleteLoading({ ...onDeleteLoading, head: false });
      setDeleteCircle({ ...deleteCircle, index: -1 });
    }
  };

  const handleRemoveFromTail = async () => {
    setOnDeleteLoading({ ...onDeleteLoading, tail: true });
    const tailNod = data.tail;
    const lastIndex = listArray.current.getLength() - 1;

    if (tailNod !== null) {
      setRemovingTail({
        id: nanoid(),
        value: tailNod.value.value,
      });
      listArray.current.changeState(lastIndex, ElementStates.Default);
      listArray.current.clearNodeValue(lastIndex);

      setDeleteCircle({
        index: lastIndex,
        value: tailNod.value.value, // Извлекаем значение из объекта
        state: ElementStates.Default,
      });

      await pause(SHORT_DELAY_IN_MS);

      listArray.current.removeTail(); // Теперь это объект типа LinkedArrItem

      await pause(SHORT_DELAY_IN_MS);
      setOnDeleteLoading({ ...onDeleteLoading, tail: false });

      setDeleteCircle({ ...deleteCircle, index: -1 });
      setRemovingTail(null);
    }
  };

  const handleInsertAtIndex = async () => {
    setOnAddLoading({ ...onAddLoading, index: true });

    for (let i = 0; i <= Number(indexValue) + 1; i++) {
      setInsertionIndex(i);

      setAddCircle({
        index: i,
        value: inputValue,
        state: ElementStates.Changing,
      });

      if (i < Number(indexValue)) {
        // Устанавливаем состояние текущего элемента в ElementStates.Changing
        listArray.current.changeState(i, ElementStates.Changing);
      } else if (i === Number(indexValue)) {
        // Меняем состояние всех предыдущих элементов на ElementStates.Default
        for (let j = 0; j < i; j++) {
          listArray.current.changeState(j, ElementStates.Default);
        }

        await pause(SHORT_DELAY_IN_MS);
        const newItem = new ListNode(inputValue);
        const newItemForList = { value: newItem.value, state: ElementStates.Modified };
        listArray.current.insertAtIndex(newItemForList, i);
        setAddCircle({ ...addCircle, index: -1 });

        setInsertionIndex(null);
      } else {
        for (let i = 0; i <= Number(indexValue); i++) {
          listArray.current.changeState(i, ElementStates.Default);
        };
        setInputValue("");
        setIndexValue("");
        setOnAddLoading({ ...onAddLoading, index: false });
        setInsertionIndex(null);
      }

      await pause(SHORT_DELAY_IN_MS);
    }
  };


  const handleRemoveAtIndex = async () => {
    setOnDeleteLoading({ ...onDeleteLoading, index: true });
    const node = listArray.current.getNodeAtIndex(Number(indexValue))

    for (let i = 0; i <= Number(indexValue); i++) {

      listArray.current.changeState(i, ElementStates.Changing);
      reset({});

      await pause(SHORT_DELAY_IN_MS);


      if (i === Number(indexValue) && node !== null) {
        setDeleteCircle({
          index: i,
          value: '',
          state: ElementStates.Changing,
        });

      }
    }

    await pause(SHORT_DELAY_IN_MS);

    if (node !== null) {
      setRemovingByIndex({
        id: nanoid(),
        value: node.value.value,
      });
      listArray.current.changeState(Number(indexValue), ElementStates.Default);
      listArray.current.clearNodeValue(Number(indexValue));
    }
    reset({});

    await pause(SHORT_DELAY_IN_MS);
    setDelitionIndex(Number(indexValue));

    await pause(SHORT_DELAY_IN_MS);

    listArray.current.removeAtIndex(Number(indexValue));
    setDeleteCircle({ ...deleteCircle, index: -1 });


    for (let i = 0; i <= Number(indexValue); i++) {

      listArray.current.changeState(i, ElementStates.Default);

    }

    setIndexValue("");
    setOnDeleteLoading({ ...onDeleteLoading, index: false });
    setDelitionIndex(null);
  }

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
            <Button text="Добавить в head" extraClass={styles.button__extra_top} onClick={handleAddToHead} isLoader={onAddLoading.head} disabled={inputValue.trim() === '' || indexValue.trim() !== ''} />
            <Button text="Добавить в tail" extraClass={styles.button__extra_top} onClick={handleAddToTail} isLoader={onAddLoading.tail} disabled={inputValue.trim() === '' || indexValue.trim() !== ''} />
            <Button text="Удалить из head" extraClass={styles.button__extra_top} onClick={handleRemoveFromHead} isLoader={onDeleteLoading.head} disabled={inputValue.trim() !== '' || indexValue.trim() !== ''} />
            <Button text="Удалить из tail" extraClass={styles.button__extra_top} onClick={handleRemoveFromTail} isLoader={onDeleteLoading.tail} disabled={inputValue.trim() !== '' || indexValue.trim() !== ''} />
          </div>
        </div>
        <div className={styles.wrap}>
          <div className={styles.input}>
            <Input
              extraClass={styles.input__extra}
              maxLength={4}
              placeholder="Введите индекс"
              min={0}
              max={listArray.current.getLength() - 1}
              value={indexValue} // связываем input с состоянием indexValue
              onChange={handleIndexChange} // связываем input с обработчиком handleIndexChange
            />
          </div>
          <div className={styles.boxes}>
            <Button text="Добавить по индексу" extraClass={styles.button__extra_bottom} onClick={handleInsertAtIndex} isLoader={onAddLoading.index} disabled={!inputValue.trim() || !indexValue.trim()} />
            <Button text="Удалить по индексу" extraClass={styles.button__extra_bottom} onClick={handleRemoveAtIndex} isLoader={onDeleteLoading.index} disabled={inputValue.trim() !== '' || indexValue.trim() === ''} />
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
                    key={nanoid()}
                    letter={inputValue}
                    state={ElementStates.Changing}
                    isSmall={true}
                  />
                )
                : index === 0 && !(isAddingToHead) // For showing "head" on the first element during the first render
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
                        key={removingByIndex?.id || nanoid()}
                        letter={removingByIndex?.value || String(data.array[index].value)}
                        state={ElementStates.Changing}
                        isSmall={true}
                      />
                    )
                    // Если ничего не добавляем или не удаляем, и текущий элемент является последним
                    : (index === listArray.current.getLength() - 1)
                      ? "tail"
                      : undefined
            }
          />
        ))}

      </div>
    </SolutionLayout >
  );
};
