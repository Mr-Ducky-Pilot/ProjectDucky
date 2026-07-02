### A list of tuples as a mini-database

```python
FEELINGS = [
    ('happy',   Image.HAPPY,     (255, 190, 20)),
    ('sad',     Image.SAD,       (30, 60, 150)),
]
```

Each entry bundles a name, a face, and a colour together. `FEELINGS[idx]`
grabs one whole row; `show_feeling(*FEELINGS[idx])` then *unpacks* that row
into the function's three separate arguments (`name, img, rgb`) — the `*`
means "spread this tuple out" instead of passing it as one bundled value.

### Sending a name, matching it on arrival

```python
radio.send(name)          # sender: just the word, e.g. "calm"
...
for name, img, rgb in FEELINGS:
    if name == msg:
        show_feeling(name, img, rgb)
        break
```

Only the plain word travels over radio — the receiving duck doesn't get a
colour or an image, just text. It re-derives the full feeling by searching
its own `FEELINGS` list for a matching name. Both boards need the *same*
list for this handshake to work, which is why the template is identical on
both ducks.
