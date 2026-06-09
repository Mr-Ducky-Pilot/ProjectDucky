```python
frames = []

while True:
    if button_a.was_pressed():
        frames.append(display.get_pixel(...))   # grab current frame
    if button_b.was_pressed():
        for f in frames:
            display.show(f)
            sleep(300)
```

`display.get_pixel(x, y)` reads the brightness at that pixel — you can
re-build the entire current frame by reading all 25.
