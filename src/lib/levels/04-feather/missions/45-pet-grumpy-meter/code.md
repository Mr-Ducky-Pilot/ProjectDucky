```python
grumpy = 0
state = 'calm'

while True:
    v = microphone.sound_level()
    if v > 150: grumpy = min(100, grumpy + 3)
    else:       grumpy = max(0,   grumpy - 1)

    if state == 'calm' and grumpy > 70:
        state = 'grumpy'
    elif state == 'grumpy' and grumpy < 30:
        state = 'calm'
    sleep(100)
```
