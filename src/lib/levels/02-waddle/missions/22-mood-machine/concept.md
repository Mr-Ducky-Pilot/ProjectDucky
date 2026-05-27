# if / elif / else

`if` checks one condition. `elif` adds more checks. `else` catches everything that didn't match.

```python
if temp > 28:        # hot?
    display.show(Image.HAPPY)
elif temp < 20:      # cold?
    display.show(Image.SAD)
else:                # neither — must be in between
    display.show(Image.SURPRISED)
```

The chip checks these in order, top to bottom, and stops at the **first one that's true**. If temp is 30, it's happy and never even looks at the other conditions.

## Temperature on a chip

`temperature()` reads the CPU's own heat sensor, not the air temperature. The chip heats up when it's doing more work. Hold it in your hand for a minute and the number climbs.

Built-in faces you can use: `Image.HAPPY`, `Image.SAD`, `Image.SURPRISED`, `Image.ANGRY`, `Image.CONFUSED`, `Image.ASTONISHED`, `Image.ASLEEP`.
