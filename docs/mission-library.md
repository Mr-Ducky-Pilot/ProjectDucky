# Ducky — Full Mission & Level Catalog

Every mission across all six levels, with its story, hardware, estimated time, and the extension challenges ("remix prompts") that stand in for objectives/outcomes — each mission has no single "correct" end state by design (see *Philosophy* in `CLAUDE.md`), so these prompts describe what a kid is meant to try, notice, or build next once the base mission works.

Generated from the live `mission.meta.ts` files — the source of truth is the code, not this document; regenerate rather than hand-edit if missions change.

---

## Overview

| Level | Missions | Shape |
|---|---|---|
| 🥚 L0 Egg | 15 | Flash & play presets — no code |
| 🐣 L1 Hatch | 17 | Browser controls the board |
| 🐥 L2 Waddle | 13 | Fill-in-the-blank MicroPython |
| 🦆 L3 Swim | 15 | Function bodies, radio, pet basics |
| 🪶 L4 Feather | 9 | Pet Designer — program personality |
| 🌟 L5 Soar | 9 | Open sandbox + remix gallery |
| **Total** | **78** | |

**Dimension legend:** 🎨 art · 🎵 music · 🔬 science · 🌿 wellbeing · 💃 movement · 📖 story · 🦆 pet · ⚙️ mechanics

---

## 🥚 Level 0 — Egg (15 missions)

No-code exploration. Each mission activates a pre-built firmware **preset** on the board (the browser flashes one shared listener hex, then instantly switches presets) — kids press buttons, shake, tilt, or make noise and watch the physical LED matrix, speaker, and (for two missions) an optional external Grove RGB LED / temperature sensor react in real time. No typing required; the browser Interactive is a live simulation of what the physical board is doing.

### 👋 1. Ducky Says Hi — `01-ducky-says-hi`

*Type your name. Watch it scroll across the chip.*

> Your duck doesn’t know your name yet. Tell it once — it’ll remember.

> 🦆 Ducky: “Tell me what to call you and I’ll wave it back at you.”

- **Dimension:** 🎨 art  
  **Time:** ~3 min  
  **Hardware:** led-matrix, speaker

**Objectives / extension challenges once it works:**
- What if Ducky greets two names, like a co-pilot?
- Make Ducky chirp instead of waving.


### 💓 2. Heartbeat — `02-heartbeat`

*A pulsing heart that never stops. Your first loop, no code.*

> Ducky has a heart shape that grows and shrinks forever. Sync up with it — try matching the rhythm with your hand.

> 🦆 Ducky: “Watch the heart pulse. Then hit Send and your duck will pulse too.”

- **Dimension:** 🎨 art  
  **Time:** ~2 min  
  **Hardware:** led-matrix  
  **Firmware preset:** `heartbeat`

**Objectives / extension challenges once it works:**
- Try clapping along.
- Can two ducks beat in sync?


### 🔘 3. Tap to Wake — `03-tap-to-wake`

*Press a button. Watch the chip explode with light.*

> Two squishy buttons sit on the chip. Pick A or B and give it a tap — the LEDs ripple outwards.

> 🦆 Ducky: “Press a button on the chip — or tap one of mine to preview.”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~2 min  
  **Hardware:** buttons, led-matrix  
  **Firmware preset:** `tap-wake`

**Objectives / extension challenges once it works:**
- Tap A and B together — what happens?
- Try really fast tapping.


### 🤸 4. Shake It — `04-shake-to-wake`

*Wave the chip in the air. Watch it get dizzy.*

> There is a tiny motion-sensor inside Ducky. Shake the board and it’ll giggle, dizzy spin, then settle.

> 🦆 Ducky: “Pick the chip up. Wiggle it. The graph is your motion in 3D!”

- **Dimension:** 💃 movement  
  **Time:** ~2 min  
  **Hardware:** accel, speaker, led-matrix  
  **Firmware preset:** `shake`

**Objectives / extension challenges once it works:**
- Try really gentle shakes vs really hard ones.
- Can you balance Ducky perfectly still?


### 🙈 6. Hide & Peek — `06-hide-and-peek`

*Cover the chip with your hand. Watch it get sad. Uncover. It cheers up.*

> The micro:bit can sense how bright the room is — by using its own LEDs as detectors!

> 🦆 Ducky: “Cover the chip with your hand. Watch the bar shrink.”

- **Dimension:** 🔬 science  
  **Time:** ~2 min  
  **Hardware:** light, led-matrix  
  **Firmware preset:** `hide-peek`

**Objectives / extension challenges once it works:**
- Take Ducky into the dark with you. Pillow fort?
- Shine a phone torch at it.


### 🎤 7. Whisper or Shout — `07-whisper-or-shout`

*A tiny VU meter on the chip that listens to the room.*

> There is a tiny microphone on the back of the chip. The bars climb when there is sound — your voice, claps, music, a creaky door.

> 🦆 Ducky: “Whisper. Now shout. Now clap. The bars react in real time.”

- **Dimension:** 🎵 music  
  **Time:** ~3 min  
  **Hardware:** mic, led-matrix  
  **Firmware preset:** `whisper`

**Objectives / extension challenges once it works:**
- How quiet can you be and still move the meter?
- Try clapping in a rhythm — see the pattern.


### 👆 8. Touch Logo — `08-touch-logo`

*Touch the gold logo. Watch Ducky quack.*

> The shiny gold "MICROBIT" logo at the top of the chip is actually a touch sensor. Press it like a fingerprint reader.

> 🦆 Ducky: “Tap the gold logo on the chip — Ducky should chirp.”

- **Dimension:** 🎵 music  
  **Time:** ~2 min  
  **Hardware:** logo-touch, speaker  
  **Firmware preset:** `touch-logo`

**Objectives / extension challenges once it works:**
- Try it with sticky tape on the logo. Does it still work?
- Two fingers, one finger, knuckle?


### 🧭 9. Compass Quest — `09-compass-quest`

*Spin the chip slowly. Find magnetic north.*

> There’s a magnet sensor inside Ducky. Slowly rotate it on a flat surface and the needle on screen will follow.

> 🦆 Ducky: “Place the chip flat. Spin it slowly until it points north.”

- **Dimension:** 🔬 science  
  **Time:** ~4 min  
  **Hardware:** compass  
  **Firmware preset:** `compass-quest`

**Objectives / extension challenges once it works:**
- Hold a magnet near the chip. Watch it lie!
- Walk around the room — does the needle stay true?


### 🌊 40. Rainbow Pulse — `40-rainbow-pulse`

*A glow that breathes in slow waves.*

> Watch your duck inhale and exhale. Every pixel rides a sine wave — pure brightness, pure calm.

> 🦆 Ducky: “Match my pulse with your breathing. In… out… in…”

- **Dimension:** 🎨 art  
  **Time:** ~3 min  
  **Hardware:** led-matrix  
  **Firmware preset:** `breathe`

**Objectives / extension challenges once it works:**
- Breathe along with the wave — does it slow down your heart?
- Stand far away — does it still feel calming?
- Show a friend with no explanation. What do they say?


### ☀️ 41. Sunrise Clock — `41-sunrise-clock`

*Your duck wakes up with the light in the room.*

> Cover Ducky with your hand — it dims. Hold it to a window — it fills. The chip is reading sunlight in real time.

> 🦆 Ducky: “How bright is your room? Let me show you.”

- **Dimension:** 🌿 wellbeing (also: science)  
  **Time:** ~4 min  
  **Hardware:** light, led-matrix  
  **Firmware preset:** `sunrise`

**Objectives / extension challenges once it works:**
- Hold Ducky near a lamp, then under your shirt. What changes?
- Walk room to room — make a "brightness map" of your home.
- Race a friend: who can find the brightest spot?


### 🎲 42. Shake-a-Dice — `42-shake-dice`

*Shake your duck to roll a six-sided die.*

> A real die, sitting in your hand. Shake it, hear the click, see the pips appear. Use it in any game you play.

> 🦆 Ducky: “Shake me hard and I'll roll for you!”

- **Dimension:** 💃 movement  
  **Time:** ~5 min  
  **Hardware:** accel, led-matrix, speaker  
  **Firmware preset:** `dice`

**Objectives / extension challenges once it works:**
- Roll 30 times — write down each number. Do you see all six fairly often?
- Two ducks? Roll-off! Highest wins.
- Use it to pick a chore. Six chores, one shake.


### 🎭 43. Mood Badge — `43-mood-badge`

*Press A or B to show how you feel — wear your duck like a pin.*

> Happy, sad, sleepy, silly — pick whichever fits today. Your friends will see and know without you saying a word.

> 🦆 Ducky: “How do you feel right now? Press A or B to tell me.”

- **Dimension:** 🌿 wellbeing (also: story)  
  **Time:** ~4 min  
  **Hardware:** buttons, led-matrix  
  **Firmware preset:** `mood-badge`

**Objectives / extension challenges once it works:**
- Set Ducky to match your mood every hour for a day.
- Show a friend your badge — can they guess what each face means?
- Decide together with a friend: which face means what?


### 🫧 44. Tilt Bubble — `44-tilt-bubble`

*Tilt your duck — a bubble floats to the highest corner.*

> It's a real bubble level. Tilt left, bubble drifts right. Tilt down, bubble drifts up. Like the one in a carpenter's ruler.

> 🦆 Ducky: “Tilt me any way you like — watch where the bubble lands.”

- **Dimension:** 💃 movement (also: science)  
  **Time:** ~4 min  
  **Hardware:** accel, led-matrix  
  **Firmware preset:** `bubble`

**Objectives / extension challenges once it works:**
- Can you hold Ducky perfectly level? Bubble in dead centre — for 5 seconds.
- Check whether a table is truly flat. Move around its edge.
- Race a friend — first to centre the bubble wins.


### 🌟 45. Firefly — `45-firefly`

*A single glowing pixel that drifts when you tilt.*

> Imagine a tiny firefly trapped in your duck. Tip the chip and it slides — gently, never panicking.

> 🦆 Ducky: “There's a firefly inside me. Tilt to herd it.”

- **Dimension:** 🎨 art  
  **Time:** ~4 min  
  **Hardware:** accel, led-matrix  
  **Firmware preset:** `firefly`

**Objectives / extension challenges once it works:**
- Try to make the firefly trace a square — all four corners.
- Two ducks side-by-side: can both fireflies meet at the centre?
- Cup your hand around Ducky and slowly tilt. Watch the trail.


### 🌡️ 46. Warm or Cold? — `46-warm-cold`

*Your duck shows how warm the room is, right now.*

> A thermometer that lives in your hand. Hold it near a radiator, near a window, near an ice cube — watch it react. Got a real Grove Temperature Sensor? Clip it on and Ducky automatically trusts it over its own CPU guess.

> 🦆 Ducky: “Where is it warmest in your home? Help me find out.”

- **Dimension:** 🔬 science  
  **Time:** ~5 min  
  **Hardware:** temp, ambient-temp, led-matrix  
  **Firmware preset:** `warm-cold`

**Objectives / extension challenges once it works:**
- Find your home's warmest spot. Coldest spot. Why are they where they are?
- Hold a warm drink against Ducky — how fast does the reading climb?
- If you have the real sensor: compare it to the CPU guess side by side — how far off is the chip?


---

## 🐣 Level 1 — Hatch (17 missions)

Still no code to write, but the *browser* is now the brain — the board runs a universal listener firmware and every button click, slider, or drawing pad stroke sends a live command over the wire protocol (matrix bitmaps, tones, face names, sensor subscriptions). This is where kids start seeing the direct link between an on-screen action and physical hardware behaviour.

### 🎨 11. Drawing Pad — `11-drawing-pad`

*Paint a 5×5 picture in the browser. Beam it to the chip.*

> Each light on the chip is a tiny dot — paint your design, then send it. The whole thing is live; tweak and resend as much as you like.

> 🦆 Ducky: “Tap the squares to draw, then beam it over.”

- **Dimension:** 🎨 art  
  **Time:** ~6 min  
  **Hardware:** led-matrix

**Objectives / extension challenges once it works:**
- Make a flipbook: send pattern, change one pixel, send again.
- Try the Heart preset, then invert it.


### 🎹 13. Welcome Jingle — `13-welcome-jingle`

*Tap a tune in the browser. Ducky plays it back.*

> A piano in your laptop, a speaker on your chip. Tap a melody — Ducky records it, then plays the whole thing on loop.

> 🦆 Ducky: “Tap notes to make a tune. Then hit Play and I’ll perform.”

- **Dimension:** 🎵 music  
  **Time:** ~6 min  
  **Hardware:** speaker

**Objectives / extension challenges once it works:**
- Try Twinkle Twinkle: C C G G A A G
- A jingle that loops as your morning alarm.


### 🎼 14. Light Theremin — `14-light-theremin`

*Wave your hand over the chip. The pitch follows your shadow.*

> A theremin is a real instrument you play without touching it. Yours uses light: brighter = higher note, darker = lower.

> 🦆 Ducky: “Hover your hand over the chip and slowly move it up and down.”

- **Dimension:** 🎵 music  
  **Time:** ~4 min  
  **Hardware:** light, speaker

**Objectives / extension challenges once it works:**
- Try a torch — fast pitch changes!
- Pick the pentatonic scale — every wobble sounds nice.


### ⚡ 15. Reaction Tester — `15-reaction-tester`

*Wait for the green flash. Slap the button. How fast are you?*

> A countdown. A green light. A button. The chip times you in milliseconds — and remembers your best.

> 🦆 Ducky: “Wait for green. Don’t jump the gun!”

- **Dimension:** 💃 movement  
  **Time:** ~4 min  
  **Hardware:** buttons, led-matrix

**Objectives / extension challenges once it works:**
- Race a friend, side by side, two ducks.
- Average across 10 tries — humans aren’t consistent.


### 🎬 16. Pixel Animator — `16-pixel-animator`

*Draw 3 frames. Hit play. Watch your flipbook come to life.*

> A cartoon is just pictures shown so fast your brain fills in the motion. Draw three frames, set the speed, and your chip will flip through them on loop.

> 🦆 Ducky: “Draw your three frames. Even a tiny change between each one looks like movement!”

- **Dimension:** 🎨 art  
  **Time:** ~8 min  
  **Hardware:** led-matrix

**Objectives / extension challenges once it works:**
- Make a heartbeat: tiny heart → big heart → tiny heart.
- Try a bouncing ball: dot at top, dot at middle, dot at bottom.
- Can you make Ducky blink?


### 🎲 17. Dice Roller — `17-dice-roller`

*Shake the chip. Watch a random number appear on the LEDs.*

> Shake the micro:bit and it rolls a random dice — 1 to 6 — then shows the dots on the LED grid. The accelerometer detects the shake, the browser picks the number.

> 🦆 Ducky: “Shake me hard! I'll roll and show you what you got.”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~5 min  
  **Hardware:** accel, led-matrix

**Objectives / extension challenges once it works:**
- Add a second dice — two shakes, two numbers, show their sum.
- Make a D20: random 1–20 scrolled as text.
- Make a "magic 8-ball" that scrolls YES or NO on shake.


### 👟 18. Step Counter — `18-step-counter`

*Clip the chip to your shoe. Count your steps on the LEDs.*

> Every step you take sends a spike through the accelerometer. The browser counts those spikes and shows your progress — just like the fitness tracker in your pocket.

> 🦆 Ducky: “Walk around with me! Every step sends a tiny jolt that I'll count.”

- **Dimension:** 💃 movement  
  **Time:** ~6 min  
  **Hardware:** accel, led-matrix

**Objectives / extension challenges once it works:**
- Try counting jumps instead — the spike will be much bigger.
- Attach it to your wrist: does arm swing count as steps?
- Set a goal of 50 steps and race a friend.


### 🔔 19. Sound Alarm — `19-sound-alarm`

*Arm it. Make a noise. Watch the chip go wild.*

> Set a sound threshold, arm the alarm, and leave it on your desk. The next time someone makes a noise — clap, whisper, talk — the LED matrix flashes and the speaker screams.

> 🦆 Ducky: “Arm me and keep quiet… any sound will set me off!”

- **Dimension:** 🔬 science  
  **Time:** ~6 min  
  **Hardware:** mic, led-matrix, speaker

**Objectives / extension challenges once it works:**
- Put it under your notebook: anyone who picks it up will be caught!
- Set sensitivity low — try to trigger it with a whisper.
- Make a clap-counter instead: just count triggers without the alarm.


### 🥁 20. Metronome — `20-metronome`

*Set the BPM. The chip keeps perfect time for you.*

> Slide the BPM, hit play, and the chip beats exactly on time — every time. Tap the button to set the tempo by feel. All music runs on a shared clock.

> 🦆 Ducky: “Set your tempo and hit play. I'll keep the beat — you keep the rhythm!”

- **Dimension:** 🎵 music  
  **Time:** ~5 min  
  **Hardware:** led-matrix, speaker

**Objectives / extension challenges once it works:**
- Play a song and try to match its BPM by tapping.
- Set BPM to 60 and count "one two three four" on each beat — that's one bar of music.
- Try 180 BPM — can you tap along?


### 🛩️ 21. Flight Radar — `21-flight-radar`

*Watch real aeroplanes fly overhead — live data from the sky.*

> Every commercial airliner broadcasts its position every second using ADS-B radio. Ducky listens in and paints a live radar showing all the real planes near a chosen airport.

> 🦆 Ducky: “Did you know there are thousands of planes in the air right now? Let's track them!”

- **Dimension:** 🔬 science  
  **Time:** ~10 min  
  **Hardware:** led-matrix

**Objectives / extension challenges once it works:**
- Filter to only show planes above 30,000 ft — how many are cruising versus landing?
- Find the fastest plane on the radar — what's its speed in knots?
- Switch airports and compare — which one has the most traffic right now?


### 🛸 22. ISS Tracker — `22-iss-tracker`

*Track the International Space Station zooming overhead in real time.*

> The International Space Station orbits Earth every 90 minutes at 27,600 km/h — faster than a bullet. Right now there are astronauts up there! Your Ducky tracks where the ISS is at this very moment.

> 🦆 Ducky: “There's a space station up there RIGHT NOW with astronauts inside! Let's find it!”

- **Dimension:** 🔬 science  
  **Time:** ~8 min  
  **Hardware:** led-matrix

**Objectives / extension challenges once it works:**
- When will the ISS fly over your town? Look up the next pass at heavens-above.com.
- The ISS moves about 450 km per refresh — find a city it crossed between updates.
- How many times does the ISS orbit Earth in one day? (Hint: 24h ÷ 90 min)


### 🥁 24. Drum Pad — `24-drum-pad`

*4×4 step sequencer. Tap cells, hit play, your duck drums.*

> This is how real producers build beats — a grid of "play this here" cells. Pick a sound per row, tap when it should hit, and start the loop.

> 🦆 Ducky: “You program the beat. I'm the drum machine.”

- **Dimension:** 🎵 music  
  **Time:** ~12 min  
  **Hardware:** speaker, led-matrix

**Objectives / extension challenges once it works:**
- Make a rock beat — kick on 1 and 3, snare on 2 and 4.
- Now make a beat that's the OPPOSITE of rock.
- Loop it for a full minute. Dance.


### 💌 25. Emotion Radio — `25-emotion-radio-badge`

*Send a feeling over radio to a friend's duck.*

> Pick a mood emoji. Hit broadcast. Anyone else with their duck nearby sees your feeling on their screen.

> 🦆 Ducky: “Two ducks in the room? Send a feeling — see what comes back.”

- **Dimension:** 📖 story (also: wellbeing)  
  **Time:** ~8 min  
  **Hardware:** led-matrix, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Send a feeling, then text the same friend asking what they got. Match?
- Send three feelings in a row. Does the order matter?
- Make up your own emoji code with a friend before you start.


### 📈 26. Temperature Logger — `26-temperature-logger`

*Record a live temperature graph and save it as a PNG.*

> Real scientists collect data over time. Plug Ducky in, leave it on a windowsill for an hour, then save the graph.

> 🦆 Ducky: “I'm a tiny weather station. Let's draw a graph together.”

- **Dimension:** 🔬 science  
  **Time:** ~15 min  
  **Hardware:** temp, ambient-temp

**Objectives / extension challenges once it works:**
- Open the freezer, hold Ducky inside for 30 seconds. What does the graph look like?
- Leave Ducky logging for 30 minutes in different rooms. Compare.
- Send the PNG to a parent — explain what you measured.


### 💃 27. Dance Cards — `27-step-dance-cards`

*Choreography on screen, beat on the speaker, stomps from your feet.*

> Browser shows the next move. Duck plays the beat. Your job is to actually move — Ducky detects stomps with the accelerometer.

> 🦆 Ducky: “Get up. Follow my cards. I'll count your steps.”

- **Dimension:** 💃 movement  
  **Time:** ~10 min  
  **Hardware:** accel, speaker, led-matrix

**Objectives / extension challenges once it works:**
- Beat 50 stomps without missing the rhythm.
- Add a friend, hold one duck each, mirror each other's moves.
- Choreograph your own 8-card routine.


### 📖 28. Comic Strip — `28-comic-strip`

*Four panels, four feelings. Tell a tiny story.*

> Draw 4 LED frames and write a caption for each. Hit play — Ducky shows the strip on the matrix, panel by panel.

> 🦆 Ducky: “Storytellers used to need a printing press. You need me.”

- **Dimension:** 📖 story (also: art)  
  **Time:** ~12 min  
  **Hardware:** led-matrix

**Objectives / extension challenges once it works:**
- Tell the story of your day in four panels.
- Swap with a friend, predict each other's endings.
- Make a strip with no captions. Can the panels alone tell the story?


### 🌈 29. Mood Lamp — `29-mood-lamp`

*One mood, three outputs at once: a face, a colour, and a sound.*

> Ducky just got a real RGB LED — its first splash of actual colour, since the 5×5 grid can only glow one shade. Press A or B to cycle through seven moods; each one shows a face, glows a colour, and plays a sound, all at the same time.

> 🦆 Ducky: “Watch — one feeling, but I show it three ways at once.”

- **Dimension:** 🌿 wellbeing  
  **Time:** ~5 min  
  **Hardware:** rgb-led, buttons, led-matrix, speaker

**Objectives / extension challenges once it works:**
- Which mood color would you pick for each feeling? Try changing one in the code.
- Cover the light sensor while a mood is showing — does the room brightness change how the colour looks to you?
- Ask a friend to guess the mood from the colour alone, with the screen covered.


---

## 🐥 Level 2 — Waddle (13 missions)

First real code. Each mission shows a working MicroPython script with a few blanks (`___(hint)`) for the kid to fill in — usually thresholds, messages, or short values — inside a syntax-highlighted in-browser editor (`CodeEditor`), then flashes the finished script directly to the board. Comments in the starter code introduce one new syntax concept at a time (variables, `while True`, `if`/`elif`/`else`, lists, `for` loops, functions).

### 🎤 21. Clap Counter — `21-clap-counter`

*Fill in the blanks to count claps with the microphone.*

> Variables are like sticky notes — the chip can read them, change them, and remember them. Fill in three blanks and your chip will count every loud sound it hears.

> 🦆 Ducky: “Three blanks, one mission: fill them in and watch the counter go!”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~10 min  
  **Hardware:** mic, led-matrix

**Objectives / extension challenges once it works:**
- Change the threshold so it only counts shouts, not claps.
- Make it count by 2 each time instead of 1.
- Can you reset the counter when it reaches 10?


### 😊 22. Mood Machine — `22-mood-machine`

*The chip reads its own temperature and shows how it feels.*

> Chips run warmer when they work harder. Fill in two temperature thresholds and your chip will judge its own mood — happy if warm, sad if cold, surprised in between.

> 🦆 Ducky: “Hot, cold, or just right? Fill in the thresholds and see!”

- **Dimension:** 🔬 science  
  **Time:** ~10 min  
  **Hardware:** temp, led-matrix

**Objectives / extension challenges once it works:**
- Change the faces to ANGRY, ASLEEP, or CONFUSED.
- Add a fourth face for "freezing" (below 15°C).
- Print the actual temperature number instead of a face.


### 🤚 23. Steady Hand — `23-steady-hand`

*Keep the chip still. Your streak grows the steadier you are.*

> The accelerometer measures tiny movements in all directions. Add up the wobble in both axes and compare it to your limit. The chip counts how many loops you've been steady — try to beat your own best.

> 🦆 Ducky: “Two blanks — one for how steady, one for how fast. Ready?”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~12 min  
  **Hardware:** accel, led-matrix

**Objectives / extension challenges once it works:**
- Make the wobble limit stricter (lower number) to make it harder.
- Display the streak number instead of a face.
- Show a different image for a new personal best.


### 🏁 24. Button Race — `24-button-race`

*Two players, two buttons. First to the target wins.*

> It's a race! Player A mashes button A, player B mashes button B. First to reach the target count wins. You set the target and the victory message — then flash it and compete.

> 🦆 Ducky: “Set the finish line and the winning cry. Then battle it out!”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~10 min  
  **Hardware:** buttons, led-matrix

**Objectives / extension challenges once it works:**
- Set a really high WIN number like 50 for a long race.
- Change the win message to something funny.
- Add a display.scroll at the start to count down: "3", "2", "1", "GO!"


### 💡 25. Night Light — `25-night-light`

*Gets dark? Flash the LEDs and play a tune. A real device.*

> This is a real night-light alarm. When the room goes dark, the chip flashes and plays music. You choose when it triggers, how many flashes, and which tune. Three blanks, real hardware.

> 🦆 Ducky: “A proper gadget — you write it, you flash it, it works!”

- **Dimension:** 🔬 science  
  **Time:** ~12 min  
  **Hardware:** light, led-matrix, speaker

**Objectives / extension challenges once it works:**
- Try different tunes: ENTERTAINER, NYAN, or ODE.
- Flash faster by changing sleep(200) to sleep(100).
- Add display.scroll("DARK!") before the for loop.


### 🕹️ 26. Dot Mover — `26-dot-mover`

*Move a dot with the buttons. X and Y coordinates in real code.*

> Every game ever made uses coordinates. Fill in the starting position and the wrap-around edge, and your chip becomes a tiny game controller. Button A moves left, button B moves right — and the dot wraps around.

> 🦆 Ducky: “Set the starting point and the edge — let's write your first game!”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~15 min  
  **Hardware:** buttons, led-matrix

**Objectives / extension challenges once it works:**
- Change the starting y position to move the dot to a different row.
- Add button presses on shake (accelerometer) to move the dot up/down.
- Make the dot leave a trail by not calling display.clear() every loop.


### 🎱 35. Magic 8-Ball — `35-magic-8-ball`

*Shake your duck, ask a yes/no question, get a fortune.*

> A classic toy in code: shake to get an answer. You'll fill the answer list yourself — make it as wise or as silly as you want.

> 🦆 Ducky: “Ask me anything. (But only yes/no questions.)”

- **Dimension:** 📖 story  
  **Time:** ~8 min  
  **Hardware:** accel, led-matrix

**Objectives / extension challenges once it works:**
- Make all six answers positive — see if friends notice.
- Add specific in-jokes only your best friend would get.
- Replace the text with five emoji answers.


### 📸 36. Pixel Camera — `36-pixel-camera`

*Press A to capture an LED frame. Press B to play them all back.*

> Move your duck around — every press of A "snaps" the current matrix state. Press B to play your filmstrip.

> 🦆 Ducky: “I'm a camera with 25 pixels and no lens. Capture some art.”

- **Dimension:** 🎨 art  
  **Time:** ~10 min  
  **Hardware:** buttons, led-matrix

**Objectives / extension challenges once it works:**
- Animate a stick figure walking, frame by frame.
- Capture 8 frames and play them back fast — make a flipbook.
- Add a 3rd button: clear all frames.


### 🌬️ 37. Breath Buddy — `37-breath-buddy`

*A 4-7-8 breathing trainer. Inhale, hold, exhale — Ducky guides you.*

> This pattern is used in therapy and sleep apps. Four seconds in, seven holding, eight out. Ducky's LEDs expand and contract to lead you.

> 🦆 Ducky: “When you feel wobbly, come back here. I'll breathe with you.”

- **Dimension:** 🌿 wellbeing  
  **Time:** ~8 min  
  **Hardware:** led-matrix

**Objectives / extension challenges once it works:**
- Tweak the timings to 5-5-5 (calmer). Or 4-4-4 (faster).
- Try it before bed for a week. Track if you sleep better.
- Share with a parent — breathe together.


### 🎤 38. Loudness Painter — `38-loudness-painter`

*The louder you are, the brighter Ducky paints.*

> Microphone level becomes a brightness — every sound you make adds a glowing dot.

> 🦆 Ducky: “Hum, talk, sing. I'll paint with your voice.”

- **Dimension:** 🎵 music (also: art)  
  **Time:** ~9 min  
  **Hardware:** mic, led-matrix

**Objectives / extension challenges once it works:**
- Sing one quiet note then one loud — see the contrast.
- Try whispering to leave a faint pattern.
- Play music near it — does the rhythm show?


### 🥶 39. Temperature Alert — `39-temperature-alert`

*If it gets too hot or too cold, Ducky shouts a warning.*

> Comparators are how every alarm works. Pick a threshold, pick a message — your duck becomes a tiny watchdog.

> 🦆 Ducky: “Want me to bark if it gets cold? Set my limit.”

- **Dimension:** 🔬 science  
  **Time:** ~7 min  
  **Hardware:** temp, led-matrix

**Objectives / extension challenges once it works:**
- Build a "freezer alarm": >5°C = trigger.
- Build a "fever alert": >37°C using your finger heat.
- Add a second threshold for cold.


### 🤸 40. Jump Counter — `40-jump-counter`

*Strap Ducky to your shoelace, jump in place — it counts.*

> Every jump spikes the Z-axis accelerometer. Your code looks for the spike, increments a counter, scrolls the total.

> 🦆 Ducky: “I'm your tiny coach. Jump until I hit your target.”

- **Dimension:** 💃 movement  
  **Time:** ~8 min  
  **Hardware:** accel, led-matrix

**Objectives / extension challenges once it works:**
- Hit 30 jumps without missing the rhythm.
- Make the threshold easier — count tiptoe bounces.
- Have your duck cheer at every 10.


### 🏷️ 41. Pet Name Tag — `41-pet-name-tag`

*Scroll your duck's name across the LEDs, on a button press.*

> A name tag like the ones at conferences — except yours has 25 LEDs and the wearer is a duck.

> 🦆 Ducky: “Press B and I'll introduce myself.”

- **Dimension:** 🦆 pet  
  **Time:** ~6 min  
  **Hardware:** buttons, led-matrix, speaker  
  **Reads saved pet**

**Objectives / extension challenges once it works:**
- Add a fun fact about your duck after the name.
- Play a sound after the scroll — your duck's signature.
- Try two ducks side by side: introduce in turn.


---

## 🦆 Level 3 — Swim (15 missions)

Kids write whole function bodies and logic blocks now (multi-line `___ml(hint)` blanks — a "Fill it for me" option is available if they want a reference answer, alongside written tips). This is the radio-pair level: most missions need **two boards** talking to each other over the built-in 2.4GHz radio, and it's also where the persistent **Pet** (name, colour, pattern, signature sound, friends list) is first introduced and written to.

### 🕺 27. Duck Dance Party — `27-duck-dance-party`

*Write your own dance moves as Python functions — then trigger them live.*

> Functions are named sequences of actions. Give each dance move a name, write its steps, and call it on cue. Button A, button B, and a shake each trigger a different routine — you decide what they do.

> 🦆 Ducky: “Three moves, all yours to design. What does a duck do when it dances?”

- **Dimension:** 🎵 music  
  **Time:** ~12 min  
  **Hardware:** buttons, accel, led-matrix, speaker

**Objectives / extension challenges once it works:**
- Add a 4th move triggered by a logo touch (use pin_logo.is_touched()).
- Make shaking 3× in quick succession chain all three moves back-to-back.


### 🔐 28. Secret Pond Lock — `28-secret-pond-lock`

*Build a binary passcode lock — A presses 0, B presses 1. Match the combo to unlock.*

> Every pond needs a guard. You decide the combination (a sequence of 0s and 1s), then build the code that collects button presses, checks them against your secret, and unlocks or rejects. The display tells you what's happening.

> 🦆 Ducky: “You set the secret. You write the check. Can someone else crack your pond?”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~15 min  
  **Hardware:** buttons, accel, led-matrix

**Objectives / extension challenges once it works:**
- Add a wrong-entry counter and lock the board for 5 seconds after 3 wrong guesses.
- Make a shake gesture reset the entry list (so you can start over without reflashing).
- Add a "master override" — holding both A and B together always unlocks regardless of entry.


### 📡 29. Pond Call — `29-pond-call`

*Send your first radio message. Write the send and receive handlers.*

> Your duck found a friend across the pond. Press A to wave. Write what happens when a wave arrives back. This is how every radio, wifi, and Bluetooth device on the planet works — send, receive, respond.

> 🦆 Ducky: “One button. One send. One receive. The simplest possible radio app.”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~12 min  
  **Hardware:** buttons, led-matrix, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Send a counter that increments each wave — the receiver can display the count.
- On receive, automatically send back an acknowledgement: radio.send("ack").
- Add a second message type: button B sends "bye" and the receiver shows a wave goodbye.


### 🤝 30. Secret Handshake — `30-secret-handshake`

*Each duck picks a secret number. Press A to handshake — only matching ducks celebrate.*

> Two ducks, one secret each. Press A to broadcast your number. If the number you receive matches yours — you've found your partner duck! Write the matching logic and design what happens when you connect.

> 🦆 Ducky: “Pick your secret. Write the match check. Find your duck.”

- **Dimension:** 📖 story  
  **Time:** ~15 min  
  **Hardware:** buttons, led-matrix, speaker, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Track how many attempts it took to match — display.scroll(str(attempts)) at the end.
- Add shake to change your secret without reflashing: MY_SECRET = random.randint(1, 8) on shake.
- Make both boards play the same tune on match — they both have the same celebrate() code, so it syncs!


### 🥔 31. Hot Potato — `31-hot-potato`

*A countdown. A radio pass. Whoever holds it when zero hits — loses.*

> One duck starts with the potato. The countdown ticks. Press B to pass it over radio before it explodes. Write the bargraph countdown, the passing logic, and what happens when time runs out.

> 🦆 Ducky: “Tick tick tick. Do you pass it or hold it? Write the rules — then play.”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~20 min  
  **Hardware:** buttons, led-matrix, speaker, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Make the countdown speed up each time the potato is passed (subtract 2 per pass instead of 1).
- Play faster beeps as the countdown drops: add music.pitch(800 + countdown * 20, 50) inside show_countdown.
- Add a winner counter: track how many rounds each player has won and scroll the score after each round.


### 🔵 32. Morse Messenger — `32-morse-messenger`

*Tap dots and dashes to encode letters. Send them over radio. Decode on arrival.*

> Before texts, sailors used Morse code — short and long signals to spell words. Short press A = dot, long press A = dash — each one flashes the RGB LED and plays a tone. Press B to send the encoded letter over radio. The receiver scrolls the decoded letter and flashes green. You build the dictionary.

> 🦆 Ducky: “Write the alphabet in dots and dashes. Then talk without saying a word.”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~25 min  
  **Hardware:** buttons, led-matrix, rgb-led, speaker, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Add letters G–Z to your MORSE dictionary (look them up online and add each one).
- Swap the dot/dash RGB colours for your own scheme.
- Send a whole word by encoding each letter and sending them one by one with a short pause between — wrap this in a send_word(word) function.


### ⚡ 33. Clicker Wars — `33-clicker-wars`

*Mash your button. Broadcast your score. Write the scoreboard. First to WIN wins.*

> Two boards. Two players. One button each. Both sides broadcast their score every second, both receive the opponent's score. You write the broadcast loop, the receive handler, and a bargraph scoreboard. First to the target wins.

> 🦆 Ducky: “Clicks, broadcasts, scoreboards. You design them all.”

- **Dimension:** 💃 movement  
  **Time:** ~20 min  
  **Hardware:** buttons, led-matrix, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Add a 3-second countdown at the start — both boards show "3", "2", "1", "GO!" before the loop begins.
- Send a "reset" radio command (e.g., "R") that resets both scores to 0 when button B is pressed.
- Show win/loss message to the OPPONENT too: after winning, send "you lose" over radio so they see it.


### 🎮 34. Duck Dash — `34-duck-dash`

*Tilt to move. Collect drops. See your opponent live on the grid. First to WIN wins.*

> This is the capstone. Tilt your board to move your duck around the 5×5 LED grid. Drops appear randomly — collect them to score. Your opponent's position broadcasts over radio and shows up as a dimmer blip. Write the movement, the renderer, the radio bridge, and the drop collection.

> 🦆 Ducky: “Five functions. A full game. You build it.”

- **Dimension:** ⚙️ mechanics  
  **Time:** ~35 min  
  **Hardware:** accel, buttons, led-matrix, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Add collision: if you land on the opponent's position, lose a point (score -= 1).
- Add a button A "boost" that lets you move 2 steps at once for 2 seconds — track a boost timer.
- Speed up the game: reduce sleep(80) to sleep(40) after each drop collected.


### 🦆 35. Name Your Duck — `35-pet-namer`

*Adopt your duck. Give it a name. Make it real.*

> Every great pet has a name. Type one — Ducky scrolls it across the LEDs and remembers it forever. From now on, every mission knows whose duck this is.

> 🦆 Ducky: “I've been waiting for one. Pick a good name for me.”

- **Dimension:** 🦆 pet  
  **Time:** ~5 min  
  **Hardware:** led-matrix  
  **Writes pet field(s):** name

**Objectives / extension challenges once it works:**
- Choose a name with personality — not just "Ducky".
- Press a button on the chip: see the name scroll.
- Try changing the name and re-flashing.


### 🎨 36. Pet Palette — `36-pet-palette`

*Pick your duck's colors and pattern. They show up everywhere.*

> Choose primary, secondary, and pattern. Every page in this app now shows your duck the way you picked.

> 🦆 Ducky: “Dress me up! What's my style?”

- **Dimension:** 🎨 art (also: pet)  
  **Time:** ~6 min  
  **Hardware:** led-matrix  
  **Writes pet field(s):** color, pattern

**Objectives / extension challenges once it works:**
- Match a sports team's colors.
- Pick the most unexpected combo you can.
- Take a screenshot of your duck — share it.


### 🎵 37. Signature Sound — `37-pet-signature-sound`

*Compose a four-note jingle. Your duck plays it on every greeting.*

> Like NBC's three-note "G-E-C" or Netflix's "ta-dum" — every duck deserves its own opener. Pick four notes and lock them in.

> 🦆 Ducky: “When I wake up, what should I sing?”

- **Dimension:** 🎵 music (also: pet)  
  **Time:** ~8 min  
  **Hardware:** speaker  
  **Writes pet field(s):** personality.greeting.tone

**Objectives / extension challenges once it works:**
- Try to copy a TV show's opener.
- Make it ascending. Then descending. Which feels happier?
- Two ducks, two signatures — can a friend hear yours from across the room?


### 📊 38. Data Logger — `38-data-logger`

*Record 30 seconds of any sensor. Graph it back in the browser.*

> Real science means collecting data over time. Pick a sensor, set the duration, press A to start logging. Numbers stream back to the browser as a live graph.

> 🦆 Ducky: “Let's do real science. Tell me what to measure.”

- **Dimension:** 🔬 science  
  **Time:** ~12 min  
  **Hardware:** light, temp, accel, mic

**Objectives / extension challenges once it works:**
- Log light for 30s while you switch the room light on/off.
- Log temperature near a hot drink — watch it spike.
- Log accelerometer while you spin in a chair.


### 🤖 39. Gesture Recognizer — `39-gesture-recognizer`

*Train your duck to know three gestures: shake, tilt left, tilt right.*

> Write the if-statements that classify movement. When you shake, your duck shows ⚡. Tilt left = ←. Tilt right = →. This is gesture detection from scratch.

> 🦆 Ducky: “Teach me three moves. I'll recognise them every time.”

- **Dimension:** 💃 movement (also: science)  
  **Time:** ~12 min  
  **Hardware:** accel, led-matrix

**Objectives / extension challenges once it works:**
- Add a "flip" gesture (negative Z).
- Detect "circle" — track x and y over time.
- Have a friend try to fool your recogniser.


### 🤝 40. Pet Meet — `40-radio-pet-meet`

*Two ducks, two browsers. Trade identities over radio — make friends.*

> Press "Wave hello" on your duck — it broadcasts its name and call sign. Your friend's duck does the same. Both browsers add each other to their My Friends page.

> 🦆 Ducky: “Got a friend with a duck? Let me say hi to them.”

- **Dimension:** 🦆 pet (also: story)  
  **Time:** ~12 min  
  **Hardware:** radio, led-matrix  
  **Two ducks required**  
  **Writes pet field(s):** friends

**Objectives / extension challenges once it works:**
- Meet 3 different friends. Visit /friends and see all of them.
- Try with a friend in the next room — does radio still reach?
- Trade a pet sticker with someone after meeting their duck.


### 💛 41. Mood Beacon — `41-mood-beacon`

*Pick how you feel. Send it to a friend's duck without saying a word.*

> Sometimes it's hard to say how you're feeling out loud. Press A to cycle through five feelings, press B to broadcast — your friend's duck lights up and glows the same colour back. No talking required, just noticing and sharing.

> 🦆 Ducky: “Pick a feeling. Send it. See what comes back.”

- **Dimension:** 🌿 wellbeing (also: story)  
  **Time:** ~12 min  
  **Hardware:** buttons, led-matrix, rgb-led, speaker, radio  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Add a 6th feeling of your own — pick its face, colour, and a short tune.
- Make the receiving duck reply automatically with its own current feeling.
- Keep a running count of each feeling sent — display.scroll() the most common one after 10 sends.


---

## 🪶 Level 4 — Feather (9 missions)

Each mission edits exactly one field of the saved pet's **personality** (greeting routine, mood rules, favourite thing, trick, secret call-sign, grumpy meter, dream mode) through native form controls (dropdowns, sliders) — the browser generates the MicroPython for the kid based on their choices. The capstone mission reads the whole pet back and runs a showcase.

### 👋 41. Boot Greeting — `41-pet-greeting-routine`

*Program what your duck does when it wakes up.*

> Choose its first face, first sound, and first scroll. Every time it powers on, a tiny icon of your actual pet species flashes first — then this is what your friends see.

> 🦆 Ducky: “When I wake, what should I do first?”

- **Dimension:** 🦆 pet (also: story)  
  **Time:** ~8 min  
  **Hardware:** led-matrix, speaker  
  **Reads saved pet**  
  **Writes pet field(s):** personality.greeting

**Objectives / extension challenges once it works:**
- Make a totally over-the-top greeting (long scroll + full tune).
- Make a quiet one — single tone, fast face.
- Compare two greetings side-by-side with a friend.


### 🌈 42. Mood Engine — `42-pet-mood-engine`

*Pick rules — bright → happy, cold → grumpy. Your duck reacts.*

> Stack up to four if/elif rules. Your duck checks sensors continuously and updates its face to match. If a real Grove Temperature Sensor is clipped to pin 1, the "cold"/"warm" rules automatically use that instead of the chip's own guess.

> 🦆 Ducky: “How should I feel when things change?”

- **Dimension:** 🌿 wellbeing (also: pet)  
  **Time:** ~10 min  
  **Hardware:** light, temp, ambient-temp, mic, led-matrix  
  **Reads saved pet**  
  **Writes pet field(s):** personality.moodRules

**Objectives / extension challenges once it works:**
- Make a duck that's ALWAYS happy somehow.
- Make one that's very judgmental — different mood for every sensor.
- Test it: cover the chip, shake it, see the moods cycle.


### 💖 43. Favourite Thing — `43-pet-favorite-thing`

*Pick what makes your duck happy — and what it does when it gets it.*

> A single trigger → a single celebration. Bright light, warm hands, loud noise — your duck has a quirk all its own.

> 🦆 Ducky: “What do I love most? You decide.”

- **Dimension:** 🦆 pet (also: story)  
  **Time:** ~7 min  
  **Hardware:** light, temp, mic, led-matrix, speaker  
  **Reads saved pet**  
  **Writes pet field(s):** personality.favoriteThing

**Objectives / extension challenges once it works:**
- Pick a quirky favourite (cold? quiet?).
- Make the celebration big — full screen + sound.
- Hand to a friend, see if they guess the trigger.


### 🎪 44. Trick Trainer — `44-pet-trick-trainer`

*Teach your duck a gesture trick — shake = dance, tilt = roll.*

> Pick a gesture, pick a trick animation. Your duck performs it whenever the gesture fires.

> 🦆 Ducky: “Train me. I'll learn fast.”

- **Dimension:** 🦆 pet (also: movement)  
  **Time:** ~8 min  
  **Hardware:** accel, led-matrix, speaker  
  **Reads saved pet**  
  **Writes pet field(s):** personality.trick

**Objectives / extension challenges once it works:**
- Train it to do something silly.
- Quiz a friend: "guess what shake does!"
- Try two ducks — same trick, same time.


### 😤 45. Grumpy Meter — `45-pet-grumpy-meter`

*Loud noises slowly make your duck grumpy. Quiet calms it down.*

> Your first **state machine**. The duck holds a "grumpiness" number that creeps up under loud sound and drops in quiet. Cross a line and the face changes.

> 🦆 Ducky: “Be kind to me — I get grumpy if you're too loud.”

- **Dimension:** 🌿 wellbeing (also: pet)  
  **Time:** ~10 min  
  **Hardware:** mic, led-matrix  
  **Reads saved pet**  
  **Writes pet field(s):** personality.grumpyEnabled

**Objectives / extension challenges once it works:**
- Yell at your duck. Watch it become grumpy.
- Stay quiet 30s. Watch it recover.
- Tune the thresholds. Make it sensitive or chilled.


### 📡 46. Secret Call — `46-pet-secret-call`

*A radio cry only your duck recognises. Other ducks ignore it.*

> Your duck has a call sign — a six-letter code generated when it was born. This mission makes it broadcast that call sign, and react only to its own.

> 🦆 Ducky: “Give me a secret call. Only my friends will know it.”

- **Dimension:** 🦆 pet (also: mechanics)  
  **Time:** ~8 min  
  **Hardware:** radio, led-matrix  
  **Two ducks required**  
  **Reads saved pet**  
  **Writes pet field(s):** personality.callSign

**Objectives / extension challenges once it works:**
- Change your call sign — re-flash. Old packets stop matching.
- Two ducks with the same call sign — make them best friends.
- Listen on the channel while a friend broadcasts — yours stays quiet.


### 💤 47. Dream Mode — `47-pet-dream-mode`

*After 30s of stillness, your duck drifts into a sleep animation.*

> Idle detection + a soft dreaming visual. Move it and it wakes. Leave it, it sleeps.

> 🦆 Ducky: “When you forget about me, I'll dream.”

- **Dimension:** 🎨 art (also: pet, wellbeing)  
  **Time:** ~8 min  
  **Hardware:** accel, led-matrix  
  **Reads saved pet**  
  **Writes pet field(s):** personality.dreamMode

**Objectives / extension challenges once it works:**
- Tune the idle window — 10 seconds? 60?
- Change the dream animation.
- See how long you can keep your duck awake.


### 🎾 48. Fetch — `48-pet-game-fetch`

*Throw your duck (a tilt counts). A dot chases the "ball" and brings it back.*

> Tilt one way, the dot zooms across the matrix. Tilt back, it returns. Like fetch — but Python.

> 🦆 Ducky: “Throw the ball! I'll go get it!”

- **Dimension:** 💃 movement (also: pet)  
  **Time:** ~8 min  
  **Hardware:** accel, led-matrix

**Objectives / extension challenges once it works:**
- Tune the chase speed — fast or lazy duck?
- Add a "tired" face after 10 fetches.
- Two ducks playing? Fetch-relay.


### 🎓 49. Graduation — `49-pet-graduation`

*Auto-generated 60-second demo of everything your duck has learned.*

> Reads your pet store and builds one giant routine: greeting → favourite reaction → trick → mood engine → dream mode. Flash, watch, share.

> 🦆 Ducky: “Watch me show off everything you taught me.”

- **Dimension:** 🦆 pet (also: story)  
  **Time:** ~6 min  
  **Hardware:** led-matrix, speaker, accel, mic  
  **Reads saved pet**

**Objectives / extension challenges once it works:**
- Record a video. Send it to a friend.
- Compare two ducks side by side.
- Tweak something earlier and re-run graduation.


---

## 🌟 Level 5 — Soar (9 missions)

Full creative freedom: a blank, free-form Python editor (`FreePythonEditor`) seeded with the saved pet's name/callsign and a useful starting template, no blanks or scaffolding. Missions cover arcade games, sensor-driven music, radio broadcasts, storytelling, and a science-fair CSV export. Sharing is built in via `.duck` files, URL hashes, and QR codes.

### 🏞️ 50. Playground — `50-pet-playground`

*A blank slate. Your pet config preloaded. Write whatever you want.*

> You're free. The template is just a starting point — name, callsign, signature already baked in. Change anything. Flash, see what happens.

> 🦆 Ducky: “No more guard rails. Build something only you would build.”

- **Dimension:** ⚙️ mechanics (also: pet)  
  **Time:** ~30 min  
  **Hardware:** led-matrix, speaker, accel, buttons, logo-touch  
  **Reads saved pet**

**Objectives / extension challenges once it works:**
- Build a step counter that scrolls every 50 steps.
- Make a guessing game where you press A or B to guess high/low.
- Save your code as a .duck file — see Pet Remix mission.


### 🔀 51. Pet Remix — `51-pet-remix`

*Load a friend's .duck file. Tweak. Re-export. Send it back.*

> Drop in a friend's shared duck. See their code. Change one thing — your colours, your tweak, your remix. Export and send it back.

> 🦆 Ducky: “Steal like an artist. Then make it yours.”

- **Dimension:** 🦆 pet (also: story)  
  **Time:** ~15 min  
  **Hardware:** led-matrix  
  **Reads saved pet**

**Objectives / extension challenges once it works:**
- Trade .duck files with a friend.
- Remix something — even a single line. Re-share.
- Trace it back: ask your friend who they got it from.


### 🎮 52. Mini Arcade — `52-mini-arcade`

*A tilt-maze that fits in 5×5. Add your own twist.*

> The template ships a working tilt-maze: dodge obstacles, reach the goal. Tweak speed, walls, scoring — make it harder, weirder, yours.

> 🦆 Ducky: “Best game I've ever played fits in 25 pixels.”

- **Dimension:** 💃 movement (also: mechanics)  
  **Time:** ~30 min  
  **Hardware:** accel, buttons, led-matrix, speaker

**Objectives / extension challenges once it works:**
- Add a timer — game ends after 30s.
- Add lives. 3 wall hits and you lose.
- Build a high-score wall (use display.scroll).


### 🎼 53. Sensor Symphony — `53-sensor-symphony`

*Three sensors become three instruments. Conduct your duck.*

> Light controls pitch. Tilt controls rhythm. Mic controls volume. Move your hand near the chip and music happens.

> 🦆 Ducky: “I'm an orchestra. You're the conductor.”

- **Dimension:** 🎵 music (also: science)  
  **Time:** ~25 min  
  **Hardware:** light, accel, mic, speaker

**Objectives / extension challenges once it works:**
- Swap which sensor controls what.
- Make a duet — two ducks playing different parts.
- Record a 30-second improvisation.


### 🪩 54. Radio Disco — `54-radio-disco`

*One DJ duck, many follower ducks. Synchronised light show.*

> Press A on the DJ — it broadcasts a "beat" packet. Every other duck on the channel flashes its matrix in sync. Get five ducks in a room.

> 🦆 Ducky: “I'm the DJ. The rest are my dance floor.”

- **Dimension:** 🎵 music (also: movement)  
  **Time:** ~25 min  
  **Hardware:** radio, led-matrix, buttons  
  **Two ducks required**

**Objectives / extension challenges once it works:**
- Make 3 different beat patterns. Cycle on each press.
- Have followers play tones too — synchronised sound.
- Try 4 ducks in a room. Time-lapse the show.


### 📚 55. Storybook — `55-pet-storybook`

*Sequence of LED frames + tones. A duck-sized animated tale.*

> String scenes together: a frame, a caption, a sound, a pause. Build a 30-second story your friend can replay just by powering on the chip.

> 🦆 Ducky: “Tell me a story I can act out.”

- **Dimension:** 📖 story (also: art)  
  **Time:** ~25 min  
  **Hardware:** led-matrix, speaker  
  **Reads saved pet**

**Objectives / extension challenges once it works:**
- Tell a real story (your day, a memory, a joke).
- Adapt a 5-line poem.
- Trade storybooks — read each other's.


### 🔬 56. Science Fair — `56-science-fair`

*Log 5+ minutes of any sensor. Export the CSV. Make a real graph.*

> This is the long-form data logger: pick a sensor, set a duration, let it run. Browser captures everything. Export as CSV, open in any spreadsheet.

> 🦆 Ducky: “Real science needs real data. Let's collect some.”

- **Dimension:** 🔬 science  
  **Time:** ~30 min  
  **Hardware:** temp, light, accel, mic

**Objectives / extension challenges once it works:**
- Leave Ducky logging temperature overnight in your bedroom.
- Log light during a TV scene change — watch the graph.
- Log accelerometer during a walk to school.


### 🖼️ 57. Gallery — `57-gallery`

*Every duck you've met. Every remix you've received.*

> Your friends list, your loaded .duck files, your shared remixes — all in one place. Pick one, re-adopt it, remix it, share it onward.

> 🦆 Ducky: “Look at all the ducks you know.”

- **Dimension:** 🦆 pet (also: story)  
  **Time:** ~10 min  
  **Hardware:** —  
  **Reads saved pet**

**Objectives / extension challenges once it works:**
- Open every friend's card — remember when you met.
- Load 3 different .duck files from a folder.
- Send your favourite onward to someone new.


### 🌱 58. Mood Garden — `58-mood-garden`

*An open sandbox for feelings — colour, sound, radio, and a running log.*

> Everything from this whole journey, in one blank file: the RGB LED, built-in sounds, the LED matrix, radio, and your saved pet. Grow it into whatever helps you notice how you feel — a mood diary, a check-in ritual, a broadcast to friends.

> 🦆 Ducky: “No more guard rails. Build a feeling-tracker only you would build.”

- **Dimension:** 🌿 wellbeing (also: pet)  
  **Time:** ~20 min  
  **Hardware:** led-matrix, rgb-led, speaker, radio, buttons  
  **Reads saved pet**

**Objectives / extension challenges once it works:**
- Log every mood change with print('<L D ' + name + ' ' + str(running_time()) + '>') and watch the pattern in the Board Output.
- Build a "check-in" ritual: press A once a day, pick a mood, and have Ducky remember your streak.
- Broadcast your current mood over radio every 10 seconds so a friend's duck always shows how you're doing.


---
