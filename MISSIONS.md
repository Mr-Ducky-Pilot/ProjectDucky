# Ducky — Mission Reference

All missions across all levels. Use this as a development overview when designing new levels.

---

## 🥚 Level 0 — Egg (No-code, flash & play)

Kids flash pre-built firmware and explore sensors. No parameters to tweak. Board works standalone even unplugged.

| # | ID | Title | Emoji | Sensor/Output | Preset | Board behaviour |
|---|---|---|---|---|---|---|
| 01 | `01-ducky-says-hi` | Ducky Says Hi | 🖐️ | led-matrix | none (inline flash) | Scrolls name typed in browser |
| 02 | `02-heartbeat` | Heartbeat | 💓 | led-matrix | `heartbeat` | Big/small heart alternates every 600ms |
| 03 | `03-tap-to-wake` | Tap to Wake | 🔔 | buttons, led-matrix | `tap-wake` | Sleepy idle; button A → happy face |
| 04 | `04-shake-to-wake` | Shake It | 🫨 | accel, led-matrix | `shake` | Dizzy on >1.5g shake; happy to recover |
| 06 | `06-hide-and-peek` | Hide & Peek | 🙈 | light, led-matrix | `hide-peek` | Happy/sad based on light vs threshold |
| 07 | `07-whisper-or-shout` | Whisper or Shout | 🎙️ | mic, led-matrix | `whisper` | Bargraph of mic level on LED matrix |
| 08 | `08-touch-logo` | Touch Logo | 👆 | logo-touch, speaker | `touch-logo` | 3-note descending quack on logo touch |
| 09 | `09-compass-quest` | Compass Quest | 🧭 | compass, led-matrix | `compass-quest` | 8-direction arrow rotates with heading |

**Removed from L0 (decided against):**
- ~~`05-cold-hands`~~ — CPU temperature bargraph (removed: less engaging for kids)
- ~~`10-wave-across`~~ — Radio pair mission (removed: requires 2 boards, too complex for L0)

**L0 infrastructure:**
- FlashButton → buildDuckyHex → waitForReady → P:\<preset>
- Board cleanup (`Q`) sent when navigating away
- Board AA = previous mission, BB = next mission (double-tap within 2s)
- Sensor auto-resubscribe via `connection.onReady()` hook

---

## 🐣 Level 1 — Hatch (Browser controls the board)

Same Ducky OS firmware — no presets. Browser sends `M:`, `T:`, `S?` commands directly.
Kids tweak parameters in the browser and see the board respond instantly.

| # | ID | Title | Emoji | Sensor/Output | What the browser sends |
|---|---|---|---|---|---|
| 11 | `11-drawing-pad` | Drawing Pad | 🎨 | led-matrix | `M:` — 25-bit bitmap on demand |
| 13 | `13-welcome-jingle` | Welcome Jingle | 🎹 | speaker | `T:` — tone sequence tapped in browser |
| 14 | `14-light-theremin` | Light Theremin | 🎼 | light, speaker | `S?light` stream + `T:` per note change |
| 15 | `15-reaction-tester` | Reaction Tester | ⚡ | buttons, led-matrix | `M:` phases; button A event triggers tap |
| 16 | `16-pixel-animator` | Pixel Animator | 🎬 | led-matrix | `M:` on a timer — 3-frame flipbook |
| 17 | `17-dice-roller` | Dice Roller | 🎲 | accel, led-matrix | Shake → `M:` dice dot pattern |
| 18 | `18-step-counter` | Step Counter | 👟 | accel, led-matrix | `S?accel` stream; bargraph `M:` per step |
| 19 | `19-sound-alarm` | Sound Alarm | 🔔 | mic, led-matrix, speaker | `S?mic` stream; `M:` + `T:` on trigger |
| 20 | `20-metronome` | Metronome | 🥁 | led-matrix, speaker | `M:` flash + `T:` per beat interval |

**Removed from L1 (decided against):**
- ~~`12-mood-ring`~~ — Sensor + threshold → face (removed: covered better by L0 Hide & Peek; redundant)

**L1 infrastructure:**
- FlashButton labelled "Start Ducky" — always calls waitForReady, no preset sent
- After waitForReady, sends `M:000...` to clear the display (blank slate for Interactive)
- Board AA = previous mission, BB = next mission
- Each Interactive uses `onMount` + `connection.onReady()` for sensor auto-resubscribe

**L1 planned upgrade — "Your Turn 🎯" challenges (ready to implement):**
Each mission gets a `<YourTurn>` panel below the Interactive with a specific goal:

| Mission | Your Turn challenge |
|---|---|
| 11 Drawing Pad | Pixel Art Challenge: recreate a target image (duck/smiley/arrow) pixel-for-pixel |
| 13 Welcome Jingle | Copy the Tune: recreate a target note sequence shown as letters (C C G G A A G) |
| 14 Light Theremin | Play the Scale: cover/uncover chip to hit C D E G A in order |
| 15 Reaction Tester | Beat 250ms: keep trying until your best is under 250ms |
| 16 Pixel Animator | Bouncing Ball: recreate 3 target frames showing a dot moving top→mid→bottom |
| 17 Dice Roller | Fairness Test: roll 18 times, tally results — does each number appear ~3 times? |
| 18 Step Counter | Calibration: walk exactly 10 steps, adjust sensitivity until counter matches |
| 19 Sound Alarm | Sweet Spot: find threshold where talking = silence but clapping = alarm |
| 20 Metronome | Song Detective: tap along to 3 melodies, discover each song's BPM |

New component needed: `YourTurn.svelte` (checklist-based, shared across L1 + L2)

---

## 🐥 Level 2 — Waddle (Fill-in-the-blank MicroPython) [DESIGNED, ready to build]

Kids write real MicroPython — scaffolded templates with `___` gaps. They fill the blanks, flash their own code, see it run. See `LEVEL2_PLAN.md` for full spec.

**L2 approach:** Browser renders Python template with `___` as inline `<input>` fields. Kid fills gaps → browser assembles complete Python → `buildCustomHex(source)` → flash. No MakeCode needed.

| # | ID | Title | Emoji | Concept taught | Sensors | Blanks |
|---|---|---|---|---|---|---|
| 21 | `21-clap-counter` | Clap Counter | 🎤 | Variables + single if | mic, led-matrix | threshold, increment, sleep |
| 22 | `22-mood-machine` | Mood Machine | 😊 | if / elif / else | temp, led-matrix | 2 thresholds, middle face |
| 23 | `23-steady-hand` | Steady Hand | 🤚 | Compound condition, tracking best | accel, led-matrix | wobble limit, sleep |
| 24 | `24-button-race` | Button Race | 🏁 | Multiple events, game state | buttons, led-matrix | WIN count, victory messages |
| 25 | `25-night-light` | Night Light | 💡 | Real app: threshold + for loop | light, led-matrix, speaker | threshold, flash count, music tune |
| 26 | `26-dot-mover` | Dot Mover | 🕹️ | 2D coords, wrapping — Snake foundation | buttons, led-matrix | x/y in set_pixel, step, edge values |

**L2 infrastructure needed:**
- `buildCustomHex(source: string)` in `build.ts` (30 min)
- `CodeEditor.svelte` — renders template with `___` as inline inputs (2h)
- `YourTurn.svelte` — shared challenge panel (30 min, shared with L1 upgrades)
- `02-waddle/level.meta.ts` + level route
- 6 × mission folders (template.py + Interactive.svelte + concept.md + code.md)

---

## 🦆 Level 3 — Swim (Radio pair missions) [PLANNED]

Two-board missions. Kids send messages between chips over radio.

| # | Title | Concept |
|---|---|---|
| 31 | Secret Handshake | Radio + input comparison |
| 32 | Hot Potato | Radio + timing |
| 33 | Morse Code | Encoding + decoding |

---

## 🪶 Level 4 — Feather (Blocks ↔ JavaScript reveal) [PLANNED]

Kids see the JavaScript behind their blocks for the first time.

---

## 🌟 Level 5 — Soar (Open sandbox) [PLANNED]

Open MicroPython editor + project gallery. Farewell mission.

---

## Wire Protocol Quick Reference

```
Browser → Board      Board → Browser
──────────────────   ─────────────────────────────
M:0101011111…        <S accel 0.12,0.04,0.99>
N:Hello              <S mic 84>
F:happy              <S light 140>
T:C4,200;E4,400      <B A down>
S?accel              <B B down>
S!accel              <T down>
P:heartbeat          <T up>
L:80                 <R 42>
R:42                 <L Ducky OS ready>
Q
```

## Sensor Labels (hardware field in mission.meta.ts)

`led-matrix` · `oled` · `mic` · `speaker` · `accel` · `compass` · `temp` · `light` · `buttons` · `logo-touch` · `radio` · `output`
