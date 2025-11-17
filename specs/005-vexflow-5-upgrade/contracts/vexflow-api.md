# API Contract: VexFlow 5.x Usage in Notio

**Feature**: VexFlow 5.x Library Upgrade
**Date**: 2025-11-17
**Purpose**: Define the contract for how Notio interacts with VexFlow 5.x APIs

---

## Contract Overview

This document defines the contract between Notio's MusicalStaff component and the VexFlow 5.x library. It specifies:
- Required VexFlow APIs and their signatures
- Expected inputs and outputs
- Error handling requirements
- Performance guarantees
- Browser compatibility requirements

---

## 1. Renderer Contract

### Purpose
Create and manage SVG rendering context for musical notation

### API Signature

```typescript
class Renderer {
  constructor(
    element: HTMLElement,
    backend: Renderer.Backends
  );

  getContext(): RenderContext;
}

namespace Renderer.Backends {
  const SVG: number;
  const CANVAS: number;
}
```

### Notio Usage

```javascript
import * as VexFlow from "vexflow";

const { Renderer } = VexFlow;
const containerElement = document.getElementById("musical-staff");

const renderer = new Renderer(
  containerElement,
  VexFlow.Renderer.Backends.SVG
);

const context = renderer.getContext();
```

### Contract Requirements

**Inputs**:
- `element`: Valid HTML DOM element (not null, must be in document)
- `backend`: Must be `VexFlow.Renderer.Backends.SVG` (Notio uses SVG only)

**Outputs**:
- Returns `Renderer` instance
- `getContext()` returns valid `RenderContext` object

**Guarantees**:
- Renderer creates SVG element as child of `element`
- SVG element is immediately available after construction
- Context is ready for drawing operations

**Error Handling**:
- Throws if `element` is null or invalid
- Throws if `backend` is unsupported

**Performance**:
- Construction must complete in < 10ms
- No network requests or font loading during construction

---

## 2. RenderContext Contract

### Purpose
Provide SVG rendering operations for VexFlow drawing commands

### API Signature

```typescript
interface RenderContext {
  setViewBox(
    x: number,
    y: number,
    width: number,
    height: number
  ): void;

  // Additional methods used internally by VexFlow
  // (Notio only calls setViewBox directly)
}
```

### Notio Usage

```javascript
const context = renderer.getContext();
context.setViewBox(0, 0, 60, 140);
```

### Contract Requirements

**Inputs**:
- `x`, `y`: SVG coordinate origin (typically 0, 0)
- `width`, `height`: SVG viewport dimensions in pixels

**Outputs**:
- Returns `void`
- Modifies underlying SVG element's `viewBox` attribute

**Guarantees**:
- ViewBox is set immediately
- SVG elements subsequently drawn respect viewBox coordinates

**Error Handling**:
- Accepts any numeric values (negative allowed)
- No validation errors expected for typical inputs

**Performance**:
- Must complete in < 1ms (DOM attribute modification)

---

## 3. Stave Contract

### Purpose
Represent and render a five-line musical staff

### API Signature

```typescript
class Stave {
  constructor(
    x: number,
    y: number,
    width: number,
    options?: StaveOptions
  );

  setBegBarType(type: Barline.type): Stave;
  setContext(context: RenderContext): Stave;
  draw(): Stave;
}

interface StaveOptions {
  fill_style?: string;
  // ... other options
}

namespace Barline.type {
  const NONE: number;
  const SINGLE: number;
  const DOUBLE: number;
  const END: number;
  // ... other types
}
```

### Notio Usage

```javascript
const { Stave } = VexFlow;

const stave = new Stave(0, 10, 60, { fill_style: "black" });
stave.setBegBarType(VexFlow.Barline.type.NONE);
stave.setContext(context).draw();
```

### Contract Requirements

**Inputs**:
- `x`, `y`: Position on SVG canvas (pixels)
- `width`: Staff width in pixels
- `options.fill_style`: CSS color string (default: "black")

**Outputs**:
- Constructor returns `Stave` instance
- Chainable methods return `this` for fluent API

**Guarantees**:
- **CRITICAL**: Staff lines must be continuous without visual discontinuity
  - This is the PRIMARY BUG FIX in VexFlow 5.x
  - Staff lines at Gb notes must align properly (Extended + Romance mode)
- Staff is rendered to SVG when `draw()` is called
- Five horizontal lines are drawn at standard spacing

**Error Handling**:
- Accepts any numeric position/width values
- Invalid color strings may fall back to black (browser-dependent)

**Performance**:
- `draw()` must complete in < 50ms for typical staff
- Contributes to overall < 200ms notation rendering requirement

**Visual Quality** (VexFlow 5.x Improvement):
- Staff lines rendered with proper stroke width
- No anti-aliasing artifacts
- Crisp, professional appearance across zoom levels

---

## 4. StaveNote Contract

### Purpose
Represent and render individual musical notes on a staff

### API Signature

```typescript
class StaveNote {
  constructor(noteSpec: NoteSpec);
  addModifier(modifier: Modifier, index: number): StaveNote;
}

interface NoteSpec {
  keys: string[];      // E.g., ["C/4"], ["Gb/5"]
  duration: string;    // E.g., "w" (whole), "q" (quarter)
  clef: string;        // "treble", "bass", "tenor", "alto"
}
```

### Notio Usage

```javascript
const { StaveNote } = VexFlow;

const note = new StaveNote({
  keys: ["Gb/5"],
  duration: "w",
  clef: "treble"
});
```

### Contract Requirements

**Inputs**:
- `keys`: Array of note strings in format `"[PITCH][ACCIDENTAL]/[OCTAVE]"`
  - Pitch: A, B, C, D, E, F, G
  - Accidental: "", "b", "bb", "#", "##" (optional, embedded in key string)
  - Octave: Integer (typically 3-6 for musical range)
  - Examples: `"C/4"`, `"Gb/5"`, `"F##/4"`, `"Cbb/3"`
- `duration`: Standard duration code ("w", "h", "q", "8", "16", etc.)
- `clef`: One of "treble", "bass", "tenor", "alto"

**Outputs**:
- Returns `StaveNote` instance ready for rendering

**Guarantees**:
- Note is positioned correctly on staff for given clef
- Ledger lines added automatically for notes outside staff range
- Note head, stem, and flag rendered according to duration

**Error Handling**:
- Invalid `keys` format may throw or render incorrectly
- Unknown `clef` may throw or default to treble
- Invalid `duration` may throw or render as quarter note

**Performance**:
- Construction must complete in < 5ms per note

---

## 5. Accidental Contract

### Purpose
Represent sharp, flat, natural, and other accidental modifiers

### API Signature

```typescript
class Accidental {
  constructor(type: string);
}

type AccidentalType = "#" | "b" | "##" | "bb" | "n";
```

### Notio Usage

```javascript
const { Accidental, StaveNote } = VexFlow;

const note = new StaveNote({ keys: ["G/5"], duration: "w", clef: "treble" });

// Add flat
note.addModifier(new Accidental("b"), 0);

// Result: Renders as Gb
```

### Contract Requirements

**Inputs**:
- `type`: Accidental string
  - `"#"`: Sharp
  - `"b"`: Flat
  - `"##"`: Double-sharp
  - `"bb"`: Double-flat
  - `"n"`: Natural (cancels previous accidental)

**Outputs**:
- Returns `Accidental` instance ready to attach to note

**Guarantees**:
- Accidental symbol rendered to left of note head
- Proper spacing to avoid overlap with note or staff lines
- **CRITICAL (VexFlow 5.x fix)**: Accidentals must not cause staff line discontinuity
  - Especially important for Gb in Extended + Romance notation mode

**Error Handling**:
- Unknown accidental type may throw or render incorrectly

**Performance**:
- Construction must complete in < 1ms

---

## 6. Voice Contract

### Purpose
Container for notes that manages musical timing and beats

### API Signature

```typescript
class Voice {
  constructor(options: VoiceOptions);
  addTickables(notes: StaveNote[]): Voice;
  draw(context: RenderContext, stave: Stave): void;
}

interface VoiceOptions {
  num_beats: number;
  beat_value: number;
}
```

### Notio Usage

```javascript
const { Voice } = VexFlow;

const voice = new Voice({
  num_beats: 1,
  beat_value: 1
});

voice.addTickables([note]);
```

### Contract Requirements

**Inputs**:
- `num_beats`: Number of beats in the voice (typically 1 for Notio's single-note display)
- `beat_value`: Beat value (1 = quarter note, 4 = whole note)
- `notes`: Array of `StaveNote` instances

**Outputs**:
- Returns `Voice` instance
- `addTickables()` returns `this` for chaining

**Guarantees**:
- Notes are rendered in order added
- Timing validation ensures notes fit within beat constraints

**Error Handling**:
- May throw if notes exceed `num_beats` capacity

**Performance**:
- `addTickables()` must complete in < 5ms for typical single note

---

## 7. Formatter Contract

### Purpose
Automatically space and align notes on a staff

### API Signature

```typescript
class Formatter {
  constructor();
  joinVoices(voices: Voice[]): Formatter;
  format(voices: Voice[], width: number): Formatter;
}
```

### Notio Usage

```javascript
const { Formatter } = VexFlow;

new Formatter()
  .joinVoices([voice])
  .format([voice], window.innerWidth);

voice.draw(context, stave);
```

### Contract Requirements

**Inputs**:
- `voices`: Array of `Voice` instances to format together
- `width`: Available width in pixels for note spacing

**Outputs**:
- Returns `Formatter` instance (chainable)
- Modifies voices internally to set note positions

**Guarantees**:
- Notes are evenly spaced within available width
- No overlap between notes or accidentals
- Professional, readable spacing

**Error Handling**:
- Accepts any width value (may compress notes if too narrow)

**Performance**:
- Must complete in < 50ms for typical single note
- Contributes to overall < 200ms notation rendering requirement

---

## Integration Contract

### Complete Rendering Flow

```javascript
import * as VexFlow from "vexflow";

const { Renderer, Stave, StaveNote, Accidental, Voice, Formatter } = VexFlow;

// 1. Create renderer and context
const renderer = new Renderer(containerElement, VexFlow.Renderer.Backends.SVG);
const context = renderer.getContext();
context.setViewBox(0, 0, 60, 140);

// 2. Create and draw staff
const stave = new Stave(0, 10, 60, { fill_style: "black" });
stave.setBegBarType(VexFlow.Barline.type.NONE);
stave.setContext(context).draw();

// 3. Create note with accidental
const note = new StaveNote({ keys: ["G/5"], duration: "w", clef: "treble" });
note.addModifier(new Accidental("b"), 0);

// 4. Add note to voice
const voice = new Voice({ num_beats: 1, beat_value: 1 });
voice.addTickables([note]);

// 5. Format and render
new Formatter().joinVoices([voice]).format([voice], window.innerWidth);
voice.draw(context, stave);
```

### End-to-End Guarantees

**Performance**:
- Total rendering time: < 200ms (constitutional requirement)
- Breakdown:
  - Renderer setup: < 10ms
  - Staff rendering: < 50ms
  - Note creation: < 10ms
  - Formatting: < 50ms
  - Voice rendering: < 80ms

**Visual Quality**:
- ✅ Staff lines continuous and aligned (PRIMARY FIX in VexFlow 5.x)
- ✅ No discontinuity at Gb notes in Extended + Romance notation mode
- ✅ Crisp, professional rendering across zoom levels
- ✅ Proper accidental positioning without overlap

**Browser Compatibility**:
- ✅ Chrome 35+ (FontFace API support)
- ✅ Firefox 41+ (FontFace API support)
- ✅ Safari 10+ (FontFace API support)
- ✅ Edge 79+ (FontFace API support)

---

## Error Handling Contract

### Expected Errors

**Invalid DOM Element**:
```javascript
// Renderer throws if element is null
try {
  new Renderer(null, VexFlow.Renderer.Backends.SVG);
} catch (error) {
  // Handle: Element not found in DOM
}
```

**Invalid Note Format**:
```javascript
// StaveNote may throw for malformed keys
try {
  new StaveNote({ keys: ["INVALID"], duration: "w", clef: "treble" });
} catch (error) {
  // Handle: Invalid note specification
}
```

**Notio Error Handling Strategy**:
- Validate props before passing to VexFlow
- Use React error boundaries to catch VexFlow errors
- Fallback: Hide musical staff if rendering fails
- Log errors for debugging

---

## Performance Contract

### Rendering Performance Requirements

| Operation | Max Time | Measurement Point |
|-----------|----------|-------------------|
| Full rendering cycle | < 200ms | `setupStaff()` + `drawNotes()` |
| Renderer construction | < 10ms | `new Renderer()` |
| Staff rendering | < 50ms | `stave.draw()` |
| Note formatting | < 50ms | `new Formatter().format()` |
| Voice rendering | < 80ms | `voice.draw()` |
| Re-rendering (props change) | < 200ms | `componentDidUpdate()` flow |

**Validation**:
- E2E tests will measure actual rendering times
- Performance budget enforced by constitution (< 200ms)
- VexFlow 5.x expected to meet or exceed 4.x performance

---

## Testing Contract

### Integration Test Requirements

**Test Coverage**:
- ✅ Renderer creates SVG element correctly
- ✅ Staff renders with continuous lines (no Gb discontinuity)
- ✅ Notes render with correct positioning
- ✅ Accidentals (sharp, flat, double-sharp, double-flat) render correctly
- ✅ All clefs (treble, bass, tenor, alto) render correctly
- ✅ Extended keyboard mode + Romance notation renders correctly
- ✅ Props changes trigger re-rendering

**E2E Test Requirements**:
- ✅ Visual regression: Gb alignment in Extended + Romance mode
- ✅ Cross-browser rendering consistency
- ✅ Performance: Rendering completes within 200ms
- ✅ Font loading: Bravura font loads successfully

---

## Migration Verification Checklist

| Requirement | Test Method | Success Criteria |
|-------------|-------------|------------------|
| Namespace change complete | Code review + linting | No `Vex.Flow` references remain |
| All APIs functional | Integration tests | All 152 tests pass |
| Gb alignment fixed | E2E visual test | Staff lines continuous at Gb |
| Performance maintained | E2E performance test | Rendering < 200ms |
| Cross-browser compatible | E2E multi-browser | Chrome, Firefox, Safari, Edge pass |
| No console errors | E2E error check | Zero VexFlow-related errors |
| Font loading works | E2E font check | Bravura symbols render correctly |

---

## Contract Versioning

**VexFlow Version**: 5.0.0
**Contract Date**: 2025-11-17
**Notio Version**: 0.1.0 (targeting)

**Breaking Change Policy**:
- If VexFlow 5.x introduces breaking changes in minor versions, this contract must be updated
- Notio will pin to exact VexFlow version (no `^` semver range) until upgrade validated

---

**Status**: ✅ Contract defined - Ready for implementation
