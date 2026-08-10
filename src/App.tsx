import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { WorldScene } from './components/WorldScene'
import { GlassPlayer } from './components/GlassPlayer'
import { defaultWorldId, getWorld } from './config/worlds'
import { tracks } from './config/tracks'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import { youtubeThumb } from './lib/youtube'

export default function App() {
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const [worldId, setWorldId] = useState<string>(defaultWorldId)
  const world = getWorld(worldId) ?? getWorld(defaultWorldId)!
  const onlineCount = 28 + (new Date().getDate() % 17)

  const player = useYouTubePlayer(tracks)
  const active = player.track

  return (
    <main className="app">
      <WorldScene world={world} reducedMotion={reducedMotion} />
      <Header
        worldId={worldId}
        onWorldChange={setWorldId}
        onlineCount={onlineCount}
      />

      {/* 220×220 off-screen — never 0×0 */}
      <div className="yt-host" aria-hidden>
        <div ref={player.hostRef} />
      </div>

      {active && (
        <GlassPlayer
          title={active.title}
          artist={active.artist}
          coverUrl={youtubeThumb(active.youtubeId)}
          isPlaying={player.isPlaying}
          isReady={player.isReady}
          isUnavailable={player.isUnavailable}
          currentTime={player.currentTime}
          duration={player.duration}
          statusNote={player.statusNote}
          onPlayPause={player.playPause}
          onPrev={player.prev}
          onNext={player.next}
          onSeek={player.seek}
        />
      )}
    </main>
  )
}
