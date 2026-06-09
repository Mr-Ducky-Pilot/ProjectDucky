```python
HIGH = 30   # degrees C

while True:
    t = temperature()
    if t > HIGH:
        display.scroll("TOO HOT!")
    else:
        display.show(Image.YES)
    sleep(1000)
```

`display.scroll(msg)` blocks until the whole message finishes — that's why
the duck pauses while it shouts. Use `display.show` for instant updates.
