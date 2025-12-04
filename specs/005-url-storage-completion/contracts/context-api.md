# Contract: ModalPositionContext API

**Feature**: 005-url-storage-completion
**Version**: 1.0.0
**Date**: 2025-12-03

## Purpose

Defines the interface contract for `ModalPositionContext`, which manages modal position state across the application without props drilling.

## Context Interface

### Type Definition

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

interface ModalPositionContextValue {
  positions: ModalPositions;
  updatePosition: (modalName: keyof ModalPositions, position: ModalPosition) => void;
}
```

### JavaScript Implementation

```javascript
// src/contexts/ModalPositionContext.js
import { createContext } from 'react';

export const ModalPositionContext = createContext({
  positions: {
    video: { x: null, y: null },
    help: { x: null, y: null },
    share: { x: null, y: null }
  },
  updatePosition: (modalName, position) => {
    console.warn(`ModalPositionContext.updatePosition called without provider. modalName: ${modalName}, position:`, position);
  }
});
```

---

## Provider Contract

### Props

**None** - Provider value is derived from parent component state (WholeApp).

### Value Shape

```javascript
{
  positions: {
    video: { x: number | null, y: number | null },
    help: { x: number | null, y: number | null },
    share: { x: number | null, y: null }
  },
  updatePosition: Function
}
```

### Provider Implementation Example

```javascript
// In WholeApp.js
class WholeApp extends Component {
  state = {
    modalPositions: {
      video: { x: null, y: null },
      help: { x: null, y: null },
      share: { x: null, y: null }
    }
  };

  updateModalPosition = (modalName, position) => {
    this.setState(prevState => ({
      modalPositions: {
        ...prevState.modalPositions,
        [modalName]: position
      }
    }));
  };

  render() {
    const modalContextValue = {
      positions: this.state.modalPositions,
      updatePosition: this.updateModalPosition
    };

    return (
      <ModalPositionContext.Provider value={modalContextValue}>
        {/* app content */}
      </ModalPositionContext.Provider>
    );
  }
}
```

---

## Consumer Contract

### useContext Hook (Functional Components)

```javascript
import { useContext } from 'react';
import { ModalPositionContext } from '../../contexts/ModalPositionContext';

function Overlay({ modalName }) {
  const { positions, updatePosition } = useContext(ModalPositionContext);

  const position = positions[modalName] || { x: 0, y: 0 };

  const handleDragStop = (e, data) => {
    updatePosition(modalName, { x: data.x, y: data.y });
  };

  // Use position and handleDragStop
}
```

### Context.Consumer (Class Components)

```javascript
import { ModalPositionContext } from '../../contexts/ModalPositionContext';

class SomeClassComponent extends Component {
  render() {
    return (
      <ModalPositionContext.Consumer>
        {({ positions, updatePosition }) => (
          <div>
            Video position: {positions.video.x}, {positions.video.y}
          </div>
        )}
      </ModalPositionContext.Consumer>
    );
  }
}
```

---

## API Methods

### `updatePosition(modalName, position)`

Updates the position for a specific modal.

**Parameters**:
- `modalName` (string): One of `'video'`, `'help'`, or `'share'`
- `position` (object): `{ x: number, y: number }`

**Returns**: `void`

**Side Effects**:
- Updates modal position in provider state
- Triggers re-render of consumers
- Triggers debounced URL update (via WholeApp.componentDidUpdate)

**Example**:
```javascript
updatePosition('video', { x: 100, y: 150 });
```

**Error Handling**:
- Invalid modalName: Logs warning, no state update
- Invalid position: Logs warning, no state update
- Called without provider: Logs warning (from default context value)

---

## Invariants

1. **positions object always contains all three modals**: `video`, `help`, `share`
2. **Position values are always `{ x, y }` objects**: Never undefined or other shapes
3. **x and y are either numbers or null**: Never NaN, Infinity, or other types
4. **updatePosition is always a function**: Never null or undefined
5. **Context value is stable during render**: Only changes when state updates

---

## Testing Contract

### Mock Context Provider

```javascript
// tests/helpers/context-test-utils.js
import { ModalPositionContext } from '../../src/contexts/ModalPositionContext';

export function renderWithModalContext(component, contextValue = {}) {
  const defaultValue = {
    positions: {
      video: { x: null, y: null },
      help: { x: null, y: null },
      share: { x: null, y: null }
    },
    updatePosition: jest.fn(),
    ...contextValue
  };

  return render(
    <ModalPositionContext.Provider value={defaultValue}>
      {component}
    </ModalPositionContext.Provider>
  );
}
```

### Test Coverage Requirements

- ✅ Provider renders without errors
- ✅ Consumer can read positions from context
- ✅ Consumer can call updatePosition
- ✅ updatePosition triggers state update in provider
- ✅ Multiple consumers receive same context value
- ✅ Context updates trigger re-renders of consumers only
- ✅ Default context value logs warning when used

---

## Backwards Compatibility

### During Migration

The Context API will coexist with existing props-based approach temporarily:

```javascript
// Overlay accepts both props and context during migration
function Overlay({ modalName, initialPosition, onPositionChange }) {
  const context = useContext(ModalPositionContext);

  // Prefer context if available, fallback to props
  const position = context?.positions?.[modalName] ?? initialPosition ?? { x: 0, y: 0 };
  const updateFn = context?.updatePosition ?? onPositionChange ?? (() => {});

  // ...
}
```

### After Migration Complete

Props removed, context only:

```javascript
function Overlay({ modalName }) {
  const { positions, updatePosition } = useContext(ModalPositionContext);
  const position = positions[modalName] || { x: 0, y: 0 };
  // ...
}
```

---

## Performance Considerations

### Context Value Stability

**Problem**: Creating new context value object on every render causes unnecessary re-renders of consumers.

**Solution** (apply only if profiling shows issue):
```javascript
const modalContextValue = useMemo(() => ({
  positions: this.state.modalPositions,
  updatePosition: this.updateModalPosition
}), [this.state.modalPositions]);
```

### Selective Re-rendering

**Problem**: All consumers re-render when any part of context changes.

**Solution** (apply only if needed):
- Use React.memo on consumer components
- Split context into separate read/write contexts if profiling shows benefit

**Default Approach**: No optimization initially. Measure first, optimize only if necessary.

---

## Version History

- **1.0.0** (2025-12-03): Initial contract definition
  - Context interface with positions and updatePosition
  - Provider/consumer patterns
  - Testing utilities

---

## Related Contracts

- [state-structure.md](./state-structure.md) - Consolidated state shape in WholeApp
- [test-structure.md](./test-structure.md) - Test organization and coverage requirements
