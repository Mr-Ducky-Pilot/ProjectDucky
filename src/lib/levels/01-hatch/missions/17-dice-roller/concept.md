### Randomness is surprisingly hard

Computers follow precise instructions — they aren't naturally random. To fake randomness, they use **pseudorandom number generators (PRNGs)**: formulas that produce sequences so scrambled they look random. They need a starting value called a **seed** — usually the current time in milliseconds.

`Math.random()` in the browser works this way. If you could seed it with the exact same number twice, you'd get the exact same "random" sequence both times. True randomness (for cryptography, say) requires special hardware.

### Gesture → event → number

The accelerometer reports X, Y, Z forces hundreds of times per second. A "shake" is a burst where the total force (`√(x² + y² + z²)`) jumps above ~1.8g. The browser detects that burst, picks a random number, and sends the dot pattern. You've built a gesture interface with two lines of maths.

> Try shaking once, then once more. Do you ever get the same number twice in a row? How many rolls until you get every number at least once?
