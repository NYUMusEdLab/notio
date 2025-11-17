/**
 * Sample Unit Test - Edge Cases Only
 *
 * Purpose: Demonstrates strategic unit testing for edge cases
 * Constitution v2.0.0: Unit tests are MINIMAL (10-20% of test suite)
 *
 * This test shows how to:
 * - Test complex algorithm edge cases
 * - Test boundary conditions
 * - Test exceptional inputs
 * - Focus on what integration tests CAN'T easily cover
 */

/**
 * Sample utility function: Calculate musical interval
 * This is a complex algorithm that benefits from edge case testing
 */
function calculateInterval(note1, note2) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Parse notes (e.g., "C4" -> {note: "C", octave: 4})
  const parseNote = (noteString) => {
    const match = noteString.match(/^([A-G]#?)(\d+)$/);
    if (!match) return null;
    return { note: match[1], octave: parseInt(match[2], 10) };
  };

  const parsed1 = parseNote(note1);
  const parsed2 = parseNote(note2);

  if (!parsed1 || !parsed2) {
    throw new Error('Invalid note format');
  }

  const semitones1 = notes.indexOf(parsed1.note) + (parsed1.octave * 12);
  const semitones2 = notes.indexOf(parsed2.note) + (parsed2.octave * 12);

  return Math.abs(semitones2 - semitones1);
}

describe('Sample Unit Test - Musical Interval Calculator (Edge Cases)', () => {
  // ✅ Good unit test: Tests edge cases not easily covered by integration tests

  it('should handle unison (same note)', () => {
    // Edge case: Same note should have 0 semitones difference
    expect(calculateInterval('C4', 'C4')).toBe(0);
    expect(calculateInterval('G#5', 'G#5')).toBe(0);
  });

  it('should handle octave intervals', () => {
    // Edge case: Octave should be exactly 12 semitones
    expect(calculateInterval('C4', 'C5')).toBe(12);
    expect(calculateInterval('A3', 'A4')).toBe(12);
  });

  it('should handle compound intervals (more than an octave)', () => {
    // Edge case: Intervals spanning multiple octaves
    expect(calculateInterval('C4', 'C6')).toBe(24); // Two octaves
    expect(calculateInterval('E3', 'G5')).toBe(27); // Two octaves + minor third
  });

  it('should handle sharp notes correctly', () => {
    // Edge case: Ensure sharps are calculated correctly
    expect(calculateInterval('C4', 'C#4')).toBe(1); // Minor second
    expect(calculateInterval('F#4', 'G4')).toBe(1); // Minor second
  });

  it('should handle descending intervals (order matters)', () => {
    // Edge case: Absolute value ensures direction doesn't matter
    expect(calculateInterval('G4', 'C4')).toBe(7); // Perfect fifth (descending)
    expect(calculateInterval('C4', 'G4')).toBe(7); // Perfect fifth (ascending)
  });

  it('should throw error for invalid note format', () => {
    // Edge case: Invalid input validation
    expect(() => calculateInterval('invalid', 'C4')).toThrow('Invalid note format');
    expect(() => calculateInterval('C4', 'Z99')).toThrow('Invalid note format');
    expect(() => calculateInterval('H4', 'C4')).toThrow('Invalid note format');
  });

  it('should handle extreme octave ranges', () => {
    // Edge case: Very low and very high octaves
    expect(calculateInterval('C0', 'C8')).toBe(96); // 8 octaves
    expect(calculateInterval('A0', 'A8')).toBe(96); // 8 octaves
  });

  it('should handle enharmonic equivalents correctly', () => {
    // Edge case: C# and Db are enharmonic (same pitch)
    // Note: This simple implementation doesn't handle flats, but edge case is documented
    expect(calculateInterval('C#4', 'D4')).toBe(1); // Minor second
  });
});

/**
 * Unit Test Best Practices (Constitution v2.0.0):
 *
 * ✅ DO (Unit Tests):
 * - Test complex algorithm edge cases
 * - Test boundary conditions (0, max, min)
 * - Test exceptional inputs (null, invalid, extreme values)
 * - Test error handling paths
 * - Test mathematical calculations with precision requirements
 *
 * ❌ DON'T (Unit Tests):
 * - Test simple getters/setters
 * - Test obvious code
 * - Duplicate integration test coverage
 * - Test implementation details
 * - Test React component rendering (use integration tests)
 *
 * When to write unit tests:
 * - Complex musical calculations (intervals, frequencies, rhythms)
 * - Algorithms with many edge cases
 * - Pure functions with mathematical requirements
 * - Error handling for exceptional inputs
 *
 * When NOT to write unit tests:
 * - React component behavior (use integration tests)
 * - UI interactions (use integration/E2E tests)
 * - Simple utility functions (covered by integration tests)
 * - Obvious code without edge cases
 */
