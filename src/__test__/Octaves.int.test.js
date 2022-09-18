import * as React from "react"; // Necessary to run the tests, apparently.
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SoundMaker from "../Model/SoundMaker";
import WholeApp from "../WholeApp";

/*
    File containing all tests for the Octaves functionality
*/

// This is necessary to make waitFor works, which makes sure Notio renders /shared/urls, otherwise its a loading screen.
// To make sure it loads, the "await waitFor(() => screen.getAllByText("Root"));" is added after the render.
import MutationObserver from "mutation-observer";
import WholeAppWrapper from "WholeAppWrapper";
global.MutationObserver = MutationObserver;

jest.mock("../Model/SoundMaker"); // Automatic mock, which can be asserted against
jest.mock("react-player/lazy"); // Manual mock in __mock__ folder, made just to make the tests pass

beforeEach(() => {
  SoundMaker.mockClear();
});

jest.mock("react-dom", () => {
  return {
    ...jest.requireActual("react-dom"),
    createPortal: (element, target) => {
      return element;
    },
  };
});

describe("Root menu in the TopMenu", () => {
  test.each([
    ["C", 4, ["/"]],
    ["B", 3, ["/shared/INyllzBj7efsVe54qtFl"]],
  ])("Octave plus button should increase octave", async (root_note, octave, url) => {
    // Arrange the server and wait for the page to be loaded / skip the loading screen
    expect(SoundMaker).not.toHaveBeenCalled();
    render(
      <MemoryRouter initialEntries={url}>
        <Routes>
          <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
          <Route path="/" element={<WholeApp />}></Route>;
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => screen.getAllByText("Root"));
    // Arrange the SoundMaker class is initialized, and the octave is set as expected
    expect(SoundMaker).toHaveBeenCalledTimes(1);
    const octave_in_menu = screen.getByText("Octave:", { exact: false });
    expect(octave_in_menu.textContent).toBe("Octave: " + octave);
    // Act the plus button
    const plus_button = screen.getByText("+");
    userEvent.click(plus_button);
    // Assert the text showing the octave in the Root menu is 1 higher
    expect(octave_in_menu.textContent).toBe("Octave: " + (octave + 1));
    // Act by pressing a key on the keyboard
    const root_key = screen.getByTestId("ColorKey:" + root_note + (octave + 1));
    userEvent.click(root_key);
    // Assert that the SoundMaker actually starts and stops the sound by a single click
    expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(root_note + (octave + 1));
    expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(root_note + (octave + 1));
  });

  test.each([["B", 8, ["/shared/dhRpK0pk4jsnNr66lP4d"]]])(
    "Octave plus button should not increase octave, if octave is 8",
    async (root_note, octave, url) => {
      // Arrange the server and wait for the page to be loaded / skip the loading screen
      expect(SoundMaker).not.toHaveBeenCalled();
      render(
        <MemoryRouter initialEntries={url}>
          <Routes>
            <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
            <Route path="/" element={<WholeApp />}></Route>;
          </Routes>
        </MemoryRouter>
      );
      await waitFor(() => screen.getAllByText("Root"));
      // Arrange the SoundMaker class is initialized, and the octave is set as expected
      expect(SoundMaker).toHaveBeenCalledTimes(1);
      const octave_in_menu = screen.getByText("Octave:", { exact: false });
      expect(octave_in_menu.textContent).toBe("Octave: " + octave);
      // Act the plus button
      const plus_button = screen.getByText("+");
      userEvent.click(plus_button);
      // Assert the text showing the octave in the Root menu is the same
      expect(octave_in_menu.textContent).toBe("Octave: " + octave);
      // Act by pressing a key on the keyboard
      const root_key = screen.getByTestId("ColorKey:" + root_note + octave);
      userEvent.click(root_key);
      // Assert that the SoundMaker actually starts and stops the sound by a single click
      expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(root_note + octave);
      expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(root_note + octave);
    }
  );

  test.each([
    ["C", 4, ["/"]],
    ["B", 3, ["/shared/INyllzBj7efsVe54qtFl"]],
  ])("Octave minus button should decrease octave", async (root_note, octave, url) => {
    // Arrange the server and wait for the page to be loaded / skip the loading screen
    expect(SoundMaker).not.toHaveBeenCalled();
    render(
      <MemoryRouter initialEntries={url}>
        <Routes>
          <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
          <Route path="/" element={<WholeApp />}></Route>;
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => screen.getAllByText("Root"));
    // Arrange the SoundMaker class is initialized, and the octave is set as expected
    expect(SoundMaker).toHaveBeenCalledTimes(1);
    const octave_in_menu = screen.getByText("Octave:", { exact: false });
    expect(octave_in_menu.textContent).toBe("Octave: " + octave);
    // Act the minus button
    const minus_button = screen.getByText("-");
    userEvent.click(minus_button);
    // Assert the text showing the octave in the Root menu is 1 lower
    expect(octave_in_menu.textContent).toBe("Octave: " + (octave - 1));
    // Act by pressing a key on the keyboard
    const root_key = screen.getByTestId("ColorKey:" + root_note + (octave - 1));
    userEvent.click(root_key);
    // Assert that the SoundMaker actually starts and stops the sound by a single click
    expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(root_note + (octave - 1));
    expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(root_note + (octave - 1));
  });

  test.each([["B", 1, ["/shared/LjPDM0B9vcyw7tiEUrQA"]]])(
    "Octave minus button should not decrease octave, if octave is 1",
    async (root_note, octave, url) => {
      // Arrange the server and wait for the page to be loaded / skip the loading screen
      expect(SoundMaker).not.toHaveBeenCalled();
      render(
        <MemoryRouter initialEntries={url}>
          <Routes>
            <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
            <Route path="/" element={<WholeApp />}></Route>;
          </Routes>
        </MemoryRouter>
      );
      await waitFor(() => screen.getAllByText("Root"));
      // Arrange the SoundMaker class is initialized, and the octave is set as expected
      expect(SoundMaker).toHaveBeenCalledTimes(1);
      const octave_in_menu = screen.getByText("Octave:", { exact: false });
      expect(octave_in_menu.textContent).toBe("Octave: " + octave);
      // Act the minus button
      const minus_button = screen.getByText("-");
      userEvent.click(minus_button);
      // Assert the text showing the octave in the Root menu is the same
      expect(octave_in_menu.textContent).toBe("Octave: " + octave);
      // Act by pressing a key on the keyboard
      const root_key = screen.getByTestId("ColorKey:" + root_note + octave);
      userEvent.click(root_key);
      // Assert that the SoundMaker actually starts and stops the sound by a single click
      expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(root_note + octave);
      expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(root_note + octave);
    }
  );
});
