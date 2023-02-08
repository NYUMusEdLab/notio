import * as React from "react"; // Necessary to run the tests, apparently.
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SoundMaker from "../../Model/SoundMaker";
import WholeApp from "../../WholeApp";
import tooltipText from "../../data/tooltipText";

/*
    File containing tests for the tooltips feature.
*/

// This is necessary to make waitFor works, which makes sure Notio renders /shared/urls, otherwise its a loading screen.
// To make sure it loads, the "await waitFor(() => screen.getAllByText("Notation"));" is added after the render.
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

describe("Tooltips in the TopMenu", () => {
  test.each([[["/"]], [["/shared/INyllzBj7efsVe54qtFl"]]])(
    "Tooltips should be shown after initial load",
    async (url) => {
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
      await waitFor(() => screen.getAllByText("Notation"));

      // Act
      await waitFor(() =>
        setTimeout(() => {
          console.log(
            "This is a bad way to do it, but presently, the tooltips are manually activated after 1.5 seconds"
          );
        }, 2000)
      );

      // Assert
      screen.getByText(tooltipText["showKeyboard"]);
      screen.getByText(tooltipText["extendKeyboard"]);
      screen.getByText(tooltipText["sound"]);
      screen.getByText(tooltipText["notation"]);
      screen.getByText(tooltipText["root"]);
      screen.getByText(tooltipText["scale"]);
      screen.getByText(tooltipText["clefs"]);
      screen.getByText(tooltipText["shareThisSetup"]);
      screen.getByText(tooltipText["videoPlayer"]);
      screen.getByText(tooltipText["keyboard"]);
      screen.getByText(tooltipText["help"]);
    }
  );

  test.each([[["/"]], [["/shared/INyllzBj7efsVe54qtFl"]]])(
    "Pressing the help button should hide the tooltips",
    async (url) => {
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
      await waitFor(() => screen.getAllByText("Notation"));

      // Act
      await waitFor(() =>
        setTimeout(() => {
          console.log(
            "This is a bad way to do it, but presently, the tooltips are manually activated after 1.5 seconds"
          );
          // Assert
          const helpButton = screen.getByAltText("help");
          userEvent.click(helpButton);
          expect(screen.queryByText(tooltipText["showKeyboard"])).toBeNull();
          expect(screen.queryByText(tooltipText["extendKeyboard"])).toBeNull();
          expect(screen.queryByText(tooltipText["sound"])).toBeNull();
          expect(screen.queryByText(tooltipText["notation"])).toBeNull();
          expect(screen.queryByText(tooltipText["root"])).toBeNull();
          expect(screen.queryByText(tooltipText["scale"])).toBeNull();
          expect(screen.queryByText(tooltipText["clefs"])).toBeNull();
          expect(screen.queryByText(tooltipText["shareThisSetup"])).toBeNull();
          expect(screen.queryByText(tooltipText["videoPlayer"])).toBeNull();
          expect(screen.queryByText(tooltipText["keyboard"])).toBeNull();
          expect(screen.queryByText(tooltipText["help"])).toBeNull();
        }, 2000)
      );
    }
  );

  test.each([[["/"]], [["/shared/INyllzBj7efsVe54qtFl"]]])(
    "Pressing the help button twice should show the tooltips again",
    async (url) => {
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
      await waitFor(() => screen.getAllByText("Notation"));

      // Act
      await waitFor(() =>
        setTimeout(() => {
          console.log(
            "This is a bad way to do it, but presently, the tooltips are manually activated after 1.5 seconds"
          );
          const helpButton = screen.getByAltText("help");
          userEvent.click(helpButton);
          userEvent.click(helpButton);
          // Assert
          screen.getByText(tooltipText["showKeyboard"]);
          screen.getByText(tooltipText["extendKeyboard"]);
          screen.getByText(tooltipText["sound"]);
          screen.getByText(tooltipText["notation"]);
          screen.getByText(tooltipText["root"]);
          screen.getByText(tooltipText["scale"]);
          screen.getByText(tooltipText["clefs"]);
          screen.getByText(tooltipText["shareThisSetup"]);
          screen.getByText(tooltipText["videoPlayer"]);
          screen.getByText(tooltipText["keyboard"]);
          screen.getByText(tooltipText["help"]);
        }, 2000)
      );
    }
  );
});
