### Reading the chip's thermometer

`temperature()` returns the CPU die temperature in degrees Celsius. `bargraph()` converts that into a visual bar:

```python
elif preset == 'cold-hands':
    if n - state.get('t', 0) > 300:
        state['t'] = n
        display.show(bargraph(temperature() - 18, 14))
```

It subtracts 18 (roughly room temperature) so the bar starts near zero when idle. As you warm it with your hands, the reading climbs toward 32°C and the bar fills up.

### How bargraph works

```python
def bargraph(value, max_value):
    lit = max(0, min(5, int((value / max_value) * 5)))
    rows = ["11111" if (4 - r) < lit else "00000" for r in range(5)]
    return Image(":".join(rows))
```

It maps `value` (0 → `max_value`) onto 0 → 5 lit rows. If `lit` is 3, the bottom 3 rows are all `11111` and the top 2 are `00000`. The result is a rising bar on the LED matrix.

### Why the 300ms gap?

`temperature()` doesn't change that fast — checking every 300ms is more than enough and saves the CPU from busy-looping.

> The temperature sensor isn't measuring air — it's reading the chip's own heat. Holding it warms the silicon directly.
