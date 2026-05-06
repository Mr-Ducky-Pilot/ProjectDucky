### Time as a signal

A metronome doesn't measure anything — it *produces* a signal at a precise rate. All music is built on this: a shared clock that keeps performers in sync. Before electronic metronomes, musicians used mechanical pendulums. The maths is the same.

At 120 BPM there are 120 beats per minute, so one beat every 500ms (60,000ms ÷ 120). The browser uses `setInterval(tick, 500)` — a callback that fires every 500ms. Each tick, it sends a `T:` command; the chip plays the note.

### Tap tempo

Professional gear lets musicians set BPM by tapping the beat. Your browser measures the time between taps, averages them, and converts: `BPM = 60,000 ÷ avgIntervalMs`. Tap twice and you get a rough reading; tap 8 times and it's precise enough to match any track.

> Set BPM to 60 and count "one two three four" on each beat. That's 60 BPM — exactly one beat per second, the slowest comfortable tempo. Try 120 (double-time). Songs you know are probably somewhere in between.
