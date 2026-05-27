# Moving a pixel

```python
x = 2          # starting column (0–4)
y = 2          # starting row (0–4)

while True:
    display.clear()             # wipe last frame
    display.set_pixel(x, y, 9) # draw dot at current position

    if button_a.was_pressed():
        x = x - 1              # move left
        if x < 0:
            x = 4              # wrap: went off left edge → right edge

    if button_b.was_pressed():
        x = x + 1              # move right
        if x > 4:
            x = 0              # wrap: went off right edge → left edge

    sleep(100)                  # ~10 updates per second
```

`display.clear()` then `display.set_pixel(x, y, 9)` on every loop is the classic **clear-then-draw** game loop. It erases the old dot position before drawing the new one.

Try removing the `clear()` — the dot leaves a trail instead of moving cleanly.
