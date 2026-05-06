### Sending a radio packet

Both micro:bits run the same Ducky OS firmware, tuned to the same radio channel. When you press A:

```python
if button_a.was_pressed():
    if preset == 'wave-across':
        radio.send('w')           # broadcast one byte
        display.show(FACES['wave'])
        sleep(280)
        display.clear()
```

`radio.send('w')` broadcasts the string `'w'` on channel 42 — any board listening on the same channel will receive it.

### Receiving the wave

The receiving board's main loop checks for incoming packets:

```python
msg = radio.receive()
if msg is not None:
    print('<R %s>' % msg)    # forward to browser
    if preset == 'wave-across' and msg == 'w':
        display.show(FACES['wave'])
        sleep(280)
        display.clear()
```

`radio.receive()` returns the oldest queued packet or `None`. It fires immediately — no address, no pairing, no internet. Just air.

### Radio config

```python
radio.config(channel=42, group=42)
radio.on()
```

Both boards use `channel=42, group=42` so they only talk to each other, not every micro:bit in the building.

> The radio inside the micro:bit uses the same 2.4GHz band as Wi-Fi and Bluetooth — but it speaks a much simpler protocol. Range is typically 10–50 metres through walls.
