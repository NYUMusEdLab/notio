# notio Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-13

## Active Technologies
- JavaScript ES6+, React 18.2.0 + React Testing Library (@testing-library/react ^13.0.0), Jest (^29.0.3), Playwright (@playwright/test) (001-constitution-compliance)
- Firebase (^9.9.4) for user data, localStorage for client-side state (001-constitution-compliance)
- JavaScript ES6+, React 18.2.0 + React event system, eslint-plugin-jsx-a11y (already configured) (002-fix-a11y-errors)
- N/A (no data model changes) (002-fix-a11y-errors)
- JavaScript ES6+, React 18.2.0 + React event system (onKeyDown), existing menu components (003-menu-arrow-navigation)
- N/A (no data persistence, pure UI interaction) (003-menu-arrow-navigation)
- JavaScript ES6+, React 18.2.0 + React Testing Library (@testing-library/react ^13.0.0), jest-axe, Playwright (@playwright/test), @axe-core/playwrigh (001-piano-key-keyboard-navigation)
- Firebase (^9.9.4) for user data, localStorage for client-side state (scales, progress), existing scale state managemen (001-piano-key-keyboard-navigation)
- JavaScript ES6+, React 18.2.0 + React 18.2.0 (existing), no new dependencies required (004-fix-relative-notenames)
- N/A (no data persistence - pure display logic) (004-fix-relative-notenames)

- JavaScript ES6+, React 18.2.0 (001-constitution-compliance)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript ES6+, React 18.2.0: Follow standard conventions

## Accessibility Patterns (002-fix-a11y-errors)

### ARIA Implementation
All interactive components must include:
- `role="button"` for keyboard-accessible elements
- `aria-label` with descriptive text (e.g., "Play C4", "Share", "Watch tutorial video")
- `tabIndex={0}` to include in natural tab order

Example:
```jsx
<div
  role="button"
  aria-label={`Play ${note}`}
  tabIndex={0}
  onKeyDown={handleKeyDown}>
  {/* content */}
</div>
```

### Keyboard Event Handling
Handle Enter and Space keys for button activation:
```jsx
handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent Space from scrolling page
    // Trigger action
  }
};
```

### Focus Management
- Use browser default focus indicators (no custom outline removal)
- Ensure focus/hover parity (same information shown on both interactions)
- Maintain focus after activation (keyboard events should not move focus)

### Testing Strategy (Constitution v2.0.0)
- **60-70% Integration Tests**: Use React Testing Library with jest-axe for accessibility audits
- **20-30% E2E Tests**: Use Playwright with @axe-core/playwright for cross-browser validation
- **10-20% Unit Tests**: Edge cases in focus management and unusual scenarios

Example integration test:
```jsx
import { axe, toHaveNoViolations } from 'jest-axe';

const { container } = render(<Component />);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

### Component Requirements
Icon-only buttons must have descriptive aria-labels:
- ShareButton: `aria-label="Share"`
- VideoButton: `aria-label="Watch tutorial video"`
- HelpButton: `aria-label="Help"`
- DropdownCustomScaleMenu: `aria-label="Customize scale settings"`

## Relative Notation (Movable-Do Solfege) Patterns (004-fix-relative-notenames)

### Core Implementation

The relative notation system uses **scale-degree-based syllables** (movable-do solfege) instead of chromatic-position-based syllables. This ensures syllables remain consistent across all 12 chromatic keys.

**Key Principle**: DO always represents the tonic (root note) regardless of key. Syllables are determined by scale degree position, not absolute pitch.

### Scale Degree to Syllable Mapping

Located in `src/Model/MusicScale.js` as `SCALE_DEGREE_TO_SYLLABLE` constant:

```javascript
const SCALE_DEGREE_TO_SYLLABLE = {
  // Diatonic degrees (major scale baseline)
  "1": "DO",   "2": "RE",   "3": "MI",   "4": "FA",
  "5": "SO",   "6": "LA",   "7": "TE",   "△7": "TI",

  // Chromatic alterations (lowered degrees)
  "b2": "RA",  // Phrygian, Locrian
  "b3": "ME",  // All minor scales
  "b5": "SE",  // Locrian
  "b6": "LE",  // Natural Minor, Harmonic Minor, etc.
  "b7": "TE",  // Same as "7"

  // Raised degrees (ascending alterations)
  "#1": "DI",  "#2": "RI",  "#4": "FI",  // Lydian
  "#5": "SI",  "#6": "LI"
};
```

### Expected Syllable Patterns

| Scale | Syllables | Key Characteristics |
|-------|-----------|---------------------|
| Natural Minor | DO RE ME FA SO LE TE | b3, b6, b7 |
| Harmonic Minor | DO RE ME FA SO LE TI | b3, b6, △7 (raised 7th) |
| Phrygian | DO RA ME FA SO LE TE | b2, b3, b6, b7 |
| Locrian | DO RA ME FA SE LE TE | b2, b3, b5, b6, b7 |
| Dorian | DO RE ME FA SO LA TE | b3, b7 |
| Lydian | DO RE MI FI SO LA TI | #4 |
| Mixolydian | DO RE MI FA SO LA TE | b7 |
| Melodic Minor | DO RE ME FA SO LA TI | b3 (ascending) |
| Major (Ionian) | DO RE MI FA SO LA TI | No alterations |

### Implementation Details

**Method**: `MusicScale.makeRelativeScaleSyllables(semiToneSteps, scaleNumbers, extendedSteps)`
- Maps each chromatic step to a syllable based on scale degree position
- Uses `Recipe.numbers` array (e.g., `["1", "2", "b3", "4", "5", "b6", "7"]`) to determine degrees
- Handles chromatic scale as special case (fallback to `MakeChromatic`)
- O(1) lookup performance via constant mapping table

**Integration**: Called from `BuildExtendedScaleToneNames()` case "Relative"

```javascript
case "Relative":
  theScale["Relative"] = this.makeRelativeScaleSyllables(
    semiToneSteps,
    this.Recipe.numbers,
    this.ExtendedScaleSteps
  );
  break;
```

### Testing Requirements

- **60-70% Integration Tests**: Test scale generation with `MusicScale` class
- **20-30% E2E Tests**: Test user workflows (scale selection + notation display)
- **10-20% Unit Tests**: Edge cases only (chromatic scale, pentatonics, etc.)

Example integration test:
```javascript
import MusicScale from '../Model/MusicScale';
import scalesObj from '../data/scalesObj';

const naturalMinorRecipe = scalesObj.find(s => s.name === 'Natural Minor/Aeolian');
const scale = new MusicScale(naturalMinorRecipe, 'C', 0, 36);
const syllables = scale.ExtendedScaleToneNames.Relative;

expect(syllables.slice(0, 7)).toEqual(['DO', 'RE', 'ME', 'FA', 'SO', 'LE', 'TE']);
```

### Key Independence Validation

**CRITICAL**: All scales MUST show identical syllables across all 12 chromatic keys.

Test pattern:
```javascript
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const expectedPattern = ['DO', 'RE', 'ME', 'FA', 'SO', 'LE', 'TE'];

keys.forEach(key => {
  const scale = new MusicScale(naturalMinorRecipe, key, 0, 36);
  const first7 = scale.ExtendedScaleToneNames.Relative.slice(0, 7);
  expect(first7).toEqual(expectedPattern); // MUST be identical
});
```

### Performance Targets

- <50ms syllable update on scale/key change
- <5s per integration test
- <30s per E2E test
- O(1) lookup via constant table (actual: <1ms per scale generation)

### Backward Compatibility

The relative notation fix MUST NOT affect other notation modes:
- English: C D Eb F G Ab Bb (unchanged)
- German: C D Eb F G As B (unchanged)
- Romance: Do Re Mib Fa Sol Lab Sib (unchanged)
- Scale Steps: 1 2 b3 4 5 b6 7 (unchanged)
- Chord Extensions: (unchanged)

Always test all notation modes when modifying `BuildExtendedScaleToneNames()`.

## Recent Changes
- 005-url-storage-completion: Added JavaScript ES6+, React 18.2.0 + React 18.2.0, React Testing Library (@testing-library/react ^13.0.0), Jest (^29.0.3), Playwright (@playwright/test), jest-axe, @axe-core/playwright, react-draggable
- 004-url-settings-storage: Added JavaScript ES6+, React 18.2.0 + React 18.2.0, React Router DOM 6.3.0, Firebase 10.9.0 (read-only legacy support)
- 001-piano-key-keyboard-navigation: Added JavaScript ES6+, React 18.2.0 + React Testing Library (@testing-library/react ^13.0.0), jest-axe, Playwright (@playwright/test), @axe-core/playwrigh
- 004-fix-relative-notenames: Added JavaScript ES6+, React 18.2.0 + React 18.2.0 (existing), no new dependencies required
- 004-text-size-in-video-overlay: Added JavaScript ES6+, React 18.2.0 + React Bootstrap, ReactPlayer, react-draggable, Firebase (^9.9.4), SCSS
- 001-piano-key-keyboard-navigation: Added JavaScript ES6+, React 18.2.0 + React Testing Library (@testing-library/react ^13.0.0), jest-axe, Playwright (@playwright/test), @axe-core/playwrigh
- 001-piano-key-keyboard-navigation: Added JavaScript ES6+, React 18.2.0 + React Testing Library (@testing-library/react ^13.0.0), jest-axe, Playwright (@playwright/test), @axe-core/playwrigh


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
