### Mapping a range

The mic reports 0–255. The LED matrix wants brightness 0–9. We need to "map"
one range onto the other.

The simplest map is **division**: `b = sound // SCALE`. Tune SCALE so quiet =
1 and loud = 9. Too low? Everything maxes out. Too high? Nothing lights up.

This range-mapping pattern is everywhere — volume sliders, screen brightness,
game character speeds.
