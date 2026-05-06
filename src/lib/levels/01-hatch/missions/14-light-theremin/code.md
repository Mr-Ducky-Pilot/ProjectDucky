```python
notes = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5']  # pentatonic

# Map 0-255 light reading to a note index
light = display.read_light_level()
idx = int((light / 256) * len(notes))
note = notes[min(idx, len(notes) - 1)]

# Play for 80ms, don't block (so we can update again quickly)
music.pitch(NOTE_FREQ[note], 80, wait=False)
```

One sensor reading → one array lookup → one pitch. The light range (0–255) is split into 8 equal slices. Each slice maps to a note. Brighter = higher index = higher frequency.

**Why pentatonic?** The pentatonic scale skips the notes that clash. Every combination sounds pleasant — no "wrong" note. That's why it's used in improvisation lessons worldwide.
