

export enum ElementStates {
  Default = "default",
  Changing = "changing",
  Modified = "modified",
}

export type StackArr = {
  value: string | number | null,
  type: ElementStates
}