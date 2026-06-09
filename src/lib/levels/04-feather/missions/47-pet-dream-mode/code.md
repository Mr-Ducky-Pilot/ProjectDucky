```python
last_move = running_time()

while True:
    g = accelerometer.get_strength()
    if abs(g - 1024) > 200:
        last_move = running_time()

    if running_time() - last_move > 30 * 1000:
        dream_frame()
    else:
        display.show(Image.HAPPY)
    sleep(200)
```
