### A position that follows a target

Your duck draws a single dot. The target is "wherever the tilt points". Every
tick the dot **moves a little toward the target** — not instantly. That tiny
delay gives the chase its character.

Game studios use this all the time. It's called **easing** or **lerping**
(linear interpolation): position += (target - position) * speed.
