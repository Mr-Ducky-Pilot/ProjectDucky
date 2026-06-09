# Grove OLED 1.12" driver — SSD1327, 96x96px, 4-bit grayscale
# Connect: SDA=pin20, SCL=pin19
from microbit import i2c

_W=96;_H=96;_CS=8;_CE=55;_RS=0;_RE=95

_FONT=(
b'\x00\x00\x00\x00\x00'b'\x00\x00\x5f\x00\x00'b'\x00\x07\x00\x07\x00'
b'\x14\x7f\x14\x7f\x14'b'\x24\x2a\x7f\x2a\x12'b'\x23\x13\x08\x64\x62'
b'\x36\x49\x55\x22\x50'b'\x00\x05\x03\x00\x00'b'\x00\x1c\x22\x41\x00'
b'\x00\x41\x22\x1c\x00'b'\x14\x08\x3e\x08\x14'b'\x08\x08\x3e\x08\x08'
b'\x00\x50\x30\x00\x00'b'\x08\x08\x08\x08\x08'b'\x00\x60\x60\x00\x00'
b'\x20\x10\x08\x04\x02'b'\x3e\x51\x49\x45\x3e'b'\x00\x42\x7f\x40\x00'
b'\x42\x61\x51\x49\x46'b'\x21\x41\x45\x4b\x31'b'\x18\x14\x12\x7f\x10'
b'\x27\x45\x45\x45\x39'b'\x3c\x4a\x49\x49\x30'b'\x01\x71\x09\x05\x03'
b'\x36\x49\x49\x49\x36'b'\x06\x49\x49\x29\x1e'b'\x00\x36\x36\x00\x00'
b'\x00\x56\x36\x00\x00'b'\x08\x14\x22\x41\x00'b'\x14\x14\x14\x14\x14'
b'\x00\x41\x22\x14\x08'b'\x02\x01\x51\x09\x06'b'\x32\x49\x79\x41\x3e'
b'\x7e\x11\x11\x11\x7e'b'\x7f\x49\x49\x49\x36'b'\x3e\x41\x41\x41\x22'
b'\x7f\x41\x41\x22\x1c'b'\x7f\x49\x49\x49\x41'b'\x7f\x09\x09\x09\x01'
b'\x3e\x41\x49\x49\x7a'b'\x7f\x08\x08\x08\x7f'b'\x00\x41\x7f\x41\x00'
b'\x20\x40\x41\x3f\x01'b'\x7f\x08\x14\x22\x41'b'\x7f\x40\x40\x40\x40'
b'\x7f\x02\x0c\x02\x7f'b'\x7f\x04\x08\x10\x7f'b'\x3e\x41\x41\x41\x3e'
b'\x7f\x09\x09\x09\x06'b'\x3e\x41\x51\x21\x5e'b'\x7f\x09\x19\x29\x46'
b'\x46\x49\x49\x49\x31'b'\x01\x01\x7f\x01\x01'b'\x3f\x40\x40\x40\x3f'
b'\x1f\x20\x40\x20\x1f'b'\x3f\x40\x38\x40\x3f'b'\x63\x14\x08\x14\x63'
b'\x07\x08\x70\x08\x07'b'\x61\x51\x49\x45\x43'b'\x00\x7f\x41\x41\x00'
b'\x02\x04\x08\x10\x20'b'\x00\x41\x41\x7f\x00'b'\x04\x02\x01\x02\x04'
b'\x40\x40\x40\x40\x40'b'\x00\x01\x02\x04\x00'b'\x20\x54\x54\x54\x78'
b'\x7f\x48\x44\x44\x38'b'\x38\x44\x44\x44\x20'b'\x38\x44\x44\x48\x7f'
b'\x38\x54\x54\x54\x18'b'\x08\x7e\x09\x01\x02'b'\x0c\x52\x52\x52\x3e'
b'\x7f\x08\x04\x04\x78'b'\x00\x44\x7d\x40\x00'b'\x20\x40\x44\x3d\x00'
b'\x7f\x10\x28\x44\x00'b'\x00\x41\x7f\x40\x00'b'\x7c\x04\x18\x04\x78'
b'\x7c\x08\x04\x04\x78'b'\x38\x44\x44\x44\x38'b'\x7c\x14\x14\x14\x08'
b'\x08\x14\x14\x18\x7c'b'\x7c\x08\x04\x04\x08'b'\x48\x54\x54\x54\x20'
b'\x04\x3f\x44\x40\x20'b'\x3c\x40\x40\x20\x7c'b'\x1c\x20\x40\x20\x1c'
b'\x3c\x40\x30\x40\x3c'b'\x44\x28\x10\x28\x44'b'\x0c\x50\x50\x50\x3c'
b'\x44\x64\x54\x4c\x44'b'\x00\x08\x36\x41\x00'b'\x00\x00\x7f\x00\x00'
b'\x00\x41\x36\x08\x00'b'\x10\x08\x08\x10\x08'
)

_CHUNK=254

class OLED:
    def __init__(self,addr=0x3C):
        self.addr=addr
        self.buf=bytearray(_W*_H//2)
        self._cb=bytearray([0x00,0x00])
        self._db=bytearray(_CHUNK+1)
        self._db[0]=0x40
        self._init()

    def _cmd(self,*cmds):
        for c in cmds:
            self._cb[1]=c
            i2c.write(self.addr,self._cb)

    def _flush(self):
        n=len(self.buf);pos=0
        while pos<n:
            sz=min(_CHUNK,n-pos)
            self._db[1:sz+1]=self.buf[pos:pos+sz]
            i2c.write(self.addr,memoryview(self._db)[:sz+1])
            pos+=sz

    def _init(self):
        for c in(0xFD,0x12,0xAE,0xA1,0x00,0xA2,0x20,0xA0,0x51,0xA8,0x5F,
                 0xAB,0x01,0xB1,0x51,0xB3,0x01,0xBC,0x08,0xBE,0x07,0xB6,0x01,
                 0xD5,0x62,0xB9,0x81,0x7F,0xA4,0x2E,0xAF):
            self._cmd(c)

    def show(self):
        self._cmd(0x15,_CS,_CE)
        self._cmd(0x75,_RS,_RE)
        self._flush()

    def fill(self,c):
        v=((c&0xF)<<4)|(c&0xF)
        for i in range(len(self.buf)):self.buf[i]=v

    def pixel(self,x,y,c):
        if 0<=x<_W and 0<=y<_H:
            i=y*(_W>>1)+(x>>1)
            if x&1:self.buf[i]=(self.buf[i]&0xF0)|(c&0x0F)
            else:self.buf[i]=(self.buf[i]&0x0F)|((c&0x0F)<<4)

    def hline(self,x,y,w,c):
        for dx in range(max(0,-x),min(w,_W-x)):self.pixel(x+dx,y,c)

    def vline(self,x,y,h,c):
        for dy in range(max(0,-y),min(h,_H-y)):self.pixel(x,y+dy,c)

    def fill_rect(self,x,y,w,h,c):
        for dy in range(h):self.hline(x,y+dy,w,c)

    def rect(self,x,y,w,h,c):
        self.hline(x,y,w,c);self.hline(x,y+h-1,w,c)
        self.vline(x,y,h,c);self.vline(x+w-1,y,h,c)

    def line(self,x0,y0,x1,y1,c):
        dx=abs(x1-x0);dy=abs(y1-y0)
        sx=1 if x0<x1 else -1;sy=1 if y0<y1 else -1;err=dx-dy
        while True:
            self.pixel(x0,y0,c)
            if x0==x1 and y0==y1:break
            e2=err*2
            if e2>-dy:err-=dy;x0+=sx
            if e2<dx:err+=dx;y0+=sy

    def circle(self,cx,cy,r,c):
        x,y,d=0,r,3-2*r
        while x<=y:
            for px,py in((cx+x,cy+y),(cx-x,cy+y),(cx+x,cy-y),(cx-x,cy-y),
                         (cx+y,cy+x),(cx-y,cy+x),(cx+y,cy-x),(cx-y,cy-x)):
                self.pixel(px,py,c)
            if d<0:d+=4*x+6
            else:d+=4*(x-y)+10;y-=1
            x+=1

    def fill_circle(self,cx,cy,r,c):
        r2=r*r
        for dy in range(-r,r+1):
            dx=int((r2-dy*dy)**0.5)
            self.hline(cx-dx,cy+dy,dx*2+1,c)

    def text(self,s,x,y,c=15):
        for ch in s:
            o=ord(ch)
            if 32<=o<=126:
                b=(o-32)*5
                for col in range(5):
                    bits=_FONT[b+col]
                    for row in range(7):
                        if bits&(1<<row):self.pixel(x+col,y+row,c)
            x+=6

    def big_text(self,s,x,y,c=15):
        for ch in s:
            o=ord(ch)
            if 32<=o<=126:
                b=(o-32)*5
                for col in range(5):
                    bits=_FONT[b+col]
                    for row in range(7):
                        if bits&(1<<row):self.fill_rect(x+col*2,y+row*2,2,2,c)
            x+=12

class SH1107(OLED):
    def __init__(self,addr=0x3C):
        self.addr=addr
        self.buf=bytearray(128*128//8)
        self._cb=bytearray([0x00,0x00])
        self._db=bytearray(129)
        self._db[0]=0x40
        self._sh_init()

    def _sh_init(self):
        for c in(0xAE,0xA8,0x7F,0xD3,0x60,0xDC,0x00,0xA0,0xC8,0xA6,
                 0xD5,0x51,0xD9,0x22,0xDA,0x12,0xDB,0x35,0x21,
                 0x81,0x6F,0xAD,0x8A,0xA4,0xAF):
            self._cmd(c)

    def pixel(self,x,y,c):
        if 0<=x<128 and 0<=y<128:
            i=(y>>3)*128+x;b=1<<(y&7)
            if c>=8:self.buf[i]|=b
            else:self.buf[i]&=~b

    def fill(self,c):
        v=0xFF if c>=8 else 0x00
        for i in range(len(self.buf)):self.buf[i]=v

    def show(self):
        for pg in range(16):
            self._cmd(0xB0|pg,0x00,0x10)
            self._db[1:129]=self.buf[pg*128:(pg+1)*128]
            i2c.write(self.addr,memoryview(self._db)[:129])

def probe(freq=400000):
    try:
        i2c.init(freq=freq)
        if 0x3C not in i2c.scan():return None
        o=OLED(0x3C)
        o._cmd(0x15,_CS,_CS);o._cmd(0x75,0,0)
        i2c.write(0x3C,b'\x40\xAA')
        o._cmd(0x15,_CS,_CS);o._cmd(0x75,0,0)
        try:rb=i2c.read(0x3C,1)[0]
        except:rb=0
        if rb==0xAA:return o
        return SH1107(0x3C)
    except:pass
    return None
