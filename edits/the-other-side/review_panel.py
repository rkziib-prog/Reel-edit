#!/usr/bin/env python3
"""Review one regenerated character-sheet panel against the original reference photos (read-only).
Usage (repo root): python3 edits/the-other-side/review_panel.py <panel> <drive_file_id> [label=png ...]
Downloads a copy to input/tos_panels/<panel>_<id8>.png (the Drive original is never changed), prints face
similarity to the front photo and the panel's own references, and writes work/review_<panel>.jpg
(references | previous version | new version) for visual inspection. Scores support, never replace, that look."""
import os, subprocess, sys
import numpy as np
from PIL import Image, ImageOps, ImageDraw
from insightface.app import FaceAnalysis

REFS = {"A6": ["8759"], "A7": ["8708", "8759"], "B3": ["8749", "8708"], "B5": ["8813", "8749"],
        "C6": ["8749"], "C7": ["8749"], "C8": ["8749"]}
panel, fid = sys.argv[1], sys.argv[2]
extras = [a.split('=', 1) if '=' in a else ('previous', a) for a in sys.argv[3:]]
out = f"input/tos_panels/{panel}_{fid[:8]}.png"
if not os.path.exists(out):
    subprocess.run(["curl", "-sS", "-L", "--retry", "3", "-o", out,
                    f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"], check=True)
app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"], allowed_modules=["detection", "recognition"])
app.prepare(ctx_id=-1, det_size=(640, 640))

def load(p):
    return ImageOps.exif_transpose(Image.open(p)).convert("RGB")

def face(im, mw=1400):
    if im.width > mw:
        im = im.resize((mw, round(im.height * mw / im.width)))
    fs = app.get(np.asarray(im)[:, :, ::-1])
    return max(fs, key=lambda f: f.bbox[2] - f.bbox[0]).normed_embedding if fs else None

new = load(out)
fn = face(new)
refs = ["8749"] + [r for r in REFS.get(panel, []) if r != "8749"]
for r in refs:
    fr = face(load(f"input/tos_refs/IMG_{r}.JPG"))
    print(f"{panel} vs IMG_{r}: " + ("no face" if fn is None or fr is None else f"{float(fn @ fr):.2f}"))
for lab, pth in extras:
    fp = face(load(pth))
    print(f"{lab} vs NEW: " + (f"{float(fp @ fn):.2f}" if fp is not None and fn is not None else "no face"))
H = 700
tiles = [(f"IMG_{r}", load(f"input/tos_refs/IMG_{r}.JPG")) for r in REFS.get(panel, ["8749"])]
tiles += [(lab, load(pth)) for lab, pth in extras]
tiles.append((f"NEW {panel}", new))
tiles = [(l, i.resize((round(i.width * H / i.height), H))) for l, i in tiles]
sheet = Image.new("RGB", (sum(i.width + 8 for _, i in tiles), H + 24), "white")
x = 0
for l, i in tiles:
    sheet.paste(i, (x, 24)); ImageDraw.Draw(sheet).text((x + 4, 4), l, fill="black"); x += i.width + 8
sheet.save(f"work/review_{panel}.jpg", quality=86)
print("size", new.size, "| sheet", f"work/review_{panel}.jpg")
