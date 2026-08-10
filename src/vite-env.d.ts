/// <reference types="vite/client" />

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  stopVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  cueVideoById: (videoId: string) => void
  loadVideoById: (videoId: string) => void
  mute: () => void
  unMute: () => void
  destroy: () => void
}

interface Window {
  YT?: {
    Player: new (
      el: HTMLElement | string,
      opts: Record<string, unknown>,
    ) => YTPlayer
    PlayerState: {
      ENDED: number
      PLAYING: number
      PAUSED: number
      BUFFERING: number
      CUED: number
    }
  }
  onYouTubeIframeAPIReady?: () => void
}
