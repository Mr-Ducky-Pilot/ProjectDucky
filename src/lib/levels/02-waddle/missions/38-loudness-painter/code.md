```python
while True:
    sound = microphone.sound_level()   # 0..255
    b = min(9, sound // SCALE)
    paint_random_pixel_with(b)
    sleep(50)
```

We pick a random pixel each tick. With enough sound, the whole matrix fills.
With silence, it slowly fades (we lower brightness a little each loop).
