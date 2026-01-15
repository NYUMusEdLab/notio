import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import CustomVideoPlayer from "../components/menu/CustomVideoPlayer";

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock portal root for Overlay component
beforeEach(() => {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "plugin_root");
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  const portalRoot = document.getElementById("plugin_root");
  if (portalRoot) {
    document.body.removeChild(portalRoot);
  }
});

const DEFAULT_VIDEO_URL = "https://youtu.be/test-video-id";

describe("CustomVideoPlayer - User Story 1: View Default Video Content", () => {
  // T007: Integration test - render with default URL
  describe("T007: Render with default URL", () => {
    it("should render the video player with the default URL", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Verify the player renders
      expect(screen.getByTestId("custom-video-player")).toBeInTheDocument();
    });

    it("should pass default URL to ReactPlayer component", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // ReactPlayer mock displays the URL
      await waitFor(() => {
        expect(screen.getByTestId("video-url")).toHaveTextContent(DEFAULT_VIDEO_URL);
      });
    });

    it("should display in overlay when opened", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Overlay should be present (rendered via portal)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  // T008: Integration test - playback controls visible and functional
  describe("T008: Playback controls", () => {
    it("should render with controls enabled", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // ReactPlayer mock shows controls
      await waitFor(() => {
        expect(screen.getByTestId("video-controls")).toBeInTheDocument();
      });
    });

    it("should show Player tab by default", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Player tab should be active
      const playerTab = screen.getByRole("tab", { name: /player/i });
      expect(playerTab).toHaveAttribute("aria-selected", "true");
    });
  });

  // T009: Integration test - accessibility audit with jest-axe
  describe("T009: Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const onClose = jest.fn();
      const { container } = render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should support keyboard navigation", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Tab navigation should work
      const closeButton = screen.getByRole("button", { name: /close/i });
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });

    it("should have proper ARIA attributes", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Overlay should have dialog role
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    it("should close on Escape key press", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Press Escape
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenCalled();
    });
  });
});

// User Story 2: Enter Custom Video URL
describe("CustomVideoPlayer - User Story 2: Enter Custom Video URL", () => {
  const CUSTOM_VIDEO_URL = "https://youtu.be/custom-video-id";

  // T016: URL input field renders in Enter_url tab
  describe("T016: URL input field", () => {
    it("should render URL input field when Enter URL tab is selected", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Click Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // URL input should be visible
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();
      });
    });

    it("should accept typed URL input", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Click Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // Type in the input
      const urlInput = await screen.findByPlaceholderText(/enter url/i);
      await userEvent.type(urlInput, CUSTOM_VIDEO_URL);

      expect(urlInput).toHaveValue(CUSTOM_VIDEO_URL);
    });
  });

  // T017: URL submission updates player content
  describe("T017: URL submission", () => {
    it("should update video URL when form is submitted", async () => {
      const onClose = jest.fn();
      const onUrlChange = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
          onUrlChange={onUrlChange}
        />
      );

      // Click Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // Enter custom URL
      const urlInput = await screen.findByPlaceholderText(/enter url/i);
      await userEvent.type(urlInput, CUSTOM_VIDEO_URL);

      // Submit form
      const submitButton = screen.getByRole("button", { name: /enter/i });
      fireEvent.click(submitButton);

      // Verify onUrlChange was called
      await waitFor(() => {
        expect(onUrlChange).toHaveBeenCalledWith(CUSTOM_VIDEO_URL);
      });
    });

    it("should switch to Player tab after URL submission", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Click Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // Enter custom URL and submit
      const urlInput = await screen.findByPlaceholderText(/enter url/i);
      await userEvent.type(urlInput, CUSTOM_VIDEO_URL);

      const submitButton = screen.getByRole("button", { name: /enter/i });
      fireEvent.click(submitButton);

      // Player tab should be active
      await waitFor(() => {
        const playerTab = screen.getByRole("tab", { name: /player/i });
        expect(playerTab).toHaveAttribute("aria-selected", "true");
      });
    });
  });

  // T018: "Currently watching" shows current URL
  describe("T018: Currently watching display", () => {
    it("should display the current video URL", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Click Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // Should show current URL
      await waitFor(() => {
        expect(screen.getByText(/currently watching/i)).toBeInTheDocument();
        expect(screen.getByText(DEFAULT_VIDEO_URL)).toBeInTheDocument();
      });
    });
  });
});

// User Story 3: Reset to Default URL
describe("CustomVideoPlayer - User Story 3: Reset to Default URL", () => {
  const CUSTOM_VIDEO_URL = "https://youtu.be/custom-video-id";

  // T026: Reset button visible in Enter_url tab
  describe("T026: Reset button visibility", () => {
    it("should display Reset button in Enter URL tab", async () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Click Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // Reset button should be visible
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
      });
    });
  });

  // T027: Reset restores defaultVideoUrl prop value
  describe("T027: Reset functionality", () => {
    it("should restore default URL when Reset is clicked", async () => {
      const onClose = jest.fn();
      const onUrlChange = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
          onUrlChange={onUrlChange}
        />
      );

      // Go to Enter URL tab and submit a custom URL
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      const urlInput = await screen.findByPlaceholderText(/enter url/i);
      await userEvent.type(urlInput, CUSTOM_VIDEO_URL);

      const submitButton = screen.getByRole("button", { name: /enter/i });
      fireEvent.click(submitButton);

      // Now go back and reset
      fireEvent.click(enterUrlTab);
      const resetButton = await screen.findByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);

      // onUrlChange should be called with default URL
      await waitFor(() => {
        expect(onUrlChange).toHaveBeenCalledWith(DEFAULT_VIDEO_URL);
      });
    });
  });

  // T028: Reset when already default does not error
  describe("T028: Reset when already default", () => {
    it("should not error when Reset is clicked while default URL is playing", async () => {
      const onClose = jest.fn();
      const onUrlChange = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
          onUrlChange={onUrlChange}
        />
      );

      // Click Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // Click Reset while default is playing
      const resetButton = await screen.findByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);

      // Should call onUrlChange with default URL (idempotent)
      await waitFor(() => {
        expect(onUrlChange).toHaveBeenCalledWith(DEFAULT_VIDEO_URL);
      });
    });
  });
});

// User Story 4: Display in Overlay/Modal
describe("CustomVideoPlayer - User Story 4: Display in Overlay/Modal", () => {
  // T034: Overlay renders via portal
  describe("T034: Overlay portal rendering", () => {
    it("should render in the plugin_root portal", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Overlay should be in the portal
      const portalRoot = document.getElementById("plugin_root");
      expect(portalRoot.querySelector(".overlay")).toBeInTheDocument();
    });
  });

  // T035: Escape key closes overlay
  describe("T035: Escape key handling", () => {
    it("should close overlay when Escape is pressed", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Press Escape
      fireEvent.keyDown(document, { key: "Escape" });

      expect(onClose).toHaveBeenCalled();
    });
  });
});
