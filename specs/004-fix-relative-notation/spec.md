# Feature Specification: Fix Relative Notation to Use Scale Steps

**Feature Branch**: `004-fix-relative-notation`
**Created**: 2025-12-04
**Status**: Draft
**Input**: User description: "Fix Relative notation to use scale steps instead of semitones. A scale step of #4 should always have the Relative noteName Fi whereas a scaleStep b5 should have a name of Se."

## Clarifications

### Session 2025-12-04

- Q: Error handling strategy for invalid scale degrees? → A: Fail silently with fallback display (use semitone logic) and log warning to console
- Q: Display update performance target? → A: Instant (<16ms frame time)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lydian Scale Shows Correct #4 (Priority: P1)

When a user selects the Lydian scale with "Relative" notation enabled, the fourth scale degree (#4) displays as "FI" (the sharped version) rather than "SE" (the flatted version), correctly reflecting the raised fourth characteristic of the Lydian mode.

**Why this priority**: This is the core bug fix. Lydian is a commonly used mode, and the #4 is its defining characteristic. Displaying it incorrectly as "SE" (which implies a lowered fifth) fundamentally misrepresents the scale structure to learners.

**Independent Test**: Can be fully tested by selecting Lydian scale, enabling Relative notation, and verifying the fourth note displays "FI". Delivers immediate value by correctly teaching the Lydian mode's characteristic raised fourth.

**Acceptance Scenarios**:

1. **Given** Lydian scale is selected with root note C, **When** "Relative" notation is enabled, **Then** the scale displays as ["DO", "RE", "MI", "FI", "SO", "LA", "TI"]
2. **Given** Lydian scale is selected with any root note, **When** user views the scale, **Then** the fourth degree always shows "FI" not "SE"
3. **Given** user switches from another scale to Lydian, **When** "Relative" notation is active, **Then** the display updates immediately to show "FI" at the fourth position

---

### User Story 2 - Locrian Scale Shows Correct b5 (Priority: P1)

When a user selects the Locrian scale (or any scale with a flatted fifth) with "Relative" notation enabled, the fifth scale degree (b5) displays as "SE" (the flatted version) rather than "FI" (the sharped fourth), correctly reflecting the diminished fifth characteristic.

**Why this priority**: Equal priority to Story 1 as this demonstrates the other side of the enharmonic issue. The b5 is harmonically distinct from #4 and must be represented differently in movable-do solfège.

**Independent Test**: Can be fully tested by selecting Locrian scale (or Minor Blues which also has b5), enabling Relative notation, and verifying the fifth position displays "SE". Delivers value by correctly teaching scales with diminished fifths.

**Acceptance Scenarios**:

1. **Given** Locrian scale is selected with root note C, **When** "Relative" notation is enabled, **Then** the fifth degree displays as "SE"
2. **Given** Minor Blues scale is selected (which contains both natural 5 and b5), **When** "Relative" notation is active, **Then** the b5 displays as "SE" and the natural 5 displays as "SO"
3. **Given** any scale containing b5 in its recipe, **When** user views it in Relative notation, **Then** that degree always shows "SE" not "FI"

---

### User Story 3 - All Accidentals Map Correctly (Priority: P2)

When a user views any scale in Relative notation, all scale degrees with accidentals (sharps and flats) display the correct syllable from the appropriate chromatic solfège system (sharp names for raised degrees, flat names for lowered degrees).

**Why this priority**: This ensures comprehensive correctness across all scales, not just Lydian and Locrian. However, it's P2 because the most common issue cases (#4 and b5) are already covered by P1 stories.

**Independent Test**: Can be tested by cycling through all available scales with various accidentals (b2, b3, #4, b5, b6, b7, etc.) and verifying each uses the correct syllable. Delivers value by ensuring the entire notation system works consistently.

**Acceptance Scenarios**:

1. **Given** Phrygian scale is selected (contains b2), **When** "Relative" notation is enabled, **Then** the second degree displays as "RA" (flat second)
2. **Given** a scale with b3 is selected, **When** viewed in Relative notation, **Then** the third degree displays as "ME" (flat third)
3. **Given** a scale with b6 is selected, **When** viewed in Relative notation, **Then** the sixth degree displays as "LE" (flat sixth)
4. **Given** a scale with b7 is selected, **When** viewed in Relative notation, **Then** the seventh degree displays as "TE" (flat seventh)

---

### User Story 4 - Other Notations Remain Unaffected (Priority: P2)

When a user switches between different notation types (English, German, Romance, Scale Steps, Chord extensions), all notations continue to work correctly without any regression from the Relative notation fix.

**Why this priority**: This is a regression prevention story. While critical for quality, it's P2 because the user explicitly requested fixing Relative notation, and these other systems should remain unchanged by the fix.

**Independent Test**: Can be tested by selecting each notation type and verifying it displays correctly before and after the fix. Delivers confidence that the fix is surgical and doesn't break existing functionality.

**Acceptance Scenarios**:

1. **Given** Lydian scale is selected, **When** user cycles through all notation types, **Then** each displays correctly according to its rules (English shows note letters, German shows H for B, Romance shows Do-Re-Mi, Scale Steps shows numbers, Chord extensions shows chord symbols)
2. **Given** any scale is selected, **When** user switches from Relative to English notation, **Then** the display updates to show English note names without error
3. **Given** Chromatic scale is selected, **When** Relative notation is enabled, **Then** it displays all 12 chromatic syllables correctly as before

---

### Edge Cases

- What happens when the Chromatic scale is displayed in Relative notation? (Should continue to show all 12 chromatic syllables using existing logic)
- How does the system handle scales with double accidentals (e.g., hypothetical scale with ##4 or bb5)? (Current system doesn't have these, but code should not break)
- What happens if a scale recipe contains invalid or malformed number strings? (System MUST fallback to semitone-based mapping for that scale, log a warning to console, and display correctly using the fallback. User sees correct musical output; developers see diagnostic information.)
- How does the system behave when switching between scales rapidly while Relative notation is active? (Display should update correctly without lag or incorrect intermediate states)
- What happens when extended scale steps span multiple octaves? (System should correctly apply relative mapping to each octave based on position within pattern)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use scaleRecipe.numbers array (containing scale degree notation like "1", "#4", "b5") instead of semiToneSteps for mapping Relative notation
- **FR-002**: System MUST use a lookup dictionary that maps scale degree strings directly to relative syllables:
  - Natural degrees: "1"→"DO", "2"→"RE", "3"→"MI", "4"→"FA", "5"→"SO", "6"→"LA", "7"→"TI", "△7"→"TI"
  - Raised degrees: "#1"→"DI", "#2"→"RI", "#4"→"FI", "#5"→"SI", "#6"→"LI"
  - Lowered degrees: "b2"→"RA", "b3"→"ME", "b5"→"SE", "b6"→"LE", "b7"→"TE"
- **FR-003**: System MUST correctly map the relative position calculation to handle extended scales spanning multiple octaves
- **FR-004**: System MUST preserve all existing functionality for other notation types (English, German, Romance, Scale Steps, Chord extensions)
- **FR-005**: System MUST handle invalid or missing scale degree mappings by falling back to semitone-based logic and logging a console warning, ensuring the user sees valid output while developers receive diagnostic information

### Key Entities

- **Scale Degree to Syllable Mapping**: A simple lookup dictionary that maps scale degree strings (e.g., "#4", "b5") directly to their corresponding relative syllables (e.g., "FI", "SE"). This is a direct string-to-string mapping with approximately 15-20 entries covering all common scale degrees.

### Implementation Approach

This is a straightforward data transformation problem using **direct mapping from scaleRecipe.numbers**:

1. Iterate through the extended scale positions (same length as before)
2. For each position, get the scale degree from `scaleRecipe.numbers` array (e.g., "#4", "b5")
3. Look up that degree string in the dictionary (e.g., "#4" → "FI", "b5" → "SE")
4. Return the corresponding syllable

**Key Principle**: Use the `numbers` property from scaleRecipe to map directly to Relative noteNames. **No semitone calculation needed** - the numbers array already contains the exact scale degree notation (with accidentals) that we need.

**Example (Lydian)**:
- `scaleRecipe.numbers = ["1", "2", "3", "#4", "5", "6", "△7"]`
- Position 3 → `numbers[3]` = "#4" → Dictionary["#4"] → "FI" ✅

This bypasses the semitone confusion entirely since we're working directly with scale degree notation.

## Dependencies and Assumptions

### Dependencies

- Existing scale data structure with both semitone steps and scale degree numbers
- Existing chromatic solfège syllable mappings (sharp and flat variants)
- Existing notation switching system that allows users to toggle between different notation types
- Existing scale selection system that allows users to choose different scales

### Assumptions

- All scale recipes contain valid scale degree number strings in their numbers array
- Scale degree numbers follow the convention of optional accidental ("#" or "b") followed by a numeric degree
- The chromatic solfège system uses standard movable-do syllables (DO-based system, not LA-based)
- Users understand movable-do solfège and the distinction between enharmonic equivalents
- The fix applies only to the Relative notation case and does not affect other notation types
- Extended scales spanning multiple octaves repeat the syllable pattern based on scale degree position

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Lydian scale in Relative notation consistently displays fourth degree as "FI" (sharp fourth) not "SE" (flat fifth)
- **SC-002**: Locrian scale in Relative notation consistently displays fifth degree as "SE" (flat fifth) not "FI" (sharp fourth)
- **SC-003**: All 14 existing scale types display correct Relative syllables that match their scale degree accidentals (sharp degrees use sharp syllables, flat degrees use flat syllables)
- **SC-004**: All five other notation types (English, German, Romance, Scale Steps, Chord extensions) continue to display correctly with zero incorrect outputs
- **SC-005**: Music students can correctly identify scale degrees by their chromatic function (e.g., distinguishing raised fourth from lowered fifth) when using Relative notation
- **SC-006**: Notation display updates complete within 16ms (single frame at 60fps) when switching between notations or selecting different scales, maintaining smooth user experience
