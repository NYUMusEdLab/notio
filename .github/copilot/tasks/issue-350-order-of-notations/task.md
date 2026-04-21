---
title: "Issue 350 - order of notations"
slug: "issue-350-order-of-notations"
phase: "active"
goal: "Fix unstable notation stacking order so displayed notation layers are deterministic and follow the Notation checkbox list order."
current_action: "Implementation completed in ListCheckbox with deterministic ordering and focused tests; preparing branch and PR."
---

Issue link: [#350](https://github.com/NYUMusEdLab/notio/issues/350)

## Problem Summary

Notation layer stacking on keys is unstable and can appear reversed. The issue specifically reports scale-step and chord-extension values appearing below note names after interactions.

## Root Cause Hypothesis

The selected notation array in app state is produced by object key enumeration in ListCheckbox, which reflects mutation/insertion history instead of canonical list order.

Current behavior path:

1. Notation toggles update ListCheckbox local state as an object map.
2. Selected values are emitted using Object.keys on that object.
3. Keyboard render uses the emitted array order when building noteName display entries.
4. Visual stacking follows this order, so selection chronology can scramble perceived notation layer ordering.

## Plan

1. Make Notation selection order deterministic at source.
2. Preserve an explicit canonical Notation option order and always emit selected options in that order.
3. Keep existing behavior for selected/unselected state and accessibility interactions.
4. Add focused tests that fail if order drifts due to toggle sequence.
5. Verify with integration behavior by toggling notation on/off in different sequences.

## Implementation Outline

- Update src/components/form/ListCheckbox.js:
  - Initialize checkbox state using the full options list with boolean selected flags.
  - Emit selected options using options.filter(...) order rather than Object.keys(...).
  - Add prop-sync guard when initOptions changes (session restore/menu reopen cases).
- Keep src/components/menu/Notation.js as the single source of canonical Notation list order.
- If needed, add a tiny helper to avoid duplicated ordering logic.

## Validation Plan

- Add/update tests around ListCheckbox + Notation:
  - Toggling checkboxes in arbitrary order still emits selected values in canonical list order.
  - Existing selected values from initOptions preserve deterministic ordering.
- Run targeted tests for notation and keyboard rendering.
- Run lint/test checks relevant to touched files.

## Flow Impact

Affected flow docs to verify/update after implementation:

- .github/skills/flows/settings-propagation.md
- .github/skills/flows/scale-change-pipeline.md

## Changelog

- 2026-04-21: Task created from issue #350 with root-cause hypothesis and implementation plan.
- 2026-04-21: Implemented deterministic ordering in src/components/form/ListCheckbox.js by emitting selected options from canonical list order instead of object key order.
- 2026-04-21: Added focused regression tests in src/__test__/ListCheckbox.order.test.js for toggle-sequence stability and initOptions prop-sync behavior.
- 2026-04-21: Validation passed with targeted test run: corepack yarn test --watchAll=false --runTestsByPath src/__test__/ListCheckbox.order.test.js.
