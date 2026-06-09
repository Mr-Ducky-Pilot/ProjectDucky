### Tilt → coordinates → pixel

```python
elif preset == 'bubble':
    ax = accelerometer.get_x()
    ay = accelerometer.get_y()
    # bubble drifts to the high side (opposite the tilt)
    bx = 2 - max(-2, min(2, int(ax / 350)))
    by = 2 - max(-2, min(2, int(ay / 350)))
    grid = [['0'] * 5 for _ in range(5)]
    grid[by][bx] = '9'
    display.show(Image(":".join("".join(r) for r in grid)))
```

`accelerometer.get_x()` returns roughly -1024 to +1024 mg. Dividing by 350
maps it to -2..+2 — the x coordinate of a 5×5 grid. `max/min` keeps it safely
in range no matter how hard you tilt.
