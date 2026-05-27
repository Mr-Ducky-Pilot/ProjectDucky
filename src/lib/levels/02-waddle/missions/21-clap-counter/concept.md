# Variables

A **variable** is a named box that holds a value. The chip can read it, change it, and remember it while the program runs.

```python
count = 0        # create a box called "count", put 0 inside
count = count + 1  # read the box, add 1, put the result back
```

Every time the second line runs, `count` grows by one. That's the entire idea behind a counter.

## Why `if`?

The chip checks the microphone **every loop** — about 100 times a second. Without an `if`, it would add to `count` constantly. The `if` means: *only add when it's actually loud*.

```python
if sound > 150:    # is it loud enough?
    count = count + 1  # yes — add 1
```

Try changing `150` to `50` (counts almost everything) or `220` (only very loud sounds).
