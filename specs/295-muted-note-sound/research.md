# Research: Muted Sound for Out-of-Scale Notes

**Date**: 2025-11-16
**Spec**: [spec.md](./spec.md)

## 1. Audio Playback Library

### Decision
The project will use **`Tone.js`** for handling all audio playback, including the standard note sounds and the new muted "kloink" sound for out-of-scale notes.

### Rationale
- **Existing Dependency**: `Tone.js` is already listed as a project dependency in `package.json` (`"tone": "^14.7.77"`).
- **Established Convention**: The codebase contains mocks for `Tone.js` (e.g., `src/__mocks__/tone.js`), which strongly indicates it is the established and preferred library for audio operations. Adhering to this convention ensures consistency.
- **Suitability for Purpose**: `Tone.js` is a comprehensive Web Audio framework designed specifically for creating interactive music. It provides precise timing control, a variety of synthesizers, and audio file management, making it ideal for both playing instrument notes and triggering the custom muted sound required by this feature.

### Alternatives Considered
- **HTML5 `<audio>` Element**: Rejected due to its limitations in providing low-latency, precisely scheduled audio, which is critical for a responsive musical interface.
- **`Howler.js`**: A capable audio library, but `Tone.js` is more specifically tailored to musical applications and is already integrated into the project's ecosystem.
- **`soundfont-player`**: Also present in `package.json`, but it is primarily for playing instrument notes from soundfonts. `Tone.js` provides a more general and powerful framework for managing all audio events, including custom sounds and effects. `soundfont-player` can be used in conjunction with `Tone.js`.
