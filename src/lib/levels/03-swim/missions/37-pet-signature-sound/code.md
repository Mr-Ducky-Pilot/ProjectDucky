```python
from microbit import *

TUNE = ["C4:4", "E4:4", "G4:4", "C5:6"]   # your 4 notes

import music
music.play(TUNE)

while True:
    if button_a.was_pressed():
        music.play(TUNE)
    sleep(50)
```

The `:4` after each note means "4 sixteenths long". Mess with these numbers
to change the rhythm — short, punchy, or drawn out.
