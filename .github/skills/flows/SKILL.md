---
name: flows
description: "Runtime flow documentation for this repository. Use when verifying, tracing, or updating how Notio behaves at runtime across routing, keyboard/audio interaction, notation changes, sharing, and overlays."
---

# Flows

Runtime flow documentation for this project.

## Flow Catalog

| Flow | Entry | Exit | Doc |
|---|---|---|---|
| app-bootstrap | `src/index.js:root.render` | Whole app loads with defaults or a restored shared session | [app-bootstrap](./app-bootstrap.md) |
| scale-change-pipeline | `src/WholeApp.js:handleSelectScale` | Keyboard and notation output re-render for the selected scale | [scale-change-pipeline](./scale-change-pipeline.md) |
| note-playback | `src/components/keyboard/Keyboard.js:handleKeyDown` | A note is sounded, highlighted, and later released | [note-playback](./note-playback.md) |
| session-share | `src/components/menu/ShareLink.js:onClick` | A shareable `/shared/:sessionId` URL is created and later restored | [session-share](./session-share.md) |
| video-overlay | `src/components/menu/VideoButton.js:handleShow` | The custom video player opens, changes URL state, and returns focus on close | [video-overlay](./video-overlay.md) |
| settings-propagation | `src/components/menu/TopMenu.js` | Menu changes fan out through WholeApp into the keyboard and overlays | [settings-propagation](./settings-propagation.md) |

## How to Use

- Before modifying behavior, read the relevant flow doc to understand the current runtime chain and invariants.
- After modifying behavior, update the affected flow doc or mark it stale in the active task.
- Use `/flows` to trace or update flows. Use `/flow-impact` to compare before and after changes.