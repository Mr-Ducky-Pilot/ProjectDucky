```python
SCENES = [
    (Image.HAPPY, 'Once upon a time...', ['C4:4'], 2000),
    (Image.HEART, '...there was a duck.', ['E4:4','G4:4'], 1500),
    (Image.YES,   'The end.',             ['C5:8'], 1000),
]

for img, caption, tune, ms in SCENES:
    display.show(img)
    music.play(tune)
    sleep(ms)
```
