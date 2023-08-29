import React from "react";
import { render } from "@testing-library/react";
import { Circle } from "./circle"; // Измените путь к вашему компоненту
import { ElementStates } from "../../../types/element-states";

describe("Circle Component", () => {
  it("рендерит элемент без буквы", () => {
    const { asFragment } = render(<Circle />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит элемент с буквой", () => {
    const { asFragment } = render(<Circle letter="A" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит с head", () => {
    const { asFragment } = render(<Circle head="Test Head" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит с react-элементом в head", () => {
    const { asFragment } = render(<Circle head={<span>React Element</span>} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит с tail", () => {
    const { asFragment } = render(<Circle tail="Tail Text" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит с react-элементом в tail", () => {
    const { asFragment } = render(<Circle tail={<span>Tail Element</span>} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит с index", () => {
    const { asFragment } = render(<Circle index={5} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит с пропом isSmall === true", () => {
    const { asFragment } = render(<Circle isSmall />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит в состоянии default", () => {
    const { asFragment } = render(<Circle state={ElementStates.Default} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит в состоянии changing", () => {
    const { asFragment } = render(<Circle state={ElementStates.Changing} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит в состоянии modified", () => {
    const { asFragment } = render(<Circle state={ElementStates.Modified} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
