import React from "react";
import { render } from "@testing-library/react";
import { CircleWithArrow } from "./circle-with-arrow"; // Измените путь к вашему компоненту
import styles from "./circle-with-arrow.module.css"

describe("CircleWithArrow Component", () => {

  it("рендерит элемент без стрелки", () => {
    const { asFragment, queryByTestId } = render(<CircleWithArrow />);
    expect(asFragment()).toMatchSnapshot();
    expect(queryByTestId("arrow")).toBeNull(); // убедимся, что стрелка не отображается
  });

  it("рендерит элемент со стрелкой", () => {
    const { asFragment, getByTestId } = render(<CircleWithArrow showArrow />);
    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("arrow")).toBeDefined(); // убедимся, что стрелка отображается
  });

});
