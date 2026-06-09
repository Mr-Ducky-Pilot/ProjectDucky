```python
import radio
radio.on()
radio.config(channel=42)

DJ = True   # change to False on follower ducks

while True:
    if DJ and button_a.was_pressed():
        radio.send('BEAT|1')
    if not DJ:
        msg = radio.receive()
        if msg == 'BEAT|1':
            display.show(Image.HEART)
            sleep(120)
            display.clear()
```
