### Read, classify, show

```python
elif preset == 'warm-cold':
    tc = read_ambient_c()                # real Grove sensor, if connected
    if tc is None:
        tc = temperature()                # fall back to the chip's own guess
    lit = max(0, min(5, (tc - 18) // 3 + 1))
    rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
    display.show(Image(":".join(rows)))
```

`temperature()` is a single function call — the chip already does the work.
`read_ambient_c()` does a bit more: it reads a voltage from pin 1, converts
it to a resistance, then to a temperature using the sensor's published
"Beta" formula — and returns `None` if nothing's plugged in, which is how
the firmware knows to fall back. The maths after that is the same either
way: "18°C" maps to 1 lit row, "33°C+" to all 5.
