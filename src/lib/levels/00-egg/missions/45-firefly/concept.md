### One pixel, a whole world

The matrix only has 25 dots — but with **one** dot drifting smoothly, you've
got everything you need for a game. Pong, Snake, even Asteroids — all of them
start with "where is the dot right now?"

### The "trail" trick

You'll see faint dots next to the firefly. That's a fake glow effect: we
re-draw the matrix every tick, and the cells touching the firefly get a small
brightness boost.

It's the same trick used in animated lights at concerts. **No real "trail"
exists** — just a clever redraw.
