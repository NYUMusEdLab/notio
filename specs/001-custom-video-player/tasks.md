# Tasks: Custom Video Player

**Input**: Design documents from `/specs/001-custom-video-player/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are included per constitution requirement (Integration-First Testing principle).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Source**: `src/components/menu/` (new component alongside VideoTutorial)
- **Integration Tests**: `src/__integration__/`
- **Unit Tests**: `src/__test__/`
- **E2E Tests**: `tests/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure verification and test setup

- [x] T001 Verify existing dependencies in package.json (react-player, react-bootstrap, react-draggable already present)
- [x] T002 [P] Create ReactPlayer mock for unit tests in src/__mocks__/react-player.js
- [x] T003 [P] Verify plugin_root portal element exists in public/index.html

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core component shell that all user stories build upon

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create CustomVideoPlayer component shell in src/components/menu/CustomVideoPlayer.js with props interface (defaultVideoUrl, onClose, initialTab, onUrlChange)
- [x] T005 Add PropTypes definitions to CustomVideoPlayer.js matching data-model.md spec
- [x] T006 Setup component state (currentUrl, activeTab, isPlaying, error) using useState hooks in src/components/menu/CustomVideoPlayer.js

**Checkpoint**: Component shell exists with proper props/state - user story implementation can now begin

---

## Phase 3: User Story 1 - View Default Video Content (Priority: P1) 🎯 MVP

**Goal**: Video player loads with default URL and displays in overlay with playback controls

**Independent Test**: Open video player → default video loads and plays correctly

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Integration test: render with default URL in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T008 [P] [US1] Integration test: playback controls visible and functional in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T009 [P] [US1] Integration test: accessibility audit with jest-axe in src/__integration__/CustomVideoPlayer.integration.test.js

### Implementation for User Story 1

- [x] T010 [US1] Integrate Overlay component wrapper in src/components/menu/CustomVideoPlayer.js (import from ../OverlayPlugins/Overlay)
- [x] T011 [US1] Add ReactPlayer component with default URL, controls=true in src/components/menu/CustomVideoPlayer.js
- [x] T012 [US1] Implement onReady handler to set isPlaying=true in src/components/menu/CustomVideoPlayer.js
- [x] T013 [US1] Implement onClose prop callback when overlay closes in src/components/menu/CustomVideoPlayer.js
- [x] T014 [US1] Add ARIA attributes (role, aria-label) to interactive elements in src/components/menu/CustomVideoPlayer.js
- [x] T015 [US1] Add keyboard navigation (Enter/Space activation) to player controls in src/components/menu/CustomVideoPlayer.js

**Checkpoint**: User Story 1 complete - default video plays in overlay with controls

---

## Phase 4: User Story 2 - Enter Custom Video URL (Priority: P2)

**Goal**: Users can enter/paste custom URLs to play different content

**Independent Test**: Navigate to URL input → enter URL → submit → video loads

### Tests for User Story 2

- [x] T016 [P] [US2] Integration test: URL input field renders in Enter_url tab in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T017 [P] [US2] Integration test: URL submission updates player content in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T018 [P] [US2] Integration test: "Currently watching" shows current URL in src/__integration__/CustomVideoPlayer.integration.test.js

### Implementation for User Story 2

- [x] T019 [US2] Add Tab component (react-bootstrap Tabs) with Player and Enter_url tabs in src/components/menu/CustomVideoPlayer.js
- [x] T020 [US2] Implement tab state management (activeTab) with onSelect handler in src/components/menu/CustomVideoPlayer.js
- [x] T021 [US2] Create URL input Form with text field in Enter_url tab in src/components/menu/CustomVideoPlayer.js
- [x] T022 [US2] Implement handleSubmit to update currentUrl state and switch to Player tab in src/components/menu/CustomVideoPlayer.js
- [x] T023 [US2] Add "Currently watching" display showing current URL in Enter_url tab in src/components/menu/CustomVideoPlayer.js
- [x] T024 [US2] Call onUrlChange callback when URL changes in src/components/menu/CustomVideoPlayer.js
- [x] T025 [US2] Add keyboard support for form submission (Enter key) in src/components/menu/CustomVideoPlayer.js

**Checkpoint**: User Stories 1 AND 2 complete - can view default and enter custom URLs

---

## Phase 5: User Story 3 - Reset to Default URL (Priority: P3)

**Goal**: Users can reset to original default URL with single click

**Independent Test**: Play custom URL → click Reset → default URL loads

### Tests for User Story 3

- [x] T026 [P] [US3] Integration test: Reset button visible in Enter_url tab in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T027 [P] [US3] Integration test: Reset restores defaultVideoUrl prop value in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T028 [P] [US3] Integration test: Reset when already default does not error in src/__integration__/CustomVideoPlayer.integration.test.js

### Implementation for User Story 3

- [x] T029 [US3] Add Reset button in Enter_url tab in src/components/menu/CustomVideoPlayer.js
- [x] T030 [US3] Implement resetVideoUrl handler that sets currentUrl = props.defaultVideoUrl in src/components/menu/CustomVideoPlayer.js
- [x] T031 [US3] Style Reset button with variant="outline-danger" matching existing pattern in src/components/menu/CustomVideoPlayer.js
- [x] T032 [US3] Add aria-label="Reset to default video" to Reset button in src/components/menu/CustomVideoPlayer.js
- [x] T033 [US3] Add keyboard activation (Enter/Space) to Reset button in src/components/menu/CustomVideoPlayer.js

**Checkpoint**: User Stories 1, 2, AND 3 complete - full URL management working

---

## Phase 6: User Story 4 - Display in Overlay/Modal (Priority: P4)

**Goal**: Video player displays in draggable, minimizable overlay

**Independent Test**: Open player → drag overlay → minimize → close with Escape

### Tests for User Story 4

- [x] T034 [P] [US4] Integration test: Overlay renders via portal in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T035 [P] [US4] Integration test: Escape key closes overlay in src/__integration__/CustomVideoPlayer.integration.test.js
- [x] T036 [P] [US4] E2E test: Full user journey in tests/e2e/custom-video-player.spec.js
- [x] T037 [P] [US4] E2E test: Keyboard-only navigation in tests/e2e/custom-video-player.spec.js

### Implementation for User Story 4

- [x] T038 [US4] Verify Overlay component handles drag via react-draggable in src/components/menu/CustomVideoPlayer.js
- [x] T039 [US4] Verify Overlay component handles minimize/close buttons in src/components/menu/CustomVideoPlayer.js
- [x] T040 [US4] Verify Escape key handler from Overlay triggers onClose in src/components/menu/CustomVideoPlayer.js
- [x] T041 [US4] Add focus management: return focus to trigger on close in src/components/menu/CustomVideoPlayer.js

**Checkpoint**: All 4 user stories complete - full feature functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, and final validation

- [x] T042 [P] Unit test: Empty URL submission prevented in src/__test__/CustomVideoPlayer.unit.test.js
- [x] T043 [P] Unit test: Invalid URL error handling in src/__test__/CustomVideoPlayer.unit.test.js
- [x] T044 Implement onError handler for ReactPlayer with user-friendly message in src/components/menu/CustomVideoPlayer.js
- [x] T045 Add error state display (conditional render when error !== null) in src/components/menu/CustomVideoPlayer.js
- [x] T046 [P] E2E test: Cross-browser validation (Chrome, Firefox, Safari) in tests/e2e/custom-video-player.spec.js
- [ ] T047 Add component styles in src/styles/ following existing patterns (if needed)
- [ ] T048 Run quickstart.md validation checklist
- [ ] T049 Run full test suite and verify 100% coverage for new code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): No dependencies on other stories
  - US2 (P2): Builds on US1 (tab navigation uses player from US1)
  - US3 (P3): Builds on US2 (reset appears in Enter_url tab)
  - US4 (P4): Can run in parallel with US2/US3 (overlay behavior is independent)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```text
Phase 2 (Foundational)
        │
        ▼
   ┌────┴────┐
   │         │
   ▼         ▼
  US1 ────► US4 (can parallel)
   │
   ▼
  US2
   │
   ▼
  US3
   │
   ▼
Phase 7 (Polish)
```

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Component structure before behavior
- Core implementation before integration
- Accessibility before completion

### Parallel Opportunities

- T002, T003 in Phase 1 (different files)
- T007, T008, T009 in US1 tests (different test cases)
- T016, T017, T018 in US2 tests (different test cases)
- T026, T027, T028 in US3 tests (different test cases)
- T034, T035, T036, T037 in US4 tests (different test cases)
- T042, T043, T046 in Polish (different files)

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all US1 tests together:
Task T007: "Integration test: render with default URL"
Task T008: "Integration test: playback controls visible"
Task T009: "Integration test: accessibility audit"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Demo: Video player opens with default video in overlay

### Incremental Delivery

1. Complete Setup + Foundational → Component shell ready
2. Add User Story 1 → Test independently → Demo (MVP: default video plays)
3. Add User Story 2 → Test independently → Demo (custom URL entry)
4. Add User Story 3 → Test independently → Demo (reset functionality)
5. Add User Story 4 → Test independently → Demo (overlay polish)
6. Complete Polish → Full feature ready

### Single Developer Strategy

Execute in order: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests written FIRST per constitution (Integration-First Testing)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All interactive elements need keyboard support + ARIA attributes
