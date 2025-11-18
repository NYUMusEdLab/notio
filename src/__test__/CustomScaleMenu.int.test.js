import * as React from "react"; // Necessary to run the tests, apparently.
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WholeApp from "../WholeApp";
import SoundMaker from "../Model/SoundMaker";

jest.mock("../Model/SoundMaker"); // Automatic mock, which can be asserted against

beforeEach(() => {
  //SoundMaker.mockClear();
});

jest.mock("react-dom", () => {
  return {
    ...jest.requireActual("react-dom"),
    createPortal: (element, target) => {
      return element;
    },
  };
});

describe("When displaying the customScale creater menu", () => {
  test("that it contains customScale menu", () => {
    // WARNING: The "@tonejs/piano" and "tone" libraries are mocked.
    // This is seen in the __mocks__ folder
    // Be aware that the __mocks__ folder follow the same import structure for the mocks to work!!!

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />}></Route>;
        </Routes>
      </MemoryRouter>
    );

    const scaleMenu = screen.getAllByText("Scale");
    expect(scaleMenu.length).toBeGreaterThanOrEqual(1);
    userEvent.click(scaleMenu[0]);

    // Example of using the userevent library, where we click on the AltoClef to change Clef (ie. now there are two AltoClefs in the menu)
    const custom = screen.getAllByText("Customize"); //To make this work, Radios input received a datatest-id equal to the label.
    expect(custom.length).toBe(1); //  To make the code more clear, all datatest-ids should have a standard of Component:value
    //                                                     //  This is generally bad practice, since we choose something the user can't see
    // userEvent.hover(custom[0])
    // const Customscale = screen.getAllByText("CustomScale");
    // expect(Customscale.length).toBe(1)
  });

  test("that it displays a custom scale menu popup when clicked", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />}></Route>;
        </Routes>
      </MemoryRouter>
    );

    //check that custom scale menu contains numbers 1-12 including all # and b
    //check that custom scale menu has checked the numbers in current scale.
    //check that each number has a paired color
    //check that the color can be selected and changed
    //check that predefined colorschemas :Notio colors,Black & White,Optimized for users with colour vision decifiency can be selected
    //check that all tones has both # and b representational
  });
});
