# Tasks: Notio Proofreading Fixes 2025

**Input**: Design documents from `/specs/004-proofreading-fixes/`
**Prerequisites**: plan.md ✅, spec.md ✅

**Tests**: Tests are MANDATORY per Notio Constitution Principle I (100% coverage required)

**Organization**: Tasks are grouped by user story (fix) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story/fix this task belongs to (US1-US7)
- Exact file paths included in descriptions

## Path Conventions

Repository root paths (single-page React application):
- Source: `src/`
- Tests: `src/__integration__/`, `e2e/`, `src/__tests__/unit/`

---

## Phase 1: Setup & Investigation

**Purpose**: Locate all affected code and understand current behavior

- [ ] T001 [P] Locate chromatic scale definitions and Extensions mode logic
- [ ] T002 [P] Locate Relative mode (solfège) configuration and chromatic scale interaction
- [ ] T003 [P] Locate staff line rendering code and Romance notation logic
- [ ] T004 [P] Locate minor scale solfège syllable definitions (natural minor, harmonic minor, Phrygian, Locrian)
- [ ] T005 [P] Locate minor blues scale formula definition
- [ ] T006 [P] Locate video player component text strings
- [ ] T007 [P] Locate video player CSS styling

**Checkpoint**: All affected files identified

---

## Phase 2: User Story 1 - Fix Chromatic Scale Extensions (Priority: P1) 🎯

**Goal**: Remove extra "m" extension for chromatic scales with flats (Db, Eb, F, Gb, Ab, Bb, B) when Extensions mode is enabled

**Independent Test**: Select Db chromatic, enable Extensions, verify no "m" appears

### Tests for User Story 1 (MANDATORY)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Integration test: Chromatic scales with flats + Extensions mode in `src/__integration__/scales/chromatic-extensions.test.js`
  - Test all 7 chromatic scales with flats (Db, Eb, F, Gb, Ab, Bb, B)
  - Verify Extensions mode enabled shows correct extensions (no "m")
  - Verify switching between scales maintains correct behavior
- [ ] T011 [P] [US1] E2E test: User workflow for chromatic + Extensions in `e2e/chromatic-scales-workflow.spec.js`
  - User selects Db chromatic scale
  - User enables Extensions mode
  - Verify visual display matches expected (no "m" extension visible)

### Implementation for User Story 1

- [ ] T012 [US1] Fix chromatic scale Extensions logic (likely in `src/data/scales/chromaticScales.js` or `src/data/notation/extensions.js`)
  - Add conditional logic to filter out "m" extension for chromatic scales with flats
  - Maintain existing Extensions behavior for non-chromatic scales
- [ ] T013 [US1] Verify fix with manual testing on all 7 chromatic scales with flats

**Checkpoint**: Chromatic scales with flats show correct extensions (no "m")

---

## Phase 3: User Story 2 - Disable Relative Names for Chromatic Scales (Priority: P1) 🎯

**Goal**: Disable or hide relative (solfège) names for chromatic scales to avoid displaying incorrect syllable names

**Independent Test**: Select any chromatic scale, verify Relative checkbox is disabled or relative names are hidden

### Tests for User Story 2 (MANDATORY)

- [ ] T020 [P] [US2] Integration test: Chromatic scales + Relative mode in `src/__integration__/scales/chromatic-relative.test.js`
  - Test all chromatic scales with Relative mode
  - Verify Relative checkbox is disabled OR relative names are not displayed
  - Verify switching from non-chromatic to chromatic hides/disables Relative
  - Verify switching from chromatic to non-chromatic re-enables Relative
- [ ] T021 [P] [US2] E2E test: User workflow for chromatic + Relative in `e2e/chromatic-scales-workflow.spec.js` (extend existing)
  - User selects C major scale, enables Relative mode (works)
  - User switches to C chromatic scale
  - Verify Relative mode disabled/hidden

### Implementation for User Story 2

- [ ] T022 [US2] Implement chromatic scale detection in Relative mode logic (likely in `src/data/notation/relative.js` or `src/components/menu/SubMenu.js`)
  - Add `isChromatic()` helper function to detect chromatic scales
  - Conditionally disable Relative checkbox when chromatic scale selected
  - OR conditionally hide relative syllable display when chromatic scale selected
- [ ] T023 [US2] Update UI to reflect Relative mode unavailability for chromatic scales
  - Gray out checkbox and show tooltip: "Relative mode not available for chromatic scales"
  - OR simply hide relative names in display without disabling checkbox
- [ ] T024 [US2] Verify fix with manual testing on all chromatic scales

**Checkpoint**: Chromatic scales do not show incorrect relative names

---

## Phase 4: User Story 3 - Fix Staff Line Alignment at Gb (Priority: P2)

**Goal**: Fix staff line visual discontinuity at Gb in extended Romance notation mode

**Independent Test**: Select scale with Gb, enable Extended + Romance notation, verify staff lines are aligned

### Tests for User Story 3 (MANDATORY)

- [ ] T030 [P] [US3] Integration test: Staff line alignment with Gb in `src/__integration__/notation/staff-alignment-romance.test.js`
  - Test scales containing Gb with Extended + Romance notation enabled
  - Verify staff lines are continuous (no visible shift)
  - Test multiple scales: Gb major, Db major, etc.
- [ ] T031 [P] [US3] E2E test: Visual regression test for Gb alignment in `e2e/chromatic-scales-workflow.spec.js`
  - Take screenshot of scale with Gb in Extended + Romance mode
  - Verify staff lines align visually

### Implementation for User Story 3

- [ ] T032 [US3] Locate staff line rendering code (likely in `src/components/musicScore/MusicalStaff.js`)
  - Identify where staff lines are drawn
  - Find Gb-specific rendering logic or Romance notation offset calculation
- [ ] T033 [US3] Fix staff line positioning for Gb in Romance notation
  - Adjust offset/positioning calculation to maintain continuous staff lines
  - Test with VexFlow rendering to ensure alignment
- [ ] T034 [US3] Verify fix with manual testing on multiple scales containing Gb

**Checkpoint**: Staff lines are visually continuous at Gb in Extended Romance notation

---

## Phase 5: User Story 4 - Fix Relative Mode Syllable Names (Priority: P1) 🎯

**Goal**: Correct LE and SE syllable names in relative mode for natural minor, harmonic minor, Phrygian, and Locrian scales

**Independent Test**: Select natural minor in relative mode, verify syllables are DO RE ME FA SO LE TE

### Tests for User Story 4 (MANDATORY)

- [ ] T040 [P] [US4] Integration test: Minor modes + Relative syllables in `src/__integration__/scales/minor-modes-relative.test.js`
  - Test natural minor in relative mode → verify DO RE ME FA SO LE TE
  - Test harmonic minor in relative mode → verify DO RE ME FA SO LE TI
  - Test Phrygian in relative mode → verify DO RA ME FA SO LE TE
  - Test Locrian in relative mode → verify DO RA ME FA SE LE TE
  - Test all 12 keys for each mode
- [ ] T041 [P] [US4] E2E test: User workflow for minor modes + Relative in `e2e/minor-scales-workflow.spec.js`
  - User selects A natural minor
  - User enables Relative mode
  - Verify syllables match expected pattern

### Implementation for User Story 4

- [ ] T042 [P] [US4] Update natural minor solfège syllable mapping in `src/data/scales/minorScales.js` or `src/data/notation/relative.js`
  - Set natural minor syllables: DO RE ME FA SO LE TE
- [ ] T043 [P] [US4] Update harmonic minor solfège syllable mapping
  - Set harmonic minor syllables: DO RE ME FA SO LE TI
- [ ] T044 [P] [US4] Update Phrygian solfège syllable mapping
  - Set Phrygian syllables: DO RA ME FA SO LE TE
- [ ] T045 [P] [US4] Update Locrian solfège syllable mapping
  - Set Locrian syllables: DO RA ME FA SE LE TE
- [ ] T046 [US4] Unit test: Solfège syllable mapping logic in `src/__tests__/unit/scales/solfege-mapping.test.js`
  - Test syllable mapping function for each mode
  - Verify correct syllable returned for each scale degree
- [ ] T047 [US4] Verify fix with manual testing on all 4 modes in all 12 keys

**Checkpoint**: All minor modes display correct solfège syllables in relative mode

---

## Phase 6: User Story 5 - Fix Minor Blues Formula (Priority: P2)

**Goal**: Fix minor blues scale to follow correct formula 1 b3 4 #4 5 7 for all root notes

**Independent Test**: Select C minor blues, verify notes are C Eb F F# G Bb

### Tests for User Story 5 (MANDATORY)

- [ ] T050 [P] [US5] Integration test: Minor blues scale formula in `src/__integration__/scales/minor-blues.test.js`
  - Test minor blues in all 12 keys
  - Verify each follows formula: 1 b3 4 #4 5 7
  - Example: C minor blues = C Eb F F# G Bb
  - Example: D minor blues = D F G G# A C
- [ ] T051 [P] [US5] Unit test: Minor blues interval calculation in `src/__tests__/unit/scales/blues-formula.test.js`
  - Test formula calculation for each root note
  - Verify correct accidentals (sharps/flats) applied

### Implementation for User Story 5

- [ ] T052 [US5] Fix minor blues scale definition in `src/data/scales/bluesScales.js`
  - Update interval formula to: 1 b3 4 #4 5 7
  - Ensure correct sharps/flats applied for all 12 keys
- [ ] T053 [US5] Verify fix with manual testing on all 12 keys
  - Check visual notation display
  - Check audio playback for correct pitches

**Checkpoint**: Minor blues scales follow correct formula in all keys

---

## Phase 7: User Story 6 - Fix Video Player Text (Priority: P3)

**Goal**: Fix typo ("currently" missing "r"), remove YouTube reference, uppercase URL consistently

**Independent Test**: Open video player, verify corrected text and uppercase "URL"

### Tests for User Story 6 (MANDATORY)

- [ ] T060 [P] [US6] Integration test: Video player text content in `src/__integration__/ui/video-player.test.js`
  - Verify instruction text: "Enter the URL for any video or playlist you want to use with Notio, then press Enter."
  - Verify status text: "You are currently watching:"
  - Verify all instances of "URL" are uppercase
  - Verify no mention of "YouTube"

### Implementation for User Story 6

- [ ] T061 [US6] Update video player text strings in `src/components/OverlayPlugins/Overlay.js`
  - Fix typo: "currenty" → "currently"
  - Remove "YouTube" reference
  - Change instruction text to: "Enter the URL for any video or playlist you want to use with Notio, then press Enter."
  - Update status text to: "You are currently watching:"
  - Ensure "URL" is uppercase everywhere
- [ ] T062 [US6] Verify fix with manual testing
  - Open video player overlay
  - Check all text displays correctly

**Checkpoint**: Video player text is correct and professional

---

## Phase 8: User Story 7 - Increase Video Player Font Size (Priority: P3)

**Goal**: Increase video player instruction font size for better readability

**Independent Test**: Open video player, verify larger, more readable font

### Tests for User Story 7 (MANDATORY)

- [ ] T070 [P] [US7] Integration test: Video player font size in `src/__integration__/ui/video-player.test.js` (extend existing)
  - Verify font size is increased (computed style check)
  - Verify text remains visible and readable
- [ ] T071 [P] [US7] E2E test: Visual regression test in `e2e/video-player-workflow.spec.js`
  - Take screenshot of video player
  - Verify font appears larger than baseline

### Implementation for User Story 7

- [ ] T072 [US7] Increase video player instruction font size in `src/styles/overlay.scss` or equivalent
  - Increase font-size to as large as possible while maintaining layout
  - Recommended: 16px → 18px or 20px (test for optimal readability)
- [ ] T073 [US7] Verify fix with manual testing
  - Open video player on different screen sizes
  - Verify readability improvement

**Checkpoint**: Video player instructions are more readable

---

## Phase 9: Integration & Regression Testing

**Purpose**: Verify all fixes work together without breaking existing functionality

- [ ] T080 [P] Run all integration tests and verify 100% pass
- [ ] T081 [P] Run all E2E tests and verify 100% pass
- [ ] T082 [P] Run all unit tests and verify 100% pass
- [ ] T083 [P] Verify 100% code coverage achieved
- [ ] T084 Manual regression testing: Test all scale types not affected by fixes
  - Verify major scales still work correctly
  - Verify pentatonic scales still work correctly
  - Verify all notation modes still work for non-affected scales
- [ ] T085 Manual regression testing: Test all mode combinations
  - Extensions + Relative on non-chromatic scales
  - Extended + Romance on scales without Gb
  - All combinations of notation modes
- [ ] T086 Accessibility testing: Verify all fixes maintain keyboard navigation and screen reader compatibility

**Checkpoint**: All tests pass, no regressions, 100% coverage achieved

---

## Phase 10: Documentation & Deployment

**Purpose**: Document changes and prepare for release

- [ ] T090 [P] Update CHANGELOG.md with all 7 fixes
- [ ] T091 [P] Update user documentation (if any) for corrected behaviors
- [ ] T092 Create quickstart.md with manual testing procedures for each fix
- [ ] T093 Update issue tracker with references to completed fixes
- [ ] T094 Code review and approval
- [ ] T095 Merge to main branch
- [ ] T096 Deploy to production

**Checkpoint**: Feature complete and deployed

---

## Summary

**Total Tasks**: 96 tasks across 10 phases
**P1 Fixes** (High Priority): US1 (chromatic extensions), US2 (chromatic relative), US4 (minor syllables)
**P2 Fixes** (Medium Priority): US3 (Gb alignment), US5 (minor blues)
**P3 Fixes** (Lower Priority): US6 (video text), US7 (video font)

**Parallelization**: Tasks marked [P] can run in parallel (different files, no dependencies)

**Test Coverage**: 100% required per Notio Constitution
- Integration tests: 60-70% of test suite
- E2E tests: 20-30% of test suite
- Unit tests: 10-20% of test suite (edge cases only)

**Independent Testing**: Each user story can be tested independently before moving to the next
