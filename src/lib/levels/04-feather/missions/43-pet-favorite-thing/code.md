```python
FAV = 'bright'

def is_fav():
    if FAV == 'bright': return display.read_light_level() > 150
    if FAV == 'dark':   return display.read_light_level() < 30
    if FAV == 'cold':   return temperature() < 18
    if FAV == 'warm':   return temperature() > 28
    return False

while True:
    if is_fav():
        celebrate()
    sleep(200)
```
