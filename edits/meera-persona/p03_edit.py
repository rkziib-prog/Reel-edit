#!/usr/bin/env python3
"""Meera Post 03: over-the-shoulder glance reel (style of the Drive "Reference" reel).

0-3 s   Kling v2 shot 1 (full-body back view, 0-3 s of the clip)
3-8 s   Kling v2 shot 2 (5.04-10.04 s: head turn, smile, glance back)
8-10.5  last frame held, dimmed, Instagram glyph + handle fade in
Audio: the reference reel's audio (preview only; for posting use Instagram's "Use audio" on the reference reel
and upload the _noaudio version). Run from repo root: python3 edits/meera-persona/p03_edit.py [--handle @name]
"""
import argparse, os, subprocess
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("--handle", default="@meera.nair.ai")
ap.add_argument("--tag", default="v1")
a = ap.parse_args()

CLIP = "input/meera_posts/meera_P03A_kling_v2.mp4"
REF = "input/meera_ref/ref01.mp4"
OUT = f"output/meera_P03_{a.tag}.mp4"
OUT_NA = f"output/meera_P03_{a.tag}_noaudio.mp4"
W, H, END, OUTRO = 1080, 1920, 10.5, 8.0
for p in (OUT, OUT_NA):
    if os.path.exists(p):
        raise SystemExit(f"refusing to overwrite {p}")

# Instagram-style glyph + handle card (transparent PNG)
os.makedirs("work/meera_p03", exist_ok=True)
card = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(card)
s, cx, cy = 150, W // 2, H // 2 - 60
x0, y0 = cx - s // 2, cy - s // 2
lw = 12
d.rounded_rectangle((x0, y0, x0 + s, y0 + s), radius=42, outline="white", width=lw)
r = 34
d.ellipse((cx - r, cy - r, cx + r, cy + r), outline="white", width=lw)
d.ellipse((x0 + s - 44, y0 + 26, x0 + s - 26, y0 + 44), fill="white")
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44)
tw = d.textlength(a.handle, font=font)
d.text((cx - tw / 2, cy + s // 2 + 40), a.handle, font=font, fill="white")
card.save("work/meera_p03/card.png")

fc = (
    f"[0:v]trim=0:3,setpts=PTS-STARTPTS[s1];"
    f"[0:v]trim=5.0417:10.0417,setpts=PTS-STARTPTS[s2];"
    f"[s1][s2]concat=n=2:v=1:a=0,fps=30,scale={W}:{H},"
    f"eq=contrast=1.03:saturation=1.04,tpad=stop_mode=clone:stop_duration={END - 8 + 0.1}[v];"
    f"color=c=black:s={W}x{H}:r=30:d={END},format=rgba,colorchannelmixer=aa=0.62,"
    f"fade=t=in:st={OUTRO}:d=0.5:alpha=1[dim];"
    f"[2:v]format=rgba,fade=t=in:st={OUTRO + 0.3}:d=0.6:alpha=1[card];"
    f"[v][dim]overlay=shortest=1[v2];[v2][card]overlay=shortest=1,trim=0:{END},format=yuv420p[vout];"
    f"[1:a]afade=t=out:st=8.7:d=0.55,apad,atrim=0:{END},loudnorm=I=-14:TP=-1:LRA=11,aresample=48000[aout]"
)
common = ["-c:v", "libx264", "-crf", "20", "-preset", "medium", "-movflags", "+faststart", "-r", "30"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", CLIP, "-i", REF, "-loop", "1", "-framerate", "30",
                "-t", str(END), "-i", "work/meera_p03/card.png", "-filter_complex", fc,
                "-map", "[vout]", "-map", "[aout]", *common, "-c:a", "aac", "-b:a", "160k", OUT], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", OUT, "-an", "-c:v", "copy", "-movflags", "+faststart",
                OUT_NA], check=True)
print(OUT, OUT_NA)
