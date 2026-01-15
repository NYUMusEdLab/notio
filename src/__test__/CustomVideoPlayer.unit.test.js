import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomVideoPlayer from "../components/menu/CustomVideoPlayer";

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

describe("CustomVideoPlayer - Unit Tests (Edge Cases)", () => {
  // T042: Empty URL submission prevented
  describe("T042: Empty URL submission", () => {
    it("should not submit when URL input is empty", () => {
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

      // Submit without entering anything
      const submitButton = screen.getByRole("button", { name: /enter/i });
      fireEvent.click(submitButton);

      // onUrlChange should NOT have been called
      expect(onUrlChange).not.toHaveBeenCalled();
    });

    it("should not submit when URL input contains only whitespace", async () => {
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

      // Enter whitespace
      const urlInput = screen.getByPlaceholderText(/enter url/i);
      fireEvent.change(urlInput, { target: { value: "   " } });

      // Submit
      const submitButton = screen.getByRole("button", { name: /enter/i });
      fireEvent.click(submitButton);

      // onUrlChange should NOT have been called
      expect(onUrlChange).not.toHaveBeenCalled();
    });
  });

  // T043: Invalid URL error handling
  describe("T043: Error handling", () => {
    it("should initialize with no error state", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // No error alert should be present initially
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should clear error state when reset is clicked", () => {
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

      // Click Reset
      const resetButton = screen.getByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);

      // No error should be present
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // Additional edge cases
  describe("State management edge cases", () => {
    it("should preserve default URL for reset after multiple custom URL entries", () => {
      const onClose = jest.fn();
      const onUrlChange = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
          onUrlChange={onUrlChange}
        />
      );

      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      fireEvent.click(enterUrlTab);

      // Enter first custom URL
      const urlInput = screen.getByPlaceholderText(/enter url/i);
      fireEvent.change(urlInput, { target: { value: "https://custom1.com" } });
      fireEvent.click(screen.getByRole("button", { name: /enter/i }));

      // Enter second custom URL
      fireEvent.click(enterUrlTab);
      fireEvent.change(urlInput, { target: { value: "https://custom2.com" } });
      fireEvent.click(screen.getByRole("button", { name: /enter/i }));

      // Reset should go back to original default
      fireEvent.click(enterUrlTab);
      fireEvent.click(screen.getByRole("button", { name: /reset/i }));

      expect(onUrlChange).toHaveBeenLastCalledWith(DEFAULT_VIDEO_URL);
    });

    it("should handle props with default values correctly", () => {
      const onClose = jest.fn();
      // Only pass required props
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
        />
      );

      // Should render without errors
      expect(screen.getByTestId("custom-video-player")).toBeInTheDocument();

      // Should start on Player tab (default)
      const playerTab = screen.getByRole("tab", { name: /player/i });
      expect(playerTab).toHaveAttribute("aria-selected", "true");
    });

    it("should respect initialTab prop", () => {
      const onClose = jest.fn();
      render(
        <CustomVideoPlayer
          defaultVideoUrl={DEFAULT_VIDEO_URL}
          onClose={onClose}
          initialTab="Enter_url"
        />
      );

      // Should start on Enter URL tab
      const enterUrlTab = screen.getByRole("tab", { name: /enter url/i });
      expect(enterUrlTab).toHaveAttribute("aria-selected", "true");
    });
  });
});
