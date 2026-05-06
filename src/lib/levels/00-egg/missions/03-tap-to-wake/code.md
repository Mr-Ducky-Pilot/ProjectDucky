### Buttons are just switches

The chip checks for button presses at the bottom of its main loop:

```python
if button_a.was_pressed():
    print('<B A down>')       # tell the browser
    if preset == 'tap-wake':
        display.show(Image.HAPPY)
        sleep(150)
        display.show(Image.ASLEEP)
```

`button_a.was_pressed()` returns `True` once — it's like a latch. Even if you hold the button, it only fires on the first press. The chip then:
1. Shows a happy face for 150ms
2. Goes back to sleep face

### The idle state

While nothing is pressed, the `tick()` function shows a sleeping face every 1.5 seconds:

```python
elif preset == 'tap-wake':
    if n - state.get('t', 0) > 1500:
        state['t'] = n
        display.show(Image.ASLEEP)
```

This makes the board look dormant — waiting patiently, like a real sleeping creature.

> Every button you've ever pressed sends a signal like this. The magic isn't in the hardware — it's in what the code does next.
