```python
RULES = [
    ('bright', 'happy'),
    ('dark', 'sleepy'),
    ('cold', 'sad'),
    ('shake', 'silly'),
]

def check():
    if display.read_light_level() > 150: return 'bright'
    if display.read_light_level() < 30:  return 'dark'
    if temperature() < 18:               return 'cold'
    if accelerometer.get_strength() > 1800: return 'shake'

while True:
    trigger = check()
    for t, mood in RULES:
        if t == trigger:
            show(mood)
            break
    sleep(200)
```
