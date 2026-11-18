"""Meera character sheet: master + S1-S6 on one labelled page.

Inputs (read-only): input/meera_refs/meera_master_v1.png, input/meera_sheet/meera_S{1..6}_v*.png
Output: output/meera_character_sheet.jpg
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SHEET = ROOT / "input/meera_sheet"
PANELS = [
    ("MASTER", ROOT / "input/meera_refs/meera_master_v1.png"),
    ("S1 front smile", SHEET / "meera_S1_v1.png"),
    ("S2 three-quarter", SHEET / "meera_S2_v1.png"),
    ("S3 profile (left side)", SHEET / "meera_S3_v2.png"),
    ("S6 confident close-up", SHEET / "meera_S6_v1.png"),
    ("S7 full body front (body ref)", SHEET / "meera_S7_v2.png"),
    ("S8 back view (body ref)", SHEET / "meera_S8_back_v1.png"),
]
NOTES = [
    "MEERA  (AI persona, 24)",
    "",
    "Oval face, high cheekbones",
    "Almond dark-brown eyes",
    "Thick defined brows",
    "Straight nose, full lips",
    "Red-brown lip shade",
    "Mole: RIGHT cheek, beside",
    "  right mouth corner",
    "  (image-left, front shots)",
    "Gold nose stud: LEFT nostril",
    "Small gold hoop earrings",
    "Long wavy black hair,",
    "  centre part",
    "Light-medium brown skin,",
    "  natural texture",
    "Thigh mole: upper front RIGHT",
    "  thigh, outer side",
    "5'6\", curvy hourglass figure",
    "",
    "No necklace, no tattoos,",
    "no glasses",
]
BG, FG, MUTED = (245, 243, 240), (25, 25, 25), (110, 105, 100)
GAP, LABEL_H = 24, 56


def font(size, bold=False):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    try:
        return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{name}", size)
    except OSError:
        return ImageFont.load_default()


def row(items, h):
    out = []
    for label, path in items:
        im = Image.open(path).convert("RGB")
        out.append((label, im.resize((round(im.width * h / im.height), h), Image.LANCZOS)))
    return out


def main():
    top = row(PANELS[:4], 900)
    bottom = row(PANELS[4:], 1200)
    note_w = 640
    width = max(sum(i.width for _, i in top) + GAP * 5,
                sum(i.width for _, i in bottom) + note_w + GAP * 5)
    height = 120 + 900 + LABEL_H + GAP + 1200 + LABEL_H + GAP
    page = Image.new("RGB", (width, height), BG)
    d = ImageDraw.Draw(page)
    d.text((GAP, 30), "MEERA  -  Character identity sheet  (v2 body, 18 Nov 2026, AI-generated)",
           font=font(52, True), fill=FG)
    y = 120
    for items, h in ((top, 900), (bottom, 1200)):
        x = GAP
        for label, im in items:
            page.paste(im, (x, y))
            d.text((x, y + h + 10), label, font=font(34), fill=MUTED)
            x += im.width + GAP
        if items is bottom:
            ty = y + 10
            for i, line in enumerate(NOTES):
                d.text((x + 10, ty), line, font=font(38 if i == 0 else 32, i == 0), fill=FG)
                ty += 54
        y += h + LABEL_H + GAP
    out = ROOT / "output/meera_character_sheet.jpg"
    out.parent.mkdir(exist_ok=True)
    page.save(out, quality=90)
    print(out, page.size)


if __name__ == "__main__":
    main()
