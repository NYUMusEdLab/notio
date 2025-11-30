# Tasks: Fix Relative NoteNames for Scales and Modes

**Input**: Design documents from `/specs/004-fix-relative-notenames/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Tests are MANDATORY per Constitution v2.0.0 Principle I (Pragmatic Testing Strategy). This feature MUST achieve 100% code coverage with integration-first approach (60-70% integration, 20-30% E2E, 10-20% unit tests for edge cases only).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. User stories are ordered by priority: P1 → P2 → P3 → P4 → P5.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions

Single project structure:
- `src/Model/` - Core models
- `src/data/` - Data definitions
- `src/__integration__/` - Integration tests
- `e2e/` - End-to-end tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies are in place

- [X] T001 Verify existing project structure matches plan.md specification
- [X] T002 Verify Jest (^29.0.3) and React Testing Library (@testing-library/react ^13.0.0) are configured
- [X] T003 [P] Verify Playwright (@playwright/test) is configured for E2E tests
- [X] T004 [P] Verify existing test infrastructure runs successfully (npm test)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core syllable mapping infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Add SCALE_DEGREE_TO_SYLLABLE constant to src/Model/MusicScale.js with complete mapping table
  - Diatonic: "1"→"DO", "2"→"RE", "3"→"MI", "4"→"FA", "5"→"SO", "6"→"LA", "7"→"TE", "△7"→"TI"
  - Chromatic descending: "b2"→"RA", "b3"→"ME", "b5"→"SE", "b6"→"LE", "b7"→"TE"
  - Chromatic ascending: "#1"→"DI", "#2"→"RI", "#4"→"FI", "#5"→"SI", "#6"→"LI"
- [X] T006 Create makeRelativeScaleSyllables() method in src/Model/MusicScale.js
  - Signature: makeRelativeScaleSyllables(semiToneSteps, scaleNumbers, extendedSteps): string[]
  - Handle chromatic scale special case (call this.MakeChromatic for chromatic scale)
  - Find root position using this.findScaleStartIndexRelativToRoot()
  - Map each step to syllable based on scale degree position (NOT chromatic position)
  - Return syllable array matching semiToneSteps.length
- [X] T007 Update BuildExtendedScaleToneNames() case "Relative" in src/Model/MusicScale.js
  - Replace chromatic mapping (lines 316-318) with call to makeRelativeScaleSyllables()
  - Pass semiToneSteps, this.Recipe.numbers, this.ExtendedScaleSteps as parameters
  - Preserve existing chromatic fallback for scales without numbers array

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Natural Minor Displays Correct Solfege (Priority: P1) 🎯 MVP

**Goal**: Natural Minor (Aeolian) scale displays relative syllables as DO RE ME FA SO LE TE with characteristic lowered 6th (LE) and lowered 7th (TE)

**Independent Test**: Select Natural Minor scale, enable Relative notation, verify all seven scale degrees display DO RE ME FA SO LE TE

### Tests for User Story 1 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T008 [P] [US1] Integration test for Natural Minor syllable display in src/__integration__/relative-notenames.test.js
  - Test MusicScale model + BuildExtendedScaleToneNames() + Relative case working together
  - Create MusicScale instance with Natural Minor recipe
  - Enable Relative notation mode
  - Assert ExtendedScaleToneNames.Relative === ["DO", "RE", "ME", "FA", "SO", "LE", "TE", ...]
  - Test happy path: C minor, A minor (common keys)
  - Test edge case: F# minor (unusual key with many sharps)
  - Verify data flow: scalesObj.js numbers array → SCALE_DEGREE_TO_SYLLABLE lookup → rendered syllables
- [ ] T009 [P] [US1] Integration test for Natural Minor multi-octave syllable repetition in src/__integration__/relative-notenames.test.js
  - Test Natural Minor spanning 2 octaves
  - Verify pattern repeats: DO RE ME FA SO LE TE DO RE ME FA SO LE TE
  - Test 3 octave span: pattern repeats correctly across all three octaves
  - Test partial octave boundaries (starts/ends mid-pattern)

**E2E Tests (Secondary - 20-30%)**:
- [ ] T010 [US1] E2E test for Natural Minor complete user workflow in e2e/relative-notenames.spec.js
  - Load application → Select Natural Minor from scale menu
  - Enable Relative notation from notation menu
  - Verify keyboard component displays DO RE ME FA SO LE TE
  - Test cross-browser: Chromium, Firefox, WebKit
  - Verify audio-visual synchronization (if applicable)
  - Measure performance: syllable update completes in <50ms

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T011 [P] [US1] Unit test for makeRelativeScaleSyllables() edge cases in src/__tests__/MusicScale.test.js
  - Test chromatic scale fallback (should use MakeChromatic method)
  - Test scale with missing numbers array (fallback behavior)
  - Test scale with unknown degree in numbers array (default to "DO")
  - Test empty semiToneSteps array (boundary condition)
  - Test single note scale (boundary condition)

### Implementation for User Story 1

- [ ] T012 [US1] Verify scalesObj.js Natural Minor recipe has correct numbers array
  - Confirm: numbers: ["1", "2", "b3", "4", "5", "b6", "7"] in src/data/scalesObj.js
  - Verify steps: [0, 2, 3, 5, 7, 8, 10] matches numbers array length
  - No changes needed (verification only)
- [ ] T013 [US1] Test makeRelativeScaleSyllables() with Natural Minor recipe manually
  - Use console logging or debugger to verify syllable mapping
  - Input: Natural Minor numbers ["1", "2", "b3", "4", "5", "b6", "7"]
  - Expected output: ["DO", "RE", "ME", "FA", "SO", "LE", "TE"]
  - Debug any mapping errors before proceeding
- [ ] T014 [US1] Update BuildExtendedScaleToneNames() Relative case logic
  - Ensure makeRelativeScaleSyllables() is called correctly
  - Verify theScale["Relative"] receives correct syllable array
  - Test with Natural Minor: confirm LE appears for 6th degree, TE for 7th degree

### Coverage Verification for User Story 1

- [ ] T015 [US1] Run coverage report for MusicScale.js and verify 100% coverage of new code
- [ ] T016 [US1] Verify test distribution: integration tests dominate (T008, T009), E2E test (T010), minimal unit tests (T011)
- [ ] T017 [US1] Verify all tests pass: npm test -- relative-notenames.test.js
- [ ] T018 [US1] Verify E2E test passes: npm run test:e2e -- relative-notenames.spec.js
- [ ] T019 [US1] Verify performance: integration tests complete in <5s, E2E test <30s

**Checkpoint**: At this point, User Story 1 (Natural Minor) should be fully functional and testable independently

---

## Phase 4: User Story 5 - Syllables Consistent Across All Keys (Priority: P2)

**Goal**: Relative syllables remain identical across ALL 12 chromatic keys (C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B) for any given scale/mode - syllables represent scale degrees, NOT absolute pitches

**Independent Test**: Select Natural Minor in all 12 chromatic keys and verify DO RE ME FA SO LE TE appears identically in every key

**⚠️ CRITICAL**: This is the foundational requirement of movable-do solfege - if syllables change between keys, the entire pedagogical system collapses

### Tests for User Story 5 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T020 [P] [US5] Integration test for Natural Minor key-independence in src/__integration__/relative-notenames.test.js
  - Test Natural Minor in all 12 chromatic keys: C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, B
  - For EACH key: create MusicScale instance with that root, verify syllables === ["DO", "RE", "ME", "FA", "SO", "LE", "TE", ...]
  - Assert all 12 keys produce IDENTICAL syllable arrays
  - Test enharmonic equivalents specifically: C# vs Db, D# vs Eb, F# vs Gb, G# vs Ab, A# vs Bb → verify absolutely identical
- [ ] T021 [P] [US5] Integration test for Harmonic Minor key-independence in src/__integration__/relative-notenames.test.js
  - Test Harmonic Minor in all 12 chromatic keys
  - Verify all keys produce: ["DO", "RE", "ME", "FA", "SO", "LE", "TI", ...] (identical)
- [ ] T022 [P] [US5] Integration test for Phrygian key-independence in src/__integration__/relative-notenames.test.js
  - Test Phrygian in all 12 chromatic keys
  - Verify all keys produce: ["DO", "RA", "ME", "FA", "SO", "LE", "TE", ...] (identical)
- [ ] T023 [P] [US5] Integration test for Locrian key-independence in src/__integration__/relative-notenames.test.js
  - Test Locrian in all 12 chromatic keys
  - Verify all keys produce: ["DO", "RA", "ME", "FA", "SE", "LE", "TE", ...] (identical)

**E2E Tests (Secondary - 20-30%)**:
- [ ] T024 [US5] E2E test for multi-key consistency validation in e2e/relative-notenames.spec.js
  - Test Natural Minor in ALL 12 chromatic keys via UI interaction
  - For each key: select root note → select Natural Minor → enable Relative → verify display
  - Verify DO RE ME FA SO LE TE appears identically in every key
  - Test Harmonic Minor in all 12 keys → verify DO RE ME FA SO LE TI consistent
  - Test Phrygian in all 12 keys → verify DO RA ME FA SO LE TE consistent
  - Test Locrian in all 12 keys → verify DO RA ME FA SE LE TE consistent
  - Verify enharmonic equivalents (C# vs Db, etc.) show absolutely identical syllables
  - Measure performance: syllable update <50ms per key change

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T025 [P] [US5] Unit test for key-independence algorithm in src/__tests__/MusicScale.test.js
  - Test makeRelativeScaleSyllables() with same scaleNumbers but different semiToneSteps (different keys)
  - Verify output syllables depend ONLY on scaleNumbers, NOT on semiToneSteps chromatic positions
  - Test: Natural Minor in C (steps [0,2,3,5,7,8,10]) vs Natural Minor in D (steps [2,4,5,7,9,10,0+12])
  - Assert syllable arrays are identical despite different chromatic positions

### Implementation for User Story 5

- [ ] T026 [US5] Verify makeRelativeScaleSyllables() uses scaleNumbers NOT semiToneSteps for syllable mapping
  - Review implementation: ensure degreeIndex = (index + rootIndex) % scaleNumbers.length
  - Ensure syllable = SCALE_DEGREE_TO_SYLLABLE[scaleNumbers[degreeIndex]]
  - Confirm NO direct mapping from semiToneSteps to syllables (this was the bug)
- [ ] T027 [US5] Test transposition independence manually
  - Select Natural Minor in C → verify syllables
  - Select Natural Minor in C# → verify syllables identical
  - Select Natural Minor in Db → verify syllables identical to C#
  - Repeat for multiple keys: A, E, D, F#, etc.
  - Debug any key-dependent syllable changes
- [ ] T028 [US5] Verify all 12 chromatic keys work correctly in UI
  - Test root note selector includes all 12 keys plus enharmonic equivalents
  - Verify transposition logic in MusicScale constructor handles all keys
  - Confirm syllable generation ignores transposition (key-independent)

### Coverage Verification for User Story 5

- [ ] T029 [US5] Run coverage report and verify 100% code coverage maintained
- [ ] T030 [US5] Verify test distribution: integration tests for all 4 scales × 12 keys (T020-T023), E2E test (T024), minimal unit (T025)
- [ ] T031 [US5] Verify all integration tests pass for all 12 keys: npm test -- relative-notenames.test.js
- [ ] T032 [US5] Verify E2E multi-key test passes: npm run test:e2e -- relative-notenames.spec.js
- [ ] T033 [US5] Verify performance targets: key change syllable update <50ms

**Checkpoint**: At this point, User Stories 1 AND 5 should both work independently - Natural Minor displays correct syllables AND remains consistent across all 12 keys

---

## Phase 5: User Story 2 - Harmonic Minor Shows Raised 7th (Priority: P2)

**Goal**: Harmonic Minor scale displays relative syllables as DO RE ME FA SO LE TI with characteristic raised 7th (TI instead of TE)

**Independent Test**: Select Harmonic Minor, enable Relative notation, verify 7th degree displays TI while 6th remains LE

### Tests for User Story 2 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T034 [P] [US2] Integration test for Harmonic Minor syllable display in src/__integration__/relative-notenames.test.js
  - Create MusicScale instance with Harmonic Minor recipe
  - Enable Relative notation
  - Assert ExtendedScaleToneNames.Relative === ["DO", "RE", "ME", "FA", "SO", "LE", "TI", ...]
  - Verify 6th degree is LE (b6), 7th degree is TI (△7) - NOT TE
  - Compare to Natural Minor: only 7th degree differs (TI vs TE)
- [ ] T035 [P] [US2] Integration test for Harmonic Minor multi-octave pattern in src/__integration__/relative-notenames.test.js
  - Test Harmonic Minor spanning 2-3 octaves
  - Verify raised 7th (TI) appears consistently in all octaves
  - Pattern repeats: DO RE ME FA SO LE TI DO RE ME FA SO LE TI

**E2E Tests (Secondary - 20-30%)**:
- [ ] T036 [US2] E2E test for Harmonic Minor user workflow in e2e/relative-notenames.spec.js
  - Load application → Select Harmonic Minor → Enable Relative notation
  - Verify keyboard displays DO RE ME FA SO LE TI
  - Highlight characteristic augmented 2nd interval: LE to TI
  - Test across browsers: Chromium, Firefox, WebKit

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T037 [P] [US2] Unit test for △7 → TI mapping in src/__tests__/MusicScale.test.js
  - Test SCALE_DEGREE_TO_SYLLABLE["△7"] === "TI"
  - Test makeRelativeScaleSyllables() with numbers containing "△7"
  - Verify output includes "TI" at correct position

### Implementation for User Story 2

- [ ] T038 [US2] Verify scalesObj.js Harmonic Minor recipe has correct numbers array
  - Confirm: numbers: ["1", "2", "b3", "4", "5", "b6", "△7"] in src/data/scalesObj.js
  - Verify steps: [0, 2, 3, 5, 7, 8, 11] matches numbers (note: 11 is major 7th)
  - Verify major_seventh: 11 field is present
- [ ] T039 [US2] Test SCALE_DEGREE_TO_SYLLABLE mapping for △7
  - Verify constant includes "△7": "TI" entry
  - Test with Harmonic Minor: confirm TI appears for 7th degree
  - Compare with Natural Minor: confirm TE appears for "7" (b7) degree
- [ ] T040 [US2] Verify Harmonic Minor displays correctly in UI
  - Select Harmonic Minor in multiple keys (C, A, E, F#)
  - Enable Relative notation
  - Confirm LE-TI interval is visually highlighted correctly

### Coverage Verification for User Story 2

- [ ] T041 [US2] Run coverage report and verify 100% code coverage maintained
- [ ] T042 [US2] Verify test distribution targets met: integration (T034, T035), E2E (T036), unit (T037)
- [ ] T043 [US2] Verify all tests pass: npm test and npm run test:e2e
- [ ] T044 [US2] Verify Harmonic Minor works independently AND integrates with Natural Minor (both scales selectable)

**Checkpoint**: At this point, User Stories 1, 5, AND 2 should all work independently - Natural Minor (LE TE), Harmonic Minor (LE TI), both consistent across all 12 keys

---

## Phase 6: User Story 3 - Phrygian Mode Shows Lowered 2nd (Priority: P3)

**Goal**: Phrygian mode displays relative syllables as DO RA ME FA SO LE TE with characteristic lowered 2nd (RA instead of RE)

**Independent Test**: Select Phrygian mode, enable Relative notation, verify RA appears for b2nd degree while LE (b6th) and TE (b7th) also display correctly

### Tests for User Story 3 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T045 [P] [US3] Integration test for Phrygian syllable display in src/__integration__/relative-notenames.test.js
  - Create MusicScale instance with Phrygian recipe
  - Enable Relative notation
  - Assert ExtendedScaleToneNames.Relative === ["DO", "RA", "ME", "FA", "SO", "LE", "TE", ...]
  - Verify 2nd degree is RA (b2), 3rd is ME (b3), 6th is LE (b6), 7th is TE (b7)
  - Test characteristic half-step: DO-RA interval
- [ ] T046 [P] [US3] Integration test for Phrygian multi-octave pattern in src/__integration__/relative-notenames.test.js
  - Test Phrygian spanning 2-3 octaves
  - Verify RA appears consistently for 2nd degree in all octaves

**E2E Tests (Secondary - 20-30%)**:
- [ ] T047 [US3] E2E test for Phrygian user workflow in e2e/relative-notenames.spec.js
  - Load application → Select Phrygian mode → Enable Relative notation
  - Verify keyboard displays DO RA ME FA SO LE TE
  - Test DO-RA half-step interval (characteristic Phrygian sound)
  - Test across browsers

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T048 [P] [US3] Unit test for b2 → RA mapping in src/__tests__/MusicScale.test.js
  - Test SCALE_DEGREE_TO_SYLLABLE["b2"] === "RA"
  - Test makeRelativeScaleSyllables() with numbers containing "b2"
  - Verify output includes "RA" at correct position

### Implementation for User Story 3

- [ ] T049 [US3] Verify scalesObj.js Phrygian recipe has correct numbers array
  - Confirm: numbers: ["1", "b2", "b3", "4", "5", "b6", "7"] in src/data/scalesObj.js
  - Verify steps: [0, 1, 3, 5, 7, 8, 10] matches numbers
- [ ] T050 [US3] Test SCALE_DEGREE_TO_SYLLABLE mapping for b2
  - Verify constant includes "b2": "RA" entry
  - Test with Phrygian: confirm RA appears for 2nd degree
- [ ] T051 [US3] Verify Phrygian displays correctly in UI
  - Select Phrygian in multiple keys (C, E, D)
  - Enable Relative notation
  - Confirm DO-RA half-step is visually clear

### Coverage Verification for User Story 3

- [ ] T052 [US3] Run coverage report and verify 100% code coverage maintained
- [ ] T053 [US3] Verify test distribution targets met: integration (T045, T046), E2E (T047), unit (T048)
- [ ] T054 [US3] Verify all tests pass: npm test and npm run test:e2e
- [ ] T055 [US3] Verify Phrygian works independently AND integrates with previous scales (all scales selectable)

**Checkpoint**: At this point, User Stories 1, 5, 2, AND 3 should all work independently - Natural Minor, Harmonic Minor, Phrygian, all consistent across all 12 keys

---

## Phase 7: User Story 4 - Locrian Mode Shows Lowered 2nd and 5th (Priority: P4)

**Goal**: Locrian mode displays relative syllables as DO RA ME FA SE LE TE with characteristic lowered 2nd (RA) and lowered 5th (SE)

**Independent Test**: Select Locrian mode, enable Relative notation, verify both RA (b2nd) and SE (b5th) display correctly along with LE (b6th) and TE (b7th)

### Tests for User Story 4 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T056 [P] [US4] Integration test for Locrian syllable display in src/__integration__/relative-notenames.test.js
  - Create MusicScale instance with Locrian recipe
  - Enable Relative notation
  - Assert ExtendedScaleToneNames.Relative === ["DO", "RA", "ME", "FA", "SE", "LE", "TE", ...]
  - Verify 2nd is RA (b2), 3rd is ME (b3), 5th is SE (b5), 6th is LE (b6), 7th is TE (b7)
  - Test diminished triad: DO-ME-SE
- [ ] T057 [P] [US4] Integration test for Locrian multi-octave pattern in src/__integration__/relative-notenames.test.js
  - Test Locrian spanning 2-3 octaves
  - Verify SE appears consistently for 5th degree in all octaves
  - Verify RA appears for 2nd degree in all octaves

**E2E Tests (Secondary - 20-30%)**:
- [ ] T058 [US4] E2E test for Locrian user workflow in e2e/relative-notenames.spec.js
  - Load application → Select Locrian mode → Enable Relative notation
  - Verify keyboard displays DO RA ME FA SE LE TE
  - Test diminished triad built on DO: DO-ME-SE
  - Test across browsers

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T059 [P] [US4] Unit test for b5 → SE mapping in src/__tests__/MusicScale.test.js
  - Test SCALE_DEGREE_TO_SYLLABLE["b5"] === "SE"
  - Test makeRelativeScaleSyllables() with numbers containing "b5"
  - Verify output includes "SE" at correct position

### Implementation for User Story 4

- [ ] T060 [US4] Verify scalesObj.js Locrian recipe has correct numbers array
  - Confirm: numbers: ["1", "b2", "b3", "4", "b5", "b6", "7"] in src/data/scalesObj.js
  - Verify steps: [0, 1, 3, 5, 6, 8, 10] matches numbers
- [ ] T061 [US4] Test SCALE_DEGREE_TO_SYLLABLE mapping for b5
  - Verify constant includes "b5": "SE" entry
  - Test with Locrian: confirm SE appears for 5th degree
- [ ] T062 [US4] Verify Locrian displays correctly in UI
  - Select Locrian in multiple keys (C, B, F#)
  - Enable Relative notation
  - Confirm DO-ME-SE diminished triad is visually clear

### Coverage Verification for User Story 4

- [ ] T063 [US4] Run coverage report and verify 100% code coverage maintained
- [ ] T064 [US4] Verify test distribution targets met: integration (T056, T057), E2E (T058), unit (T059)
- [ ] T065 [US4] Verify all tests pass: npm test and npm run test:e2e
- [ ] T066 [US4] Verify Locrian works independently AND integrates with previous scales

**Checkpoint**: At this point, all four explicitly specified scales work: Natural Minor, Harmonic Minor, Phrygian, Locrian - all consistent across all 12 keys

---

## Phase 8: User Story 6 - Other Modes Display Appropriate Syllables (Priority: P5)

**Goal**: All remaining modes (Dorian, Lydian, Mixolydian, Melodic Minor, Major/Ionian) display pedagogically correct relative syllables

**Independent Test**: Systematically select each remaining mode and verify relative syllables match standard movable-do solfege practice

### Tests for User Story 6 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T067 [P] [US6] Integration test for Dorian syllable display in src/__integration__/relative-notenames.test.js
  - Test Dorian: verify ["DO", "RE", "ME", "FA", "SO", "LA", "TE", ...] (natural 6th LA, lowered 7th TE)
- [ ] T068 [P] [US6] Integration test for Lydian syllable display in src/__integration__/relative-notenames.test.js
  - Test Lydian: verify ["DO", "RE", "MI", "FI", "SO", "LA", "TI", ...] (raised 4th FI, major 7th TI)
- [ ] T069 [P] [US6] Integration test for Mixolydian syllable display in src/__integration__/relative-notenames.test.js
  - Test Mixolydian: verify ["DO", "RE", "MI", "FA", "SO", "LA", "TE", ...] (major 3rd MI, lowered 7th TE)
- [ ] T070 [P] [US6] Integration test for Melodic Minor syllable display in src/__integration__/relative-notenames.test.js
  - Test Melodic Minor: verify ["DO", "RE", "ME", "FA", "SO", "LA", "TI", ...] (b3 ME, natural 6 LA, major 7 TI)
- [ ] T071 [P] [US6] Integration test for Major (Ionian) syllable display in src/__integration__/relative-notenames.test.js
  - Test Major: verify ["DO", "RE", "MI", "FA", "SO", "LA", "TI", ...] (all natural degrees - baseline reference)

**E2E Tests (Secondary - 20-30%)**:
- [ ] T072 [US6] E2E test for all remaining modes in e2e/relative-notenames.spec.js
  - Test Dorian, Lydian, Mixolydian, Melodic Minor, Major/Ionian
  - For each: select mode → enable Relative → verify correct syllable pattern
  - Test across browsers

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T073 [P] [US6] Unit test for #4 → FI mapping (Lydian) in src/__tests__/MusicScale.test.js
  - Test SCALE_DEGREE_TO_SYLLABLE["#4"] === "FI"
  - Test makeRelativeScaleSyllables() with numbers containing "#4"

### Implementation for User Story 6

- [ ] T074 [US6] Verify scalesObj.js Dorian recipe: numbers: ["1", "2", "b3", "4", "5", "6", "7"]
- [ ] T075 [US6] Verify scalesObj.js Lydian recipe: numbers: ["1", "2", "3", "#4", "5", "6", "△7"]
- [ ] T076 [US6] Verify scalesObj.js Mixolydian recipe: numbers: ["1", "2", "3", "4", "5", "6", "7"]
- [ ] T077 [US6] Verify scalesObj.js Melodic Minor recipe: numbers: ["1", "2", "b3", "4", "5", "6", "△7"]
- [ ] T078 [US6] Verify scalesObj.js Major (Ionian) recipe: numbers: ["1", "2", "3", "4", "5", "6", "△7"]
- [ ] T079 [US6] Test all five modes display correctly in UI
  - Select Dorian, Lydian, Mixolydian, Melodic Minor, Major
  - Enable Relative notation for each
  - Verify syllables match expected patterns

### Coverage Verification for User Story 6

- [ ] T080 [US6] Run coverage report and verify 100% code coverage maintained
- [ ] T081 [US6] Verify test distribution targets met: integration (T067-T071), E2E (T072), unit (T073)
- [ ] T082 [US6] Verify all tests pass: npm test and npm run test:e2e
- [ ] T083 [US6] Verify all modes (10 total) work independently: Major, Natural Minor, Harmonic Minor, Melodic Minor, Dorian, Phrygian, Lydian, Mixolydian, Locrian

**Checkpoint**: All user stories complete - comprehensive movable-do solfege system covering all major scales, minor variants, and modal scales

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, backward compatibility, performance optimization, and final validation

### Edge Case Handling

- [ ] T084 [P] Test pentatonic scales in src/__integration__/relative-notenames.test.js
  - Minor Pentatonic: verify ["DO", "ME", "FA", "SO", "TE"] (5-note subset)
  - Major Pentatonic: verify ["DO", "RE", "MI", "SO", "LA"] (5-note subset)
- [ ] T085 [P] Test enharmonic equivalents produce identical syllables in src/__integration__/relative-notenames.test.js
  - C# vs Db: verify absolutely identical relative syllables
  - D# vs Eb: verify identical
  - F# vs Gb: verify identical
  - G# vs Ab: verify identical
  - A# vs Bb: verify identical
- [ ] T086 [P] Test custom scales fallback behavior in src/__integration__/relative-notenames.test.js
  - Test scale without numbers array: verify chromatic fallback
  - Test scale with unusual interval combination: verify graceful handling

### Backward Compatibility Verification

- [ ] T087 [P] Test English notation mode still works in src/__integration__/relative-notenames.test.js
  - Natural Minor: verify C D Eb F G Ab Bb (unchanged)
- [ ] T088 [P] Test German notation mode still works in src/__integration__/relative-notenames.test.js
  - Natural Minor: verify C D Eb F G Ab B (unchanged)
- [ ] T089 [P] Test Romance notation mode still works in src/__integration__/relative-notenames.test.js
  - Natural Minor: verify Do Re Mib Fa Sol Lab Sib (unchanged)
- [ ] T090 [P] Test Scale Steps notation mode still works in src/__integration__/relative-notenames.test.js
  - Natural Minor: verify 1 2 b3 4 5 b6 7 (unchanged)
- [ ] T091 [P] Test Chord Extensions notation mode still works in src/__integration__/relative-notenames.test.js
  - Verify chord extension display unchanged
- [ ] T092 Test switching between notation modes mid-use in e2e/relative-notenames.spec.js
  - Switch English → Relative → German → Relative → Romance
  - Verify instant updates, no errors, correct display for each mode

### Performance Optimization

- [ ] T093 Measure syllable update performance on scale change
  - Use Chrome DevTools Performance tab
  - Verify <50ms syllable update time (target from spec.md)
  - Optimize if necessary (though O(1) lookups should be <1ms per data-model.md)
- [ ] T094 Measure syllable update performance on key change
  - Test all 12 chromatic keys
  - Verify <50ms per key change
  - Profile if any outliers found
- [ ] T095 Verify no visual flicker during syllable updates
  - Test rapid scale switching
  - Test rapid key switching
  - Verify smooth transitions, no layout shifts

### Final Coverage Verification (MANDATORY)

- [ ] T096 Run full test suite and verify 100% code coverage across all user stories
  - npm test -- --coverage
  - Verify all lines, branches, functions, statements covered
- [ ] T097 Verify final test distribution: 60-70% integration, 20-30% E2E, 10-20% unit
  - Count integration tests (should be ~40-50 tests across all scales/modes/keys)
  - Count E2E tests (should be ~10-15 tests for critical user journeys)
  - Count unit tests (should be ~8-12 tests for edge cases only)
- [ ] T098 Verify all performance targets met
  - Integration tests <5s per test: npm test (measure total time / test count)
  - E2E tests <30s per test: npm run test:e2e (measure total time / test count)
- [ ] T099 Review coverage report for any untested edge cases
  - Check coverage report HTML output
  - Identify any uncovered branches or edge cases
  - Add tests if coverage gaps found

### Documentation and Validation

- [ ] T100 Run quickstart.md manual test checklist
  - Execute 1-minute quick test (Natural Minor in C, C#, A)
  - Execute all four specified scales test table
  - Verify automated test commands work
  - Complete manual testing checklist (basic functionality, key independence, additional modes, multi-octave, backward compatibility, edge cases, performance)
- [ ] T101 Update CLAUDE.md with implementation details
  - Run .specify/scripts/bash/update-agent-context.sh
  - Verify project structure, commands, code style sections updated
- [ ] T102 Final smoke test: load application and test all scales
  - Manually test all 10 scales/modes: Major, Natural Minor, Harmonic Minor, Melodic Minor, Dorian, Phrygian, Lydian, Mixolydian, Locrian
  - Test each in multiple keys (C, A, E, F#)
  - Verify Relative notation displays correctly for all combinations
  - Verify no console errors, warnings, or performance issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - MVP foundation
- **User Story 5 (Phase 4)**: Depends on User Story 1 (uses Natural Minor for key-independence tests) - CRITICAL requirement
- **User Story 2 (Phase 5)**: Depends on Foundational (Phase 2) - Can proceed in parallel with US5 but after US1
- **User Story 3 (Phase 6)**: Depends on Foundational (Phase 2) - Can proceed in parallel with US2/US5
- **User Story 4 (Phase 7)**: Depends on Foundational (Phase 2) - Can proceed in parallel with US2/US3/US5
- **User Story 6 (Phase 8)**: Depends on Foundational (Phase 2) - Can proceed in parallel with other user stories
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P2)**: DEPENDS on User Story 1 - tests Natural Minor key-independence, requires US1 implementation
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US5 but builds on same infrastructure
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of all other stories
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of all other stories
- **User Story 6 (P5)**: Can start after Foundational (Phase 2) - Independent of all other stories

### Within Each User Story

- Tests MUST be written FIRST and FAIL before implementation (TDD approach)
- Integration tests (60-70%) before E2E tests (20-30%)
- E2E tests before unit tests (10-20% edge cases only)
- Implementation follows test creation
- Coverage verification confirms story completion
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 Setup**: All 4 tasks (T001-T004) can run in parallel
- **Phase 2 Foundational**: T005 and T006 MUST be sequential (T006 depends on T005 constant), T007 depends on T006
- **Phase 3 User Story 1 Tests**: T008, T009, T011 can run in parallel (different test files/sections)
- **Phase 4 User Story 5 Tests**: T020, T021, T022, T023, T025 can all run in parallel (different scales/test cases)
- **After Phase 4 completion**: User Stories 2, 3, 4, 6 can ALL proceed in parallel (if team capacity allows)
  - Each tests different scales/modes with no file conflicts
  - T034-T037 (US2), T045-T048 (US3), T056-T059 (US4), T067-T073 (US6) can all run concurrently
- **Phase 8 User Story 6**: T067-T071, T073-T078 can run in parallel (different modes, different test cases)
- **Phase 9 Polish**: T084-T092 (edge cases, backward compat) can all run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1 + 5 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T008-T019) - Natural Minor correct syllables
4. Complete Phase 4: User Story 5 (T020-T033) - Key independence (CRITICAL requirement)
5. **STOP and VALIDATE**: Test Natural Minor in all 12 keys independently
6. Deploy/demo if ready - this is the pedagogical foundation

### Incremental Delivery (All P1-P2 Stories)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → (Natural Minor works!)
3. Add User Story 5 → Test independently → (Key independence validated!)
4. Add User Story 2 → Test independently → (Harmonic Minor works!)
5. Deploy/demo P1-P2 stories - covers most common use cases

### Full Feature (All Stories P1-P5)

1. Complete MVP (US1 + US5) → Foundation + key independence
2. Add US2 (P2) → Harmonic Minor
3. Add US3 (P3) → Phrygian mode
4. Add US4 (P4) → Locrian mode
5. Add US6 (P5) → All remaining modes (Dorian, Lydian, Mixolydian, Melodic Minor, Major)
6. Complete Phase 9: Polish & Coverage Verification
7. Deploy complete movable-do solfege system

### Parallel Team Strategy

With multiple developers after Foundational phase completes:

1. **Team completes Setup + Foundational together** (T001-T007)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T008-T019) - Natural Minor
   - Developer B: User Story 2 (T034-T044) - Harmonic Minor (can start immediately, parallel to US1)
   - Developer C: User Story 3 (T045-T055) - Phrygian (can start immediately, parallel to US1/US2)
3. **After US1 completes**:
   - Developer A: User Story 5 (T020-T033) - Key independence (depends on US1)
   - Developer D: User Story 4 (T056-T066) - Locrian (parallel to US5)
4. **Final phase**:
   - Developer E: User Story 6 (T067-T083) - Remaining modes
   - All developers: Phase 9 Polish tasks (T084-T102) in parallel

---

## Notes

- **[P]** tasks = different files or independent test cases, no dependencies, can run in parallel
- **[Story]** label maps task to specific user story for traceability (US1-US6)
- Each user story is independently completable and testable
- **TDD approach**: Write tests FIRST, ensure they FAIL, then implement
- **Integration-first**: 60-70% integration tests, 20-30% E2E, 10-20% unit (edge cases only)
- **100% coverage MANDATORY** per Constitution v2.0.0
- Verify tests fail before implementing (red-green-refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **CRITICAL**: User Story 5 (key-independence) is THE foundational requirement of movable-do solfege
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

- **Total Tasks**: 102 tasks
- **Phases**: 9 phases (Setup, Foundational, 6 User Stories, Polish)
- **User Stories**: 6 stories prioritized P1 → P2 → P3 → P4 → P5
- **Test Coverage**: MANDATORY 100% coverage with 60-70% integration, 20-30% E2E, 10-20% unit tests
- **Parallel Opportunities**: 50+ tasks can run in parallel after Foundational phase (if team capacity allows)
- **MVP Scope**: Phases 1-4 (T001-T033) deliver Natural Minor with key-independence - minimum viable pedagogy
- **Critical Path**: Setup (4 tasks) → Foundational (3 tasks) → US1 (12 tasks) → US5 (14 tasks) = 33 tasks for MVP
- **Estimated Effort**:
  - MVP (US1+US5): ~8-12 hours solo developer
  - All P1-P2 stories (US1+US5+US2): ~12-16 hours
  - Full feature (all 6 stories + polish): ~20-30 hours
- **Performance Targets**: <50ms syllable update, <5s integration tests, <30s E2E tests
