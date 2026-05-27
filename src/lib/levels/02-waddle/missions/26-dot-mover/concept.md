# 2D coordinates

The LED matrix is a 5×5 grid. Every pixel has an X (column, 0–4) and Y (row, 0–4) coordinate. Top-left is (0,0).

```
(0,0)  (1,0)  (2,0)  (3,0)  (4,0)
(0,1)  (1,1)  (2,1)  (3,1)  (4,1)
(0,2)  (1,2)  (2,2)  (3,2)  (4,2)
...
```

`display.set_pixel(x, y, 9)` lights up the pixel at column X, row Y at full brightness (9).

## Wrapping

Without wrapping, going left past 0 would crash the program (pixel -1 doesn't exist). Wrapping sends you back to the other side:

```python
if x < 0:
    x = 4    # jumped off the left → appear on the right
if x > 4:
    x = 0    # jumped off the right → appear on the left
```

This is the same trick used in classic arcade games like Pac-Man and Asteroids.
