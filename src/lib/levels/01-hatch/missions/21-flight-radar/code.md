# Under the Hood

## Fetching live flight data

```javascript
// One URL gives us all planes within 50 nautical miles
const response = await fetch(
  `https://opendata.adsb.fi/api/v2/lat/${lat}/lon/${lon}/dist/50`
);
const data = await response.json();
const planes = data.ac ?? [];   // ac = aircraft array
```

Each entry in the `ac` array looks like this:

```javascript
{
  flight:   "BA0123",   // callsign (airline + number)
  lat:      51.477,     // GPS latitude
  lon:      -0.461,     // GPS longitude
  alt_baro: 35000,      // barometric altitude in feet
  gs:       456,        // ground speed in knots
  track:    270         // heading (0 = North, 90 = East)
}
```

## Placing blips on the radar

To turn real GPS coordinates into pixel positions on a circular radar, we need two pieces of maths:

**1. Haversine distance** — how far away (in km) is the plane from the airport centre?

```javascript
function distKm(lat1, lon1, lat2, lon2) {
  const R = 6371;                       // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2
          + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180)
          * Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
```

**2. Bearing** — which direction (in degrees from North) is the plane?

```javascript
function bearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const x = Math.sin(dLon) * Math.cos(lat2 * Math.PI/180);
  const y = Math.cos(lat1 * Math.PI/180) * Math.sin(lat2 * Math.PI/180)
          - Math.sin(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.cos(dLon);
  return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;
}
```

Then we convert polar coordinates (distance + bearing) to Cartesian (x, y pixels):

```javascript
const fraction = distKm / maxRangeKm;      // 0 = centre, 1 = edge of radar
const ang = bearingDeg * Math.PI / 180;
const dx = fraction * R_pixels * Math.sin(ang);   // East is +x
const dy = -fraction * R_pixels * Math.cos(ang);  // North is -y (canvas flipped)
```

This is the exact same navigation maths that pilots and ship navigators use — and now you understand it!
