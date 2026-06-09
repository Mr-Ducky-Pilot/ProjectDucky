```python
import radio
CALL = 'XYZABC'

radio.on()
radio.config(channel=42)

while True:
    if button_a.was_pressed():
        radio.send('PING|' + CALL)
    msg = radio.receive()
    if msg and msg.startswith('PING|'):
        if msg[5:] == CALL:
            display.show(Image.YES)   # it's for me!
        else:
            display.show(Image.NO)    # not me
    sleep(50)
```
