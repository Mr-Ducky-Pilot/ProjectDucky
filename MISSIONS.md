# Ducky — Mission Reference

All missions across all levels. Six levels, **76 missions**, eight creative
dimensions: art · music · science · wellbeing · movement · story · pet · code.

| Level | Missions | Theme |
|---|---|---|
| 🥚 L0 Egg | 15 | Flash & play presets — no code |
| 🐣 L1 Hatch | 17 | Browser controls the board |
| 🐥 L2 Waddle | 13 | Fill-in-the-blank MicroPython |
| 🦆 L3 Swim | 14 | Function bodies, radio, pet basics |
| 🪶 L4 Feather | 9 | Pet Designer — program personality |
| 🌟 L5 Soar | 8 | Open sandbox + remix gallery |

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

## 🐣 Level 1 — Hatch (17 missions)

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

## 🦆 Level 3 — Swim (14 missions, function-body builder)

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

## 🌟 Level 5 — Soar (8 missions, Open Sandbox + Gallery)

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
