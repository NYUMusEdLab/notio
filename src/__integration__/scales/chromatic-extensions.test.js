import MusicScale from '../../Model/MusicScale';
import scales from '../../data/scalesObj';

describe('Chromatic Scale Extensions (US1)', () => {
  const chromaticScale = scales.find(s => s.name === 'Chromatic');
  const chromaticScalesWithFlats = ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'B'];

  test.each(chromaticScalesWithFlats)(
    'Chromatic scale %s with Extensions mode should not show extra "m" extension',
    (rootNote) => {
      const scale = new MusicScale(chromaticScale, rootNote);

      // Get chord extensions
      const extensions = scale.ExtendedScaleToneNames.Chord_extensions;

      // Verify no "m" extension appears in the chromatic scale
      expect(extensions).not.toContain('m');

      // Verify the extensions array is correct for flats chromatic
      // Should use: [" ", "b9", "9", "#9", " ", "11", "b5", "5", "b13", "13", "7", "△7"]
      const expectedExtensions = [" ", "b9", "9", "#9", " ", "11", "b5", "5", "b13", "13", "7", "△7"];

      // Check the pattern repeats correctly across the extended scale
      extensions.forEach((ext, index) => {
        expect(ext).toBe(expectedExtensions[index % 12]);
      });
    }
  );

  test.each(['C', 'C#', 'D', 'D#', 'E', 'F#', 'G', 'G#', 'A', 'A#'])(
    'Chromatic scale %s with sharps should not show "m" extension',
    (rootNote) => {
      const scale = new MusicScale(chromaticScale, rootNote);

      // Get chord extensions
      const extensions = scale.ExtendedScaleToneNames.Chord_extensions;

      // Verify no "m" extension appears
      expect(extensions).not.toContain('m');
    }
  );

  test('Switching between chromatic scales maintains correct extensions', () => {
    // Start with Db chromatic
    let scale = new MusicScale(chromaticScale, 'Db');
    let extensions = scale.ExtendedScaleToneNames.Chord_extensions;
    expect(extensions).not.toContain('m');

    // Switch to C chromatic
    scale = new MusicScale(chromaticScale, 'C');
    extensions = scale.ExtendedScaleToneNames.Chord_extensions;
    expect(extensions).not.toContain('m');

    // Switch to Eb chromatic
    scale = new MusicScale(chromaticScale, 'Eb');
    extensions = scale.ExtendedScaleToneNames.Chord_extensions;
    expect(extensions).not.toContain('m');
  });
});
