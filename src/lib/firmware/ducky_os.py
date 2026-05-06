# Ducky OS — universal-listener firmware for the Ducky kit
#
# Speaks a tiny line-delimited protocol over the USB serial:
#   M:01010...        set 5x5 matrix bitmap (25 chars)
#   N:hello world     scroll text on the matrix
#   F:happy           show a named face
#   T:C4,200;E4,400   play a tone sequence (note,ms;...)
#   S?light           subscribe to a sensor stream
#   S!light           unsubscribe
#   P:heartbeat       run a named preset
#   R:42              radio: send a number
#   Q                 stop the current preset
#
# Emits back:
#   <S accel x,y,z>   sensor sample
#   <B A down>        button event
#   <T down>          logo touch event
#   <R 42>            radio packet received
#   <L message>       free-form log

from microbit import *
import radio, music

uart.init(baudrate=115200)

# --- Pictures ---
FACES = {
    'happy':  Image("00000:01010:00000:10001:01110"),
    'sad':    Image("00000:01010:00000:01110:10001"),
    'wink':   Image("00000:01000:00010:10001:01110"),
    'wave':   Image("00100:01110:11111:01110:00100"),
    'sleep':  Image("00000:11011:00000:01110:00000"),
    'duck':   Image("01100:11110:11111:01110:00000"),
    'dizzy':  Image("10001:01010:00100:01010:10001"),
}
BIG_HEART   = Image("01010:11111:11111:01110:00100")
SMALL_HEART = Image("00000:01110:01110:00100:00000")
ARROWS = [
    Image.ARROW_N, Image.ARROW_NE, Image.ARROW_E, Image.ARROW_SE,
    Image.ARROW_S, Image.ARROW_SW, Image.ARROW_W, Image.ARROW_NW
]

# --- Notes ---
NOTE_FREQ = {
    'C4': 262, 'C#4': 277, 'D4': 294, 'D#4': 311, 'E4': 330,
    'F4': 349, 'F#4': 370, 'G4': 392, 'G#4': 415, 'A4': 440,
    'A#4': 466, 'B4': 494, 'C5': 523, 'D5': 587, 'E5': 659,
}

# --- State ---
subs = set()
preset = None
state = {}
buf = b""
last_sample = 0
last_logo = False

# --- Helpers ---
def parse_matrix(bits):
    rows = [bits[r * 5:r * 5 + 5] for r in range(5)]
    return Image(":".join(rows))

def play_tones(s):
    for pair in s.split(';'):
        try:
            n, ms = pair.split(',')
            f = NOTE_FREQ.get(n)
            if f:
                music.pitch(f, int(ms), wait=True)
        except:
            pass

def sample(s):
    try:
        if s == 'accel':
            return "%.2f,%.2f,%.2f" % (
                accelerometer.get_x() / 1024.0,
                accelerometer.get_y() / 1024.0,
                accelerometer.get_z() / 1024.0,
            )
        if s == 'mic':
            return str(microphone.sound_level())
        if s == 'light':
            return str(display.read_light_level())
        if s == 'temp':
            return str(temperature())
        if s == 'compass':
            return str(compass.heading())
    except:
        pass
    return None

def bargraph(value, max_value):
    """Return an Image where the bottom N rows are lit, scaled 0..max."""
    lit = max(0, min(5, int((value / max_value) * 5)))
    rows = ["11111" if (4 - r) < lit else "00000" for r in range(5)]
    return Image(":".join(rows))

# --- Command handler ---
def handle(line):
    global preset, state
    if not line:
        return
    c = line[0]
    rest = line[2:] if len(line) > 2 else ""
    if c == 'M':
        try:
            display.show(parse_matrix(rest))
        except:
            pass
    elif c == 'N':
        # loop=True keeps scrolling forever; trailing space gives the eye a gap
        display.scroll(rest + ' ', delay=120, wait=False, loop=True)
    elif c == 'F':
        if rest in FACES:
            display.show(FACES[rest])
    elif c == 'T':
        play_tones(rest)
    elif c == 'S':
        if len(line) >= 2:
            op = line[1]
            sname = line[2:]
            if op == '?':
                subs.add(sname)
            elif op == '!':
                subs.discard(sname)
    elif c == 'P':
        preset = rest
        state = {}
        print('<L preset %s>' % rest)
    elif c == 'R':
        try:
            radio.send(rest)
        except:
            pass
    elif c == 'Q':
        preset = None
        state = {}
        display.show(FACES['duck'])

# --- Per-preset device-side behaviour ---
def tick():
    global preset, state
    n = running_time()

    if preset == 'heartbeat':
        if n - state.get('t', 0) > 600:
            state['t'] = n
            state['b'] = not state.get('b', False)
            display.show(BIG_HEART if state['b'] else SMALL_HEART)

    elif preset == 'tap-wake':
        # Idle: gentle pulse so the kid knows it's listening
        if n - state.get('t', 0) > 1500:
            state['t'] = n
            display.show(Image.ASLEEP)

    elif preset == 'shake':
        try:
            g = accelerometer.get_strength() / 1024.0
        except:
            g = 1.0
        if g > 1.5 and n - state.get('shaken', 0) > 400:
            state['shaken'] = n
            display.show(FACES['dizzy'])
            music.pitch(660, 120, wait=False)
        elif n - state.get('shaken', 0) > 600 and n - state.get('t', 0) > 500:
            state['t'] = n
            display.show(FACES['happy'])

    elif preset == 'cold-hands':
        if n - state.get('t', 0) > 300:
            state['t'] = n
            display.show(bargraph(temperature() - 18, 14))

    elif preset == 'hide-peek':
        if n - state.get('t', 0) > 200:
            state['t'] = n
            l = display.read_light_level()
            display.show(FACES['happy'] if l > 50 else FACES['sad'])

    elif preset == 'whisper':
        if n - state.get('t', 0) > 80:
            state['t'] = n
            try:
                v = microphone.sound_level()
            except:
                v = 0
            display.show(bargraph(v, 255))

    elif preset == 'compass-quest':
        if n - state.get('t', 0) > 300:
            state['t'] = n
            try:
                h = compass.heading()
            except:
                h = 0
            display.show(ARROWS[int(((h + 22) % 360) / 45)])

    elif preset == 'wave-across':
        pass  # button + radio handlers below do all the work

    elif preset == 'touch-logo':
        if n - state.get('t', 0) > 1000:
            state['t'] = n
            display.show(FACES['duck'])


# --- Boot ---
radio.config(channel=42, group=42)
radio.on()
display.show(FACES['duck'])
print('<L Ducky OS ready>')

# --- Main loop ---
while True:
    # 1. Pull any pending bytes from the host
    if uart.any():
        chunk = uart.read()
        if chunk:
            buf += chunk
            while b'\n' in buf:
                idx = buf.find(b'\n')
                try:
                    line = buf[:idx].decode().strip()
                    handle(line)
                except:
                    pass
                buf = buf[idx + 1:]

    # 2. Sensor streaming (~10 Hz)
    n = running_time()
    if n - last_sample > 90:
        last_sample = n
        for s in list(subs):
            v = sample(s)
            if v is not None:
                print('<S %s %s>' % (s, v))

    # 3. Active preset behaviour
    tick()

    # 4. Button events
    if button_a.was_pressed():
        print('<B A down>')
        if preset == 'tap-wake':
            display.show(Image.HAPPY)
            sleep(150)
            display.show(Image.ASLEEP)
        elif preset == 'wave-across':
            try:
                radio.send('w')
            except:
                pass
            display.show(FACES['wave'])
            sleep(280)
            display.clear()
    if button_b.was_pressed():
        print('<B B down>')

    # 5. Logo touch (V2 only)
    try:
        t = pin_logo.is_touched()
        if t and not last_logo:
            print('<T down>')
            last_logo = True
            if preset == 'touch-logo':
                music.pitch(880, 120, wait=False)
                display.show(FACES['happy'])
                sleep(200)
                display.show(FACES['duck'])
        elif not t and last_logo:
            print('<T up>')
            last_logo = False
    except:
        pass

    # 6. Radio receive
    msg = radio.receive()
    if msg is not None:
        print('<R %s>' % msg)
        if preset == 'wave-across' and msg == 'w':
            display.show(FACES['wave'])
            sleep(280)
            display.clear()

    sleep(15)
