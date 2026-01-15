# Quickstart: Writing Constitution-Compliant Tests

**Feature**: Constitution Compliance Implementation (001)
**Date**: 2025-11-13
**For**: Notio Developers

This guide helps developers write tests that comply with Notio's Constitution v2.0.0, following Rainer Hahnekamp's integration-first testing principles.

---

## Table of Contents

1. [Testing Philosophy Overview](#testing-philosophy-overview)
2. [Test Distribution Requirements](#test-distribution-requirements)
3. [Quick Start Examples](#quick-start-examples)
4. [Integration Tests (60-70%)](#integration-tests-60-70)
5. [E2E Tests (20-30%)](#e2e-tests-20-30)
6. [Unit Tests (10-20%)](#unit-tests-10-20)
7. [Accessibility Testing](#accessibility-testing)
8. [Performance Validation](#performance-validation)
9. [Running Tests](#running-tests)
10. [Coverage Validation](#coverage-validation)
11. [Common Patterns](#common-patterns)
12. [Troubleshooting](#troubleshooting)

---

## Testing Philosophy Overview

### Core Principles (Constitution v2.0.0)

**100% Code Coverage is MANDATORY**
- All code paths must be exercised by tests
- Line coverage >= 100%
- Branch coverage >= 100%

**Integration-First Approach** (Rainer Hahnekamp's Principles):
- Integration tests are PRIMARY (60-70% of suite)
- E2E tests are SECONDARY (20-30% of suite)
- Unit tests are MINIMAL (10-20% of suite, edge cases only)

**Why This Approach?**
- Integration tests catch real bugs at component boundaries
- Integration tests survive refactoring better than unit tests
- Integration tests reflect actual user behavior
- Unit tests create brittle test suites that break with refactoring

**Performance Requirements**:
- Integration tests: < 5 seconds per test
- E2E tests: < 30 seconds per test

---

## Test Distribution Requirements

Your test suite MUST meet these distribution targets:

| Test Type | Target % | Purpose | Example |
|-----------|----------|---------|---------|
| **Integration** | 60-70% | Component interactions, workflows | Musical notation + audio playback + UI controls |
| **E2E** | 20-30% | Complete user journeys, cross-browser | Student completes exercise end-to-end |
| **Unit** | 10-20% | Edge cases, complex algorithms | Interval calculations with enharmonic equivalents |

**Validation**: Run `npm run test:coverage` to check your distribution.

---

## Quick Start Examples

### 1. Integration Test (Most Common)

```javascript
// src/__integration__/musical-components/notation-audio-sync.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import MusicalStaff from '../../components/musicScore/MusicalStaff';
import TopMenu from '../../components/menu/TopMenu';

describe('Notation and Audio Synchronization Integration', () => {
  it('should play audio and update notation when key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <>
        <TopMenu />
        <MusicalStaff />
      </>
    );

    // Trigger note
    const cKeyButton = screen.getByRole('button', { name: /C4/ });
    await user.click(cKeyButton);

    // Verify audio context started
    await waitFor(() => {
      expect(window.Tone.context.state).toBe('running');
    });

    // Verify notation updated
    const notationSVG = screen.getByTestId('musical-staff-svg');
    expect(notationSVG).toBeInTheDocument();
    expect(notationSVG).toHaveTextContent('C');
  });

  it('should be accessible', async () => {
    const { container } = render(<MusicalStaff />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 2. E2E Test (Full User Journey)

```javascript
// e2e/student-workflow.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Student Exercise Workflow', () => {
  test('student can complete full exercise', async ({ page }) => {
    await page.goto('/');

    // Select exercise
    await page.click('text=Start Exercise');

    // Interact with notation
    await page.click('[data-note="C4"]');
    await page.waitForTimeout(100); // Allow audio to play

    // Verify feedback
    await expect(page.locator('.feedback')).toContainText('Correct');

    // Complete exercise
    await page.click('text=Submit');

    // Verify results
    await expect(page.locator('.results')).toContainText('Score');

    // Check accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### 3. Unit Test (Edge Cases Only)

```javascript
// src/__test__/utils/interval-calculator.test.js
import { calculateInterval } from '../../utils/intervalCalculator';

describe('Interval Calculator - Edge Cases', () => {
  it('should handle enharmonic equivalents correctly', () => {
    expect(calculateInterval('C#4', 'Db4')).toBe('unison-enharmonic');
    expect(calculateInterval('B#3', 'C4')).toBe('unison-enharmonic');
  });

  it('should handle compound intervals', () => {
    expect(calculateInterval('C4', 'D5')).toBe('major-9th');
    expect(calculateInterval('C4', 'C6')).toBe('double-octave');
  });

  it('should handle boundary frequencies', () => {
    expect(calculateInterval('A0', 'C8')).toBe('valid'); // Extreme range
    expect(() => calculateInterval('A-1', 'C4')).toThrow('Out of range');
  });
});
```

---

## Integration Tests (60-70%)

### What to Test

Integration tests verify that **multiple components work together correctly**:

- Component A + Component B interactions
- User input → State management → Rendering
- Musical notation + Audio playback + User controls
- Error handling across multiple layers
- Data flow through the application

### Directory Structure

```
src/
├── __integration__/
│   ├── musical-components/
│   │   ├── notation-audio-sync.test.js
│   │   ├── keyboard-interaction.test.js
│   │   └── scale-visualization.test.js
│   ├── user-workflows/
│   │   ├── create-exercise.test.js
│   │   └── save-progress.test.js
│   └── error-handling/
│       ├── invalid-input.test.js
│       └── network-errors.test.js
```

### Best Practices

#### ✅ DO:
- Test realistic user workflows
- Test happy path AND error scenarios
- Include accessibility checks (`jest-axe`)
- Mock external dependencies (Firebase, audio synthesis)
- Keep tests under 5 seconds each
- Use descriptive test names

#### ❌ DON'T:
- Test implementation details
- Test isolated component rendering (that's for E2E or unit tests)
- Over-mock (mock only external boundaries)
- Write integration tests that could be unit tests
- Test every edge case in integration tests (use unit tests)

### Example: Musical Component Integration

```javascript
// src/__integration__/musical-components/keyboard-playback.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import WholeApp from '../../WholeApp';

describe('Keyboard Playback Integration', () => {
  beforeEach(() => {
    // Mock Tone.js
    jest.mock('tone', () => ({
      context: {
        state: 'running',
        currentTime: 0,
        baseLatency: 0.001,
      },
      Synth: jest.fn().mockImplementation(() => ({
        toDestination: jest.fn().mockReturnThis(),
        triggerAttackRelease: jest.fn(),
      })),
    }));
  });

  it('should integrate keyboard, audio, and notation', async () => {
    render(<WholeApp />);

    // User interaction
    const cKey = screen.getByRole('button', { name: /C4 note/ });
    fireEvent.click(cKey);

    // Verify audio triggered
    expect(Tone.Synth().triggerAttackRelease).toHaveBeenCalledWith('C4', '8n');

    // Verify notation updated
    const staff = screen.getByTestId('musical-staff');
    expect(staff).toContainElement(screen.getByText('C'));

    // Verify visual feedback
    expect(cKey).toHaveClass('active');
  });

  it('should maintain accessibility during interaction', async () => {
    const { container } = render(<WholeApp />);

    // Initial accessibility check
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    // Interact
    const cKey = screen.getByRole('button', { name: /C4 note/ });
    fireEvent.click(cKey);

    // Post-interaction accessibility check
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## E2E Tests (20-30%)

### What to Test

E2E tests verify **complete user journeys** in a real browser:

- Critical user workflows (student completes exercise)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Performance validation (audio latency, rendering speed)
- Full application flow (login → exercise → submit → results)
- Data persistence across sessions

### Directory Structure

```
e2e/
├── student-workflows.spec.js
├── teacher-workflows.spec.js
├── audio-sync.spec.js
├── notation-display.spec.js
├── keyboard-interaction.spec.js
└── accessibility.spec.js
```

### Best Practices

#### ✅ DO:
- Test complete user journeys
- Test on all three browsers (chromium, firefox, webkit)
- Measure performance metrics
- Include accessibility scans
- Keep tests under 30 seconds each
- Use Page Object pattern for reusability

#### ❌ DON'T:
- Test every interaction (use integration tests for that)
- Write E2E tests for things that can be integration tests
- Skip cross-browser testing
- Ignore flaky tests (fix them or mark them as known issues)

### Example: Audio Latency E2E Test

```javascript
// e2e/audio-sync.spec.js
import { test, expect } from '@playwright/test';

test.describe('Audio-Visual Synchronization', () => {
  test('audio latency should be under 50ms', async ({ page }) => {
    await page.goto('/');

    // Wait for Tone.js initialization
    await page.waitForFunction(() => window.Tone && window.Tone.context.state === 'running');

    // Measure latency
    const latency = await page.evaluate(() => {
      return {
        baseLatency: Tone.context.baseLatency * 1000,
        outputLatency: Tone.context.outputLatency * 1000,
      };
    });

    expect(latency.baseLatency).toBeLessThan(50);
    expect(latency.outputLatency).toBeLessThan(50);
  });

  test('note triggers audio and notation within 30ms', async ({ page }) => {
    await page.goto('/');

    const timing = await page.evaluate(async () => {
      const startTime = performance.now();

      // Trigger note
      document.querySelector('[data-note="C4"]').click();

      // Wait for audio
      await new Promise(resolve => {
        const check = () => {
          if (Tone.context.state === 'running') resolve();
          else requestAnimationFrame(check);
        };
        check();
      });

      const audioStarted = performance.now();

      // Check notation update
      const notationUpdated = document.querySelector('.musical-staff svg')
        ? performance.now()
        : null;

      return {
        audioLatency: audioStarted - startTime,
        notationLatency: notationUpdated - startTime,
      };
    });

    expect(timing.audioLatency).toBeLessThan(30);
    expect(timing.notationLatency).toBeLessThan(30);
  });
});
```

---

## Unit Tests (10-20%)

### What to Test

Unit tests verify **edge cases and complex algorithms** in isolation:

- Complex musical calculations (interval calculations, frequency conversions)
- Error handling in utility functions
- Boundary conditions
- Enharmonic equivalents, compound intervals
- Note name parsing edge cases

### Directory Structure

```
src/
├── __test__/
│   ├── utils/
│   │   ├── interval-calculator.test.js
│   │   ├── frequency-converter.test.js
│   │   └── note-parser.test.js
│   └── edge-cases/
│       ├── rhythm-calculator.test.js
│       └── scale-validator.test.js
```

### Best Practices

#### ✅ DO:
- Test edge cases NOT covered by integration tests
- Test complex algorithms with many branches
- Test boundary conditions
- Use descriptive test names
- Keep tests fast (< 1 second)

#### ❌ DON'T:
- Unit test simple getters/setters
- Unit test obvious code
- Unit test React component rendering (use integration tests)
- Write unit tests for things that should be integration tests
- Test implementation details

### Example: Musical Interval Edge Cases

```javascript
// src/__test__/utils/interval-calculator.test.js
import {
  calculateInterval,
  getIntervalQuality,
  isValidInterval,
} from '../../utils/intervalCalculator';

describe('Interval Calculator - Edge Cases', () => {
  describe('enharmonic equivalents', () => {
    it('should recognize enharmonic unisons', () => {
      expect(calculateInterval('C#4', 'Db4')).toEqual({
        name: 'unison',
        quality: 'enharmonic',
        semitones: 0,
      });
    });

    it('should recognize enharmonic octaves', () => {
      expect(calculateInterval('B#3', 'C4')).toEqual({
        name: 'unison',
        quality: 'enharmonic',
        semitones: 0,
      });
    });
  });

  describe('compound intervals', () => {
    it('should calculate intervals beyond an octave', () => {
      expect(calculateInterval('C4', 'D5')).toEqual({
        name: 'major-9th',
        quality: 'major',
        semitones: 14,
      });

      expect(calculateInterval('C4', 'C6')).toEqual({
        name: 'double-octave',
        quality: 'perfect',
        semitones: 24,
      });
    });

    it('should handle triple octaves', () => {
      expect(calculateInterval('C4', 'C7')).toEqual({
        name: 'triple-octave',
        quality: 'perfect',
        semitones: 36,
      });
    });
  });

  describe('boundary conditions', () => {
    it('should handle lowest and highest notes', () => {
      expect(calculateInterval('A0', 'C8')).toEqual({
        name: 'compound-interval',
        semitones: 99,
      });
    });

    it('should throw on out-of-range frequencies', () => {
      expect(() => calculateInterval('A-1', 'C4')).toThrow('Out of piano range');
      expect(() => calculateInterval('C4', 'D9')).toThrow('Out of piano range');
    });
  });

  describe('diminished and augmented intervals', () => {
    it('should handle diminished intervals', () => {
      expect(calculateInterval('C4', 'Gb4')).toEqual({
        name: 'diminished-5th',
        quality: 'diminished',
        semitones: 6,
      });
    });

    it('should handle augmented intervals', () => {
      expect(calculateInterval('C4', 'G#4')).toEqual({
        name: 'augmented-5th',
        quality: 'augmented',
        semitones: 8,
      });
    });
  });
});
```

---

## Accessibility Testing

### Jest Integration Tests (jest-axe)

```javascript
// src/__integration__/accessibility/keyboard-navigation.test.js
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ColorKey from '../../components/keyboard/ColorKey';

describe('ColorKey Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ColorKey
        note="C4"
        color="#FF5733"
        toneIsInScale={true}
        noteName={[{ value: 'C', key: 'C' }]}
        noteOnHandler={jest.fn()}
        noteOffHandler={jest.fn()}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard navigable', async () => {
    const noteOnHandler = jest.fn();
    const { container } = render(
      <ColorKey
        note="C4"
        noteName={[{ value: 'C', key: 'C' }]}
        noteOnHandler={noteOnHandler}
      />
    );

    const user = userEvent.setup();

    // Tab to focus
    await user.tab();

    // Press Enter to activate
    await user.keyboard('{Enter}');
    expect(noteOnHandler).toHaveBeenCalled();

    // Check accessibility after interaction
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels', async () => {
    const { container, getByRole } = render(
      <ColorKey
        note="C4"
        toneIsInScale={true}
        noteName={[{ value: 'C', key: 'C' }]}
        noteOnHandler={jest.fn()}
      />
    );

    const button = getByRole('button', { name: /C4 note/ });
    expect(button).toHaveAttribute('aria-label');
    expect(button.getAttribute('aria-label')).toContain('C4');

    const results = await axe(container, {
      rules: {
        'aria-allowed-attr': { enabled: true },
        'aria-required-attr': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('should meet color contrast requirements', async () => {
    const { container } = render(
      <ColorKey
        note="C4"
        color="#FF5733"
        noteName={[{ value: 'C', key: 'C' }]}
        noteOnHandler={jest.fn()}
      />
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
```

### E2E Accessibility Tests (@axe-core/playwright)

```javascript
// e2e/accessibility.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Application Accessibility', () => {
  test('home page should be WCAG 2.1 AA compliant', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation should work throughout app', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    // Activate with Enter
    await page.keyboard.press('Enter');

    // Check accessibility after interaction
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('color should not be sole information channel', async ({ page }) => {
    await page.goto('/');

    // Verify ColorKey components have text labels
    const keys = page.locator('.color-key');
    const firstKey = keys.first();

    await expect(firstKey.locator('.noteName')).toBeVisible();

    // Run accessibility scan
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
```

---

## Performance Validation

### Measuring Audio Latency (E2E)

```javascript
// e2e/performance.spec.js
import { test, expect } from '@playwright/test';

test('audio latency should be under 50ms', async ({ page }) => {
  await page.goto('/');

  await page.waitForFunction(() => window.Tone && window.Tone.context.state === 'running');

  const latency = await page.evaluate(() => {
    return {
      baseLatency: Tone.context.baseLatency * 1000,
      outputLatency: Tone.context.outputLatency * 1000,
    };
  });

  expect(latency.baseLatency).toBeLessThan(50);
  expect(latency.outputLatency).toBeLessThan(50);
});
```

### Measuring Rendering Performance (E2E)

```javascript
test('notation rendering should complete in under 200ms', async ({ page }) => {
  await page.goto('/');

  const renderTime = await page.evaluate(() => {
    const start = performance.now();

    // Trigger notation rendering
    const event = new CustomEvent('renderNotation', {
      detail: { notes: ['C4', 'E4', 'G4'] },
    });
    document.dispatchEvent(event);

    // Wait for render
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const end = performance.now();
        resolve(end - start);
      });
    });
  });

  expect(renderTime).toBeLessThan(200);
});
```

---

## Running Tests

### Development

```bash
# Run all tests in watch mode
npm test

# Run only integration tests
npm test -- __integration__

# Run only unit tests
npm test -- __test__

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run E2E tests in debug mode
npm run test:e2e:debug
```

### CI/CD

```bash
# Run all Jest tests with coverage
npm run test:ci

# Run E2E tests in all browsers
npm run test:e2e

# Run E2E tests in specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

---

## Coverage Validation

### Check Coverage Report

```bash
npm run test -- --coverage --watchAll=false
```

Open `coverage/lcov-report/index.html` in your browser to see detailed coverage report.

### Validate Distribution

Create a script to validate test distribution:

```javascript
// scripts/validate-test-distribution.js
const fs = require('fs');
const glob = require('glob');

const integrationTests = glob.sync('src/__integration__/**/*.test.js').length;
const e2eTests = glob.sync('e2e/**/*.spec.js').length;
const unitTests = glob.sync('src/__test__/**/*.test.js').length;

const total = integrationTests + e2eTests + unitTests;

const distribution = {
  integration: (integrationTests / total) * 100,
  e2e: (e2eTests / total) * 100,
  unit: (unitTests / total) * 100,
};

console.log('Test Distribution:');
console.log(`Integration: ${distribution.integration.toFixed(1)}% (target: 60-70%)`);
console.log(`E2E: ${distribution.e2e.toFixed(1)}% (target: 20-30%)`);
console.log(`Unit: ${distribution.unit.toFixed(1)}% (target: 10-20%)`);

// Validate
const isValid =
  distribution.integration >= 60 && distribution.integration <= 70 &&
  distribution.e2e >= 20 && distribution.e2e <= 30 &&
  distribution.unit >= 10 && distribution.unit <= 20;

if (!isValid) {
  console.error('❌ Test distribution does not meet constitutional requirements!');
  process.exit(1);
}

console.log('✅ Test distribution is compliant!');
```

Run with:
```bash
node scripts/validate-test-distribution.js
```

---

## Common Patterns

### Pattern 1: Testing Musical Component Interactions

```javascript
// src/__integration__/musical-components/scale-visualization.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TopMenu from '../../components/menu/TopMenu';
import MusicalStaff from '../../components/musicScore/MusicalStaff';
import ColorKey from '../../components/keyboard/ColorKey';

describe('Scale Visualization Integration', () => {
  it('should update notation and highlight keys when scale changes', () => {
    render(
      <>
        <TopMenu />
        <MusicalStaff />
        <ColorKey note="C4" />
        <ColorKey note="D4" />
        <ColorKey note="E4" />
      </>
    );

    // Change scale
    const scaleSelector = screen.getByLabelText('Select Scale');
    fireEvent.change(scaleSelector, { target: { value: 'C-major' } });

    // Verify keys highlighted
    expect(screen.getByTestId('key-C4')).toHaveClass('in-scale');
    expect(screen.getByTestId('key-D4')).toHaveClass('in-scale');
    expect(screen.getByTestId('key-E4')).toHaveClass('in-scale');

    // Verify notation updated
    const staff = screen.getByTestId('musical-staff');
    expect(staff).toContainElement(screen.getByText('C Major'));
  });
});
```

### Pattern 2: Mocking External Dependencies

```javascript
// src/__integration__/user-workflows/save-progress.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import WholeApp from '../../WholeApp';

// Mock Firebase
jest.mock('firebase/app');
jest.mock('firebase/database');

describe('Save Progress Integration', () => {
  beforeEach(() => {
    // Mock Firebase functions
    getDatabase.mockReturnValue({});
    ref.mockReturnValue({});
    set.mockResolvedValue(undefined);
  });

  it('should save user progress to Firebase', async () => {
    render(<WholeApp />);

    // Complete exercise
    const cKey = screen.getByRole('button', { name: /C4/ });
    fireEvent.click(cKey);

    // Click save
    const saveButton = screen.getByRole('button', { name: /Save/ });
    fireEvent.click(saveButton);

    // Verify Firebase called
    await waitFor(() => {
      expect(set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          progress: expect.any(Object),
        })
      );
    });

    // Verify user feedback
    expect(screen.getByText(/Progress saved/)).toBeInTheDocument();
  });
});
```

### Pattern 3: Testing Error Scenarios

```javascript
// src/__integration__/error-handling/invalid-input.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomScaleSelector from '../../components/menu/CustomScaleSelector';

describe('Invalid Input Handling', () => {
  it('should show error message for invalid scale input', () => {
    render(<CustomScaleSelector />);

    const input = screen.getByLabelText('Custom Scale');
    fireEvent.change(input, { target: { value: 'Invalid Scale' } });
    fireEvent.blur(input);

    expect(screen.getByText(/Invalid scale format/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveAccessibleDescription(/Please enter a valid scale/);
  });

  it('should gracefully handle network errors', async () => {
    // Mock network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<CustomScaleSelector />);

    const saveButton = screen.getByRole('button', { name: /Save/ });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Unable to save/)).toBeInTheDocument();
    });

    // Verify error is accessible
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Unable to save/);
  });
});
```

---

## Troubleshooting

### Issue: Coverage Not Reaching 100%

**Solution**:
1. Run coverage report: `npm test -- --coverage --watchAll=false`
2. Open `coverage/lcov-report/index.html`
3. Identify uncovered lines
4. Add integration tests to cover those code paths
5. If edge cases, add unit tests

### Issue: Integration Tests Taking Too Long (> 5s)

**Solution**:
1. Reduce rendered component tree
2. Mock expensive operations (audio synthesis, Firebase calls)
3. Use `waitFor` with shorter timeouts
4. Split into multiple smaller tests

### Issue: E2E Tests Failing Intermittently

**Solution**:
1. Add explicit waits: `await page.waitForSelector()`
2. Use `page.waitForLoadState('networkidle')`
3. Increase timeout: `test.setTimeout(60000)`
4. Check if audio context needs time to initialize

### Issue: Accessibility Violations

**Solution**:
1. Check console for axe-core warnings
2. Add missing ARIA labels
3. Ensure keyboard navigation works
4. Validate color contrast meets WCAG 2.1 AA (4.5:1 for text)
5. Ensure color is not sole information channel

### Issue: Test Distribution Not Meeting Requirements

**Solution**:
1. Run `node scripts/validate-test-distribution.js`
2. If too many unit tests: Convert to integration tests
3. If too few integration tests: Add component interaction tests
4. If too few E2E tests: Add critical user journey tests

---

## Resources

- [Constitution v2.0.0](/.specify/memory/constitution.md)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Rainer Hahnekamp's Testing Principles](https://rainerhahnekamp.com/en/modern-testing-patterns/)

---

## Getting Help

- Ask in the `#testing` Slack channel
- Review existing integration tests in `src/__integration__/`
- Review existing E2E tests in `e2e/`
- Pair program with team members familiar with the testing approach
- Reference this quickstart guide and the constitution

**Remember**: Integration tests are PRIMARY. Focus on realistic workflows, not isolated units!
