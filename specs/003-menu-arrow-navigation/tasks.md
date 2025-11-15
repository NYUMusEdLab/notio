# Tasks: Menu Arrow Key Navigation

**Input**: Design documents from `/specs/003-menu-arrow-navigation/`
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

- [ ] T001 Verify existing menu components (DropdownCustomScaleMenu.js, SubMenu.js) are accessible
- [ ] T002 Verify React Testing Library (@testing-library/react) and jest-axe available in package.json
- [ ] T003 Verify Playwright (@playwright/test) and @axe-core/playwright available in devDependencies
- [ ] T004 Create test directory structure: src/__integration__/accessibility/, src/__tests__/unit/accessibility/, e2e/accessibility/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core patterns and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Review research.md keyboard navigation patterns and focus management decisions
- [ ] T006 Review contracts/keyboard-navigation-contract.md for implementation patterns
- [ ] T007 Identify all menu components that need arrow key navigation (DropdownCustomScaleMenu, SubMenu, TopMenu)
- [ ] T008 Review existing keyboard handlers from feature 002-fix-a11y-errors in affected components

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Arrow Key Navigation Within Open Menus (Priority: P1) 🎯 MVP

**Goal**: Enable keyboard-only users to navigate through menu items using arrow keys (Up/Down, Home/End) with circular wrapping and disabled item skipping

**Independent Test**: Open any dropdown menu using keyboard (Tab to menu, press Enter), then use arrow keys to navigate through menu items - all items should be accessible and focus should wrap circularly

### Tests for User Story 1 (MANDATORY for 100% coverage) ⚠️

> **NOTE: Integration tests are PRIMARY. Write integration tests FIRST to cover main workflows, then add unit tests ONLY for edge cases not covered by integration tests.**

**Integration Tests (Primary - 60-70% of coverage)**:
- [ ] T009 [P] [US1] Integration test for arrow key navigation workflow in src/__integration__/accessibility/menu-keyboard-navigation.test.js
- [ ] T010 [P] [US1] Integration test for Down Arrow navigation from trigger to first enabled item in src/__integration__/accessibility/menu-keyboard-navigation.test.js
- [ ] T011 [P] [US1] Integration test for Up Arrow navigation from trigger to first enabled item in src/__integration__/accessibility/menu-keyboard-navigation.test.js
- [ ] T012 [P] [US1] Integration test for circular wrapping (last to first, first to last) in src/__integration__/accessibility/menu-keyboard-navigation.test.js
- [ ] T013 [P] [US1] Integration test for disabled item skipping during navigation in src/__integration__/accessibility/menu-disabled-items.test.js
- [ ] T014 [P] [US1] Integration test for Home key jumping to first enabled item in src/__integration__/accessibility/menu-keyboard-navigation.test.js
- [ ] T015 [P] [US1] Integration test for End key jumping to last enabled item in src/__integration__/accessibility/menu-keyboard-navigation.test.js

**E2E Tests (Secondary - 20-30% of coverage)**:
- [ ] T016 [P] [US1] E2E test for complete keyboard-only menu workflow (Tab → Open → Navigate → Select) in e2e/accessibility/menu-keyboard-workflow.spec.js
- [ ] T017 [P] [US1] E2E test for cross-browser arrow key navigation (Chrome, Firefox, Safari) in e2e/accessibility/cross-browser-menu-a11y.spec.js

**Unit Tests (Minimal - 10-20%, edge cases only)**:
- [ ] T018 [P] [US1] Unit test for wrapping logic edge cases (first to last, last to first) in src/__tests__/unit/accessibility/menu-wrapping.test.js
- [ ] T019 [P] [US1] Unit test for navigation algorithm with all items disabled in src/__tests__/unit/accessibility/menu-navigation-logic.test.js
- [ ] T020 [P] [US1] Unit test for single-item menu navigation behavior in src/__tests__/unit/accessibility/menu-navigation-logic.test.js

### Implementation for User Story 1

**SubMenu.js (class component with dropdown content)**:
- [ ] T021 [US1] Add focusedIndex state to SubMenu class in src/components/menu/SubMenu.js
- [ ] T022 [US1] Add menuItemRefs array to SubMenu class in src/components/menu/SubMenu.js
- [ ] T023 [US1] Implement findNextEnabledIndex method in SubMenu class in src/components/menu/SubMenu.js
- [ ] T024 [US1] Implement findFirstEnabledItem method in SubMenu class in src/components/menu/SubMenu.js
- [ ] T025 [US1] Implement findLastEnabledItem method in SubMenu class in src/components/menu/SubMenu.js
- [ ] T026 [US1] Implement isMenuItemDisabled method in SubMenu class in src/components/menu/SubMenu.js
- [ ] T027 [US1] Add handleMenuKeyDown method for arrow key handling in SubMenu class in src/components/menu/SubMenu.js
- [ ] T028 [US1] Attach onKeyDown={handleMenuKeyDown} to menu container in SubMenu render in src/components/menu/SubMenu.js
- [ ] T029 [US1] Add ref={el => menuItemRefs[index] = el} to each menu item in SubMenu render in src/components/menu/SubMenu.js
- [ ] T030 [US1] Update toggleClass method to reset focusedIndex to -1 when menu closes in src/components/menu/SubMenu.js

**DropdownCustomScaleMenu.js (functional component with overlay)**:
- [ ] T031 [P] [US1] Add focusedIndex state using useState in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T032 [P] [US1] Add menuItemRefs using useRef in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T033 [P] [US1] Add triggerRef using useRef in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T034 [P] [US1] Implement findNextEnabledIndex function in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T035 [P] [US1] Implement findFirstEnabledItem function in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T036 [P] [US1] Implement findLastEnabledItem function in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T037 [P] [US1] Implement isMenuItemDisabled function in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T038 [US1] Add handleMenuKeyDown function for arrow key handling in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T039 [US1] Update handleShow to reset focusedIndex when menu closes in DropdownCustomScaleMenu in src/components/menu/DropdownCustomScaleMenu.js

**TopMenu.js (parent component that renders SubMenu components)**:
- [ ] T040 [P] [US1] Verify SubMenu components in TopMenu render with correct props in src/components/menu/TopMenu.js
- [ ] T041 [P] [US1] Add aria-disabled="true" to any disabled menu items in SubMenu content in src/components/menu/TopMenu.js (if applicable)

**Verification**:
- [ ] T042 [US1] Manual keyboard testing: Tab to menu, Enter to open, arrow keys to navigate all items
- [ ] T043 [US1] Manual keyboard testing: Verify Home/End keys jump to first/last items
- [ ] T044 [US1] Manual keyboard testing: Verify wrapping works (last to first, first to last)
- [ ] T045 [US1] Verify 100% code coverage achieved for User Story 1 via integration + E2E + unit tests

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can navigate all menu items with arrow keys.

---

## Phase 4: User Story 2 - Focus Management and Visual Feedback (Priority: P2)

**Goal**: Ensure proper focus management when menus open/close and provide clear visual feedback of focused items

**Independent Test**: Open a menu, navigate with arrow keys, verify focus indicators are visible and focus returns to trigger on Escape

### Tests for User Story 2 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T046 [P] [US2] Integration test for focus restoration on menu close in src/__integration__/accessibility/menu-focus-management.test.js
- [ ] T047 [P] [US2] Integration test for focus staying on trigger when menu opens in src/__integration__/accessibility/menu-focus-management.test.js
- [ ] T048 [P] [US2] Integration test for Escape key closing menu and restoring focus in src/__integration__/accessibility/menu-focus-management.test.js
- [ ] T049 [P] [US2] Integration test for focus indicator visibility using jest-axe in src/__integration__/accessibility/menu-focus-management.test.js

**E2E Tests (Secondary)**:
- [ ] T050 [P] [US2] E2E test for focus indicators visible in all browsers in e2e/accessibility/focus-management-e2e.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T051 [P] [US2] Unit test for focus restoration when menu item removed from DOM in src/__tests__/unit/accessibility/focus-management.test.js

### Implementation for User Story 2

**SubMenu.js**:
- [ ] T052 [US2] Add triggerRef to SubMenu class in src/components/menu/SubMenu.js
- [ ] T053 [US2] Implement closeMenu method that resets state and focuses trigger in src/components/menu/SubMenu.js
- [ ] T054 [US2] Update Escape key handler to call closeMenu in src/components/menu/SubMenu.js
- [ ] T055 [US2] Ensure focus remains on trigger when menu opens (verify existing toggleClass behavior) in src/components/menu/SubMenu.js

**DropdownCustomScaleMenu.js**:
- [ ] T056 [P] [US2] Implement handleClose function that resets state and focuses trigger in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T057 [P] [US2] Update Escape key handler to call handleClose in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T058 [P] [US2] Attach triggerRef to trigger element in src/components/menu/DropdownCustomScaleMenu.js

**Verification**:
- [ ] T059 [US2] Manual testing: Open menu with Enter, verify focus stays on trigger until arrow key pressed
- [ ] T060 [US2] Manual testing: Navigate with arrows, press Escape, verify focus returns to trigger
- [ ] T061 [US2] Verify browser default focus indicators are visible (no custom CSS needed per research.md)
- [ ] T062 [US2] Verify 100% code coverage achieved for User Story 2 via integration + E2E + unit tests

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Focus management is reliable and visible.

---

## Phase 5: User Story 3 - Home/End Key Support for Quick Navigation (Priority: P3)

**Goal**: Enable power keyboard users to quickly jump to first/last menu items using Home and End keys

**Independent Test**: Open a menu, navigate to middle item, press Home to jump to first, press End to jump to last

### Tests for User Story 3 (MANDATORY for 100% coverage) ⚠️

**Integration Tests (Primary)**:
- [ ] T063 [P] [US3] Integration test for Home key jumping to first enabled item in src/__integration__/accessibility/menu-home-end-navigation.test.js
- [ ] T064 [P] [US3] Integration test for End key jumping to last enabled item in src/__integration__/accessibility/menu-home-end-navigation.test.js
- [ ] T065 [P] [US3] Integration test for Home/End with disabled items at boundaries in src/__integration__/accessibility/menu-home-end-navigation.test.js

**E2E Tests (Secondary)**:
- [ ] T066 [P] [US3] E2E test for Home/End key navigation workflow in e2e/accessibility/home-end-navigation-e2e.spec.js

**Unit Tests (Edge cases only)**:
- [ ] T067 [P] [US3] Unit test for Home/End with all items disabled in src/__tests__/unit/accessibility/home-end-logic.test.js

### Implementation for User Story 3

**Note**: Most functionality already implemented in User Story 1 (findFirstEnabledItem, findLastEnabledItem). This phase adds key handlers.

**SubMenu.js**:
- [ ] T068 [US3] Add Home key case to handleMenuKeyDown that calls findFirstEnabledItem in src/components/menu/SubMenu.js
- [ ] T069 [US3] Add End key case to handleMenuKeyDown that calls findLastEnabledItem in src/components/menu/SubMenu.js

**DropdownCustomScaleMenu.js**:
- [ ] T070 [P] [US3] Add Home key case to handleMenuKeyDown that calls findFirstEnabledItem in src/components/menu/DropdownCustomScaleMenu.js
- [ ] T071 [P] [US3] Add End key case to handleMenuKeyDown that calls findLastEnabledItem in src/components/menu/DropdownCustomScaleMenu.js

**Verification**:
- [ ] T072 [US3] Manual testing: Open menu, navigate to middle, press Home, verify focus on first item
- [ ] T073 [US3] Manual testing: Press End, verify focus on last item
- [ ] T074 [US3] Verify 100% code coverage achieved for User Story 3 via integration + E2E + unit tests

**Checkpoint**: All user stories should now be independently functional. Power users have efficient navigation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation, and cross-cutting improvements

- [ ] T075 [P] Run yarn build and verify no ESLint jsx-a11y errors
- [ ] T076 [P] Run npm test and verify all integration tests pass
- [ ] T077 [P] Run npm run test:e2e and verify all E2E tests pass
- [ ] T078 [P] Verify 100% code coverage across all menu components
- [ ] T079 [P] Verify test distribution meets constitution (60-70% integration, 20-30% E2E, 10-20% unit)
- [ ] T080 Manual keyboard navigation testing per quickstart.md
- [ ] T081 Browser DevTools accessibility audit per quickstart.md
- [ ] T082 Screen reader testing (VoiceOver/NVDA) per quickstart.md (optional but recommended)
- [ ] T083 Performance testing: Verify arrow key response time < 50ms
- [ ] T084 Cross-browser manual testing: Chrome, Firefox, Safari
- [ ] T085 Update CLAUDE.md with arrow key navigation patterns learned (if any new insights)

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
  - **BLOCKS ACCESSIBILITY**: This story MUST be completed to enable keyboard navigation
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) OR after US1 completes
  - No implementation dependencies on US1 (focus management is independent)
  - But logically follows US1 (navigation enables focus management testing)
- **User Story 3 (P3)**: Can start after User Story 1 completes (depends on findFirstEnabledItem, findLastEnabledItem)
  - Minimal implementation (just add Home/End key handlers)
  - Logically extends US1 navigation with power user shortcuts

### Within Each User Story

- Tests should be written FIRST (failing) before implementation
- Helper functions (findNextEnabledIndex, etc.) before key handlers
- State management (focusedIndex, refs) before navigation logic
- Verification tasks run after all implementations complete
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: All 4 tasks can run in parallel

**Phase 2 (Foundational)**: All 4 review tasks can run in parallel

**Phase 3 (User Story 1)**:
- Tests: T009-T020 can all run in parallel (12 tasks, different test files)
- SubMenu implementation: T021-T030 must run sequentially (same file)
- DropdownCustomScaleMenu implementation: T031-T039 can run in parallel with SubMenu (different file)
- TopMenu verification: T040-T041 can run in parallel (different file)

**Phase 4 (User Story 2)**:
- Tests: T046-T051 can all run in parallel (6 tasks, different test files)
- SubMenu focus management: T052-T055 must run sequentially (same file)
- DropdownCustomScaleMenu focus management: T056-T058 can run in parallel with SubMenu (different file)

**Phase 5 (User Story 3)**:
- Tests: T063-T067 can all run in parallel (5 tasks, different test files)
- SubMenu Home/End: T068-T069 must run sequentially (same file)
- DropdownCustomScaleMenu Home/End: T070-T071 can run in parallel with SubMenu (different file)

**Phase 6 (Polish)**: Tasks T075-T079 can run in parallel (build, test, coverage checks)

---

## Parallel Example: User Story 1

```bash
# Launch all integration tests for User Story 1 together:
Task: "Integration test for arrow key navigation workflow in src/__integration__/accessibility/menu-keyboard-navigation.test.js"
Task: "Integration test for disabled item skipping in src/__integration__/accessibility/menu-disabled-items.test.js"
Task: "E2E test for complete keyboard workflow in e2e/accessibility/menu-keyboard-workflow.spec.js"

# Launch component implementations in parallel (after tests):
Task: "Implement SubMenu arrow key navigation" (T021-T030)
Task: "Implement DropdownCustomScaleMenu arrow key navigation" (T031-T039)
Task: "Verify TopMenu integration" (T040-T041)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - RECOMMENDED

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - understand existing patterns)
3. Complete Phase 3: User Story 1
   - This enables keyboard navigation for all menu items
   - Users can navigate with Up/Down arrows
   - Circular wrapping and disabled item skipping work
4. **STOP and VALIDATE**:
   - Run integration and E2E tests
   - Manual keyboard testing
   - Verify accessibility with jest-axe
5. Ship to production! 🚀

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP - Keyboard navigation works!)
3. Add User Story 2 → Test independently → Deploy (Focus management enhanced!)
4. Add User Story 3 → Test independently → Deploy (Power user shortcuts added!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - **Developer A**: SubMenu arrow key navigation (T021-T030)
   - **Developer B**: DropdownCustomScaleMenu arrow key navigation (T031-T039)
   - **Developer C**: Write all integration and E2E tests (T009-T020)
3. All merge into US1, then verify tests pass

---

## Task Summary

**Total Tasks**: 85
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (User Story 1): 37 tasks (12 tests + 21 implementation + 4 verification)
- Phase 4 (User Story 2): 17 tasks (6 tests + 7 implementation + 4 verification)
- Phase 5 (User Story 3): 12 tasks (5 tests + 4 implementation + 3 verification)
- Phase 6 (Polish): 11 tasks

**User Story Breakdown**:
- US1: 37 tasks (Core navigation - critical for accessibility)
- US2: 17 tasks (Focus management - enhances usability)
- US3: 12 tasks (Power user shortcuts - nice to have)

**Parallel Opportunities**:
- Phase 1: 4 parallel tasks
- Phase 2: 4 parallel tasks
- US1 tests: 12 parallel tasks
- US1 implementation: 2 parallel groups (SubMenu + DropdownCustomScaleMenu)
- US2 tests: 6 parallel tasks
- US2 implementation: 2 parallel groups
- US3 tests: 5 parallel tasks
- US3 implementation: 2 parallel groups
- Phase 6: 5 parallel tasks

**Independent Test Criteria**:
- **US1**: Open menu with keyboard, navigate all items with arrow keys, verify wrapping and disabled item skipping
- **US2**: Open menu, navigate, press Escape - verify focus returns to trigger and is visible
- **US3**: Open menu, navigate to middle, press Home/End - verify jumping to first/last items

**Suggested MVP Scope**: User Story 1 only (37 tasks) - Enables full keyboard navigation for all menu items

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description`
✅ All task IDs sequential (T001-T085)
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
- **CRITICAL**: User Story 1 MUST be completed to enable keyboard navigation
