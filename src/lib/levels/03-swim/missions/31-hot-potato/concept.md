# Timers and game state machines

Games have **state** — variables that describe what's happening right now. Hot Potato has two states: `has_potato = True` (your turn to sweat) and `has_potato = False` (safe, for now).

```python
has_potato = True   # change to False on the second board
```

## The countdown pattern

A simple countdown doesn't need real timestamps. Decrement once per loop iteration and control timing with `sleep()`:

```python
countdown = 30         # 30 ticks
while True:
    if has_potato:
        countdown -= 1   # one tick per loop
        if countdown <= 0:
            explode()
    sleep(200)           # 200ms per tick → 30 × 200ms = 6 seconds
```

## Bargraph on LEDs

Map the countdown to visible rows using integer division:

```python
def show_countdown(c, total):
    rows_lit = int(c * 5 / total)   # 0–5 rows
    display.clear()
    for row in range(rows_lit):
        for col in range(5):
            display.set_pixel(col, row, 9)
```

## Radio as a state change

When you pass the potato, you're changing state across two boards:

```python
radio.send("potato")   # board B receives this
has_potato = False     # board A is now safe

# On board B:
if radio.receive() == "potato":
    has_potato = True  # board B now sweating
```

This is the essence of distributed systems — two machines sharing state via messages.
