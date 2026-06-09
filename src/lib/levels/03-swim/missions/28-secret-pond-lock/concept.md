# Lists — ordered collections of values

A list holds multiple values in order. You build it up over time with `append()`, and compare the whole thing at once.

```python
entry = []           # empty list to start
entry.append(0)      # now: [0]
entry.append(1)      # now: [0, 1]
entry.append(0)      # now: [0, 1, 0]
```

## Comparing lists

Python compares lists element by element. Two lists are equal if they have the same values in the same order:

```python
COMBO = [0, 1, 0]
entry = [0, 1, 0]

entry == COMBO   # True!
entry == [1, 0]  # False
```

## The pattern: accumulate → check → reset

This is a fundamental pattern in interactive code — collect input piece by piece, check when you have enough, then reset to try again:

```python
if len(entry) == len(COMBO):
    if entry == COMBO:
        unlock()
    else:
        reject()
    entry = []   # reset — allow another attempt
```

Resetting `entry` to `[]` is the key move. Without it, the lock would be permanently locked or unlocked after the first attempt.
