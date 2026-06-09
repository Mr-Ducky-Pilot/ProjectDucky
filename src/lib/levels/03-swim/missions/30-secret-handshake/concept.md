# Radio protocols — agreeing on a format

When two devices communicate, they need to agree on what the data means. This agreement is called a **protocol**.

In Secret Handshake, the protocol is simple:
- Both boards broadcast a single number (1–8)
- Both boards check: "does the received number match mine?"

```python
MY_SECRET = 5           # my side of the handshake
radio.send(str(MY_SECRET))   # broadcast it as a string

msg = radio.receive()
if msg is not None:
    received = int(msg)         # convert back to number
    if received == MY_SECRET:
        celebrate()
```

## Designing the celebration

The real fun is in `celebrate()` — you write it. The only rule: the celebrate code is identical on both boards, so if both ducks match, both celebrate at the same time. It's like a coordinated cheer:

```python
def celebrate():
    display.show(Image.HEART)
    music.play(music.JUMP_UP)
    sleep(500)
    display.scroll("MATCH!")
    display.clear()
```

## Why str() / int()?

`radio.send()` transmits strings. To send a number, you convert it first: `str(5)` → `"5"`. To compare on the receiver side, convert back: `int("5")` → `5`. This pattern — **serialize to string, deserialize back** — is how almost all networked communication works.
