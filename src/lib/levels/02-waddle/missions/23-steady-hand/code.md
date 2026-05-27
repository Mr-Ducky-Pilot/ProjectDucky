# Measuring wobble

```python
x = accelerometer.get_x()   # left/right tilt (mg)
y = accelerometer.get_y()   # forward/back tilt (mg)
wobble = abs(x) + abs(y)    # combined total movement

if wobble < 300:             # is the chip still enough?
    streak = streak + 1      # yes — grow the streak
    if streak > best:
        best = streak        # new best!
    display.show(Image.HAPPY)
else:
    streak = 0               # wobbled — reset streak
    display.show(Image.SAD)
```

`abs(-500)` returns `500` — we want the size of the tilt, not whether it's left or right.

The threshold `300` is in milligrams (mg). Earth's gravity on the z-axis is 1000 mg. Moving 300 mg on x+y is a noticeable but achievable wobble.
