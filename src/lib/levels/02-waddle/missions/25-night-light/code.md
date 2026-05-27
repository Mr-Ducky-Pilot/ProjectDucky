# The night-light loop

```python
import music               # needed for music.play()

while True:
    light = display.read_light_level()   # 0 (dark) to 255 (bright)

    if light < 100:         # darker than the threshold?
        for i in range(3):  # repeat the flash block 3 times
            display.show(Image.ALL_LEDS)   # all 25 LEDs on
            sleep(200)
            display.clear()
            sleep(200)
        music.play(music.DADADADUM)        # play the tune once

    sleep(500)              # check twice per second
```

`music.play()` blocks until the tune finishes, so the loop pauses for the tune duration. After it plays, the loop goes back to checking the light level.

`Image.ALL_LEDS` is a built-in image with every pixel at maximum brightness.
