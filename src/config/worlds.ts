export type World = {
  id: string
  label: string
  image: string
  brandLine?: string
}

export const defaultWorldId = 'portrait-shrine' as const

export const worlds: World[] = [
  {
    id: 'mehfil',
    label: 'Mehfil',
    image: '/worlds/mehfil.webp',
    brandLine: 'NFAK Bangers',
  },
  {
    id: 'truck-chai',
    label: 'Truck/Chai',
    image: '/worlds/truck-chai.webp',
    brandLine: 'NFAK Bangers',
  },
  {
    id: 'portrait-shrine',
    label: 'Portrait Shrine',
    image: '/worlds/portrait-shrine.webp',
    brandLine: 'NFAK Bangers',
  },
  {
    id: 'dargah-dusk',
    label: 'Dargah Dusk',
    image: '/worlds/dargah-dusk.webp',
    brandLine: 'NFAK Bangers',
  },
]

export function getWorld(id: string): World | undefined {
  return worlds.find((w) => w.id === id)
}
