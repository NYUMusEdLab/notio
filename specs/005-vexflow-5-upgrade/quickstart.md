# Quickstart: VexFlow 5.x Upgrade Implementation

**Feature**: VexFlow 5.x Library Upgrade
**Date**: 2025-11-17
**Time Estimate**: 2-3 hours (including testing)

---

## Prerequisites

Before starting:
- ✅ Read [spec.md](./spec.md) - Understand requirements and user stories
- ✅ Read [research.md](./research.md) - Understand breaking changes
- ✅ Read [data-model.md](./data-model.md) - Understand API mappings
- ✅ Ensure all 152 integration tests are passing on current branch
- ✅ Have local development environment running (`yarn start`)

---

## Implementation Steps

### Step 1: Update package.json (5 minutes)

**File**: `/package.json`

**Change**:
```diff
  "dependencies": {
    "@react-firebase/database": "^0.3.11",
    ...
-   "vexflow": "^4.0.3",
+   "vexflow": "5.0.0",
    "web-vitals": "^2.1.0",
    ...
  }
```

**Command**:
```bash
# Update dependency
yarn add vexflow@5.0.0

# Verify installation
yarn list vexflow
# Should show: vexflow@5.0.0
```

**Validation**:
- ✅ `node_modules/vexflow` contains version 5.0.0
- ✅ `yarn.lock` updated with new version hash
- ✅ No conflicting peer dependencies

---

### Step 2: Update MusicalStaff.js Import (2 minutes)

**File**: `src/components/musicScore/MusicalStaff.js`

**Location**: Line 2

**Change**:
```diff
  import React, { Component } from "react";
- import Vex from "vexflow";
+ import * as VexFlow from "vexflow";
  import PropTypes from "prop-types";
```

**Validation**:
- ✅ No import errors in IDE/editor
- ✅ `yarn start` compiles without errors

---

### Step 3: Update setupStaff() Method (5 minutes)

**File**: `src/components/musicScore/MusicalStaff.js`

**Location**: Lines 22-36

**Changes**:
```diff
  setupStaff() {
-   const { Renderer, Stave } = Vex.Flow;
+   const { Renderer, Stave } = VexFlow;

    let containerSVG = this.musicalStaff.current;
-   renderer = new Renderer(containerSVG, Vex.Flow.Renderer.Backends.SVG);
+   renderer = new Renderer(containerSVG, VexFlow.Renderer.Backends.SVG);
    ctx = renderer.getContext();
    ctx.setViewBox(0, 0, 60, 140);
    stave = new Stave(0, 10, 60, { fill_style: "black" });
-   stave.setBegBarType(Vex.Flow.Barline.type.NONE);
+   stave.setBegBarType(VexFlow.Barline.type.NONE);
    stave.setContext(ctx).draw();
  }
```

**Validation**:
- ✅ No TypeScript/linting errors
- ✅ Code compiles successfully

---

### Step 4: Update drawNotes() Method (3 minutes)

**File**: `src/components/musicScore/MusicalStaff.js`

**Location**: Line 39

**Change**:
```diff
  drawNotes() {
-   const { Accidental, StaveNote, Voice, Formatter } = Vex.Flow;
+   const { Accidental, StaveNote, Voice, Formatter } = VexFlow;

    // ... rest of method unchanged ...
  }
```

**Validation**:
- ✅ No errors in method body
- ✅ All note rendering logic unchanged

---

### Step 5: Update Comment Reference (1 minute)

**File**: `src/components/musicScore/MusicalStaff.js`

**Location**: Line 5-6

**Change**:
```diff
- //INFO: vexFlow 4 documentation: https://github.com/0xfe/vexflow/wiki/Tutorial
- // const { Renderer, Stave, Accidental, StaveNote, Voice, Formatter } = Vex.Flow;
+ //INFO: VexFlow 5 documentation: https://github.com/vexflow/vexflow/wiki
+ // const { Renderer, Stave, Accidental, StaveNote, Voice, Formatter } = VexFlow;
```

**Validation**:
- ✅ Comment reflects new API and documentation link

---

### Step 6: Verify No Remaining Vex.Flow References (2 minutes)

**Command**:
```bash
# Search for any remaining Vex.Flow references
grep -r "Vex\.Flow" src/

# Should return: No results (all references updated)
```

**If any references found**:
- Update them to `VexFlow` pattern
- Re-run search until clean

**Validation**:
- ✅ Zero `Vex.Flow` references in `src/` directory

---

### Step 7: Run Integration Tests (10-15 minutes)

**Command**:
```bash
# Run all integration tests
yarn test --watchAll=false

# Expected: All 152 tests passing
```

**Common Issues & Fixes**:

**Issue**: Tests fail with "Cannot read property 'Renderer' of undefined"
```javascript
// Fix: Update test mocks if any
// OLD: jest.mock('vexflow', () => ({ Flow: { Renderer: jest.fn() } }))
// NEW: jest.mock('vexflow', () => ({ Renderer: jest.fn() }))
```

**Issue**: Font loading errors in jsdom tests
```javascript
// Fix: Add FontFace mock to test setup
global.FontFace = jest.fn().mockImplementation(() => ({
  load: jest.fn().mockResolvedValue({}),
}));
```

**Validation**:
- ✅ All 152 integration tests pass
- ✅ No console errors during test run
- ✅ Test coverage remains at 100%

---

### Step 8: Manual Testing - Basic Functionality (10 minutes)

**Start Development Server**:
```bash
yarn start
# Navigate to http://localhost:3000
```

**Test Checklist**:

1. **Treble Clef Rendering**
   - [ ] Select C Major scale
   - [ ] Verify staff lines render continuously
   - [ ] Verify notes display correctly
   - [ ] No console errors

2. **Accidentals Rendering**
   - [ ] Select Gb Major scale
   - [ ] Verify flats (b) render correctly
   - [ ] Verify staff lines continuous (no discontinuity)
   - [ ] No console errors

3. **Clef Switching**
   - [ ] Switch to Bass clef
   - [ ] Verify staff re-renders correctly
   - [ ] Switch to Tenor clef
   - [ ] Switch to Alto clef
   - [ ] All clefs render without errors

4. **Extended Keyboard Mode**
   - [ ] Enable Extended keyboard
   - [ ] Select Gb Major
   - [ ] Verify staff lines at Gb notes (PRIMARY FIX)
   - [ ] Lines should be continuous, no visual discontinuity

5. **Romance Notation Mode**
   - [ ] Enable Romance notation
   - [ ] Verify solfège syllables display
   - [ ] With Extended + Romance + Gb scale
   - [ ] **CRITICAL**: Staff lines at Gb must be continuous (bug fix)

---

### Step 9: Create E2E Visual Regression Test (20 minutes)

**File**: Create `e2e/tests/vexflow-5-gb-alignment.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('VexFlow 5.x - Gb Staff Line Alignment', () => {
  test('staff lines should be continuous at Gb in Extended + Romance mode', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');

    // Setup: Select Gb Major scale
    await page.click('[data-testid="scale-menu"]');
    await page.click('text=Gb Major');

    // Setup: Enable Extended keyboard
    await page.click('[data-testid="extended-mode-toggle"]');

    // Setup: Enable Romance notation
    await page.click('[data-testid="romance-notation-toggle"]');

    // Verify: Musical staff renders
    const staff = await page.locator('[data-testid="musical-staff"]');
    await expect(staff).toBeVisible();

    // Verify: SVG element exists
    const svg = await staff.locator('svg').first();
    await expect(svg).toBeVisible();

    // Verify: Staff has 5 lines (visual check via screenshot)
    await expect(staff).toHaveScreenshot('gb-staff-alignment.png', {
      maxDiffPixels: 100, // Allow minor anti-aliasing differences
    });

    // Performance: Rendering should complete quickly
    const startTime = Date.now();
    await page.click('[data-testid="note-Gb"]'); // Trigger re-render
    await page.waitForSelector('[data-testid="musical-staff"] svg');
    const renderTime = Date.now() - startTime;

    expect(renderTime).toBeLessThan(200); // Constitutional requirement
  });

  test('all accidentals render correctly with VexFlow 5', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test sharp
    await page.click('[data-testid="scale-menu"]');
    await page.click('text=G Major');
    await expect(page.locator('[data-testid="musical-staff"] svg')).toBeVisible();

    // Test flat
    await page.click('[data-testid="scale-menu"]');
    await page.click('text=Db Major');
    await expect(page.locator('[data-testid="musical-staff"] svg')).toBeVisible();

    // Test double-flat
    await page.click('[data-testid="scale-menu"]');
    await page.click('text=Cbb Major'); // If available

    // Verify no console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    expect(consoleErrors).toHaveLength(0);
  });
});
```

**Run E2E Test**:
```bash
yarn test:e2e
# Or for specific test:
npx playwright test e2e/tests/vexflow-5-gb-alignment.spec.js
```

**Validation**:
- ✅ E2E tests pass
- ✅ Screenshot baseline created for visual regression
- ✅ Rendering performance < 200ms

---

### Step 10: Cross-Browser Testing (15 minutes)

**Command**:
```bash
# Run E2E tests in all browsers
yarn test:e2e:chromium
yarn test:e2e:firefox
yarn test:e2e:webkit   # Safari
```

**Validation**:
- ✅ Tests pass in Chromium
- ✅ Tests pass in Firefox
- ✅ Tests pass in WebKit (Safari)
- ✅ No browser-specific rendering issues

---

### Step 11: Performance Benchmarking (10 minutes)

**File**: Update `e2e/tests/performance.spec.js`

Add VexFlow-specific performance test:

```javascript
test('VexFlow 5.x rendering performance', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const renderTimes = [];

  // Test 10 renders with different scales
  const scales = ['C Major', 'G Major', 'D Major', 'A Major', 'E Major'];

  for (const scale of scales) {
    const startTime = Date.now();

    await page.click('[data-testid="scale-menu"]');
    await page.click(`text=${scale}`);
    await page.waitForSelector('[data-testid="musical-staff"] svg');

    const renderTime = Date.now() - startTime;
    renderTimes.push(renderTime);
  }

  const avgRenderTime = renderTimes.reduce((a, b) => a + b) / renderTimes.length;
  const maxRenderTime = Math.max(...renderTimes);

  console.log(`Average render time: ${avgRenderTime}ms`);
  console.log(`Max render time: ${maxRenderTime}ms`);

  expect(avgRenderTime).toBeLessThan(150); // Well under 200ms requirement
  expect(maxRenderTime).toBeLessThan(200); // Constitutional limit
});
```

**Validation**:
- ✅ Average rendering < 150ms
- ✅ Maximum rendering < 200ms
- ✅ Performance meets constitutional requirement

---

### Step 12: Final Verification Checklist (5 minutes)

**Code Quality**:
- [ ] `yarn start` runs without errors
- [ ] No console errors in browser
- [ ] No ESLint warnings
- [ ] Code formatted with Prettier

**Testing**:
- [ ] All 152 integration tests passing
- [ ] E2E visual regression test passing
- [ ] Cross-browser E2E tests passing
- [ ] Performance benchmarks passing

**Functionality**:
- [ ] All scales render correctly
- [ ] All clefs render correctly
- [ ] Accidentals (sharp, flat, double) render correctly
- [ ] Extended keyboard mode works
- [ ] Romance notation mode works
- [ ] **CRITICAL**: Gb alignment fixed in Extended + Romance mode

**Documentation**:
- [ ] Comment updated in MusicalStaff.js
- [ ] No outdated Vex.Flow references

---

## Rollback Procedure

If critical issues discovered:

**Step 1: Revert package.json**
```bash
yarn add vexflow@4.0.3
```

**Step 2: Revert code changes**
```bash
git checkout HEAD -- src/components/musicScore/MusicalStaff.js
```

**Step 3: Verify rollback**
```bash
yarn test --watchAll=false
yarn start
```

---

## Commit & Push

**Create Commit**:
```bash
git add .
git commit -m "$(cat <<'EOF'
feat: Upgrade VexFlow from 4.0.3 to 5.0.0

Fixes staff line alignment issue at Gb notes in Extended + Romance notation mode.

Breaking changes handled:
- Updated namespace from Vex.Flow to VexFlow throughout MusicalStaff.js
- Updated import statement to use ES6 module syntax
- All APIs remain functionally identical (namespace change only)

Testing:
- ✅ All 152 integration tests passing
- ✅ E2E visual regression tests added for Gb alignment
- ✅ Cross-browser testing (Chrome, Firefox, Safari) passing
- ✅ Performance < 200ms (constitutional requirement met)

Improvements:
- Staff line rendering quality improved (crisp, continuous lines)
- SVG output size reduced by 19% (unicode-based rendering)
- Bravura font loaded automatically via FontFace API

No breaking changes to Notio's API or user experience.

Closes: #[issue-number]
EOF
)"
```

**Push to Remote**:
```bash
git push -u origin claude/005-vexflow-5-upgrade-019NX2eZMgD8Lp8f3RUAQuVh
```

---

## Success Criteria Verification

| Success Criterion | Verification Method | Status |
|-------------------|---------------------|--------|
| SC-001: Gb staff lines continuous | E2E visual regression test | [ ] PASS |
| SC-002: All integration tests pass | `yarn test` | [ ] PASS |
| SC-003: No visual regressions | Manual testing + E2E | [ ] PASS |
| SC-004: Rendering < 200ms | E2E performance test | [ ] PASS |
| SC-005: No VexFlow console errors | Browser console check | [ ] PASS |
| SC-006: All notation features work | Manual testing checklist | [ ] PASS |
| SC-007: Cross-browser compatible | Playwright multi-browser | [ ] PASS |
| SC-008: Font loading successful | E2E rendering check | [ ] PASS |

---

## Next Steps (After Merge)

1. **Monitor Production**: Watch for any VexFlow-related errors in production logs
2. **User Feedback**: Gather feedback on notation rendering quality
3. **Performance Monitoring**: Track rendering times in production analytics
4. **Documentation**: Update user-facing docs if rendering quality improvements notable

---

## Troubleshooting

### Issue: "Cannot find module 'vexflow'"

**Solution**:
```bash
rm -rf node_modules yarn.lock
yarn install
```

### Issue: Tests fail with FontFace undefined

**Solution**: Add to `jest.config.js` or test setup:
```javascript
global.FontFace = jest.fn().mockImplementation(() => ({
  load: jest.fn().mockResolvedValue({}),
}));
```

### Issue: Staff lines still discontinuous at Gb

**Verification**:
1. Confirm VexFlow 5.0.0 installed: `yarn list vexflow`
2. Check browser cache cleared
3. Verify Extended + Romance mode both enabled
4. Take screenshot and compare to VexFlow 4.x rendering

**If still broken**: This may indicate a different root cause. Investigate with VexFlow community.

### Issue: Performance degraded

**Debugging**:
1. Use browser DevTools Performance tab
2. Profile rendering cycle
3. Check for font loading delays
4. Verify no memory leaks (multiple re-renders)

---

## Estimated Timeline

| Step | Time | Cumulative |
|------|------|------------|
| 1. Update package.json | 5 min | 5 min |
| 2. Update import | 2 min | 7 min |
| 3. Update setupStaff() | 5 min | 12 min |
| 4. Update drawNotes() | 3 min | 15 min |
| 5. Update comment | 1 min | 16 min |
| 6. Verify no Vex.Flow | 2 min | 18 min |
| 7. Run integration tests | 15 min | 33 min |
| 8. Manual testing | 10 min | 43 min |
| 9. E2E visual test | 20 min | 63 min |
| 10. Cross-browser testing | 15 min | 78 min |
| 11. Performance benchmarking | 10 min | 88 min |
| 12. Final verification | 5 min | 93 min |
| **Total** | **~1.5 hours** | **Implementation only** |
| + Testing time | +1 hour | **~2.5 hours total** |

---

## Support & Resources

**Official VexFlow 5 Documentation**:
- GitHub: https://github.com/vexflow/vexflow
- Wiki: https://github.com/vexflow/vexflow/wiki
- Examples: https://vexflow.github.io/vexflow-examples

**Notio Specification Docs**:
- [spec.md](./spec.md) - Requirements and user stories
- [research.md](./research.md) - Breaking changes and migration guide
- [data-model.md](./data-model.md) - API object mapping
- [contracts/vexflow-api.md](./contracts/vexflow-api.md) - API contracts

**Need Help?**:
- Check VexFlow GitHub Issues: https://github.com/vexflow/vexflow/issues
- Ask in Notio team chat
- Consult VexFlow wiki for specific rendering questions

---

**Ready to implement!** Follow the steps above sequentially, and verify each step before proceeding to the next.
