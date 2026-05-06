```python
# Browser side — runs a setInterval every N ms
bpm = 120
interval_ms = 60_000 / bpm   # = 500ms

def tick():
    # Send a short beep to the chip
    connection.send({ type: 'tone', sequence: [{ note: 'G4', ms: 60 }] })
    # Flash the matrix
    connection.send({ type: 'matrix', bits: all_on if beat else all_off })

setInterval(tick, interval_ms)
```

The chip plays each `T:` command as it arrives — it has no idea it's part of a metronome. All timing lives in the browser's `setInterval`.

**Tap tempo maths:**
```js
const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
const avg = intervals.reduce((a, b) => a + b) / intervals.length;
const bpm = Math.round(60_000 / avg);
```

Average the gaps between taps, divide 60,000 by the result. Eight taps gives eight interval samples — enough to smooth out human inconsistency.
