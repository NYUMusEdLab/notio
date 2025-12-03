# Research: URL Settings Storage - Testing and Refactoring Patterns

**Feature**: 005-url-storage-completion
**Date**: 2025-12-03
**Purpose**: Research best practices for adding test coverage and refactoring modal positioning architecture

## 1. React Testing Library Integration Testing Patterns

### 1.1 Context API Testing with Class Components

**Decision**: Use render wrapper pattern with Context.Consumer for testing class components that consume ModalPositionContext.

**Rationale**:
- WholeApp and modal buttons are class components, can't use hooks directly
- Context.Consumer works with both class and functional components
- Render wrappers allow easy test setup with custom context values
- Aligns with React Testing Library best practices for context testing

**Implementation Pattern**:
```javascript
// tests/helpers/context-test-utils.js
export function renderWithModalContext(component, contextValue = {}) {
  const defaultValue = {
    positions: { video: { x: 0, y: 0 }, help: { x: 0, y: 0 }, share: { x: 0, y: 0 } },
    updatePosition: jest.fn(),
    ...contextValue
  };

  return render(
    <ModalPositionContext.Provider value={defaultValue}>
      {component}
    </ModalPositionContext.Provider>
  );
}
```

**Alternatives Considered**:
- **Full refactor to functional components**: Rejected - too much scope, not needed for context
- **HOC wrapper pattern**: Rejected - render wrapper is simpler and more testable
- **Direct Context.Consumer in tests**: Rejected - not reusable, verbose in every test

**Implementation Notes**:
- Mock context value should match production shape exactly
- Use jest.fn() for updatePosition to verify it's called with correct args
- Can override specific values per test while keeping defaults

---

### 1.2 Drag Interaction Testing with react-draggable

**Decision**: Use user-event or fireEvent to simulate mouse events (mouseDown, mouseMove, mouseUp) rather than mocking Draggable component.

**Rationale**:
- Tests real user interactions, not implementation details
- react-draggable responds to native mouse events
- Survives refactoring if we change drag library
- Aligns with "test user behavior, not implementation" principle

**Implementation Pattern**:
```javascript
import { fireEvent } from '@testing-library/react';

test('dragging modal updates position in context', () => {
  const mockUpdate = jest.fn();
  const { container } = renderWithModalContext(<Overlay />, {
    updatePosition: mockUpdate
  });

  const dragHandle = container.querySelector('.drag');

  // Simulate drag from (0,0) to (100,150)
  fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
  fireEvent.mouseMove(dragHandle, { clientX: 100, clientY: 150 });
  fireEvent.mouseUp(dragHandle);

  expect(mockUpdate).toHaveBeenCalledWith('video', { x: 100, y: 150 });
});
```

**Alternatives Considered**:
- **Mock Draggable component**: Rejected - tests implementation, not behavior
- **Playwright for drag testing**: Rejected for integration tests - E2E only, too slow
- **Testing Library user-event drag**: Considered but fireEvent is sufficient for mouse events

**Implementation Notes**:
- Draggable may apply transforms/offsets - verify actual values in assertions
- Test debouncing separately - drag tests should use fake timers (jest.useFakeTimers)
- Use data-testid on drag handles if .drag selector is fragile

---

### 1.3 Browser API Mocking

**Decision**: Mock browser APIs (History API, URLSearchParams) at the global level using jest.spyOn for integration tests.

**Rationale**:
- Browser APIs are external dependencies, should be mocked in integration tests
- jest.spyOn allows verifying API calls without changing implementation
- Can test error handling without actually manipulating browser history
- E2E tests will verify real browser behavior

**Implementation Pattern**:
```javascript
describe('URL synchronization', () => {
  let replaceStateSpy;

  beforeEach(() => {
    replaceStateSpy = jest.spyOn(window.history, 'replaceState');
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
  });

  test('updating modal position triggers URL update', async () => {
    const { rerender } = render(<WholeApp />);

    // Trigger position change
    act(() => {
      // ... simulate drag
    });

    // Wait for debounce (500ms)
    await waitFor(() => {
      expect(replaceStateSpy).toHaveBeenCalledWith(
        expect.any(Object),
        '',
        expect.stringContaining('videoModalX=100')
      );
    }, { timeout: 1000 });
  });
});
```

**Alternatives Considered**:
- **Real browser history manipulation**: Rejected - causes test pollution, hard to clean up
- **Mock entire urlEncoder module**: Rejected - loses integration testing value
- **No mocking, test via E2E only**: Rejected - too slow for comprehensive coverage

**Implementation Notes**:
- Use waitFor for debounced operations (500ms URL updates)
- Mock window.location for URL parsing tests
- Restore mocks in afterEach to prevent test pollution

---

### 1.4 State Synchronization Verification

**Decision**: Use React Testing Library queries and waitFor to verify state flows through component tree without accessing internal state.

**Rationale**:
- Testing Library principle: test behavior, not implementation
- Verifying DOM output proves state synchronized correctly
- Works with both class and functional components
- Survives refactoring of internal state structure

**Implementation Pattern**:
```javascript
test('context position updates reflect in Overlay position', () => {
  const { rerender } = renderWithModalContext(<Overlay />, {
    positions: { video: { x: 50, y: 100 } }
  });

  // Verify initial position (via Draggable position prop rendered to DOM)
  const overlay = screen.getByRole('dialog'); // or appropriate role
  expect(overlay).toHaveStyle({ transform: 'translate(50px, 100px)' });

  // Update context
  rerender(
    <ModalPositionContext.Provider value={{
      positions: { video: { x: 200, y: 300 } }
    }}>
      <Overlay />
    </ModalPositionContext.Provider>
  );

  // Verify position updated
  expect(overlay).toHaveStyle({ transform: 'translate(200px, 300px)' });
});
```

**Alternatives Considered**:
- **Accessing component.state directly**: Rejected - breaks with hooks, implementation detail
- **Testing context value directly**: Rejected - doesn't verify rendering
- **Snapshot testing**: Rejected - brittle, doesn't verify specific behavior

**Implementation Notes**:
- Use appropriate ARIA roles to query elements (role="dialog" for modals)
- Verify actual DOM changes, not just that functions were called
- Test complete flow: user action → state update → DOM change

---

### 1.5 Coverage Measurement Strategy

**Decision**: Use Jest's built-in coverage with focused thresholds: 100% for critical services (urlEncoder), 80%+ for components, 70%+ global.

**Rationale**:
- Constitutional requirement is 100% total, but pragmatic per-file thresholds prevent false sense of completion
- URL encoding/decoding is critical - bugs break all shared links
- Component coverage slightly lower is acceptable with integration tests
- Allows incremental progress toward 100%

**Configuration**:
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
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    './src/services/urlEncoder.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    './src/contexts/ModalPositionContext.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
```

**Alternatives Considered**:
- **100% threshold everywhere**: Rejected - too strict initially, blocks incremental progress
- **No thresholds, just measure**: Rejected - no enforcement, coverage can regress
- **Function-level coverage only**: Rejected - misses branch coverage (conditionals)

**Implementation Notes**:
- Run `npm test -- --coverage` to generate reports
- Use `--collectCoverageFrom` to exclude test files from coverage
- HTML reports help identify uncovered branches: `coverage/lcov-report/index.html`
- Increase global threshold incrementally as coverage improves

---

## 2. Playwright E2E Testing Patterns

### 2.1 Drag-and-Drop Testing

**Decision**: Use Playwright's native `dragTo()` method for modal drag testing with position verification via bounding box.

**Rationale**:
- Native browser drag events more realistic than simulated
- `dragTo()` handles all mouse event sequencing automatically
- Position verification via `boundingBox()` is reliable
- Works consistently across browsers (Chromium, Firefox, WebKit)

**Implementation Pattern**:
```javascript
// e2e/modal-positioning.spec.js
test('drag modal updates URL and persists on reload', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Open video modal
  await page.click('[aria-label="Video Player"]');

  // Get modal element
  const modal = page.locator('.overlay').first();

  // Get initial position
  const initialBox = await modal.boundingBox();

  // Drag modal by 200px right, 150px down
  await modal.locator('.drag').dragTo(modal, {
    targetPosition: {
      x: initialBox.x + 200,
      y: initialBox.y + 150
    }
  });

  // Wait for debounced URL update (500ms + buffer)
  await page.waitForTimeout(600);

  // Verify URL contains position parameters
  const url = page.url();
  expect(url).toContain('videoModalX=');
  expect(url).toContain('videoModalY=');

  // Extract position from URL
  const urlParams = new URL(url).searchParams;
  const urlX = parseInt(urlParams.get('videoModalX'));
  const urlY = parseInt(urlParams.get('videoModalY'));

  // Reload page
  await page.reload();

  // Verify modal restored to same position (within 10px tolerance)
  const restoredBox = await modal.boundingBox();
  expect(Math.abs(restoredBox.x - (initialBox.x + 200))).toBeLessThan(10);
  expect(Math.abs(restoredBox.y - (initialBox.y + 150))).toBeLessThan(10);
});
```

**Alternatives Considered**:
- **Mouse.down/move/up sequence**: Rejected - more verbose, same result as dragTo
- **Verify position via CSS transform**: Rejected - bounding box is actual rendered position
- **Fixed target coordinates**: Rejected - brittle across screen sizes

**Implementation Notes**:
- Use waitForTimeout for debounce, or waitForFunction for URL change
- Allow 10px tolerance for position restoration (rounding, browser differences)
- Test on different viewport sizes to verify clamping logic

---

### 2.2 URL Parameter Verification

**Decision**: Parse URL with native URL API and assert on individual parameters rather than full URL string matching.

**Rationale**:
- Parameter order may vary (URLSearchParams doesn't guarantee order)
- Easier to debug failures (which parameter is wrong)
- Can verify presence/absence of specific parameters independently
- More maintainable than regex or full string comparison

**Implementation Pattern**:
```javascript
test('multiple modal positions encoded in URL', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Open and position video modal
  await page.click('[aria-label="Video Player"]');
  await page.locator('.overlay').first().locator('.drag').dragTo(/* ... */);

  // Open and position help modal
  await page.click('[aria-label="Help"]');
  await page.locator('.overlay').last().locator('.drag').dragTo(/* ... */);

  await page.waitForTimeout(600); // Debounce

  // Parse URL
  const urlParams = new URL(page.url()).searchParams;

  // Verify video modal position
  expect(urlParams.has('videoModalX')).toBeTruthy();
  expect(urlParams.has('videoModalY')).toBeTruthy();
  expect(parseInt(urlParams.get('videoModalX'))).toBeGreaterThan(0);

  // Verify help modal position
  expect(urlParams.has('helpModalX')).toBeTruthy();
  expect(urlParams.has('helpModalY')).toBeTruthy();

  // Verify no share modal position (not opened)
  expect(urlParams.has('shareModalX')).toBeFalsy();
});
```

**Alternatives Considered**:
- **Regex URL matching**: Rejected - brittle, hard to maintain
- **Full URL string comparison**: Rejected - fails if parameter order changes
- **Snapshot testing URLs**: Rejected - too fragile for dynamic content

**Implementation Notes**:
- Use `searchParams` API for clean parameter access
- Test boundary values (0, negative, very large numbers)
- Verify parameter absence for closed modals

---

### 2.3 Cross-Browser Testing Strategy

**Decision**: Run full test suite across Chromium, Firefox, and WebKit using Playwright's projects feature with shared tests.

**Rationale**:
- Modal positioning may behave differently across browsers (rendering, drag events)
- Playwright projects allow running same tests in multiple browsers efficiently
- Constitutional requirement mentions cross-browser compatibility
- Catches browser-specific bugs early

**Configuration**:
```javascript
// playwright.config.js
module.exports = {
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
  // Run tests in parallel across browsers
  workers: 3,
};
```

**Implementation Pattern**:
```javascript
// e2e/cross-browser-modals.spec.js
test('modal positioning works consistently across browsers', async ({ page, browserName }) => {
  await page.goto('http://localhost:3000');

  // Test drag
  await page.click('[aria-label="Video Player"]');
  const modal = page.locator('.overlay').first();
  await modal.locator('.drag').dragTo(modal, {
    targetPosition: { x: 200, y: 150 }
  });

  await page.waitForTimeout(600);

  // Verify URL updated
  const url = new URL(page.url());
  expect(url.searchParams.has('videoModalX')).toBeTruthy();

  // Browser-specific assertions if needed
  if (browserName === 'webkit') {
    // Safari-specific checks
  }
});
```

**Alternatives Considered**:
- **Single browser testing**: Rejected - misses browser-specific bugs
- **Manual testing per browser**: Rejected - time-consuming, not automated
- **BrowserStack/Sauce Labs**: Rejected - Playwright built-in browsers sufficient

**Implementation Notes**:
- Run `npx playwright test --project=chromium` to test single browser
- Use `browserName` fixture for browser-specific assertions if needed
- Watch for WebKit differences (Safari uses different engine than Chrome/Firefox)

---

### 2.4 Accessibility Testing with @axe-core/playwright

**Decision**: Integrate axe-core accessibility audits into E2E tests, running after modal positioning operations to verify no a11y regressions.

**Rationale**:
- Constitutional requirement for accessibility
- Positioned modals might obscure content or break focus management
- Automated audits catch common issues (missing ARIA, color contrast, focus order)
- Constitutional requirement specifically mentions jest-axe and @axe-core/playwright

**Implementation Pattern**:
```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('positioned modals have no accessibility violations', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Open and position modal
  await page.click('[aria-label="Video Player"]');
  const modal = page.locator('.overlay').first();
  await modal.locator('.drag').dragTo(modal, {
    targetPosition: { x: 200, y: 150 }
  });

  // Run axe audit
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.overlay') // Scope to modal
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);

  // Also test keyboard navigation
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');

  // Modal should close on Escape
  await expect(modal).not.toBeVisible();
});
```

**Alternatives Considered**:
- **Manual accessibility testing only**: Rejected - not scalable, misses issues
- **jest-axe for component tests only**: Rejected - E2E catches integration issues
- **Separate a11y test file**: Rejected - better to test accessibility in context

**Implementation Notes**:
- Use `.include()` to scope audits to specific components
- Test keyboard navigation separately (axe doesn't test all keyboard interactions)
- Common violations: missing aria-labels, incorrect roles, focus trap issues
- Run audits in multiple states (modal open, closed, positioned)

---

### 2.5 Performance Measurement

**Decision**: Use Playwright's performance APIs to measure and assert test execution time stays under 30 seconds per constitutional requirement.

**Rationale**:
- Constitutional mandate: E2E tests < 30s per test
- Slow tests indicate performance issues or inefficient test design
- Playwright provides built-in timing APIs
- Can fail tests that exceed threshold

**Implementation Pattern**:
```javascript
test('modal positioning workflow completes within performance budget', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('http://localhost:3000');

  // Complete workflow
  await page.click('[aria-label="Video Player"]');
  const modal = page.locator('.overlay').first();
  await modal.locator('.drag').dragTo(modal, {
    targetPosition: { x: 200, y: 150 }
  });
  await page.waitForTimeout(600); // Debounce

  // Verify URL
  const url = new URL(page.url());
  expect(url.searchParams.has('videoModalX')).toBeTruthy();

  // Reload and verify restoration
  await page.reload();
  const restoredBox = await modal.boundingBox();
  expect(restoredBox.x).toBeGreaterThan(100);

  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(30000); // 30 seconds

  console.log(`Test completed in ${duration}ms`);
});
```

**Alternatives Considered**:
- **No performance tracking**: Rejected - violates constitutional requirement
- **Playwright test timeout only**: Rejected - timeout is failure threshold, need proactive measurement
- **Separate performance tests**: Rejected - performance should be measured on all tests

**Implementation Notes**:
- 30s is maximum, aim for <10s for fast feedback
- Use `page.waitForLoadState('networkidle')` instead of fixed timeouts where possible
- Parallel test execution (`workers: 3`) speeds up total suite time
- Watch for flaky tests that sometimes exceed threshold

---

## 3. React Context API Patterns

### 3.1 Context API with Class Components

**Decision**: Use Context.Consumer pattern in render method of class components, with Context.Provider wrapping at WholeApp level.

**Rationale**:
- WholeApp is a class component, can't use useContext hook
- Context.Consumer works in both class and functional components
- Overlay can be converted to functional component to use useContext hook
- Minimal refactoring of existing class component architecture

**Implementation Pattern**:
```javascript
// src/contexts/ModalPositionContext.js
import React, { createContext } from 'react';

export const ModalPositionContext = createContext({
  positions: {
    video: { x: null, y: null },
    help: { x: null, y: null },
    share: { x: null, y: null }
  },
  updatePosition: () => {}
});

// src/WholeApp.js (class component)
class WholeApp extends Component {
  state = {
    modalPositions: {
      video: { x: null, y: null },
      help: { x: null, y: null },
      share: { x: null, y: null }
    },
    // ... other state
  };

  updateModalPosition = (modalName, position) => {
    this.setState(prevState => ({
      modalPositions: {
        ...prevState.modalPositions,
        [modalName]: position
      }
    }));
  };

  render() {
    const contextValue = {
      positions: this.state.modalPositions,
      updatePosition: this.updateModalPosition
    };

    return (
      <ModalPositionContext.Provider value={contextValue}>
        {/* app content */}
      </ModalPositionContext.Provider>
    );
  }
}

// src/components/OverlayPlugins/Overlay.js (convert to functional)
import React from 'react';
import { ModalPositionContext } from '../../contexts/ModalPositionContext';

function Overlay({ modalName, ...props }) {
  const { positions, updatePosition } = React.useContext(ModalPositionContext);

  const position = positions[modalName] || { x: 0, y: 0 };

  const handleDragStop = (e, data) => {
    updatePosition(modalName, { x: data.x, y: data.y });
  };

  return (
    <Draggable position={position} onStop={handleDragStop}>
      {/* modal content */}
    </Draggable>
  );
}
```

**Alternatives Considered**:
- **Refactor all class components to functional**: Rejected - too much scope, risky
- **HOC wrapper for context**: Rejected - adds complexity, functional component simpler
- **Keep props drilling**: Rejected - defeats purpose of refactoring

**Implementation Notes**:
- Only convert Overlay to functional component (it's small and has no lifecycle methods beyond hooks)
- WholeApp stays as class component (large, complex, lifecycle methods)
- Pass `modalName` prop to Overlay so it knows which position to access

---

### 3.2 Context Provider Placement

**Decision**: Place ModalPositionContext.Provider at WholeApp level, wrapping entire app content, with value derived from WholeApp state.

**Rationale**:
- WholeApp already manages all application state (octave, scale, etc.)
- Context value can derive directly from this.state.modalPositions
- Single provider location simplifies testing
- URL synchronization logic already in WholeApp (componentDidUpdate)

**Implementation Pattern**:
```javascript
class WholeApp extends Component {
  componentDidUpdate(prevProps, prevState) {
    // Existing URL update logic
    if (this.state.modalPositions !== prevState.modalPositions) {
      this.debouncedUpdateBrowserURL();
    }
  }

  render() {
    const modalContextValue = {
      positions: this.state.modalPositions,
      updatePosition: this.updateModalPosition
    };

    return (
      <ModalPositionContext.Provider value={modalContextValue}>
        <div className="App">
          <TopMenu state={this.state} /* remove position props */ />
          {/* rest of app */}
        </div>
      </ModalPositionContext.Provider>
    );
  }
}
```

**Alternatives Considered**:
- **Provider at modal level**: Rejected - separate contexts don't share state
- **Multiple providers**: Rejected - overcomplicates, positions are related
- **Provider in index.js**: Rejected - state lives in WholeApp, not above it

**Implementation Notes**:
- Context value should be derived from state, not stored separately
- Update URL when context value changes (already handled in componentDidUpdate)
- Don't memoize context value initially (optimize later if needed)

---

### 3.3 Performance Optimization

**Decision**: Apply React.memo and useMemo ONLY after measuring actual performance issues, starting with no optimization.

**Rationale**:
- Premature optimization adds complexity without proven benefit
- Modal positioning updates are infrequent (only on drag)
- Context updates don't cause excessive re-renders in typical usage
- Constitutional principle: simplicity first, optimize when needed

**When to Optimize** (measure first):
```javascript
// Measure re-renders
import { useEffect } from 'react';

function Overlay({ modalName }) {
  useEffect(() => {
    console.log(`Overlay ${modalName} rendered`);
  });
  // ...
}
```

**If optimization needed**:
```javascript
// 1. Memoize context value in provider
const modalContextValue = React.useMemo(() => ({
  positions: this.state.modalPositions,
  updatePosition: this.updateModalPosition
}), [this.state.modalPositions]); // Only recreate when positions change

// 2. Memoize Overlay component if it re-renders excessively
export default React.memo(Overlay);

// 3. Split context if different parts update at different rates
// (Only if profiling shows this is needed)
const ModalPositionsContext = createContext(); // Read-only positions
const ModalActionsContext = createContext(); // updatePosition function
```

**Alternatives Considered**:
- **Optimize everything upfront**: Rejected - premature optimization
- **Never optimize**: Rejected - may need optimization if profiling reveals issues
- **Use Redux instead**: Rejected - Context API sufficient for this scope

**Implementation Notes**:
- Use React DevTools Profiler to measure re-renders
- Modal components that don't use context won't re-render when context changes
- Optimization is optional - start simple, measure, then optimize

---

### 3.4 Migration Strategy (Props Drilling to Context)

**Decision**: Migrate in phases - test coverage first, then gradual Context adoption without breaking existing functionality.

**Migration Phases**:

**Phase 1: Add Context alongside existing props** (no breaking changes)
```javascript
// Overlay accepts BOTH context and props temporarily
function Overlay({ modalName, initialPosition, onPositionChange }) {
  const context = React.useContext(ModalPositionContext);

  // Prefer context if available, fallback to props
  const position = context?.positions[modalName] || initialPosition || { x: 0, y: 0 };
  const updateFn = context?.updatePosition || onPositionChange || (() => {});

  // ... use position and updateFn
}
```

**Phase 2: Remove props from intermediate components** (one layer at a time)
```javascript
// TopMenu: Remove position props forwarding
// Modal buttons: Remove position props forwarding
// Modal content: Remove position props forwarding
// Overlay: Remove prop support, use context only
```

**Phase 3: Clean up** (after all tests pass)
```javascript
// Remove props from Overlay signature
function Overlay({ modalName }) {
  const { positions, updatePosition } = React.useContext(ModalPositionContext);
  // ...
}
```

**Rationale**:
- Incremental migration reduces risk
- Tests can be written before migration starts
- Each phase can be tested independently
- Easy to rollback if issues found

**Alternatives Considered**:
- **Big-bang migration**: Rejected - high risk, hard to debug
- **Feature flag**: Rejected - overkill for this scope
- **Keep both patterns**: Rejected - maintenance burden

**Implementation Notes**:
- Write tests before starting migration (test behavior, not props)
- Keep existing behavior identical during migration
- Remove props last, after context is proven working

---

### 3.5 Testing Context Providers and Consumers

**Decision**: Test context integration with render wrappers for unit tests, and full app mounting for integration tests.

**Testing Patterns**:

**Unit Test: Context Provider**
```javascript
test('ModalPositionContext provides positions to consumers', () => {
  const TestConsumer = () => {
    const { positions } = React.useContext(ModalPositionContext);
    return <div>{positions.video.x},{positions.video.y}</div>;
  };

  const { getByText } = render(
    <ModalPositionContext.Provider value={{
      positions: { video: { x: 100, y: 200 } },
      updatePosition: jest.fn()
    }}>
      <TestConsumer />
    </ModalPositionContext.Provider>
  );

  expect(getByText('100,200')).toBeInTheDocument();
});
```

**Unit Test: Context Consumer**
```javascript
test('Overlay consumes position from context', () => {
  const { container } = renderWithModalContext(<Overlay modalName="video" />, {
    positions: { video: { x: 50, y: 75 } }
  });

  const overlay = container.querySelector('.overlay');
  // Verify Draggable received correct position
  expect(overlay).toHaveStyle({ transform: 'translate(50px, 75px)' });
});
```

**Integration Test: Full Context Flow**
```javascript
test('updating position in one component updates other consumers', () => {
  const { rerender } = render(<WholeApp />);

  // Open modal (renders Overlay consumer)
  fireEvent.click(screen.getByLabelText('Video Player'));

  // Drag modal (triggers context update)
  const dragHandle = screen.getByTestId('video-modal-drag-handle');
  fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
  fireEvent.mouseMove(dragHandle, { clientX: 100, clientY: 150 });
  fireEvent.mouseUp(dragHandle);

  // Verify URL was updated (integration with WholeApp)
  await waitFor(() => {
    expect(window.history.replaceState).toHaveBeenCalledWith(
      expect.anything(),
      '',
      expect.stringContaining('videoModalX=100')
    );
  });
});
```

**Rationale**:
- Unit tests verify context mechanics in isolation
- Integration tests verify complete flow through real app
- Both are needed for 100% coverage

**Alternatives Considered**:
- **Only integration tests**: Rejected - slower, harder to debug failures
- **Only unit tests**: Rejected - doesn't catch integration issues
- **Enzyme shallow rendering**: Rejected - deprecated, incompatible with hooks

**Implementation Notes**:
- Use render wrappers for reusable test setup
- Mock context value in unit tests, use real context in integration tests
- Test both provider and consumer sides separately, then together

---

## Summary

This research document provides actionable patterns for:

1. **Integration Testing (60-70% of coverage)**:
   - Context testing with render wrappers
   - Drag interaction simulation with fireEvent
   - Browser API mocking with jest.spyOn
   - State synchronization verification via DOM queries
   - Coverage measurement with focused thresholds

2. **E2E Testing (20-30% of coverage)**:
   - Native drag testing with Playwright dragTo()
   - URL parameter verification with URLSearchParams
   - Cross-browser testing with Playwright projects
   - Accessibility audits with @axe-core/playwright
   - Performance measurement under 30s requirement

3. **Context API Implementation**:
   - Context.Consumer for class components
   - Provider placement at WholeApp level
   - Performance optimization only when measured
   - Incremental migration strategy (phases)
   - Comprehensive testing at all levels

All patterns align with constitutional requirements (100% coverage, 60-70-20-30 distribution) and React best practices.
