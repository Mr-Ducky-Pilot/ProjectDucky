### Sensors as event counters

A step isn't a steady state — it's an event: acceleration spikes sharply as your foot lands, then drops back. Count those spikes and you count steps. Fitness trackers do exactly this with a tiny MEMS accelerometer chip (about the same size as a pinhead).

The key detail: only count the **rising edge** — the moment the reading crosses from below the threshold to above it. If you count every sample above the threshold, one step reads as dozens.

### State machines

The counter tracks two states: **below** (waiting for a spike) and **above** (spike in progress, don't count again). It only increments when switching from below → above. This is a **state machine** — one of the most important patterns in all of computing.

> Tweak the threshold slider. Too sensitive and arm swings count as steps. Too high and real steps are missed. The "right" value is the calibration problem every wearable team faces.
