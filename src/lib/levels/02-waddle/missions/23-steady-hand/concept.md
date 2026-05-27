# Compound conditions + tracking best

`abs()` turns a negative number positive — it gives you the size of the movement, not the direction.

```python
x = accelerometer.get_x()   # tilt left/right in mg (-2000 to 2000)
y = accelerometer.get_y()   # tilt forward/back
wobble = abs(x) + abs(y)    # total tilt, always positive
```

Adding X and Y wobble together gives you one number that captures movement in any direction.

## Tracking the best score

```python
best = 0
streak = 0

if wobble < 300:
    streak = streak + 1       # still steady — count up
    if streak > best:         # new personal best?
        best = streak         # save it
```

`best` remembers the longest steady run. `streak` resets to 0 every time you wobble — but `best` never goes down.

This is the same pattern used in high-score systems in real games.
