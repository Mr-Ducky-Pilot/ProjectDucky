### Choreography is code

A dance is a sequence of moves. So is a program. This mission uses a **list of
cards** — left, right, stomp, jump, hold — and cycles through them in time
with the beat.

### Spotting stomps

When you stomp, the chip's accelerometer sees a sudden spike on the Z axis
(up/down). The code subscribes to accel and watches for `z > 1.8g` — that's
the threshold for "yep, that was a real stomp, not just walking".

> The same trick is how Fitbits and Apple Watches count steps.
