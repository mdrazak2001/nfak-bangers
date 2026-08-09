# NFAK Bangers — Design Spec

**Date:** 2026-08-10  
**Status:** Approved for planning (pending user review of this written spec)  
**Inspiration:** [saloon.wtf](https://saloon.wtf) — atmospheric full-bleed scene + liquid-glass music player  
**Deploy:** Vercel free (no custom domain for v1)

---

## 1. Product intent

**Who:** Someone who wants NFAK / qawwali in one tap — nostalgia, late-night listening, sharing a link that *feels* like a place.

**What they must do:** Open the site → hear curated Nusrat Fateh Ali Khan tracks via a floating glass player, optionally switch the visual “world.”

**Feel:** Saloon-adjacent — warm, soulful, sparse chrome, artwork dominates. Not a dashboard, not a streaming app shell.

**Brand / title:** **NFAK Bangers** (browser tab + on-scene HTML overlay). Working title until a real domain exists.

**Tweet energy (reference, not a UI copy requirement):** soul-fixing qawwali the way Saloon framed ₹20 haircut nostalgia — memory first, player second.

---

## 2. Experience & architecture

### Stack

- **Vite + React + TypeScript** SPA
- Static build → **Vercel** free
- **YouTube IFrame API** for playback (no self-hosted audio in v1)
- Prioritize visual experience and **fast initial load** over unnecessary architecture
- **No additional features or architecture without asking first**

### Layout (Saloon clone)

1. **Full-viewport world art** — the page is the scene
2. **Header chrome** — local time · online pill · world dropdown · Spotify + YT Music links
3. **HTML brand overlay** — “NFAK Bangers” (and/or world `brandLine`) positioned *within* the scene so it feels integrated; **not** AI-baked text in the artwork
4. **Bottom liquid-glass player** — compact, understated; artwork remains dominant
5. **Hidden YouTube iframe** — audio engine only

### Worlds (all four, user-switchable)

| ID | Label | Art approach |
|----|--------|--------------|
| `mehfil` | Mehfil | Generated — night gathering / sama |
| `truck-chai` | Truck/Chai | Generated — roadside radio / chai stall night |
| `portrait-shrine` | Portrait Shrine | **Archival NFAK photo composited** into painted shrine/niche (frame, light, atmosphere) — not a raw rectangular overlay |
| `dargah-dusk` | Dargah Dusk | Generated — atmospheric & respectful: marble courtyard, dusk light, diyas, subtle architecture; **avoid stereotypical/overloaded religious imagery** |

Default world on first load / hard refresh: **`dargah-dusk`** (set in `worlds.ts` as `defaultWorldId`). Hard refresh restores this default (smoke check required). Do not persist last-selected world in v1.

---

## 3. UI & visual system

### Composition reference

Use the provided Saloon screenshot as the visual reference for:

- Full-bleed illustration dominance
- Sparse floating chrome
- Header distribution (time left · status center · links right)
- Liquid-glass player structure, scale, and bottom-center placement
- Spacing and restraint

### Liquid-glass player (L → R)

- Circular cover thumbnail (YouTube thumbnail from `youtubeId`)
- Title + artist (primary white / muted secondary)
- Thin seek bar
- Prev · Play/Pause (solid white circle primary) · Next

**Treatment (v1):** CSS `backdrop-filter: blur`, translucent fill, hairline light border, soft shadow. No WebGL / heavy refraction libraries.

**Size:** Compact and understated. On mobile, player may **grow slightly** if metadata/controls become cramped — flexible height, not a fixed brittle bar.

### Typography & tokens

- UI: clean expressive sans (not Inter/Roboto/Arial/system default stacks as the brand voice)
- Brand overlay: HTML text, optically placed in the scene, scales on mobile, never covers the player
- Color tokens named for the world, e.g. `--henna`, `--diya`, `--marble`, `--indigo-dusk` (warm maroons / gold / dusk orange / deep indigo)

### Motion (exactly these three — no extras)

1. Player entrance on load  
2. Subtle glass sheen on hover  
3. World crossfade on switch  

Respect `prefers-reduced-motion` (keep opacity/color; drop movement).

**World crossfade detail:** Preload the **next** world image **before** completing the crossfade (no blank flash / half-loaded swap).

### Mobile-first (~390px primary)

- Header compresses; external links may be **icon-only** with accessible labels/tooltips (`aria-label` + visible tooltip or `title` equivalent that meets a11y)
- Player: near full-width with side padding; ~56–64px baseline, flexible if cramped; **≥44px** hit targets
- Safe-area insets for notched devices
- Test layout at **390 / 768 / 1280**

---

## 4. Config & data

All artwork paths, tracks, URLs, and world metadata are **config-driven** under `src/config/` (easy to replace later).

### `tracks.ts`

Ordered curated list. Initial set (titles may be adjusted to match chosen YouTube uploads):

1. Allah Hoo  
2. Mustt Mustt  
3. Tumhe Dillagi  
4. Sanu Ek Pal Chain  
5. Yeh Jo Halka Halka Suroor Hai  

Shape (illustrative):

```ts
{ id: string; title: string; artist: string; youtubeId: string }
```

Prefer legitimate / official or widely available embeds (e.g. Real World Records where applicable). IDs must be swappable without code changes beyond config.

### `worlds.ts`

```ts
defaultWorldId: 'dargah-dusk'
worlds: { id: string; label: string; image: string; brandLine?: string }[]
```

### `links.ts`

Spotify playlist URL + YouTube Music playlist/channel URL (header externals).

### Covers

Derive from YouTube thumbnail URL for `youtubeId` — no separate cover asset pipeline required for v1.

### Artwork assets

- Full-screen world images under `public/worlds/` (or equivalent)
- **Optimize/compress** for fast initial load (modern formats preferred, e.g. WebP/AVIF with fallback as needed; sensible max dimensions for 1×/2× viewports)
- Portrait Shrine: legitimate archival source + attribution note in repo README or asset sidecar if required by license
- Generated worlds (Mehfil, Truck/Chai, Dargah Dusk): produce via OpenAI (user has key) or equivalent during implementation; store compressed finals in repo

---

## 5. Playback & YouTube integration

### Iframe rules

- Viewport **≥ 200×200** (use **220×220**)
- Visually hidden / off-screen (`position: fixed` off-viewport or equivalent) — **never 0×0**
- `enablejsapi=1`, controls hidden on the iframe itself (custom UI only)

### Autoplay policy

- **Do not autoplay audio**
- Cue / ready first track on load; show metadata immediately
- **First user interaction** (Play tap) starts playback and unmutes as needed

### Controls

- Play / Pause, Previous, Next
- Seek bar mirrors `getCurrentTime` / `getDuration` while playing
- On `ENDED` → advance to next; loop to start of list

### Errors & unavailable tracks

On YouTube `onError` codes **2, 5, 100, 101, 150, 153** (and equivalents):

- Mark track as skipped for this session
- Auto-advance to next playable track
- If **all** fail: quiet “Track unavailable” state; disable controls; no crash; no modal

### Loading UX

- Light play-button pulse / opacity until player `onReady`
- No full-page spinner

### Online pill

Cosmetic fake count (Saloon vibe) — no backend for v1.

---

## 6. Components

| Component / module | Responsibility |
|--------------------|----------------|
| `App` | Shell, world state, reduced-motion |
| `WorldScene` | Full-bleed art + HTML brand overlay; crossfade + preload next image |
| `Header` | Time, online pill, world `<select>`, external links |
| `GlassPlayer` | Compact glass UI; metadata; seek; transport |
| `useYouTubePlayer` | Iframe lifecycle; play/pause/seek; skip-on-error |
| `src/config/*` | Tracks, worlds, links only |

Keep modules thin. No music CMS, auth, or backend.

---

## 7. Testing

**Manual**

- 390 / 768 / 1280 layouts (header, brand overlay, player)
- Play / pause / prev / next / seek
- World switch + image preload before crossfade completes
- Skip path for a deliberately bad `youtubeId`
- Icon-only external links: accessible name announced / tooltip present

**Smoke**

- Production build succeeds
- **Hard refresh restores the default world** (explicit smoke check)
- YT `onReady` once per deploy sanity

No heavy automated suite for v1.

---

## 8. Out of scope (v1)

- Custom domain  
- Real presence / analytics backend  
- Accounts, lyrics, queue UI, search  
- Self-hosted audio files  
- WebGL / liquid-glass refraction libraries  
- Extra animations beyond the three specified  
- Any feature or architecture not listed here **without asking first**

---

## 9. Implementation notes (final)

1. Preload the next world image before completing the world crossfade.  
2. Do not autoplay audio; first user interaction starts playback.  
3. Mobile player flexible enough to grow slightly if metadata/controls are cramped.  
4. Optimize/compress full-screen artwork for fast initial loading.  
5. Icon-only external links get accessible labels/tooltips.  
6. Smoke check: refreshing the page correctly restores the default world.  
7. Keep scope exactly as specified.

---

## 10. Ship sequence (high level)

1. Vite + React + TS scaffold  
2. Config modules + placeholder/final world assets  
3. Header + WorldScene + brand overlay  
4. GlassPlayer UI  
5. `useYouTubePlayer` + error skip  
6. World switch + preload/crossfade  
7. Mobile polish @ 390px  
8. Asset compression pass  
9. Vercel deploy  

---

## 11. Success criteria

- Feels like a Saloon-style place, not a music app chrome clone with different art  
- Open → see world + player; one tap → music  
- Four worlds switch smoothly with preloaded crossfade  
- Dead YouTube IDs skip without breaking the session  
- Fast first paint on mobile; artwork compressed  
- Config-only edits for tracks/worlds/links/art paths  
