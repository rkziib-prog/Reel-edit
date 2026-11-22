# Subtitle PNGs (1080x1920, transparent) for FULL-SCREEN puzzle reels: one line block at y≈1500, above Instagram's bottom UI.
# Usage: python3 subs_full.py <outdir>   (reads lines.tsv next to this file; fonts from edits/ksrtc-flight/fonts)
import sys, csv, pathlib
from playwright.sync_api import sync_playwright
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
F = pathlib.Path(__file__).parent.parent / "ksrtc-flight" / "fonts"
CSS = f"""@font-face{{font-family:Pop;font-weight:700;src:url('file://{F}/poppins-latin-700-normal.woff2')}}
html,body{{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}}
.s{{position:absolute;top:1490px;left:60px;right:60px;text-align:center;font:700 50px/1.25 Pop;color:#fff;
  text-shadow:0 3px 14px rgba(0,0,0,.9),0 0 4px rgba(0,0,0,.9)}} .s span{{color:#FFD45C}}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport=dict(width=1080, height=1920)); tmp = out / "_p.html"
    for row in csv.reader(open(pathlib.Path(__file__).parent / "lines.tsv"), delimiter="\t"):
        tmp.write_text(f"<meta charset=utf-8><style>{CSS}</style><div class=s>{row[2]}</div>"); pg.goto(tmp.as_uri())
        pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(80); pg.screenshot(path=str(out / f"sub_{int(row[0]):02d}.png"), omit_background=True)
    b.close(); tmp.unlink()
print("subs written")
