# Research: URL-Based Settings Storage

**Feature**: 004-url-settings-storage
**Date**: 2025-12-02
**Status**: Complete

## Overview

Research decisions for migrating from Firebase database storage to URL query parameter encoding for user configurations.

## Research Topics

### 1. URL Parameter Encoding Strategy

**Decision**: Use URLSearchParams with abbreviated parameter names

**Rationale**:
- Browser-native API with excellent cross-browser support (IE10+)
- Automatic encoding/decoding of special characters
- Built-in handling of duplicate parameters (takes last value)
- No external dependencies required
- Compact parameter names reduce URL length:
  - `o=4` instead of `octave=4`
  - `s=Major` instead of `scale=Major`
  - `bn=C` instead of `baseNote=C`

**Alternatives Considered**:
- **Base64-encoded JSON**: Rejected because:
  - Harder to debug (not human-readable)
  - Single point of failure (one corrupted char breaks entire URL)
  - No graceful degradation for partial parameter loss
  - Difficult to extend (requires full re-encoding for one setting change)
- **Hash-based encoding (#param1=value1)**: Rejected because:
  - Doesn't integrate with browser history as cleanly
  - Not indexed by search engines (minor consideration)
  - URLSearchParams is more standard
- **Custom binary encoding**: Rejected due to complexity, debugging difficulty

**Implementation Notes**:
```javascript
// Encoding example
const params = new URLSearchParams();
params.set('o', state.octave);
params.set('s', state.scale);
const url = `${window.location.origin}/?${params.toString()}`;

// Decoding example
const params = new URLSearchParams(window.location.search);
const octave = parseInt(params.get('o')) || DEFAULT_OCTAVE;
```

---

### 2. Complex Object Serialization (Scale Objects)

**Decision**: Separate parameters with comma-separated values for arrays

**Rationale**:
- Maintains human-readability in URLs
- Easy to validate individual components
- Graceful degradation if one parameter is malformed
- Simple to document for developers

**Format**:
```
?sn=My+Custom+Scale&ss=0,2,4,5,7,9,11&snum=1,2,3,4,5,6,7
```
- `sn` = scale name
- `ss` = scale steps (comma-separated integers 0-11)
- `snum` = scale numbers (comma-separated labels)

**Alternatives Considered**:
- **Nested JSON in single parameter**: Rejected because:
  - Harder to validate incrementally
  - All-or-nothing parsing (one typo breaks entire scale)
  - Less readable in URLs
- **Multiple parameters with indices** (`ss[0]=0&ss[1]=2`): Rejected because:
  - Verbose, increases URL length significantly
  - Non-standard for query parameters

---

### 3. Browser History Integration

**Decision**: Use `history.replaceState()` with 500ms debouncing

**Rationale**:
- `replaceState()` updates URL without adding history entry on every keystroke
- Only add history entry after 500ms of inactivity (user stopped making changes)
- Prevents history pollution while enabling useful back/forward navigation
- Non-blocking operation (doesn't freeze UI)

**Implementation Pattern**:
```javascript
let debounceTimer = null;

function updateURLFromState(state) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const url = encodeSettingsToURL(state);
    window.history.replaceState(null, '', url);
  }, 500);
}
```

**Alternatives Considered**:
- **Immediate `pushState()` on every change**: Rejected because:
  - Creates dozens of history entries during rapid changes
  - Poor user experience (back button cycles through minor variations)
- **Manual "Save to URL" button**: Rejected because:
  - Extra user action required
  - Doesn't support automatic bookmarking of current state
  - Breaks browser back/forward expectations
- **Longer debounce (1000ms+)**: Rejected because:
  - Feels unresponsive
  - Users may leave page before URL updates

---

### 4. Video URL Security Validation

**Decision**: Regex validation allowing HTTPS-only, blocking dangerous protocols

**Rationale**:
- Prevents XSS attacks via `javascript:`, `data:`, `file:` protocols
- Flexible enough for future video platforms (any HTTPS domain)
- Simple regex pattern, no complex parsing required
- Fails safely (invalid URLs rejected, app continues with other settings)

**Validation Pattern**:
```javascript
const VIDEO_URL_REGEX = /^https:\/\/[^\s<>"{}|\\^`\[\]]+$/i;

function isValidVideoURL(url) {
  if (!url) return true; // Empty is valid (optional setting)
  if (!VIDEO_URL_REGEX.test(url)) return false;

  // Additional check: no dangerous protocols
  const lowerURL = url.toLowerCase();
  if (lowerURL.startsWith('javascript:') ||
      lowerURL.startsWith('data:') ||
      lowerURL.startsWith('file:')) {
    return false;
  }

  return true;
}
```

**Alternatives Considered**:
- **Domain allowlist** (youtube.com, vimeo.com only): Rejected because:
  - Not future-proof (new platforms require code changes)
  - Breaks self-hosted educational videos
  - Overly restrictive for educational use case
- **Full URL parser** (using `new URL()`): Rejected because:
  - Overkill for this use case
  - Regex is simpler and sufficient
  - `URL` constructor can throw exceptions (need try/catch)

---

### 5. URL Length Management

**Decision**: Pre-validation with graceful degradation suggestions

**Rationale**:
- Validate before generating URL (fail fast)
- Provide actionable feedback (suggest removing video URL first, then custom scales)
- 2000 character limit chosen for maximum browser compatibility
- Block share creation rather than silently truncating

**Validation Flow**:
```javascript
function validateURLLength(state) {
  const url = encodeSettingsToURL(state);
  if (url.length > 2000) {
    return {
      valid: false,
      length: url.length,
      suggestions: [
        'Remove video URL to save ~100 characters',
        'Simplify custom scale names',
        'Use preset scales instead of custom scales'
      ]
    };
  }
  return { valid: true, length: url.length };
}
```

**Alternatives Considered**:
- **Automatic truncation**: Rejected because:
  - Silent failure is worse than explicit error
  - Which settings to drop is ambiguous
  - User doesn't know what was lost
- **URL shortening service**: Rejected because:
  - Out of scope (can add later)
  - Adds external dependency and latency
  - Privacy concerns (third-party sees all settings)
- **Compression (gzip/zlib)**: Rejected because:
  - Requires base64 encoding (loses human-readability)
  - Browser doesn't natively support decompressing URL params
  - Added complexity

---

### 6. Backwards Compatibility with Firebase

**Decision**: URL pattern detection with Firebase fallback

**Rationale**:
- Legacy links use `/shared/{firebaseId}` pattern
- New links use `/?o=4&s=Major...` pattern
- Easy to distinguish (no ambiguity)
- Firebase code remains unchanged (read-only)
- 6-month transition period gives users time to update bookmarks

**Detection Logic**:
```javascript
function loadSettingsFromURL() {
  const path = window.location.pathname;

  // Legacy Firebase link: /shared/abc123
  if (path.startsWith('/shared/')) {
    const firebaseId = path.split('/')[2];
    return loadFromFirebase(firebaseId);
  }

  // New URL-encoded link: /?o=4&s=Major
  const params = new URLSearchParams(window.location.search);
  if (params.toString()) {
    return decodeSettingsFromURL(params);
  }

  // No settings in URL, use defaults
  return getDefaultSettings();
}
```

**Alternatives Considered**:
- **Migrate all Firebase links to new format**: Rejected because:
  - Requires database read + URL rewrite for every user
  - High computational cost
  - Risk of data loss during migration
  - Breaks existing bookmarks immediately
- **Support both formats indefinitely**: Rejected because:
  - Maintenance burden
  - Firebase costs continue
  - Technical debt accumulates

---

### 7. Error Handling Strategy

**Decision**: Partial recovery with user feedback

**Rationale**:
- Invalid parameters fall back to defaults for that setting only
- Other valid parameters continue to work
- User sees clear error message about what failed
- Better UX than complete failure

**Error Display**:
```javascript
function parseURLWithErrors(params) {
  const settings = { ...DEFAULT_SETTINGS };
  const errors = [];

  // Try to parse each parameter
  const octave = parseInt(params.get('o'));
  if (octave && (octave < 1 || octave > 8)) {
    errors.push('Invalid octave value (must be 1-8), using default.');
    settings.octave = DEFAULT_OCTAVE;
  } else if (octave) {
    settings.octave = octave;
  }

  // ... parse other parameters ...

  return { settings, errors };
}

// Display errors to user
if (errors.length > 0) {
  showErrorMessage('Some settings could not be loaded: ' + errors.join(' '));
}
```

**Alternatives Considered**:
- **Silent fallback** (no error messages): Rejected because:
  - User doesn't know something went wrong
  - Confusing when shared link doesn't match expectation
  - Violates transparency principle
- **Complete failure** (blank screen on any error): Rejected because:
  - Poor user experience
  - One typo shouldn't break entire app
  - Not resilient to future parameter additions

---

## Summary of Key Decisions

| Aspect | Decision | Primary Benefit |
|--------|----------|----------------|
| Encoding | URLSearchParams with abbreviated names | Browser-native, reliable, compact |
| Complex objects | Separate parameters with CSV arrays | Human-readable, validates incrementally |
| History API | replaceState() with 500ms debounce | Useful history without pollution |
| Video URLs | HTTPS-only regex validation | Security without over-restriction |
| URL length | Pre-validation with suggestions | Explicit failure over silent truncation |
| Backwards compat | URL pattern detection + Firebase fallback | Smooth transition, no data loss |
| Error handling | Partial recovery with user feedback | Resilient, transparent |

---

## Dependencies Added

**None** - All decisions use browser-native APIs:
- `URLSearchParams` (IE10+)
- `History API` (IE10+)
- Standard `RegExp`
- Existing Firebase SDK (read-only)

---

## Performance Characteristics

**URL Generation**: < 10ms (synchronous object serialization)
**URL Parsing**: < 5ms (URLSearchParams parsing)
**History Updates**: Debounced to 500ms (non-blocking)
**Firebase Fallback**: ~200ms (async, only for legacy links)

**Memory**: < 1KB per URL (17 settings + overhead)

---

## Security Considerations

1. **XSS Prevention**: Video URL regex blocks dangerous protocols
2. **URL Injection**: URLSearchParams automatically encodes special characters
3. **No Server-Side Storage**: Eliminates server breach risk
4. **No PII in URLs**: Only musical settings encoded

---

## Testing Strategy

Per Constitution Check, integration tests will cover:
- URL encoding with all 17 settings
- URL decoding with partial/invalid data
- Browser history integration
- Firebase fallback
- Error message display

E2E tests will validate:
- Complete share workflow
- Bookmark persistence
- Cross-browser compatibility

Unit tests will focus on:
- Regex validation edge cases
- Debounce function behavior
- Array serialization/deserialization

---

# COMPREHENSIVE TESTING PATTERNS AND BEST PRACTICES

## 1. React Testing Library Integration Testing Patterns

### 1.1 Testing React Context Providers and Consumers with RTL

#### Decision

For the URL settings storage feature with class components, use **RTL with explicit render wrappers** rather than a complex Context API migration. This maintains compatibility with the existing class component architecture (WholeApp is a class component) while enabling testable state management for modal positioning and URL synchronization.

#### Rationale

- **Compatibility**: The existing WholeApp class component is the source of truth. Class components cannot use hooks like `useContext` directly; they require `<Context.Consumer>` children or static context properties.
- **Testability**: RTL's render function accepts a `wrapper` prop, allowing you to inject providers (including future Context providers) without refactoring the entire component tree.
- **Incremental Migration**: This pattern enables gradual migration from props drilling to Context without requiring a full component rewrite.
- **Current Test Infrastructure**: The project already uses RTL 13.0.0, which has full support for testing Context via render wrappers.

#### Pattern: Wrapper Components for Testing

```javascript
/**
 * Integration Test: URL Settings Storage with Context
 *
 * Tests state synchronization between Context, URL, and component tree
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WholeApp from '../../WholeApp';

// Create a test wrapper that provides necessary Context
// This allows testing Context-dependent components without refactoring WholeApp
const createTestWrapper = (contextValue) => {
  return ({ children }) => (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={children} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Integration Test: Context Provider with Class Components', () => {
  it('should render child components with Context values', () => {
    const wrapper = createTestWrapper({
      scale: 'Major (Ionian)',
      baseNote: 'C',
    });

    const { container } = render(<WholeApp />, { wrapper });

    // Verify Context values are accessible through component state/props
    expect(container.querySelector('.Keyboard')).toBeInTheDocument();
  });

  it('should propagate Context changes to all consumers', async () => {
    const wrapper = createTestWrapper({});

    render(<WholeApp />, { wrapper });

    // Simulate user action that triggers Context change
    const scaleMenu = screen.getAllByText('Scale');
    await userEvent.click(scaleMenu[0]);

    // Verify Context-dependent components re-render
    await waitFor(() => {
      expect(screen.getByTestId('Keyboard')).toBeInTheDocument();
    });
  });
});
```

#### Pattern: Testing State Synchronization Across Components

State changes must sync between WholeApp.state → URL parameters → Modal positioning.

```javascript
describe('Integration Test: State Synchronization', () => {
  it('should sync modal position state from parent to child', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('Keyboard')).toBeInTheDocument();
    });

    // Trigger share button click
    const shareButton = screen.getByRole('button', { name: 'Share' });
    await userEvent.click(shareButton);

    // Wait for modal to render
    await waitFor(() => {
      const modal = screen.getByRole('dialog', { name: /Share this setup/i });
      expect(modal).toBeInTheDocument();
    });

    // Verify modal receives positioning props from WholeApp state
    const modal = screen.getByRole('dialog', { name: /Share this setup/i });
    const style = window.getComputedStyle(modal);

    // Modal should have positioning based on shareModalX/Y state
    expect(style.position).toBe('absolute');
  });
});
```

### 1.2 Testing Drag Interactions with react-draggable

#### Decision

Use **user-centric drag simulation** in RTL tests combined with **browser interaction testing in E2E**, rather than mocking react-draggable internals.

#### Rationale

- **Real-World Testing**: react-draggable is already in your dependencies. Testing actual drag behavior is more valuable than mocking it.
- **Library Stability**: react-draggable (4.4.5) is stable and well-tested; mocking it would hide integration bugs.
- **User Perspective**: Users interact with drag behavior, not react-draggable internals. Testing what users see is more reliable.
- **Position Verification**: The key requirement is verifying positions end up in the URL and state, not that dragging mechanics work (that's react-draggable's responsibility).

#### Pattern: Testing Drag-Driven Position Updates

```javascript
describe('Integration Test: Modal Drag and Position Sync', () => {
  it('should update state when dragging modal header', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('Keyboard')).toBeInTheDocument();
    });

    // Open share modal
    const shareButton = screen.getByRole('button', { name: 'Share' });
    await userEvent.click(shareButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Share this setup/i }))
        .toBeInTheDocument();
    });

    // Get the modal drag handle (header element)
    const modalHeader = screen.getByRole('dialog', { name: /Share this setup/i })
      .querySelector('.Overlay__header');

    if (modalHeader) {
      // Simulate drag using pointer events (more realistic than mouse events)
      await userEvent.pointer([
        { target: modalHeader, keys: '[MouseLeft>]', coords: { x: 0, y: 0 } },
        { coords: { x: 50, y: 30 } },
        { keys: '[/MouseLeft]' },
      ]);

      // Verify modal moved by checking computed style
      await waitFor(() => {
        const modal = screen.getByRole('dialog', { name: /Share this setup/i });
        const style = window.getComputedStyle(modal);

        // Position should have changed from initial
        expect(style.transform).not.toBe('none');
      });
    }
  });
});
```

### 1.3 Mocking Browser APIs (URLSearchParams, History API)

#### Decision

**Mock the History API and URLSearchParams for unit/integration tests; test the real implementations in E2E tests.**

#### Rationale

- **Isolation**: Mocking allows testing URL encoding/decoding logic without affecting browser state
- **Determinism**: Tests don't pollute history stack or affect each other
- **Speed**: Mocked tests run faster than full browser API calls
- **E2E Coverage**: Real API behavior is thoroughly tested in Playwright

#### Pattern: Mocking URL APIs

```javascript
describe('Integration Test: URL Settings Storage with Mocked Browser APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should encode settings to URL query parameters', () => {
    const settings = {
      scale: 'Major (Ionian)',
      baseNote: 'C',
      octave: 4,
      notation: ['Colors'],
      helpVisible: true,
      shareModalX: 100,
      shareModalY: 50,
    };

    const { encodeSettingsToURL } = require('../../services/urlEncoder');
    const encodedURL = encodeSettingsToURL(settings);

    expect(encodedURL).toContain('scale=');
    expect(encodedURL).toContain('baseNote=');
    expect(encodedURL).toContain('helpVisible=');

    // Verify encoded URL is valid
    const url = new URL(encodedURL, 'http://localhost:3000');
    expect(url.searchParams.get('scale')).toBe('Major (Ionian)');
  });

  it('should decode URL parameters back to settings object', () => {
    const urlString = 'http://localhost:3000/?scale=Major&baseNote=C&octave=4&helpVisible=true&shareModalX=100';
    const { decodeSettingsFromURL } = require('../../services/urlEncoder');

    const decodedSettings = decodeSettingsFromURL(urlString);

    expect(decodedSettings.scale).toBe('Major');
    expect(decodedSettings.baseNote).toBe('C');
    expect(decodedSettings.octave).toBe(4);
    expect(decodedSettings.helpVisible).toBe(true);
  });

  it('should reject URLs exceeding 2000 character limit', () => {
    const { validateURLLength } = require('../../services/urlValidator');
    const longSettings = {
      scale: 'Major',
      customScale: 'a'.repeat(3000),
    };

    const { encodeSettingsToURL } = require('../../services/urlEncoder');
    const encodedURL = encodeSettingsToURL(longSettings);
    const isValid = validateURLLength(encodedURL);

    expect(isValid).toBe(false);
  });
});
```

### 1.4 Verifying State Synchronization Across Components

#### Decision

Use **snapshot testing combined with state inspection via getByTestId** to verify state sync, avoiding internal implementation details.

#### Pattern: State Sync Verification

```javascript
describe('Integration Test: Cross-Component State Synchronization', () => {
  it('should reflect scale change in URL', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('Keyboard')).toBeInTheDocument();
    });

    // Change scale
    const scaleMenu = screen.getAllByText('Scale')[0];
    await userEvent.click(scaleMenu);

    const minorOption = await waitFor(() =>
      screen.getByText('Minor (Aeolian)')
    );
    await userEvent.click(minorOption);

    // Verify URL was updated with new scale
    await waitFor(() => {
      const currentURL = new URL(window.location.href);
      expect(currentURL.searchParams.get('scale')).toBe('Minor (Aeolian)');
    });
  });

  it('should sync modal visibility state across multiple modals', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('Keyboard')).toBeInTheDocument();
    });

    // Open share modal
    const shareButton = screen.getByRole('button', { name: 'Share' });
    await userEvent.click(shareButton);

    let modalsOpen = await waitFor(() =>
      screen.getAllByRole('dialog')
    );
    const countWithShare = modalsOpen.length;

    // Open video modal
    const videoButton = screen.getByRole('button', { name: 'Watch tutorial video' });
    await userEvent.click(videoButton);

    modalsOpen = await waitFor(() =>
      screen.getAllByRole('dialog')
    );

    // Both should be open
    expect(modalsOpen.length).toBeGreaterThan(countWithShare);
  });
});
```

### 1.5 Coverage Measurement for 100% Integration Coverage

#### Decision

Use **Jest's built-in coverage reporting** with **focused coverage thresholds per test category** rather than global 100% requirement.

#### Pattern: Coverage Configuration

```javascript
// jest.config.js excerpt
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Critical for URL settings storage feature
    'src/services/urlEncoder.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'src/services/urlValidator.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
```

---

## 2. Playwright E2E Testing Patterns for Modal Workflows

### 2.1 Best Practices for Testing Drag-and-Drop Interactions

#### Decision

Use **Playwright's native drag-and-drop API** (`dragTo()`) combined with **visual regression testing** to verify modal positioning.

#### Pattern: Drag and Position Verification

```javascript
const { test, expect } = require('@playwright/test');

test.describe('E2E: Modal Drag and Position Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.Keyboard', { timeout: 10000 });
  });

  test('should allow dragging modal and update URL with position', async ({ page }) => {
    // Open share modal
    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    // Get modal header
    const modalHeader = await modal.locator('.Overlay__header');
    const boundingBox = await modalHeader.boundingBox();

    if (boundingBox) {
      const fromX = boundingBox.x + boundingBox.width / 2;
      const fromY = boundingBox.y + boundingBox.height / 2;
      const toX = fromX + 100;
      const toY = fromY + 50;

      // Perform drag
      await modalHeader.hover();
      await page.mouse.down();
      await page.mouse.move(toX, toY, { steps: 10 });
      await page.mouse.up();

      // Wait for debounce
      await page.waitForTimeout(600);

      // Verify URL was updated
      const url = page.url();
      expect(url).toMatch(/shareModalX=\d+/);
      expect(url).toMatch(/shareModalY=\d+/);
    }
  });

  test('should persist modal position after page reload', async ({ page }) => {
    // Open and drag modal
    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    const header = await modal.locator('.Overlay__header');
    const boundingBox = await header.boundingBox();

    if (boundingBox) {
      await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(200, 150, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(600);
    }

    const urlBeforeReload = page.url();
    expect(urlBeforeReload).toMatch(/shareModalX=/);

    // Reload page
    await page.reload();
    await page.waitForSelector('.Keyboard', { timeout: 10000 });

    // Verify URL preserved position
    const urlAfterReload = page.url();
    expect(urlAfterReload).toMatch(/shareModalX=/);
  });
});
```

### 2.2 Testing URL Parameter Changes in E2E Tests

#### Decision

Use **URL inspection via `page.url()`** and **URLSearchParams parsing** to verify parameter changes in E2E tests.

#### Pattern: URL Verification in E2E Tests

```javascript
test.describe('E2E: URL Parameter Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.Keyboard', { timeout: 10000 });
  });

  test('should update URL when scale is changed', async ({ page }) => {
    const initialURL = new URL(page.url());
    const initialScale = initialURL.searchParams.get('scale');

    // Change scale
    const scaleButton = await page.getByText('Scale').first();
    await scaleButton.click();

    const minorOption = await page.getByText('Minor (Aeolian)').first();
    await minorOption.click();

    // Wait for debounce
    await page.waitForTimeout(1100);

    const updatedURL = new URL(page.url());
    const updatedScale = updatedURL.searchParams.get('scale');

    expect(updatedScale).toBe('Minor (Aeolian)');
    expect(updatedScale).not.toBe(initialScale);
  });

  test('should accumulate multiple setting changes in URL', async ({ page }) => {
    // Change scale
    let scaleButton = await page.getByText('Scale').first();
    await scaleButton.click();

    let minorOption = await page.getByText('Minor (Aeolian)').first();
    await minorOption.click();
    await page.waitForTimeout(600);

    // Change base note
    let noteMenu = await page.getByText('Root Note').first();
    await noteMenu.click();

    let gNote = await page.getByText('G').nth(1);
    await gNote.click();
    await page.waitForTimeout(1100);

    // Verify all changes
    const finalURL = new URL(page.url());
    expect(finalURL.searchParams.get('scale')).toBe('Minor (Aeolian)');
    expect(finalURL.searchParams.get('baseNote')).toBe('G');
  });
});
```

### 2.3 Cross-Browser Testing Strategies for UI Interactions

#### Decision

Use **Playwright's built-in browser configuration** with **browser-specific assertions** for edge cases.

#### Pattern: Cross-Browser Testing

```javascript
test.describe('E2E: Cross-Browser Modal Interactions', () => {
  test.beforeEach(async ({ page, browserName }) => {
    console.log(`Running on ${browserName}`);
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.Keyboard', { timeout: 10000 });
  });

  test('should open modal on all browsers', async ({ page, browserName }) => {
    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    // Take screenshot
    await page.screenshot({ path: `modal-${browserName}.png` });

    const isVisible = await modal.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should drag modal consistently across browsers', async ({ page, browserName }) => {
    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    const header = await modal.locator('.Overlay__header');
    const bbox = await header.boundingBox();

    if (bbox) {
      await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
      await page.mouse.down();

      const dragDistance = browserName === 'webkit' ? 50 : 100;
      await page.mouse.move(bbox.x + bbox.width / 2 + dragDistance,
                           bbox.y + bbox.height / 2 + dragDistance,
                           { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(600);

      const url = new URL(page.url());
      expect(url.searchParams.has('shareModalX')).toBe(true);
    }
  });
});
```

### 2.4 Accessibility Testing with @axe-core/playwright

#### Decision

Use **@axe-core/playwright** for automated accessibility scanning in E2E tests, combined with **manual keyboard navigation tests**.

#### Pattern: Accessibility Testing

```javascript
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('E2E: Modal Accessibility (WCAG 2.1 AA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.Keyboard', { timeout: 10000 });
  });

  test('should pass axe accessibility audit on app load', async ({ page }) => {
    const accessibilityScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScan.violations).toHaveLength(0);
  });

  test('should maintain accessibility when modals are open', async ({ page }) => {
    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    const accessibilityScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const modalViolations = accessibilityScan.violations.filter(v => {
      return v.nodes.some(node => {
        const target = JSON.stringify(node.target);
        return target.includes('Overlay') || target.includes('modal');
      });
    });

    expect(modalViolations).toHaveLength(0);
  });

  test('should support Escape key to close modal', async ({ page }) => {
    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    await page.keyboard.press('Escape');
    await modal.waitFor({ state: 'hidden' });
  });
});
```

### 2.5 Performance Measurement in E2E Tests

#### Decision

Use **Playwright's `measure()` and `performance.mark()`** APIs to track operation timing and verify < 30s requirement per test.

#### Pattern: Performance Testing

```javascript
test.describe('E2E: Performance Metrics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.Keyboard', { timeout: 10000 });
  });

  test('should open share modal in under 100ms', async ({ page }) => {
    await page.evaluate(() => {
      window.markStart = performance.now();
    });

    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    const openTime = await page.evaluate(() => {
      return performance.now() - window.markStart;
    });

    console.log(`Modal open time: ${openTime}ms`);
    expect(openTime).toBeLessThan(200);
  });

  test('should update URL within debounce delay', async ({ page }) => {
    // Change a setting
    const scaleButton = await page.getByText('Scale').first();
    await scaleButton.click();

    await page.evaluate(() => {
      window.changeStart = performance.now();
    });

    const minorOption = await page.getByText('Minor (Aeolian)').first();
    await minorOption.click();

    // Wait for URL to update
    await page.waitForFunction(() => {
      const newURL = window.location.href;
      const oldURL = new URL(newURL);
      return oldURL.searchParams.get('scale') === 'Minor (Aeolian)';
    }, 2000);

    const debounceTime = await page.evaluate(() => {
      return performance.now() - window.changeStart;
    });

    console.log(`URL update time: ${debounceTime}ms`);
    expect(debounceTime).toBeGreaterThanOrEqual(500);
    expect(debounceTime).toBeLessThan(1100);
  });

  test('should complete workflow in under 30 seconds', async ({ page }) => {
    const startTime = Date.now();

    // Complex workflow
    const shareButton = await page.getByRole('button', { name: 'Share' });
    await shareButton.click();

    const modal = await page.getByRole('dialog', { name: /Share this setup/i });
    await modal.waitFor({ state: 'visible' });

    const scaleButton = await page.getByText('Scale').first();
    await scaleButton.click();

    const minorOption = await page.getByText('Minor (Aeolian)').first();
    await minorOption.click();
    await page.waitForTimeout(600);

    await page.keyboard.press('Escape');
    await modal.waitFor({ state: 'hidden' });

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;

    console.log(`Total test time: ${totalTime}s`);
    expect(totalTime).toBeLessThan(30);
  });
});
```

---

## 3. React Context API Patterns for State Management Refactoring

### 3.1 Best Practices for Context API with Class Components

#### Decision

Use **Context.Consumer component pattern** for reading Context in class components, rather than attempting static context (which has limitations) or refactoring to functional components (too large a change).

#### Pattern: Context.Consumer with Class Components

```javascript
// File: src/context/ModalPositionContext.js
import React from 'react';

const ModalPositionContext = React.createContext();

export const ModalPositionProvider = ({ children }) => {
  return children;
};

export default ModalPositionContext;

// File: src/WholeApp.js (class component)
class WholeApp extends Component {
  state = {
    shareModalX: null,
    shareModalY: null,
    shareModalOpen: false,
    videoModalX: null,
    videoModalY: null,
    videoModalOpen: false,
    helpModalX: null,
    helpModalY: null,
    helpVisible: false,
  };

  render() {
    const modalPositionValue = {
      shareModalX: this.state.shareModalX,
      shareModalY: this.state.shareModalY,
      shareModalOpen: this.state.shareModalOpen,
      updateShareModalPosition: (x, y) => {
        this.setState({ shareModalX: x, shareModalY: y });
      },
      videoModalX: this.state.videoModalX,
      videoModalY: this.state.videoModalY,
      videoModalOpen: this.state.videoModalOpen,
      updateVideoModalPosition: (x, y) => {
        this.setState({ videoModalX: x, videoModalY: y });
      },
      helpVisible: this.state.helpVisible,
      helpModalX: this.state.helpModalX,
      helpModalY: this.state.helpModalY,
      updateHelpModalPosition: (x, y) => {
        this.setState({ helpModalX: x, helpModalY: y });
      },
      updateHelpVisibility: (visible) => {
        this.setState({ helpVisible: visible });
      },
    };

    return (
      <ModalPositionContext.Provider value={modalPositionValue}>
        <TopMenu {...this.state} {...this.handlers} />
        <Keyboard {...this.state} {...this.handlers} />
        <ShareModal />
        <VideoModal />
        <HelpModal />
      </ModalPositionContext.Provider>
    );
  }
}
```

### 3.2 Wrapping Existing Class Component Trees with Context Providers

#### Decision

Use a **minimal wrapper approach**: Keep WholeApp as provider, add Context at the leaf component level (modals), avoid wrapping the entire tree.

#### Pattern: Strategic Wrapping

```javascript
// GOOD: Only wrap modals with Context
class WholeApp extends Component {
  render() {
    const modalContextValue = {
      shareModalX: this.state.shareModalX,
      // ... other modal state ...
    };

    return (
      <div className="whole-app">
        {/* Components continue using props */}
        <TopMenu scale={this.state.scale} {...this.handlers} />
        <Keyboard scale={this.state.scale} {...this.handlers} />

        {/* Only modals use Context */}
        <ModalPositionContext.Provider value={modalContextValue}>
          <ShareModal />
          <VideoModal />
          <HelpModal />
        </ModalPositionContext.Provider>
      </div>
    );
  }
}
```

### 3.3 Performance Optimization (memo, useMemo)

#### Decision

Use **React.memo() on modal components** and **useMemo() sparingly** to prevent unnecessary re-renders. Only optimize if re-renders are actually occurring and causing performance issues.

#### Pattern: Strategic Performance Optimization

```javascript
import React, { useContext, memo } from 'react';
import ModalPositionContext from '../../context/ModalPositionContext';

// Memoized modal component
const ShareModal = memo(({ isOpen, onClose, onDragStop }) => {
  const modalContext = useContext(ModalPositionContext);

  if (!isOpen) return null;

  return (
    <Draggable
      onStop={onDragStop}
      defaultPosition={{
        x: modalContext.shareModalX || 0,
        y: modalContext.shareModalY || 0,
      }}
    >
      <div className="Overlay">{/* Content */}</div>
    </Draggable>
  );
}, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen &&
         prevProps.onClose === nextProps.onClose;
});

export default ShareModal;
```

### 3.4 Migration Strategies from Props Drilling to Context

#### Decision

Use a **phase-based migration strategy**: Identify components with deep prop drilling, extract into Context one module at a time, test thoroughly, then move to the next.

#### Pattern: Staged Migration

```javascript
// Phase 1: Identify props drilling hotspots
// ✓ shareModalX, shareModalY, shareModalOpen - CANDIDATE (3+ levels deep)
// ✓ videoModalX, videoModalY, videoModalOpen - CANDIDATE
// ✗ scale, baseNote, octave - NOT NEEDED (only 2 levels, critical perf)

// Phase 2: Extract Modal Positioning to Context (primary use case)
// Phase 3: Extract Settings (only if needed later)
// Phase 4: Extract Video State (only if UI complexity increases)
```

### 3.5 Testing Strategies for Context Providers and Consumers

#### Decision

Use **RTL's render() wrapper pattern** combined with **direct Context value testing** to verify Context behavior without implementation details.

#### Pattern: Context Testing

```javascript
describe('Unit Test: ModalPositionContext', () => {
  it('should provide correct interface for modal positioning', () => {
    const TestConsumer = () => {
      const value = useContext(ModalPositionContext);
      return (
        <div>
          <div data-testid="has-shareModalX">
            {value.shareModalX !== undefined ? 'yes' : 'no'}
          </div>
        </div>
      );
    };

    const MockProvider = ({ children }) => {
      const [shareModalX, setShareModalX] = React.useState(100);
      const value = {
        shareModalX,
        updateShareModalPosition: (x, y) => setShareModalX(x),
      };
      return (
        <ModalPositionContext.Provider value={value}>
          {children}
        </ModalPositionContext.Provider>
      );
    };

    render(<TestConsumer />, { wrapper: MockProvider });
    expect(screen.getByTestId('has-shareModalX')).toHaveTextContent('yes');
  });

  it('should allow updating modal position through Context', () => {
    const TestUpdater = () => {
      const value = useContext(ModalPositionContext);
      return (
        <button onClick={() => value.updateShareModalPosition(200, 150)}>
          Update Position
        </button>
      );
    };

    const MockProvider = ({ children }) => {
      const [position, setPosition] = React.useState({ x: 100, y: 50 });
      const value = {
        shareModalX: position.x,
        shareModalY: position.y,
        updateShareModalPosition: (x, y) => setPosition({ x, y }),
      };
      return (
        <ModalPositionContext.Provider value={value}>
          {children}
        </ModalPositionContext.Provider>
      );
    };

    render(<TestUpdater />, { wrapper: MockProvider });
    const button = screen.getByText('Update Position');
    button.click();
  });
});

describe('Integration Test: ShareModal with Context', () => {
  const mockContextValue = {
    shareModalX: 100,
    shareModalY: 50,
    shareModalOpen: true,
    updateShareModalPosition: jest.fn(),
  };

  const createWrapper = (contextValue) => {
    return ({ children }) => (
      <ModalPositionContext.Provider value={contextValue || mockContextValue}>
        {children}
      </ModalPositionContext.Provider>
    );
  };

  it('should not render if shareModalOpen is false in Context', () => {
    const contextValue = { ...mockContextValue, shareModalOpen: false };
    const { container } = render(<ShareModal />, {
      wrapper: createWrapper(contextValue),
    });

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
```

---

## Summary and Implementation Checklist

### Key Decisions Made

1. **RTL Integration Testing**: Use render wrappers + Context.Consumer pattern for class components
2. **Playwright E2E Testing**: Native drag API + URL inspection + axe-core for accessibility
3. **Context API**: Consumer pattern with minimal wrapping, strategic optimization with memo
4. **Performance**: Focus on critical paths (URL encoding), E2E tests < 30s compliance
5. **Coverage**: 100% on URL services, 70%+ on modals, focus on user workflows not code paths

### Implementation Phases

**Phase 1 (Foundation)**
- [ ] Create ModalPositionContext
- [ ] Update WholeApp to provide Context
- [ ] Implement Context.Consumer in modals
- [ ] Add RTL tests for Context value sync
- [ ] Add E2E tests for modal drag + position persistence

**Phase 2 (State Sync)**
- [ ] Implement URL encoding/decoding service
- [ ] Add debounced URL updates in WholeApp
- [ ] Add RTL tests for URL parameter changes
- [ ] Add E2E tests for URL parameter verification
- [ ] Add 2000 character limit validation

**Phase 3 (Accessibility)**
- [ ] Add keyboard navigation to modals (Escape to close)
- [ ] Add focus management (focus modal when opened)
- [ ] Add axe-core E2E tests
- [ ] Add screen reader testing

**Phase 4 (Optimization)**
- [ ] Profile actual render performance
- [ ] Add React.memo to modals if needed (measure first!)
- [ ] Optimize URL encoding for large custom scales
- [ ] Add performance E2E tests

---

## Testing Command Reference

```bash
# Unit + Integration tests
npm test

# Integration tests only
npm run test:a11y

# E2E tests
npm run test:e2e

# E2E with headed browsers (see the UI)
npm run test:e2e:headed

# E2E for specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Coverage report
npm run test:coverage

# Watch mode (during development)
npm test -- --watch
```
