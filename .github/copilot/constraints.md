# Constraints

## Hard Rules

- Preserve the integration-first testing strategy documented in `docs/TESTING.md` and avoid replacing behavior coverage with narrow unit tests.
- Keep relative notation key-independent across all 12 chromatic roots and do not regress other notation modes when modifying scale generation.
- Maintain keyboard accessibility for interactive controls, including Enter/Space activation, focus visibility, and focus return from overlays.
- Treat Yarn as the package manager for repo workflows; if a shell lacks `yarn`, use `corepack yarn` rather than switching the repo guidance to npm.
- When runtime behavior changes in a documented path, update the matching flow doc in `.github/skills/flows/`.

## Protected Contracts

| Contract | Pattern | Enforcement | Why |
| --- | --- | --- | --- |
| Music scale generation and notation contracts | `src/Model/MusicScale.js` | `ask` | This file defines scale construction and all notation outputs, including relative solfege invariants used across the app. |
| App state orchestration and session hydration | `src/WholeApp.js` | `ask` | `WholeApp` owns most state transitions, menu callbacks, and Firebase session serialization/deserialization. |
| Shared-session route handoff | `src/WholeAppWrapper.js` | `ask` | The wrapper is the only bridge from React Router params into the class-based app shell. |

## Security Boundaries

| Boundary | Pattern | Enforcement | Why |
| --- | --- | --- | --- |
| Firebase client persistence boundary | `src/Firebase.js` | `ask` | This file controls client access to Firestore and is the only persistence boundary in the repo. |
| Session sharing surface | `src/components/menu/Share*.js` | `ask` | Share-link creation crosses from local UI state into persisted remote session data. |
| User-supplied video URL handling | `src/components/menu/CustomVideoPlayer.js` | `ask` | Video URLs flow into ReactPlayer or iframe embeds and should be treated as security-sensitive input handling. |

## Fragile Areas

| Area | Pattern | Enforcement | Why |
| --- | --- | --- | --- |
| Keyboard interaction and module-scoped state | `src/components/keyboard/**` | `ask` | Keyboard input, audio triggering, and module-level mutable state are tightly coupled and easy to regress. |
| Top-level menu fan-out | `src/components/menu/TopMenu.js` | `ask` | This file fans user actions into most app handlers and affects multiple runtime flows at once. |
| Accessibility integration tests | `src/__integration__/accessibility/**` | `ask` | These tests are the strongest automated guard for keyboard and aria regressions. |
| Relative-notation regression tests | `src/__test__/**/*relative*.test.js` | `ask` | These tests protect a domain invariant that has regressed before and should not be casually edited. |

## Performance Boundaries

| Path | Constraint |
| --- | --- |
| `src/Model/MusicScale.js` | Keep scale and notation generation effectively constant-time for the current recipe lookup strategy. |
| `src/components/keyboard/**` | Avoid unnecessary full-keyboard rebuilds or extra global DOM queries on every interaction. |
| `e2e/**` | Keep individual E2E cases within the 30-second Playwright timeout documented by the repo config. |

## Dangerous Commands

| Pattern | Why |
| --- | --- |
| `rm\s+-rf\s+build` | Build output removal is acceptable only when the user explicitly asks for a clean rebuild. |
| `git\s+push\s+.*--force` | Force-pushing on this repo can overwrite collaborator history. |
