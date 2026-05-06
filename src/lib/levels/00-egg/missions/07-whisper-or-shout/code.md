### Sound as a number

The micro:bit's microphone converts sound pressure waves into a number: `microphone.sound_level()` returns 0 (silence) to 255 (very loud). The bargraph shows it visually:

```python
elif preset == 'whisper':
    if n - state.get('t', 0) > 80:
        state['t'] = n
        v = microphone.sound_level()
        display.show(bargraph(v, 255))
```

`80ms` between updates gives ~12 refreshes per second — fast enough to feel live, not so fast it flickers.

### The bargraph function again

```python
def bargraph(value, max_value):
    lit = max(0, min(5, int((value / max_value) * 5)))
    rows = ["11111" if (4 - r) < lit else "00000" for r in range(5)]
    return Image(":".join(rows))
```

`int((v / 255) * 5)` maps the range 0–255 to 0–5 lit rows. A clap that hits 200 would light `int((200/255)*5)` = 3 rows. `max(0, min(5, ...))` clamps the result so it can never go out of bounds.

### What the browser sees

```python
if s == 'mic':
    return str(microphone.sound_level())
```

When the browser subscribes to the `mic` sensor, the chip pushes this number every 90ms. The VU meter graph in the companion app is drawn from this stream.

> Sound is just air pressure changing quickly. The microphone turns those pressure changes into tiny voltage swings — and the chip reads the voltage as a number.
