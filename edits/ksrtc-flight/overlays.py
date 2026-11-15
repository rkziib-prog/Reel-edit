# Builds the reel's static layers as PNGs with Chromium (proper Malayalam shaping):
#   frame.png (1080x1920 background + top caption + handle, with a transparent hole for the card)
#   sub_NN.png (English subtitle for each script line, transparent)
# Usage: python3 overlays.py <outdir>
import sys, csv, pathlib
from playwright.sync_api import sync_playwright
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
F = pathlib.Path(__file__).parent / "fonts"
CARD = dict(x=40, y=600, w=1000, h=563)   # 16:9 card
FONTS = f"""
@font-face{{font-family:ML;src:url('file://{F}/noto-sans-malayalam-malayalam-800-normal.woff2')}}
@font-face{{font-family:Pop;font-weight:700;src:url('file://{F}/poppins-latin-700-normal.woff2')}}
@font-face{{font-family:Pop;font-weight:600;src:url('file://{F}/poppins-latin-600-normal.woff2')}}
html,body{{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}}"""
frame = f"""<style>{FONTS}
body{{background:radial-gradient(ellipse 70% 40% at 78% 18%, #6b4a2a 0%, #2a1e2c 45%, #120f1c 100%)}}
.lamp{{position:absolute;left:760px;top:170px;width:120px;height:150px;border-radius:14px 14px 30px 30px;
  background:linear-gradient(#fff2c8,#f2c46b);box-shadow:0 0 120px 60px rgba(255,190,90,.35)}}
.cap{{position:absolute;top:470px;width:100%;text-align:center;font:800 64px ML,Pop;color:#fff;
  text-shadow:0 4px 18px rgba(0,0,0,.6)}}
.cap b{{font-family:Pop;font-weight:700}}
.card{{position:absolute;left:{CARD['x']-8}px;top:{CARD['y']-8}px;width:{CARD['w']+16}px;height:{CARD['h']+16}px;
  border-radius:34px;background:#000;box-shadow:0 20px 60px rgba(0,0,0,.7)}}
.handle{{position:absolute;bottom:150px;width:100%;text-align:center;font:600 34px Pop;color:rgba(255,255,255,.55)}}
</style><div class=lamp></div><div class=cap><b>2 AM</b> ചിന്തകൾ 🌙</div><div class=card></div>
<div class=handle>@pathira.chinthakal</div>"""
def sub(txt): return f"""<style>{FONTS}
.s{{position:absolute;top:{CARD['y']+CARD['h']+40}px;left:70px;right:70px;text-align:center;font:700 52px/1.25 Pop;color:#fff;
  text-shadow:0 3px 12px rgba(0,0,0,.8)}} .s span{{color:#FFD45C}}</style><div class=s>{txt}</div>"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport=dict(width=1080, height=1920))
    tmp = out / "_page.html"
    def load(html): tmp.write_text("<meta charset=utf-8>" + html); pg.goto(tmp.as_uri()); pg.evaluate("document.fonts.ready")
    load(frame); pg.wait_for_timeout(300); pg.screenshot(path=str(out / "frame.png"))
    for row in csv.reader(open(pathlib.Path(__file__).parent / "lines.tsv"), delimiter="\t"):
        load(sub(row[2])); pg.wait_for_timeout(100)
        pg.screenshot(path=str(out / f"sub_{int(row[0]):02d}.png"), omit_background=True)
    b.close(); tmp.unlink()
print("card", CARD)
