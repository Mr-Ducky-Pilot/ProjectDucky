### How the browser drives it

```ts
// Send our hello three times with jitter
for (let i = 0; i < 3; i++) {
    await delay(Math.random() * 200);
    connection.send({ type: 'radio-send', payload: `HELLO|${callSign}` });
}

// Wait for the friend's INFO
connection.onEvent((e) => {
    if (e.type === 'radio' && e.payload.startsWith('INFO|')) {
        addFriend(parseInfo(e.payload));
    }
});
```

The micro:bit radio supports text payloads via `radio.send_string`. Here we
piggyback on the existing `R:` numeric command by encoding the string as JSON
in higher-level missions. (For this mission, the protocol does the rest.)
