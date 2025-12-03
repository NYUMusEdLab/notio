/**
 * Modal Test Utilities
 *
 * Helper functions for testing modal positioning functionality:
 * - Drag event simulation
 * - Position verification
 * - Modal interaction helpers
 */

import { fireEvent } from '@testing-library/react';

/**
 * Simulates dragging a modal from one position to another
 *
 * @param {HTMLElement} dragHandle - The drag handle element (usually .drag)
 * @param {Object} from - Starting position {x, y}
 * @param {Object} to - Ending position {x, y}
 */
export function simulateDrag(dragHandle, from = { x: 0, y: 0 }, to = { x: 100, y: 150 }) {
  // Simulate mouse down at starting position
  fireEvent.mouseDown(dragHandle, {
    clientX: from.x,
    clientY: from.y,
    bubbles: true
  });

  // Simulate mouse move to ending position
  fireEvent.mouseMove(dragHandle, {
    clientX: to.x,
    clientY: to.y,
    bubbles: true
  });

  // Simulate mouse up to complete drag
  fireEvent.mouseUp(dragHandle, {
    clientX: to.x,
    clientY: to.y,
    bubbles: true
  });
}

/**
 * Verifies a modal is positioned at the expected location
 *
 * @param {HTMLElement} modalElement - The modal element to check
 * @param {Object} expectedPosition - Expected position {x, y}
 * @param {number} tolerance - Allowed tolerance in pixels (default: 10)
 * @returns {boolean} True if position matches within tolerance
 */
export function verifyModalPosition(modalElement, expectedPosition, tolerance = 10) {
  const transform = modalElement.style.transform;

  if (!transform) {
    return false;
  }

  // Parse transform: translate(Xpx, Ypx) or matrix(...)
  const translateMatch = transform.match(/translate\(([^,]+)px?,\s*([^)]+)px?\)/);

  if (translateMatch) {
    const actualX = parseFloat(translateMatch[1]);
    const actualY = parseFloat(translateMatch[2]);

    const xMatches = Math.abs(actualX - expectedPosition.x) <= tolerance;
    const yMatches = Math.abs(actualY - expectedPosition.y) <= tolerance;

    return xMatches && yMatches;
  }

  return false;
}

/**
 * Gets the drag handle element for a modal
 *
 * @param {HTMLElement} container - The test container or modal element
 * @returns {HTMLElement|null} The drag handle element
 */
export function getDragHandle(container) {
  return container.querySelector('.drag');
}

/**
 * Gets all open modals in the container
 *
 * @param {HTMLElement} container - The test container
 * @returns {Array<HTMLElement>} Array of modal elements
 */
export function getOpenModals(container) {
  return Array.from(container.querySelectorAll('.overlay'));
}

/**
 * Waits for modal animation to complete
 *
 * @param {number} duration - Duration to wait in ms (default: 300)
 * @returns {Promise} Promise that resolves after duration
 */
export function waitForModalAnimation(duration = 300) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Simulates debounced action (for URL updates)
 * Advances timers and flushes promises
 *
 * @param {number} delay - Debounce delay in ms (default: 500)
 */
export async function flushDebounce(delay = 500) {
  const { act } = await import('@testing-library/react');
  await act(async () => {
    jest.advanceTimersByTime(delay + 100); // Add buffer
    await Promise.resolve(); // Flush promises
  });
}

/**
 * Creates a mock position object
 *
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Object} Position object {x, y}
 */
export function createPosition(x = 0, y = 0) {
  return { x, y };
}

/**
 * Test position fixtures for common scenarios
 */
export const TEST_POSITIONS = {
  default: { x: 0, y: 0 },
  topLeft: { x: 0, y: 0 },
  centered: { x: 500, y: 300 },
  bottomRight: { x: 1000, y: 800 },
  outOfBounds: { x: -100, y: 15000 }, // Should be clamped
  invalid: { x: 'foo', y: 'bar' } // Should default to null
};
