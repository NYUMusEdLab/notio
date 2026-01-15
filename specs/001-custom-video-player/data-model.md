# Data Model: Custom Video Player

**Feature**: 001-custom-video-player
**Date**: 2026-01-15

## Overview

This feature is UI-only with no persistent data storage. The "data model" consists of:
1. Component props (configuration from parent)
2. Component state (runtime behavior)
3. Event callbacks (parent communication)

---

## Component Props Interface

### CustomVideoPlayer Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `defaultVideoUrl` | `string` | Yes | - | The initial/default video URL from settings. Used for reset functionality. |
| `onClose` | `function` | Yes | - | Callback invoked when overlay is closed. Parent handles visibility. |
| `initialTab` | `string` | No | `'Player'` | Which tab to show initially. Options: `'Player'`, `'Enter_url'` |
| `onUrlChange` | `function` | No | `() => {}` | Callback invoked when video URL changes. Receives new URL as argument. |

### Props Flow Diagram

```text
Parent Component (e.g., App, VideoButton)
    │
    ├── defaultVideoUrl ────────────────────┐
    │   (from settings/config)              │
    │                                       ▼
    ├── onClose ──────────────────► CustomVideoPlayer
    │   (visibility handler)                │
    │                                       │
    └── onUrlChange ◄───────────────────────┘
        (optional notification)
```

---

## Component State

### Internal State Shape

```javascript
{
  currentUrl: string,      // Currently playing URL (may differ from default)
  activeTab: string,       // 'Player' | 'Enter_url'
  isPlaying: boolean,      // Video playback state
  error: string | null     // Error message if URL fails to load
}
```

### State Transitions

```text
┌─────────────────────────────────────────────────────────────┐
│                     INITIAL STATE                            │
│  currentUrl = defaultVideoUrl                               │
│  activeTab = initialTab                                     │
│  isPlaying = false                                          │
│  error = null                                               │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    USER ACTIONS                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Submit Custom URL]                                        │
│    → currentUrl = inputValue                                │
│    → activeTab = 'Player'                                   │
│    → error = null                                           │
│    → onUrlChange(inputValue)                                │
│                                                             │
│  [Click Reset]                                              │
│    → currentUrl = defaultVideoUrl                           │
│    → activeTab = 'Player'                                   │
│    → error = null                                           │
│    → onUrlChange(defaultVideoUrl)                           │
│                                                             │
│  [Video Ready]                                              │
│    → isPlaying = true                                       │
│                                                             │
│  [Video Error]                                              │
│    → error = "Unable to load video..."                      │
│    → (currentUrl unchanged - retain last working)           │
│                                                             │
│  [Tab Change]                                               │
│    → activeTab = selectedTab                                │
│                                                             │
│  [Close Overlay]                                            │
│    → onClose()                                              │
│    → (state preserved for next open)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Entities

### VideoURL

Represents a URL pointing to video content.

| Attribute | Type | Constraints |
|-----------|------|-------------|
| value | string | Must be non-empty, valid URL format |
| source | enum | `'default'` (from settings) or `'custom'` (user-entered) |

**Validation Rules**:
- Non-empty string
- ReactPlayer handles actual URL validation (supports YouTube, Vimeo, direct files)
- Invalid URLs result in ReactPlayer onError callback

### TabState

Represents the active UI section.

| Value | Description |
|-------|-------------|
| `'Player'` | Video playback view with controls |
| `'Enter_url'` | URL input form with reset button |

---

## Parent Integration

### How Parent Provides Default URL

The parent component (likely `WholeApp.js` or `VideoButton.js`) maintains the default URL in its state or configuration:

```javascript
// Parent component
const DEFAULT_VIDEO_URL = "https://youtu.be/example";  // From settings

<CustomVideoPlayer
  defaultVideoUrl={DEFAULT_VIDEO_URL}
  onClose={() => setShowPlayer(false)}
  onUrlChange={(url) => console.log('URL changed to:', url)}
/>
```

### State Preservation

- URL changes persist during session (component stays mounted while visible)
- When overlay closes and reopens, state is preserved if component stays mounted
- Page refresh resets to default URL (no localStorage persistence per spec)

---

## No API Contracts

This feature has no backend API interactions. All data is:
- Passed via props (default URL from parent)
- Managed in component state (current URL, tab state)
- External to the app (video content from YouTube/Vimeo/etc.)

The `/contracts/` directory is not needed for this feature.
