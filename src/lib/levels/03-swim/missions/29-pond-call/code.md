# The simplest radio app

```python
from microbit import *
import radio

radio.on()
radio.config(channel=7)

def log(msg):
    print('<L ' + str(msg) + '>')

log("ready")

while True:
    if button_a.was_pressed():
        radio.send("wave")           # broadcasts to channel 7
        display.show(Image.ARROW_E)  # point right = sent
        log("sent")

    msg = radio.receive()
    if msg is not None:
        display.show(Image.HAPPY)    # react to incoming
        sleep(300)
        display.clear()
        log("received:" + msg)

    sleep(100)
```

**Flash the same code on both boards.** When board A presses A, board B sees the message (and vice versa). The Board Output panel shows each sent/received event.

Both boards run the same program simultaneously — each one is both sender and receiver.
