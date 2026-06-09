# Building a full game loop

A game loop runs forever, updating state every frame. Duck Dash has four parts running each tick:

```
1. Read input → update my position (move)
2. Read radio → update opponent position (receive)
3. Send my position → over radio (broadcast)
4. Check drops → collect if standing on one (collect)
5. Render → draw all objects on the display
```

## 2D position with tilt input

The accelerometer returns values in milligees (mG). Roughly:
- Flat = 0, tilted right = +600, tilted left = -600

Use a threshold to decide movement direction:

```python
ax = accelerometer.get_x()
if ax > 400:
    my_x = min(4, my_x + 1)   # right
elif ax < -400:
    my_x = max(0, my_x - 1)   # left
```

`min(4, ...)` and `max(0, ...)` keep coordinates within 0–4 bounds.

## Lists as mutable objects

Drops are stored as a list of `[x, y]` pairs. When you collect one, remove it and add a new random one:

```python
for drop in drops[:]:           # iterate over a copy
    if [my_x, my_y] == drop:
        drops.remove(drop)
        drops.append([random.randint(0, 4), random.randint(0, 4)])
        score += 1
        break
```

`drops[:]` creates a shallow copy so you can safely modify `drops` while looping.

## Parsing a compact message

Position is sent as `"x,y"` — a comma-separated string. On receive:

```python
parts = msg.split(',')   # "2,3" → ['2', '3']
their_x = int(parts[0])
their_y = int(parts[1])
```

This "split and parse" pattern appears constantly in real networked applications.
