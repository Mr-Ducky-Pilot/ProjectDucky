### A picture is just numbers

When you tap a square in the pad, the browser flips one bit from 0 to 1.
The whole 5×5 picture is **25 bits** — enough to fit in 4 bytes (a tiny
amount of data!). When you hit Send, those 25 bits travel down the USB
cable to the chip, which flips its LEDs to match.

This is *exactly* how a real photo works on your phone — just with millions
of dots and three numbers per dot (red, green, blue) instead of one.

### The "send" problem

Each press of Send writes 25 bits over USB. Try sending many times in a
row — see how the chip can keep up just fine. Computers are *fast*.

> Try painting an animation: send pattern A, change a few pixels, send
> pattern B. With practice you can make tiny movies.
