# Quickstart: Testing Relative NoteNames Fix

**Feature**: Fix Relative NoteNames for Scales and Modes
**Branch**: 004-fix-relative-notenames
**Date**: 2025-11-30

## Quick Manual Test (1 minute)

### Test Natural Minor in Multiple Keys

1. **Open Notio**: `npm start` or visit deployed site
2. **Select Natural Minor** from scale menu
3. **Enable Relative notation** from notation menu
4. **Verify syllables**: Should see `DO RE ME FA SO LE TE`
   - ✅ **Correct**: 6th degree shows **LE** (not SI or LA)
   - ✅ **Correct**: 7th degree shows **TE** (not TI)
5. **Change key to C#**: Click root note selector → select C#
6. **Verify syllables again**: Should STILL see `DO RE ME FA SO LE TE`
   - ✅ **Key independence**: Pattern identical regardless of key
7. **Try multiple keys** (A, E, D, F#): All should show same pattern

**Expected**: Syllables stay consistent across all keys
**Bug (before fix)**: Syllables would change with key changes

### Test All Four Specified Scales

| Scale | Expected Syllables | Key Test |
|-------|-------------------|----------|
| Natural Minor | DO RE ME FA SO LE TE | ✅ Check in C, C#, A |
| Harmonic Minor | DO RE ME FA SO LE TI | ✅ 7th degree is TI (not TE) |
| Phrygian | DO RA ME FA SO LE TE | ✅ 2nd degree is RA (not RE) |
| Locrian | DO RA ME FA SE LE TE | ✅ 5th degree is SE (not SO) |

## Automated Test Commands

### Integration Tests

```bash
# Run all integration tests
npm test -- relative-notenames.test.js

# Run with coverage
npm test -- --coverage relative-notenames.test.js

# Watch mode (during development)
npm test -- --watch relative-notenames.test.js
```

**Expected output**:
```
PASS  src/__integration__/relative-notenames.test.js
  ✓ Natural Minor shows correct syllables (DO RE ME FA SO LE TE)
  ✓ Harmonic Minor shows TI for 7th degree
  ✓ Phrygian shows RA for 2nd degree
  ✓ Locrian shows SE for 5th degree and RA for 2nd
  ✓ Natural Minor identical across all 12 keys
  ✓ Dorian shows LA TE pattern
  ✓ Lydian shows FI for raised 4th
  ✓ Mixolydian shows LA TE pattern
  ✓ Melodic Minor shows LA TI pattern
  ✓ Major shows DO RE MI FA SO LA TI

Tests: 10 passed, 10 total
Coverage: 100% statements, 100% branches
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e -- relative-notenames.spec.js

# Run in headed mode (see browser)
npm run test:e2e:headed -- relative-notenames.spec.js

# Run specific browser
npm run test:e2e:chromium -- relative-notenames.spec.js
```

**Expected output**:
```
Running 4 tests using 1 worker

  ✓ Natural Minor in all 12 keys shows consistent syllables (3.2s)
  ✓ Harmonic Minor in all 12 keys shows consistent syllables (3.1s)
  ✓ Phrygian in all 12 keys shows consistent syllables (2.9s)
  ✓ Locrian in all 12 keys shows consistent syllables (3.0s)

4 passed (12.2s)
```

### Full Test Suite

```bash
# Run ALL tests (integration + E2E + existing tests)
npm test && npm run test:e2e

# CI mode (no watch, coverage required)
npm run test-ci && npm run test:e2e
```

## Manual Testing Checklist

### Basic Functionality

- [ ] **Natural Minor in C**: Shows DO RE ME FA SO LE TE
- [ ] **Natural Minor in C#**: Shows DO RE ME FA SO LE TE (identical to C)
- [ ] **Natural Minor in A**: Shows DO RE ME FA SO LE TE (identical to C)
- [ ] **Harmonic Minor in C**: Shows DO RE ME FA SO LE TI (7th is TI not TE)
- [ ] **Phrygian in C**: Shows DO RA ME FA SO LE TE (2nd is RA not RE)
- [ ] **Locrian in C**: Shows DO RA ME FA SE LE TE (2nd is RA, 5th is SE)

### Key Independence (Critical)

- [ ] **Natural Minor in all 12 keys**: C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B
  - All should show: DO RE ME FA SO LE TE
- [ ] **Enharmonic equivalents identical**:
  - C# minor vs Db minor: same syllables
  - F# minor vs Gb minor: same syllables
  - G# minor vs Ab minor: same syllables
  - A# minor vs Bb minor: same syllables

### Additional Modes

- [ ] **Dorian in C**: Shows DO RE ME FA SO LA TE (6th is LA, 7th is TE)
- [ ] **Lydian in C**: Shows DO RE MI FI SO LA TI (4th is FI, 7th is TI)
- [ ] **Mixolydian in C**: Shows DO RE MI FA SO LA TE (3rd is MI, 7th is TE)
- [ ] **Melodic Minor in C**: Shows DO RE ME FA SO LA TI (6th is LA, 7th is TI)
- [ ] **Major (Ionian) in C**: Shows DO RE MI FA SO LA TI (baseline reference)

### Multi-Octave Scales

- [ ] **Natural Minor spanning 2 octaves**: Pattern repeats (DO RE ME FA SO LE TE DO RE ME FA SO LE TE)
- [ ] **Natural Minor spanning 3 octaves**: Pattern repeats correctly
- [ ] **Partial octaves**: Syllables correct at boundaries

### Backward Compatibility

- [ ] **English notation still works**: C D Eb F G Ab Bb (unchanged)
- [ ] **German notation still works**: C D Eb F G Ab B (unchanged)
- [ ] **Romance notation still works**: Do Re Mib Fa Sol Lab Sib (unchanged)
- [ ] **Scale Steps still works**: 1 2 b3 4 5 b6 7 (unchanged)
- [ ] **Chord Extensions still works**: (unchanged)

### Edge Cases

- [ ] **Chromatic scale**: Still shows chromatic relative syllables (DO DI/RA RE RI/ME MI FA FI/SE SO SI/LE LA LI/TE TI)
- [ ] **Major Pentatonic**: Shows DO RE MI SO LA (5-note subset)
- [ ] **Minor Pentatonic**: Shows DO ME FA SO TE (5-note subset)
- [ ] **Switching notation modes mid-use**: No errors, updates correctly

### Performance

- [ ] **Scale change <50ms**: Syllables update instantly on scale change
- [ ] **Key change <50ms**: Syllables update instantly on key change
- [ ] **No visual flicker**: Smooth transitions, no layout shifts

## Debugging Tips

### If syllables are wrong for a specific scale:

1. **Check the scale definition** in `src/data/scalesObj.js`
   - Verify `numbers` array is correct
   - Example: Natural Minor should have `["1", "2", "b3", "4", "5", "b6", "7"]`

2. **Check syllable mapping** in `src/Model/MusicScale.js`
   - Verify `SCALE_DEGREE_TO_SYLLABLE` includes all degrees used
   - Check for typos in degree strings (e.g., "b6" not "♭6")

3. **Check console for errors**:
   ```javascript
   console.log("Scale numbers:", this.Recipe.numbers);
   console.log("Generated syllables:", syllables);
   ```

### If syllables change across keys:

1. **This indicates the bug is NOT fixed**
   - Syllables should be identical for same scale in different keys
   - Check that `makeRelativeScaleSyllables()` uses `scaleNumbers` (degree-based) NOT `steps` (chromatic)

2. **Verify transposition isn't affecting syllables**:
   ```javascript
   console.log("Root note:", this.RootNoteName);
   console.log("Transposition:", this.Transposition);
   console.log("Syllables:", theScale["Relative"]);
   ```

### If tests fail:

1. **Check test expectations match spec**:
   - Natural Minor: `["DO", "RE", "ME", "FA", "SO", "LE", "TE"]`
   - Harmonic Minor: `["DO", "RE", "ME", "FA", "SO", "LE", "TI"]`
   - Phrygian: `["DO", "RA", "ME", "FA", "SO", "LE", "TE"]`
   - Locrian: `["DO", "RA", "ME", "FA", "SE", "LE", "TE"]`

2. **Verify test is using correct scale name**:
   - Scale names MUST match exactly: "Natural Minor/Aeolian", "Harmonic Minor", "Phrygian", "Locrian"

3. **Check test is using Relative notation**:
   - Tests must include "Relative" in notations array: `notations: [..., "Relative"]`

## Success Criteria Verification

After implementation, verify these success criteria from spec.md:

- [ ] **SC-001**: Students identify scale degrees correctly using syllables
- [ ] **SC-002**: Teachers report zero solfege confusion
- [ ] **SC-003**: All modes display pedagogically correct syllables
- [ ] **SC-004**: Updates complete in <50ms (measure with DevTools Performance tab)
- [ ] **SC-005**: 100% accuracy across all 12 keys (test all keys for all scales)

## Common Pitfalls

### ❌ Don't: Map syllables to chromatic positions
```javascript
// WRONG - chromatic-based
syllables.map((step) => notes[step % 12].note_relative)
```

### ✅ Do: Map syllables to scale degrees
```javascript
// CORRECT - degree-based
syllables.map((step, idx) => DEGREE_TO_SYLLABLE[scaleNumbers[idx % scaleNumbers.length]])
```

### ❌ Don't: Hardcode syllables for specific scales
```javascript
// WRONG - not maintainable
if (scaleName === "Natural Minor") return ["DO", "RE", "ME", "FA", "SO", "LE", "TE"];
```

### ✅ Do: Derive syllables from scale degrees
```javascript
// CORRECT - works for all scales
return scaleNumbers.map(degree => DEGREE_TO_SYLLABLE[degree]);
```

## Quick Reference: Expected Syllables

| Scale/Mode | Syllables | Key Degrees |
|------------|-----------|-------------|
| Major (Ionian) | DO RE MI FA SO LA TI | 1 2 3 4 5 6 △7 |
| Natural Minor | DO RE ME FA SO LE TE | 1 2 b3 4 5 b6 7 |
| Harmonic Minor | DO RE ME FA SO LE TI | 1 2 b3 4 5 b6 △7 |
| Melodic Minor | DO RE ME FA SO LA TI | 1 2 b3 4 5 6 △7 |
| Dorian | DO RE ME FA SO LA TE | 1 2 b3 4 5 6 7 |
| Phrygian | DO RA ME FA SO LE TE | 1 b2 b3 4 5 b6 7 |
| Lydian | DO RE MI FI SO LA TI | 1 2 3 #4 5 6 △7 |
| Mixolydian | DO RE MI FA SO LA TE | 1 2 3 4 5 6 7 |
| Locrian | DO RA ME FA SE LE TE | 1 b2 b3 4 b5 b6 7 |

## Next Steps

After testing:
1. If all tests pass → Ready for PR review
2. If tests fail → Debug using tips above, check data-model.md for implementation details
3. If new edge cases found → Add tests to cover them
4. If performance issues → Profile with Chrome DevTools, optimize lookups

## Resources

- [Feature Spec](./spec.md) - Complete requirements and acceptance criteria
- [Data Model](./data-model.md) - Entity structures and validation rules
- [Research](./research.md) - Technical decisions and solfege pedagogy
- [Implementation Plan](./plan.md) - Detailed technical approach
