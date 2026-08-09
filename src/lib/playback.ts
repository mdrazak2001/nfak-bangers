/**
 * Returns the next index not present in `skipped`, moving in `direction`.
 * Returns null when nothing is available.
 */
export function nextPlayableIndex(
  current: number,
  skipped: Set<number>,
  length: number,
  direction: 1 | -1,
): number | null {
  if (length <= 0) return null
  if (skipped.size >= length) return null

  let index = current
  for (let attempts = 0; attempts < length; attempts += 1) {
    index = (index + direction + length) % length
    if (!skipped.has(index)) return index
  }

  return null
}
