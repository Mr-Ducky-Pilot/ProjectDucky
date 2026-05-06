### Reading Earth's magnetic field

`compass.heading()` returns 0–359 degrees where 0° is magnetic north. The code maps the heading onto one of 8 arrow images:

```python
ARROWS = [
    Image.ARROW_N, Image.ARROW_NE, Image.ARROW_E, Image.ARROW_SE,
    Image.ARROW_S, Image.ARROW_SW, Image.ARROW_W, Image.ARROW_NW
]

elif preset == 'compass-quest':
    if n - state.get('t', 0) > 300:
        state['t'] = n
        h = compass.heading()
        display.show(ARROWS[int(((h + 22) % 360) / 45)])
```

Each arrow covers 45°. The `+ 22` shifts the boundaries so North is truly centred (337.5°–22.5°) rather than off by one slice.

`int(((h + 22) % 360) / 45)` breaks the full circle into 8 equal slices and returns 0–7:

```python
# heading 0°   → index 0 → ARROW_N
# heading 45°  → index 1 → ARROW_NE
# heading 90°  → index 2 → ARROW_E
# ...
# heading 315° → index 7 → ARROW_NW
```

### Why 300ms?

The magnetometer is slower than the accelerometer — refreshing every 300ms is enough to feel smooth while the chip rotates.

> The chip has a tiny magnet sensor (magnetometer) that can feel Earth's own magnetic field. Compasses have worked this way since 1000 CE — the physics is ancient, only the detector has changed.
