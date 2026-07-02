# The Morse messenger

```python
from microbit import *
import radio
import music
import neopixel
import utime

radio.on()
radio.config(channel=7)

np = neopixel.NeoPixel(pin0, 1)
DOT_COLOR = (30, 180, 255)
DASH_COLOR = (255, 80, 30)

DASH_MS = 300    # hold longer than this = dash

MORSE = {
    'A': '.-',   'B': '-...', 'C': '-.-.',
    'D': '-..',  'E': '.',    'F': '..-.',
    # add more letters here!
}

def log(msg):
    print('<L ' + str(msg) + '>')

def blip(is_dash):
    np[0] = DASH_COLOR if is_dash else DOT_COLOR
    np.show()
    music.pitch(600 if is_dash else 1200, 250 if is_dash else 80, wait=True)
    np[0] = (0, 0, 0)
    np.show()

current = ''     # dot/dash sequence being built
pressed_at = 0   # timestamp of last press start

while True:
    # Detect short vs long press
    if button_a.is_pressed() and pressed_at == 0:
        pressed_at = utime.ticks_ms()
    elif not button_a.is_pressed() and pressed_at > 0:
        duration = utime.ticks_diff(utime.ticks_ms(), pressed_at)
        pressed_at = 0
        is_dash = duration >= DASH_MS
        current += '-' if is_dash else '.'
        display.show('-' if is_dash else '.')
        blip(is_dash)     # RGB colour + tone, together

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

**How to use:** Tap A short = dot, hold A = dash — each one lights the RGB LED and plays a tone at the same time. Press B to look it up and send. The other board scrolls the decoded letter.

**Why radio, not Bluetooth:** this uses the micro:bit's built-in 2.4GHz `radio` module — the same proprietary point-to-multipoint radio every pair mission in this level uses (on a different channel, 7, so it doesn't collide with other Ducky OS traffic on channel 42). It's not Bluetooth — the app has no Bluetooth/BLE anywhere.
