### How a chip "feels" motion

The micro:bit has an **accelerometer** — a chip-inside-a-chip with a tiny
weight on a spring. When the board moves, the weight lags behind a bit,
and the sensor measures by how much. That's how phones rotate the screen
when you tilt them.

It tracks three directions: **left/right**, **forward/back**, and
**up/down**. Three numbers, 50 times a second.

> When the chip is just sitting there, the up/down number stays around 1.0 —
> that's gravity pulling on the weight.
