# Dictionaries — mapping keys to values

A dictionary maps one value (the key) to another (the value). Perfect for encoding tables like Morse code:

```python
MORSE = {
    'A': '.-',
    'B': '-...',
    'E': '.',
    'S': '...',
}
```

Look up a key with square brackets or `.get()`:

```python
MORSE['A']            # returns '.-'
MORSE.get('Z', '?')   # returns '?' if Z not in dict
```

## Reverse lookup — finding the key from the value

To decode a Morse string back to a letter, loop through the dictionary and check each value:

```python
code = '.-'   # received dot-dash

for letter, morse in MORSE.items():
    if morse == code:
        print(letter)   # prints 'A'
        break
```

`dict.items()` gives you pairs of (key, value) to loop through.

## Long vs short press detection

Timing a button press with `utime` lets you tell dots from dashes:

```python
import utime

pressed_at = 0

if button_a.is_pressed() and pressed_at == 0:
    pressed_at = utime.ticks_ms()       # record when pressed

elif not button_a.is_pressed() and pressed_at > 0:
    duration = utime.ticks_diff(utime.ticks_ms(), pressed_at)
    pressed_at = 0
    if duration >= 300:                 # 300ms threshold
        current += '-'                  # long press = dash
    else:
        current += '.'                  # short = dot
```
