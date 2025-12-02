/**
 * URL Validator Service
 *
 * Provides validation utilities for URL parameters, video URLs, and URL length.
 * Includes security checks to prevent XSS attacks via malicious URLs.
 */

/**
 * Validates that a URL is HTTPS only and doesn't contain dangerous protocols
 *
 * @param {string} url - The video URL to validate
 * @returns {boolean} true if URL is valid and safe, false otherwise
 *
 * Security checks:
 * - Must use HTTPS protocol (not HTTP)
 * - Blocks javascript:, data:, file: protocols
 * - Blocks dangerous characters that could enable XSS
 */
export function isValidVideoURL(url) {
  if (!url || url.trim() === '') {
    return true; // Empty is valid (will use default)
  }

  // Must start with https://
  if (!url.toLowerCase().startsWith('https://')) {
    return false;
  }

  // Check for dangerous protocols (case-insensitive)
  const lowerURL = url.toLowerCase();
  const dangerousProtocols = ['javascript:', 'data:', 'file:'];
  for (const protocol of dangerousProtocols) {
    if (lowerURL.includes(protocol)) {
      return false;
    }
  }

  // Regex to validate URL structure and block dangerous characters
  // Blocks: whitespace, <>"{}|\^`[]
  const urlRegex = /^https:\/\/[^\s<>"{}|\\^`\[\]]+$/i;
  if (!urlRegex.test(url)) {
    return false;
  }

  return true;
}

/**
 * Validates that the URL length is within browser limits
 *
 * @param {string} url - The complete URL to validate
 * @returns {Object} Validation result with suggestions if too long
 * @returns {boolean} result.valid - Whether URL is within limits
 * @returns {number} result.length - Current URL length
 * @returns {string[]} result.suggestions - Suggestions to reduce length (if invalid)
 *
 * @example
 * const result = validateURLLength('https://example.com/?...');
 * if (!result.valid) {
 *   console.log(result.suggestions);
 * }
 */
export function validateURLLength(url) {
  const MAX_LENGTH = 2000;
  const length = url.length;

  if (length > MAX_LENGTH) {
    return {
      valid: false,
      length,
      suggestions: [
        `Current URL length: ${length} characters (limit: ${MAX_LENGTH})`,
        'Try removing the video URL to save ~100-200 characters',
        'Use a preset scale instead of a custom scale',
        'Shorten custom scale names if present',
        'Reduce the number of active notation overlays'
      ]
    };
  }

  return {
    valid: true,
    length
  };
}

/**
 * Validates custom scale steps array
 *
 * @param {number[]} steps - Array of semitone steps (0-11)
 * @returns {Object} Validation result
 * @returns {boolean} result.valid - Whether steps are valid
 * @returns {string} result.error - Error message if invalid
 */
export function validateScaleSteps(steps) {
  // Check if steps is an array
  if (!Array.isArray(steps)) {
    return {
      valid: false,
      error: 'Scale steps must be an array'
    };
  }

  // Check length (1-12 steps)
  if (steps.length === 0 || steps.length > 12) {
    return {
      valid: false,
      error: 'Scale must have 1-12 steps'
    };
  }

  // Check each value is a number between 0-11
  for (const step of steps) {
    if (typeof step !== 'number' || isNaN(step)) {
      return {
        valid: false,
        error: 'Scale steps must be numbers'
      };
    }
    if (step < 0 || step > 11) {
      return {
        valid: false,
        error: 'Scale steps must be between 0 and 11'
      };
    }
    if (!Number.isInteger(step)) {
      return {
        valid: false,
        error: 'Scale steps must be integers'
      };
    }
  }

  // Check for duplicates
  const uniqueSteps = new Set(steps);
  if (uniqueSteps.size !== steps.length) {
    return {
      valid: false,
      error: 'Scale steps must be unique (no duplicates)'
    };
  }

  return {
    valid: true
  };
}

/**
 * Validates custom scale numbers array matches steps
 *
 * @param {string[]} numbers - Array of interval labels
 * @param {number[]} steps - Array of semitone steps
 * @returns {Object} Validation result
 * @returns {boolean} result.valid - Whether numbers are valid
 * @returns {string} result.error - Error message if invalid
 */
export function validateScaleNumbers(numbers, steps) {
  // Check if numbers is an array
  if (!Array.isArray(numbers)) {
    return {
      valid: false,
      error: 'Scale numbers must be an array'
    };
  }

  // Check length matches steps
  if (numbers.length !== steps.length) {
    return {
      valid: false,
      error: 'Scale numbers length must match steps length'
    };
  }

  // Check each label is non-empty string
  for (const num of numbers) {
    if (typeof num !== 'string' || num.trim() === '') {
      return {
        valid: false,
        error: 'Scale numbers must be non-empty strings'
      };
    }
  }

  return {
    valid: true
  };
}

/**
 * Validates a complete custom scale object
 *
 * @param {Object} scaleObject - Custom scale with name, steps, numbers
 * @returns {Object} Validation result
 * @returns {boolean} result.valid - Whether scale is valid
 * @returns {string} result.error - Error message if invalid
 */
export function validateCustomScale(scaleObject) {
  if (!scaleObject || typeof scaleObject !== 'object') {
    return {
      valid: false,
      error: 'Invalid scale object'
    };
  }

  const { name, steps, numbers } = scaleObject;

  // Validate name
  if (!name || typeof name !== 'string' || name.length === 0 || name.length > 100) {
    return {
      valid: false,
      error: 'Scale name must be 1-100 characters'
    };
  }

  // Validate steps
  const stepsValidation = validateScaleSteps(steps);
  if (!stepsValidation.valid) {
    return stepsValidation;
  }

  // Validate numbers
  const numbersValidation = validateScaleNumbers(numbers, steps);
  if (!numbersValidation.valid) {
    return numbersValidation;
  }

  return {
    valid: true
  };
}
