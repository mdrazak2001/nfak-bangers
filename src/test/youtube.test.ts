import { describe, expect, it } from 'vitest'
import { youtubeThumb } from '../lib/youtube'

describe('youtubeThumb', () => {
  it('builds hqdefault url', () => {
    expect(youtubeThumb('fDy-sUF7gLc')).toBe(
      'https://i.ytimg.com/vi/fDy-sUF7gLc/hqdefault.jpg',
    )
  })
})
