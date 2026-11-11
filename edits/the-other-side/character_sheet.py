#!/usr/bin/env python3
"""THE OTHER SIDE: complete character identity sheet for Aadhi, built from all 20 FROZEN approved panels.
Panels are cropped and scaled, never edited or regenerated; originals and panels in input/ are read-only.
Pages (3840x2160 each):
  p1  turnaround: head views A1-A5; full body in the base look (A6-A8) and the film costume (C1-C3)
  p2  emotional progression in story order (plan doc scenes), costume and watch continuity, hair at one scale
  p3  identity reference comparisons: all 20 panels beside their original photo, ArcFace face match (support only)
Run from the repo root: python3 edits/the-other-side/character_sheet.py  ->  output/tos_character_sheet_p{1,2,3}.jpg
"""
import hashlib, os, subprocess, sys
from collections import Counter
import numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFont
from insightface.app import FaceAnalysis

PAN, REF = "input/tos_panels", "input/tos_refs"
ML_FONT = "edits/the-other-side/fonts/NotoSansMalayalam-Bold.ttf"
W, H, BG, INK, DIM, ACC, OK = 3840, 2160, (26, 26, 28), (240, 240, 240), (165, 165, 170), (226, 170, 92), (120, 200, 140)

# all approved, frozen panels (read-only copies)
P = {"A1": "A49AE7DA", "A2": "98B62E03", "A3": "97BE6DC9", "A4": "31F18098", "A5": "A64DD957",
     "A6_v3": "D9F5F235_A6_v3", "A7_v2": "A7_1s2_1QR9", "A8": "020E8ADD",
     "B1": "C70DA14A", "B2": "772986A4", "B4": "05C021BC", "B5_v2": "B5_1RU_e6JO",
     "C1": "92B8149B", "C2": "D86B337D", "C3": "A51F5074", "C4": "5B48BC7A", "C5": "C735A6EB",
     "C6_v3": "C6_1Fdez8s5", "C7_v2": "C7_1eLJfMK6", "C8": "8E112F8E"}
LOG = []   # (page, section, panel, detail): every placement, for --verify
# watch centres (x, y) in the panel's own pixels, found by eye on the frozen panels
WATCH = {"C1": (315, 767), "C2": (417, 790), "C3": (697, 775), "C4": (471, 753)}

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
    cx = {"A8": 0.5, "C3": 0.5, "IMG_8772": 0.567}[key] * im.width
    top, bot = {"A8": (0.0, 0.30), "C3": (0.0, 0.30), "IMG_8772": (0.31, 0.56)}[key]
    return crop(im, cx, top * im.height, bot * im.height, tw, th)


def sim(a, b):
    ea, eb = load(a)[2], load(b)[2]
    return None if ea is None or eb is None else float(ea @ eb)


def header(d, subtitle, page):
    t1 = "THE OTHER SIDE ("
    f = font(52, True)
    d.text((120, 36), t1, font=f, fill=INK)
    x = 120 + d.textlength(t1, font=f)
    ml = ImageFont.truetype(ML_FONT, 46)
    d.text((x, 40), "മറുവശം", font=ml, fill=INK)
    x += d.textlength("മറുവശം", font=ml)
    d.text((x, 36), ")  —  Aadhi character identity sheet  ·  20 approved panels, frozen", font=f, fill=INK)
    d.text((W - 120, 44), f"{page} / 3", font=font(40, True), fill=DIM, anchor="ra")
    d.text((120, 104), subtitle, font=font(30), fill=DIM)


def place(board, d, tile, x, y, lines, size=30):
    board.paste(tile, (x, y))
    for i, (t, c) in enumerate(lines):
        d.text((x, y + tile.height + 10 + i * (size + 6)), t, font=font(size if i == 0 else size - 4, i == 0), fill=c)


def section(d, x, y, text):
    d.text((x, y), text.upper(), font=font(30, True), fill=ACC)


def use(page, section, *keys, detail=""):
    LOG.extend((page, section, k, detail) for k in keys)


def wrist(key, tw, th, span=330):
    im = load(key)[0]
    x, y = WATCH[key]
    return crop(im, x, y - span * th / tw / 2 + 20, y + span * th / tw / 2 + 20, tw, th)


def page1():
    b = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(b)
    header(d, "1  Turnaround: front, three-quarter and profile views; full body in the base look (A) and the film costume (C).", 1)
    section(d, 120, 160, "Head and shoulders  ·  base look")
    tw, th, gap = 660, 760, 48
    x = (W - (5 * tw + 4 * gap)) // 2
    for k, t, r in [("A1", "A1  Front", "IMG_8749"), ("A2", "A2  Three-quarter, frame-left", "IMG_8708"),
                    ("A3", "A3  Three-quarter, frame-right", "IMG_8722"), ("A4", "A4  Left profile", "IMG_8729"),
                    ("A5", "A5  Right profile", "IMG_8780")]:
        place(b, d, fit(k, tw, th), x, 205, [(t, INK), (f"ref {r}", DIM)])
        x += tw + gap
        use(1, "turnaround", k)
    bw, bh, gap = 540, 820, 36
    x0 = (W - (6 * bw + 5 * gap + 60)) // 2
    section(d, x0, 1080, "Full body  ·  base look: charcoal tee, black shorts, barefoot")
    section(d, x0 + 3 * (bw + gap) + 60, 1080, "Full body  ·  film costume: shirt, mundu, watch")
    tiles = [("A6_v3", "A6_v3  Front", "ref IMG_8759", ""), ("A7_v2", "A7_v2  Three-quarter", "ref IMG_8708", ""),
             ("A8", "A8  Back", "ref IMG_8772", ""),
             ("C1", "C1  Front", "ref IMG_8759", "watch: his RIGHT wrist (frame-left)"),
             ("C2", "C2  Three-quarter", "ref IMG_8708", "watch: his RIGHT wrist"),
             ("C3", "C3  Back", "ref IMG_8772", "watch: his RIGHT wrist (frame-right)")]
    for i, (k, t, r, w) in enumerate(tiles):
        x = x0 + i * (bw + gap) + (60 if i >= 3 else 0)
        lines = [(t, INK), (r, DIM)] + ([(w, OK)] if w else [])
        place(b, d, fit(k, bw, bh), x, 1125, lines)
        use(1, "turnaround", k)
    sx = x0 + 3 * (bw + gap) + 30 - gap // 2
    d.line((sx, 1125, sx, 1125 + bh), fill=(70, 70, 75), width=3)
    return b


def page2():
    b = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(b)
    header(d, "2  Emotional progression in story order, costume and watch continuity, and hair at one scale.", 2)
    section(d, 120, 160, "Emotional progression  ·  story order from the production plan  ·  same face, only expression and light change")
    steps = [("B1", "B1  Neutral", "Baseline reference", "studio light"),
             ("C7_v2", "C7_v2  Uneasy", "Sc 1-2  ·  3:33 AM, oil lamp", "mirror side, night"),
             ("B2", "B2  Fear", "Sc 3-4  ·  the call, the notes", "quiet, held breath"),
             ("B4", "B4  Anger", "Sc 5  ·  confrontation, Line 18", "contained, not shouting"),
             ("C6_v3", "C6_v3  Day 7", "Sc 5  ·  the reflection", "exhausted, pleading"),
             ("C8", "C8  Calm, daylight", "Sc 6  ·  8:27 AM, real side", "warm, dry, window bars"),
             ("B5_v2", "B5_v2  Cold smile", "Sc 7  ·  the other", "flipped in the edit only")]
    tw, th, gap = 440, 550, 50
    x = (W - (7 * tw + 6 * gap)) // 2
    for i, (k, t, s1, s2) in enumerate(steps):
        place(b, d, head(k, tw, th, 0.95, 1.1), x, 205, [(t, INK), (s1, ACC), (s2, DIM)], 29)
        if i < 6:
            ax, ay = x + tw + 8, 205 + th // 2
            d.polygon([(ax, ay - 14), (ax, ay + 14), (ax + gap - 16, ay)], fill=ACC)
        x += tw + gap
        use(2, "progression", k)

    y = 930
    section(d, 120, y, "Costume and watch continuity  ·  his own black digital watch, locked prop, RIGHT wrist in every generated frame")
    ty, ch = y + 45, 470
    x = 120
    c4 = load("C4")[0]
    wx, wy = WATCH["C4"]
    place(b, d, crop(c4, wx, wy - 330, wy + 330, ch, ch), x, ty, [("C4  Watch and hand", INK), ("RIGHT forearm, sleeve rolled", OK)], 29)
    x += ch + 40
    for k, note in [("C1", "front: frame-left = his right"), ("C2", "three-quarter: near arm, right"),
                    ("C3", "back: frame-right = his right")]:
        place(b, d, wrist(k, 330, ch), x, ty, [(f"{k}  wrist", INK), (note, OK)], 29)
        x += 330 + 30
        use(2, "costume", k)
    x += 10
    place(b, d, fit("C5", 376, ch), x, ty, [("C5  Shirt detail", INK), ("pocket on LEFT chest", OK)], 29)
    x += 376 + 60
    use(2, "costume", "C4", "C5")
    notes = [("Film costume (C1-C8)", ACC),
             ("Charcoal cotton shirt, single pocket on the LEFT", INK),
             ("chest, top button open, sleeves rolled; dark", INK),
             ("mundu; barefoot. No necklace, no jewellery.", INK),
             ("Base look (A, B): plain charcoal tee, black", INK),
             ("shorts, barefoot (reference panels only).", INK),
             ("Watch: generated on the RIGHT wrist, right hand", INK),
             ("dominant. Imposter shots are flipped in the edit,", INK),
             ("so his watch reads on the left and its lettering", INK),
             ("mirrors there: that is intended.", INK)]
    for i, (t, c) in enumerate(notes):
        d.text((x, ty + i * 47), t, font=font(30, c == ACC), fill=c)

    y = 1590
    section(d, 120, y, "Hair, beard and face at one head scale  ·  19 panels (all but C4, the hand detail)")
    keys = ["A1", "A2", "A3", "A4", "A5", "A6_v3", "A7_v2", "A8", "B1", "B2", "B4", "B5_v2",
            "C1", "C2", "C3", "C5", "C6_v3", "C7_v2", "C8"]
    sw, sh, sg = 180, 225, 8
    x = (W - (len(keys) * sw + (len(keys) - 1) * sg)) // 2
    for k in keys:
        tile = back_head(k, sw, sh) if k in ("A8", "C3") else head(k, sw, sh)
        place(b, d, tile, x, y + 45, [(k, INK)], 25)
        x += sw + sg
        use(2, "strip", k)
    d.text((120, 1940), "Hair: shoulder-length, wavy, black, swept back, the same volume from every side; damp only where the story asks "
           "(C6_v3 day 7, C7_v2 night). Beard and moustache: short, trimmed, unchanged.", font=font(29), fill=INK)
    return b


def page3():
    b = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(b)
    header(d, "3  Identity reference comparisons: original photo (left) beside the approved panel (right), all 20 panels. "
           "Face match = ArcFace similarity, support only; every approval was a visual check.", 3)
    pairs = [("IMG_8749", "A1", "Front"), ("IMG_8708", "A2", "3/4 left"), ("IMG_8722", "A3", "3/4 right"),
             ("IMG_8729", "A4", "Left profile"), ("IMG_8780", "A5", "Right profile"),
             ("IMG_8759", "A6_v3", "Full body"), ("IMG_8708", "A7_v2", "Full body 3/4"), ("IMG_8772", "A8", "Back"),
             ("IMG_8749", "B1", "Neutral"), ("IMG_8799", "B2", "Fear"),
             ("IMG_8749", "B4", "Anger"), ("IMG_8813", "B5_v2", "Cold smile"), ("IMG_8759", "C1", "Costume front"),
             ("IMG_8708", "C2", "Costume 3/4"), ("IMG_8772", "C3", "Costume back"),
             ("IMG_8843", "C4", "Watch"), ("IMG_8749", "C5", "Shirt detail"), ("IMG_8749", "C6_v3", "Day 7"),
             ("IMG_8749", "C7_v2", "Oil lamp"), ("IMG_8749", "C8", "Daylight")]
    tw, th, cols = 318, 375, 5
    pw, gx, gy = 2 * tw + 8, 58, 92
    x0 = (W - (cols * pw + (cols - 1) * gx)) // 2
    scores = []
    for i, (r, k, t) in enumerate(pairs):
        x, y = x0 + (i % cols) * (pw + gx), 165 + (i // cols) * (th + gy + 10)
        if k in ("A8", "C3"):
            a, p = back_head(r, tw, th), back_head(k, tw, th)
        elif k == "C4":
            ref = load(r)[0]
            a = crop(ref, 1680, 1016, 3016, tw, th)
            wx, wy = WATCH["C4"]
            p = crop(load(k)[0], wx, wy - 400, wy + 400, tw, th)
        else:
            a, p = head(r, tw, th), head(k, tw, th)
        b.paste(a, (x, y))
        b.paste(p, (x + tw + 8, y))
        s = sim(r, k) if k != "C4" else None
        if s is not None:
            scores.append((s, k))
        d.text((x, y + th + 10), f"{k}  {t}  ·  vs {r}", font=font(26, True), fill=INK)
        note = (f"face match {s:.2f}" if s is not None else
                "same watch, RIGHT wrist" if k == "C4" else "back view: hair and build only")
        d.text((x, y + th + 44), note, font=font(25), fill=ACC if s is not None else OK if k == "C4" else DIM)
        use(3, "compare", k, detail=r)
    v = sorted(scores)
    low = ", ".join(f"{k} {s:.2f}" for s, k in v[:4])
    d.text((120, 2085), f"Face match over {len(v)} panels: {v[0][0]:.2f} - {v[-1][0]:.2f}, median {np.median([s for s, _ in v]):.2f}. "
           f"Lowest: {low} (profile, small face in frame, expression or exhaustion), each checked by eye.",
           font=font(29), fill=INK)
    return b


def main():
    verify = "--verify" in sys.argv
    outdir = "work/verify" if verify else "output"
    os.makedirs(outdir, exist_ok=True)
    for n, f in enumerate([page1, page2, page3], 1):
        out = f"{outdir}/tos_character_sheet_p{n}.jpg"
        f().save(out, quality=92)
        print("wrote", out)
    allp = {k for _, _, k, _ in LOG}
    missing = set(P) - allp
    print(f"panels placed: {len(allp)}/{len(P)}; missing: {sorted(missing) or 'none'}")
    assert not missing
    if verify:
        for sec in ["turnaround", "progression", "costume", "strip", "compare"]:
            c = Counter(k for _, s, k, _ in LOG if s == sec)
            dup = [k for k, v in c.items() if v > 1]
            print(f"{sec:12s} tiles {sum(c.values()):2d}  unique {len(c):2d}  duplicates {dup or 'none'}  {sorted(c)}")
        print("compare pairs:", ", ".join(f"{k}<-{d}" for _, s, k, d in LOG if s == "compare"))
        for n in (1, 2, 3):
            a = np.asarray(Image.open(f"output/tos_character_sheet_p{n}.jpg"), np.int16)
            b = np.asarray(Image.open(f"work/verify/tos_character_sheet_p{n}.jpg"), np.int16)
            print(f"p{n}: exported vs fresh render  size {a.shape == b.shape}  max pixel diff {int(np.abs(a - b).max())}")


if __name__ == "__main__":
    main()
