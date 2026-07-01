### Reading a thermistor

```python
def read_ambient_c():
    v = pin1.read_analog()                       # 0-1023
    r = 10000.0 * (1023.0 / v - 1.0)              # resistance from voltage divider
    k = 1.0 / (math.log(r / 10000.0) / 4250.0 + 1.0 / 298.15)  # Beta equation
    return k - 273.15                             # Kelvin -> Celsius
```

Unlike `temperature()`, there's no built-in function for this sensor — the
chip only knows "voltage on pin 1," so the firmware does the resistance-to-
temperature maths itself using the thermistor's published Beta value.

### Comparing live in the browser

```javascript
connection.streamSensor('temp', ([v]) => { chipTemp = v; });
connection.streamSensor('ambient-temp', ([v]) => { ambientTemp = v; });
```

Two independent subscriptions, same pattern as any other sensor mission —
the wire protocol doesn't care that one reading comes from a chip and the
other from a wire clipped to pin 1.
