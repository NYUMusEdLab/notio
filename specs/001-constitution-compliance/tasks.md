# Tasks: Constitution Compliance Implementation

**Input**: Design documents from `/specs/001-constitution-compliance/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

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

- **Single project**: `src/`, `e2e/`, `tests/` at repository root
- Paths shown below use absolute paths from repository root

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Install Playwright and dependencies: `yarn add --dev @playwright/test`
- [x] T002 [P] Install Playwright browsers: `npx playwright install --with-deps`
- [x] T003 [P] Install accessibility testing tools: `yarn add --dev jest-axe @axe-core/playwright @axe-core/react`
- [x] T004 [P] Verify eslint-plugin-jsx-a11y is available: `yarn list --pattern eslint-plugin-jsx-a11y`
- [x] T005 Create test directory structure: `src/__integration__/`, `src/__integration__/musical-components/`, `src/__integration__/user-workflows/`, `src/__integration__/error-handling/`
- [x] T006 Create E2E directory structure: `e2e/`
- [x] T007 Create src/components/common/ directory for reusable components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Configure Jest for coverage thresholds in jest.config.js (set branches: 100, functions: 100, lines: 100, statements: 100)
- [x] T009 Update jest.config.js to include integration test patterns: `**/__integration__/**/*.(test|spec).js`
- [x] T010 Update jest.config.js collectCoverageFrom patterns to include `src/**/*.{js,jsx}` and exclude mocks/tests
- [x] T011 Create Playwright configuration file: playwright.config.js with chromium, firefox, webkit projects
- [x] T012 Configure Playwright launch options for audio testing in playwright.config.js (autoplay-policy, fake-media-stream)
- [x] T013 Update src/setupTests.js to import jest-axe and extend Jest matchers with toHaveNoViolations()
- [x] T014 Configure @axe-core/react in src/index.js for development-only runtime accessibility auditing
- [x] T015 Update package.json scripts: add test:e2e, test:e2e:headed, test:e2e:debug, test:e2e:chromium, test:e2e:firefox, test:e2e:webkit
- [x] T016 Update package.json scripts: add test:a11y for running accessibility-specific tests
- [x] T017 Update .eslintrc.js or package.json eslintConfig to use strict jsx-a11y mode: `plugin:jsx-a11y/strict`
- [x] T018 Create scripts/validate-test-distribution.js to check 60-70-20-30 distribution

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Comprehensive Test Infrastructure Setup (Priority: P1) 🎯 MVP

**Goal**: Establish complete test infrastructure that supports integration-first testing with 100% coverage target

**Independent Test**: Verify test infrastructure is set up correctly with proper directory structure, configuration files, and sample tests running successfully

### Implementation for User Story 1

- [x] T019 [P] [US1] Create sample integration test in src/__integration__/musical-components/sample.test.js demonstrating jest-axe usage
- [x] T020 [P] [US1] Create sample E2E test in e2e/sample.spec.js demonstrating Playwright + @axe-core/playwright
- [x] T021 [P] [US1] Create sample unit test in src/__test__/utils/sample-edge-case.test.js for edge case testing
- [ ] T022 [US1] Run sample integration test and verify it executes successfully with coverage reporting
- [ ] T023 [US1] Run sample E2E test in all three browsers (chromium, firefox, webkit) and verify success
- [ ] T024 [US1] Generate coverage report and verify it shows line and branch coverage percentages
- [ ] T025 [US1] Run scripts/validate-test-distribution.js and verify it calculates test distribution correctly
- [ ] T026 [US1] Create developer documentation in docs/TESTING.md linking to specs/001-constitution-compliance/quickstart.md
- [ ] T027 [US1] Update README.md with links to testing documentation and constitutional testing principles
- [ ] T028 [US1] Verify all test commands work: npm test, npm run test:e2e, npm run test:a11y

**Checkpoint**: At this point, User Story 1 should be fully functional - developers can start writing tests following constitutional requirements

---

## Phase 4: User Story 2 - Core Component Integration Test Coverage (Priority: P2)

**Goal**: Cover core musical functionality with integration tests (60-70% of suite) testing notation + audio + interaction workflows

**Independent Test**: Run integration tests for musical components and verify they achieve target coverage for notation + audio + interaction workflows

### Implementation for User Story 2

- [ ] T029 [P] [US2] Create integration test for MusicalStaff + audio playback synchronization in src/__integration__/musical-components/notation-audio-sync.test.js
- [ ] T030 [P] [US2] Create integration test for ColorKey keyboard interaction in src/__integration__/musical-components/keyboard-interaction.test.js
- [ ] T031 [P] [US2] Create integration test for TopMenu + MusicalStaff interaction in src/__integration__/musical-components/menu-staff-integration.test.js
- [ ] T032 [P] [US2] Create integration test for scale visualization (TopMenu + ColorKey + MusicalStaff) in src/__integration__/musical-components/scale-visualization.test.js
- [ ] T033 [P] [US2] Create integration test for user workflow: create exercise → validate → feedback in src/__integration__/user-workflows/create-exercise.test.js
- [ ] T034 [P] [US2] Create integration test for error handling: invalid musical input → validation → error display in src/__integration__/error-handling/invalid-input.test.js
- [ ] T035 [P] [US2] Create integration test for network error handling in src/__integration__/error-handling/network-errors.test.js
- [ ] T036 [P] [US2] Create integration test for state management flow: user interaction → state update → re-render in src/__integration__/user-workflows/state-management.test.js
- [ ] T037 [US2] Mock Tone.js and Firebase dependencies in integration tests for faster execution
- [ ] T038 [US2] Verify all integration tests complete in under 5 seconds each
- [ ] T039 [US2] Run coverage report and verify integration tests cover 60-70% of codebase
- [ ] T040 [US2] Identify any uncovered code paths in musical components and add integration tests to cover them

**Checkpoint**: At this point, User Story 2 should be complete - core musical components have comprehensive integration test coverage

---

## Phase 5: User Story 3 - E2E Critical Path Coverage (Priority: P3)

**Goal**: Validate complete user journeys work end-to-end across different browsers (20-30% of suite)

**Independent Test**: Run E2E test suite against deployed application in multiple browsers and verify critical user journeys complete successfully

### Implementation for User Story 3

- [ ] T041 [P] [US3] Create E2E test for student exercise workflow in e2e/student-workflow.spec.js
- [ ] T042 [P] [US3] Create E2E test for teacher workflow in e2e/teacher-workflow.spec.js (if applicable to current codebase)
- [ ] T043 [P] [US3] Create E2E test for audio-visual synchronization measurement in e2e/audio-sync.spec.js
- [ ] T044 [P] [US3] Create E2E test for notation rendering performance in e2e/notation-display.spec.js
- [ ] T045 [P] [US3] Create E2E test for keyboard interaction across application in e2e/keyboard-interaction.spec.js
- [ ] T046 [P] [US3] Create E2E test for data persistence across sessions in e2e/data-persistence.spec.js
- [ ] T047 [P] [US3] Create E2E accessibility test suite in e2e/accessibility.spec.js with @axe-core/playwright
- [ ] T048 [US3] Run E2E tests in chromium and verify all pass
- [ ] T049 [US3] Run E2E tests in firefox and verify all pass
- [ ] T050 [US3] Run E2E tests in webkit (Safari) and verify all pass
- [ ] T051 [US3] Verify all E2E tests complete in under 30 seconds each
- [ ] T052 [US3] Measure audio latency in E2E tests and verify <50ms
- [ ] T053 [US3] Measure notation rendering time in E2E tests and verify <200ms
- [ ] T054 [US3] Run coverage report and verify E2E tests contribute 20-30% of total test suite
- [ ] T055 [US3] Document any browser-specific issues found and their resolutions

**Checkpoint**: At this point, User Story 3 should be complete - critical user journeys are validated across all three browsers

---

## Phase 6: User Story 4 - Component Reusability and Architecture Compliance (Priority: P4)

**Goal**: Refactor existing components to meet Principle II (Component Reusability) with clear interfaces and proper organization

**Independent Test**: Code review verification that components follow single responsibility principle, have clear prop interfaces, and are located in appropriate directories

### Implementation for User Story 4

- [ ] T056 [US4] Audit existing components in src/components/ and identify candidates for refactoring (components with multiple responsibilities)
- [ ] T057 [US4] Audit existing components and identify shared/reusable candidates for src/components/common/
- [ ] T058 [P] [US4] Add PropTypes or TypeScript types to ColorKey component in src/components/keyboard/ColorKey.js
- [ ] T059 [P] [US4] Add PropTypes or TypeScript types to MusicalStaff component in src/components/musicScore/MusicalStaff.js
- [ ] T060 [P] [US4] Add PropTypes or TypeScript types to TopMenu component in src/components/menu/TopMenu.js
- [ ] T061 [US4] Refactor any ColorKey sub-components into separate files if needed (if ColorKey has multiple responsibilities)
- [ ] T062 [US4] Move shared form components (Checkbox, Radio, ListCheckbox, ListRadio) to src/components/common/ if they're reusable
- [ ] T063 [US4] Create index.js in src/components/common/ to export all shared components
- [ ] T064 [US4] Update imports across codebase to use src/components/common/ for shared components
- [ ] T065 [US4] Document component interfaces with JSDoc comments for all props
- [ ] T066 [US4] Verify all components in src/components/common/ follow single responsibility principle
- [ ] T067 [US4] Run ESLint and verify no prop-types warnings
- [ ] T068 [US4] Create component architecture documentation in docs/COMPONENTS.md

**Checkpoint**: At this point, User Story 4 should be complete - components are reusable with clear interfaces and proper organization

---

## Phase 7: User Story 5 - Accessibility Compliance (Priority: P5)

**Goal**: Ensure Notio is fully accessible via keyboard navigation and screen readers, meeting WCAG 2.1 AA standards

**Independent Test**: Run automated accessibility testing tools and manual keyboard navigation verification to confirm 100% compliance

### Implementation for User Story 5

- [ ] T069 [P] [US5] Create accessibility integration test for ColorKey in src/__integration__/accessibility/colorkey-a11y.test.js
- [ ] T070 [P] [US5] Create accessibility integration test for TopMenu in src/__integration__/accessibility/topmenu-a11y.test.js
- [ ] T071 [P] [US5] Create accessibility integration test for MusicalStaff in src/__integration__/accessibility/musicalstaff-a11y.test.js
- [ ] T072 [P] [US5] Create accessibility integration test for keyboard navigation across application in src/__integration__/accessibility/keyboard-navigation.test.js
- [ ] T073 [US5] Add role="button" or convert ColorKey divs to actual button elements for keyboard accessibility
- [ ] T074 [US5] Add aria-label with note name and state to ColorKey components (e.g., "C4 note, in scale")
- [ ] T075 [US5] Add tabIndex={0} to ColorKey components for keyboard navigation
- [ ] T076 [US5] Add onKeyDown handlers for Enter/Space key activation to ColorKey components
- [ ] T077 [US5] Ensure TopMenu has proper ARIA labels for all interactive elements
- [ ] T078 [US5] Verify color is not the sole indicator of state in ColorKey (note names already present)
- [ ] T079 [US5] Run color contrast checker on all ColorKey color values and ensure 4.5:1 ratio for text
- [ ] T080 [US5] Add skip navigation link for keyboard users
- [ ] T081 [US5] Test keyboard navigation manually: Tab through all interactive elements
- [ ] T082 [US5] Test with screen reader (NVDA/VoiceOver) and verify all content is accessible
- [ ] T083 [US5] Run automated accessibility audit with jest-axe on all components
- [ ] T084 [US5] Run E2E accessibility tests with @axe-core/playwright
- [ ] T085 [US5] Fix any accessibility violations found by automated tools
- [ ] T086 [US5] Verify 100% WCAG 2.1 AA compliance

**Checkpoint**: At this point, User Story 5 should be complete - Notio is fully accessible with keyboard navigation and screen reader support

---

## Phase 8: User Story 6 - Performance Validation (Priority: P6)

**Goal**: Validate performance targets are met (audio latency <50ms, notation rendering <200ms) on target educational devices

**Independent Test**: Run performance monitoring tools measuring audio latency, rendering times, and frame rates under realistic conditions

### Implementation for User Story 6

- [ ] T087 [P] [US6] Create performance E2E test for audio latency in e2e/performance/audio-latency.spec.js
- [ ] T088 [P] [US6] Create performance E2E test for notation rendering in e2e/performance/notation-rendering.spec.js
- [ ] T089 [P] [US6] Create performance E2E test for frame rate in e2e/performance/frame-rate.spec.js
- [ ] T090 [P] [US6] Create performance E2E test for audio-visual synchronization timing in e2e/performance/sync-timing.spec.js
- [ ] T091 [US6] Measure Tone.js audio context baseLatency and outputLatency in E2E test
- [ ] T092 [US6] Verify audio latency is under 50ms in all three browsers
- [ ] T093 [US6] Measure notation rendering time using Performance API in E2E test
- [ ] T094 [US6] Verify notation rendering completes in under 200ms for typical exercises
- [ ] T095 [US6] Measure frame rate during UI animations and verify 60fps where applicable
- [ ] T096 [US6] Test on target educational device specifications (not just developer machines) - document device specs and results
- [ ] T097 [US6] Measure time between note trigger and audio start (should be <30ms)
- [ ] T098 [US6] Measure time between audio start and notation update (should be <30ms)
- [ ] T099 [US6] Identify any performance bottlenecks and document in performance-report.md
- [ ] T100 [US6] Optimize any components that don't meet performance targets
- [ ] T101 [US6] Verify all performance targets are met consistently across multiple test runs

**Checkpoint**: At this point, User Story 6 should be complete - performance targets validated on target devices

---

## Phase 9: Unit Tests for Edge Cases (Strategic - 10-20% of suite)

**Purpose**: Add strategic unit tests for complex algorithms and edge cases NOT covered by integration tests

- [ ] T102 [P] Create unit test for musical interval calculations with edge cases in src/__test__/utils/interval-calculator.test.js (enharmonic equivalents, compound intervals, diminished/augmented)
- [ ] T103 [P] Create unit test for tuning algorithm with frequency extremes in src/__test__/utils/tuning-algorithm.test.js (20Hz, 20kHz boundaries)
- [ ] T104 [P] Create unit test for note name parsing edge cases in src/__test__/utils/note-parser.test.js (double sharps/flats, enharmonic equivalents)
- [ ] T105 [P] Create unit test for rhythm calculation edge cases in src/__test__/utils/rhythm-calculator.test.js (dotted notes, tuplets, complex time signatures)
- [ ] T106 [P] Create unit test for musical range validation boundaries in src/__test__/utils/range-validator.test.js (lowest/highest notes on instruments)
- [ ] T107 Refactor existing unit tests in src/__test__/ to focus ONLY on edge cases (remove tests that should be integration tests)
- [ ] T108 Verify unit tests account for 10-20% of total test suite
- [ ] T109 Verify all unit tests focus on edge cases, not obvious code or simple getters/setters

**Checkpoint**: Strategic unit tests cover edge cases not easily tested via integration tests

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T110 [P] Create CHANGELOG.md entry documenting constitution compliance implementation
- [ ] T111 [P] Update docs/TESTING.md with final test metrics and distribution
- [ ] T112 [P] Create performance report in docs/PERFORMANCE.md with baseline metrics
- [ ] T113 [P] Create accessibility report in docs/ACCESSIBILITY.md documenting WCAG 2.1 AA compliance
- [ ] T114 Verify final 100% code coverage across all user stories
- [ ] T115 Run scripts/validate-test-distribution.js and verify 60-70% integration, 20-30% E2E, 10-20% unit
- [ ] T116 Run all tests in CI mode and verify they pass: npm run test:ci
- [ ] T117 Run all E2E tests in all browsers and verify they pass
- [ ] T118 Configure CI/CD pipeline (GitHub Actions) to enforce 100% coverage and fail on violations
- [ ] T119 Add coverage badge to README.md
- [ ] T120 Code cleanup: Remove any unused mocks or test fixtures
- [ ] T121 Code cleanup: Ensure consistent naming conventions across all test files
- [ ] T122 Security: Audit dependencies for vulnerabilities: npm audit
- [ ] T123 Performance: Profile integration test suite and optimize any slow tests (>5s)
- [ ] T124 Performance: Profile E2E test suite and optimize any slow tests (>30s)
- [ ] T125 Validate quickstart.md examples by running them and verifying they work
- [ ] T126 Final verification: Run complete test suite and confirm all constitutional requirements met

**Checkpoint**: Project fully compliant with Constitution v2.0.0

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - US1 (Phase 3): Can start after Foundational - No dependencies on other stories
  - US2 (Phase 4): Can start after US1 (needs test infrastructure) - May integrate with US1 components
  - US3 (Phase 5): Can start after US1 (needs test infrastructure) - May integrate with US1/US2
  - US4 (Phase 6): Can start after Foundational - Independent of other stories (component refactoring)
  - US5 (Phase 7): Can start after US4 (needs components to be properly structured) - May integrate with US1/US2/US3 tests
  - US6 (Phase 8): Can start after US1 (needs test infrastructure) - Independent performance validation
- **Unit Tests (Phase 9)**: Can start after US1 (needs test infrastructure) - Independent of other stories
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - BLOCKS US2, US3, US6
- **User Story 2 (P2)**: Depends on US1 - Can run in parallel with US4 after US1 complete
- **User Story 3 (P3)**: Depends on US1 - Can run in parallel with US2, US4, US6 after US1 complete
- **User Story 4 (P4)**: Independent - Can run in parallel with US2, US3, US6 after Foundational
- **User Story 5 (P5)**: Depends on US4 - Should run after components are properly structured
- **User Story 6 (P6)**: Depends on US1 - Can run in parallel with US2, US3, US4 after US1 complete

### Within Each User Story

- Tests can run in parallel (marked with [P])
- Implementation tasks must follow test-first approach where applicable
- Coverage verification happens at end of each story
- Each story must be independently testable before moving to next

### Parallel Opportunities

- **Setup (Phase 1)**: T001-T004 can all run in parallel (different npm installs)
- **Foundational (Phase 2)**: T008-T011 can run in parallel (different config files), T015-T017 can run in parallel
- **US1 (Phase 3)**: T019-T021 can run in parallel (different test files)
- **US2 (Phase 4)**: T029-T036 can run in parallel (different test files)
- **US3 (Phase 5)**: T041-T047 can run in parallel (different test files)
- **US4 (Phase 6)**: T058-T060 can run in parallel (different component files)
- **US5 (Phase 7)**: T069-T072 can run in parallel (different test files)
- **US6 (Phase 8)**: T087-T090 can run in parallel (different test files)
- **Unit Tests (Phase 9)**: T102-T106 can all run in parallel (different test files)
- **Polish (Phase 10)**: T110-T113 can run in parallel (different documentation files)

---

## Parallel Example: User Story 1 (Test Infrastructure Setup)

```bash
# Launch all sample tests together:
# Task T019: Create sample integration test
# Task T020: Create sample E2E test
# Task T021: Create sample unit test

# Then run verification sequentially:
# Task T022: Run integration test
# Task T023: Run E2E test in all browsers
# Task T024: Generate coverage report
```

---

## Parallel Example: User Story 2 (Integration Tests)

```bash
# Launch all integration test creation tasks together:
# Task T029: notation-audio-sync.test.js
# Task T030: keyboard-interaction.test.js
# Task T031: menu-staff-integration.test.js
# Task T032: scale-visualization.test.js
# Task T033: create-exercise.test.js
# Task T034: invalid-input.test.js
# Task T035: network-errors.test.js
# Task T036: state-management.test.js

# Then run coverage verification:
# Task T039: Verify 60-70% coverage
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install dependencies)
2. Complete Phase 2: Foundational (configure test infrastructure)
3. Complete Phase 3: User Story 1 (test infrastructure working)
4. **STOP and VALIDATE**: Test infrastructure is functional, sample tests pass
5. Deploy/demo if ready - developers can now write constitutional-compliant tests

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! Test infrastructure ready)
3. Add User Story 2 → Test independently → Deploy/Demo (Integration tests for musical components)
4. Add User Story 3 → Test independently → Deploy/Demo (E2E tests across browsers)
5. Add User Story 4 → Test independently → Deploy/Demo (Components refactored for reusability)
6. Add User Story 5 → Test independently → Deploy/Demo (Accessibility compliance achieved)
7. Add User Story 6 → Test independently → Deploy/Demo (Performance validated)
8. Add Phase 9 → Test independently → Deploy/Demo (Unit tests for edge cases)
9. Complete Phase 10 → Final validation → Deploy/Demo (Full constitutional compliance)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done and US1 is complete:
   - Developer A: User Story 2 (Integration tests)
   - Developer B: User Story 3 (E2E tests)
   - Developer C: User Story 4 (Component refactoring)
   - Developer D: User Story 6 (Performance validation)
3. After US4 complete:
   - Developer available: User Story 5 (Accessibility)
4. After all stories complete:
   - Developer available: Phase 9 (Unit tests for edge cases)
5. Team completes Phase 10 (Polish) together

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Each user story**: Independently completable and testable
- **Test-first approach**: Write integration tests FIRST, then add unit tests ONLY for uncovered edge cases
- **Commit frequently**: After each task or logical group
- **Stop at checkpoints**: Validate each story independently before proceeding
- **Avoid**: Vague tasks, same file conflicts, cross-story dependencies that break independence
- **Integration tests are PRIMARY**: Focus on realistic workflows, not isolated units
- **Coverage requirement**: 100% line and branch coverage is MANDATORY
- **Test distribution**: Must achieve 60-70% integration, 20-30% E2E, 10-20% unit
- **Performance**: Integration tests <5s, E2E tests <30s per test
- **Accessibility**: WCAG 2.1 AA compliance is NON-NEGOTIABLE

---

## Total Task Count: 126 tasks

### Task Count by User Story:
- **Setup (Phase 1)**: 7 tasks
- **Foundational (Phase 2)**: 11 tasks (BLOCKING)
- **User Story 1 (P1 - MVP)**: 10 tasks
- **User Story 2 (P2)**: 12 tasks
- **User Story 3 (P3)**: 15 tasks
- **User Story 4 (P4)**: 13 tasks
- **User Story 5 (P5)**: 18 tasks
- **User Story 6 (P6)**: 15 tasks
- **Unit Tests (Phase 9)**: 8 tasks
- **Polish (Phase 10)**: 17 tasks

### Parallel Opportunities Identified:
- **Phase 1**: 4 parallel tasks (T001-T004)
- **Phase 2**: 6 parallel task groups
- **US1**: 3 parallel tasks (T019-T021)
- **US2**: 8 parallel tasks (T029-T036)
- **US3**: 7 parallel tasks (T041-T047)
- **US4**: 3 parallel tasks (T058-T060)
- **US5**: 4 parallel tasks (T069-T072)
- **US6**: 4 parallel tasks (T087-T090)
- **Phase 9**: 5 parallel tasks (T102-T106)
- **Phase 10**: 4 parallel tasks (T110-T113)

### MVP Scope (Just User Story 1):
**28 tasks total**: Setup (7) + Foundational (11) + US1 (10)

This delivers a working test infrastructure where developers can immediately start writing constitutional-compliant tests.

### Independent Test Criteria:
- **US1**: Sample tests run successfully with coverage reporting
- **US2**: Integration tests achieve 60-70% coverage of musical components
- **US3**: E2E tests pass in all three browsers (chromium, firefox, webkit)
- **US4**: Components have PropTypes/TypeScript, organized in proper directories
- **US5**: 100% WCAG 2.1 AA compliance verified by automated tools
- **US6**: Performance targets met (<50ms audio, <200ms rendering) on target devices

---

**Format Validation**: ✅ All 126 tasks follow the required checklist format with checkbox, task ID, optional [P] marker, required [Story] label for user story phases, and specific file paths in descriptions.

**Ready for Implementation**: This tasks.md is immediately executable - each task is specific enough for an LLM or developer to complete without additional context.
