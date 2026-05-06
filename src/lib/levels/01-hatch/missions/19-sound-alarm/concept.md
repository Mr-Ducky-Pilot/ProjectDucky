### Sensors as guards

A motion sensor alarm, a smoke detector, a speed camera — all the same pattern: sample a sensor continuously, compare the reading to a threshold, trigger a reaction when the line is crossed.

Your alarm adds **dead time**: after firing, it ignores the sensor for a few seconds to avoid a spray of repeated triggers. Real security systems call this the "rearm delay". Without it, one clap would trigger 50 alarms.

### Armed vs disarmed: a state flag

Two states, one boolean. When armed, crossings matter. When disarmed, the sensor data is ignored. This is a **state flag** — one of the most common patterns in all of software. Most feature toggles, dark modes, and "mute" buttons work exactly this way.

> Place the chip under your notebook. Set sensitivity to medium. Anyone who picks the book up — their rustling sets it off. You've built a tamper detector.
