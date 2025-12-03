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
  activeVideoTab: 'Enter_url',
  // Modal visibility and positioning
  helpVisible: false,
  shareModalOpen: false,
  modalPositions: {
    video: { x: null, y: null },
    help: { x: null, y: null },
    share: { x: null, y: null }
  }
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
    const isValid = isValidVideoURL(state.videoUrl);
    if (isValid) {
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

  // === MODAL VISIBILITY AND POSITIONING ===

  // Encode help overlay visibility
  if (state.helpVisible !== undefined && state.helpVisible !== DEFAULT_SETTINGS.helpVisible) {
    params.set('helpVisible', state.helpVisible ? 'true' : 'false');
  }

  // Encode share modal open state
  if (state.shareModalOpen !== undefined && state.shareModalOpen !== DEFAULT_SETTINGS.shareModalOpen) {
    params.set('shareModalOpen', state.shareModalOpen ? 'true' : 'false');
  }

  // Encode modal positions from nested structure
  // Note: URL parameters remain flat (videoModalX, helpModalX, etc.) for backward compatibility
  // But we now read from state.modalPositions.video.x instead of state.videoModalX

  // Encode video modal position (only if videoActive is true)
  if (state.videoActive && state.modalPositions?.video?.x !== null && state.modalPositions?.video?.x !== undefined) {
    params.set('videoModalX', Math.round(state.modalPositions.video.x).toString());
  }
  if (state.videoActive && state.modalPositions?.video?.y !== null && state.modalPositions?.video?.y !== undefined) {
    params.set('videoModalY', Math.round(state.modalPositions.video.y).toString());
  }

  // Encode help modal position (only if helpVisible is true)
  if (state.helpVisible && state.modalPositions?.help?.x !== null && state.modalPositions?.help?.x !== undefined) {
    params.set('helpModalX', Math.round(state.modalPositions.help.x).toString());
  }
  if (state.helpVisible && state.modalPositions?.help?.y !== null && state.modalPositions?.help?.y !== undefined) {
    params.set('helpModalY', Math.round(state.modalPositions.help.y).toString());
  }

  // Encode share modal position (only if shareModalOpen is true)
  if (state.shareModalOpen && state.modalPositions?.share?.x !== null && state.modalPositions?.share?.x !== undefined) {
    params.set('shareModalX', Math.round(state.modalPositions.share.x).toString());
  }
  if (state.shareModalOpen && state.modalPositions?.share?.y !== null && state.modalPositions?.share?.y !== undefined) {
    params.set('shareModalY', Math.round(state.modalPositions.share.y).toString());
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
  const settings = {
    ...DEFAULT_SETTINGS,
    // Deep clone modalPositions to avoid shared references
    modalPositions: {
      video: { ...DEFAULT_SETTINGS.modalPositions.video },
      help: { ...DEFAULT_SETTINGS.modalPositions.help },
      share: { ...DEFAULT_SETTINGS.modalPositions.share }
    }
  };
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
    const isValid = isValidVideoURL(videoUrl);
    if (isValid) {
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

  // === MODAL VISIBILITY AND POSITIONING ===

  // Decode help overlay visibility
  if (params.has('helpVisible')) {
    const helpVisible = parseBoolean(params.get('helpVisible'));
    if (helpVisible !== null) {
      settings.helpVisible = helpVisible;
    } else {
      errors.push('Invalid help visibility value (must be true or false), using default.');
    }
  }

  // Decode share modal open state
  if (params.has('shareModalOpen')) {
    const shareModalOpen = parseBoolean(params.get('shareModalOpen'));
    if (shareModalOpen !== null) {
      settings.shareModalOpen = shareModalOpen;
    } else {
      errors.push('Invalid share modal open value (must be true or false), using default.');
    }
  }

  // Helper function to parse and validate modal position
  const parseModalPosition = (value, min = 0, max = 10000) => {
    const pos = parseInt(value, 10);
    if (isNaN(pos)) return null;
    // Clamp to reasonable bounds to keep modals on screen
    return Math.max(min, Math.min(max, pos));
  };

  // Decode modal positions into nested structure
  // Note: URL parameters are flat (videoModalX, helpModalX, etc.) for backward compatibility
  // But we populate the nested modalPositions structure

  // Decode video modal position
  if (params.has('videoModalX')) {
    const videoModalX = parseModalPosition(params.get('videoModalX'));
    if (videoModalX !== null) {
      settings.modalPositions.video.x = videoModalX;
    } else {
      errors.push('Invalid video modal X position (must be numeric), using default.');
    }
  }
  if (params.has('videoModalY')) {
    const videoModalY = parseModalPosition(params.get('videoModalY'));
    if (videoModalY !== null) {
      settings.modalPositions.video.y = videoModalY;
    } else {
      errors.push('Invalid video modal Y position (must be numeric), using default.');
    }
  }

  // Decode help modal position
  if (params.has('helpModalX')) {
    const helpModalX = parseModalPosition(params.get('helpModalX'));
    if (helpModalX !== null) {
      settings.modalPositions.help.x = helpModalX;
    } else {
      errors.push('Invalid help modal X position (must be numeric), using default.');
    }
  }
  if (params.has('helpModalY')) {
    const helpModalY = parseModalPosition(params.get('helpModalY'));
    if (helpModalY !== null) {
      settings.modalPositions.help.y = helpModalY;
    } else {
      errors.push('Invalid help modal Y position (must be numeric), using default.');
    }
  }

  // Decode share modal position
  if (params.has('shareModalX')) {
    const shareModalX = parseModalPosition(params.get('shareModalX'));
    if (shareModalX !== null) {
      settings.modalPositions.share.x = shareModalX;
    } else {
      errors.push('Invalid share modal X position (must be numeric), using default.');
    }
  }
  if (params.has('shareModalY')) {
    const shareModalY = parseModalPosition(params.get('shareModalY'));
    if (shareModalY !== null) {
      settings.modalPositions.share.y = shareModalY;
    } else {
      errors.push('Invalid share modal Y position (must be numeric), using default.');
    }
  }

  return { settings, errors };
}

/**
 * Exports DEFAULT_SETTINGS for use in other modules
 */
export { DEFAULT_SETTINGS };
