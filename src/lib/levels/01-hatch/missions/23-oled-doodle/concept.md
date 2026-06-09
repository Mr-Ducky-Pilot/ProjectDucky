### A bigger canvas

The 5×5 LED matrix has 25 dots. The Grove OLED has 9,216 — that's **368×
bigger**. The same trick works: each dot has a brightness from 0 to 15, and you
send commands to flip them on or off.

### Why "batch" instead of "one at a time"?

Sending every pixel one by one would jam the serial port. Instead, we send up
to ~20 pixels in a single `O:px:x,y,c;x,y,c;…` packet. The chip parses them all
at once and shows the result.

This is the **batching pattern** — used in every graphics engine ever, from
NES to your phone.
