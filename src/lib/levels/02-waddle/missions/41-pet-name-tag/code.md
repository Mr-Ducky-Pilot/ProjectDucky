```python
from microbit import *

NAME = "Quackers"   # filled in from your pet store

while True:
    if button_b.was_pressed():
        display.scroll("Hi! I'm " + NAME)
    sleep(50)
```

The string concatenation (`"Hi! I'm " + NAME`) glues two pieces of text into
one. It's how every chat app builds its messages.
