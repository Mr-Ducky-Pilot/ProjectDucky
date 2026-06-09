```python
from microbit import *
import random

answers = ["yes", "no", "ask later"]

while True:
    if accelerometer.was_gesture('shake'):
        display.scroll(random.choice(answers))
    sleep(50)
```

Try adding more answers. The longer the list, the more variety in your
fortune-telling duck.
