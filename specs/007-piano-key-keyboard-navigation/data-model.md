# Data Model: Piano Key Keyboard Navigation

**Feature**: 001-piano-key-keyboard-navigation
**Date**: 2025-01-16
**Status**: Phase 1 Design

---

## Overview

This document defines the data entities and their relationships for the piano key keyboard navigation feature. Based on Phase 0 research, most entities already exist - this feature primarily adds **Focus State** and **Out-of-Scale Audio Cue** entities.

---

## Entity Catalog

### 1. Focus State (NEW)

**Purpose**: Track which piano key currently has keyboard focus for arrow key navigation.

**Location**: `Keyboard` component state ([src/components/keyboard/Keyboard.js](src/components/keyboard/Keyboard.js))

**Type**: Component state (React)

**Schema**:
```typescript
interface FocusState {
  focusedKeyIndex: number;  // 0-based index (0-87 for 88 keys, or 0-12 for 13-key keyboard)
  isKeyboardActive: boolean; // Whether keyboard container has focus
}
```

**Properties**:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `focusedKeyIndex` | `number` | Yes | `0` | Index of currently focused key (0 = first key, typically A0 or C4 depending on keyboard mode) |
| `isKeyboardActive` | `boolean` | No | `false` | Whether piano keyboard container has focus (optional - can derive from document.activeElement) |

**Validation Rules**:
- `focusedKeyIndex` must be >= 0
- `focusedKeyIndex` must be < total key count (13 for standard, 24 for extended)
- `focusedKeyIndex` wraps circularly for Arrow Left/Right (last → first, first → last)
- `focusedKeyIndex` stays in bounds for Arrow Up/Down (no wrap at octave boundaries)

**State Transitions**:
```
Initial State:
  focusedKeyIndex: 0 (first key)
  isKeyboardActive: false

User Tabs to Keyboard Container:
  focusedKeyIndex: 0 (unchanged)
  isKeyboardActive: true

User Presses Arrow Right:
  focusedKeyIndex: (focusedKeyIndex + 1) % totalKeys
  isKeyboardActive: true

User Presses Arrow Left:
  focusedKeyIndex: (focusedKeyIndex - 1 + totalKeys) % totalKeys
  isKeyboardActive: true

User Presses Arrow Up:
  focusedKeyIndex: calculateNextOctaveIndex(focusedKeyIndex)
  // If next octave out of bounds, stay on current key

User Presses Arrow Down:
  focusedKeyIndex: calculatePreviousOctaveIndex(focusedKeyIndex)
  // If previous octave out of bounds, stay on current key

User Presses Home:
  focusedKeyIndex: 0
  isKeyboardActive: true

User Presses End:
  focusedKeyIndex: totalKeys - 1
  isKeyboardActive: true

User Tabs Away:
  focusedKeyIndex: (preserved)
  isKeyboardActive: false
```

**Implementation Example**:
```javascript
class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Existing state...
      activeNotes: new Set(),
      mouse_is_down: false,
      colorname: "standard",
      synth: new SoundMaker({...}),

      // NEW: Focus state
      focusedKeyIndex: 0,
    };

    // NEW: Refs for programmatic focus
    this.keyRefs = [];
  }

  navigateToKey = (newIndex) => {
    const totalKeys = this.props.extendedKeyboard ? 24 : 13;
    const clampedIndex = Math.max(0, Math.min(newIndex, totalKeys - 1));

    this.setState({ focusedKeyIndex: clampedIndex });
    this.keyRefs[clampedIndex]?.focus();
  };
}
```

---

### 2. Out-of-Scale Audio Cue (NEW)

**Purpose**: Provide auditory feedback when user activates a piano key that is NOT in the currently selected scale.

**Location**:
- Trigger logic: `Key` component ([src/components/keyboard/Key.js](src/components/keyboard/Key.js))
- Playback: `SoundMaker` ([src/Model/SoundMaker.js](src/Model/SoundMaker.js))

**Type**: Transient audio event (no persistent state)

**Schema**:
```typescript
interface OutOfScaleAudioCue {
  note: string;           // Note that was activated (e.g., "F#4")
  cueType: 'muted_tone' | 'click' | 'dissonant_chord';
  volume: number;         // Volume (0.0 - 1.0)
  duration: number;       // Duration in milliseconds
  latency: number;        // Target latency in milliseconds (<20ms)
}
```

**Properties**:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `note` | `string` | Yes | N/A | MIDI note name (e.g., "C4", "F#5") |
| `cueType` | `'muted_tone' \| 'click' \| 'dissonant_chord'` | Yes | `'muted_tone'` | Type of audio feedback |
| `volume` | `number` | Yes | `0.2` | Volume level (20% of normal note) |
| `duration` | `number` | Yes | `50` | Duration in milliseconds (shorter than normal notes) |
| `latency` | `number` | No | `<20` | Target playback latency (performance requirement) |

**Validation Rules**:
- `note` must be valid MIDI note name format (e.g., "C4", "F#5", "Bb3")
- `volume` must be between 0.0 and 1.0
- `duration` must be > 0 and <= 200ms (to keep cue brief)
- `latency` target is <20ms (performance requirement from NFR-001)

**Design Options**:

| Option | Description | Pros | Cons | Recommendation |
|--------|-------------|------|------|----------------|
| **Muted Tone** | Play the note at 20% volume for 50ms | Musical context preserved, non-intrusive | May be confused with volume issue | ✅ **Recommended** for MVP |
| **Click/Beep** | Short 1000Hz sine wave (20ms) | Clearly different from notes | Breaks musical flow, jarring | Consider for alternative mode |
| **Dissonant Chord** | Play note + tritone (100ms) | Musical but clearly "wrong", educational | More complex, may be too intrusive | Consider for future enhancement |

**Implementation Example**:
```javascript
// In Key.js handleKeyDown
handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();

    if (this.props.toneIsInScale) {
      // Normal note playback
      this.props.noteOnHandler(this.props.note);
      setTimeout(() => {
        this.props.noteOffHandler(this.props.note);
      }, 200);
    } else {
      // NEW: Out-of-scale audio cue
      this.props.playOutOfScaleCue({
        note: this.props.note,
        cueType: 'muted_tone',
        volume: 0.2,
        duration: 50,
      });
    }
  }
};

// In Keyboard.js
playOutOfScaleCue = (cueConfig) => {
  this.state.synth.playOutOfScaleCue(cueConfig);
};

// In SoundMaker.js
playOutOfScaleCue(cueConfig) {
  this.soundMakerAdapter.playOutOfScaleCue(cueConfig);
}

// In Adapter_Tonejs_to_SoundMaker.js
playOutOfScaleCue(cueConfig) {
  const { note, volume, duration } = cueConfig;

  // Play muted tone
  this.piano.keyDown(note, { volume });
  setTimeout(() => {
    this.piano.keyUp(note);
  }, duration);
}
```

**Performance Requirements**:
- Latency must be <20ms (same as normal note playback - NFR-001)
- No performance degradation from master branch (NFR-002)

---

### 3. Piano Key (EXISTING - Enhanced)

**Purpose**: Individual piano key component (already exists, needs minor enhancement for focus management).

**Location**: `Key` component ([src/components/keyboard/Key.js](src/components/keyboard/Key.js))

**Type**: React class component

**Current Schema**:
```typescript
interface KeyProps {
  note: string;              // MIDI note name (e.g., "C4")
  noteName: array;           // Display names in different notations
  color: string;             // Key color from scale
  keyColor: string;          // Piano key color ("white" or "black")
  toneIsInScale: boolean;    // ✅ Already exists! Used for out-of-scale detection
  isActive: boolean;         // Whether note is currently playing
  isMouseDown: boolean;      // Mouse state for drag-to-play
  noteOnHandler: function;   // Callback to play note
  noteOffHandler: function;  // Callback to stop note
  // ... other existing props
}
```

**Enhanced Schema** (NEW properties):
```typescript
interface KeyPropsEnhanced extends KeyProps {
  isFocused: boolean;        // NEW: Whether this key has keyboard focus
  ref: React.RefObject;      // NEW: Ref for programmatic focus
  tabIndex: number;          // CHANGE: -1 (was 0, needs update)
  playOutOfScaleCue: function; // NEW: Callback to play out-of-scale cue
}
```

**Changes Required**:

| Property | Current | New | Reason |
|----------|---------|-----|--------|
| `tabIndex` | `0` | `-1` | Only programmatically focusable (roving tabIndex pattern) |
| `isFocused` | N/A | `boolean` | Track which key has focus (for visual indicator) |
| `ref` | N/A | `React.RefObject` | Enable programmatic focus via `keyRefs[index].focus()` |
| `playOutOfScaleCue` | N/A | `function` | Callback to play out-of-scale audio feedback |

**Visual Focus Indicator**:
```javascript
// In Key.js render
<div
  className={`Key ${keyColor} ${toneIsInScale ? "on" : "off"} ${isFocused ? "focused" : ""}`}
  data-testid="test-key"
  data-note={note}
  onKeyDown={this.handleKeyDown}
  tabIndex={-1}  // ✅ CHANGED from 0
  role="button"
  aria-label={`Play ${note}`}
>
  <ColorKey
    // ... existing props
    isFocused={isFocused}  // NEW: Pass focus state to ColorKey for visual indicator
  />
  {/* ... existing children */}
</div>
```

---

### 4. Scale State (EXISTING - No changes)

**Purpose**: Current selected scale (e.g., C Major, D Minor) used for determining which notes are in scale.

**Location**: `MusicScale` class ([src/Model/MusicScale.js](src/Model/MusicScale.js))

**Type**: Class instance (module-level variable `activeScale` in Keyboard.js)

**Schema**:
```typescript
class MusicScale {
  Name: string;                    // Scale name (e.g., "Major", "Minor")
  RootNoteName: string;            // Root note (e.g., "C", "D#")
  SemitoneSteps: number[];         // Scale intervals (e.g., [0, 2, 4, 5, 7, 9, 11] for Major)
  ExtendedScaleTones: array;       // All tones in keyboard range
  MidiNoteNr: number[];            // MIDI note numbers for scale tones
  BasisScale: array;               // One octave of the scale
  AmbitusInSemiNotes: number;      // Keyboard range in semitones (13 or 24)
  Colors: string[];                // Color mapping for each tone
}
```

**Usage for Out-of-Scale Detection**:
```javascript
// In Keyboard.js render (already exists!)
let toneindex = currentScale.MidiNoteNr.indexOf(keyboardLayoutScale.MidiNoteNr[index]);
if (toneindex !== -1) {
  toneIsInScale = true;  // ✅ Note is in scale
}

// This toneIsInScale prop is passed to Key component
<Key
  // ... other props
  toneIsInScale={toneIsInScale}  // ✅ Already passed!
/>
```

**No changes required** - existing scale detection already provides `toneIsInScale` prop to every Key component!

---

### 5. Active Notes (EXISTING - No changes)

**Purpose**: Track which notes are currently playing (for visual feedback and polyphony management).

**Location**: `Keyboard` component state

**Type**: `Set<string>` (JavaScript Set of MIDI note names)

**Schema**:
```typescript
interface ActiveNotesState {
  activeNotes: Set<string>;  // Set of currently playing notes (e.g., new Set(["C4", "E4", "G4"]))
}
```

**Usage**:
```javascript
// In Keyboard.js
this.state = {
  activeNotes: new Set(),  // Initially empty
};

// When note starts
noteOnHandler = (note) => {
  const { activeNotes } = this.state;
  if (!activeNotes.has(note)) {
    this.playNote(note);
    let newActiveNotes = new Set(activeNotes);
    newActiveNotes.add(note);
    this.setState({ activeNotes: newActiveNotes });
  }
};

// When note stops
noteOffHandler = (note) => {
  const { activeNotes } = this.state;
  if (activeNotes.has(note)) {
    this.releaseNote(note);
    let newActiveNotes = new Set(activeNotes);
    newActiveNotes.delete(note);
    this.setState({ activeNotes: newActiveNotes });
  }
};
```

**No changes required** - existing system already handles note state correctly.

---

### 6. Colorblind Mode State (EXISTING - No changes)

**Purpose**: Track which colorblind mode is active (standard, protanopia, deuteranopia, etc.).

**Location**: `Keyboard` component state

**Type**: String (one of predefined color modes)

**Schema**:
```typescript
type ColorMode =
  | 'standard'
  | 'colorBlindProtanopia'
  | 'colorBlindDeuteranopia'
  | 'colorBlindTritanopia'
  | 'greenis'
  | 'bright'
  | 'other'
  | 'colorBlind2'
  | 'pastel';

interface ColorModeState {
  colorname: ColorMode;  // Currently active color mode
}
```

**Usage**:
```javascript
// In Keyboard.js handleKeyDown (already exists!)
if (e.code === "Digit1") {
  this.setState({ colorname: "standard" });
}
if (e.code === "Digit2") {
  this.setState({ colorname: "colorBlindProtanopia" });
}
// ... Digit3-9 for other modes

// Used in scale creation
const currentScale = new MusicScale(
  scaleReciepe,
  baseNote,
  scaleStart,
  ambitus,
  colors[this.state.colorname]  // ✅ Color mode applied to scale
);
```

**No changes required** - existing colorblind mode system already works with keyboard navigation.

---

## Entity Relationships

```
┌─────────────────────────────────────────┐
│ Keyboard Component (Container)          │
│                                          │
│ State:                                   │
│ ┌────────────────────────────────────┐  │
│ │ focusedKeyIndex: number (NEW)      │  │
│ │ activeNotes: Set<string>           │  │
│ │ colorname: string                  │  │
│ │ synth: SoundMaker                  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Refs:                                    │
│ ┌────────────────────────────────────┐  │
│ │ keyRefs: array (NEW)               │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Methods:                                 │
│ ┌────────────────────────────────────┐  │
│ │ navigateToKey(index) (NEW)         │  │
│ │ playOutOfScaleCue(config) (NEW)    │  │
│ │ noteOnHandler(note)                │  │
│ │ noteOffHandler(note)               │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
                   │
                   │ renders (13 or 24 times)
                   ↓
┌─────────────────────────────────────────┐
│ Key Component (Individual Piano Key)    │
│                                          │
│ Props:                                   │
│ ┌────────────────────────────────────┐  │
│ │ note: string                       │  │
│ │ toneIsInScale: boolean ✅          │  │
│ │ isFocused: boolean (NEW)           │  │
│ │ noteOnHandler: function            │  │
│ │ noteOffHandler: function           │  │
│ │ playOutOfScaleCue: function (NEW)  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Attrs:                                   │
│ ┌────────────────────────────────────┐  │
│ │ tabIndex={-1} (CHANGED from 0)     │  │
│ │ role="button"                      │  │
│ │ aria-label="Play ${note}"          │  │
│ │ ref={keyRefs[index]} (NEW)         │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Event Handlers:                          │
│ ┌────────────────────────────────────┐  │
│ │ onKeyDown:                         │  │
│ │   if (Enter/Space && toneIsInScale)│  │
│ │     → noteOnHandler(note)          │  │
│ │   else if (Enter/Space)            │  │
│ │     → playOutOfScaleCue({...})     │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Children:                                │
│ ┌────────────────────────────────────┐  │
│ │ ColorKey (visual + focus indicator)│  │
│ │ PianoKey (piano keyboard visual)   │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
                   │
                   │ uses
                   ↓
┌─────────────────────────────────────────┐
│ MusicScale (Scale State) ✅             │
│                                          │
│ Properties:                              │
│ ┌────────────────────────────────────┐  │
│ │ Name: string                       │  │
│ │ RootNoteName: string               │  │
│ │ SemitoneSteps: number[]            │  │
│ │ MidiNoteNr: number[]               │  │
│ │ ExtendedScaleTones: array          │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Used for:                                │
│ ┌────────────────────────────────────┐  │
│ │ Determining toneIsInScale          │  │
│ │ Color mapping                      │  │
│ │ Note naming                        │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SoundMaker (Audio Engine) ✅            │
│                                          │
│ Adapters:                                │
│ ┌────────────────────────────────────┐  │
│ │ Tone.js Adapter (active)           │  │
│ │ SoundFont Adapter                  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Methods:                                 │
│ ┌────────────────────────────────────┐  │
│ │ startSound(note)                   │  │
│ │ stopSound(note)                    │  │
│ │ playOutOfScaleCue(config) (NEW)    │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Uses:                                    │
│ ┌────────────────────────────────────┐  │
│ │ Web Audio API (Tone.js)            │  │
│ │ @tonejs/piano library              │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Arrow Key Navigation Flow (NEW)

```
User presses Arrow Right
  ↓
Keyboard container onKeyDown event
  ↓
handleContainerKeyDown(e)
  ↓
navigateToKey(focusedKeyIndex + 1)
  ↓
┌─────────────────────────────────────┐
│ setState({ focusedKeyIndex: newIndex })
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ keyRefs[newIndex].focus()
└─────────────────────────────────────┘
  ↓
React re-renders Key components
  ↓
Key[oldIndex] receives isFocused={false}
Key[newIndex] receives isFocused={true}
  ↓
ColorKey shows focus indicator
Browser shows focus outline on focused Key
```

### 2. Note Activation Flow (EXISTING - Enhanced)

```
User presses Enter/Space on focused Key
  ↓
Key.handleKeyDown(event)
  ↓
Check: toneIsInScale?
  ↓
┌──────────────┴──────────────┐
│ YES (in scale)              │ NO (out of scale)
↓                             ↓
noteOnHandler(note)           playOutOfScaleCue({
  ↓                             note,
Keyboard.noteOnHandler          cueType: 'muted_tone',
  ↓                             volume: 0.2,
playNote(note)                  duration: 50
  ↓                           })
synth.startSound(note)          ↓
  ↓                           Keyboard.playOutOfScaleCue
Web Audio API                   ↓
  ↓                           synth.playOutOfScaleCue
Audio Output (normal)           ↓
  ↓                           Web Audio API
setTimeout(() => {              ↓
  noteOffHandler(note)        Audio Output (muted)
}, 200ms)                       ↓
                              setTimeout(() => {
                                synth.stopSound(note)
                              }, 50ms)
```

### 3. Focus State Synchronization (Color Parent)

```
Keyboard.focusedKeyIndex changes
  ↓
React re-renders all Key components
  ↓
Each Key receives isFocused prop
  ↓
Key[focusedKeyIndex].props.isFocused = true
All other Keys.props.isFocused = false
  ↓
ColorKey receives isFocused prop from parent Key
  ↓
ColorKey renders focus indicator:
  className={`ColorKey ${isFocused ? 'focused' : ''}`}
  ↓
CSS applies focus styles (visual indicator)
```

---

## Performance Considerations

### Focus State Updates

**Re-render cost**: Arrow key navigation triggers re-render of all Key components
- **Estimated cost**: 1-5ms per navigation
- **Target**: <50ms navigation response time (NFR-003)
- **Acceptable**: Re-renders are necessary for visual feedback

**Optimization if needed**:
```javascript
// Memoize Key components
const MemoizedKey = React.memo(Key, (prevProps, nextProps) => {
  return (
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.note === nextProps.note &&
    prevProps.isActive === nextProps.isActive
  );
});
```

### Out-of-Scale Audio Cue Latency

**Requirement**: <20ms keypress-to-sound latency (same as normal notes - NFR-001)

**Implementation strategy**:
1. Reuse existing audio pipeline (SoundMaker → adapter → Tone.js)
2. No additional audio context creation
3. Same scheduling mechanism as normal notes
4. Shorter duration (50ms vs 200ms) reduces memory/CPU load

**Expected latency**: Same as normal note playback (currently unknown - needs measurement)

---

## Migration Strategy

### From Current State to Enhanced State

**No data migration needed** - this is a new feature enhancing existing components.

**Changes are backward-compatible**:
- Existing Key components work with `tabIndex={-1}` change
- New props (`isFocused`, `playOutOfScaleCue`) are optional initially
- Focus state defaults to index 0 (first key)
- Out-of-scale cue is only triggered when explicitly called

**Rollback strategy**:
- Change `tabIndex` back to `0` on Key components
- Remove `focusedKeyIndex` state from Keyboard
- Remove `isFocused` prop passing
- Remove `playOutOfScaleCue` method
- Existing keyboard shortcuts and mouse interaction continue to work

---

## Testing Data

### Focus State Test Scenarios

```javascript
// Scenario 1: Arrow Right navigation
const initialState = { focusedKeyIndex: 0 };
// User presses Arrow Right
const expectedState = { focusedKeyIndex: 1 };

// Scenario 2: Circular wrapping (last to first)
const initialState = { focusedKeyIndex: 12 }; // Last key (13-key keyboard)
// User presses Arrow Right
const expectedState = { focusedKeyIndex: 0 }; // Wraps to first

// Scenario 3: Home key
const initialState = { focusedKeyIndex: 5 };
// User presses Home
const expectedState = { focusedKeyIndex: 0 };

// Scenario 4: End key
const initialState = { focusedKeyIndex: 0 };
// User presses End
const expectedState = { focusedKeyIndex: 12 }; // Last key (13-key keyboard)
```

### Out-of-Scale Cue Test Data

```javascript
// Scenario 1: C Major scale, F# is out of scale
const scale = { name: 'Major', root: 'C', steps: [0, 2, 4, 5, 7, 9, 11] };
const note = 'F#4';
const expectedCue = {
  note: 'F#4',
  cueType: 'muted_tone',
  volume: 0.2,
  duration: 50,
};

// Scenario 2: C Major scale, C is in scale (no cue)
const scale = { name: 'Major', root: 'C', steps: [0, 2, 4, 5, 7, 9, 11] };
const note = 'C4';
const expectedCue = null; // No out-of-scale cue

// Scenario 3: Chromatic scale, all notes in scale (no cue ever)
const scale = { name: 'Chromatic', root: 'C', steps: [0,1,2,3,4,5,6,7,8,9,10,11] };
const anyNote = 'F#4';
const expectedCue = null; // No out-of-scale cue
```

---

## Summary

### New Entities
1. **Focus State** - Tracks focused key index (Keyboard component state)
2. **Out-of-Scale Audio Cue** - Audio feedback for wrong notes (transient event)

### Enhanced Entities
3. **Piano Key** - Added `isFocused` prop, changed `tabIndex` to -1, added `playOutOfScaleCue` callback

### Unchanged Entities (Already Work)
4. **Scale State** - Already provides `toneIsInScale` detection
5. **Active Notes** - Already tracks playing notes
6. **Colorblind Mode State** - Already handles color mode switching

### Performance Targets
- Focus navigation: <50ms response time
- Out-of-scale cue: <20ms latency (same as normal notes)
- No performance degradation from master branch

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
