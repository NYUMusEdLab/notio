---
title: "Issue #350 order of notations"
slug: "issue-350-order-of-notations"
phase: "done"
goal: "Make notation layers stack bottom-to-top in the UI in the exact order of the Notation checkbox list, and keep that order stable across all interactions, without regressing other notation modes or accessibility."
current_action: "Task complete. Fix pushed to branch issue-350-order-of-notations-fix; PR #351 updated with new description."
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
| 2026-04-21 | Visual direction confirmed: DOM order = canonical list order (Chord extensions first, English last) | Consistent with issue reporter saying "numbers below note names is wrong"; `.noteWrapper` uses `flex-direction: column` so DOM top = visual top |

## Roadmap

- [x] Slice 1 — Revert `fb80ceb` and restore a clean baseline on branch `issue-350-order-of-notations-fix`.
- [x] Slice 2 — Add failing integration tests asserting rendered notation row order after menu writer and session-restore writer, with confirmed visual direction (Chord extensions on top, English at bottom).
- [x] Slice 3 — Introduce `normalizeNotationOrder` helper and apply it at every writer of `state.notation` in `WholeApp` (`handleChangeNotation`, session-restore, defaults); verify tests pass.
- [x] Slice 4 — Regression sweep: run full test suite + targeted a11y checks; update flow docs if behavior changed; push branch and update PR.

## Changelog

- 2026-04-21: Task created with confirmed goal and constraints; prior fix commit noted for revert.
- 2026-04-21: Discovery completed; identified `WholeApp` → `Keyboard` → `ColorKey` as the real ownership path and `WholeApp` session-restore as the missed seam.
- 2026-04-21: Roadmap confirmed (Option 1 — state-boundary normalization); visual direction and git cleanup strategy locked in.
- 2026-04-21: Slice 1 complete. Committed DAL-A setup (2348949), rewrote task.md (92a05bb), and reverted fb80ceb via `git revert` (72e321b). `src/components/form/ListCheckbox.js` and deletion of `src/__test__/ListCheckbox.order.test.js` now diff-clean vs `origin/master`. Branch is 3 commits ahead of master; origin PR not yet updated.
- 2026-04-21: Visual direction disambiguated with product: Chord extensions on top, English at bottom; DOM order = canonical order.
- 2026-04-21: Slice 2 complete. Added `src/__integration__/notation-order.test.js` with two failing tests covering the menu writer and session-restore writer paths. Both fail on current baseline with the expected "order mirrors scrambled input" diff. Test runtime ~4s (within integration-suite budget).
- 2026-04-21: Slice 3 complete. Added `src/Model/normalizeNotationOrder.js` helper and wired it into `handleChangeNotation`, `openSavedSession`, and a new `componentDidUpdate` safety net in `WholeApp.js` (Approach 3 — defense in depth). Both Slice 2 tests now pass; adjacent integration suites (34 tests) still pass.
- 2026-04-21: Slice 4 complete. Full test suite ran: 301/306 pass. The 5 failures (`notation-regression.test.js`, `relative-notenames.test.js`, `CustomVideoPlayer.integration.test.js`) were verified to fail identically on `origin/master` — pre-existing, unrelated to this fix. Updated `.github/skills/flows/settings-propagation.md` with the new canonical-order invariant. Pushed 7 commits to `origin/issue-350-order-of-notations-fix` (fast-forward, no force-push). Updated PR #351 body to reflect the new approach.

## Improvements Queued

- None yet.
