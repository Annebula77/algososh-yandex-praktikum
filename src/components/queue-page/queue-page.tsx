import React from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from './queue.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates, StackArr } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

interface State {
  queueArray: StackArr[];
  symbol: string | null;
  isLoading: boolean;
}

class QueuePage extends React.Component<{}, State> {
  emptyElement: StackArr = { value: null, type: ElementStates.Default };

  state: State = {
    queueArray: new Array(7).fill(this.emptyElement),
    symbol: null,
    isLoading: false,
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ symbol: e.target.value });
  };

  handleAdd = () => {
    const lastFilledIndex = this.state.queueArray.reduce(
      (maxIndex, item, i) => (item.value !== null ? i : maxIndex),
      -1
    );
    if (
      this.state.symbol !== "" &&
      this.state.symbol !== null &&
      lastFilledIndex < this.state.queueArray.length - 1
    ) {
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.setState((prevState) => {
          let newState = [...prevState.queueArray];
          newState[lastFilledIndex + 1] = {
            value: this.state.symbol,
            type: ElementStates.Changing,
          };
          return { queueArray: newState, symbol: null, isLoading: false };
        });
        setTimeout(() => {
          this.setState((prevState) => {
            let newState = [...prevState.queueArray];
            newState[lastFilledIndex + 1].type = ElementStates.Default;
            return { queueArray: newState };
          });
        }, SHORT_DELAY_IN_MS);
      }, SHORT_DELAY_IN_MS);
    }
  };

  handleDelete = () => {
    const firstFilledIndex = this.state.queueArray.findIndex(
      (item) => item.value !== null
    );
    if (firstFilledIndex !== -1) {
      this.setState({ isLoading: true });
      this.setState((prevState) => {
        let newState = [...prevState.queueArray];
        newState[firstFilledIndex] = {
          ...newState[firstFilledIndex],
          type: ElementStates.Changing,
        };
        return { queueArray: newState };
      });
      setTimeout(() => {
        this.setState((prevState) => {
          let newState = [...prevState.queueArray];
          newState[firstFilledIndex] = this.emptyElement;
          return { queueArray: newState, isLoading: false };
        });
      }, SHORT_DELAY_IN_MS);
    }
  };

  handleClear = () => {
    this.setState({ isLoading: true });
    this.setState({
      queueArray: new Array(7).fill(this.emptyElement),
      isLoading: false,
    });
  };

  render() {
    return (
      <SolutionLayout title="Очередь">
        <div className={styles.content}>
          <div className={styles.input}>
            <Input
              extraClass={styles.input__extra}
              maxLength={4}
              onChange={this.handleInputChange}
              value={this.state.symbol || ''}
              disabled={this.state.isLoading}
            />
            <p className={styles.text}>Максимум — 4 символа</p>
          </div>
          <div className={styles.boxes}>
            <Button text="Добавить" onClick={this.handleAdd} disabled={this.state.isLoading} />
            <Button text="Удалить" onClick={this.handleDelete} disabled={this.state.isLoading} />
          </div>
          <Button text="Очистить" onClick={this.handleClear} disabled={this.state.isLoading} />
        </div>
        <div className={styles.circle__container}>
          {this.state.queueArray.map((item, index) =>
            <Circle
              key={index}
              letter={item.value?.toString() || ''}
              index={index}
              head={index === this.state.queueArray.findIndex(item => item.value !== null) ? 'head' : null}
              tail={index === this.state.queueArray.reduce((maxIndex, item, i) => item.value !== null ? i : maxIndex, -1) ? 'tail' : null}
              state={item.type}
            />
          )}
        </div>

      </SolutionLayout>
    );
  }
}

export { QueuePage };





