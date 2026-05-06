```python
# Browser side (JavaScript equivalent)
result = Math.ceil(Math.random() * 6)  # 1..6

DICE_BITS = {
    1: "0000000000001000000000000",
    6: "1000100000100010000010001",
    # ...
}

# Send the dot pattern for that number
connection.send({ type: 'matrix', bits: DICE_BITS[result] })
```

The chip just receives a 25-bit pattern and lights the LEDs — it doesn't know it's a dice face. The "randomness" and the pattern lookup both happen in the browser.

**Shake detection in the browser:**

```js
if (Math.hypot(x, y, z) > 1.8) {
    roll();  // magnitude exceeded 1.8g — that's a shake
}
```

`Math.hypot(x, y, z)` is Pythagoras in 3D — the length of the 3D acceleration vector. At rest, that's always ~1.0g (Earth's gravity pointing down). A shake spikes it higher.
