import './GlassPlayer.css'

export type GlassPlayerProps = {
  title: string
  artist: string
  coverUrl: string
  isPlaying: boolean
  isReady: boolean
  isUnavailable: boolean
  currentTime: number
  duration: number
  onPlayPause: () => void
  onPrev: () => void
  onNext: () => void
  onSeek: (seconds: number) => void
}

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function GlassPlayer(props: GlassPlayerProps) {
  const {
    title,
    artist,
    coverUrl,
    isPlaying,
    isReady,
    isUnavailable,
    currentTime,
    duration,
    onPlayPause,
    onPrev,
    onNext,
    onSeek,
  } = props

  const disabled = isUnavailable || !isReady

  return (
    <div className={`glass-player ${isReady ? 'glass-player--ready' : ''}`}>
      <img
        className="glass-player__cover"
        src={coverUrl}
        alt=""
        width={44}
        height={44}
      />
      <div className="glass-player__meta">
        <div className="glass-player__title">
          {isUnavailable ? 'Track unavailable' : title}
        </div>
        <div className="glass-player__artist">
          {isUnavailable ? 'Try again later' : artist}
        </div>
        <div className="glass-player__seek-row">
          <input
            className="glass-player__seek"
            type="range"
            min={0}
            max={Math.max(duration, 0.1)}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            disabled={disabled}
            aria-label="Seek"
            onChange={(e) => onSeek(Number(e.target.value))}
          />
          <span className="glass-player__time" aria-hidden>
            {fmt(currentTime)}
          </span>
        </div>
      </div>
      <div className="glass-player__controls">
        <button
          type="button"
          className="glass-player__btn"
          aria-label="Previous"
          disabled={disabled}
          onClick={onPrev}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
          </svg>
        </button>
        <button
          type="button"
          className={`glass-player__btn glass-player__btn--play ${!isReady ? 'is-loading' : ''}`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isUnavailable}
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="glass-player__btn"
          aria-label="Next"
          disabled={disabled}
          onClick={onNext}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
