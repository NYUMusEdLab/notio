<!--
Sync Impact Report:
Version: 1.0.0 → 2.0.0
Rationale: Major update to testing philosophy - Adopting Rainer Hahnekamp's testing principles

Modified principles:
  - Principle I: Test-First Development → Pragmatic Testing Strategy (MAJOR revision)
    * Shifted from strict TDD to pragmatic integration/E2E focused approach
    * Prioritize integration tests (60-70%) as primary strategy
    * E2E tests (20-30%) for critical user journeys
    * Unit tests (10-20%) reserved ONLY for edge cases and complex algorithms
    * Maintain 100% code coverage requirement (NON-NEGOTIABLE)
  - Principle V: Integration Testing → Integration-First Testing (MAJOR enhancement)
    * Detailed integration test requirements for musical features
    * Specific E2E test requirements for critical paths
    * Coverage validation metrics added (60-70-20-30 distribution)
    * Stronger rationale emphasizing integration tests survive refactoring

Added sections:
  - Testing philosophy based on Rainer Hahnekamp's research
  - Testing pyramid inverted to reflect real-world integration focus
  - Specific coverage expectations and metrics
  - Test performance requirements (integration < 5s, E2E < 30s per test)

Templates updated:
  ✅ .specify/templates/plan-template.md - Constitution Check expanded with all 7 principles
  ✅ .specify/templates/spec-template.md - Added Testing Strategy section with integration-first guidance
  ✅ .specify/templates/tasks-template.md - Updated test task structure to reflect 60-70-20-30 split, made tests MANDATORY

Changes summary:
  - plan-template.md: Added detailed Constitution Check checklist covering all principles
  - spec-template.md: Added mandatory Testing Strategy section with integration/E2E/unit focus areas
  - tasks-template.md: Changed tests from OPTIONAL to MANDATORY, restructured test tasks by type (integration/E2E/unit), added coverage verification tasks

Follow-up TODOs: None - all templates aligned with new testing principles
-->

# Notio Constitution

## Core Principles

### I. Pragmatic Testing Strategy (NON-NEGOTIABLE)

**Testing Philosophy** (Based on Rainer Hahnekamp's Principles): All features MUST achieve 100% code coverage through a pragmatic, integration-first testing approach:

**Coverage Requirements**:
- **100% code coverage is MANDATORY** - All code paths must be exercised by tests
- **Integration Tests (Primary)**: 60-70% of test suite
  - Test realistic user workflows and feature interactions
  - Verify components work together correctly
  - Cover happy paths and common error scenarios
  - Test data flow through multiple layers
- **E2E Tests (Secondary)**: 20-30% of test suite
  - Test critical user journeys from UI to backend
  - Verify complete feature workflows
  - Cover cross-browser compatibility for musical features
  - Test performance under realistic conditions
- **Unit Tests (Minimal, Strategic)**: 10-20% of test suite
  - Reserved ONLY for edge cases and complex algorithms
  - Test complex musical calculations (e.g., interval calculations, tuning algorithms)
  - Test error handling in isolated utility functions
  - Test boundary conditions and exceptional inputs
  - Do NOT unit test simple getters, setters, or obvious code

**Testing Process**:
- Tests SHOULD be written before or alongside implementation (pragmatic TDD)
- Integration tests MUST cover the primary use cases
- Unit tests MUST focus on edge cases not easily covered by integration tests
- All tests MUST pass before code is merged
- Coverage reports MUST show 100% line and branch coverage
- Tests MUST be maintainable and fast (integration tests < 5s, E2E tests < 30s per test)

**Rationale**: Traditional TDD with heavy unit testing creates brittle test suites that break with refactoring. Rainer Hahnekamp's research shows integration tests provide better ROI - they catch real bugs, survive refactoring, and reflect actual user behavior. For Notio's educational mission, testing how musical features work together (notation + audio + interaction) is more valuable than testing isolated components. Unit tests are still necessary for complex algorithms where edge cases are critical (e.g., music theory calculations), but should be the exception, not the rule.

### II. Component Reusability

**React Component Architecture**: All UI components MUST be designed for reusability:
- Components MUST have single, well-defined responsibilities
- Components MUST be independently testable
- Props interfaces MUST be clearly documented
- Shared components MUST be placed in appropriate directories (e.g., `src/components/common/`)
- Complex components MUST be broken into smaller, composable units

**Rationale**: Music education interfaces require consistent UI patterns (notation display, playback controls, theory exercises). Reusable components reduce duplication, improve maintainability, and ensure consistent user experience across pedagogical contexts.

### III. Educational Pedagogy First

**User-Centered Design for Learning**: All features MUST prioritize educational effectiveness:
- User stories MUST identify target learner personas (students, teachers, administrators)
- Interfaces MUST support progressive disclosure of complexity
- Feedback MUST be immediate and pedagogically meaningful
- Features MUST align with music theory learning objectives
- Accessibility MUST be considered for diverse learning needs

**Rationale**: Notio exists to improve music education. Technical decisions must serve pedagogical goals. Features that confuse learners or obscure musical concepts violate the core mission, regardless of technical elegance.

### IV. Performance & Responsiveness

**Interactive Music Standards**: Musical interfaces MUST meet strict performance requirements:
- Audio latency MUST be under 50ms for interactive instruments
- Notation rendering MUST complete within 200ms for typical exercises
- UI interactions MUST feel responsive (60fps animations where applicable)
- Performance MUST be validated on target educational device specs (not just developer machines)
- Audio playback MUST synchronize accurately with visual notation

**Rationale**: Musical timing is perceptually critical. Latency destroys the connection between student action and musical result, undermining learning. Visual-audio synchronization is essential for ear training and rhythm exercises.

### V. Integration-First Testing for Musical Features

**Integration Testing is Primary**: Musical and educational features MUST prioritize integration tests as the primary testing strategy:

**Integration Test Requirements**:
- Notation rendering + playback synchronization MUST be tested together
- Student interaction flows (complete exercises, receive feedback) MUST have full integration coverage
- Teacher workflows (create assignments, review student work) MUST be tested end-to-end
- Cross-component data flow MUST be verified (e.g., user input → state management → rendering)
- API integration with backend services MUST be tested with realistic data
- Musical feature combinations MUST be tested (e.g., playback + visual feedback + user controls)

**E2E Test Requirements**:
- Critical user journeys MUST have E2E test coverage (student completing an exercise, teacher grading)
- Cross-browser audio/visual consistency MUST be validated via E2E tests
- Performance characteristics MUST be measured in E2E tests
- Data persistence for learning progress MUST be verified across sessions

**Coverage Validation**:
- Integration tests MUST account for 60-70% of total test suite
- E2E tests MUST account for 20-30% of total test suite
- Combined integration + E2E tests MUST achieve 100% code coverage
- Unit tests MUST only supplement where edge cases aren't covered by integration tests

**Rationale**: Musical pedagogy depends on integrated systems working seamlessly together. A student's learning experience spans notation rendering, audio synthesis, interaction handling, and progress tracking—testing these in isolation provides false confidence. Integration tests catch real bugs at component boundaries and survive refactoring better than unit tests. E2E tests validate the complete user experience but are slower and more brittle, so should be used strategically for critical paths.

### VI. Accessibility & Inclusive Design

**Universal Access to Music Education**: Features MUST support diverse learners:
- Keyboard navigation MUST be fully functional (not mouse-only)
- Color MUST NOT be the sole channel for musical information
- Text alternatives MUST exist for visual musical content where feasible
- Font sizes and contrast MUST meet WCAG 2.1 AA standards minimum
- Audio feedback MUST complement visual feedback, not replace it

**Rationale**: Music education benefits all students. Visual or motor impairments should not prevent learning music theory. Inclusive design broadens access and aligns with Notio's educational mission.

### VII. Simplicity & Maintainability

**Avoid Premature Complexity**: Technical solutions MUST start simple:
- Implement the simplest solution that meets requirements (YAGNI principle)
- Abstractions MUST be justified by actual reuse or clear future need
- External dependencies MUST be evaluated for necessity and maintenance burden
- Complexity MUST be documented and justified in implementation plans
- Refactoring toward simplicity is encouraged and valued

**Rationale**: Educational software has long lifecycles and evolving pedagogical requirements. Over-engineered solutions become maintenance burdens. Simple code is easier for educators contributing to the project and for students potentially learning from the codebase.

## Educational Integrity

### Pedagogical Accuracy

- Musical notation MUST be rendered according to standard music engraving practices
- Music theory exercises MUST reflect accepted pedagogical frameworks
- Feedback to students MUST be musically and theoretically accurate
- Audio synthesis MUST produce recognizable, properly-tuned pitches and rhythms

### Data Privacy for Students

- Student data MUST be handled according to educational privacy standards (e.g., FERPA, GDPR where applicable)
- Personally identifiable information MUST be minimized and protected
- Teachers MUST have appropriate access controls to student work
- Student progress data MUST be exportable and portable

## Development Standards

### Code Quality

- All code MUST pass ESLint and Prettier checks before merge
- Functions MUST have clear, descriptive names reflecting musical or pedagogical intent
- Complex musical algorithms MUST have explanatory comments or documentation
- Magic numbers in musical calculations (e.g., frequencies, intervals) MUST be named constants

### Documentation

- Public APIs and components MUST have JSDoc or equivalent documentation
- Musical domain concepts (e.g., "figured bass," "voice leading") MUST be explained for non-expert contributors
- User-facing features MUST have corresponding user documentation or in-app help
- Setup instructions MUST be validated on clean environments

### Version Control

- Commits MUST have descriptive messages explaining "why" not just "what"
- Feature branches MUST be used for all non-trivial changes
- Pull requests MUST reference related issues or user stories
- Breaking changes MUST be clearly marked and migration paths documented

## Governance

### Amendment Process

1. Proposed amendments MUST be documented in a pull request to this file
2. Amendments MUST include rationale and examples of impact
3. Constitution version MUST be incremented according to semantic versioning:
   - **MAJOR**: Backward incompatible changes (removing/redefining principles)
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. Dependent templates (plan, spec, tasks) MUST be reviewed for consistency
5. Amendments require project maintainer approval

### Compliance Review

- All feature specifications (`spec.md`) MUST address how the feature aligns with constitutional principles
- Implementation plans (`plan.md`) MUST include a "Constitution Check" section validating compliance
- Pull request reviews MUST verify constitutional compliance
- Violations MUST be justified in a "Complexity Tracking" section or rejected

### Living Document

- This constitution reflects Notio's current understanding of its mission and best practices
- Principles may evolve as the project learns from educational deployment and user feedback
- Simplicity and clarity are valued over exhaustive rules
- When in doubt, prioritize student learning outcomes

**Version**: 2.0.0 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-12
