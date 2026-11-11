#!/usr/bin/env python3
"""THE OTHER SIDE: complete character identity sheet for Aadhi, built from the FROZEN approved panels only.
Panels are cropped and scaled, never edited or regenerated; originals and panels in input/ are read-only.
Pages (3840x2160 each):
  p1  turnaround: front, three-quarter and profile views, full body front / three-quarter / back
  p2  emotional progression across the story, then costume and hair consistency at one head scale
  p3  identity reference comparisons: each panel beside its original photo, with ArcFace face match (support only)
Run from the repo root: python3 edits/the-other-side/character_sheet.py  ->  output/tos_character_sheet_p{1,2,3}.jpg
"""
import subprocess
import numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFont
from insightface.app import FaceAnalysis

PAN, REF = "input/tos_panels", "input/tos_refs"
ML_FONT = "edits/the-other-side/fonts/NotoSansMalayalam-Bold.ttf"
W, H, BG, INK, DIM, ACC = 3840, 2160, (26, 26, 28), (240, 240, 240), (165, 165, 170), (226, 170, 92)

# approved, frozen panels (user's list for the sheet)
P = {"A1": "A49AE7DA", "A2": "98B62E03", "A3": "97BE6DC9", "A4": "31F18098", "A5": "A64DD957",
     "A6_v3": "D9F5F235_A6_v3", "A7_v2": "A7_1s2_1QR9", "A8": "020E8ADD", "B1": "C70DA14A", "B5_v2": "B5_1RU_e6JO",
     "C5": "C735A6EB", "C6_v3": "C6_1Fdez8s5", "C7_v2": "C7_1eLJfMK6"}

app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
app.prepare(ctx_id=-1, det_size=(640, 640))
_cache = {}


def font(size, bold=False):
    path = subprocess.run(["fc-match", "-f", "%{file}", "Inter:bold" if bold else "Inter"], capture_output=True, text=True).stdout
    return ImageFont.truetype(path, size)


def load(key):
    """key: a panel id from P, or 'IMG_xxxx' for an original photo. Returns (image, face or None)."""
    if key not in _cache:
        path = f"{PAN}/{P[key]}.png" if key in P else f"{REF}/{key}.JPG"
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        s = 1600 / max(im.size)          # detect on a downscaled copy (fast), map the box back
        small = im.resize((round(im.width * s), round(im.height * s)))
        faces = app.get(np.asarray(small)[:, :, ::-1])
        f = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1])) if faces else None
        box = tuple(v / s for v in f.bbox) if f is not None else None
        _cache[key] = (im, box, f.normed_embedding if f is not None else None)
    return _cache[key]


def fit(key, tw, th):
    """Whole image, cropped to the tile's aspect around the centre."""
    im = load(key)[0]
    return ImageOps.fit(im, (tw, th), Image.LANCZOS, centering=(0.5, 0.45))


def crop(im, cx, top, bot, tw, th):
    """Crop (cx, top..bot) at the tile's aspect; shift, then shrink, to stay inside the image (no padding)."""
    h = min(bot - top, im.height, im.width * th / tw)
    w = h * tw / th
    top = min(max(top + ((bot - top) - h) / 2, 0), im.height - h)
    left = min(max(cx - w / 2, 0), im.width - w)
    return im.resize((tw, th), Image.LANCZOS, box=(left, top, left + w, top + h))


def head(key, tw, th, above=0.85, below=0.75):
    """Head-and-shoulders crop at a fixed face scale, so every panel reads at the same size."""
    im, box, _ = load(key)
    if box is None:
        return fit(key, tw, th)
    x1, y1, x2, y2 = box
    fh, cx = y2 - y1, (x1 + x2) / 2
    return crop(im, cx, y1 - above * fh, y2 + below * fh, tw, th)


def back_head(key, tw, th):
    """Back views have no detectable face: crop the top of the frame around the head."""
    im = load(key)[0]
    cx = {"A8": 0.5, "IMG_8772": 0.567}[key] * im.width
    top, bot = {"A8": (0.0, 0.30), "IMG_8772": (0.31, 0.56)}[key]
    return crop(im, cx, top * im.height, bot * im.height, tw, th)


def sim(a, b):
    ea, eb = load(a)[2], load(b)[2]
    return None if ea is None or eb is None else float(ea @ eb)


def header(d, subtitle, page):
    t1 = "THE OTHER SIDE ("
    f = font(52, True)
    d.text((120, 40), t1, font=f, fill=INK)
    x = 120 + d.textlength(t1, font=f)
    ml = ImageFont.truetype(ML_FONT, 46)
    d.text((x, 44), "മറുവശം", font=ml, fill=INK)
    x += d.textlength("മറുവശം", font=ml)
    d.text((x, 40), ")  —  Aadhi character identity sheet", font=f, fill=INK)
    d.text((W - 120, 48), f"{page} / 3", font=font(40, True), fill=DIM, anchor="ra")
    d.text((120, 108), subtitle, font=font(30), fill=DIM)


def place(board, d, tile, x, y, title, sub="", sub2=""):
    board.paste(tile, (x, y))
    d.text((x, y + tile.height + 12), title, font=font(30, True), fill=INK)
    if sub:
        d.text((x, y + tile.height + 50), sub, font=font(25), fill=DIM)
    if sub2:
        d.text((x, y + tile.height + 82), sub2, font=font(25), fill=DIM)


def section(d, x, y, text):
    d.text((x, y), text.upper(), font=font(30, True), fill=ACC)


def page1():
    b = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(b)
    header(d, "1  Turnaround: front, three-quarter and profile views, full body. Approved panels, frozen (crop and scale only).", 1)
    section(d, 120, 170, "Head and shoulders")
    tw, th, gap = 660, 790, 48
    x = (W - (5 * tw + 4 * gap)) // 2
    for k, t, s in [("A1", "A1  Front", "ref IMG_8749"), ("A2", "A2  Three-quarter, frame-left", "ref IMG_8708"),
                    ("A3", "A3  Three-quarter, frame-right", "ref IMG_8722"), ("A4", "A4  Left profile", "ref IMG_8729"),
                    ("A5", "A5  Right profile", "ref IMG_8780")]:
        place(b, d, fit(k, tw, th), x, 220, t, s)
        x += tw + gap
    section(d, 120, 1120, "Full body  ·  build and proportions")
    bw, bh = 560, 840
    x = 120
    for k, t, s in [("A6_v3", "A6_v3  Full body front", "ref IMG_8759"), ("A7_v2", "A7_v2  Full body three-quarter", "ref IMG_8708"),
                    ("A8", "A8  Full body back", "ref IMG_8772")]:
        place(b, d, fit(k, bw, bh), x, 1170, t, s)
        x += bw + gap
    notes = ["Base look (A set): plain charcoal T-shirt, no print,",
             "black shorts, barefoot.",
             "Slim build, natural posture; shoulders a touch broader",
             "than IMG_8759 in A6_v3 (accepted).",
             "Hair: shoulder-length, wavy, black, swept back,",
             "falls behind the ears; same volume in every view.",
             "Beard: short and trimmed, with moustache.",
             "No necklace, no jewellery (the chain in the photos",
             "is excluded on purpose).",
             "Watch: his own black digital watch, RIGHT wrist",
             "(locked prop; covered by C1-C4, not on this sheet)."]
    nx = x + 40
    section(d, nx, 1170, "Locked look")
    for i, line in enumerate(notes):
        d.text((nx, 1230 + i * 52), line, font=font(31), fill=INK)
    return b


def page2():
    b = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(b)
    header(d, "2  Emotional progression across the story, and costume and hair consistency.", 2)
    section(d, 120, 170, "Emotional progression  ·  same face, only the expression and the light change")
    tw, th, gap = 800, 960, 120
    x = (W - (4 * tw + 3 * gap)) // 2
    steps = [("B1", "B1  Calm, neutral", "Baseline: steady gaze, relaxed face", "Plain tee, soft studio light"),
             ("C7_v2", "C7_v2  Uneasy, night", "Oil lamp frame-left, mirror side", "Damp hair, teal shadows"),
             ("C6_v3", "C6_v3  Day 7, no sleep", "Exhausted, pleading: eyes and lips", "Face shape unchanged"),
             ("B5_v2", "B5_v2  Cold smile: the other", "Closed-lip smile, eyes not smiling", "Imposter: flipped in the edit only")]
    for i, (k, t, s, s2) in enumerate(steps):
        place(b, d, head(k, tw, th, 0.95, 1.1), x, 220, t, s, s2)
        if i < 3:
            ax, ay = x + tw + 22, 220 + th // 2
            d.line((ax, ay, ax + gap - 44, ay), fill=ACC, width=6)
            d.polygon([(ax + gap - 44, ay - 16), (ax + gap - 44, ay + 16), (ax + gap - 20, ay)], fill=ACC)
        x += tw + gap
    section(d, 120, 1330, "Costume and hair consistency  ·  every face panel at the same head scale")
    keys = [("A1", "tee"), ("A2", "tee"), ("A3", "tee"), ("A4", "tee"), ("A5", "tee"), ("A6_v3", "tee"), ("A7_v2", "tee"),
            ("A8", "tee"), ("B1", "tee"), ("B5_v2", "tee"), ("C5", "shirt"), ("C6_v3", "shirt"), ("C7_v2", "shirt")]
    sw, sh, sg = 262, 330, 15
    x = (W - (len(keys) * sw + (len(keys) - 1) * sg)) // 2
    for k, c in keys:
        tile = back_head(k, sw, sh) if k == "A8" else head(k, sw, sh)
        place(b, d, tile, x, 1380, k, c)
        x += sw + sg
    d.text((120, 1830), "Tee = base look (A set, B set): plain charcoal T-shirt.   Shirt = film costume (C set): charcoal "
           "cotton shirt, single pocket on the LEFT chest, top button open.", font=font(30), fill=INK)
    d.text((120, 1880), "Hair, beard and moustache hold across all 13 panels; hair is damp only where the story asks (C6_v3 day 7, "
           "C7_v2 night). No necklace in any panel.", font=font(30), fill=INK)
    return b


def page3():
    b = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(b)
    header(d, "3  Identity reference comparisons: original photo (left) beside the approved panel (right). "
           "Face match = ArcFace similarity, support only; the visual check decided every approval.", 3)
    pairs = [("IMG_8749", "A1", "Front"), ("IMG_8708", "A2", "Three-quarter L"), ("IMG_8722", "A3", "Three-quarter R"),
             ("IMG_8729", "A4", "Left profile"), ("IMG_8780", "A5", "Right profile"), ("IMG_8759", "A6_v3", "Full body"),
             ("IMG_8708", "A7_v2", "Full body 3/4"), ("IMG_8772", "A8", "Back"), ("IMG_8749", "B1", "Neutral"),
             ("IMG_8813", "B5_v2", "Cold smile"), ("IMG_8749", "C5", "Costume"), ("IMG_8749", "C6_v3", "Day 7"),
             ("IMG_8749", "C7_v2", "Oil lamp")]
    tw, th, cols = 340, 425, 5
    pw, gx, gy = 2 * tw + 8, 70, 150
    x0 = (W - (cols * pw + (cols - 1) * gx)) // 2
    scores = []
    for i, (r, k, t) in enumerate(pairs):
        x, y = x0 + (i % cols) * (pw + gx), 200 + (i // cols) * (th + gy + 10)
        if k == "A8":
            a, p = back_head(r, tw, th), back_head(k, tw, th)
        else:
            a, p = head(r, tw, th), head(k, tw, th)
        b.paste(a, (x, y))
        b.paste(p, (x + tw + 8, y))
        s = sim(r, k)
        if s is not None:
            scores.append(s)
        d.text((x, y + th + 12), f"{t}:  {r.replace('IMG_', 'IMG_')}  vs  {k}", font=font(27, True), fill=INK)
        d.text((x, y + th + 48), f"face match {s:.2f}" if s is not None else "no face (back view): hair and build only",
               font=font(25), fill=ACC if s is not None else DIM)
    i = len(pairs)
    x, y = x0 + (i % cols) * (pw + gx), 200 + (i // cols) * (th + gy + 10)
    lines = ["How to read the scores", "", f"Range {min(scores):.2f} - {max(scores):.2f}, median {np.median(scores):.2f}.",
             "Lowest: A4 left profile and C6_v3 day 7 (0.74):", "side view; exhaustion changes the eyes.",
             "Then A6_v3 full body and B5_v2 smile (0.77):", "small face in frame; the expression changes.",
             "Each was checked by eye before approval."]
    for j, line in enumerate(lines):
        d.text((x, y + j * 48), line, font=font(30, j == 0), fill=ACC if j == 0 else INK)
    return b


def main():
    for n, f in enumerate([page1, page2, page3], 1):
        out = f"output/tos_character_sheet_p{n}.jpg"
        f().save(out, quality=92)
        print("wrote", out)


if __name__ == "__main__":
    main()
