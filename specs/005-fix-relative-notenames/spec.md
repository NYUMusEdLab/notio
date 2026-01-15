# Feature Specification: Fix Relative NoteNames for Scales and Modes

**Feature Branch**: `004-fix-relative-notenames`
**Created**: 2025-11-30
**Status**: Draft
**Input**: User description: "I need to change the implementation of the Relative noteNames, the naming is currently off, it should be: Natural minor should always be DO RE ME FA SO LE TE, Harmonic minor DO RE ME FA SO LE TI, Phrygian DO RA ME FA SO LE TE, Locrian DO RA ME FA SE LE TE. It is a requirement that the DO (1st), RE (2nd), ME (b3rd), FA (4th), SO (5th), LE (b6th), TE (b7th) naming is consistent in all 12 chromatic keys and their enharmonic equivalents: C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Natural Minor Displays Correct Solfege (Priority: P1)

A music teacher is teaching ear training using the Natural Minor (Aeolian) scale. They select "Relative" notation mode so students can learn movable-do solfege syllables. The teacher expects students to see the correct syllables for Natural Minor: DO RE ME FA SO LE TE, with the characteristic lowered 6th (LE) and lowered 7th (TE).

**Why this priority**: Natural Minor is one of the most commonly taught scales in music education. Incorrect solfege syllables will confuse students and undermine the pedagogical purpose of the relative notation system. This is the most fundamental use case.

**Independent Test**: Can be fully tested by selecting Natural Minor scale, enabling Relative notation, and verifying all seven scale degrees display the correct syllables. Delivers immediate pedagogical value for ear training instruction.

**Acceptance Scenarios**:

1. **Given** Natural Minor scale is selected with Relative notation enabled, **When** student views the scale degrees, **Then** they see: DO (1st), RE (2nd), ME (b3rd), FA (4th), SO (5th), LE (b6th), TE (b7th)
2. **Given** Natural Minor in any key (C minor, A minor, etc.) with Relative notation, **When** scale is displayed, **Then** all instances show LE for the 6th degree and TE for the 7th degree
3. **Given** Natural Minor scale spanning multiple octaves, **When** Relative notation is enabled, **Then** each octave repeats the same syllable pattern: DO RE ME FA SO LE TE

---

### User Story 2 - Harmonic Minor Shows Raised 7th (Priority: P2)

A music teacher is demonstrating the Harmonic Minor scale's characteristic raised 7th degree. They select Harmonic Minor with Relative notation to show students how the leading tone (TI) creates the distinctive augmented 2nd interval between the 6th and 7th degrees (LE to TI).

**Why this priority**: Harmonic Minor is the second most important minor scale variant, essential for understanding classical music harmony and melodic tendencies. The raised 7th (TI vs TE) is the defining characteristic that students must recognize aurally and visually.

**Independent Test**: Can be tested independently by selecting Harmonic Minor, enabling Relative notation, and verifying the 7th degree displays TI while the 6th remains LE. Delivers value for teaching harmonic function and voice leading.

**Acceptance Scenarios**:

1. **Given** Harmonic Minor scale is selected with Relative notation enabled, **When** student views the scale degrees, **Then** they see: DO (1st), RE (2nd), ME (b3rd), FA (4th), SO (5th), LE (b6th), TI (△7th)
2. **Given** Harmonic Minor scale displayed with Relative notation, **When** comparing to Natural Minor, **Then** only the 7th degree differs (TI instead of TE), clearly showing the raised leading tone
3. **Given** Harmonic Minor in any key with Relative notation, **When** scale spans multiple octaves, **Then** the raised 7th consistently displays as TI in all octaves

---

### User Story 3 - Phrygian Mode Shows Lowered 2nd (Priority: P3)

A music student studying modal harmony selects Phrygian mode to practice improvisation. They enable Relative notation to internalize the characteristic flamenco/Spanish sound of the lowered 2nd degree (RA instead of RE). The correct display helps them identify the half-step between DO and RA that defines the Phrygian character.

**Why this priority**: Phrygian is commonly used in jazz, flamenco, and metal music. While less essential than the minor scales for beginners, it's critical for intermediate students exploring modal improvisation. The lowered 2nd (RA) is the defining interval that creates the mode's distinctive color.

**Independent Test**: Can be tested by selecting Phrygian mode, enabling Relative notation, and verifying RA appears for the b2nd degree while other degrees (LE for b6th, TE for b7th) also display correctly. Delivers value for modal ear training.

**Acceptance Scenarios**:

1. **Given** Phrygian mode is selected with Relative notation enabled, **When** student views the scale degrees, **Then** they see: DO (1st), RA (b2nd), ME (b3rd), FA (4th), SO (5th), LE (b6th), TE (b7th)
2. **Given** Phrygian mode in any key with Relative notation, **When** student plays the first two notes, **Then** they see DO-RA emphasizing the characteristic half-step interval
3. **Given** Phrygian mode spanning multiple octaves, **When** Relative notation is enabled, **Then** each octave shows the same pattern with RA for the 2nd degree

---

### User Story 4 - Locrian Mode Shows Lowered 2nd and 5th (Priority: P4)

An advanced music student studying theoretical modes selects Locrian mode (the "diminished" mode) to understand its unstable tonal character. They enable Relative notation to see both the lowered 2nd (RA) and lowered 5th (SE) that make Locrian unique among the modes, creating a diminished triad on the tonic.

**Why this priority**: Locrian is the least common mode in practical music but important for advanced theory students and contemporary composers. The combination of RA (b2nd) and SE (b5th) creates the mode's characteristic instability and diminished quality.

**Independent Test**: Can be tested by selecting Locrian mode, enabling Relative notation, and verifying both RA (b2nd) and SE (b5th) display correctly along with LE (b6th) and TE (b7th). Delivers value for advanced modal analysis and composition.

**Acceptance Scenarios**:

1. **Given** Locrian mode is selected with Relative notation enabled, **When** student views the scale degrees, **Then** they see: DO (1st), RA (b2nd), ME (b3rd), FA (4th), SE (b5th), LE (b6th), TE (b7th)
2. **Given** Locrian mode with Relative notation, **When** student examines the triad built on DO, **Then** they see DO-ME-SE forming a diminished triad
3. **Given** Locrian mode in any key spanning multiple octaves, **When** Relative notation is enabled, **Then** SE consistently appears for the 5th degree in all octaves

---

### User Story 5 - Syllables Consistent Across All Keys (Priority: P2)

A music teacher is demonstrating transposition by teaching Natural Minor in multiple keys. They start with A minor (no sharps/flats), then move to E minor (1 sharp), D minor (1 flat), B minor (2 sharps), and C# minor (4 sharps). The teacher expects that in EVERY key, the Natural Minor syllables remain identical: DO RE ME FA SO LE TE, demonstrating that movable-do solfege is key-independent.

**Why this priority**: This is a CRITICAL requirement of movable-do solfege - syllables represent scale degrees, not absolute pitches. If syllables change between keys (e.g., C minor shows different syllables than C# minor), the entire pedagogical foundation of relative notation collapses. Students learn intervals and scale patterns, not absolute pitch relationships.

**Independent Test**: Can be tested by selecting Natural Minor (or any scale/mode) in all 12 chromatic keys (C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B) and verifying identical syllable patterns appear in every key. Delivers the foundational requirement that makes movable-do solfege pedagogically valid.

**Acceptance Scenarios**:

1. **Given** Natural Minor in C with Relative notation, **When** syllables are displayed, **Then** they show: DO RE ME FA SO LE TE
2. **Given** Natural Minor in C# with Relative notation, **When** syllables are displayed, **Then** they show: DO RE ME FA SO LE TE (identical to C)
3. **Given** Natural Minor in any of the 12 chromatic keys (C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B), **When** Relative notation is enabled, **Then** ALL keys display the identical syllable pattern: DO RE ME FA SO LE TE
4. **Given** Harmonic Minor in all 12 keys, **When** Relative notation is enabled, **Then** ALL keys show: DO RE ME FA SO LE TI (consistent across all keys)
5. **Given** Phrygian mode in all 12 keys, **When** Relative notation is enabled, **Then** ALL keys show: DO RA ME FA SO LE TE (consistent across all keys)
6. **Given** Locrian mode in all 12 keys, **When** Relative notation is enabled, **Then** ALL keys show: DO RA ME FA SE LE TE (consistent across all keys)

---

### User Story 6 - Other Modes Display Appropriate Syllables (Priority: P5)

A comprehensive music theory student working through all seven modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian) plus melodic minor variants expects consistent, pedagogically correct relative note names for each mode. When they switch between Dorian, Lydian, Mixolydian, and Melodic Minor, the relative notation should reflect each scale's unique intervallic structure.

**Why this priority**: While the user explicitly specified four scales, the system should handle all modes consistently. This ensures complete pedagogical accuracy and prevents confusion when students explore the full modal spectrum.

**Independent Test**: Can be tested by systematically selecting each remaining mode (Dorian, Lydian, Mixolydian, Melodic Minor) and verifying relative syllables match standard movable-do solfege practice. Delivers comprehensive modal education support.

**Acceptance Scenarios**:

1. **Given** Dorian mode selected with Relative notation, **When** scale is displayed, **Then** syllables show: DO RE ME FA SO LA TE (natural 6th LA, lowered 7th TE)
2. **Given** Lydian mode selected with Relative notation, **When** scale is displayed, **Then** syllables show: DO RE MI FI SO LA TI (raised 4th FI)
3. **Given** Mixolydian mode selected with Relative notation, **When** scale is displayed, **Then** syllables show: DO RE MI FA SO LA TE (lowered 7th TE)
4. **Given** Melodic Minor selected with Relative notation, **When** scale is displayed, **Then** syllables show: DO RE ME FA SO LA TI (natural 6th and 7th like major, but with ME for b3rd)
5. **Given** Major (Ionian) scale with Relative notation, **When** scale is displayed, **Then** syllables show: DO RE MI FA SO LA TI (baseline major scale reference)

---

### Edge Cases

- What happens when a custom scale is created that doesn't match any standard mode or scale pattern? (The system should fall back to chromatic relative naming or a default pattern)
- How does the system handle enharmonic equivalents (e.g., C# vs Db, D# vs Eb, F# vs Gb, G# vs Ab, A# vs Bb) in relative notation? (Relative syllables MUST be absolutely identical regardless of enharmonic spelling - this is a core requirement)
- What if the scale spans more than two octaves? (Each octave should repeat the same syllable pattern)
- How are pentatonic scales handled in relative notation? (Minor Pentatonic should show appropriate subset: DO ME FA SO TE; Major Pentatonic: DO RE MI SO LA)
- What happens when switching between notation modes (English, German, Romance, Relative) mid-exercise? (The switch should be instant and consistent across all displayed notes)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display context-appropriate relative note names based on the currently selected scale or mode
- **FR-002**: Natural Minor (Aeolian) scale MUST display relative syllables as: DO RE ME FA SO LE TE
- **FR-003**: Harmonic Minor scale MUST display relative syllables as: DO RE ME FA SO LE TI
- **FR-004**: Phrygian mode MUST display relative syllables as: DO RA ME FA SO LE TE
- **FR-005**: Locrian mode MUST display relative syllables as: DO RA ME FA SE LE TE
- **FR-006**: Dorian mode MUST display relative syllables as: DO RE ME FA SO LA TE
- **FR-007**: Lydian mode MUST display relative syllables as: DO RE MI FI SO LA TI
- **FR-008**: Mixolydian mode MUST display relative syllables as: DO RE MI FA SO LA TE
- **FR-009**: Melodic Minor scale MUST display relative syllables as: DO RE ME FA SO LA TI
- **FR-010**: Major (Ionian) scale MUST display relative syllables as: DO RE MI FA SO LA TI
- **FR-011**: Relative note names MUST remain identical across ALL 12 chromatic keys (C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B) for any given scale/mode - syllables represent scale degrees, NOT absolute pitches (NON-NEGOTIABLE REQUIREMENT)
- **FR-012**: Relative syllables MUST repeat correctly across multiple octaves when scale ambitus exceeds one octave
- **FR-013**: System MUST update displayed relative note names immediately when user changes scale/mode selection
- **FR-014**: System MUST maintain correct relative syllables when notation mode is switched to/from Relative notation

### Key Entities *(include if feature involves data)*

- **Scale Definition**: Contains name, interval pattern (steps), and now must map to a specific relative syllable pattern. The syllable pattern depends on which scale degrees are raised or lowered from the major scale.
- **Relative Note Mapping**: Currently maps chromatic pitches to fixed syllables; must become context-aware based on the active scale/mode's intervallic structure.
- **Scale Degree**: Represents a specific position in a scale (1st, 2nd, 3rd, etc.) which corresponds to a specific relative syllable that varies by scale/mode.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students correctly identify scale degrees by ear using relative syllables with 90% accuracy after practicing with corrected notation
- **SC-002**: Teachers report zero instances of solfege confusion when teaching the four specified scales (Natural Minor, Harmonic Minor, Phrygian, Locrian)
- **SC-003**: All seven modes plus three minor scale variants display pedagogically correct relative syllables as verified against standard movable-do solfege references
- **SC-004**: Relative notation updates occur instantly (less than 50ms) when user switches between scales or modes
- **SC-005**: System maintains 100% accuracy in relative syllable display across all 12 chromatic keys (C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B) for each scale/mode, with enharmonic equivalents showing identical syllables

## Testing Strategy *(mandatory per Constitution v2.0.0)*

### Integration Tests (Primary - 60-70% of test suite)

**Focus**: Realistic user workflows testing scale selection + notation display together

- **INT-001**: Test complete workflow: select Natural Minor → enable Relative notation → verify all seven degrees display DO RE ME FA SO LE TE
  - Verify components work together: MusicScale model, note mapping logic, UI rendering
  - Cover happy path (C minor, A minor) and edge cases (unusual keys like F# minor)
  - Test data flow: scale recipe → relative syllable mapping → rendered notation

- **INT-002**: Test scale switching workflow: start with Major → switch to Harmonic Minor → verify TI appears for 7th degree
  - Test state management: previous syllables cleared, new syllables applied
  - Verify no residual incorrect syllables from previous scale

- **INT-003**: Test multi-octave display: select Phrygian spanning 3 octaves → verify RA repeats correctly for 2nd degree in each octave
  - Test ambitus calculation and syllable repetition logic
  - Cover various ambitus ranges (1 octave, 2.5 octaves, 3+ octaves)

- **INT-004**: Test all four specified scales in sequence
  - Natural Minor → verify LE TE
  - Harmonic Minor → verify LE TI
  - Phrygian → verify RA LE TE
  - Locrian → verify RA SE LE TE

- **INT-005**: Test remaining modes for completeness
  - Dorian → verify LA TE
  - Lydian → verify FI TI
  - Mixolydian → verify LA TE
  - Melodic Minor → verify LA TI

- **INT-006**: Test key-independence (CRITICAL - movable-do foundation)
  - Natural Minor in C → verify DO RE ME FA SO LE TE
  - Natural Minor in C# → verify DO RE ME FA SO LE TE (identical)
  - Natural Minor in Db → verify DO RE ME FA SO LE TE (identical)
  - Repeat for all 12 chromatic keys (C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B) → verify identical syllable patterns
  - Test with Harmonic Minor, Phrygian, Locrian across multiple keys
  - Verify all enharmonic equivalents (C# vs Db, D# vs Eb, F# vs Gb, G# vs Ab, A# vs Bb) show identical syllables

### E2E Tests (Secondary - 20-30% of test suite)

**Focus**: Critical user journeys through full UI interaction

- **E2E-001**: Teacher demonstration workflow
  - Load application → Select Natural Minor → Enable Relative notation → Verify display → Play scale with audio
  - Test complete feature end-to-end including audio-visual synchronization
  - Verify cross-browser compatibility (Chromium, Firefox, WebKit)

- **E2E-002**: Student practice session
  - Select Harmonic Minor → Enable Relative → Practice identifying LE-TI interval → Switch to Phrygian → Verify RA appears
  - Test multi-scale practice workflow with mode switches
  - Verify syllables persist correctly across navigation

- **E2E-003**: Multi-key consistency validation (KEY REQUIREMENT)
  - Test Natural Minor in ALL 12 chromatic keys (C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B) → Verify DO RE ME FA SO LE TE appears identically in every key
  - Test Harmonic Minor in all 12 keys → Verify DO RE ME FA SO LE TI consistent across all keys
  - Test Phrygian in all 12 keys → Verify DO RA ME FA SO LE TE consistent across all keys
  - Test Locrian in all 12 keys → Verify DO RA ME FA SE LE TE consistent across all keys
  - Ensure enharmonic equivalents (C# vs Db, D# vs Eb, F# vs Gb, G# vs Ab, A# vs Bb) show absolutely identical relative syllables
  - Measure performance: syllable update should complete in <50ms per key change

### Unit Tests (Minimal - 10-20% of test suite)

**Focus**: Edge cases in syllable mapping logic NOT easily covered by integration tests

- **UNIT-001**: Test syllable mapping function with edge case scale patterns
  - Test custom scales with unusual interval combinations
  - Test chromatic scale fallback behavior
  - Test pentatonic scale subset logic (5 notes instead of 7)
  - Boundary conditions: empty scale, single note, 12-tone row

- **UNIT-002**: Test syllable determination for altered scale degrees
  - Test b2 → RA mapping
  - Test b5 → SE mapping
  - Test b6 → LE mapping
  - Test b7 → TE mapping
  - Test #4 → FI mapping
  - Test △7 → TI mapping

- **UNIT-003**: Test octave repetition logic
  - Test syllable pattern repeats correctly across 5+ octaves
  - Test partial octaves (prefix and postfix) use correct syllables
  - Test edge case: scale starting mid-octave

### Coverage Requirements

- [ ] **100% code coverage** (MANDATORY - all code paths exercised)
- [ ] Integration tests account for 60-70% of test suite
- [ ] E2E tests account for 20-30% of test suite
- [ ] Unit tests ONLY for edge cases (10-20% maximum)
- [ ] All tests pass before merge
- [ ] Integration tests complete in <5s per test
- [ ] E2E tests complete in <30s per test

## Assumptions

- The system uses movable-do solfege system where DO always represents the tonic regardless of key
- Syllables are based on standard chromatic solfege: DO DI/RA RE RI/ME MI FA FI/SE SO SI/LE LA LI/TE TI
- Lowered degrees use the descending syllables (RA ME LE TE SE), raised degrees use ascending (DI RI FI SI LI)
- The current scale/mode context is available when relative notation is rendered
- Existing scale definitions in scalesObj.js accurately represent interval patterns
- Users understand that relative notation is movable-do (DO = tonic) not fixed-do (DO = C)

## Out of Scope

- Changing the underlying scale/mode definitions (interval patterns) - only fixing the relative syllable display
- Adding new scales or modes beyond those already defined in the system
- Implementing fixed-do solfege where DO always represents C regardless of key
- Audio pronunciation of relative syllables (text display only)
- Animated transitions between syllable changes when switching scales
- Custom user-defined syllable mappings or alternative solfege systems (Kodály, numbered notation, etc.)
