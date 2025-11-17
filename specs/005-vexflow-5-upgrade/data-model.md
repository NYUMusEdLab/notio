# Data Model: VexFlow API Object Mapping

**Feature**: VexFlow 5.x Library Upgrade
**Date**: 2025-11-17
**Purpose**: Document all VexFlow API objects, their migration from 4.x to 5.x, and usage patterns in Notio

---

## Overview

This document maps the VexFlow 4.0.3 APIs currently used in Notio to their VexFlow 5.0.0 equivalents. The primary change is namespace restructuring (`Vex.Flow` → `VexFlow`), with all core API methods remaining functionally identical.

---

## Import Statement

### VexFlow 4.0.3 (Current)
```javascript
import Vex from "vexflow";

// Access APIs via Vex.Flow namespace
const { Renderer, Stave } = Vex.Flow;
```

### VexFlow 5.0.0 (New)
```javascript
import * as VexFlow from "vexflow";

// Access APIs directly from VexFlow namespace
const { Renderer, Stave } = VexFlow;
```

**Migration**: Change import statement and all `Vex.Flow` references to `VexFlow`

---

## API Object Mapping

### 1. Renderer

**Purpose**: Creates and manages the SVG rendering context for musical notation

#### VexFlow 4.0.3
```javascript
import Vex from "vexflow";

const { Renderer } = Vex.Flow;
const renderer = new Renderer(
  containerElement,
  Vex.Flow.Renderer.Backends.SVG
);
const context = renderer.getContext();
```

#### VexFlow 5.0.0
```javascript
import * as VexFlow from "vexflow";

const { Renderer } = VexFlow;
const renderer = new Renderer(
  containerElement,
  VexFlow.Renderer.Backends.SVG
);
const context = renderer.getContext();
```

**Changes**:
- Namespace: `Vex.Flow.Renderer` → `VexFlow.Renderer`
- Backend enum: `Vex.Flow.Renderer.Backends.SVG` → `VexFlow.Renderer.Backends.SVG`

**Methods Used in Notio**:
- `new Renderer(element, backend)` - Constructor
- `renderer.getContext()` - Get rendering context

**Status**: ✅ Compatible (namespace change only)

---

### 2. Stave

**Purpose**: Represents a musical staff with five lines, clefs, time signatures, and key signatures

#### VexFlow 4.0.3
```javascript
const { Stave } = Vex.Flow;

const stave = new Stave(x, y, width, { fill_style: "black" });
stave.setBegBarType(Vex.Flow.Barline.type.NONE);
stave.setContext(context).draw();
```

#### VexFlow 5.0.0
```javascript
const { Stave } = VexFlow;

const stave = new Stave(x, y, width, { fill_style: "black" });
stave.setBegBarType(VexFlow.Barline.type.NONE);
stave.setContext(context).draw();
```

**Changes**:
- Namespace: `Vex.Flow.Stave` → `VexFlow.Stave`
- Barline enum: `Vex.Flow.Barline.type.NONE` → `VexFlow.Barline.type.NONE`

**Methods Used in Notio**:
- `new Stave(x, y, width, options)` - Constructor
- `stave.setBegBarType(type)` - Set beginning barline type
- `stave.setContext(context)` - Set rendering context
- `stave.draw()` - Render the staff

**Properties Used**:
- `fill_style`: Staff line color (default: "black")

**Status**: ✅ Compatible (namespace change only)

---

### 3. StaveNote

**Purpose**: Represents an individual musical note on a staff

#### VexFlow 4.0.3
```javascript
const { StaveNote } = Vex.Flow;

const note = new StaveNote({
  keys: ["C/4"],
  duration: "w",
  clef: "treble"
});
```

#### VexFlow 5.0.0
```javascript
const { StaveNote } = VexFlow;

const note = new StaveNote({
  keys: ["C/4"],
  duration: "w",
  clef: "treble"
});
```

**Changes**:
- Namespace: `Vex.Flow.StaveNote` → `VexFlow.StaveNote`

**Methods Used in Notio**:
- `new StaveNote(noteSpec)` - Constructor
- `note.addModifier(modifier, index)` - Add accidental/modifier

**NoteSpec Properties Used**:
- `keys: string[]` - Note pitches (e.g., ["Gb/5", "C/4"])
- `duration: string` - Note duration ("w" = whole note)
- `clef: string` - Clef type ("treble", "bass", "tenor", "alto")

**Status**: ✅ Compatible (namespace change only)

---

### 4. Accidental

**Purpose**: Represents musical accidentals (sharp, flat, natural, double-sharp, double-flat)

#### VexFlow 4.0.3
```javascript
const { Accidental } = Vex.Flow;

// Add sharp
note.addModifier(new Accidental("#"), 0);

// Add flat
note.addModifier(new Accidental("b"), 0);

// Add double-flat
note.addModifier(new Accidental("bb"), 0);

// Add double-sharp
note.addModifier(new Accidental("##"), 0);
```

#### VexFlow 5.0.0
```javascript
const { Accidental } = VexFlow;

// Add sharp
note.addModifier(new Accidental("#"), 0);

// Add flat
note.addModifier(new Accidental("b"), 0);

// Add double-flat
note.addModifier(new Accidental("bb"), 0);

// Add double-sharp
note.addModifier(new Accidental("##"), 0);
```

**Changes**:
- Namespace: `Vex.Flow.Accidental` → `VexFlow.Accidental`

**Accidental Types Used in Notio**:
- `"#"` - Sharp
- `"b"` - Flat
- `"##"` - Double-sharp
- `"bb"` - Double-flat

**Methods Used**:
- `new Accidental(type)` - Constructor

**Status**: ✅ Compatible (namespace change only)

---

### 5. Voice

**Purpose**: Container for notes that manages timing and beats

#### VexFlow 4.0.3
```javascript
const { Voice } = Vex.Flow;

const voice = new Voice({
  num_beats: 1,
  beat_value: 1
});
voice.addTickables(noteArray);
```

#### VexFlow 5.0.0
```javascript
const { Voice } = VexFlow;

const voice = new Voice({
  num_beats: 1,
  beat_value: 1
});
voice.addTickables(noteArray);
```

**Changes**:
- Namespace: `Vex.Flow.Voice` → `VexFlow.Voice`

**Methods Used in Notio**:
- `new Voice(options)` - Constructor
- `voice.addTickables(notes)` - Add notes to voice
- `voice.draw(context, stave)` - Render voice on stave

**Options Used**:
- `num_beats: number` - Number of beats in the voice
- `beat_value: number` - Beat value (1 = quarter note)

**Status**: ✅ Compatible (namespace change only)

---

### 6. Formatter

**Purpose**: Handles automatic spacing and alignment of notes on a staff

#### VexFlow 4.0.3
```javascript
const { Formatter } = Vex.Flow;

new Formatter()
  .joinVoices([voice])
  .format([voice], availableWidth);
```

#### VexFlow 5.0.0
```javascript
const { Formatter } = VexFlow;

new Formatter()
  .joinVoices([voice])
  .format([voice], availableWidth);
```

**Changes**:
- Namespace: `Vex.Flow.Formatter` → `VexFlow.Formatter`

**Methods Used in Notio**:
- `new Formatter()` - Constructor
- `formatter.joinVoices(voices)` - Join multiple voices
- `formatter.format(voices, width)` - Format and space notes

**Status**: ✅ Compatible (namespace change only)

---

## Rendering Context

### RenderContext (from Renderer.getContext())

**Purpose**: SVG rendering context for drawing operations

#### VexFlow 4.0.3
```javascript
const context = renderer.getContext();
context.setViewBox(x, y, width, height);
```

#### VexFlow 5.0.0
```javascript
const context = renderer.getContext();
context.setViewBox(x, y, width, height);
```

**Changes**: None (namespace change in Renderer only)

**Methods Used in Notio**:
- `context.setViewBox(x, y, width, height)` - Set SVG viewBox

**Status**: ✅ Compatible (no changes)

---

## Enumerations & Constants

### Renderer.Backends

**Purpose**: Rendering backend options

#### VexFlow 4.0.3
```javascript
Vex.Flow.Renderer.Backends.SVG
Vex.Flow.Renderer.Backends.CANVAS
```

#### VexFlow 5.0.0
```javascript
VexFlow.Renderer.Backends.SVG
VexFlow.Renderer.Backends.CANVAS
```

**Used in Notio**: `SVG` backend only

**Status**: ✅ Compatible (namespace change only)

---

### Barline.type

**Purpose**: Barline type options for staves

#### VexFlow 4.0.3
```javascript
Vex.Flow.Barline.type.NONE
Vex.Flow.Barline.type.SINGLE
Vex.Flow.Barline.type.DOUBLE
Vex.Flow.Barline.type.END
// ... other types
```

#### VexFlow 5.0.0
```javascript
VexFlow.Barline.type.NONE
VexFlow.Barline.type.SINGLE
VexFlow.Barline.type.DOUBLE
VexFlow.Barline.type.END
// ... other types
```

**Used in Notio**: `NONE` type only (hides barlines)

**Status**: ✅ Compatible (namespace change only)

---

## Font System (New in 5.x)

**VexFlow 5.x Font Loading**: Automatic via FontFace API

```javascript
// No explicit font loading needed - VexFlow 5.x handles automatically
import * as VexFlow from "vexflow"; // Includes Bravura font

// Font is loaded and ready when VexFlow APIs are called
```

**Notio Impact**: None - automatic font loading is transparent

**Status**: ✅ No changes required

---

## Migration Checklist

| API Object | 4.x Namespace | 5.x Namespace | Methods Changed? | Status |
|------------|---------------|---------------|------------------|--------|
| Renderer | `Vex.Flow.Renderer` | `VexFlow.Renderer` | No | ✅ Namespace only |
| Stave | `Vex.Flow.Stave` | `VexFlow.Stave` | No | ✅ Namespace only |
| StaveNote | `Vex.Flow.StaveNote` | `VexFlow.StaveNote` | No | ✅ Namespace only |
| Accidental | `Vex.Flow.Accidental` | `VexFlow.Accidental` | No | ✅ Namespace only |
| Voice | `Vex.Flow.Voice` | `VexFlow.Voice` | No | ✅ Namespace only |
| Formatter | `Vex.Flow.Formatter` | `VexFlow.Formatter` | No | ✅ Namespace only |
| Renderer.Backends | `Vex.Flow.Renderer.Backends` | `VexFlow.Renderer.Backends` | No | ✅ Namespace only |
| Barline.type | `Vex.Flow.Barline.type` | `VexFlow.Barline.type` | No | ✅ Namespace only |

---

## Code Locations in Notio

### Primary File: src/components/musicScore/MusicalStaff.js

**Line 2** - Import statement:
```javascript
// OLD: import Vex from "vexflow";
// NEW: import * as VexFlow from "vexflow";
```

**Line 23** - Renderer & Stave destructuring:
```javascript
// OLD: const { Renderer, Stave } = Vex.Flow;
// NEW: const { Renderer, Stave } = VexFlow;
```

**Line 26** - Renderer instantiation:
```javascript
// OLD: new Renderer(containerSVG, Vex.Flow.Renderer.Backends.SVG);
// NEW: new Renderer(containerSVG, VexFlow.Renderer.Backends.SVG);
```

**Line 34** - Barline type:
```javascript
// OLD: stave.setBegBarType(Vex.Flow.Barline.type.NONE);
// NEW: stave.setBegBarType(VexFlow.Barline.type.NONE);
```

**Line 39** - Note components destructuring:
```javascript
// OLD: const { Accidental, StaveNote, Voice, Formatter } = Vex.Flow;
// NEW: const { Accidental, StaveNote, Voice, Formatter } = VexFlow;
```

---

## Test File Updates

### Integration Test Files (9 files)

All files using VexFlow mocks or spies will need namespace updates:

```javascript
// Example test file pattern (if mocking VexFlow):
// OLD: jest.mock('vexflow', () => ({ Flow: { Renderer: jest.fn() } }));
// NEW: jest.mock('vexflow', () => ({ Renderer: jest.fn() }));
```

**Test Files to Review**:
- `src/__integration__/musical-components/scale-visualization.test.js`
- `src/__integration__/musical-components/keyboard-interaction.test.js`
- `src/__integration__/musical-components/menu-staff-integration.test.js`
- `src/__integration__/musical-components/notation-audio-sync.test.js`
- `src/__integration__/user-workflows/create-exercise.test.js`
- `src/__integration__/state-management/state-flow.test.js`
- `src/__integration__/error-handling/invalid-input.test.js`
- `src/__integration__/error-handling/network-errors.test.js`

**Action**: Run tests after MusicalStaff.js update to detect any mock/spy issues

---

## jest.config.js Updates

### VexFlow Transform Pattern

**Line 32-33** - Transform ignore patterns:

```javascript
// Current configuration already handles vexflow correctly
transformIgnorePatterns: [
  "node_modules/(?!(vexflow|@tonejs/piano|gsap)/)"
]
```

**Status**: ✅ No changes needed - pattern is version-agnostic

---

## Summary

**Total API Objects**: 8
**Breaking Changes**: 0 (namespace change only)
**Method Signature Changes**: 0
**Deprecated APIs Used**: 0

**Migration Complexity**: LOW
- Simple find-and-replace operation
- No architectural changes
- No new APIs to learn
- All existing logic remains valid

**Validation**:
- ✅ All APIs used by Notio are stable in VexFlow 5.x
- ✅ No deprecated APIs in current codebase
- ✅ Font system is transparent (automatic loading)
- ✅ SVG rendering behavior unchanged (API-level)

---

**Next**: Create API contracts in `contracts/` directory
