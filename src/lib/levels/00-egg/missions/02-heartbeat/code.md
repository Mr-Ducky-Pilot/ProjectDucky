### The beating heart loop

After flashing, the browser sends `P:heartbeat` and the chip runs this code on every tick:

```python
BIG_HEART   = Image("01010:11111:11111:01110:00100")
SMALL_HEART = Image("00000:01110:01110:00100:00000")

if preset == 'heartbeat':
    if n - state.get('t', 0) > 600:
        state['t'] = n
        state['b'] = not state.get('b', False)
        display.show(BIG_HEART if state['b'] else SMALL_HEART)
```

`running_time()` returns milliseconds since boot. Every 600ms the chip flips between big and small heart — that's roughly one beat per second.

`state['b'] = not state.get('b', False)` toggles a boolean on every tick — `True` → `False` → `True` → forever.

### Images as strings

Each `Image()` is a 5×5 grid written as 5 rows of digits, separated by colons. `1` = LED on, `0` = LED off. The big heart:

```python
# 01010  → .X.X.
# 11111  → XXXXX
# 11111  → XXXXX
# 01110  → .XXX.
# 00100  → ..X..
Image("01010:11111:11111:01110:00100")
```

> A loop that runs forever is the most fundamental pattern in embedded programming. Your phone, your microwave, your car — they all have one.
