import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
// import Fetch from './fetch'
import React from "react";
import WholeApp from "WholeApp";
import ReactDOM from "react-dom/client";

describe("WholeApp basic tasts", () => {
  it("loads WholeApp", async () => {
    // ARRANGE
    const container = document.createElement("div"); //document.getElementById("root");
    const root = ReactDOM.createRoot(container);
    //   render(<Fetch url="/greeting" />)

    root.render(<WholeApp />);

    // ACT
    //   await userEvent.click(screen.getByText("Load Greeting"));
    //   await screen.findByRole("heading");

    // ASSERT
    //   expect(screen.getByRole("heading")).toHaveTextContent("hello there");
    //   expect(screen.getByRole("button")).toBeDisabled();

    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug();
  });

  it("renders the topmenu", async () => {
    // ARRANGE
    const container = document.createElement("div"); //document.getElementById("root");
    const root = ReactDOM.createRoot(container);
    //   render(<Fetch url="/greeting" />)

    // ACT
    root.render(<WholeApp />);
    //   await userEvent.click(screen.getByText("Load Greeting"));
    await screen.findByTestId("topmenu");

    // ASSERT
    //   expect(screen.getByRole("heading")).toHaveTextContent("hello there");
    //   expect(screen.getByRole("button")).toBeDisabled();

    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug();
  });
});
