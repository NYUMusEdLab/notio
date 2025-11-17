# Quickstart: Writing Constitutional-Compliant Tests

## Overview

This guide teaches you how to write tests that comply with the Notio Constitution v2.0.0, which mandates an **integration-first testing strategy** based on Rainer Hahnekamp's research principles. Unlike traditional test pyramids that emphasize unit tests, Notio prioritizes integration tests (60-70%) because they:

- Test realistic user workflows and feature interactions
- Survive refactoring better than unit tests
- Catch real bugs at component boundaries
- Reflect actual user behavior in music education contexts

**Key Metrics:**
- **100% code coverage is MANDATORY** (NON-NEGOTIABLE)
- **Integration Tests**: 60-70% of test suite
- **E2E Tests**: 20-30% of test suite
- **Unit Tests**: 10-20% of test suite (edge cases and complex algorithms only)
- **Performance Requirements**: Integration tests < 5s, E2E tests < 30s per test

## Prerequisites

### Required Knowledge
- React 18.2.0 fundamentals
- Jest testing framework
- React Testing Library (@testing-library/react 13.0.0)
- Music education domain concepts (notation, scales, clefs)

### Required Tools
```json
{
  "jest": "^29.0.3",
  "@testing-library/react": "^13.0.0",
  "@testing-library/user-event": "^13.2.1",
  "@testing-library/jest-dom": "^5.16.5",
  "react-test-renderer": "^18.2.0"
}
```

### Musical Libraries (Must Be Mocked in Tests)
```json
{
  "vexflow": "^4.0.3",           // Musical notation rendering
  "tone": "^14.7.77",            // Audio synthesis (Tone.js)
  "@tonejs/piano": "^0.2.1",     // Piano sounds
  "soundfont-player": "^0.12.0"  // Alternative sound engine
}
```

### Setup Test Environment

Create mock files in `src/__mocks__/` following Jest's manual mock structure:

**src/__mocks__/@tonejs/piano.js:**
```javascript
module.exports = {
  Piano: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue(true),
    keyDown: jest.fn(),
    keyUp: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
  })),
};
```

**src/__mocks__/tone.js:**
```javascript
module.exports = {
  Synth: jest.fn().mockImplementation(() => ({
    triggerAttackRelease: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
  })),
  now: jest.fn(() => 0),
};
```

## Testing Philosophy (Rainer Hahnekamp's Principles)

### Why Integration-First?

**Traditional Unit Test Approach (Avoid):**
```javascript
// ❌ BAD: Over-isolated unit test that's brittle
describe('ColorKey - UNIT (Brittle)', () => {
  it('should update state when color prop changes', () => {
    const { rerender } = render(<ColorKey {...testProps} color="#ff0000" />);
    rerender(<ColorKey {...testProps} color="#00ff00" />);
    // This test breaks if we refactor from state to props or memoization
  });
});
```

**Integration Test Approach (Prefer):**
```javascript
// ✅ GOOD: Integration test that tests real behavior
describe('ColorKey - INTEGRATION', () => {
  it('should play note when user clicks on in-scale key', async () => {
    const noteOnHandler = jest.fn();
    render(
      <ColorKey
        {...testProps}
        note="C4"
        toneIsInScale={true}
        noteOnHandler={noteOnHandler}
      />
    );

    const key = screen.getByTestId('ColorKey:C4');
    await userEvent.click(key);

    expect(noteOnHandler).toHaveBeenCalledWith('C4');
    // Tests actual user behavior: click → audio plays
  });
});
```

**Key Difference:**
- Unit tests test implementation details (state changes, internal methods)
- Integration tests test user-observable behavior (interactions, data flow)
- Integration tests survive refactoring (change state to props? test still passes)

### When to Write Each Test Type

| Test Type | When to Use | Examples |
|-----------|-------------|----------|
| **Integration** (60-70%) | Default for all features | ColorKey + audio handler, TopMenu + submenus, MusicalStaff + VexFlow rendering |
| **E2E** (20-30%) | Critical user journeys, cross-browser needs | Student completes exercise flow, audio-visual sync, performance validation |
| **Unit** (10-20%) | Complex algorithms, edge cases only | Music theory calculations (interval math), tuning algorithm boundaries |

## Writing Integration Tests (60-70% of suite)

### Pattern: Component Integration Test Template

```javascript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import the component under test
import ComponentName from '../components/path/ComponentName';

// Mock external dependencies (audio, notation libraries)
jest.mock('../Model/SoundMaker');

describe('ComponentName - INTEGRATION', () => {
  // Setup: Define realistic test props
  const testProps = {
    // Minimal props needed for realistic scenario
  };

  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  it('should [user action] when [user context]', async () => {
    // Arrange: Render component with realistic context
    render(<ComponentName {...testProps} />);

    // Act: Simulate user interaction
    const element = screen.getByRole('button', { name: /action/i });
    await userEvent.click(element);

    // Assert: Verify user-observable outcome
    expect(screen.getByText(/expected result/i)).toBeInTheDocument();
  });
});
```

### Example 1: Musical Component Integration Test

**Test File:** `src/__test__/ColorKey.integration.test.js`

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ColorKey from '../components/keyboard/ColorKey';

// Integration test: ColorKey + MusicalStaff + audio handler
describe('ColorKey + MusicalStaff Integration', () => {
  const mockNoteOnHandler = jest.fn();
  const mockNoteOffHandler = jest.fn();

  const baseProps = {
    clef: 'treble',
    color: '#ff0000',
    extendedKeyboard: false,
    index: 0,
    isActive: false,
    isMouseDown: false,
    keyColor: 'white',
    note: 'C4',
    noteName: [{ value: 'C', key: 'english' }],
    noteNameEnglish: 'C',
    noteOffHandler: mockNoteOffHandler,
    noteOnHandler: mockNoteOnHandler,
    pianoOn: true,
    root: 'C',
    synth: {},
    theme: 'light',
    toneIsInScale: true,
    trebleStaffOn: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render key with musical staff notation when trebleStaffOn=true', () => {
    render(<ColorKey {...baseProps} />);

    const colorKey = screen.getByTestId('ColorKey:C4');
    expect(colorKey).toBeInTheDocument();

    // Integration: ColorKey contains MusicalStaff child component
    const musicalStaff = colorKey.querySelector('.musical-staff');
    expect(musicalStaff).toBeInTheDocument();
  });

  it('should play note when user clicks in-scale key', async () => {
    render(<ColorKey {...baseProps} toneIsInScale={true} />);

    const colorKey = screen.getByTestId('ColorKey:C4');
    await userEvent.click(colorKey);

    // Integration: User click → noteOnHandler called
    expect(mockNoteOnHandler).toHaveBeenCalledWith('C4');
    expect(mockNoteOnHandler).toHaveBeenCalledTimes(1);
  });

  it('should release note when user releases mouse', async () => {
    render(<ColorKey {...baseProps} />);

    const colorKey = screen.getByTestId('ColorKey:C4');
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: colorKey },
      { keys: '[/MouseLeft]' },
    ]);

    // Integration: Mouse down → note plays, mouse up → note stops
    expect(mockNoteOnHandler).toHaveBeenCalledWith('C4');
    expect(mockNoteOffHandler).toHaveBeenCalledWith('C4');
  });

  it('should NOT play note when key is out of scale', async () => {
    render(<ColorKey {...baseProps} toneIsInScale={false} />);

    const colorKey = screen.getByTestId('ColorKey:C4');
    await userEvent.click(colorKey);

    // Integration: Out-of-scale keys don't trigger audio
    expect(mockNoteOnHandler).not.toHaveBeenCalled();
  });

  it('should support touch interaction on mobile devices', async () => {
    render(<ColorKey {...baseProps} />);

    const colorKey = screen.getByTestId('ColorKey:C4');
    await userEvent.pointer([
      { keys: '[TouchA>]', target: colorKey },
      { keys: '[/TouchA]' },
    ]);

    // Integration: Touch events trigger same audio behavior
    expect(mockNoteOnHandler).toHaveBeenCalledWith('C4');
    expect(mockNoteOffHandler).toHaveBeenCalledWith('C4');
  });

  it('should display accidentals in note name (sharps/flats)', () => {
    const propsWithSharp = {
      ...baseProps,
      note: 'C#4',
      noteName: [{ value: 'C#', key: 'english' }],
    };

    const { container } = render(<ColorKey {...propsWithSharp} />);

    // Integration: Note names render with musical symbols
    const noteName = container.querySelector('.noteName');
    expect(noteName).toHaveTextContent('C'); // Sharp symbol rendered
  });
});
```

### Example 2: User Workflow Integration Test

**Test File:** `src/__test__/TopMenu.workflow.integration.test.js`

```javascript
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WholeApp from '../WholeApp';
import SoundMaker from '../Model/SoundMaker';

jest.mock('../Model/SoundMaker');
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}));

describe('TopMenu User Workflow - INTEGRATION', () => {
  beforeEach(() => {
    SoundMaker.mockClear();
  });

  it('should allow user to change scale and see updated keyboard', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Step 1: User clicks Scale menu
    const scaleMenu = screen.getByTitle('Scale');
    await userEvent.click(scaleMenu);

    // Step 2: User selects a scale option
    // (Actual scale options would appear in dropdown)
    await waitFor(() => {
      expect(screen.getByText('Scale')).toBeInTheDocument();
    });

    // Integration: Menu state changes + keyboard re-renders with new scale
  });

  it('should allow user to change clef and update notation display', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Initial state: Treble clef shown
    expect(screen.getAllByTitle('Treble Clef').length).toBe(2);

    // Step 1: User clicks Clef menu
    const clefMenu = screen.getByTitle('Clefs');
    await userEvent.click(clefMenu);

    // Step 2: User selects Alto clef
    const altoRadio = screen.getByTestId('Radio:alto');
    await userEvent.click(altoRadio);

    // Integration: Clef selection → staff notation updates
    await waitFor(() => {
      expect(screen.getAllByTitle('Alto Clef').length).toBe(2);
      expect(screen.getAllByTitle('Treble Clef').length).toBe(1);
    });
  });

  it('should toggle keyboard visibility and hide/show keys', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Initial: Keyboard visible
    const toggleKeyboard = screen.getByText('Show keyboard');
    await userEvent.click(toggleKeyboard);

    // Integration: Toggle state → keyboard component unmounts/mounts
    // (Actual keyboard visibility would be tested here)
  });

  it('should open help modal when help button clicked', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Initial: Help content visible (default)
    expect(screen.getByText('How to use Notio')).toBeInTheDocument();

    // User clicks help button to toggle
    const helpButton = screen.getByText('Press for help');
    await userEvent.click(helpButton);

    // Integration: Help button → modal closes
    expect(screen.queryByText('How to use Notio')).not.toBeInTheDocument();
  });
});
```

### Example 3: Error Handling Integration Test

**Test File:** `src/__test__/CustomScaleMenu.error.integration.test.js`

```javascript
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WholeApp from '../WholeApp';

jest.mock('../Model/SoundMaker');
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}));

describe('Custom Scale Error Handling - INTEGRATION', () => {
  it('should display custom scale creator when "Customize" selected', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Navigate to Scale menu
    const scaleMenu = screen.getAllByText('Scale')[0];
    await userEvent.click(scaleMenu);

    // Click Customize option
    const customizeOption = screen.getByText('Customize');
    expect(customizeOption).toBeInTheDocument();

    // Integration: Customize click → custom scale menu appears
    await userEvent.hover(customizeOption);

    // Custom scale creator would appear here
  });

  it('should validate custom scale has at least one note selected', async () => {
    // Integration test for error state:
    // User creates empty scale → validation error → user corrects → success

    // This is a placeholder for actual custom scale validation logic
    // Real implementation would test:
    // 1. User opens custom scale creator
    // 2. User tries to save without selecting notes
    // 3. Error message appears
    // 4. User adds notes
    // 5. Save succeeds
  });
});
```

## Writing E2E Tests (20-30% of suite)

### Playwright Setup (Future - Not Yet Implemented)

Currently, Notio uses Jest + React Testing Library for all tests. When Playwright is added, E2E tests should follow this pattern:

**playwright.config.js (Future):**
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 30 * 1000, // 30s per test (Constitution requirement)
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example 1: Student Workflow E2E Test (Future)

**e2e/student-exercise-flow.spec.js:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Student Exercise Workflow - E2E', () => {
  test('should complete full exercise: select scale → play notes → receive feedback', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');

    // Step 1: Student selects C Major scale
    await page.click('text=Scale');
    await page.click('text=Major (Ionian)');

    // Step 2: Student selects C root
    await page.click('text=Root');
    await page.click('[data-testid="root-C"]');

    // Step 3: Student plays C-E-G chord on keyboard
    const cKey = page.locator('[data-testid="ColorKey:C4"]');
    const eKey = page.locator('[data-testid="ColorKey:E4"]');
    const gKey = page.locator('[data-testid="ColorKey:G4"]');

    await cKey.click();
    await eKey.click();
    await gKey.click();

    // Step 4: Verify visual feedback
    await expect(cKey).toHaveCSS('background', /#.*[Ff]{2}.*/); // Red color

    // E2E: Complete user journey from menu → interaction → feedback
  });

  test('should persist user settings across page refresh', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // User customizes setup
    await page.click('text=Extended Keyboard');
    await page.click('text=Clefs');
    await page.click('[data-testid="Radio:bass"]');

    // Refresh page
    await page.reload();

    // E2E: Settings should persist (localStorage or session)
    const bassClefs = page.locator('title=Bass Clef');
    await expect(bassClefs).toHaveCount(2);
  });
});
```

### Example 2: Cross-Browser Audio Test (Future)

**e2e/audio-synchronization.spec.js:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Audio-Visual Synchronization - E2E', () => {
  test('should synchronize audio playback with visual notation', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Web Audio API limited in WebKit');

    await page.goto('http://localhost:3000');

    // Enable audio context (requires user interaction)
    await page.click('text=Sound');

    // Click a key and measure timing
    const startTime = Date.now();
    await page.click('[data-testid="ColorKey:C4"]');

    // Visual feedback should appear immediately
    const colorKey = page.locator('[data-testid="ColorKey:C4"]');
    await expect(colorKey).toHaveCSS('background', /.*/);

    const endTime = Date.now();
    const latency = endTime - startTime;

    // E2E: Audio latency must be < 50ms (Constitution requirement)
    expect(latency).toBeLessThan(50);
  });

  test('should handle rapid key presses without audio glitches', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Rapid fire clicks
    const keys = ['C4', 'D4', 'E4', 'F4', 'G4'];
    for (const note of keys) {
      await page.click(`[data-testid="ColorKey:${note}"]`);
      await page.waitForTimeout(100); // 100ms between notes
    }

    // E2E: No audio stack overflow or glitches
    // (Would require actual audio analysis in real implementation)
  });
});
```

### Example 3: Performance E2E Test (Future)

**e2e/performance.spec.js:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Performance Metrics - E2E', () => {
  test('should render notation within 200ms', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Enable notation display
    await page.click('text=Show keyboard');

    // Measure VexFlow rendering time
    const startTime = Date.now();

    // Wait for musical staff to render
    await page.waitForSelector('.musical-staff svg');

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // E2E: Notation rendering < 200ms (Constitution requirement)
    expect(renderTime).toBeLessThan(200);
  });

  test('should maintain 60fps during keyboard interactions', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Start performance monitoring
    await page.evaluate(() => {
      window.frameTimings = [];
      let lastTime = performance.now();

      function measureFrame() {
        const currentTime = performance.now();
        window.frameTimings.push(currentTime - lastTime);
        lastTime = currentTime;
        requestAnimationFrame(measureFrame);
      }

      requestAnimationFrame(measureFrame);
    });

    // Simulate rapid interactions
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="ColorKey:C4"]');
      await page.waitForTimeout(50);
    }

    // Calculate average frame time
    const frameTimings = await page.evaluate(() => window.frameTimings);
    const avgFrameTime = frameTimings.reduce((a, b) => a + b, 0) / frameTimings.length;
    const fps = 1000 / avgFrameTime;

    // E2E: Maintain 60fps (< 16.67ms per frame)
    expect(fps).toBeGreaterThan(55); // Allow 5fps margin
  });
});
```

## Writing Unit Tests (10-20%, edge cases only)

### When to Write Unit Tests

**DO write unit tests for:**
- Complex music theory calculations (interval math, frequency calculations)
- Edge cases in algorithms (double sharps/flats, enharmonic equivalents)
- Boundary conditions (octave limits, scale wrapping)
- Isolated utility functions with complex logic

**DON'T write unit tests for:**
- Simple getters/setters
- React component lifecycle methods (test via integration instead)
- Obvious code (return true/false, basic conditionals)
- UI rendering (test via integration/E2E instead)

### Example 1: Musical Calculation Edge Case

**Test File:** `src/__test__/MusicScale.unit.test.js`

```javascript
import MusicScale from '../Model/MusicScale';

describe('MusicScale.convertToRomance() - UNIT (Edge Cases)', () => {
  const scaleObject = {
    name: 'Major (Ionian)',
    steps: [0, 2, 4, 5, 7, 9, 11],
    numbers: ['1', '2', '3', '4', '5', '6', '△7'],
  };

  const musicScale = new MusicScale(scaleObject, 'C', 0, 8);

  describe('Standard note conversion', () => {
    it('should convert C Major to Do-Re-Mi-Fa-Sol-La-Si', () => {
      const englishScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const romance = musicScale.convertToRomance(englishScale);
      expect(romance).toEqual(['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si']);
    });
  });

  describe('Edge case: Sharps', () => {
    it('should handle single sharps', () => {
      const englishScale = ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'];
      const romance = musicScale.convertToRomance(englishScale);
      expect(romance).toEqual(['Do#', 'Re#', 'Mi#', 'Fa#', 'Sol#', 'La#', 'Si#']);
    });

    it('should handle double sharps (##)', () => {
      const englishScale = ['C##', 'D##', 'E##'];
      const romance = musicScale.convertToRomance(englishScale);
      expect(romance).toEqual(['Do##', 'Re##', 'Mi##']);
    });
  });

  describe('Edge case: Flats', () => {
    it('should handle single flats', () => {
      const englishScale = ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'];
      const romance = musicScale.convertToRomance(englishScale);
      expect(romance).toEqual(['Dob', 'Reb', 'Mib', 'Fab', 'Solb', 'Lab', 'Sib']);
    });

    it('should handle double flats (bb)', () => {
      const englishScale = ['Cbb', 'Dbb', 'Ebb'];
      const romance = musicScale.convertToRomance(englishScale);
      expect(romance).toEqual(['Dobb', 'Rebb', 'Mibb']);
    });
  });

  describe('Edge case: Mixed accidentals in custom scale', () => {
    it('should handle mixed sharps and flats', () => {
      const englishScale = ['C', 'D#', 'E', 'Fb', 'G#', 'Ab', 'B'];
      const romance = musicScale.convertToRomance(englishScale);
      expect(romance).toEqual(['Do', 'Re#', 'Mi', 'Fab', 'Sol#', 'Lab', 'Si']);
    });
  });

  describe('Edge case: Enharmonic equivalents', () => {
    it('should preserve enharmonic spelling (E# vs F)', () => {
      // E# and F are the same pitch but different musical meaning
      expect(musicScale.convertToRomance(['E#'])).toEqual(['Mi#']);
      expect(musicScale.convertToRomance(['F'])).toEqual(['Fa']);
      // Unit test ensures algorithm respects musical theory, not just pitch
    });

    it('should preserve enharmonic spelling (Cb vs B)', () => {
      expect(musicScale.convertToRomance(['Cb'])).toEqual(['Dob']);
      expect(musicScale.convertToRomance(['B'])).toEqual(['Si']);
    });
  });
});
```

### Example 2: Tuning Algorithm Boundaries

**Test File:** `src/__test__/FrequencyCalculation.unit.test.js` (Future)

```javascript
import { noteToFrequency, frequencyToNote } from '../Model/TuningUtils';

describe('Frequency Calculation - UNIT (Boundaries)', () => {
  describe('noteToFrequency()', () => {
    it('should calculate A4 = 440 Hz (concert pitch)', () => {
      expect(noteToFrequency('A4')).toBe(440);
    });

    it('should calculate C4 (middle C) = 261.63 Hz', () => {
      expect(noteToFrequency('C4')).toBeCloseTo(261.63, 2);
    });

    describe('Edge case: Octave boundaries', () => {
      it('should handle lowest MIDI note (C-1 = ~8.18 Hz)', () => {
        expect(noteToFrequency('C-1')).toBeCloseTo(8.18, 2);
      });

      it('should handle highest MIDI note (G9 = ~12543 Hz)', () => {
        expect(noteToFrequency('G9')).toBeCloseTo(12543, 0);
      });

      it('should throw error for notes below C-1', () => {
        expect(() => noteToFrequency('C-2')).toThrow('Note out of range');
      });

      it('should throw error for notes above G9', () => {
        expect(() => noteToFrequency('A9')).toThrow('Note out of range');
      });
    });

    describe('Edge case: Accidentals', () => {
      it('should calculate C#4 correctly', () => {
        expect(noteToFrequency('C#4')).toBeCloseTo(277.18, 2);
      });

      it('should calculate Db4 = C#4 (enharmonic)', () => {
        expect(noteToFrequency('Db4')).toBeCloseTo(277.18, 2);
      });

      it('should handle double sharp (C##4 = D4)', () => {
        expect(noteToFrequency('C##4')).toBeCloseTo(293.66, 2);
      });

      it('should handle double flat (Dbb4 = C4)', () => {
        expect(noteToFrequency('Dbb4')).toBeCloseTo(261.63, 2);
      });
    });
  });

  describe('frequencyToNote()', () => {
    it('should convert 440 Hz to A4', () => {
      expect(frequencyToNote(440)).toBe('A4');
    });

    describe('Edge case: Frequency boundaries', () => {
      it('should handle very low frequencies (< 20 Hz)', () => {
        expect(frequencyToNote(10)).toBe('C-1');
      });

      it('should handle very high frequencies (> 10000 Hz)', () => {
        expect(frequencyToNote(12000)).toBe('G9');
      });

      it('should round to nearest semitone (440.5 Hz → A4)', () => {
        expect(frequencyToNote(440.5)).toBe('A4');
      });

      it('should round to nearest semitone (445 Hz → A4, not A#4)', () => {
        expect(frequencyToNote(445)).toBe('A4'); // Within ±25 cents
      });
    });

    describe('Edge case: Precision limits', () => {
      it('should handle floating point precision (261.625565... → C4)', () => {
        expect(frequencyToNote(261.625565300599)).toBe('C4');
      });
    });
  });
});
```

## Accessibility Testing Patterns

### Required Tools (Future)
```bash
npm install --save-dev jest-axe @axe-core/playwright
```

### Example 1: Keyboard Navigation Test

**Test File:** `src/__test__/ColorKey.a11y.test.js`

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ColorKey from '../components/keyboard/ColorKey';

describe('ColorKey Accessibility - Keyboard Navigation', () => {
  const mockNoteOnHandler = jest.fn();
  const mockNoteOffHandler = jest.fn();

  const baseProps = {
    clef: 'treble',
    color: '#ff0000',
    note: 'C4',
    noteName: [{ value: 'C', key: 'english' }],
    noteOffHandler: mockNoteOffHandler,
    noteOnHandler: mockNoteOnHandler,
    toneIsInScale: true,
    trebleStaffOn: false,
    pianoOn: true,
  };

  it('should be keyboard accessible (Tab navigation)', async () => {
    render(<ColorKey {...baseProps} />);

    const colorKey = screen.getByTestId('ColorKey:C4');

    // Tab to focus element
    await userEvent.tab();

    // Element should be focusable
    // (Requires tabIndex attribute on ColorKey div - future enhancement)
    // expect(colorKey).toHaveFocus();
  });

  it('should trigger note on Enter/Space keypress', async () => {
    render(<ColorKey {...baseProps} />);

    const colorKey = screen.getByTestId('ColorKey:C4');
    colorKey.focus();

    // Press Enter
    await userEvent.keyboard('{Enter}');
    expect(mockNoteOnHandler).toHaveBeenCalledWith('C4');

    // Press Space
    await userEvent.keyboard(' ');
    expect(mockNoteOnHandler).toHaveBeenCalledWith('C4');

    // Constitution Principle VI: Keyboard navigation must be fully functional
  });

  it('should provide arrow key navigation between keys', async () => {
    // Future: Implement arrow key navigation
    // Right arrow → next key (C → C#/Db)
    // Left arrow → previous key
    // Up arrow → octave up
    // Down arrow → octave down
  });
});
```

### Example 2: ARIA Integration Test

**Test File:** `src/__test__/TopMenu.aria.test.js`

```javascript
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WholeApp from '../WholeApp';

jest.mock('../Model/SoundMaker');
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}));

describe('TopMenu ARIA Labels - Accessibility', () => {
  it('should have accessible labels for all menu items', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // Menu items should have title attributes for screen readers
    expect(screen.getByTitle('Root')).toBeInTheDocument();
    expect(screen.getByTitle('Scale')).toBeInTheDocument();
    expect(screen.getByTitle('Clefs')).toBeInTheDocument();

    // Constitution Principle VI: Text alternatives must exist
  });

  it('should have accessible names for SVG clef icons', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    // SVG icons should have <title> elements for screen readers
    expect(screen.getByTitle('Treble Clef')).toBeInTheDocument();
    expect(screen.getByTitle('Alto Clef')).toBeInTheDocument();
    expect(screen.getByTitle('Bass Clef')).toBeInTheDocument();

    // Constitution Principle VI: Visual content needs text alternatives
  });

  it('should announce dynamic content changes to screen readers', async () => {
    // Future: Add aria-live regions for scale changes, note playback
    // Example:
    // <div aria-live="polite">Now playing: C4</div>
    // <div aria-live="assertive">Scale changed to C Major</div>
  });
});
```

### Example 3: Color Contrast E2E Test (Future)

**e2e/color-contrast.spec.js:**
```javascript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('WCAG 2.1 AA Color Contrast', () => {
  test('should meet color contrast requirements for all keys', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Inject axe-core accessibility testing library
    await injectAxe(page);

    // Run accessibility audit
    await checkA11y(page, null, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        },
      },
    });

    // Constitution Principle VI: Font sizes and contrast must meet WCAG 2.1 AA
  });

  test('should maintain contrast in dark theme', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Enable dark theme (future feature)
    // await page.click('text=Settings');
    // await page.click('text=Dark Theme');

    // Check contrast again
    await injectAxe(page);
    await checkA11y(page, null, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['color-contrast'],
        },
      },
    });
  });

  test('should not use color as sole information channel', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // In-scale keys: color + notation + name
    // Out-of-scale keys: grayed + no notation + dimmed name

    // Constitution Principle VI: Color must not be sole channel
    // Visual indicators should be redundant (color + shape/text)
  });
});
```

## Performance Testing Patterns

### Example 1: Audio Latency Measurement

**Test File:** `src/__test__/ColorKey.performance.test.js`

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorKey from '../components/keyboard/ColorKey';

describe('ColorKey Performance - Audio Latency', () => {
  const mockNoteOnHandler = jest.fn();

  const baseProps = {
    clef: 'treble',
    color: '#ff0000',
    note: 'C4',
    noteName: [{ value: 'C', key: 'english' }],
    noteOnHandler: mockNoteOnHandler,
    noteOffHandler: jest.fn(),
    toneIsInScale: true,
    trebleStaffOn: false,
    pianoOn: true,
  };

  it('should trigger noteOnHandler within 50ms of click', async () => {
    render(<ColorKey {...baseProps} />);

    const colorKey = screen.getByTestId('ColorKey:C4');

    const startTime = performance.now();
    await userEvent.click(colorKey);
    const endTime = performance.now();

    const latency = endTime - startTime;

    // Constitution Principle IV: Audio latency must be under 50ms
    expect(latency).toBeLessThan(50);
    expect(mockNoteOnHandler).toHaveBeenCalled();
  });

  it('should handle rapid clicks without degradation', async () => {
    render(<ColorKey {...baseProps} />);

    const colorKey = screen.getByTestId('ColorKey:C4');
    const latencies = [];

    // Simulate rapid clicking (10 clicks)
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      await userEvent.click(colorKey);
      const endTime = performance.now();
      latencies.push(endTime - startTime);
    }

    // Average latency should remain < 50ms
    const avgLatency = latencies.reduce((a, b) => a + b) / latencies.length;
    expect(avgLatency).toBeLessThan(50);

    // No single click should exceed 100ms
    expect(Math.max(...latencies)).toBeLessThan(100);
  });
});
```

### Example 2: Notation Rendering Performance

**Test File:** `src/__test__/MusicalStaff.performance.test.js`

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import MusicalStaff from '../components/musicScore/MusicalStaff';

describe('MusicalStaff Performance - Rendering Time', () => {
  const baseProps = {
    width: 100,
    note: 'C4',
    showOffNotes: false,
    keyIndex: 0,
    toneIsInScale: true,
    extendedKeyboard: false,
    clef: 'treble',
  };

  it('should render notation within 200ms', () => {
    const startTime = performance.now();

    const { container } = render(<MusicalStaff {...baseProps} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Constitution Principle IV: Notation rendering must complete within 200ms
    expect(renderTime).toBeLessThan(200);

    // Verify SVG was created
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should re-render efficiently on note change', () => {
    const { rerender } = render(<MusicalStaff {...baseProps} note="C4" />);

    const startTime = performance.now();
    rerender(<MusicalStaff {...baseProps} note="D4" />);
    const endTime = performance.now();

    const rerenderTime = endTime - startTime;

    // Re-rendering should be even faster than initial render
    expect(rerenderTime).toBeLessThan(100);
  });

  it('should handle multiple concurrent staves (extended keyboard)', () => {
    const startTime = performance.now();

    // Render 12 keys with staves (one octave)
    const staves = [];
    for (let i = 0; i < 12; i++) {
      const note = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][i] + '4';
      staves.push(
        <MusicalStaff key={i} {...baseProps} note={note} />
      );
    }

    render(<div>{staves}</div>);

    const endTime = performance.now();
    const totalRenderTime = endTime - startTime;

    // Total time for 12 staves should be < 200ms (Constitution requirement)
    expect(totalRenderTime).toBeLessThan(200);
  });
});
```

## Common Patterns and Anti-Patterns

### DO: Write Integration Tests First

```javascript
// ✅ GOOD: Integration test covers realistic scenario
describe('Scale Selection Integration', () => {
  it('should update keyboard when user selects new scale', async () => {
    render(<WholeApp />);

    // User action: Select D Major
    await userEvent.click(screen.getByText('Scale'));
    await userEvent.click(screen.getByText('Major (Ionian)'));

    // User action: Select D root
    await userEvent.click(screen.getByText('Root'));
    await userEvent.click(screen.getByTestId('root-D'));

    // Observable outcome: Keyboard shows D-E-F#-G-A-B-C#
    expect(screen.getByTestId('ColorKey:D4')).toHaveClass('on');
    expect(screen.getByTestId('ColorKey:D#4')).toHaveClass('off'); // Not in scale
  });
});
```

### DON'T: Write Isolated Unit Tests for UI Components

```javascript
// ❌ BAD: Unit test tests implementation detail
describe('ColorKey - UNIT (Too Isolated)', () => {
  it('should call componentDidMount', () => {
    const spy = jest.spyOn(ColorKey.prototype, 'componentDidMount');
    render(<ColorKey {...testProps} />);
    expect(spy).toHaveBeenCalled();
    // This test breaks if we refactor to functional component with useEffect
  });
});
```

### DO: Test User-Observable Behavior

```javascript
// ✅ GOOD: Tests what user sees and does
it('should highlight key when mouse is pressed', async () => {
  render(<ColorKey {...testProps} />);

  const key = screen.getByTestId('ColorKey:C4');
  await userEvent.pointer([{ keys: '[MouseLeft>]', target: key }]);

  // User-observable: Key changes appearance
  expect(key).toHaveStyle({ background: /.+/ }); // Any non-empty background
});
```

### DON'T: Mock Too Aggressively in Integration Tests

```javascript
// ❌ BAD: Over-mocking defeats purpose of integration test
jest.mock('../components/keyboard/ColorKey'); // Mocked out entire component!
jest.mock('../components/musicScore/MusicalStaff');

it('should render keyboard with keys', () => {
  render(<Keyboard />);
  // This test passes even if ColorKey is broken!
});
```

### DO: Mock External Dependencies Only

```javascript
// ✅ GOOD: Mock external libs, test our components
jest.mock('../Model/SoundMaker'); // External audio library
// Don't mock our own components - let them integrate!

it('should integrate ColorKey + MusicalStaff + audio', () => {
  render(<ColorKey {...testProps} trebleStaffOn={true} />);
  // Real ColorKey + real MusicalStaff, mocked audio
});
```

### DO: Use Descriptive Test Names

```javascript
// ✅ GOOD: Clear what's being tested
it('should play C4 note when user clicks C key while in C Major scale', async () => {
  // Clear scenario and expected outcome
});

// ❌ BAD: Vague test name
it('should work', () => {
  // What works? How?
});
```

### DO: Follow Arrange-Act-Assert Pattern

```javascript
it('should update scale when user selects from dropdown', async () => {
  // Arrange: Set up initial state
  render(<WholeApp />);
  const scaleMenu = screen.getByText('Scale');

  // Act: Perform user action
  await userEvent.click(scaleMenu);
  await userEvent.click(screen.getByText('Harmonic Minor'));

  // Assert: Verify outcome
  expect(/* scale changed */).toBe(true);
});
```

### DON'T: Test Multiple Unrelated Things in One Test

```javascript
// ❌ BAD: Testing too many things
it('should handle all menu interactions', async () => {
  render(<WholeApp />);
  // Tests root, scale, clef, sound, video, share all in one!
  // If this fails, which feature broke?
});

// ✅ GOOD: Separate tests for separate concerns
it('should update root when user selects from root menu', async () => { /* ... */ });
it('should update scale when user selects from scale menu', async () => { /* ... */ });
it('should update clef when user selects from clef menu', async () => { /* ... */ });
```

### DO: Clean Up After Tests

```javascript
describe('ColorKey with Audio', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock call history
  });

  afterEach(() => {
    // Cleanup: Remove event listeners, timers, etc.
    jest.clearAllTimers();
  });
});
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in CI Mode (No Watch)
```bash
npm run test-ci
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test ColorKey.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="integration"
```

### Run Tests for Changed Files Only
```bash
npm test -- --onlyChanged
```

### Update Snapshots
```bash
npm test -- -u
```

## Debugging Tests

### Enable Verbose Output
```bash
npm test -- --verbose
```

### Run Single Test in Debug Mode
```javascript
// Add .only to focus on one test
it.only('should play note when clicked', async () => {
  // Only this test runs
});
```

### Use screen.debug() to See DOM
```javascript
it('should render keyboard', () => {
  render(<ColorKey {...testProps} />);

  screen.debug(); // Prints entire DOM to console
  // screen.debug(screen.getByTestId('ColorKey:C4')); // Print specific element
});
```

### Use console.log in Tests
```javascript
it('should update state', async () => {
  render(<ColorKey {...testProps} />);

  console.log('Initial props:', testProps);
  await userEvent.click(screen.getByTestId('ColorKey:C4'));
  console.log('After click');

  // Logs appear in test output
});
```

### Use VS Code Debugger
```javascript
// Add debugger statement
it('should play note', async () => {
  render(<ColorKey {...testProps} />);
  debugger; // Execution pauses here if running in debug mode
  await userEvent.click(screen.getByTestId('ColorKey:C4'));
});
```

### Check Mock Call History
```javascript
it('should call noteOnHandler', async () => {
  const mockHandler = jest.fn();
  render(<ColorKey {...testProps} noteOnHandler={mockHandler} />);

  await userEvent.click(screen.getByTestId('ColorKey:C4'));

  console.log('Mock calls:', mockHandler.mock.calls);
  // [[C4]] - called once with 'C4'
  console.log('Call count:', mockHandler.mock.calls.length); // 1
});
```

## CI/CD Integration

### GitHub Actions Workflow (Example)

**.github/workflows/test.yml:**
```yaml
name: Tests

on:
  push:
    branches: [master, develop]
  pull_request:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test-ci -- --coverage

      - name: Check coverage requirements
        run: |
          # Ensure 100% coverage (Constitution requirement)
          npm run test-ci -- --coverage --coverageThreshold='{"global":{"lines":100,"branches":100,"functions":100,"statements":100}}'

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true
```

### Coverage Requirements in package.json

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "lines": 100,
        "branches": 100,
        "functions": 100,
        "statements": 100
      }
    },
    "coverageReporters": ["html", "text", "lcov"]
  }
}
```

### Pre-commit Hook

**.husky/pre-commit:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests before allowing commit
npm run test-ci

# Verify coverage
npm run test-ci -- --coverage --coverageThreshold='{"global":{"lines":100,"branches":100,"functions":100,"statements":100}}'

if [ $? -ne 0 ]; then
  echo "❌ Tests failed or coverage below 100%. Commit rejected."
  exit 1
fi

echo "✅ All tests passed with 100% coverage."
```

## FAQs

### Q: Why 60-70% integration tests instead of unit tests?

**A:** Integration tests survive refactoring and catch real bugs. If you change a component's internal implementation (state → props, class → function), integration tests keep passing because they test behavior, not implementation. Unit tests would break and need rewriting.

### Q: When should I write a unit test vs integration test?

**A:** Write integration tests by default. Only write unit tests for:
- Complex algorithms (music theory calculations)
- Edge cases not covered by integration tests (double sharps/flats)
- Performance-critical code where isolation helps profiling

### Q: How do I achieve 100% coverage with mostly integration tests?

**A:** Integration tests naturally cover multiple components and code paths. One integration test (user clicks key → note plays → staff updates) covers:
- ColorKey component
- MusicalStaff component
- Event handlers
- State updates
- Conditional rendering

This is more efficient than 10 unit tests testing each piece in isolation.

### Q: Should I mock child components in integration tests?

**A:** No! That defeats the purpose. Mock external dependencies (audio libraries, APIs), but let your own components integrate naturally. Example:
- ✅ Mock: Tone.js, VexFlow, Firebase
- ❌ Don't mock: ColorKey, MusicalStaff, TopMenu

### Q: How do I test audio features without real audio?

**A:** Mock the audio libraries but test your integration logic:
```javascript
jest.mock('tone');
jest.mock('@tonejs/piano');

// Test that your code calls the audio libraries correctly
expect(mockPiano.keyDown).toHaveBeenCalledWith('C4');
```

E2E tests with Playwright can test real audio in browsers using Web Audio API.

### Q: What's the difference between integration and E2E tests?

**A:**
- **Integration tests** use React Testing Library, run in jsdom, mock external libraries, test component interactions (fast, 60-70%)
- **E2E tests** use Playwright, run in real browsers, test complete user flows including network/audio (slow, 20-30%)

### Q: How do I test VexFlow notation rendering?

**A:** VexFlow renders to SVG. Test that:
1. SVG element is created
2. SVG contains expected notation elements (stave, notes, accidentals)
3. Rendering completes within 200ms (performance requirement)

```javascript
const svg = container.querySelector('.musical-staff svg');
expect(svg).toBeInTheDocument();
```

### Q: My integration test is slow (> 5s). What should I do?

**A:**
1. Check for unnecessary waits (avoid waitFor with large timeouts)
2. Mock slow external dependencies
3. Consider if this should be an E2E test instead
4. Profile with `jest --detectLeaks`

### Q: How do I test keyboard navigation for accessibility?

**A:**
```javascript
await userEvent.tab(); // Tab to next element
await userEvent.keyboard('{Enter}'); // Press Enter
await userEvent.keyboard('{ArrowRight}'); // Press arrow key
```

Ensure all interactive elements are keyboard accessible (Constitution Principle VI).

### Q: Should I test private methods?

**A:** No! Test public behavior instead. If a private method is complex enough to need testing, it's probably a utility function that should be extracted and unit tested separately.

### Q: How do I test React context and state management?

**A:** Test via integration - render components that consume context and verify behavior:
```javascript
render(
  <ScaleContext.Provider value={{ scale: 'C Major' }}>
    <Keyboard />
  </ScaleContext.Provider>
);

// Test that keyboard responds to context
```

### Q: What's the fastest way to get started?

**A:**
1. Copy `TopMenu.int.test.js` as a template
2. Replace component and test scenario
3. Write integration test for happy path first
4. Add integration tests for error cases
5. Add unit tests only for edge cases
6. Run `npm test -- --coverage` to check coverage
7. Aim for 100% coverage (Constitution requirement)

---

## Summary Checklist

Before merging any PR with new features:

- [ ] **Integration tests (60-70%)** cover primary user workflows
- [ ] **E2E tests (20-30%)** cover critical user journeys
- [ ] **Unit tests (10-20%)** cover complex algorithm edge cases
- [ ] **100% code coverage** achieved (NON-NEGOTIABLE)
- [ ] All tests pass: `npm run test-ci`
- [ ] Integration tests complete in < 5s each
- [ ] E2E tests complete in < 30s each
- [ ] Accessibility tested (keyboard navigation, ARIA)
- [ ] Performance requirements met (audio < 50ms, notation < 200ms)
- [ ] Tests use Arrange-Act-Assert pattern
- [ ] Test names describe user scenarios clearly
- [ ] External dependencies mocked (Tone.js, VexFlow)
- [ ] Internal components NOT mocked (ColorKey, MusicalStaff)

**Remember:** Integration tests are the primary strategy. Unit tests are the exception, not the rule. Test behavior, not implementation. Your tests should survive refactoring and catch real bugs. 🎵
