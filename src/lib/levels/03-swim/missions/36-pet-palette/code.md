### Your choice, all the way down

```ts
const pet = {
    color: { primary: '#ff7a6b', secondary: '#ffb5b0' },
    pattern: 'spots'
};

// Anywhere we draw the duck, we pass `pet`:
<PetAvatar pet={pet} mood="excited" />
```

The chip can't show full color (its LEDs are red-only), but it can show your
chosen **pattern**: a heart, a star, stripes. Flash this mission and Ducky
greets you with your design on the LED matrix.
