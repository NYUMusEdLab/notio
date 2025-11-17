import { test, expect } from '@playwright/test';

test.describe('Muted Sound for Out-of-Scale Notes', () => {
  test('should play muted sound for out-of-scale notes and standard sound for in-scale notes', async ({ page }) => {
    await page.goto('http://localhost:3000'); // Assuming the app runs on this port

    // 1. Select a Scale (e.g., C Major)
    // This part is highly dependent on the actual UI.
    // Assuming there's a dropdown or button to select scales.
    // For now, we'll simulate a generic interaction.
    // You might need to replace this with actual selectors from your app.
    await page.click('text=Select Scale'); // Example: Click a button to open scale selection
    await page.click('text=C Major');     // Example: Select 'C Major' from a list

    // Wait for the scale to be applied and the UI to update
    await page.waitForTimeout(500); 

    // Mock audio context to detect sound playback without actual audio
    await page.evaluate(() => {
      window.AudioContext = jest.fn(() => ({
        createGain: jest.fn(() => ({ connect: jest.fn(), gain: { setValueAtTime: jest.fn() } })),
        decodeAudioData: jest.fn(() => Promise.resolve()),
        destination: {},
        resume: jest.fn(),
      }));
      window.Tone = {
        Player: jest.fn(() => ({
          toDestination: jest.fn(() => ({
            start: jest.fn(),
            load: jest.fn(() => Promise.resolve()),
          })),
        })),
        Sampler: jest.fn(() => ({
          toDestination: jest.fn(() => ({
            triggerAttack: jest.fn(),
            load: jest.fn(() => Promise.resolve()),
          })),
        })),
        start: jest.fn(() => Promise.resolve()),
      };
    });

    // 2. Navigate the Keyboard and Listen for Feedback
    // Simulate keyboard navigation (e.g., arrow keys)
    // This assumes the keyboard component is focusable and responds to arrow keys.

    // Navigate to an in-scale note (e.g., C4)
    await page.press('body', 'ArrowRight'); // Move focus to a key
    // Expect standard sound to be triggered
    // This assertion depends on how AudioManager.playSound is exposed or if Tone.js mocks are accessible.
    // For a real E2E test, you'd typically check for visual cues or network requests for audio files.
    // Given the prompt, we'll assume Tone.js mocks are in place and check their calls.
    await page.waitForFunction(() => window.Tone.Sampler.mock.calls.length > 0);
    expect(window.Tone.Sampler.mock.calls.length).toBeGreaterThan(0);
    expect(window.Tone.Player.mock.calls.length).toBe(0); // Muted sound should not play

    // Reset mocks for next interaction
    await page.evaluate(() => {
      window.Tone.Sampler.mockClear();
      window.Tone.Player.mockClear();
    });

    // Navigate to an out-of-scale note (e.g., C#4)
    await page.press('body', 'ArrowRight'); // Move focus to another key
    // Expect muted sound to be triggered
    await page.waitForFunction(() => window.Tone.Player.mock.calls.length > 0);
    expect(window.Tone.Player.mock.calls.length).toBeGreaterThan(0);
    expect(window.Tone.Sampler.mock.calls.length).toBe(0); // Standard sound should not play

    // 3. Deselect the Scale (if applicable)
    // Simulate deselecting the scale
    await page.click('text=Deselect Scale'); // Example: Click a button to deselect scale
    await page.waitForTimeout(500); 

    // Reset mocks
    await page.evaluate(() => {
      window.Tone.Sampler.mockClear();
      window.Tone.Player.mockClear();
    });

    // Navigate to any key (should play standard sound)
    await page.press('body', 'ArrowRight');
    await page.waitForFunction(() => window.Tone.Sampler.mock.calls.length > 0);
    expect(window.Tone.Sampler.mock.calls.length).toBeGreaterThan(0);
    expect(window.Tone.Player.mock.calls.length).toBe(0);
  });
});
