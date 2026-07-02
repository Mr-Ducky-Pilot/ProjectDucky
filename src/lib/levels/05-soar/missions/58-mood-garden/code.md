### A mood is a 4-tuple

```python
MOODS = [
    ('happy', Image.HAPPY, (255, 190, 20), ['C5:2', 'E5:2']),
]
```

Same pattern as Mood Beacon, one field longer: name, face, RGB colour, and
now a whole tune (a list of note strings for `music.play()`). Everything
about a mood lives in one row, so `show(i)` only needs to unpack it once.

### The data-log convention

```python
def log_mood(name):
    print('<L D ' + name + ' ' + str(running_time()) + '>')
```

Ducky's serial protocol treats any line starting `<L D ` as a data point,
not just a debug message — the Board Output panel (and missions like Data
Logger) know to parse it specially. `running_time()` gives milliseconds
since boot, so each entry is timestamped for free.

### The logo as a broadcast button

```python
if pin_logo.is_touched():
    radio.send(MOODS[idx][0])
```

`pin_logo` is the gold touch-strip on the front of the board — treating it
as a third input (alongside A and B) means the whole mission stays fully
on-device, no computer required, once flashed.
