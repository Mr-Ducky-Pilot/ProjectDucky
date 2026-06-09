# Distributed state — two boards sharing information

In Clicker Wars, both boards independently maintain their score. But they also want to know the other's score. The solution: **periodic broadcasting**.

```python
# Every second, tell the other board your score
if elapsed >= 1000:
    radio.send("score:" + str(my_score))
    last_broadcast = now

# When you receive theirs, update your local copy
msg = radio.receive()
if msg and msg.startswith("score:"):
    their_score = int(msg[6:])   # "score:42" → 42
```

Neither board "owns" the score — they each maintain their own and share it with the other. This is how most real-time multiplayer games work.

## Bargraph with two players

A 5×5 grid can show two side-by-side bars:

```python
def show_scores():
    display.clear()
    my_rows = int(my_score * 5 / WIN)
    their_rows = int(their_score * 5 / WIN)
    for row in range(5):
        if row < my_rows:
            display.set_pixel(0, 4 - row, 9)   # my bar (bright, left)
            display.set_pixel(1, 4 - row, 9)
        if row < their_rows:
            display.set_pixel(3, 4 - row, 6)   # their bar (dim, right)
            display.set_pixel(4, 4 - row, 6)
```

Bottom-to-top bars growing as scores increase. Yours is brighter so you always know which side is which.

## utime for non-blocking timing

`utime.ticks_ms()` gives the current time in milliseconds. `utime.ticks_diff()` subtracts correctly even when the timer wraps around:

```python
now = utime.ticks_ms()
if utime.ticks_diff(now, last_broadcast) >= 1000:
    radio.send("score:" + str(my_score))
    last_broadcast = now
```
