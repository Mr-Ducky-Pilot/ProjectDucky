### The handshake pattern

When two computers meet over a network, they don't just dump data. They run a
**handshake**: "hello", "I see you, here's me", "got it". Each side knows the
other arrived.

Our duck handshake is three messages:
- `HELLO <my-call-sign>` — anyone out there?
- `INFO <name>|<colors>|<pattern>` — here's who I am
- `ACK <call-sign>` — got you, you're saved

If a packet drops, the other side just times out and waits. No data corrupted,
no system frozen.
