### Encoding feelings as numbers

```ts
const EMOTIONS = ['happy', 'sad', 'love', 'cool', 'mad', 'tired'];
// To send:
connection.send({ type: 'radio-send', payload: 3 });
// To receive:
connection.onEvent((e) => {
    if (e.type === 'radio') {
        const name = EMOTIONS[e.payload - 1];
        showMatrix(FACE_BITS[name]);
    }
});
```

Six emotions = six numbers (1 through 6). Both ducks need to agree on the
mapping — that's called a **protocol**. The receiver only sees the number; it
trusts that everyone agreed which number means which feeling.
