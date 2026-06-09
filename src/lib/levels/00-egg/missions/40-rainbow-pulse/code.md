### The breath loop

```python
elif preset == 'breathe':
    if n - state.get('t', 0) > 80:
        state['t'] = n
        phase = state.get('p', 0)
        state['p'] = (phase + 1) % 32
        b = int(4.5 + 4.5 * math.sin(phase * math.pi / 16))
        # ring 0 (outer) and ring 1 (mid) shift together
        outer = max(0, b - 4)
        mid = (outer + b) // 2
        display.show(Image(...))
```

`math.sin` gives a value between -1 and +1. We map that to a brightness
between 0 and 9 — and the whole matrix smoothly inhales/exhales every ~2.5
seconds.
