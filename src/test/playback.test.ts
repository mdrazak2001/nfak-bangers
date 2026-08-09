import { describe, expect, it } from 'vitest'
import { nextPlayableIndex } from '../lib/playback'

describe('nextPlayableIndex', () => {
  it('advances forward skipping marked indices', () => {
    const skipped = new Set([1])
    expect(nextPlayableIndex(0, skipped, 5, 1)).toBe(2)
  })

  it('wraps around', () => {
    expect(nextPlayableIndex(4, new Set(), 5, 1)).toBe(0)
  })

  it('returns null when all skipped', () => {
    const skipped = new Set([0, 1, 2])
    expect(nextPlayableIndex(0, skipped, 3, 1)).toBe(null)
  })

  it('goes backward', () => {
    expect(nextPlayableIndex(0, new Set(), 5, -1)).toBe(4)
  })
})
