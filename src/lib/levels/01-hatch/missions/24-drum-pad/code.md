### Each step, send tones for the lit cells

```ts
function tick() {
    const stepCol = step % 4;
    const tones = [];
    for (let row = 0; row < 4; row++) {
        if (grid[row][stepCol]) tones.push({ note: ROW_NOTES[row], ms: 80 });
    }
    connection.send({ type: 'tone', sequence: tones });
    step++;
}
```

Different notes = different drum-ish sounds. The micro:bit's tiny speaker
can't actually do a *real* drum sound, but a low pitch feels like a kick, a
high pitch feels like a hat.
