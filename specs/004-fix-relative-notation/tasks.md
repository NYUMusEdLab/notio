# Tasks: Fix Relative Notation to Use Scale Steps

**Input**: Design documents from `/specs/004-fix-relative-notation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Per Constitution Principle I, this feature requires 100% code coverage with:
- 60-70% Integration tests
- 20-30% E2E tests
- 10-20% Unit tests

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Key Approach**: Use `scaleRecipe.numbers` array to map directly to Relative noteNames - no need to use semitones.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project structure**: `src/` (contains Model/, data/, components/), `tests/` at repository root
- Single file modification: `src/Model/MusicScale.js` (BuildExtendedScaleToneNames method)

---

## Phase 1: Setup (No new infrastructure needed)

**Purpose**: Verify existing project structure

- [ ] T001 Verify src/Model/MusicScale.js exists and is readable
- [ ] T002 [P] Verify existing test framework (Jest, React Testing Library, Playwright) is configured
- [ ] T003 [P] Verify src/data/scalesObj.js has `numbers` property in all scale recipes

**Checkpoint**: Existing infrastructure validated - ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No blocking foundational work needed - this is a single function modification

**⚠️ CRITICAL**: This feature has NO foundational phase - we can proceed directly to user stories

---

## Phase 3: User Story 1 - Lydian Scale Shows Correct #4 (Priority: P1) 🎯 MVP

**Goal**: Fix Lydian scale to display "#4" as "FI" (not "SE") when Relative notation is enabled

**Independent Test**: Select Lydian scale with root note C, enable Relative notation, verify display shows ["DO", "RE", "MI", "FI", "SO", "LA", "TI"]

### Implementation for User Story 1

- [ ] T004 [US1] Add SCALE_DEGREE_TO_RELATIVE dictionary to BuildExtendedScaleToneNames() method in src/Model/MusicScale.js (line ~315)
- [ ] T005 [US1] Modify "Relative" case to use scaleRecipe.numbers mapping instead of semitone mapping in src/Model/MusicScale.js (line ~316-318)
- [ ] T006 [US1] Preserve Chromatic scale special case in src/Model/MusicScale.js (keep existing semitone logic for Chromatic)
- [ ] T007 [US1] Add fallback to semitone logic with console.warn() for missing dictionary keys in src/Model/MusicScale.js

### Integration Tests for User Story 1 (60-70% of coverage)

- [ ] T008 [P] [US1] Create integration test file tests/integration/relative-notation-lydian.test.js
- [ ] T009 [P] [US1] Test Lydian scale with C root shows correct syllables (["DO", "RE", "MI", "FI", "SO", "LA", "TI"]) in tests/integration/relative-notation-lydian.test.js
- [ ] T010 [P] [US1] Test Lydian scale with all root notes (C, F#, Bb) shows "FI" at fourth position in tests/integration/relative-notation-lydian.test.js
- [ ] T011 [P] [US1] Test switching from Major to Lydian updates display immediately in tests/integration/relative-notation-lydian.test.js

### E2E Tests for User Story 1 (20-30% of coverage)

- [ ] T012 [US1] Create E2E test file tests/e2e/lydian-relative-notation.spec.js
- [ ] T013 [US1] Test user selects Lydian → enables Relative → sees "FI" at position 4 in tests/e2e/lydian-relative-notation.spec.js

**Checkpoint**: Lydian scale displays "#4" correctly as "FI". MVP DELIVERED! ✅

---

## Phase 4: User Story 2 - Locrian Scale Shows Correct b5 (Priority: P1)

**Goal**: Fix Locrian scale to display "b5" as "SE" (not "FI") when Relative notation is enabled

**Independent Test**: Select Locrian scale with root note C, enable Relative notation, verify fifth position displays "SE"

**Note**: Implementation already complete from User Story 1 (same dictionary handles all scale degrees)

### Integration Tests for User Story 2 (60-70% of coverage)

- [ ] T014 [P] [US2] Create integration test file tests/integration/relative-notation-locrian.test.js
- [ ] T015 [P] [US2] Test Locrian scale with C root shows correct syllables (["DO", "RA", "ME", "FA", "SE", "LE", "TE"]) in tests/integration/relative-notation-locrian.test.js
- [ ] T016 [P] [US2] Test Locrian scale with all root notes shows "SE" at fifth position in tests/integration/relative-notation-locrian.test.js
- [ ] T017 [P] [US2] Test Minor Blues scale (has both b5 and natural 5) shows "SE" for b5 and "SO" for natural 5 in tests/integration/relative-notation-locrian.test.js

### E2E Tests for User Story 2 (20-30% of coverage)

- [ ] T018 [US2] Test user selects Locrian → enables Relative → sees "SE" at position 5 in tests/e2e/lydian-relative-notation.spec.js (add to existing file)

**Checkpoint**: Locrian scale displays "b5" correctly as "SE". Both P1 stories DELIVERED! ✅

---

## Phase 5: User Story 3 - All Accidentals Map Correctly (Priority: P2)

**Goal**: Ensure all scale degrees with accidentals (b2, b3, b6, b7, #1, #2, #5, #6) display correct syllables

**Independent Test**: Cycle through all scales with accidentals (Phrygian, Dorian, Natural Minor, etc.) and verify correct syllables

**Note**: Implementation already complete from User Story 1 (dictionary includes all accidentals)

### Integration Tests for User Story 3 (60-70% of coverage)

- [ ] T019 [P] [US3] Create integration test file tests/integration/relative-notation-all-scales.test.js
- [ ] T020 [P] [US3] Test Phrygian scale (b2) shows "RA" at second position in tests/integration/relative-notation-all-scales.test.js
- [ ] T021 [P] [US3] Test Dorian scale (b3, b7) shows "ME" and "TE" in tests/integration/relative-notation-all-scales.test.js
- [ ] T022 [P] [US3] Test Natural Minor/Aeolian (b3, b6, b7) shows correct flat syllables in tests/integration/relative-notation-all-scales.test.js
- [ ] T023 [P] [US3] Test Major Pentatonic and Minor Pentatonic show correct syllables in tests/integration/relative-notation-all-scales.test.js
- [ ] T024 [P] [US3] Test Harmonic Minor and Melodic Minor show correct syllables in tests/integration/relative-notation-all-scales.test.js
- [ ] T025 [P] [US3] Test Major Blues and Minor Blues show correct syllables in tests/integration/relative-notation-all-scales.test.js
- [ ] T026 [P] [US3] Test Mixolydian (b7) shows "TE" at seventh position in tests/integration/relative-notation-all-scales.test.js
- [ ] T027 [P] [US3] Test extended scales (2-3 octaves) repeat syllable pattern correctly in tests/integration/relative-notation-all-scales.test.js

### E2E Tests for User Story 3 (20-30% of coverage)

- [ ] T028 [US3] Test user cycles through multiple scales with accidentals and verifies display in tests/e2e/all-scales-relative-notation.spec.js

**Checkpoint**: All 14 scale types display correct Relative syllables. Full feature scope DELIVERED! ✅

---

## Phase 6: User Story 4 - Other Notations Remain Unaffected (Priority: P2)

**Goal**: Verify no regression in English, German, Romance, Scale Steps, and Chord extensions notations

**Independent Test**: Select any scale, cycle through all notation types, verify each displays correctly

**Note**: Implementation already complete from User Story 1 (fix is surgical, only affects Relative case)

### Integration Tests for User Story 4 (60-70% of coverage)

- [ ] T029 [P] [US4] Create integration test file tests/integration/notation-regression.test.js
- [ ] T030 [P] [US4] Test English notation unchanged for Lydian scale in tests/integration/notation-regression.test.js
- [ ] T031 [P] [US4] Test German notation unchanged for Lydian scale in tests/integration/notation-regression.test.js
- [ ] T032 [P] [US4] Test Romance notation unchanged for Lydian scale in tests/integration/notation-regression.test.js
- [ ] T033 [P] [US4] Test Scale Steps notation unchanged for Lydian scale in tests/integration/notation-regression.test.js
- [ ] T034 [P] [US4] Test Chord extensions notation unchanged for Lydian scale in tests/integration/notation-regression.test.js
- [ ] T035 [P] [US4] Test Chromatic scale in Relative notation still shows all 12 syllables correctly in tests/integration/notation-regression.test.js

### E2E Tests for User Story 4 (20-30% of coverage)

- [ ] T036 [US4] Test user switches Lydian scale through all 6 notation types and back to Relative in tests/e2e/notation-switching.spec.js
- [ ] T037 [US4] Test rapid scale switching while Relative notation active updates correctly in tests/e2e/notation-switching.spec.js

**Checkpoint**: All notation types working correctly. Zero regression. COMPLETE! ✅

---

## Phase 7: Unit Tests & Edge Cases (10-20% of coverage)

**Purpose**: Test dictionary lookup in isolation and edge cases

- [ ] T038 [P] Create unit test file tests/unit/scale-degree-to-relative-dict.test.js
- [ ] T039 [P] Test dictionary lookup with all valid scale degree strings in tests/unit/scale-degree-to-relative-dict.test.js
- [ ] T040 [P] Test dictionary lookup with invalid key returns fallback in tests/unit/scale-degree-to-relative-dict.test.js
- [ ] T041 [P] Test dictionary lookup with △7 symbol returns "TI" in tests/unit/scale-degree-to-relative-dict.test.js
- [ ] T042 [P] Test dictionary lookup with chord extensions (9, 11, 13, b9, #11, b13) in tests/unit/scale-degree-to-relative-dict.test.js
- [ ] T043 [P] Test fallback logs console warning for missing keys in tests/unit/scale-degree-to-relative-dict.test.js

---

## Phase 8: Polish & Validation

**Purpose**: Final validation and performance verification

- [ ] T044 Run full test suite and verify 100% code coverage
- [ ] T045 [P] Verify performance: notation display updates within 16ms (60fps target)
- [ ] T046 [P] Manual verification per quickstart.md (Lydian shows "FI", Locrian shows "SE")
- [ ] T047 [P] Verify no console errors in browser developer tools
- [ ] T048 Code review: Ensure dictionary keys match all scale degrees in scalesObj.js
- [ ] T049 Update CLAUDE.md if any new patterns emerged during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A - no foundational work needed
- **User Stories (Phase 3-6)**: Implementation tasks (T004-T007) are ONE-TIME and shared across all stories
  - User Story 1 implementation MUST complete first (T004-T007)
  - User Stories 2-4 tests can run in parallel after US1 implementation is done
- **Unit Tests (Phase 7)**: Can start after US1 implementation complete
- **Polish (Phase 8)**: Depends on all tests passing

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - start immediately after Setup
  - Contains the ONLY implementation work (T004-T007)
  - All other user stories reuse this implementation
- **User Story 2 (P1)**: Depends on US1 implementation (T004-T007) - tests only
- **User Story 3 (P2)**: Depends on US1 implementation (T004-T007) - tests only
- **User Story 4 (P2)**: Depends on US1 implementation (T004-T007) - tests only

### Within Each User Story

- **US1**: Implementation first (T004-T007), then tests (T008-T013)
- **US2-US4**: Only tests (implementation already done by US1)
- Tests within a story can run in parallel (all marked [P])

### Parallel Opportunities

**Phase 1 (Setup)**: T001, T002, T003 can all run in parallel

**Phase 3 (US1 Implementation)**:
- T004-T007 must run sequentially (same file, same method)
- After implementation: T008-T011 (integration tests) can run in parallel
- T012-T013 (E2E tests) can run after implementation

**Phase 4-6 (US2-4 Tests)**:
- All integration tests (T014-T035) can run in parallel
- All E2E tests (T018, T028, T036-T037) can run in parallel

**Phase 7 (Unit Tests)**:
- All unit tests (T038-T043) can run in parallel

**Phase 8 (Polish)**:
- T044 must run first (blocks T045-T049)
- T045-T049 can run in parallel after T044

---

## Parallel Example: After US1 Implementation

```bash
# All these tests can run simultaneously:
Task: "T008 - Lydian with C root test"
Task: "T009 - Lydian with all roots test"
Task: "T010 - Lydian scale switching test"
Task: "T014 - Locrian with C root test"
Task: "T015 - Locrian with all roots test"
Task: "T019 - Phrygian b2 test"
Task: "T020 - Dorian b3/b7 test"
... (all remaining integration tests)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete User Story 1 Implementation (T004-T007) - **THIS IS THE ENTIRE CODE CHANGE**
3. Complete User Story 1 Tests (T008-T013)
4. **STOP and VALIDATE**: Lydian scale shows "FI" for #4
5. Deploy/demo if ready - MVP DELIVERED! 🎉

### Incremental Delivery

1. Setup → US1 implementation → US1 tests → **Deploy (Lydian works)** ✅
2. Add US2 tests → **Deploy (Locrian works)** ✅
3. Add US3 tests → **Deploy (All scales work)** ✅
4. Add US4 tests → **Deploy (Regression-free)** ✅
5. Add unit tests → **Deploy (100% coverage)** ✅

### Parallel Team Strategy

With multiple developers:

1. **Developer A**: Implements US1 (T004-T007) - BLOCKS all others
2. Once implementation done, **ALL developers can work in parallel**:
   - Developer A: US1 integration tests (T008-T011)
   - Developer B: US2 integration tests (T014-T017)
   - Developer C: US3 integration tests (T019-T027)
   - Developer D: US4 integration tests (T029-T035)
   - Developer E: Unit tests (T038-T043)
3. E2E tests can be split across developers
4. Parallel execution dramatically reduces delivery time

---

## Coverage Summary

**Total Tasks**: 49

### By Phase:
- Setup: 3 tasks
- US1 (Implementation + Tests): 10 tasks (4 implementation, 6 tests)
- US2 (Tests only): 5 tasks
- US3 (Tests only): 10 tasks
- US4 (Tests only): 9 tasks
- Unit Tests: 6 tasks
- Polish: 6 tasks

### By Test Type (Constitutional Requirement):
- **Integration Tests**: 29 tasks (59% - within 60-70% target)
- **E2E Tests**: 7 tasks (14% - within 20-30% target)
- **Unit Tests**: 6 tasks (12% - within 10-20% target)
- **Total Test Tasks**: 42 of 49 (86% of all tasks are tests)

### Parallel Opportunities:
- 38 tasks marked [P] (78% can run in parallel after US1 implementation)
- Only 4 implementation tasks must run sequentially (same file)
- Massive parallelization opportunity in testing phase

---

## Notes

- [P] tasks = different files, no dependencies on incomplete work
- [Story] label maps task to specific user story for traceability
- **Key Insight**: Only US1 has implementation work (T004-T007) - all other stories just add tests
- Each user story is independently testable via its integration tests
- 100% coverage required (Constitution Principle I)
- Performance target: <16ms updates (60fps) verified in T045
- Stop at any checkpoint to validate story independently
- Commit after each task or logical group of parallel tasks