# for loops

A `for` loop runs a block of code a set number of times. `range(3)` means "do this 3 times".

```python
for i in range(3):
    display.show(Image.ALL_LEDS)   # on
    sleep(200)
    display.clear()                # off
    sleep(200)
```

`i` counts 0, 1, 2 — three times total. You don't have to use `i` inside the loop; it's just a counter.

## Light level

`display.read_light_level()` uses the LED matrix itself as a light sensor — clever! The value is 0 (pitch dark) to 255 (very bright).

```python
if light < 100:    # darker than this threshold
    for i in range(3):   # flash 3 times
        ...
    music.play(music.DADADADUM)
```

## Available tunes

`DADADADUM`, `ENTERTAINER`, `NYAN`, `ODE`, `BIRTHDAY`, `RINGTONE`, `FUNK`, `BLUES`, `PYTHON`, `BADDY`, `CHASE`
