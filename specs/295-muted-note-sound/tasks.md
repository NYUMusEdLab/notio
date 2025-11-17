# Tasks: Muted Sound for Out-of-Scale Notes

**Input**: Design documents from `/specs/295-muted-note-sound/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: All features MUST achieve 100% code coverage following Rainer Hahnekamp's integration-first testing principles:
- **Integration tests (60-70%)**: Primary test strategy covering realistic workflows and component interactions
- **E2E tests (20-30%)**: Critical user journeys and cross-browser compatibility
- **Unit tests (10-20%)**: Edge cases and complex algorithms only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

- Paths shown below assume the project's "web application" structure as defined in `plan.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare necessary assets for the feature.

- [x] T001 Create a placeholder audio file for the muted sound at `public/sounds/muted-kloink.wav`. (Note: As an LLM, I cannot create binary files. A silent or placeholder file should be created here manually).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the core audio service that will be used by the feature.

- [x] T002 Create the `AudioManager` service file to encapsulate `Tone.js` logic at `src/services/AudioManager.js`.

---

## Phase 3: User Story 1 - Muted Sound for Out-of-Scale Notes (Priority: P1) 🎯 MVP

**Goal**: Provide immediate audio feedback to the user by playing a distinct sound when they navigate to a piano key that is not in the selected musical scale.

**Independent Test**: Select a scale (e.g., C Major), use arrow keys to navigate to an in-scale note (e.g., C) and an out-of-scale note (e.g., C#), and verify that two different sounds are played.

### Tests for User Story 1 (MANDATORY for 100% coverage) ⚠️

**Unit Tests (Minimal - 10-20%, edge cases only)**:
- [x] T003 [P] [US1] Create unit tests for the scale-checking utility function in `src/__test__/utils/musicUtils.test.js`.

**Integration Tests (Primary - 60-70% of coverage)**:
- [x] T004 [P] [US1] Create integration test for the `Keyboard` component to verify it calls the `AudioManager` correctly on navigation. Place in a new file `src/__integration__/musical-components/Keyboard.int.test.js`.

**E2E Tests (Secondary - 20-30% of coverage)**:
- [x] T005 [P] [US1] Create E2E test to simulate the full user flow as described in `quickstart.md` in a new file `e2e/feature-muted-sound.spec.js`.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create a new utility function `isNoteInScale(note, scale)` in `src/components/utils/musicUtils.js`.
- [x] T007 [US1] Implement the `AudioManager` service in `src/services/AudioManager.js`. It must load the instrument sampler and the muted sound, and expose a method like `playSound(note, isNoteInScale)`.
- [x] T008 [US1] Modify the application's state management (`src/WholeApp.js` or similar) to provide the currently selected scale to the view containing the keyboard.
- [x] T009 [US1] Modify the `Keyboard` component (`src/components/keyboard/Keyboard.js` or similar) to receive the current scale, use the `isNoteInScale` utility, and call the `AudioManager` on key navigation.
- [ ] T010 [US1] Verify 100% code coverage is achieved for all new and modified files related to this user story.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and validation.

- [ ] T011 [P] Update user documentation or in-app help sections to explain the new audio feedback feature.
- [ ] T012 Run `quickstart.md` validation to ensure the manual test steps work as expected.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Story 1 (Phase 3)**: Depends on Foundational.
- **Polish (Phase 4)**: Depends on User Story 1.

### Within User Story 1

- **Parallel Tasks**: T003, T004, T005, and T006 can be started in parallel.
- **T007 (Implement AudioManager)** depends on T001 and T002.
- **T009 (Modify Keyboard)** depends on T006, T007, and T008.
- Tests (T003, T004, T005) should ideally be written before or alongside the implementation tasks they cover.

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup.
2.  Complete Phase 2: Foundational.
3.  Complete Phase 3: User Story 1.
4.  **STOP and VALIDATE**: Test User Story 1 independently using the manual steps in `quickstart.md` and by running the automated tests.
5.  Complete Phase 4: Polish.
6.  The feature is now ready for deployment.
