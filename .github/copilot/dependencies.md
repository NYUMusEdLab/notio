# Dependencies

## Core

| Dependency | Version | Purpose | Notes |
| --- | --- | --- | --- |
| react | ^18.2.0 | Primary UI framework | App is still organized around a large class-based root component. |
| react-dom | ^18.2.0 | DOM renderer | Used with `createRoot` in the SPA entry point. |
| react-router-dom | ^6.3.0 | Client-side routing | Handles `/` and `/shared/:sessionId` flows. |
| react-scripts | 5.0.1 | Build and test toolchain | CRA stack with embedded ESLint config and Jest integration. |
| firebase | ^10.9.0 | Firestore session persistence | Client SDK only; session sharing depends on it. |
| tone | ^14.7.77 | Audio synthesis support | Used via `SoundMaker` adapters for playback. |
| @tonejs/piano | ^0.2.1 | Sampled piano playback | Tone.js-backed piano instrument. |
| soundfont-player | ^0.12.0 | Alternate audio backend | Present behind the adapter layer. |
| vexflow | ^4.0.3 | Music notation rendering | Used for staff rendering surfaces. |
| react-bootstrap | ^2.5.0 | Menu and UI components | Used in the top menu and related controls. |
| react-player | ^2.10.1 | Embedded video playback | Powers the custom video overlay. |
| react-draggable | ^4.4.5 | Draggable overlay behavior | Used by the custom video player UI. |
| react-tooltip | ^4.2.21 | Tooltip UI | Drives help and hover guidance across controls. |
| sass | ^1.54.9 | SCSS compilation | Styles are organized under `src/styles/`. |
| webmidi | ^2.0.0 | MIDI device input | Supports external keyboard interaction. |

## Dev

| Dependency | Version | Purpose |
| --- | --- | --- |
| eslint | ^8.57.1 | Standalone lint command for repo validation and DAL-A setup workflows |
| jest | ^29.0.3 | Test runner for unit and integration coverage |
| @testing-library/react | ^13.0.0 | Integration testing of React components |
| @testing-library/jest-dom | ^5.16.5 | DOM-focused Jest matchers |
| @testing-library/user-event | ^13.2.1 | User interaction simulation in tests |
| jest-axe | ^10.0.0 | Accessibility assertions in Jest |
| @playwright/test | ^1.56.1 | End-to-end testing |
| @axe-core/playwright | ^4.11.0 | Accessibility assertions in Playwright |
| @axe-core/react | ^4.11.0 | Development-time accessibility auditing |
| react-test-renderer | ^18.2.0 | Snapshot and renderer-based tests |
