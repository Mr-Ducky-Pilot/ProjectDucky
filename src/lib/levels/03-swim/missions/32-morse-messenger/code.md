# The Morse messenger

```python
from microbit import *
import radio
import utime

radio.on()
radio.config(channel=7)

DASH_MS = 300    # hold longer than this = dash

MORSE = {
    'A': '.-',   'B': '-...', 'C': '-.-.',
    'D': '-..',  'E': '.',    'F': '..-.',
    # add more letters here!
}

def log(msg):
    print('<L ' + str(msg) + '>')

current = ''     # dot/dash sequence being built
pressed_at = 0   # timestamp of last press start

while True:
    # Detect short vs long press
    if button_a.is_pressed() and pressed_at == 0:
        pressed_at = utime.ticks_ms()
    elif not button_a.is_pressed() and pressed_at > 0:
        duration = utime.ticks_diff(utime.ticks_ms(), pressed_at)
        pressed_at = 0
        if duration >= DASH_MS:
            current += '-'
            display.show('-')
        else:
            current += '.'
            display.show('.')

    # B = send the current sequence as a letter
    if button_b.was_pressed():
        for letter, code in MORSE.items():
            if code == current:
                radio.send(letter)
                log("sent:" + letter)
                break
        current = ''
        display.clear()

    # Receive and display incoming letters
    msg = radio.receive()
    if msg:
        display.scroll(msg)
        log("received:" + msg)

    sleep(20)
```

**How to use:** Tap A short = dot, hold A = dash. Build your letter's code. Press B to look it up and send. The other board scrolls the decoded letter.
