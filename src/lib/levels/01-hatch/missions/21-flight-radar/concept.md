# How Flight Radar Works

Every commercial airliner carries a device called an **ADS-B transponder**. Every second, it broadcasts a tiny radio signal containing:

- The plane's **GPS position** (latitude and longitude)
- **Altitude** in feet
- **Ground speed** in knots (1 knot ≈ 1.85 km/h)
- **Heading** (direction of travel)
- **Flight number** (e.g. BA1234)

These signals travel at the speed of light and are completely free for anyone to receive. Thousands of volunteers around the world point **SDR antennas** (software-defined radios) at the sky, pick up these signals, and share them online in real time.

## What is an API?

An **API** (Application Programming Interface) is like a menu at a restaurant. Your browser places an order ("give me all planes within 50 nautical miles of London") and the server sends back exactly that data in a format computers can read, called **JSON**.

## Why 2-second refresh?

A typical airliner travels at about **250 metres per second**. After just 2 seconds it has moved half a kilometre — enough to see it visibly shifting on the radar. Refresh faster and you'd put unnecessary load on the server; slower and the blips would feel "sticky".

## ADS-B: the real safety system

ADS-B stands for **Automatic Dependent Surveillance-Broadcast**. It was made mandatory on all commercial aircraft to improve air traffic safety. Air traffic controllers at Heathrow, JFK, and every other major airport use the same data to keep planes safely separated. Your Ducky mini-radar shows exactly what the professionals see!

## Altitude colour coding

| Colour | Altitude | What's happening |
|--------|----------|-----------------|
| 🟢 Green | > 30,000 ft | Cruising at altitude |
| 🟡 Yellow | 10,000–30,000 ft | Climbing or descending |
| 🔴 Red | < 10,000 ft | Final approach or take-off |
