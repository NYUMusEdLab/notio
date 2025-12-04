# Phase 1: Data Model & Entity Design

**Date**: 2025-11-22
**Feature**: Improve Text Readability in Video Player Instructions

## Overview

This document defines the data entities required to support text size preferences in the video player. The model focuses on user preferences and their persistence across browser sessions and devices.

---

## Entity: VideoTextSizePreference

**Purpose**: Stores user's preferred text size for video player instruction text

**Storage Locations**:
- **Primary**: Browser localStorage (key: `videoTextSize`)
- **Secondary**: Firebase session document (path: `sessions/{sessionId}`)
- **Scope**: Per-user, persists across browser sessions and devices

### Properties

| Property | Type | Required | Default | Validation | Description |
|----------|------|----------|---------|-----------|-------------|
| size | enum: 'small' \| 'medium' \| 'large' | Yes | 'medium' | One of valid sizes | User's selected text size level |
| userId | string | No | null | Non-empty string | Firebase user ID (if authenticated); null for anonymous users |
| sessionId | string | No | null | UUID format | Current session ID for analytics |
| appliedAt | ISO 8601 timestamp | No | current | ISO 8601 string | When preference was last applied |
| version | number | No | 1 | >= 1 | Schema version for migration support |

### Relationships

```
User (Firebase Auth)
  ↓ (optional, 1:1)
VideoTextSizePreference
  ↓ (references)
Session (Firebase)
```

**Notes**:
- Anonymous users get localStorage-only storage (sessionStorage fallback for private browsing)
- Authenticated users sync preference to Firebase
- Single preference per user; no historical tracking required

---

## Data Persistence Schema

### localStorage

**Key**: `videoTextSize`
**Value Type**: string
**Example**: `"large"`

```javascript
// Reading
const size = localStorage.getItem('videoTextSize') || 'medium';

// Writing
localStorage.setItem('videoTextSize', 'large');

// Removing (reset to default)
localStorage.removeItem('videoTextSize');
```

**Behavior**:
- Persists across browser restarts
- Not shared across different domains or browsers
- ~5-10MB quota per domain (size preference is negligible)

### Firebase Session Document

**Path**: `sessions/{sessionId}`
**Collection**: `sessions`
**Document Structure**:

```javascript
{
  sessionId: "session-uuid-here",
  userId: "user-id-or-null",
  videoTextSize: "large",
  theme: "light", // Existing property
  notation: "treble", // Existing property
  scale: "C major", // Existing property
  videoUrl: "https://...", // Existing property
  activeVideoTab: "Player", // Existing property
  videoActive: true, // Existing property
  createdAt: Timestamp,
  updatedAt: Timestamp,
  expiresAt: Timestamp // TTL for cleanup
}
```

**Behavior**:
- Syncs when user makes preference change
- Overwrites previous value (no versioning)
- Used for cross-device preference sync
- Can be queried for analytics/user behavior

---

## State Management Integration

### React Component State

The preference will be stored in WholeApp component state and passed to video player via props:

```javascript
// In WholeApp.js
state = {
  videoTextSize: 'medium', // Loaded from localStorage on mount
  // ... other state
}

// Passed to VideoTutorial component
<VideoTutorial
  textSize={this.state.videoTextSize}
  onTextSizeChange={this.handleTextSizeChange}
  // ... other props
/>
```

### Component Props Interface

**VideoTutorial Component**:
```javascript
PropTypes = {
  textSize: PropTypes.oneOf(['small', 'medium', 'large']),
  onTextSizeChange: PropTypes.func,
  // ... existing props
}
```

**Overlay Component** (wraps VideoTutorial):
```javascript
PropTypes = {
  textSize: PropTypes.oneOf(['small', 'medium', 'large']),
  onTextSizeChange: PropTypes.func,
  // ... existing props
}
```

---

## CSS Classes & Scaling

### CSS Class Structure

Applied to Overlay container or VideoTutorial root element:

```css
/* Applied class depends on size */
.overlay.video-text--small { /* 0.85x scaling */ }
.overlay.video-text--medium { /* 1.0x scaling (default) */ }
.overlay.video-text--large { /* 1.15x scaling */ }
```

### CSS Custom Properties

```scss
// Base multiplier variable
--video-text-scale: 1.0; // 'medium' default

// Applied sizes use the multiplier
.video__title {
  font-size: calc(2rem * var(--video-text-scale));
}

.video-url__label {
  font-size: calc(1rem * var(--video-text-scale));
}

.overlay__tab-title {
  font-size: calc(1.2rem * var(--video-text-scale));
}
```

### Text Size Mapping

| Size Level | Multiplier | Base Font Size | Mapped Sizes (rem) |
|------------|-----------|------------------|-------------------|
| small | 0.85 | 14.25px | 0.85rem, 1.4rem, 1.7rem, 2rem → 12px, 19px, 24px, 27px |
| medium | 1.0 | 16.8px | 1rem, 1.5rem, 2rem, 2.25rem → 14px, 21px, 28px, 31px |
| large | 1.15 | 19.32px | 1.15rem, 1.7rem, 2.3rem, 2.6rem → 16px, 24px, 32px, 36px |

**Note**: Actual pixel sizes depend on browser base font-size (typically 16px). The multiplier approach ensures proportional scaling.

---

## Validation Rules

### Size Value Validation

```javascript
const VALID_SIZES = ['small', 'medium', 'large'];

function isValidSize(size) {
  return VALID_SIZES.includes(size);
}

function normalizeSize(size) {
  if (!isValidSize(size)) {
    return 'medium'; // Default fallback
  }
  return size;
}
```

### Persistence Validation

```javascript
function saveTextSize(size) {
  // Validate before saving
  const normalizedSize = normalizeSize(size);

  // Save to localStorage
  try {
    localStorage.setItem('videoTextSize', normalizedSize);
  } catch (e) {
    // Private browsing mode fallback
    sessionStorage.setItem('videoTextSize', normalizedSize);
  }

  // Sync to Firebase
  try {
    db.collection("sessions")
      .doc(this.state.sessionId)
      .update({ videoTextSize: normalizedSize });
  } catch (e) {
    // Silent fail - Firebase sync is non-blocking
    console.warn('Failed to sync text size to Firebase', e);
  }
}
```

---

## Edge Cases & Recovery

### Case 1: Invalid Value in localStorage

**Scenario**: Browser corrupted or user manually edited localStorage
**Handling**:
```javascript
const savedSize = localStorage.getItem('videoTextSize');
const validSize = normalizeSize(savedSize);
// Will use 'medium' if invalid
```

### Case 2: localStorage Unavailable

**Scenario**: Private browsing mode or quota exceeded
**Handling**:
```javascript
function getTextSize() {
  try {
    return localStorage.getItem('videoTextSize') || 'medium';
  } catch (e) {
    // Fallback to sessionStorage
    try {
      return sessionStorage.getItem('videoTextSize') || 'medium';
    } catch (e) {
      return 'medium'; // Ultimate fallback
    }
  }
}
```

### Case 3: Firebase Sync Fails

**Scenario**: Network error or Firebase quota exceeded
**Handling**:
- localStorage value is preserved
- User still has working preference locally
- Sync retried on next state change
- No blocking error shown to user

### Case 4: User Clears Browser Data

**Scenario**: User clears localStorage/cookies
**Handling**:
- Default to 'medium' size
- User must re-select preference
- Firebase still has the value (if synced previously)
- Not a critical failure (acceptable UX)

---

## Data Lifecycle

### Initial Load

```
1. Component mounts
2. Read localStorage.getItem('videoTextSize')
3. If undefined, use 'medium' default
4. Apply CSS class to Overlay
5. If user authenticated, sync from Firebase (overwrites localStorage if newer)
6. Ready for user interaction
```

### User Changes Preference

```
1. User clicks text size button
2. Call onTextSizeChange(newSize)
3. Validate size value
4. Update React state
5. Apply CSS class
6. Save to localStorage (immediate)
7. Async Firebase sync (non-blocking)
8. Preference persists on next page load
```

### Page Reload

```
1. Component mounts
2. Read localStorage again
3. Apply saved preference
4. User sees their previous size choice
```

### Cross-Device Sync

```
1. User changes size on Device A
2. Preference saved to localStorage (Device A)
3. Firebase synced (non-blocking)
4. User opens app on Device B
5. Read localStorage (Device B) - might be 'medium' (not synced)
6. If authenticated, fetch from Firebase
7. Firebase value overwrites localStorage
8. User sees consistent preference across devices
```

---

## Migration & Versioning

### Future Schema Versions

```javascript
// v1 (current): Simple size level
{ videoTextSize: 'medium' }

// v2 (future): Continuous scaling
{ videoTextSize: 1.0, version: 2 }

// v3 (future): Per-element customization
{ videoTextSize: { title: 1.2, body: 1.0 }, version: 3 }
```

### Migration Strategy

```javascript
function normalizeSize(value) {
  // Handle both v1 and future formats
  if (typeof value === 'string') {
    // v1: 'small', 'medium', 'large'
    return normalizeStringSize(value);
  }
  if (typeof value === 'number') {
    // v2+: Numeric multiplier
    return normalizeNumericSize(value);
  }
  return 'medium'; // Fallback
}
```

---

## Summary

**Entity**: VideoTextSizePreference
- **Storage**: localStorage + Firebase sessions
- **Type**: User preference (non-sensitive)
- **Scope**: Global video player text scaling
- **Validation**: 3 valid levels (small/medium/large)
- **Persistence**: Cross-session, cross-device (for authenticated users)
- **Fallback**: 'medium' for any invalid state

**Status**: ✅ COMPLETE - Ready for Phase 1 design implementation
