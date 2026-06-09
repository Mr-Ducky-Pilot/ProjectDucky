# The Space Station That Never Stops

The **International Space Station (ISS)** is a giant science laboratory the size of a football pitch, orbiting Earth at an altitude of about **420 kilometres**.

## How fast is it going?

The ISS travels at **7.7 km/s** — roughly 27,600 km/h. That's about 23 times faster than a commercial airliner! At this speed, it completes one full orbit of the Earth in just **90 minutes**. In one day it goes around the planet **16 times**.

## Why doesn't it fall?

The ISS is actually falling towards Earth all the time — but it's moving sideways so fast that the curve of the Earth falls away beneath it just as quickly. This is called **free fall**, and it's why astronauts float inside: they're in constant freefall, not because there's no gravity.

## How do we track it?

The ISS's position is calculated from its **Two-Line Element (TLE)** set — a pair of numbers that precisely describe its orbit. Tracking stations constantly update these numbers, and services like `wheretheiss.at` compute the current position and serve it over an API.

## What does the API return?

```json
{
  "latitude":  51.47,       // degrees (positive = North)
  "longitude": -0.46,       // degrees (positive = East)
  "altitude":  421.3,       // km above sea level
  "velocity":  27596.0,     // km/h
  "visibility": "daylight"  // or "eclipsed"
}
```

## Can you see it with your eyes?

Yes! The ISS is the **third brightest object in the sky** after the Sun and Moon. On a clear night when it passes over, it looks like a very fast, bright star. You can look up your next pass at **Heavens Above** or NASA's Spot the Station.
