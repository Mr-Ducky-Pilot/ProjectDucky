### Logs over real time

`running_time()` returns ms since boot. Pair every reading with that
timestamp, and you've built a **time series** — the same data format used by
weather stations, fitness trackers, and the stock market.

The browser receives `<D light 1230 80>` events: sensor name, timestamp, value.
Charting them is then just connecting the dots.
