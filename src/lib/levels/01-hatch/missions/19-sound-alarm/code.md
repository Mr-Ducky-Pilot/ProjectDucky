```python
armed = False        # state flag
cooldown = False     # prevents re-triggering immediately

def on_mic(level):
    global cooldown
    if not armed or cooldown:
        return
    if level > SENSITIVITY:
        cooldown = True
        trigger_alarm()          # flash LEDs + play siren
        sleep(2500)              # dead time — ignore sound for 2.5s
        cooldown = False
```

The key is the **cooldown flag**: once triggered, new readings are ignored until the dead time expires. Without it, a single loud clap would fire the alarm hundreds of times before the sound fades.

**The siren tone:** `T:A#4,100;C5,100;A#4,100;C5,100` — two notes alternating quickly. The chip plays them sequentially; the rapid switch between pitches sounds like a siren. Real alarms often use the same trick.
