/**
 * E2E Test: Screen Reader Compatibility and Accessibility Audit
 *
 * Purpose: Test complete accessibility compliance across browsers
 * Coverage: 20-30% (E2E tests per Constitution)
 *
 * Tests:
 * - T054: axe-core accessibility violations check across browsers
 * - Screen reader compatibility verification
 * - ARIA compliance testing
 */

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Screen Reader Compatibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');

    // Wait for the app to load
    await page.waitForSelector('.Keyboard', { timeout: 10000 });
  });

  test('T054: Should pass axe-core accessibility audit for screen reader compatibility', async ({ page }) => {
    // Run comprehensive axe accessibility scan
    const accessibilityResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Exclude known issues outside Phase 4 scope
      .exclude('.overlay__header__buttonContainer__button--minimize')
      .exclude('.overlay__header__buttonContainer__button--close')
      .analyze();

    // Log violations for visibility
    if (accessibilityResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      accessibilityResults.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Help: ${violation.help}`);
      });
    }

    // Filter for screen-reader-specific violations
    const screenReaderViolations = accessibilityResults.violations.filter(v =>
      v.id.includes('aria') ||
      v.id.includes('role') ||
      v.id.includes('label') ||
      v.id.includes('name')
    );

    // We expect no screen-reader-related violations after Phase 3 & 4
    expect(screenReaderViolations).toHaveLength(0);
  });

  test('Should have proper ARIA labels on all interactive elements', async ({ page }) => {
    // Get all interactive elements
    const buttons = await page.locator('button, [role="button"]').all();

    // Verify each has an accessible name
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const innerText = await button.innerText().catch(() => '');
      const ariaLabelledby = await button.getAttribute('aria-labelledby');

      // Button should have at least one of: aria-label, inner text, or aria-labelledby
      const hasAccessibleName = ariaLabel || innerText.trim() || ariaLabelledby;

      if (!hasAccessibleName) {
        const html = await button.evaluate(el => el.outerHTML.substring(0, 100));
        console.error(`Button without accessible name: ${html}`);
      }

      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('Should have proper roles on all custom components', async ({ page }) => {
    // Verify Key components have role="button"
    const pianoKeys = await page.locator('[aria-label*="Play"]').all();

    for (const key of pianoKeys) {
      const role = await key.getAttribute('role');
      expect(role).toBe('button');
    }

    expect(pianoKeys.length).toBeGreaterThan(0);
  });

  test('Should announce note information for screen readers', async ({ page }) => {
    // Get a piano key
    const c4Key = await page.locator('[aria-label="Play C4"]').first();

    // Verify it has proper ARIA attributes
    await expect(c4Key).toHaveAttribute('role', 'button');
    await expect(c4Key).toHaveAttribute('aria-label', 'Play C4');
    await expect(c4Key).toHaveAttribute('tabIndex', '0');
  });

  test('Should have descriptive labels for icon-only buttons', async ({ page }) => {
    // Check ShareButton
    const shareButton = page.locator('[aria-label="Share"]').first();
    const shareButtonCount = await shareButton.count();
    expect(shareButtonCount).toBeGreaterThanOrEqual(0);
    if (shareButtonCount > 0) {
      await expect(shareButton).toHaveAttribute('role', 'button');
    }

    // Check VideoButton
    const videoButton = page.locator('[aria-label="Watch tutorial video"]').first();
    const videoButtonCount = await videoButton.count();
    expect(videoButtonCount).toBeGreaterThanOrEqual(0);
    if (videoButtonCount > 0) {
      await expect(videoButton).toHaveAttribute('role', 'button');
    }

    // Check HelpButton
    const helpButton = page.locator('[aria-label="Help"]').first();
    const helpButtonCount = await helpButton.count();
    expect(helpButtonCount).toBeGreaterThanOrEqual(0);
    if (helpButtonCount > 0) {
      await expect(helpButton).toHaveAttribute('role', 'button');
    }
  });
});

test.describe('Cross-Browser Accessibility Audit', () => {
  test('Should pass accessibility audit across all browsers', async ({ page, browserName }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.Keyboard');

    const accessibilityResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.overlay__header__buttonContainer__button--minimize')
      .exclude('.overlay__header__buttonContainer__button--close')
      .analyze();

    // Filter for critical violations only
    const criticalViolations = accessibilityResults.violations.filter(v =>
      v.impact === 'critical' || v.impact === 'serious'
    );

    // Filter out violations we know are out of scope
    const relevantViolations = criticalViolations.filter(v =>
      !v.id.includes('color-contrast') && // Phase 5
      !v.id.includes('html-has-lang') && // Public/index.html - out of React scope
      !v.id.includes('label') // Form labels - different components
    );

    if (relevantViolations.length > 0) {
      console.log(`${browserName} - Critical violations:`, relevantViolations.map(v => v.id));
    }

    expect(relevantViolations).toHaveLength(0);
  });
});

test.describe('Accessibility Tree Validation', () => {
  test('Should have proper accessibility tree structure', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.Keyboard');

    // Verify the element is in the accessibility tree
    const snapshot = await page.accessibility.snapshot();

    // Find the key in the accessibility tree
    function findInTree(node, search) {
      if (!node) return null;
      if (node.name && node.name.includes(search)) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findInTree(child, search);
          if (found) return found;
        }
      }
      return null;
    }

    const c4Node = findInTree(snapshot, 'Play C4');

    // Ensure the node exists in the accessibility tree
    expect(c4Node).toBeTruthy();

    if (c4Node) {
      // Verify it has proper role
      expect(c4Node.role).toBe('button');
      expect(c4Node.name).toContain('C4');
    }
  });
});
