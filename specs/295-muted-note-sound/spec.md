# Feature Specification: Muted Sound for Out-of-Scale Notes

**Feature Branch**: `295-muted-note-sound`
**Created**: 2025-11-16
**Status**: Draft
**Input**: User description: "user story 6 kloink quiet muted piano sound when navigated to a tone not in the scale. read the user story"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audio Feedback for Out-of-Scale Notes (Priority: P1)

As a user navigating the piano keyboard, I want to hear a distinct, muted sound when I land on a note that is not part of the selected musical scale, so that I get immediate feedback about which notes are incorrect for the scale.

**Why this priority**: This is the core feature requested in the user story and provides essential feedback for learning scales.

**Independent Test**: Can be tested by selecting a scale (e.g., C Major), navigating to an in-scale note (e.g., C) and an out-of-scale note (e.g., C#), and verifying two different sounds are played. This delivers the primary value of auditory feedback for correctness.

**Acceptance Scenarios**:

1. **Given** a musical scale is selected, **When** the user navigates to a piano key that is part of the scale, **Then** the standard note sound is played.
2. **Given** a musical scale is selected, **When** the user navigates to a piano key that is NOT part of the scale, **Then** a distinct, muted "kloink" sound is played.
3. **Given** no musical scale is selected, **When** the user navigates to any piano key, **Then** the standard note sound is played for all keys.

---

### Edge Cases

- **Sound Loading Failure**: What happens if the muted sound asset fails to load? The system should fall back to silence for out-of-scale notes and log an error. It must not play the standard note sound.
- **Instrument Changes**: How does this interact with different instruments? The muted sound should be consistent and instrument-agnostic to provide a uniform experience.
- **Rapid Navigation**: What happens if the user navigates between keys very rapidly? The system must handle rapid events gracefully, prioritizing the sound for the most recently focused key without causing audio artifacts or performance degradation.

### Testing Strategy *(mandatory)*

**Integration Test Focus**:
- Verify that navigating between in-scale and out-of-scale keys triggers the correct corresponding audio (standard vs. muted).
- Test that changing the musical scale correctly updates which keys are considered "in-scale" or "out-of-scale" and triggers the appropriate sound on navigation.
- Test that deselecting a scale results in all keys playing the standard sound.

**E2E Test Focus**:
- A user selects a scale (e.g., G Major), navigates the keyboard with arrow keys, and confirms hearing the correct sounds for both in-scale (e.g., G, A, B) and out-of-scale (e.g., G#, A#) notes.

**Unit Test Focus** (edge cases only):
- The logic that determines if a given note is in the current scale, tested with various common, exotic, and custom scales.
- The fallback behavior when the muted sound asset is missing or fails to load.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST play a standard instrument sound when a user navigates to a piano key whose note is within the currently selected musical scale.
- **FR-002**: The system MUST play a specific, quiet, non-tonal "kloink" sound when a user navigates to a piano key whose note is outside the currently selected musical scale.
- **FR-003**: The system MUST define "navigation" as the keyboard focus moving to a key (e.g., via arrow keys or other assistive technology).
- **FR-004**: If no musical scale is selected, the system MUST treat all notes as "in-scale" and play the standard instrument sound for every key.

### Key Entities *(include if feature involves data)*

- **MusicalScale**: Represents the currently active set of notes that are considered "in-scale".
- **PianoKey**: Represents a single key on the keyboard, associated with a specific musical note.
- **SoundAsset**: Represents a playable audio file, such as the standard instrument note or the muted "kloink" sound.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of keyboard navigation events to out-of-scale keys trigger the muted sound, providing clear and immediate feedback.
- **SC-002**: The muted sound is audibly distinct from all standard instrument note sounds, ensuring users can unambiguously distinguish between correct and incorrect notes.
- **SC-003**: The introduction of this feature does not increase the audio playback latency for standard in-scale notes.
- **SC-004**: User testing confirms that the audio feedback helps them identify out-of-scale notes more quickly than visual feedback alone.