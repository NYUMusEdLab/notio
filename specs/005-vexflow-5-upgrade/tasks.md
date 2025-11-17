# Implementation Tasks: VexFlow 5.x Library Upgrade

**Feature**: VexFlow 5.x Library Upgrade
**Date**: 2025-11-17
**Branch**: `claude/plan-vexflow-update-01SS6ZpJ42hLeYNpniTogKou`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Task Overview

**Total Estimated Time**: 2-3 hours
**Priority**: P1 (Fixes critical Gb staff line alignment bug)
**Complexity**: LOW (namespace change only)

---

## Phase 1: Dependency Update (10 minutes)

### Task 1.1: Update VexFlow Dependency
**Priority**: P1 | **Estimate**: 5 minutes

**Description**: Update package.json to use VexFlow 5.0.0

**Steps**:
1. Update `package.json` line ~25: `"vexflow": "^4.0.3"` → `"vexflow": "5.0.0"`
2. Run `yarn install`
3. Verify installation: `yarn list vexflow`

**Acceptance Criteria**:
- [ ] `package.json` shows `"vexflow": "5.0.0"` (pinned, no `^`)
- [ ] `yarn.lock` updated with VexFlow 5.0.0 hash
- [ ] `node_modules/vexflow/package.json` shows version 5.0.0
- [ ] No dependency conflict errors

**Files Modified**:
- `package.json`
- `yarn.lock`

**Reference**: [quickstart.md Step 1](./quickstart.md#step-1-update-packagejson-5-minutes)

---

### Task 1.2: Verify Build with New Dependency
**Priority**: P1 | **Estimate**: 5 minutes

**Description**: Ensure application builds with VexFlow 5.0.0

**Steps**:
1. Run `yarn start`
2. Check for build errors
3. Verify app loads in browser
4. Check browser console for errors

**Acceptance Criteria**:
- [ ] `yarn start` completes without errors
- [ ] App loads at http://localhost:3000
- [ ] No VexFlow-related console errors (may have namespace errors - expected)
- [ ] Build process completes successfully

**Files Modified**: None

**Dependencies**: Task 1.1 complete

---

## Phase 2: Code Migration (20 minutes)

### Task 2.1: Update Import Statement
**Priority**: P1 | **Estimate**: 2 minutes

**Description**: Update VexFlow import to use ES6 module syntax

**Steps**:
1. Open `src/components/musicScore/MusicalStaff.js`
2. Line 2: Replace `import Vex from "vexflow";` with `import * as VexFlow from "vexflow";`
3. Save file

**Acceptance Criteria**:
- [ ] Line 2 shows `import * as VexFlow from "vexflow";`
- [ ] No ESLint errors on import line
- [ ] No TypeScript errors in IDE

**Files Modified**:
- `src/components/musicScore/MusicalStaff.js` (line 2)

**Reference**: [data-model.md Import Statement](./data-model.md#import-statement)

---

### Task 2.2: Update setupStaff() Method Namespace
**Priority**: P1 | **Estimate**: 5 minutes

**Description**: Replace Vex.Flow references with VexFlow in setupStaff()

**Steps**:
1. Open `src/components/musicScore/MusicalStaff.js`
2. Line 23: `const { Renderer, Stave } = Vex.Flow;` → `const { Renderer, Stave } = VexFlow;`
3. Line 26: `Vex.Flow.Renderer.Backends.SVG` → `VexFlow.Renderer.Backends.SVG`
4. Line 34: `Vex.Flow.Barline.type.NONE` → `VexFlow.Barline.type.NONE`
5. Save file

**Acceptance Criteria**:
- [ ] Line 23: `const { Renderer, Stave } = VexFlow;`
- [ ] Line 26: `VexFlow.Renderer.Backends.SVG`
- [ ] Line 34: `VexFlow.Barline.type.NONE`
- [ ] No `Vex.Flow` references remain in setupStaff()
- [ ] Method logic unchanged (only namespace)

**Files Modified**:
- `src/components/musicScore/MusicalStaff.js` (lines 23, 26, 34)

**Dependencies**: Task 2.1 complete

**Reference**: [data-model.md Renderer & Stave](./data-model.md#api-object-mapping)

---

### Task 2.3: Update drawNotes() Method Namespace
**Priority**: P1 | **Estimate**: 3 minutes

**Description**: Replace Vex.Flow references with VexFlow in drawNotes()

**Steps**:
1. Open `src/components/musicScore/MusicalStaff.js`
2. Line 39: `const { Accidental, StaveNote, Voice, Formatter } = Vex.Flow;` → `const { Accidental, StaveNote, Voice, Formatter } = VexFlow;`
3. Save file

**Acceptance Criteria**:
- [ ] Line 39: `const { Accidental, StaveNote, Voice, Formatter } = VexFlow;`
- [ ] No `Vex.Flow` references remain in drawNotes()
- [ ] Method logic unchanged (only namespace)

**Files Modified**:
- `src/components/musicScore/MusicalStaff.js` (line 39)

**Dependencies**: Task 2.1 complete

**Reference**: [data-model.md StaveNote & Accidental](./data-model.md#3-stavenote)

---

### Task 2.4: Update Documentation Comment
**Priority**: P3 | **Estimate**: 1 minute

**Description**: Update VexFlow documentation reference to v5

**Steps**:
1. Open `src/components/musicScore/MusicalStaff.js`
2. Line 5: Update comment to reference VexFlow 5 docs
3. Update: `https://github.com/0xfe/vexflow/wiki/Tutorial` → `https://github.com/vexflow/vexflow/wiki`
4. Save file

**Acceptance Criteria**:
- [ ] Comment references VexFlow 5 (not VexFlow 4)
- [ ] Documentation link points to vexflow/vexflow repo (not 0xfe/vexflow)

**Files Modified**:
- `src/components/musicScore/MusicalStaff.js` (line 5)

**Dependencies**: None (can be done anytime)

---

### Task 2.5: Verify No Remaining Vex.Flow References
**Priority**: P1 | **Estimate**: 2 minutes

**Description**: Search codebase for any remaining Vex.Flow references

**Steps**:
1. Run: `grep -r "Vex\.Flow" src/`
2. If results found, update them to `VexFlow`
3. Re-run search until clean

**Acceptance Criteria**:
- [ ] `grep -r "Vex\.Flow" src/` returns no results
- [ ] All references updated to `VexFlow`

**Files Modified**: TBD (depends on search results)

**Dependencies**: Tasks 2.1, 2.2, 2.3 complete

---

### Task 2.6: Build and Verify Compilation
**Priority**: P1 | **Estimate**: 5 minutes

**Description**: Ensure application compiles with namespace changes

**Steps**:
1. Stop development server if running
2. Run `yarn start`
3. Verify successful build
4. Open http://localhost:3000
5. Check browser console for errors

**Acceptance Criteria**:
- [ ] Build completes without errors
- [ ] App loads successfully
- [ ] No VexFlow-related console errors
- [ ] Musical notation renders (may not be perfect yet)

**Dependencies**: Tasks 2.1, 2.2, 2.3, 2.5 complete

---

## Phase 3: Testing & Validation (60 minutes)

### Task 3.1: Run Integration Test Suite
**Priority**: P1 | **Estimate**: 15 minutes

**Description**: Execute all integration tests to verify no regressions

**Steps**:
1. Run: `yarn test --watchAll=false`
2. Review test results
3. If failures, investigate and fix
4. Re-run until all pass

**Acceptance Criteria**:
- [ ] All 152 integration tests pass
- [ ] No new test failures introduced
- [ ] Test coverage remains at 100%
- [ ] No VexFlow-related test errors

**Files Modified**: Potentially test files if mocks need updating

**Dependencies**: Task 2.6 complete

**Reference**: [quickstart.md Step 7](./quickstart.md#step-7-run-integration-tests-10-15-minutes)

**Potential Issues**:
- If jsdom FontFace errors occur, add FontFace mock to test setup
- If test mocks use Vex.Flow, update to VexFlow namespace

---

### Task 3.2: Manual Testing - Basic Notation Rendering
**Priority**: P1 | **Estimate**: 10 minutes

**Description**: Manually verify basic musical notation features work

**Test Cases**:
1. **Treble Clef**: Select C Major, verify rendering
2. **Bass Clef**: Switch to bass clef, verify rendering
3. **Tenor Clef**: Switch to tenor clef, verify rendering
4. **Alto Clef**: Switch to alto clef, verify rendering
5. **Accidentals**: Select Gb Major, verify flats render

**Acceptance Criteria**:
- [ ] All clefs render correctly
- [ ] Notes display at correct positions
- [ ] Accidentals (#, b, ##, bb) render correctly
- [ ] Staff lines appear continuous
- [ ] No visual artifacts or rendering errors

**Dependencies**: Task 2.6 complete

**Reference**: [quickstart.md Step 8](./quickstart.md#step-8-manual-testing---basic-functionality-10-minutes)

---

### Task 3.3: Manual Testing - Gb Alignment Bug Fix (PRIMARY)
**Priority**: P1 | **Estimate**: 10 minutes

**Description**: Verify PRIMARY bug fix - Gb staff line alignment in Extended + Romance mode

**Test Cases**:
1. **Setup**: Select Gb Major scale
2. **Enable Extended Mode**: Toggle extended keyboard
3. **Enable Romance Notation**: Toggle Romance notation
4. **Verify**: Staff lines at Gb notes are continuous (no discontinuity)
5. **Compare**: Visually inspect for alignment improvements

**Acceptance Criteria**:
- [ ] Gb Major scale renders in Extended mode
- [ ] Romance notation displays correctly
- [ ] **CRITICAL**: Staff lines at Gb notes are continuous and aligned
- [ ] No visual discontinuity or "jumping" at Gb position
- [ ] Improvement visible compared to VexFlow 4.x (if baseline available)

**Dependencies**: Task 2.6 complete

**Reference**: [spec.md User Story 1](./spec.md#user-story-1---fix-staff-line-alignment-at-gb-priority-p1)

**Success Indicator**: This is the PRIMARY goal of the upgrade - must pass!

---

### Task 3.4: Create E2E Visual Regression Test
**Priority**: P2 | **Estimate**: 20 minutes

**Description**: Create automated E2E test for Gb alignment bug fix

**Steps**:
1. Create file: `e2e/tests/vexflow-5-gb-alignment.spec.js`
2. Implement test cases:
   - Gb staff line continuity test
   - All accidentals rendering test
   - Performance measurement test
3. Run test: `yarn test:e2e`
4. Review and adjust baseline screenshots

**Acceptance Criteria**:
- [ ] E2E test file created
- [ ] Test covers Gb + Extended + Romance mode
- [ ] Test verifies staff line continuity (screenshot comparison)
- [ ] Test measures rendering performance (< 200ms)
- [ ] Test passes in Chromium

**Files Created**:
- `e2e/tests/vexflow-5-gb-alignment.spec.js`

**Dependencies**: Task 3.3 complete (manual verification first)

**Reference**: [quickstart.md Step 9](./quickstart.md#step-9-create-e2e-visual-regression-test-20-minutes)

---

### Task 3.5: Cross-Browser E2E Testing
**Priority**: P2 | **Estimate**: 15 minutes

**Description**: Verify rendering works across all supported browsers

**Steps**:
1. Run: `yarn test:e2e:chromium`
2. Run: `yarn test:e2e:firefox`
3. Run: `yarn test:e2e:webkit` (Safari)
4. Review results and screenshots

**Acceptance Criteria**:
- [ ] E2E tests pass in Chromium
- [ ] E2E tests pass in Firefox
- [ ] E2E tests pass in WebKit (Safari)
- [ ] No browser-specific rendering issues
- [ ] Visual consistency across browsers

**Dependencies**: Task 3.4 complete

**Reference**: [quickstart.md Step 10](./quickstart.md#step-10-cross-browser-testing-15-minutes)

---

### Task 3.6: Performance Benchmarking
**Priority**: P2 | **Estimate**: 10 minutes

**Description**: Verify rendering performance meets constitutional requirement (< 200ms)

**Steps**:
1. Update or create `e2e/tests/performance.spec.js`
2. Implement VexFlow rendering performance test
3. Test multiple scales (C, G, D, A, E Major)
4. Measure average and max rendering times
5. Verify < 200ms requirement

**Acceptance Criteria**:
- [ ] Performance test implemented
- [ ] Average rendering time < 150ms
- [ ] Maximum rendering time < 200ms (constitutional requirement)
- [ ] No performance degradation vs VexFlow 4.x

**Files Modified/Created**:
- `e2e/tests/performance.spec.js`

**Dependencies**: Task 3.4 complete

**Reference**: [contracts/vexflow-api.md Performance Contract](./contracts/vexflow-api.md#performance-contract)

---

## Phase 4: Documentation & Cleanup (15 minutes)

### Task 4.1: Update jest.config.js (if needed)
**Priority**: P3 | **Estimate**: 5 minutes

**Description**: Verify Jest configuration handles VexFlow 5.x correctly

**Steps**:
1. Review `jest.config.js` transformIgnorePatterns
2. Verify vexflow is included: `node_modules/(?!(vexflow|...))/`
3. Update if needed
4. Add FontFace mock if jsdom tests fail

**Acceptance Criteria**:
- [ ] VexFlow included in transformIgnorePatterns
- [ ] FontFace mock added if needed
- [ ] All integration tests pass with Jest config

**Files Modified**:
- `jest.config.js` (potentially)

**Dependencies**: Task 3.1 results (if test failures)

**Reference**: [data-model.md jest.config.js](./data-model.md#jestconfigjs-updates)

---

### Task 4.2: Final Verification Checklist
**Priority**: P1 | **Estimate**: 5 minutes

**Description**: Execute final verification checklist before commit

**Verification Steps**:
- [ ] `yarn start` runs without errors
- [ ] No console errors in browser
- [ ] No ESLint warnings
- [ ] All 152 integration tests pass
- [ ] E2E visual regression tests pass
- [ ] Cross-browser E2E tests pass
- [ ] Performance benchmarks pass (< 200ms)
- [ ] All scales render correctly
- [ ] All clefs render correctly
- [ ] Accidentals render correctly
- [ ] Extended keyboard mode works
- [ ] Romance notation mode works
- [ ] **Gb alignment fixed** in Extended + Romance mode

**Dependencies**: All previous tasks complete

**Reference**: [quickstart.md Step 12](./quickstart.md#step-12-final-verification-checklist-5-minutes)

---

### Task 4.3: Code Review Self-Check
**Priority**: P2 | **Estimate**: 5 minutes

**Description**: Self-review code changes before commit

**Review Checklist**:
- [ ] All `Vex.Flow` references replaced with `VexFlow`
- [ ] Import statement uses ES6 module syntax
- [ ] No logic changes (only namespace)
- [ ] Comments updated to reference VexFlow 5
- [ ] Code formatted with Prettier
- [ ] No debugging console.log() statements

**Dependencies**: All code tasks complete

---

## Phase 5: Commit & Push (10 minutes)

### Task 5.1: Create Commit
**Priority**: P1 | **Estimate**: 5 minutes

**Description**: Commit VexFlow upgrade with descriptive message

**Steps**:
1. Stage changes: `git add .`
2. Review changes: `git status`
3. Create commit with detailed message (see below)
4. Verify commit: `git log -1`

**Commit Message**:
```
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

Implements: specs/005-vexflow-5-upgrade
```

**Acceptance Criteria**:
- [ ] All changes staged
- [ ] Commit message is descriptive and complete
- [ ] Commit includes test results summary

**Files Modified**:
- `package.json`
- `yarn.lock`
- `src/components/musicScore/MusicalStaff.js`
- `e2e/tests/vexflow-5-gb-alignment.spec.js` (new)
- Potentially `jest.config.js`

**Reference**: [quickstart.md Commit & Push](./quickstart.md#commit--push)

---

### Task 5.2: Push to Remote
**Priority**: P1 | **Estimate**: 5 minutes

**Description**: Push changes to remote branch

**Steps**:
1. Push: `git push -u origin claude/plan-vexflow-update-01SS6ZpJ42hLeYNpniTogKou`
2. Verify push successful
3. Check GitHub for commit

**Acceptance Criteria**:
- [ ] Push completes without errors
- [ ] Commit visible on GitHub
- [ ] Branch up to date with remote

**Dependencies**: Task 5.1 complete

---

## Phase 6: Post-Implementation (Optional)

### Task 6.1: Create Pull Request (if ready for merge)
**Priority**: P3 | **Estimate**: 10 minutes

**Description**: Create PR for team review (optional - may be done later)

**Steps**:
1. Navigate to GitHub
2. Create PR from `claude/plan-vexflow-update-01SS6ZpJ42hLeYNpniTogKou` to main branch
3. Use PR template with summary from commit message
4. Assign reviewers

**Acceptance Criteria**:
- [ ] PR created on GitHub
- [ ] PR description is complete and clear
- [ ] All CI checks passing (if configured)

**Dependencies**: Task 5.2 complete

---

## Task Summary

### By Priority

**P1 Tasks (Must Complete)**:
- 1.1 Update VexFlow Dependency
- 1.2 Verify Build
- 2.1 Update Import Statement
- 2.2 Update setupStaff() Namespace
- 2.3 Update drawNotes() Namespace
- 2.5 Verify No Remaining References
- 2.6 Build and Verify Compilation
- 3.1 Run Integration Test Suite
- 3.2 Manual Testing - Basic Notation
- 3.3 Manual Testing - Gb Alignment (PRIMARY FIX)
- 4.2 Final Verification Checklist
- 5.1 Create Commit
- 5.2 Push to Remote

**P2 Tasks (Should Complete)**:
- 3.4 Create E2E Visual Regression Test
- 3.5 Cross-Browser E2E Testing
- 3.6 Performance Benchmarking
- 4.3 Code Review Self-Check

**P3 Tasks (Nice to Have)**:
- 2.4 Update Documentation Comment
- 4.1 Update jest.config.js
- 6.1 Create Pull Request

### By Phase

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| Phase 1: Dependency Update | 2 tasks | 10 min |
| Phase 2: Code Migration | 6 tasks | 20 min |
| Phase 3: Testing & Validation | 6 tasks | 60 min |
| Phase 4: Documentation & Cleanup | 3 tasks | 15 min |
| Phase 5: Commit & Push | 2 tasks | 10 min |
| Phase 6: Post-Implementation | 1 task | 10 min (optional) |
| **Total** | **20 tasks** | **~2 hours** |

---

## Dependencies Graph

```
1.1 → 1.2 → 2.1 → 2.2, 2.3 → 2.5 → 2.6 → 3.1, 3.2, 3.3 → 3.4 → 3.5, 3.6 → 4.2 → 5.1 → 5.2 → 6.1
              ↓
            2.4 (independent)
              ↓
            4.1 (conditional on 3.1)
              ↓
            4.3 (before 5.1)
```

---

## Success Metrics

**Code Changes**:
- [ ] 5 lines changed in MusicalStaff.js (namespace only)
- [ ] 1 dependency version updated in package.json
- [ ] 0 logic changes (backward compatible)

**Testing**:
- [ ] 152 integration tests passing (100%)
- [ ] 3+ E2E tests created for VexFlow 5.x
- [ ] 3 browsers validated (Chrome, Firefox, Safari)

**Performance**:
- [ ] Rendering < 200ms (constitutional requirement)
- [ ] Bundle size reduced by ~19% (21.3 MB vs 26.4 MB)

**Primary Goal**:
- [ ] ✅ Gb staff line alignment bug FIXED

---

## Rollback Plan

If critical issues discovered during implementation:

1. **Revert package.json**: `yarn add vexflow@4.0.3`
2. **Revert code**: `git checkout HEAD -- src/components/musicScore/MusicalStaff.js`
3. **Verify**: `yarn test --watchAll=false && yarn start`
4. **Document**: Note issues in spec for future investigation

---

**Status**: Ready for implementation
**Next**: Start with Task 1.1 (Update VexFlow Dependency)
