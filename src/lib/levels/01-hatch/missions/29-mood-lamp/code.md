### A lookup table for feelings

```javascript
const MOOD_PALETTE = {
  excited: { rgb: [255, 120, 20], face: 'happy', sound: 'SPRING' },
  sad:     { rgb: [30, 60, 140],  face: 'sad',   sound: 'SAD' },
  // ...
};
```

Each mood name maps to everything needed to express it. Instead of a long
`if mood === 'excited' ... else if mood === 'sad' ...` chain, the code just
looks the mood up once — `MOOD_PALETTE[mood]` — and reads out its colour,
face, and sound together.

### Sending three commands as one moment

```javascript
connection.send({ type: 'face', name: entry.face });
connection.send({ type: 'rgb', r, g, b });
connection.send({ type: 'sound', name: entry.sound });
```

Three separate wire commands, sent right after each other, land on the
board close enough together that they feel simultaneous — the face changes,
the LED glows, and the tone plays as one event, not three.

### Listening to the physical buttons

```javascript
connection.onEvent((e) => {
  if (e.type === 'button' && e.phase === 'down') { ... }
});
```

The browser doesn't just send commands — it also listens for events coming
*back* from the board, including real button presses, so pressing A or B on
the physical duck cycles the mood exactly like tapping the on-screen dots.
