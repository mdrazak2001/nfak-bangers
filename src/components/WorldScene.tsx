import { useEffect, useState } from 'react'
import type { World } from '../config/worlds'
import { preloadImage } from '../lib/preloadImage'
import './WorldScene.css'

type Props = {
  world: World
  reducedMotion: boolean
}

export function WorldScene({ world, reducedMotion }: Props) {
  const [current, setCurrent] = useState(world)
  const [outgoing, setOutgoing] = useState<World | null>(null)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    if (world.id === current.id) return
    let cancelled = false

    ;(async () => {
      try {
        await preloadImage(world.image)
      } catch {
        /* still swap */
      }
      if (cancelled) return
      setOutgoing(current)
      setCurrent(world)
      setFadeIn(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFadeIn(true))
      })
    })()

    return () => {
      cancelled = true
    }
  }, [world, current])

  useEffect(() => {
    if (!outgoing) return
    const ms = reducedMotion ? 0 : 480
    const t = window.setTimeout(() => setOutgoing(null), ms)
    return () => window.clearTimeout(t)
  }, [outgoing, reducedMotion])

  return (
    <div className="world-scene" aria-hidden>
      {outgoing && (
        <div
          className="world-scene__layer world-scene__layer--out"
          style={{ backgroundImage: `url(${outgoing.image})` }}
        />
      )}
      <div
        className={[
          'world-scene__layer',
          fadeIn ? 'world-scene__layer--in' : 'world-scene__layer--pre',
          reducedMotion ? 'world-scene__layer--instant' : '',
        ].join(' ')}
        style={{ backgroundImage: `url(${current.image})` }}
      />
      <h1 className="world-scene__brand">{current.brandLine ?? 'NFAK Bangers'}</h1>
    </div>
  )
}
