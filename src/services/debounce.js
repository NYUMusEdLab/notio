/**
 * Creates a debounced function that delays invoking func until after delay milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay (default: 500)
 * @returns {Function} Returns the new debounced function with a cancel method
 *
 * @example
 * const debouncedSave = debounce(() => saveToDatabase(), 500);
 * debouncedSave(); // Will execute after 500ms
 * debouncedSave(); // Resets the timer
 * debouncedSave.cancel(); // Cancels pending execution
 */
export default function debounce(func, delay = 500) {
  let timeoutId = null;

  const debounced = function (...args) {
    // Clear existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };

  // Add cancel method to clear pending execution
  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
