### Play the strip

```ts
async function play() {
    for (const panel of panels) {
        await connection.send({ type: 'matrix', bits: panel.bits });
        await sleep(1800);
    }
}
```

`await` makes the loop pause between panels. Without it, all four would fire
at the same time and the viewer would only see the last one.
