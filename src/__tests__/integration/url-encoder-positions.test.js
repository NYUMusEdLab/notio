/**
 * Integration Tests: URL Encoder - Modal Positions
 *
 * Tests the encoding and decoding of modal positions to/from URL parameters.
 * Covers the complete roundtrip flow: state → URL → state.
 *
 * Coverage Target: 100% of modal position encoding/decoding logic
 * Performance Target: < 1 second for all tests
 *
 * Related Tasks: T006
 * Related Contract: specs/005-url-storage-completion/contracts/test-structure.md
 */

import { encodeSettingsToURL, decodeSettingsFromURL, DEFAULT_SETTINGS } from '../../services/urlEncoder';

describe('URL Encoder - Modal Positions Integration', () => {
  // Helper to create URLSearchParams from encoded URL
  const getParamsFromURL = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams;
  };

  // Helper to create a complete state object with modal positions
  const createState = (partialState) => ({
    ...DEFAULT_SETTINGS,
    // Deep clone modalPositions from DEFAULT_SETTINGS to avoid shared references
    modalPositions: {
      video: { ...DEFAULT_SETTINGS.modalPositions.video },
      help: { ...DEFAULT_SETTINGS.modalPositions.help },
      share: { ...DEFAULT_SETTINGS.modalPositions.share }
    },
    ...partialState
  });

  describe('Encoding modal positions to URL', () => {
    test('encodes video modal position when videoActive is true', () => {
      const state = createState({
        videoActive: true,
        modalPositions: {
          video: { x: 100, y: 150 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.get('videoModalX')).toBe('100');
      expect(params.get('videoModalY')).toBe('150');
      expect(params.get('videoModalOpen')).toBe('true');
    });

    test('does NOT encode video modal position when videoActive is false', () => {
      const state = createState({
        videoActive: false,
        modalPositions: {
          video: { x: 100, y: 150 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.has('videoModalX')).toBe(false);
      expect(params.has('videoModalY')).toBe(false);
    });

    test('does NOT encode video modal position when videoActive is undefined', () => {
      const state = createState({
        modalPositions: {
          video: { x: 100, y: 150 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.has('videoModalX')).toBe(false);
      expect(params.has('videoModalY')).toBe(false);
    });

    test('encodes help modal position when helpVisible is true', () => {
      const state = createState({
        helpVisible: true,
        modalPositions: {
          video: { x: null, y: null },
          help: { x: 200, y: 250 },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.get('helpModalX')).toBe('200');
      expect(params.get('helpModalY')).toBe('250');
      expect(params.get('helpVisible')).toBe('true');
    });

    test('does NOT encode help modal position when helpVisible is false', () => {
      const state = createState({
        helpVisible: false,
        modalPositions: {
          video: { x: null, y: null },
          help: { x: 200, y: 250 },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.has('helpModalX')).toBe(false);
      expect(params.has('helpModalY')).toBe(false);
    });

    test('encodes share modal position when shareModalOpen is true', () => {
      const state = createState({
        shareModalOpen: true,
        modalPositions: {
          video: { x: null, y: null },
          help: { x: null, y: null },
          share: { x: 300, y: 350 }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.get('shareModalX')).toBe('300');
      expect(params.get('shareModalY')).toBe('350');
      expect(params.get('shareModalOpen')).toBe('true');
    });

    test('does NOT encode share modal position when shareModalOpen is false', () => {
      const state = createState({
        shareModalOpen: false,
        modalPositions: {
          video: { x: null, y: null },
          help: { x: null, y: null },
          share: { x: 300, y: 350 }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.has('shareModalX')).toBe(false);
      expect(params.has('shareModalY')).toBe(false);
    });

    test('encodes multiple modal positions simultaneously', () => {
      const state = createState({
        videoActive: true,
        helpVisible: true,
        shareModalOpen: true,
        modalPositions: {
          video: { x: 100, y: 150 },
          help: { x: 200, y: 250 },
          share: { x: 300, y: 350 }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      // Video modal
      expect(params.get('videoModalX')).toBe('100');
      expect(params.get('videoModalY')).toBe('150');
      // Help modal
      expect(params.get('helpModalX')).toBe('200');
      expect(params.get('helpModalY')).toBe('250');
      // Share modal
      expect(params.get('shareModalX')).toBe('300');
      expect(params.get('shareModalY')).toBe('350');
    });

    test('rounds floating point positions to integers', () => {
      const state = createState({
        videoActive: true,
        modalPositions: {
          video: { x: 123.456, y: 789.987 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.get('videoModalX')).toBe('123');
      expect(params.get('videoModalY')).toBe('790'); // Rounds up
    });

    test('ignores null position values', () => {
      const state = createState({
        videoActive: true,
        modalPositions: {
          video: { x: null, y: 150 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.has('videoModalX')).toBe(false);
      expect(params.get('videoModalY')).toBe('150');
    });

    test('ignores undefined position values', () => {
      const state = createState({
        videoActive: true,
        modalPositions: {
          video: { x: 100, y: undefined },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.get('videoModalX')).toBe('100');
      expect(params.has('videoModalY')).toBe(false);
    });
  });

  describe('Decoding modal positions from URL', () => {
    test('decodes video modal position from URL parameters', () => {
      const params = new URLSearchParams('videoModalX=100&videoModalY=150');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(100);
      expect(settings.modalPositions.video.y).toBe(150);
      expect(errors).toHaveLength(0);
    });

    test('decodes help modal position from URL parameters', () => {
      const params = new URLSearchParams('helpModalX=200&helpModalY=250');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.help.x).toBe(200);
      expect(settings.modalPositions.help.y).toBe(250);
      expect(errors).toHaveLength(0);
    });

    test('decodes share modal position from URL parameters', () => {
      const params = new URLSearchParams('shareModalX=300&shareModalY=350');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.share.x).toBe(300);
      expect(settings.modalPositions.share.y).toBe(350);
      expect(errors).toHaveLength(0);
    });

    test('decodes multiple modal positions simultaneously', () => {
      const params = new URLSearchParams(
        'videoModalX=100&videoModalY=150&' +
        'helpModalX=200&helpModalY=250&' +
        'shareModalX=300&shareModalY=350'
      );
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(100);
      expect(settings.modalPositions.video.y).toBe(150);
      expect(settings.modalPositions.help.x).toBe(200);
      expect(settings.modalPositions.help.y).toBe(250);
      expect(settings.modalPositions.share.x).toBe(300);
      expect(settings.modalPositions.share.y).toBe(350);
      expect(errors).toHaveLength(0);
    });

    test('clamps negative position values to 0', () => {
      const params = new URLSearchParams('videoModalX=-100&videoModalY=-50');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(0);
      expect(settings.modalPositions.video.y).toBe(0);
      expect(errors).toHaveLength(0);
    });

    test('clamps position values above 10000 to 10000', () => {
      const params = new URLSearchParams('videoModalX=15000&videoModalY=20000');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(10000);
      expect(settings.modalPositions.video.y).toBe(10000);
      expect(errors).toHaveLength(0);
    });

    test('returns null for non-numeric position values and adds error', () => {
      const params = new URLSearchParams('videoModalX=foo&videoModalY=bar');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBeNull();
      expect(settings.modalPositions.video.y).toBeNull();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('video modal X'))).toBe(true);
      expect(errors.some(e => e.includes('video modal Y'))).toBe(true);
    });

    test('handles partial position data (X without Y)', () => {
      const params = new URLSearchParams('videoModalX=100');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(100);
      expect(settings.modalPositions.video.y).toBeNull(); // Default value
      expect(errors).toHaveLength(0);
    });

    test('handles partial position data (Y without X)', () => {
      const params = new URLSearchParams('videoModalY=150');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBeNull(); // Default value
      expect(settings.modalPositions.video.y).toBe(150);
      expect(errors).toHaveLength(0);
    });

    test('handles boundary values correctly', () => {
      const params = new URLSearchParams('videoModalX=0&videoModalY=10000');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(0);
      expect(settings.modalPositions.video.y).toBe(10000);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Round-trip encoding and decoding', () => {
    test('round-trip preserves single modal position', () => {
      const originalState = createState({
        videoActive: true,
        modalPositions: {
          video: { x: 123, y: 456 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(originalState);
      const params = getParamsFromURL(url);
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(123);
      expect(settings.modalPositions.video.y).toBe(456);
    });

    test('round-trip preserves all modal positions', () => {
      const originalState = createState({
        videoActive: true,
        helpVisible: true,
        shareModalOpen: true,
        modalPositions: {
          video: { x: 100, y: 150 },
          help: { x: 200, y: 250 },
          share: { x: 300, y: 350 }
        }
      });

      const url = encodeSettingsToURL(originalState);
      const params = getParamsFromURL(url);
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(100);
      expect(settings.modalPositions.video.y).toBe(150);
      expect(settings.modalPositions.help.x).toBe(200);
      expect(settings.modalPositions.help.y).toBe(250);
      expect(settings.modalPositions.share.x).toBe(300);
      expect(settings.modalPositions.share.y).toBe(350);
    });

    test('round-trip handles clamping correctly', () => {
      const originalState = createState({
        videoActive: true,
        modalPositions: {
          video: { x: -100, y: 15000 }, // Should clamp to 0 and 10000
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(originalState);
      const params = getParamsFromURL(url);
      const { settings } = decodeSettingsFromURL(params);

      // Encoding doesn't clamp, but decoding does
      expect(settings.modalPositions.video.x).toBe(0);
      expect(settings.modalPositions.video.y).toBe(10000);
    });

    test('round-trip handles floating point rounding', () => {
      const originalState = createState({
        videoActive: true,
        modalPositions: {
          video: { x: 123.7, y: 456.3 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(originalState);
      const params = getParamsFromURL(url);
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBe(124); // Rounded
      expect(settings.modalPositions.video.y).toBe(456); // Rounded
    });
  });

  describe('Edge cases and error handling', () => {
    test('handles empty state object', () => {
      const state = createState({});
      const url = encodeSettingsToURL(state);

      // Should return base URL with no parameters
      expect(url).not.toContain('?');
    });

    test('handles state with only visibility flags (no positions)', () => {
      const state = createState({
        videoActive: true,
        helpVisible: true,
        shareModalOpen: true
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.get('videoModalOpen')).toBe('true');
      expect(params.get('helpVisible')).toBe('true');
      expect(params.get('shareModalOpen')).toBe('true');
      expect(params.has('videoModalX')).toBe(false);
      expect(params.has('helpModalX')).toBe(false);
      expect(params.has('shareModalX')).toBe(false);
    });

    test('handles URL with no modal parameters', () => {
      const params = new URLSearchParams('octave=4&scale=Major');
      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.modalPositions.video.x).toBeNull();
      expect(settings.modalPositions.video.y).toBeNull();
      expect(settings.modalPositions.help.x).toBeNull();
      expect(settings.modalPositions.help.y).toBeNull();
      expect(settings.modalPositions.share.x).toBeNull();
      expect(settings.modalPositions.share.y).toBeNull();
      expect(errors).toHaveLength(0);
    });

    test('handles zero values for positions', () => {
      const state = createState({
        videoActive: true,
        modalPositions: {
          video: { x: 0, y: 0 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      });

      const url = encodeSettingsToURL(state);
      const params = getParamsFromURL(url);

      expect(params.get('videoModalX')).toBe('0');
      expect(params.get('videoModalY')).toBe('0');
    });

    test('performance: encodes all positions within time budget', () => {
      const state = createState({
        videoActive: true,
        helpVisible: true,
        shareModalOpen: true,
        modalPositions: {
          video: { x: 100, y: 150 },
          help: { x: 200, y: 250 },
          share: { x: 300, y: 350 }
        }
      });

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        encodeSettingsToURL(state);
      }
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 1000 encodings should complete in < 200ms (0.2ms per encoding)
      // Note: Performance varies by machine, 200ms is a reasonable budget
      expect(duration).toBeLessThan(200);
    });

    test('performance: decodes all positions within time budget', () => {
      const params = new URLSearchParams(
        'videoModalX=100&videoModalY=150&' +
        'helpModalX=200&helpModalY=250&' +
        'shareModalX=300&shareModalY=350'
      );

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        decodeSettingsFromURL(params);
      }
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 1000 decodings should complete in < 200ms (0.2ms per decoding)
      // Note: Performance varies by machine, 200ms is a reasonable budget
      expect(duration).toBeLessThan(200);
    });
  });
});
