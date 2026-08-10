export type Track = {
  id: string
  title: string
  artist: string
  youtubeId: string
}

/** Swap or reorder tracks freely; playback only reads this array. */
export const tracks: Track[] = [
  {
    id: 'allah-hoo',
    title: 'Allah Hoo',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'fDy-sUF7gLc',
  },
  {
    id: 'mustt-mustt',
    title: 'Mustt Mustt',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'SDfELfpumEE',
  },
  {
    id: 'tumhe-dillagi',
    title: 'Tumhe Dillagi',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'X0aWquXGXXU',
  },
  {
    id: 'sanu-ek-pal',
    title: 'Sanu Ek Pal Chain',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: '5-vbDkmwymY',
  },
  {
    id: 'halka-halka',
    title: 'Yeh Jo Halka Halka Suroor Hai',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: '8sZqb13NCFg', // OSA Official — 1985 live
  },
]
