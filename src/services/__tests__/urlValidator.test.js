/**
 * Unit tests for URL validator service
 *
 * Tests security validation, length limits, and custom scale validation
 */

import {
  isValidVideoURL,
  validateURLLength,
  validateScaleSteps,
  validateScaleNumbers,
  validateCustomScale
} from '../urlValidator';

describe('isValidVideoURL', () => {
  test('accepts valid HTTPS URLs', () => {
    expect(isValidVideoURL('https://www.youtube.com/watch?v=abc123')).toBe(true);
    expect(isValidVideoURL('https://vimeo.com/123456789')).toBe(true);
    expect(isValidVideoURL('https://example.com/video.mp4')).toBe(true);
  });

  test('accepts empty or null URLs', () => {
    expect(isValidVideoURL('')).toBe(true);
    expect(isValidVideoURL(null)).toBe(true);
    expect(isValidVideoURL(undefined)).toBe(true);
    expect(isValidVideoURL('   ')).toBe(true);
  });

  test('rejects HTTP (non-secure) URLs', () => {
    expect(isValidVideoURL('http://www.youtube.com/watch?v=abc123')).toBe(false);
    expect(isValidVideoURL('http://example.com/video.mp4')).toBe(false);
  });

  test('rejects javascript: protocol (XSS)', () => {
    expect(isValidVideoURL('javascript:alert(1)')).toBe(false);
    expect(isValidVideoURL('JAVASCRIPT:alert(1)')).toBe(false);
    expect(isValidVideoURL('https://example.com/javascript:alert')).toBe(false);
  });

  test('rejects data: protocol (XSS)', () => {
    expect(isValidVideoURL('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isValidVideoURL('DATA:text/html,test')).toBe(false);
    expect(isValidVideoURL('https://example.com/data:test')).toBe(false);
  });

  test('rejects file: protocol (local file access)', () => {
    expect(isValidVideoURL('file:///etc/passwd')).toBe(false);
    expect(isValidVideoURL('FILE:///C:/Windows/System32')).toBe(false);
    expect(isValidVideoURL('https://example.com/file:test')).toBe(false);
  });

  test('rejects URLs with dangerous characters', () => {
    expect(isValidVideoURL('https://example.com/<script>alert(1)</script>')).toBe(false);
    expect(isValidVideoURL('https://example.com/test"onclick="alert(1)')).toBe(false);
    expect(isValidVideoURL('https://example.com/test{test}test')).toBe(false);
    expect(isValidVideoURL('https://example.com/test|test')).toBe(false);
    expect(isValidVideoURL('https://example.com/test\\test')).toBe(false);
    expect(isValidVideoURL('https://example.com/test^test')).toBe(false);
    expect(isValidVideoURL('https://example.com/test`test')).toBe(false);
    expect(isValidVideoURL('https://example.com/test[test]')).toBe(false);
  });

  test('rejects URLs with whitespace', () => {
    expect(isValidVideoURL('https://example.com/test test')).toBe(false);
    expect(isValidVideoURL('https://example.com/test\ntest')).toBe(false);
    expect(isValidVideoURL('https://example.com/test\ttest')).toBe(false);
  });

  test('accepts URLs with valid special characters', () => {
    expect(isValidVideoURL('https://www.youtube.com/watch?v=abc-123_xyz')).toBe(true);
    expect(isValidVideoURL('https://example.com/path/to/video.mp4')).toBe(true);
    expect(isValidVideoURL('https://example.com:8080/video')).toBe(true);
    expect(isValidVideoURL('https://subdomain.example.com/video')).toBe(true);
  });

  test('handles edge cases with protocol in URL path', () => {
    // These should be rejected because they contain dangerous protocol names
    expect(isValidVideoURL('https://example.com/path/javascript:alert')).toBe(false);
    expect(isValidVideoURL('https://example.com/file:///test')).toBe(false);
  });
});

describe('validateURLLength', () => {
  test('accepts URLs under 2000 characters', () => {
    const shortURL = 'https://example.com/?param=value';
    const result = validateURLLength(shortURL);

    expect(result.valid).toBe(true);
    expect(result.length).toBe(shortURL.length);
    expect(result.suggestions).toBeUndefined();
  });

  test('rejects URLs over 2000 characters', () => {
    const longURL = 'https://example.com/?' + 'a'.repeat(2500);
    const result = validateURLLength(longURL);

    expect(result.valid).toBe(false);
    expect(result.length).toBeGreaterThan(2000);
    expect(result.suggestions).toBeDefined();
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('provides actionable suggestions for long URLs', () => {
    const longURL = 'https://example.com/?' + 'a'.repeat(2500);
    const result = validateURLLength(longURL);

    expect(result.suggestions).toContain(
      expect.stringMatching(/Current URL length:.*characters/)
    );
    expect(result.suggestions).toContain(
      expect.stringMatching(/video URL/)
    );
    expect(result.suggestions).toContain(
      expect.stringMatching(/preset scale/)
    );
  });

  test('handles exactly 2000 characters', () => {
    const exactURL = 'https://example.com/?' + 'a'.repeat(1976); // Total = 2000
    const result = validateURLLength(exactURL);

    expect(result.valid).toBe(true);
    expect(result.length).toBe(2000);
  });

  test('handles exactly 2001 characters', () => {
    const overURL = 'https://example.com/?' + 'a'.repeat(1977); // Total = 2001
    const result = validateURLLength(overURL);

    expect(result.valid).toBe(false);
    expect(result.length).toBe(2001);
  });
});

describe('validateScaleSteps', () => {
  test('accepts valid scale steps', () => {
    const result = validateScaleSteps([0, 2, 4, 5, 7, 9, 11]);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('accepts single step', () => {
    const result = validateScaleSteps([0]);
    expect(result.valid).toBe(true);
  });

  test('accepts maximum 12 steps', () => {
    const result = validateScaleSteps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(result.valid).toBe(true);
  });

  test('rejects empty array', () => {
    const result = validateScaleSteps([]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/1-12 steps/);
  });

  test('rejects more than 12 steps', () => {
    const result = validateScaleSteps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/1-12 steps/);
  });

  test('rejects non-array input', () => {
    expect(validateScaleSteps('not an array').valid).toBe(false);
    expect(validateScaleSteps(null).valid).toBe(false);
    expect(validateScaleSteps(undefined).valid).toBe(false);
    expect(validateScaleSteps(123).valid).toBe(false);
  });

  test('rejects steps outside 0-11 range', () => {
    expect(validateScaleSteps([0, 2, 12]).valid).toBe(false);
    expect(validateScaleSteps([0, 2, -1]).valid).toBe(false);
    expect(validateScaleSteps([0, 2, 100]).valid).toBe(false);
  });

  test('rejects non-integer steps', () => {
    expect(validateScaleSteps([0, 2.5, 4]).valid).toBe(false);
    expect(validateScaleSteps([0, 2, 'three']).valid).toBe(false);
    expect(validateScaleSteps([0, 2, NaN]).valid).toBe(false);
  });

  test('rejects duplicate steps', () => {
    const result = validateScaleSteps([0, 2, 4, 2, 7]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/unique/);
  });
});

describe('validateScaleNumbers', () => {
  const validSteps = [0, 2, 4, 5, 7, 9, 11];

  test('accepts valid scale numbers', () => {
    const result = validateScaleNumbers(['1', '2', '3', '4', '5', '6', '7'], validSteps);
    expect(result.valid).toBe(true);
  });

  test('accepts numbers with accidentals', () => {
    const result = validateScaleNumbers(['1', 'b3', '4', 'b5', '5', 'b7'], [0, 3, 5, 6, 7, 10]);
    expect(result.valid).toBe(true);
  });

  test('rejects when length does not match steps', () => {
    const result = validateScaleNumbers(['1', '2', '3'], validSteps);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/length must match/);
  });

  test('rejects non-array input', () => {
    expect(validateScaleNumbers('not an array', validSteps).valid).toBe(false);
    expect(validateScaleNumbers(null, validSteps).valid).toBe(false);
  });

  test('rejects empty strings', () => {
    const result = validateScaleNumbers(['1', '', '3', '4', '5', '6', '7'], validSteps);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/non-empty strings/);
  });

  test('rejects non-string values', () => {
    const result = validateScaleNumbers(['1', 2, '3', '4', '5', '6', '7'], validSteps);
    expect(result.valid).toBe(false);
  });

  test('accepts strings with whitespace (trimmed)', () => {
    const result = validateScaleNumbers(['1', ' 2 ', '3', '4', '5', '6', '7'], validSteps);
    // Should fail because ' 2 ' has content after trim, but validation checks trim
    expect(result.valid).toBe(true);
  });

  test('rejects whitespace-only strings', () => {
    const result = validateScaleNumbers(['1', '   ', '3', '4', '5', '6', '7'], validSteps);
    expect(result.valid).toBe(false);
  });
});

describe('validateCustomScale', () => {
  test('accepts valid custom scale', () => {
    const scale = {
      name: 'Major',
      steps: [0, 2, 4, 5, 7, 9, 11],
      numbers: ['1', '2', '3', '4', '5', '6', '7']
    };
    const result = validateCustomScale(scale);
    expect(result.valid).toBe(true);
  });

  test('rejects null or undefined', () => {
    expect(validateCustomScale(null).valid).toBe(false);
    expect(validateCustomScale(undefined).valid).toBe(false);
  });

  test('rejects non-object', () => {
    expect(validateCustomScale('not an object').valid).toBe(false);
    expect(validateCustomScale(123).valid).toBe(false);
  });

  test('rejects missing name', () => {
    const scale = {
      steps: [0, 2, 4],
      numbers: ['1', '2', '3']
    };
    expect(validateCustomScale(scale).valid).toBe(false);
  });

  test('rejects empty name', () => {
    const scale = {
      name: '',
      steps: [0, 2, 4],
      numbers: ['1', '2', '3']
    };
    expect(validateCustomScale(scale).valid).toBe(false);
  });

  test('rejects name over 100 characters', () => {
    const scale = {
      name: 'a'.repeat(101),
      steps: [0, 2, 4],
      numbers: ['1', '2', '3']
    };
    expect(validateCustomScale(scale).valid).toBe(false);
  });

  test('accepts name exactly 100 characters', () => {
    const scale = {
      name: 'a'.repeat(100),
      steps: [0, 2, 4],
      numbers: ['1', '2', '3']
    };
    expect(validateCustomScale(scale).valid).toBe(true);
  });

  test('rejects invalid steps', () => {
    const scale = {
      name: 'Invalid',
      steps: [0, 2, 12], // 12 is out of range
      numbers: ['1', '2', '3']
    };
    expect(validateCustomScale(scale).valid).toBe(false);
  });

  test('rejects invalid numbers', () => {
    const scale = {
      name: 'Invalid',
      steps: [0, 2, 4],
      numbers: ['1', '2'] // Length mismatch
    };
    expect(validateCustomScale(scale).valid).toBe(false);
  });

  test('returns specific error messages', () => {
    const scale = {
      name: 'Test',
      steps: [0, 2, 12],
      numbers: ['1', '2', '3']
    };
    const result = validateCustomScale(scale);
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/0 and 11/);
  });
});
