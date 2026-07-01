# Under the Hood

## Fetching the ISS position

```javascript
const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
const data = await res.json();
// data = { latitude, longitude, altitude, velocity, visibility, ... }
```

The number `25544` is the ISS's official **NORAD ID** — a unique number assigned to every tracked object in Earth orbit. There are over 20,000 tracked objects up there!

## Drawing the orbit path on a canvas

We use a simple **equirectangular projection** — longitudes become x pixels, latitudes become y pixels:

```javascript
function latLonToXY(lat, lon, width, height) {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}
```

This maps the whole world onto a rectangle. It distorts the poles but is simple and clear.

## Building the trail

Each time we fetch a new position, we add it to a trail array. This shows the path the ISS has travelled since you opened the mission:

```javascript
trail.push({ lat: data.latitude, lon: data.longitude });
if (trail.length > 40) trail.shift();  // keep last 40 points
```

## Day or night?

The ISS orbits partly in sunlight and partly in Earth's shadow. The API tells us `visibility: "daylight"` or `"eclipsed"`. Astronauts on the ISS experience a sunrise or sunset every 45 minutes!
