/**
 * Video platform types
 */
export const VideoPlatform = {
  YOUTUBE_VIDEO: 'youtube-video',
  YOUTUBE_PLAYLIST: 'youtube-playlist',
  VIMEO: 'vimeo',
  DAILYMOTION: 'dailymotion',
  SOUNDCLOUD: 'soundcloud',
  FILE_URL: 'file-url',
  UNKNOWN: 'unknown'
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid format
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check if URL starts with http:// or https://
  const urlPattern = /^https?:\/\/.+/i;
  return urlPattern.test(url);
}

/**
 * Detect video platform from URL and determine if ReactPlayer can play it
 * @param {string} url - Video URL to analyze
 * @returns {{url: string, platform: string, canPlay: boolean}} - Platform information
 */
export function detectVideoSource(url) {
  // Default result for invalid URLs
  if (!url || typeof url !== 'string') {
    return {
      url: url || '',
      platform: VideoPlatform.UNKNOWN,
      canPlay: false
    };
  }

  let platform = VideoPlatform.UNKNOWN;

  // Detect platform from URL patterns
  if (url.includes('youtube.com/playlist') || (url.includes('youtube.com/watch?') && url.includes('&list='))) {
    platform = VideoPlatform.YOUTUBE_PLAYLIST;
  } else if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    platform = VideoPlatform.YOUTUBE_VIDEO;
  } else if (url.includes('vimeo.com/')) {
    platform = VideoPlatform.VIMEO;
  } else if (url.includes('dailymotion.com/video/')) {
    platform = VideoPlatform.DAILYMOTION;
  } else if (url.includes('soundcloud.com/')) {
    platform = VideoPlatform.SOUNDCLOUD;
  } else if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) {
    platform = VideoPlatform.FILE_URL;
  }

  // Determine if URL can be played based on platform detection
  const canPlay = platform !== VideoPlatform.UNKNOWN;

  return {
    url,
    platform,
    canPlay
  };
}
