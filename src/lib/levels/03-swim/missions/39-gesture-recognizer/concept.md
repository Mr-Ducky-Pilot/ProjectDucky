### Classification without machine learning

You don't always need fancy ML. A handful of `if` statements over sensor
readings can classify simple gestures with 95%+ accuracy — Wii remotes used
exactly this trick before AI was cool.

The recipe:
1. Compute features (e.g. total force, x tilt)
2. Layer if/elif chains, most specific first
3. Add cooldowns so one shake isn't logged 6 times

That's it. You just built the brain of a Fitbit.
