# Feature Specification: Notio Proofreading Fixes 2025

**Feature Branch**: `004-proofreading-fixes`
**Created**: 2025-11-17
**Status**: Draft
**Input**: Fix 7 issues identified in Notio_proofreading 2025.pdf document

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Chromatic Scale Extensions (Priority: P1)

When users enable "Extensions" mode on chromatic scales with flats (Db, Eb, F, Gb, Ab, Bb, B), an incorrect extra extension "m" appears that shouldn't be there.

**Why this priority**: This is a direct correctness issue that affects the educational accuracy of the tool. Users relying on chromatic scales with extensions will see incorrect musical notation.

**Independent Test**: Can be fully tested by selecting any chromatic scale with flats (e.g., Db chromatic), enabling Extensions mode, and verifying no extra "m" extension appears.

**Acceptance Scenarios**:

1. **Given** a chromatic scale with flats is selected (Db, Eb, F, Gb, Ab, Bb, or B), **When** "Extensions" mode is enabled, **Then** no extra "m" extension should be displayed
2. **Given** Extensions mode is enabled on a non-flat chromatic scale, **When** switching to a flat chromatic scale, **Then** the "m" extension should not appear

---

### User Story 2 - Disable Relative Names for Chromatic Scales (Priority: P1)

Relative names in chromatic scales are consistently erroneous (e.g., in A chromatic, it shows "DO RA RE" instead of "DO DI RE"), creating a "wicked problem" where fixing one issue creates new problems elsewhere.

**Why this priority**: This affects the educational accuracy for all chromatic scales. Since the relative naming cannot be fixed without introducing new errors, it must be disabled.

**Independent Test**: Can be tested by selecting any chromatic scale and verifying that the Relative checkbox is either disabled or relative names are not shown for chromatic scales.

**Acceptance Scenarios**:

1. **Given** any chromatic scale is selected, **When** viewing the scale display, **Then** relative names should not be shown OR the Relative checkbox should be disabled
2. **Given** Relative mode is enabled on a non-chromatic scale, **When** switching to a chromatic scale, **Then** relative names should be hidden or the Relative option should become disabled

---

### User Story 3 - Fix Staff Line Alignment at Gb (Priority: P2)

In extended mode with "Romance" notation enabled, staff lines shift noticeably at Gb, creating a visual discontinuity.

**Why this priority**: This is a visual quality issue that affects user experience and professionalism of the display, but doesn't affect musical accuracy.

**Independent Test**: Can be tested by selecting any scale containing Gb, enabling Extended mode and Romance notation, and verifying staff lines are continuous.

**Acceptance Scenarios**:

1. **Given** a scale containing Gb, **When** Extended mode and Romance notation are both enabled, **Then** staff lines should be continuous without noticeable shifts at Gb
2. **Given** Extended mode and Romance notation are enabled, **When** navigating through notes including Gb, **Then** all staff lines should remain aligned

---

### User Story 4 - Fix Relative Mode Syllable Names (Priority: P1)

In relative mode for natural minor, harmonic minor, Phrygian, and Locrian scales, LE and sometimes SE syllables are in correct positions but have wrong names.

**Why this priority**: This is a correctness issue affecting music theory education. Students using relative (solfège) mode will learn incorrect syllable names.

**Independent Test**: Can be tested by selecting natural minor, harmonic minor, Phrygian, or Locrian scales in relative mode and verifying syllable names match the specified formulas.

**Acceptance Scenarios**:

1. **Given** Natural minor scale in relative mode, **When** viewing the syllable names, **Then** they should be: DO RE ME FA SO LE TE
2. **Given** Harmonic minor scale in relative mode, **When** viewing the syllable names, **Then** they should be: DO RE ME FA SO LE TI
3. **Given** Phrygian scale in relative mode, **When** viewing the syllable names, **Then** they should be: DO RA ME FA SO LE TE
4. **Given** Locrian scale in relative mode, **When** viewing the syllable names, **Then** they should be: DO RA ME FA SE LE TE

---

### User Story 5 - Fix Minor Blues Formula (Priority: P2)

Some sharps/flats in the minor blues scale do not follow the correct minor blues formula.

**Why this priority**: This is a correctness issue for users specifically working with blues scales, affecting a subset of functionality.

**Independent Test**: Can be tested by selecting minor blues scale in any key and verifying the intervals match 1 b3 4 #4 5 7.

**Acceptance Scenarios**:

1. **Given** C minor blues scale is selected, **When** viewing the notes, **Then** they should be: C Eb F F# G Bb
2. **Given** any minor blues scale is selected, **When** analyzing the intervals, **Then** they should follow the formula: 1 b3 4 #4 5 7

---

### User Story 6 - Fix Video Player Text (Priority: P3)

Video player has a typo (missing "r" in "currently"), mentions "YouTube" which isn't available in all countries, and uses inconsistent capitalization of "URL".

**Why this priority**: This is a text quality and internationalization issue. While important for polish, it doesn't affect core functionality.

**Independent Test**: Can be tested by opening the Video Player tab and verifying the corrected text appears.

**Acceptance Scenarios**:

1. **Given** the Video Player tab is opened, **When** viewing the instructions, **Then** text should read: "Enter the URL for any video or playlist you want to use with Notio, then press Enter."
2. **Given** the Video Player tab is opened, **When** viewing the status text, **Then** it should read: "You are currently watching:"
3. **Given** the Video Player interface, **When** checking all instances of "URL", **Then** it should be uppercase everywhere including the tab header

---

### User Story 7 - Increase Video Player Font Size (Priority: P3)

Video player instructions use a font size that's too small for comfortable reading, especially for users with middle-aged eyes.

**Why this priority**: This is an accessibility and usability improvement that affects readability but not core functionality.

**Independent Test**: Can be tested by opening the Video Player and verifying the font size is noticeably larger and more readable.

**Acceptance Scenarios**:

1. **Given** the Video Player tab is opened, **When** viewing the instruction text, **Then** font size should be increased to as large as possible while maintaining layout
2. **Given** increased font size, **When** entering a URL, **Then** all instructional text should remain visible and readable

---

### Edge Cases

- What happens when switching between chromatic and non-chromatic scales with Extensions enabled?
- What happens when switching between chromatic and non-chromatic scales with Relative mode enabled?
- How does the system handle scales with Gb when switching between Romance and non-Romance notation?
- What happens when a user has both Extended and Romance notation enabled simultaneously on different scales?

## Requirements *(mandatory)*

### Functional Requirements

**Chromatic Scale Extensions:**
- **FR-001**: System MUST NOT display extra "m" extension for chromatic scales with flats (Db, Eb, F, Gb, Ab, Bb, B) when Extensions mode is enabled

**Chromatic Scale Relative Names:**
- **FR-002**: System MUST disable the Relative checkbox option for all chromatic scales OR hide relative names when a chromatic scale is selected
- **FR-003**: System MUST maintain correct relative names for all non-chromatic scales

**Staff Line Alignment:**
- **FR-004**: System MUST maintain continuous staff lines without visual shifts at Gb in Extended mode with Romance notation

**Relative Mode Syllables:**
- **FR-005**: Natural minor in relative mode MUST display: DO RE ME FA SO LE TE
- **FR-006**: Harmonic minor in relative mode MUST display: DO RE ME FA SO LE TI
- **FR-007**: Phrygian in relative mode MUST display: DO RA ME FA SO LE TE
- **FR-008**: Locrian in relative mode MUST display: DO RA ME FA SE LE TE

**Minor Blues Formula:**
- **FR-009**: Minor blues scale MUST follow the formula: 1 b3 4 #4 5 7 for all root notes
- **FR-010**: System MUST apply correct sharps/flats according to the minor blues formula

**Video Player Text:**
- **FR-011**: Video player MUST display: "Enter the URL for any video or playlist you want to use with Notio, then press Enter."
- **FR-012**: Video player MUST display: "You are currently watching:" (with correct spelling of "currently")
- **FR-013**: System MUST display "URL" in uppercase in all instances within the video player interface

**Video Player Font:**
- **FR-014**: Video player instruction text MUST use a larger font size for improved readability

### Key Entities

- **Scale Configuration**: Represents the selected scale type, root note, and mode settings (Extensions, Relative, Romance notation)
- **Staff Display**: Visual representation of musical staff with notes and notation
- **Video Player Settings**: Configuration and display state for the video player interface

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 7 chromatic scales with flats display correct extensions (no extra "m") when Extensions mode is enabled
- **SC-002**: Chromatic scales either have disabled Relative checkbox or show no relative names
- **SC-003**: Staff lines remain visually aligned at Gb in all scales with Extended and Romance notation enabled
- **SC-004**: All 4 specified modes (natural minor, harmonic minor, Phrygian, Locrian) display correct syllable names in relative mode
- **SC-005**: Minor blues scales in all 12 keys display notes matching the formula 1 b3 4 #4 5 7
- **SC-006**: Video player text contains no typos and uses "URL" consistently in uppercase
- **SC-007**: Video player instructions are readable with improved font size
- **SC-008**: All existing functionality continues to work without regression
