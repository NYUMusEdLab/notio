// import * as React from "react"; // Necessary to run the tests, apparently.
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import WholeApp from "../WholeApp";
// import SoundMaker from "../Model/SoundMaker";

// jest.mock("../Model/SoundMaker"); // Automatic mock, which can be asserted against

// beforeEach(() => {
//   SoundMaker.mockClear();
// });

// jest.mock("react-dom", () => {
//   return {
//     ...jest.requireActual("react-dom"),
//     createPortal: (element, target) => {
//       return element;
//     },
//   };
// });

// describe("Example with basis WholeApp rendering to", () => {
//   test("this example showing basic functionality", () => {
//     // WARNING: The "@tonejs/piano" and "tone" libraries are mocked.
//     // This is seen in the __mocks__ folder
//     // Be aware that the __mocks__ folder follow the same import structure for the mocks to work!!!

//     render(
//       <MemoryRouter>
//         <Routes>
//           <Route path="/" element={<WholeApp />}></Route>;
//         </Routes>
//       </MemoryRouter>
//     );

//     // Texts directly present in the DOM, and examples of what can be done
//     screen.getByText("Show keyboard");
//     screen.getByText("Extended Keyboard");
//     screen.getByText("Sound");
//     screen.getByText("Notation");
//     screen.getByText("Video Player");
//     // expect(screen.getByText("Settings")).toBeInstanceOf(HTMLSpanElement);

//     // Text in <spans> which should be accessed by their title in the DOM
//     screen.getByTitle("Root");
//     screen.getByTitle("Scale");
//     screen.getByTitle("Clefs");
//     screen.getByTitle("Share this setup");

//     // SVGs which are accesible by their <title /> in the DOM (can also be changed to <span title="title" />)
//     const twoTrebles = screen.getAllByTitle("Treble Clef");
//     expect(twoTrebles.length).toBe(2);
//     screen.getByTitle("Alto Clef");
//     screen.getByTitle("Bass Clef");
//     screen.getByTitle("Tenor Clef");

//     // Example of using the userevent library, where we click on the AltoClef to change Clef (ie. now there are two AltoClefs in the menu)
//     const altoRadios = screen.getAllByTestId("Radio:alto"); //To make this work, Radios input received a datatest-id equal to the label.
//     expect(altoRadios.length).toBe(1); //  To make the code more clear, all datatest-ids should have a standard of Component:value
//     //  This is generally bad practice, since we choose something the user can't see
//     userEvent.click(altoRadios[0]);
//     const twoAltos = screen.getAllByTitle("Alto Clef");
//     expect(twoAltos.length).toBe(2);
//     const oneTreble = screen.getAllByTitle("Treble Clef");
//     expect(oneTreble.length).toBe(1);
//   });
// });
