### The chip warms up when it works

The micro:bit doesn't have a fancy temperature sensor — it just reads how warm
its own CPU is. That means: **your reading is the room + a bit of "the chip
working" warmth**.

That's why your duck might say 24°C when your thermometer at home says 21°C.
Both are right, just measuring different things.

### Real-world thermometers

- Doctors use infra-red ones — instant, no contact
- Cars use thermistors in the engine
- Phones use them inside batteries to stop overcharging

> Two ducks side-by-side should agree. If they don't, one might be sitting in
> sunlight or near a heat source.

### Upgrading to a real sensor

Clip an external Grove Temperature Sensor to pin 1 and Ducky notices — it
automatically trusts the real thermistor over its own CPU guess, and this
card will show both numbers side by side so you can see exactly how far off
the estimate was.
