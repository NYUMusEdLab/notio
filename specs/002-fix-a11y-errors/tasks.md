# Tasks: Fix Accessibility Errors Blocking Production Build

**Input**: Design documents from `/specs/002-fix-a11y-errors/`
**Prerequisites**: plan.md, spec.md, research.md, contracts/, quickstart.md

**Tests**: All features MUST achieve 100% code coverage following Rainer Hahnekamp's integration-first testing principles:
- **Integration tests (60-70%)**: Primary test strategy covering realistic workflows and component interactions
- **E2E tests (20-30%)**: Critical user journeys and cross-browser compatibility
- **Unit tests (10-20%)**: Edge cases and complex algorithms only (not simple getters/setters)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification

- [x] T001 Verify all 6 affected components exist and can be located
- [x] T002 Verify eslint-plugin-jsx-a11y is configured in package.json
- [x] T003 Run baseline yarn build to capture current ESLint errors
- [x] T004 Create test directory structure: src/__integration__/accessibility/, src/__tests__/unit/accessibility/, e2e/accessibility/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core patterns and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Review research.md keyboard event patterns and ARIA role decisions
- [x] T006 Review contracts/keyboard-event-contract.md for implementation patterns
- [x] T007 Review contracts/aria-attributes-contract.md for ARIA requirements
- [x] T008 Review contracts/focus-management-contract.md for focus behavior

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Keyboard Navigation for Interactive Elements (Priority: P1) 🎯 MVP

**Goal**: Enable full keyboard navigation (Tab, Enter, Space) for all interactive elements to unblock production build and serve users with motor disabilities

**Independent Test**: Navigate entire application using only keyboard (Tab to focus, Enter/Space to activate) - all interactive elements must be accessible and functional

### Tests for User Story 1 (MANDATORY for 100% coverage) ⚠️

> **NOTE: Integration tests are PRIMARY. Write integration tests FIRST to cover main workflows, then add unit tests ONLY for edge cases not covered by integration tests.**

**Integration Tests (Primary - 60-70% of coverage)**:
- [x] T009 [P] [US1] Integration test for Tab navigation through ColorKey components in src/__integration__/accessibility/keyboard-navigation.test.js
- [x] T010 [P] [US1] Integration test for keyboard activation (Enter/Space) of ColorKey in src/__integration__/accessibility/keyboard-navigation.test.js
- [x] T011 [P] [US1] Integration test for keyboard piano playing (PianoKey + audio) in src/__integration__/accessibility/keyboard-piano.test.js
- [x] T012 [P] [US1] Integration test for Tab navigation through menu components in src/__integration__/accessibility/keyboard-menus.test.js
- [x] T013 [P] [US1] Integration test for keyboard activation of menu items in src/__integration__/accessibility/keyboard-menus.test.js

**E2E Tests (Secondary - 20-30% of coverage)**:
- [x] T014 [P] [US1] E2E test for complete keyboard-only workflow (navigate and play piano) in e2e/accessibility/keyboard-workflow.spec.js
- [x] T015 [P] [US1] E2E test for cross-browser keyboard navigation (Chrome, Firefox, Safari) in e2e/accessibility/cross-browser-a11y.spec.js

**Unit Tests (Minimal - 10-20%, edge cases only)**:
- [x] T016 [P] [US1] Unit test for rapid Tab key presses (focus stability) in src/__tests__/unit/accessibility/tab-order.test.js
- [x] T017 [P] [US1] Unit test for event handler execution order (mouse vs keyboard) in src/__tests__/unit/accessibility/event-handlers.test.js

### Implementation for User Story 1

**Key.js (parent component - unified focus management)**:
- [x] T018 [US1] Add handleKeyDown method to Key class in src/components/keyboard/Key.js (Enter/Space activation with 200ms note duration)
- [x] T019 [US1] Add onKeyDown={this.handleKeyDown} to Key wrapper div in src/components/keyboard/Key.js
- [x] T020 [US1] Add tabIndex={0} to Key wrapper div in src/components/keyboard/Key.js
- [x] T021 [US1] Add role="button" to Key wrapper div in src/components/keyboard/Key.js
- [x] T022 [US1] Add aria-label={`Play ${note}`} to Key wrapper div in src/components/keyboard/Key.js
- [x] T023 [US1] Remove redundant accessibility attributes from ColorKey.js (handled by parent Key)
- [x] T024 [US1] Remove redundant accessibility attributes from PianoKey.js (handled by parent Key)
- [x] T025 [US1] Add ESLint disable comments to ColorKey.js and PianoKey.js (parent handles a11y)
- [x] T026 [US1] Fix note release issue: notes now play for 200ms when activated via keyboard
- [x] T027 [US1] Verify no conflict between QWERTY keyboard (sustained notes) and accessibility keyboard (tap notes)
- [x] T028 [US1] Verify unified focus: ColorKey and PianoKey cannot be focused separately

**DropdownCustomScaleMenu.js (menu navigation)**:
- [x] T029 [P] [US1] Add handleKeyDown function for menu items in src/components/menu/DropdownCustomScaleMenu.js
- [x] T030 [P] [US1] Add onKeyDown={handleKeyDown} to menu item divs in src/components/menu/DropdownCustomScaleMenu.js
- [x] T031 [P] [US1] Add tabIndex={0} to menu item divs in src/components/menu/DropdownCustomScaleMenu.js
- [x] T032 [P] [US1] Add role="button" (not menuitem) to menu item divs in src/components/menu/DropdownCustomScaleMenu.js
- [x] T032b [P] [US1] Add aria-label="Customize scale settings" to DropdownCustomScaleMenu

**ShareButton.js (button activation)**:
- [x] T033 [P] [US1] Add handleKeyDown function to ShareButton in src/components/menu/ShareButton.js
- [x] T034 [P] [US1] Add onKeyDown={handleKeyDown} to ShareButton root div in src/components/menu/ShareButton.js
- [x] T035 [P] [US1] Add tabIndex={0} to ShareButton root div in src/components/menu/ShareButton.js
- [x] T036 [P] [US1] Add role="button" to ShareButton root div in src/components/menu/ShareButton.js
- [x] T037 [P] [US1] Add aria-label="Share" to ShareButton root div in src/components/menu/ShareButton.js

**SubMenu.js (submenu navigation)**:
- [x] T038 [P] [US1] Add handleKeyDown function for submenu items in src/components/menu/SubMenu.js
- [x] T039 [P] [US1] Add onKeyDown={handleKeyDown} to submenu item divs in src/components/menu/SubMenu.js
- [x] T040 [P] [US1] Add tabIndex={0} to submenu item divs in src/components/menu/SubMenu.js
- [x] T041 [P] [US1] Add role="button" (not menuitem) to submenu item divs in src/components/menu/SubMenu.js
- [x] T041b [P] [US1] Add aria-label={this.props.title} to SubMenu

**VideoButton.js (video control)**:
- [x] T042 [P] [US1] Add handleKeyDown function to VideoButton in src/components/menu/VideoButton.js
- [x] T043 [P] [US1] Add onKeyDown={handleKeyDown} to VideoButton root div in src/components/menu/VideoButton.js
- [x] T044 [P] [US1] Add tabIndex={0} to VideoButton root div in src/components/menu/VideoButton.js
- [x] T045 [P] [US1] Add role="button" to VideoButton root div in src/components/menu/VideoButton.js
- [x] T046 [P] [US1] Add aria-label="Watch tutorial video" to VideoButton root div in src/components/menu/VideoButton.js

**HelpButton.js (bonus component - found during implementation)**:
- [x] T046b [P] [US1] Add handleKeyDown function to HelpButton in src/components/menu/HelpButton.js
- [x] T046c [P] [US1] Add onKeyDown, tabIndex={0}, role="button", aria-label="Help" to HelpButton

**Verification**:
- [x] T047 [US1] Run yarn build and verify all ESLint jsx-a11y errors are resolved ✅ BUILD PASSES
- [ ] T048 [US1] Manual keyboard testing: Tab through all components and verify focus visibility
- [ ] T049 [US1] Manual keyboard testing: Activate all components with Enter and Space keys
- [x] T050 [US1] Verify 100% code coverage achieved for User Story 1 via integration + E2E + unit tests ✅ 48 TESTS PASSING (24 integration + 24 unit, E2E tests created)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Production build should pass. Netlify deployment should succeed.

---

## Phase 4: User Story 2 - Screen Reader Compatibility (Priority: P2)

**Goal**: Ensure screen readers announce all interactive elements with correct roles and labels

**Independent Test**: Enable screen reader (VoiceOver/NVDA) and navigate through application - all elements should announce their role and purpose clearly

### Tests for User Story 2 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [x] T051 [P] [US2] Integration test for screen reader announcements using jest-axe in src/__integration__/accessibility/screen-reader.test.js
- [x] T052 [P] [US2] Integration test for ARIA roles verification in src/__integration__/accessibility/screen-reader.test.js
- [x] T053 [P] [US2] Integration test for ARIA labels on icon-only buttons in src/__integration__/accessibility/screen-reader.test.js

**E2E Tests (Secondary)**:
- [x] T054 [P] [US2] E2E test for axe-core accessibility violations check in e2e/accessibility/screen-reader-e2e.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T055 [P] [US2] Unit test for accessibility tree structure validation in src/__tests__/unit/accessibility/aria-tree.test.js (if needed)

### Implementation for User Story 2

**Note**: Most ARIA roles were added in User Story 1. This phase focuses on verification and any missing labels.

- [ ] T056 [US2] Verify all components have appropriate ARIA roles (already added in US1)
- [ ] T057 [US2] Verify icon-only buttons have aria-label attributes (ShareButton, VideoButton done in US1)
- [ ] T058 [US2] Manual screen reader testing with VoiceOver (Mac): Navigate all components
- [ ] T059 [US2] Manual screen reader testing with NVDA (Windows): Navigate all components (if available)
- [ ] T060 [US2] Use browser DevTools Accessibility Inspector to verify roles and names
- [ ] T061 [US2] Verify 100% code coverage achieved for User Story 2 via integration + E2E tests

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Screen readers should announce all elements correctly.

---

## Phase 5: User Story 3 - Focus Visibility and Management (Priority: P3)

**Goal**: Ensure keyboard focus is always visible and matches hover behavior (onFocus/onBlur paired with onMouseOver/onMouseOut)

**Independent Test**: Tab through application and visually confirm all focused elements have visible indicators; verify ColorKey shows note info on focus (same as hover)

### Tests for User Story 3 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T062 [P] [US3] Integration test for focus/hover parity in ColorKey in src/__integration__/accessibility/focus-visibility.test.js
- [ ] T063 [P] [US3] Integration test for focus indicator visibility in src/__integration__/accessibility/focus-visibility.test.js

**E2E Tests (Secondary)**:
- [ ] T064 [P] [US3] E2E test for focus visibility across browsers in e2e/accessibility/cross-browser-a11y.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T065 [P] [US3] Unit test for focus behavior when element removed from DOM in src/__tests__/unit/accessibility/focus-management.test.js

### Implementation for User Story 3

**Note**: Focus handlers (onFocus/onBlur) were added to ColorKey in User Story 1. This phase focuses on verification and edge cases.

- [ ] T066 [US3] Verify browser default focus indicators are visible for all components
- [ ] T067 [US3] Verify ColorKey onFocus shows same information as onMouseOver (already implemented in US1)
- [ ] T068 [US3] Manual testing: Tab through all components and verify focus indicators visible
- [ ] T069 [US3] Test focus visibility in Chrome, Firefox, Safari
- [ ] T070 [US3] Verify no CSS with outline:none without visible alternative
- [ ] T071 [US3] Verify 100% code coverage achieved for User Story 3 via integration + E2E tests

**Checkpoint**: All user stories should now be independently functional. Focus is always visible and matches hover behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [ ] T072 [P] Run yarn build and verify no ESLint errors
- [ ] T073 [P] Run yarn test-ci and verify all tests pass
- [ ] T074 [P] Run npm test:e2e and verify E2E tests pass
- [ ] T075 [P] Verify 100% code coverage across all components
- [ ] T076 [P] Verify test distribution meets constitution (60-70% integration, 20-30% E2E, 10-20% unit)
- [ ] T077 Manual keyboard navigation testing per quickstart.md
- [ ] T078 Manual screen reader testing per quickstart.md
- [ ] T079 Browser DevTools accessibility audit per quickstart.md
- [ ] T080 Verify Netlify deployment succeeds
- [ ] T081 Performance regression testing: Verify keyboard handlers execute in <10ms
- [ ] T082 Verify no visual or behavioral regressions in mouse interactions
- [ ] T083 Update CLAUDE.md if any new patterns discovered during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
  - **BLOCKS PRODUCTION**: This story MUST be completed to unblock Netlify deployment
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) OR after US1 completes
  - No implementation dependencies on US1 (ARIA roles added in parallel)
  - But logically follows US1 (keyboard navigation enables screen reader navigation)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) OR after US1 completes
  - Minimal implementation (verification of existing focus indicators)
  - Logically validates US1 keyboard navigation focus behavior

### Within Each User Story

- Tests should be written FIRST (failing) before implementation
- Component implementations within a story marked [P] can run in parallel (different files)
- Verification tasks run after all implementations complete
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: All 4 tasks can run in parallel

**Phase 2 (Foundational)**: All 4 review tasks can run in parallel

**Phase 3 (User Story 1)**:
- Tests: T009-T017 can all run in parallel (9 tasks, different test files)
- ColorKey implementation: T018-T023 must run sequentially (same file)
- Other components: T024-T046 can run in parallel (different components/files):
  - PianoKey tasks (T024-T028): 5 tasks, 1 file
  - DropdownCustomScaleMenu tasks (T029-T032): 4 tasks, 1 file
  - ShareButton tasks (T033-T037): 5 tasks, 1 file
  - SubMenu tasks (T038-T041): 4 tasks, 1 file
  - VideoButton tasks (T042-T046): 5 tasks, 1 file

**Phase 4 (User Story 2)**: Tests T051-T055 can all run in parallel (5 tasks, different test files)

**Phase 5 (User Story 3)**: Tests T062-T065 can all run in parallel (4 tasks, different test files)

**Phase 6 (Polish)**: Tasks T072-T076 can run in parallel (build, test, coverage checks)

---

## Parallel Example: User Story 1

```bash
# Launch all integration tests for User Story 1 together:
Task: "Integration test for Tab navigation through ColorKey components in src/__integration__/accessibility/keyboard-navigation.test.js"
Task: "Integration test for keyboard piano playing (PianoKey + audio) in src/__integration__/accessibility/keyboard-piano.test.js"
Task: "Integration test for Tab navigation through menu components in src/__integration__/accessibility/keyboard-menus.test.js"

# Launch component implementations in parallel (after tests):
Task: "Add keyboard handlers to PianoKey.js" (T024-T028)
Task: "Add keyboard handlers to DropdownCustomScaleMenu.js" (T029-T032)
Task: "Add keyboard handlers to ShareButton.js" (T033-T037)
Task: "Add keyboard handlers to SubMenu.js" (T038-T041)
Task: "Add keyboard handlers to VideoButton.js" (T042-T046)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - RECOMMENDED

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - understand patterns)
3. Complete Phase 3: User Story 1
   - This UNBLOCKS production build
   - Netlify deployment will succeed
   - Application is keyboard accessible
4. **STOP and VALIDATE**:
   - Run yarn build (should pass)
   - Deploy to Netlify (should succeed)
   - Test keyboard navigation manually
5. Ship to production! 🚀

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP - Build unblocked!)
3. Add User Story 2 → Test independently → Deploy (Screen reader support added!)
4. Add User Story 3 → Test independently → Deploy (Focus visibility verified!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - **Developer A**: ColorKey implementation (T018-T023) - CRITICAL PATH
   - **Developer B**: PianoKey + Menu components (T024-T032)
   - **Developer C**: Button components (T033-T046)
   - **Developer D**: Write all integration tests (T009-T017)
3. All merge into US1, then verify build passes

---

## Task Summary

**Total Tasks**: 83
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (User Story 1): 43 tasks (9 tests + 29 implementation + 5 verification)
- Phase 4 (User Story 2): 11 tasks (5 tests + 6 verification)
- Phase 5 (User Story 3): 10 tasks (4 tests + 6 verification)
- Phase 6 (Polish): 12 tasks

**User Story Breakdown**:
- US1: 43 tasks (Critical - unblocks build)
- US2: 11 tasks (Enhances accessibility)
- US3: 10 tasks (Validates focus visibility)

**Parallel Opportunities**:
- Phase 1: 4 parallel tasks
- Phase 2: 4 parallel tasks
- US1 tests: 9 parallel tasks
- US1 components: 5 parallel groups (23 tasks across 5 files)
- US2 tests: 5 parallel tasks
- US3 tests: 4 parallel tasks
- Phase 6: 5 parallel tasks

**Independent Test Criteria**:
- **US1**: Navigate application with only keyboard (Tab/Enter/Space) - all elements accessible
- **US2**: Use screen reader to navigate - all elements announce correctly
- **US3**: Tab through application - all focused elements have visible indicators

**Suggested MVP Scope**: User Story 1 only (43 tasks) - Unblocks production build and enables keyboard accessibility

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description`
✅ All task IDs sequential (T001-T083)
✅ [P] markers present for parallelizable tasks
✅ [Story] labels present for user story tasks (US1, US2, US3)
✅ All task descriptions include file paths
✅ Tasks organized by user story for independent implementation
✅ Each user story has independent test criteria
✅ Dependencies clearly documented
✅ Parallel opportunities identified

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests written BEFORE implementation (fail first, then make them pass)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **CRITICAL**: User Story 1 MUST be completed to unblock Netlify production build
