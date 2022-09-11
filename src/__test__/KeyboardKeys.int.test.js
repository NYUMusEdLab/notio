import * as React from "react"; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
// import fireEvent from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
// import Keyboard from "../components/Keyboard/Keyboard";
import SoundMaker from "../Model/SoundMaker";
// import ReactPlayer from "react-player/lazy";
import WholeApp from "../WholeApp";
// import { Time } from "tone";

/*
    File containing all integration tests of the Keyboard Functionality
    Primarily tests the interaction between the Keyboard and different types of input (click, keyboard press, midi, and audio inputgit gi)"
*/

// This is necessary to make waitFor works, which makes sure Notio renders /shared/urls, otherwise its a loading screen.
// To make sure it loads "await waitFor(() => screen.getAllByText("Root"));" is added after the render.
import MutationObserver from "mutation-observer";
import WholeAppWrapper from "WholeAppWrapper";
global.MutationObserver = MutationObserver;

// Overview of Mocks necessary
jest.mock("../components/SoundMaker"); // Automatic mock, which can be asserted against
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

describe("ComputerKeyboard pressing key to", () => {
  test.each([
    ["C", 4, "f", ["/"]],
    ["C", 1, "f", ["/shared/QV11qK14Q7x2uPdOQNPP"]], //C Major-scale octave 1
    ["Bb", 3, "f", ["/shared/O4c7Pb8H0aCmjm5a5E1F"]], //Bb-Major-scale octave 3
    ["C", 4, "f", ["/shared/FDa5RdtPlGfMHekkIdtd"]], //C Major-Blues-Scale
    ["Bb", 1, "f", ["/shared/py2guWIDDZfOACcRi5T7"]], //Bb Major-Blues-Scale
  ])("pressing [f] plays the root", async (root_note, octave, keypress, url) => {
    expect(SoundMaker).not.toHaveBeenCalled();
    render(
      <MemoryRouter initialEntries={url}>
        <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
        <Route path={"/"} element={<WholeApp />}></Route>;
      </MemoryRouter>
    );
    await waitFor(() => screen.getAllByText("Root"));
    expect(SoundMaker).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(keypress);

    expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(root_note + octave);
    expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(root_note + octave);
  });

  test.each([
    ["C", 4, "B3", "d", 0, ["/"]], //Default scale and octave
    ["C", 1, "B2", "d", 2, ["/shared/QV11qK14Q7x2uPdOQNPP"]], //C Major-scale octave 1
    ["Bb", 3, "A7", "d", 4, ["/shared/O4c7Pb8H0aCmjm5a5E1F"]], //Bb-Major-scale octave 3
  ])(
    "pressing [d] in Major-scale plays the major7th below the root after octave have been increased with #some_number (!!remember octave shifts at C!!)",
    async (root_note, octave, expected_tone, keypress, keypressCount, url) => {
      expect(SoundMaker).not.toHaveBeenCalled();
      render(
        <MemoryRouter initialEntries={url}>
          <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
          <Route path={"/"} element={<WholeApp />}></Route>;
        </MemoryRouter>
      );
      await waitFor(() => screen.getAllByText("Root"));
      expect(SoundMaker).toHaveBeenCalledTimes(1);
      const octave_in_menu = screen.getByText("Octave:", { exact: false });
      expect(octave_in_menu.textContent).toBe("Octave: " + octave);
      const plus_button = screen.getByText("+");
      for (let count = 0; count < keypressCount; count++) {
        userEvent.click(plus_button);
      }
      expect(octave_in_menu.textContent).toBe("Octave: " + (octave + keypressCount));

      await userEvent.keyboard(keypress);

      expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(expected_tone);
      expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(expected_tone);
    }
  );

  test.each([
    ["C", 4, "A3", "d", 0, ["/shared/FDa5RdtPlGfMHekkIdtd"]], //C Major-Blues-Scale
    ["C", 4, "A5", "d", 2, ["/shared/FDa5RdtPlGfMHekkIdtd"]], //C Major-Blues-Scale
    ["Bb", 1, "G5", "d", 4, ["/shared/py2guWIDDZfOACcRi5T7"]], //Bb Major-Blues-Scale
  ])(
    "pressing [d] in Major-blues-scale plays the 6th below the root after octave have been increased with #some_number(!!remember octave shifts at C!!)",
    async (root_note, octave, expected_tone, keypress, keypressCount, url) => {
      expect(SoundMaker).not.toHaveBeenCalled();
      render(
        <MemoryRouter initialEntries={url}>
          <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
          <Route path={"/"} element={<WholeApp />}></Route>;
        </MemoryRouter>
      );
      await waitFor(() => screen.getAllByText("Root"));
      expect(SoundMaker).toHaveBeenCalledTimes(1);
      const octave_in_menu = screen.getByText("Octave:", { exact: false });
      expect(octave_in_menu.textContent).toBe("Octave: " + octave);
      const plus_button = screen.getByText("+");
      for (let count = 0; count < keypressCount; count++) {
        userEvent.click(plus_button);
      }
      expect(octave_in_menu.textContent).toBe("Octave: " + (octave + keypressCount));

      const pressKeyDownAndUp = "{d>}{/d}";
      await userEvent.keyboard(pressKeyDownAndUp);

      expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(expected_tone);
      expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(expected_tone);
    }
  );
});
