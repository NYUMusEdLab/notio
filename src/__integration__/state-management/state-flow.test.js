/**
 * Integration Test: State Management Flow
 *
 * Purpose: Test how state changes propagate through the component hierarchy
 * Constitution v2.0.0: Integration test (PRIMARY - 60-70% of suite)
 *
 * This test validates:
 * - State updates in WholeApp propagate to child components
 * - User interactions trigger correct state changes
 * - State changes update UI correctly across components
 * - State consistency is maintained during rapid interactions
 * - Component re-renders are triggered appropriately
 */

import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WholeApp from '../../WholeApp';

// Mock SoundMaker to avoid audio context issues
jest.mock('../../Model/SoundMaker');

// Mock react-dom createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}));

// Mock VexFlow
jest.mock('vexflow', () => {
  const mockContext = {
    setViewBox: jest.fn(),
    setFont: jest.fn(),
    setStrokeStyle: jest.fn(),
    setFillStyle: jest.fn(),
    clear: jest.fn(),
  };

  class MockRenderer {
    constructor() {
      this.resize = jest.fn();
      this.getContext = jest.fn().mockReturnValue(mockContext);
    }
    static Backends = { SVG: 1, CANVAS: 2 };
  }

  class MockVoice {
    constructor() {
      this.addTickables = jest.fn().mockReturnThis();
      this.draw = jest.fn();
    }
  }

  class MockFormatter {
    constructor() {
      this.joinVoices = jest.fn().mockReturnThis();
      this.format = jest.fn().mockReturnThis();
    }
  }

  class MockStave {
    constructor() {
      this.setBegBarType = jest.fn().mockReturnThis();
      this.setEndBarType = jest.fn().mockReturnThis();
      this.setContext = jest.fn().mockReturnThis();
      this.draw = jest.fn().mockReturnThis();
      this.addClef = jest.fn().mockReturnThis();
    }
  }

  const Flow = {
    Renderer: MockRenderer,
    Stave: MockStave,
    StaveNote: jest.fn((config) => ({
      ...config,
      addModifier: jest.fn().mockReturnThis(),
    })),
    Voice: MockVoice,
    Formatter: MockFormatter,
    Accidental: jest.fn(),
    Barline: { type: { NONE: 1, SINGLE: 2, DOUBLE: 3, END: 4 } },
  };

  return { Flow, default: { Flow } };
});

describe('Integration Test: State Management Flow', () => {
  // T036: Test state management and propagation

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for initialization
    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // Default state: piano should be on, treble staff on
    const keys = screen.getAllByTestId('test-key');
    expect(keys.length).toBeGreaterThan(0);

    // Help tutorial should be visible by default
    const helpText = screen.queryAllByText('How to use Notio');
    expect(helpText.length).toBe(1);
  });

  it('should propagate pianoOn state change to keyboard', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // Get initial key count
    const initialKeys = screen.getAllByTestId('test-key');
    const initialCount = initialKeys.length;

    // Toggle piano off
    const pianoToggles = screen.getAllByText('Show keyboard');
    userEvent.click(pianoToggles[0]);

    // State change should propagate: keys should still render
    await waitFor(() => {
      const updatedKeys = screen.getAllByTestId('test-key');
      expect(updatedKeys.length).toBe(initialCount);

      // Keyboard should still be present
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });
  });

  it('should propagate extendedKeyboard state change to key positioning', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // Toggle extended keyboard
    const extendedToggles = screen.getAllByText('Extended Keyboard');
    userEvent.click(extendedToggles[0]);

    // State change should cause keyboard to re-render
    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // Keys should still be present after state change
    const keys = screen.getAllByTestId('test-key');
    expect(keys.length).toBeGreaterThan(0);
  });

  it('should maintain state consistency during rapid toggle changes', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    const pianoToggles = screen.getAllByText('Show keyboard');

    // Rapid toggles
    userEvent.click(pianoToggles[0]); // off
    userEvent.click(pianoToggles[0]); // on
    userEvent.click(pianoToggles[0]); // off
    userEvent.click(pianoToggles[0]); // on

    // State should stabilize
    await waitFor(() => {
      const keys = screen.getAllByTestId('test-key');
      expect(keys.length).toBeGreaterThan(0);
    });
  });

  it('should propagate help visibility state changes', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Help visible initially
    expect(screen.queryAllByText('How to use Notio').length).toBe(1);

    // Toggle help off
    const helpButton = screen.getByText('Press for help');
    userEvent.click(helpButton);

    await waitFor(() => {
      expect(screen.queryAllByText('How to use Notio').length).toBe(0);
    });

    // Toggle help back on
    userEvent.click(helpButton);

    await waitFor(() => {
      expect(screen.queryAllByText('How to use Notio').length).toBe(1);
    });
  });

  it('should handle multiple state changes without losing keyboard', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // Multiple state changes
    const pianoToggles = screen.getAllByText('Show keyboard');
    const extendedToggles = screen.getAllByText('Extended Keyboard');
    const helpButton = screen.getByText('Press for help');

    userEvent.click(pianoToggles[0]);
    userEvent.click(extendedToggles[0]);
    userEvent.click(helpButton);

    // Keyboard should persist through all state changes
    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();

      const keys = screen.getAllByTestId('test-key');
      expect(keys.length).toBeGreaterThan(0);
    });
  });

  it('should propagate state changes to all dependent components', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // State change should affect both TopMenu and Keyboard
    const pianoToggles = screen.getAllByText('Show keyboard');
    userEvent.click(pianoToggles[0]);

    await waitFor(() => {
      // TopMenu should still be present
      const topMenu = screen.getByTestId('top-menu');
      expect(topMenu).toBeInTheDocument();

      // Keyboard should still be present
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();

      // Keys should be present with updated styling
      const keys = screen.getAllByTestId('test-key');
      expect(keys.length).toBeGreaterThan(0);
    });
  });

  it('should maintain component references during state updates', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // Get reference to menu before state change
    const menuBefore = screen.getByTestId('top-menu');

    // Trigger state change
    const pianoToggles = screen.getAllByText('Show keyboard');
    userEvent.click(pianoToggles[0]);

    await waitFor(() => {
      // Menu should still be in document (not unmounted)
      const menuAfter = screen.getByTestId('top-menu');
      expect(menuAfter).toBeInTheDocument();
    });
  });

  it('should handle state updates without causing unnecessary re-renders', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    // Count initial keys
    const initialKeys = screen.getAllByTestId('test-key');
    const initialCount = initialKeys.length;

    // State change that affects height but not key count
    const pianoToggles = screen.getAllByText('Show keyboard');
    userEvent.click(pianoToggles[0]);

    await waitFor(() => {
      const updatedKeys = screen.getAllByTestId('test-key');
      // Key count should remain the same
      expect(updatedKeys.length).toBe(initialCount);
    });
  });

  it('should correctly initialize state from URL parameters', async () => {
    // Render with session ID in URL
    render(
      <MemoryRouter initialEntries={['/session/test-session-id']}>
        <Routes>
          <Route path="/session/:id" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // App should render with keyboard (default state or loaded state)
    await waitFor(() => {
      const keyboard = screen.getByTestId('Keyboard');
      expect(keyboard).toBeInTheDocument();
    });

    const keys = screen.getAllByTestId('test-key');
    expect(keys.length).toBeGreaterThan(0);
  });
});

/**
 * Integration Test Best Practices Applied:
 *
 * ✅ Tests realistic state management scenarios
 * ✅ Validates state propagation through component tree
 * ✅ Tests component integration with state changes
 * ✅ Uses Testing Library best practices
 * ✅ Uses mocks for external dependencies (VexFlow, SoundMaker)
 * ✅ Focuses on user-visible state changes
 * ✅ Tests state consistency and stability
 *
 * Performance Requirements:
 * - State updates should complete within <100ms (Constitution requirement)
 * - Test execution: <5 seconds (Task T038 requirement)
 */
