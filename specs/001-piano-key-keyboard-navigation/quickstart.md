# Quickstart Guide: Piano Key Keyboard Navigation

**Feature**: 001-piano-key-keyboard-navigation
**Date**: 2025-01-16
**Version**: 1.0.0

---

## Overview

This guide provides step-by-step instructions for manually testing the piano key keyboard navigation feature. Use this guide to verify functionality before automated tests and for demonstration purposes.

---

## Prerequisites

### Environment Setup

1. **Start the development server**:
   ```bash
   cd /Users/saxjax/developer/notio-with-ai/notio
   yarn start
   ```

2. **Navigate to the application**:
   - Open browser: http://localhost:3000
   - Wait for app to load completely

3. **Verify prerequisites**:
   - ✅ Piano keyboard is visible on screen
   - ✅ Color keys are visible (colored bars above piano keys)
   - ✅ Menu buttons are visible at top

---

## Test Scenario 1: Basic Tab Navigation (User Story 1 - P1 MVP)

**Goal**: Verify keyboard-only users can tab to the piano keyboard container

### Steps

1. **Start at page top**:
   - Click browser address bar (or press Cmd+L / Ctrl+L)
   - Press Tab repeatedly

2. **Expected behavior**:
   - Tab moves through menu buttons (Scale, Sound, Notation, etc.)
   - After last menu button, Tab moves to **piano keyboard container**
   - **CRITICAL**: Piano keyboard container receives focus as a SINGLE TAB STOP
   - Focus indicator visible around piano keyboard container

3. **Verify screen reader** (macOS: VoiceOver Cmd+F5, Windows: NVDA):
   - Screen reader announces: **"Piano keyboard, use arrow keys to select notes"**
   - Role announced as: **"application"**

4. **Verify focus indicator**:
   - Visual focus outline visible on piano keyboard container
   - Focus outline meets WCAG 2.1 AA contrast requirements

### ✅ Pass Criteria

- [ ] Piano keyboard is a single tab stop (not 88 individual stops)
- [ ] Screen reader announces "Piano keyboard, use arrow keys to select notes"
- [ ] Focus indicator clearly visible
- [ ] Tab continues to next element after piano keyboard

---

## Test Scenario 2: Arrow Key Navigation - Chromatic (User Story 2 - P1 MVP)

**Goal**: Verify arrow keys navigate between piano keys chromatically

### Steps

1. **Tab to piano keyboard** (from Test Scenario 1)

2. **Press Arrow Right**:
   - Focus should move to next key chromatically (C → C# → D → D# → E...)
   - Visual focus indicator moves to next key
   - Screen reader announces new key name (e.g., "C sharp 4")

3. **Press Arrow Right 5 times**:
   - Track which keys receive focus (should be chromatic progression)
   - Each press moves focus one semitone higher

4. **Press Arrow Left**:
   - Focus moves backward chromatically
   - Visual focus indicator moves to previous key

5. **Test circular wrapping**:
   - Navigate to last key (press End)
   - Press Arrow Right
   - Focus should wrap to first key
   - Navigate to first key (press Home)
   - Press Arrow Left
   - Focus should wrap to last key

### ✅ Pass Criteria

- [ ] Arrow Right moves focus to next key (chromatic progression)
- [ ] Arrow Left moves focus to previous key
- [ ] Circular wrapping works (last → first, first → last)
- [ ] Visual focus indicator updates on every arrow press
- [ ] Screen reader announces each key name
- [ ] Response time <50ms (feels instant)

---

## Test Scenario 3: Octave Navigation (User Story 2 - P1 MVP)

**Goal**: Verify Arrow Up/Down navigate to same note in different octaves

### Steps

1. **Navigate to C4** (typically first key):
   - Tab to piano keyboard
   - Press Home (jumps to first key)

2. **Press Arrow Up**:
   - If C5 exists (extended keyboard), focus moves to C5
   - If C5 doesn't exist, focus stays on C4
   - Screen reader announces "C5" or stays silent

3. **Press Arrow Down**:
   - Focus returns to C4
   - Screen reader announces "C4"

4. **Test boundary conditions**:
   - Navigate to highest key (End)
   - Press Arrow Up → focus should stay in place
   - Navigate to lowest key (Home)
   - Press Arrow Down → focus should stay in place

### ✅ Pass Criteria

- [ ] Arrow Up moves to same note, next octave (if exists)
- [ ] Arrow Down moves to same note, previous octave (if exists)
- [ ] At boundaries, focus stays in place (no wrap)
- [ ] Screen reader announces octave changes

---

## Test Scenario 4: Home/End Key Support (User Story 3 - P3)

**Goal**: Verify Home/End keys jump to first/last keys

### Steps

1. **Tab to piano keyboard**

2. **Navigate to middle** (press Arrow Right 5 times)

3. **Press Home**:
   - Focus jumps instantly to first key
   - Visual indicator on first key
   - Screen reader announces first key name

4. **Press End**:
   - Focus jumps instantly to last key
   - Visual indicator on last key
   - Screen reader announces last key name

### ✅ Pass Criteria

- [ ] Home jumps to first key (instant, no animation)
- [ ] End jumps to last key
- [ ] Works from any starting position
- [ ] Screen reader announces jump destination

---

## Test Scenario 5: Note Activation with Enter (User Story 3 - P1 MVP)

**Goal**: Verify Enter key plays focused note

### Steps

1. **Tab to piano keyboard**

2. **Navigate to C4** (press Home)

3. **Press Enter**:
   - **CRITICAL**: Note plays immediately (<20ms latency)
   - Sound is audible
   - Focus remains on C4 (doesn't move)
   - Screen reader announces "Playing C4"

4. **Navigate to different key** (Arrow Right 2 times → D4)

5. **Press Enter**:
   - D4 plays
   - Different pitch from C4
   - Focus remains on D4

### ✅ Pass Criteria

- [ ] Enter plays focused note
- [ ] Latency <20ms (sounds instant)
- [ ] Correct pitch plays
- [ ] Focus remains on same key
- [ ] Screen reader announces "Playing [note]"

---

## Test Scenario 6: Note Activation with Space (User Story 3 - P1 MVP)

**Goal**: Verify Space key plays focused note and prevents page scroll

### Steps

1. **Tab to piano keyboard**

2. **Navigate to E4** (Arrow Right 4 times from Home)

3. **Press Space**:
   - Note plays immediately
   - **CRITICAL**: Page does NOT scroll down
   - Focus remains on E4

4. **Scroll page down** (if scrollable):
   - Press Space again
   - Verify page doesn't scroll further

### ✅ Pass Criteria

- [ ] Space plays focused note
- [ ] Page does NOT scroll (preventDefault works)
- [ ] Latency <20ms
- [ ] Focus remains on same key

---

## Test Scenario 7: Computer Keyboard Shortcuts Preserved (User Story 4 - P2)

**Goal**: Verify FGH.../ZXCASDQWE shortcuts still work

### Steps

1. **Tab to piano keyboard**

2. **Press 'F' key** (letter F on keyboard):
   - Note plays immediately (no navigation)
   - Correct note plays (first visible key in right hand range)

3. **Press 'G', 'H', 'J', 'K', 'L'** in sequence:
   - Each key plays a different note
   - Notes follow visible keyboard layout

4. **Press 'Z', 'X', 'C'** (left hand):
   - Notes play (scale-relative to root)
   - Each is a different note

5. **Press Arrow Right** (navigation):
   - Focus moves (no note plays)
   - Verify navigation keys don't trigger note playback

### ✅ Pass Criteria

- [ ] FGH.../ZXCASDQWE keys play notes (not navigate)
- [ ] Arrow keys navigate (don't play notes)
- [ ] No conflicts between shortcuts and navigation
- [ ] All shortcuts work even when keyboard focused

---

## Test Scenario 8: Out-of-Scale Audio Feedback (User Story 6 - P2)

**Goal**: Verify distinct audio cue plays for notes outside current scale

### Steps

1. **Select C Major scale**:
   - Tab to Scale menu
   - Press Enter to open
   - Press Arrow Down to "Major"
   - Press Enter to select

2. **Tab to piano keyboard**

3. **Navigate to C4** (in scale):
   - Press Enter
   - **Expected**: Normal C4 note plays at full volume for 200ms

4. **Navigate to F#4** (out of scale):
   - Press Arrow Right 6 times from C4 → F#4
   - Press Enter
   - **Expected**: Muted tone plays (20% volume, 50ms duration)
   - **Sound should be distinctly different** from normal note

5. **Compare in-scale vs out-of-scale**:
   - Alternate between C4 (in scale) and F#4 (out of scale)
   - Clearly hear the difference

### ✅ Pass Criteria

- [ ] In-scale notes play at normal volume (200ms)
- [ ] Out-of-scale notes play muted cue (20% volume, 50ms)
- [ ] Cue is clearly distinguishable from normal notes
- [ ] Latency <20ms for both in-scale and out-of-scale
- [ ] No performance degradation

---

## Test Scenario 9: Colorblind Mode Sync (User Story 5 - P3)

**Goal**: Verify color parent synchronizes with keyboard navigation

### Steps

1. **Activate colorblind mode**:
   - Press '2' key (colorBlindProtanopia)
   - Verify color keys change color

2. **Tab to piano keyboard**

3. **Press Arrow Right 3 times**:
   - Observe color key above focused piano key
   - **Expected**: Color key visual focus indicator updates
   - Both piano key and color key show focus simultaneously

4. **Press Enter**:
   - Note plays
   - Color key remains highlighted

5. **Test other colorblind modes** (3-9):
   - Press '3', '4', '5', etc.
   - Verify color changes but navigation still works

### ✅ Pass Criteria

- [ ] Color key highlights when corresponding piano key focused
- [ ] Both piano key and color key update together
- [ ] All colorblind modes (1-9) work with keyboard navigation
- [ ] No conflicts between number keys and navigation

---

## Test Scenario 10: Cross-Browser Compatibility (E2E)

**Goal**: Verify feature works in all major browsers

### Steps

1. **Test in Chrome**:
   - Run all scenarios 1-9 above
   - Verify all pass

2. **Test in Firefox**:
   - Run all scenarios 1-9 above
   - Verify all pass

3. **Test in Safari** (macOS):
   - Run all scenarios 1-9 above
   - Verify all pass

### ✅ Pass Criteria

- [ ] All scenarios pass in Chrome
- [ ] All scenarios pass in Firefox
- [ ] All scenarios pass in Safari
- [ ] Consistent behavior across browsers
- [ ] Performance targets met in all browsers

---

## Performance Testing

### Latency Measurement

**Goal**: Verify <20ms keypress-to-sound latency

### Manual Measurement Steps

1. **Open browser DevTools**:
   - Press F12 or Cmd+Option+I
   - Go to Console tab

2. **Instrument audio playback** (temporary code):
   ```javascript
   // In Keyboard.js noteOnHandler
   const t0 = performance.now();
   this.playNote(note);
   const t1 = performance.now();
   console.log(`Latency: ${t1 - t0}ms`);
   ```

3. **Play 10 notes**:
   - Tab to keyboard
   - Press Enter 10 times (or navigate and activate)
   - Record latency measurements from console

4. **Calculate statistics**:
   ```
   Measurements: [12, 15, 18, 14, 13, 16, 19, 15, 14, 17]
   Average: 15.3ms
   Min: 12ms
   Max: 19ms
   ```

### ✅ Pass Criteria

- [ ] Average latency <20ms
- [ ] 95th percentile (p95) <30ms
- [ ] 99th percentile (p99) <40ms
- [ ] No measurements >50ms

---

### Navigation Response Time

**Goal**: Verify <50ms arrow key navigation response

### Manual Measurement Steps

1. **Instrument navigation** (temporary code):
   ```javascript
   // In Keyboard.js navigateToKey
   const t0 = performance.now();
   this.setState({ focusedKeyIndex: newIndex });
   this.keyRefs[newIndex]?.focus();
   const t1 = performance.now();
   console.log(`Navigation time: ${t1 - t0}ms`);
   ```

2. **Navigate 10 times**:
   - Press Arrow Right 10 times
   - Record response times from console

3. **Calculate statistics**:
   ```
   Measurements: [8, 12, 10, 15, 9, 11, 13, 10, 12, 14]
   Average: 11.4ms
   Min: 8ms
   Max: 15ms
   ```

### ✅ Pass Criteria

- [ ] Average response time <50ms
- [ ] Feels instant to user (no perceptible delay)
- [ ] Max response time <100ms

---

## Screen Reader Testing

### VoiceOver (macOS)

1. **Enable VoiceOver**: Cmd + F5

2. **Test announcements**:
   - Tab to piano keyboard → "Piano keyboard, use arrow keys to select notes, application"
   - Press Arrow Right → "[Note name]" (e.g., "C sharp 4")
   - Press Enter → "Playing [note name]"

### NVDA (Windows)

1. **Start NVDA**: Ctrl + Alt + N

2. **Test announcements**:
   - Same as VoiceOver above
   - Verify ARIA live regions work

### JAWS (Windows)

1. **Start JAWS**: (varies by installation)

2. **Test announcements**:
   - Same as above

### ✅ Pass Criteria

- [ ] VoiceOver announces correctly
- [ ] NVDA announces correctly
- [ ] JAWS announces correctly (if available)
- [ ] ARIA live regions announce note playback
- [ ] No announcement conflicts or duplicates

---

## Accessibility Audit (axe DevTools)

### Steps

1. **Install axe DevTools**:
   - Chrome: https://chrome.google.com/webstore → "axe DevTools"
   - Firefox: Add-ons → "axe DevTools"

2. **Run audit**:
   - Open DevTools (F12)
   - Go to "axe DevTools" tab
   - Click "Scan ALL of my page"

3. **Review violations**:
   - Filter by "Keyboard" category
   - Check for:
     - ✅ No tabindex > 0
     - ✅ No missing keyboard handlers
     - ✅ Proper focus indicators
     - ✅ Correct ARIA roles

### ✅ Pass Criteria

- [ ] 0 critical violations related to keyboard navigation
- [ ] 0 serious violations related to keyboard navigation
- [ ] All piano keys have tabIndex={-1}
- [ ] Piano keyboard container has tabIndex={0}
- [ ] Piano keyboard container has role="application"

---

## Regression Testing (Compare to Master Branch)

### Baseline Measurements

**Before implementing feature**:
1. Checkout master branch: `git checkout master`
2. Run app: `yarn start`
3. Measure keypress-to-sound latency (manual steps above)
4. Record baseline: e.g., "Master branch average: 16ms"

**After implementing feature**:
1. Checkout feature branch: `git checkout 001-piano-key-keyboard-navigation`
2. Run app: `yarn start`
3. Measure keypress-to-sound latency
4. Record new latency: e.g., "Feature branch average: 17ms"

### ✅ Pass Criteria

- [ ] Feature branch latency ≤ master branch latency + 5ms (tolerance)
- [ ] No perceptible performance degradation
- [ ] All existing keyboard shortcuts still work

---

## Common Issues & Troubleshooting

### Issue 1: Piano keyboard not focusable

**Symptom**: Tab skips over piano keyboard

**Fix**: Verify `tabIndex={0}` on Keyboard container:
```javascript
<div className="Keyboard" tabIndex={0} role="application">
```

---

### Issue 2: Each key is a tab stop (88 stops)

**Symptom**: Tab moves through every individual key

**Fix**: Change Key components from `tabIndex={0}` to `tabIndex={-1}`:
```javascript
<div className="Key" tabIndex={-1} role="button">
```

---

### Issue 3: Arrow keys scroll page

**Symptom**: Arrow keys scroll page instead of navigating

**Fix**: Verify `event.preventDefault()` in arrow key handlers:
```javascript
if (e.key === 'ArrowRight') {
  e.preventDefault();
  this.navigateToKey(...);
}
```

---

### Issue 4: Space key scrolls page

**Symptom**: Space key scrolls page when activating note

**Fix**: Verify `event.preventDefault()` in Space handler:
```javascript
if (event.key === ' ') {
  event.preventDefault();
  this.props.noteOnHandler(note);
}
```

---

### Issue 5: Screen reader doesn't announce key names

**Symptom**: VoiceOver/NVDA silent when navigating

**Fix**: Verify ARIA live region exists:
```javascript
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {this.state.focusedNoteName}
</div>
```

---

### Issue 6: Out-of-scale cue not playing

**Symptom**: No audio cue when activating out-of-scale notes

**Fix**: Verify `playOutOfScaleCue` method exists and is called:
```javascript
if (this.props.toneIsInScale) {
  this.props.noteOnHandler(note);
} else {
  this.props.playOutOfScaleCue({ note, ... });
}
```

---

## Summary Checklist

### MVP Features (P1) - Must Pass

- [ ] **US1**: Tab to piano keyboard (single tab stop)
- [ ] **US2**: Arrow Right/Left navigate chromatically
- [ ] **US2**: Arrow Up/Down navigate octaves
- [ ] **US2**: Home/End jump to boundaries
- [ ] **US3**: Enter plays focused note
- [ ] **US3**: Space plays focused note (no page scroll)
- [ ] **US3**: Focus remains on same key after activation

### Secondary Features (P2) - Should Pass

- [ ] **US4**: FGH.../ZXCASDQWE shortcuts work
- [ ] **US4**: No conflicts between shortcuts and navigation
- [ ] **US6**: Out-of-scale audio cue plays
- [ ] **US6**: Cue is distinct from normal notes

### Optional Features (P3) - Nice to Have

- [ ] **US5**: Color parent syncs with keyboard navigation

### Performance - Must Pass

- [ ] Latency <20ms (average)
- [ ] Navigation <50ms (average)
- [ ] No degradation from master

### Accessibility - Must Pass

- [ ] Screen readers announce correctly
- [ ] 0 critical axe violations
- [ ] WCAG 2.1 AA compliance

---

**Testing Complete**: If all checkboxes above are checked, the feature is ready for automated testing and deployment.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
