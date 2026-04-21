/**
 * normalizeNotationOrder
 *
 * Returns a new array containing the same notation values as the input, but
 * re-ordered to the canonical Notation-menu order. Any "Colors" entry is
 * preserved at the front of the array (Colors is not a visible label row; it
 * affects Key colouring). Unknown values are preserved at the end to avoid
 * silently dropping legacy or forward-compatible notation identifiers.
 *
 * The canonical order must mirror `notations` in
 * `src/components/menu/Notation.js`, prepended with "Colors". Keep these in
 * sync when notation options change.
 *
 * Contract:
 * - Idempotent: normalizeNotationOrder(normalizeNotationOrder(x)) === normalizeNotationOrder(x)
 * - Never mutates the input array.
 * - Non-array inputs are returned unchanged (defensive for session-restore
 *   payloads that might be malformed).
 */

export const CANONICAL_NOTATION_ORDER = [
  "Colors",
  "Chord extensions",
  "Scale Steps",
  "Relative",
  "Romance",
  "German",
  "English",
];

const CANONICAL_SET = new Set(CANONICAL_NOTATION_ORDER);

export function normalizeNotationOrder(notation) {
  if (!Array.isArray(notation)) {
    return notation;
  }
  const selected = new Set(notation);
  const known = CANONICAL_NOTATION_ORDER.filter((name) => selected.has(name));
  const unknown = notation.filter(
    (name) => !CANONICAL_SET.has(name)
  );
  return [...known, ...unknown];
}

export default normalizeNotationOrder;
