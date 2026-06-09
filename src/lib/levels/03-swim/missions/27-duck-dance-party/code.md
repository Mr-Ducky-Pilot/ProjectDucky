# The dance dispatcher

```python
from microbit import *
import music

def log(msg):
    print('<L ' + str(msg) + '>')  # sends to browser

def dance_a():
    log("dance_a")
    display.show(Image.HEART)      # you choose the pattern
    music.play(music.JUMP_UP)      # you choose the sound

def dance_b():
    log("dance_b")
    display.show(Image.YES)
    music.play(music.JUMP_DOWN)

def dance_shake():
    log("dance_shake")
    display.show(Image.SURPRISED)
    music.play(music.WAWAWAWAA)

while True:
    if button_a.was_pressed():
        dance_a()       # call the function by name + ()
    if button_b.was_pressed():
        dance_b()
    if accelerometer.was_gesture("shake"):
        dance_shake()
    sleep(100)
```

**Useful patterns for your dance moves:**
- `display.show(Image.HEART)` — show a built-in icon
- `display.show("!")` — show a character
- `display.scroll("YAY")` — scroll text
- `music.play(music.JUMP_UP)` — play a built-in tune
- `sleep(300)` — pause for 300ms between things
- `display.clear()` — go dark
