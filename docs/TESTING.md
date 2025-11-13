# Testing Guide - Notio

## Constitutional Testing Principles (v2.0.0)

Notio follows **integration-first testing** principles based on Rainer Hahnekamp's research:

- **Integration Tests**: 60-70% of test suite (PRIMARY)
- **E2E Tests**: 20-30% of test suite (SECONDARY)
- **Unit Tests**: 10-20% of test suite (MINIMAL - edge cases only)

### Why Integration-First?

Integration tests provide:
- ✅ High confidence in real user workflows
- ✅ Tests that survive refactoring
- ✅ Natural coverage of implementation details
- ✅ Better cost/benefit ratio

## Quick Start

For practical examples and copy-paste templates, see:
**[Constitutional Testing Quickstart Guide](../specs/001-constitution-compliance/quickstart.md)**

This guide includes:
- Integration test templates for musical components
- E2E test patterns with Playwright
- Unit test examples for complex algorithms
- Accessibility testing with jest-axe and @axe-core/playwright

## Test Commands

```bash
# Integration and unit tests (Jest)
yarn test                    # Run all Jest tests in watch mode
yarn test --coverage        # Generate coverage report (100% required)
yarn test:a11y              # Run accessibility integration tests only

# E2E tests (Playwright)
yarn test:e2e               # Run E2E tests in all browsers
yarn test:e2e:headed        # Run with visible browser windows
yarn test:e2e:debug         # Run with Playwright Inspector
yarn test:e2e:chromium      # Run in Chrome only
yarn test:e2e:firefox       # Run in Firefox only
yarn test:e2e:webkit        # Run in Safari only
```

## Test Directory Structure

```
notio/
├── src/
│   ├── __integration__/          # Integration tests (60-70%)
│   │   ├── musical-components/   # ColorKey, MusicalStaff, etc.
│   │   ├── accessibility/        # WCAG 2.1 AA compliance tests
│   │   └── workflows/            # User journey tests
│   └── __test__/                 # Unit tests (10-20%)
│       └── utils/                # Edge cases for complex algorithms
└── e2e/                          # E2E tests (20-30%)
    ├── critical-paths/           # Core user workflows
    └── performance/              # Latency and rendering benchmarks
```

## When to Write Each Type of Test

### Integration Tests (Primary - 60-70%)

Write integration tests for:
- ✅ React component behavior and interactions
- ✅ ColorKey + MusicalStaff integration
- ✅ MIDI input/output handling
- ✅ Accessibility (WCAG 2.1 AA with jest-axe)
- ✅ Most user workflows

**Example**: Testing ColorKey component with user interactions
```javascript
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import ColorKey from '../ColorKey';

it('should allow selecting notes and be accessible', async () => {
  const { container } = render(<ColorKey />);

  // Test behavior
  const cButton = screen.getByRole('button', { name: /C/i });
  await userEvent.click(cButton);
  expect(cButton).toHaveClass('selected');

  // Test accessibility
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### E2E Tests (Secondary - 20-30%)

Write E2E tests for:
- ✅ Complete user journeys (end-to-end workflows)
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)
- ✅ Performance metrics (audio latency <100ms, rendering <200ms)
- ✅ Accessibility in real browsers (color contrast)

**Example**: Testing complete notation creation workflow
```javascript
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('should create musical notation without accessibility violations', async ({ page }) => {
  await page.goto('/');

  // Complete workflow
  await page.click('[aria-label="Select C"]');
  await page.click('[aria-label="Add to staff"]');

  // Verify result
  const staff = page.locator('[role="region"][aria-label="Musical notation"]');
  await expect(staff).toContainText('C');

  // Verify accessibility
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### Unit Tests (Minimal - 10-20%)

Write unit tests ONLY for:
- ✅ Complex algorithm edge cases
- ✅ Mathematical calculations (intervals, frequencies)
- ✅ Boundary conditions (0, max, min values)
- ✅ Error handling for exceptional inputs

**Example**: Testing musical interval calculations
```javascript
describe('calculateInterval', () => {
  it('should handle octave intervals', () => {
    expect(calculateInterval('C4', 'C5')).toBe(12);
  });

  it('should throw error for invalid notes', () => {
    expect(() => calculateInterval('invalid', 'C4'))
      .toThrow('Invalid note format');
  });
});
```

## Accessibility Testing

Notio uses a **multi-layered accessibility strategy**:

### Layer 1: Static Analysis (Development)
```bash
# ESLint with jsx-a11y/strict rules
yarn lint
```

### Layer 2: Integration Tests (jest-axe)
```javascript
import { axe } from 'jest-axe';

it('should be accessible', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Layer 3: E2E Tests (@axe-core/playwright)
```javascript
const AxeBuilder = require('@axe-core/playwright').default;

test('should be accessible in real browser', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

### Layer 4: Development Runtime (@axe-core/react)
Open browser console in development mode to see real-time accessibility audits.

## Coverage Requirements

Notio requires **100% code coverage** (enforced in `jest.config.js`):

```javascript
coverageThreshold: {
  global: {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
}
```

Generate coverage reports:
```bash
yarn test --coverage
```

View HTML report: `open coverage/lcov-report/index.html`

## Test Distribution Validation

Verify your test suite meets constitutional requirements:

```bash
node scripts/validate-test-distribution.js
```

Expected output:
```
Integration Tests: X (60-70%)
E2E Tests: Y (20-30%)
Unit Tests: Z (10-20%)

✅ PASS: Test distribution meets constitutional requirements!
```

## Best Practices

### DO ✅
- Test user behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility in every integration/E2E test
- Mock external dependencies (Firebase, Tone.js)
- Keep E2E tests under 30 seconds each

### DON'T ❌
- Test simple getters/setters
- Use test IDs or CSS class selectors
- Duplicate integration test coverage in unit tests
- Test obvious code without edge cases
- Write brittle tests that break on refactoring

## CI/CD Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Every pull request (GitHub Actions)
- Before deployment (Netlify build)

All tests must pass with 100% coverage before merging.

## Performance Benchmarks

E2E tests validate constitutional performance requirements:

- ✅ Audio latency: <100ms (MIDI → Tone.js playback)
- ✅ Notation rendering: <200ms (VexFlow canvas rendering)
- ✅ Page load: <5 seconds (full application initialization)

## Troubleshooting

### Tests timing out
- Check for unresolved promises
- Ensure `await` is used with async operations
- Verify mock timers are advanced properly

### E2E tests failing in CI but passing locally
- Check browser versions in `playwright.config.js`
- Verify web server starts successfully (`webServer.timeout`)
- Ensure audio testing flags are set in `launchOptions`

### Coverage not reaching 100%
- Run `yarn test --coverage` to see uncovered lines
- Add integration tests for uncovered workflows
- Ensure mocks properly simulate edge cases

## Resources

- [Constitutional Quickstart Guide](../specs/001-constitution-compliance/quickstart.md)
- [Constitution v2.0.0](./.specify/memory/constitution.md)
- [Feature Specification](../specs/001-constitution-compliance/spec.md)
- [Rainer Hahnekamp's Integration Testing Principles](https://www.rainerhahnekamp.com/en/integration-tests-are-better/)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)

---

**Questions?** See [quickstart.md](../specs/001-constitution-compliance/quickstart.md) for practical examples.
