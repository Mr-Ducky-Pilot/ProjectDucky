# ProjectDucky — Architecture Reference for Claude

This file is the canonical reference for Claude Code when continuing development.
Read it at the start of every session before touching any code.

---

## What We're Building

**Ducky** — an open-source STEM kit for kids aged 10–18. Two micro:bit v2 boards + Grove OLED 1.12" displays. A browser companion app (SvelteKit) guides kids through a 6-level "duck lifecycle":

```
🥚 Egg (L0) → 🐣 Hatch (L1) → 🐥 Waddle (L2) → 🦆 Swim (L3) → 🪶 Feather (L4) → 🌟 Soar (L5)
```

Levels 0–1 are **no-code** (flash pre-built firmware, play with sensors).
Levels 2+ add MakeCode block coding, then JavaScript/MicroPython.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | SvelteKit 2 + Svelte 5 (runes mode) + TypeScript |
| Styling | Tailwind v4 (`@theme` tokens in `src/app.css`) |
| Package manager | **npm** |
| Hardware | micro:bit v2, Grove OLED 1.12" |
| USB | DAPjs + WebUSB (Chrome/Edge only) |
| Firmware | MicroPython V2.1.1 + `@microbit/microbit-fs` for dynamic hex assembly |

---

## Key Directories

```
src/
  routes/
    +page.svelte                          Landing page
    journey/+page.svelte                  6-egg lifecycle map
    level/[level]/+page.svelte            Mission list per level
    mission/[level]/[mission]/+page.svelte  Mission page (loaded by +page.ts)
    connect/+page.svelte                  WebUSB pairing flow
    dev/components/+page.svelte           Component gallery
  lib/
    levels/
      00-egg/missions/<id>/               One folder per mission:
        mission.meta.ts                   MissionMeta (title, preset, hardware, etc.)
        concept.md                        "Why this works" card (rendered by ConceptCard)
        code.md                           Firmware snippet explainer (rendered by CodeCard)
        Interactive.svelte                Browser companion UI (optional)
    components/                           Shared UI components
    stores/
      connection.ts                       WebUSB state + send/flash/streamSensor/waitForReady
      progress.ts                         localStorage-backed completion state
      ducky.ts                            Ducky mood + speech bubble
    webusb/
      index.ts                            Adapter factory (real vs mock)
      dapjs.ts                            Real DAPLink/WebUSB adapter
      mock.ts                             Fake device for browser-only dev
      protocol.ts                         Wire protocol types + encode/decode
    missions/
      types.ts                            MissionMeta + Mission types
      registry.ts                         import.meta.glob auto-discovery
    firmware/
      ducky_os.py                         Universal-listener MicroPython firmware
      build.ts                            @microbit/microbit-fs hex assembler
    data/
      font3x5.ts                          3×5 LED pixel font + renderText()
static/
  firmware/micropython-v2.hex             MicroPython V2.1.1 runtime (1.2 MB)
```

---

## Wire Protocol (`src/lib/webusb/protocol.ts`)

Single line-delimited ASCII protocol over USB serial (115200 baud).

### Browser → Board

| Command | Wire | Meaning |
|---|---|---|
| `matrix` | `M:0101011111...` | Set 5×5 LED matrix (25 bits) |
| `scroll` | `N:HELLO` | Scroll text on matrix (loops forever) |
| `face` | `F:happy` | Show a named face |
| `tone` | `T:C4,200;E4,400` | Play tone sequence |
| `subscribe` | `S?accel` | Start streaming a sensor at ~10 Hz |
| `unsubscribe` | `S!accel` | Stop streaming |
| `preset` | `P:heartbeat` | Activate a named behaviour preset |
| `light-threshold` | `L:80` | Update hide-peek light threshold live |
| `radio-send` | `R:1` | Broadcast a radio packet |
| `quit` | `Q` | Stop current preset, return to on-board menu |

### Board → Browser

| Event | Wire | Meaning |
|---|---|---|
| `sensor` | `<S accel 0.1,0.0,1.0>` | Sensor sample |
| `button` | `<B A down>` | Button A or B pressed/released |
| `touch` | `<T down>` | Logo touch start/end |
| `radio` | `<R 42>` | Radio packet received |
| `log` | `<L message>` | Free-form debug / boot message |

**Boot message:** `<L Ducky OS ready>` — emitted when firmware is fully initialised.
`connection.waitForReady()` listens for this before sending preset commands.

---

## Firmware (`src/lib/firmware/ducky_os.py`)

Single universal-listener Python script. Key behaviours:

- Parses commands from UART in the main loop (non-blocking `uart.read()`).
- `preset` variable determines the active tick behaviour.
- Sensor streaming runs independently of preset (any sensor can be subscribed at any time).
- **On-board navigation** (standalone, no computer needed after one flash):
  - Boot → duck face (1s) → Menu mode showing mini-icon for selected activity
  - **A** = previous activity, **B** = next activity, **logo tap** = activate (enter Play mode)
  - **Logo held ≥1.5s** = always return to Menu (works from any preset)
  - Logo touch in `touch-logo` preset: short tap = quack, long hold = menu
- `P:preset` from browser overrides menu and activates preset immediately (backward compatible)
- `Q` command returns to on-board menu (was: blank screen)
- Quack sound: 3-note descending sequence (1100→750→450 Hz) in the `touch-logo` preset.

### Presets (L0 missions) + PRESET_LIST order

| Preset | Mission | Behaviour | Menu icon |
|---|---|---|---|
| `heartbeat` | 02 | Alternates big/small heart every 600ms | heart outline |
| `tap-wake` | 03 | Sleepy idle; happy face on button A | sleep face |
| `shake` | 04 | Dizzy on >1.5g shake; happy face to recover | X / dizzy |
| `hide-peek` | 06 | Happy/sad based on light vs `light_thresh` | plain face |
| `whisper` | 07 | Mic bargraph on LED matrix | sound burst |
| `touch-logo` | 08 | 3-note descending quack + happy face on logo touch | duck |
| `compass-quest` | 09 | 8-direction arrow on LED matrix | N arrow |

---

## Mission Framework

Adding a mission = drop a folder:
```
src/lib/levels/<level>/missions/<id>/
  mission.meta.ts     required
  concept.md          required  (rendered by ConceptCard.svelte)
  code.md             optional  (rendered by CodeCard.svelte, below main card)
  Interactive.svelte  optional  (lazy-loaded component)
```

`registry.ts` uses `import.meta.glob` — no manual registration.

### `MissionMeta` shape (key fields)

```ts
{
  id: string           // "02-heartbeat"
  level: LevelId       // 0 | 1 | 2 | 3 | 4 | 5
  order: number        // display order within level
  preset?: string      // firmware preset name (triggers FlashButton)
  hardware: Sensor[]   // badges shown on mission card
  pairMode: boolean    // "Two ducks" badge
}
```

If `preset` is defined → `FlashButton` appears on the mission page.
Mission 01 has no preset — its Interactive handles flash + send inline.

---

## Hex Assembly Flow

**L0/L1 (Ducky OS firmware) — smart skip:**
```
FlashButton click
  IF connected AND lastFlashedFirmware === 'ducky-os':
    → skip flash entirely (near-instant)
    → connection.send({type:'preset', name})  or matrix clear
    → button label shows "Activate ▶" instead of "Send to Ducky"
  ELSE:
    → buildDuckyHex()              fetch runtime (cached) + assemble hex (cached)
    → connection.flash(buffer, 'ducky-os')  DAPLink flashes, board resets
    → connection.waitForReady()    waits for "<L Ducky OS ready>" (5s timeout)
    → connection.send({type:'preset', name})  or matrix clear
    → sets lastFlashedFirmware = 'ducky-os' in store
```

Level 0/1 overview page also shows a "Flash Ducky" card — flash once there and all missions are instant.

**L2 (custom user code):**
```
FlashCodeButton click (inside Interactive.svelte)
  → buildCustomHex(source)           fetch runtime (cached) + write user's main.py
                                      → returns ArrayBuffer (NOT cached — code changes each time)
  → connection.flash(buffer, 'custom')  DAPLink flashes, board resets
  → board boots → runs main.py automatically (user code, no ready signal sent)
  → sets lastFlashedFirmware = 'custom' — returning to L0/L1 will re-flash Ducky OS
  → no waitForReady() needed — board is self-contained after flash
```

---

## connection.ts API

```ts
connection.connect()                           // WebUSB device picker
connection.flash(source: string|ArrayBuffer)   // Flash firmware
connection.send(command: OutgoingCommand)      // Send serial command
connection.streamSensor(sensor, cb)            // Subscribe + stream; returns unsubscribe fn
connection.waitForReady(timeoutMs?)            // Promise resolves on boot message
connection.onReady(cb)                         // Event listener for every boot (for re-subscribe)
connection.onEvent(cb)                         // Listen to all IncomingEvents
connection.getState()                          // Synchronous snapshot of store state
```

### Sensor auto-resubscribe pattern (use in every sensor Interactive)

```svelte
onMount(() => {
  let off: (() => void) | null = null;

  async function subscribe() {
    try {
      off?.(); off = null;
      off = await connection.streamSensor('accel', ([x, y, z]) => { ... });
    } catch { /* not connected yet */ }
  }

  subscribe();                                    // works immediately in mock mode
  const offReady = connection.onReady(() => void subscribe()); // re-subscribe after flash

  return () => { off?.(); offReady(); };          // cleanup on unmount
});
```

---

## Mock Adapter

Selected automatically when WebUSB is unavailable, or via `VITE_USE_MOCK_USB=true`.

- `connect()` → 700ms delay → status 'connected'
- `flash()` → simulated progress over ~2.2s → emits `<L Ducky OS ready>` after 400ms
- Sensor streams: synthetic sine/random-walk values at ~90ms interval
- Radio send → loopback (echoes radio packet back to browser)

---

## Design Tokens (Tailwind v4 `@theme`)

```
--color-duck-yellow      #ffd23a    Primary brand
--color-pond-blue        #4cc1ff    Secondary / water
--color-egg-cream        #fff8ec    Background warmth
--color-sunset-coral     #ff7a6b    Warnings / accent
--color-leaf-green       #7ad44b    Success / data
--color-night-ink        #1c1f2e    LED matrix background
--color-mist             #eef0f5    Disabled / subtle
--color-night-soft       #5a5f7a    Secondary text
--shadow-soft            0 4px 24px rgba(0,0,0,0.08)
```

Font: `font-display` = Nunito (rounded, kid-friendly). `font-mono` = JetBrains Mono.

---

## What's Complete

### Level 0 — Egg (8 missions: 01–09, minus 05 + 10 removed)
- All missions fully wired with Browser Interactive + firmware presets
- `code.md` + `concept.md` explainer cards on every mission
- `ducky_os.py` firmware: all presets implemented at 100% LED brightness (brightness 9)
- FlashButton → buildDuckyHex → waitForReady → P:`<preset>` flow
- Sensor auto-resubscribe after flash via `connection.onReady()`
- Board cleanup (`Q` command) sent on mission navigation
- Double-press A/B navigation (AA = prev, BB = next within 2s — single press passes through to game)
- Light threshold live-tuning (mission 06)
- Browser quack + audio toggle (mission 08)
- Boot now calls `display.clear()` instead of showing duck face (no random pattern between missions)
- Removed: `05-cold-hands` (less engaging), `10-wave-across` (requires 2 boards)

### Level 1 — Hatch (9 missions: 11, 13–20, minus 12 removed)
- All missions use Ducky OS universal firmware — no preset, browser sends commands directly
- FlashButton labelled "Start Ducky" shown at page level for all L1 missions
- After waitForReady: sends `M:000…` to clear display (blank slate for Interactive)
- `11-drawing-pad` — 5×5 paint grid, beam to board via `M:` command
- `13-welcome-jingle` — piano keyboard, plays via `T:` sequence + browser audio toggle
- `14-light-theremin` — light sensor → pitch mapping via `S?light` + `T:` per note
- `15-reaction-tester` — all-on/all-off matrix phases, board button A wires to tap
- `16-pixel-animator` — 3-frame flipbook, `M:` on timer
- `17-dice-roller` — shake detection via `S?accel`, dice dot patterns via `M:`
- `18-step-counter` — step state machine on accel stream, bargraph via `M:`
- `19-sound-alarm` — arm/disarm toggle, mic threshold, siren `T:` + flash `M:`
- `20-metronome` — BPM slider, tap-tempo, browser + board beat sync
- Removed: `12-mood-ring` (covered better by L0 Hide & Peek)

### Level 2 — Waddle (6 missions: 21–26)
- New component: `CodeEditor.svelte` — dark code block with `___` gaps as inline yellow inputs, "blanks left" counter
- New component: `FlashCodeButton.svelte` — like FlashButton but calls `buildCustomHex(code)` with user-assembled source; disabled until all gaps filled
- New component: `YourTurn.svelte` — dashed-border checklist challenge panel with celebration on completion
- New function: `buildCustomHex(source)` in `build.ts` — uncached, wraps same `@microbit/microbit-fs` as `buildDuckyHex`
- `21-clap-counter` — variables + single `if`, mic threshold + counter increment + sleep
- `22-mood-machine` — `if`/`elif`/`else`, two temperature thresholds → face
- `23-steady-hand` — compound condition + best-tracking, wobble limit + update speed
- `24-button-race` — game state + events, WIN target + two victory messages
- `25-night-light` — `for` loop + music API, dark threshold + flash count + tune name
- `26-dot-mover` — 2D coordinates + wrapping, start x/y + right edge value
- Each mission: `mission.meta.ts`, `Interactive.svelte`, `concept.md`, `code.md`
- Page-level FlashButton not shown for L2 (Interactive handles its own CodeEditor + FlashCodeButton)

### Infrastructure complete
- `ducky_os.py` universal firmware with all L0 presets + L1 command listener
- Dynamic hex assembly (`@microbit/microbit-fs`) for both Ducky OS and custom user code
- Mock WebUSB adapter for browser-only development
- Mission auto-discovery via `import.meta.glob` (drop a folder, it appears)
- Progress tracking in localStorage
- `MISSIONS.md` — full mission reference for all levels

---

## What's Next

### Level 2 polish
- Add `YourTurn` challenges to all 9 L1 missions (designs in `MISSIONS.md`)
- L2 Interactive improvements: show a live "what your code will do" preview per mission

### Level 3 — Swim (Radio pair missions, planned)
- Requires 2 boards; radio protocol already in Ducky OS (`R:` command, `<R …>` events)
- Missions: Secret Handshake, Hot Potato, Morse Code

### Level 4 — Feather (Blocks ↔ JavaScript reveal, planned)

### Level 5 — Soar (Open MicroPython sandbox, planned)

### Deferred
- OLED display integration (hardware risk, V2)
- Real Ducky illustrations (SVG placeholders ship now)
- Backend / accounts / sharing (V2 backlog)
