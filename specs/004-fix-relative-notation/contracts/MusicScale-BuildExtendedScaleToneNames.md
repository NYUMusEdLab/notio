# Method Contract: BuildExtendedScaleToneNames

**Class**: MusicScale
**File**: `src/Model/MusicScale.js`
**Method**: BuildExtendedScaleToneNames(ScaleStepNumbers, semiToneSteps, rootNoteName, notation, scaleName)

## Purpose

Generates display names for scale notes across multiple notation systems (English, German, Romance, Relative, Scale Steps, Chord extensions).

## Method Signature

```javascript
BuildExtendedScaleToneNames(
  ScaleStepNumbers,  // Array<String>: e.g., ["1", "2", "3", "#4", "5", "6", "△7"]
  semiToneSteps,     // Array<Number>: e.g., [0, 2, 4, 6, 7, 9, 11]
  rootNoteName,      // String: e.g., "C", "F#", "Bb"
  notation,          // Array<String>: e.g., ["English", "Relative", "Scale Steps"]
  scaleName          // String: e.g., "Lydian", "Major (Ionian)"
)
```

## Parameters

### ScaleStepNumbers
- **Type**: Array<String>
- **Description**: Scale degree notation strings with accidentals from scaleRecipe.numbers
- **Example**: `["1", "2", "b3", "4", "5", "b6", "7"]` (Natural Minor)
- **Constraints**:
  - Must not be empty
  - Length must match number of tones in scale
  - Each element must be valid scale degree notation
- **Used For**: "Relative", "Scale Steps", "Chord extensions" notations

### semiToneSteps
- **Type**: Array<Number>
- **Description**: Extended scale as semitone intervals from root
- **Example**: `[0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19, 21, 23]` (2-octave Lydian)
- **Constraints**:
  - Must not be empty
  - Must be sorted ascending
  - Values in range [0, N] where N depends on ambitus
- **Used For**: All notations (primary iteration array)

### rootNoteName
- **Type**: String
- **Description**: Root note of the scale
- **Example**: `"C"`, `"F#"`, `"Bb"`
- **Constraints**:
  - Must be valid note name (A-G with optional accidental)
  - Must exist in noteMapping data
- **Used For**: English, German, Romance notations (determines sharps vs flats)

### notation
- **Type**: Array<String>
- **Description**: List of notation types to generate
- **Example**: `["English", "German", "Romance", "Relative", "Scale Steps", "Chord extensions"]`
- **Constraints**:
  - Must not be empty
  - Each element must be one of: "English", "German", "Romance", "Relative", "Scale Steps", "Chord extensions"
- **Used For**: Determines which notation types to populate in return object

### scaleName
- **Type**: String
- **Description**: Name of the scale
- **Example**: `"Lydian"`, `"Major (Ionian)"`, `"Chromatic"`
- **Constraints**:
  - Must not be empty
  - Used for special case detection (e.g., "Chromatic")
- **Used For**: Logic branching for special scales

## Return Value

```javascript
{
  English?: Array<String>,          // e.g., ["C", "D", "E", "F#", "G", "A", "B"]
  German?: Array<String>,           // e.g., ["C", "D", "E", "Fis", "G", "A", "H"]
  Romance?: Array<String>,          // e.g., ["Do", "Re", "Mi", "Fa#", "Sol", "La", "Si"]
  Relative?: Array<String>,         // e.g., ["DO", "RE", "MI", "FI", "SO", "LA", "TI"]
  Scale_Steps?: Array<String>,      // e.g., ["1", "2", "3", "#4", "5", "6", "△7"]
  Chord_extensions?: Array<String>  // e.g., [" ", "9", " ", "#11", "5", "13", "△7"]
}
```

**Properties**: Object with notation type keys, array values
**Array Lengths**: All arrays have same length as semiToneSteps parameter
**Array Elements**: Strings representing note names or scale degree labels

## Behavior Changes

### Before Fix (Current - Semitone-Based)

**Relative Notation Logic** (Lines 315-318):
```javascript
case "Relative":
  theScale["Relative"] = semiToneSteps.map(
    (step) => notes[step % notes.length].note_relative
  );
  break;
```

**Problem**: Maps semitone steps directly to chromatic syllables. This causes enharmonic confusion because semitones are ambiguous:
- Semitone 6 could be either #4 (raised fourth, "FI") or b5 (flatted fifth, "SE")
- Current code always uses semitone lookup, so both display as "SE"
- **Missing key insight**: The `scaleRecipe.numbers` array already contains the exact scale degree notation we need!

### After Fix (New - Direct Numbers Mapping)

**Relative Notation Logic** using **scaleRecipe.numbers directly**:
```javascript
case "Relative":
  if (this.Name === "Chromatic") {
    // Preserve existing chromatic logic (uses semitones)
    theScale["Relative"] = semiToneSteps.map(
      (step) => notes[step % notes.length].note_relative
    );
  } else {
    // NEW: Use scaleRecipe.numbers → dictionary mapping
    const SCALE_DEGREE_TO_RELATIVE = {
      "1": "DO", "2": "RE", "3": "MI", "4": "FA", "5": "SO", "6": "LA", "7": "TI", "△7": "TI",
      "#1": "DI", "#2": "RI", "#4": "FI", "#5": "SI", "#6": "LI",
      "b2": "RA", "b3": "ME", "b5": "SE", "b6": "LE", "b7": "TE"
    };

    let length = this.Recipe.numbers.length;
    let relative = this.findScaleStartIndexRelativToRoot(
      this.ExtendedScaleSteps,
      ScaleStepNumbers.length
    );

    theScale["Relative"] = semiToneSteps.map((step, index) => {
      // Get scale degree from numbers array (e.g., "#4", "b5")
      const scaleDegree = ScaleStepNumbers[(index + relative) % length];

      // Map to syllable (bypasses semitone ambiguity entirely!)
      return SCALE_DEGREE_TO_RELATIVE[scaleDegree] ||
             notes[step % notes.length].note_relative; // Fallback
    });
  }
  break;
```

**Solution**: Uses `scaleRecipe.numbers` array as source of truth. Each scale degree string (e.g., "#4", "b5") unambiguously maps to its syllable:
- "#4" (Lydian) → "FI" (raised fourth) ✅
- "b5" (Locrian) → "SE" (flatted fifth) ✅
- **Key advantage**: No semitone calculation - we use the scale degree notation directly from the recipe!

## Side Effects

**None** - Pure function. No instance state modifications. No external I/O.

## Exceptions

**No explicit throws** - Invalid keys in dictionary lookup produce error prefix string (`ERR:${scaleDegree}`) for debugging.

## Examples

### Example 1: Lydian Scale (Tests #4 → FI)

**Input**:
```javascript
ScaleStepNumbers = ["1", "2", "3", "#4", "5", "6", "△7"]
semiToneSteps = [0, 2, 4, 6, 7, 9, 11]
rootNoteName = "C"
notation = ["Relative"]
scaleName = "Lydian"
```

**Before Fix Output**:
```javascript
{
  Relative: ["DO", "RE", "MI", "SE", "SO", "LA", "TI"]  // WRONG: "SE" for #4
}
```

**After Fix Output**:
```javascript
{
  Relative: ["DO", "RE", "MI", "FI", "SO", "LA", "TI"]  // CORRECT: "FI" for #4
}
```

### Example 2: Locrian Scale (Tests b5 → SE)

**Input**:
```javascript
ScaleStepNumbers = ["1", "b2", "b3", "4", "b5", "b6", "7"]
semiToneSteps = [0, 1, 3, 5, 6, 8, 10]
rootNoteName = "C"
notation = ["Relative"]
scaleName = "Locrian"
```

**Before Fix Output**:
```javascript
{
  Relative: ["DO", "RA", "ME", "FA", "FI", "LE", "TE"]  // WRONG: "FI" for b5
}
```

**After Fix Output**:
```javascript
{
  Relative: ["DO", "RA", "ME", "FA", "SE", "LE", "TE"]  // CORRECT: "SE" for b5
}
```

### Example 3: Chromatic Scale (No Change)

**Input**:
```javascript
ScaleStepNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
semiToneSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
rootNoteName = "C"
notation = ["Relative"]
scaleName = "Chromatic"
```

**Before Fix Output**:
```javascript
{
  Relative: ["DO", "DI", "RE", "RI", "MI", "FA", "FI", "SO", "SI", "LA", "LI", "TI"]
}
```

**After Fix Output** (Identical):
```javascript
{
  Relative: ["DO", "DI", "RE", "RI", "MI", "FA", "FI", "SO", "SI", "LA", "LI", "TI"]
}
```

### Example 4: Extended Scale (2 Octaves)

**Input**:
```javascript
ScaleStepNumbers = ["1", "2", "3", "4", "5", "6", "△7"]
semiToneSteps = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23]
rootNoteName = "C"
notation = ["Relative"]
scaleName = "Major (Ionian)"
```

**After Fix Output**:
```javascript
{
  Relative: ["DO", "RE", "MI", "FA", "SO", "LA", "TI",   // First octave
              "DO", "RE", "MI", "FA", "SO", "LA", "TI"]  // Second octave
}
```

**Verification**: Pattern repeats correctly across octaves using modulo operator.

## Performance Characteristics

- **Time Complexity**: O(n) where n = semiToneSteps.length
- **Space Complexity**: O(n) for output arrays + O(1) for dictionary
- **Dictionary Lookup**: O(1) constant time per element
- **Expected Runtime**: <1ms for typical scales (7-12 notes per octave, 1-3 octaves)

## Testing Requirements

### Unit Tests
- [ ] Dictionary lookup with all valid scale degree keys
- [ ] Dictionary lookup with invalid key (returns error prefix)
- [ ] △7 symbol handled correctly

### Integration Tests
- [ ] Lydian scale shows "FI" for #4
- [ ] Locrian scale shows "SE" for b5
- [ ] All 14 scale types produce correct syllables
- [ ] Extended scales (2-3 octaves) repeat pattern correctly
- [ ] Chromatic scale unchanged (uses old logic)
- [ ] Notation switching (Relative → English → Relative) works correctly

### E2E Tests
- [ ] User selects Lydian → Relative notation → Sees "FI" at position 4
- [ ] User selects Locrian → Relative notation → Sees "SE" at position 5
- [ ] User switches between scales → Relative notation updates correctly

## Breaking Changes

**None** - Method signature unchanged, return type unchanged, output structure unchanged. Only values in Relative array are corrected.

## Deprecations

**None** - No APIs deprecated.

## Migration Guide

**Not applicable** - Internal method change with no external API impact.

## Version

- **Changed In**: Feature 004-fix-relative-notation
- **Status**: Pending implementation
- **Backward Compatible**: Yes (bug fix, not breaking change)
