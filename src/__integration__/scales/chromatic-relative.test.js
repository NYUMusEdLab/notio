import MusicScale from '../../Model/MusicScale';
import scales from '../../data/scalesObj';

describe('Chromatic Scale Relative Mode (US2)', () => {
  const chromaticScale = scales.find(s => s.name === 'Chromatic');
  const majorScale = scales.find(s => s.name === 'Major (Ionian)');

  test('Chromatic scale should be detectable', () => {
    const scale = new MusicScale(chromaticScale, 'C');

    // The scale should be identifiable as chromatic
    // This can be done by checking the name or the steps array length
    expect(scale.Name).toBe('Chromatic');
    expect(scale.SemitoneSteps.length).toBe(12);
  });

  test('Non-chromatic scale should not be identified as chromatic', () => {
    const scale = new MusicScale(majorScale, 'C');

    expect(scale.Name).not.toBe('Chromatic');
    expect(scale.SemitoneSteps.length).toBeLessThan(12);
  });

  test('All chromatic scales in different keys should be identifiable', () => {
    const rootNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    rootNotes.forEach((rootNote) => {
      const scale = new MusicScale(chromaticScale, rootNote);
      expect(scale.Name).toBe('Chromatic');
    });
  });

  test('Chromatic scale has 12 semitone steps', () => {
    const scale = new MusicScale(chromaticScale, 'C');
    expect(scale.SemitoneSteps).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  // Note: The actual UI disabling logic will be tested in E2E tests
  // This integration test verifies we can identify chromatic scales

  describe('Helper function for chromatic detection', () => {
    test('isChromatic helper should return true for chromatic scales', () => {
      const scale = new MusicScale(chromaticScale, 'C');
      const isChromatic = scale.Name === 'Chromatic' || scale.SemitoneSteps.length === 12;
      expect(isChromatic).toBe(true);
    });

    test('isChromatic helper should return false for non-chromatic scales', () => {
      const nonChromaticScales = scales.filter(s => s.name !== 'Chromatic');

      nonChromaticScales.forEach((scaleRecipe) => {
        const scale = new MusicScale(scaleRecipe, 'C');
        const isChromatic = scale.Name === 'Chromatic' || scale.SemitoneSteps.length === 12;
        expect(isChromatic).toBe(false);
      });
    });
  });
});
