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

  // === MUSICAL SETTINGS ===

  // Encode octave (only if not default)
  if (state.octave !== DEFAULT_SETTINGS.octave) {
    params.set('octave', state.octave.toString());
  }

  // Encode octave distance (only if not default)
  if (state.octaveDist !== undefined && state.octaveDist !== DEFAULT_SETTINGS.octaveDist) {
    params.set('octaveDistance', state.octaveDist.toString());
  }

  // Encode scale name (only if not default)
  if (state.scale && state.scale !== DEFAULT_SETTINGS.scale) {
    params.set('scale', state.scale);
  }

  // Encode custom scale object (if present and different from defaults)
  if (state.scaleObject) {
    const { name, steps, numbers } = state.scaleObject;

    // Only encode custom scale if it's not the default Major scale
    const isCustomScale = name !== DEFAULT_SETTINGS.scaleObject.name ||
                          JSON.stringify(steps) !== JSON.stringify(DEFAULT_SETTINGS.scaleObject.steps);

    if (isCustomScale) {
      params.set('scaleName', name);
      params.set('scaleSteps', steps.join(','));
      params.set('scaleNumbers', numbers.join(','));
    }
  }

  // Encode base note / root note (only if not default)
  if (state.baseNote && state.baseNote !== DEFAULT_SETTINGS.baseNote) {
    params.set('baseNote', state.baseNote);
  }

  // Encode clef (only if not default)
  if (state.clef && state.clef !== DEFAULT_SETTINGS.clef) {
    params.set('clef', state.clef);
  }

  // Encode notation array (only if not default)
  if (state.notation && Array.isArray(state.notation)) {
    const defaultNotation = JSON.stringify(DEFAULT_SETTINGS.notation);
    const currentNotation = JSON.stringify(state.notation);
    if (currentNotation !== defaultNotation) {
      params.set('notation', state.notation.join(','));
    }
  }

  // Encode instrument sound (only if not default)
  if (state.instrumentSound && state.instrumentSound !== DEFAULT_SETTINGS.instrumentSound) {
    params.set('instrument', state.instrumentSound);
  }

  // === UI VISIBILITY TOGGLES ===

  // Encode piano visibility (only if not default)
  if (state.pianoOn !== undefined && state.pianoOn !== DEFAULT_SETTINGS.pianoOn) {
    params.set('pianoVisible', state.pianoOn ? 'true' : 'false');
  }

  // Encode extended keyboard (only if not default)
  if (state.extendedKeyboard !== undefined && state.extendedKeyboard !== DEFAULT_SETTINGS.extendedKeyboard) {
    params.set('extendedKeyboard', state.extendedKeyboard ? 'true' : 'false');
  }

  // Encode treble staff visibility (only if not default)
  if (state.trebleStaffOn !== undefined && state.trebleStaffOn !== DEFAULT_SETTINGS.trebleStaffOn) {
    params.set('staffVisible', state.trebleStaffOn ? 'true' : 'false');
  }

  // Encode theme (only if not default)
  if (state.theme && state.theme !== DEFAULT_SETTINGS.theme) {
    params.set('theme', state.theme);
  }

  // Encode show off notes (only if not default)
  if (state.showOffNotes !== undefined && state.showOffNotes !== DEFAULT_SETTINGS.showOffNotes) {
    params.set('showOffNotes', state.showOffNotes ? 'true' : 'false');
  }

  // === VIDEO/TUTORIAL SETTINGS ===

  // Encode video URL (only if present and valid)
  if (state.videoUrl && state.videoUrl.trim() !== '') {
    const validation = isValidVideoURL(state.videoUrl);
    if (validation.valid) {
      params.set('videoUrl', state.videoUrl);
    }
  }

  // Encode video modal open state (THIS IS KEY FOR TUTORIAL SHARING!)
  // If videoActive is true, the video modal opens automatically when someone opens the URL
  if (state.videoActive !== undefined && state.videoActive !== DEFAULT_SETTINGS.videoActive) {
    params.set('videoModalOpen', state.videoActive ? 'true' : 'false');
  }

  // Encode active video tab (Player vs Enter_url)
  if (state.activeVideoTab && state.activeVideoTab !== DEFAULT_SETTINGS.activeVideoTab) {
    params.set('videoTab', state.activeVideoTab);
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

  // Helper function to parse boolean values
  const parseBoolean = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null; // Invalid value
  };

  // === MUSICAL SETTINGS ===

  // Decode octave
  if (params.has('octave')) {
    const octave = parseInt(params.get('octave'), 10);
    if (!isNaN(octave) && octave >= 1 && octave <= 8) {
      settings.octave = octave;
    } else {
      errors.push('Invalid octave value (must be 1-8), using default.');
    }
  }

  // Decode octave distance
  if (params.has('octaveDistance')) {
    const octaveDist = parseInt(params.get('octaveDistance'), 10);
    if (!isNaN(octaveDist) && octaveDist >= -3 && octaveDist <= 3) {
      settings.octaveDist = octaveDist;
    } else {
      errors.push('Invalid octave distance (must be -3 to +3), using default.');
    }
  }

  // Decode scale name
  if (params.has('scale')) {
    const scale = params.get('scale');
    if (scale && scale.trim() !== '') {
      settings.scale = scale;
    }
  }

  // Decode custom scale object (all three parameters must be present and valid)
  if (params.has('scaleName') && params.has('scaleSteps') && params.has('scaleNumbers')) {
    const name = params.get('scaleName');
    const stepsStr = params.get('scaleSteps');
    const numbersStr = params.get('scaleNumbers');

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
  if (params.has('baseNote')) {
    const baseNote = params.get('baseNote');
    const baseNoteRegex = /^[A-G][#b]?$/;
    if (baseNote && baseNoteRegex.test(baseNote)) {
      settings.baseNote = baseNote;
    } else {
      errors.push('Invalid base note format (must be A-G with optional # or b), using default.');
    }
  }

  // Decode clef
  if (params.has('clef')) {
    const clef = params.get('clef');
    const validClefs = ['treble', 'bass', 'tenor', 'alto', 'hide notes'];
    if (validClefs.includes(clef)) {
      settings.clef = clef;
      settings.trebleStaffOn = clef !== 'hide notes';
    } else {
      errors.push('Invalid clef value, using default.');
    }
  }

  // Decode notation array
  if (params.has('notation')) {
    const notationStr = params.get('notation');
    const notation = notationStr.split(',').map(n => n.trim()).filter(n => n !== '');
    if (notation.length > 0) {
      settings.notation = notation;
    } else {
      errors.push('Invalid notation format, using default.');
    }
  }

  // Decode instrument sound
  if (params.has('instrument')) {
    const instrument = params.get('instrument');
    if (instrument && instrument.trim() !== '') {
      settings.instrumentSound = instrument;
      // Note: Validation against available instruments happens in WholeApp
    }
  }

  // === UI VISIBILITY TOGGLES ===

  // Decode piano visibility
  if (params.has('pianoVisible')) {
    const pianoOn = parseBoolean(params.get('pianoVisible'));
    if (pianoOn !== null) {
      settings.pianoOn = pianoOn;
    } else {
      errors.push('Invalid piano visibility value (must be true or false), using default.');
    }
  }

  // Decode extended keyboard
  if (params.has('extendedKeyboard')) {
    const extendedKeyboard = parseBoolean(params.get('extendedKeyboard'));
    if (extendedKeyboard !== null) {
      settings.extendedKeyboard = extendedKeyboard;
    } else {
      errors.push('Invalid extended keyboard value (must be true or false), using default.');
    }
  }

  // Decode treble staff visibility
  if (params.has('staffVisible')) {
    const trebleStaffOn = parseBoolean(params.get('staffVisible'));
    if (trebleStaffOn !== null) {
      settings.trebleStaffOn = trebleStaffOn;
    } else {
      errors.push('Invalid staff visibility value (must be true or false), using default.');
    }
  }

  // Decode theme
  if (params.has('theme')) {
    const theme = params.get('theme');
    const validThemes = ['light', 'dark'];
    if (validThemes.includes(theme)) {
      settings.theme = theme;
    } else {
      errors.push('Invalid theme value (must be light or dark), using default.');
    }
  }

  // Decode show off notes
  if (params.has('showOffNotes')) {
    const showOffNotes = parseBoolean(params.get('showOffNotes'));
    if (showOffNotes !== null) {
      settings.showOffNotes = showOffNotes;
    } else {
      errors.push('Invalid show off notes value (must be true or false), using default.');
    }
  }

  // === VIDEO/TUTORIAL SETTINGS ===

  // Decode video URL
  if (params.has('videoUrl')) {
    const videoUrl = params.get('videoUrl');
    const validation = isValidVideoURL(videoUrl);
    if (validation.valid) {
      settings.videoUrl = videoUrl;
    } else {
      errors.push('Invalid video URL (must use HTTPS and contain no dangerous content), ignoring.');
      settings.videoUrl = DEFAULT_SETTINGS.videoUrl;
    }
  }

  // Decode video modal open state
  // THIS IS KEY FOR TUTORIAL SHARING - allows auto-opening video modal
  if (params.has('videoModalOpen')) {
    const videoActive = parseBoolean(params.get('videoModalOpen'));
    if (videoActive !== null) {
      settings.videoActive = videoActive;
    } else {
      errors.push('Invalid video modal state (must be true or false), using default.');
    }
  }

  // Decode active video tab
  if (params.has('videoTab')) {
    const activeVideoTab = params.get('videoTab');
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
