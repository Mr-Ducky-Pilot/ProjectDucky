# The clicker wars game

```python
from microbit import *
import radio
import utime

radio.on()
radio.config(channel=7)

WIN = 25
my_score = 0
their_score = 0
last_broadcast = utime.ticks_ms()

def log(msg):
    print('<L ' + str(msg) + '>')

def show_scores():
    display.clear()
    my_rows = int(my_score * 5 / WIN)
    their_rows = int(their_score * 5 / WIN)
    for row in range(5):
        if row < my_rows:
            display.set_pixel(0, 4 - row, 9)
            display.set_pixel(1, 4 - row, 9)
        if row < their_rows:
            display.set_pixel(3, 4 - row, 6)
            display.set_pixel(4, 4 - row, 6)

while True:
    if button_a.was_pressed():
        my_score += 1
        log("me:" + str(my_score) + ":them:" + str(their_score))

    msg = radio.receive()
    if msg and msg.startswith("score:"):
        their_score = int(msg[6:])

    now = utime.ticks_ms()
    if utime.ticks_diff(now, last_broadcast) >= 1000:
        radio.send("score:" + str(my_score))
        last_broadcast = now

    if my_score >= WIN:
        display.scroll("YOU WIN!")
        break
    elif their_score >= WIN:
        display.scroll("You lose!")
        break

    show_scores()
    sleep(50)
```

Flash the same code to both boards. The bars grow as each player clicks. First to WIN presses wins!
