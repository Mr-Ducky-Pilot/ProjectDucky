### Tilt nudges the firefly

```python
elif preset == 'firefly':
    ax = accelerometer.get_x() // 350
    ay = accelerometer.get_y() // 350
    x = state.get('x', 2) + max(-1, min(1, ax))
    y = state.get('y', 2) + max(-1, min(1, ay))
    x = max(0, min(4, x))   # clamp to grid
    y = max(0, min(4, y))
    state['x'] = x
    state['y'] = y
```

Notice the difference from Tilt Bubble: the bubble **maps tilt to a position**
directly. The firefly **adds tilt to its previous position** — like a real
moving object with momentum. Small physics, big feel.
