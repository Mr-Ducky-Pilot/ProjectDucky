# The hot potato game

```python
from microbit import *
import radio

radio.on()
radio.config(channel=7)

has_potato = True     # True on ONE board, False on the other
MAX_TICKS = 30        # 30 × 200ms = 6 seconds
countdown = MAX_TICKS

def show_countdown(c, total):
    rows_lit = int(c * 5 / total)
    display.clear()
    for row in range(rows_lit):
        for col in range(5):
            display.set_pixel(col, row, 9)

def explode():
    for _ in range(3):
        display.show(Image.SKULL)
        music.pitch(200, 100)
        display.clear()
        sleep(100)
    display.scroll("BOOM!")

log("start:holding" if has_potato else "start:safe")

while True:
    if has_potato:
        if countdown <= 0:
            explode()
            break
        show_countdown(countdown, MAX_TICKS)
        countdown -= 1

        if button_b.was_pressed():
            radio.send("potato")   # pass it!
            has_potato = False
            display.show(Image.HAPPY)   # phew

    msg = radio.receive()
    if msg == "potato":
        has_potato = True
        countdown = MAX_TICKS  # restart timer
        display.show(Image.ARROW_W)

    sleep(200)
```

Set `has_potato = True` on one board and `False` on the other. Press B to pass before time runs out!
