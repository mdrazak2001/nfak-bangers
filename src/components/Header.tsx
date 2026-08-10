import { useEffect, useState } from 'react'
import { worlds } from '../config/worlds'
import { links } from '../config/links'
import './Header.css'

type Props = {
  worldId: string
  onWorldChange: (id: string) => void
  onlineCount: number
}

function formatTime(d: Date) {
  return d
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    .toLowerCase()
}

export function Header({ worldId, onWorldChange, onlineCount }: Props) {
  const [now, setNow] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = window.setInterval(() => setNow(formatTime(new Date())), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header className="header">
      <time className="header__time">{now}</time>

      <div className="header__center">
        <span className="header__online" title={`${onlineCount} online`}>
          <span className="header__dot" aria-hidden />
          <span className="header__online-text">{onlineCount} online</span>
        </span>
        <label className="header__world">
          <span className="sr-only">World</span>
          <select
            value={worldId}
            onChange={(e) => onWorldChange(e.target.value)}
            aria-label="Choose world"
          >
            {worlds.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav className="header__links" aria-label="External listening">
        <a
          className="header__link"
          href={links.spotify}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Spotify"
          title="Spotify"
        >
          <span className="header__link-text">Spotify</span>
          <span aria-hidden>↗</span>
        </a>
        <a
          className="header__link"
          href={links.youtubeMusic}
          target="_blank"
          rel="noreferrer"
          aria-label="Open YouTube Music"
          title="YT Music"
        >
          <span className="header__link-text">YT Music</span>
          <span aria-hidden>↗</span>
        </a>
      </nav>
    </header>
  )
}
