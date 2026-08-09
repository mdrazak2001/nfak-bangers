# NFAK Bangers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Saloon-style Vite/React SPA that plays curated NFAK YouTube tracks through a compact liquid-glass player over four switchable full-bleed worlds.

**Architecture:** Static Vite + React + TypeScript app. Config modules own tracks/worlds/links. A hidden 220×220 YouTube iframe is controlled by `useYouTubePlayer`. `WorldScene` owns full-bleed art, HTML brand overlay, image preload, and the only world crossfade. No backend, no world persistence.

**Tech Stack:** Vite 6, React 19, TypeScript, Vitest, CSS modules (or plain CSS with design tokens), YouTube IFrame API, Vercel static deploy.

**Spec:** `docs/superpowers/specs/2026-08-10-nfak-bangers-design.md`

## Global Constraints

- Brand title: **NFAK Bangers**
- Default world: **`dargah-dusk`** via `defaultWorldId` — hard refresh restores it; **do not** persist last world
- YouTube iframe: **220×220**, off-screen, **never 0×0**
- **Do not autoplay audio** — first user Play interaction starts playback
- Motion only: player entrance, glass hover sheen, world crossfade (+ `prefers-reduced-motion`)
- Preload next world image **before** completing crossfade
- Mobile-first; verify **390px**; player may grow slightly if cramped; hit targets ≥44px
- Icon-only external links need `aria-label` + accessible tooltip/`title`
- Optimize/compress full-screen artwork
- Config-driven tracks/worlds/links/art paths only
- **No additional features or architecture without asking first**
- Visual reference: Saloon screenshot in workspace `assets/`

---

## File structure

```
nfak_bangers/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json
├── README.md
├── public/
│   └── worlds/
│       ├── mehfil.webp
│       ├── truck-chai.webp
│       ├── portrait-shrine.webp
│       ├── dargah-dusk.webp
│       └── ATTRIBUTION.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── vite-env.d.ts
│   ├── styles/
│   │   └── tokens.css
│   ├── config/
│   │   ├── tracks.ts
│   │   ├── worlds.ts
│   │   ├── links.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── youtube.ts          # thumbnail URL, YT types helpers
│   │   ├── playback.ts         # nextPlayableIndex pure logic
│   │   └── preloadImage.ts
│   ├── hooks/
│   │   └── useYouTubePlayer.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Header.css
│   │   ├── WorldScene.tsx
│   │   ├── WorldScene.css
│   │   ├── GlassPlayer.tsx
│   │   └── GlassPlayer.css
│   └── test/
│       ├── playback.test.ts
│       ├── worlds.test.ts
│       └── youtube.test.ts
└── docs/superpowers/specs/2026-08-10-nfak-bangers-design.md
```

---

### Task 1: Scaffold Vite + React + TS + Vitest

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/styles/tokens.css`, `src/App.css`
- Test: verify `npm run build` and `npm test` run

**Interfaces:**
- Consumes: none
- Produces: runnable Vite app shell with token CSS imported from `main.tsx`

- [ ] **Step 1: Scaffold the project**

From repo root (`c:\Users\moham\Projects\nfak_bangers`):

```bash
npm create vite@latest . -- --template react-ts
```

If the directory is non-empty (docs exist), scaffold in a temp folder and move app files into root, **keeping** `docs/` and `.git/`.

Install deps + Vitest:

```bash
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Configure Vitest in `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Add design tokens**

Replace default Vite styles. Create `src/styles/tokens.css`:

```css
:root {
  --henna: #7a1f2b;
  --diya: #e8a54b;
  --marble: #e7e0d6;
  --indigo-dusk: #1a1630;
  --ink: rgba(255, 255, 255, 0.96);
  --ink-muted: rgba(255, 255, 255, 0.62);
  --glass: rgba(20, 14, 24, 0.42);
  --glass-border: rgba(255, 255, 255, 0.18);
  --online: #3ddc84;
  --font-ui: "Syne", "Segoe UI", sans-serif;
  --font-brand: "Cormorant Garamond", Georgia, serif;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --player-pad-x: 16px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

Load fonts in `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>NFAK Bangers</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Syne:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/App.tsx` temporary shell:

```tsx
export default function App() {
  return <main className="app">NFAK Bangers</main>
}
```

`src/App.css`:

```css
* { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; }
body {
  font-family: var(--font-ui);
  background: var(--indigo-dusk);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.app { min-height: 100%; }
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './App.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: Verify scaffold**

```bash
npm test
npm run build
```

Expected: tests exit 0 (0 tests ok); build succeeds.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src
git commit -m "chore: scaffold Vite React TS app with Vitest and tokens"
```

---

### Task 2: Config modules + pure helpers (TDD)

**Files:**
- Create: `src/config/tracks.ts`, `src/config/worlds.ts`, `src/config/links.ts`, `src/config/index.ts`, `src/lib/youtube.ts`, `src/lib/playback.ts`, `src/lib/preloadImage.ts`
- Test: `src/test/worlds.test.ts`, `src/test/youtube.test.ts`, `src/test/playback.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `tracks: Track[]`
  - `defaultWorldId: 'dargah-dusk'`
  - `worlds: World[]`
  - `getWorld(id: string): World | undefined`
  - `links: { spotify: string; youtubeMusic: string }`
  - `youtubeThumb(youtubeId: string, quality?: 'hqdefault' | 'mqdefault'): string`
  - `nextPlayableIndex(current: number, skipped: Set<number>, length: number, direction: 1 | -1): number | null`
  - `preloadImage(src: string): Promise<void>`

- [ ] **Step 1: Write failing tests**

`src/test/worlds.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { defaultWorldId, worlds, getWorld } from '../config/worlds'

describe('worlds config', () => {
  it('defaults to dargah-dusk', () => {
    expect(defaultWorldId).toBe('dargah-dusk')
  })

  it('includes all four worlds', () => {
    expect(worlds.map((w) => w.id).sort()).toEqual(
      ['dargah-dusk', 'mehfil', 'portrait-shrine', 'truck-chai'].sort(),
    )
  })

  it('getWorld returns matching world', () => {
    expect(getWorld('mehfil')?.label).toBe('Mehfil')
  })
})
```

`src/test/youtube.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { youtubeThumb } from '../lib/youtube'

describe('youtubeThumb', () => {
  it('builds hqdefault url', () => {
    expect(youtubeThumb('fDy-sUF7gLc')).toBe(
      'https://i.ytimg.com/vi/fDy-sUF7gLc/hqdefault.jpg',
    )
  })
})
```

`src/test/playback.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nextPlayableIndex } from '../lib/playback'

describe('nextPlayableIndex', () => {
  it('advances forward skipping marked indices', () => {
    const skipped = new Set([1])
    expect(nextPlayableIndex(0, skipped, 5, 1)).toBe(2)
  })

  it('wraps around', () => {
    expect(nextPlayableIndex(4, new Set(), 5, 1)).toBe(0)
  })

  it('returns null when all skipped', () => {
    const skipped = new Set([0, 1, 2])
    expect(nextPlayableIndex(0, skipped, 3, 1)).toBe(null)
  })

  it('goes backward', () => {
    expect(nextPlayableIndex(0, new Set(), 5, -1)).toBe(4)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL — modules not found / exports missing.

- [ ] **Step 3: Implement config + helpers**

**Before writing `tracks.ts`:** look up an embeddable YouTube video for “Sanu Ek Pal Chain” / “Sanoon Ek Pal Chain Na” by Nusrat (prefer EMI Pakistan or OSA). Copy the 11-character `v=` ID and use it in place of `SANU_ID_11CH`. Do not commit the sentinel.

`src/config/tracks.ts`:

```ts
export type Track = {
  id: string
  title: string
  artist: string
  youtubeId: string
}

/** Swap/reorder freely — playback reads this array only. Verify embeds still work after edits. */
export const tracks: Track[] = [
  {
    id: 'allah-hoo',
    title: 'Allah Hoo',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'fDy-sUF7gLc', // Real World — WOMAD 1992
  },
  {
    id: 'mustt-mustt',
    title: 'Mustt Mustt',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'SDfELfpumEE', // Real World — WOMAD 1992
  },
  {
    id: 'tumhe-dillagi',
    title: 'Tumhe Dillagi',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'X0aWquXGXXU', // Complete original recording — verify embed in Task 8
  },
  {
    id: 'sanu-ek-pal',
    title: 'Sanu Ek Pal Chain',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'SANU_ID_11CH', // replace with real 11-char ID before commit (see Step 3 note)
  },
  {
    id: 'halka-halka',
    title: 'Yeh Jo Halka Halka Suroor Hai',
    artist: 'Nusrat Fateh Ali Khan',
    youtubeId: 'UIPXHsUXVH0', // OSA Official HD — verify embed
  },
]
```

> **Note for implementer:** IDs for Tumhe Dillagi / Sanu Ek Pal Chain above may need replacement if embed-blocked. During Task 8, open each ID in an embed test; on error 101/150, find an embeddable alternate and **only** change `tracks.ts`. Prefer OSA / Real World / official channels.

`src/config/worlds.ts`:

```ts
export type World = {
  id: string
  label: string
  image: string
  brandLine?: string
}

export const defaultWorldId = 'dargah-dusk' as const

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
```

`src/config/links.ts`:

```ts
export const links = {
  // Replace with your preferred public playlists anytime
  spotify: 'https://open.spotify.com/search/Nusrat%20Fateh%20Ali%20Khan',
  youtubeMusic: 'https://music.youtube.com/search?q=nusrat+fateh+ali+khan',
}
```

`src/config/index.ts`:

```ts
export * from './tracks'
export * from './worlds'
export * from './links'
```

`src/lib/youtube.ts`:

```ts
export function youtubeThumb(
  youtubeId: string,
  quality: 'hqdefault' | 'mqdefault' = 'hqdefault',
): string {
  return `https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`
}
```

`src/lib/playback.ts`:

```ts
/**
 * Returns the next index that is not in `skipped`, moving in `direction`, wrapping.
 * Returns null if every index is skipped (or length is 0).
 */
export function nextPlayableIndex(
  current: number,
  skipped: Set<number>,
  length: number,
  direction: 1 | -1,
): number | null {
  if (length <= 0) return null
  if (skipped.size >= length) return null

  let i = current
  for (let n = 0; n < length; n++) {
    i = (i + direction + length) % length
    if (!skipped.has(i)) return i
  }
  return null
}
```

`src/lib/preloadImage.ts`:

```ts
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload ${src}`))
    img.src = src
  })
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/config src/lib src/test
git commit -m "feat: add config modules and playback helpers"
```

---

### Task 3: World artwork assets

**Files:**
- Create: `public/worlds/mehfil.webp`, `public/worlds/truck-chai.webp`, `public/worlds/portrait-shrine.webp`, `public/worlds/dargah-dusk.webp`, `public/worlds/ATTRIBUTION.md`
- Optional temp: PNG masters before compression

**Interfaces:**
- Consumes: paths from `worlds.ts`
- Produces: compressed WebP full-bleed images (~1920×1080 or 2560×1440 max; target each file **≤ 350KB** if possible without wrecking quality)

- [ ] **Step 1: Source / generate masters**

Use the user’s OpenAI key for three illustrated scenes (digital painting, saturated, Saloon-like stylization, **no readable baked text**):

1. **Mehfil** — night courtyard gathering, listeners, soft lamps, warm depth  
2. **Truck/Chai** — roadside night, truck silhouette, chai stall glow, radio mood  
3. **Dargah Dusk** — marble courtyard, dusk sky, diyas, subtle architecture; **respectful, not overloaded religious kitsch**

For **Portrait Shrine**:

1. Obtain a **legitimate archival** NFAK photograph (prefer Wikimedia Commons / public-domain or clearly licensed still)
2. Composite into a painted niche/shrine frame with atmospheric light (Photoshop / generative edit / manual composite) so it is **not** a raw rectangular photo dump
3. Record source URL + license in `public/worlds/ATTRIBUTION.md`

If generation is blocked in-session, create solid-color placeholder WebPs named correctly so UI work continues, then replace before deploy.

- [ ] **Step 2: Compress**

```bash
# Example with sharp-cli or squoosh-cli if available; otherwise export WebP quality ~75 from an editor
npx --yes @squoosh/cli --webp '{"quality":75}' -d public/worlds public/worlds-src/*.png
```

Or use any local compressor. Verify sizes:

```bash
Get-ChildItem public/worlds/*.webp | Select-Object Name, Length
```

- [ ] **Step 3: Write attribution**

`public/worlds/ATTRIBUTION.md`:

```markdown
# World artwork attribution

## portrait-shrine.webp
- Photo source: <URL>
- License: <license>
- Composite: NFAK Bangers project (painted niche / atmosphere)

## mehfil.webp, truck-chai.webp, dargah-dusk.webp
- Generated for NFAK Bangers (OpenAI / project assets)
- No third-party trademarks intended
```

- [ ] **Step 4: Smoke — images resolve**

```bash
npm run dev
```

Open `/worlds/dargah-dusk.webp` in the browser — image loads.

- [ ] **Step 5: Commit**

```bash
git add public/worlds
git commit -m "assets: add compressed world artwork with attribution"
```

---

### Task 4: `WorldScene` (preload + crossfade + brand overlay)

**Files:**
- Create: `src/components/WorldScene.tsx`, `src/components/WorldScene.css`
- Test: manual + optional unit test for preload failure fallback (manual ok per spec)

**Interfaces:**
- Consumes: `World` type; `preloadImage(src: string): Promise<void>`
- Produces: `<WorldScene world={World} reducedMotion={boolean} />`

- [ ] **Step 1: Implement `WorldScene`**

```tsx
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
        // Still swap — broken image is better than stuck UI
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
```

`WorldScene.css` (brand overlay integrated in scene — upper-middle third, not nav):

```css
.world-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--indigo-dusk);
}

.world-scene__layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 480ms cubic-bezier(0.23, 1, 0.32, 1);
}

.world-scene__layer--pre { opacity: 0; }
.world-scene__layer--in { opacity: 1; }
.world-scene__layer--out { opacity: 0; z-index: 1; }
.world-scene__layer--instant { transition: none; }

.world-scene__brand {
  position: absolute;
  left: 50%;
  top: 28%;
  transform: translateX(-50%);
  z-index: 2;
  margin: 0;
  padding: 0 var(--space-4);
  max-width: min(90vw, 16ch);
  text-align: center;
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: clamp(2.25rem, 8vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-wrap: balance;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
  pointer-events: none;
}

@media (max-width: 430px) {
  .world-scene__brand {
    top: 24%;
    font-size: clamp(2rem, 11vw, 2.75rem);
  }
}
```

- [ ] **Step 2: Wire temporarily in `App` for visual check**

```tsx
import { useMemo, useState } from 'react'
import { defaultWorldId, getWorld, worlds } from './config/worlds'
import { WorldScene } from './components/WorldScene'

export default function App() {
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const [worldId, setWorldId] = useState(defaultWorldId)
  const world = getWorld(worldId) ?? getWorld(defaultWorldId)!

  return (
    <main className="app">
      <WorldScene world={world} reducedMotion={reducedMotion} />
      <label style={{ position: 'fixed', zIndex: 5, top: 8, left: 8 }}>
        World
        <select value={worldId} onChange={(e) => setWorldId(e.target.value)}>
          {worlds.map((w) => (
            <option key={w.id} value={w.id}>{w.label}</option>
          ))}
        </select>
      </label>
    </main>
  )
}
```

- [ ] **Step 3: Manual test**

```bash
npm run dev
```

- Switch worlds: no blank flash; crossfade after load  
- Hard refresh: always `dargah-dusk`  
- Resize to 390px: brand readable, not covering bottom

- [ ] **Step 4: Commit**

```bash
git add src/components/WorldScene.tsx src/components/WorldScene.css src/App.tsx
git commit -m "feat: add WorldScene with preload crossfade and brand overlay"
```

---

### Task 5: `Header`

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Header.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `worlds`, `worldId`, `onWorldChange`, `links`, fake online count
- Produces: `<Header worldId onWorldChange onlineCount />`

- [ ] **Step 1: Implement Header**

```tsx
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
      <time className="header__time" dateTime={new Date().toISOString()}>{now}</time>

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
              <option key={w.id} value={w.id}>{w.label}</option>
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
```

`Header.css` — Saloon distribution; at 390px collapse link text if needed but **keep** `aria-label` + `title`:

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-2);
  padding: calc(var(--space-3) + env(safe-area-inset-top, 0px)) var(--space-4) var(--space-3);
  pointer-events: none;
}

.header > * { pointer-events: auto; }

.header__time {
  justify-self: start;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.header__center {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header__online {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--glass-border);
  font-size: 12px;
  color: var(--ink);
  backdrop-filter: blur(10px);
}

.header__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--online);
  box-shadow: 0 0 0 2px rgba(61, 220, 132, 0.25);
}

.header__world select {
  appearance: none;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: rgba(0, 0, 0, 0.35);
  color: var(--ink);
  padding: 6px 28px 6px 10px;
  font: inherit;
  font-size: 12px;
  backdrop-filter: blur(10px);
  background-image: linear-gradient(45deg, transparent 50%, #fff 50%),
    linear-gradient(135deg, #fff 50%, transparent 50%);
  background-position: calc(100% - 14px) 55%, calc(100% - 10px) 55%;
  background-size: 4px 4px, 4px 4px;
  background-repeat: no-repeat;
}

.header__links {
  justify-self: end;
  display: flex;
  gap: var(--space-3);
}

.header__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--ink);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  min-height: 44px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 430px) {
  .header__link-text { display: none; }
  .header__online-text { max-width: 9ch; overflow: hidden; }
}
```

- [ ] **Step 2: Wire into App** (remove temp world label)

Online count: deterministic cosmetic fake — e.g. `28 + (dateDay % 17)` so refresh is stable enough for smoke but not a real backend.

```ts
const onlineCount = 28 + (new Date().getDate() % 17)
```

- [ ] **Step 3: Manual a11y check @ 390px**

- Icon-only links still expose “Open Spotify” / “Open YouTube Music” via accessible name  
- World `<select>` labeled  

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx src/components/Header.css src/App.tsx
git commit -m "feat: add Saloon-style header with world select and externals"
```

---

### Task 6: `GlassPlayer` presentational UI

**Files:**
- Create: `src/components/GlassPlayer.tsx`, `src/components/GlassPlayer.css`

**Interfaces:**
- Consumes: track meta, `coverUrl`, `isPlaying`, `isReady`, `isUnavailable`, `currentTime`, `duration`, callbacks
- Produces: compact glass capsule UI only (no YT logic)

- [ ] **Step 1: Implement GlassPlayer**

```tsx
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
    title, artist, coverUrl, isPlaying, isReady, isUnavailable,
    currentTime, duration, onPlayPause, onPrev, onNext, onSeek,
  } = props

  const disabled = isUnavailable || !isReady

  return (
    <div className={`glass-player ${isReady ? 'glass-player--ready' : ''}`}>
      <img className="glass-player__cover" src={coverUrl} alt="" width={44} height={44} />
      <div className="glass-player__meta">
        <div className="glass-player__title">{isUnavailable ? 'Track unavailable' : title}</div>
        <div className="glass-player__artist">{isUnavailable ? 'Try again later' : artist}</div>
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
          <span className="glass-player__time" aria-hidden>{fmt(currentTime)}</span>
        </div>
      </div>
      <div className="glass-player__controls">
        <button type="button" className="glass-player__btn" aria-label="Previous" disabled={disabled} onClick={onPrev}>⏮</button>
        <button
          type="button"
          className={`glass-player__btn glass-player__btn--play ${!isReady ? 'is-loading' : ''}`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isUnavailable}
          onClick={onPlayPause}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button type="button" className="glass-player__btn" aria-label="Next" disabled={disabled} onClick={onNext}>⏭</button>
      </div>
    </div>
  )
}
```

`GlassPlayer.css`:

```css
.glass-player {
  position: fixed;
  z-index: 20;
  left: 50%;
  bottom: calc(var(--space-5) + var(--safe-bottom));
  transform: translateX(-50%) translateY(12px);
  opacity: 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: min(520px, calc(100vw - (var(--player-pad-x) * 2)));
  min-height: 56px;
  padding: 10px 12px;
  border-radius: 22px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  animation: player-in 420ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.glass-player::after {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 40%);
  opacity: 0;
  transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1);
}

.glass-player:hover::after { opacity: 1; }

@keyframes player-in {
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .glass-player { animation: none; opacity: 1; transform: translateX(-50%); }
  .glass-player::after { transition: none; }
}

.glass-player__cover {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex: 0 0 auto;
  outline: 1px solid rgba(255,255,255,0.12);
  outline-offset: -1px;
}

.glass-player__meta { flex: 1 1 auto; min-width: 0; }

.glass-player__title {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.glass-player__artist {
  font-size: 11px;
  color: var(--ink-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.glass-player__seek-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.glass-player__seek {
  flex: 1;
  height: 3px;
  accent-color: var(--marble);
}

.glass-player__time {
  font-size: 10px;
  color: var(--ink-muted);
  font-variant-numeric: tabular-nums;
  min-width: 2.5rem;
}

.glass-player__controls {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
}

.glass-player__btn {
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  color: var(--ink);
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.glass-player__btn:active { transform: scale(0.97); }
.glass-player__btn:disabled { opacity: 0.35; cursor: not-allowed; }

.glass-player__btn--play {
  width: 40px;
  height: 40px;
  background: #fff;
  color: #111;
  font-size: 14px;
}

.glass-player__btn--play.is-loading {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  50% { opacity: 0.55; }
}

@media (max-width: 430px) {
  .glass-player {
    align-items: flex-start;
    flex-wrap: wrap;
    min-height: 64px;
    padding: 12px;
    border-radius: 20px;
  }
  .glass-player__controls { margin-left: auto; }
}
```

Replace emoji transport glyphs with inline SVGs if they render inconsistently — keep aria-labels identical.

- [ ] **Step 2: Visual check with mocked props in App**

Confirm Saloon-like compactness; artwork dominates; @390px player can wrap/grow slightly.

- [ ] **Step 3: Commit**

```bash
git add src/components/GlassPlayer.tsx src/components/GlassPlayer.css
git commit -m "feat: add compact liquid-glass player UI"
```

---

### Task 7: `useYouTubePlayer` hook

**Files:**
- Create: `src/hooks/useYouTubePlayer.ts`
- Modify: extend `src/vite-env.d.ts` for YT globals
- Test: logic already covered by `playback.test.ts`; manual YT integration in Task 8

**Interfaces:**
- Consumes: `tracks`, `nextPlayableIndex`, `youtubeThumb`
- Produces:

```ts
function useYouTubePlayer(trackList: Track[]): {
  hostRef: RefObject<HTMLDivElement | null>
  index: number
  track: Track | null
  isReady: boolean
  isPlaying: boolean
  isUnavailable: boolean
  currentTime: number
  duration: number
  playPause: () => void
  next: () => void
  prev: () => void
  seek: (seconds: number) => void
}
```

- [ ] **Step 1: Add YT types**

`src/vite-env.d.ts`:

```ts
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
    PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number }
  }
  onYouTubeIframeAPIReady?: () => void
}
```

- [ ] **Step 2: Implement hook**

```ts
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

  const [index, setIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUnavailable, setIsUnavailable] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const track = trackList[index] ?? null

  const cueIndex = useCallback((i: number, autoplay: boolean) => {
    const t = trackList[i]
    if (!t || !playerRef.current) return
    indexRef.current = i
    setIndex(i)
    wantPlayRef.current = autoplay
    if (autoplay) {
      playerRef.current.loadVideoById(t.youtubeId)
      playerRef.current.unMute()
      playerRef.current.playVideo()
    } else {
      playerRef.current.cueVideoById(t.youtubeId)
    }
  }, [trackList])

  const skipFrom = useCallback((from: number, direction: 1 | -1, autoplay: boolean) => {
    skippedRef.current.add(from)
    const next = nextPlayableIndex(from, skippedRef.current, trackList.length, direction)
    if (next === null) {
      setIsUnavailable(true)
      setIsPlaying(false)
      return
    }
    setIsUnavailable(false)
    cueIndex(next, autoplay)
  }, [cueIndex, trackList.length])

  useEffect(() => {
    let cancelled = false
    let poll: number | undefined

    ;(async () => {
      await loadApi()
      if (cancelled || !hostRef.current || !window.YT) return

      const first = trackList[0]
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
        },
        events: {
          onReady: () => {
            setIsReady(true)
            // Do NOT autoplay
          },
          onStateChange: (e: { data: number }) => {
            const YT = window.YT!
            if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true)
            if (e.data === YT.PlayerState.PAUSED) setIsPlaying(false)
            if (e.data === YT.PlayerState.ENDED) {
              skipFrom(indexRef.current, 1, true)
            }
          },
          onError: (e: { data: number }) => {
            if (YT_ERROR_CODES.has(e.data)) {
              skipFrom(indexRef.current, 1, wantPlayRef.current)
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
        } catch { /* player tearing down */ }
      }, 250)
    })()

    return () => {
      cancelled = true
      if (poll) window.clearInterval(poll)
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [skipFrom, trackList])

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
    skipFrom(indexRef.current, 1, isPlaying || wantPlayRef.current)
  }, [isPlaying, skipFrom])

  const prev = useCallback(() => {
    skipFrom(indexRef.current, -1, isPlaying || wantPlayRef.current)
  }, [isPlaying, skipFrom])

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
    playPause,
    next,
    prev,
    seek,
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useYouTubePlayer.ts src/vite-env.d.ts
git commit -m "feat: add useYouTubePlayer with skip-on-error"
```

---

### Task 8: Wire App end-to-end + hidden iframe

**Files:**
- Modify: `src/App.tsx`, `src/App.css`

**Interfaces:**
- Consumes: Header, WorldScene, GlassPlayer, useYouTubePlayer, config
- Produces: complete page

- [ ] **Step 1: Final `App.tsx`**

```tsx
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
  const [worldId, setWorldId] = useState(defaultWorldId)
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
          onPlayPause={player.playPause}
          onPrev={player.prev}
          onNext={player.next}
          onSeek={player.seek}
        />
      )}
    </main>
  )
}
```

`App.css` addition:

```css
.yt-host {
  position: fixed;
  width: 220px;
  height: 220px;
  left: -9999px;
  top: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
}
```

- [ ] **Step 2: Verify each track embeds**

For each `youtubeId` in `tracks.ts`, play via the UI. On embed error, replace **only** that ID in config. Optionally temporarily insert `youtubeId: 'INVALID____'` as first track to confirm skip advances.

- [ ] **Step 3: Confirm no autoplay**

Hard load page with sound on — audio must stay silent until Play.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/App.css src/config/tracks.ts
git commit -m "feat: wire full NFAK Bangers experience"
```

---

### Task 9: Mobile polish + smoke checklist

**Files:**
- Modify: CSS as needed (`Header.css`, `GlassPlayer.css`, `WorldScene.css`)
- Create: `vercel.json`, `README.md`

- [ ] **Step 1: Manual matrix**

| Check | 390 | 768 | 1280 |
|-------|-----|-----|------|
| Header readable / no overlap | ☐ | ☐ | ☐ |
| Brand overlay clear of player | ☐ | ☐ | ☐ |
| Player compact / can grow if cramped | ☐ | ☐ | ☐ |
| World crossfade preloads | ☐ | ☐ | ☐ |
| Play/pause/prev/next/seek | ☐ | ☐ | ☐ |
| Icon-only links have accessible names | ☐ | — | — |

- [ ] **Step 2: Refresh smoke**

1. Switch world to Mehfil  
2. Hard refresh  
3. Expect **Dargah Dusk** (`defaultWorldId`)

- [ ] **Step 3: Add `vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 4: README**

Include: what it is, how to run, config edit pointers (`src/config/*`), artwork attribution path, note that audio is YouTube-embedded.

- [ ] **Step 5: Production build**

```bash
npm test
npm run build
```

Expected: tests pass; `dist/` emitted.

- [ ] **Step 6: Commit**

```bash
git add vercel.json README.md src
git commit -m "chore: mobile polish, Vercel config, and README"
```

---

### Task 10: Deploy to Vercel

**Files:** none required beyond Task 9

- [ ] **Step 1: Deploy**

```bash
npx vercel --yes
```

Or connect the GitHub repo in the Vercel dashboard (user’s account).

- [ ] **Step 2: Post-deploy smoke**

- Open production URL on phone-width  
- No autoplay  
- Play works  
- Refresh restores Dargah Dusk  
- Spotify / YT Music links open  

- [ ] **Step 3: Commit any final track ID fixes only if needed**

```bash
git add src/config/tracks.ts
git commit -m "fix: replace non-embeddable YouTube track IDs"
```

---

## Spec coverage self-review

| Spec requirement | Task |
|------------------|------|
| Vite + React + TS + Vercel | 1, 9, 10 |
| Four worlds + dropdown | 2, 4, 5 |
| Default `dargah-dusk`, no persistence | 2, 4, 8, 9 |
| HTML brand overlay (not baked text) | 4 |
| Liquid glass compact player | 6 |
| YT 220×220 off-screen | 7, 8 |
| No audio autoplay | 7, 8 |
| Skip on YT errors | 2, 7 |
| Preload before crossfade | 4 |
| Motion trio + reduced motion | 4, 6 |
| Config-driven tracks/worlds/links | 2 |
| Compressed artwork + attribution | 3 |
| Mobile 390 + flexible player | 6, 9 |
| Icon-only a11y labels | 5, 9 |
| Refresh smoke default world | 9 |
| Saloon visual reference | 4–6, 9 |
| No extra features | Global Constraints |

**Placeholder scan:** Sanu track ID is resolved in Task 2 Step 3 before commit (procedure specified). Other IDs verified/replaced in Task 8 if embed-blocked.

**Type consistency:** `World`, `Track`, `defaultWorldId`, `nextPlayableIndex`, `preloadImage`, `youtubeThumb`, `GlassPlayerProps`, `useYouTubePlayer` return shape align across tasks.
