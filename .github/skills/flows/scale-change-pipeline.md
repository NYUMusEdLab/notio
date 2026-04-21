---
flow: "scale-change-pipeline"
entry: "src/WholeApp.js:handleSelectScale"
exit: "Keyboard labels, colors, and in-scale state update for the selected recipe"
---

# scale-change-pipeline

[← Flow Catalog](./SKILL.md)

```mermaid
flowchart LR
    subgraph menu["Selection"]
        A["TopMenu scale or custom scale action"] --> B["WholeApp state update"]
    end
    subgraph domain["Domain Build"]
        B --> C["Keyboard componentDidUpdate"]
        C --> D["new MusicScale(...)" ]
        D --> E["BuildExtendedScaleToneNames"]
    end
    subgraph render["Render"]
        E --> F["Map scale to keyboard layout"]
        F --> G["Render Key and ColorKey state"]
    end
```

| Step | File | Function |
| --- | --- | --- |
| Scale selection | `src/WholeApp.js` | `handleSelectScale` |
| Custom scale insertion | `src/WholeApp.js` | `handleChangeCustomScale` |
| Keyboard rebuild | `src/components/keyboard/Keyboard.js` | `componentDidUpdate` |
| Domain generation | `src/Model/MusicScale.js` | `init` |
| Relative notation mapping | `src/Model/MusicScale.js` | `makeRelativeScaleSyllables` |

## Invariants

- Relative notation must stay key-independent for the same scale recipe across all roots.
- Changes to one notation mode must not corrupt the others.
- Missing scale recipes should be treated as defects, not normal fallbacks.

## Dependencies

- settings-propagation
- note-playback
- Relative-notation regression and integration tests under `src/__test__/` and `src/__integration__/`
