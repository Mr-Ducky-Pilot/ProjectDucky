### Reading light, drawing a sunrise

```python
elif preset == 'sunrise':
    if n - state.get('t', 0) > 250:
        state['t'] = n
        l = display.read_light_level()       # 0..255
        lit = max(0, min(5, int(l / 50)))    # how many rows to light
        rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
        display.show(Image(":".join(rows)))
```

`display.read_light_level()` is the magic call — same LEDs you write to, now
read as a sensor. Cover them and the number drops. Shine on them and it climbs.
