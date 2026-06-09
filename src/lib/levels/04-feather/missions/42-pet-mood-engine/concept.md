### Rules engines

A **rules engine** is a tiny piece of code that checks a list of "if X then
Y" rules continuously. Email spam filters, smart home systems, even hospital
alarms work this way.

Yours has up to 4 rules. Each rule maps a **trigger** (bright, dark, loud,
quiet, cold, warm, shake) to a **mood**. The duck loops through all rules
every tick and picks the first match.
