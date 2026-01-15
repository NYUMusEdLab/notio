# Data Model: Relative NoteNames

**Feature**: Fix Relative NoteNames for Scales and Modes
**Date**: 2025-11-30
**Branch**: 004-fix-relative-notenames

## Overview

This feature modifies display logic only - there is NO data persistence layer. All data structures are in-memory JavaScript objects used for rendering movable-do solfege syllables.

## Core Entities

### 1. ScaleRecipe (existing - no changes)

**Source**: `src/data/scalesObj.js`

**Structure**:
```javascript
{
  name: string,          // e.g., "Natural Minor/Aeolian"
  steps: number[],       // Chromatic semitone steps, e.g., [0, 2, 3, 5, 7, 8, 10]
  numbers: string[],     // Scale degree labels, e.g., ["1", "2", "b3", "4", "5", "b6", "7"]
  major_seventh?: number // Optional: MIDI number for major 7th if present
}
```

**Relationships**:
- Used by `MusicScale` class to generate extended scale tones
- The `numbers` array is the **key input** for relative syllable mapping

**Validation**:
- `steps.length` MUST equal `numbers.length`
- `steps` values MUST be integers in range [0, 11]
- `numbers` values MUST match scale degree pattern (e.g., "1", "b2", "2", "#2", "b3", "3", etc.)

**Examples**:
```javascript
// Natural Minor
{
  name: "Natural Minor/Aeolian",
  steps: [0, 2, 3, 5, 7, 8, 10],
  numbers: ["1", "2", "b3", "4", "5", "b6", "7"]
}

// Harmonic Minor
{
  name: "Harmonic Minor",
  steps: [0, 2, 3, 5, 7, 8, 11],
  numbers: ["1", "2", "b3", "4", "5", "b6", "△7"],
  major_seventh: 11
}

// Phrygian
{
  name: "Phrygian",
  steps: [0, 1, 3, 5, 7, 8, 10],
  numbers: ["1", "b2", "b3", "4", "5", "b6", "7"]
}

// Locrian
{
  name: "Locrian",
  steps: [0, 1, 3, 5, 6, 8, 10],
  numbers: ["1", "b2", "b3", "4", "b5", "b6", "7"]
}
```

### 2. SyllableMapping (new constant)

**Source**: `src/Model/MusicScale.js` (new constant)

**Structure**:
```javascript
const SCALE_DEGREE_TO_SYLLABLE = {
  // Diatonic degrees
  "1": "DO",
  "2": "RE",
  "3": "MI",
  "4": "FA",
  "5": "SO",
  "6": "LA",
  "7": "TE",      // Minor 7th
  "△7": "TI",     // Major 7th

  // Chromatic alterations (descending)
  "b2": "RA",
  "b3": "ME",
  "b5": "SE",
  "b6": "LE",
  "b7": "TE",     // Same as "7"

  // Chromatic alterations (ascending)
  "#1": "DI",
  "#2": "RI",
  "#4": "FI",
  "#5": "SI",
  "#6": "LI"
};
```

**Purpose**: Immutable lookup table mapping scale degree strings to solfege syllables.

**Validation**:
- MUST include all degree alterations used in `scalesObj.js`
- Syllables MUST follow standard movable-do chromatic solfege conventions
- Descending syllables (RA, ME, LE, TE, SE) preferred for lowered degrees
- TI reserved for major 7th (△7), TE for minor 7th (7, b7)

### 3. ExtendedScaleToneNames (existing - modified output)

**Source**: `src/Model/MusicScale.js` - `BuildExtendedScaleToneNames()` method output

**Structure** (before fix):
```javascript
{
  English: string[],      // e.g., ["C", "D", "Eb", "F", "G", "Ab", "Bb"]
  German: string[],       // e.g., ["C", "D", "Eb", "F", "G", "Ab", "B"]
  Romance: string[],      // e.g., ["Do", "Re", "Mib", "Fa", "Sol", "Lab", "Sib"]
  Relative: string[],     // e.g., ["DO", "RE", "ME", "FA", "SO", "LE", "TE"] ← FIXED
  Scale_Steps: string[],  // e.g., ["1", "2", "b3", "4", "5", "b6", "7"]
  Chord_extensions: string[] // e.g., [" ", "9", "b11", "11", "5", "b13", "7"]
}
```

**Change**: The `Relative` array will now be generated based on `this.Recipe.numbers` (scale degrees) instead of chromatic positions.

**Example transformation** (Natural Minor in C):

**Before** (chromatic mapping, WRONG):
```javascript
Relative: ["DO", "RE", "ME", "FA", "SO", "SI", "TE"]
// Maps chromatic steps [0,2,3,5,7,8,10] → notes[0-11].note_relative
```

**After** (scale-degree mapping, CORRECT):
```javascript
Relative: ["DO", "RE", "ME", "FA", "SO", "LE", "TE"]
// Maps scale degrees ["1","2","b3","4","5","b6","7"] → syllables
```

### 4. MusicScale Methods (modified behavior)

#### BuildExtendedScaleToneNames() - existing method, modified

**Current implementation** (lines 315-319):
```javascript
case "Relative":
  theScale["Relative"] = semiToneSteps.map(
    (step) => notes[step % notes.length].note_relative
  );
  break;
```

**New implementation**:
```javascript
case "Relative":
  theScale["Relative"] = this.makeRelativeScaleSyllables(
    semiToneSteps,
    this.Recipe.numbers,
    this.ExtendedScaleSteps
  );
  break;
```

#### makeRelativeScaleSyllables() - new method

**Signature**:
```javascript
makeRelativeScaleSyllables(
  semiToneSteps: number[],
  scaleNumbers: string[],
  extendedSteps: number[]
): string[]
```

**Inputs**:
- `semiToneSteps`: All chromatic steps in the extended scale (e.g., [0, 2, 3, 5, 7, 8, 10, 12, 14, 15...])
- `scaleNumbers`: Scale degree labels from recipe (e.g., ["1", "2", "b3", "4", "5", "b6", "7"])
- `extendedSteps`: All extended scale steps including octave offsets (from `this.ExtendedScaleSteps`)

**Outputs**:
- Array of solfege syllables matching `semiToneSteps.length`

**Algorithm**:
```javascript
makeRelativeScaleSyllables(semiToneSteps, scaleNumbers, extendedSteps) {
  // Handle chromatic scale special case
  if (this.Name === "Chromatic") {
    return this.MakeChromatic(semiToneSteps, this.RootNoteName, "Relative");
  }

  // Find root position in extended scale
  const rootIndex = this.findScaleStartIndexRelativToRoot(
    extendedSteps,
    scaleNumbers.length
  );

  // Map each step to its syllable based on scale degree position
  return semiToneSteps.map((step, index) => {
    const degreeIndex = (index + rootIndex) % scaleNumbers.length;
    const degree = scaleNumbers[degreeIndex];
    return SCALE_DEGREE_TO_SYLLABLE[degree] || "DO";
  });
}
```

**Edge cases**:
1. **Chromatic scale**: Use existing chromatic relative syllable mapping (DI, RA, RE, RI/ME, MI, FA, FI/SE, SO, SI/LE, LA, LI/TE, TI)
2. **Missing numbers array**: Fallback to chromatic mapping
3. **Unknown degree**: Default to "DO" (safe fallback)
4. **Multi-octave spans**: Pattern repeats correctly via modulo arithmetic

## State Transitions

This feature has no stateful transitions. All transformations are pure functions:

1. **User selects scale** → `MusicScale` instantiated with scale recipe
2. **User selects key** → Transposition applied, syllables remain pattern-based
3. **User enables Relative notation** → `BuildExtendedScaleToneNames()` called
4. **Syllables computed** → Rendered to UI
5. **User changes scale** → New `MusicScale` instantiated, step 3 repeats

**Key invariant**: For any given scale/mode, syllables MUST be identical across all 12 keys.

## Data Flow

```
ScaleRecipe (scalesObj.js)
  ↓
MusicScale constructor
  ↓
BuildExtendedScaleToneNames()
  ↓
makeRelativeScaleSyllables(numbers → syllables)
  ↓
ExtendedScaleToneNames.Relative[]
  ↓
BuildExtendedScaleTones() (adds syllables to note objects)
  ↓
Rendered to Keyboard component
```

## Validation Rules

### Scale Recipe Validation (existing, no changes)
- `steps.length === numbers.length`
- No duplicate steps in `steps` array
- Steps must be ascending within one octave
- `numbers` must start with "1"

### Syllable Output Validation (new)
- Output length MUST equal input `semiToneSteps.length`
- All syllables MUST be uppercase strings (DO, RE, ME, etc.)
- Pattern MUST repeat exactly every `scaleNumbers.length` positions
- For Natural Minor: MUST be ["DO", "RE", "ME", "FA", "SO", "LE", "TE", ...]
- For Harmonic Minor: MUST be ["DO", "RE", "ME", "FA", "SO", "LE", "TI", ...]
- For Phrygian: MUST be ["DO", "RA", "ME", "FA", "SO", "LE", "TE", ...]
- For Locrian: MUST be ["DO", "RA", "ME", "FA", "SE", "LE", "TE", ...]

### Key Independence Validation (new, critical)
- For any scale S and any two keys K1, K2:
  - `makeRelativeScaleSyllables(S, K1) === makeRelativeScaleSyllables(S, K2)`
- Syllables depend ONLY on scale degrees, NOT on chromatic positions

## Backward Compatibility

**Preserved**:
- All existing notation modes (English, German, Romance) unaffected
- Scale recipes unchanged
- `notes[].note_relative` field preserved for chromatic scale fallback
- Method signatures unchanged (internal implementation only)
- ExtendedScaleToneNames structure unchanged (only Relative array content changes)

**Changed**:
- Relative array content for non-chromatic scales
- Behavior of "Relative" notation mode (bug fix, not breaking change)

## Testing Implications

### Unit Tests (new)
- Test `SCALE_DEGREE_TO_SYLLABLE` completeness
- Test `makeRelativeScaleSyllables()` with all scale degree combinations
- Test edge cases: chromatic scale, missing numbers, unknown degrees
- Test octave repetition (multi-octave scales)

### Integration Tests (new)
- Test each specified scale (Natural Minor, Harmonic Minor, Phrygian, Locrian) shows correct syllables
- Test remaining modes (Dorian, Lydian, Mixolydian, Melodic Minor, Major)
- Test pentatonic scales (Major Pentatonic, Minor Pentatonic)
- Test custom scales fall back gracefully

### E2E Tests (new)
- Test Natural Minor in all 12 keys shows identical syllables
- Test Harmonic Minor in all 12 keys shows identical syllables
- Test Phrygian in all 12 keys shows identical syllables
- Test Locrian in all 12 keys shows identical syllables
- Test enharmonic equivalents (C# vs Db) show identical syllables
- Test multi-octave scales repeat pattern correctly

## Performance Considerations

**Complexity Analysis**:
- `SCALE_DEGREE_TO_SYLLABLE` lookup: O(1)
- `makeRelativeScaleSyllables()`: O(n) where n = `semiToneSteps.length`
- Typical n ≈ 20-40 (2-3 octave scale span)
- Total: <1ms per scale generation

**Memory Impact**:
- `SCALE_DEGREE_TO_SYLLABLE`: ~15 entries × ~20 bytes = 300 bytes (negligible)
- No additional memory overhead vs current implementation
- No caching needed (function is fast enough)

**Meets performance goal**: <50ms syllable update (actual: <1ms)

## Migration Notes

**No database migration required** - this is client-side display logic only.

**No data migration required** - existing scale definitions in `scalesObj.js` already contain the `numbers` arrays needed.

**User-visible changes**: Relative notation will display correctly for the first time, showing scale-degree-appropriate syllables instead of chromatic-position syllables.

## Example Transformations

### Natural Minor in C (before fix)
```javascript
Steps: [0, 2, 3, 5, 7, 8, 10]
Numbers: ["1", "2", "b3", "4", "5", "b6", "7"]
Syllables (WRONG): ["DO", "RE", "ME", "FA", "SO", "SI", "TE"]
                                                    ↑ WRONG (chromatic)
```

### Natural Minor in C (after fix)
```javascript
Steps: [0, 2, 3, 5, 7, 8, 10]
Numbers: ["1", "2", "b3", "4", "5", "b6", "7"]
Syllables (CORRECT): ["DO", "RE", "ME", "FA", "SO", "LE", "TE"]
                                                      ↑ CORRECT (scale degree)
```

### Key Independence Example
```javascript
// Natural Minor in C
Steps: [0, 2, 3, 5, 7, 8, 10]  // C, D, Eb, F, G, Ab, Bb
Syllables: ["DO", "RE", "ME", "FA", "SO", "LE", "TE"]

// Natural Minor in D (transposed +2)
Steps: [2, 4, 5, 7, 9, 10, 0+12]  // D, E, F, G, A, Bb, C
Syllables: ["DO", "RE", "ME", "FA", "SO", "LE", "TE"]  // IDENTICAL!
```

## Conclusion

The data model is simple and elegant: we add one constant lookup table and one new method. All existing data structures remain unchanged. The fix transforms syllable generation from chromatic-position-based to scale-degree-based, achieving pedagogical correctness while maintaining performance and backward compatibility.
