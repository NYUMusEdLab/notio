# Quickstart: URL-Based Settings Storage

**Feature**: 004-url-settings-storage
**Date**: 2025-12-02

## For Developers

### What This Feature Does

Replaces Firebase database storage with URL query parameters for sharing user configurations. Users can now:
- Generate shareable links instantly (no database write)
- Bookmark specific configurations
- Use browser back/forward to navigate through settings
- Share links that work offline

### Quick Architecture Overview

```
┌─────────────────┐
│ User changes    │
│ setting         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ React state     │◄──────────┐
│ updates         │           │
└────────┬────────┘           │
         │                    │
         ▼                    │
┌─────────────────┐           │
│ Debounced       │           │
│ (500ms)         │           │
│ URL update      │           │
└────────┬────────┘           │
         │                    │
         ▼                    │
┌─────────────────┐           │
│ Browser history │           │
│ API updates URL │           │
└─────────────────┘           │
                              │
┌─────────────────┐           │
│ User opens URL  │           │
│ with parameters │           │
└────────┬────────┘           │
         │                    │
         ▼                    │
┌─────────────────┐           │
│ Parse URL params│           │
│ (on app mount)  │           │
└────────┬────────┘           │
         │                    │
         ▼                    │
┌─────────────────┐           │
│ Populate React  │───────────┘
│ state           │
└─────────────────┘
```

---

## Running & Testing

### 1. Development Setup

```bash
# No new dependencies needed!
# All browser-native APIs (URLSearchParams, History API)

# Start dev server
npm start

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

---

### 2. Manual Testing Workflow

#### Test 1: Generate Share Link

1. Configure some settings:
   - Change octave to 5
   - Select "Dorian" scale
   - Change base note to "D"
   - Enable "Steps" notation

2. Click "Share" button → "Create Share Link"

3. **Expected**: URL generated instantly, copied to clipboard
   - URL format: `/?o=5&s=Dorian&bn=D&n=Colors,Steps`
   - No loading spinner (synchronous operation)
   - Success message shown

4. **Verify**: Open generated URL in new tab
   - All settings should match exactly

#### Test 2: Browser History Navigation

1. Start with default settings (C Major, octave 4)

2. Change scale to "Dorian" → Wait 500ms

3. Change to "Phrygian" → Wait 500ms

4. Change to "Lydian" → Wait 500ms

5. Click browser back button

6. **Expected**: Scale changes back to "Phrygian"

7. Click back again

8. **Expected**: Scale changes to "Dorian"

9. Click forward button

10. **Expected**: Scale changes to "Phrygian"

#### Test 3: Bookmarking

1. Configure a specific setup (e.g., G Mixolydian, octave 6)

2. Bookmark the page (Ctrl/Cmd+D)

3. Close tab

4. Open bookmark

5. **Expected**: Configuration matches exactly

#### Test 4: URL Length Validation

1. Create a custom scale with a very long name:
   - Name: "Super Long Custom Scale Name That Is Way Too Verbose For Any Reasonable Use Case But Tests Our Validation"
   - Steps: 0,1,2,3,4,5,6,7,8,9,10,11 (all 12 notes)

2. Add a YouTube video URL

3. Enable all notation overlays

4. Click "Create Share Link"

5. **Expected**: Error message if > 2000 chars
   - "URL too long (2145 characters, limit 2000)"
   - Suggestions: "Remove video URL", "Shorten scale name"

#### Test 5: Invalid URL Parameters

1. Manually craft a bad URL:
   ```
   /?o=99&s=NonexistentScale&bn=Z&ss=0,13,99&v=javascript:alert('xss')
   ```

2. Open URL

3. **Expected**:
   - App loads with defaults for invalid parameters
   - Error messages shown:
     - "Invalid octave (must be 1-8), using default"
     - "Invalid base note format"
     - "Invalid custom scale: steps must be 0-11"
     - "Video URL rejected: dangerous content detected"

#### Test 6: Legacy Firebase Link

1. If you have an old `/shared/xyz123` link:
   - Open it

2. **Expected**:
   - App loads from Firebase (asynchronous)
   - Settings restored correctly
   - No errors

---

### 3. Automated Test Examples

#### Integration Test: URL Encoding

```javascript
import { encodeSettingsToURL } from '../services/urlEncoder';

test('encodes all settings to URL parameters', () => {
  const state = {
    octave: 5,
    scale: 'Dorian',
    baseNote: 'D',
    notation: ['Colors', 'Steps'],
    pianoOn: true,
    theme: 'dark'
  };

  const url = encodeSettingsToURL(state);

  expect(url).toContain('o=5');
  expect(url).toContain('s=Dorian');
  expect(url).toContain('bn=D');
  expect(url).toContain('n=Colors%2CSteps');
  expect(url).toContain('p=1');
  expect(url).toContain('t=dark');
});
```

#### Integration Test: URL Decoding with Errors

```javascript
import { decodeSettingsFromURL } from '../services/urlEncoder';

test('decodes URL with invalid parameters, returns errors', () => {
  const params = new URLSearchParams('?o=99&s=Major&bn=Z');

  const { settings, errors } = decodeSettingsFromURL(params);

  expect(settings.octave).toBe(4); // Default
  expect(settings.scale).toBe('Major'); // Valid
  expect(settings.baseNote).toBe('C'); // Default

  expect(errors).toContain('Invalid octave (must be 1-8), using default');
  expect(errors).toContain('Invalid base note format');
});
```

#### E2E Test: Complete Share Workflow

```javascript
// e2e/share-workflow.spec.js
test('complete share and restore workflow', async ({ page }) => {
  await page.goto('/');

  // Configure settings
  await page.selectOption('[data-testid="octave-select"]', '5');
  await page.selectOption('[data-testid="scale-select"]', 'Dorian');
  await page.selectOption('[data-testid="root-select"]', 'D');

  // Generate share link
  await page.click('[data-testid="share-button"]');
  await page.click('[data-testid="create-link-button"]');

  // Get generated URL from clipboard or display
  const generatedURL = await page.textContent('[data-testid="share-url"]');

  // Open in new page
  const newPage = await page.context().newPage();
  await newPage.goto(generatedURL);

  // Verify settings restored
  await expect(newPage.locator('[data-testid="octave-display"]')).toHaveText('5');
  await expect(newPage.locator('[data-testid="scale-display"]')).toHaveText('Dorian');
  await expect(newPage.locator('[data-testid="root-display"]')).toHaveText('D');
});
```

---

## For Code Reviewers

### Key Files to Review

**Priority 1** (Core Logic):
- `src/services/urlEncoder.js` - Encoding/decoding utilities
- `src/services/urlValidator.js` - Validation & security
- `src/WholeApp.js` (modified) - URL parsing on mount, history integration

**Priority 2** (UI Changes):
- `src/components/menu/ShareLink.js` - Sync URL generation
- `src/components/menu/ShareButton.js` - Remove async Firebase call
- `src/components/OverlayPlugins/ErrorMessage.js` - Error display

**Priority 3** (Tests):
- `src/__integration__/url-encoding/*.test.js` - Integration tests
- `e2e/share-workflow.spec.js` - E2E tests

### What to Look For

**Security**:
- ✅ Video URL regex blocks `javascript:`, `data:`, `file:` protocols
- ✅ URLSearchParams used (automatic encoding, no injection)
- ✅ No `eval()` or `Function()` on decoded values

**Performance**:
- ✅ Debouncing prevents excessive history entries
- ✅ Synchronous encoding (no async/await for share button)
- ✅ URL parsing < 100ms on mount

**Backwards Compatibility**:
- ✅ Legacy `/shared/{id}` detection works
- ✅ Firebase.js unchanged (read-only)
- ✅ Missing parameters use defaults gracefully

**Error Handling**:
- ✅ Partial recovery (one bad param doesn't break all)
- ✅ Clear error messages for users
- ✅ URL length pre-validation with suggestions

---

## Common Issues & Solutions

### Issue 1: URL Not Updating on Setting Change

**Symptom**: Change setting, URL stays the same

**Likely Cause**: Debounce timer not completing

**Solution**:
- Wait full 500ms after last change
- Check browser console for errors
- Verify History API is supported (`window.history.replaceState`)

---

### Issue 2: Settings Not Restored on Page Load

**Symptom**: Open URL with parameters, but defaults load instead

**Likely Cause**: Timing issue - URL parsing happens after state initialization

**Solution**:
- Ensure `decodeSettingsFromURL()` called in `componentDidMount()` BEFORE first render
- Check console for parsing errors
- Verify URLSearchParams is supported

---

### Issue 3: "URL Too Long" Error

**Symptom**: Can't generate share link, error about length

**Cause**: Configuration exceeds 2000 characters

**Solution**:
1. Remove video URL (saves ~100-200 chars)
2. Shorten custom scale names
3. Use preset scales instead of custom
4. Reduce active notation overlays

---

### Issue 4: Video URL Rejected

**Symptom**: Video URL not loading, security error

**Cause**: URL doesn't meet HTTPS-only requirement

**Solution**:
- Ensure URL starts with `https://` (not `http://`)
- No `javascript:`, `data:`, or `file:` protocols
- No whitespace or illegal characters

---

## Performance Benchmarks

**Target Performance**:
- URL generation: < 10ms
- URL parsing: < 5ms
- Share button click → URL ready: < 50ms
- URL length validation: < 1ms
- Debounce delay: 500ms (configurable)

**Measured on**:
- 2020 MacBook Pro M1
- Chrome 120, Firefox 121, Safari 17

---

## Rollout Plan

### Phase 1: Enable New Share Links (Current)

- New share links generate URL parameters
- Legacy `/shared/{id}` links still work via Firebase fallback
- Zero breaking changes for existing users

### Phase 2: Deprecation Notice (6 months)

- Add banner for legacy link users: "This link format is deprecated. Please use the new share button."
- Log metrics on Firebase fallback usage

### Phase 3: Remove Firebase Writes (12 months)

- Remove `saveSessionToDB()` function
- Keep `openSavedSession()` for legacy read-only support
- Update documentation

### Phase 4: Full Migration (18 months)

- Remove Firebase dependency entirely
- Update all documentation to URL-only approach

---

## Troubleshooting Commands

```bash
# Check for encoding errors
npm test -- urlEncoder.test.js

# Check for validation errors
npm test -- urlValidator.test.js

# Run integration tests only
npm test -- __integration__

# Run E2E tests headless
npm run test:e2e

# Run E2E tests in browser (debugging)
npm run test:e2e:headed

# Check for accessibility regressions
npm run test:a11y
```

---

## Quick Reference: Key Functions

### Encoding
```javascript
import { encodeSettingsToURL } from './services/urlEncoder';

const url = encodeSettingsToURL(state);
// Returns: "https://notio.app/?o=4&s=Major&bn=C&..."
```

### Decoding
```javascript
import { decodeSettingsFromURL } from './services/urlEncoder';

const params = new URLSearchParams(window.location.search);
const { settings, errors } = decodeSettingsFromURL(params);

if (errors.length > 0) {
  showErrorMessage(errors.join('\n'));
}
```

### Validation
```javascript
import { validateURLLength } from './services/urlValidator';
import { isValidVideoURL } from './services/urlValidator';

const result = validateURLLength(url);
if (!result.valid) {
  console.log(`Too long: ${result.length} chars`);
  console.log('Suggestions:', result.suggestions);
}

if (!isValidVideoURL(videoUrl)) {
  console.error('Invalid video URL');
}
```

### Debouncing
```javascript
import { debounce } from './services/debounce';

const updateURL = debounce((state) => {
  const url = encodeSettingsToURL(state);
  window.history.replaceState(null, '', url);
}, 500);

// Call on every setting change
updateURL(this.state);
```

---

## Documentation

**Full Documentation**:
- [Specification](./spec.md) - User stories, requirements, success criteria
- [Research](./research.md) - Technology decisions and alternatives
- [Data Model](./data-model.md) - State structure, URL schema, validation rules
- [URL Schema Contract](./contracts/url-schema.md) - Complete parameter reference
- [Implementation Plan](./plan.md) - Architecture, testing strategy, project structure

**Related Files**:
- `src/WholeApp.js:19-60` - Current state structure
- `src/WholeApp.js:267-309` - Existing Firebase save function (to be replaced)
- `src/components/menu/ShareLink.js:24-36` - Current async share flow

---

## Questions?

**Slack Channel**: #notio-development
**PM**: [Product Manager Name]
**Tech Lead**: [Tech Lead Name]

**Common Questions**:

Q: "Can we add more parameters later?"
A: Yes! New parameters are automatically optional. Old URLs ignore unknown params.

Q: "What if URL exceeds browser limit?"
A: Pre-validation blocks generation > 2000 chars. All browsers support 2K+.

Q: "Do we need to migrate existing Firebase data?"
A: No. Old links continue working via fallback. New links use URLs.

Q: "How long do we support Firebase fallback?"
A: Minimum 6 months, likely 12-18 months for full deprecation.
