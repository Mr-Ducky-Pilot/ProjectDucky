```python
frames = [
    "0000000000001000000000000",  # frame 1
    "0000001010001000010100000",  # frame 2
    "0101011111111110111000100",  # frame 3
]

# Play on a loop with setInterval in the browser
# Each tick, send the next frame:
# connection.send({ type: 'matrix', bits: frames[i] })
```

The browser holds the frames in memory and sends one `M:` command every N milliseconds. The chip has no idea it's part of an animation — it just shows whatever arrives.

**Frame rate maths:** 1000ms ÷ delay = frames per second. A 200ms delay = 5 fps. A 40ms delay = 25 fps, near cinema quality — though 25 frames on a 5×5 grid might look like a blur.
