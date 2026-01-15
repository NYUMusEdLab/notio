# Research: Fix Relative Notation to Use Scale Steps

**Feature**: 004-fix-relative-notation
**Date**: 2025-12-04
**Status**: Complete

## Research Scope

This feature requires minimal research as it's a straightforward bug fix in existing code. The key research areas are:

1. Understanding the current implementation in MusicScale.js
2. Verifying the complete mapping of scale degrees to relative syllables
3. Confirming best practices for dictionary lookup in JavaScript
4. Understanding the relative position calculation for extended scales

## Technical Decisions

### Decision 1: Dictionary Structure

**Chosen**: JavaScript object literal for scale degree to syllable mapping

**Rationale**:
- O(1) constant time lookup performance
- Self-documenting key-value pairs (e.g., "#4": "FI")
- No external dependencies required
- Consistent with existing TONE_NAMES pattern in MusicScale.js (lines 501-526)

**Alternatives Considered**:
- Map() data structure: Overkill for static mapping, object literal is simpler
- Switch statement: Less maintainable than declarative dictionary
- Function with if-else: Violates simplicity principle, harder to extend

**Implementation**:
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

  // Raised degrees
  "#1": "DI",
  "#2": "RI",
  "#4": "FI",
  "#5": "SI",
  "#6": "LI",

  // Lowered degrees
  "b2": "RA",
  "b3": "ME",
  "b5": "SE",
  "b6": "LE",
  "b7": "TE"
};
```

### Decision 2: Core Mapping Strategy

**Chosen**: Use scaleRecipe.numbers array directly - no semitone intermediary

**Rationale**:
- The `scaleRecipe.numbers` array already contains exact scale degree strings (e.g., "#4", "b5", "△7")
- We iterate through extended scale positions and look up `numbers[position % numbers.length]` in the dictionary
- This completely bypasses semitone confusion - we never convert semitones to syllables
- Semitones are only used as fallback for Chromatic scale special case

**Example Flow (Lydian)**:
```javascript
scaleRecipe.numbers = ["1", "2", "3", "#4", "5", "6", "△7"]
position 0 → numbers[0] = "1"  → DICT["1"]  → "DO"
position 3 → numbers[3] = "#4" → DICT["#4"] → "FI"  ✅ Correct!
```

**NOT This (Old Buggy Way)**:
```javascript
semiToneSteps = [0, 2, 4, 6, 7, 9, 11]
position 3 → semitone 6 → notes[6].note_relative → "SE"  ❌ Wrong!
```

### Decision 3: Handling Missing Keys

**Chosen**: Fallback to semitone-based logic with console warning for invalid keys

**Rationale**:
- Chromatic scale uses special logic (already exists in line 322-327)
- Invalid keys in non-Chromatic scales indicate data integrity issue
- Failing fast helps catch bugs in scale definitions

**Alternatives Considered**:
- Silent fallback to empty string: Hides bugs, bad for educational accuracy
- Fallback to semitone logic for all: Defeats purpose of fix
- Throw exception: Too aggressive, could break user experience

**Implementation** (using numbers array directly):
```javascript
case "Relative":
  if (this.Name === "Chromatic") {
    // Keep existing chromatic logic (uses semitones)
    theScale["Relative"] = semiToneSteps.map(
      (step) => notes[step % notes.length].note_relative
    );
  } else {
    // NEW: Use scaleRecipe.numbers → dictionary mapping
    const SCALE_DEGREE_TO_RELATIVE = { /* dictionary */ };

    let length = this.Recipe.numbers.length;
    let relative = this.findScaleStartIndexRelativToRoot(
      this.ExtendedScaleSteps,
      ScaleStepNumbers.length
    );

    theScale["Relative"] = semiToneSteps.map((step, index) => {
      // Get scale degree from numbers array (e.g., "#4", "b5")
      const scaleDegree = ScaleStepNumbers[(index + relative) % length];

      // Map to syllable via dictionary (bypasses semitones entirely)
      return SCALE_DEGREE_TO_RELATIVE[scaleDegree] ||
             notes[step % notes.length].note_relative; // Fallback
    });
  }
  break;
```

**Key Insight**: We iterate `semiToneSteps.length` times (for extended scale length), but we get the scale degree from `ScaleStepNumbers` (which is `Recipe.numbers`), not from the semitone value itself.

### Decision 4: Placement of Dictionary

**Chosen**: Define dictionary as constant within BuildExtendedScaleToneNames() method

**Rationale**:
- Scoped to where it's used, following locality principle
- Not needed elsewhere in the codebase
- Avoids polluting class namespace

**Alternatives Considered**:
- Class-level constant: Would be accessible in other methods unnecessarily
- Separate file/module: Overkill for 20-entry static mapping
- Inside switch case: Too deeply nested, harder to maintain

### Decision 5: Testing Strategy

**Chosen**: Integration-first approach with scale rendering tests

**Rationale**:
- Aligns with Constitution Principle I (60-70% integration tests)
- Tests real user scenarios (select scale, view notation)
- Catches integration issues with scale selection and notation switching
- More maintainable than unit testing internal methods

**Test Coverage Plan**:
1. **Integration Tests (65%)**:
   - Test each scale type (Major, Lydian, Locrian, Phrygian, etc.) with Relative notation
   - Verify correct syllables for all scale degrees
   - Test notation switching (Relative → English → Relative)
   - Test extended scales spanning multiple octaves

2. **E2E Tests (25%)**:
   - User workflow: Select Lydian → Enable Relative → Verify "FI" at position 4
   - User workflow: Switch to Locrian → Verify "SE" at position 5
   - Cross-browser compatibility test

3. **Unit Tests (10%)**:
   - Dictionary lookup with all valid keys
   - Edge case: Invalid scale degree (should show error prefix)
   - Edge case: △7 symbol handling

## Complete Mapping Reference

Based on analysis of scalesObj.js and music theory standards:

| Scale Degree | Syllable | Usage in Existing Scales |
|--------------|----------|--------------------------|
| 1            | DO       | All scales               |
| 2            | RE       | Major, Dorian, etc.      |
| 3            | MI       | Major, Lydian, etc.      |
| 4            | FA       | Most scales              |
| 5            | SO       | Most scales              |
| 6            | LA       | Major, Dorian, etc.      |
| 7            | TI       | None (all use variants)  |
| △7           | TI       | Major, Lydian, etc.      |
| b2           | RA       | Phrygian, Locrian        |
| b3           | ME       | Minor scales, Blues      |
| b5           | SE       | Locrian, Minor Blues     |
| b6           | LE       | Aeolian, Phrygian        |
| b7           | TE       | Mixolydian, Dorian       |
| #1           | DI       | Not in current scales    |
| #2           | RI       | Not in current scales    |
| #4           | FI       | **Lydian** (THE BUG!)    |
| #5           | SI       | Not in current scales    |
| #6           | LI       | Not in current scales    |

**Note**: Some syllables are defined for completeness even though they're not in the current 14 scale types. This makes the system extensible for future custom scales.

## Implementation Risks

### Risk 1: Chromatic Scale Regression

**Mitigation**: Preserve existing Chromatic scale logic unchanged. Add integration test specifically for Chromatic scale to ensure it still shows all 12 chromatic syllables.

### Risk 2: Extended Scale Octave Mapping

**Concern**: Extended scales span multiple octaves - does relative position calculation work correctly?

**Resolution**: The existing `findScaleStartIndexRelativToRoot()` function (lines 591-597) handles this. The modulo operation `(index + relative) % length` correctly wraps around for multiple octaves.

**Verification**: Add integration test for extended scales (e.g., 3-octave Major scale) to verify syllables repeat correctly.

### Risk 3: Performance Degradation

**Assessment**: Dictionary lookup is O(1) vs existing array indexing which is also O(1). No performance degradation expected.

**Verification**: Existing performance benchmarks should pass unchanged.

## Dependencies Validation

### Existing Code Dependencies

1. **scaleRecipe.numbers** (line 87-88, FR-001): ✅ Verified present in all scale objects in scalesObj.js
2. **findScaleStartIndexRelativToRoot()** (line 591-597): ✅ Existing method handles relative positioning
3. **Chromatic scale check** (line 322): ✅ Pattern already exists for special-casing Chromatic scale
4. **TONE_NAMES pattern** (line 501-526): ✅ Establishes precedent for notation lookup dictionaries

### External Dependencies

None - this is a pure JavaScript fix with no external libraries required.

## Best Practices Applied

1. **Immutable Data**: Dictionary is constant, not modified at runtime
2. **Fail Fast**: Invalid keys produce visible error prefix for debugging
3. **Locality**: Dictionary defined close to usage point
4. **Documentation**: Keys and values are self-documenting music theory terms
5. **Extensibility**: Easy to add new scale degrees by adding dictionary entries
6. **Testing**: Integration-first approach validates real user scenarios

## Research Conclusion

All technical decisions are made. No additional research or clarification needed. Implementation is straightforward:

1. Define `SCALE_DEGREE_TO_RELATIVE` dictionary
2. Modify "Relative" case in BuildExtendedScaleToneNames() switch statement
3. Map through `ScaleStepNumbers` instead of `semiToneSteps`
4. Preserve Chromatic scale special case
5. Add comprehensive integration and E2E tests

**Ready for Phase 1: Data Model & Contracts**
