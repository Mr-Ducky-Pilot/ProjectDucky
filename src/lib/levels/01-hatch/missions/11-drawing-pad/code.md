```python
# The browser sends a 25-character string
bits = "0101011111111110111000100"

# Split into 5 rows of 5
rows = [bits[r * 5 : r * 5 + 5] for r in range(5)]

# MicroPython wants rows separated by ":"
img = Image(":".join(rows))
display.show(img)
```

Each `M:` command the browser sends arrives here. The chip slices the 25-char string into 5 rows, joins them with `:`s, and passes that string straight to `Image()` — MicroPython's built-in picture format. No maths. Just slicing a string.

Every pixel on the display is stored as exactly **one character** in that string. That makes the whole 5×5 grid 25 bits of data — small enough to fit in a text message.
