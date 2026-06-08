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
#   O:line1|line2     show text on Grove OLED (if connected)
#   O:clear           clear Grove OLED
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
from ssd1327 import OLED

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

menu_mode = False    # True while navigating the on-board menu
menu_idx = 0        # index into PRESET_LIST

# Long-press logo tracking
logo_hold_start = 0
logo_held = False

# Grove OLED 1.12" (SSD1327, 96x96) — None if not connected
oled = None

# --- OLED helpers ---
def _draw_duck(o, x, y, c=15):
    """Draw full duck mascot. Fits in ~72×88 px; x,y = top-left."""
    o.fill_circle(x+36, y+60, 24, c - 2)    # body
    o.fill_circle(x+52, y+28, 18, c)         # head
    o.fill_rect(x+66, y+30, 14, 8, c - 5)   # bill
    o.fill_circle(x+57, y+22, 5, 1)          # eye socket
    o.fill_circle(x+57, y+22, 3, 0)          # pupil
    o.pixel(x+58, y+21, 14)                  # eye shine
    o.fill_circle(x+28, y+58, 14, c - 4)    # wing

def _draw_duck_small(o, x, y, c=12):
    """Tiny duck that fits in ~28×32 px; x,y = top-left."""
    o.fill_circle(x+10, y+22, 8, c - 2)     # body
    o.fill_circle(x+18, y+10, 7, c)          # head
    o.fill_rect(x+23, y+11, 5, 3, c - 4)    # bill
    o.pixel(x+19, y+8, 0)                    # eye

def _draw_heart(o, cx, cy, r, c):
    """Draw filled heart centred at cx,cy with approximate radius r."""
    lobe_r = r // 2
    o.fill_circle(cx - lobe_r, cy - lobe_r // 2, lobe_r, c)
    o.fill_circle(cx + lobe_r, cy - lobe_r // 2, lobe_r, c)
    # Triangle base
    half = r
    for dy in range(half):
        w = half * 2 - dy * 2
        if w > 0:
            o.hline(cx - w // 2, cy + dy, w, c)

def _boot_anim(o):
    """~1.5s boot sequence shown on OLED while LED matrix shows duck face."""
    # Frame 1 — egg
    o.fill(0)
    o.fill_circle(48, 56, 30, 7)    # egg body (gray)
    o.circle(48, 56, 30, 11)        # egg outline (brighter)
    o.text('waking up...', 12, 82, 6)
    o.show()
    sleep(320)

    # Frame 2 — cracks appear
    o.line(38, 34, 44, 46, 15)
    o.line(50, 32, 45, 46, 15)
    o.line(44, 46, 52, 44, 15)
    o.show()
    sleep(280)

    # Frame 3 — head pops out of egg top
    o.fill_rect(22, 0, 52, 38, 0)   # erase upper egg
    o.fill_circle(48, 28, 16, 15)   # head (white)
    o.fill_rect(62, 30, 10, 6, 10)  # bill
    o.fill_circle(52, 23, 4, 1)     # eye
    o.fill_circle(52, 23, 2, 0)     # pupil
    o.pixel(53, 22, 14)             # shine
    o.show()
    sleep(340)

    # Frame 4 — full duck + greeting
    o.fill(0)
    _draw_duck(o, 10, 0)
    o.text('Hello Ducky!', 8, 87, 15)
    o.show()
    sleep(380)

def _oled_show_menu(o):
    o.fill(0)
    name = PRESET_LIST[menu_idx]
    parts = name.split('-')
    o.big_text(parts[0], 2, 8, 15)
    if len(parts) > 1:
        o.big_text(parts[1], 2, 30, 10)
    _draw_duck_small(o, 68, 2, 10)
    o.text('A<   >B', 22, 84, 6)
    o.show()

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
    if oled:
        _oled_show_menu(oled)

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
        menu_mode = False
        print('<L preset %s>' % rest)
    elif c == 'R':
        try:
            radio.send(rest)
        except:
            pass
    elif c == 'O':
        if oled:
            try:
                if rest == 'clear':
                    oled.fill(0)
                    oled.show()
                else:
                    lines = rest.split('|')
                    oled.fill(0)
                    _draw_duck_small(oled, 2, 2, 10)
                    for i, ln in enumerate(lines[:4]):
                        oled.text(ln, 4, 30 + i * 16, 15)
                    oled.show()
            except:
                pass
    elif c == 'Q':
        preset = None
        state = {}
        menu_mode = True
        show_menu()

# --- Per-preset device-side behaviour ---
def tick():
    global preset, state
    if menu_mode:
        return

    n = running_time()

    if preset == 'heartbeat':
        if n - state.get('t', 0) > 600:
            state['t'] = n
            state['b'] = not state.get('b', False)
            display.show(BIG_HEART if state['b'] else SMALL_HEART)
        if oled and n - state.get('ot', 0) > 600:
            state['ot'] = n
            big = state.get('b', False)
            oled.fill(0)
            if big:
                _draw_heart(oled, 48, 38, 28, 15)
                oled.text('lub dub', 22, 78, 10)
            else:
                _draw_heart(oled, 48, 42, 20, 14)
                oled.text('lub dub', 22, 78, 5)
            oled.show()

    elif preset == 'tap-wake':
        if n - state.get('t', 0) > 1500:
            state['t'] = n
            display.show(Image.ASLEEP)
        if oled and n - state.get('ot', 0) > 350:
            state['ot'] = n
            state['oz'] = (state.get('oz', 0) + 3) % 32
            oz = state['oz']
            oled.fill(0)
            _draw_duck_small(oled, 6, 6, 10)
            # Animated Z's drifting upward
            oled.big_text('Z', 52, 66 - oz, 15)
            oled.big_text('z', 66, 50 - oz, 10)
            oled.text('z', 78, 38 - oz, 7)
            oled.text('Sleeping...', 14, 82, 7)
            oled.show()

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
        if oled and n - state.get('ot', 0) > 150:
            state['ot'] = n
            oled.fill(0)
            if n - state.get('shaken', 0) < 700:
                # Dizzy rings
                oled.circle(48, 42, 10, 15)
                oled.circle(48, 42, 18, 12)
                oled.circle(48, 42, 26, 8)
                oled.circle(48, 42, 34, 5)
                oled.big_text('WHOA!', 4, 76, 15)
            else:
                # Idle: shake prompt + motion lines
                oled.big_text('SHAKE', 4, 26, 15)
                oled.big_text('ME!', 22, 50, 12)
                for i in range(3):
                    oled.hline(2, 10 + i * 9, 10, 7)
                    oled.hline(84, 10 + i * 9, 10, 7)
            oled.show()

    elif preset == 'cold-hands':
        if n - state.get('t', 0) > 300:
            state['t'] = n
            display.show(bargraph(temperature() - 18, 14))

    elif preset == 'hide-peek':
        if n - state.get('t', 0) > 200:
            state['t'] = n
            l = display.read_light_level()
            display.show(FACES['happy'] if l > light_thresh else FACES['sad'])
        if oled and n - state.get('ot', 0) > 200:
            state['ot'] = n
            l = display.read_light_level()
            oled.fill(0)
            if l > light_thresh:
                # Light: happy duck face on OLED
                oled.fill_circle(48, 40, 32, 13)    # face
                oled.fill_circle(35, 33, 6, 1)       # left eye
                oled.fill_circle(35, 33, 3, 0)
                oled.pixel(36, 32, 14)
                oled.fill_circle(61, 33, 6, 1)       # right eye
                oled.fill_circle(61, 33, 3, 0)
                oled.pixel(62, 32, 14)
                # Smile arc
                for i in range(-12, 13):
                    yy = 56 + (i * i) // 20
                    oled.pixel(48 + i, yy, 1)
                oled.text('Found me!', 18, 78, 15)
            else:
                # Dark: glowing eyes peering
                oled.fill_circle(30, 50, 12, 4)
                oled.fill_circle(66, 50, 12, 4)
                oled.fill_circle(30, 52, 6, 0)
                oled.fill_circle(66, 52, 6, 0)
                oled.fill_circle(31, 49, 2, 12)
                oled.fill_circle(67, 49, 2, 12)
                oled.text('hiding...', 22, 72, 5)
            oled.show()

    elif preset == 'whisper':
        if n - state.get('t', 0) > 80:
            state['t'] = n
            try:
                v = microphone.sound_level()
            except:
                v = 0
            display.show(bargraph(v, 255))
        if oled and n - state.get('ot', 0) > 80:
            state['ot'] = n
            try:
                v = microphone.sound_level()
            except:
                v = 0
            oled.fill(0)
            oled.text('Listening...', 8, 4, 9)
            # 10 animated waveform bars
            for bar in range(10):
                h = max(4, int((v / 255.0) * 64) + (bar % 3) * 5 - 4)
                bx = bar * 9 + 3
                by = 75 - h
                br = 15 - (abs(bar - 5)) * 2
                oled.fill_rect(bx, by, 7, h, max(6, br))
            if v > 180:
                oled.big_text('LOUD!', 14, 78, 15)
            oled.show()

    elif preset == 'compass-quest':
        if n - state.get('t', 0) > 300:
            state['t'] = n
            try:
                h = compass.heading()
            except:
                h = 0
            display.show(ARROWS[int(((h + 22) % 360) / 45)])
        if oled and n - state.get('ot', 0) > 300:
            state['ot'] = n
            try:
                h = compass.heading()
            except:
                h = 0
            idx = int(((h + 22) % 360) / 45)
            dirs = ('N','NE','E','SE','S','SW','W','NW')
            cx, cy = 48, 44   # centre, shifted down to leave room for N label
            oled.fill(0)
            oled.circle(cx, cy, 30, 5)    # compass ring
            # 8 spokes (24px; _CV precomputed)
            for i in range(8):
                dx, dy = _CV[i]
                br = 15 if i == idx else (10 if i % 2 == 0 else 5)
                oled.line(cx, cy, cx + dx, cy + dy, br)
            oled.fill_circle(cx, cy, 3, 15)   # centre dot
            # Cardinal labels outside the ring (30+4=34px from centre)
            oled.text('N', cx - 3, cy - 40, 11)   # y = 44-40 = 4
            oled.text('S', cx - 3, cy + 32, 11)   # y = 44+32 = 76
            oled.text('E', cx + 32, cy - 3, 11)   # x = 48+32 = 80 (fits "E")
            oled.text('W', cx - 38, cy - 3, 11)   # x = 48-38 = 10
            # Active direction name in big_text at very bottom
            d = dirs[idx]
            oled.big_text(d, 48 - len(d) * 6, 82, 15)
            oled.show()

    elif preset == 'wave-across':
        pass   # button + radio handlers below do the work

    elif preset == 'touch-logo':
        if n - state.get('t', 0) > 1000:
            state['t'] = n
            display.show(FACES['duck'])
        if oled and n - state.get('ot', 0) > 180:
            state['ot'] = n
            oled.fill(0)
            if n - state.get('oq', 0) < 700:
                # QUACK animation: sound waves
                oled.big_text('QUACK!', 2, 34, 15)
                for r in range(8, 38, 9):
                    oled.circle(20, 48, r, max(3, 15 - r // 2))
            else:
                # Idle: duck mascot + prompt
                _draw_duck(oled, 10, 2)
                oled.text('Tap logo!', 20, 82, 9)
            oled.show()


# --- Boot ---
radio.config(channel=42, group=42)
radio.on()

# Probe for Grove OLED 1.12" (also bumps I2C to 400 kHz)
oled = OLED.probe()

display.show(FACES['duck'])
if oled:
    _boot_anim(oled)
else:
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
                if oled:
                    try:
                        oled.fill(0)
                        oled.big_text('WAKE', 10, 26, 15)
                        oled.big_text('UP!', 28, 50, 15)
                        oled.show()
                    except:
                        pass
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
                    if oled:
                        try:
                            state['oq'] = running_time()
                        except:
                            pass
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
