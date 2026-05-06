### What the chip does with your name

When you click **Send**, the browser sends one line over the USB cable:

```python
# Your name becomes a serial command, e.g. for "Ducky":
# N:Ducky
```

The chip receives it and calls MicroPython's built-in scroll function:

```python
elif c == 'N':
    display.scroll(rest + ' ', delay=120, wait=False, loop=True)
```

`display.scroll()` takes care of everything — it converts each letter into a tiny grid of dots and slides them across the 5×5 LEDs one column at a time. `loop=True` makes it repeat forever. The `+ ' '` adds a gap so the name has breathing room before it wraps.

### Why the delay matters

`delay=120` controls how many milliseconds each column stays visible. Smaller = faster. Try `delay=50` (blur) vs `delay=500` (too slow) — you'll feel why 120 is the sweet spot.

> Computers don't know what "A" looks like. They store each letter as a pattern of on/off pixels — your name is literally encoded as a tiny bitmap.
