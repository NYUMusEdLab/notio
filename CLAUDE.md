# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI-Assisted Development

This project uses AI agents for development. See `.ai/` folder for:
- **Agents:** Reusable agent prompts (`.ai/agents/`)
- **Plans:** Migration and improvement plans (`.ai/plans/`)
- **Reports:** Code audits and analyses (`.ai/reports/`)
- **Docs:** Workflow documentation (`.ai/docs/`)

Quick start: Read `.ai/README.md` for the full agent workflow.

## Project Overview

Notio is an interactive music education web application built with React that focuses on teaching music theory through songwriting and improvisation. It features a virtual keyboard with configurable scales, multiple notation systems, and real-time audio synthesis.

**Live:** https://notio-novia-fi.netlify.app/
**License:** Creative Commons Attribution-NonCommercial 4.0 International

## Development Commands

### Setup
```bash
yarn install  # or npm install
```

Note: Use nvm to install the Node version specified in `.nvmrc`. If nvm is not installed:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | zsh
nvm install [version.number]
```

### Development
```bash
npm start       # Start dev server
yarn start      # Alternative
```

### Testing
```bash
npm test        # Run tests in watch mode
npm run test-ci # Run tests in CI mode (non-interactive)
```

Tests require special transformIgnorePatterns configuration for vexflow, @tonejs/piano, and gsap packages.

### Build & Deploy
```bash
npm run build   # Build for production (CI=false to bypass warnings)
npx serve -s build  # Serve production build locally
yarn deploy     # Build and deploy to GitHub Pages
```

## Architecture

### Core Application Structure

**Main App Component:** `src/WholeApp.js`
- Central state management using React class component
- Manages all application state: scales, notation, octaves, keyboard settings, Firebase sessions
- Contains TODO to refactor to functional component for router-dom v6 compatibility
- Session persistence via Firebase for sharing configurations

**State Management:** All state is centralized in WholeApp.js, no Redux or Context API (except for planned SoundEngineContext)

### Key Subsystems

**1. Music Scale System** (`src/Model/MusicScale.js`)
- Complex music theory engine that handles scale construction, transposition, and notation conversion
- Builds "extended scales" consisting of: prefix (partial octave) + full octaves + postfix (partial octave)
- Converts between multiple notation systems: English, German, Romance, Relative, Scale Steps, Chord Extensions
- Handles enharmonic equivalents (e.g., C# vs Db, double sharps/flats)
- Key method: `BuildExtendedScaleSteps()` constructs the full keyboard range from a scale recipe

**2. Sound Engine** (`src/Model/SoundMaker.js` + Adapters)
- Adapter pattern implementation for multiple audio backends
- Current adapters:
  - `Adapter_Tonejs_to_SoundMaker.js`: Uses Tone.js and @tonejs/piano
  - `Adapter_SoundFont_to_SoundMaker.js`: Uses SoundFont library
- SoundMaker switches between adapters via `selectedAdaptor` index
- All sound playback goes through: `startSound(note)` / `stopSound(note)`

**3. Keyboard Component** (`src/components/keyboard/Keyboard.js`)
- Renders interactive musical keyboard
- Handles both mouse and QWERTY keyboard input
- Right hand keys (F-G-H-J-K-L-;-'): Play scale tones in order
- Left hand keys (Z-X-C-A-S-D-Q-W-E): Play specific scale degrees relative to root
- Extended keyboard mode shows 2 octaves instead of 1
- Maps two scales simultaneously:
  - `keyboardLayoutScale`: All available keys (usually Chromatic)
  - `currentScale`: User-selected scale to display/highlight

**4. Top Menu** (`src/components/menu/TopMenu.js`)
- Control panel for all app settings
- Features: keyboard toggles, sound selection, notation picker, root/octave selector, scale selector, clef selector
- Custom scale creation via `DropdownCustomScaleMenu`
- Video player integration, share functionality, tooltips system

**5. Musical Notation Rendering** (`src/components/musicScore/MusicalStaff.js`)
- Uses VexFlow 4 library for staff notation
- Renders notes on musical staves with appropriate clefs
- Handles accidentals (sharps, flats, double sharps/flats)

**6. Firebase Integration** (`src/Firebase.js`)
- Firestore database for session persistence
- `saveSessionToDB()`: Saves entire app state to Firebase
- `openSavedSession(sessionId)`: Loads shared configurations via URL parameter
- Used for "Share this setup" feature

### Data Organization

**Configuration Data** (`src/data/`)
- `scalesObj.js`: All scale recipes (Major, Minor, Modal, Pentatonic, etc.)
- `colors.js`: Color schemes for keyboard including colorblind-friendly palettes
- `notes.js`: Chromatic note definitions with properties
- `noteMappingObj.js`: Note name conversions between notation systems
- `absoluteMajorScales.js`: Pre-computed major scales in all keys
- `TonejsSoundNames.js` / `SoundFontLibraryNames.js`: Available instrument sounds

### Important Technical Details

**Scale Recipe Format:**
```javascript
{
  name: "Major (Ionian)",
  steps: [0, 2, 4, 5, 7, 9, 11],  // Semitone intervals
  numbers: ["1", "2", "3", "4", "5", "6", "△7"]  // Scale degree labels
}
```

**Note Naming:** Notes use format `"C4"`, `"F#5"`, `"Bb3"` (note name + octave number)

**Keyboard Mapping:** The app uses `event.code` (not `event.key`) for keyboard compatibility across QWERTY/AZERTY layouts

**Double Accidentals:** Handled specially - converted to enharmonic equivalents in `convertDoubleAccidental()`

**German Notation Quirk:** Uses B (not Bb) and H (not B), handled in `handleChangeRoot()`

## Code Style

- Prettier formatting: tab size 2, allow both single and double quotes
- React class components (legacy) - refactoring to functional components is a known TODO
- Right-click is disabled in the app (`document.oncontextmenu = false`)
- Mobile support is intentionally blocked with an overlay

## Common Development Workflows

**Adding a New Scale:**
1. Add scale recipe to `src/data/scalesObj.js`
2. Scale will automatically appear in the Scale menu

**Adding a New Sound:**
1. For Tone.js sounds: Add to `src/data/TonejsSoundNames.js`
2. For SoundFont: Add to `src/data/SoundFontLibraryNames.js`
3. Update adapter's `chooseInstrument()` method if needed

**Changing Keyboard Layout:**
- Modify `keycodes` or `keycodesExtended` arrays in `Keyboard.js`
- Update `activeElementsforKeyboard` filtering logic if needed

## Known Issues & TODOs

- WholeApp.js needs refactoring to functional component for React Router v6 useParams support
- Left hand keyboard keys (Z-X-C-A-S-D) sometimes "disappear" on second press (line 218 comment)
- No mobile support (intentionally blocked)
- SoundEngineContext is mentioned but not fully implemented
- Some console.logs are commented out throughout for debugging
- to memorize