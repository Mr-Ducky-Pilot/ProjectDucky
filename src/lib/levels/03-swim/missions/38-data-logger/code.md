```python
DURATION = 30   # seconds
HZ = 5          # samples per second

def log(t, v):
    print('<D light ' + str(t) + ' ' + str(v) + '>')

start = running_time()
while running_time() - start < DURATION * 1000:
    log(running_time() - start, display.read_light_level())
    sleep(1000 // HZ)
```

You design the loop — what to sample, how often, for how long.
