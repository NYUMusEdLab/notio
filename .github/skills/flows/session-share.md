---
flow: "session-share"
entry: "src/components/menu/ShareLink.js:onClick"
exit: "A shared session URL is created and can later restore the same app state"
---

# session-share

[← Flow Catalog](./SKILL.md)

```mermaid
flowchart LR
    subgraph create["Create Share Link"]
        A["ShareLink click"] --> B["saveSessionToDB"]
        B --> C["Firestore add session"]
        C --> D["Build /shared/:sessionId URL"]
    end
    subgraph restore["Restore"]
        D --> E["User opens shared route"]
        E --> F["WholeAppWrapper passes sessionId"]
        F --> G["openSavedSession hydrates state"]
    end
```

| Step | File | Function |
| --- | --- | --- |
| Share action | `src/components/menu/ShareLink.js` | `onClick` |
| Session save | `src/WholeApp.js` | `saveSessionToDB` |
| Firebase write | `src/Firebase.js` | `db.collection(...).add` |
| Shared route handoff | `src/WholeAppWrapper.js` | `WholeAppWrapper` |
| Session restore | `src/WholeApp.js` | `openSavedSession` |

## Invariants

- Saved and restored state fields must stay in sync when new session-relevant state is introduced.
- Share creation should never silently produce a broken `/shared/undefined` URL.
- Session restore must re-register custom scales before rendering dependent UI.

## Dependencies

- app-bootstrap
- Firebase Firestore
- Share menu components under `src/components/menu/`
