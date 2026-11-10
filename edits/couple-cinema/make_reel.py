#!/usr/bin/env python3
"""Couple "on the big screen" reel: their photos play on a cinema screen in a dark theatre.

Same format as the reference reel the user sent (screen in a dark hall, handwritten caption on top, a camera
pull-back, a dark ending), built from scratch: no footage from the reference, only its audio track (the user's
choice). Every frame is drawn here with Pillow/numpy and piped to ffmpeg.
Run from the repo root:  python3 edits/couple-cinema/make_reel.py
Inputs: input/couple/IMG_*.jpg, input/couple/reference.mp4 (audio)   Output: output/couple_cinema_reel.mp4
"""
import os, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

FPS, W, H = 30, 1080, 1920
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = "input/couple"
AUDIO = "input/couple/reference.mp4"
OUT = "output/couple_cinema_reel.mp4"
END = 13.77                        # length of the audio track
SCREEN = (0, 712, 1080, 1320)      # x0, y0, x1, y1: 16:9, full width, like the reference
SW, SH = SCREEN[2] - SCREEN[0], SCREEN[3] - SCREEN[1]
CAPTION = "BETTER TOGETHER"
CAP_IN, CAP_OUT = 0.5, 6.6

# (start, end, photo, face centre as (x, y) fractions of the photo, zoom from -> to)
SHOTS = [
    (0.00, 2.30, "IMG_4474.jpg", (0.51, 0.54), (1.00, 0.88)),
    (2.30, 4.67, "IMG_1938.jpg", (0.53, 0.43), (1.00, 0.88)),
    (4.67, 7.36, "IMG_6398.jpg", (0.60, 0.36), (1.00, 0.90)),
    (7.36, 12.00, "IMG_7873.jpg", (0.47, 0.42), (1.00, 0.86)),
    (12.00, END, "IMG_6398.jpg", (0.60, 0.36), (0.92, 0.84)),   # on the final hit
]
PULL = (9.66, 11.50, 0.46)         # camera pulls back: start, end, final scale
HIT = 12.00                        # projector flash on the music's last hit
FADE = (12.90, END)                # fade to black


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def load(name):
    return ImageOps.exif_transpose(Image.open(f"{SRC}/{name}")).convert("RGB")


PHOTOS = {s[2]: load(s[2]) for s in SHOTS}


def screen_image(t):
    """The picture on the screen at time t: a 16:9 crop around the faces with a slow zoom."""
    for t0, t1, name, (fx, fy), (z0, z1) in SHOTS:
        if t0 <= t < t1 or (t >= t1 and t1 == END):
            im = PHOTOS[name]
            pw, ph = im.size
            k = ease((t - t0) / (t1 - t0))
            z = z0 + (z1 - z0) * k
            cw = pw * z
            ch = cw * 9 / 16
            if ch > ph:
                ch, cw = ph, ph * 16 / 9
            cx = min(max(fx * pw, cw / 2), pw - cw / 2)
            cy = min(max(fy * ph + ch * 0.12, ch / 2), ph - ch / 2)  # a little below the faces: heads + shoulders
            box = (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)
            return im.resize((SW, SH), Image.LANCZOS, box=box, reducing_gap=3.0)


def audience():
    """Rows of head-and-shoulder silhouettes along the bottom, as an RGBA layer, plus a rim-light mask."""
    rng = np.random.default_rng(7)
    sil = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(sil)
    for row, (y, scale) in enumerate([(1500, 0.70), (1640, 0.85), (1800, 1.05)]):
        x = -40 + rng.uniform(0, 60)
        while x < W + 80:
            r = 46 * scale * rng.uniform(0.9, 1.1)
            hx, hy = x + rng.uniform(-8, 8), y + rng.uniform(-10, 10)
            d.ellipse((hx - r * 0.8, hy - r, hx + r * 0.8, hy + r), fill=255)                       # head
            d.rounded_rectangle((hx - r * 2.0, hy + r * 0.7, hx + r * 2.0, H + 50), radius=int(r * 1.2), fill=255)  # shoulders
            x += r * 3.3 * rng.uniform(0.9, 1.15)
    s = np.asarray(sil, np.float32) / 255
    blur = np.asarray(sil.filter(ImageFilter.GaussianBlur(5)), np.float32) / 255
    rim = s * np.clip((1 - blur) * 2, 0, 1)            # only a thin band just inside each outline
    return s, rim


SIL, RIM = audience()
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
scx, scy = (SCREEN[0] + SCREEN[2]) / 2, (SCREEN[1] + SCREEN[3]) / 2
dist = np.sqrt(((xx - scx) / 900) ** 2 + ((yy - scy) / 700) ** 2)
SPILL = np.clip(1.0 - dist, 0, 1) ** 1.8 * 0.55            # how much screen light reaches each pixel
VIGNETTE = np.clip(1.15 - 0.55 * np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H / 2) / H) ** 2) * 2, 0, 1)[..., None]

FONT = ImageFont.truetype(f"{HERE}/fonts/PermanentMarker.ttf", 66)
EMOJI = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", 109)


def caption_layer():
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    tb = d.textbbox((0, 0), CAPTION, font=FONT)
    heart = Image.new("RGBA", (140, 140), (0, 0, 0, 0))
    ImageDraw.Draw(heart).text((0, 0), "❤️", font=EMOJI, embedded_color=True)
    heart = heart.crop(heart.getbbox()).resize((60, 56), Image.LANCZOS)
    total = tb[2] - tb[0] + 18 + heart.width
    x0, y0 = (W - total) // 2, 560
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).text((x0 - tb[0], y0 - tb[1]), CAPTION, font=FONT, fill=(0, 0, 0, 200))
    layer.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(5)))
    d.text((x0 - tb[0], y0 - tb[1]), CAPTION, font=FONT, fill=(245, 242, 235, 255))
    layer.alpha_composite(heart, (x0 + tb[2] - tb[0] + 18, y0 + (tb[3] - tb[1] - heart.height) // 2 + 2))
    return np.asarray(layer, np.float32) / 255


CAP = caption_layer()


def frame(t, rng):
    pic = screen_image(t)
    flash = max(0.0, 1 - (t - HIT) / 0.35) if t >= HIT else 0.0
    flicker = 1 + rng.normal(0, 0.012)
    scr = np.asarray(pic, np.float32) / 255 * flicker
    scr = np.clip(scr + flash * 0.55, 0, 1)
    # light the room with the screen's average colour (blurred so it reads as spill, not a reflection)
    glow = np.asarray(pic.resize((8, 5), Image.BILINEAR).resize((W, H), Image.BILINEAR), np.float32) / 255
    room = np.full((H, W, 3), (0.022, 0.022, 0.03), np.float32) + glow * SPILL[..., None] * (1 + flash)
    room *= 1 - SIL[..., None] * 0.97                               # silhouettes block the spill
    room += RIM[..., None] * glow * 0.35 * (1 + flash)              # faint rim light on heads
    img = room
    img[SCREEN[1]:SCREEN[3], SCREEN[0]:SCREEN[2]] = scr
    img *= VIGNETTE
    if CAP_IN - 0.3 <= t <= CAP_OUT + 0.3:                         # caption fades in and out
        a = CAP[..., 3:] * ease((t - CAP_IN + 0.3) / 0.3) * (1 - ease((t - CAP_OUT) / 0.3))
        img = img * (1 - a) + CAP[..., :3] * a
    # camera pull-back about the screen centre
    s = 1 - (1 - PULL[2]) * ease((t - PULL[0]) / (PULL[1] - PULL[0]))
    if s < 0.999:
        im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).resize((round(W * s), round(H * s)), Image.LANCZOS)
        canvas = Image.new("RGB", (W, H), (3, 3, 4))
        canvas.paste(im, (round(scx - scx * s), round(scy - scy * s)))
        img = np.asarray(canvas, np.float32) / 255
    img = img * (1 - ease((t - FADE[0]) / (FADE[1] - FADE[0])))
    img += rng.normal(0, 0.012, (H // 2, W // 2, 1)).repeat(2, 0).repeat(2, 1)   # film grain
    return (np.clip(img, 0, 1) * 255).astype(np.uint8)


def main():
    os.makedirs("output", exist_ok=True)
    n = round(END * FPS)
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(FPS), "-i", "-", "-i", AUDIO, "-map", "0:v", "-map", "1:a",
                           "-af", f"atrim=0:{END},afade=t=out:st={END - 0.4}:d=0.4,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000",
                           "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p",
                           "-c:a", "aac", "-b:a", "160k", "-t", str(END), "-movflags", "+faststart", OUT],
                          stdin=subprocess.PIPE)
    rng = np.random.default_rng(1)
    for i in range(n):
        ff.stdin.write(frame(i / FPS, rng).tobytes())
    ff.stdin.close()
    ff.wait()
    print("wrote", OUT)


if __name__ == "__main__":
    main()
