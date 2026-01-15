# Quickstart: Custom Video Player

**Feature**: 001-custom-video-player
**Date**: 2026-01-15

## Prerequisites

- Node.js (version in `.nvmrc`)
- Yarn installed
- Repository cloned and on branch `001-custom-video-player`

## Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn start
```

## Validation Checklist

Use this checklist to verify the feature works correctly after implementation.

### 1. Default URL Display (User Story 1)

- [ ] Open the video player (click video button in menu)
- [ ] Verify: Default video content loads automatically
- [ ] Verify: Playback controls are visible and functional (play, pause, seek, volume)
- [ ] Verify: Player displays in overlay/modal above main content

### 2. Custom URL Entry (User Story 2)

- [ ] Navigate to "Enter URL" tab
- [ ] Verify: Text input field is visible
- [ ] Type a custom URL (e.g., `https://youtu.be/dQw4w9WgXcQ`)
- [ ] Verify: Text appears in input field
- [ ] Click "Enter" or press Enter key
- [ ] Verify: Player switches to Player tab
- [ ] Verify: Custom video loads and plays
- [ ] Verify: "Currently watching" shows the custom URL

**Paste Test**:
- [ ] Copy a URL to clipboard
- [ ] Focus the URL input field
- [ ] Paste (Ctrl+V / Cmd+V)
- [ ] Verify: URL appears in input field

### 3. Reset Functionality (User Story 3)

- [ ] While custom URL is playing, go to "Enter URL" tab
- [ ] Click "Reset" button
- [ ] Verify: Player reverts to default video
- [ ] Verify: "Currently watching" shows default URL
- [ ] Click "Reset" again while default is playing
- [ ] Verify: Default continues playing (no change/error)

### 4. Overlay Behavior (User Story 4)

- [ ] Verify: Overlay appears above main content
- [ ] Drag the overlay header/grab bar
- [ ] Verify: Overlay moves to new position
- [ ] Click minimize button
- [ ] Verify: Overlay minimizes but remains accessible
- [ ] Press Escape key
- [ ] Verify: Overlay closes
- [ ] Reopen player, close via X button
- [ ] Verify: Overlay closes, focus returns to trigger button

### 5. Keyboard Accessibility

- [ ] Tab to video player trigger button
- [ ] Press Enter or Space
- [ ] Verify: Player opens
- [ ] Tab through Player tab controls
- [ ] Tab to "Enter URL" tab, press Enter
- [ ] Verify: Tab switches
- [ ] Tab to input field, enter URL, press Enter
- [ ] Verify: URL submits
- [ ] Tab to Reset button, press Enter/Space
- [ ] Verify: Reset works
- [ ] Press Escape
- [ ] Verify: Player closes, focus returns to trigger

### 6. Error Handling

- [ ] Enter an invalid URL (e.g., `not-a-url`)
- [ ] Submit the URL
- [ ] Verify: Error message displays
- [ ] Verify: Previous working URL is retained

## Running Tests

```bash
# Run all tests (watch mode)
yarn test

# Run with coverage report
yarn test --coverage

# Run accessibility-focused tests
yarn test:a11y

# Run E2E tests
yarn test:e2e

# Run E2E in specific browser
yarn test:e2e:chromium
yarn test:e2e:firefox
yarn test:e2e:webkit
```

## Expected Test Results

After implementation, tests should show:

| Test Type | Location | Expected Count |
|-----------|----------|----------------|
| Integration | `__integration__/CustomVideoPlayer.integration.test.js` | ~8-10 tests |
| Unit | `__test__/CustomVideoPlayer.unit.test.js` | ~3-5 tests |
| E2E | `tests/e2e/custom-video-player.spec.js` | ~4-6 tests |

Coverage target: 100% for new code

## Troubleshooting

### Video doesn't load
- Check browser console for CORS errors
- Verify URL is supported by ReactPlayer (YouTube, Vimeo, direct files)
- Check network connectivity

### Overlay doesn't appear
- Verify `#plugin_root` element exists in `index.html`
- Check browser console for React portal errors

### Keyboard navigation broken
- Verify `tabIndex={0}` on interactive elements
- Check `role="button"` and `aria-label` attributes
- Run `yarn test:a11y` for accessibility violations

### Tests failing
- Run `yarn test --verbose` for detailed output
- Check that mocks are properly configured in `__mocks__/`
- Verify ReactPlayer mock exists for unit tests
