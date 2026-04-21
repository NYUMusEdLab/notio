---
flow: "settings-propagation"
entry: "src/components/menu/TopMenu.js"
exit: "Menu actions fan out through WholeApp into keyboard, notation, audio, and overlays"
---

# settings-propagation

[← Flow Catalog](./SKILL.md)

```mermaid
flowchart LR
    subgraph controls["Menu Controls"]
        A["TopMenu interactions"] --> B["WholeApp handlers"]
    end
    subgraph state["State Fan-out"]
        B --> C["WholeApp setState"]
        C --> D["Keyboard props update"]
        C --> E["Overlay and menu props update"]
    end
    subgraph outcome["Visible Results"]
        D --> F["Notation, sound, root, scale, clef changes"]
        E --> G["Share, help, and video UI changes"]
    end
```

| Step | File | Function |
| --- | --- | --- |
| Menu rendering | `src/components/menu/TopMenu.js` | `TopMenu` |
| Root change | `src/WholeApp.js` | `handleChangeRoot` |
| Notation change | `src/WholeApp.js` | `handleChangeNotation` |
| Sound change | `src/WholeApp.js` | `handleChangeSound` |
| Video tab change | `src/WholeApp.js` | `handleChangeActiveVideoTab` |

## Invariants

- Menu interactions should update only the intended slices of app state.
- Keyboard, audio, and overlay behavior should stay synchronized with the active settings.
- Accessibility affordances in menu navigation must remain intact.

## Dependencies

- scale-change-pipeline
- note-playback
- video-overlay
- Accessibility menu-navigation tests
