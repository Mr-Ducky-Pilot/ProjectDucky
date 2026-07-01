### Two thermometers, two truths

The chip's built-in reading (`temperature()`) measures the CPU die — warmed by
its own circuitry, not the room. The new external sensor is a **thermistor**:
a resistor whose resistance changes with heat, sitting on a wire away from any
hot silicon. It's slower to react (thermal mass) but honest about the air
around it.

### Why disagreement is the interesting part

Two sensors measuring "the same thing" rarely agree exactly — that's true of
real weather stations, real medical thermometers, real science. Learning to
ask *what is this sensor actually touching* is more useful than trusting a
single number.

> If you build a real weather station one day, this is the exact same
> "reference sensor vs. convenience sensor" tradeoff professional stations make.
