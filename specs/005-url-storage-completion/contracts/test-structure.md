# Contract: Test Structure and Coverage Requirements

**Feature**: 005-url-storage-completion
**Version**: 1.0.0
**Date**: 2025-12-03

## Purpose

Defines the test organization, coverage distribution, and testing contracts to achieve constitutional 100% coverage requirement with 60-70% integration, 20-30% E2E, and 10-20% unit tests.

## Coverage Requirements

### Constitutional Mandate

- **100% total code coverage** (lines and branches)
- **60-70% Integration tests** - Primary testing strategy
- **20-30% E2E tests** - Critical user workflows
- **10-20% Unit tests** - Edge cases and complex logic only

### Test Performance Requirements

- Integration tests: **< 5 seconds per test**
- E2E tests: **< 30 seconds per test**
- Total suite: **< 5 minutes for all tests**

---

## Test Organization

### Directory Structure

```
src/__tests__/
├── integration/
│   ├── url-encoder-positions.test.js        # URL encoding/decoding
│   ├── state-sync.test.js                   # State synchronization
│   ├── overlay-positioning.test.js          # Overlay component
│   ├── sharelink-positions.test.js          # ShareLink generation
│   ├── browser-history.test.js              # History API integration
│   └── context-integration.test.js          # Context provider/consumer
├── unit/
│   ├── position-validation.test.js          # Clamping edge cases
│   ├── handler-factory.test.js              # Factory function logic
│   └── context-hooks.test.js                # Hook edge cases
└── __mocks__/
    └── ModalPositionContext.mock.js         # Mock context for tests

e2e/
├── modal-positioning.spec.js                # Complete positioning workflow
├── cross-browser-modals.spec.js             # Browser compatibility
└── accessibility-modals.spec.js             # Accessibility audits

tests/helpers/
├── modal-test-utils.js                      # Shared test utilities
└── context-test-utils.js                    # Context testing helpers
```

---

## Integration Tests (60-70%)

### 1. URL Encoder Integration Tests

**File**: `src/__tests__/integration/url-encoder-positions.test.js`

**Coverage Target**: All modal position encoding/decoding logic

**Test Cases**:
```javascript
describe('URL Encoder - Modal Positions', () => {
  test('encodes nested modalPositions to flat URL parameters', () => {
    const state = {
      modalPositions: {
        video: { x: 100, y: 150 },
        help: { x: 200, y: 250 },
        share: { x: null, y: null }
      }
    };

    const url = encodeSettingsToURL(state);

    expect(url).toContain('videoModalX=100');
    expect(url).toContain('videoModalY=150');
    expect(url).toContain('helpModalX=200');
    expect(url).toContain('helpModalY=250');
    expect(url).not.toContain('shareModalX');
  });

  test('decodes flat URL parameters to nested modalPositions', () => {
    const url = new URL('http://localhost?videoModalX=100&videoModalY=150');
    const settings = decodeSettingsFromURL(url);

    expect(settings.modalPositions.video).toEqual({ x: 100, y: 150 });
    expect(settings.modalPositions.help).toEqual({ x: null, y: null });
    expect(settings.modalPositions.share).toEqual({ x: null, y: null });
  });

  test('round-trip encoding preserves positions', () => {
    const originalState = {
      modalPositions: {
        video: { x: 123, y: 456 },
        help: { x: 789, y: 101 },
        share: { x: 112, y: 314 }
      }
    };

    const url = encodeSettingsToURL(originalState);
    const decoded = decodeSettingsFromURL(new URL(url));

    expect(decoded.modalPositions).toEqual(originalState.modalPositions);
  });

  test('clamps out-of-range positions during encoding', () => {
    const state = {
      modalPositions: {
        video: { x: -100, y: 15000 }
      }
    };

    const url = encodeSettingsToURL(state);

    expect(url).toContain('videoModalX=0');   // Clamped to min
    expect(url).toContain('videoModalY=10000'); // Clamped to max
  });
});
```

**Performance Target**: < 1 second for all encoding/decoding tests

---

### 2. State Synchronization Tests

**File**: `src/__tests__/integration/state-sync.test.js`

**Coverage Target**: Drag → Context → State → URL flow

**Test Cases**:
```javascript
describe('State Synchronization', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window.history, 'replaceState');
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('dragging modal updates context and triggers URL update', async () => {
    const { container } = renderWithModalContext(<WholeApp />);

    // Open video modal
    fireEvent.click(screen.getByLabelText('Video Player'));

    // Simulate drag
    const dragHandle = container.querySelector('.drag');
    fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(dragHandle, { clientX: 100, clientY: 150 });
    fireEvent.mouseUp(dragHandle);

    // Fast-forward debounce timer (500ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Verify URL updated
    expect(window.history.replaceState).toHaveBeenCalledWith(
      expect.any(Object),
      '',
      expect.stringContaining('videoModalX=100')
    );
  });

  test('loading URL with positions populates state correctly', () => {
    // Set URL before mounting
    window.history.pushState({}, '', '?videoModalX=200&videoModalY=300');

    const { container } = render(<WholeApp />);

    // Open video modal
    fireEvent.click(screen.getByLabelText('Video Player'));

    // Verify modal positioned correctly (via CSS transform or bounding box)
    const overlay = container.querySelector('.overlay');
    expect(overlay).toHaveStyle({ transform: expect.stringContaining('200') });
  });
});
```

**Performance Target**: < 3 seconds per test (includes render and timers)

---

### 3. Overlay Component Integration Tests

**File**: `src/__tests__/integration/overlay-positioning.test.js`

**Coverage Target**: Overlay consuming context and handling drag events

**Test Cases**:
```javascript
describe('Overlay Component - Positioning', () => {
  test('renders at position from context', () => {
    const { container } = renderWithModalContext(
      <Overlay modalName="video" />,
      { positions: { video: { x: 150, y: 200 } } }
    );

    const overlay = container.querySelector('.overlay');
    expect(overlay).toHaveStyle({ transform: 'translate(150px, 200px)' });
  });

  test('calls context.updatePosition on drag stop', () => {
    const mockUpdate = jest.fn();
    const { container } = renderWithModalContext(
      <Overlay modalName="video" />,
      { updatePosition: mockUpdate }
    );

    const dragHandle = container.querySelector('.drag');
    fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(dragHandle, { clientX: 100, clientY: 150 });
    fireEvent.mouseUp(dragHandle);

    expect(mockUpdate).toHaveBeenCalledWith('video', { x: 100, y: 150 });
  });

  test('updates position when context value changes', () => {
    const { container, rerender } = renderWithModalContext(
      <Overlay modalName="video" />,
      { positions: { video: { x: 0, y: 0 } } }
    );

    // Verify initial position
    expect(container.querySelector('.overlay')).toHaveStyle({
      transform: 'translate(0px, 0px)'
    });

    // Update context
    rerender(
      <ModalPositionContext.Provider value={{
        positions: { video: { x: 300, y: 400 } },
        updatePosition: jest.fn()
      }}>
        <Overlay modalName="video" />
      </ModalPositionContext.Provider>
    );

    // Verify position updated
    expect(container.querySelector('.overlay')).toHaveStyle({
      transform: 'translate(300px, 400px)'
    });
  });
});
```

**Performance Target**: < 2 seconds per test

---

### 4. Context Integration Tests

**File**: `src/__tests__/integration/context-integration.test.js`

**Coverage Target**: Context provider and consumer interaction

**Test Cases**:
```javascript
describe('ModalPositionContext Integration', () => {
  test('provider shares state with multiple consumers', () => {
    const TestConsumer1 = () => {
      const { positions } = useContext(ModalPositionContext);
      return <div data-testid="consumer1">{positions.video.x}</div>;
    };

    const TestConsumer2 = () => {
      const { positions } = useContext(ModalPositionContext);
      return <div data-testid="consumer2">{positions.video.x}</div>;
    };

    renderWithModalContext(
      <>
        <TestConsumer1 />
        <TestConsumer2 />
      </>,
      { positions: { video: { x: 555, y: 0 } } }
    );

    expect(screen.getByTestId('consumer1')).toHaveTextContent('555');
    expect(screen.getByTestId('consumer2')).toHaveTextContent('555');
  });

  test('updating context triggers re-render of consumers', () => {
    const mockUpdate = jest.fn();
    const { rerender } = renderWithModalContext(
      <Overlay modalName="video" />,
      { positions: { video: { x: 0, y: 0 } }, updatePosition: mockUpdate }
    );

    // Simulate position update
    act(() => {
      mockUpdate('video', { x: 999, y: 888 });
    });

    // Rerender with updated context
    rerender(
      <ModalPositionContext.Provider value={{
        positions: { video: { x: 999, y: 888 } },
        updatePosition: mockUpdate
      }}>
        <Overlay modalName="video" />
      </ModalPositionContext.Provider>
    );

    // Verify consumer updated
    expect(screen.getByRole('dialog')).toHaveStyle({
      transform: 'translate(999px, 888px)'
    });
  });
});
```

**Performance Target**: < 2 seconds per test

---

## E2E Tests (20-30%)

### 1. Complete Modal Positioning Workflow

**File**: `e2e/modal-positioning.spec.js`

**Coverage Target**: End-to-end user workflow

**Test Cases**:
```javascript
test('complete positioning workflow: drag → URL → reload → restore', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Open video modal
  await page.click('[aria-label="Video Player"]');
  const modal = page.locator('.overlay').first();

  // Get initial position
  const initialBox = await modal.boundingBox();

  // Drag modal
  await modal.locator('.drag').dragTo(modal, {
    targetPosition: { x: initialBox.x + 200, y: initialBox.y + 150 }
  });

  // Wait for debounced URL update
  await page.waitForTimeout(600);

  // Verify URL contains position
  const url = new URL(page.url());
  expect(url.searchParams.get('videoModalX')).toBeTruthy();

  // Reload page
  await page.reload();

  // Verify position restored
  const restoredBox = await modal.boundingBox();
  expect(Math.abs(restoredBox.x - (initialBox.x + 200))).toBeLessThan(10);
  expect(Math.abs(restoredBox.y - (initialBox.y + 150))).toBeLessThan(10);
});
```

**Performance Target**: < 15 seconds per test

---

### 2. Cross-Browser Compatibility

**File**: `e2e/cross-browser-modals.spec.js`

**Coverage Target**: All three browsers (Chromium, Firefox, WebKit)

**Test Cases**:
```javascript
test('modal positioning works in all browsers', async ({ page, browserName }) => {
  await page.goto('http://localhost:3000');

  // Test drag and URL encoding
  await page.click('[aria-label="Video Player"]');
  const modal = page.locator('.overlay').first();
  await modal.locator('.drag').dragTo(modal, {
    targetPosition: { x: 200, y: 150 }
  });

  await page.waitForTimeout(600);

  // Verify URL updated
  const url = new URL(page.url());
  expect(url.searchParams.has('videoModalX')).toBeTruthy();

  // Log browser for debugging
  console.log(`Test passed in ${browserName}`);
});
```

**Performance Target**: < 10 seconds per test per browser

---

### 3. Accessibility Audits

**File**: `e2e/accessibility-modals.spec.js`

**Coverage Target**: Positioned modals have no a11y violations

**Test Cases**:
```javascript
import AxeBuilder from '@axe-core/playwright';

test('positioned modals pass accessibility audit', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Position modal
  await page.click('[aria-label="Video Player"]');
  const modal = page.locator('.overlay').first();
  await modal.locator('.drag').dragTo(modal, {
    targetPosition: { x: 200, y: 150 }
  });

  // Run axe audit
  const results = await new AxeBuilder({ page })
    .include('.overlay')
    .analyze();

  expect(results.violations).toEqual([]);
});

test('keyboard navigation works with positioned modals', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Open modal
  await page.click('[aria-label="Video Player"]');

  // Test Escape key closes modal
  await page.keyboard.press('Escape');
  await expect(page.locator('.overlay')).not.toBeVisible();
});
```

**Performance Target**: < 20 seconds per test

---

## Unit Tests (10-20%)

### 1. Position Validation Edge Cases

**File**: `src/__tests__/unit/position-validation.test.js`

**Test Cases**:
```javascript
describe('Position Validation', () => {
  test('clamps negative values to 0', () => {
    const result = parseModalPosition('-100');
    expect(result).toBe(0);
  });

  test('clamps values above 10000 to 10000', () => {
    const result = parseModalPosition('15000');
    expect(result).toBe(10000);
  });

  test('returns null for non-numeric values', () => {
    expect(parseModalPosition('foo')).toBeNull();
    expect(parseModalPosition('NaN')).toBeNull();
    expect(parseModalPosition(undefined)).toBeNull();
  });

  test('handles boundary values correctly', () => {
    expect(parseModalPosition('0')).toBe(0);
    expect(parseModalPosition('10000')).toBe(10000);
  });
});
```

**Performance Target**: < 0.5 seconds for all validation tests

---

### 2. Handler Factory Function

**File**: `src/__tests__/unit/handler-factory.test.js`

**Test Cases**:
```javascript
describe('Position Handler Factory', () => {
  test('creates handler that updates correct modal', () => {
    const setState = jest.fn();
    const handler = createPositionHandler('video', setState);

    handler({ x: 100, y: 150 });

    expect(setState).toHaveBeenCalledWith(expect.any(Function));

    // Verify setState callback updates correct modal
    const callback = setState.mock.calls[0][0];
    const prevState = {
      modalPositions: {
        video: { x: 0, y: 0 },
        help: { x: 0, y: 0 }
      }
    };
    const newState = callback(prevState);

    expect(newState.modalPositions.video).toEqual({ x: 100, y: 150 });
    expect(newState.modalPositions.help).toEqual({ x: 0, y: 0 }); // Unchanged
  });
});
```

**Performance Target**: < 0.5 seconds

---

## Coverage Measurement

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js'
  ],
  coverageThresholds: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
```

### Running Coverage

```bash
# Integration and unit tests
npm test -- --coverage

# E2E tests (separate)
npx playwright test

# Combined coverage report
npm run test:coverage:combined
```

---

## Test Distribution Validation

After implementation, verify coverage distribution:

```bash
# Count tests by type
Integration: $(grep -r "describe\\|test\\|it" src/__tests__/integration | wc -l)
E2E: $(grep -r "test" e2e | wc -l)
Unit: $(grep -r "describe\\|test\\|it" src/__tests__/unit | wc -l)

# Calculate percentages
Total: Integration + E2E + Unit
Integration %: (Integration / Total) * 100  # Should be 60-70%
E2E %: (E2E / Total) * 100                 # Should be 20-30%
Unit %: (Unit / Total) * 100               # Should be 10-20%
```

---

## Version History

- **1.0.0** (2025-12-03): Initial test structure contract
  - Coverage requirements and distribution
  - Test organization and file structure
  - Sample test cases for each category
  - Performance targets

---

## Related Contracts

- [context-api.md](./context-api.md) - Context testing patterns
- [state-structure.md](./state-structure.md) - State operation tests
