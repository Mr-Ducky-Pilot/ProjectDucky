### A state machine in 8 lines

Your duck has one number: `grumpy` (0 to 100). Every tick it either rises (if
loud) or falls (if quiet). Cross 70 and the face changes. Drop under 30 and
it goes back to happy.

This pattern is everywhere: smoke detectors, anti-spam algorithms, even
romantic relationships — it's called **hysteresis**: needing different
thresholds to enter vs leave a state, so it doesn't flicker.
