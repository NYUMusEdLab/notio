# Data Model: Muted Sound for Out-of-Scale Notes

**Date**: 2025-11-16
**Spec**: [spec.md](./spec.md)

This document outlines the data structures (React state and props) relevant to implementing the "Muted Sound for Out-of-Scale Notes" feature. As this is a client-side feature, the model describes the application's state, not a database schema.

## Key Entities

### 1. MusicalScale

Represents the currently selected musical scale, which determines the set of "correct" notes.

- **Type**: `Object` or `Array`
- **Description**: A data structure holding the notes (e.g., `['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']`) that belong to the active scale. This will likely be managed by a React Context or a state management library to be accessible to the keyboard component.
- **Example State**:
  ```javascript
  {
    name: 'C Major',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  }
  ```

### 2. PianoKey

Represents a single key on the virtual piano keyboard. This is likely an existing component that will be modified.

- **Type**: `React.Component`
- **Description**: A UI component that represents a single piano key. Its props will need to include information about the note it represents and whether that note is in the current scale.
- **Example Props**:
  ```javascript
  {
    note: 'C#4',
    isNoteInScale: false, // Boolean derived from comparing `note` against `MusicalScale`
    onNavigate: (note) => { /* function to trigger sound */ }
  }
  ```

### 3. SoundAsset

Represents the audio assets to be played. This is not a data structure in state, but a conceptual entity representing the loaded sounds managed by the audio engine (`Tone.js`).

- **Type**: `Tone.Player` or `Tone.Sampler` instance
- **Description**: The audio engine will manage two key types of sounds:
    1.  **Standard Instrument Sound**: The regular piano note sound, likely managed by a sampler.
    2.  **Muted "Kloink" Sound**: A new, non-tonal sound that will be loaded into a `Tone.Player` and triggered when `isNoteInScale` is `false`.
- **Example Usage**:
  ```javascript
  // In an audio manager module
  const mutedSound = new Tone.Player("/sounds/muted-kloink.wav").toDestination();
  const pianoSampler = new Tone.Sampler({ /* ... piano samples ... */ }).toDestination();

  function playSoundForNote(note, isNoteInScale) {
    if (isNoteInScale) {
      pianoSampler.triggerAttack(note);
    } else {
      mutedSound.start();
    }
  }
  ```
