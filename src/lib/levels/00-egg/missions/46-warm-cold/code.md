### Read, classify, show

```python
elif preset == 'warm-cold':
    tc = temperature()                   # in degrees C
    lit = max(0, min(5, (tc - 18) // 3 + 1))
    rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
    display.show(Image(":".join(rows)))
```

`temperature()` is a single function call — the chip already does the work.
The maths just maps "18°C" to 1 lit row and "33°C+" to all 5 lit rows.

> If you build a real weather station, you'd add a proper external sensor
> (called a DHT22 or BME280). For Ducky, the on-chip one is plenty fun.
