```python
# Board side — simplified version of what actually happens
start_time = running_time()  # ms since boot

display.show(Image.ALL_ON)   # green flash!

# Wait for button A
while not button_a.was_pressed():
    pass

reaction_ms = running_time() - start_time
```

`running_time()` returns milliseconds since the chip booted. Subtract two readings and you get elapsed time — no clock needed.

**Human baseline:** most people react in 150–300ms. Below 150ms is practically impossible (nerve signals take ~100ms just to travel from eye to brain). Above 400ms usually means distraction. Elite athletes hover around 180ms.

In this mission, the browser does the timing — the chip just reports button presses back via `<B A down>`.
