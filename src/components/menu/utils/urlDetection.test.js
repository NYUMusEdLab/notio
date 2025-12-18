import { detectVideoSource, validateUrl, VideoPlatform } from './urlDetection';

describe('validateUrl', () => {
  test('should validate HTTPS URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('https://www.youtube.com/watch?v=abc123')).toBe(true);
  });

  test('should validate HTTP URLs', () => {
    expect(validateUrl('http://example.com')).toBe(true);
    expect(validateUrl('http://example.com/video.mp4')).toBe(true);
  });

  test('should reject malformed URLs', () => {
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('ftp://example.com')).toBe(false);
    expect(validateUrl('//example.com')).toBe(false);
  });

  test('should reject empty or null URLs', () => {
    expect(validateUrl('')).toBe(false);
    expect(validateUrl(null)).toBe(false);
    expect(validateUrl(undefined)).toBe(false);
  });

  test('should reject non-string inputs', () => {
    expect(validateUrl(123)).toBe(false);
    expect(validateUrl({})).toBe(false);
    expect(validateUrl([])).toBe(false);
  });
});

describe('detectVideoSource', () => {
  describe('YouTube video detection', () => {
    test('should detect YouTube video with youtube.com/watch', () => {
      const result = detectVideoSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(result.platform).toBe(VideoPlatform.YOUTUBE_VIDEO);
      expect(result.canPlay).toBe(true);
    });

    test('should detect YouTube video with youtu.be shortlink', () => {
      const result = detectVideoSource('https://youtu.be/dQw4w9WgXcQ');
      expect(result.platform).toBe(VideoPlatform.YOUTUBE_VIDEO);
      expect(result.canPlay).toBe(true);
    });

    test('should detect YouTube video with additional parameters', () => {
      const result = detectVideoSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s');
      expect(result.platform).toBe(VideoPlatform.YOUTUBE_VIDEO);
      expect(result.canPlay).toBe(true);
    });
  });

  describe('YouTube playlist detection', () => {
    test('should detect YouTube playlist URL', () => {
      const result = detectVideoSource('https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf');
      expect(result.platform).toBe(VideoPlatform.YOUTUBE_PLAYLIST);
      expect(result.canPlay).toBe(true);
    });

    test('should detect YouTube video with playlist parameter', () => {
      const result = detectVideoSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxxx');
      expect(result.platform).toBe(VideoPlatform.YOUTUBE_PLAYLIST);
      expect(result.canPlay).toBe(true);
    });
  });

  describe('Vimeo detection', () => {
    test('should detect Vimeo video URL', () => {
      const result = detectVideoSource('https://vimeo.com/123456789');
      expect(result.platform).toBe(VideoPlatform.VIMEO);
      expect(result.canPlay).toBe(true);
    });

    test('should detect Vimeo URL with additional path segments', () => {
      const result = detectVideoSource('https://vimeo.com/channels/staffpicks/123456789');
      expect(result.platform).toBe(VideoPlatform.VIMEO);
      expect(result.canPlay).toBe(true);
    });
  });

  describe('Dailymotion detection', () => {
    test('should detect Dailymotion video URL', () => {
      const result = detectVideoSource('https://www.dailymotion.com/video/x8b9ziu');
      expect(result.platform).toBe(VideoPlatform.DAILYMOTION);
      expect(result.canPlay).toBe(true);
    });
  });

  describe('SoundCloud detection', () => {
    test('should detect SoundCloud URL', () => {
      const result = detectVideoSource('https://soundcloud.com/artist/track-name');
      expect(result.platform).toBe(VideoPlatform.SOUNDCLOUD);
      expect(result.canPlay).toBe(true);
    });
  });

  describe('Direct file URL detection', () => {
    test('should detect MP4 file URL', () => {
      const result = detectVideoSource('https://example.com/video.mp4');
      expect(result.platform).toBe(VideoPlatform.FILE_URL);
      expect(result.canPlay).toBe(true);
    });

    test('should detect WebM file URL', () => {
      const result = detectVideoSource('https://example.com/video.webm');
      expect(result.platform).toBe(VideoPlatform.FILE_URL);
      expect(result.canPlay).toBe(true);
    });

    test('should detect OGG file URL', () => {
      const result = detectVideoSource('https://example.com/video.ogg');
      expect(result.platform).toBe(VideoPlatform.FILE_URL);
      expect(result.canPlay).toBe(true);
    });

    test('should detect MOV file URL', () => {
      const result = detectVideoSource('https://example.com/video.mov');
      expect(result.platform).toBe(VideoPlatform.FILE_URL);
      expect(result.canPlay).toBe(true);
    });

    test('should detect M4V file URL', () => {
      const result = detectVideoSource('https://example.com/video.m4v');
      expect(result.platform).toBe(VideoPlatform.FILE_URL);
      expect(result.canPlay).toBe(true);
    });

    test('should detect file URL with query parameters', () => {
      const result = detectVideoSource('https://example.com/video.mp4?token=abc123');
      expect(result.platform).toBe(VideoPlatform.FILE_URL);
      expect(result.canPlay).toBe(true);
    });

    test('should handle case-insensitive file extensions', () => {
      const result = detectVideoSource('https://example.com/video.MP4');
      expect(result.platform).toBe(VideoPlatform.FILE_URL);
      expect(result.canPlay).toBe(true);
    });
  });

  describe('Unknown/unsupported URL detection', () => {
    test('should return unknown for unsupported platform', () => {
      const result = detectVideoSource('https://example.com/random-page');
      expect(result.platform).toBe(VideoPlatform.UNKNOWN);
      expect(result.canPlay).toBe(false);
    });

    test('should return unknown for malformed URL', () => {
      const result = detectVideoSource('not-a-url');
      expect(result.platform).toBe(VideoPlatform.UNKNOWN);
      expect(result.canPlay).toBe(false);
    });

    test('should handle empty string', () => {
      const result = detectVideoSource('');
      expect(result.url).toBe('');
      expect(result.platform).toBe(VideoPlatform.UNKNOWN);
      expect(result.canPlay).toBe(false);
    });

    test('should handle null input', () => {
      const result = detectVideoSource(null);
      expect(result.url).toBe('');
      expect(result.platform).toBe(VideoPlatform.UNKNOWN);
      expect(result.canPlay).toBe(false);
    });

    test('should handle undefined input', () => {
      const result = detectVideoSource(undefined);
      expect(result.url).toBe('');
      expect(result.platform).toBe(VideoPlatform.UNKNOWN);
      expect(result.canPlay).toBe(false);
    });
  });

  describe('Return structure', () => {
    test('should always return url, platform, and canPlay fields', () => {
      const result = detectVideoSource('https://www.youtube.com/watch?v=abc123');
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('platform');
      expect(result).toHaveProperty('canPlay');
    });

    test('should preserve original URL in result', () => {
      const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const result = detectVideoSource(testUrl);
      expect(result.url).toBe(testUrl);
    });
  });
});
