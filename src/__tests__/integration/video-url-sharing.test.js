/**
 * Integration Test: Video URL Sharing
 *
 * Verifies that video URLs are correctly encoded into shareable links
 * and decoded when opening shared links.
 *
 * This test ensures the video URL sharing functionality works end-to-end.
 */

import { encodeSettingsToURL, decodeSettingsFromURL, DEFAULT_SETTINGS } from '../../services/urlEncoder';

describe('Video URL Sharing Integration', () => {
  describe('Encoding video URLs', () => {
    test('encodes YouTube URL into shareable link', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoActive: true,
        activeVideoTab: 'Player'
      };

      const url = encodeSettingsToURL(state, 'https://notio.app/');

      expect(url).toContain('videoUrl=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ');
      expect(url).toContain('videoModalOpen=true');
      expect(url).toContain('videoTab=Player');
    });

    test('encodes video URL when modal is open', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'https://www.youtube.com/watch?v=test123',
        videoActive: true
      };

      const url = encodeSettingsToURL(state, '');
      const params = new URLSearchParams(url.replace('/?', ''));

      expect(params.get('videoUrl')).toBe('https://www.youtube.com/watch?v=test123');
      expect(params.get('videoModalOpen')).toBe('true');
    });

    test('does not encode invalid video URLs', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'http://insecure.com/video', // Not HTTPS
        videoActive: true
      };

      const url = encodeSettingsToURL(state, '');

      expect(url).not.toContain('videoUrl=');
    });

    test('encodes default Notio tutorial URL', () => {
      const state = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLJlCFAn07qvSJl-tkcm0mTOZo0E6UrIkC',
        videoActive: true
      };

      const url = encodeSettingsToURL(state, '');

      expect(url).toContain('videoUrl=');
    });
  });

  describe('Decoding video URLs from shared links', () => {
    test('decodes YouTube URL from URL parameters', () => {
      const params = new URLSearchParams('videoUrl=https://www.youtube.com/watch?v=dQw4w9WgXcQ&videoModalOpen=true&videoTab=Player');

      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.videoUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(settings.videoActive).toBe(true);
      expect(settings.activeVideoTab).toBe('Player');
      expect(errors).toHaveLength(0);
    });

    test('rejects invalid video URLs and adds error', () => {
      const params = new URLSearchParams('videoUrl=javascript:alert(1)');

      const { settings, errors } = decodeSettingsFromURL(params);

      expect(settings.videoUrl).not.toBe('javascript:alert(1)');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('Invalid video URL'))).toBe(true);
    });
  });

  describe('Round-trip video URL sharing', () => {
    test('preserves video URL through encode → decode cycle', () => {
      const originalState = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'https://www.youtube.com/watch?v=test123',
        videoActive: true,
        activeVideoTab: 'Player'
      };

      // Encode to URL
      const encodedURL = encodeSettingsToURL(originalState, 'https://notio.app/');

      // Decode back
      const params = new URL(encodedURL).searchParams;
      const { settings } = decodeSettingsFromURL(params);

      // Verify video URL is preserved
      expect(settings.videoUrl).toBe(originalState.videoUrl);
      expect(settings.videoActive).toBe(originalState.videoActive);
      expect(settings.activeVideoTab).toBe(originalState.activeVideoTab);
    });

    test('preserves playlist URLs', () => {
      const playlistURL = 'https://www.youtube.com/playlist?list=PLJlCFAn07qvSJl-tkcm0mTOZo0E6UrIkC';
      const originalState = {
        ...DEFAULT_SETTINGS,
        videoUrl: playlistURL,
        videoActive: true
      };

      const encodedURL = encodeSettingsToURL(originalState, '');
      const params = new URLSearchParams(encodedURL.replace('/?', ''));
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.videoUrl).toBe(playlistURL);
    });

    test('handles special characters in video URLs', () => {
      const urlWithParams = 'https://www.youtube.com/watch?v=abc123&t=30s';
      const originalState = {
        ...DEFAULT_SETTINGS,
        videoUrl: urlWithParams,
        videoActive: true
      };

      const encodedURL = encodeSettingsToURL(originalState, '');
      const params = new URLSearchParams(encodedURL.replace('/?', ''));
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.videoUrl).toBe(urlWithParams);
    });
  });

  describe('Real-world scenarios', () => {
    test('teacher shares video tutorial with specific settings', () => {
      const teacherState = {
        ...DEFAULT_SETTINGS,
        videoUrl: 'https://www.youtube.com/watch?v=teacher-video',
        videoActive: true,
        activeVideoTab: 'Player',
        scale: 'Dorian',
        baseNote: 'D',
        clef: 'bass'
      };

      const shareURL = encodeSettingsToURL(teacherState, 'https://notio.app/');
      const studentParams = new URL(shareURL).searchParams;
      const { settings: studentSettings } = decodeSettingsFromURL(studentParams);

      // Student receives same video and settings
      expect(studentSettings.videoUrl).toBe(teacherState.videoUrl);
      expect(studentSettings.videoActive).toBe(true);
      expect(studentSettings.scale).toBe('Dorian');
      expect(studentSettings.baseNote).toBe('D');
      expect(studentSettings.clef).toBe('bass');
    });

    test('handles URL with all features configured', () => {
      const fullState = {
        ...DEFAULT_SETTINGS,
        octave: 5,
        scale: 'Phrygian',
        baseNote: 'E',
        clef: 'tenor',
        notation: ['Colors', 'Scale Steps'],
        instrumentSound: 'violin',
        videoUrl: 'https://www.youtube.com/watch?v=comprehensive',
        videoActive: true,
        activeVideoTab: 'Player',
        modalPositions: {
          video: { x: 100, y: 150 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
      };

      const url = encodeSettingsToURL(fullState, '');
      const params = new URLSearchParams(url.replace('/?', ''));
      const { settings } = decodeSettingsFromURL(params);

      expect(settings.videoUrl).toBe(fullState.videoUrl);
      expect(settings.videoActive).toBe(true);
      expect(settings.octave).toBe(5);
      expect(settings.scale).toBe('Phrygian');
    });
  });
});
