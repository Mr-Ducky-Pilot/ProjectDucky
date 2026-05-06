```python
# The browser sends "F:happy" or "F:sad"
FACES = {
    'happy': Image("00000:01010:00000:10001:01110"),
    'sad':   Image("00000:01010:00000:01110:10001"),
}

# The chip just looks it up and shows it
def handle(line):
    if line[0] == 'F':
        name = line[2:]          # strip the "F:"
        if name in FACES:
            display.show(FACES[name])
```

No maths on the chip side. The browser does all the thinking: reads the sensor, checks your threshold, decides the mood, and sends the face name. The chip just obeys — `F:happy` → show happy, `F:sad` → show sad.

This pattern — **"smart client, dumb device"** — is everywhere: your TV remote doesn't know what film to play, your keyboard doesn't decide what letter to type. The smarts live above.
