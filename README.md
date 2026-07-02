# 🦆 Ducky

> *Two devices. One friendship. Infinite ideas.*

**Ducky** is a free, browser-based, open-ended learning kit that uses two `Micro:bit v2` boards to get kids aged 10–18 (8+ stretch) genuinely excited about STEM. Through play, pairs, sensors, and progressive coding mastery — guided by **Ducky**, a friendly duck companion who lives in the browser.

This repo is the source for the **Ducky web app** and supporting content (mission cards, packaging mockups, character assets).

---

## Project Status

🚧 **Pre-MVP — under active development.** Targeting a kid-testable MVP in ~3 weeks (solo dev with AI copilot).

---

## What We're Building

### The Experience
A web app that runs in Chrome/Edge, with no install, that:

1. Connects to a Micro:bit over USB cable (`WebUSB` via [DAPjs](https://github.com/ARMmbed/dapjs))
2. Walks a kid through six progressive **levels** modeled on a duck's lifecycle: 🥚 Egg → 🐣 Hatch → 🐥 Waddle → 🦆 Swim → 🪶 Feather → 🌟 Soar
3. Offers **missions** at each level — but treats them as starting points, not assignments. Lab Mode, What-If prompts, Discovery activities, and Remix challenges sit alongside structured missions.
4. Embeds **MakeCode** in an iframe for actual block/text coding (Levels 2–5)
5. Flashes pre-compiled `.hex` files for early levels (0–1) so kids feel the magic before they ever see code
6. Pairs two Micro:bits over the built-in 2.4 GHz radio for two-player experiences (Level 3+)

### The Philosophy
- **Low floor, wide walls, high ceiling.** Anyone can start in 10 minutes. Many creative paths. Never a ceiling.
- **No completion gates.** All levels visible from day one. Nothing locks.
- **Open-ended by structural design.** Missions are seeds, not assignments. Lab Mode is at every level. Failure isn't a state.
- **Inclusive by default.** Theme is connection — universally appealing. Wide walls span art / music / games / science / movement / wellbeing simultaneously.

### Out of Scope (MVP)
- ❌ Native mobile app (web only)
- ❌ Safari support (no Web Bluetooth/USB)
- ❌ Backend / accounts (localStorage only at MVP)
- ❌ Project sharing platform (local export only)
- ❌ Real-time voice/audio streaming (Micro:bit hardware can't)
- ❌ Teacher dashboard (V2 feature)

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Device I/O | **DAPjs** (`WebUSB`) | Industry standard for Micro:bit |
| Editor | **MakeCode iframe embed** | `postMessage` API, avoids reinventing block editor |
| Storage | `localStorage` (MVP) | No backend at MVP |
| Hosting | **Vercel**  | Free tier sufficient |

### Architecture: Hybrid Shell + MakeCode Embed

┌──────────────────────────────────────────┐
│  Ducky Web App (this repo)               │
│  ┌────────────────────────────────────┐  │
│  │ Level system, journey, missions    │  │
│  │ Ducky character + dialogue         │  │
│  │ Branding, accessibility, onboarding│  │
│  │ Mission card UI                    │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ WebUSB layer (DAPjs)               │  │
│  │ - Connect / disconnect             │  │
│  │ - Flash .hex                       │  │
│  │ - Read serial                      │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ MakeCode iframe (Levels 2–5)       │  │
│  │ Communicates via postMessage       │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
↓ USB
┌───────────────┐
│  Micro:bit v2 │
└───────────────┘
↕ 2.4 GHz radio
┌───────────────┐
│  Micro:bit v2 │
└───────────────┘

**Why hybrid (not from scratch, not full fork):**
- Building a block editor that compiles to `.hex` would take months. MakeCode already does it brilliantly, MIT-licensed, supports iframe embedding via `postMessage`.
- Forking the editor means maintaining a fork forever. Embedding gives us the editor for free while keeping our shell lightweight.
- Levels 0–1 don't even need the editor — pre-compiled hex files flash directly. The editor only loads from Level 2 onward.

---



## Hardware

### Box Contents (planned for kit)
| Item | Qty | Notes |
|---|---|---|
| Micro:bit v2 | 2 | nRF52833, BLE, mic, speaker, accelerometer, compass, temp, light |
| Battery pack (3×AAA) | 2 | Portable power |
| USB-A → Micro-USB cable | 2 | Programming + power |
| Mission cards (printed) | 1 set | Tangible prompts |
| Sticker sheet | 2 | Personalisation |
| Quick-start fold-out card | 1 | Screenless first 10 minutes |
| Ducky character card | 1 | Intro + QR to web app |

### Browser Compatibility
| Browser | WebUSB | Web Bluetooth | Status |
|---|---|---|---|
| Chrome (desktop) | ✅ | ✅ | **Primary target** |
| Edge | ✅ | ✅ | Supported |
| Safari | ❌ | ❌ | Not supported (MVP) |
| Firefox | ❌ | ❌ | Not supported (MVP) |

The quick-start card explicitly directs users to Chrome.

---

## Companion Documents

- **Notion: Project Plan** — full project overview, philosophy, levels, story cards, risks, test plan
- **Notion: Mission Library** — 28+ early missions with sensor field guide, what-if prompts, discovery activities, remix challenges
- **`docs/mission-library.md`** — full catalog of all 78 missions across all 6 levels, generated from `mission.meta.ts`
- **`tasks.md`** — modular work plan with task checklists


---

## License

TBD — leaning **MIT** (matches Micro:bit + MakeCode ethos).

---

## Acknowledgements

- The [micro:bit Educational Foundation](https://microbit.org/) for genuinely great hardware
- The [Microsoft MakeCode](https://makecode.com/) team for an editor we can build on
- Mitchel Resnick & the Lifelong Kindergarten group at MIT — their *low floor, wide walls, high ceiling* framing is the philosophical spine of this project