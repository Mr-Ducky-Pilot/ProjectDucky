# The race loop

```python
WIN = 10        # first to 10 wins — you choose this!
a_score = 0
b_score = 0

while True:
    if button_a.was_pressed():
        a_score = a_score + 1
        display.show("A")       # "A" flashes so A knows their press registered
        if a_score >= WIN:
            display.scroll("A wins!")
            a_score = 0         # reset both scores — start next round
            b_score = 0

    if button_b.was_pressed():  # same logic for B, independently
        b_score = b_score + 1
        ...

    sleep(50)                   # check buttons 20 times per second
```

Both `if button_a` and `if button_b` are checked every loop — neither blocks the other. That's why two players can press at roughly the same time and both get counted.
