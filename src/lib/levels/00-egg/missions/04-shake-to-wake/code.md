### Reading 3D motion

Inside the micro:bit is an accelerometer — a chip that measures force in three directions (X, Y, Z). `get_strength()` combines all three into one number:

```python
elif preset == 'shake':
    g = accelerometer.get_strength() / 1024.0
    if g > 1.5 and n - state.get('shaken', 0) > 400:
        state['shaken'] = n
        display.show(FACES['dizzy'])
        music.pitch(660, 120, wait=False)
    elif n - state.get('shaken', 0) > 600 and n - state.get('t', 0) > 500:
        state['t'] = n
        display.show(FACES['happy'])
```

When still, gravity alone gives about `1.0g`. A shake typically pushes past `1.5g` — that's the trigger threshold. The `> 400` time-guard stops one big shake from firing the reaction dozens of times.

### Sensor data the browser can see

The browser can also subscribe to the raw accelerometer stream. The chip pushes values every ~90ms:

```python
if s == 'accel':
    return "%.2f,%.2f,%.2f" % (
        accelerometer.get_x() / 1024.0,
        accelerometer.get_y() / 1024.0,
        accelerometer.get_z() / 1024.0,
    )
```

The 3D graph in the companion app is drawn from these numbers in real time.

> Accelerometers work by measuring how much a tiny suspended mass deflects inside the chip. Phones use the same principle to know when you rotate the screen.
