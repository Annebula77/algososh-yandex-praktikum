import React from "react";
import { Circle } from "../circle/circle";
import { ElementStates } from "../../../types/element-states";
import styles from "./circle-with-arrow.module.css"

interface CircleWithArrowProps {
  state?: ElementStates;
  letter?: string;
  head?: string | React.ReactElement | null;
  index?: number;
  tail?: string | React.ReactElement | null;
  tailType?: "string" | "element";
  extraClass?: string;
  isSmall?: boolean;
  showArrow?: boolean; // добавлено для контроля показа стрелки
  isAbove?: boolean;
}

export const CircleWithArrow: React.FC<CircleWithArrowProps> = ({
  showArrow = false, // новый проп
  isAbove = false,

  ...props
}) => {
  const containerClass = isAbove
    ? styles.containerAbove
    : styles.containerBelow;

  return (
    <div className={`${styles.container} ${containerClass}`}>
      <Circle {...props} />
      {showArrow && <div className={styles.arrow} data-testid="arrow">&gt;</div>}
    </div>
  );
};