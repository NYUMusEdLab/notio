# Contract: Consolidated State Structure

**Feature**: 005-url-storage-completion
**Version**: 1.0.0
**Date**: 2025-12-03

## Purpose

Defines the consolidated modal position state structure in WholeApp.js, replacing 6 flat fields with a nested object.

## State Shape

### Before Refactoring

```javascript
{
  // ... other WholeApp state
  videoModalX: null,
  videoModalY: null,
  helpModalX: null,
  helpModalY: null,
  shareModalX: null,
  shareModalY: null
}
```

### After Refactoring

```javascript
{
  // ... other WholeApp state
  modalPositions: {
    video: { x: null, y: null },
    help: { x: null, y: null },
    share: { x: null, y: null }
  }
}
```

---

## Type Definitions

```typescript
interface ModalPosition {
  x: number | null;
  y: number | null;
}

interface ModalPositions {
  video: ModalPosition;
  help: ModalPosition;
  share: ModalPosition;
}

interface WholeAppState {
  // ... other state fields
  modalPositions: ModalPositions;
}
```

---

## State Operations

### Initialization

```javascript
// In WholeApp constructor or state declaration
state = {
  // ... other state
  modalPositions: {
    video: { x: null, y: null },
    help: { x: null, y: null },
    share: { x: null, y: null }
  }
};
```

### Reading State

**Before**:
```javascript
const videoX = this.state.videoModalX;
const videoY = this.state.videoModalY;
```

**After**:
```javascript
const videoX = this.state.modalPositions.video.x;
const videoY = this.state.modalPositions.video.y;

// Or destructure
const { video, help, share } = this.state.modalPositions;
```

### Updating State - Single Modal

**Before** (separate setState calls):
```javascript
this.setState({
  videoModalX: 100,
  videoModalY: 150
});
```

**After** (nested update):
```javascript
this.setState(prevState => ({
  modalPositions: {
    ...prevState.modalPositions,
    video: { x: 100, y: 150 }
  }
}));
```

### Updating State - Factory Pattern

**Handler Factory Function** (eliminates duplication):
```javascript
class WholeApp extends Component {
  // Factory function creates handlers for each modal
  createPositionHandler = (modalName) => (position) => {
    this.setState(prevState => ({
      modalPositions: {
        ...prevState.modalPositions,
        [modalName]: position
      }
    }));
  };

  // Create handlers using factory
  updateVideoPosition = this.createPositionHandler('video');
  updateHelpPosition = this.createPositionHandler('help');
  updateSharePosition = this.createPositionHandler('share');

  // Generic update function for context
  updateModalPosition = (modalName, position) => {
    this.setState(prevState => ({
      modalPositions: {
        ...prevState.modalPositions,
        [modalName]: position
      }
    }));
  };
}
```

---

## URL Encoding/Decoding Contract

### Encoding (State → URL)

**urlEncoder.js must map nested structure to flat URL parameters**:

```javascript
// Input: state.modalPositions
{
  video: { x: 100, y: 150 },
  help: { x: 200, y: 250 },
  share: { x: null, y: null }
}

// Output: URL parameters
?videoModalX=100&videoModalY=150&helpModalX=200&helpModalY=250
// (null values omitted)
```

**Encoding Logic**:
```javascript
export function encodeSettingsToURL(state, baseURL) {
  const params = new URLSearchParams();

  // Video modal position
  if (state.modalPositions?.video?.x !== null) {
    params.set('videoModalX', Math.round(state.modalPositions.video.x).toString());
  }
  if (state.modalPositions?.video?.y !== null) {
    params.set('videoModalY', Math.round(state.modalPositions.video.y).toString());
  }

  // Help modal position
  if (state.modalPositions?.help?.x !== null) {
    params.set('helpModalX', Math.round(state.modalPositions.help.x).toString());
  }
  if (state.modalPositions?.help?.y !== null) {
    params.set('helpModalY', Math.round(state.modalPositions.help.y).toString());
  }

  // Share modal position
  if (state.modalPositions?.share?.x !== null) {
    params.set('shareModalX', Math.round(state.modalPositions.share.x).toString());
  }
  if (state.modalPositions?.share?.y !== null) {
    params.set('shareModalY', Math.round(state.modalPositions.share.y).toString());
  }

  // ... rest of encoding
}
```

### Decoding (URL → State)

**urlEncoder.js must populate nested structure from flat URL parameters**:

```javascript
// Input: URL parameters
?videoModalX=100&videoModalY=150&helpModalX=200

// Output: state.modalPositions
{
  video: { x: 100, y: 150 },
  help: { x: 200, y: null },  // Y missing → null
  share: { x: null, y: null }  // Not in URL → null
}
```

**Decoding Logic**:
```javascript
export function decodeSettingsFromURL(url) {
  const params = new URLSearchParams(url.search);

  const settings = {
    modalPositions: {
      video: {
        x: parseModalPosition(params.get('videoModalX')),
        y: parseModalPosition(params.get('videoModalY'))
      },
      help: {
        x: parseModalPosition(params.get('helpModalX')),
        y: parseModalPosition(params.get('helpModalY'))
      },
      share: {
        x: parseModalPosition(params.get('shareModalX')),
        y: parseModalPosition(params.get('shareModalY'))
      }
    }
  };

  return settings;
}

function parseModalPosition(value, min = 0, max = 10000) {
  if (value === null || value === undefined) return null;
  const pos = parseInt(value, 10);
  if (isNaN(pos)) return null;
  return Math.max(min, Math.min(max, pos)); // Clamp to bounds
}
```

---

## Migration Checklist

### Files to Update

- [x] `src/WholeApp.js` - State structure and handlers
- [x] `src/services/urlEncoder.js` - Encoding/decoding logic
- [x] `src/contexts/ModalPositionContext.js` - Context value derives from nested state
- [x] `src/components/menu/TopMenu.js` - Remove position prop forwarding
- [x] `src/components/menu/*Button.js` - Remove position props
- [x] `src/components/menu/Video*.js, Share.js, InfoOverlay.js` - Remove position props
- [x] `src/components/OverlayPlugins/Overlay.js` - Consume from context

### Before/After Comparison

| Aspect | Before (Flat) | After (Nested) |
|--------|---------------|----------------|
| **State fields** | 6 fields | 1 field with nested object |
| **State access** | `this.state.videoModalX` | `this.state.modalPositions.video.x` |
| **Update handlers** | 3 separate functions | 1 factory function |
| **URL format** | `videoModalX=100` | `videoModalX=100` (unchanged) |
| **Props drilling** | 5-layer chain | Direct context access |
| **Type safety** | None | Nested structure enforces shape |

---

## Validation Rules

### Position Values

- **x and y must be numbers or null**
  - Valid: `{ x: 100, y: 150 }`
  - Valid: `{ x: null, y: null }`
  - Invalid: `{ x: 'foo', y: undefined }`
  - Invalid: `{ x: NaN, y: Infinity }`

### Structure Completeness

- **modalPositions must always contain all three modals**
  - Valid: `{ video: {...}, help: {...}, share: {...} }`
  - Invalid: `{ video: {...} }` (missing help and share)
  - Invalid: `null` or `undefined`

### Range Constraints

- **Position values are clamped during URL encoding**
  - Input: `{ x: -100, y: 15000 }`
  - Encoded: `videoModalX=0&videoModalY=10000` (clamped to 0-10000)
  - Decoded: `{ x: 0, y: 10000 }`

---

## Test Coverage Requirements

### State Operations Tests

- ✅ Initialize state with correct nested structure
- ✅ Read nested position values
- ✅ Update single modal position
- ✅ Update multiple modal positions
- ✅ Factory function creates correct handlers
- ✅ Generic update function works for all modals

### URL Encoding Tests

- ✅ Nested state encodes to flat URL parameters
- ✅ Null values omitted from URL
- ✅ Non-null values rounded to integers
- ✅ Values clamped to 0-10000 range

### URL Decoding Tests

- ✅ Flat URL parameters decode to nested state
- ✅ Missing parameters default to null
- ✅ Invalid parameters default to null
- ✅ Out-of-range parameters clamped

### Backwards Compatibility Tests

- ✅ URLs created before refactoring still work
- ✅ URLs created after refactoring work identically
- ✅ No breaking changes to URL format

---

## Performance Considerations

### State Update Efficiency

**Nested updates require spread operator**:
```javascript
// Efficient - only creates new objects for changed parts
this.setState(prevState => ({
  modalPositions: {
    ...prevState.modalPositions,
    video: { x: 100, y: 150 }  // Only video object replaced
  }
}));
```

**Avoid**: Creating new objects for unchanged modals
**Do**: Spread existing modal objects to preserve references

### URL Encoding Efficiency

**Encoding unchanged** - still iterates all modals, but same as before (just different access pattern)

---

## Version History

- **1.0.0** (2025-12-03): Initial contract definition
  - Consolidated nested state structure
  - Factory pattern for handlers
  - URL encoding/decoding mappings
  - Migration checklist

---

## Related Contracts

- [context-api.md](./context-api.md) - Context derives from this state structure
- [test-structure.md](./test-structure.md) - Test coverage for state operations
