---

description: "Task list for Piano Key Keyboard Navigation feature"
---

# Tasks: Piano Key Keyboard Navigation

**Input**: Design documents from `/specs/001-piano-key-keyboard-navigation/`
**Prerequisites**: plan.md (complete), spec.md (complete), CLARIFICATION_SUMMARY.md (complete)

**Tests**: All features MUST achieve 100% code coverage following Rainer Hahnekamp's integration-first testing principles:
- **Integration tests (60-70%)**: Primary test strategy covering realistic workflows and component interactions
- **E2E tests (20-30%)**: Critical user journeys and cross-browser compatibility
- **Unit tests (10-20%)**: Edge cases and complex algorithms only (not simple getters/setters)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (React SPA)**: `src/`, `src/__integration__/accessibility/`, `e2e/accessibility/`
- Paths follow existing Notio structure (React 18.2.0 frontend)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and tools are ready

- [ ] T001 [P] Verify React 18.2.0 environment and dependencies (package.json)
- [ ] T002 [P] Verify jest-axe is configured in src/__integration__/accessibility/
- [ ] T003 [P] Verify Playwright and @axe-core/playwright are configured in e2e/

---

## Phase 2: Foundational (Codebase Exploration - Phase 0 from plan.md)

**Purpose**: Locate and understand all existing implementations before enhancement work begins

**⚠️ CRITICAL**: No user story implementation can begin until all existing components are located and documented

### Research: Locate Existing Components

- [ ] T004 [P] [Research] Locate piano keyboard parent container component (search for tabIndex={0}, role="application" in src/components/)
- [ ] T005 [P] [Research] Find existing arrow key navigation implementation (search for "ArrowRight", "ArrowLeft" handlers)
- [ ] T006 [P] [Research] Locate Enter/Space activation handlers (search for "Enter", "Space", " " key handlers)
- [ ] T007 [P] [Research] Find computer keyboard shortcut mapping (search for "FGH", "ZXCASDQWE" in src/lib/ or src/components/)
- [ ] T008 [P] [Research] Locate scale state and scale detection logic (search for "scale", "Major", "Minor" in src/services/ or state management)
- [ ] T009 [P] [Research] Find color parent component and synchronization logic (search for "color", "colorblind", number key bindings in src/components/)
- [ ] T010 [P] [Research] Locate Web Audio API integration for note playback (search for "AudioContext", "Web Audio", "playNote" in src/services/)

### Research: Performance Baseline

- [ ] T011 [Research] Measure current keypress-to-sound latency baseline (Performance API profiling - target: establish <20ms baseline)
- [ ] T012 [Research] Measure current arrow key navigation response time (Performance API profiling - target: establish <50ms baseline)

### Research: Best Practices & Design

- [ ] T013 [P] [Research] Research WAI-ARIA application pattern best practices (role="application" usage, screen reader behavior)
- [ ] T014 [P] [Research] Research out-of-scale audio cue design options (muted tone vs click vs brief dissonant chord - document pros/cons)
- [ ] T015 [P] [Research] Research React performance optimization for state + refs hybrid approach (React DevTools Profiler, re-render minimization)

### Research: Documentation

- [ ] T016 [Research] Document all findings in specs/001-piano-key-keyboard-navigation/research.md (file paths, component names, architecture diagrams, current keyboard event flow, performance baselines, best practices decisions)

**Checkpoint**: Foundation research complete - all existing components located and documented. User story implementation can now begin.

---

## Phase 3: User Story 1 - Navigate to Piano Keyboard (Priority: P1) 🎯 MVP

**Goal**: Keyboard-only users can tab to the piano keyboard and see a clear focus indicator

**Independent Test**: User can Tab from menu buttons to piano keyboard container and see visible focus indicator. Screen reader announces "Piano keyboard, use arrow keys to select notes".

### Tests for User Story 1 (MANDATORY for 100% coverage) ⚠️

> **NOTE: Integration tests are PRIMARY. Write integration tests FIRST to cover main workflows, then add unit tests ONLY for edge cases not covered by integration tests.**

**Integration Tests (Primary - 60-70% of coverage)**:
- [ ] T017 [P] [US1] Integration test: Tab navigation to piano keyboard container with focus indicator visible in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T018 [P] [US1] Integration test: Piano keyboard receives focus after menu buttons in natural tab order in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T019 [P] [US1] Integration test: Jest-axe audit for WCAG violations on piano keyboard focus state in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T020 [P] [US1] Integration test: ARIA label "Piano keyboard, use arrow keys to select notes" announced correctly in src/__integration__/accessibility/keyboard-piano-navigation.test.js

**E2E Tests (Secondary - 20-30% of coverage)**:
- [ ] T021 [P] [US1] E2E test: Keyboard-only workflow - Tab to piano keyboard and verify focus indicator in e2e/accessibility/keyboard-workflow.spec.js
- [ ] T022 [P] [US1] E2E test: Screen reader accessibility tree validation for piano keyboard container in e2e/accessibility/screen-reader-e2e.spec.js

**Unit Tests (Minimal - 10-20%, edge cases only)**:
- [ ] T023 [P] [US1] Unit test: Focus state initialization (default focusedKeyIndex = 0) in src/__tests__/unit/accessibility/piano-keyboard-focus.test.js (if needed)

### Implementation for User Story 1

- [ ] T024 [US1] Enhance piano keyboard parent container with tabIndex={0} and role="application" in src/components/[PianoKeyboard].js (based on T004 findings)
- [ ] T025 [US1] Add aria-label="Piano keyboard, use arrow keys to select notes" to piano keyboard container in src/components/[PianoKeyboard].js
- [ ] T026 [US1] Verify focus indicator visibility (ensure no outline removal in CSS) in src/components/[PianoKeyboard].css or global styles
- [ ] T027 [US1] Verify single tab stop behavior (container tabIndex={0}, keys tabIndex={-1}) in src/components/[PianoKey].js
- [ ] T028 [US1] Verify 100% code coverage achieved via integration + E2E + unit tests (run coverage report)

**Checkpoint**: User Story 1 complete - Piano keyboard is now keyboard-accessible with visible focus indicator

---

## Phase 4: User Story 2 - Navigate Between Keys with Arrow Keys (Priority: P1) 🎯 MVP

**Goal**: Keyboard-only users can use arrow keys to move focus between piano keys

**Independent Test**: With piano keyboard focused, user can press Arrow Right/Left to move focus through all keys chromatically. Visual focus indicator moves with navigation. Screen reader announces each key name.

### Tests for User Story 2 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T029 [P] [US2] Integration test: Arrow Right navigates to next key chromatically (C→C#→D) in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T030 [P] [US2] Integration test: Arrow Left navigates to previous key chromatically (D→C#→C) in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T031 [P] [US2] Integration test: Circular wrapping at boundaries (last key → first key, first key → last key) in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T032 [P] [US2] Integration test: Arrow Up navigates to same note next octave (C4→C5) in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T033 [P] [US2] Integration test: Arrow Down navigates to same note previous octave (C5→C4) in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T034 [P] [US2] Integration test: Home key jumps to first key (A0) in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T035 [P] [US2] Integration test: End key jumps to last key (C8) in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T036 [P] [US2] Integration test: Focus indicator updates visually on navigation in src/__integration__/accessibility/keyboard-piano-navigation.test.js
- [ ] T037 [P] [US2] Integration test: Performance - Arrow key navigation response time <50ms in src/__integration__/accessibility/keyboard-piano-navigation.test.js

**E2E Tests (Secondary)**:
- [ ] T038 [P] [US2] E2E test: Complete navigation workflow (Arrow keys, Home, End) across all 88 keys in e2e/accessibility/keyboard-workflow.spec.js
- [ ] T039 [P] [US2] E2E test: Screen reader announces each key name on focus (e.g., "C4", "D sharp 4") in e2e/accessibility/screen-reader-e2e.spec.js
- [ ] T040 [P] [US2] E2E test: Cross-browser navigation compatibility (Chrome, Firefox, Safari) in e2e/accessibility/keyboard-workflow.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T041 [P] [US2] Unit test: Octave calculation algorithm edge cases (C0→C-1 stays C0, C8→C9 stays C8) in src/__tests__/unit/accessibility/piano-keyboard-navigation.test.js
- [ ] T042 [P] [US2] Unit test: Circular wrapping boundary conditions (index 0 → -1 wraps to 87, index 87 → 88 wraps to 0) in src/__tests__/unit/accessibility/piano-keyboard-navigation.test.js
- [ ] T043 [P] [US2] Unit test: Key index to note name mapping algorithm (index 0 = A0, index 87 = C8) in src/__tests__/unit/accessibility/piano-keyboard-navigation.test.js

### Implementation for User Story 2

- [ ] T044 [US2] Enhance existing arrow key navigation handlers (ArrowRight, ArrowLeft, ArrowUp, ArrowDown) in src/components/[PianoKeyboard].js
- [ ] T045 [US2] Implement Home/End key handlers (jump to first/last key) in src/components/[PianoKeyboard].js
- [ ] T046 [US2] Implement circular wrapping logic for Arrow Right/Left at boundaries in src/components/[PianoKeyboard].js
- [ ] T047 [US2] Implement octave navigation logic for Arrow Up/Down (same note, different octave) in src/components/[PianoKeyboard].js
- [ ] T048 [US2] Enhance focusedKeyIndex state management (state + refs hybrid - Option B) in src/components/[PianoKeyboard].js
- [ ] T049 [US2] Add navigateToKey function (setFocusedKeyIndex + keyRefs.current[newIndex].focus()) in src/components/[PianoKeyboard].js
- [ ] T050 [US2] Add ARIA live region for announcing focused key name (aria-live="polite") in src/components/[PianoKeyboard].js
- [ ] T051 [US2] Add Performance API profiling for navigation response time verification in src/components/[PianoKeyboard].js
- [ ] T052 [US2] Verify 100% code coverage achieved via integration + E2E + unit tests

**Checkpoint**: User Story 2 complete - Users can now navigate all 88 keys with arrow keys

---

## Phase 5: User Story 3 - Play Notes with Enter/Space (Priority: P1) 🎯 MVP

**Goal**: Keyboard-only users can press Enter or Space to play the currently focused piano key

**Independent Test**: With focus on a piano key, user presses Enter or Space and hears the note play immediately (<20ms latency). Focus remains on the same key.

### Tests for User Story 3 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T053 [P] [US3] Integration test: Enter key plays focused note in src/__integration__/accessibility/keyboard-piano-activation.test.js
- [ ] T054 [P] [US3] Integration test: Space key plays focused note in src/__integration__/accessibility/keyboard-piano-activation.test.js
- [ ] T055 [P] [US3] Integration test: Focus remains on same key after Enter activation in src/__integration__/accessibility/keyboard-piano-activation.test.js
- [ ] T056 [P] [US3] Integration test: Focus remains on same key after Space activation in src/__integration__/accessibility/keyboard-piano-activation.test.js
- [ ] T057 [P] [US3] Integration test: Space key preventDefault prevents page scroll in src/__integration__/accessibility/keyboard-piano-activation.test.js
- [ ] T058 [P] [US3] Integration test: ARIA live region announces "Playing C4" on activation in src/__integration__/accessibility/keyboard-piano-activation.test.js
- [ ] T059 [P] [US3] Integration test: Performance - Keypress-to-sound latency <20ms (Performance API) in src/__integration__/accessibility/keyboard-piano-activation.test.js

**E2E Tests (Secondary)**:
- [ ] T060 [P] [US3] E2E test: Complete play workflow (Tab → Navigate → Enter → Sound) in e2e/accessibility/keyboard-workflow.spec.js
- [ ] T061 [P] [US3] E2E test: Performance measurement - keypress-to-sound latency <20ms across browsers in e2e/accessibility/keyboard-workflow.spec.js
- [ ] T062 [P] [US3] E2E test: Screen reader announces "Playing C4" (accessibility tree validation) in e2e/accessibility/screen-reader-e2e.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T063 [P] [US3] Unit test: Rapid Enter/Space presses trigger multiple notes (no debouncing) in src/__tests__/unit/accessibility/piano-keyboard-activation.test.js (if needed)

### Implementation for User Story 3

- [ ] T064 [US3] Enhance existing Enter/Space key handlers to trigger note playback in src/components/[PianoKeyboard].js
- [ ] T065 [US3] Add event.preventDefault() for Space key to prevent page scroll in src/components/[PianoKeyboard].js
- [ ] T066 [US3] Ensure focus remains on same key after activation (no focus shift) in src/components/[PianoKeyboard].js
- [ ] T067 [US3] Add ARIA live region for "Playing [note]" announcements in src/components/[PianoKeyboard].js
- [ ] T068 [US3] Add Performance API instrumentation for keypress-to-sound latency measurement in src/components/[PianoKeyboard].js or src/services/[Audio].js
- [ ] T069 [US3] Verify NO performance degradation from master branch (regression test) - Run latency comparison tests
- [ ] T070 [US3] Verify 100% code coverage achieved via integration + E2E + unit tests

**Checkpoint**: User Story 3 complete - Users can now play notes with Enter/Space keys. **MVP COMPLETE** (US1-3 done).

---

## Phase 6: User Story 4 - Computer Keyboard Piano Compatibility (Priority: P2)

**Goal**: Preserve existing computer keyboard shortcuts (FGH..., ZXCASDQWE) - no conflicts with navigation

**Independent Test**: With piano keyboard focused, user presses A-Z keys and notes play with <20ms latency. Arrow keys navigate, A-Z keys play notes - no conflicts.

### Tests for User Story 4 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T071 [P] [US4] Integration test: Computer keyboard shortcuts (FGH..., ZXCASDQWE) play notes when piano keyboard has focus in src/__integration__/accessibility/keyboard-piano-shortcuts.test.js
- [ ] T072 [P] [US4] Integration test: Arrow keys navigate (not play) when piano keyboard has focus in src/__integration__/accessibility/keyboard-piano-shortcuts.test.js
- [ ] T073 [P] [US4] Integration test: No key binding conflicts between A-Z and navigation keys in src/__integration__/accessibility/keyboard-piano-shortcuts.test.js
- [ ] T074 [P] [US4] Integration test: Performance - A-Z key playback latency <20ms in src/__integration__/accessibility/keyboard-piano-shortcuts.test.js

**E2E Tests (Secondary)**:
- [ ] T075 [P] [US4] E2E test: Complete workflow using both navigation (arrows) and shortcuts (A-Z) in e2e/accessibility/keyboard-workflow.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T076 [P] [US4] Unit test: Key event routing logic (arrows → navigate, A-Z → play, Enter/Space → play) in src/__tests__/unit/accessibility/keyboard-event-routing.test.js (if needed)

### Implementation for User Story 4

- [ ] T077 [US4] Verify existing computer keyboard shortcuts (FGH..., ZXCASDQWE) continue to work in src/lib/[KeyboardShortcuts].js or src/components/[PianoKeyboard].js (based on T007 findings)
- [ ] T078 [US4] Ensure arrow keys do NOT trigger note playback (only navigation) in src/components/[PianoKeyboard].js handleKeyDown logic
- [ ] T079 [US4] Add switch statement in handleKeyDown to route keys correctly (arrows → navigate, A-Z → propagate for shortcuts, Enter/Space → play) in src/components/[PianoKeyboard].js
- [ ] T080 [US4] Verify NO performance degradation for A-Z key playback in src/components/[PianoKeyboard].js or src/lib/[KeyboardShortcuts].js
- [ ] T081 [US4] Verify 100% code coverage achieved via integration + E2E + unit tests

**Checkpoint**: User Story 4 complete - Computer keyboard shortcuts preserved with no conflicts

---

## Phase 7: User Story 5 - Color Key Parent Interaction (Priority: P3)

**Goal**: Color key parent receives focus simultaneously with piano keyboard (colorblind mode support)

**Independent Test**: With color key parent visible, tabbing to piano keyboard also highlights color parent. Both elements respond to same keyboard navigation.

### Tests for User Story 5 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T082 [P] [US5] Integration test: Color parent receives focus when piano keyboard receives focus in src/__integration__/accessibility/color-parent-sync.test.js
- [ ] T083 [P] [US5] Integration test: Both piano keyboard and color parent navigate together with Arrow keys in src/__integration__/accessibility/color-parent-sync.test.js
- [ ] T084 [P] [US5] Integration test: Color parent updates to match focused key in src/__integration__/accessibility/color-parent-sync.test.js
- [ ] T085 [P] [US5] Integration test: Colorblind mode activation (number keys 1-9) works correctly with keyboard navigation in src/__integration__/accessibility/color-parent-sync.test.js

**E2E Tests (Secondary)**:
- [ ] T086 [P] [US5] E2E test: Complete workflow with color parent visible (Tab → Navigate → Color parent syncs) in e2e/accessibility/keyboard-workflow.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T087 [P] [US5] Unit test: focusedKeyIndex state synchronization between piano keyboard and color parent in src/__tests__/unit/accessibility/color-parent-sync.test.js (if needed)

### Implementation for User Story 5

- [ ] T088 [US5] Verify existing color parent component and locate synchronization logic in src/components/[ColorParent].js (based on T009 findings)
- [ ] T089 [US5] Ensure shared focusedKeyIndex state between piano keyboard and color parent (state + refs hybrid enables this) in src/components/[PianoKeyboard].js and src/components/[ColorParent].js
- [ ] T090 [US5] Verify both components respond to same arrow key events in src/components/[PianoKeyboard].js
- [ ] T091 [US5] Verify color parent updates to match focused key in all colorblind modes (1-9) in src/components/[ColorParent].js
- [ ] T092 [US5] Verify 100% code coverage achieved via integration + E2E + unit tests

**Checkpoint**: User Story 5 complete - Color parent synchronization works with keyboard navigation

---

## Phase 8: User Story 6 - Out-of-Scale Audio Feedback (Priority: P2)

**Goal**: Play distinct audio cue when user activates piano key NOT in currently selected scale

**Independent Test**: Select a scale (e.g., C Major), navigate to a note outside the scale (e.g., F#), press Enter/Space, hear distinct "out-of-scale" audio cue.

### Tests for User Story 6 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T093 [P] [US6] Integration test: Out-of-scale audio cue plays when activating key not in current scale (e.g., F# in C Major) in src/__integration__/accessibility/out-of-scale-feedback.test.js
- [ ] T094 [P] [US6] Integration test: Normal note plays (no cue) when activating key in current scale (e.g., C in C Major) in src/__integration__/accessibility/out-of-scale-feedback.test.js
- [ ] T095 [P] [US6] Integration test: Out-of-scale audio cue is distinctly different from normal note sound (audio comparison test) in src/__integration__/accessibility/out-of-scale-feedback.test.js
- [ ] T096 [P] [US6] Integration test: Performance - Out-of-scale cue latency still <20ms in src/__integration__/accessibility/out-of-scale-feedback.test.js
- [ ] T097 [P] [US6] Integration test: Scale detection correctly identifies in-scale vs out-of-scale keys in src/__integration__/accessibility/out-of-scale-feedback.test.js

**E2E Tests (Secondary)**:
- [ ] T098 [P] [US6] E2E test: Complete out-of-scale workflow (Select scale → Navigate to out-of-scale key → Activate → Hear cue) in e2e/accessibility/keyboard-workflow.spec.js
- [ ] T099 [P] [US6] E2E test: Screen reader announces "F sharp 4 - not in scale" (optional enhancement) in e2e/accessibility/screen-reader-e2e.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T100 [P] [US6] Unit test: Scale membership algorithm for various scales (C Major, D Minor, Dorian, etc.) in src/__tests__/unit/accessibility/scale-detection.test.js
- [ ] T101 [P] [US6] Unit test: Edge cases for scale detection (chromatic scale, whole tone scale) in src/__tests__/unit/accessibility/scale-detection.test.js

### Implementation for User Story 6

- [ ] T102 [US6] Locate and understand existing scale state management in src/services/[ScaleDetection].js or state (based on T008 findings)
- [ ] T103 [US6] Implement scale membership detection function (isNoteInScale(note, scale)) in src/services/[ScaleDetection].js
- [ ] T104 [US6] Design and create out-of-scale audio cue (muted tone, click, or brief dissonant sound) based on T014 research in src/services/[Audio].js or audio assets
- [ ] T105 [US6] Integrate scale detection with note activation logic in src/components/[PianoKeyboard].js handleKeyDown (Enter/Space)
- [ ] T106 [US6] Add conditional logic: if out-of-scale, play cue; else play normal note in src/services/[Audio].js playNote function
- [ ] T107 [US6] Ensure out-of-scale cue maintains <20ms latency (Performance API profiling) in src/services/[Audio].js
- [ ] T108 [US6] Add optional ARIA live region for "not in scale" announcement (enhancement) in src/components/[PianoKeyboard].js
- [ ] T109 [US6] Verify 100% code coverage achieved via integration + E2E + unit tests

**Checkpoint**: User Story 6 complete - Educational out-of-scale audio feedback implemented

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T110 [P] Re-enable all 8 skipped E2E tests from REMAINING_ISSUES.md (e2e/accessibility/keyboard-workflow.spec.js, focus-visibility-e2e.spec.js)
- [ ] T111 [P] Verify all 8 re-enabled E2E tests pass (keyboard navigation, focus indicators, piano key workflows)
- [ ] T112 [P] Run final jest-axe audit across all components - verify 0 WCAG violations in src/__integration__/accessibility/
- [ ] T113 [P] Run final cross-browser E2E tests (Chrome, Firefox, Safari) in e2e/accessibility/
- [ ] T114 [P] Verify final 100% code coverage across all user stories (run coverage report)
- [ ] T115 [P] Verify test distribution meets constitution requirements (60-70% integration, 20-30% E2E, 10-20% unit) - generate coverage metrics
- [ ] T116 Performance regression test: Compare master branch vs feature branch latency (MUST show NO degradation)
- [ ] T117 [P] Code cleanup and refactoring (remove console.logs, optimize performance)
- [ ] T118 [P] Update specs/001-piano-key-keyboard-navigation/quickstart.md with manual testing guide (if not created in Phase 1 - Design)
- [ ] T119 [P] Update REMAINING_ISSUES.md to mark "Priority 1: Piano Key Tab Navigation" as COMPLETE
- [ ] T120 Update CLAUDE.md via .specify/scripts/bash/update-agent-context.sh claude (add patterns learned from this feature)
- [ ] T121 Security audit: Verify no XSS vulnerabilities in keyboard event handlers
- [ ] T122 Run constitution compliance check: Verify all 7 principles satisfied
- [ ] T123 Create PR summary in specs/001-piano-key-keyboard-navigation/PR_SUMMARY.md
- [ ] T124 Final build verification: yarn build succeeds with no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
  - Recommended: US1 → US2 → US3 (MVP), then US4/US6 (P2), then US5 (P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 (needs piano keyboard container with tabIndex)
- **User Story 3 (P1)**: Depends on User Story 2 (needs navigation to select keys before playing)
- **User Story 4 (P2)**: Can start after User Story 3 (MVP complete) - Independent of other stories
- **User Story 5 (P3)**: Depends on User Story 2 (needs navigation synchronization)
- **User Story 6 (P2)**: Depends on User Story 3 (needs activation logic to trigger audio feedback)

### Within Each User Story

- Tests (integration/E2E) SHOULD be written BEFORE implementation (pragmatic TDD)
- Tests MUST fail before implementation
- Models/entities before services
- Services before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational research tasks marked [P] can run in parallel (T004-T010, T013-T015)
- All tests for a user story marked [P] can run in parallel
- Once MVP (US1-3) is complete, US4, US5, US6 can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all integration tests for User Story 2 together:
Task: "Integration test: Arrow Right navigates to next key chromatically in src/__integration__/accessibility/keyboard-piano-navigation.test.js"
Task: "Integration test: Arrow Left navigates to previous key chromatically in src/__integration__/accessibility/keyboard-piano-navigation.test.js"
Task: "Integration test: Home key jumps to first key in src/__integration__/accessibility/keyboard-piano-navigation.test.js"
Task: "Integration test: End key jumps to last key in src/__integration__/accessibility/keyboard-piano-navigation.test.js"

# After tests are written and failing, launch implementation tasks (sequential due to same file):
Task: "Enhance existing arrow key navigation handlers in src/components/[PianoKeyboard].js"
Task: "Implement Home/End key handlers in src/components/[PianoKeyboard].js"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories) - Codebase exploration
3. Complete Phase 3: User Story 1 (Navigate to Piano Keyboard)
4. Complete Phase 4: User Story 2 (Navigate Between Keys)
5. Complete Phase 5: User Story 3 (Play Notes with Enter/Space)
6. **STOP and VALIDATE**: Test User Stories 1-3 independently - **MVP COMPLETE**
7. Re-enable 8 skipped E2E tests and verify they pass
8. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (codebase understood)
2. Add User Story 1 → Test independently → Deploy/Demo (Tab to piano keyboard)
3. Add User Story 2 → Test independently → Deploy/Demo (Arrow key navigation)
4. Add User Story 3 → Test independently → Deploy/Demo (Enter/Space activation) **MVP!**
5. Add User Story 4 → Test independently → Deploy/Demo (Shortcuts compatibility)
6. Add User Story 6 → Test independently → Deploy/Demo (Out-of-scale feedback)
7. Add User Story 5 → Test independently → Deploy/Demo (Color parent sync)
8. Polish (Phase 9) → Final validation → Production release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (codebase exploration)
2. Once Foundational is done:
   - Developer A: User Story 1 + User Story 2 (navigation)
   - Developer B: User Story 3 (activation) - waits for US2 completion
   - Developer C: User Story 6 (out-of-scale feedback) - waits for US3 completion
3. After MVP (US1-3):
   - Developer A: User Story 4 (shortcuts compatibility)
   - Developer B: User Story 5 (color parent sync)
   - Developer C: Polish (Phase 9)

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Write tests FIRST (pragmatic TDD) - tests should FAIL before implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **CRITICAL**: All existing functionality (arrow navigation, Enter/Space activation, FGH.../ZXCASDQWE shortcuts) MUST be preserved - NO breaking changes
- **CRITICAL**: Performance MUST NOT degrade from master branch (<20ms latency maintained)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
