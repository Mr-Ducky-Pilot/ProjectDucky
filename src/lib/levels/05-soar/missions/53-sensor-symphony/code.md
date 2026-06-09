```python
SCALE = ['C4','D4','E4','G4','A4','C5','D5','E5']

while True:
    l = display.read_light_level()
    note = SCALE[l // 32]    # light → pitch
    music.pitch(440 if note == 'A4' else ..., 100)
    sleep(...)
```
