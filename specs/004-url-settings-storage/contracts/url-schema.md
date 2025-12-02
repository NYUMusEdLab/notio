# URL Parameter Schema Contract

**Feature**: 004-url-settings-storage
**Version**: 1.0.0
**Date**: 2025-12-02

## Purpose

This contract defines the URL parameter schema for encoding/decoding application settings. It serves as the API contract between:
- Share URL generation (encoding)
- URL parsing on app load (decoding)
- Future versions of the application (backwards compatibility)

## Schema Version

**Current**: v1 (implicit, no version parameter)

**Versioning Strategy**:
- v1 URLs have no version parameter
- Future breaking changes will introduce `?v=2` parameter
- Parser must support all previous versions

---

## Parameter Reference

### Musical Settings

#### `o` - Octave

**Type**: Integer
**Range**: 1-8
**Default**: 4
**Example**: `?o=5`

**Validation**:
```javascript
const octave = parseInt(params.get('o'));
if (octave < 1 || octave > 8 || isNaN(octave)) {
  // Use DEFAULT_OCTAVE (4)
  errors.push('Invalid octave: must be 1-8');
}
```

---

#### `od` - Octave Distance

**Type**: Integer
**Range**: -3 to +3
**Default**: 0
**Example**: `?od=1`

**Purpose**: Offset for extended keyboard mode

**Validation**:
```javascript
const octaveDist = parseInt(params.get('od'));
if (octaveDist < -3 || octaveDist > 3 || isNaN(octaveDist)) {
  // Use default (0)
}
```

---

#### `s` - Scale Name

**Type**: String
**Format**: URL-encoded scale name
**Default**: "Major (Ionian)"
**Example**: `?s=Major+(Ionian)` or `?s=Dorian`

**Notes**:
- For preset scales, this is the only scale parameter needed
- For custom scales, this is used with `sn`, `ss`, `snum`
- Parentheses and spaces are URL-encoded

---

#### `sn` - Custom Scale Name

**Type**: String
**Format**: URL-encoded custom scale name
**Max Length**: 100 characters
**Example**: `?sn=My+Blues+Scale`

**Purpose**: Human-readable name for custom scales

**Only present when**: User has defined a custom scale

---

#### `ss` - Scale Steps

**Type**: Comma-separated integers
**Range**: Each value 0-11
**Max Length**: 12 values
**Example**: `?ss=0,2,4,5,7,9,11`

**Purpose**: Semitone steps that define scale intervals

**Validation**:
```javascript
const steps = params.get('ss')?.split(',').map(s => parseInt(s.trim()));
if (!steps || steps.length === 0 || steps.length > 12) {
  return null; // Invalid
}
if (steps.some(s => isNaN(s) || s < 0 || s > 11)) {
  return null; // Invalid
}
// Check for duplicates
if (new Set(steps).size !== steps.length) {
  return null; // Invalid
}
```

---

#### `snum` - Scale Numbers (Interval Labels)

**Type**: Comma-separated strings
**Example**: `?snum=1,2,3,4,5,6,7` or `?snum=1,b3,4,b5,5,b7`

**Purpose**: Labels for each scale degree

**Validation**:
```javascript
const numbers = params.get('snum')?.split(',').map(s => s.trim());
if (!numbers || numbers.length === 0) {
  return null; // Invalid
}
// Must match length of steps
if (numbers.length !== steps.length) {
  return null; // Invalid
}
// Each label must be non-empty
if (numbers.some(n => n.length === 0)) {
  return null; // Invalid
}
```

---

#### `bn` - Base Note

**Type**: String
**Format**: Note name (A-G) with optional accidental (#, b)
**Pattern**: `/^[A-G][#b]?$/`
**Default**: "C"
**Example**: `?bn=D` or `?bn=F%23` (F#, URL-encoded)

**Validation**:
```javascript
const baseNote = params.get('bn');
if (baseNote && !/^[A-G][#b]?$/.test(baseNote)) {
  // Use default "C"
  errors.push('Invalid base note format');
}
```

---

#### `c` - Clef

**Type**: String (enum)
**Values**: `treble`, `bass`, `tenor`, `alto`, `hide notes`
**Default**: "treble"
**Example**: `?c=bass`

**Validation**:
```javascript
const validClefs = ['treble', 'bass', 'tenor', 'alto', 'hide notes'];
const clef = params.get('c');
if (clef && !validClefs.includes(clef)) {
  // Use default "treble"
}
```

---

#### `n` - Notation Overlays

**Type**: Comma-separated strings
**Default**: `["Colors"]`
**Example**: `?n=Colors,Steps` or `?n=Colors,Relative,Extensions`

**Purpose**: Active notation visualization modes

**Common Values**:
- `Colors` - Color-coded notes
- `Steps` - Scale degree numbers
- `Relative` - Relative pitch notation
- `Extensions` - Chord extensions
- (Others defined in app)

**Validation**:
```javascript
const notation = params.get('n')?.split(',').map(s => s.trim());
// If any unknown types, filter them out
const validNotation = notation.filter(n => isValidNotationType(n));
if (validNotation.length === 0) {
  // Use default ["Colors"]
}
```

---

### Instrument & Sound Settings

#### `i` - Instrument Sound

**Type**: String
**Default**: "piano"
**Example**: `?i=guitar` or `?i=violin`

**Validation**:
```javascript
const instrument = params.get('i');
if (instrument && !availableInstruments.includes(instrument)) {
  // Use default "piano"
}
```

---

### Display Settings

#### `p` - Piano Visibility

**Type**: Boolean (as "1" or "0")
**Default**: true ("1")
**Example**: `?p=1` (visible) or `?p=0` (hidden)

**Encoding**:
```javascript
params.set('p', state.pianoOn ? '1' : '0');
```

**Decoding**:
```javascript
const pianoOn = params.get('p') === '1';
```

---

#### `ek` - Extended Keyboard

**Type**: Boolean (as "1" or "0")
**Default**: false ("0")
**Example**: `?ek=1`

---

#### `ts` - Treble Staff Visibility

**Type**: Boolean (as "1" or "0")
**Default**: true ("1")
**Example**: `?ts=0` (staff hidden)

---

#### `t` - Theme

**Type**: String (enum)
**Values**: `light`, `dark`
**Default**: "light"
**Example**: `?t=dark`

---

#### `son` - Show Off-Notes

**Type**: Boolean (as "1" or "0")
**Default**: true ("1")
**Example**: `?son=0` (hide non-scale notes)

---

### Video Settings

#### `v` - Video URL

**Type**: String (URL-encoded HTTPS URL)
**Format**: Must match `/^https:\/\/[^\s<>"{}|\\^`\[\]]+$/i`
**Example**: `?v=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ`

**Security Validation**:
```javascript
function isValidVideoURL(url) {
  if (!url) return true; // Empty is valid

  // Must be HTTPS
  if (!url.startsWith('https://')) return false;

  // Regex validation
  const regex = /^https:\/\/[^\s<>"{}|\\^`\[\]]+$/i;
  if (!regex.test(url)) return false;

  // Block dangerous protocols (case-insensitive)
  const lowerURL = url.toLowerCase();
  if (lowerURL.includes('javascript:') ||
      lowerURL.includes('data:') ||
      lowerURL.includes('file:')) {
    return false;
  }

  return true;
}
```

**Error Messages**:
- "Invalid video URL: must use HTTPS protocol"
- "Invalid video URL: contains dangerous content"
- "Invalid video URL: illegal characters detected"

---

#### `va` - Video Active

**Type**: Boolean (as "1" or "0")
**Default**: false ("0")
**Example**: `?va=1` (video player visible)

---

#### `vt` - Active Video Tab

**Type**: String (enum)
**Values**: `Enter_url`, `Player`
**Default**: "Enter_url"
**Example**: `?vt=Player`

---

## Complete URL Examples

### Example 1: Minimal (Defaults)

```
https://notio.app/
```

**Decoded State**:
```javascript
{
  octave: 4,
  scale: "Major (Ionian)",
  baseNote: "C",
  clef: "treble",
  notation: ["Colors"],
  // ... all other defaults
}
```

---

### Example 2: Scale Practice in D Dorian

```
https://notio.app/?o=4&s=Dorian&bn=D&c=treble&n=Colors,Steps&t=dark
```

**Decoded State**:
```javascript
{
  octave: 4,
  scale: "Dorian",
  baseNote: "D",
  clef: "treble",
  notation: ["Colors", "Steps"],
  theme: "dark",
  // ... other defaults
}
```

---

### Example 3: Custom Blues Scale with Video

```
https://notio.app/?o=5&s=Blues&sn=Blues+Pentatonic&ss=0,3,5,6,7,10&snum=1,b3,4,b5,5,b7&bn=A&i=guitar&p=1&v=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dexample&va=1
```

**Decoded State**:
```javascript
{
  octave: 5,
  scale: "Blues",
  scaleObject: {
    name: "Blues Pentatonic",
    steps: [0, 3, 5, 6, 7, 10],
    numbers: ["1", "b3", "4", "b5", "5", "b7"]
  },
  baseNote: "A",
  instrumentSound: "guitar",
  pianoOn: true,
  videoUrl: "https://www.youtube.com/watch?v=example",
  videoActive: true,
  // ... other defaults
}
```

---

## Error Handling Contract

### Individual Parameter Errors

When a single parameter is invalid:

1. **Use default value** for that parameter
2. **Add error to errors array** with descriptive message
3. **Continue parsing remaining parameters**
4. **Display all errors to user** after parsing completes

**Example**:
```javascript
{
  settings: {
    octave: 4, // Invalid value, used default
    scale: "Dorian", // Valid
    baseNote: "D" // Valid
  },
  errors: [
    "Invalid octave value (must be 1-8), using default."
  ]
}
```

---

### Custom Scale Validation Errors

When custom scale parameters are invalid:

1. **Reject entire custom scale** (all-or-nothing)
2. **Fall back to Major scale** (or scale from `s` parameter if valid)
3. **Display specific error** about what was wrong

**Error Messages**:
- "Invalid custom scale: steps must be 0-11"
- "Invalid custom scale: duplicate steps found"
- "Invalid custom scale: steps and numbers length mismatch"
- "Invalid custom scale: too many steps (max 12)"

---

### Video URL Errors

When video URL is invalid:

1. **Clear video URL** (set to empty or default)
2. **Set videoActive to false**
3. **Display security-focused error message**

**Error Messages**:
- "Video URL rejected: must use HTTPS protocol"
- "Video URL rejected: dangerous content detected"

---

## Backwards Compatibility Contract

### Future Parameter Additions

**Promise**: New parameters will ALWAYS be optional

**Old URL in New Version**:
```
Old URL: ?o=4&s=Major
New app adds parameter 'x'

Result: x uses default value, all other parameters work
```

**New URL in Old Version**:
```
New URL: ?o=4&s=Major&x=newvalue
Old app doesn't recognize 'x'

Result: x is ignored, all recognized parameters work
```

---

### Parameter Removal (Breaking Change)

**If a parameter must be removed**:

1. Introduce schema version: `?v=2`
2. v2 parser ignores old parameter
3. v1 parser (no version param) continues working

**Example**:
```
v1 URL: ?o=4&s=Major&old=value
v2 URL: ?v=2&o=4&s=Major&new=value

v1 parser: reads old parameter, ignores v and new
v2 parser: reads v=2, uses new parameter, ignores old
```

---

## Length Constraints

### Per-Parameter Limits

| Parameter | Typical Length | Max Length | Notes |
|-----------|----------------|------------|-------|
| `o` | 3 chars | 5 chars | `o=8` |
| `s` | 10-30 chars | 100 chars | Scale name |
| `sn` | 10-50 chars | 100 chars | Custom scale name |
| `ss` | 20-40 chars | 70 chars | 12 steps max |
| `snum` | 15-40 chars | 100 chars | 12 labels max |
| `v` | 50-200 chars | 500 chars | Video URL |
| **Total** | **~500 chars** | **~2000 chars** | 95% of configs |

### URL Length Validation

**Pre-generation Check**:
```javascript
function validateURLLength(url) {
  const length = url.length;

  if (length > 2000) {
    return {
      valid: false,
      length,
      suggestions: [
        `Current: ${length} chars (limit: 2000)`,
        'Remove video URL to save ~100-200 characters',
        'Shorten custom scale names',
        'Use preset scales instead of custom scales',
        'Reduce active notation overlays'
      ]
    };
  }

  return { valid: true, length };
}
```

---

## Testing Contract

### Encoding Tests

**Must Pass**:
- All 17 settings encode correctly
- Special characters in scale names are URL-encoded
- Video URLs with query params are double-encoded correctly
- Boolean values encode as "1"/"0"
- Arrays encode as comma-separated values
- Empty/null values are omitted (use defaults on decode)

---

### Decoding Tests

**Must Pass**:
- All valid parameters decode correctly
- Missing parameters use defaults
- Invalid values fall back to defaults with errors
- Malformed URLs don't crash (graceful degradation)
- Legacy `/shared/{id}` URLs trigger Firebase fallback
- URL length validation prevents generation of oversized URLs

---

### Round-Trip Tests

**Must Pass**:
```javascript
const originalState = { ...currentSettings };
const url = encodeSettingsToURL(originalState);
const { settings: decodedState, errors } = decodeSettingsFromURL(url);

// Assert: decodedState matches originalState
// Assert: errors.length === 0
```

---

## Security Contract

### XSS Prevention

**Video URL Validation**:
- MUST reject `javascript:` protocol
- MUST reject `data:` protocol
- MUST reject `file:` protocol
- MUST require `https://` (not `http://`)

**Parameter Injection**:
- URLSearchParams automatically encodes special characters
- No manual string concatenation in URL generation
- No `eval()` or `Function()` on decoded values

---

### Privacy

**No PII in URLs**:
- Only musical settings encoded
- No usernames, emails, or personal identifiers
- Video URLs are user-provided (public YouTube links, etc.)
- No geolocation or device fingerprinting

---

## Implementation Reference

### Encoding Function Signature

```typescript
function encodeSettingsToURL(state: SettingsState): string {
  // Returns full URL with encoded parameters
  // Example: "https://notio.app/?o=4&s=Major&bn=C&..."
}
```

---

### Decoding Function Signature

```typescript
interface DecodeResult {
  settings: Partial<SettingsState>;
  errors: string[];
}

function decodeSettingsFromURL(
  params: URLSearchParams
): DecodeResult {
  // Returns settings object and array of error messages
}
```

---

### Validation Function Signature

```typescript
interface ValidationResult {
  valid: boolean;
  length: number;
  suggestions?: string[];
}

function validateURLLength(url: string): ValidationResult {
  // Returns validation result with actionable suggestions
}
```

---

## Changelog

### v1.0.0 (2025-12-02)

**Initial Release**:
- 17 parameters defined
- Custom scale support (sn, ss, snum)
- Video URL validation
- Boolean encoding as "1"/"0"
- Comma-separated arrays
- 2000 character target limit
