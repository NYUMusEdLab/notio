# Implementation Plan: Muted Sound for Out-of-Scale Notes

**Branch**: `295-muted-note-sound` | **Date**: 2025-11-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/295-muted-note-sound/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the implementation of a feature to provide auditory feedback when a user navigates to a piano key whose note is outside the currently selected musical scale. When a note is out-of-scale, a muted "kloink" sound will play instead of the standard instrument note. The technical approach is to use the existing `Tone.js` library to manage and play the appropriate sounds based on application state.

## Technical Context

**Language/Version**: JavaScript (React 18.2.0)
**Primary Dependencies**: `react`, `tone`, `vexflow`
**Storage**: N/A for this feature (state is managed client-side)
**Testing**: Jest (via `react-scripts`), `@testing-library/react`, Playwright (for E2E)
**Target Platform**: Web Browser
**Project Type**: Web Application (Frontend)
**Performance Goals**: Audio latency < 50ms, UI interactions at 60fps.
**Constraints**: Must integrate with existing React component structure.
**Scale/Scope**: Feature is localized to the piano keyboard component and related state management.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Testing Strategy Compliance (Principle I)
- [x] 100% code coverage target confirmed
- [x] Integration tests planned for 60-70% of test suite (primary strategy)
- [x] E2E tests planned for 20-30% of test suite (critical user journeys)
- [x] Unit tests planned for 10-20% (edge cases and complex algorithms only)
- [x] Test approach follows Rainer Hahnekamp's integration-first principles

### Component Reusability (Principle II)
- [x] UI components designed for reusability (will modify existing keyboard component)
- [x] Single responsibility principle applied
- [x] Props interfaces clearly defined

### Educational Pedagogy First (Principle III)
- [x] Target learner personas identified (Music students)
- [x] Progressive disclosure of complexity considered
- [x] Immediate, pedagogically meaningful feedback designed

### Performance & Responsiveness (Principle IV)
- [x] Audio latency targets met (< 50ms for interactive instruments)
- [x] Notation rendering targets met (< 200ms)
- [x] Performance validated on target educational devices

### Integration-First Testing (Principle V)
- [x] Musical feature integration tests planned
- [x] Cross-component workflows covered (State -> Keyboard -> Audio)
- [x] Audio-visual synchronization tested

### Accessibility & Inclusive Design (Principle VI)
- [x] Keyboard navigation fully functional
- [x] Color not sole information channel (audio feedback is supplemental)
- [x] WCAG 2.1 AA standards met

### Simplicity & Maintainability (Principle VII)
- [x] Simplest solution implemented (YAGNI principle)
- [x] Abstractions justified by actual need
- [x] Dependencies evaluated for necessity (`Tone.js` is an existing dependency)

## Project Structure

### Documentation (this feature)

```text
specs/295-muted-note-sound/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - Empty for this feature
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure
src/
├── components/
│   └── keyboard/      # Modifications will occur here
├── data/              # Scale definitions may be used from here
├── services/          # An audio service/manager may be created here
└── state/             # State management for the current scale
tests/
├── __integration__/
│   └── musical-components/ # Integration tests will be added here
└── __test__/
    └── unit/           # Unit tests for scale logic will be added here
```

**Structure Decision**: The project follows a standard single-page web application structure. New logic for audio handling will be encapsulated in a dedicated service/manager within `src/services/` or a similar directory. State changes will be handled in the existing state management solution. UI modifications will be made to the existing piano keyboard component.

## Complexity Tracking

No constitutional violations identified. The plan adheres to all principles.