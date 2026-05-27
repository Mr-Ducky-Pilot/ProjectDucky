# The counter loop

```python
count = 0            # start at zero

while True:
    sound = microphone.sound_level()   # read mic (0–255)

    if sound > 150:            # loud enough?
        count = count + 1      # yes — increment
        display.scroll(str(count))   # show the number
        sleep(500)             # pause to avoid double-counting
```

`str(count)` converts the number to text — `display.scroll` needs a string, not a number.

`sleep(500)` gives you 500 ms of quiet after each count, so one clap doesn't count twice.
