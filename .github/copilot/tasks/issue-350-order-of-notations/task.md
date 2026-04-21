---
title: "Issue #350 order of notations"
slug: "issue-350-order-of-notations"
phase: "active"
goal: "Make notation layers stack bottom-to-top in the UI in the exact order of the Notation checkbox list, and keep that order stable across all interactions, without regressing other notation modes or accessibility."
current_action: "Slice 1 in progress — reverting fb80ceb with a clean-history split commit."
---

Fix GitHub issue [#350](https://github.com/NYUMusEdLab/notio/issues/350). The reporter observed that notation stacking on the staff sometimes becomes reversed/random, with scale-step and chord-extension numbers ending up below note names. The expected behavior is a stable stacking order that matches the order of items in the Notation checkbox list, bottom-to-top.

## Constraints

- No regressions to other notation modes or accessibility.
- Must include automated regression tests.
- Scope: UI stacking order only (not an end-to-end re-architecture).
- This branch already has commit `fb80ceb` from a previous attempt; user chose "revert and replan", so the prior approach must be undone as part of this task.

## Decisions

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-04-21 | Revert prior fix commit `fb80ceb` and replan | Discovery showed it fixed the wrong seam (generic `ListCheckbox`) and missed the session-restore path |
| 2026-04-21 | Scope limited to UI stacking order | Keyboard label ordering out of scope unless proven same root cause |
| 2026-04-21 | Approach: Option 1 — state-boundary normalization in `WholeApp` | Single source of truth; fixes restored-array bug; small, test-friendly |
| 2026-04-21 | Visual direction: top of stack = last item in checkbox list | Reverse of list order on screen; list read top-to-bottom stacks bottom-to-top |
| 2026-04-21 | Git cleanup via `git revert fb80ceb` (no force-push) | Preserves history; safe on already-pushed branch |

## Roadmap

- [ ] Slice 1 (in-progress) — Revert `fb80ceb` and restore a clean baseline on branch `issue-350-order-of-notations-fix`.
- [ ] Slice 2 — Add failing integration test asserting rendered notation row order after menu toggles and after session hydration, using the confirmed visual direction.
- [ ] Slice 3 — Introduce `normalizeNotationOrder` helper and apply it at every writer of `state.notation` in `WholeApp` (`handleChangeNotation`, session-restore, defaults); verify tests pass.
- [ ] Slice 4 — Regression sweep: run full test suite + targeted a11y checks; update flow docs if behavior changed; push branch and update PR.

## Changelog

- 2026-04-21: Task created with confirmed goal and constraints; prior fix commit noted for revert.
- 2026-04-21: Discovery completed; identified `WholeApp` → `Keyboard` → `ColorKey` as the real ownership path and `WholeApp` session-restore as the missed seam.
- 2026-04-21: Roadmap confirmed (Option 1 — state-boundary normalization); visual direction and git cleanup strategy locked in.

## Improvements Queued

- None yet.
