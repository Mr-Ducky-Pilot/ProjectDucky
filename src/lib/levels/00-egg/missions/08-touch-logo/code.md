### Your skin closes a circuit

The gold "MICROBIT" logo at the top of the board is a capacitive touch sensor. When you press it, your finger adds a tiny amount of electrical capacitance — enough for the chip to detect.

```python
t = pin_logo.is_touched()
if t and not last_logo:
    print('<T down>')
    last_logo = True
    if preset == 'touch-logo':
        music.pitch(880, 120, wait=False)
        display.show(FACES['happy'])
        sleep(200)
        display.show(FACES['duck'])
elif not t and last_logo:
    print('<T up>')
    last_logo = False
```

`t and not last_logo` is an **edge detector** — it only fires once on first contact, not continuously while you hold it. `last_logo` remembers the previous state so it can spot the *change* from not-touched to touched.

### The sound

```python
music.pitch(880, 120, wait=False)
```

`music.pitch(frequency_hz, duration_ms)` plays a tone. 880 Hz is a high A note. `wait=False` means the code keeps running while the sound plays — the face changes at the same time.

> Capacitive touch is everywhere: phone screens, elevator buttons, laptop trackpads. Your body is a surprisingly good electrical conductor.
