```python
NOTE_FREQ = {
    'C4': 262, 'D4': 294, 'E4': 330,
    'F4': 349, 'G4': 392, 'A4': 440,
}

def play_tones(sequence):
    # sequence = "C4,200;E4,200;G4,400"
    for pair in sequence.split(';'):
        note, ms = pair.split(',')
        freq = NOTE_FREQ.get(note)
        if freq:
            music.pitch(freq, int(ms), wait=True)
```

Your jingle arrives as one line: `T:C4,200;E4,200;G4,400`. The chip splits on `;`, looks up each note name in the frequency table, and plays them one after another — all blocking, so they play in strict order.

**Why Hz?** Sound is air vibrating. 440 vibrations per second (440 Hz) is the note A4 — the one orchestras tune to. Double it (880 Hz) and you get A5, exactly one octave higher. All of Western music runs on that 2× relationship.
