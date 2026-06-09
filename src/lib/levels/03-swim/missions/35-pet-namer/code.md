```python
from microbit import *

NAME = "Quackers"   # filled in from your pet store

def log(msg):
    print('<L ' + str(msg) + '>')

display.scroll("Hi I am " + NAME)
log("named " + NAME)

while True:
    if button_a.was_pressed():
        display.scroll(NAME)
    sleep(50)
```

Plain string concatenation, but now the string came from **your choice** —
not the firmware author's. That's the difference.
