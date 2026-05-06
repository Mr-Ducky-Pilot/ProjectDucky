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
| `quit` | `Q` | Stop current preset, show duck face |

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
- Logo touch uses a **4-poll debounce** (~60ms) before firing.
- Quack sound: 3-note descending sequence (1100→750→450 Hz) in the `touch-logo` preset.

### Presets (L0 missions)

| Preset | Mission | Behaviour |
|---|---|---|
| `heartbeat` | 02 | Alternates big/small heart every 600ms |
| `tap-wake` | 03 | Sleepy idle; happy face on button A |
| `shake` | 04 | Dizzy on >1.5g shake; happy face to recover |
| `cold-hands` | 05 | Bargraph of `temperature() - 18` |
| `hide-peek` | 06 | Happy/sad based on light vs `light_thresh` |
| `whisper` | 07 | Mic bargraph on LED matrix |
| `touch-logo` | 08 | 3-note descending quack + happy face on logo touch |
| `compass-quest` | 09 | 8-direction arrow on LED matrix |
| `wave-across` | 10 | Button A → radio send 'w'; receive → wave animation |

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

```
User clicks "Send to Ducky"
  → buildDuckyHex()              fetch /static/firmware/micropython-v2.hex (cached)
                                  + write ducky_os.py via @microbit/microbit-fs
                                  → returns ArrayBuffer
  → connection.flash(buffer)     DAPLink flashes, board resets
  → connection.waitForReady()    waits for "<L Ducky OS ready>" (5s timeout)
  → connection.send({type:'preset', name})  sends P:<preset>
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

## What's Complete (Level 0)

All 10 L0 missions are fully wired:
- Browser Interactive components with real-time sensor display
- `code.md` + `concept.md` explainer cards
- `ducky_os.py` firmware presets
- FlashButton → buildDuckyHex → waitForReady → P:<preset> flow
- Sensor auto-resubscribe after flash
- Board cleanup (Q command) on mission navigation
- A/B button navigation between missions (B = next, A = prev)
- Light threshold live-tuning (mission 06)
- Browser quack with audio toggle (mission 08)
- Next/prev mission navigation with emoji breadcrumbs

---

## What's Next

- Level 1 (Hatch) Interactive components — drawing pad, piano, mood ring, theremin, reaction tester
- These use the same Ducky OS firmware (universal listener), no extra presets needed
- L1 sends commands directly: `M:` for matrix, `T:` for tones, `S?` for sensors
- Snake game / simple games are good L2 block-coding missions
- OLED display integration deferred to V2 (hardware risk)
