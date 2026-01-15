# Component Contracts

**Date**: 2025-11-22
**Feature**: Improve Text Readability in Video Player Instructions

## TextSizeControl Component

**Location**: `src/components/menu/TextSizeControl.js`
**Purpose**: Displays text size adjustment buttons (small/medium/large) with reset functionality
**Parent**: Overlay component header

### Props Interface

```javascript
{
  currentSize: PropTypes.oneOf(['small', 'medium', 'large']),
  onSizeChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}
```

### Props Detail

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentSize` | enum | No | 'medium' | Currently selected text size |
| `onSizeChange` | function(size: string) | Yes | - | Callback fired when user clicks a size button |
| `onReset` | function() | Yes | - | Callback fired when user clicks reset button |

### Callback Signatures

```javascript
onSizeChange(size)
// Called when user clicks a size button
// size: 'small' | 'medium' | 'large'
// Receiver: WholeApp.handleTextSizeChange()

onReset()
// Called when user clicks reset button
// No parameters
// Receiver: WholeApp.handleTextSizeChange('medium')
```

### Rendering Requirements

- Display 3 buttons (A, A+, A++ or equivalent labels)
- Show selected button with visual highlighting
- Include aria-label on each button
- Include role="group" on container
- Include reset button with aria-label
- Keep in overlay header (compact, unobtrusive)

### Accessibility Requirements

- All buttons must have `aria-label` attribute
- Container must have `role="group"` and `aria-label="Text size"`
- Selected button must have `aria-pressed={true}`
- Buttons must be keyboard accessible (Tab, Enter/Space)
- Focus indicator must be visible

### Example Usage

```javascript
<TextSizeControl
  currentSize={this.state.videoTextSize}
  onSizeChange={this.handleTextSizeChange}
  onReset={() => this.handleTextSizeChange('medium')}
/>
```

---

## Overlay Component

**Location**: `src/components/OverlayPlugins/Overlay.js`
**Purpose**: Draggable container for video player and controls
**Changes**: Add text size props and CSS class binding

### Additional Props (New)

```javascript
{
  textSize: PropTypes.oneOf(['small', 'medium', 'large']),
  onTextSizeChange: PropTypes.func,
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `textSize` | enum | No | 'medium' | Current text size level from parent |
| `onTextSizeChange` | function(size) | No | - | Callback to propagate size changes to parent |

### Rendering Changes

**Before**:
```jsx
<div className="overlay">
  {/* content */}
</div>
```

**After**:
```jsx
<div className={`overlay video-text--${this.props.textSize || 'medium'}`}>
  {/* header with TextSizeControl */}
  {/* content */}
</div>
```

### CSS Class Binding

Must apply class: `video-text--{small|medium|large}`
- `video-text--small` when `textSize='small'`
- `video-text--medium` when `textSize='medium'` (or default)
- `video-text--large` when `textSize='large'`

### Integration with Header

The overlay header should include:
```jsx
<div className="overlay__header">
  {/* Existing close button */}
  {/* Existing minimize button */}

  {/* NEW: Text size control */}
  {this.props.onTextSizeChange && (
    <TextSizeControl
      currentSize={this.props.textSize}
      onSizeChange={this.props.onTextSizeChange}
      onReset={() => this.props.onTextSizeChange('medium')}
    />
  )}
</div>
```

---

## VideoTutorial Component

**Location**: `src/components/menu/VideoTutorial.js`
**Purpose**: Video player with tabs (Player, Enter_url, Tutorials)
**Changes**: Pass through text size props

### Additional Props (New)

```javascript
{
  textSize: PropTypes.oneOf(['small', 'medium', 'large']),
  onTextSizeChange: PropTypes.func,
}
```

### Prop Forwarding

These props are received from parent (Overlay) and forwarded to Overlay wrapper:
```jsx
<Overlay
  textSize={this.props.textSize}
  onTextSizeChange={this.props.onTextSizeChange}
>
  {/* VideoTutorial content */}
</Overlay>
```

**Note**: Props are handled by parent Overlay component; VideoTutorial doesn't use them directly.

---

## WholeApp Component

**Location**: `src/WholeApp.js`
**Purpose**: Root state container
**Changes**: Add text size state and handlers

### State Properties (New)

```javascript
state = {
  videoTextSize: 'medium', // 'small' | 'medium' | 'large'
  // ... existing state
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `videoTextSize` | enum | 'medium' | User's selected text size for video player |

### Methods (New)

#### `loadTextSizePreference()`
```javascript
loadTextSizePreference() -> string
// Reads from localStorage
// Returns 'small' | 'medium' | 'large'
// Falls back to 'medium' if not found or invalid
// Called in componentDidMount()
```

#### `saveTextSizePreference(size)`
```javascript
saveTextSizePreference(size: string) -> Promise
// Saves to localStorage synchronously
// Syncs to Firebase asynchronously (non-blocking)
// Handles errors gracefully
// Returns Promise for testing
```

#### `handleTextSizeChange(size)`
```javascript
handleTextSizeChange(size: string) -> void
// Validates size value
// Updates state: setState({ videoTextSize: size })
// Calls saveTextSizePreference(size)
// Triggers re-render of video player with new CSS class
```

### Integration with VideoButton

When opening video player:
```jsx
<VideoTutorial
  // ... existing props
  textSize={this.state.videoTextSize}
  onTextSizeChange={this.handleTextSizeChange}
/>
```

### Lifecycle

```javascript
componentDidMount() {
  const savedSize = this.loadTextSizePreference();
  this.setState({ videoTextSize: savedSize });
  // ... other initialization
}

componentWillUnmount() {
  // No cleanup needed; localStorage is global
}
```

---

## StorageService (Utility)

**Location**: `src/services/textSizeStorage.js` (suggested)
**Purpose**: Centralized storage operations for text size preference

### API

```javascript
// Read preference from storage (localStorage > sessionStorage > default)
getTextSize() -> string

// Write preference to storage
setTextSize(size: string) -> void

// Check if storage is available
isStorageAvailable() -> boolean

// Clear preference (reset to default on next load)
clearTextSize() -> void
```

### Implementation

```javascript
const STORAGE_KEY = 'videoTextSize';
const DEFAULT_SIZE = 'medium';
const VALID_SIZES = ['small', 'medium', 'large'];

export function getTextSize() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return VALID_SIZES.includes(saved) ? saved : DEFAULT_SIZE;
  } catch (e) {
    // Private browsing mode
    try {
      return sessionStorage.getItem(STORAGE_KEY) || DEFAULT_SIZE;
    } catch (e2) {
      return DEFAULT_SIZE;
    }
  }
}

export function setTextSize(size) {
  const validSize = VALID_SIZES.includes(size) ? size : DEFAULT_SIZE;
  try {
    localStorage.setItem(STORAGE_KEY, validSize);
  } catch (e) {
    try {
      sessionStorage.setItem(STORAGE_KEY, validSize);
    } catch (e2) {
      console.warn('Could not save text size preference', e2);
    }
  }
}

export function isStorageAvailable() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export function clearTextSize() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore
  }
}
```

### Usage in WholeApp

```javascript
import { getTextSize, setTextSize } from '../services/textSizeStorage';

class WholeApp extends React.Component {
  loadTextSizePreference() {
    return getTextSize();
  }

  saveTextSizePreference(size) {
    setTextSize(size);
    // Also sync to Firebase...
  }
}
```

---

## Firebase Integration

**Location**: Update in `src/WholeApp.js`
**Purpose**: Sync text size preference to Firebase for cross-device persistence

### Firestore Collection: `sessions`

```javascript
// Document path: sessions/{sessionId}
{
  sessionId: "uuid",
  userId: "firebase-user-id",
  videoTextSize: "large",
  // ... other session properties
  updatedAt: Timestamp.now(),
}
```

### Save Operation

```javascript
async syncTextSizeToFirebase(size) {
  const { sessionId, user } = this.state;
  if (!sessionId) return; // No session = anonymous user

  try {
    await db.collection("sessions")
      .doc(sessionId)
      .update({
        videoTextSize: size,
        updatedAt: serverTimestamp()
      });
  } catch (error) {
    // Non-blocking failure - localStorage backup is sufficient
    console.warn('Failed to sync text size to Firebase', error);
  }
}
```

### Load Operation (Future Enhancement)

```javascript
async loadTextSizeFromFirebase() {
  const { sessionId } = this.state;
  if (!sessionId) return null;

  try {
    const doc = await db.collection("sessions")
      .doc(sessionId)
      .get();

    return doc.data()?.videoTextSize || null;
  } catch (error) {
    console.warn('Failed to load text size from Firebase', error);
    return null;
  }
}

// In componentDidMount, after localStorage load:
const savedSize = this.loadTextSizePreference();
// Later: check Firebase for more recent preference if user authenticated
```

---

## Summary

| Component | Responsibility | New Props | New Methods |
|-----------|-----------------|-----------|-------------|
| TextSizeControl | UI buttons for size selection | `currentSize`, `onSizeChange`, `onReset` | - |
| Overlay | Container + CSS class binding | `textSize`, `onTextSizeChange` | - |
| VideoTutorial | Props pass-through | `textSize`, `onTextSizeChange` | - |
| WholeApp | State mgmt + storage | `state.videoTextSize` | `loadTextSizePreference()`, `saveTextSizePreference()`, `handleTextSizeChange()` |
| StorageService | localStorage/sessionStorage | - | `getTextSize()`, `setTextSize()`, `isStorageAvailable()`, `clearTextSize()` |

**Status**: ✅ COMPLETE - Contract specifications defined and ready for implementation
