# GitHub Copilot — Project Guide for notio

This file contains concise, project-specific instructions to help AI coding agents be immediately productive.

## Quick architecture overview ✅
- Frontend-only React app (created with `react-scripts`) — primary source: `src/`
- Persistence: Firebase (`firebase` package) for remote data; `localStorage` for client-side state
- Music/notation domain logic lives in `src/Model/` (see `MusicScale.js`) — scale/notation code is central
- Tests: unit/integration (Jest + React Testing Library + jest-axe) in `src/__tests__` and `src/__integration__`; E2E: Playwright (`e2e/` + Playwright config)
- Build: `npm run build` (copies `netlify.toml` into `build/`), deploy via `npm run deploy` (gh-pages)

## Key commands (use these exactly) 🔧
- Install & dev: `npm install` → `npm start` (dev server)
- Build: `npm run build` (note: `CI=false react-scripts build && cp netlify.toml build/netlify.toml`)
- Tests (watch): `npm test`
- CI tests: `npm run test-ci` (use in CI; uses `--ci` flag)
- E2E (Playwright): `npm run test:e2e` (or `:chromium`, `:firefox`, `:webkit`, `:headed`, `:debug`)
- Accessibility quick run: `npm run test:a11y`

## Testing gotchas & helpful notes ⚠️
- Jest runs with a custom transform-ignore pattern to allow transpiling some vendor packages. If adding native or untranspiled packages (e.g., `vexflow`, `@tonejs/piano`, `gsap`), update the `transformIgnorePatterns` in `package.json` tests to include them.
- E2E tests use Playwright with `@axe-core/playwright` for cross-browser accessibility checks. Use the `--debug`/`--headed` flags locally for debugging.
- Use `npm run test-ci` in CI and `npm test` locally (watch mode) to save iteration time.

## Project conventions & patterns 📐
- Accessibility-first: interactive elements must include `role`, descriptive `aria-label`, and `tabIndex={0}` (see `CLAUDE.md` examples).
- Keyboard activation: components use an `onKeyDown` handler that treats `Enter` and `Space` as primary activators and prevents default for `Space` to avoid page scrolling.
- Relative notation: `MusicScale.makeRelativeScaleSyllables()` and the `SCALE_DEGREE_TO_SYLLABLE` table in `src/Model/MusicScale.js` are authoritative for movable-do solfege. Any change to syllable mapping requires integration tests across all 12 chromatic keys (see test snippet below).

Example test snippet (Key-independence):
```javascript
// src/__tests__/musicScale.keyIndependence.test.js
const keys = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const expected = ['DO','RE','ME','FA','SO','LE','TE'];
keys.forEach(k => {
  const s = new MusicScale(recipe, k, 0, 36);
  expect(s.ExtendedScaleToneNames.Relative.slice(0,7)).toEqual(expected);
});
```

## Where to update agent/context docs 📝
- This repository includes a script that generates/updates agent files: `src/.specify/scripts/bash/update-agent-context.sh`.
  - It reads feature `plan.md` files and will create/update agent files (preserves manual additions)
  - Copilot's target path is `.github/agents/copilot-instructions.md` (this file)
- If you add technology/version info to a feature plan, run the script to refresh agent docs: `./src/.specify/scripts/bash/update-agent-context.sh copilot` (or omit argument to update all).

## Editing guidance for Copilot-style changes ✍️
- Make small, narrowly-scoped PRs with one logical change + tests
- For UI/behavior changes, add integration tests in `src/__integration__` (aim for 60–70% integration coverage as per `CLAUDE.md`), and add Playwright tests for E2E flows
- When changing shared domain logic (e.g., `MusicScale`), include the key-independence test and update any example fixtures in `src/data/`
- Keep the `MANUAL ADDITIONS` section intact when editing generated agent files (the update script preserves that block)

## Files & places to inspect for context 🔍
- `CLAUDE.md` — high-level project patterns and accessibility rules
- `package.json` — scripts and dependency list
- `src/Model/MusicScale.js` — core music/relative notation logic
- `src/.specify/` — templates and scripts for generating agent files
- `playwright.config.js` and `e2e/` — E2E configuration and tests

## Quick do / don't list ✅❌
- DO run `npm run test-ci` in CI and `npm test` locally
- DO update `transformIgnorePatterns` when adding non-transpiled dependencies
- DO add integration tests for UI behavior and accessibility checks
- DO NOT edit generated files in `build/`, `coverage/`, or other derived outputs

---
If anything here is unclear or you'd like more/less detail in a specific area (tests, accessibility, music model, or agent automation), tell me which sections to expand or condense and I will iterate.