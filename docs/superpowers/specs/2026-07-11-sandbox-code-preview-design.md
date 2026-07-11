# Sandbox code-preview simulator — design

## Problem

L5 ("Soar") ships 8 free-form sandbox missions (`50-pet-playground`,
`51-pet-remix`, `52-mini-arcade`, `53-sensor-symphony`, `54-radio-disco`,
`55-pet-storybook`, `56-science-fair`, `58-mood-garden`). Each uses
`FreePythonEditor.svelte` — a plain textarea. Kids write or remix real
MicroPython, but the only way to see whether it works is to flash real
hardware. There's no feedback loop while editing, which is where L0/L1
already shine (`LedMatrix.svelte` mirrors state live in those missions —
but that's the *browser's own* generated state being mirrored, not user
-authored Python being executed, so it doesn't transfer directly).

A shallow regex/pattern-matching "preview" was considered and rejected:
reading all 8 templates showed they lean on list comprehensions
(`[row[:] for row in WALLS]`), nested generator expressions inside
`join()`, `def` functions (used in 6 of 8 templates), tuple unpacking
(`for img, caption, tune, ms in SCENES:`), and bare `try/except` — all
authored by us, independent of what a kid edits. Regex cannot track that
control flow, so it would silently mis-render most missions. Decision
(made with user during brainstorming): build a real, restricted-subset
Python interpreter, scoped only to the 8 L5 missions (not the 44
`FlashCodeButton` missions project-wide — L2/L3/L4's fill-in-blank
missions are out of scope for this project).

## Language & API surface

Scope is exactly what the 8 templates use today plus reasonable kid edits
within that structural family — not general Python.

**Supported statements:** assignment (incl. tuple targets: `a, b = 1, 2`),
expression statements, `if`/`elif`/`else`, `while <expr>:`, `for <target>
in <iterable>:` (incl. tuple-unpack targets), `def name(params):` +
`return`, bare `try:`/`except:` (single clause, no exception binding),
`import x` / `from x import *` (parsed, then ignored — names are supplied
by the device-api namespace), `#` comments.

**Supported expressions:** int/float/str/bool/`None` literals, names,
tuples, lists (incl. nested), list comprehensions and generator
expressions (incl. inside `join()`, incl. an optional `if` filter),
indexing, slicing (`msg[5:]`, `lst[:]`), attribute access, calls with
positional and keyword args (`music.play(tune, wait=False)`), binary ops
(`+ - * / // % **`), comparisons (`== != < > <= >= in not in`), boolean
ops (`and or not`), unary (`-`, `not`).

**Explicitly unsupported:** classes, lambdas, f-strings, decorators,
walrus, multi-clause `except`, star-unpacking, default/varargs params. A
kid's edit that hits one of these degrades gracefully (see Error
handling) rather than crashing the whole preview.

**Builtins:** `len abs min max str int float range print bool`,
`random.choice`, `random.randint`, string `.join .startswith .replace`,
list `.append`.

**Device API namespace** (fresh instance per run, backs the simulated
LED/output state):
- `display`: `show scroll clear set_pixel get_pixel read_light_level on
  off`
- `Image`: the 7 named constants actually used across the 8 templates
  (`HAPPY HEART YES SURPRISED ASLEEP ARROW_E MUSIC_QUAVER`, confirmed via
  grep) plus the `Image("99099:...")` grid-string constructor. A handful
  of other well-known constants (`SAD NO ALL_LEDS`) are cheap to include
  alongside them for headroom on kid edits, but the 7 above are the
  contract this project is scoped against.
- `music`: `play(notes, wait=True)`, `pitch(freq, ms)` — logged + a brief
  tone indicator, no real audio
- `radio`: `on off config send receive` — `receive()` always returns
  `None` in this single-board preview (see Known limitation below);
  `send()` logs to the output panel
- `accelerometer`: `get_x get_y get_z get_strength` — driven by a
  simulated tilt-pad control
- `microphone.sound_level()` — driven by a slider
- `button_a` / `button_b`: `was_pressed is_pressed` — driven by press
  buttons, proper edge-triggered semantics (each simulated press satisfies
  exactly one `was_pressed()` check)
- `pin_logo.is_touched()` — driven by a touch button
- `neopixel.NeoPixel(pin, n)` — index-assignable pixel object + `.show()`,
  rendered as small colour swatches
- `temperature()` — driven by a slider
- `running_time()` — ms elapsed since the current run started
- `sleep(ms)` — yields the interpreter (see Execution model)

## Architecture

New module, `src/lib/simulator/`:

| File | Responsibility |
|---|---|
| `lexer.ts` | Tokenizes source, indentation-aware (Python-style INDENT/DEDENT) |
| `ast.ts` | AST node types |
| `parser.ts` | Recursive-descent parser → AST; raises a structured `ParseError` with line number on unsupported syntax |
| `interpreter.ts` | Generator-based (`function*`) tree-walking evaluator with lexical scope chain (globals + per-call frames) |
| `device-api.ts` | Builds the global namespace object each run; owns the reactive `SimDeviceState` (matrix bits, neopixel colour(s), output log lines, last error) that the UI reads |
| `builtins.ts` | Python builtin functions and the string/list methods listed above |
| `images.ts` | `Image.*` constant → 25-bit pattern table |

## Component: `MicrobitPreview.svelte`

New shared component, `src/lib/components/MicrobitPreview.svelte`.

**Props:** `code: string`.

**Renders:**
- `LedMatrix` bound to `SimDeviceState.bits`
- A small neopixel swatch row, shown only if the program constructs a
  `NeoPixel`
- An output log panel (same visual language as `SerialMonitor`) showing
  `print()` output, `radio.send()` events, and scroll text
- Simulated input controls, shown only for APIs referenced in the current
  parse (cheap string/AST scan, not exact — a harmless false positive just
  shows an unused control): Press A / Press B / Touch logo buttons, an
  accelerometer tilt-pad (x/y drag, z fixed), light/mic/temperature
  sliders
- Play / Pause / Restart controls
- A small fixed caption: "Preview — an approximation. Flash to see it for
  real."

**Layout:** placed in a responsive grid next to `FreePythonEditor` (two
columns ≥ `md`, stacked below it on mobile) in each of the 8 mission
files.

## Execution model

The interpreter runs as a persistent generator that mirrors the
`while True: ... sleep(ms)` shape of every template:

- Yields at every `sleep(ms)` call. The component resumes it after a
  scaled real-time delay — `clamp(ms * scale, 16, 600)` — so a
  `sleep(5000)` doesn't stall the preview for 5 real seconds, while
  relative pacing between fast/slow sleeps is still felt.
- Also yields every ~2,000 executed statements as a safety valve, so a
  kid-edited loop that drops the trailing `sleep()` can't hang the tab. If
  a run hits this cap repeatedly without ever reaching a real `sleep()`,
  the component stops auto-resuming and shows: "This loop doesn't pause —
  preview stopped it to stay responsive."
- Debounced restart: ~500ms after the kid stops typing, the whole
  interpreter state (globals, generator, `SimDeviceState`) is torn down
  and rebuilt from the top — the same mental model as re-flashing.
- Button/tilt/slider input changes do **not** restart the interpreter —
  they just update the values the running generator reads on its next
  `is_pressed()`/`get_x()`/etc. call, same as real hardware.

## Error handling

- **Parse failure** (unsupported syntax): banner shown immediately, run
  is not attempted. If a previous successful run exists, its last frame
  stays visible (dimmed) with the banner overlaid; otherwise the matrix
  shows blank/idle.
- **Runtime error mid-loop** (unsupported call, index out of range, type
  error): caught per-statement. Logged as one friendly line in the output
  panel (`⚠️ line 12 — preview isn't sure what to do here`), then the
  current loop iteration is abandoned and the generator is resumed from
  the top of the enclosing `while`, so one bad line doesn't permanently
  freeze the preview.
- Neither error path throws to the Svelte component boundary — all
  parse/run errors are caught inside the simulator module and surfaced as
  data (`SimDeviceState.error`), never as an uncaught exception.

## Known limitation (by design)

`radio.receive()` always returns `None`. Simulating a second board's
packets is explicitly deferred to the separate radio dual-simulation
project (targets L3's paired missions, not L5). `54-radio-disco`'s
"follower" role and `58-mood-garden`'s incoming-packet path will show no
activity in preview — sending still works and is visible in the output
log.

## Testing

- Unit tests for the parser (each supported statement/expression form,
  plus confirming unsupported forms raise `ParseError` with a line
  number, not a crash) and interpreter (variable scoping, tuple unpack,
  comprehensions, `try/except` control flow, builtin behavior).
- One golden-path interpreter test per existing L5 template's `INITIAL`
  source, asserting it parses and that a bounded number of ticks produces
  the expected `display.show`/`scroll` sequence for a scripted sequence of
  simulated inputs (e.g., "press A" → expect `Image.HEART` then
  `Image.HAPPY`).
- Manual verification in the running app: load each of the 8 missions,
  confirm the preview renders, edit code (including breaking it) and
  confirm graceful degradation, confirm Ctrl+A-clear no longer reloads
  the template (regression check for the bug fix already shipped).

## Out of scope for this project

- L2/L3/L4 `CodeEditor`/`FlashCodeButton` missions (44 total) — no preview
  added here.
- Tutorial/map mode (separate project, next).
- Radio dual-board simulation (separate project, after tutorial mode).
