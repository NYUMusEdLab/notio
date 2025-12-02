/**
 * URL Encoder/Decoder Service
 *
 * Encodes application settings to URL query parameters and decodes them back.
 * Uses abbreviated parameter names to minimize URL length.
 *
 * URL Schema Version: 1.0.0
 * See: specs/004-url-settings-storage/contracts/url-schema.md
 */

import { isValidVideoURL, validateCustomScale } from './urlValidator';

/**
 * Parameter name mapping (abbreviated -> full name)
 * Abbreviations minimize URL length while maintaining readability
 */
const PARAM_MAP = {
  o: 'octave',
  od: 'octaveDist',
  s: 'scale',
  sn: 'scaleName',
  ss: 'scaleSteps',
  snum: 'scaleNumbers',
  bn: 'baseNote',
  c: 'clef',
  n: 'notation',
  i: 'instrumentSound',
  p: 'pianoOn',
  ek: 'extendedKeyboard',
  ts: 'trebleStaffOn',
  t: 'theme',
  son: 'showOffNotes',
  v: 'videoUrl',
  va: 'videoActive',
  vt: 'activeVideoTab'
};

/**
 * Default settings for fallback when parameters are missing or invalid
 */
const DEFAULT_SETTINGS = {
  octave: 4,
  octaveDist: 0,
  scale: 'Major (Ionian)',
  scaleObject: {
    name: 'Major (Ionian)',
    steps: [0, 2, 4, 5, 7, 9, 11],
    numbers: ['1', '2', '3', '4', '5', '6', '△7']
  },
  baseNote: 'C',
  clef: 'treble',
  notation: ['Colors'],
  instrumentSound: 'piano',
  pianoOn: true,
  extendedKeyboard: false,
  trebleStaffOn: true,
  theme: 'light',
  showOffNotes: true,
  videoUrl: '',
  videoActive: false,
  activeVideoTab: 'Enter_url'
};

/**
 * Encodes application settings to a complete URL with query parameters
 *
 * @param {Object} state - Current application state from WholeApp
 * @param {string} baseURL - Base URL (default: window.location.origin + pathname)
 * @returns {string} Complete URL with encoded parameters
 *
 * @example
 * const url = encodeSettingsToURL(this.state);
 * // Returns: "https://notio.app/?o=4&s=Major&bn=C&..."
 */
export function encodeSettingsToURL(state, baseURL = null) {
  // Use provided baseURL, or default to current location
  // Note: Must check for null specifically, not falsy, so empty string '' works
  const base = baseURL !== null ? baseURL : (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://notio.app/');
  const params = new URLSearchParams();

  // Encode octave (only if not default)
  if (state.octave !== DEFAULT_SETTINGS.octave) {
    params.set('o', state.octave.toString());
  }

  // Encode octave distance (only if not default)
  if (state.octaveDist !== undefined && state.octaveDist !== DEFAULT_SETTINGS.octaveDist) {
    params.set('od', state.octaveDist.toString());
  }

  // Encode scale name (only if not default)
  if (state.scale && state.scale !== DEFAULT_SETTINGS.scale) {
    params.set('s', state.scale);
  }

  // Encode custom scale object (if present and different from defaults)
  if (state.scaleObject) {
    const { name, steps, numbers } = state.scaleObject;

    // Only encode custom scale if it's not the default Major scale
    const isCustomScale = name !== DEFAULT_SETTINGS.scaleObject.name ||
                          JSON.stringify(steps) !== JSON.stringify(DEFAULT_SETTINGS.scaleObject.steps);

    if (isCustomScale) {
      params.set('sn', name);
      params.set('ss', steps.join(','));
      params.set('snum', numbers.join(','));
    }
  }

  // Encode base note (only if not default)
  if (state.baseNote && state.baseNote !== DEFAULT_SETTINGS.baseNote) {
    params.set('bn', state.baseNote);
  }

  // Encode clef (only if not default)
  if (state.clef && state.clef !== DEFAULT_SETTINGS.clef) {
    params.set('c', state.clef);
  }

  // Encode notation array (only if not default)
  if (state.notation && Array.isArray(state.notation)) {
    const defaultNotation = JSON.stringify(DEFAULT_SETTINGS.notation);
    const currentNotation = JSON.stringify(state.notation);
    if (currentNotation !== defaultNotation) {
      params.set('n', state.notation.join(','));
    }
  }

  // Encode instrument sound (only if not default)
  if (state.instrumentSound && state.instrumentSound !== DEFAULT_SETTINGS.instrumentSound) {
    params.set('i', state.instrumentSound);
  }

  // Encode piano visibility (only if not default)
  if (state.pianoOn !== undefined && state.pianoOn !== DEFAULT_SETTINGS.pianoOn) {
    params.set('p', state.pianoOn ? '1' : '0');
  }

  // Encode extended keyboard (only if not default)
  if (state.extendedKeyboard !== undefined && state.extendedKeyboard !== DEFAULT_SETTINGS.extendedKeyboard) {
    params.set('ek', state.extendedKeyboard ? '1' : '0');
  }

  // Encode treble staff visibility (only if not default)
  if (state.trebleStaffOn !== undefined && state.trebleStaffOn !== DEFAULT_SETTINGS.trebleStaffOn) {
    params.set('ts', state.trebleStaffOn ? '1' : '0');
  }

  // Encode theme (only if not default)
  if (state.theme && state.theme !== DEFAULT_SETTINGS.theme) {
    params.set('t', state.theme);
  }

  // Encode show off notes (only if not default)
  if (state.showOffNotes !== undefined && state.showOffNotes !== DEFAULT_SETTINGS.showOffNotes) {
    params.set('son', state.showOffNotes ? '1' : '0');
  }

  // Encode video URL (only if present and valid)
  if (state.videoUrl && state.videoUrl.trim() !== '' && isValidVideoURL(state.videoUrl)) {
    params.set('v', state.videoUrl);
  }

  // Encode video active (only if not default)
  if (state.videoActive !== undefined && state.videoActive !== DEFAULT_SETTINGS.videoActive) {
    params.set('va', state.videoActive ? '1' : '0');
  }

  // Encode active video tab (only if not default)
  if (state.activeVideoTab && state.activeVideoTab !== DEFAULT_SETTINGS.activeVideoTab) {
    params.set('vt', state.activeVideoTab);
  }

  // Build final URL
  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Decodes URL parameters into application settings
 *
 * @param {URLSearchParams} params - URL search parameters to decode
 * @returns {Object} Object containing settings and any errors encountered
 * @returns {Object} result.settings - Decoded settings (with defaults for invalid/missing)
 * @returns {string[]} result.errors - Array of error messages for invalid parameters
 *
 * @example
 * const params = new URLSearchParams(window.location.search);
 * const { settings, errors } = decodeSettingsFromURL(params);
 * if (errors.length > 0) {
 *   console.warn('Invalid parameters:', errors);
 * }
 */
export function decodeSettingsFromURL(params) {
  const settings = { ...DEFAULT_SETTINGS };
  const errors = [];

  // Decode octave
  if (params.has('o')) {
    const octave = parseInt(params.get('o'), 10);
    if (!isNaN(octave) && octave >= 1 && octave <= 8) {
      settings.octave = octave;
    } else {
      errors.push('Invalid octave value (must be 1-8), using default.');
    }
  }

  // Decode octave distance
  if (params.has('od')) {
    const octaveDist = parseInt(params.get('od'), 10);
    if (!isNaN(octaveDist) && octaveDist >= -3 && octaveDist <= 3) {
      settings.octaveDist = octaveDist;
    } else {
      errors.push('Invalid octave distance (must be -3 to +3), using default.');
    }
  }

  // Decode scale name
  if (params.has('s')) {
    const scale = params.get('s');
    if (scale && scale.trim() !== '') {
      settings.scale = scale;
    }
  }

  // Decode custom scale object (all three parameters must be present and valid)
  if (params.has('sn') && params.has('ss') && params.has('snum')) {
    const name = params.get('sn');
    const stepsStr = params.get('ss');
    const numbersStr = params.get('snum');

    try {
      const steps = stepsStr.split(',').map(s => parseInt(s.trim(), 10));
      const numbers = numbersStr.split(',').map(s => s.trim());

      const scaleObject = { name, steps, numbers };
      const validation = validateCustomScale(scaleObject);

      if (validation.valid) {
        settings.scaleObject = scaleObject;
        settings.scale = name; // Update scale name to match custom scale
      } else {
        errors.push(`Invalid custom scale: ${validation.error}. Using default scale.`);
      }
    } catch (error) {
      errors.push('Invalid custom scale format. Using default scale.');
    }
  }

  // Decode base note
  if (params.has('bn')) {
    const baseNote = params.get('bn');
    const baseNoteRegex = /^[A-G][#b]?$/;
    if (baseNote && baseNoteRegex.test(baseNote)) {
      settings.baseNote = baseNote;
    } else {
      errors.push('Invalid base note format (must be A-G with optional # or b), using default.');
    }
  }

  // Decode clef
  if (params.has('c')) {
    const clef = params.get('c');
    const validClefs = ['treble', 'bass', 'tenor', 'alto', 'hide notes'];
    if (validClefs.includes(clef)) {
      settings.clef = clef;
      settings.trebleStaffOn = clef !== 'hide notes';
    } else {
      errors.push('Invalid clef value, using default.');
    }
  }

  // Decode notation array
  if (params.has('n')) {
    const notationStr = params.get('n');
    const notation = notationStr.split(',').map(n => n.trim()).filter(n => n !== '');
    if (notation.length > 0) {
      settings.notation = notation;
    } else {
      errors.push('Invalid notation format, using default.');
    }
  }

  // Decode instrument sound
  if (params.has('i')) {
    const instrument = params.get('i');
    if (instrument && instrument.trim() !== '') {
      settings.instrumentSound = instrument;
      // Note: Validation against available instruments happens in WholeApp
    }
  }

  // Decode piano visibility
  if (params.has('p')) {
    const pianoOn = params.get('p');
    if (pianoOn === '1') {
      settings.pianoOn = true;
    } else if (pianoOn === '0') {
      settings.pianoOn = false;
    } else {
      errors.push('Invalid piano visibility value (must be 0 or 1), using default.');
    }
  }

  // Decode extended keyboard
  if (params.has('ek')) {
    const extendedKeyboard = params.get('ek');
    if (extendedKeyboard === '1') {
      settings.extendedKeyboard = true;
    } else if (extendedKeyboard === '0') {
      settings.extendedKeyboard = false;
    } else {
      errors.push('Invalid extended keyboard value (must be 0 or 1), using default.');
    }
  }

  // Decode treble staff visibility
  if (params.has('ts')) {
    const trebleStaffOn = params.get('ts');
    if (trebleStaffOn === '1') {
      settings.trebleStaffOn = true;
    } else if (trebleStaffOn === '0') {
      settings.trebleStaffOn = false;
    } else {
      errors.push('Invalid staff visibility value (must be 0 or 1), using default.');
    }
  }

  // Decode theme
  if (params.has('t')) {
    const theme = params.get('t');
    const validThemes = ['light', 'dark'];
    if (validThemes.includes(theme)) {
      settings.theme = theme;
    } else {
      errors.push('Invalid theme value (must be light or dark), using default.');
    }
  }

  // Decode show off notes
  if (params.has('son')) {
    const showOffNotes = params.get('son');
    if (showOffNotes === '1') {
      settings.showOffNotes = true;
    } else if (showOffNotes === '0') {
      settings.showOffNotes = false;
    } else {
      errors.push('Invalid show off notes value (must be 0 or 1), using default.');
    }
  }

  // Decode video URL (with security validation)
  if (params.has('v')) {
    const videoUrl = params.get('v');
    if (isValidVideoURL(videoUrl)) {
      settings.videoUrl = videoUrl;
    } else {
      errors.push('Invalid video URL (must use HTTPS and contain no dangerous content), ignoring.');
      settings.videoUrl = DEFAULT_SETTINGS.videoUrl;
    }
  }

  // Decode video active
  if (params.has('va')) {
    const videoActive = params.get('va');
    if (videoActive === '1') {
      settings.videoActive = true;
    } else if (videoActive === '0') {
      settings.videoActive = false;
    } else {
      errors.push('Invalid video active value (must be 0 or 1), using default.');
    }
  }

  // Decode active video tab
  if (params.has('vt')) {
    const activeVideoTab = params.get('vt');
    const validTabs = ['Enter_url', 'Player'];
    if (validTabs.includes(activeVideoTab)) {
      settings.activeVideoTab = activeVideoTab;
    } else {
      errors.push('Invalid video tab value (must be Enter_url or Player), using default.');
    }
  }

  return { settings, errors };
}

/**
 * Exports DEFAULT_SETTINGS for use in other modules
 */
export { DEFAULT_SETTINGS };
