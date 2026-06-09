### One state, five faces

```python
elif preset == 'mood-badge':
    MOODS = (FACES['happy'], FACES['sad'], FACES['wink'],
             FACES['sleep'], FACES['dizzy'])
    idx = state.get('m', 0)
    display.show(MOODS[idx])

# Button handlers:
if button_a.was_pressed() and preset == 'mood-badge':
    state['m'] = (state.get('m', 0) - 1) % 5
if button_b.was_pressed() and preset == 'mood-badge':
    state['m'] = (state.get('m', 0) + 1) % 5
```

`% 5` is the **modulo** operator — it wraps numbers around. Once `m` hits 5,
it becomes 0 again. So the badge cycles forever, never crashes.
