# Implementation Plan: Fix Relative Notation to Use Scale Steps

**Branch**: `004-fix-relative-notation` | **Date**: 2025-12-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-fix-relative-notation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix the Relative notation system in MusicScale.js to use scale degree numbers (from scaleRecipe.numbers) instead of semitone steps. This ensures enharmonic equivalents like #4 and b5 display correctly as "FI" and "SE" respectively, using a simple lookup dictionary mapping scale degree strings to relative syllables. **Key insight: Use the numbers property from the scaleObject to map directly to the Relative noteNames - no need to use the semitones.**

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: None (pure JavaScript fix in existing codebase)
**Storage**: N/A (no data persistence changes)
**Testing**: Jest (^29.0.3), React Testing Library (@testing-library/react ^13.0.0), Playwright (@playwright/test)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web (frontend React application)
**Performance Goals**: Instant syllable lookup (<16ms frame time for 60fps), no impact on scale rendering performance
**Constraints**: Must not affect other notation types, must handle all existing 14 scale types correctly, fallback error handling for invalid scale degrees
**Scale/Scope**: Single function modification in MusicScale.js BuildExtendedScaleToneNames() method, approximately 20-line dictionary + 5-line lookup logic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Pragmatic Testing Strategy

- **Status**: COMPLIANT
- **Coverage Plan**:
  - **Integration Tests (60-70%)**: Test scale notation rendering with all scale types (Lydian, Locrian, Phrygian, etc.) in Relative notation. Verify correct syllable display for each scale degree. Test notation switching between Relative and other types.
  - **E2E Tests (20-30%)**: Test complete user workflow - select scale → enable Relative notation → verify display → switch scales → verify update → switch notation types → verify no regression.
  - **Unit Tests (10-20%)**: Test the lookup dictionary function in isolation with edge cases (invalid keys, special symbols like △7, missing entries).
- **100% Coverage**: Required and achievable - single function change with clear input/output contract.
- **Test Performance**: Dictionary lookup is O(1), tests will run in <100ms.

### ✅ II. Component Reusability

- **Status**: COMPLIANT
- **Impact**: No new components created. Modification is internal to MusicScale.js model class. No UI component changes required.

### ✅ III. Educational Pedagogy First

- **Status**: COMPLIANT - **PRIMARY BENEFIT**
- **Educational Impact**: Fixes fundamental music theory bug. Students learning movable-do solfège must distinguish #4 (raised fourth, "FI") from b5 (lowered fifth, "SE"). Current bug teaches incorrect enharmonic relationships, undermining music theory education.
- **Target Learners**: Music students using Notio for scale theory and solfège practice.

### ✅ IV. Performance & Responsiveness

- **Status**: COMPLIANT
- **Performance**: Dictionary lookup is O(1) constant time. Updates complete within 16ms (single frame at 60fps). Will meet <200ms notation rendering requirement.

### ✅ V. Integration-First Testing for Musical Features

- **Status**: COMPLIANT
- **Integration Focus**: Tests will verify Relative notation works correctly with:
  - Scale selection system
  - Notation switching system
  - Extended scale generation (multiple octaves)
  - All 14 existing scale types
- **E2E Coverage**: Critical user journey (select scale, toggle notations, verify output) will have full E2E test.

### ✅ VI. Accessibility & Inclusive Design

- **Status**: COMPLIANT
- **Impact**: No accessibility changes. Notation display already has proper ARIA labels. Fix improves educational accuracy for all learners.

### ✅ VII. Simplicity & Maintainability

- **Status**: COMPLIANT - **EXEMPLARY**
- **Simplicity**: This fix follows YAGNI perfectly. Solution is a 20-entry lookup dictionary, no complex parsing, no new abstractions. **Direct mapping from scaleRecipe.numbers to relative syllables - bypasses semitone complexity entirely.**
- **Maintainability**: Dictionary is self-documenting (keys and values are music theory standard terms). Adding new scale degrees in future requires single dictionary entry.

### Constitution Summary

**Overall Status**: ✅ **FULLY COMPLIANT**

This feature exemplifies constitutional principles - it's educationally essential (Principle III), technically simple (Principle VII), and testable with integration-first approach (Principles I & V). Zero violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/004-fix-relative-notation/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already created)
├── research.md          # Phase 0 output (COMPLETE)
├── data-model.md        # Phase 1 output (COMPLETE)
├── quickstart.md        # Phase 1 output (COMPLETE)
├── contracts/           # Phase 1 output (COMPLETE)
│   └── MusicScale-BuildExtendedScaleToneNames.md
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec quality checklist (already created)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── Model/
│   └── MusicScale.js    # MODIFIED: BuildExtendedScaleToneNames() method - line ~315-318
├── data/
│   ├── notes.js         # REFERENCE: Contains note_relative field (used for Chromatic fallback)
│   └── scalesObj.js     # REFERENCE: Scale recipes with numbers array - THIS IS THE KEY SOURCE
└── components/
    └── menu/
        └── Notation.js  # REFERENCE: Notation switching logic

tests/
├── integration/
│   └── relative-notation.test.js  # NEW: Integration tests for all scales
└── e2e/
    └── notation-switching.spec.js # NEW: E2E test for user workflow
```

**Structure Decision**: Single project web application. This is a model layer fix (MusicScale.js) with no UI component changes. Tests will be added to existing test directories following the integration-first approach (60-70% integration, 20-30% E2E, 10-20% unit).

**Key Implementation Note**: The numbers property from scaleRecipe (e.g., ["1", "2", "3", "#4", "5", "6", "△7"]) provides direct scale degree notation that maps cleanly to relative syllables. No need to reverse-engineer from semitones.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - this section is not applicable.

---

## Phase 0: Research & Technical Decisions

**Status**: ✅ Complete

**Artifacts Generated**:
- [research.md](research.md) - Technical decisions and implementation approach

**Key Decisions**:
1. **Dictionary Structure**: JavaScript object literal for O(1) lookup
2. **Missing Keys**: Fallback to semitone logic with console warning (clarified in spec session)
3. **Dictionary Placement**: Function-level constant within BuildExtendedScaleToneNames()
4. **Testing Strategy**: Integration-first (65% integration, 25% E2E, 10% unit)
5. **Performance Target**: <16ms frame time (clarified in spec session)

**Core Insight**: The scaleRecipe.numbers array already contains the exact scale degree strings we need (e.g., "#4", "b5"). We don't need to derive these from semitones - just iterate through numbers array and look up each string in the dictionary. This is even simpler than originally planned.

**Unknowns Resolved**: All technical decisions finalized. No clarifications needed.

## Phase 1: Data Model & Contracts

**Status**: ✅ Complete

**Artifacts Generated**:
- [data-model.md](data-model.md) - Data structures and flow diagrams
- [contracts/MusicScale-BuildExtendedScaleToneNames.md](contracts/MusicScale-BuildExtendedScaleToneNames.md) - Method contract specification
- [quickstart.md](quickstart.md) - Implementation and testing guide (updated with chord extension mappings)
- CLAUDE.md updated with feature technology stack

**Key Entities**:
- SCALE_DEGREE_TO_RELATIVE dictionary (20 entries covering common degrees + chord extensions like "9", "11", "#11", etc.)
- ExtendedScaleToneNames.Relative array (modified output)

**API Changes**: None (internal method modification only)

**Data Flow**: scaleRecipe.numbers[i] → SCALE_DEGREE_TO_RELATIVE[key] → relative syllable

**Implementation Simplification**: Since we're using numbers array directly, the relative position calculation with `findScaleStartIndexRelativToRoot()` ensures we handle extended scales (multi-octave) correctly by using modulo to repeat the pattern.

## Phase 2: Task Breakdown

**Status**: ⏳ Pending - Generate with `/speckit.tasks`

This phase will break down the implementation into atomic, testable tasks following the integration-first testing approach.

---

## Post-Design Constitution Re-Check

All constitutional principles remain compliant after design phase. No new concerns identified.

**Key Validation**:
- ✅ Simplicity preserved: Direct numbers array → dictionary lookup (even simpler than original plan)
- ✅ Performance confirmed: <16ms target achievable with O(1) lookups
- ✅ Testing strategy validated: Integration tests cover all 14 scales, E2E covers user workflows
- ✅ Error handling clarified: Graceful fallback with console warnings

## Next Steps

1. Run `/speckit.tasks` to generate detailed task breakdown
2. Execute implementation following quickstart.md guide
3. Run integration tests and E2E tests
4. Verify 100% code coverage
5. Create PR with completed feature

**Ready for Implementation** ✅
