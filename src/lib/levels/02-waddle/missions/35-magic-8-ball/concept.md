### Lists, picked at random

A **list** holds a bunch of things. `["yes", "no", "maybe"]` is a list of
three strings. `random.choice(list)` picks one — like reaching into a hat.

That's all a Magic 8-Ball is: a list of answers, and a "pick one" each shake.

### The shake trigger

`accelerometer.was_gesture('shake')` returns `True` the **first** time after
a shake. It auto-resets, so the next loop iteration sees `False` again until
another shake.
