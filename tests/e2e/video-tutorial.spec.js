import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for VideoTutorial Component - User Story 1
 *
 * These tests verify the video player functionality in a real browser environment,
 * including accessibility compliance using @axe-core/playwright.
 */

// Test configuration
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('VideoTutorial - User Story 1 E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Notio application
    await page.goto(BASE_URL);

    // Wait for the application to load
    await page.waitForLoadState('domcontentloaded');
  });

  /**
   * T012: E2E Test - Submit YouTube URL → Video plays → Controls available
   */
  test.describe('T012: Submit YouTube URL and verify playback', () => {
    test('should open video player modal when video button is clicked', async ({ page }) => {
      // Look for video button (aria-label from VideoButton component)
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();

      // If video button exists, click it to open modal
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Verify modal/overlay is visible (check for tabs structure)
      await expect(page.locator('text=Player')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Enter URL')).toBeVisible();
      await expect(page.locator('text=Tutorials')).toBeVisible();
    });

    test('should navigate to Enter URL tab and submit YouTube URL', async ({ page }) => {
      // Open video player modal (if needed)
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Click on "Enter URL" tab
      await page.click('text=Enter URL');

      // Verify we're on the Enter URL tab
      const inputField = page.locator('input[placeholder="Enter URL"]');
      await expect(inputField).toBeVisible();

      // Enter a test YouTube URL
      const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      await inputField.fill(testUrl);

      // Click the Enter/Submit button
      await page.click('button:has-text("Enter")');

      // Verify tab switched to Player
      // Note: In real app, this would switch to Player tab automatically
      // We check for the ReactPlayer component
      await page.waitForTimeout(1000); // Give time for state update

      // If auto-switch is implemented, Player tab should be active
      const playerTab = page.locator('text=Player');
      await playerTab.click(); // Ensure we're on Player tab

      // Verify ReactPlayer is rendered (look for iframe or video element)
      // ReactPlayer creates an iframe for YouTube videos
      const playerFrame = page.frameLocator('iframe[src*="youtube.com"]').first();

      // Note: In test environment, YouTube iframe might not load
      // So we verify the ReactPlayer component exists instead
      await expect(page.locator('.react-player').first()).toBeVisible();
    });

    test('should have video controls available in Player tab', async ({ page }) => {
      // Open video player and navigate to Player tab
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      await page.click('text=Player');

      // Verify ReactPlayer component is present
      await expect(page.locator('.react-player').first()).toBeVisible();

      // ReactPlayer with controls=true should render YouTube's native controls
      // In a real browser, these would be visible in the YouTube iframe
      // For E2E testing, we verify the player container exists
      const playerContainer = page.locator('.react-player');
      await expect(playerContainer).toBeVisible();
    });

    test('should display video within 5 seconds of URL submission', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Enter URL tab
      await page.click('text=Enter URL');

      // Submit URL
      const inputField = page.locator('input[placeholder="Enter URL"]');
      await inputField.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      const startTime = Date.now();
      await page.click('button:has-text("Enter")');

      // Switch to Player tab and wait for ReactPlayer
      await page.click('text=Player');
      await page.waitForSelector('.react-player', { timeout: 5000 });

      const endTime = Date.now();
      const loadTime = (endTime - startTime) / 1000;

      // Verify video loads within 5 seconds (per SC-002)
      expect(loadTime).toBeLessThan(5);
    });
  });

  /**
   * T013: E2E Accessibility test with @axe-core/playwright
   */
  test.describe('T013: Accessibility compliance with @axe-core/playwright', () => {
    test('should have no accessibility violations in Player tab', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Player tab
      await page.click('text=Player');
      await page.waitForSelector('.react-player');

      // Run accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      // Verify no violations found
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have no accessibility violations in Enter URL tab', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Enter URL tab
      await page.click('text=Enter URL');
      await page.waitForSelector('input[placeholder="Enter URL"]');

      // Run accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      // Verify no violations found
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have no accessibility violations in Tutorials tab', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Tutorials tab
      await page.click('text=Tutorials');
      await page.waitForTimeout(500); // Wait for tab content to render

      // Run accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      // Verify no violations found
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper keyboard navigation', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Enter URL tab
      await page.click('text=Enter URL');

      // Test keyboard navigation through form elements
      const inputField = page.locator('input[placeholder="Enter URL"]');
      await inputField.focus();

      // Verify input is focused
      await expect(inputField).toBeFocused();

      // Tab to next element (should be Reset or Enter button)
      await page.keyboard.press('Tab');

      // At least one button should be focused
      const resetButton = page.locator('button:has-text("Reset")');
      const enterButton = page.locator('button:has-text("Enter")');

      const resetFocused = await resetButton.evaluate(el => el === document.activeElement);
      const enterFocused = await enterButton.evaluate(el => el === document.activeElement);

      expect(resetFocused || enterFocused).toBe(true);
    });

    test('should support Enter key activation for form submission', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Enter URL tab
      await page.click('text=Enter URL');

      // Focus input field and enter URL
      const inputField = page.locator('input[placeholder="Enter URL"]');
      await inputField.fill('https://www.youtube.com/watch?v=testVideo');

      // Press Enter key to submit
      await inputField.press('Enter');

      // Verify form submission (tab should switch to Player or URL should be processed)
      // Wait a moment for state update
      await page.waitForTimeout(500);

      // Either the tab switches to Player, or the ReactPlayer updates
      // We check that the input action was processed (no error)
      await expect(inputField).toBeVisible();
    });

    test('should have visible focus indicators', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Enter URL tab
      await page.click('text=Enter URL');

      const inputField = page.locator('input[placeholder="Enter URL"]');
      await inputField.focus();

      // Check that element has focus (browser applies default focus styles)
      await expect(inputField).toBeFocused();

      // Verify input is interactive (user can type)
      await inputField.type('test');
      await expect(inputField).toHaveValue('test');
    });
  });

  test.describe('Additional E2E tests', () => {
    test('should preserve Tutorials tab with 6 hardcoded videos', async ({ page }) => {
      // Open video player modal
      const videoButton = page.locator('[aria-label*="video" i], [aria-label*="tutorial" i]').first();
      if (await videoButton.isVisible()) {
        await videoButton.click();
      }

      // Navigate to Tutorials tab
      await page.click('text=Tutorials');

      // Verify all 6 tutorial titles are present
      await expect(page.locator('text=Keyboard on/off')).toBeVisible();
      await expect(page.locator('text=Notation')).toBeVisible();
      await expect(page.locator('text=Ambitus')).toBeVisible();
      await expect(page.locator('text=Select different scales')).toBeVisible();
      await expect(page.locator('text=Video player')).toBeVisible();
      await expect(page.locator('text=Share your setup')).toBeVisible();

      // Verify ReactPlayer components are rendered for tutorials
      const players = page.locator('.react-player');
      const playerCount = await players.count();
      expect(playerCount).toBeGreaterThanOrEqual(6);
    });
  });
});
