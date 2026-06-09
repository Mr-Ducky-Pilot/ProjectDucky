### Detecting events from a stream

The accelerometer fires ~10 readings per second. You don't want to count every
reading — you want to count **events** (one jump = one count, even if the
spike lasts a few readings).

That's done with two tricks:
1. A **threshold** to filter noise from real movement
2. A **cooldown** to stop one event being counted multiple times
