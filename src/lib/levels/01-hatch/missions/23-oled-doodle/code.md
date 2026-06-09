### The wire format

Browser sends:

```
O:px:48,44,15;48,45,15;49,44,12
```

Three pixels with x, y, and brightness (0–15). The chip parses, draws each,
then refreshes the screen — all in a few milliseconds.

### Firmware side

```python
elif rest.startswith('px:'):
    for pix in rest[3:].split(';'):
        x, y, c = pix.split(',')
        oled.pixel(int(x), int(y), int(c))
    oled.show()
```

`oled.show()` pushes the framebuffer to the screen. Without it, your drawing
would never appear — that's a common bug in graphics code.
