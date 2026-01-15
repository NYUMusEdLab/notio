# Codebase Research: Piano Key Keyboard Navigation

**Feature**: 001-piano-key-keyboard-navigation
**Date**: 2025-01-16
**Status**: Phase 0 Complete

---

## Executive Summary

This document contains findings from Phase 0 codebase exploration. **KEY DISCOVERY**: Much of the required functionality already exists! The user was correct - piano keyboard container navigation, Enter/Space activation, and computer keyboard shortcuts (FGH.../ZXCASDQWE) are already implemented. The primary work for this feature involves:

1. **Enhancement**: Improving focus management and visual feedback
2. **New Feature**: Adding out-of-scale audio feedback
3. **Testing**: Adding comprehensive accessibility test coverage
4. **Performance**: Verifying <20ms latency maintained

---

## 1. Piano Keyboard Parent Container Component

### Location
**File**: [src/components/keyboard/Keyboard.js](src/components/keyboard/Keyboard.js)

### Current Implementation

The `Keyboard` component is a **class component** that:
- Renders a collection of `Key` components (one for each piano key)
- Manages global keyboard event handlers via `document.addEventListener`
- Handles mouse events for click-based piano playing
- Manages audio playback via `SoundMaker` instance
- Manages colorblind mode switching (Digit1-9 keys)

### Key Architecture Details

```javascript
class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNotes: new Set(),      // Currently playing notes
      mouse_is_down: false,
      scales: this.props.scaleList,
      octave: this.props.octave,
      colorname: "standard",       // Colorblind mode state
      instrumentSound: this.props.instrumentSound,
      synth: new SoundMaker({...}) // Audio engine
    };
  }

  componentDidMount() {
    // Global keyboard event listeners (NOT on Keyboard element)
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);

    const keyboard = document.querySelector(".Keyboard");
    keyboard.addEventListener("mousedown", this.mouseDown, false);
    keyboard.addEventListener("mouseup", this.mouseUp, false);
  }

  render() {
    return (
      <div className="Keyboard" data-testid="Keyboard">
        {noteList}  {/* Maps to Key components */}
      </div>
    );
  }
}
```

### Current State
- ✅ **Container exists**: `<div className="Keyboard">`
- ❌ **NOT focusable**: No `tabIndex={0}` on container
- ❌ **NO `role="application"`**: Missing ARIA role
- ❌ **NO aria-label**: Missing screen reader announcement
- ⚠️ **Event handling**: Uses global `document` listeners (not container-scoped)

### What Needs Enhancement

1. **Make container focusable**:
   ```javascript
   <div
     className="Keyboard"
     data-testid="Keyboard"
     tabIndex={0}
     role="application"
     aria-label="Piano keyboard, use arrow keys to select notes"
     onKeyDown={this.handleContainerKeyDown}  // NEW: Container-scoped handler
   >
   ```

2. **Add focus state management**:
   ```javascript
   this.state = {
     // ... existing state
     focusedKeyIndex: 0,  // NEW: Track focused key (0-87 for 88 keys, or 0-12 for 13 keys)
   };
   ```

3. **Add key refs for programmatic focus**:
   ```javascript
   this.keyRefs = [];  // NEW: Store refs to Key components
   ```

4. **Scope keyboard events to container** (optional - could keep global for A-Z shortcuts):
   - Consider moving arrow key handling to container `onKeyDown`
   - Keep A-Z shortcuts in global `handleKeyDown` to work anywhere

---

## 2. Existing Arrow Key Navigation Implementation

### Location
**File**: [src/components/keyboard/Keyboard.js](src/components/keyboard/Keyboard.js) (lines 191-196)

### Current Implementation

```javascript
handleKeyDown = (e) => {
  // ... keyboard shortcut handling ...

  if (e.code === "ArrowDown") {
    this.props.handleClickOctave(e.code);  // Changes octave
  }
  if (e.code === "ArrowUp") {
    this.props.handleClickOctave(e.code);  // Changes octave
  }
}
```

### Current Behavior
- ✅ **Arrow Up/Down exist**: Already handled
- ⚠️ **Function**: Changes octave (not key navigation)
- ❌ **Arrow Left/Right**: Not implemented
- ❌ **Chromatic navigation**: Not implemented
- ❌ **Focus management**: Not connected to key focus

### What Needs Enhancement

1. **Add Arrow Left/Right for chromatic navigation**:
   ```javascript
   case 'ArrowRight':
     this.navigateToKey((this.state.focusedKeyIndex + 1) % totalKeys);
     break;
   case 'ArrowLeft':
     this.navigateToKey((this.state.focusedKeyIndex - 1 + totalKeys) % totalKeys);
     break;
   ```

2. **Repurpose Arrow Up/Down for octave navigation**:
   ```javascript
   case 'ArrowUp':
     this.navigateToNextOctave();  // Same note, next octave
     break;
   case 'ArrowDown':
     this.navigateToPreviousOctave();  // Same note, previous octave
     break;
   ```

3. **Add Home/End key support**:
   ```javascript
   case 'Home':
     this.navigateToKey(0);  // First key
     break;
   case 'End':
     this.navigateToKey(totalKeys - 1);  // Last key
     break;
   ```

4. **Implement `navigateToKey` method**:
   ```javascript
   navigateToKey = (newIndex) => {
     this.setState({ focusedKeyIndex: newIndex });
     this.keyRefs[newIndex]?.focus();  // Programmatic focus
   };
   ```

---

## 3. Enter/Space Activation Handlers

### Location
**File**: [src/components/keyboard/Key.js](src/components/keyboard/Key.js) (lines 7-19)

### Current Implementation

```javascript
class Key extends Component {
  handleKeyDown = (event) => {
    // Keyboard accessibility: Activate on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent Space from scrolling page
      if (this.props.toneIsInScale) {
        this.props.noteOnHandler(this.props.note);
        // Release note after a short duration (similar to a quick tap)
        setTimeout(() => {
          this.props.noteOffHandler(this.props.note);
        }, 200);
      }
    }
  };

  render() {
    return (
      <div
        className={`Key ${keyColor} ${toneIsInScale ? "on" : "off"}`}
        data-testid="test-key"
        data-note={note}
        onKeyDown={this.handleKeyDown}  // Enter/Space handler
        tabIndex={0}                     // ⚠️ PROBLEM: Each key is focusable
        role="button"
        aria-label={`Play ${note}`}
      >
        {/* ColorKey and PianoKey children */}
      </div>
    );
  }
}
```

### Current Behavior
- ✅ **Enter/Space activation**: Already implemented!
- ✅ **preventDefault**: Space doesn't scroll page
- ✅ **Scale detection**: Only plays if `toneIsInScale === true`
- ✅ **Note duration**: 200ms timeout (similar to mouse click)
- ⚠️ **PROBLEM**: Each Key has `tabIndex={0}` - creates 88 tab stops!

### What Needs Enhancement

1. **Change individual Key tabIndex to -1**:
   ```javascript
   <div
     className={`Key ${keyColor} ${toneIsInScale ? "on" : "off"}`}
     data-testid="test-key"
     data-note={note}
     onKeyDown={this.handleKeyDown}
     tabIndex={-1}  // ✅ FIX: Only programmatically focusable
     role="button"
     aria-label={`Play ${note}`}
   >
   ```

2. **Move Enter/Space handling to Keyboard container** (optional):
   - Could handle in container when key is focused
   - OR keep current implementation (works fine if tabIndex=-1)

3. **Verify latency**: Current implementation already exists - measure actual latency
   - `setTimeout` is 200ms for note duration (not latency)
   - Actual keypress-to-sound latency needs measurement

### Out-of-Scale Audio Feedback Integration Point

**Current code** (Key.js line 11):
```javascript
if (this.props.toneIsInScale) {
  this.props.noteOnHandler(this.props.note);
  setTimeout(() => {
    this.props.noteOffHandler(this.props.note);
  }, 200);
}
```

**Enhanced for out-of-scale feedback**:
```javascript
if (this.props.toneIsInScale) {
  this.props.noteOnHandler(this.props.note);
  setTimeout(() => {
    this.props.noteOffHandler(this.props.note);
  }, 200);
} else {
  // NEW: Out-of-scale audio cue
  this.props.playOutOfScaleCue(this.props.note);
}
```

---

## 4. Computer Keyboard Shortcut Mapping (FGH.../ZXCASDQWE)

### Location
**File**: [src/components/keyboard/Keyboard.js](src/components/keyboard/Keyboard.js) (lines 10-48, 166-189)

### Current Implementation

#### Right Hand Shortcuts (FGH...)
```javascript
// Line 11-27
const keycodes = ["KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"];

const keycodesExtended = [
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL",
  "Semicolon", "Quote", "BracketLeft", "Equal",
];
```

#### Left Hand Shortcuts (ZXCASDQWE)
```javascript
// Line 29-30
const keycodesLeftHand = ["KeyZ", "KeyX", "KeyC", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyW", "KeyE"];
const stepsAboveRootLeftHand = [-6, -5, -4, -3, -2, -1, 0, 1, 2];
```

#### Key Handling Logic
```javascript
// Lines 166-189 in handleKeyDown
const activeKeyCodes = extendedKeyboard ? keycodesExtended : keycodes;
let mapKeyDown = activeKeyCodes.indexOf(e.code);

// Right hand shortcuts
if (activeKeyCodes.includes(e.code) && mapKeyDown + 1 <= activeElementsforKeyboard.length) {
  const buttonPressed = activeElementsforKeyboard[mapKeyDown];
  pressedKeys.add(buttonPressed);
  this.noteOnHandler(buttonPressed.dataset.note);
}
// Left hand shortcuts
else if (keycodesLeftHand.includes(e.code)) {
  const mapKeyDownLeftHand = keycodesLeftHand.indexOf(e.code);
  const StepsAboveRoot = stepsAboveRootLeftHand[mapKeyDownLeftHand];
  const buttonPressed = activeScale.NoteNameWithOctaveNumber(
    octave + octaveDist, 0, StepsAboveRoot
  );
  if (!pressedKeysLeftHand.has(buttonPressed)) {
    pressedKeysLeftHand.add(buttonPressed);
    this.playNote(buttonPressed);
  }
}
```

### Current Behavior
- ✅ **Right hand shortcuts**: FGH... already work!
- ✅ **Left hand shortcuts**: ZXCASDQWE already work!
- ✅ **Key press/release tracking**: Uses `Set` to prevent duplicates
- ✅ **Scale-aware**: Right hand shortcuts only play keys in scale
- ✅ **Relative to root**: Left hand shortcuts calculate notes relative to root

### Keyboard Layout

**Right Hand (FGH...)**: Maps to visible keys on keyboard
```
Extended:  A S D F G H J K L ; ' [ =
Standard:        F G H J K L ; '
```

**Left Hand (ZXCASDQWE)**: Scale-relative (steps above root)
```
Q W E     (Root+1, Root+2)
A S D     (Root-3, Root-2, Root-1)
Z X C     (Root-6, Root-5, Root-4)
```

### What Needs Enhancement

**Minimal changes required** - shortcuts already work!

1. **Ensure no conflicts with navigation keys**:
   - Navigation: Arrow keys, Home, End, Enter, Space
   - Shortcuts: A-Z keys, Semicolon, Quote, BracketLeft, Equal
   - **NO CONFLICTS**: These are separate key sets ✅

2. **Test with piano keyboard focused**:
   - Ensure A-Z shortcuts continue to work when container has focus
   - May need to prevent event propagation on arrow keys

3. **Document keyboard layout** in quickstart.md for users

---

## 5. Scale State and Scale Detection Logic

### Location
**File**: [src/Model/MusicScale.js](src/Model/MusicScale.js)

### Current Implementation

The `MusicScale` class manages:
- **Scale recipe**: Steps (intervals) defining the scale
- **Root note**: The tonic of the scale
- **Extended scale**: Full keyboard range with scale tones marked
- **MIDI numbering**: MIDI note numbers for each tone
- **Colors**: Color mapping for each tone

#### Key Properties
```javascript
class MusicScale {
  Name = "";                    // Scale name (e.g., "Major", "Minor")
  RootNoteName = "";            // Root note (e.g., "C", "D#")
  SemitoneSteps = [];           // Scale intervals (e.g., [0, 2, 4, 5, 7, 9, 11])
  ExtendedScaleTones = [];      // All tones in keyboard range
  MidiNoteNr = [];              // MIDI note numbers
  BasisScale = [];              // One octave of the scale
  AmbitusInSemiNotes = 24;      // Keyboard range in semitones
}
```

#### Usage in Keyboard.js
```javascript
// Line 335-336, 361-366
activeScale = new MusicScale(
  this.props.scaleObject,  // Scale recipe (steps, numbers)
  this.props.baseNote,     // Root note
  scaleStart,              // Starting chromatic step
  ambitus                  // Range in semitones
);

// Line 498-501: Check if note is in scale
let toneindex = currentScale.MidiNoteNr.indexOf(keyboardLayoutScale.MidiNoteNr[index]);
if (toneindex !== -1) {
  toneIsInScale = true;  // ✅ Note is in scale
  toneColor = currentScale.Colors[toneindex];
}
```

### Current Behavior
- ✅ **Scale state**: Managed via `activeScale` module variable
- ✅ **Scale detection**: `MidiNoteNr.indexOf()` checks if note is in scale
- ✅ **Props-driven**: Scale updated via `this.props.scaleObject` and `this.props.baseNote`
- ✅ **Reactive**: Updates in `componentDidUpdate` when props change

### Scale Detection Algorithm

**Current method**: MIDI number comparison
```javascript
// keyboardLayoutScale = Chromatic scale (all 88 keys)
// currentScale = Selected scale (e.g., C Major)
const isInScale = currentScale.MidiNoteNr.indexOf(keyMidiNumber) !== -1;
```

### What Needs for Out-of-Scale Feedback

**Scale detection already works!** Just use the existing `toneIsInScale` prop:

```javascript
// In Key.js (already exists!)
const { toneIsInScale } = this.props;

// In Enter/Space handler
if (toneIsInScale) {
  // Play normal note
} else {
  // Play out-of-scale cue (NEW FEATURE)
  this.props.playOutOfScaleCue(this.props.note);
}
```

**No new scale detection logic needed** - `toneIsInScale` is already passed to every Key component!

---

## 6. Color Parent Component and Synchronization

### Location
**File**: [src/components/keyboard/ColorKey.js](src/components/keyboard/ColorKey.js)

### Current Implementation

The `ColorKey` component is a **child of `Key`** that:
- Renders the colored portion of each key
- Handles mouse/touch events for note playback
- Displays musical staff notation (when enabled)
- Shows visual feedback (color changes, star icons)

#### Architecture
```javascript
// Key.js renders ColorKey as a child
<ColorKey
  color={color}              // Color from scale
  keyColor={keyColor}        // Piano key color (white/black)
  toneIsInScale={toneIsInScale}
  note={note}
  synth={synth}
  isMouseDown={mouse_is_down}
  noteOnHandler={noteOnHandler}
  noteOffHandler={noteOffHandler}
  // ... other props
/>
```

### ColorKey Methods
```javascript
class ColorKey extends Component {
  touchDown = (e) => {
    if (this.props.toneIsInScale) {
      this.playNote(this.props.note);
    }
  };

  clickedMouse = (e) => {
    if (this.props.toneIsInScale) {
      this.playNote(this.props.note);
    }
  };

  mouseEnter = (e) => {
    if (this.props.toneIsInScale && this.props.isMouseDown === true) {
      this.playNote(this.props.note);
    }
  };
}
```

### Current Synchronization Mechanism

**Colorblind mode switching** (Keyboard.js lines 138-164):
```javascript
handleKeyDown = (e) => {
  // Number keys 1-9 change color mode
  if (e.code === "Digit1") {
    this.setState({ colorname: "standard" });
  }
  if (e.code === "Digit2") {
    this.setState({ colorname: "colorBlindProtanopia" });
  }
  // ... Digit3-9 for other modes
}

// Color state passed down to ColorKey
const keyboardLayoutScale = this.keyboardLayoutScale("Chromatic");
const currentScale = this.mapCurrentScaleToKeyboardLayout();
// currentScale uses colors[this.state.colorname]
```

### What ColorKey Does

**NOT a "color key parent" in the sense the user described!**

Re-reading the user's original statement:
> "Navigation should be simultaneous to piano key and color key parent element"

**Interpretation**: The user likely means:
1. **Piano keyboard container** (Keyboard.js) receives focus
2. **ColorKey visual element** (child of Key) shows focus state
3. Both update together when arrow keys navigate

**Current architecture supports this**:
- Keyboard container can have `focusedKeyIndex` state
- Key components can receive `isFocused` prop
- ColorKey can render focus indicator when `isFocused === true`

### What Needs Enhancement

1. **Add focus state to Keyboard.js**:
   ```javascript
   this.state = {
     // ... existing state
     focusedKeyIndex: 0,
   };
   ```

2. **Pass `isFocused` to Key components**:
   ```javascript
   <Key
     // ... existing props
     isFocused={index === this.state.focusedKeyIndex}
   />
   ```

3. **ColorKey renders focus indicator**:
   ```javascript
   // In ColorKey.js
   render() {
     const { isFocused } = this.props;
     return (
       <div
         className={`ColorKey ${isFocused ? 'focused' : ''}`}
         // ... existing props
       >
         {/* Visual focus indicator */}
       </div>
     );
   }
   ```

**No complex synchronization needed** - standard React props flow!

---

## 7. Web Audio API Integration

### Location
**Files**:
- [src/Model/SoundMaker.js](src/Model/SoundMaker.js)
- [src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js](src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js)
- [src/Model/Adapters/Adapter_SoundFont_to_SoundMaker.js](src/Model/Adapters/Adapter_SoundFont_to_SoundMaker.js)

### Current Implementation

#### SoundMaker Architecture

The `SoundMaker` class uses an **adapter pattern** to support multiple audio libraries:

```javascript
class SoundMaker extends Component {
  constructor(props) {
    super(props);
    this.selectedAdaptor = 1;  // 0 = SoundFont, 1 = Tone.js
    this.soundMakerAdapters = [
      new sf_Adapter_to_SoundMaker(props),  // SoundFont adapter
      new ts_Adapter_to_SoundMaker(props),  // Tone.js adapter (active)
    ];
    this.soundMakerAdapter = this.soundMakerAdapters[this.selectedAdaptor];
  }

  startSound(note) {
    this.soundMakerAdapter.startSound(note);
  }

  stopSound(note) {
    this.soundMakerAdapter.stopSound(note);
  }

  getState() {
    return this.soundMakerAdapter.getState();
  }

  resumeSound(note) {
    this.soundMakerAdapter.resumeSound(note);
  }
}
```

#### Current Audio Stack

**Active adapter**: Tone.js (`ts_Adapter_to_SoundMaker`)
- Uses Tone.js Piano library (`@tonejs/piano`)
- Implements Web Audio API under the hood
- Supports polyphony (multiple simultaneous notes)
- Preloads instrument samples

### Audio Playback Flow

```
User Action (keyboard/mouse)
  ↓
Keyboard.noteOnHandler(note)
  ↓
Keyboard.playNote(note)
  ↓
this.state.synth.startSound(note)
  ↓
SoundMaker.startSound(note)
  ↓
ts_Adapter_to_SoundMaker.startSound(note)
  ↓
Tone.js Piano.keyDown(note)
  ↓
Web Audio API (AudioContext, GainNode, etc.)
  ↓
Audio Output
```

### Current Latency Characteristics

**Unknown** - needs measurement!

Factors affecting latency:
1. **Event handling**: Browser event loop
2. **React updates**: State changes, re-renders
3. **Tone.js processing**: Note scheduling
4. **Web Audio API**: Audio buffer scheduling
5. **OS audio stack**: System audio latency

### What Needs for Out-of-Scale Feedback

**New method in SoundMaker**:
```javascript
playOutOfScaleCue(note) {
  // Option 1: Short click/beep sound
  // Option 2: Muted version of the note
  // Option 3: Brief dissonant chord
  this.soundMakerAdapter.playOutOfScaleCue(note);
}
```

**Integration point in Keyboard.js**:
```javascript
playOutOfScaleCue = (note) => {
  this.state.synth.playOutOfScaleCue(note);
  // No need to add to activeNotes (it's not a real note)
};
```

### Performance Measurement Strategy

**Add Performance API instrumentation**:
```javascript
// In Keyboard.js handleKeyDown
handleKeyDown = (e) => {
  const t0 = performance.now();

  if (e.key === 'Enter' || e.key === ' ') {
    this.noteOnHandler(focusedNote);

    // Measure latency
    const t1 = performance.now();
    console.log(`Keypress-to-sound latency: ${t1 - t0}ms`);
  }
};
```

**More accurate**: Measure in adapter when audio actually starts:
```javascript
// In ts_Adapter_to_SoundMaker.js
startSound(note) {
  const t0 = performance.now();
  this.piano.keyDown(note);
  const t1 = performance.now();
  console.log(`Audio start latency: ${t1 - t0}ms`);
}
```

---

## 8. Performance Baseline Measurements

### Current Latency

**⚠️ NEEDS MEASUREMENT**

To establish baseline before making changes:

1. **Instrument handleKeyDown in Keyboard.js**
2. **Measure in production build** (not dev mode - React dev tools add overhead)
3. **Test on target devices** (not just developer machine)

### Expected Latency Breakdown

Based on typical Web Audio implementations:

- **Event handling**: 1-5ms
- **React state update**: 5-15ms (with setState)
- **Tone.js scheduling**: 5-10ms
- **Web Audio API**: 5-20ms (buffer scheduling)
- **Total estimated**: 16-50ms

**Target**: <20ms (stretch goal: <10ms)

### Measurement Script

```javascript
// Add to Keyboard.js for baseline measurement
measureLatency = (keyCode) => {
  const measurements = [];

  const t0 = performance.now();
  this.playNote(note);
  const t1 = performance.now();

  measurements.push(t1 - t0);

  if (measurements.length >= 100) {
    const avg = measurements.reduce((a, b) => a + b) / measurements.length;
    const max = Math.max(...measurements);
    const min = Math.min(...measurements);
    console.log(`Latency - Avg: ${avg}ms, Min: ${min}ms, Max: ${max}ms`);
  }
};
```

### Performance Regression Testing

**Before changes**:
1. Run latency measurement script
2. Record baseline (avg, min, max, p95, p99)
3. Save results in research.md

**After changes**:
1. Run same measurement script
2. Compare to baseline
3. **FAIL if avg latency > baseline + 5ms** (5ms tolerance)

---

## 9. Best Practices Research

### WAI-ARIA Application Pattern

**Resources**:
- [WAI-ARIA Authoring Practices 1.2 - Application Role](https://www.w3.org/WAI/ARIA/apg/patterns/application/)

**Key Findings**:

#### When to Use `role="application"`

✅ **Use for custom keyboard handling** (our case):
- Piano keyboard overrides default arrow key behavior (scrolling)
- Custom navigation (chromatic, octave jumps)
- Custom activation (Enter/Space to play notes)

❌ **Don't use for standard HTML interactions**:
- Form controls (use native `<input>`, `<button>`)
- Standard navigation (use default browser behavior)

#### Screen Reader Behavior

With `role="application"`:
- Screen reader switches to "application mode"
- Arrow keys pass through to application (not screen reader navigation)
- User must use screen reader commands explicitly (e.g., Tab to move between regions)

**Best practice**: Always provide `aria-label` to explain custom behavior:
```javascript
<div
  role="application"
  aria-label="Piano keyboard, use arrow keys to select notes, Enter or Space to play"
>
```

### React Performance Optimization

**State + Refs Hybrid Approach**

The user confirmed **Option B** (state + refs hybrid):
- **State**: Track `focusedKeyIndex` (enables color parent sync, easier testing)
- **Refs**: Programmatic focus (`keyRefs[index].focus()`)

#### Why This Works

**State updates trigger re-renders**:
- ColorKey can receive `isFocused` prop
- Visual focus indicator updates automatically
- Easy to test (can inspect state)

**Refs avoid focus() side effects**:
- Direct DOM manipulation
- No extra re-renders from focus events
- Standard pattern in React accessibility implementations

#### Performance Impact

**Re-render cost**: ~1-5ms per navigation (acceptable for <50ms target)
**Optimization if needed**:
```javascript
// Memoize Key components
const MemoizedKey = React.memo(Key, (prevProps, nextProps) => {
  return prevProps.isFocused === nextProps.isFocused &&
         prevProps.note === nextProps.note;
});
```

### Web Audio API Low-Latency Best Practices

**Key Techniques**:

1. **Preload samples**: Already done by Tone.js Piano
2. **Use AudioContext.baseLatency**: Check system latency
3. **Optimize scheduling**: Use `currentTime` instead of setTimeout
4. **Avoid React state for audio**: Keep audio path separate (already done!)

**Tone.js handles most of this automatically** - minimal custom optimization needed.

### Out-of-Scale Audio Cue Design

**Research Findings**:

#### Option 1: Muted Tone
- **Pros**: Musical context preserved, clear feedback
- **Cons**: May be confused with volume issue
- **Implementation**: Play note at 20% volume, shorter duration (50ms)

#### Option 2: Click/Beep
- **Pros**: Clearly different from notes, non-musical
- **Cons**: May be jarring, breaks musical flow
- **Implementation**: Short 1000Hz sine wave (20ms)

#### Option 3: Brief Dissonant Chord
- **Pros**: Musical but clearly "wrong", educational value
- **Cons**: More complex to implement, may be too intrusive
- **Implementation**: Play note + tritone (100ms)

**Recommendation**: **Option 1 (Muted Tone)** for initial implementation
- Least intrusive
- Easy to implement (modify existing `playNote`)
- Can be toggled/customized in future

---

## 10. Component Relationship Diagram

```
WholeApp
  └── [Some parent component]
      └── Keyboard (Class Component)
          ├── State:
          │   ├── activeNotes: Set
          │   ├── mouse_is_down: boolean
          │   ├── colorname: string (colorblind mode)
          │   ├── synth: SoundMaker instance
          │   └── [NEW] focusedKeyIndex: number
          │
          ├── Event Listeners (global):
          │   ├── document.addEventListener("keydown", handleKeyDown)
          │   ├── document.addEventListener("keyup", handleKeyUp)
          │   └── [NEW] Container onKeyDown={handleContainerKeyDown}
          │
          ├── Methods:
          │   ├── handleKeyDown (A-Z shortcuts, Digit1-9, ArrowUp/Down for octave)
          │   ├── noteOnHandler (plays note, adds to activeNotes)
          │   ├── noteOffHandler (stops note, removes from activeNotes)
          │   └── [NEW] navigateToKey, playOutOfScaleCue
          │
          └── Renders multiple Key components:
              │
              └── Key (Class Component) ✕ 13 (or 24 for extended)
                  ├── Props:
                  │   ├── note: string (e.g., "C4")
                  │   ├── toneIsInScale: boolean ✅ Already exists!
                  │   ├── color: string
                  │   ├── keyColor: string (white/black)
                  │   ├── noteOnHandler: function
                  │   ├── noteOffHandler: function
                  │   └── [NEW] isFocused: boolean
                  │
                  ├── Attrs:
                  │   ├── tabIndex={0} → [CHANGE TO] tabIndex={-1}
                  │   ├── role="button"
                  │   ├── aria-label={`Play ${note}`}
                  │   └── [NEW] ref={keyRefs[index]}
                  │
                  ├── Event Handler:
                  │   └── onKeyDown (Enter/Space → noteOnHandler)
                  │
                  ├── Children:
                  │   ├── ColorKey (colored portion, handles mouse/touch)
                  │   │   ├── Shows visual feedback
                  │   │   ├── [NEW] Shows focus indicator when isFocused
                  │   │   └── Renders MusicalStaff
                  │   │
                  │   └── PianoKey (piano-style key rendering)
                  │       └── Visual piano keyboard representation
```

---

## 11. Current Keyboard Event Flow

```
User presses keyboard key
  ↓
┌─────────────────────────────────────────────────────┐
│ document.addEventListener("keydown", handleKeyDown) │
└─────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────┐
│ Keyboard.handleKeyDown(e)                           │
│ ┌─────────────────────────────────────────────────┐ │
│ │ if (e.code === "Digit1-9")                      │ │
│ │   → setState({ colorname: ... })                │ │
│ │                                                   │ │
│ │ if (e.code in keycodes) // FGH...               │ │
│ │   → noteOnHandler(note)                         │ │
│ │                                                   │ │
│ │ else if (e.code in keycodesLeftHand) // ZXCASDQWE │ │
│ │   → playNote(note)                              │ │
│ │                                                   │ │
│ │ if (e.code === "ArrowDown" || "ArrowUp")        │ │
│ │   → props.handleClickOctave(e.code)             │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
  ↓
[NEW] When piano keyboard container focused:
┌─────────────────────────────────────────────────────┐
│ Keyboard container onKeyDown                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ if (e.code === "ArrowRight")                    │ │
│ │   → navigateToKey(focusedKeyIndex + 1)          │ │
│ │                                                   │ │
│ │ if (e.code === "ArrowLeft")                     │ │
│ │   → navigateToKey(focusedKeyIndex - 1)          │ │
│ │                                                   │ │
│ │ if (e.code === "ArrowUp")                       │ │
│ │   → navigateToNextOctave()                      │ │
│ │                                                   │ │
│ │ if (e.code === "ArrowDown")                     │ │
│ │   → navigateToPreviousOctave()                  │ │
│ │                                                   │ │
│ │ if (e.code === "Home")                          │ │
│ │   → navigateToKey(0)                            │ │
│ │                                                   │ │
│ │ if (e.code === "End")                           │ │
│ │   → navigateToKey(totalKeys - 1)                │ │
│ │                                                   │ │
│ │ if (e.code === "Enter" || " ")                  │ │
│ │   → noteOnHandler(focusedNote)                  │ │
│ │   → [NEW] if (!toneIsInScale)                   │ │
│ │          playOutOfScaleCue(focusedNote)         │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
  ↓
User releases key
  ↓
┌─────────────────────────────────────────────────────┐
│ document.addEventListener("keyup", handleKeyUp)     │
│   → noteOffHandler(note) or releaseNote(note)      │
└─────────────────────────────────────────────────────┘
```

---

## 12. File Paths Summary

### Components
- **Keyboard (piano keyboard container)**: [src/components/keyboard/Keyboard.js](src/components/keyboard/Keyboard.js)
- **Key (individual piano key)**: [src/components/keyboard/Key.js](src/components/keyboard/Key.js)
- **ColorKey (colored portion)**: [src/components/keyboard/ColorKey.js](src/components/keyboard/ColorKey.js)
- **PianoKey (piano visual)**: [src/components/keyboard/PianoKey.js](src/components/keyboard/PianoKey.js)
- **QwertyKeyboard (computer keyboard layout)**: [src/components/keyboard/QwertyKeyboard.js](src/components/keyboard/QwertyKeyboard.js)

### Model/Services
- **MusicScale (scale logic)**: [src/Model/MusicScale.js](src/Model/MusicScale.js)
- **SoundMaker (audio engine)**: [src/Model/SoundMaker.js](src/Model/SoundMaker.js)
- **Tone.js Adapter**: [src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js](src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js)
- **SoundFont Adapter**: [src/Model/Adapters/Adapter_SoundFont_to_SoundMaker.js](src/Model/Adapters/Adapter_SoundFont_to_SoundMaker.js)

### Tests (Existing)
- **Keyboard navigation integration**: [src/__integration__/accessibility/keyboard-navigation.test.js](src/__integration__/accessibility/keyboard-navigation.test.js)
- **Focus visibility integration**: [src/__integration__/accessibility/focus-visibility.test.js](src/__integration__/accessibility/focus-visibility.test.js)
- **Menu arrow navigation** (reference): [src/__integration__/accessibility/menu-arrow-navigation.test.js](src/__integration__/accessibility/menu-arrow-navigation.test.js)
- **Keyboard workflow E2E**: [e2e/accessibility/keyboard-workflow.spec.js](e2e/accessibility/keyboard-workflow.spec.js)
- **Focus visibility E2E**: [e2e/accessibility/focus-visibility-e2e.spec.js](e2e/accessibility/focus-visibility-e2e.spec.js)
- **Screen reader E2E**: [e2e/accessibility/screen-reader-e2e.spec.js](e2e/accessibility/screen-reader-e2e.spec.js)

---

## 13. Key Technical Decisions

### Decision 1: Keyboard Event Scope

**Options**:
- **A**: Keep global `document` listeners (current)
- **B**: Move to container-scoped `onKeyDown` (new)
- **C**: Hybrid - navigation on container, shortcuts on document

**Recommendation**: **Option C (Hybrid)**
- Arrow keys, Home, End, Enter, Space → Container `onKeyDown`
- A-Z shortcuts, Digit1-9 → Global `document` listener
- **Rationale**: Shortcuts should work even when container not focused, navigation only when focused

### Decision 2: Key Component tabIndex

**Current**: `tabIndex={0}` (each key is focusable)
**Change to**: `tabIndex={-1}` (programmatically focusable only)
**Rationale**: Avoid 88 tab stops, follow WCAG best practices for roving tabIndex

### Decision 3: State Management (RESOLVED)

**User selected**: **Option B - State + Refs Hybrid**
```javascript
// State for tracking
this.state = { focusedKeyIndex: 0 };

// Refs for programmatic focus
this.keyRefs = [];

// Navigate method
navigateToKey = (newIndex) => {
  this.setState({ focusedKeyIndex: newIndex });
  this.keyRefs[newIndex]?.focus();
};
```

### Decision 4: Out-of-Scale Audio Feedback

**Recommendation**: **Muted tone (20% volume, 50ms duration)**
- Non-intrusive
- Clear feedback
- Easy to implement
- Can be customized later

**Implementation**:
```javascript
playOutOfScaleCue = (note) => {
  // Option: Modify existing playNote with different params
  this.state.synth.startSound(note, { volume: 0.2, duration: 50 });
};
```

---

## 14. Implementation Priorities

Based on research findings:

### High Priority (MVP - User Stories 1-3)
1. ✅ **Change Key tabIndex to -1** (1 line change)
2. ✅ **Add tabIndex={0} to Keyboard container** (1 line change)
3. ✅ **Add role="application" and aria-label** (2 lines)
4. ✅ **Add focusedKeyIndex state** (modify constructor)
5. ✅ **Implement navigateToKey method** (new method)
6. ✅ **Add Arrow Left/Right handlers** (modify handleKeyDown)
7. ✅ **Add Home/End handlers** (modify handleKeyDown)
8. ✅ **Pass isFocused prop to Keys** (modify render)
9. ✅ **Add keyRefs array** (new instance variable)
10. ✅ **Test with screen readers** (manual testing)

### Medium Priority (User Story 6 - P2)
11. ⚠️ **Implement playOutOfScaleCue** (new method in Keyboard + SoundMaker)
12. ⚠️ **Add out-of-scale audio to SoundMaker** (new adapter method)
13. ⚠️ **Test out-of-scale latency** (performance measurement)

### Lower Priority (User Story 4, 5 - P2, P3)
14. ✅ **Verify A-Z shortcuts still work** (testing)
15. ✅ **Test color parent sync** (ColorKey focus indicator)

### Performance & Testing
16. ⚠️ **Measure current latency baseline** (Performance API)
17. ⚠️ **Add latency regression tests** (automated)
18. ⚠️ **Write integration tests** (60-70% coverage)
19. ⚠️ **Write E2E tests** (20-30% coverage)
20. ⚠️ **Re-enable 8 skipped E2E tests** (verify they pass)

---

## 15. Performance Baseline (TO BE MEASURED)

**Status**: ⚠️ **NOT YET MEASURED**

### Measurement Plan

1. **Add instrumentation to Keyboard.js**:
   ```javascript
   measureLatency = () => {
     const measurements = [];

     // Instrument noteOnHandler
     const originalNoteOnHandler = this.noteOnHandler;
     this.noteOnHandler = (note) => {
       const t0 = performance.now();
       originalNoteOnHandler.call(this, note);
       const t1 = performance.now();
       measurements.push(t1 - t0);

       if (measurements.length >= 100) {
         const avg = measurements.reduce((a, b) => a + b) / measurements.length;
         console.log(`Latency baseline: ${avg}ms`);
       }
     };
   };
   ```

2. **Run in production build** (not dev mode)
3. **Test on target devices** (not just high-end developer machine)
4. **Record results** in this section

### Expected Results

**Target**: <20ms average latency (stretch goal: <10ms)
**Acceptable**: 10-30ms (within constitutional requirements)
**Unacceptable**: >30ms (performance degradation risk)

---

## 16. Next Steps

### Phase 1: Design & Contracts

Now that codebase is fully explored, proceed to:

1. **Create data-model.md**:
   - Document Focus State entity
   - Document Out-of-Scale Audio Cue entity
   - Document keyboard event contracts

2. **Create contracts/**:
   - Keyboard navigation events (ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Home, End)
   - Activation events (Enter, Space)
   - Out-of-scale audio playback API

3. **Create quickstart.md**:
   - Manual testing guide for keyboard navigation
   - Performance testing guide (latency measurement)
   - Screen reader testing checklist

4. **Update agent context**:
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Add patterns learned from piano keyboard implementation

### Phase 2: Task Generation

After Phase 1 design documents complete:
- Run `/speckit.tasks` to generate detailed task breakdown
- Use findings from this research.md to inform task descriptions

---

**Research Complete**: ✅ All 7 existing implementations located and documented
**Phase 0 Status**: COMPLETE
**Ready for Phase 1**: YES

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
