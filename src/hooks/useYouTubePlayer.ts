import { useCallback, useEffect, useRef, useState } from 'react'
import type { Track } from '../config/tracks'
import { nextPlayableIndex } from '../lib/playback'

const YT_ERROR_CODES = new Set([2, 5, 100, 101, 150, 153])

function loadApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve()
      return
    }
    const prior = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prior?.()
      resolve()
    }
    if (!document.getElementById('yt-iframe-api')) {
      const s = document.createElement('script')
      s.id = 'yt-iframe-api'
      s.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(s)
    }
  })
}

export function useYouTubePlayer(trackList: Track[]) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const skippedRef = useRef<Set<number>>(new Set())
  const indexRef = useRef(0)
  const wantPlayRef = useRef(false)
  /** True only after PLAYING for the current index — blocks fake ENDED cascades. */
  const heardPlayingRef = useRef(false)
  const advanceTimerRef = useRef<number | undefined>(undefined)
  const trackListRef = useRef(trackList)
  trackListRef.current = trackList

  const [index, setIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUnavailable, setIsUnavailable] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [statusNote, setStatusNote] = useState<string | null>(null)

  const track = trackList[index] ?? null

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current !== undefined) {
      window.clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = undefined
    }
  }

  const cueIndex = useCallback((i: number, autoplay: boolean) => {
    const list = trackListRef.current
    const t = list[i]
    if (!t || !playerRef.current) return
    indexRef.current = i
    heardPlayingRef.current = false
    setIndex(i)
    setCurrentTime(0)
    setDuration(0)
    wantPlayRef.current = autoplay
    if (autoplay) {
      playerRef.current.loadVideoById(t.youtubeId)
      playerRef.current.unMute()
      playerRef.current.playVideo()
    } else {
      playerRef.current.cueVideoById(t.youtubeId)
    }
  }, [])

  const advanceFrom = useCallback(
    (from: number, direction: 1 | -1, autoplay: boolean) => {
      const next = nextPlayableIndex(
        from,
        skippedRef.current,
        trackListRef.current.length,
        direction,
      )
      if (next === null) {
        setIsUnavailable(true)
        setIsPlaying(false)
        setStatusNote('No playable tracks left')
        return
      }
      setIsUnavailable(false)
      cueIndex(next, autoplay)
    },
    [cueIndex],
  )

  /** Queue an advance so rapid YT errors/fake ENDEDs don't stampede the player. */
  const scheduleAdvance = useCallback(
    (from: number, direction: 1 | -1, autoplay: boolean, markBroken: boolean) => {
      clearAdvanceTimer()
      if (markBroken) {
        skippedRef.current.add(from)
        const remaining =
          trackListRef.current.length - skippedRef.current.size
        if (remaining > 0) {
          setStatusNote('Skipping unavailable track…')
        }
      }
      advanceTimerRef.current = window.setTimeout(() => {
        advanceTimerRef.current = undefined
        setStatusNote(null)
        advanceFrom(from, direction, autoplay)
      }, 350)
    },
    [advanceFrom],
  )

  useEffect(() => {
    let cancelled = false
    let poll: number | undefined

    ;(async () => {
      await loadApi()
      if (cancelled || !hostRef.current || !window.YT) return

      const first = trackListRef.current[0]
      if (!first) {
        setIsUnavailable(true)
        return
      }

      playerRef.current = new window.YT.Player(hostRef.current, {
        width: 220,
        height: 220,
        videoId: first.youtubeId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setIsReady(true)
          },
          onStateChange: (e: { data: number }) => {
            const YTS = window.YT!
            if (e.data === YTS.PlayerState.PLAYING) {
              heardPlayingRef.current = true
              setIsPlaying(true)
              setStatusNote(null)
            }
            if (e.data === YTS.PlayerState.PAUSED) setIsPlaying(false)
            if (e.data === YTS.PlayerState.ENDED) {
              // Fake ENDED right after a failed/blocked load used to cascade
              // through the whole playlist. Only treat as a real end if we
              // actually heard PLAYING for this index.
              if (!heardPlayingRef.current) {
                scheduleAdvance(indexRef.current, 1, wantPlayRef.current, true)
                return
              }
              heardPlayingRef.current = false
              scheduleAdvance(indexRef.current, 1, true, false)
            }
          },
          onError: (e: { data: number }) => {
            if (YT_ERROR_CODES.has(e.data)) {
              scheduleAdvance(indexRef.current, 1, wantPlayRef.current, true)
            }
          },
        },
      })

      poll = window.setInterval(() => {
        const p = playerRef.current
        if (!p || typeof p.getCurrentTime !== 'function') return
        try {
          setCurrentTime(p.getCurrentTime() || 0)
          setDuration(p.getDuration() || 0)
        } catch {
          /* tearing down */
        }
      }, 250)
    })()

    return () => {
      cancelled = true
      clearAdvanceTimer()
      if (poll) window.clearInterval(poll)
      try {
        playerRef.current?.destroy()
      } catch {
        /* ignore */
      }
      playerRef.current = null
    }
  }, [scheduleAdvance])

  const playPause = useCallback(() => {
    const p = playerRef.current
    if (!p) return
    if (isPlaying) {
      p.pauseVideo()
    } else {
      wantPlayRef.current = true
      p.unMute()
      p.playVideo()
    }
  }, [isPlaying])

  const next = useCallback(() => {
    clearAdvanceTimer()
    setStatusNote(null)
    // Manual next: do not permanently skip the current track
    advanceFrom(indexRef.current, 1, isPlaying || wantPlayRef.current)
  }, [advanceFrom, isPlaying])

  const prev = useCallback(() => {
    clearAdvanceTimer()
    setStatusNote(null)
    advanceFrom(indexRef.current, -1, isPlaying || wantPlayRef.current)
  }, [advanceFrom, isPlaying])

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true)
    setCurrentTime(seconds)
  }, [])

  return {
    hostRef,
    index,
    track,
    isReady,
    isPlaying,
    isUnavailable,
    currentTime,
    duration,
    statusNote,
    playPause,
    next,
    prev,
    seek,
  }
}
