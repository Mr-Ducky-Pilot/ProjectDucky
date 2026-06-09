### Tick a card, count a stomp

```ts
const cards = ['LEFT', 'RIGHT', 'STOMP', 'JUMP', 'HOLD'];
let cardIdx = 0;
let stomps = 0;

setInterval(() => {
    cardIdx = (cardIdx + 1) % cards.length;
    connection.send({ type: 'tone', sequence: [{ note: 'C4', ms: 80 }] });
}, 60_000 / BPM);

connection.streamSensor('accel', ([x, y, z]) => {
    if (z > 1.8 && !cooldown) {
        stomps++;
        cooldown = true;
        setTimeout(() => (cooldown = false), 250);
    }
});
```

The `cooldown` flag stops one stomp from being counted twice if it's a long
spike — same trick you'd use to debounce a button press.
