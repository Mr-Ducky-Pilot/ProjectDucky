```python
# Step detection — a 2-state machine
above = False  # is the reading currently above threshold?
steps = 0

# Called every ~90ms with the latest accel reading
def on_accel(x, y, z):
    global above, steps
    mag = (x*x + y*y + z*z) ** 0.5  # total force in g

    if mag > THRESHOLD and not above:
        above = True   # rising edge — count it!
        steps += 1
    elif mag < THRESHOLD - 0.1:
        above = False  # fallen below — ready for next step
```

The `-0.1` is **hysteresis**: the reset threshold is slightly lower than the trigger threshold. Without it, a reading that wobbles right at the boundary would fire dozens of false steps. A tiny gap makes it robust.

This same trick is used in thermostats (heat kicks on at 20°C, turns off at 21°C) and any system where you don't want rapid switching at the boundary.
