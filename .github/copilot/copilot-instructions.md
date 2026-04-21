This project uses the copilot development system.

Active tasks: check `.github/copilot/tasks/`. If `task.md` phase is not `done`, read it first because the Changelog section is the recovery log.
Project context: `project-context.md` for stack, domain, module layout, and conventions.
Constraints: `constraints.md` before modifying code. Sections with `Pattern` and `Enforcement` columns are hook-enforced and may require user confirmation.
Hooks: `.github/hooks/` contains project guardrails. Do not change hook scripts without explicit user approval.
Flows: `.github/skills/flows/` contains the runtime flow catalog. Read the affected flow doc before behavior changes and update it after behavior changes.
Project skills: repo-local skills live under `.github/skills/` and should be preferred when relevant.

## Project-Specific Guidance

- This repo is a React 18 music-education SPA with a central `WholeApp` state container, `MusicScale` domain logic, `SoundMaker` audio adapters, and Firebase-backed session sharing.
- The repo uses Yarn workflows. If a shell lacks a global `yarn`, use `corepack yarn` instead of rewriting commands to npm.
- Testing is integration-first and accessibility-heavy. Preserve `docs/TESTING.md` expectations, especially the a11y layers and 100% coverage target.
- Changes in `src/Model/MusicScale.js`, `src/components/keyboard/`, `src/components/menu/CustomVideoPlayer.js`, or session-sharing files should trigger a flow review because they affect documented runtime paths.
- Treat `CLAUDE.md` as a source of domain-specific constraints, especially relative-notation invariants and accessibility expectations.

## Documentation References

- See `README.md` for install, dev server, build, deploy, and top-level testing commands.
- See `docs/TESTING.md` for the testing strategy, accessibility test layers, coverage expectations, and the test distribution validator.
- See `CLAUDE.md` for repo-specific accessibility patterns, relative-notation rules, and feature-derived development constraints.

Use `/begin-task` to start work. Use `/flows` to trace runtime behavior. Use `/flow-impact` to compare before and after behavior.