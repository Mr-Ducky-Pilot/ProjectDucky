```python
JUMP = 1800
count = 0
last_jump = 0

while True:
    z = accelerometer.get_z()
    if z > JUMP and running_time() - last_jump > 250:
        count += 1
        last_jump = running_time()
        display.show(str(count))
    sleep(20)
```

`running_time()` returns ms since boot. The 250ms cooldown gives the spike
time to settle before we look for the next one.
