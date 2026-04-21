---
flow: "video-overlay"
entry: "src/components/menu/VideoButton.js:handleShow"
exit: "The custom video player opens, updates URL state, and returns focus cleanly on close"
---

# video-overlay

[← Flow Catalog](./SKILL.md)

```mermaid
flowchart LR
    subgraph open["Open Overlay"]
        A["VideoButton action"] --> B["Toggle video visibility"]
        B --> C["Render CustomVideoPlayer"]
    end
    subgraph player["Player State"]
        C --> D["Load current or default URL"]
        D --> E["Render ReactPlayer or iframe"]
        C --> F["Tab and URL updates"]
    end
    subgraph close["Close"]
        E --> G["Overlay closes"]
        F --> G
        G --> H["Focus returns to trigger"]
    end
```

| Step | File | Function |
| --- | --- | --- |
| Open or close trigger | `src/components/menu/VideoButton.js` | `handleShow` |
| Visibility toggle | `src/WholeApp.js` | `handleChangeVideoVisibility` |
| URL state update | `src/WholeApp.js` | `handleChangeVideoUrl` |
| Reset URL | `src/WholeApp.js` | `handleResetVideoUrl` |
| Custom player submit | `src/components/menu/CustomVideoPlayer.js` | `handleSubmit` |

## Invariants

- Closing the overlay should return focus to the trigger control.
- Only valid supported URL forms should reach embedded player surfaces.
- Reset should restore the preserved baseline video URL rather than an arbitrary prior value.

## Dependencies

- settings-propagation
- `src/data/config.js`
- Integration tests for the custom video player
