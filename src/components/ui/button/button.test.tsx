import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'; // для дополнительных матчеров, таких как toBeInTheDocument
import { Button } from "./button";

describe("<Button />", () => {
  it("рендерит кнопку с текстом", () => {
    const { asFragment } = render(<Button text="Текст кнопки" />);
    expect(screen.getByText("Текст кнопки")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит кнопку без текста", () => {
    const { asFragment } = render(<Button />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("рендерит заблокированную кнопку", () => {
    render(<Button disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("рендерит кнопку с индикацией загрузки", () => {
    const { asFragment } = render(<Button isLoader={true} />);
    expect(screen.getByAltText("Загрузка.")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("корректно вызывает колбек при клике на кнопку", () => {
    const onClickMock = jest.fn();
    render(<Button onClick={onClickMock} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
