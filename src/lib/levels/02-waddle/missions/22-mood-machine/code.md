# Making decisions

```python
temp = temperature()     # read CPU temperature in °C

if temp > 28:            # first test — is it hot?
    display.show(Image.HAPPY)
elif temp < 20:          # second test — only checked if first was false
    display.show(Image.SAD)
else:                    # catches everything left (20–28°C range)
    display.show(Image.SURPRISED)

sleep(500)               # update twice per second
```

`elif` is short for "else if" — it only runs if the previous `if` was false.

The `else` at the bottom has no condition — it's the fallback that runs when nothing above matched.
