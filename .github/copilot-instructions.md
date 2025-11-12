# Notio Project - Coding Instructions

**Last Updated:** November 12, 2025  
**Project Type:** React-based Music Education Web Application  
**License:** Creative Commons Attribution-NonCommercial 4.0 International

---

## 📋 Project Overview

**Purpose:** Teaching music theory through interactive songwriting and improvisation tools. Provides visual and auditory feedback for learning scales, intervals, and musical notation.

**Key Features:**
- Interactive virtual keyboard with color-coded scale visualization
- Real-time musical staff notation (VexFlow)
- Multiple clef support (Treble, Bass, Alto, Tenor)
- Audio playback via Tone.js and Piano.js
- Scale and root note selection
- Session sharing via Firebase
- Video tutorial integration

**Hosted At:**
- Production: https://notio-novia-fi.netlify.app/
- Deployment: Netlify with GitHub Pages fallback

---

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **React:** 18.2.0 (Class components for main app, functional for routing)
- **React Router:** v6.3.0 (declarative routing)
- **Firebase:** 9.9.4 with compat mode (Firestore for session sharing)
- **Styling:** SASS with BEM-inspired structure
- **Node Version:** LTS/Gallium (managed via `.nvmrc`)

### Key Libraries
- **Music Notation:** `vexflow` (v4.0.3) - Musical staff rendering
- **Audio Engine:** `tone` (v14.7.77) + `@tonejs/piano` (v0.2.1)
- **Sound Library:** `soundfont-player` (v0.12.0) - Alternative audio
- **MIDI:** `webmidi` (v2.0.0)
- **UI Components:** `react-bootstrap` (v2.5.0)
- **Interactions:** `react-draggable` (v4.4.5), `react-tooltip` (v4.2.21)
- **Media:** `react-player` (v2.10.1)
- **Utilities:** `color` (v4.2.3), `lodash` (implicit via imports)

---

## 📁 Project Structure

```
notio/
├── public/
│   ├── index.html              # Entry HTML
│   └── img/                    # Static images
├── src/
│   ├── index.js                # React Router v6 setup, app entry
│   ├── WholeApp.js             # Main app component (Class-based)
│   ├── WholeAppWrapper.js      # Router v6 wrapper for URL params
│   ├── Firebase.js             # Firebase/Firestore configuration
│   ├── components/
│   │   ├── keyboard/           # Piano/ColorKey components
│   │   ├── menu/               # TopMenu, SubMenu, dropdowns
│   │   ├── musicScore/         # MusicalStaff (VexFlow wrapper)
│   │   ├── form/               # Checkbox, Radio, ListRadio components
│   │   ├── arrows/             # Arrow UI components
│   │   └── OverlayPlugins/     # Modal/overlay components
│   ├── Model/
│   │   ├── MusicScale.js       # Music theory logic (scales, notes)
│   │   ├── SoundMaker.js       # Sound engine abstraction
│   │   └── Adapters/           # Adapter pattern for sound libraries
│   ├── data/
│   │   ├── scalesObj.js        # Scale definitions (Major, Minor, etc.)
│   │   ├── notes.js            # Note mappings
│   │   ├── clefs.js            # Clef configurations
│   │   ├── colors.js           # Color schemes
│   │   ├── themes.js           # Light/dark themes
│   │   └── config.js           # App constants (tutorial URLs, etc.)
│   ├── assets/img/             # SVG React components (icons, clefs)
│   ├── styles/
│   │   ├── style.scss          # Main SCSS entry (imports all partials)
│   │   ├── 01_base/            # Base styles, typography, animations
│   │   ├── 02_components/      # Component-specific styles
│   │   ├── 03_layout/          # Layout and SVG styles
│   │   ├── 04_pages/           # Page-specific styles
│   │   ├── 05_themes/          # Theme variables
│   │   ├── 06_abstracts/       # SCSS mixins, variables
│   │   └── 07_vendors/         # Third-party overrides
│   ├── __test__/               # Jest + React Testing Library tests
│   ├── __mocks__/              # Jest mocks (tone.js, react-player)
│   └── markdown/               # Markdown content (AboutNotio.md)
└── .nvmrc                      # Node version: lts/gallium
```

---

## 🎯 Component Architecture

### Component Patterns

**Primary Pattern:** Class Components with lifecycle methods
- `WholeApp.js` - Main state container (legacy class component)
- Most UI components are Class-based
- Newer routing components use Functional + Hooks

**State Management:**
- **Global State:** Lives in `WholeApp` component state
- **Props Drilling:** State passed down via props
- **No Redux/Context:** Direct parent-child communication
- **Firebase:** Used only for session sharing, not real-time state

**Component Lifecycle Usage:**
- `componentDidMount` - Initial setup, refs, event listeners
- `componentDidUpdate` - Respond to prop/state changes
- `componentWillUnmount` - Cleanup (event listeners, audio)

### Key Components

#### WholeApp.js (Main Container)
```javascript
// Class component holding all application state
state = {
  octave: 4,
  scale: "Major (Ionian)",
  scaleObject: {...},
  clef: "treble",
  baseNote: "C",
  notation: ["Colors"],
  instrumentSound: "piano",
  pianoOn: true,
  trebleStaffOn: true,
  theme: "light",
  sessionID: null,
  videoUrl: notio_tutorial,
  // ...tooltip refs
}
```

**Responsibilities:**
- Central state management
- Firebase session loading/saving
- Pass handlers to child components
- Manage tooltip refs

#### ColorKey.js (Interactive Piano Key)
- Represents a single piano key
- Handles touch and mouse events
- Triggers audio playback
- Displays musical staff notation per key
- Uses PropTypes for validation

#### MusicalStaff.js (VexFlow Wrapper)
- Renders musical notation using VexFlow v4
- Clef-aware (treble, bass, alto, tenor)
- Handles accidentals (#, b, bb, ##)
- SVG-based rendering
- Uses refs for DOM manipulation

#### TopMenu.js (Main Navigation)
- Controls for scale, root note, clef selection
- Sound/instrument picker
- Video tutorial toggle
- Share functionality
- Tooltip management

### Model Layer

#### MusicScale.js
**Purpose:** Music theory computation engine

**Key Concepts:**
- **Recipe:** Scale definition (steps, numbers)
- **Ambitus:** Range in semitones
- **Transposition:** Root note offset
- **Extended Scale:** Spans multiple octaves

**Methods:**
- `init()` - Calculate scale tones
- `NoteNameWithOctaveNumber()` - Convert to notation
- Scale generation from chromatic steps

#### SoundMaker.js (Adapter Pattern)
**Purpose:** Abstract sound library implementations

**Architecture:**
```javascript
// Adapter pattern allows swapping sound engines
soundMakerAdapters = [
  new sf_Adapter_to_SoundMaker(props),  // SoundFont
  new ts_Adapter_to_SoundMaker(props),  // Tone.js (active)
]
```

**Interface:**
- `Instruments()` - Available sounds
- `chooseInstrument()` - Select instrument
- `startSound(note)` - Play note
- `stopSound(note)` - Release note

---

## 🎨 Styling Conventions

### SCSS Architecture (7-1 Pattern)

**Import Order in `style.scss`:**
1. `01_base/` - Resets, typography, base elements
2. `02_components/` - Component-specific styles
3. `03_layout/` - Layout, SVG, form styles
4. `06_abstracts/` - Variables, mixins, functions

**Naming Convention:**
- Component files: `componentName.scss` (camelCase)
- BEM-inspired but not strict
- Theme variables for light/dark modes

**Theme Support:**
- `themes.js` defines color schemes
- CSS variables for dynamic theming
- `theme` state prop controls active theme

---

## 🎵 Music Theory Data Structures

### Scale Definition Format
```javascript
{
  name: "Major (Ionian)",
  steps: [0, 2, 4, 5, 7, 9, 11],           // Semitone intervals
  numbers: ["1", "2", "3", "4", "5", "6", "△7"],  // Chord symbols
  major_seventh: 11,                        // Special interval marker
  default: true                             // Default scale flag
}
```

### Note Mapping
- `noteMapping.js` - Array format
- `noteMappingObj.js` - Object format
- `rootNote.js` / `rootNoteObj.js` - Root note definitions
- Multiple notation systems supported (English, German, etc.)

---

## 🔊 Audio Implementation

### Sound Libraries (Dual System)

**Primary:** Tone.js with Piano.js
- Used via `Adapter_Tonejs_to_SoundMaker.js`
- Realistic piano samples
- Lower latency for web audio

**Fallback:** SoundFont Player
- Used via `Adapter_SoundFont_to_SoundMaker.js`
- Multiple instrument timbres
- `SoundFontLibraryNames.js` and `TonejsSoundNames.js` define available sounds

**Audio Flow:**
1. User interaction (key press/touch)
2. `ColorKey` or `PianoKey` calls `noteOnHandler`
3. `WholeApp` delegates to `SoundMaker`
4. Active adapter plays sound via chosen library

---

## 🧪 Testing Strategy

### Framework: Jest + React Testing Library

**Test Location:** `src/__test__/`

**Setup:** `setupTests.js`
```javascript
import "@testing-library/jest-dom";
```

**Mocking Strategy:**
- `__mocks__/tone.js` - Mock Tone.js to avoid audio in tests
- `__mocks__/@tonejs/piano.js` - Mock Piano.js
- `__mocks__/react-player/lazy.js` - Mock video player

**Test Commands:**
```bash
yarn test              # Watch mode
npm test               # Same as above
yarn test-ci           # CI mode (no watch)
```

**Coverage:**
- HTML + text reporters configured
- Transform patterns ignore `node_modules` except `vexflow` and `gsap`

**Example Test Pattern:**
```javascript
// ColorKey.test.js
const testProps = {
  clef: "treble",
  note: "C4",
  toneIsInScale: true,
  // ...all required props
};

it("should render correctly", () => {
  const { container } = render(<ColorKey {...testProps} />);
  expect(container).toMatchSnapshot();
});
```

**Testing Philosophy:**
- Snapshot tests for component structure
- Lifecycle method spies (`componentDidMount`, etc.)
- Limited event testing (many commented out - likely flaky)

---

## 🔥 Firebase Integration

### Configuration
**File:** `src/Firebase.js`

**Purpose:** Session sharing only (not real-time sync)

**Usage Pattern:**
```javascript
import db from "./Firebase";

// Save session
db.collection("sessions").add(stateObject);

// Load session
db.collection("sessions").doc(sessionId).get();
```

**Session Sharing Flow:**
1. User clicks "Share" button
2. Current state serialized to Firestore
3. Unique session ID generated
4. Shareable URL: `/shared/:sessionId`
5. Recipient loads state via `WholeAppWrapper`

**Note:** Uses Firebase compat mode (v9 with v8 API)

---

## 🛣️ Routing (React Router v6)

### Routes
```javascript
<Routes>
  <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
  <Route path="/" element={<WholeApp />} />
</Routes>
```

### URL Parameters
**Problem:** Router v6 `useParams()` hook doesn't work in class components

**Solution:** `WholeAppWrapper.js` acts as bridge
```javascript
function WholeAppWrapper() {
  let { sessionId } = useParams();
  return <WholeApp sessionId={sessionId} />;
}
```

**TODO (documented in code):**
- Refactor `WholeApp` from class to functional component
- Use hooks directly instead of wrapper pattern

---

## 🎯 Coding Standards

### File Naming
- **Components:** PascalCase (e.g., `ColorKey.js`, `TopMenu.js`)
- **Utilities:** camelCase (e.g., `utils.js`, `config.js`)
- **Data:** camelCase (e.g., `scalesObj.js`, `noteMappingObj.js`)
- **Styles:** camelCase (e.g., `topMenu.scss`, `musicalStaff.scss`)
- **Tests:** Match component name + `.test.js` (e.g., `ColorKey.test.js`)

### Code Formatting
**Formatter:** Prettier (implicit, no config file found)

**Settings (from README):**
- Tab size: 2 spaces
- Quotes: Both single and double allowed
- Format on save: Expected

**Recommendation:** Add `.prettierrc` for consistency:
```json
{
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false
}
```

### PropTypes Usage
- Used in key components (`ColorKey`, `PianoKey`, `MusicalStaff`)
- Validates props passed to components
- Pattern:
```javascript
import PropTypes from "prop-types";

ComponentName.propTypes = {
  note: PropTypes.string,
  toneIsInScale: PropTypes.bool,
  color: PropTypes.string,
};
```

### Comments & TODOs
**Active TODOs in codebase:**
```javascript
// TODO: Refactor WholeApp to functional component
// TODO: Fix unresponsive key colors when pressed
// TODO: Meet router-dom v6 requirements properly
```

**Comment Style:**
- `//INFO:` - Informational notes
- `//TODO:` - Future work
- Block comments for complex logic explanations

---

## 🚀 Development Workflow

### Initial Setup
```bash
# Use correct Node version
nvm install $(cat .nvmrc)  # lts/gallium
nvm use

# Install dependencies (prefer Yarn)
yarn install

# Start dev server
yarn start                  # http://localhost:3000
```

### Package Management
⚠️ **CRITICAL:** Do NOT mix npm and yarn
- **Primary:** `yarn` (lock file: `yarn.lock`)
- **Fallback:** `npm` only if yarn unavailable
- Never commit both `yarn.lock` and `package-lock.json`

### Build & Deployment

**Development Build:**
```bash
yarn build                  # Creates optimized build/
npx serve -s build          # Local preview
```

**Deploy to GitHub Pages:**
```bash
yarn deploy                 # Runs predeploy + gh-pages deploy
```

**Deploy to Netlify:**
- Automatic on push to main branch
- Build command: `CI=false react-scripts build && cp netlify.toml build/netlify.toml`
- Note: `CI=false` prevents warnings from failing build

**Environment Variables:**
- Firebase credentials in `Firebase.js` (public read-only)
- No `.env` file used currently

---

## 🎓 Common Patterns & Best Practices

### ✅ Preferred Patterns

#### 1. Ref Management for Tooltips
```javascript
// Store refs in state for tooltip positioning
state = {
  keyboardTooltipRef: null,
};

setRef = (ref, menu) => {
  if (menu === "keyboard" && this.state.keyboardTooltipRef === null) {
    this.setState({ keyboardTooltipRef: ref });
  }
};
```

#### 2. Event Handling (Touch + Mouse)
```javascript
// Handle both touch and mouse for mobile/desktop
touchDown = (e) => {
  if (e.cancelable) e.preventDefault();
  this.playNote(this.props.note);
};

clickedMouse = (e) => {
  this.playNote(this.props.note);
};
```

#### 3. Conditional Rendering
```javascript
// Check boolean flags before rendering
{this.state.pianoOn && <Keyboard {...props} />}
{this.state.trebleStaffOn && <MusicalStaff {...props} />}
```

#### 4. Color Manipulation
```javascript
import Color from "color";

// Use 'color' library for color operations
initColor(props.color) {
  this._colorInit = Color(props.color).lighten(0.2).string();
  this._colorActive = Color(props.color).darken(0.3).string();
}
```

#### 5. Data Transformation
```javascript
// Convert note format for VexFlow: "C4" → "C/4"
let match = /[0-9]/.exec(this.props.note);
if (match) {
  daNote = this.props.note.substr(0, match.index) + "/" + 
           this.props.note.substr(match.index);
}
```

### ❌ Anti-Patterns to Avoid

#### 1. Direct DOM Manipulation
```javascript
// ❌ Avoid (except for VexFlow which requires it)
document.getElementById("something").style.color = "red";

// ✅ Use React state and refs instead
this.setState({ color: "red" });
```

#### 2. Mutating State Directly
```javascript
// ❌ Never do this
this.state.scale = "Minor";

// ✅ Always use setState
this.setState({ scale: "Minor" });
```

#### 3. Arrow Functions in Render
```javascript
// ❌ Creates new function every render
<button onClick={() => this.handleClick()} />

// ✅ Bind in constructor or use class fields
constructor(props) {
  this.handleClick = this.handleClick.bind(this);
}
```

#### 4. Mixing Notation Systems
```javascript
// ❌ Inconsistent note naming
const note = "Db4";  // English
const root = "Ré";   // French

// ✅ Use data files for notation conversion
import noteMapping from "data/noteMappingObj";
```

---

## 🐛 Known Issues & Workarounds

### 1. React Router v6 + Class Components
**Issue:** `useParams()` hook incompatible with class components

**Workaround:** `WholeAppWrapper` functional wrapper
```javascript
function WholeAppWrapper() {
  let { sessionId } = useParams();
  return <WholeApp sessionId={sessionId} />;
}
```

**Long-term Fix:** Refactor `WholeApp` to functional component

### 2. Key Color Response on Press
**Issue:** Keys don't always show visual feedback when pressed

**Location:** `ColorKey.js` (commented TODOs)

**Potential Fix:** State-based color management needs review

### 3. StrictMode Disabled
**Issue:** `<React.StrictMode>` commented out in `index.js`

**Reason:** Likely causes issues with VexFlow or audio libraries

**Recommendation:** Test with StrictMode periodically

### 4. CI Build Warnings
**Issue:** Warnings fail CI builds

**Workaround:** `CI=false` in build script

**Better Solution:** Fix warnings (unused vars, deprecated APIs)

---

## 🔧 Adding New Features

### Adding a New Scale
1. **Define scale in `data/scalesObj.js`:**
```javascript
{
  name: "Dorian",
  steps: [0, 2, 3, 5, 7, 9, 10],
  numbers: ["1", "2", "♭3", "4", "5", "6", "♭7"],
}
```

2. **No other changes needed** - `MusicScale.js` handles automatically

### Adding a New Clef
1. **Add to `data/clefs.js`:**
```javascript
{
  name: "Tenor Clef",
  value: "tenor",
  img: <TenorClef />,
}
```

2. **Create SVG component in `assets/img/`**

3. **Update `MusicalStaff.js`** if special rendering needed

### Adding a New Instrument Sound
1. **Add to `data/TonejsSoundNames.js`** or `SoundFontLibraryNames.js`

2. **Ensure adapter supports it** in `Model/Adapters/`

3. **Test audio loading** (instruments load asynchronously)

### Adding a New Component
1. **Create in appropriate folder:**
   - UI: `components/`
   - Music logic: `Model/`
   - Data: `data/`

2. **Add styles in `styles/02_components/componentName.scss`**

3. **Import styles in `styles/style.scss`**

4. **Create test file in `__test__/ComponentName.test.js`**

5. **Use PropTypes for prop validation**

---

## 🧩 Integration Points

### VexFlow (Music Notation)
- **Version:** 4.0.3
- **Docs:** https://github.com/0xfe/vexflow/wiki/Tutorial
- **Usage:** Wrapped in `MusicalStaff.js`
- **Rendering:** SVG-based with `setViewBox` for sizing
- **Gotchas:** Requires direct DOM manipulation via refs

### Tone.js (Audio Engine)
- **Version:** 14.7.77
- **Usage:** Via adapter pattern in `SoundMaker.js`
- **Loading:** Instruments load async (show loading screen)
- **Note Format:** MIDI note names (e.g., "C4", "Db5")

### React Bootstrap
- **Version:** 2.5.0
- **Usage:** Limited (mostly custom components)
- **Components Used:** Likely modals, forms (check imports)

### React Tooltip
- **Version:** 4.2.21
- **Pattern:** Ref-based positioning
- **Global Instance:** `<ReactTooltip />` in `WholeApp.js`
- **Usage:** `data-tip` and `data-for` attributes

---

## 📚 Learning Resources

### Understanding This Codebase
1. **Start with:** `WholeApp.js` (main state container)
2. **Then:** `MusicScale.js` (core music theory)
3. **Then:** `ColorKey.js` (user interaction)
4. **Then:** `MusicalStaff.js` (notation rendering)

### External Documentation
- **React Router v6:** https://reactrouter.com/en/v6.3.0/upgrading/v5
- **VexFlow 4:** https://github.com/0xfe/vexflow/wiki/Tutorial
- **Tone.js:** https://tonejs.github.io/
- **Firebase v9 (compat):** https://firebase.google.com/docs/web/modular-upgrade

### Music Theory Context
- **Scales:** Major, Minor, Modes, Pentatonic
- **Intervals:** Semitones (chromatic steps)
- **Notation:** Multiple systems (English, German, Latin)
- **Clefs:** Treble, Bass, Alto, Tenor

---

## 🎓 Educational Context

**Target Audience:** Finnish school music education

**Pedagogy Focus:**
- Learning by doing (interactive exploration)
- Visual + auditory feedback
- Songwriting and improvisation tools
- Theory integrated with practice

**Collaboration:**
- Åbo Academy University
- Novia University of Applied Sciences
- Vasa Övningsskola
- MusEDLab research group

---

## 📝 License Compliance

**License:** Creative Commons Attribution-NonCommercial 4.0 International

**Requirements:**
- ✅ Attribution required (credit MusEDLab, researchers)
- ❌ Non-commercial use only
- ✅ Derivatives allowed (with same license)
- ✅ Sharing allowed

**When Contributing:**
- All code becomes CC BY-NC 4.0
- Commercial forks NOT permitted
- Educational use encouraged

---

## 🔍 Common Tasks Checklist

### Before Committing
- [ ] Run `yarn test` (all tests pass)
- [ ] Check for ESLint warnings (`yarn build`)
- [ ] Test on mobile (touch events)
- [ ] Test audio playback
- [ ] Verify tooltips work
- [ ] Check console for errors

### Before Deploying
- [ ] Run full build: `yarn build`
- [ ] Test production build: `npx serve -s build`
- [ ] Verify Firebase session sharing works
- [ ] Test on multiple browsers
- [ ] Check responsive design

### Adding Dependencies
```bash
# Always use yarn for consistency
yarn add package-name

# Update documentation if significant
# - README.md (if user-facing)
# - This file (if impacts architecture)
```

---

## 🚨 Critical Gotchas

### 1. Audio Context Restrictions
Modern browsers require user interaction before audio plays. First click may not work - handled in code.

### 2. VexFlow Rendering
Must use refs and direct DOM manipulation. React's virtual DOM doesn't play nice with VexFlow's SVG manipulation.

### 3. Firebase Compat Mode
Using v9 with v8 API (`firebase/compat/*`). Don't mix modular imports.

### 4. Mobile Touch Events
Always `preventDefault()` on touch events to avoid double-firing with mouse events.

### 5. Snapshot Tests
Will break on minor HTML changes. Review diffs carefully - visual changes may be intentional.

---

## 🎯 Future Improvements (From Code TODOs)

### High Priority
1. **Refactor WholeApp to functional component**
   - Use hooks instead of class lifecycle
   - Simplify router integration
   - Better state management potential

2. **Fix key color responsiveness**
   - Keys should visually respond to all interactions
   - Review state-based color changes

### Medium Priority
3. **Add TypeScript**
   - PropTypes → TypeScript interfaces
   - Better IDE autocomplete
   - Catch errors at compile time

4. **Improve test coverage**
   - More integration tests
   - Less reliance on snapshots
   - Test user workflows end-to-end

### Low Priority
5. **Context API for state**
   - Reduce props drilling
   - Cleaner component tree

6. **Enable StrictMode**
   - Fix compatibility issues
   - Better future-proofing

---

## 💬 Questions? Troubleshooting

### "Audio doesn't play"
- Check browser audio permissions
- Verify instrument loaded (loading screen should show)
- Check console for Tone.js errors
- Try different browser

### "Firebase session not loading"
- Check network tab for Firestore requests
- Verify Firebase config (API key valid)
- Check sessionId in URL is valid

### "VexFlow not rendering"
- Check if ref is set properly
- Verify clef prop is valid
- Look for SVG element in DOM
- Check console for VexFlow errors

### "Build fails"
- Clear `node_modules` and reinstall: `rm -rf node_modules yarn.lock && yarn install`
- Check Node version: `node --version` (should match `.nvmrc`)
- Try `CI=false yarn build` to ignore warnings

### "Tests failing"
- Clear Jest cache: `yarn test --clearCache`
- Check mocks in `__mocks__/` are correct
- Verify `setupTests.js` runs
- Update snapshots if intentional: `yarn test -u`

---

## 🎵 Music Theory Quick Reference

### Scale Structure
```javascript
steps: [0, 2, 4, 5, 7, 9, 11]  // Semitone intervals from root
numbers: ["1", "2", "3", "4", "5", "6", "△7"]  // Scale degrees
```

### Note Naming
- **MIDI:** C4 = Middle C (octave 4)
- **VexFlow:** C/4 (slash notation)
- **Chromatic:** 0-11 (C=0, C#=1, ..., B=11)

### Clef Ranges
- **Treble:** G4 on second line
- **Bass:** F3 on fourth line
- **Alto:** C4 on third line
- **Tenor:** C3 on fourth line

---

## 📞 Support & Contribution

**Research Team:**
- PI Cecilia Björk (Åbo Academy)
- Mats Granfors (Novia University)
- Jan Jansson (Vasa Övningsskola)
- MusEDLab

**More Info:** http://musedlab.org/notio

**Contribution Guidelines:**
1. Respect educational focus
2. Follow existing patterns
3. Test on mobile devices
4. Document music theory decisions
5. Remember: Non-commercial license

---

**END OF CODING INSTRUCTIONS**

*This document reflects the codebase as of November 2025. Update when architecture changes significantly.*

# Additional Documentation for Notio Project

**Note:** This content should be appended to `.github/copilot-instructions.md` after the current "END OF CODING INSTRUCTIONS" section.

---

## 🎹 Keyboard Interaction System

### QWERTY Keyboard Mapping

**Purpose:** Allow users to play notes using computer keyboard

**Keycodes (Right Hand - Main Scale):**
- Standard: `F G H J K L ; '` (8 keys)
- Extended: `A S D F G H J K L ; ' [ =` (13 keys)

**Keycodes (Left Hand - Lower Octave):**
- `Z X C A S D Q W E` 
- Maps to steps: `-6, -5, -4, -3, -2, -1, 0, 1, 2` relative to root

**Implementation:**
- Uses `code` property for cross-keyboard compatibility (AZERTY, QWERTY)
- Maintains `pressedKeys` Set to prevent duplicate events
- Three octave support via `threeLowerOctave` Set

**Key Interaction Flow:**
1. User presses physical keyboard key
2. `handleKeyDown` checks if key is mapped
3. Converts keycode to scale degree
4. Triggers `noteOnHandler` with calculated note
5. Adds key to `pressedKeys` Set
6. On release, removes from Set and calls `noteOffHandler`

---

## 🎨 Color System

### Color Schemes

**Purpose:** Visual differentiation of scale degrees with accessibility support

**Available Palettes:**
- **standard:** Grayscale (accessibility neutral)
- **colorBlindProtanopia:** Red-green colorblind optimized
- **colorBlindDeuteranopia:** Red-green colorblind (deuteranopia variant)

**Color Assignment:**
- Each scale degree (0-11) assigned a color from palette
- Colors cycle for extended scales spanning multiple octaves
- Root note always gets first color in palette (usually red `#cd0223`)

**Testing Resources:**
- Coblis simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/
- Color Oracle: https://colororacle.org/
- Sim Daltonism: https://michelf.ca/projects/sim-daltonism/

**Implementation:**
```javascript
// colors.js exports object with named palettes
const colors = {
  standard: ["#cd0223", "#C8C8C8", ...],
  colorBlindProtanopia: ["#cd0223", "#AA4499", ...],
};
```

---

## 🎛️ Feature Flags & State

### Boolean Feature Toggles

**Location:** `WholeApp.js` state

| Flag | Default | Purpose |
|------|---------|---------|
| `pianoOn` | `true` | Show/hide virtual keyboard |
| `extendedKeyboard` | `false` | Toggle 8-key vs 13-key keyboard layout |
| `trebleStaffOn` | `true` | Show/hide musical staff notation |
| `showOffNotes` | `true` | Display keys not in current scale (grayed out) |
| `videoActive` | `false` | Video tutorial overlay visibility |
| `showTooltip` | `true` | Enable/disable all tooltips |
| `loading` | `true` | Show loading screen during initialization |

**Extended Keyboard:**
- **Standard (8 keys):** Covers 1 octave + 1 note (13 semitones)
- **Extended (13 keys):** Covers 2 octaves (24 semitones)
- Ambitus calculation: `extendedKeyboard ? 24 : 13`
- Scale start offset: `extendedKeyboard ? 7 : 0`

**Show Off-Notes:**
- When `true`: Display all chromatic keys, gray out non-scale tones
- When `false`: Only show keys that are in the selected scale
- CSS class applied: `.showOffNotes` on `.Piano` container

---

## 🪟 Overlay System

### Draggable Overlays

**Purpose:** Modal-like windows that can be dragged and minimized

**Components:**
- `Overlay.js` - Base draggable container
- `InfoOverlay.js` - Help/about content
- `VideoTutorial.js` - Video player implementation

**Key Features:**
- **Draggable:** Uses `react-draggable` library
- **Minimizable:** Underscore button collapses to title bar only
- **Closeable:** X button dismisses overlay
- **Portal-based:** Renders outside main DOM hierarchy

**Overlay State:**
```javascript
state = {
  minimized: false,  // Collapsed to title bar
  hidden: false,     // Content visibility
};
```

**Grab Bar:**
- Draggable handle at top of overlay
- CSS class: `.overlay__grabbar.drag`
- User can click and drag to reposition

---

## 📹 Video Tutorial System

### VideoTutorial Component

**Purpose:** Embedded YouTube player with custom URL support

**Tab Structure:**
1. **Player Tab:** ReactPlayer component for video playback
2. **Enter URL Tab:** Form to input custom video URL
3. **Tutorials Tab:** Placeholder for curated tutorial list

**Default Tutorial:**
- Playlist URL stored in `data/config.js`
- YouTube playlist: `notio_tutorial` constant
- URL: https://youtube.com/playlist?list=PL7imp2jxKd0Bcx4cjR3gEMirkAzd84G_C

**State Management:**
```javascript
const [playing, setPlaying] = useState(false);
const [videoUrl, setVideoUrl] = useState(props.videoUrl);
const [activeTab, setActiveTab] = useState(props.activeVideoTab);
```

**URL Persistence:**
- Custom URLs saved to WholeApp state
- Shared via Firebase session sharing
- Reset button restores default tutorial

**Player Behavior:**
- Lazy loaded via `react-player/lazy`
- Auto-play on ready
- Responsive sizing (100% width/height)
- Full YouTube controls available

---

## 🚀 Deployment & Infrastructure

### Netlify Configuration

**File:** `netlify.toml`

**Critical Redirects:**
```toml
[[redirects]]
  from = "/shared/*"
  to = "/"
  status = 200
  force = true
```

**Purpose:** Client-side routing support
- All `/shared/:sessionId` routes redirect to index.html
- Allows React Router to handle routing
- Status 200 (not 301/302) preserves URL for React Router

**Build Settings (in package.json):**
```bash
CI=false react-scripts build && cp netlify.toml build/netlify.toml
```
- `CI=false` prevents warnings from failing build
- Copies `netlify.toml` to build directory for deployment

### GitHub Pages (Alternative)

**Command:** `yarn deploy`

**Process:**
1. Runs `predeploy` script (builds project)
2. Uses `gh-pages` package to deploy `build/` folder
3. Publishes to `gh-pages` branch

**Note:** Primary deployment is Netlify, GitHub Pages is fallback

---

## 🔧 Development Environment

### Git Workflow

**`.gitignore` Essentials:**
- `/node_modules` - Dependencies (never commit)
- `/build` - Production builds
- `.DS_Store` - macOS system files
- `*.log` - All log files
- `.env.*` - Environment variables
- `notio.code-workspace` - Local VS Code settings

**Best Practices:**
- Never commit `node_modules` or `build` directories
- Keep `yarn.lock` committed (never `package-lock.json` alongside it)
- Commit `.nvmrc` for Node version consistency

### ESLint Configuration

**Location:** Configured in `package.json` (no separate `.eslintrc`)

**Extends:**
- `react-app`
- `react-app/jest`

**Usage:**
- `/* eslint-disable */` used sparingly
- Common: `/* eslint-disable no-fallthrough */` in switch statements
- **Best Practice:** Fix warnings instead of disabling them

### Browser Compatibility

**Target Browsers (from package.json):**

**Production:**
- `>0.2%` market share
- `not dead` (actively maintained)
- `not op_mini all` (Opera Mini excluded)

**Development:**
- Last 1 Chrome version
- Last 1 Firefox version
- Last 1 Safari version

**Audio Compatibility:**
- Web Audio API required (all modern browsers)
- User interaction needed before audio plays (browser security)

---

## 🎼 Music Notation Details

### Clef System

**Available Clefs:**
```javascript
const clefs = [
  { name: 'treble', svg: 'treble', default: true },
  { name: 'bass', svg: 'BassClef' },
  { name: 'alto', svg: 'AltoClef' },
  { name: 'tenor', svg: 'TenorClef' },
  { name: "hide notes", svg: "NoNoteClef" }  // Special: hides staff
];
```

**SVG Icons:**
- Stored as React components in `src/assets/img/`
- File naming: PascalCase (e.g., `TrebleClef.js`, `BassClef.js`)
- Imported and used via `svg` property in clef objects

**"Hide Notes" Feature:**
- Special clef option that disables staff rendering
- Sets `trebleStaffOn` to `false`
- Useful for focusing on ear training without visual aid
- Students can practice by ear only

### VexFlow Note Format Conversion

**Challenge:** VexFlow uses different notation than MIDI/Tone.js

**Conversion Pattern:**
```javascript
// Input: "C4" (MIDI format)
// Output: "C/4" (VexFlow format)

let match = /[0-9]/.exec(this.props.note);
if (match) {
  daNote = this.props.note.substr(0, match.index) + "/" + 
           this.props.note.substr(match.index);
}
```

**Accidental Handling in VexFlow:**
- `b` → flat (♭)
- `bb` → double flat (𝄫)
- `#` → sharp (♯)
- `##` → double sharp (𝄪)
- Added via `StaveNote.addModifier(new Accidental(...), 0)`

---

## 🧩 State Serialization (Firebase Sharing)

### Shareable State Structure

**What Gets Shared:**
```javascript
{
  octave,
  octaveDist,
  scale,
  scaleObject,
  clef,
  baseNote,
  notation,
  instrumentSound,
  pianoOn,
  extendedKeyboard,
  trebleStaffOn,
  theme,
  showOffNotes,
  videoUrl,
  activeVideoTab
}
```

**What Does NOT Get Shared:**
- Tooltip refs (UI-specific)
- Loading states
- Session ID itself
- Sound engine instances
- Active notes being played

**Loading Shared Session:**
1. Extract `sessionId` from URL via React Router
2. Query Firestore: `db.collection("sessions").doc(sessionId).get()`
3. Merge result into `WholeApp` state via `setState()`
4. UI automatically updates via React re-render
5. User sees exact configuration from shared link

**Error Handling:**
- Invalid session IDs show error in state: `sessionError`
- Missing sessions handled gracefully (fallback to defaults)

---

## 🎯 Custom Scale Feature

### Creating Custom Scales

**User Flow:**
1. Click "Custom Scale" button in menu
2. Enter scale name (e.g., "My Blues Scale")
3. Define semitone steps (comma-separated, 0-11)
4. Define scale degree numbers (e.g., "1, 2, ♭3, 4, 5")
5. Submit → Scale added to `scaleList` state

**Implementation:**
```javascript
handleChangeCustomScale = (customScaleName, customsteps, customNumbers, firstRun = false) => {
  // Check if scale name already exists
  if (!this.state.scaleList.map((element) => element.name === customScaleName).includes(true)) {
    this.setState({
      scaleList: [...this.state.scaleList, { 
        name: customScaleName, 
        steps: customsteps, 
        numbers: customNumbers 
      }],
      scale: customScaleName,
      scaleObject: { name: customScaleName, steps: customsteps, numbers: customNumbers }
    });
    if (!firstRun) {
      alert("Custom Scale Created " + customScaleName);
    }
  } else if (!firstRun) {
    alert("A scale of that name already exists");
  }
};
```

**Validation:**
- Duplicate names prevented
- Alert shown to user on success/failure
- `firstRun` parameter suppresses alerts during session loading

**Persistence:**
- Custom scales added to session state
- Shared via Firebase if user clicks "Share"
- **Not persisted locally** (cleared on refresh)
- Recipients of shared link get custom scales

---

## 🐛 Additional Known Issues

### 6. QwertyKeyboard Component Incomplete
**Issue:** `QwertyKeyboard.js` is commented out/stub implementation

**Location:** `src/components/keyboard/QwertyKeyboard.js`

**Current Status:** Keyboard mapping logic currently in `Keyboard.js`

**Impact:** Code organization could be improved

**Future Work:** Separate QWERTY logic into dedicated component

### 7. Unused Imports
**Issue:** Lodash imported implicitly in some files

**Example:** `import _ from "lodash"` but only `.startCase()` used

**Impact:** Bundle size slightly larger than necessary

**Fix:** Use direct imports: `import startCase from "lodash/startCase"`

**Files Affected:** `TopMenu.js` and others

### 8. Theme System Minimal
**Issue:** Only two themes defined (light/dark)

**Location:** `src/data/themes.js` only has name properties

**Missing:** Actual CSS variable definitions in theme objects

**Current Implementation:** Theme switching handled in SCSS via CSS classes

**Workaround:** SCSS files contain theme-specific variables, not JS

---

## 📊 Performance Considerations

### Bundle Size Optimization

**Current Issues:**
- Full Lodash imported (not tree-shakeable)
- VexFlow is large library (~500KB)
- Tone.js + Piano samples add significant size

**Optimization Opportunities:**
1. Use `lodash-es` for tree-shaking
2. Code-split VexFlow (load only when staff visible)
3. Lazy-load Piano samples on user interaction
4. Implement route-based code splitting

### Audio Loading Strategy

**Current:**
- All instruments load at app startup
- Loading screen shown during initialization
- `LoadingScreen.js` component displays progress

**Flow:**
1. `SoundMaker` initializes selected adapter
2. Adapter loads instrument samples (async)
3. `handleSoundsAreLoaded` callback fires when ready
4. Loading screen hidden, app becomes interactive

**User Experience:**
- First load: 2-5 seconds (downloading samples)
- Subsequent loads: ~1 second (browser cache)
- Mobile networks: May take longer

---

## 🎓 Pedagogical Design Patterns

### Educational Focus Areas

**1. Visual Learning:**
- Color-coded scale degrees
- Multiple notation systems (English, German, Latin)
- Real-time staff notation updates

**2. Auditory Learning:**
- Immediate audio feedback on key press
- Multiple instrument timbres available
- Octave shifting for range exploration

**3. Kinesthetic Learning:**
- Physical keyboard interaction (QWERTY)
- Touch-enabled for tablets
- Drag-and-drop interfaces

**4. Scaffolded Learning:**
- Start with simple scales (Major, Minor)
- Progress to modes (Dorian, Phrygian, etc.)
- Advanced: Custom scale creation
- "Hide notes" option for ear training

### Finnish Education Context

**Target Grade Levels:**
- Primary: 7-12 years old
- Lower secondary: 13-15 years old

**Curriculum Integration:**
- Complements traditional music theory
- Supports improvisation pedagogy
- Enables creative exploration (songwriting)

**Accessibility:**
- Free, open-source tool
- Works on school computers (no installation)
- Mobile-friendly for home practice

---

## 🧪 Future: Playwright E2E Testing (Rainer Hahnekamp Principles)

### Planned Implementation

**Purpose:** End-to-end testing with Playwright following Rainer Hahnekamp's testing principles

**Reference:** [Rainer Hahnekamp's Testing Principles](https://www.rainerhahnekamp.com/en/test-automation-principles/)

### Core Testing Principles to Follow

1. **Test User Workflows, Not Implementation**
   - Focus on what users actually do (select scale, play notes, share session)
   - Avoid testing internal component state or implementation details
   - Test the application as a black box from user's perspective

2. **Prioritize Integration Over Unit Tests**
   - E2E tests cover real user scenarios
   - Test interactions between components (keyboard + audio + notation)
   - Reduce reliance on mocked dependencies

3. **Test Behavior, Not Structure**
   - Don't test if a component rendered
   - Test if the user can accomplish their goal
   - Example: "User can play a C major scale" vs "ColorKey component exists"

4. **Stable Selectors**
   - Use `data-testid` attributes for test stability
   - Avoid CSS selectors that break with styling changes
   - Use semantic HTML and ARIA labels when possible

5. **Test at the Right Level**
   - **E2E (Playwright):** Critical user journeys
   - **Integration (RTL):** Component interactions
   - **Unit (Jest):** Pure functions, music theory calculations

### Planned Playwright Test Structure

```
e2e/
├── tests/
│   ├── scale-selection.spec.ts      # User selects different scales
│   ├── keyboard-interaction.spec.ts # User plays notes, hears audio
│   ├── notation-display.spec.ts     # Musical notation updates correctly
│   ├── session-sharing.spec.ts      # User shares and loads sessions
│   ├── clef-switching.spec.ts       # User switches between clefs
│   └── mobile-touch.spec.ts         # Touch interactions on mobile
├── fixtures/
│   └── test-sessions.json           # Predefined sessions for testing
└── playwright.config.ts             # Playwright configuration
```

### Example Test Scenarios (Planned)

**Critical User Journeys to Test:**

1. **Scale Exploration Journey**
   ```typescript
   test('User explores C Major scale', async ({ page }) => {
     await page.goto('/');
     
     // Select C Major scale
     await page.getByTestId('scale-selector').click();
     await page.getByText('Major (Ionian)').click();
     
     // Verify keyboard shows correct keys highlighted
     const whiteKeys = page.getByTestId('white-key-in-scale');
     await expect(whiteKeys).toHaveCount(7); // 7 notes in major scale
     
     // Play each note in scale
     await page.getByTestId('key-C4').click();
     await page.getByTestId('key-D4').click();
     
     // Verify notation displays correctly
     await expect(page.getByTestId('musical-staff')).toBeVisible();
   });
   ```

2. **Session Sharing Journey**
   ```typescript
   test('User shares custom setup', async ({ page, context }) => {
     // Setup custom configuration
     await page.goto('/');
     await page.getByTestId('root-selector').selectOption('F#');
     await page.getByTestId('scale-selector').selectOption('Phrygian');
     
     // Share session
     await page.getByTestId('share-button').click();
     const shareUrl = await page.getByTestId('share-url-input').inputValue();
     
     // Open in new tab
     const newPage = await context.newPage();
     await newPage.goto(shareUrl);
     
     // Verify configuration loaded
     await expect(newPage.getByTestId('root-display')).toHaveText('F#');
     await expect(newPage.getByTestId('scale-display')).toHaveText('Phrygian');
   });
   ```

3. **Mobile Touch Interaction Journey**
   ```typescript
   test('Mobile user plays notes via touch', async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto('/');
     
     // Touch and hold key
     const key = page.getByTestId('key-C4');
     await key.tap();
     
     // Verify visual feedback
     await expect(key).toHaveClass(/active/);
   });
   ```

### Playwright Configuration Principles

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e/tests',
  
  // Test against multiple browsers (cross-browser audio testing)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
  
  // Run local dev server
  webServer: {
    command: 'yarn start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  
  // Screenshots and videos on failure only
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  // Parallel execution
  workers: process.env.CI ? 1 : undefined,
});
```

### Audio Testing Strategy with Playwright

**Challenge:** Testing audio playback in automated tests

**Approaches:**

1. **Audio Context Mocking**
   - Mock Web Audio API in test environment
   - Verify `startSound()` and `stopSound()` called with correct notes
   - Check audio context state changes

2. **Visual Feedback Verification**
   - Test that keys show active state when pressed
   - Verify loading screen appears while instruments load
   - Check console for audio errors

3. **Integration Points**
   - Verify Tone.js initializes correctly
   - Test instrument selection works
   - Ensure no audio context warnings

### Implementation Checklist

**Phase 1: Setup**
- [ ] Install Playwright: `yarn add -D @playwright/test`
- [ ] Initialize config: `npx playwright install`
- [ ] Create `e2e/` directory structure
- [ ] Add `data-testid` attributes to key components
- [ ] Configure CI integration

**Phase 2: Core Tests**
- [ ] Scale selection workflow
- [ ] Note playback interaction
- [ ] Musical notation rendering
- [ ] Root note selection
- [ ] Clef switching

**Phase 3: Advanced Tests**
- [ ] Session sharing (Firebase integration)
- [ ] Mobile touch interactions
- [ ] Keyboard navigation (a11y)
- [ ] Video tutorial integration
- [ ] Theme switching

**Phase 4: Cross-browser & Performance**
- [ ] Test on Chrome, Firefox, Safari
- [ ] Mobile device testing (iOS/Android)
- [ ] Performance benchmarks
- [ ] Visual regression testing

### Benefits for Notio Project

1. **Confidence in Refactoring**
   - Safe to refactor `WholeApp` to functional component
   - Verify behavior unchanged after Router v6 updates

2. **Educational Quality Assurance**
   - Ensure students always have working tool
   - Catch regressions in music theory calculations
   - Verify audio works across browsers

3. **Cross-Platform Validation**
   - Test on actual mobile devices (critical for touch)
   - Verify clef rendering in different browsers
   - Ensure Firebase sharing works in all environments

4. **Documentation via Tests**
   - Tests serve as living documentation of features
   - New contributors see how features should work
   - User journeys explicitly defined in code

### Commands (When Implemented)

```bash
# Run all Playwright tests
yarn playwright test

# Run specific test file
yarn playwright test scale-selection

# Run with UI (debug mode)
yarn playwright test --ui

# Run on specific browser
yarn playwright test --project=firefox

# Generate test report
yarn playwright show-report

# Update test screenshots (visual regression)
yarn playwright test --update-snapshots
```

---

**END OF ADDITIONAL DOCUMENTATION**

*Last comprehensive update: November 12, 2025*

