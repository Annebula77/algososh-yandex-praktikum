import React from "react";
import styles from './stack.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { StackArr } from "../../types/stackArr";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

interface State {
  isLoading: boolean;
  symbol: string;
  stackArray: StackArr[];
}

class StackPage extends React.Component<{}, State> {
  state: State = {
    isLoading: false,
    symbol: '',
    stackArray: []
  };
  handleAdd = () => {
    if (this.state.symbol !== '') {
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.setState(prevState => ({
          stackArray: [...prevState.stackArray, { value: prevState.symbol, type: ElementStates.Changing }],
          symbol: '',
          isLoading: false
        }));

        setTimeout(() => {
          this.setState(prevState => {
            let newState = [...prevState.stackArray];
            newState[newState.length - 1].type = ElementStates.Default;
            return { stackArray: newState };
          });
        }, SHORT_DELAY_IN_MS);
      }, SHORT_DELAY_IN_MS);
    }
  }

  handleDelete = () => {
    if (this.state.stackArray.length > 0) {
      this.setState(prevState => {
        let newState = [...prevState.stackArray];
        newState[newState.length - 1].type = ElementStates.Changing;
        return { stackArray: newState, isLoading: true };
      });

      setTimeout(() => {
        this.setState(prevState => {
          let newState = [...prevState.stackArray];
          newState.pop();
          return { stackArray: newState, isLoading: false };
        });
      }, SHORT_DELAY_IN_MS);
    }
  }

  handleClear = () => {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ stackArray: [], isLoading: false });
    }, SHORT_DELAY_IN_MS);
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ symbol: event.target.value });
  }

  render() {
    return (
      <SolutionLayout title="Стек">
        <div className={styles.content}>
          <div className={styles.input}>
            <Input
              extraClass={styles.input__extra}
              maxLength={4}
              onChange={this.handleInputChange}
              value={this.state.symbol}
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
          {this.state.stackArray.map((item, index) =>
            <Circle
              key={index}
              letter={item.value?.toString() || ''}
              index={index}
              head={index === this.state.stackArray.length - 1 ? 'top' : null}
              state={item.type}
            />
          )}
        </div>

      </SolutionLayout>
    );
  }
};

export { StackPage };
