import { ElementStates } from "../../types/element-states";

export function getReversingStringSteps(sourceString: string): string[][] {
  let steps: string[][] = [];
  let lettersArray = sourceString.split("");
  for (let i = 0; i < Math.floor(lettersArray.length / 2); i++) {
    const temp = lettersArray[i];
    lettersArray[i] = lettersArray[lettersArray.length - 1 - i];
    lettersArray[lettersArray.length - 1 - i] = temp;
    steps.push([...lettersArray]);
  }
  return steps;
}

export function getLetterState(index: number, highlightedIndexes: number[], changingIndexes: number[]): ElementStates {
  if (highlightedIndexes.includes(index)) {
    return ElementStates.Modified;
  } else if (changingIndexes.includes(index)) {
    return ElementStates.Changing;
  } else {
    return ElementStates.Default;
  }
}