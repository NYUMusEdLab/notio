import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ColorKey from "../components/keyboard/ColorKey";

const testProps = {
  clef: "treble",
  color: "#ff0000",
  extendedKeyboard: false,
  index: 0,
  isActive: false,
  isMouseDown: false,
  keyColor: "white",
  keyIndex: undefined,
  note: "C4",
  noteName: [],
  noteNameEnglish: "C",
  noteOffHandler: (note) => {},
  noteOnHandler: (note) => {},
  pianoOn: true,
  root: "C",
  synth: {},
  theme: "light",
  toneIsInScale: true,
  trebleStaffOn: true,
};

describe("ColorKey", () => {
  it("should render correctly", () => {
    const { container } = render(<ColorKey {...testProps} />);
    expect(container).toMatchSnapshot();
  });

  it("should call touchUp when key is touched", () => {
    const touchUpMock = jest.fn();
    render(<ColorKey {...testProps} touchUp={touchUpMock} />);

    const colorKey = screen.getByTestId("ColorKey:C4");
    fireEvent.touchStart(colorKey);
    fireEvent.touchEnd(colorKey);

    expect(touchUpMock).toHaveBeenCalled();
  });

  it("should call onMouseOver when key is hovered", () => {
    const onMouseOverMock = jest.fn();
    render(<ColorKey {...testProps} onMouseOver={onMouseOverMock} />);

    const colorKey = screen.getByTestId("ColorKey:C");
    fireEvent.mouseOver(colorKey);

    expect(onMouseOverMock).toHaveBeenCalled();
  });

  it("should call clickMouse when key is clicked", () => {
    const clickMouseMock = jest.fn();
    render(<ColorKey {...testProps} clickMouse={clickMouseMock} />);

    const colorKey = screen.getByTestId("ColorKey:C");
    fireEvent.click(colorKey);

    expect(clickMouseMock).toHaveBeenCalled();
  });

  it("should call componentDidMount", () => {
    const spy = jest.spyOn(ColorKey.prototype, "componentDidMount");
    render(<ColorKey {...testProps} />);

    expect(spy).toHaveBeenCalled();
  });

  it("should call componentDidUpdate", () => {
    const spy = jest.spyOn(ColorKey.prototype, "componentDidUpdate");
    render(<ColorKey {...testProps} />);
    expect(spy).toHaveBeenCalled();
  });
});

// import React from "react";
// import { render, fireEvent, screen } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
// import ColorKey from "./ColorKey";

// describe("ColorKey", () => {
//   it("should render the correct note name", () => {
//     const noteName = "C";
//     render(<ColorKey noteName={noteName} />);
//     const colorKey = screen.getByTestId(`ColorKey:${noteName}`);
//     expect(colorKey).toHaveTextContent(noteName);
//   });

//   it("should change color on touchUp", () => {
//     const noteName = "C";
//     render(<ColorKey noteName={noteName} />);
//     const colorKey = screen.getByTestId(`ColorKey:${noteName}`);
//     fireEvent.touchStart(colorKey);
//     expect(colorKey).toHaveStyle("background-color: var(--color-key-active)");
//     fireEvent.touchEnd(colorKey);
//     expect(colorKey).toHaveStyle("background-color: var(--color-key-inactive)");
//   });

//   it("should change color on mouseOver and mouseOut", () => {
//     const noteName = "C";
//     render(<ColorKey noteName={noteName} />);
//     const colorKey = screen.getByTestId(`ColorKey:${noteName}`);
//     fireEvent.mouseOver(colorKey);
//     expect(colorKey).toHaveStyle("background-color: var(--color-key-active)");
//     fireEvent.mouseOut(colorKey);
//     expect(colorKey).toHaveStyle("background-color: var(--color-key-inactive)");
//   });

//   it("should change color on click", () => {
//     const noteName = "C";
//     render(<ColorKey noteName={noteName} />);
//     const colorKey = screen.getByTestId(`ColorKey:${noteName}`);
//     fireEvent.click(colorKey);
//     expect(colorKey).toHaveStyle("background-color: var(--color-key-active)");
//     fireEvent.click(colorKey);
//     expect(colorKey).toHaveStyle("background-color: var(--color-key-inactive)");
//   });

//   it("should call componentDidMount lifecycle method", () => {
//     const noteName = "C";
//     const spy = jest.spyOn(ColorKey.prototype, "componentDidMount");
//     render(<ColorKey noteName={noteName} />);
//     expect(spy).toHaveBeenCalled();
//   });
//   it("should call componentWillUnmount lifecycle method", () => {
//     const noteName = "C";
//     const spy = jest.spyOn(ColorKey.prototype, "componentWillUnmount");
//     const { unmount } = render(<ColorKey note={noteName} />);
//     unmount();
//     expect(spy).toHaveBeenCalled();
//   });
// });
