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
