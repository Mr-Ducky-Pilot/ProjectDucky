```python
GESTURE = 'shake'   # 'shake', 'tilt-l', 'tilt-r'

def detect():
    if accelerometer.get_strength() > 1800: return 'shake'
    x = accelerometer.get_x()
    if x < -500: return 'tilt-l'
    if x >  500: return 'tilt-r'
    return None

while True:
    if detect() == GESTURE:
        do_trick()
    sleep(50)
```
