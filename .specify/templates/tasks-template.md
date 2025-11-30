---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per Constitution v2.0.0 Principle I (Pragmatic Testing Strategy). All features MUST achieve 100% code coverage with integration-first approach (60-70% integration, 20-30% E2E, 10-20% unit tests for edge cases only).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T010 [P] [US1] Integration test for [primary user workflow] in tests/integration/test_[name].test.js
  - Tests components working together: [list components]
  - Covers happy path and common errors
  - Tests data flow through multiple layers
- [ ] T011 [P] [US1] Integration test for [secondary workflow] in tests/integration/test_[name].test.js

**E2E Tests (Secondary - 20-30%)**:
- [ ] T012 [US1] E2E test for [critical user journey] in e2e/[name].spec.js
  - Tests complete feature workflow end-to-end
  - Verifies cross-browser compatibility

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T013 [P] [US1] Unit test for [complex algorithm edge cases] in tests/unit/test_[name].test.js
  - ONLY if integration tests don't cover these edge cases
  - Reserved for complex calculations, boundary conditions

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T015 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T016 [US1] Implement [Service] in src/services/[service].py (depends on T014, T015)
- [ ] T017 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T018 [US1] Add validation and error handling
- [ ] T019 [US1] Add logging for user story 1 operations

### Coverage Verification for User Story 1

- [ ] T020 [US1] Run coverage report and verify 100% code coverage achieved
- [ ] T021 [US1] Verify test distribution: 60-70% integration, 20-30% E2E, 10-20% unit
- [ ] T022 [US1] Verify all tests pass and performance targets met (<5s integration, <30s E2E)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T023 [P] [US2] Integration test for [primary user workflow] in tests/integration/test_[name].test.js
- [ ] T024 [P] [US2] Integration test for [secondary workflow] in tests/integration/test_[name].test.js

**E2E Tests (Secondary - 20-30%)**:
- [ ] T025 [US2] E2E test for [critical user journey] in e2e/[name].spec.js

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T026 [P] [US2] Unit test for [complex algorithm edge cases] in tests/unit/test_[name].test.js (if needed)

### Implementation for User Story 2

- [ ] T027 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T028 [US2] Implement [Service] in src/services/[service].py
- [ ] T029 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T030 [US2] Integrate with User Story 1 components (if needed)

### Coverage Verification for User Story 2

- [ ] T031 [US2] Run coverage report and verify 100% code coverage maintained
- [ ] T032 [US2] Verify test distribution targets met
- [ ] T033 [US2] Verify all tests pass with performance targets

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (MANDATORY - Constitution v2.0.0) ✅

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **TARGET: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests (edge cases only)**

**Integration Tests (Primary - 60-70%)**:
- [ ] T034 [P] [US3] Integration test for [primary user workflow] in tests/integration/test_[name].test.js
- [ ] T035 [P] [US3] Integration test for [secondary workflow] in tests/integration/test_[name].test.js

**E2E Tests (Secondary - 20-30%)**:
- [ ] T036 [US3] E2E test for [critical user journey] in e2e/[name].spec.js

**Unit Tests (Minimal - 10-20%, edge cases ONLY)**:
- [ ] T037 [P] [US3] Unit test for [complex algorithm edge cases] in tests/unit/test_[name].test.js (if needed)

### Implementation for User Story 3

- [ ] T038 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T039 [US3] Implement [Service] in src/services/[service].py
- [ ] T040 [US3] Implement [endpoint/feature] in src/[location]/[file].py

### Coverage Verification for User Story 3

- [ ] T041 [US3] Run coverage report and verify 100% code coverage maintained
- [ ] T042 [US3] Verify test distribution targets met
- [ ] T043 [US3] Verify all tests pass with performance targets

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

### Final Coverage Verification (MANDATORY)

- [ ] TXXX Run full test suite and verify 100% code coverage across all user stories
- [ ] TXXX Verify final test distribution: 60-70% integration, 20-30% E2E, 10-20% unit
- [ ] TXXX Verify all performance targets met: integration tests <5s, E2E tests <30s per test
- [ ] TXXX Review coverage report for any untested edge cases and add tests if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
