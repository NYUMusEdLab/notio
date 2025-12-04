/**
 * Integration tests for URL encoder/decoder service
 *
 * Tests encoding/decoding of all 17 settings parameters, round-trips,
 * custom scales, and error handling with defaults
 */

import { encodeSettingsToURL, decodeSettingsFromURL, DEFAULT_SETTINGS } from '../urlEncoder';

describe('encodeSettingsToURL', () => {
  describe('Basic encoding', () => {
    test('encodes default settings to empty query string', () => {
      const url = encodeSettingsToURL(DEFAULT_SETTINGS, 'https://test.com/');
      expect(url).toBe('https://test.com/');
    });

    test('encodes octave parameter', () => {
      const state = { ...DEFAULT_SETTINGS, octave: 5 };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('o=5');
    });

    test('encodes octave distance parameter', () => {
      const state = { ...DEFAULT_SETTINGS, octaveDist: 2 };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('od=2');
    });

    test('encodes scale name parameter', () => {
      const state = { ...DEFAULT_SETTINGS, scale: 'Dorian' };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('s=Dorian');
    });

    test('encodes base note parameter', () => {
      const state = { ...DEFAULT_SETTINGS, baseNote: 'D' };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('bn=D');
    });

    test('encodes clef parameter', () => {
      const state = { ...DEFAULT_SETTINGS, clef: 'bass' };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('c=bass');
    });

    test('encodes instrument parameter', () => {
      const state = { ...DEFAULT_SETTINGS, instrumentSound: 'guitar' };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('i=guitar');
    });

    test('encodes theme parameter', () => {
      const state = { ...DEFAULT_SETTINGS, theme: 'dark' };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('t=dark');
    });
  });

  describe('Boolean encoding', () => {
    test('encodes pianoOn as 1 when true', () => {
      const state = { ...DEFAULT_SETTINGS, pianoOn: true };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      // Default is true, so should not appear
      expect(url).toBe('https://test.com/');
    });

    test('encodes pianoOn as 0 when false', () => {
      const state = { ...DEFAULT_SETTINGS, pianoOn: false };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('p=0');
    });

    test('encodes extendedKeyboard as 1 when true', () => {
      const state = { ...DEFAULT_SETTINGS, extendedKeyboard: true };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('ek=1');
    });

    test('encodes trebleStaffOn as 0 when false', () => {
      const state = { ...DEFAULT_SETTINGS, trebleStaffOn: false };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('ts=0');
    });

    test('encodes showOffNotes as 0 when false', () => {
      const state = { ...DEFAULT_SETTINGS, showOffNotes: false };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('son=0');
    });

    test('encodes videoActive as 1 when true', () => {
      const state = { ...DEFAULT_SETTINGS, videoActive: true };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('va=1');
    });
  });

  describe('Array encoding', () => {
    test('encodes notation array as comma-separated values', () => {
      const state = { ...DEFAULT_SETTINGS, notation: ['Colors', 'Steps'] };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('n=Colors%2CSteps');
    });

    test('encodes single notation value', () => {
      const state = { ...DEFAULT_SETTINGS, notation: ['Steps'] };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('n=Steps');
    });

    test('encodes multiple notation values', () => {
      const state = { ...DEFAULT_SETTINGS, notation: ['Colors', 'Steps', 'Relative'] };
      const url = encodeSettingsToURL(state, 'https://test.com/');
      const params = new URLSearchParams(url.split('?')[1]);
      expect(params.get('n')).toBe('Colors,Steps,Relative');
    });
  });

  describe('Custom scale encoding', () => {
    test('encodes custom scale with all parameters', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        scale: 'Blues',
        scaleObject: {
          name: 'Blues Pentatonic',
          steps: [0, 3, 5, 6, 7, 10],
          numbers: ['1', 'b3', '4', 'b5', '5', 'b7']
        }
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      const params = new URLSearchParams(url.split('?')[1]);

      expect(params.get('s')).toBe('Blues');
      expect(params.get('sn')).toBe('Blues Pentatonic');
      expect(params.get('ss')).toBe('0,3,5,6,7,10');
      expect(params.get('snum')).toBe('1,b3,4,b5,5,b7');
    });

    test('does not encode default Major scale', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        scaleObject: DEFAULT_SETTINGS.scaleObject
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toBe('https://test.com/');
    });

    test('encodes scale with special characters in name', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        scale: 'My Custom Scale (Test)',
        scaleObject: {
          name: 'My Custom Scale (Test)',
          steps: [0, 2, 4],
          numbers: ['1', '2', '3']
        }
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('sn=My+Custom+Scale+%28Test%29');
    });
  });

  describe('Video URL encoding', () => {
    test('encodes valid HTTPS video URL', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'https://www.youtube.com/watch?v=abc123'
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      const params = new URLSearchParams(url.split('?')[1]);
      expect(params.get('v')).toBe('https://www.youtube.com/watch?v=abc123');
    });

    test('does not encode invalid video URL', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'javascript:alert(1)'
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).not.toContain('v=');
    });

    test('does not encode empty video URL', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        videoUrl: ''
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).not.toContain('v=');
    });

    test('encodes activeVideoTab parameter', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        activeVideoTab: 'Player'
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      expect(url).toContain('vt=Player');
    });
  });

  describe('Complete configuration encoding', () => {
    test('encodes all parameters when all different from defaults', () => {
      const state = {
        octave: 5,
        octaveDist: 1,
        scale: 'Dorian',
        scaleObject: {
          name: 'Dorian',
          steps: [0, 2, 3, 5, 7, 9, 10],
          numbers: ['1', '2', 'b3', '4', '5', '6', 'b7']
        },
        baseNote: 'D',
        clef: 'bass',
        notation: ['Colors', 'Steps'],
        instrumentSound: 'guitar',
        pianoOn: false,
        extendedKeyboard: true,
        trebleStaffOn: false,
        theme: 'dark',
        showOffNotes: false,
        videoUrl: 'https://www.youtube.com/watch?v=test',
        videoActive: true,
        activeVideoTab: 'Player'
      };

      const url = encodeSettingsToURL(state, 'https://test.com/');
      const params = new URLSearchParams(url.split('?')[1]);

      expect(params.get('o')).toBe('5');
      expect(params.get('od')).toBe('1');
      expect(params.get('s')).toBe('Dorian');
      expect(params.get('bn')).toBe('D');
      expect(params.get('c')).toBe('bass');
      expect(params.get('n')).toBe('Colors,Steps');
      expect(params.get('i')).toBe('guitar');
      expect(params.get('p')).toBe('0');
      expect(params.get('ek')).toBe('1');
      expect(params.get('ts')).toBe('0');
      expect(params.get('t')).toBe('dark');
      expect(params.get('son')).toBe('0');
      expect(params.get('v')).toBe('https://www.youtube.com/watch?v=test');
      expect(params.get('va')).toBe('1');
      expect(params.get('vt')).toBe('Player');
    });
  });
});

describe('decodeSettingsFromURL', () => {
  describe('Basic decoding', () => {
    test('decodes empty parameters to defaults', () => {
      const params = new URLSearchParams('');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings).toEqual(DEFAULT_SETTINGS);
      expect(errors).toHaveLength(0);
    });

    test('decodes octave parameter', () => {
      const params = new URLSearchParams('o=5');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.octave).toBe(5);
    });

    test('decodes octave distance parameter', () => {
      const params = new URLSearchParams('od=2');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.octaveDist).toBe(2);
    });

    test('decodes scale parameter', () => {
      const params = new URLSearchParams('s=Dorian');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.scale).toBe('Dorian');
    });

    test('decodes base note parameter', () => {
      const params = new URLSearchParams('bn=D');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.baseNote).toBe('D');
    });

    test('decodes base note with sharp', () => {
      const params = new URLSearchParams('bn=F%23');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.baseNote).toBe('F#');
    });

    test('decodes base note with flat', () => {
      const params = new URLSearchParams('bn=Bb');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.baseNote).toBe('Bb');
    });
  });

  describe('Boolean decoding', () => {
    test('decodes pianoOn as true for value 1', () => {
      const params = new URLSearchParams('p=1');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.pianoOn).toBe(true);
    });

    test('decodes pianoOn as false for value 0', () => {
      const params = new URLSearchParams('p=0');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.pianoOn).toBe(false);
    });

    test('decodes extendedKeyboard as true', () => {
      const params = new URLSearchParams('ek=1');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.extendedKeyboard).toBe(true);
    });

    test('decodes all boolean parameters', () => {
      const params = new URLSearchParams('p=0&ek=1&ts=0&son=0&va=1');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.pianoOn).toBe(false);
      expect(settings.extendedKeyboard).toBe(true);
      expect(settings.trebleStaffOn).toBe(false);
      expect(settings.showOffNotes).toBe(false);
      expect(settings.videoActive).toBe(true);
    });
  });

  describe('Array decoding', () => {
    test('decodes notation array', () => {
      const params = new URLSearchParams('n=Colors,Steps');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.notation).toEqual(['Colors', 'Steps']);
    });

    test('decodes single notation value', () => {
      const params = new URLSearchParams('n=Steps');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.notation).toEqual(['Steps']);
    });

    test('decodes multiple notation values', () => {
      const params = new URLSearchParams('n=Colors,Steps,Relative');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.notation).toEqual(['Colors', 'Steps', 'Relative']);
    });
  });

  describe('Custom scale decoding', () => {
    test('decodes complete custom scale', () => {
      const params = new URLSearchParams('sn=Blues+Pentatonic&ss=0,3,5,6,7,10&snum=1,b3,4,b5,5,b7');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.scaleObject).toEqual({
        name: 'Blues Pentatonic',
        steps: [0, 3, 5, 6, 7, 10],
        numbers: ['1', 'b3', '4', 'b5', '5', 'b7']
      });
      expect(settings.scale).toBe('Blues Pentatonic');
      expect(errors).toHaveLength(0);
    });

    test('falls back to default when custom scale is invalid', () => {
      const params = new URLSearchParams('sn=Invalid&ss=0,12,5&snum=1,2,3');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.scaleObject).toEqual(DEFAULT_SETTINGS.scaleObject);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid custom scale');
    });

    test('requires all three parameters for custom scale', () => {
      const params = new URLSearchParams('sn=Test&ss=0,2,4');
      const { settings } = decodeSettingsFromURL(params);

      // Should use default scale since snum is missing
      expect(settings.scaleObject).toEqual(DEFAULT_SETTINGS.scaleObject);
    });
  });

  describe('Validation and error handling', () => {
    test('falls back to default for invalid octave', () => {
      const params = new URLSearchParams('o=10');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.octave).toBe(DEFAULT_SETTINGS.octave);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid octave');
    });

    test('falls back to default for invalid octave distance', () => {
      const params = new URLSearchParams('od=5');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.octaveDist).toBe(DEFAULT_SETTINGS.octaveDist);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('falls back to default for invalid base note', () => {
      const params = new URLSearchParams('bn=H');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.baseNote).toBe(DEFAULT_SETTINGS.baseNote);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('falls back to default for invalid clef', () => {
      const params = new URLSearchParams('c=invalid');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.clef).toBe(DEFAULT_SETTINGS.clef);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('falls back to default for invalid theme', () => {
      const params = new URLSearchParams('t=rainbow');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.theme).toBe(DEFAULT_SETTINGS.theme);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('rejects invalid video URL', () => {
      const params = new URLSearchParams('v=javascript:alert(1)');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.videoUrl).toBe(DEFAULT_SETTINGS.videoUrl);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid video URL');
    });

    test('accumulates multiple errors', () => {
      const params = new URLSearchParams('o=10&bn=H&c=invalid&v=javascript:alert(1)');
      const { errors } = decodeSettingsFromURL(params);

      expect(errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Round-trip encoding/decoding', () => {
    test('round-trips default settings', () => {
      const originalState = { ...DEFAULT_SETTINGS };
      const url = encodeSettingsToURL(originalState);
      const params = new URLSearchParams(url.split('?')[1] || '');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings).toEqual(originalState);
      expect(errors).toHaveLength(0);
    });

    test('round-trips complete configuration', () => {
      const originalState = {
        octave: 5,
        octaveDist: 1,
        scale: 'Dorian',
        scaleObject: {
          name: 'Dorian',
          steps: [0, 2, 3, 5, 7, 9, 10],
          numbers: ['1', '2', 'b3', '4', '5', '6', 'b7']
        },
        baseNote: 'D',
        clef: 'bass',
        notation: ['Colors', 'Steps'],
        instrumentSound: 'guitar',
        pianoOn: false,
        extendedKeyboard: true,
        trebleStaffOn: false,
        theme: 'dark',
        showOffNotes: false,
        videoUrl: 'https://www.youtube.com/watch?v=test',
        videoActive: true,
        activeVideoTab: 'Player'
      };

      const url = encodeSettingsToURL(originalState);
      const params = new URLSearchParams(url.split('?')[1]);
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.octave).toBe(originalState.octave);
      expect(settings.octaveDist).toBe(originalState.octaveDist);
      expect(settings.scale).toBe(originalState.scale);
      expect(settings.scaleObject).toEqual(originalState.scaleObject);
      expect(settings.baseNote).toBe(originalState.baseNote);
      expect(settings.clef).toBe(originalState.clef);
      expect(settings.notation).toEqual(originalState.notation);
      expect(settings.instrumentSound).toBe(originalState.instrumentSound);
      expect(settings.pianoOn).toBe(originalState.pianoOn);
      expect(settings.extendedKeyboard).toBe(originalState.extendedKeyboard);
      expect(settings.trebleStaffOn).toBe(originalState.trebleStaffOn);
      expect(settings.theme).toBe(originalState.theme);
      expect(settings.showOffNotes).toBe(originalState.showOffNotes);
      expect(settings.videoUrl).toBe(originalState.videoUrl);
      expect(settings.videoActive).toBe(originalState.videoActive);
      expect(settings.activeVideoTab).toBe(originalState.activeVideoTab);
      expect(errors).toHaveLength(0);
    });

    test('round-trips custom scale with special characters', () => {
      const originalState = {
        ...DEFAULT_SETTINGS,
        scale: 'My Blues Scale (Test)',
        scaleObject: {
          name: 'My Blues Scale (Test)',
          steps: [0, 3, 5, 6, 7, 10],
          numbers: ['1', 'b3', '4', '#4', '5', 'b7']
        }
      };

      const url = encodeSettingsToURL(originalState);
      const params = new URLSearchParams(url.split('?')[1]);
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.scaleObject).toEqual(originalState.scaleObject);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Edge cases', () => {
    test('handles duplicate parameters (uses last value)', () => {
      const params = new URLSearchParams('o=4&o=5');
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.octave).toBe(5);
    });

    test('handles empty parameter values', () => {
      const params = new URLSearchParams('o=&s=');
      const { settings } = decodeSettingsFromURL(params);

      // Empty values should fall back to defaults
      expect(settings.octave).toBe(DEFAULT_SETTINGS.octave);
    });

    test('handles unknown parameters gracefully', () => {
      const params = new URLSearchParams('o=5&unknownParam=value&futureFeature=test');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.octave).toBe(5);
      // Unknown parameters should be ignored without errors
      expect(errors).toHaveLength(0);
    });
  });
});
