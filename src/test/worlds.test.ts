import { describe, expect, it } from 'vitest'
import { defaultWorldId, getWorld, worlds } from '../config/worlds'

describe('worlds config', () => {
  it('defaults to dargah-dusk', () => {
    expect(defaultWorldId).toBe('dargah-dusk')
  })

  it('includes all four worlds', () => {
    expect(worlds.map((w) => w.id).sort()).toEqual(
      ['dargah-dusk', 'mehfil', 'portrait-shrine', 'truck-chai'].sort(),
    )
  })

  it('getWorld returns matching world', () => {
    expect(getWorld('mehfil')?.label).toBe('Mehfil')
  })
})
