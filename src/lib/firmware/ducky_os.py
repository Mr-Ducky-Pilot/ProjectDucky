# Ducky OS — universal-listener firmware for the Ducky kit
#
# Speaks a tiny line-delimited protocol over the USB serial:
#   M:01010...        set 5x5 matrix bitmap (25 chars, 0=off 9=bright)
#   N:hello world     scroll text on the matrix
#   F:happy           show a named face
#   T:C4,200;E4,400   play a tone sequence (note,ms;...)
#   S?light           subscribe to a sensor stream
#   S!light           unsubscribe
#   P:heartbeat       run a named preset (also exits menu mode)
#   R:42              radio: send a number
#   C:255,180,20      set RGB LED colour (0-255 each, external Grove LED on P0)
#   A:HELLO           play a built-in expressive sound
#   Q                 stop current preset, return to on-board menu
#
# Emits back:
#   <S accel x,y,z>   sensor sample
#   <B A down>        button A or B pressed (play mode only)
#   <T down>          logo short-tap event (play mode, non-touch-logo presets)
#   <R 42>            radio packet received
#   <L message>       free-form log
#
# On-board navigation (no browser needed after first flash):
#   Boot → duck face (1s) → Menu mode
#   Menu:  A = previous activity, B = next activity, logo tap = activate
#   Play:  runs preset; logo held ≥1.5s = back to Menu

from microbit import *
import radio, music, math, audio, neopixel

uart.init(baudrate=115200)

# --- Pictures (all lit pixels at brightness 9 = 100%) ---
FACES = {
    'happy':  Image("00000:09090:00000:90009:09990"),
    'sad':    Image("00000:09090:00000:09990:90009"),
    'wink':   Image("00000:09000:00090:90009:09990"),
    'wave':   Image("00900:09990:99999:09990:00900"),
    'sleep':  Image("00000:99099:00000:09990:00000"),
    'duck':   Image("09900:99990:99999:09990:00000"),
    'dizzy':  Image("90009:09090:00900:09090:90009"),
}
BIG_HEART   = Image("09090:99999:99999:09990:00900")
SMALL_HEART = Image("00000:09990:09990:00900:00000")

# Mood name -> RGB colour, for the external Grove RGB LED (keep in sync with
# src/lib/data/moodPalette.ts's MOOD_PALETTE — no shared import across TS/Python).
MOOD_RGB = {
    'happy': (255, 190, 20), 'sad': (30, 60, 150), 'wink': (30, 190, 220),
    'sleep': (20, 20, 80),   'dizzy': (200, 60, 220),
}
MOOD_NAMES = ('happy', 'sad', 'wink', 'sleep', 'dizzy')  # index matches mood-badge's MOODS tuple
SOUND_NAMES = ('GIGGLE', 'HAPPY', 'HELLO', 'MYSTERIOUS', 'SAD', 'SLIDE', 'SOARING', 'SPRING', 'TWINKLE', 'YAWN')

ARROWS = [
    Image("00900:09990:90909:00900:00900"),   # N
    Image("00999:00099:00909:09000:90000"),   # NE
    Image("00900:00090:99999:00090:00900"),   # E
    Image("90000:09000:00909:00099:00999"),   # SE
    Image("00900:00900:90909:09990:00900"),   # S
    Image("00009:00090:90900:99000:99900"),   # SW
    Image("00900:09000:99999:09000:00900"),   # W
    Image("99900:99000:90900:00090:00009"),   # NW
]

NOTE_FREQ = {
    'C4': 262, 'C#4': 277, 'D4': 294, 'D#4': 311, 'E4': 330,
    'F4': 349, 'F#4': 370, 'G4': 392, 'G#4': 415, 'A4': 440,
    'A#4': 466, 'B4': 494, 'C5': 523, 'D5': 587, 'E5': 659,
}

# External Grove hardware pins (both optional — code degrades gracefully if absent)
RGB_PIN = pin0
AMBIENT_PIN = pin1
RGB_COUNT = 1

# --- On-board menu ---
# L0-MENU-ONLY:BEGIN
PRESET_LIST = (
    'heartbeat', 'tap-wake', 'shake', 'hide-peek',
    'whisper', 'touch-logo', 'compass-quest',
    'sky-radar', 'iss-orbit',
    'breathe', 'sunrise', 'dice', 'mood-badge',
    'bubble', 'firefly', 'warm-cold', 'ambient-temp',
)
MENU_ICONS = {
    'heartbeat':     Image("09090:09090:09990:00900:00000"),
    'tap-wake':      Image("00000:99099:00000:09990:00000"),
    'shake':         Image("90009:09090:00900:09090:90009"),
    'hide-peek':     Image("00000:09090:00000:09990:00000"),
    'whisper':       Image("00900:09990:99999:09990:00900"),
    'touch-logo':    Image("09900:99990:99999:09990:00000"),
    'compass-quest': Image("00900:09990:90909:00900:00900"),
    'sky-radar':     Image("00900:09090:90009:09090:00900"),
    'iss-orbit':     Image("00900:09000:90009:00090:00900"),
    'breathe':       Image("00000:09990:99999:09990:00000"),
    'sunrise':       Image("00900:09990:99999:99999:99999"),
    'dice':          Image("99999:90909:99999:90909:99999"),
    'mood-badge':    Image("09090:00000:00000:90009:09990"),
    'bubble':        Image("09990:90009:90009:09990:00000"),
    'firefly':       Image("00000:00900:09090:00900:00000"),
    'warm-cold':     Image("00900:09990:09090:09090:09990"),
    'ambient-temp':  Image("00900:09090:09090:09090:99999"),
}
# L0-MENU-ONLY:END

# Precomputed integer compass spoke vectors for 8 directions (24px radius)
# N, NE, E, SE, S, SW, W, NW — index matches ARROWS order
_CV = [(0,-24),(17,-17),(24,0),(17,17),(0,24),(-17,17),(-24,0),(-17,-17)]

# --- State ---
subs = set()
preset = None
state = {}
buf = b""
last_sample = 0
light_thresh = 50

menu_mode = False
# L0-MENU-ONLY:BEGIN
menu_idx = 0
# L0-MENU-ONLY:END

# Long-press logo tracking
logo_hold_start = 0
logo_held = False

# --- Helpers ---
def parse_matrix(bits):
    bits9 = bits.replace('1', '9')
    rows = [bits9[r * 5:r * 5 + 5] for r in range(5)]
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
        if s == 'ambient-temp':
            c = read_ambient_c()
            if c is not None:
                return "%.1f" % c
    except:
        pass
    return None

def bargraph(value, max_value):
    lit = max(0, min(5, int((value / max_value) * 5)))
    rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
    return Image(":".join(rows))

def set_rgb(r, g, b):
    if np:
        try:
            for i in range(RGB_COUNT):
                np[i] = (r, g, b)
            np.show()
        except:
            pass

def read_ambient_c():
    # Grove Temperature Sensor V1.2 (NTC thermistor, 10K@25C). B-value varies
    # by exact part revision (~3950-4250K per Seeed datasheets) — this is a
    # reasonable default; recalibrate against a real thermometer if the
    # readings drift.
    try:
        v = AMBIENT_PIN.read_analog()
        if v <= 0 or v >= 1023:
            return None
        r = 10000.0 * (1023.0 / v - 1.0)
        k = 1.0 / (math.log(r / 10000.0) / 4250.0 + 1.0 / 298.15)
        return k - 273.15
    except:
        return None

# L0-MENU-ONLY:BEGIN
def show_menu():
    display.show(MENU_ICONS.get(PRESET_LIST[menu_idx], FACES['duck']))
# L0-MENU-ONLY:END

# --- Command handler ---
def handle(line):
    global preset, state, light_thresh, menu_mode, menu_idx
    if not line:
        return
    c = line[0]
    rest = line[2:] if len(line) > 2 else ""
    if c == 'L':
        try:
            light_thresh = max(0, min(255, int(rest)))
            print('<L threshold=%d>' % light_thresh)
        except:
            pass
    elif c == 'M':
        try:
            display.show(parse_matrix(rest))
        except:
            pass
    elif c == 'N':
        display.scroll(rest + ' ', delay=120, wait=False, loop=True)
    elif c == 'F':
        if rest in FACES:
            display.show(FACES[rest])
    elif c == 'T':
        play_tones(rest)
    elif c == 'C':
        try:
            r, g, b = [max(0, min(255, int(x))) for x in rest.split(',')]
            set_rgb(r, g, b)
        except:
            pass
    elif c == 'A':
        try:
            if rest in SOUND_NAMES:
                audio.play(getattr(Sound, rest), wait=False)
        except:
            pass
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
        menu_mode = False
        print('<L preset %s>' % rest)
    elif c == 'R':
        try:
            radio.send(rest)
        except:
            pass
    elif c == 'Q':
        preset = None
        state = {}
        display.clear()
        # L0-MENU-ONLY:BEGIN
        menu_mode = True
        show_menu()
        # L0-MENU-ONLY:END

# --- Per-preset device-side behaviour ---
def tick():
    global preset, state
    # L0-MENU-ONLY:BEGIN
    if menu_mode:
        return
    # L0-MENU-ONLY:END

    n = running_time()

    if preset == 'heartbeat':
        if n - state.get('t', 0) > 600:
            state['t'] = n
            state['b'] = not state.get('b', False)
            display.show(BIG_HEART if state['b'] else SMALL_HEART)

    elif preset == 'tap-wake':
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

    elif preset == 'hide-peek':
        if n - state.get('t', 0) > 200:
            state['t'] = n
            l = display.read_light_level()
            display.show(FACES['happy'] if l > light_thresh else FACES['sad'])

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

    elif preset == 'sky-radar':
        if n - state.get('t', 0) > 50:
            state['t'] = n
            angle = (state.get('angle', 0) + 4) % 360
            state['angle'] = angle
            display.show(ARROWS[int(angle / 45) % 8])

    elif preset == 'iss-orbit':
        if n - state.get('t', 0) > 80:
            state['t'] = n
            angle = (state.get('angle', 0) + 2) % 360
            state['angle'] = angle
            # LED matrix: star blinking
            if (angle // 45) % 2 == 0:
                display.show(Image("00900:09090:99999:09090:00900"))
            else:
                display.show(Image("00000:00900:09990:00900:00000"))

    elif preset == 'breathe':
        if n - state.get('t', 0) > 80:
            state['t'] = n
            phase = state.get('p', 0)
            state['p'] = (phase + 1) % 32
            b = int(4.5 + 4.5 * math.sin(phase * math.pi / 16))
            inner = max(1, b)
            outer = max(0, b - 4)
            mid = (inner + outer) // 2
            display.show(Image(
                "{o}{o}{o}{o}{o}:{o}{m}{m}{m}{o}:{o}{m}{i}{m}{o}:{o}{m}{m}{m}{o}:{o}{o}{o}{o}{o}"
                .format(o=outer, m=mid, i=inner)
            ))

    elif preset == 'sunrise':
        if n - state.get('t', 0) > 250:
            state['t'] = n
            try:
                l = display.read_light_level()
            except:
                l = 0
            lit = max(0, min(5, int(l / 50)))
            rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
            display.show(Image(":".join(rows)))

    elif preset == 'dice':
        if not state.get('rolled'):
            display.show(Image("09990:90009:00090:00900:00900"))
            state['rolled'] = True
        try:
            g = accelerometer.get_strength() / 1024.0
        except:
            g = 1.0
        if g > 1.6 and n - state.get('lastroll', 0) > 600:
            state['lastroll'] = n
            for _ in range(4):
                display.show(Image("99999:90009:90009:90009:99999"))
                sleep(40)
                display.show(Image("00000:09990:09090:09990:00000"))
                sleep(40)
            try:
                from random import randint
                face = randint(1, 6)
            except:
                face = ((n // 7) % 6) + 1
            state['face'] = face
            DICE = (
                "00000:00000:00900:00000:00000",
                "00000:09000:00000:00090:00000",
                "90000:00000:00900:00000:00009",
                "00000:90009:00000:90009:00000",
                "00000:90009:00900:90009:00000",
                "00000:90909:00000:90909:00000",
            )
            display.show(Image(DICE[face - 1]))
            music.pitch(440 + face * 60, 80, wait=False)

    elif preset == 'mood-badge':
        MOODS = (FACES['happy'], FACES['sad'], FACES['wink'], FACES['sleep'], FACES['dizzy'])
        idx = state.get('m', 0)
        if n - state.get('t', 0) > 200:
            state['t'] = n
            display.show(MOODS[idx])
            set_rgb(*MOOD_RGB[MOOD_NAMES[idx]])

    elif preset == 'bubble':
        if n - state.get('t', 0) > 80:
            state['t'] = n
            try:
                ax = accelerometer.get_x()
                ay = accelerometer.get_y()
            except:
                ax = 0; ay = 0
            bx = 2 - max(-2, min(2, int(ax / 350)))
            by = 2 - max(-2, min(2, int(ay / 350)))
            grid = [['0'] * 5 for _ in range(5)]
            grid[by][bx] = '9'
            display.show(Image(":".join("".join(r) for r in grid)))

    elif preset == 'firefly':
        if n - state.get('t', 0) > 120:
            state['t'] = n
            try:
                ax = accelerometer.get_x() // 350
                ay = accelerometer.get_y() // 350
            except:
                ax = 0; ay = 0
            x = state.get('x', 2) + max(-1, min(1, ax))
            y = state.get('y', 2) + max(-1, min(1, ay))
            x = max(0, min(4, x))
            y = max(0, min(4, y))
            state['x'] = x; state['y'] = y
            grid = [['0'] * 5 for _ in range(5)]
            grid[y][x] = '9'
            for dy in (-1, 1):
                ny = y + dy
                if 0 <= ny <= 4:
                    grid[ny][x] = max(grid[ny][x], '3')
            for dx in (-1, 1):
                nx = x + dx
                if 0 <= nx <= 4:
                    grid[y][nx] = max(grid[y][nx], '3')
            display.show(Image(":".join("".join(r) for r in grid)))

    elif preset == 'warm-cold':
        if n - state.get('t', 0) > 600:
            state['t'] = n
            try:
                tc = temperature()
            except:
                tc = 20
            lit = max(0, min(5, (tc - 18) // 3 + 1))
            rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
            display.show(Image(":".join(rows)))

    elif preset == 'touch-logo':
        if n - state.get('t', 0) > 1000:
            state['t'] = n
            display.show(FACES['duck'])

    elif preset == 'ambient-temp':
        if n - state.get('t', 0) > 600:
            state['t'] = n
            c = read_ambient_c()
            if c is None:
                c = 20
            lit = max(0, min(5, (c - 18) // 3 + 1))
            rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
            display.show(Image(":".join(rows)))


# --- Boot ---
radio.config(channel=42, group=42, length=128)
radio.on()

try:
    np = neopixel.NeoPixel(RGB_PIN, RGB_COUNT)
except:
    np = None

display.show(FACES['duck'])
sleep(1000)

# L0-MENU-ONLY:BEGIN
menu_mode = True
show_menu()
# L0-MENU-ONLY:END
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
        # L0-MENU-ONLY:BEGIN
        if menu_mode:
            menu_idx = (menu_idx - 1) % len(PRESET_LIST)
            show_menu()
        # L0-MENU-ONLY:END
        if not menu_mode:
            print('<B A down>')
            if preset == 'mood-badge':
                state['m'] = (state.get('m', 0) - 1) % 5
            elif preset == 'tap-wake':
                display.show(Image.HAPPY)
                sleep(150)
                display.show(Image.ASLEEP)

    if button_b.was_pressed():
        # L0-MENU-ONLY:BEGIN
        if menu_mode:
            menu_idx = (menu_idx + 1) % len(PRESET_LIST)
            show_menu()
        # L0-MENU-ONLY:END
        if not menu_mode:
            print('<B B down>')
            if preset == 'mood-badge':
                state['m'] = (state.get('m', 0) + 1) % 5

    # 5. Logo touch — short tap = game action; long press ≥1.5s = menu (L0 only)
    try:
        touched = pin_logo.is_touched()
        if touched:
            if logo_hold_start == 0:
                logo_hold_start = running_time()
            # L0-MENU-ONLY:BEGIN
            elif not logo_held and running_time() - logo_hold_start >= 1500:
                logo_held = True
                try:
                    menu_idx = PRESET_LIST.index(preset)
                except (ValueError, TypeError):
                    pass
                menu_mode = True
                preset = None
                state = {}
                show_menu()
            # L0-MENU-ONLY:END
        else:
            if logo_hold_start > 0 and not logo_held:
                # L0-MENU-ONLY:BEGIN
                if menu_mode:
                    menu_mode = False
                    preset = PRESET_LIST[menu_idx]
                    state = {}
                    print('<L preset %s>' % preset)
                # L0-MENU-ONLY:END
                if not menu_mode:
                    if preset == 'touch-logo':
                        music.pitch(1100, 70, wait=True)
                        music.pitch(750, 90, wait=True)
                        music.pitch(450, 120, wait=True)
                        display.show(FACES['happy'])
                        sleep(250)
                        display.show(FACES['duck'])
                    else:
                        print('<T down>')
            logo_hold_start = 0
            logo_held = False
    except:
        pass

    # 6. Radio receive
    msg = radio.receive()
    if msg is not None:
        print('<R %s>' % msg)

    sleep(15)
