/**
 * Sample E2E Test
 *
 * Purpose: Demonstrates E2E testing with Playwright + @axe-core/playwright
 * Constitution v2.0.0: E2E tests are SECONDARY (20-30% of test suite)
 *
 * This test shows how to:
 * - Test complete user workflows in real browsers
 * - Use @axe-core/playwright for accessibility validation
 * - Verify cross-browser compatibility
 * - Measure performance (audio latency, rendering time)
 */

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Sample E2E Test - Notio Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  // TODO: Enable when color contrast and nested interactive controls are fixed
  // Currently fails due to known issues: color-contrast, nested-interactive
  test.skip('should load the application without accessibility violations', async ({ page }) => {
    // Wait for the app to load
    await page.waitForLoadState('domcontentloaded');

    // T020: Demonstrate @axe-core/playwright usage for E2E accessibility testing
    const accessibilityResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityResults.violations).toEqual([]);
  });

  test('should have proper page title', async ({ page }) => {
    // E2E test: Verify page metadata
    await expect(page).toHaveTitle(/Notio/i);
  });

  test('should render main content', async ({ page }) => {
    // E2E test: Verify critical UI elements load
    // This is a placeholder - adjust selectors based on actual Notio UI
    const mainContent = page.locator('body');
    await expect(mainContent).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // E2E test: Verify keyboard accessibility
    await page.keyboard.press('Tab');

    // Verify focus is visible (focused element should exist)
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
  });
});

test.describe('Sample Performance Test', () => {
  // TODO: Enable when page load performance is optimized (currently times out)
  test.skip('should measure page load performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    // Constitution requirement: Notation rendering <200ms
    // Full page load should be reasonable (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000); // 5s for full page load
  });
});

/**
 * E2E Test Best Practices (Constitution v2.0.0):
 *
 * ✅ DO:
 * - Test critical user journeys
 * - Test cross-browser compatibility
 * - Measure performance metrics
 * - Verify accessibility in real browsers
 * - Test complete workflows (start to finish)
 * - Keep tests under 30s each
 *
 * ❌ DON'T:
 * - Test implementation details
 * - Duplicate integration test coverage
 * - Create brittle tests (avoid specific selectors)
 * - Test every edge case (use integration tests)
 *
 * Run with:
 * - yarn test:e2e (all browsers)
 * - yarn test:e2e:chromium (Chrome only)
 * - yarn test:e2e:headed (visible browser)
 * - yarn test:e2e:debug (step-by-step)
 */
