```python
IN = 4
HOLD = 7
OUT = 8

while True:
    for size in range(1, 6):    # inhale: grow
        ring(size)
        sleep(IN * 1000 // 5)
    sleep(HOLD * 1000)
    for size in range(5, 0, -1): # exhale: shrink
        ring(size)
        sleep(OUT * 1000 // 5)
```

Five steps in 4 seconds = 800ms each. Same for the exhale.
