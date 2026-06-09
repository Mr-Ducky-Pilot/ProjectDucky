# The handshake protocol

```python
from microbit import *
import radio

MY_SECRET = 5           # each board picks a different number!
radio.on()
radio.config(channel=7)

def log(msg):
    print('<L ' + str(msg) + '>')

def celebrate():
    display.show(Image.HEART)
    music.play(music.JUMP_UP)
    sleep(500)
    display.scroll("MATCH!")
    display.clear()

def reject():
    display.show(Image.NO)
    sleep(500)
    display.clear()

log("ready:" + str(MY_SECRET))

while True:
    if button_a.was_pressed():
        radio.send(str(MY_SECRET))   # broadcast your secret
        display.show(Image.ARROW_E)
        log("sent:" + str(MY_SECRET))

    msg = radio.receive()
    if msg is not None:
        received = int(msg)
        log("got:" + str(received))
        if received == MY_SECRET:    # does it match?
            celebrate()
        else:
            reject()

    sleep(100)
```

**One board picks 5, the other picks something different.** Keep pressing A on both — when one accidentally picks the same secret as the other, both celebrate simultaneously.
