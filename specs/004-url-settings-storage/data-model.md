# Data Model: URL-Based Settings Storage

**Feature**: 004-url-settings-storage
**Date**: 2025-12-02

## Overview

This document defines the data structures, URL parameter schema, and state transitions for the URL-based settings storage system. This is a **state serialization refactoring** - no database schema changes are required since we're eliminating database writes.

## Entities

### 1. SettingsState

**Purpose**: Complete user configuration that can be serialized to/from URL

**Source**: Existing `WholeApp.js` component state (lines 19-60)

**Fields**:

| Field | Type | Default | Validation | URL Param | Description |
|-------|------|---------|------------|-----------|-------------|
| `octave` | number | 4 | 1-8 inclusive | `o` | Current octave for keyboard |
| `octaveDist` | number | 0 | -3 to +3 | `od` | Octave distance for extended keyboard |
| `scale` | string | "Major (Ionian)" | Must exist in scaleList | `s` | Selected scale name |
| `scaleObject` | ScaleObject | (see below) | Valid steps/numbers | `sn,ss,snum` | Complete scale definition |
| `baseNote` | string | "C" | A-G with optional #/b | `bn` | Root note |
| `clef` | string | "treble" | treble\|bass\|tenor\|alto\|hide notes | `c` | Staff clef type |
| `notation` | string[] | ["Colors"] | Array of valid notation types | `n` | Active notation overlays (comma-separated) |
| `instrumentSound` | string | "piano" | Valid instrument name | `i` | Selected instrument |
| `pianoOn` | boolean | true | true\|false | `p` | Piano visibility toggle |
| `extendedKeyboard` | boolean | false | true\|false | `ek` | Extended keyboard mode |
| `trebleStaffOn` | boolean | true | true\|false | `ts` | Staff visibility |
| `theme` | string | "light" | light\|dark | `t` | UI theme |
| `showOffNotes` | boolean | true | true\|false | `son` | Show non-scale notes |
| `videoUrl` | string | (default tutorial) | HTTPS URL only | `v` | YouTube/video embed URL |
| `videoActive` | boolean | false | true\|false | `va` | Video player visibility |
| `activeVideoTab` | string | "Enter_url" | Enter_url\|Player | `vt` | Active video tab |

**Not Serialized** (transient UI state):
- `menuOpen`, `loading`, `sessionError`, `sessionID`
- Tooltip refs (`keyboardTooltipRef`, etc.)
- `soundNames`, `scaleList`, `resetVideoUrl`

---

### 2. ScaleObject

**Purpose**: Defines a musical scale with steps and interval labels

**Nested within**: SettingsState

**Fields**:

| Field | Type | Validation | URL Param | Description |
|-------|------|------------|-----------|-------------|
| `name` | string | 1-100 chars, URL-safe | `sn` | Human-readable scale name |
| `steps` | number[] | 0-11, length 1-12 | `ss` | Semitone steps (comma-separated) |
| `numbers` | string[] | Length matches steps | `snum` | Interval labels (comma-separated) |

**Example**:
```javascript
{
  name: "Major (Ionian)",
  steps: [0, 2, 4, 5, 7, 9, 11],
  numbers: ["1", "2", "3", "4", "5", "6", "△7"]
}
```

**URL Encoding**:
```
?sn=Major+(Ionian)&ss=0,2,4,5,7,9,11&snum=1,2,3,4,5,6,%E2%96%B37
```

---

### 3. URLParameterSchema

**Purpose**: Mapping between application state and URL query parameters

**Schema Version**: v1 (implicit, no version parameter for initial release)

| Parameter | Expanded Name | Type | Example | Notes |
|-----------|--------------|------|---------|-------|
| `o` | octave | int | `o=4` | Default: 4 |
| `od` | octaveDist | int | `od=0` | Default: 0 |
| `s` | scale | string | `s=Major+(Ionian)` | URL-encoded |
| `sn` | scaleName | string | `sn=My+Scale` | Only if custom scale |
| `ss` | scaleSteps | int[] | `ss=0,2,4,5,7,9,11` | Comma-separated |
| `snum` | scaleNumbers | string[] | `snum=1,2,3,4,5,6,7` | Comma-separated |
| `bn` | baseNote | string | `bn=C` | A-G + #/b |
| `c` | clef | string | `c=treble` | Default: treble |
| `n` | notation | string[] | `n=Colors,Steps` | Comma-separated |
| `i` | instrumentSound | string | `i=piano` | Default: piano |
| `p` | pianoOn | bool | `p=1` | 1=true, 0=false |
| `ek` | extendedKeyboard | bool | `ek=0` | Default: false |
| `ts` | trebleStaffOn | bool | `ts=1` | Default: true |
| `t` | theme | string | `t=light` | light or dark |
| `son` | showOffNotes | bool | `son=1` | Default: true |
| `v` | videoUrl | string | `v=https%3A%2F%2F...` | HTTPS only, URL-encoded |
| `va` | videoActive | bool | `va=0` | Default: false |
| `vt` | activeVideoTab | string | `vt=Enter_url` | Default: Enter_url |

**Abbreviation Strategy**:
- Single letter for common settings (o, s, c, n, i, p, t, v)
- Two letters for compound concepts (od, ek, ts, bn, va, vt)
- Three letters for less common (son, snum)
- Prioritize brevity for frequently-used parameters

---

## State Transitions

### 1. App Initialization with URL Parameters

```
┌─────────────────┐
│ Browser loads   │
│ app with URL    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Parse pathname  │
│ Check if legacy │
│ /shared/{id}    │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌─────────┐  ┌──────────────┐
│ Legacy  │  │ New URL      │
│ /shared │  │ with params  │
└────┬────┘  └──────┬───────┘
     │              │
     ▼              ▼
┌─────────────┐  ┌──────────────────┐
│ Load from   │  │ Parse            │
│ Firebase    │  │ URLSearchParams  │
│ (async)     │  │ (sync)           │
└─────┬───────┘  └──────┬───────────┘
      │                 │
      └────────┬────────┘
               ▼
      ┌────────────────┐
      │ Validate &     │
      │ populate state │
      └────────┬───────┘
               ▼
      ┌────────────────┐
      │ Render app     │
      │ with settings  │
      └────────────────┘
```

**Key Points**:
- Legacy links (`/shared/{id}`) go through Firebase fallback (async)
- New links parse URL parameters synchronously (faster)
- Invalid parameters fall back to defaults with error messages
- Multiple invalid parameters accumulate errors, all shown to user

---

### 2. User Changes Setting

```
┌─────────────────┐
│ User modifies   │
│ setting (e.g.,  │
│ changes scale)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update React    │
│ component state │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Trigger         │
│ debounced URL   │
│ update (500ms)  │
└────────┬────────┘
         │
   ┌─────┴──────┐
   │ Additional │
   │ changes?   │
   └─────┬──────┘
         │
    ┌────┴─────┐
    │ No       │ Yes (reset timer)
    ▼          └──────┐
┌─────────────┐       │
│ Encode      │       │
│ state to    │       │
│ URL params  │       │
└─────┬───────┘       │
      │               │
      ▼               │
┌─────────────┐       │
│ Check URL   │       │
│ length      │       │
└─────┬───────┘       │
      │               │
  ┌───┴────┐          │
  │ Valid? │          │
  └───┬────┘          │
      │               │
  ┌───┴───┐           │
  │ Yes   │ No        │
  ▼       ▼           │
┌───────┐ ┌────────┐  │
│Update │ │Skip    │  │
│browser│ │update  │  │
│history│ │        │  │
└───────┘ └────────┘  │
                      │
      ┌───────────────┘
      │ (Timer resets, start over)
      └───────────────┐
                      │
                      ▼
              (Wait for next change)
```

**Key Points**:
- Debounce prevents excessive history entries
- URL length validation happens before updating history
- Failed validation doesn't break the app, just skips history update
- Timer resets on each change (only final state recorded)

---

### 3. User Clicks "Create Share Link"

```
┌─────────────────┐
│ User clicks     │
│ "Create Share   │
│ Link" button    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Encode current  │
│ state to URL    │
│ parameters      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate URL    │
│ length < 2000   │
│ characters      │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌────────┐  ┌───────────────┐
│ Valid  │  │ Too long      │
└───┬────┘  └───┬───────────┘
    │           │
    ▼           ▼
┌────────────┐  ┌──────────────────┐
│ Generate   │  │ Show error       │
│ full URL   │  │ with suggestions │
│            │  │ (disable video,  │
│            │  │ simplify scales) │
└─────┬──────┘  └──────────────────┘
      │
      ▼
┌────────────┐
│ Copy to    │
│ clipboard  │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Show       │
│ success    │
│ message    │
└────────────┘
```

**Key Points**:
- Synchronous operation (no Firebase write)
- Pre-validation prevents creation of broken links
- Actionable error messages guide user to fix length issues
- Clipboard API used for one-click copy

---

## Validation Rules

### SettingsState Validation

**On URL Parse** (from URL → state):

| Field | Validation | Fallback on Error |
|-------|------------|-------------------|
| `octave` | Must be integer 1-8 | DEFAULT_OCTAVE (4) |
| `octaveDist` | Must be integer -3 to +3 | 0 |
| `baseNote` | Must match /^[A-G][#b]?$/ | "C" |
| `clef` | Must be in [treble, bass, tenor, alto, "hide notes"] | "treble" |
| `notation` | Array of known notation types | ["Colors"] |
| `instrumentSound` | Must exist in soundNames list | "piano" |
| `pianoOn` | Must be "1" or "0" | true |
| `extendedKeyboard` | Must be "1" or "0" | false |
| `trebleStaffOn` | Must be "1" or "0" | true |
| `theme` | Must be "light" or "dark" | "light" |
| `showOffNotes` | Must be "1" or "0" | true |
| `videoUrl` | Must match HTTPS regex | (default tutorial URL) |
| `videoActive` | Must be "1" or "0" | false |
| `activeVideoTab` | Must be "Enter_url" or "Player" | "Enter_url" |

### ScaleObject Validation

| Field | Validation | Error Handling |
|-------|------------|----------------|
| `steps` | Each value 0-11, array length 1-12 | Use Major scale, show error |
| `steps` | All values must be unique integers | Use Major scale, show error |
| `numbers` | Length must equal steps.length | Use Major scale, show error |
| `numbers` | Each value must be non-empty string | Use Major scale, show error |
| `name` | Length 1-100 characters | Use scale name from `scale` parameter |

### Video URL Security Validation

**Regex Pattern**:
```javascript
/^https:\/\/[^\s<>"{}|\\^`\[\]]+$/i
```

**Additional Checks**:
- Reject `javascript:`, `data:`, `file:` protocols (case-insensitive)
- Must start with `https://` (not `http://`)
- No whitespace characters
- No dangerous HTML/URL characters: `<>"{}|\^`[]`

**Error Messages**:
- "Invalid video URL: must use HTTPS protocol"
- "Invalid video URL: dangerous protocol detected"
- "Invalid video URL: contains illegal characters"

---

## URL Examples

### 1. Default Configuration
```
https://notio.app/
```
(No parameters = all defaults)

### 2. Simple Scale Selection
```
https://notio.app/?o=4&s=Dorian&bn=D&c=treble&n=Colors,Steps
```
- Octave 4
- Dorian scale
- Base note D
- Treble clef
- Colors and Steps notation

### 3. Custom Scale
```
https://notio.app/?o=5&s=Blues+Pentatonic&sn=Blues+Pentatonic&ss=0,3,5,6,7,10&snum=1,b3,4,b5,5,b7&bn=A&i=guitar
```
- Octave 5
- Custom Blues Pentatonic scale
- Base note A
- Guitar instrument

### 4. Full Configuration with Video
```
https://notio.app/?o=4&s=Major+(Ionian)&bn=C&c=treble&n=Colors&i=piano&p=1&ek=0&ts=1&t=light&son=1&v=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&va=1&vt=Player
```
- Complete settings including YouTube video URL

### 5. Legacy Firebase Link (Backwards Compatibility)
```
https://notio.app/shared/abc123xyz
```
- Detected as legacy format
- Loads from Firebase using `abc123xyz` as document ID
- Transparent fallback to user

---

## Migration Notes

### Existing Code Compatibility

**No Breaking Changes**:
- Firebase.js remains unchanged (read-only mode)
- WholeApp.js state structure unchanged
- Component props interfaces unchanged

**Modified Functions**:
- `saveSessionToDB()` → `generateShareURL()` (remove async, no Firebase write)
- `openSavedSession()` → `loadSettingsFromURL()` (add URL parsing path)
- `componentDidMount()` → Add URL parameter parsing before Firebase check

**New Utilities**:
- `encodeSettingsToURL(state)` → Returns URL string
- `decodeSettingsFromURL(params)` → Returns { settings, errors }
- `validateVideoURL(url)` → Returns boolean
- `validateURLLength(url)` → Returns { valid, length, suggestions }
- `debounce(fn, delay)` → Returns debounced function

---

## Performance Considerations

**Memory**:
- URL parameters: ~500-1500 bytes (depending on custom scales)
- No additional in-memory caching required
- React state remains primary source of truth

**CPU**:
- URL encoding: O(n) where n = number of settings (17)
- URL decoding: O(n) where n = number of parameters
- Both operations < 10ms on modern devices

**Network**:
- Zero network calls for new share links (vs. current Firebase write)
- One network call for legacy Firebase links (unchanged)
- Reduces server load significantly

---

## Future Extensibility

### Adding New Settings

1. Add new parameter to URLParameterSchema
2. Add default value to DEFAULT_SETTINGS
3. Add validation rule
4. Update encoding/decoding functions

**Backwards Compatibility**:
- Old URLs without new parameter → Use default
- New URLs opened in old version → New parameter ignored

### Versioning Strategy (Future)

If breaking changes needed:
```
?v=2&o=4&s=Major
```
- `v` parameter indicates schema version
- Parser checks version, uses appropriate decoder
- v1 (no version parameter) always supported

---

## Edge Cases

### Malformed URLs

| Scenario | Handling |
|----------|----------|
| Corrupted UTF-8 encoding | URLSearchParams handles automatically |
| Missing required parameter | Use default, no error |
| Invalid enum value | Use default, show warning |
| Non-numeric where number expected | Use default, show error |
| Array length mismatch (steps vs numbers) | Use Major scale, show error |
| URL too long (>2048 chars) | Some browsers may truncate; validation prevents generation |
| Empty parameter value (`?o=`) | Treated as missing, use default |
| Duplicate parameters (`?o=4&o=5`) | URLSearchParams takes last value |

### Browser Limitations

| Browser | URL Length Limit | Support |
|---------|------------------|---------|
| Chrome  | ~2MB | ✅ Full support |
| Firefox | ~65K chars | ✅ Full support |
| Safari  | ~80K chars | ✅ Full support |
| Edge    | ~2MB | ✅ Full support |
| IE11    | ~2K chars | ⚠️ Limited (but History API works) |

**Mitigation**: 2000 character limit keeps URLs well within all browser limits.
