---
flow: "note-playback"
entry: "src/components/keyboard/Keyboard.js:handleKeyDown"
exit: "A note is played, visually highlighted, and released"
---

# note-playback

[← Flow Catalog](./SKILL.md)

```mermaid
flowchart LR
    subgraph input["Input Paths"]
        A["QWERTY, mouse, touch, or focused key activation"] --> B["noteOnHandler or playNote"]
    end
    subgraph audio["Playback"]
        B --> C["SoundMaker startSound"]
        C --> D["Tone.js or SoundFont adapter"]
    end
    subgraph ui["Feedback"]
        B --> E["Highlight active key"]
        D --> F["Audible note"]
        E --> G["Release path removes highlight"]
    end
```

| Step | File | Function |
| --- | --- | --- |
| Keyboard input handling | `src/components/keyboard/Keyboard.js` | `handleKeyDown` |
| Note activation guard | `src/components/keyboard/Keyboard.js` | `noteOnHandler` |
| Audio facade | `src/Model/SoundMaker.js` | `startSound` |
| Tone adapter | `src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js` | `keyDown` |
| Focus-key activation | `src/components/keyboard/Key.js` | `handleKeyDown` |

## Invariants

- A note should not be double-triggered while it remains active.
- Audio resume must happen from a user interaction path before playback in browsers that gate AudioContext startup.
- Key highlight and release behavior should stay aligned with note start and stop behavior.

## Dependencies

- scale-change-pipeline
- Accessibility tests under `src/__integration__/accessibility/`
- Audio adapters under `src/Model/Adapters/`
