# Level 2 — Waddle: Design Plan
# + Level 1 Responsibility Upgrades

---

## Philosophy shift across levels

| Level | Kid's role | Hardware relationship |
|---|---|---|
| 🥚 L0 Egg | Observer — flash, watch, discover | Board is a magic toy |
| 🐣 L1 Hatch | Controller — browser sliders/pads control board in real time | Board is a remote screen |
| 🐥 L2 Waddle | **Author** — fill in real MicroPython, flash your own code | Board runs *your* program |
| 🦆 L3 Swim | Designer — write full programs + pair missions | Board is a platform |

**L2 core idea:** Kids write the actual Python that runs on the chip. Not blocks, not pseudocode — real MicroPython, with the hard scaffolding provided and the meaningful logic left blank. They see their code run immediately on hardware. That moment of "I wrote this and it's *alive*" is the hook.

---

## L1 Responsibility Upgrades

No major refactoring needed. Each L1 mission gets a **"Your Turn 🎯"** panel that appears below the Interactive. It gives kids a specific goal to achieve with the controls — turns exploration into problem-solving.

### Mission-by-mission challenges

| Mission | Current | Your Turn challenge |
|---|---|---|
| 11 Drawing Pad | Draw anything | **Pixel Art Challenge**: A target image is shown (duck, smiley, arrow). Kid must recreate it pixel-for-pixel. Tick a "Done!" checkbox when it matches. |
| 13 Welcome Jingle | Tap random notes | **Copy the Tune**: Show a target sequence of notes (e.g. C C G G A A G). Kid must recreate it by tapping. Play both and hear the difference. |
| 14 Light Theremin | Explore the theremin | **Play the Scale**: Show C D E G A as a target sequence. Kid must play each note in order by moving their hand over the chip. |
| 15 Reaction Tester | Tap fast | **Beat 250ms**: First attempt is baseline. Kid must improve their best to under 250ms. "Did you beat it?" button unlocks. |
| 16 Pixel Animator | Animate freely | **Bouncing Ball**: Show 3 target frames (dot at top / middle / bottom). Kid recreates each frame, then plays the animation. |
| 17 Dice Roller | Roll randomly | **Fairness Test**: Roll 18 times. Tally each result with a counter in the browser. Does each number appear roughly 3 times? (Probability concept.) |
| 18 Step Counter | Count steps | **Calibration Challenge**: Walk exactly 10 steps. Did the counter hit 10? Adjust the sensitivity until it matches perfectly. |
| 19 Sound Alarm | Arm and trigger | **Whisper vs Shout**: Set sensitivity so quiet talking doesn't trigger it but a single clap does. Find the sweet spot and record the threshold value. |
| 20 Metronome | Set BPM | **Song Detective**: Tap along to 3 preset songs (the app plays the song melody, kid taps the beat). Discover each song's BPM. |

### Implementation: YourTurn component

```svelte
<!-- New shared component: YourTurn.svelte -->
<script lang="ts">
    type Props = {
        title: string;
        steps: string[];
        hint?: string;
    };
    let { title, steps, hint }: Props = $props();
    let checked = $state<boolean[]>(steps.map(() => false));
    const allDone = $derived(checked.every(Boolean));
</script>

<div class="mt-5 rounded-3xl border-2 border-(--color-duck-yellow)/40 bg-(--color-duck-yellow)/8 p-5">
    <p class="mb-3 text-sm font-extrabold text-(--color-night-ink)">🎯 Your Turn: {title}</p>
    {#each steps as step, i}
        <label class="mb-2 flex cursor-pointer items-start gap-3">
            <input type="checkbox" bind:checked={checked[i]} class="mt-0.5 accent-(--color-duck-yellow)" />
            <span class="text-sm" class:line-through={checked[i]}>{step}</span>
        </label>
    {/each}
    {#if allDone}
        <p class="mt-3 rounded-xl bg-(--color-leaf-green)/20 p-3 text-sm font-bold text-(--color-leaf-deep)">
            ✅ Nailed it! You're ready for Level 2.
        </p>
    {/if}
</div>
```

Each L1 mission `Interactive.svelte` gets a `<YourTurn>` block added at the bottom — no architectural changes.

---

## L2 Technical Architecture

### The key insight

`build.ts` already uses `@microbit/microbit-fs` to bundle any Python source with the MicroPython runtime. For L2, we just expose a `buildCustomHex(source: string)` variant that takes *the student's assembled code* instead of `ducky_os.py`.

```ts
// src/lib/firmware/build.ts — add this function

/** Build a hex from an arbitrary Python source string (for L2 missions). */
export async function buildCustomHex(source: string): Promise<ArrayBuffer> {
    const runtime = await fetchRuntime();  // same cached runtime
    const fs = new MicropythonFsHex(runtime);
    fs.write('main.py', source);
    const hexString = fs.getIntelHex();
    const encoder = new TextEncoder();
    return encoder.encode(hexString).buffer as ArrayBuffer;
}
```

No new dependencies. Same WebUSB flashing pipeline. Kids' code runs exactly like any other firmware.

---

### Template format

Each L2 mission stores a Python template with `___` gaps:

```python
from microbit import *

count = 0

while True:
    sound = microphone.sound_level()
    
    if sound > ___:          # how loud is a clap? (try 150)
        count = count + ___  # add this much per clap (try 1)
        display.show(count)
        sleep(500)
    
    sleep(___)               # check this often in ms (try 50)
```

The `Interactive.svelte` renders each `___` as an inline `<input>` field. When all fields are filled, the assembled Python is sent to `buildCustomHex()`.

---

### New components needed

**`CodeEditor.svelte`** — renders a template with inline inputs:
- Dark terminal background (same style as CodeCard)
- `___` → yellow-bordered `<input type="text">` with min-width
- Inline hint tooltip on hover (from the `# (try X)` comment in template)
- "All blanks filled?" validation before enabling flash
- Line numbers, monospace font

**L2 Interactive pattern:**
```svelte
<script lang="ts">
    import CodeEditor from '$lib/components/CodeEditor.svelte';
    import { buildCustomHex } from '$lib/firmware/build';
    import { connection } from '$lib/stores/connection';

    const TEMPLATE = `from microbit import *\n\ncount = 0\n...`;

    async function run(assembled: string) {
        const hex = await buildCustomHex(assembled);
        await connection.flash(hex);
        await connection.waitForReady();
        // no preset — kid's code IS the program
    }
</script>

<CodeEditor template={TEMPLATE} onRun={run} />
```

---

### Mission file structure

```
src/lib/levels/02-waddle/missions/21-clap-counter/
  mission.meta.ts        ← level: 2, order: 21
  Interactive.svelte     ← CodeEditor + flash logic
  template.py            ← imported as ?raw, has ___ gaps
  concept.md             ← why this works
  code.md                ← the complete solution (hidden until "Show me")
```

The `code.md` serves double duty — it's the working solution AND the explainer shown after the kid gets it running.

---

## L2 Mission Designs

**Learning arc:** variable → condition → compound condition → two players → loop + API → 2D coordinates

---

### Mission 21 — Clap Counter 🎤
**Concept:** variables + a single if-condition
**Sensors:** mic, led-matrix
**Time:** 8 min

**Template:**
```python
from microbit import *

count = 0          # this number grows as you clap

while True:
    sound = microphone.sound_level()
    
    if sound > ___:          # how loud is a clap? (try 150)
        count = count + ___  # add this much each time (try 1)
        display.show(count)
        sleep(500)           # pause so one clap = one count
    
    sleep(___)               # how often to check? (try 50)
```

**Blanks:** threshold (150), increment (1), poll interval (50)
**Result:** board shows an incrementing number as kids clap
**Concept card:** variables are named boxes that hold a number. `count + 1` means "add 1 to whatever's already there."
**Your Turn:** Set the threshold so whispering doesn't trigger it but a clap does. What's the magic number?

---

### Mission 22 — Mood Machine 😊
**Concept:** if / elif / else (multiple branches)
**Sensors:** temp, led-matrix
**Time:** 8 min

**Template:**
```python
from microbit import *

while True:
    temp = temperature()     # CPU temperature in °C
    
    if temp < ___:           # below this = too cold (try 22)
        display.show(Image.SAD)
    elif temp > ___:         # above this = too hot (try 28)
        display.show(Image.CONFUSED)
    else:
        display.show(___)    # just right — which image? (try Image.HAPPY)
    
    sleep(500)
```

**Blanks:** cold threshold (22), hot threshold (28), middle face (Image.HAPPY)
**Result:** board shows different face depending on temperature range
**Concept card:** if / elif / else is like a flowchart — only one branch runs per loop. Python checks each condition from top to bottom and stops at the first match.
**Your Turn:** Breathe on the chip to warm it up. Can you make it show CONFUSED by warming it above the hot threshold?

---

### Mission 23 — Steady Hand 🤚
**Concept:** compound condition (two things must be true at once)
**Sensors:** accel, led-matrix
**Time:** 10 min

**Template:**
```python
from microbit import *

record = 0    # best score (longest steady streak)
streak = 0    # current streak

while True:
    x = accelerometer.get_x()    # -1024 to +1024
    y = accelerometer.get_y()
    
    # wobble = how much you're tilting (0 = perfectly still)
    wobble = abs(x) + abs(y)
    
    if wobble < ___:    # steadiness limit (try 200 — lower = harder)
        streak = streak + 1
        if streak > record:
            record = streak
        display.show(Image.YES)
    else:
        streak = 0      # reset — you wobbled!
        display.show(Image.NO)
    
    sleep(___)          # how often to check? (try 100)
```

**Blanks:** wobble threshold (200), sleep (100)
**Result:** YES while holding still, NO on wobble, tracks best streak
**Concept card:** `abs()` turns negative numbers positive — it measures distance from zero, not direction. Tilting left or right both count as wobble.
**Your Turn:** Start with threshold 500 (easy). Beat a score of 20. Then lower it to 150 — how long can you hold it? Lower = harder, like a real surgeon's game.

---

### Mission 24 — Button Race 🏁
**Concept:** multiple events, game state, two counters
**Sensors:** buttons, led-matrix
**Time:** 8 min

**Template:**
```python
from microbit import *

a = 0           # player A score (left button)
b = 0           # player B score (right button)
WIN = ___       # how many presses to win? (try 10)

while True:
    if button_a.was_pressed():
        a = a + 1
    if button_b.was_pressed():
        b = b + 1
    
    if a >= ___:             # same number as WIN
        display.scroll(___)  # what to show? (try "A!")
        break                # stop the game
    if b >= ___:             # same number as WIN
        display.scroll(___)  # (try "B!")
        break
    
    # Show current lead
    if a > b:
        display.show('A')
    elif b > a:
        display.show('B')
    else:
        display.show('-')    # tied!
    
    sleep(___)               # try 20
```

**Blanks:** WIN (10), two comparisons (10), two victory messages ("A!" / "B!"), sleep (20)
**Result:** two-player button-mash race, board shows the leader, scrolls winner
**Concept card:** `was_pressed()` returns True only once per press — it's an event, not a state. Checking `is_pressed()` in a fast loop can count one press as many. `was_pressed()` is the right tool for counting.
**Your Turn:** Change WIN to 20. Change the victory messages to something funny. What's the fastest you've ever won in?

---

### Mission 25 — Night Light 💡
**Concept:** real application — threshold + sensor + output, `for` loops
**Sensors:** light, led-matrix, speaker
**Time:** 10 min

**Template:**
```python
from microbit import *
import music

THRESHOLD = ___    # what light level triggers the alarm? (try 100)
FLASHES = ___      # how many times to flash? (try 5)

display.show(Image.HAPPY)    # armed and waiting

while True:
    light = display.read_light_level()   # 0 (dark) to 255 (bright)
    
    if light > ___:          # same as THRESHOLD above
        # Alarm!
        for i in range(___): # same as FLASHES above
            display.show(Image.NO)
            music.play(music.___)    # which song? (try NYAN or BADDY or WAWAWAWAA)
            display.clear()
            sleep(100)
        
        display.show(Image.HAPPY)    # reset — armed again
    
    sleep(200)
```

**Blanks:** THRESHOLD (100), FLASHES (5), comparison (THRESHOLD), range (FLASHES), music tune (NYAN/BADDY)
**Result:** chip sits on a shelf — torch at it and it screams and flashes
**Concept card:** `for i in range(5)` runs a block of code exactly 5 times. It's a counted loop. The `i` variable counts 0, 1, 2, 3, 4 — but we don't use it here, we just need the repetition.
**Your Turn:** Cover the chip completely then shine a torch on it. Does it trigger? Lower THRESHOLD to 50 — does it trigger in normal room light? Find the number that's sensitive to a torch but not to room light.

---

### Mission 26 — Dot Mover 🕹️
**Concept:** 2D coordinates, wrapping, game loop — foundation of Snake
**Sensors:** buttons, led-matrix
**Time:** 12 min

**Template:**
```python
from microbit import *

# The dot lives at position (x, y) — column and row
x = 2    # columns: 0 (left) to 4 (right)
y = 2    # rows: 0 (top) to 4 (bottom)

while True:
    display.clear()
    display.set_pixel(___, ___, 9)    # show dot at (x, y) — brightness 9
    
    # Move with buttons
    if button_a.was_pressed():
        x = x - ___    # move left (try 1)
    if button_b.was_pressed():
        x = x + ___    # move right (try 1)
    
    # Wrap around the edges so the dot never disappears
    if x > ___:    # gone past the right edge? (try 4)
        x = 0      # appear on left
    if x < ___:    # gone past the left edge? (try 0)
        x = 4      # appear on right
    
    sleep(___)     # how fast? (try 80)
```

**Blanks:** x and y in set_pixel (x, y), left step (1), right step (1), right edge (4), left edge (0), sleep (80)
**Result:** a dot moves left and right with A/B buttons, wraps around
**Concept card:** `display.set_pixel(col, row, brightness)` controls a single LED. col=0 is the left edge, row=0 is the top edge. Your phone's screen works the same way — every pixel has an (x, y) address.
**Your Turn:** Change the A/B buttons to move *up and down* instead. You'll need to change `x` operations to `y` operations. Check that wrapping works for rows 0–4 too.

---

## L2 Infrastructure Summary

### New files to create

```
src/lib/
  levels/02-waddle/
    level.meta.ts
    missions/
      21-clap-counter/    ← {mission.meta.ts, Interactive.svelte, template.py, concept.md, code.md}
      22-mood-machine/
      23-steady-hand/
      24-button-race/
      25-night-light/
      26-dot-mover/
  components/
    CodeEditor.svelte     ← renders template with ___ as inline inputs
  firmware/
    build.ts              ← add buildCustomHex(source) function
```

### CodeEditor.svelte spec

- Parses template by splitting on `___`
- Alternates: code text → input → code text → input → ...
- Each input is rendered inline, monospace, min-width 60px
- Input highlights yellow on focus (matches duck-yellow)
- Hint: the comment text after `# ` on the same line shown as placeholder
- "Run on Ducky" button enabled only when all inputs have content
- On run: reassemble source string (template parts interleaved with input values), call `buildCustomHex(assembled)`, flash

### build.ts addition

```ts
/** Build a hex from an arbitrary Python source (L2 missions). No caching — each student's code is unique. */
export async function buildCustomHex(source: string): Promise<ArrayBuffer> {
    const runtime = await fetchRuntime();
    const fs = new MicropythonFsHex(runtime);
    fs.write('main.py', source);
    const hexString = fs.getIntelHex();
    return new TextEncoder().encode(hexString).buffer as ArrayBuffer;
}
```

### Mission page changes for L2

- FlashButton is NOT shown for L2 — the CodeEditor handles flash itself
- ConceptCard stays in sidebar
- CodeCard shows the full solution (collapsed by default, "Show solution" to expand)

---

## Implementation order

1. `buildCustomHex()` in `build.ts` (30 min)
2. `CodeEditor.svelte` component (2h)
3. `YourTurn.svelte` component (30 min)
4. Add YourTurn to all L1 Interactives (1h)
5. `02-waddle/level.meta.ts` + `+page.svelte` for level 2 route
6. One mission at a time (21→26), ~45 min each:
   - Write `template.py`
   - Write `Interactive.svelte` (mostly CodeEditor + flash)
   - Write `concept.md` + `code.md`
   - Write `mission.meta.ts`

**Total estimate:** ~12h focused dev time

---

## Learning arc across all three levels

```
L0: Flash → watch → "oh wow it does that!"
L1: Slide → see board change → "I control it!"
L2: Fill the gap → flash → board runs my code → "I MADE it do that!"
```

The L2 moment of realisation — that the code they typed is literally running on the chip — is the payoff of the whole L0–L1 journey.
