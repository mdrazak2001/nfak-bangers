export function youtubeThumb(
  youtubeId: string,
  quality: 'hqdefault' | 'mqdefault' = 'hqdefault',
): string {
  return `https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`
}
