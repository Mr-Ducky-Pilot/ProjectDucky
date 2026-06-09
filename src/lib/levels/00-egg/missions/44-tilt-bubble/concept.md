### The chip *knows* which way is up

Inside the micro:bit is a tiny chip called an **accelerometer**. It measures
how gravity (and any movement) pulls it on three axes: X (left/right), Y
(forward/back), Z (up/down).

When you tilt your duck, gravity stops pulling straight down on Z and starts
pulling on X or Y instead — and the bubble code maps that exactly to where to
put the pixel.

### Real engineers use these too

- Phones rotate the screen when you tilt them
- Cars detect crashes (sudden huge spikes in g-force)
- Drones stay upright using one of these in every wing

> You're holding the same sensor that lands SpaceX rockets — just a tinier
> version.
