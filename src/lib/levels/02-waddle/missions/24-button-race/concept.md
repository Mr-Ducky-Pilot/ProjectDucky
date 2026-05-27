# Events and game state

`button_a.was_pressed()` returns `True` once per press — not continuously while held. That makes it perfect for counting taps.

```python
if button_a.was_pressed():
    a_score = a_score + 1    # count presses
    display.show("A")        # quick feedback
```

## Game state = variables that track the game

`a_score`, `b_score`, and `WIN` together describe the entire game's state. When someone wins, resetting both scores restarts the game without reflashing.

```python
if a_score >= WIN:
    display.scroll("A wins!")
    a_score = 0              # reset — start again
    b_score = 0
```

This pattern (variables + events + reset) is how almost every game ever made works under the hood — from Pong to Minecraft.
