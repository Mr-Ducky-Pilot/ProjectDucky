# The combination lock

```python
from microbit import *

COMBO = [0, 1, 0]   # your secret — change these!
entry = []

def show_locked():
    display.show(Image.ANGRY)   # locked face

def unlock():
    display.show(Image.HAPPY)
    log("unlocked")

def reject():
    display.show(Image.NO)
    sleep(500)
    display.clear()
    log("locked")

show_locked()

while True:
    if button_a.was_pressed():
        entry.append(0)         # A = 0
        display.show("0")

    if button_b.was_pressed():
        entry.append(1)         # B = 1
        display.show("1")

    if len(entry) == len(COMBO):
        if entry == COMBO:      # full entry received — check it
            unlock()
        else:
            reject()
        entry = []              # always reset after check

    sleep(100)
```

Each button press adds a digit to `entry`. When `len(entry)` matches the combo length, the check happens, and `entry` resets so another attempt is possible.
