```python
def detect():
    x = accelerometer.get_x()
    y = accelerometer.get_y()
    g = accelerometer.get_strength()

    if g > 1800:           return "shake"
    elif x < -500:         return "tilt-l"
    elif x >  500:         return "tilt-r"
    return None
```

The `elif` order matters — check **shake first** (it overrides tilt because it
includes one). Always-check the *most specific* case first.
