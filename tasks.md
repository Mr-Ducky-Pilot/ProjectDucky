# 🦆 Ducky — Tasks

Modular work plan for the 3-week MVP. Tasks are grouped into **phases** (gate the next phase) and **modules** (independent within a phase). Designed for solo dev with AI copilot.

**Legend:** ⬜ todo · 🟨 in progress · ✅ done · 🚧 blocked · 🔄 needs revisit

---

### Snapshot — what's already built

**Stack:** SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind v4. npm.

**Done in the first execution pass:**
- Duolingo-style landing page (mobile-first, hero / box contents / journey
  map / claims / audience toggle / final CTA).
- App shell: sticky header, journey map page, level pages, dynamic mission
  pages, connect page, dev component gallery.
- Modular **mission framework** with filesystem auto-discovery
  (`import.meta.glob`) — adding a mission = drop a folder under
  `src/lib/levels/<level>/missions/<id>/` with `mission.meta.ts`,
  `concept.md`, optional `Interactive.svelte`. Zero registration.
- Mock WebUSB layer with synthetic sensor streams + flash-progress sim,
  selected by `VITE_USE_MOCK_USB`. Real DAPjs adapter stubbed.
- Universal-listener wire protocol (`src/lib/webusb/protocol.ts`).
- 7-mood inline-SVG Ducky character with idle bob, swappable file-for-file
  with real illustrations later.
- All 10 Level-0 + all 5 Level-1 mission browser companions + concept cards.

**Blocked on M0 hardware validation:**
- Producing real `.hex` firmware files (per-mission for L0; one universal
  "Ducky OS" listener for L1+).
- Flipping `VITE_USE_MOCK_USB=false` to use the real DAPjs adapter.

**See `src/routes/dev/components/+page.svelte`** for a one-page sanity
check of every shared component + a directory of all missions.


---

## 🧱 Phase 1 — Foundation
*Must come first. Everything downstream depends on this.*

### M0 · Hardware Validation
**Goal:** Prove the stack works end-to-end. **Output:** A single hex file that uses OLED + radio + sensors.

- ⬜ Flash any MakeCode hex to Micro:bit v2 via WebUSB in Chrome
- ⬜ Verify Grove OLED 1.12" works on the Grove shield via I2C
- ⬜ Display "Hello Ducky" text on the OLED
- ⬜ Send a radio message from one Micro:bit to another
- ⬜ Verify second Micro:bit receives and responds
- ⬜ Read mic, accelerometer, button input — confirm in serial output
- ⬜ Decision: MicroPython or MakeCode for the source projects?
- ⬜ Decision: which OLED library (community lib vs custom MakeCode extension)
- 🚧 **Risk:** OLED library compatibility. **Fallback:** ship MVP using only the built-in 5×5 LED matrix; add OLED in V2.

### M1 · App Shell & Routing
**Goal:** Empty but navigable shell with brand applied.

> **Stack note (decided after planning):** front-end is **SvelteKit 2 + Svelte 5
> (runes mode) + TypeScript + Tailwind v4**. Replaces the originally proposed
> React/Vite/Zustand stack. Reasons: built-in `spring`/`tweened`/`crossfade`
> covers Duolingo-feel without Framer Motion; smaller bundle for school
> Chromebooks; Svelte stores fit hardware state better than `useEffect`. DAPjs
> + the eventual MakeCode iframe are framework-agnostic so we lose nothing.

- ✅ Initialise SvelteKit + TS + Tailwind v4 (npm)
- ✅ Filesystem router with placeholder pages
- ✅ Routes: `/`, `/journey`, `/level/[level]`, `/mission/[level]/[mission]`, `/connect`, `/dev/components` (+ planned `/lab/[level]`, `/sandbox`)
- ✅ Layout component (sticky header with Ducky brand + nav, no header on landing)
- ✅ Theme tokens (`duck-yellow`, `pond-blue`, `egg-cream`, `sunset-coral`, `leaf-green`, `night-ink`) in `src/app.css` via Tailwind v4 `@theme`
- ✅ `progress` Svelte store backed by `localStorage` (replaces `useProgress` hook)
- ✅ Svelte stores for app-wide state (`connection`, `ducky`, `progress`) — replaces Zustand
- ✅ Inline-SVG Ducky placeholder component with 7 mood variants (idle/excited/thinking/celebrating/curious/sleepy/sad)
- ⬜ Deploy to staging (Vercel/Cloudflare)

### M2 · WebUSB Connection Layer
**Goal:** Reliable "Connect Ducky" button anywhere in the app.

> **Hex strategy (added after planning):** We ship a hybrid of two approaches.
> Level 0 missions get **dedicated per-mission hex** — kid flashes once, board
> works standalone even unplugged (preserves the "real toy" feeling). Level 1+
> missions use a **single "Ducky OS" universal-listener hex** that listens on
> serial; the browser sends typed commands (`M:01010...`, `T:C4,200;E4,400`,
> `S?accel`) and the device pushes events back (`<S accel 0.12,...>`). Faster
> iteration, no flash per parameter tweak. Wire format lives in
> `src/lib/webusb/protocol.ts`.

- ⬜ Integrate DAPjs (real adapter — currently stubbed in `src/lib/webusb/dapjs.ts`)
- ✅ Mock WebUSB adapter (`src/lib/webusb/mock.ts`) so the whole UI is buildable + reviewable without hardware. Selected via `VITE_USE_MOCK_USB`.
- ✅ Connect / disconnect button with clear states (idle, requesting, connected, error, flashing) — `ConnectionBar.svelte` + `/connect` page
- ✅ Flash a `.hex` file from URL (mock simulates progress; real adapter pending M0)
- ⬜ Read serial output from Micro:bit (mock emits synthetic streams; real serial pending M0)
- ✅ Persistent connection across route changes (Svelte store + adapter singleton)
- ✅ Friendly error messages (Ducky-narrated)
- ⬜ Browser compatibility check on app load — friendly Chrome/Edge message for unsupported browsers
- ⬜ Test with two Micro:bits connected simultaneously
- ✅ Universal-listener wire protocol implemented (`src/lib/webusb/protocol.ts`)

### M3 · Ducky Character System
**Goal:** Ducky reacts to navigation and events with personality.

- ⬜ Real Ducky base illustration (vector) — placeholders shipped meanwhile
- ✅ Seven emotion variants: idle, excited, thinking, celebrating, curious, sleepy, sad (placeholder geometric SVG; swap real art file-for-file later, no code change)
- ✅ Svelte `<Ducky>` component with state-driven `mood` prop + idle bob via CSS keyframes
- ✅ Speech-bubble component with typewriter animation (Svelte `$effect` + `setInterval`, no Framer Motion needed)
- ✅ Dialogue script structure (`src/lib/data/dialogue.json`, easy to edit)
- ✅ First batch of dialogue lines for navigation/connect events
- ⬜ "Things Ducky never says" linter (avoid words like "wrong", "fail", "incorrect")
- ⬜ Floating Ducky present across app, position-aware (corners, etc.) — currently per-page

---

## 🐣 Phase 2 — Onboarding Path *(Levels 0–1)*

### M4 · Level 0: The Egg
**Goal:** First 10 minutes from unbox to wow. **Polish: HIGH.**

> **Browser-side companions are in.** All 10 Level-0 missions have a working
> mission card, ducky intro, concept "why this works" explainer, and an
> Interactive component running against the mock device. What's pending is
> the actual `.hex` firmware to flash — blocked on M0 hardware validation.

- ✅ Browser companion: 01 Ducky Says Hi (name input → scrolling matrix preview + serial command)
- ✅ Browser companion: 02 Heartbeat (animated big/small heart on virtual matrix)
- ✅ Browser companion: 03 Tap to Wake (ripple animation, listens for radio button events)
- ✅ Browser companion: 04 Shake (3-axis live meters from accel stream)
- ✅ Browser companion: 05 Cold Hands (Thermometer widget, live temp stream)
- ✅ Browser companion: 06 Hide & Peek (light meter + Ducky mood mirroring)
- ✅ Browser companion: 07 Whisper or Shout (VolumeMeter + matrix bargraph)
- ✅ Browser companion: 08 Touch Logo (Ducky celebrates on touch event)
- ✅ Browser companion: 09 Compass Quest (CompassDial with cardinal direction)
- ✅ Browser companion: 10 Wave Across (two-duck pair UI; loopback in mock for solo dev)
- ⬜ Pre-compile hex for L0-01 through L0-10 (blocked on M0)
- ⬜ Onboarding flow: detect device → flash hex → confirm success
- ✅ Name input UI (writes to progress store; will flash to device once hex exists)
- ✅ Celebration moment when Ducky waves on OLED (Ducky mood swaps to `celebrating` after flash)
- ✅ Mission card UI (title, oneLiner, hardware tags, pair badge, completion checkmark, ~min estimate)
- ⬜ Add **Lab Mode (L0 — "Discovery Mode")** with all-sensors hex

### M5 · Level 1: Hatch
**Goal:** Tweak parameters, see code react. **Polish: HIGH.**

- ✅ Parameter-tweak UI components: sliders (`Mood Ring`), pill selectors (`Light Theremin`), piano (`Welcome Jingle`), drawing pad (`Drawing Pad`)
- ✅ **Approach decided:** universal-listener hex (one firmware, browser sends typed commands over serial). See M2 stack note.
- ✅ Build L1-11 Drawing Pad — paint 5×5 in browser → live beam to chip via `M:` command
- ✅ Build L1-12 Mood Ring (sensor-pick + threshold slider; live happy/sad mood swap)
- ✅ Build L1-13 Welcome Jingle (PianoKeys + tone-sequence command + browser preview via WebAudio)
- ✅ Build L1-14 Light Theremin (scale picker, live light→pitch mapping; browser preview + chip tone)
- ✅ Build L1-15 Reaction Tester (countdown → green flash → ms timing + best score)
- ✅ Ducky reacts when user changes a parameter (mood store + speech-bubble cheer on flash)
- ⬜ Add **Lab Mode (L1 — "Tweak Anything")**

---

## 🐥 Phase 3 — Block Coding Path *(Levels 2–3)*

### M6 · MakeCode Integration
**Goal:** Open editor inside Ducky, code in blocks, click Run, code flashes.

- ⬜ Embed MakeCode iframe with custom config (`controller=1`)
- ⬜ `postMessage` handlers: load project, save project, compile-and-flash, status events
- ⬜ Detect compile success, hand `.hex` to our WebUSB layer
- ⬜ Style the iframe to feel embedded (header hidden, theme matched where possible)
- ⬜ Project storage: `localStorage` keyed by mission/sandbox slot
- ⬜ "Save & Flash" button overlay
- ⬜ Investigate custom MakeCode target if branding/feel needs deeper integration

### M7 · Level 2: Waddle
**Goal:** Build with blocks from scratch.

- ⬜ Mission card UI v2 (story, goal, hints toggle, hack prompts, "open editor")
- ⬜ Mission template loader (starter blocks → MakeCode iframe)
- ⬜ L2-01 Build a Pet (open creative)
- ⬜ L2-02 Name Badge Plus
- ⬜ L2-03 Magic 8-Ball
- ⬜ L2-07 Stopwatch
- ⬜ Wide-walls path selector (Art / Music / Science / Games / Communication / Body)
- ⬜ Add **Lab Mode (L2 — "Empty Canvas")**

### M8 · Level 3: Swim
**Goal:** Two devices, one experience. Hero pair mission.

- ⬜ Pair-mode UI: two device states shown side by side
- ⬜ Auto-assign radio channel per pair
- ⬜ L3 Hero Mission: **Secret Handshake** (full polish)
- ⬜ L3 Lighter Mission: **Hot Potato**
- ⬜ Visual explainer: "How radio works" (illustrated, Ducky-narrated)
- ⬜ Solo-friendly fallback: one device sends, browser receives via Bluetooth and "plays" the partner role
- ⬜ Test extensively with two physical devices

---

## 🪶 Phase 4 — Code Mastery Path *(Levels 4–5)*

### M9 · Level 4: Feather
**Goal:** Reveal that blocks ARE code. **Polish: functional.**

- ⬜ Enable MakeCode's split view (blocks ↔ JavaScript)
- ⬜ Ducky "reveal moment" overlay: *"The blocks were code all along"*
- ⬜ One guided mission: edit one line of text, see the change
- ⬜ Tooltip/glossary system for code keywords (lightweight)
- ⬜ "Switch to MicroPython" toggle (stretch)

### M10 · Level 5: Soar
**Goal:** Open sandbox + farewell. **Polish: functional.**

- ⬜ Sandbox mode (full MakeCode, no mission)
- ⬜ "Inspire me" carousel of community-style examples (author 4–5)
- ⬜ Project export — download `.hex` for sharing physically
- ⬜ Ducky's farewell moment: *"You don't need me anymore"*
- ⬜ Sandbox return state preserved across sessions

---

## 📦 Phase 5 — Content, Polish & Launch Prep

### M11 · Mission Cards (Print)
- ⬜ Pick 2 missions to print first (suggest L0-01 and L1-01)
- ⬜ Design printable PDF mission cards
- ⬜ Illustrated, accessible, language-light
- ⬜ Add QR code → exact mission in app
- ⬜ Print test on actual paper, check legibility at small sizes

### M12 · Packaging Mockup
- ⬜ Choose render tool (Figma / Blender / Photoshop)
- ⬜ Box outer (front, back, sides)
- ⬜ Inside layout — where each piece sits
- ⬜ Ducky character + tagline prominent
- ⬜ "Two devices inside" visible on packaging

### M13 · Accessibility & Polish
- ⬜ Keyboard navigation throughout app
- ⬜ Font size toggle
- ⬜ Dyslexia-friendly font option
- ⬜ High-contrast mode
- ⬜ All Ducky dialogue available as text (not just animation)
- ⬜ Loading states everywhere
- ⬜ Error states with Ducky narration (no error codes shown to kid)
- ⬜ Run a screen-reader pass on key flows

### M14 · Open-Ended Content
*Make sure the open-ended ethos is visible in-product.*

- ⬜ Implement **What-If prompts** screen (categorised list, "make your own")
- ⬜ Implement **Discovery activities** flows (one per sensor)
- ⬜ Implement **Remix Challenges** (inversions, combinations, constraints, subversions)
- ⬜ Add "Remix this mission" button on every mission card
- ⬜ Add "...or anything else you imagine" footer to every wide-walls list

### M15 · Test Plan & Pilot Run
- ⬜ Recruit 3–5 kids aged 10–14 (mix of genders, mix of computer-interest)
- ⬜ Prepare test script (see Notion test plan)
- ⬜ Print observation rubric
- ⬜ Get parental consent for video (if recording)
- ⬜ Run sessions
- ⬜ Rank top 3 issues
- ⬜ Fix top 3 issues before broader release

---

## 📊 Stretch / V2 Backlog
*Not in MVP. Captured here so they don't get lost.*

- ⬜ Backend + accounts for cross-device progress
- ⬜ Project sharing platform (community gallery)
- ⬜ Teacher dashboard (push code to all students, see progress)
- ⬜ Localisation (i18n setup, first translations)
- ⬜ More missions (target 50+ across all levels)
- ⬜ Web Bluetooth wireless connection (in addition to USB)
- ⬜ Native mobile wrapper (Capacitor)
- ⬜ Open-source contribution guide
- ⬜ Curriculum mapping documents for educators
- ⬜ Three-device experiences (when shielded by enough kits)
- ⬜ Audio walkie-talkie via radio (encoded as low-bandwidth tones, fun even if crap)

---

## ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| OLED library doesn't work cleanly with MakeCode | Medium | High | M0 validates. Fallback: 5×5 matrix only at MVP. |
| WebUSB browser support issues | Low | High | Document Chrome/Edge requirement. Friendly fallback message. |
| MakeCode embed quirks (postMessage edge cases) | Medium | Medium | Build minimal embed test in M0. Direct-flash fallback always available. |
| Solo dev burnout / scope creep | High | Medium | Modular plan. Cut Level 4–5 polish first. Levels 0–3 are must-have. |
| Kids find it confusing | Medium | High | Test plan in M15. Iterate before broader release. |
| Two-device pair missions hard to test solo | High | Medium | Two Micro:bits on the desk from day one. |
| Ducky character art delayed | Medium | Medium | Use placeholder duck (emoji + simple shapes) until illustration ready. Doesn't block code. |
| Battery / USB power issues on some devices | Low | Medium | Test on multiple machines in Week 1. |
| MakeCode iframe styling fights us | Medium | Medium | Lower the bar — accept some MakeCode chrome shows through if needed. |

---

## 🎯 Sequencing Suggestion

**Week 1:** Phase 0 + Phase 1 entirely. Start Phase 2.
**Week 2:** Finish Phase 2. Phase 3.
**Week 3:** Phase 4 (lighter polish ok). Phase 5 (content + polish + tests).

If anything slips, **deprioritise Phase 4 polish** — Levels 4–5 are functional but don't need to shine for MVP. The first three levels are what kids will see most.