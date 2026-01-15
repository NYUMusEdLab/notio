# Quickstart: Fix Relative Notation to Use Scale Steps

**Feature**: 004-fix-relative-notation
**Estimated Time**: 1-2 hours implementation + 2-3 hours testing

## Problem Summary

The Relative notation system currently maps semitone steps to solfège syllables, causing enharmonic equivalents to display identically. For example:
- Lydian's #4 (raised fourth) incorrectly shows as "SE" (flatted fifth)
- Locrian's b5 (flatted fifth) incorrectly shows as "FI" (raised fourth)

This confuses music students learning movable-do solfège and enharmonic relationships.

## Solution Summary

**Key Insight**: Use the `numbers` property from scaleRecipe to map directly to Relative noteNames - **no need to use semitones**.

Replace semitone-based mapping with scale degree-based mapping using a simple lookup dictionary:
1. The `scaleRecipe.numbers` array contains scale degree strings (e.g., "#4", "b5", "△7")
2. We iterate through scale positions and look up `numbers[position]` in the dictionary
3. The dictionary maps scale degree strings directly to relative syllables (e.g., "#4" → "FI", "b5" → "SE")
4. **Semitones are completely bypassed** - we never convert semitone values to syllables (except for Chromatic scale special case)

## Quick Implementation Guide

### Step 1: Locate the Code (2 minutes)

**File**: `src/Model/MusicScale.js`
**Method**: `BuildExtendedScaleToneNames()`
**Line**: ~315-318 (in switch statement, case "Relative")

### Step 2: Add the Dictionary (5 minutes)

Add this constant inside the "Relative" case, before the logic:

```javascript
case "Relative":
  const SCALE_DEGREE_TO_RELATIVE = {
    "1": "DO", "#1": "DI", "b2": "RA", "b9": "RA",
    "2": "RE", "9": "RE", "#2": "RI", "#9": "RI", "b3": "ME",
    "3": "MI",
    "4": "FA", "11": "FA", "#4": "FI", "#11": "FI", "b5": "SE",
    "5": "SO", "#5": "SI", "b6": "LE", "b13": "LE",
    "6": "LA", "13": "LA", "#6": "LI", "b7": "TE",
    "7": "TI", "△7": "TI"
  };
```

### Step 3: Modify the Logic (10 minutes)

Replace the existing mapping logic with this **direct numbers mapping approach**:

```javascript
if (this.Name === "Chromatic") {
  // Keep existing chromatic scale logic (uses semitones)
  theScale["Relative"] = semiToneSteps.map(
    (step) => notes[step % notes.length].note_relative
  );
} else {
  // NEW: Use scaleRecipe.numbers → dictionary mapping (bypasses semitones!)
  let length = this.Recipe.numbers.length;
  let relative = this.findScaleStartIndexRelativToRoot(
    this.ExtendedScaleSteps,
    ScaleStepNumbers.length
  );

  theScale["Relative"] = semiToneSteps.map((step, index) => {
    // Get scale degree from numbers array (e.g., "#4", "b5")
    const scaleDegree = ScaleStepNumbers[(index + relative) % length];

    // Map scale degree → syllable via dictionary (NO semitone calculation!)
    return SCALE_DEGREE_TO_RELATIVE[scaleDegree] ||
           notes[step % notes.length].note_relative; // Fallback to semitone if missing
  });
}
break;
```

**What this does**:
- Iterates `semiToneSteps.length` times (to get correct extended scale length)
- For each position, gets the scale degree from `ScaleStepNumbers` (which is `Recipe.numbers`)
- Looks up that degree string in the dictionary
- **Never converts semitone to syllable** - we use `step` only as a fallback for missing dictionary entries

### Step 4: Manual Verification (5 minutes)

1. Run the app: `npm start` (or `yarn start`)
2. Open in browser: http://localhost:3000
3. Select "Lydian" scale from Scale menu
4. Enable "Relative" notation from Notation menu
5. Verify the scale displays: **DO, RE, MI, FI, SO, LA, TI** (FI at position 4, not SE)
6. Select "Locrian" scale
7. Verify: **DO, RA, ME, FA, SE, LE, TE** (SE at position 5, not FI)

### Step 5: Write Integration Tests (30-45 minutes)

Create `tests/integration/relative-notation.test.js`:

```javascript
import MusicScale from '../../src/Model/MusicScale';
import scales from '../../src/data/scalesObj';

describe('Relative Notation - Scale Degree Mapping', () => {
  test('Lydian scale shows FI for #4 (not SE)', () => {
    const lydianRecipe = scales.find(s => s.name === 'Lydian');
    const scale = new MusicScale(lydianRecipe, 'C', 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual(
      ['DO', 'RE', 'MI', 'FI', 'SO', 'LA', 'TI']
    );
  });

  test('Locrian scale shows SE for b5 (not FI)', () => {
    const locrianRecipe = scales.find(s => s.name === 'Locrian');
    const scale = new MusicScale(locrianRecipe, 'C', 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual(
      ['DO', 'RA', 'ME', 'FA', 'SE', 'LE', 'TE']
    );
  });

  test('All scales use correct syllables for their degrees', () => {
    const testCases = [
      { name: 'Major (Ionian)', expected: ['DO', 'RE', 'MI', 'FA', 'SO', 'LA', 'TI'] },
      { name: 'Phrygian', expected: ['DO', 'RA', 'ME', 'FA', 'SO', 'LE', 'TE'] },
      { name: 'Dorian', expected: ['DO', 'RE', 'ME', 'FA', 'SO', 'LA', 'TE'] },
      // Add more scales...
    ];

    testCases.forEach(({ name, expected }) => {
      const recipe = scales.find(s => s.name === name);
      const scale = new MusicScale(recipe, 'C', 0, 12);
      expect(scale.ExtendedScaleToneNames.Relative).toEqual(expected);
    });
  });

  test('Chromatic scale unchanged (uses semitone logic)', () => {
    const chromaticRecipe = scales.find(s => s.name === 'Chromatic');
    const scale = new MusicScale(chromaticRecipe, 'C', 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual(
      ['DO', 'DI', 'RE', 'RI', 'MI', 'FA', 'FI', 'SO', 'SI', 'LA', 'LI', 'TI']
    );
  });

  test('Extended scales repeat pattern correctly', () => {
    const majorRecipe = scales.find(s => s.name === 'Major (Ionian)');
    const scale = new MusicScale(majorRecipe, 'C', 0, 24); // 2 octaves

    const expected = [
      'DO', 'RE', 'MI', 'FA', 'SO', 'LA', 'TI',  // First octave
      'DO', 'RE', 'MI', 'FA', 'SO', 'LA', 'TI'   // Second octave
    ];
    expect(scale.ExtendedScaleToneNames.Relative).toEqual(expected);
  });
});
```

### Step 6: Write E2E Tests (30-45 minutes)

Create `tests/e2e/notation-switching.spec.js` (Playwright):

```javascript
import { test, expect } from '@playwright/test';

test.describe('Relative Notation User Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Lydian scale shows FI for raised fourth', async ({ page }) => {
    // Select Lydian scale
    await page.click('[aria-label="Scale menu"]');
    await page.click('text=Lydian');

    // Enable Relative notation
    await page.click('[aria-label="Notation menu"]');
    await page.click('text=Relative');

    // Verify display
    const syllables = await page.locator('.scale-note .notation').allTextContents();
    expect(syllables).toEqual(['DO', 'RE', 'MI', 'FI', 'SO', 'LA', 'TI']);
  });

  test('Locrian scale shows SE for flatted fifth', async ({ page }) => {
    await page.click('[aria-label="Scale menu"]');
    await page.click('text=Locrian');

    await page.click('[aria-label="Notation menu"]');
    await page.click('text=Relative');

    const syllables = await page.locator('.scale-note .notation').allTextContents();
    expect(syllables).toEqual(['DO', 'RA', 'ME', 'FA', 'SE', 'LE', 'TE']);
  });

  test('Notation switching preserves correctness', async ({ page }) => {
    await page.click('[aria-label="Scale menu"]');
    await page.click('text=Lydian');

    // Toggle to Relative
    await page.click('[aria-label="Notation menu"]');
    await page.click('text=Relative');
    let syllables = await page.locator('.scale-note .notation').allTextContents();
    expect(syllables[3]).toBe('FI');

    // Toggle to English
    await page.click('[aria-label="Notation menu"]');
    await page.click('text=English');
    const notes = await page.locator('.scale-note .notation').allTextContents();
    expect(notes[3]).toBe('F#');  // Lydian C has F# as fourth note

    // Toggle back to Relative
    await page.click('[aria-label="Notation menu"]');
    await page.click('text=Relative');
    syllables = await page.locator('.scale-note .notation').allTextContents();
    expect(syllables[3]).toBe('FI');  // Still correct after switching
  });
});
```

### Step 7: Run Tests (10 minutes)

```bash
# Run integration tests
npm test -- relative-notation

# Run E2E tests
npm run test:e2e -- notation-switching

# Run all tests
npm test && npm run test:e2e

# Check coverage
npm run test:coverage
```

## Common Issues & Solutions

### Issue 1: Error Prefix Appearing

**Symptom**: Scale shows `ERR:△7` or similar

**Cause**: Dictionary missing an entry for a scale degree

**Solution**: Add the missing entry to SCALE_DEGREE_TO_RELATIVE dictionary

### Issue 2: Extended Scales Show Wrong Syllables

**Symptom**: Second octave shows different syllables than first

**Cause**: Modulo operation not working correctly with relative position

**Solution**: Verify `findScaleStartIndexRelativToRoot()` returns correct value. Debug with `console.log((index + relative) % length)`.

### Issue 3: Chromatic Scale Broken

**Symptom**: Chromatic scale doesn't show all 12 syllables

**Cause**: Forgot to preserve Chromatic special case

**Solution**: Ensure `if (this.Name === "Chromatic")` branch exists and uses old logic

## Verification Checklist

Before submitting PR:

- [ ] Lydian shows FI (not SE) for fourth degree
- [ ] Locrian shows SE (not FI) for fifth degree
- [ ] Phrygian shows RA for second degree (b2)
- [ ] All 14 existing scales display correctly
- [ ] Chromatic scale unchanged (shows all 12 chromatic syllables)
- [ ] Extended scales (2-3 octaves) repeat correctly
- [ ] Other notations (English, German, Romance) unaffected
- [ ] Notation switching works smoothly
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Code coverage at 100%

## Performance Check

Run performance benchmark (if exists):

```bash
npm run benchmark
```

Expected: No degradation. Dictionary lookup is O(1) same as array index.

## Documentation Updates

**Not required** - Internal bug fix with no user-facing API changes.

## Deployment

1. Create PR with title: `fix(notation): Use scale degrees for Relative notation instead of semitones`
2. Reference issue (if exists): `Fixes #XXX`
3. Ensure all CI checks pass
4. Request review from maintainer
5. Merge to master
6. Verify fix in production after deploy

## Estimated Timeline

- **Implementation**: 15-20 minutes
- **Manual Testing**: 5 minutes
- **Integration Tests**: 30-45 minutes
- **E2E Tests**: 30-45 minutes
- **Code Review**: 30-60 minutes
- **Total**: **2-3 hours**

## Resources

- [Movable-do Solfège Wikipedia](https://en.wikipedia.org/wiki/Solf%C3%A8ge#Movable_do_solf.C3.A8ge)
- [Enharmonic Equivalents](https://en.wikipedia.org/wiki/Enharmonic)
- [Lydian Mode](https://en.wikipedia.org/wiki/Lydian_mode)
- [Locrian Mode](https://en.wikipedia.org/wiki/Locrian_mode)
- Feature spec: [spec.md](./spec.md)
- Implementation plan: [plan.md](./plan.md)
- Data model: [data-model.md](./data-model.md)
- Method contract: [contracts/MusicScale-BuildExtendedScaleToneNames.md](./contracts/MusicScale-BuildExtendedScaleToneNames.md)

## Next Steps

After this feature is complete and merged:

1. Monitor for bug reports related to Relative notation
2. Consider adding user-facing tooltip explaining the difference between #4 and b5
3. Evaluate adding more chromatic scale degrees to dictionary (double sharps/flats) if needed
4. Consider extracting dictionary to separate data file if it grows beyond 20 entries

## Questions?

See [plan.md](./plan.md) for comprehensive design documentation or contact feature author.
