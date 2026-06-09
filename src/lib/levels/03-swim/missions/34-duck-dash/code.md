# Duck Dash — the full game

```python
from microbit import *
import radio, random, utime

radio.on()
radio.config(channel=7)

my_x, my_y = 2, 2
their_x, their_y = -1, -1
score = 0
WIN = 5
drops = [[random.randint(0, 4), random.randint(0, 4)] for _ in range(2)]
last_tx = utime.ticks_ms()

def log(msg):
    print('<L ' + str(msg) + '>')

def move():
    global my_x, my_y
    ax = accelerometer.get_x()
    ay = accelerometer.get_y()
    if ax > 400:
        my_x = min(4, my_x + 1)
    elif ax < -400:
        my_x = max(0, my_x - 1)
    if ay > 400:
        my_y = min(4, my_y + 1)
    elif ay < -400:
        my_y = max(0, my_y - 1)

def draw():
    display.clear()
    for dx, dy in drops:
        display.set_pixel(dx, dy, 3)       # dim drops
    if their_x >= 0:
        display.set_pixel(their_x, their_y, 6)   # opponent (medium)
    display.set_pixel(my_x, my_y, 9)       # me (bright)

while True:
    move()

    msg = radio.receive()
    if msg and ',' in msg:
        parts = msg.split(',')
        their_x = int(parts[0])
        their_y = int(parts[1])

    now = utime.ticks_ms()
    if utime.ticks_diff(now, last_tx) >= 100:
        radio.send(str(my_x) + "," + str(my_y))
        last_tx = now

    for drop in drops[:]:
        if [my_x, my_y] == drop:
            drops.remove(drop)
            drops.append([random.randint(0, 4), random.randint(0, 4)])
            score += 1
            log("score:" + str(score))
            break

    if score >= WIN:
        display.scroll("WIN! " + str(score))
        break

    draw()
    sleep(80)
```
