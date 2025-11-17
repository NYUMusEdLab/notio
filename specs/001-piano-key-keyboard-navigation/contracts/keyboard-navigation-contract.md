# Contract: Keyboard Navigation Events

**Feature**: 001-piano-key-keyboard-navigation
**Date**: 2025-01-16
**Contract Version**: 1.0.0

---

## Overview

This contract defines the keyboard event handling interface for piano keyboard navigation. It specifies which keyboard events are handled, how they behave, and what guarantees the system provides.

---

## Contract Scope

**Components**:
- `Keyboard` component (container) - Primary keyboard event handler
- `Key` component - Individual key activation handler

**Event Sources**:
- Browser `KeyboardEvent` API
- React `onKeyDown` synthetic events

**Performance Guarantee**:
- Navigation response time: <50ms (NFR-003)
- Activation latency: <20ms (NFR-001)

---

## Keyboard Event Contracts

### 1. Arrow Right - Chromatic Navigation (Next Key)

**Event**: `KeyboardEvent` with `key === "ArrowRight"`

**Preconditions**:
- Piano keyboard container has focus
- OR any child Key component has focus

**Behavior**:
```javascript
function handleArrowRight(event) {
  event.preventDefault(); // Prevent default scroll behavior

  const currentIndex = this.state.focusedKeyIndex;
  const totalKeys = this.props.extendedKeyboard ? 24 : 13;
  const nextIndex = (currentIndex + 1) % totalKeys; // Circular wrap

  this.navigateToKey(nextIndex);
}
```

**Postconditions**:
- `focusedKeyIndex` increments by 1
- If at last key (index 12 or 23), wraps to first key (index 0)
- Focused Key component receives visual focus
- Screen reader announces new focused key name (e.g., "C sharp 4")
- Response time <50ms from keypress to focus change

**Example**:
```
Initial state: focusedKeyIndex = 3 (representing D4 in C Major)
User presses: Arrow Right
Final state: focusedKeyIndex = 4 (representing E4 in C Major)
Visual feedback: Focus indicator moves from D4 to E4
Screen reader: "E4"
```

**Edge Cases**:
```
// Last key wraps to first
Initial: focusedKeyIndex = 12 (C5 in standard keyboard)
Arrow Right → focusedKeyIndex = 0 (C4)

// Works in extended keyboard mode
Initial: focusedKeyIndex = 23 (last key in extended mode)
Arrow Right → focusedKeyIndex = 0 (first key)
```

---

### 2. Arrow Left - Chromatic Navigation (Previous Key)

**Event**: `KeyboardEvent` with `key === "ArrowLeft"`

**Preconditions**:
- Piano keyboard container has focus
- OR any child Key component has focus

**Behavior**:
```javascript
function handleArrowLeft(event) {
  event.preventDefault(); // Prevent default scroll behavior

  const currentIndex = this.state.focusedKeyIndex;
  const totalKeys = this.props.extendedKeyboard ? 24 : 13;
  const prevIndex = (currentIndex - 1 + totalKeys) % totalKeys; // Circular wrap

  this.navigateToKey(prevIndex);
}
```

**Postconditions**:
- `focusedKeyIndex` decrements by 1
- If at first key (index 0), wraps to last key (index 12 or 23)
- Focused Key component receives visual focus
- Screen reader announces new focused key name
- Response time <50ms

**Example**:
```
Initial state: focusedKeyIndex = 4 (E4)
User presses: Arrow Left
Final state: focusedKeyIndex = 3 (D4)
Visual feedback: Focus indicator moves from E4 to D4
Screen reader: "D4"
```

**Edge Cases**:
```
// First key wraps to last
Initial: focusedKeyIndex = 0 (C4)
Arrow Left → focusedKeyIndex = 12 (C5 in standard keyboard)

// Works in extended keyboard mode
Initial: focusedKeyIndex = 0
Arrow Left → focusedKeyIndex = 23 (extended mode)
```

---

### 3. Arrow Up - Octave Navigation (Same Note, Higher Octave)

**Event**: `KeyboardEvent` with `key === "ArrowUp"`

**Preconditions**:
- Piano keyboard container has focus
- OR any child Key component has focus

**Behavior**:
```javascript
function handleArrowUp(event) {
  event.preventDefault(); // Prevent default scroll behavior

  const currentIndex = this.state.focusedKeyIndex;
  const currentNote = this.getCurrentNoteAtIndex(currentIndex);

  // Find same note in next octave
  const nextOctaveIndex = this.findSameNoteInOctave(currentNote, +1);

  if (nextOctaveIndex !== null) {
    this.navigateToKey(nextOctaveIndex);
  }
  // If no next octave, stay on current key (no wrap)
}
```

**Postconditions**:
- Focus moves to same note in next octave (e.g., C4 → C5)
- If no higher octave exists, focus stays on current key
- NO circular wrapping at boundaries
- Screen reader announces new focused key
- Response time <50ms

**Example**:
```
Initial state: focusedKeyIndex = 0 (C4 in C Major scale)
User presses: Arrow Up
Final state: focusedKeyIndex = 12 (C5 - same note, next octave)
Visual feedback: Focus indicator moves from C4 to C5
Screen reader: "C5"
```

**Edge Cases**:
```
// At highest octave - stay in place
Initial: focusedKeyIndex = 12 (C5 - highest key in standard keyboard)
Arrow Up → focusedKeyIndex = 12 (stays on C5)
Screen reader: "C5" (no change announced)

// Note exists in next octave
Initial: focusedKeyIndex = 4 (E4)
Arrow Up → focusedKeyIndex = 16 (E5, if extended keyboard)
```

**Note**: Octave calculation depends on keyboard mode (standard vs extended) and scale structure.

---

### 4. Arrow Down - Octave Navigation (Same Note, Lower Octave)

**Event**: `KeyboardEvent` with `key === "ArrowDown"`

**Preconditions**:
- Piano keyboard container has focus
- OR any child Key component has focus

**Behavior**:
```javascript
function handleArrowDown(event) {
  event.preventDefault(); // Prevent default scroll behavior

  const currentIndex = this.state.focusedKeyIndex;
  const currentNote = this.getCurrentNoteAtIndex(currentIndex);

  // Find same note in previous octave
  const prevOctaveIndex = this.findSameNoteInOctave(currentNote, -1);

  if (prevOctaveIndex !== null) {
    this.navigateToKey(prevOctaveIndex);
  }
  // If no previous octave, stay on current key (no wrap)
}
```

**Postconditions**:
- Focus moves to same note in previous octave (e.g., C5 → C4)
- If no lower octave exists, focus stays on current key
- NO circular wrapping at boundaries
- Screen reader announces new focused key
- Response time <50ms

**Example**:
```
Initial state: focusedKeyIndex = 12 (C5)
User presses: Arrow Down
Final state: focusedKeyIndex = 0 (C4 - same note, previous octave)
Visual feedback: Focus indicator moves from C5 to C4
Screen reader: "C4"
```

**Edge Cases**:
```
// At lowest octave - stay in place
Initial: focusedKeyIndex = 0 (C4 - lowest key)
Arrow Down → focusedKeyIndex = 0 (stays on C4)

// Note exists in previous octave
Initial: focusedKeyIndex = 16 (E5)
Arrow Down → focusedKeyIndex = 4 (E4)
```

---

### 5. Home Key - Jump to First Key

**Event**: `KeyboardEvent` with `key === "Home"`

**Preconditions**:
- Piano keyboard container has focus
- OR any child Key component has focus

**Behavior**:
```javascript
function handleHome(event) {
  event.preventDefault(); // Prevent default page scroll

  this.navigateToKey(0); // Always jump to first key
}
```

**Postconditions**:
- `focusedKeyIndex` set to 0 (first key)
- Visual focus moves to first key
- Screen reader announces first key name
- Response time <50ms

**Example**:
```
Initial state: focusedKeyIndex = 7 (any key)
User presses: Home
Final state: focusedKeyIndex = 0 (first key, typically C4)
Visual feedback: Focus indicator jumps to first key
Screen reader: "C4" (or first key name)
```

---

### 6. End Key - Jump to Last Key

**Event**: `KeyboardEvent` with `key === "End"`

**Preconditions**:
- Piano keyboard container has focus
- OR any child Key component has focus

**Behavior**:
```javascript
function handleEnd(event) {
  event.preventDefault(); // Prevent default page scroll

  const totalKeys = this.props.extendedKeyboard ? 24 : 13;
  this.navigateToKey(totalKeys - 1); // Jump to last key
}
```

**Postconditions**:
- `focusedKeyIndex` set to last key index (12 or 23)
- Visual focus moves to last key
- Screen reader announces last key name
- Response time <50ms

**Example**:
```
Initial state: focusedKeyIndex = 0 (first key)
User presses: End
Final state: focusedKeyIndex = 12 (last key in standard, C5)
Visual feedback: Focus indicator jumps to last key
Screen reader: "C5" (or last key name)
```

---

### 7. Enter Key - Activate Focused Note

**Event**: `KeyboardEvent` with `key === "Enter"`

**Preconditions**:
- A Key component has focus (via arrow key navigation OR programmatic focus)

**Behavior** (in Key component):
```javascript
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission

    const { toneIsInScale, note } = this.props;

    if (toneIsInScale) {
      // Play normal note
      this.props.noteOnHandler(note);
      setTimeout(() => {
        this.props.noteOffHandler(note);
      }, 200); // Standard note duration
    } else {
      // Play out-of-scale cue
      this.props.playOutOfScaleCue({
        note,
        cueType: 'muted_tone',
        volume: 0.2,
        duration: 50,
      });
    }
  }
}
```

**Postconditions**:
- If note is in scale: Normal note plays with 200ms duration
- If note is out of scale: Out-of-scale audio cue plays (50ms duration, 20% volume)
- Focus remains on same key (no focus shift)
- Screen reader announces "Playing [note name]" (via ARIA live region)
- Latency <20ms from keypress to sound

**Example (In Scale)**:
```
State: focusedKeyIndex = 0 (C4 in C Major scale)
User presses: Enter
Behavior: C4 plays at normal volume for 200ms
Focus: Remains on C4
Screen reader: "Playing C4"
```

**Example (Out of Scale)**:
```
State: focusedKeyIndex = 6 (F# in C Major scale - out of scale)
User presses: Enter
Behavior: F# plays at 20% volume for 50ms (muted tone cue)
Focus: Remains on F#
Screen reader: "Playing F sharp 4 - not in scale" (optional enhancement)
```

---

### 8. Space Key - Activate Focused Note

**Event**: `KeyboardEvent` with `key === " "` (space character)

**Preconditions**:
- A Key component has focus

**Behavior**:
- **Identical to Enter key** (see contract #7)
- **Additional**: `event.preventDefault()` prevents page scroll

**Postconditions**:
- Same as Enter key activation
- **CRITICAL**: Page does NOT scroll (preventDefault applied)

**Example**:
```
State: focusedKeyIndex = 2 (D4)
User presses: Space
Behavior: D4 plays, page does NOT scroll
Focus: Remains on D4
Screen reader: "Playing D4"
```

---

### 9. Computer Keyboard Shortcuts (FGH.../ZXCASDQWE) - Preserved

**Events**: `KeyboardEvent` with `code` in predefined shortcuts

**Right Hand Shortcuts**:
```javascript
const keycodes = ["KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"];
const keycodesExtended = [
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL",
  "Semicolon", "Quote", "BracketLeft", "Equal"
];
```

**Left Hand Shortcuts**:
```javascript
const keycodesLeftHand = ["KeyZ", "KeyX", "KeyC", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyW", "KeyE"];
```

**Preconditions**:
- Keyboard shortcut key pressed (anywhere on page - global listener)

**Behavior**:
```javascript
// Right hand: Maps directly to visible keys
const mapKeyDown = activeKeyCodes.indexOf(e.code);
if (mapKeyDown !== -1) {
  const buttonPressed = activeElementsforKeyboard[mapKeyDown];
  this.noteOnHandler(buttonPressed.dataset.note);
}

// Left hand: Scale-relative (steps above root)
const StepsAboveRoot = stepsAboveRootLeftHand[mapKeyDownLeftHand];
const note = activeScale.NoteNameWithOctaveNumber(octave, 0, StepsAboveRoot);
this.playNote(note);
```

**Postconditions**:
- Note plays immediately (<20ms latency)
- Works even when piano keyboard container does NOT have focus
- **NO CONFLICTS** with navigation keys (Arrow, Home, End, Enter, Space)
- Existing behavior preserved - no changes to this system

**Guarantee**: Navigation keys (Arrow, Home, End, Enter, Space) do NOT interfere with computer keyboard shortcuts (A-Z, Semicolon, etc.)

---

### 10. Digit Keys (1-9) - Colorblind Mode Switching (Preserved)

**Events**: `KeyboardEvent` with `code === "Digit1"` through `"Digit9"`

**Behavior**: Changes colorblind mode (already implemented, no changes)

**Postconditions**:
- Color mode changes
- Visual colors update on all keys
- **NO CONFLICTS** with navigation or activation keys

---

## Event Routing Strategy

### Container vs Key Event Handling

**Keyboard Container (NEW)**:
- Handles: Arrow keys, Home, End
- Purpose: Focus navigation
- Event scope: `onKeyDown` on container element

**Individual Keys (EXISTING)**:
- Handles: Enter, Space
- Purpose: Note activation
- Event scope: `onKeyDown` on Key element

**Global Document (EXISTING)**:
- Handles: A-Z shortcuts (FGH.../ZXCASDQWE), Digit1-9
- Purpose: Quick note playback, colorblind mode
- Event scope: `document.addEventListener("keydown")`

### Event Propagation

```javascript
// Container-level handler (NEW)
handleContainerKeyDown = (e) => {
  const navigationKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

  if (navigationKeys.includes(e.key)) {
    e.preventDefault(); // Prevent default scroll behavior
    e.stopPropagation(); // Don't let navigation keys bubble to global handler

    // Handle navigation...
  }
  // Let other keys (A-Z, Enter, Space) propagate
};

// Key-level handler (EXISTING)
handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    // Handle activation...
    // Don't stopPropagation - let it bubble if needed
  }
};

// Global handler (EXISTING - unchanged)
handleKeyDown = (e) => {
  // Handle A-Z shortcuts, Digit1-9
  // Runs even if keyboard container not focused
};
```

---

## Performance Guarantees

### Navigation Response Time

**Guarantee**: <50ms from keypress to visual focus change

**Measurement**:
```javascript
const t0 = performance.now();
this.navigateToKey(newIndex);
const t1 = performance.now();
console.log(`Navigation latency: ${t1 - t0}ms`);
```

**Target**: 10-30ms typical, <50ms maximum

### Activation Latency

**Guarantee**: <20ms from Enter/Space press to audio output start

**Measurement**:
```javascript
const t0 = performance.now();
this.props.noteOnHandler(note);
const t1 = performance.now();
console.log(`Activation latency: ${t1 - t0}ms`);
```

**Target**: <20ms (NFR-001), stretch goal <10ms

---

## Error Handling

### Invalid focusedKeyIndex

**Error**: `focusedKeyIndex` out of bounds

**Handling**:
```javascript
navigateToKey = (newIndex) => {
  const totalKeys = this.props.extendedKeyboard ? 24 : 13;

  // Clamp to valid range
  const clampedIndex = Math.max(0, Math.min(newIndex, totalKeys - 1));

  this.setState({ focusedKeyIndex: clampedIndex });

  // Safe access with optional chaining
  this.keyRefs[clampedIndex]?.focus();
};
```

**Guarantee**: Focus index always valid, never crashes

### Missing Key Ref

**Error**: `keyRefs[index]` is null or undefined

**Handling**:
```javascript
// Optional chaining prevents crash
this.keyRefs[clampedIndex]?.focus();
// If ref doesn't exist, focus() is not called (no-op)
```

**Guarantee**: No crashes, graceful degradation

### Keyboard Container Not Focused

**Error**: User presses arrow keys when container not focused

**Handling**: Event does not fire (container `onKeyDown` only fires when focused)

**Guarantee**: Navigation only works when keyboard has focus (expected behavior)

---

## Accessibility Guarantees

### Screen Reader Announcements

**Navigation**:
- Screen reader announces new focused key name on every arrow key press
- Implementation: ARIA live region with `aria-live="polite"`
- Format: "[Note name]" (e.g., "C4", "D sharp 4")

**Activation**:
- Screen reader announces "Playing [note name]" when Enter/Space pressed
- Optional enhancement: "Playing [note name] - not in scale" for out-of-scale notes

### ARIA Attributes

**Keyboard Container**:
```javascript
<div
  className="Keyboard"
  tabIndex={0}
  role="application"
  aria-label="Piano keyboard, use arrow keys to select notes, Enter or Space to play"
  onKeyDown={this.handleContainerKeyDown}
>
```

**Individual Keys**:
```javascript
<div
  className="Key"
  tabIndex={-1}  // Only programmatically focusable
  role="button"
  aria-label={`Play ${note}`}
  onKeyDown={this.handleKeyDown}
>
```

**ARIA Live Region** (for announcements):
```javascript
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {this.state.currentlyFocusedNoteName}
</div>
```

---

## Testing Contracts

### Integration Test Contracts

**Navigation tests MUST verify**:
1. Arrow Right increments focusedKeyIndex
2. Arrow Left decrements focusedKeyIndex
3. Circular wrapping at boundaries (last→first, first→last)
4. Home jumps to index 0
5. End jumps to last index
6. Arrow Up/Down navigate octaves (or stay in place if boundary)
7. Focus indicator visible on focused key

**Activation tests MUST verify**:
1. Enter plays note when key focused
2. Space plays note when key focused
3. Space prevents page scroll
4. Focus remains on same key after activation
5. Out-of-scale notes trigger different audio cue

### E2E Test Contracts

**Complete workflow tests MUST verify**:
1. Tab to keyboard container → container receives focus
2. Press Arrow Right 3 times → focus moves to 4th key
3. Press Enter → note plays
4. Press Escape or Tab → focus leaves keyboard

**Cross-browser tests MUST verify**:
1. Navigation works in Chrome, Firefox, Safari
2. Activation works in all browsers
3. Performance targets met (<50ms navigation, <20ms activation)

---

## Contract Version History

**1.0.0** (2025-01-16):
- Initial contract definition
- Arrow key navigation (Left, Right, Up, Down)
- Home/End key support
- Enter/Space activation
- Computer keyboard shortcuts preservation
- Performance guarantees (<50ms navigation, <20ms activation)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
