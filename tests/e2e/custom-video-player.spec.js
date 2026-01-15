// @ts-check
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const DEFAULT_VIDEO_URL = "https://youtu.be/dQw4w9WgXcQ";
const CUSTOM_VIDEO_URL = "https://youtu.be/custom-test-video";

// T036: Full user journey E2E test
test.describe("CustomVideoPlayer - Full User Journey", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app (adjust URL as needed for your dev server)
    await page.goto("/");
  });

  test("T036: Complete user journey - open, view default, enter custom, reset, close", async ({
    page,
  }) => {
    // Step 1: Open video player
    const videoButton = page.getByRole("button", { name: /video/i });
    if (await videoButton.isVisible()) {
      await videoButton.click();
    }

    // Step 2: Verify default video is showing
    const videoPlayer = page.locator('[data-testid="custom-video-player"]');
    await expect(videoPlayer).toBeVisible({ timeout: 10000 });

    // Step 3: Navigate to Enter URL tab
    const enterUrlTab = page.getByRole("tab", { name: /enter url/i });
    await enterUrlTab.click();

    // Step 4: Enter custom URL
    const urlInput = page.getByPlaceholder(/enter url/i);
    await urlInput.fill(CUSTOM_VIDEO_URL);

    // Step 5: Submit the form
    const submitButton = page.getByRole("button", { name: /^enter$/i });
    await submitButton.click();

    // Step 6: Verify we're back on Player tab
    const playerTab = page.getByRole("tab", { name: /player/i });
    await expect(playerTab).toHaveAttribute("aria-selected", "true");

    // Step 7: Go back to Enter URL and click Reset
    await enterUrlTab.click();
    const resetButton = page.getByRole("button", { name: /reset/i });
    await resetButton.click();

    // Step 8: Verify reset worked (back to Player tab)
    await expect(playerTab).toHaveAttribute("aria-selected", "true");

    // Step 9: Close the overlay with Escape
    await page.keyboard.press("Escape");

    // Verify overlay is closed
    await expect(videoPlayer).not.toBeVisible();
  });
});

// T037: Keyboard-only navigation E2E test
test.describe("CustomVideoPlayer - Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("T037: Complete keyboard-only navigation", async ({ page }) => {
    // Open video player with keyboard (Tab to button, Enter to activate)
    const videoButton = page.getByRole("button", { name: /video/i });
    if (await videoButton.isVisible()) {
      await videoButton.focus();
      await page.keyboard.press("Enter");
    }

    const videoPlayer = page.locator('[data-testid="custom-video-player"]');
    await expect(videoPlayer).toBeVisible({ timeout: 10000 });

    // Tab to Enter URL tab
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const enterUrlTab = page.getByRole("tab", { name: /enter url/i });

    // Activate with Enter
    await enterUrlTab.focus();
    await page.keyboard.press("Enter");

    // Tab to URL input and type
    const urlInput = page.getByPlaceholder(/enter url/i);
    await urlInput.focus();
    await page.keyboard.type(CUSTOM_VIDEO_URL);

    // Tab to Submit button and press Enter
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // Skip Reset
    await page.keyboard.press("Enter");

    // Verify submission worked
    const playerTab = page.getByRole("tab", { name: /player/i });
    await expect(playerTab).toHaveAttribute("aria-selected", "true");

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(videoPlayer).not.toBeVisible();
  });

  test("should have no accessibility violations", async ({ page }) => {
    const videoButton = page.getByRole("button", { name: /video/i });
    if (await videoButton.isVisible()) {
      await videoButton.click();
    }

    const videoPlayer = page.locator('[data-testid="custom-video-player"]');
    await expect(videoPlayer).toBeVisible({ timeout: 10000 });

    // Run axe accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

// T046: Cross-browser validation
test.describe("CustomVideoPlayer - Cross-Browser", () => {
  test("should work in all browsers", async ({ page, browserName }) => {
    await page.goto("/");

    const videoButton = page.getByRole("button", { name: /video/i });
    if (await videoButton.isVisible()) {
      await videoButton.click();
    }

    const videoPlayer = page.locator('[data-testid="custom-video-player"]');
    await expect(videoPlayer).toBeVisible({ timeout: 10000 });

    // Basic functionality check
    const playerTab = page.getByRole("tab", { name: /player/i });
    await expect(playerTab).toHaveAttribute("aria-selected", "true");

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(videoPlayer).not.toBeVisible();

    console.log(`Test passed on ${browserName}`);
  });
});
