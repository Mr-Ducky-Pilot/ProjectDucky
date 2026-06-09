### Subscribe, collect, render

```ts
const samples: { t: number; v: number }[] = [];
const start = Date.now();
connection.streamSensor('temp', ([v]) => {
    samples.push({ t: Date.now() - start, v });
    drawGraph(samples);
});
```

Once a second the chip emits `<S temp 23>`. We add it to an array, redraw the
line. To export as PNG: `canvas.toDataURL('image/png')` — turns the canvas
into a downloadable image.
