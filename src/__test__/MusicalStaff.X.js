import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import MusicalStaff from "../components/musicScore/MusicalStaff";

const testProps = {
  clef: "treble",
  extendedKeyboard: false,
  keyIndex: undefined,
  note: "E4",
  showOffNotes: undefined,
  toneIsInScale: true,
  width: 60,
};
describe("MusicalStaff component", () => {
  // it("should render correctly", () => {
  //   const { container } = render(<MusicalStaff {...testProps} />);
  //   expect(container).toMatchSnapshot();
  // });
  // it("renders without crashing", () => {
  //   const { container } = render(<MusicalStaff {...testProps} />);
  //   expect(container).toBeTruthy();
  // });
  // it("accepts notes as props and renders them", () => {
  //   const notes = ["C4", "D4", "E4"];
  //   const { container } = render(<MusicalStaff {...testProps} notes={notes} />);
  //   expect(container).toHaveTextContent("C4");
  //   expect(container).toHaveTextContent("D4");
  //   expect(container).toHaveTextContent("E4");
  // });
  // it("calls a callback function when a note is clicked", () => {
  //   const notes = ["C4", "D4", "E4"];
  //   const handleClick = jest.fn();
  //   render(<MusicalStaff {...testProps} notes={notes} onClick={handleClick} />);
  //   const noteC = screen.getByTestId("note-C4");
  //   fireEvent.click(noteC);
  //   expect(handleClick).toHaveBeenCalledWith("C4");
  // });
});
