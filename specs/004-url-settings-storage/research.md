# Research: URL-Based Settings Storage

**Feature**: 004-url-settings-storage
**Date**: 2025-12-02
**Status**: Complete

## Overview

Research decisions for migrating from Firebase database storage to URL query parameter encoding for user configurations.

## Research Topics

### 1. URL Parameter Encoding Strategy

**Decision**: Use URLSearchParams with abbreviated parameter names

**Rationale**:
- Browser-native API with excellent cross-browser support (IE10+)
- Automatic encoding/decoding of special characters
- Built-in handling of duplicate parameters (takes last value)
- No external dependencies required
- Compact parameter names reduce URL length:
  - `o=4` instead of `octave=4`
  - `s=Major` instead of `scale=Major`
  - `bn=C` instead of `baseNote=C`

**Alternatives Considered**:
- **Base64-encoded JSON**: Rejected because:
  - Harder to debug (not human-readable)
  - Single point of failure (one corrupted char breaks entire URL)
  - No graceful degradation for partial parameter loss
  - Difficult to extend (requires full re-encoding for one setting change)
- **Hash-based encoding (#param1=value1)**: Rejected because:
  - Doesn't integrate with browser history as cleanly
  - Not indexed by search engines (minor consideration)
  - URLSearchParams is more standard
- **Custom binary encoding**: Rejected due to complexity, debugging difficulty

**Implementation Notes**:
```javascript
// Encoding example
const params = new URLSearchParams();
params.set('o', state.octave);
params.set('s', state.scale);
const url = `${window.location.origin}/?${params.toString()}`;

// Decoding example
const params = new URLSearchParams(window.location.search);
const octave = parseInt(params.get('o')) || DEFAULT_OCTAVE;
```

---

### 2. Complex Object Serialization (Scale Objects)

**Decision**: Separate parameters with comma-separated values for arrays

**Rationale**:
- Maintains human-readability in URLs
- Easy to validate individual components
- Graceful degradation if one parameter is malformed
- Simple to document for developers

**Format**:
```
?sn=My+Custom+Scale&ss=0,2,4,5,7,9,11&snum=1,2,3,4,5,6,7
```
- `sn` = scale name
- `ss` = scale steps (comma-separated integers 0-11)
- `snum` = scale numbers (comma-separated labels)

**Alternatives Considered**:
- **Nested JSON in single parameter**: Rejected because:
  - Harder to validate incrementally
  - All-or-nothing parsing (one typo breaks entire scale)
  - Less readable in URLs
- **Multiple parameters with indices** (`ss[0]=0&ss[1]=2`): Rejected because:
  - Verbose, increases URL length significantly
  - Non-standard for query parameters

---

### 3. Browser History Integration

**Decision**: Use `history.replaceState()` with 500ms debouncing

**Rationale**:
- `replaceState()` updates URL without adding history entry on every keystroke
- Only add history entry after 500ms of inactivity (user stopped making changes)
- Prevents history pollution while enabling useful back/forward navigation
- Non-blocking operation (doesn't freeze UI)

**Implementation Pattern**:
```javascript
let debounceTimer = null;

function updateURLFromState(state) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const url = encodeSettingsToURL(state);
    window.history.replaceState(null, '', url);
  }, 500);
}
```

**Alternatives Considered**:
- **Immediate `pushState()` on every change**: Rejected because:
  - Creates dozens of history entries during rapid changes
  - Poor user experience (back button cycles through minor variations)
- **Manual "Save to URL" button**: Rejected because:
  - Extra user action required
  - Doesn't support automatic bookmarking of current state
  - Breaks browser back/forward expectations
- **Longer debounce (1000ms+)**: Rejected because:
  - Feels unresponsive
  - Users may leave page before URL updates

---

### 4. Video URL Security Validation

**Decision**: Regex validation allowing HTTPS-only, blocking dangerous protocols

**Rationale**:
- Prevents XSS attacks via `javascript:`, `data:`, `file:` protocols
- Flexible enough for future video platforms (any HTTPS domain)
- Simple regex pattern, no complex parsing required
- Fails safely (invalid URLs rejected, app continues with other settings)

**Validation Pattern**:
```javascript
const VIDEO_URL_REGEX = /^https:\/\/[^\s<>"{}|\\^`\[\]]+$/i;

function isValidVideoURL(url) {
  if (!url) return true; // Empty is valid (optional setting)
  if (!VIDEO_URL_REGEX.test(url)) return false;

  // Additional check: no dangerous protocols
  const lowerURL = url.toLowerCase();
  if (lowerURL.startsWith('javascript:') ||
      lowerURL.startsWith('data:') ||
      lowerURL.startsWith('file:')) {
    return false;
  }

  return true;
}
```

**Alternatives Considered**:
- **Domain allowlist** (youtube.com, vimeo.com only): Rejected because:
  - Not future-proof (new platforms require code changes)
  - Breaks self-hosted educational videos
  - Overly restrictive for educational use case
- **Full URL parser** (using `new URL()`): Rejected because:
  - Overkill for this use case
  - Regex is simpler and sufficient
  - `URL` constructor can throw exceptions (need try/catch)

---

### 5. URL Length Management

**Decision**: Pre-validation with graceful degradation suggestions

**Rationale**:
- Validate before generating URL (fail fast)
- Provide actionable feedback (suggest removing video URL first, then custom scales)
- 2000 character limit chosen for maximum browser compatibility
- Block share creation rather than silently truncating

**Validation Flow**:
```javascript
function validateURLLength(state) {
  const url = encodeSettingsToURL(state);
  if (url.length > 2000) {
    return {
      valid: false,
      length: url.length,
      suggestions: [
        'Remove video URL to save ~100 characters',
        'Simplify custom scale names',
        'Use preset scales instead of custom scales'
      ]
    };
  }
  return { valid: true, length: url.length };
}
```

**Alternatives Considered**:
- **Automatic truncation**: Rejected because:
  - Silent failure is worse than explicit error
  - Which settings to drop is ambiguous
  - User doesn't know what was lost
- **URL shortening service**: Rejected because:
  - Out of scope (can add later)
  - Adds external dependency and latency
  - Privacy concerns (third-party sees all settings)
- **Compression (gzip/zlib)**: Rejected because:
  - Requires base64 encoding (loses human-readability)
  - Browser doesn't natively support decompressing URL params
  - Added complexity

---

### 6. Backwards Compatibility with Firebase

**Decision**: URL pattern detection with Firebase fallback

**Rationale**:
- Legacy links use `/shared/{firebaseId}` pattern
- New links use `/?o=4&s=Major...` pattern
- Easy to distinguish (no ambiguity)
- Firebase code remains unchanged (read-only)
- 6-month transition period gives users time to update bookmarks

**Detection Logic**:
```javascript
function loadSettingsFromURL() {
  const path = window.location.pathname;

  // Legacy Firebase link: /shared/abc123
  if (path.startsWith('/shared/')) {
    const firebaseId = path.split('/')[2];
    return loadFromFirebase(firebaseId);
  }

  // New URL-encoded link: /?o=4&s=Major
  const params = new URLSearchParams(window.location.search);
  if (params.toString()) {
    return decodeSettingsFromURL(params);
  }

  // No settings in URL, use defaults
  return getDefaultSettings();
}
```

**Alternatives Considered**:
- **Migrate all Firebase links to new format**: Rejected because:
  - Requires database read + URL rewrite for every user
  - High computational cost
  - Risk of data loss during migration
  - Breaks existing bookmarks immediately
- **Support both formats indefinitely**: Rejected because:
  - Maintenance burden
  - Firebase costs continue
  - Technical debt accumulates

---

### 7. Error Handling Strategy

**Decision**: Partial recovery with user feedback

**Rationale**:
- Invalid parameters fall back to defaults for that setting only
- Other valid parameters continue to work
- User sees clear error message about what failed
- Better UX than complete failure

**Error Display**:
```javascript
function parseURLWithErrors(params) {
  const settings = { ...DEFAULT_SETTINGS };
  const errors = [];

  // Try to parse each parameter
  const octave = parseInt(params.get('o'));
  if (octave && (octave < 1 || octave > 8)) {
    errors.push('Invalid octave value (must be 1-8), using default.');
    settings.octave = DEFAULT_OCTAVE;
  } else if (octave) {
    settings.octave = octave;
  }

  // ... parse other parameters ...

  return { settings, errors };
}

// Display errors to user
if (errors.length > 0) {
  showErrorMessage('Some settings could not be loaded: ' + errors.join(' '));
}
```

**Alternatives Considered**:
- **Silent fallback** (no error messages): Rejected because:
  - User doesn't know something went wrong
  - Confusing when shared link doesn't match expectation
  - Violates transparency principle
- **Complete failure** (blank screen on any error): Rejected because:
  - Poor user experience
  - One typo shouldn't break entire app
  - Not resilient to future parameter additions

---

## Summary of Key Decisions

| Aspect | Decision | Primary Benefit |
|--------|----------|----------------|
| Encoding | URLSearchParams with abbreviated names | Browser-native, reliable, compact |
| Complex objects | Separate parameters with CSV arrays | Human-readable, validates incrementally |
| History API | replaceState() with 500ms debounce | Useful history without pollution |
| Video URLs | HTTPS-only regex validation | Security without over-restriction |
| URL length | Pre-validation with suggestions | Explicit failure over silent truncation |
| Backwards compat | URL pattern detection + Firebase fallback | Smooth transition, no data loss |
| Error handling | Partial recovery with user feedback | Resilient, transparent |

---

## Dependencies Added

**None** - All decisions use browser-native APIs:
- `URLSearchParams` (IE10+)
- `History API` (IE10+)
- Standard `RegExp`
- Existing Firebase SDK (read-only)

---

## Performance Characteristics

**URL Generation**: < 10ms (synchronous object serialization)
**URL Parsing**: < 5ms (URLSearchParams parsing)
**History Updates**: Debounced to 500ms (non-blocking)
**Firebase Fallback**: ~200ms (async, only for legacy links)

**Memory**: < 1KB per URL (17 settings + overhead)

---

## Security Considerations

1. **XSS Prevention**: Video URL regex blocks dangerous protocols
2. **URL Injection**: URLSearchParams automatically encodes special characters
3. **No Server-Side Storage**: Eliminates server breach risk
4. **No PII in URLs**: Only musical settings encoded

---

## Testing Strategy

Per Constitution Check, integration tests will cover:
- URL encoding with all 17 settings
- URL decoding with partial/invalid data
- Browser history integration
- Firebase fallback
- Error message display

E2E tests will validate:
- Complete share workflow
- Bookmark persistence
- Cross-browser compatibility

Unit tests will focus on:
- Regex validation edge cases
- Debounce function behavior
- Array serialization/deserialization
