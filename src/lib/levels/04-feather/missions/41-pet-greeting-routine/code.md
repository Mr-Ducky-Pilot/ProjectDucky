```python
from microbit import *
import music

FACE = "happy"      # from your pet store
TUNE = ["C4:4", "E4:4", "G4:4"]
SCROLL = "Hi I am Quackers!"

# The boot sequence
display.show(FACES[FACE])
sleep(500)
music.play(TUNE)
display.scroll(SCROLL)
```

These three calls run *in order*. Want them simultaneous? You'd need
non-blocking versions — but that's a Level 5 problem.
