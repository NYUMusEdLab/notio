# Data Model: URL Settings Storage - Testing and Code Quality

**Feature**: 005-url-storage-completion
**Date**: 2025-12-03

## Overview

This document defines the data structures for modal positioning state management and Context API architecture. No backend data models - all state is client-side in React components and URL parameters.

## State Structures

### 1. Consolidated Modal Position State (WholeApp.js)

**Current Structure** (to be refactored):
```javascript
{
  videoModalX: number | null,
  videoModalY: number | null,
  helpModalX: number | null,
  helpModalY: number | null,
  shareModalX: number | null,
  shareModalY: number | null
}
```

**New Structure** (consolidated):
```javascript
{
  modalPositions: {
    video: { x: number | null, y: number | null },
    help: { x: number | null, y: number | null },
    share: { x: number | null, y: number | null }
  }
}
```

**Validation Rules**:
- `x` and `y` must be numbers or null
- `x` and `y` are clamped to 0-10000 range when encoding to URL
- null values indicate default position (0, 0)

**State Transitions**:
1. **Initial**: All positions are null (default)
2. **Modal Opened**: Position remains null until first drag
3. **Drag Event**: Position updates to `{ x, y }` coordinates
4. **URL Loaded**: Positions populated from URL parameters, or null if not present
5. **Modal Closed**: Position preserved in state (for URL encoding)

---

### 2. ModalPositionContext Value Shape

```typescript
interface ModalPositionContextValue {
  positions: {
    [modalName: string]: {
      x: number | null;
      y: number | null;
    };
  };
  updatePosition: (modalName: string, position: { x: number, y: number }) => void;
}
```

**Default Value** (for context creation):
```javascript
{
  positions: {
    video: { x: null, y: null },
    help: { x: null, y: null },
    share: { x: null, y: null }
  },
  updatePosition: () => {
    console.warn('ModalPositionContext.updatePosition called without provider');
  }
}
```

**Validation Rules**:
- `positions` object must contain keys for all modals (video, help, share)
- Each position must be an object with `x` and `y` properties
- `updatePosition` must be a function taking modalName and position

**Usage Pattern**:
```javascript
// In WholeApp (Provider)
const contextValue = {
  positions: this.state.modalPositions,
  updatePosition: this.updateModalPosition
};

// In Overlay (Consumer)
const { positions, updatePosition } = useContext(ModalPositionContext);
const position = positions[modalName] || { x: 0, y: 0 };
```

---

### 3. URL Parameter Format (existing, unchanged)

Modal positions are encoded as individual query parameters:

```
?videoModalX=100&videoModalY=150&helpModalX=200&helpModalY=250
```

**Parameter Names**:
- `videoModalX`, `videoModalY` - Video modal position
- `helpModalX`, `helpModalY` - Help modal position
- `shareModalX`, `shareModalY` - Share modal position

**Encoding Rules** (from feature 004):
- Only encode if value is not null
- Values are rounded to integers
- Values are clamped to 0-10000 range
- Parameter order is not guaranteed (URLSearchParams)

**Decoding Rules**:
- Missing parameters default to null
- Invalid values (non-numeric, negative, >10000) are clamped or defaulted to null
- Duplicate parameters use last occurrence

---

### 4. Test Data Structures

**Mock Context Value** (for tests):
```javascript
{
  positions: {
    video: { x: 100, y: 150 },
    help: { x: 200, y: 250 },
    share: { x: 300, y: 350 }
  },
  updatePosition: jest.fn()
}
```

**Test Position Fixtures**:
```javascript
const TEST_POSITIONS = {
  default: { x: 0, y: 0 },
  topLeft: { x: 0, y: 0 },
  centered: { x: 500, y: 300 },
  bottomRight: { x: 1000, y: 800 },
  outOfBounds: { x: -100, y: 15000 }, // Should be clamped
  invalid: { x: 'foo', y: 'bar' } // Should default to null
};
```

---

## State Management Flow

### User Drags Modal

```
1. User drags modal handle
   ↓
2. react-draggable fires onStop event with position { x, y }
   ↓
3. Overlay.handleDragStop calls context.updatePosition(modalName, position)
   ↓
4. Context provider (WholeApp) calls this.updateModalPosition(modalName, position)
   ↓
5. WholeApp.setState updates modalPositions[modalName]
   ↓
6. componentDidUpdate detects modalPositions change
   ↓
7. Debounced URL update (500ms) triggers
   ↓
8. urlEncoder.encodeSettingsToURL serializes modalPositions to URL params
   ↓
9. history.replaceState updates browser URL
```

### User Opens URL with Positions

```
1. User opens URL with position parameters (e.g., ?videoModalX=100&videoModalY=150)
   ↓
2. WholeApp.componentDidMount calls loadSettingsFromURL()
   ↓
3. urlEncoder.decodeSettingsFromURL parses URL parameters
   ↓
4. Decoded positions populate WholeApp.state.modalPositions
   ↓
5. Context provider value updates (derived from state)
   ↓
6. Overlay components consume updated positions from context
   ↓
7. react-draggable renders modals at specified positions
```

---

## Data Relationships

```
WholeApp.state.modalPositions (source of truth)
         ↓ (derives)
ModalPositionContext.value.positions (readonly view)
         ↓ (consumed by)
Overlay components (display positions)

WholeApp.updateModalPosition (state updater)
         ↓ (exposed as)
ModalPositionContext.value.updatePosition (action)
         ↓ (called by)
Overlay.handleDragStop (event handler)
```

---

## Migration Notes

**Before Refactoring** (6 flat state fields):
- State access: `this.state.videoModalX`, `this.state.videoModalY`
- State update: `this.setState({ videoModalX: 100, videoModalY: 150 })`
- URL encoding: `urlEncoder` accesses flat fields directly

**After Refactoring** (nested object):
- State access: `this.state.modalPositions.video.x`, `this.state.modalPositions.video.y`
- State update: `this.setState({ modalPositions: { ...prevState.modalPositions, video: { x: 100, y: 150 } } })`
- URL encoding: `urlEncoder` accesses nested structure

**Backwards Compatibility**:
- URL parameter format unchanged (still `videoModalX=100` not `modalPositions[video][x]=100`)
- Existing shared URLs continue to work
- Only internal state structure changes

---

## Summary

- **Modal Positions**: Consolidated from 6 flat fields to nested object in `WholeApp.state.modalPositions`
- **Context Shape**: `{ positions, updatePosition }` provides readonly positions and update function
- **URL Format**: Unchanged - individual query parameters for each modal position coordinate
- **Data Flow**: User action → Context update → State update → URL encoding → Browser history
- **Test Data**: Mock context values, position fixtures, and test utilities for comprehensive coverage
