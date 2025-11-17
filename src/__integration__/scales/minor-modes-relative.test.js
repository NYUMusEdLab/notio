import MusicScale from '../../Model/MusicScale';
import scales from '../../data/scalesObj';

describe('Minor Modes Relative Syllables (US4)', () => {
  const naturalMinorScale = scales.find(s => s.name === 'Natural Minor/Aeolian');
  const harmonicMinorScale = scales.find(s => s.name === 'Harmonic Minor');
  const phrygianScale = scales.find(s => s.name === 'Phrygian');
  const locrianScale = scales.find(s => s.name === 'Locrian');

  describe('Natural Minor - should display DO RE ME FA SO LE TE', () => {
    const expectedSyllables = ['DO', 'RE', 'ME', 'FA', 'SO', 'LE', 'TE'];

    test.each(['C', 'D', 'E', 'F', 'G', 'A', 'B'])(
      'Natural minor in %s should have correct syllables',
      (rootNote) => {
        const scale = new MusicScale(naturalMinorScale, rootNote);
        const relativeSyllables = scale.ExtendedScaleToneNames.Relative;

        // Extract unique syllables from the extended scale (which repeats)
        const uniqueSyllables = [];
        for (let i = 0; i < naturalMinorScale.steps.length; i++) {
          uniqueSyllables.push(relativeSyllables[i]);
        }

        expect(uniqueSyllables).toEqual(expectedSyllables);
      }
    );
  });

  describe('Harmonic Minor - should display DO RE ME FA SO LE TI', () => {
    const expectedSyllables = ['DO', 'RE', 'ME', 'FA', 'SO', 'LE', 'TI'];

    test.each(['C', 'D', 'E', 'F', 'G', 'A', 'B'])(
      'Harmonic minor in %s should have correct syllables',
      (rootNote) => {
        const scale = new MusicScale(harmonicMinorScale, rootNote);
        const relativeSyllables = scale.ExtendedScaleToneNames.Relative;

        const uniqueSyllables = [];
        for (let i = 0; i < harmonicMinorScale.steps.length; i++) {
          uniqueSyllables.push(relativeSyllables[i]);
        }

        expect(uniqueSyllables).toEqual(expectedSyllables);
      }
    );
  });

  describe('Phrygian - should display DO RA ME FA SO LE TE', () => {
    const expectedSyllables = ['DO', 'RA', 'ME', 'FA', 'SO', 'LE', 'TE'];

    test.each(['C', 'D', 'E', 'F', 'G', 'A', 'B'])(
      'Phrygian in %s should have correct syllables',
      (rootNote) => {
        const scale = new MusicScale(phrygianScale, rootNote);
        const relativeSyllables = scale.ExtendedScaleToneNames.Relative;

        const uniqueSyllables = [];
        for (let i = 0; i < phrygianScale.steps.length; i++) {
          uniqueSyllables.push(relativeSyllables[i]);
        }

        expect(uniqueSyllables).toEqual(expectedSyllables);
      }
    );
  });

  describe('Locrian - should display DO RA ME FA SE LE TE', () => {
    const expectedSyllables = ['DO', 'RA', 'ME', 'FA', 'SE', 'LE', 'TE'];

    test.each(['C', 'D', 'E', 'F', 'G', 'A', 'B'])(
      'Locrian in %s should have correct syllables',
      (rootNote) => {
        const scale = new MusicScale(locrianScale, rootNote);
        const relativeSyllables = scale.ExtendedScaleToneNames.Relative;

        const uniqueSyllables = [];
        for (let i = 0; i < locrianScale.steps.length; i++) {
          uniqueSyllables.push(relativeSyllables[i]);
        }

        expect(uniqueSyllables).toEqual(expectedSyllables);
      }
    );
  });

  test('All four minor modes have LE for the 6th degree', () => {
    const testCases = [
      { scale: naturalMinorScale, name: 'Natural Minor', sixthDegreeIndex: 5 },
      { scale: harmonicMinorScale, name: 'Harmonic Minor', sixthDegreeIndex: 5 },
      { scale: phrygianScale, name: 'Phrygian', sixthDegreeIndex: 5 },
      { scale: locrianScale, name: 'Locrian', sixthDegreeIndex: 5 },
    ];

    testCases.forEach(({ scale, name, sixthDegreeIndex }) => {
      const scaleObj = new MusicScale(scale, 'C');
      const relativeSyllables = scaleObj.ExtendedScaleToneNames.Relative;
      expect(relativeSyllables[sixthDegreeIndex]).toBe('LE');
    });
  });

  test('Locrian has SE for the 5th degree', () => {
    const scale = new MusicScale(locrianScale, 'C');
    const relativeSyllables = scale.ExtendedScaleToneNames.Relative;
    expect(relativeSyllables[4]).toBe('SE'); // 5th degree (index 4) should be SE
  });
});
