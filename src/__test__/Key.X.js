import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import Key from "../components/keyboard/Key";

describe("Key component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <Key note="C4" color="white" keyColor="white-key" toneIsInScale={true} />
    );
    const key = screen.getByTestId("test-key");
    expect(key).toBeInTheDocument();
    expect(key).toHaveClass("Key white on");
    expect(key).toHaveAttribute("data-note", "C4");
  });

  it("renders the correct color key", () => {
    const { getByTestId } = render(<Key keyColor="white" />);
    const key = screen.getByTestId("test-key");
    expect(key).toHaveClass("white");
  });

  it("renders the piano key when pianoOn is true", () => {
    const { getByTestId } = render(<Key pianoOn={true} />);
    const pianoKey = screen.getByTestId("test-piano-key");
    expect(pianoKey).toBeInTheDocument();
  });

  it("does not render the piano key when pianoOn is false", () => {
    const { queryByTestId } = render(<Key pianoOn={false} />);
    const pianoKey = queryByTestId("test-piano-key");
    expect(pianoKey).toBeNull();
  });

  it("calls the noteOnHandler function when the key is clicked", () => {
    const noteOnHandler = jest.fn();
    const { getByTestId } = render(<Key noteOnHandler={noteOnHandler} />);
    const key = screen.getByTestId("key");
    fireEvent.click(key);
    expect(noteOnHandler).toHaveBeenCalled();
  });

  it("calls the noteOffHandler function when the key is clicked and released", () => {
    const noteOffHandler = jest.fn();
    const { getByTestId } = render(<Key noteOffHandler={noteOffHandler} />);
    const key = screen.getByTestId("key");
    fireEvent.mouseDown(key);
    fireEvent.mouseUp(key);
    expect(noteOffHandler).toHaveBeenCalled();
  });
});
