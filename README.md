# NFAK Bangers

Saloon-style site that plays curated Nusrat Fateh Ali Khan tracks through a liquid-glass player over four switchable worlds.

## Run

```bash
npm install
npm run dev
```

## Config

Edit without touching UI code:

- `src/config/tracks.ts` — YouTube IDs / order
- `src/config/worlds.ts` — worlds + default (`dargah-dusk`)
- `src/config/links.ts` — Spotify / YT Music URLs
- `public/worlds/` — full-bleed artwork (see `ATTRIBUTION.md`)

## Notes

- Audio is YouTube-embedded (hidden 220×220 iframe). No autoplay — first Play tap starts sound.
- Deploy: `npx vercel` or connect this repo in the Vercel dashboard.
