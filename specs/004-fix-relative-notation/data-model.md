# Data Model: Fix Relative Notation to Use Scale Steps

**Feature**: 004-fix-relative-notation
**Date**: 2025-12-04

## Overview

This feature does not introduce new data models. It modifies the internal behavior of existing MusicScale class to use a different data source (scale degree numbers) for Relative notation mapping.

## Existing Data Structures (No Changes)

### Scale Recipe Object

**Location**: `src/data/scalesObj.js`

**Structure** (Example: Lydian):
```javascript
{
  name: "Lydian",
  steps: [0, 2, 4, 6, 7, 9, 11],           // Semitone intervals
  numbers: ["1", "2", "3", "#4", "5", "6", "△7"],  // Scale degree notation
  major_seventh: 11
}
```

**Usage**:
- `steps`: Currently used for Relative notation (BUG - creates enharmonic confusion)
- `numbers`: Contains scale degree strings with accidentals - **NOW USED FOR RELATIVE NOTATION**

**No modifications required** - existing data structure already contains everything needed.

### Note Object

**Location**: `src/data/notes.js`

**Structure**:
```javascript
{
  midi_nr: 12,
  note_romance: "Do",
  note_english: "C",
  note_german: "C",
  note_relative: "DO",    // Used by Chromatic scale only (after fix)
  pianoColor: "white",
  color: "#ff0000",
  colorRGBA: "rgba(255, 0, 0, 0.2)",
  octaveOffset: 0
}
```

**No modifications required**.

## New Constant (Internal to MusicScale.js)

### SCALE_DEGREE_TO_RELATIVE Dictionary

**Location**: `src/Model/MusicScale.js` (within BuildExtendedScaleToneNames method)

**Purpose**: Maps scale degree strings to relative solfège syllables

**Structure**:
```javascript
const SCALE_DEGREE_TO_RELATIVE = {
  // Natural degrees
  "1": "DO",
  "2": "RE",
  "3": "MI",
  "4": "FA",
  "5": "SO",
  "6": "LA",
  "7": "TI",
  "△7": "TI",

  // Raised degrees (sharps)
  "#1": "DI",
  "#2": "RI",
  "#4": "FI",   // ← THE FIX for Lydian
  "#5": "SI",
  "#6": "LI",

  // Lowered degrees (flats)
  "b2": "RA",
  "b3": "ME",
  "b5": "SE",   // ← THE FIX for Locrian
  "b6": "LE",
  "b7": "TE"
};
```

**Properties**:
- **Type**: Immutable constant object
- **Scope**: Function-level (within BuildExtendedScaleToneNames)
- **Keys**: Scale degree notation strings from scaleRecipe.numbers
- **Values**: Movable-do solfège syllables (uppercase)

**Validation Rules**:
- All keys must be valid scale degree notation
- All values must be valid relative syllable names
- Dictionary must be complete for all scale degrees in existing scales

## Data Flow Diagrams

### Before Fix (Current - Incorrect)

```
scaleRecipe.steps (semitones)
    [0, 2, 4, 6, 7, 9, 11]  (Lydian)
           ↓
    semiToneSteps.map(step => notes[step].note_relative)
           ↓
    ["DO", "RE", "MI", "SE", "SO", "LA", "TI"]  ← WRONG! Shows "SE" for #4

Problem: Semitone 6 is ambiguous - could be #4 or b5
```

### After Fix (Correct) - **Direct Numbers Mapping**

```
scaleRecipe.numbers (scale degrees) ← THE KEY SOURCE
    ["1", "2", "3", "#4", "5", "6", "△7"]  (Lydian)
           ↓
    Iterate positions, look up numbers[pos % length]
           ↓
    SCALE_DEGREE_TO_RELATIVE dictionary lookup
           ↓
    ["DO", "RE", "MI", "FI", "SO", "LA", "TI"]  ← CORRECT! Shows "FI" for #4

Solution: Scale degree string "#4" is unambiguous - always maps to "FI"
         No semitone calculation needed!
```

### Extended Scale Handling - **Using Numbers Array with Modulo**

```
Scale: Major, Extended over 2 octaves
scaleRecipe.numbers: ["1", "2", "3", "4", "5", "6", "△7"]  ← Source of truth

Extended scale has 14 positions (2 octaves × 7 notes)
                         ↓
For each position index (0-13):
  1. Relative position: findScaleStartIndexRelativToRoot()
  2. Get scale degree: numbers[(index + relative) % 7]
  3. Look up syllable: DICTIONARY[scaleDegree]
                         ↓
Position 0: numbers[0] = "1"  → "DO"
Position 1: numbers[1] = "2"  → "RE"
...
Position 7: numbers[0] = "1"  → "DO"  (wraps via modulo)
Position 8: numbers[1] = "2"  → "RE"
...
                         ↓
Result: ["DO", "RE", "MI", "FA", "SO", "LA", "TI", "DO", "RE", "MI", "FA", "SO", "LA", "TI"]

Key: Modulo operator ensures numbers array repeats correctly across octaves
```

## State Transitions

**No state changes** - this is a pure function transformation. Same inputs produce same outputs, just using different lookup mechanism.

### Input State
- MusicScale instance with selected scale recipe
- Notation type set to "Relative"
- Extended scale steps calculated

### Output State
- ExtendedScaleToneNames.Relative array populated with correct syllables

## Data Validation

### Input Validation

**Scale Recipe Numbers Array**:
- Must exist (all scales in scalesObj.js have this property)
- Must contain valid scale degree strings
- Length must match scale.steps.length

**Validation performed by**:
- Unit tests verify all existing scales have valid numbers arrays
- Error prefix `ERR:${scaleDegree}` reveals any invalid entries

### Output Validation

**Relative Syllables Array**:
- Must have same length as input semiToneSteps array
- Must contain valid relative syllable strings
- Must not contain error prefixes in production scales

**Validation performed by**:
- Integration tests verify output for each scale type
- E2E tests verify visual display matches expected syllables

## Relationships

```
┌──────────────────┐
│  Scale Recipe    │
│  (scalesObj.js)  │
│                  │
│  - name          │
│  - steps []      │
│  - numbers []    │◄──── USED BY FIX
└──────────────────┘
         ↓
         ↓
┌──────────────────┐
│  MusicScale      │
│  Instance        │
│                  │
│  - Recipe        │
│  - SemitoneSteps │
│  - RootNote      │
└──────────────────┘
         ↓
         ↓ BuildExtendedScaleToneNames()
         ↓
┌─────────────────────────────┐
│ SCALE_DEGREE_TO_RELATIVE    │
│ (lookup dictionary)          │
│                              │
│ "#4" → "FI"                  │
│ "b5" → "SE"                  │
│ ...                          │
└─────────────────────────────┘
         ↓
         ↓
┌──────────────────┐
│ ExtendedScale    │
│ ToneNames        │
│                  │
│ - English []     │
│ - German []      │
│ - Romance []     │
│ - Relative []    │◄──── FIXED OUTPUT
│ - Scale_Steps [] │
│ - Chord_ext []   │
└──────────────────┘
```

## Entity Properties

### SCALE_DEGREE_TO_RELATIVE (New Constant)

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Keys | String | Scale degree notation (e.g., "#4", "b5") | Must match format in scaleRecipe.numbers |
| Values | String | Relative solfège syllable (e.g., "FI", "SE") | Must be uppercase, valid movable-do syllable |

### ExtendedScaleToneNames.Relative (Modified Output)

| Property | Type | Description | Changes |
|----------|------|-------------|---------|
| Array Length | Number | Matches semiToneSteps.length | No change |
| Element Type | String | Relative syllable name | **Changed**: Now based on scale degrees, not semitones |
| Element Values | String | Valid syllables or error prefix | **Changed**: "#4" → "FI" (was "SE"), "b5" → "SE" (was "FI") |

## Migration Considerations

**No database migration required** - this is a frontend logic change only.

**No data format changes** - existing scale recipes remain unchanged.

**No API changes** - internal method modification only.

**No breaking changes** - output type and structure remain the same, just values are corrected.

## Performance Characteristics

### Memory Impact
- **Before**: 0 bytes (direct array indexing)
- **After**: ~400 bytes (20 entries × ~20 bytes per entry)
- **Impact**: Negligible (<0.001% of typical page memory)

### Computational Complexity
- **Before**: O(n) where n = semiToneSteps.length (array map + array index)
- **After**: O(n) where n = semiToneSteps.length (array map + object lookup)
- **Lookup**: O(1) constant time for both approaches
- **Impact**: No measurable performance difference

### Caching
- Dictionary is defined once per method call (could be hoisted to class level for micro-optimization, but premature)
- No need for memoization - pure function with no side effects

## Testing Data Requirements

### Test Fixtures

**Required Scale Types for Integration Tests**:
1. Lydian (has #4 - primary bug)
2. Locrian (has b5 - primary bug)
3. Major (baseline - all natural degrees)
4. Phrygian (has b2)
5. Dorian (has b7)
6. Harmonic Minor (has b3, b6)
7. Chromatic (special case - uses old logic)

**Expected Outputs** (Sample):
```javascript
{
  scale: "Lydian",
  root: "C",
  expected: ["DO", "RE", "MI", "FI", "SO", "LA", "TI"]
},
{
  scale: "Locrian",
  root: "C",
  expected: ["DO", "RA", "ME", "FA", "SE", "LE", "TE"]
},
{
  scale: "Chromatic",
  root: "C",
  expected: ["DO", "DI", "RE", "RI", "MI", "FA", "FI", "SO", "SI", "LA", "LI", "TI"]
}
```

## Summary

This feature requires **zero new data models**. It introduces one internal constant (lookup dictionary) and modifies the logic for populating one property (ExtendedScaleToneNames.Relative). All existing data structures remain unchanged, making this a low-risk, high-value fix.
