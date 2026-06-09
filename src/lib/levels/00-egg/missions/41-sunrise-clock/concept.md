### The matrix is a *light sensor*

Look closely at the 5×5 grid — those red LEDs can also detect light pointed at
them. The micro:bit reverses the diode trick and reads them as a tiny camera.

You get a number from 0 (pitch dark) to 255 (very bright sunlight). Ducky maps
it to lit rows from the bottom up. More light, more rows.

### What's it good for?

- Streetlamps that turn on when it gets dark
- Plants that ping you when they need sun
- Phones that dim their screen at night

> Mission idea: make a "is the fridge light still on?" alarm.
