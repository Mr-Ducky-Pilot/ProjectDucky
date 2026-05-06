### Using LEDs as light sensors

The micro:bit reads ambient light by briefly turning off its own LEDs and measuring how quickly their charge drains — faster drain = brighter room. `display.read_light_level()` returns 0–255.

```python
elif preset == 'hide-peek':
    if n - state.get('t', 0) > 200:
        state['t'] = n
        l = display.read_light_level()
        display.show(FACES['happy'] if l > 50 else FACES['sad'])
```

`l > 50` is the threshold. When your hand blocks the light, the value drops below 50 and Ducky goes sad. Uncover it and the reading jumps back up.

### Why 50?

50 is a middle-ground that works in most indoor rooms — bright enough to distinguish "covered" from "open" without being thrown off by normal room variation. In a very bright room you'd raise it; in a dim room you'd lower it.

### The faces dictionary

```python
FACES = {
    'happy': Image("00000:01010:00000:10001:01110"),
    'sad':   Image("00000:01010:00000:01110:10001"),
    ...
}
```

Instead of writing the same `Image(...)` strings everywhere, the code stores them in a dictionary and looks them up by name. That's called a **lookup table** — a very common pattern.

> Your phone's screen-brightness sensor works the same way: a photodetector measures ambient light and adjusts the backlight automatically.
