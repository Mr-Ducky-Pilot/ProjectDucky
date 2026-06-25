# Ducky OS firmware split — design

## Problem

Flashing fails with `There is no storage space left.` This is thrown by
`@microbit/microbit-fs` inside `getIntelHex()`, called from
`buildDuckyHex()` / `buildCustomHex()` in `src/lib/firmware/build.ts` —
**before** any WebUSB/DAPLink communication happens. Nothing is ever sent
to the board, so erasing or reformatting the physical micro:bit's storage
has no effect on this error.

### Root cause (measured, not estimated)

`static/firmware/micropython-v2.hex` reserves a filesystem region of
**20,480 bytes (20 KB)**, confirmed via `MicropythonFsHex.getStorageSize()`.
This is a hard ceiling baked into the runtime hex's UICR data — it cannot
be raised via `setStorageSize()` (which only allows *smaller* values).

Current combined source written into that filesystem on every L0/L1 flash:

| File | Bytes |
|---|---|
| `src/lib/firmware/ducky_os.py` | 34,461 |
| `src/lib/firmware/ssd1327.py` | 6,940 |
| **Total** | **41,401** — over budget by ~21 KB |

Byte breakdown of `ducky_os.py` (measured by extracting line ranges and
re-encoding):

| Region | Bytes |
|---|---|
| `tick()` — all 16 preset behaviors | 18,270 |
| Core listener (protocol parsing, sensor sampling, main loop, boot) | 11,867 |
| OLED helper functions (`_draw_duck`, `_draw_heart`, `_boot_anim`, `_oled_show_menu`) | 2,768 |
| `PRESET_LIST` + `MENU_ICONS` (on-board menu) | 1,471 |

Two presets (`cold-hands`, `wave-across`) still have `tick()` branches and
button/radio handling (~250 bytes) despite their missions being removed
per CLAUDE.md — confirmed dead code, not referenced in `PRESET_LIST`.

Core listener + OLED driver + OLED helpers alone = 11,867 + 6,940 + 2,768
= **21,575 bytes** — over the 20,480 budget with **zero presets
included**. Splitting only "by level" doesn't fit either: an L0-only
bundle (core + menu + all 16 presets, no L1 protocol commands) is still
~32 KB, nowhere near 20 KB, because almost all the bytes live inside the
individual preset behaviors, not at the level boundary.

## Decision (made with user during brainstorming)

- Keep OLED animations (added June 2026, not negotiable per user).
- Accept that this forces **one preset per flash** for L0 (the math: even
  one preset + core + OLED needs ~2.3 KB more headroom than today's code
  provides, recoverable via dead-code removal + comment/blank-line
  stripping — see below). "Grouped packs of 4" is not achievable while
  keeping OLED.
- Accept that the on-board "browse 16 activities via A/B without a
  computer" menu goes away. With only one preset ever resident, there's
  nothing to cycle through.

## Design

### Three build outputs (was one universal `buildDuckyHex()`)

| Output | Contains | Used by |
|---|---|---|
| `buildL1Hex()` | core listener + OLED driver, no presets/menu | All 17 L1 missions, L1 overview pre-flash card |
| `buildL0PresetHex(preset: string)` | core listener + OLED + **one** hardcoded preset's `tick()` body, no menu | Each L0 mission's `FlashButton` |
| `buildCustomHex(source)` | unchanged — user code + `ssd1327.py` | L2 (not affected by this change) |

L1 missions never set a preset today (confirmed: 0 of 17 L1
`mission.meta.ts` files have a `preset` field) — `tick()`'s 18 KB and the
on-board menu are already dead weight on every L1 flash. Splitting them
out is pure savings with no feature loss for L1.

### `ducky_os.py` stays the single source of truth

No hand-maintained per-preset files. Add marker comments around the
menu-only regions:

```python
# L0-MENU-ONLY:BEGIN
PRESET_LIST = (...)
MENU_ICONS = {...}
# L0-MENU-ONLY:END
```

(similarly around `_oled_show_menu` and the menu-nav branches inside the
main loop's button/logo-touch handling).

`build.ts` does text slicing at build time:

- **`buildL1Hex()`**: strip everything between `L0-MENU-ONLY` markers,
  replace the `tick()` function body with `pass`, hardcode
  `menu_mode = False` at the state-init line.

  This also fixes a latent bug: today, flashing *any* L1 mission leaves
  `menu_mode = True` at boot (only the `P:` command clears it, via
  `handle()`, and L1 never sends `P:`). So physical A/B button presses on
  a flashed L1 mission currently navigate the (pointless, for L1)
  on-board preset menu instead of forwarding `<B A down>` /
  `<B B down>` events to the browser — breaking missions like
  `15-reaction-tester` that read board buttons directly. Removing the
  menu code path for the L1 build removes this failure mode as a direct
  consequence, not as separate added scope.

- **`buildL0PresetHex(name)`**: strip the `L0-MENU-ONLY` markers too.
  Within `tick()`, regex-extract the single matching
  `(?:if|elif) preset == '<name>':` block (boundaries already verified
  clean — every preset branch starts on its own `elif` line) and discard
  the rest of the chain. Hardcode `preset = '<name>'` in place of
  `preset = None`.

- Both variants also delete the two dead presets (`cold-hands`,
  `wave-across`) and their button/radio handling.

- Both variants run a conservative minifier pass over the assembled
  source before writing it to the filesystem: strip whole comment-only
  lines (`^\s*#.*$`) and whole blank lines. Never touch trailing
  comments on a code line (indentation-sensitive language — only
  whole-line removal is safe). This recovers the ~10% needed to fit
  core + OLED + one preset under 20 KB with a small margin.

### `connection.ts` / `FlashButton.svelte`

`lastFlashedFirmware` changes from `'ducky-os' | 'custom' | null` to
`'l1' | \`l0:${preset}\` | 'custom' | null`.

- L1 keeps today's instant-skip ("already loaded, just send the
  command") — all L1 missions still share one hex.
- **L0 loses the instant-skip across different missions.** Switching
  from one L0 mission to a different preset re-flashes (a few seconds),
  because each mission's hex is genuinely different firmware now.
  Revisiting the *same* preset stays instant (exact string match on
  `l0:${preset}`).

### Level overview page (`src/routes/level/[level]/+page.svelte`)

- L1 overview: unchanged — still pre-flashes the universal L1 hex via
  the existing "Flash Ducky" card.
- L0 overview: drops the pre-flash (there is no single L0 hex to
  pre-load anymore). The card becomes "Connect Ducky" — calls
  `connection.connect()` only. The first L0 mission visited performs
  the actual flash.

### Verification

Add a script/test that builds `buildL1Hex()` and `buildL0PresetHex(name)`
for all 15 live L0 presets, asserting the assembled filesystem size stays
under 20,480 bytes for every one of them. This turns a future preset
addition that blows the budget into a loud build-time failure instead of
a "no storage space left" surfacing in a user's browser months later.

## Out of scope

- L2 (`buildCustomHex`) — untouched, already per-mission and unaffected.
- Building a custom MicroPython runtime hex with a larger filesystem
  reserve — not pursued; text-level splitting solves the problem without
  needing a new runtime build.
- Re-introducing any form of multi-preset on-board menu — explicitly
  traded away to keep OLED animations.
