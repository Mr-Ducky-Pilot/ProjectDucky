# 🦆 Ducky — Tasks

Modular work plan for the 3-week MVP. Tasks are grouped into **phases** (gate the next phase) and **modules** (independent within a phase). Designed for solo dev with AI copilot.

**Legend:** ⬜ todo · 🟨 in progress · ✅ done · 🚧 blocked · 🔄 needs revisit


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

- ⬜ Initialise Vite + React + TS + Tailwind
- ⬜ Set up React Router with placeholder pages
- ⬜ Routes: `/`, `/journey`, `/level/:id`, `/mission/:id`, `/lab/:level`, `/sandbox`
- ⬜ Layout component (header with Ducky avatar + level indicator, main, footer)
- ⬜ Theme tokens (colours, fonts, spacing) in Tailwind config
- ⬜ `useProgress` hook backed by `localStorage`
- ⬜ Zustand store for app-wide state
- ⬜ Empty Ducky placeholder component
- ⬜ Deploy to staging (Vercel/Cloudflare)

### M2 · WebUSB Connection Layer
**Goal:** Reliable "Connect Ducky" button anywhere in the app.

- ⬜ Integrate DAPjs
- ⬜ Connect / disconnect button with clear states (idle, requesting, connected, error)
- ⬜ Flash a `.hex` file from URL
- ⬜ Read serial output from Micro:bit (for debugging + later level use)
- ⬜ Persistent connection across route changes (Zustand)
- ⬜ Friendly error messages (Ducky-narrated)
- ⬜ Browser compatibility check on app load — friendly Chrome/Edge message for unsupported browsers
- ⬜ Test with two Micro:bits connected simultaneously

### M3 · Ducky Character System
**Goal:** Ducky reacts to navigation and events with personality.

- ⬜ Sketch Ducky base illustration (vector)
- ⬜ Six emotion variants: idle, excited, thinking, celebrating, curious, sleepy
- ⬜ React `<Ducky>` component with state-driven emotion prop
- ⬜ Speech-bubble component with typing animation (Framer Motion)
- ⬜ Dialogue script structure (`/data/dialogue.json`, easy to edit)
- ⬜ First batch of dialogue lines for navigation events
- ⬜ "Things Ducky never says" linter (avoid words like "wrong", "fail", "incorrect")
- ⬜ Floating Ducky present across app, position-aware (corners, etc.)

---

## 🐣 Phase 2 — Onboarding Path *(Levels 0–1)*

### M4 · Level 0: The Egg
**Goal:** First 10 minutes from unbox to wow. **Polish: HIGH.**

- ⬜ Pre-compile hex: "Ducky Says Hi" (OLED waving + name display + chirp)
- ⬜ Pre-compile hex for L0-02 Heartbeat
- ⬜ Pre-compile hex for L0-03 Tap to Wake
- ⬜ Pre-compile hex for L0-04 Shake to Wake
- ⬜ Pre-compile hex for L0-05 Cold Hands
- ⬜ Pre-compile hex for L0-06 Hide & Peek
- ⬜ Pre-compile hex for L0-07 Whisper or Shout
- ⬜ Pre-compile hex for L0-08 Wave Across (pair, radio)
- ⬜ Onboarding flow: detect device → flash hex → confirm success
- ⬜ Name input UI → flashed to device
- ⬜ Celebration moment when Ducky waves on OLED
- ⬜ Mission card UI (basic: title, story, quest, "send to device" button)
- ⬜ Add **Lab Mode (L0 — "Discovery Mode")** with all-sensors hex

### M5 · Level 1: Hatch
**Goal:** Tweak parameters, see code react. **Polish: HIGH.**

- ⬜ Parameter-tweak UI components (sliders, colour pickers, dropdowns, toggles)
- ⬜ Decide approach: pre-compiled hex variants per parameter set OR runtime hex patching
- ⬜ Build L1-01 Mood Ring (sensor-pick + threshold slider)
- ⬜ Build L1-02 Welcome Jingle (note picker)
- ⬜ Build L1-03 Light Theremin (scale picker)
- ⬜ Build L1-09 Reaction Tester
- ⬜ Ducky reacts when user changes a parameter (small animation)
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