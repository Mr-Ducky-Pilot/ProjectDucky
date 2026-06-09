# Functions — reusable named actions

A function is a named block of code you can run whenever you need it. You define it once, then call it by name.

```python
def dance_a():
    display.show(Image.HEART)
    music.play(music.JUMP_UP)
    sleep(300)
    display.clear()
```

`def` means "define a function". The name goes after it. The indented block underneath is what runs when you call `dance_a()`.

## Why bother with functions?

Without functions, every button press would need a full copy of the same code. With functions, you write the move once and call it anywhere:

```python
if button_a.was_pressed():
    dance_a()   # just the name + () to call it

if accelerometer.was_gesture("shake"):
    dance_a()   # same move, same code, called twice
```

## The log() helper

The template includes a `log()` helper — calling it sends a message to the browser so you can see which move was triggered. This is how real programs communicate what they're doing — it's called **logging**.

```python
def dance_a():
    log("dance_a")   # tells the browser which move ran
    # ... your dance here
```
