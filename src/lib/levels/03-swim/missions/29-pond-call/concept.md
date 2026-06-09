# Radio — sending and receiving wirelessly

The micro:bit has a built-in 2.4 GHz radio that can talk to other micro:bits. Think of it as a walkie-talkie built into the board.

```python
import radio
radio.on()
radio.config(channel=7)   # same channel = same "room"
```

## Sending

`radio.send()` broadcasts a string to everyone on the same channel within ~10 metres:

```python
radio.send("wave")   # anyone on channel 7 can receive this
```

## Receiving

`radio.receive()` returns the most recent message — or `None` if nothing arrived yet. It never blocks.

```python
msg = radio.receive()
if msg is not None:
    display.scroll(msg)   # show what we got
```

## The key pattern: non-blocking poll

Unlike `input()`, `radio.receive()` returns instantly. You call it every loop iteration:

```python
while True:
    if button_a.was_pressed():
        radio.send("wave")          # send when pressed

    msg = radio.receive()           # always check for incoming
    if msg is not None:
        display.show(Image.HAPPY)   # react to what arrived

    sleep(100)
```

Both sending and receiving happen in the same loop. Neither blocks the other.
