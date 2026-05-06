### Animation is just fast pictures

A cartoon is thousands of still drawings shown so quickly your brain stitches them into motion. Your animation chip does the same — it shows one 5×5 image, swaps to the next, then the next, on a loop.

The speed is called the **frame rate**. Cinema uses 24 frames per second. Old flip-books work at maybe 5. Try different delays: at 800ms you see each frame separately, at 80ms your brain starts to see movement.

### Sequences in code

Your browser sends one `M:` command per frame on a timer. The chip doesn't know it's an animation — it just shows whatever picture arrives. The timing logic lives entirely in the browser.

> Make a 3-frame heartbeat: empty → small heart → big heart. That's exactly what mission 02 does in firmware — you've just recreated it in software.
