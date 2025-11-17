// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock VexFlow 5.x completely for jsdom test environment
// This prevents the real VexFlow from loading (which requires structuredClone)
jest.mock("vexflow", () => ({
  Renderer: jest.fn().mockImplementation(() => ({
    getContext: jest.fn().mockReturnValue({
      setViewBox: jest.fn(),
    }),
  })),
  Stave: jest.fn().mockImplementation(() => ({
    setBegBarType: jest.fn().mockReturnThis(),
    setContext: jest.fn().mockReturnThis(),
    draw: jest.fn().mockReturnThis(),
  })),
  StaveNote: jest.fn().mockImplementation(function() {
    this.addModifier = jest.fn().mockReturnThis();
  }),
  Accidental: jest.fn(),
  Voice: jest.fn().mockImplementation(() => ({
    addTickables: jest.fn().mockReturnThis(),
    draw: jest.fn(),
  })),
  Formatter: jest.fn().mockImplementation(() => ({
    joinVoices: jest.fn().mockReturnThis(),
    format: jest.fn().mockReturnThis(),
  })),
  Barline: {
    type: {
      NONE: 1,
    },
  },
}));
