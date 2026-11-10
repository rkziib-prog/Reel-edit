#!/usr/bin/env python3
"""THE OTHER SIDE: identity board from the user's original reference photos only (no AI, no retouching).
Crops and scaling only; face boxes from insightface detection (fixed below). Originals in input/tos_refs/ are read-only.
Run from the repo root: python3 edits/the-other-side/identity_board.py  ->  output/tos_identity_board.jpg
"""
import subprocess
from PIL import Image, ImageOps, ImageDraw, ImageFont

SRC, OUT = "input/tos_refs", "output/tos_identity_board.jpg"
ML_FONT = "edits/the-other-side/fonts/NotoSansMalayalam-Bold.ttf"  # Google Fonts, OFL
W, H, BG, INK = 3840, 2160, (128, 128, 128), (245, 245, 245)
FACES = {"8749": (1444, 679, 2017, 1513), "8708": (1725, 1302, 2053, 1795), "8722": (1303, 1215, 1657, 1776),
         "8729": (1453, 1269, 1694, 1763), "8780": (1717, 918, 2173, 1767), "8799": (1173, 902, 1912, 2010),
         "8832": (1256, 904, 1985, 1990)}


def font(size, bold=False):
    path = subprocess.run(["fc-match", "-f", "%{file}", "Inter:bold" if bold else "Inter"], capture_output=True, text=True).stdout
    return ImageFont.truetype(path, size)


def load(n):
    return ImageOps.exif_transpose(Image.open(f"{SRC}/IMG_{n}.JPG")).convert("RGB")


def head(n, tw, th):
    x1, y1, x2, y2 = FACES[n]
    fh, cx = y2 - y1, (x1 + x2) / 2
    top, bot = y1 - 0.75 * fh, y2 + 0.65 * fh
    w = (bot - top) * tw / th
    return load(n).resize((tw, th), Image.LANCZOS, box=(cx - w / 2, top, cx + w / 2, bot))


def column(n, cx, tw, th, top=0, bot=None):
    im = load(n)
    bot = bot or im.height
    w = (bot - top) * tw / th
    return im.resize((tw, th), Image.LANCZOS, box=(cx - w / 2, top, cx + w / 2, bot))


def place(board, d, tile, x, y, label):
    board.paste(tile, (x, y))
    name, _, file = label.partition("  ·  ")
    d.text((x, y + tile.height + 10), name, font=font(27, True), fill=INK)
    d.text((x, y + tile.height + 44), file, font=font(25), fill=INK)


def main():
    board = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(board)
    t1 = "THE OTHER SIDE ("
    d.text((140, 36), t1, font=font(52, True), fill=INK)
    x = 140 + d.textlength(t1, font=font(52, True))
    ml = ImageFont.truetype(ML_FONT, 46)
    d.text((x, 40), "മറുവശം", font=ml, fill=INK)
    x += d.textlength("മറുവശം", font=ml)
    d.text((x, 36), ")  —  Aadhi identity board", font=font(52, True), fill=INK)
    d.text((140, 98), "Original photographs only: cropped and scaled, no AI, no retouching, no colour change.", font=font(30), fill=INK)
    heads = [("8749", "REF_01  Front  ·  IMG_8749"), ("8708", "REF_02  Three-quarter, left  ·  IMG_8708"),
             ("8722", "REF_03  Three-quarter, right  ·  IMG_8722"), ("8729", "REF_04  Left profile  ·  IMG_8729"),
             ("8780", "REF_04b  Right profile  ·  IMG_8780")]
    tw, th, gap = 640, 800, 40
    x = (W - (5 * tw + 4 * gap)) // 2
    for n, label in heads:
        place(board, d, head(n, tw, th), x, 170, label)
        x += tw + gap
    y2, bh, bw, ew, eh = 1080, 920, 400, 600, 750
    tiles = [(column("8759", 1683, bw, bh), "REF_05  Full body  ·  IMG_8759"),
             (column("8708", 1889, bw, bh), "3/4 body  ·  IMG_8708"),
             (column("8772", 1660, bw, bh), "Back  ·  IMG_8772"),
             (head("8799", ew, eh), "REF_07  Fear  ·  IMG_8799"),
             (head("8832", ew, eh), "REF_08  Smile (warm, not cold)  ·  IMG_8832, retake"),
             (column("8843", 1680, ew, eh, 1016, 1016 + 2000 * 1.0), "REF_06  Wrist position only  ·  IMG_8843, prop differs")]
    x = (W - (sum(t.width for t, _ in tiles) + 5 * gap)) // 2
    for t, label in tiles:
        place(board, d, t, x, y2 + (bh - t.height), label)
        x += t.width + gap
    board.save(OUT, quality=92)
    print("wrote", OUT, board.size)


if __name__ == "__main__":
    main()
