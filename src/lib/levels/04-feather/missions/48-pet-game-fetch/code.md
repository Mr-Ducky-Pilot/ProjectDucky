```python
pos_x = 2.0
target_x = 2.0
SPEED = 0.2

while True:
    target_x = 2 + accelerometer.get_x() / 350
    target_x = max(0, min(4, target_x))
    pos_x += (target_x - pos_x) * SPEED   # ease toward target

    grid = [['0'] * 5 for _ in range(5)]
    grid[2][int(pos_x)] = '9'
    display.show(Image(':'.join(''.join(r) for r in grid)))
    sleep(80)
```
