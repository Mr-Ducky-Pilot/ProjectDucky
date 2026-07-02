# Ducky — Mission Reference

All missions across all levels. Six levels, **79 missions**, eight creative
dimensions: art · music · science · wellbeing · movement · story · pet · code.

| Level | Missions | Theme |
|---|---|---|
| 🥚 L0 Egg | 15 | Flash & play presets — no code |
| 🐣 L1 Hatch | 18 | Browser controls the board |
| 🐥 L2 Waddle | 13 | Fill-in-the-blank MicroPython |
| 🦆 L3 Swim | 15 | Function bodies, radio, pet basics |
| 🪶 L4 Feather | 9 | Pet Designer — program personality |
| 🌟 L5 Soar | 9 | Open sandbox + remix gallery |

---

## Sensor Hardware Decisions

Two Grove sensors were added physically: the **RGB LED** (real colour — the
5×5 matrix is monochrome/brightness-only, so this is genuinely new) and the
**Temperature Sensor V1.2** (a true ambient thermistor — the on-board
`temperature()` reads CPU die temp, a known-bad ambient proxy called out by
`46-warm-cold`'s own copy).

Three other requested Grove sensors were evaluated and **deliberately not
added**, because the micro:bit v2 already has on-board equivalents in active
use throughout the app:

- **Grove 3-Axis Accelerometer** — the built-in accelerometer already drives
  `04-shake-to-wake`, `17-dice-roller`, `42-shake-dice`, `44-tilt-bubble`,
  `45-firefly`, `18-step-counter`, `39-gesture-recognizer`.
- **Grove Sound Sensor** — the built-in microphone already drives
  `07-whisper-or-shout`, `19-sound-alarm`, `21-clap-counter`.
- **Grove Buzzer v1.2** — the built-in speaker already drives every `T:`
  tone-sequence command and `music.pitch()`/`music.play()` call app-wide.

Wiring in physically-redundant Grove modules would add assembly complexity
(extra crocodile clips, a Grove Shield) and firmware budget cost for zero new
pedagogical capability — the same class of problem that forced the Grove OLED
removal earlier. Only hardware that unlocks something the board genuinely
can't already do gets a physical slot.

---

## 🥚 Level 0 — Egg (15 missions)

| # | ID | Title | Dimension | Preset |
|---|---|---|---|---|
| 01 | `01-ducky-says-hi` | Ducky Says Hi | art | (inline) |
| 02 | `02-heartbeat` | Heartbeat | art | `heartbeat` |
| 03 | `03-tap-to-wake` | Tap to Wake | mechanics | `tap-wake` |
| 04 | `04-shake-to-wake` | Shake It | movement | `shake` |
| 06 | `06-hide-and-peek` | Hide & Peek | science | `hide-peek` |
| 07 | `07-whisper-or-shout` | Whisper or Shout | music | `whisper` |
| 08 | `08-touch-logo` | Touch Logo | music | `touch-logo` |
| 09 | `09-compass-quest` | Compass Quest | science | `compass-quest` |
| **40** | `40-rainbow-pulse` | Rainbow Pulse | art | `breathe` |
| **41** | `41-sunrise-clock` | Sunrise Clock | wellbeing | `sunrise` |
| **42** | `42-shake-dice` | Shake-a-Dice | movement | `dice` |
| **43** | `43-mood-badge` | Mood Badge | wellbeing | `mood-badge` |
| **44** | `44-tilt-bubble` | Tilt Bubble | movement | `bubble` |
| **45** | `45-firefly` | Firefly | art | `firefly` |
| **46** | `46-warm-cold` | Warm or Cold? | science | `warm-cold` |

## 🐣 Level 1 — Hatch (18 missions)

| # | ID | Title | Dimension |
|---|---|---|---|
| 11 | `11-drawing-pad` | Drawing Pad | art |
| 13 | `13-welcome-jingle` | Welcome Jingle | music |
| 14 | `14-light-theremin` | Light Theremin | music |
| 15 | `15-reaction-tester` | Reaction Tester | movement |
| 16 | `16-pixel-animator` | Pixel Animator | art |
| 17 | `17-dice-roller` | Dice Roller | mechanics |
| 18 | `18-step-counter` | Step Counter | movement |
| 19 | `19-sound-alarm` | Sound Alarm | science |
| 20 | `20-metronome` | Metronome | music |
| 21 | `21-flight-radar` | Flight Radar | science |
| 22 | `22-iss-tracker` | ISS Tracker | science |
| **24** | `24-drum-pad` | Drum Pad | music |
| **25** | `25-emotion-radio-badge` | Emotion Radio | story (pair) |
| **26** | `26-temperature-logger` | Temperature Logger | science |
| **27** | `27-step-dance-cards` | Dance Cards | movement |
| **28** | `28-comic-strip` | Comic Strip | story / art |
| **29** | `29-mood-lamp` | Mood Lamp | wellbeing |

## 🐥 Level 2 — Waddle (13 missions, fill-in-the-blank MicroPython)

| # | ID | Title | Dimension |
|---|---|---|---|
| 21 | `21-clap-counter` | Clap Counter | mechanics |
| 22 | `22-mood-machine` | Mood Machine | science |
| 23 | `23-steady-hand` | Steady Hand | mechanics |
| 24 | `24-button-race` | Button Race | mechanics |
| 25 | `25-night-light` | Night Light | science |
| 26 | `26-dot-mover` | Dot Mover | mechanics |
| **35** | `35-magic-8-ball` | Magic 8-Ball | story |
| **36** | `36-pixel-camera` | Pixel Camera | art |
| **37** | `37-breath-buddy` | Breath Buddy | wellbeing |
| **38** | `38-loudness-painter` | Loudness Painter | music / art |
| **39** | `39-temperature-alert` | Temperature Alert | science |
| **40** | `40-jump-counter` | Jump Counter | movement |
| **41** | `41-pet-name-tag` | Pet Name Tag | pet (reads pet) |

## 🦆 Level 3 — Swim (15 missions, function-body builder)

| # | ID | Title | Dimension |
|---|---|---|---|
| 27 | `27-duck-dance-party` | Duck Dance Party | music |
| 28 | `28-secret-pond-lock` | Secret Pond Lock | mechanics |
| 29 | `29-pond-call` | Pond Call | mechanics (pair) |
| 30 | `30-secret-handshake` | Secret Handshake | story (pair) |
| 31 | `31-hot-potato` | Hot Potato | mechanics (pair) |
| 32 | `32-morse-messenger` | Morse Messenger | mechanics (pair) |
| 33 | `33-clicker-wars` | Clicker Wars | movement (pair) |
| 34 | `34-duck-dash` | Duck Dash (capstone) | mechanics (pair) |
| **35** | `35-pet-namer` | Name Your Duck | pet (writes name) |
| **36** | `36-pet-palette` | Pet Palette | art (writes color, pattern) |
| **37** | `37-pet-signature-sound` | Signature Sound | music (writes tone) |
| **38** | `38-data-logger` | Data Logger | science |
| **39** | `39-gesture-recognizer` | Gesture Recognizer | movement |
| **40** | `40-radio-pet-meet` | Pet Meet | pet (radio share, writes friends) |
| **41** | `41-mood-beacon` | Mood Beacon | wellbeing (pair) |

## 🪶 Level 4 — Feather (9 missions, Pet Designer)

Each mission edits one personality field of your saved pet. Mission 49 reads the whole pet object back and runs a 60-second showcase.

| # | ID | Title | Writes |
|---|---|---|---|
| 41 | `41-pet-greeting-routine` | Boot Greeting | personality.greeting |
| 42 | `42-pet-mood-engine` | Mood Engine | personality.moodRules |
| 43 | `43-pet-favorite-thing` | Favourite Thing | personality.favoriteThing |
| 44 | `44-pet-trick-trainer` | Trick Trainer | personality.trick |
| 45 | `45-pet-grumpy-meter` | Grumpy Meter | personality.grumpyEnabled |
| 46 | `46-pet-secret-call` | Secret Call | personality.callSign |
| 47 | `47-pet-dream-mode` | Dream Mode | personality.dreamMode |
| 48 | `48-pet-game-fetch` | Fetch | (code-only) |
| 49 | `49-pet-graduation` | Graduation (capstone) | (reads all) |

## 🌟 Level 5 — Soar (9 missions, Open Sandbox + Gallery)

Each mission ships a free-form Python editor seeded with a useful template that uses the saved pet. Sharing via `.duck` files + URL hash + QR.

| # | ID | Title | Dimension |
|---|---|---|---|
| 50 | `50-pet-playground` | Playground | open sandbox |
| 51 | `51-pet-remix` | Pet Remix | pet / story (load & remix .duck) |
| 52 | `52-mini-arcade` | Mini Arcade | movement |
| 53 | `53-sensor-symphony` | Sensor Symphony | music / science |
| 54 | `54-radio-disco` | Radio Disco | music (pair) |
| 55 | `55-pet-storybook` | Storybook | story / art |
| 56 | `56-science-fair` | Science Fair (CSV export) | science |
| 57 | `57-gallery` | Gallery | pet / meta |
| 58 | `58-mood-garden` | Mood Garden | wellbeing |

---

## CASEL / SEL Alignment

Internal reference only — not surfaced to kids anywhere in the app (no badge,
no filter, no `MissionMeta` field). Maps every wellbeing-touching mission to
one or more of CASEL's 5 core competencies, so future wellbeing content has a
real framework behind it instead of just a vibe.

| Mission | Competenc(y/ies) | Why |
|---|---|---|
| `43-mood-badge` (L0) | Self-awareness | Naming and choosing a face for how you feel right now is the most direct possible practice of emotional self-labeling. |
| `41-sunrise-clock` (L0) | Self-awareness | Weaker fit — mostly environmental/science, but noticing and reacting to a bodily-relevant cue (light) is a mild form of self-awareness practice. |
| `25-emotion-radio-badge` (L1) | Social-awareness, Relationship-skills | Choosing and broadcasting an emotion to a specific friend's board is recognizing a feeling *and* communicating it nonverbally to a peer. |
| `29-mood-lamp` (L1) | Self-awareness | Cycling through named moods and seeing each expressed three ways (face, colour, sound) reinforces emotional vocabulary before any social component is added. |
| `37-breath-buddy` (L2) | Self-management | A 4-7-8 breathing exercise is a textbook self-management/emotion-regulation technique, not an analogy for one. |
| `42-pet-mood-engine` (L4) | Self-awareness, Self-management | Writing "when X happens, I feel Y" rules is explicit practice at recognizing what situational triggers affect mood, and designing a response to them. |
| `45-pet-grumpy-meter` (L4) | Self-awareness, Self-management | The calm↔grumpy hysteresis state machine models noticing frustration building up *and* what it takes to de-escalate back to calm. |
| `47-pet-dream-mode` (L4) | Self-management | Weaker fit — modeling scheduled rest/idle state as a deliberate part of a healthy rhythm, not active regulation. |
| `41-mood-beacon` (L3) | Social-awareness, Relationship-skills | Explicit design goal: share how you feel with a friend's duck without saying anything out loud — the clearest CASEL fit of any mission in the app. |
| `58-mood-garden` (L5) | Self-awareness, Responsible-decision-making | Open-ended mood logging over time practices noticing one's own patterns; designing your own check-in ritual is itself a responsible-decision-making exercise. |

Two gaps this closed: there were previously **zero** wellbeing missions at L3
(pair/radio) or L5 (open sandbox) — `41-mood-beacon` and `58-mood-garden` fill
those directly.

---

## Pet system (introduced L3, expanded L4–L5)

A persistent customisable pet stored in localStorage as `ducky.pet.v1` and shareable as `.duck` files (JSON), URL hash, or QR code.

- **L3** writes basic identity: name, colours, pattern, signature sound, friends list
- **L4** writes personality: greeting routine, mood rules, favourite, trick, call sign, grumpy state, dream mode
- **L5** reads the full pet and uses it as template state; loads/remixes friends' `.duck` files

See `src/lib/stores/pet.ts` for the schema.

---

## Sharing protocol (L3+)

- **`.duck` file** — pretty-printed JSON, MIME `application/json`. Exported via `QrShareCard`.
- **URL hash** — `/share#<base64url(deflate-raw(JSON))>` using browser-native `CompressionStream`.
- **Radio handshake** — L3 mission 40 (`40-radio-pet-meet`) trades `HELLO|callsign` + `INFO|name|c1|c2|pattern` packets between two boards on radio channel 42.

---

## Wire Protocol Quick Reference

```
Browser → Board              Board → Browser
──────────────────────       ─────────────────────────────
M:0101011111…                <S accel 0.12,0.04,0.99>
N:Hello                      <S mic 84>
F:happy                      <S light 140>
T:C4,200;E4,400              <B A down>
S?accel                      <B B down>
S!accel                      <T down>
P:heartbeat                  <T up>
L:80                         <R 42>      (numeric)
R:42                         <R PING|XYZABC>   (string)
R:HELLO|XYZABC               <L Ducky OS ready>
C:255,180,20                 <L D light 1230 80>  (data-log)
A:HELLO
Q
```

## Sensor Labels (hardware field in mission.meta.ts)

`led-matrix` · `mic` · `speaker` · `accel` · `compass` · `temp` · `ambient-temp` · `rgb-led` · `light` · `buttons` · `logo-touch` · `radio` · `output`

## Dimension tags (NEW)

`art` · `music` · `science` · `wellbeing` · `movement` · `story` · `pet` · `mechanics`

Levels show dimension-tag filter chips. The journey page shows a dimension legend with completed-mission counts.

---

## Components introduced in this expansion

`PetAvatar`, `PetEditor`, `PetStatSheet`, `Confetti`, `LevelComplete`,
`JourneyPath`, `DataGraph`, `DrumPad` (inline), `BreathTrainer`,
`QrShareCard`, `DuckShareLoader`, `FreePythonEditor`.

## Firmware presets added

`breathe`, `sunrise`, `dice`, `mood-badge`, `bubble`, `firefly`, `warm-cold`.

## Routes added

`/share`, `/pet`, `/friends`, `/gallery`.
