### Randomness in 32KB

A real die uses physics — it tumbles unpredictably. A computer can't actually
tumble, so it uses a **pseudo-random number generator**: a clever maths
formula that *looks* random.

Each shake, the chip calls `randint(1, 6)` and picks one. Over many rolls,
each number should come up about equally often.

### Is it fair?

Try the "30 rolls" challenge. Tally each result. Did 6 actually appear 5
times? Maybe 4, maybe 7. That's randomness — exact balance happens only over
many, many rolls.
