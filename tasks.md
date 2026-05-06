# 🦆 Ducky — Tasks

Work plan for the Ducky STEM kit companion app.
**See `CLAUDE.md` for full architecture reference.**

**Legend:** ⬜ todo · 🟨 in progress · ✅ done · 🚧 blocked

---

## ✅ Phase 1 — Foundation (Complete)

### M0 · Hardware Validation
- ✅ Flash MicroPython hex to micro:bit v2 via WebUSB (DAPjs + DAPLink)
- ✅ Ducky OS universal-listener firmware (`src/lib/firmware/ducky_os.py`)
- ✅ Dynamic hex assembly: runtime + Python bundled in-browser via `@microbit/microbit-fs`
- ✅ Serial protocol working — commands browser→board, events board→browser
- 🚧 Grove OLED 1.12" — deferred to V2 (hardware risk; 5×5 matrix only for MVP)

### M1 · App Shell & Routing
- ✅ SvelteKit 2 + Svelte 5 runes + TypeScript + Tailwind v4
- ✅ Routes: `/`, `/journey`, `/level/[level]`, `/mission/[level]/[mission]`, `/connect`, `/dev/components`
- ✅ Sticky header + Ducky brand + nav
- ✅ Design tokens: duck-yellow, pond-blue, egg-cream, sunset-coral, leaf-green, night-ink
- ✅ `progress` store (localStorage — completion + player name)
- ✅ Ducky mood + speech bubble stores
- ✅ 7-mood inline-SVG Ducky (idle/excited/thinking/celebrating/curious/sleepy/sad)
- ⬜ Deploy to Vercel/Cloudflare staging

### M2 · WebUSB Connection Layer
- ✅ Real DAPjs adapter (`dapjs.ts`) — connect, disconnect, flash, serial
- ✅ Mock WebUSB adapter (`mock.ts`) — full sensor simulation, emits ready event after flash
- ✅ ConnectionBar with live status (idle/requesting/connected/flashing/error)
- ✅ Dynamic hex builder (`firmware/build.ts`) — assembles Ducky OS in-browser, cached
- ✅ Correct boot sequence: flash → `waitForReady()` → send preset
- ✅ `onReady()` hook — sensor Interactives auto-resubscribe after flash
- ✅ `quit` command sent automatically when navigating away from any mission
- ✅ Universal wire protocol with encode/decode (`protocol.ts`)
- ✅ Persistent connection singleton across route changes
- ⬜ Browser compatibility warning (Chrome/Edge badge on connect page)

### M3 · Ducky Character System
- ✅ 7 mood SVG variants + idle bob animation
- ✅ SpeechBubble with typewriter effect
- ⬜ Real Ducky illustration (geometric placeholder ships now)

---

## ✅ Phase 2 — Level 0: The Egg (Complete)

All 10 missions functional end-to-end with real micro:bit v2.

| # | Mission | Interactive | Preset | Docs |
|---|---|---|---|---|
| 01 | Ducky Says Hi | ✅ char-by-char display, flash+send inline | N: command | ✅ |
| 02 | Heartbeat | ✅ pulsing heart matrix (correct bitmap) | `heartbeat` | ✅ |
| 03 | Tap to Wake | ✅ ripple + real button events | `tap-wake` | ✅ |
| 04 | Shake It | ✅ 3-axis live meters + auto-resubscribe | `shake` | ✅ |
| 05 | Cold Hands | ✅ thermometer + CPU temp clarification | `cold-hands` | ✅ |
| 06 | Hide & Peek | ✅ lux meter + live threshold slider | `hide-peek` | ✅ |
| 07 | Whisper/Shout | ✅ VU meter + LED matrix mirror | `whisper` | ✅ |
| 08 | Touch Logo | ✅ browser quack (Web Audio) + 🔊/🔇 toggle | `touch-logo` | ✅ |
| 09 | Compass Quest | ✅ compass dial + direction label | `compass-quest` | ✅ |
| 10 | Wave Across | ✅ two-duck pair UI + radio loopback | `wave-across` | ✅ |

**L0 infrastructure:**
- ✅ FlashButton → buildDuckyHex → waitForReady → P:<preset>
- ✅ Board cleanup: `Q` sent when navigating away
- ✅ Board A/B button navigation (B = next mission, A = prev mission)
- ✅ Next/prev mission breadcrumbs + emoji arrows in header
- ✅ CodeCard component (dark terminal, Python syntax highlighting, no external lib)
- ✅ ConceptCard component (inline markdown renderer)
- ✅ Light threshold live-update via `L:` command (mission 06)
- ✅ Touch debounce: 4 consecutive polls required (~60ms)
- ✅ Quack: 3-note descending sequence on board + Web Audio API in browser
- ✅ Sensor auto-resubscribe after flash via `onReady()` pattern

---

## 🟨 Phase 2 — Level 1: Hatch (Scaffolded, needs hardware wiring)

Same Ducky OS firmware — no new presets. Browser sends M:/T:/S? commands directly.

| # | Mission | Status |
|---|---|---|
| 11 | Drawing Pad → Matrix | ✅ scaffolded, ⬜ hardware test |
| 12 | Mood Ring | ✅ scaffolded, ⬜ hardware test |
| 13 | Welcome Jingle | ✅ scaffolded, ⬜ hardware test |
| 14 | Light Theremin | ✅ scaffolded, ⬜ hardware test |
| 15 | Reaction Tester | ✅ scaffolded, ⬜ hardware test |

- ⬜ Wire L1 Interactives to real hardware
- ⬜ code.md + concept.md for L1 missions
- ⬜ Audio toggle for L1 piano/theremin missions

---

## ⬜ Phase 3 — Level 2: Waddle (Block coding with MakeCode)

- ⬜ MakeCode iframe embed + postMessage compile→flash
- ⬜ Starter template loading per mission
- ⬜ Mission ideas: **Snake game**, Magic 8-Ball, Pet, Name Badge, Stopwatch
  - Snake game is perfect for first block-coding mission — simple enough for blocks, satisfying to play

---

## ⬜ Phase 4 — Levels 3–5

- ⬜ L3 Swim: radio pair missions (Secret Handshake, Hot Potato)
- ⬜ L4 Feather: blocks ↔ JavaScript reveal moment
- ⬜ L5 Soar: open sandbox + farewell

---

## ⬜ Phase 5 — Polish & Launch

- ⬜ Print mission cards (PDF + QR codes)
- ⬜ Packaging mockup
- ⬜ Accessibility (keyboard nav, font size, high contrast, screen reader)
- ⬜ Browser compatibility warning
- ⬜ Pilot with 3–5 kids aged 10–14

---

## 💡 Backlog

- **Snake + simple games** as L2 missions — kids build it themselves in blocks
- **Web Bluetooth** (no USB cable needed)
- Teacher dashboard
- Community project gallery
- Localisation
- Three-device radio experiences
- Native mobile wrapper (Capacitor)
