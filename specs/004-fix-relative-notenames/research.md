# Research: Relative NoteNames Mapping Strategy

**Feature**: Fix Relative NoteNames for Scales and Modes
**Date**: 2025-11-30
**Branch**: 004-fix-relative-notenames

## Overview

This document captures research findings and decisions for implementing context-aware movable-do solfege syllables based on scale degrees rather than chromatic positions.

## Problem Statement

Currently, relative notation in `MusicScale.js` maps chromatic scale positions (0-11) to fixed syllables regardless of the scale context. This causes all scales to show identical syllables when they should vary based on scale degrees:

```javascript
// Current implementation (MusicScale.js:316-318)
case "Relative":
  theScale["Relative"] = semiToneSteps.map(
    (step) => notes[step % notes.length].note_relative
  );
```

This approach is fundamentally flawed because it treats solfege as absolute pitch naming instead of scale-degree naming.

## Research Questions

### 1. Chromatic Solfege Syllable System

**Question**: What is the complete set of movable-do chromatic solfege syllables?

**Answer**: Standard movable-do solfege uses:

**Diatonic syllables (major scale)**:
- 1 → DO
- 2 → RE
- 3 → MI
- 4 → FA
- 5 → SO (or SOL)
- 6 → LA
- 7 → TI (leading tone, major 7th)

**Chromatic alterations** (ascending vs descending):

| Scale Degree | Syllable | Usage |
|--------------|----------|-------|
| b2 | RA | Descending from RE (Phrygian, Locrian) |
| #1 | DI | Ascending from DO (rarely used) |
| b3 | ME | Descending from MI (all minor scales) |
| #2 | RI | Ascending from RE (rarely used) |
| #4 | FI | Ascending from FA (Lydian) |
| b5 | SE | Descending from SO (Locrian) |
| #5 | SI | Ascending from SO (rarely used in scales) |
| b6 | LE | Descending from LA (Natural/Harmonic Minor, Phrygian, Locrian) |
| #6 | LI | Ascending from LA (Melodic Minor ascending, rarely used) |
| b7 | TE | Descending from TI (Mixolydian, Natural Minor, Dorian, Phrygian, Locrian) |

**Key insight**: In practice, we primarily use descending syllables (RA, ME, SE, LE, TE) for lowered degrees and ascending syllables (FI) for raised 4ths. The △7 uses TI (major 7th leading tone), while b7 uses TE.

### 2. Mapping Scale Degree Numbers to Syllables

**Question**: How do we map the scale `numbers` arrays (like `["1", "2", "b3", "4", "5", "b6", "7"]`) to solfege?

**Decision**: Create a lookup table mapping each possible scale degree string to its syllable:

```javascript
const SCALE_DEGREE_TO_SYLLABLE = {
  // Diatonic
  "1": "DO",
  "2": "RE",
  "3": "MI",
  "4": "FA",
  "5": "SO",
  "6": "LA",
  "7": "TE",      // Minor 7th (dominant 7th)
  "△7": "TI",     // Major 7th (leading tone)

  // Chromatic alterations
  "b2": "RA",     // Phrygian, Locrian
  "b3": "ME",     // All minor scales
  "#4": "FI",     // Lydian
  "b5": "SE",     // Locrian
  "b6": "LE",     // Natural Minor, Harmonic Minor, Phrygian, Locrian
  "b7": "TE",     // Same as "7" - all modes with minor 7th

  // Edge cases for completeness
  "#1": "DI",     // Rare
  "#2": "RI",     // Rare
  "#5": "SI",     // Rare
  "#6": "LI"      // Melodic Minor ascending (rare)
};
```

**Rationale**: The existing `scalesObj.js` already contains this information in the `numbers` arrays. By mapping from numbers to syllables, we leverage existing data without duplication.

### 3. Implementation Strategy

**Question**: Where should the syllable mapping logic live?

**Options Considered**:

**Option A**: Add a static mapping table in `MusicScale.js` and look up syllables by scale degree
**Option B**: Add syllable fields to each scale definition in `scalesObj.js`
**Option C**: Compute syllables dynamically from interval structure

**Decision**: **Option A** - Static lookup table in `MusicScale.js`

**Rationale**:
- Separation of concerns: scale definitions remain musical theory (intervals, degrees), syllable mapping is a presentation concern
- No duplication across 10+ scale definitions
- Easy to extend for custom scales
- Maintains existing scale definition format
- Simple, testable pure function

**Implementation approach**:
```javascript
// In MusicScale.js BuildExtendedScaleToneNames()
case "Relative":
  const syllables = this.makeRelativeScaleSyllables(
    semiToneSteps,
    this.Recipe.numbers,
    this.ExtendedScaleSteps
  );
  theScale["Relative"] = syllables;
  break;

makeRelativeScaleSyllables(semiToneSteps, scaleNumbers, extendedSteps) {
  const DEGREE_TO_SYLLABLE = { /* mapping table */ };

  // Find where the scale root (DO) appears in extended steps
  const rootIndex = this.findScaleStartIndexRelativToRoot(extendedSteps, scaleNumbers.length);

  // Map each extended step to its syllable based on scale degree position
  return semiToneSteps.map((step, index) => {
    const degreeIndex = (index + rootIndex) % scaleNumbers.length;
    const degree = scaleNumbers[degreeIndex];
    return DEGREE_TO_SYLLABLE[degree] || "DO"; // Default to DO for unknowns
  });
}
```

### 4. Handling Pentatonic and Non-Standard Scales

**Question**: How do we handle scales with fewer than 7 notes (pentatonics) or unusual structures?

**Answer**: The same mapping works!

**Examples**:
- **Minor Pentatonic**: `numbers: ["1", "b3", "4", "5", "7"]` → DO ME FA SO TE
- **Major Pentatonic**: `numbers: ["1", "2", "3", "5", "6"]` → DO RE MI SO LA
- **Blues Scales**: Mix of diatonic and altered degrees, map directly

The key insight is that syllables represent scale **degree positions**, not chromatic intervals. A pentatonic scale still has a 1st, b3rd, 4th, 5th, and 7th degree - just fewer total degrees.

### 5. Key Independence Verification

**Question**: How do we ensure syllables stay consistent across all 12 keys?

**Answer**: The current implementation already handles transposition correctly via `this.Transposition` and `this.RootNote.index`. The bug is NOT in transposition logic, but in the syllable assignment.

By mapping syllables to **scale degree positions** (via the `numbers` array) instead of **chromatic steps**, we automatically achieve key independence:

```javascript
// Key-independent: Based on scale degree position
const degree = scaleNumbers[degreeIndex];  // e.g., "b6"
const syllable = DEGREE_TO_SYLLABLE[degree]; // → "LE"

// Key-dependent (current bug): Based on chromatic position
const syllable = notes[step % 12].note_relative; // → varies by key!
```

**Verification strategy**: Integration tests will check Natural Minor in all 12 keys and verify identical syllable patterns.

## Alternative Approaches Rejected

### Alt 1: Add `relativeSyllables` array to each scale definition

```javascript
// In scalesObj.js
{
  name: "Natural Minor/Aeolian",
  steps: [0, 2, 3, 5, 7, 8, 10],
  numbers: ["1", "2", "b3", "4", "5", "b6", "7"],
  relativeSyllables: ["DO", "RE", "ME", "FA", "SO", "LE", "TE"]  // NEW
}
```

**Rejected because**:
- Duplicates information already encoded in `numbers`
- Requires manual updates to 10+ scale definitions
- Error-prone (syllables could drift from numbers)
- Harder to maintain consistency

### Alt 2: Chromatic syllable mapping (current approach, but fixed)

Keep chromatic mapping but add context awareness through mode detection.

**Rejected because**:
- Complex logic to detect which chromatic positions are "in scale"
- Doesn't handle custom scales well
- More prone to bugs with unusual interval combinations
- The `numbers` array already provides the correct abstraction

## Best Practices Applied

### 1. Movable-Do Solfege Pedagogy

Source: Standard music education practice (Kodály method, common in Europe and music theory curricula)

**Key principles**:
- DO is always the tonic, regardless of absolute pitch
- Syllables represent intervallic relationships to the tonic
- Descending chromatic syllables (RA, ME, LE, TE, SE) are preferred over enharmonic sharp equivalents
- TI is reserved for the major 7th (leading tone tendency)
- TE is used for the minor 7th (no leading tone tendency)

### 2. Separation of Concerns

**Musical data** (in `scalesObj.js`):
- Interval patterns (`steps`)
- Scale degree numbers (`numbers`)
- Names, metadata

**Display logic** (in `MusicScale.js`):
- Syllable mapping
- Notation rendering
- Visual representation

This separation allows scale definitions to remain pure musical theory while presentation varies by context (English note names, German notation, Romance syllables, or movable-do).

### 3. Testability

The `makeRelativeScaleSyllables()` function will be:
- Pure (no side effects)
- Deterministic (same inputs → same outputs)
- Easily unit testable with edge cases
- Independently testable from React components

## Implementation Checklist

- [ ] Add `SCALE_DEGREE_TO_SYLLABLE` constant to MusicScale.js
- [ ] Create `makeRelativeScaleSyllables()` method
- [ ] Update `BuildExtendedScaleToneNames()` case "Relative" to use new method
- [ ] Remove dependency on `notes[].note_relative` for scale contexts
- [ ] Keep `notes[].note_relative` for chromatic scale fallback
- [ ] Add unit tests for syllable mapping edge cases
- [ ] Add integration tests for all specified scales (Natural Minor, Harmonic Minor, Phrygian, Locrian)
- [ ] Add E2E tests for key independence (all 12 keys)
- [ ] Verify backward compatibility with existing notation modes (English, German, Romance)

## Risks and Mitigations

### Risk 1: Breaking existing chromatic scale display

**Mitigation**: The chromatic scale (12 notes) still needs fixed syllables. Check for `this.Name === "Chromatic"` and use the existing chromatic mapping as fallback.

### Risk 2: Custom scales without `numbers` arrays

**Mitigation**: If `this.Recipe.numbers` is undefined or empty, fall back to chromatic syllable mapping (current behavior).

### Risk 3: Performance degradation from lookups

**Mitigation**: The mapping table is a simple object lookup (O(1)), and the function runs once per scale generation. Performance impact is negligible compared to existing calculation overhead.

## Success Metrics

1. **Correctness**: All 4 specified scales (Natural Minor, Harmonic Minor, Phrygian, Locrian) display correct syllables
2. **Completeness**: All 7 modes + 3 minor variants display pedagogically correct syllables
3. **Key Independence**: Syllables identical across all 12 chromatic keys for each scale
4. **Performance**: <50ms syllable update (already met by current implementation)
5. **Backward Compatibility**: English, German, Romance notation modes unaffected
6. **Test Coverage**: 100% coverage of new syllable mapping logic

## Conclusion

The fix requires a conceptual shift from chromatic-position-based syllables to scale-degree-based syllables. By leveraging the existing `numbers` arrays in scale definitions and creating a simple lookup table, we can implement movable-do solfege correctly while maintaining simplicity, testability, and backward compatibility.

The approach is pedagogically sound (follows standard movable-do practice), technically elegant (pure function with clear inputs/outputs), and maintainable (centralized mapping, no duplication across scales).
