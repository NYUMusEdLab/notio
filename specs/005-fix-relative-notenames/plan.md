# Implementation Plan: Fix Relative NoteNames for Scales and Modes

**Branch**: `004-fix-relative-notenames` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-fix-relative-notenames/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix the relative notation (movable-do solfege) system to display context-aware syllables based on scale degrees rather than chromatic positions. Currently, syllables are incorrectly fixed to chromatic pitches (e.g., MIDI note 21 always shows "LA"), causing all scales to display identical syllables regardless of their intervallic structure. The fix will make Natural Minor show DO RE ME FA SO LE TE, Harmonic Minor show DO RE ME FA SO LE TI, Phrygian show DO RA ME FA SO LE TE, and Locrian show DO RA ME FA SE LE TE - with these patterns remaining identical across all 12 chromatic keys (C through B, including enharmonic equivalents).

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: React 18.2.0 (existing), no new dependencies required
**Storage**: N/A (no data persistence - pure display logic)
**Testing**: Jest ^29.0.3, React Testing Library @testing-library/react ^13.0.0, Playwright @playwright/test, jest-axe
**Target Platform**: Web (Chrome, Firefox, Safari), educational devices (tablets, laptops)
**Project Type**: Single web application (frontend only)
**Performance Goals**: <50ms syllable update on scale/key change, <200ms notation rendering
**Constraints**: Must not break existing notation modes (English, German, Romance), must maintain backward compatibility with existing scale data
**Scale/Scope**: Affects 10+ scale definitions (Major, Natural Minor, Harmonic Minor, Melodic Minor, Dorian, Phrygian, Lydian, Mixolydian, Locrian, pentatonics), 12 chromatic keys each

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Evaluation (Pre-Phase 0)

- [x] **I. Pragmatic Testing Strategy**: ✅ PASS - 100% code coverage planned with integration-first approach (see spec.md Testing Strategy section: INT-001 through INT-006 for integration tests, E2E-001 through E2E-003 for E2E tests, UNIT-001 through UNIT-003 for edge case unit tests)
- [x] **II. Component Reusability**: ✅ PASS - No new components; modifying existing MusicScale model (single responsibility: scale generation). Changes are pure functions (makeRelativeScaleSyllables) with clear inputs/outputs
- [x] **III. Educational Pedagogy First**: ✅ PASS - Entire feature serves pedagogical mission: correct movable-do solfege enables ear training, supports music theory learning, aligns with standard pedagogical practice (see research.md for Kodály method alignment)
- [x] **IV. Performance & Responsiveness**: ✅ PASS - Performance goals defined (<50ms syllable update) and achievable (lookup table is O(1), total algorithm O(n) where n≈20-40, estimated <1ms per scale generation, see data-model.md Performance Considerations)
- [x] **V. Integration-First Testing**: ✅ PASS - Integration tests cover scale selection + notation display workflow (INT-001 through INT-006), E2E tests cover complete user journeys across all keys (E2E-003 tests all 12 keys × 4 scales = 48 combinations)
- [x] **VI. Accessibility & Inclusive Design**: ✅ PASS - No accessibility changes (notation display already accessible), maintains existing keyboard navigation, no color-only information (syllables are text-based)
- [x] **VII. Simplicity & Maintainability**: ✅ PASS - Simplest solution: one lookup table constant + one pure function. No new dependencies, no architectural changes, leverages existing scale data (numbers arrays), see research.md for alternatives rejected

### Post-Phase 1 Re-evaluation

- [x] **I. Pragmatic Testing Strategy**: ✅ CONFIRMED - Test strategy detailed in quickstart.md with integration tests (60-70%), E2E tests (20-30%), unit tests for edge cases (10-20%). Coverage verification tasks added.
- [x] **II. Component Reusability**: ✅ CONFIRMED - Implementation maintains single-responsibility principle. MusicScale.makeRelativeScaleSyllables() is a pure, reusable function. No component coupling.
- [x] **III. Educational Pedagogy First**: ✅ CONFIRMED - Data model explicitly references standard movable-do solfege conventions. Research document cites Kodály method and music education best practices. Quickstart provides teacher-friendly testing scenarios.
- [x] **IV. Performance & Responsiveness**: ✅ CONFIRMED - Performance analysis in data-model.md shows O(1) lookups, <1ms total time, well under <50ms target. No caching needed.
- [x] **V. Integration-First Testing**: ✅ CONFIRMED - Quickstart defines integration tests for scale+notation workflows, E2E tests for all 12 keys × 4 scales. Integration tests dominate test suite as required.
- [x] **VI. Accessibility & Inclusive Design**: ✅ CONFIRMED - Backward compatibility checklist in quickstart ensures all existing accessibility features (keyboard nav, WCAG compliance) remain functional.
- [x] **VII. Simplicity & Maintainability**: ✅ CONFIRMED - Implementation approach in data-model.md shows minimal complexity: one 15-entry lookup table, one method. No external dependencies, no architectural complexity.

**Violations**: NONE

**Justification**: N/A - all principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── Model/
│   └── MusicScale.js              # Core scale model - BUILD EXT Relative note mapping logic here
├── data/
│   ├── notes.js                    # Note definitions with chromatic mappings
│   ├── noteMappingObj.js          # Notation mappings (English, German, Romance, Relative)
│   └── scalesObj.js               # Scale definitions (steps, numbers arrays)
├── components/
│   ├── keyboard/
│   │   └── Keyboard.js            # Piano keyboard component - displays relative notation
│   └── menu/
│       └── Notation.js            # Notation mode selector menu
└── __integration__/
    └── relative-notenames.test.js  # Integration tests for relative notation

e2e/
└── relative-notenames.spec.js      # E2E tests across all keys and scales
```

**Structure Decision**: Single project (web application). The fix primarily affects:
1. **MusicScale.js** - Core model where `BuildExtendedScaleToneNames()` method (lines 259-357) generates notation. The `case "Relative":` block (lines 315-319) currently maps scale steps to fixed chromatic syllables via `notes[step % notes.length].note_relative`. This must become context-aware based on the scale's interval structure.
2. **scalesObj.js** - Contains the `numbers` arrays (e.g., `["1", "2", "b3", "4", "5", "b6", "7"]`) that define each scale's degree alterations. These will drive the relative syllable mapping.
3. **noteMappingObj.js** - The `Relative` section currently has a flat chromatic mapping. May need enhancement to support context-aware lookups.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
