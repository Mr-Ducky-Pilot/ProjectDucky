### Shake detection + pick a face

```python
elif preset == 'dice':
    g = accelerometer.get_strength() / 1024.0
    if g > 1.6 and n - state.get('lastroll', 0) > 600:
        # Quick spin animation
        for _ in range(4):
            display.show(Image("99999:90009:..."))
            sleep(40)
        face = randint(1, 6)
        display.show(Image(DICE[face - 1]))
        music.pitch(440 + face * 60, 80)
```

`accelerometer.get_strength()` returns the total g-force on all three axes.
At rest = ~1024 (1g of gravity). Shake = jumps above 1500.
