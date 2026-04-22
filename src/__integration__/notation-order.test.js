/**
 * Integration Tests: Notation Stacking Order (Issue #350)
 *
 * Purpose: Lock the visual contract that the notation layers rendered on each
 * key stack in the canonical Notation-menu order regardless of the order in
 * which the notation values are written into WholeApp state.
 *
 * Constitution v2.0.0: Integration test (PRIMARY - 60-70% of suite)
 *
 * Canonical order (from src/components/menu/Notation.js `notations`):
 *   "Chord extensions", "Scale Steps", "Relative", "Romance", "German", "English"
 *
 * Corresponding DOM class suffixes rendered by ColorKey:
 *   Extension, Step, Relative, Romance, German, English
 *
 * Visual direction (confirmed with product):
 *   Top of visual stack = FIRST in canonical list (Chord extensions on top,
 *   English at bottom). DOM order equals canonical order because
 *   `.noteWrapper` uses `flex-direction: column` (DOM top = visual top).
 *
 * These tests intentionally feed scrambled notation arrays through two
 * distinct writer seams:
 *   1. Menu writer: instance.handleChangeNotation([...])
 *   2. Direct state write (used by openSavedSession session-restore):
 *      instance.setState({ notation: [...] })
 *
 * Both should still produce a canonically-ordered DOM stack once the
 * state-boundary normalization fix lands (Slice 3). Today both fail because
 * the rendered order is taken literally from state.notation.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import WholeApp from '../WholeApp';

// Mock SoundMaker to avoid audio context issues in tests
jest.mock('../Model/SoundMaker');

// Mock react-dom createPortal for tooltip/modal rendering
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}));

// Mock VexFlow for MusicalStaff rendering
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
    constructor(cfg) {
      this.config = cfg;
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
  const mockStaveNote = jest.fn().mockImplementation((config) => ({
    ...config,
    addModifier: jest.fn().mockReturnThis(),
  }));
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
    StaveNote: mockStaveNote,
    Voice: MockVoice,
    Formatter: MockFormatter,
    Accidental: jest.fn(),
    Barline: { type: { NONE: 1, SINGLE: 2, DOUBLE: 3, END: 4 } },
  };
  return { Flow, default: { Flow } };
});

// Canonical DOM-class suffix order corresponding to the canonical notation
// list. ColorKey maps "Scale Steps" -> "Step" and "Chord extensions" ->
// "Extension" when it builds className=`noteWrapper--${item.key}`.
const CANONICAL_CLASS_SUFFIXES = [
  'Extension',
  'Step',
  'Relative',
  'Romance',
  'German',
  'English',
];

/**
 * Return the ordered list of notation-class suffixes rendered inside the
 * first ColorKey in the DOM, in DOM order (= visual top-to-bottom).
 */
const readNotationRowOrder = (container) => {
  // Query any element whose class contains noteWrapper--X where X is one of
  // the canonical suffixes. Use one of the in-scale ColorKeys; the first one
  // in the DOM is representative since all in-scale ColorKeys share the
  // same notation array.
  const firstColorKey = container.querySelector('[data-testid^="ColorKey:"] .noteWrapper--Extension, [data-testid^="ColorKey:"] .noteWrapper--Step, [data-testid^="ColorKey:"] .noteWrapper--Relative, [data-testid^="ColorKey:"] .noteWrapper--Romance, [data-testid^="ColorKey:"] .noteWrapper--German, [data-testid^="ColorKey:"] .noteWrapper--English');
  if (!firstColorKey) {
    return [];
  }
  // Walk up to the containing ColorKey then collect all notation rows inside it.
  const colorKey = firstColorKey.closest('[data-testid^="ColorKey:"]');
  const rows = Array.from(
    colorKey.querySelectorAll('[class*="noteWrapper--"]')
  );
  return rows
    .map((el) => {
      const match = Array.from(el.classList).find((c) =>
        c.startsWith('noteWrapper--')
      );
      return match ? match.replace('noteWrapper--', '') : null;
    })
    .filter((s) => CANONICAL_CLASS_SUFFIXES.includes(s));
};

describe('Integration Test: Notation stacking order (Issue #350)', () => {
  let appRef;

  beforeEach(() => {
    jest.clearAllMocks();
    appRef = React.createRef();
  });

  it('renders notation rows in canonical order after menu writer receives a scrambled array', async () => {
    const { container } = render(<WholeApp ref={appRef} />);

    await waitFor(() => {
      expect(screen.getByTestId('Keyboard')).toBeInTheDocument();
    });

    // Menu writer path: ListCheckbox callback may emit values in toggle-history
    // order, not canonical order. Simulate that by handing the writer a
    // scrambled subset of all notations.
    const scrambled = [
      'English',
      'Chord extensions',
      'Relative',
      'Scale Steps',
      'German',
      'Romance',
    ];

    await act(async () => {
      appRef.current.handleChangeNotation(scrambled);
    });

    await waitFor(() => {
      expect(readNotationRowOrder(container).length).toBeGreaterThan(0);
    });

    const domOrder = readNotationRowOrder(container);
    expect(domOrder).toEqual(CANONICAL_CLASS_SUFFIXES);
  });

  it('renders notation rows in canonical order after a direct state write (session-restore path)', async () => {
    const { container } = render(<WholeApp ref={appRef} />);

    await waitFor(() => {
      expect(screen.getByTestId('Keyboard')).toBeInTheDocument();
    });

    // Direct state write simulates WholeApp.openSavedSession, which restores
    // state.notation with result.notation verbatim from a Firestore document.
    // Legacy sessions can carry arrays in any order.
    const legacyStoredOrder = [
      'English',
      'German',
      'Romance',
      'Relative',
      'Scale Steps',
      'Chord extensions',
    ];

    await act(async () => {
      appRef.current.setState({ notation: legacyStoredOrder });
    });

    await waitFor(() => {
      expect(readNotationRowOrder(container).length).toBeGreaterThan(0);
    });

    const domOrder = readNotationRowOrder(container);
    expect(domOrder).toEqual(CANONICAL_CLASS_SUFFIXES);
  });
});
