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
import radio, music

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

# --- On-board menu ---
PRESET_LIST = (
    'heartbeat', 'tap-wake', 'shake', 'hide-peek',
    'whisper', 'touch-logo', 'compass-quest',
)
MENU_ICONS = {
    'heartbeat':     Image("09090:09090:09990:00900:00000"),   # heart outline
    'tap-wake':      Image("00000:99099:00000:09990:00000"),   # sleep face (ZZZ)
    'shake':         Image("90009:09090:00900:09090:90009"),   # X (dizzy)
    'hide-peek':     Image("00000:09090:00000:09990:00000"),   # plain face
    'whisper':       Image("00900:09990:99999:09990:00900"),   # sound burst
    'touch-logo':    Image("09900:99990:99999:09990:00000"),   # duck
    'compass-quest': Image("00900:09990:90909:00900:00900"),   # N arrow
}

# --- State ---
subs = set()
preset = None
state = {}
buf = b""
last_sample = 0
light_thresh = 50

menu_mode = False    # True while navigating the on-board menu
menu_idx = 0        # index into PRESET_LIST

# Long-press logo tracking (replaces old poll-count debounce)
logo_hold_start = 0  # running_time() when logo first touched; 0 = not touching
logo_held = False    # True once the ≥1.5s long-press has fired (prevents re-fire)

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
    except:
        pass
    return None

def bargraph(value, max_value):
    lit = max(0, min(5, int((value / max_value) * 5)))
    rows = ["99999" if (4 - r) < lit else "00000" for r in range(5)]
    return Image(":".join(rows))

def show_menu():
    display.show(MENU_ICONS.get(PRESET_LIST[menu_idx], FACES['duck']))

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
        menu_mode = False   # browser takes over; exit on-board menu
        print('<L preset %s>' % rest)
    elif c == 'R':
        try:
            radio.send(rest)
        except:
            pass
    elif c == 'Q':
        preset = None
        state = {}
        menu_mode = True    # return to on-board menu instead of blank screen
        show_menu()

# --- Per-preset device-side behaviour ---
def tick():
    global preset, state
    if menu_mode:
        return   # menu navigation is handled inline in the main loop

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

    elif preset == 'cold-hands':
        if n - state.get('t', 0) > 300:
            state['t'] = n
            display.show(bargraph(temperature() - 18, 14))

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

    elif preset == 'wave-across':
        pass   # button + radio handlers below do the work

    elif preset == 'touch-logo':
        if n - state.get('t', 0) > 1000:
            state['t'] = n
            display.show(FACES['duck'])


# --- Boot ---
radio.config(channel=42, group=42)
radio.on()
display.show(FACES['duck'])
sleep(1000)
menu_mode = True
show_menu()
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
        if menu_mode:
            menu_idx = (menu_idx - 1) % len(PRESET_LIST)
            show_menu()
        else:
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
        if menu_mode:
            menu_idx = (menu_idx + 1) % len(PRESET_LIST)
            show_menu()
        else:
            print('<B B down>')

    # 5. Logo touch — short tap = game action or menu select; long press ≥1.5s = menu
    try:
        touched = pin_logo.is_touched()
        if touched:
            if logo_hold_start == 0:
                logo_hold_start = running_time()
            elif not logo_held and running_time() - logo_hold_start >= 1500:
                logo_held = True
                # Long press: return to menu, snap to the current preset's icon
                try:
                    menu_idx = PRESET_LIST.index(preset)
                except (ValueError, TypeError):
                    pass
                menu_mode = True
                preset = None
                state = {}
                show_menu()
        else:
            if logo_hold_start > 0 and not logo_held:
                # Short tap released
                if menu_mode:
                    # Activate the highlighted preset
                    menu_mode = False
                    preset = PRESET_LIST[menu_idx]
                    state = {}
                    print('<L preset %s>' % preset)
                elif preset == 'touch-logo':
                    # Quack!
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
        if preset == 'wave-across' and msg == 'w':
            display.show(FACES['wave'])
            sleep(280)
            display.clear()

    sleep(15)
