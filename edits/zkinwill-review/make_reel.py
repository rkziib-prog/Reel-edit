#!/usr/bin/env python3
"""Zkinwill "First Kiss" review reel (folder "Reel"): tighten and polish an already-assembled 71 s talking cut.

No lines are dropped (the speech is Malayalam). Pauses longer than 0.3 s are trimmed to a short breath, the
silent tail is cut, jump cuts this creates inside one shot get an alternating punch-in, the 720p source is
upscaled to 1080x1920 with light sharpening, and the voice is cleaned and levelled.
Run from the repo root:  python3 edits/zkinwill-review/make_reel.py
Input: input/Reel/7B11EB89.mp4   Output: output/zkinwill_review_reel.mp4
"""
import os, subprocess, sys

FPS, W, H = 30, 1080, 1920
SRC = "input/Reel/7B11EB89.mp4"
WORK = "work/zkinwill-reel"
OUT = "output/zkinwill_review_reel.mp4"
GRADE = "eq=contrast=1.04:saturation=1.05"
SHARPEN = "unsharp=5:5:0.6:5:5:0.0"

# Source ranges to keep (pauses measured at 10 ms; each keeps ~0.08 s of breath either side) and zoom.
# Existing hard cuts in the source: 14.4 24.7 28.03 34.6 38.13 41.17 50.1 52.6 58.87
PIECES = [
    (0.00, 5.42, 1.00),
    (5.69, 11.93, 1.10),   # jump cut inside the opening shot -> punch in
    (12.07, 14.40, 1.00),
    (14.40, 24.70, 1.00),
    (24.70, 28.03, 1.00),  # product shot
    (28.03, 31.06, 1.00),
    (31.27, 34.60, 1.10),
    (34.60, 35.56, 1.00),
    (35.71, 38.13, 1.10),
    (38.13, 41.17, 1.00),
    (41.17, 49.57, 1.00),
    (50.08, 52.60, 1.00),  # pause trimmed across the source cut at 50.1
    (52.60, 58.39, 1.00),  # application on the hand
    (58.97, 65.50, 1.00),
    (65.70, 68.63, 1.10),
    (69.14, 69.55, 1.00),  # last word, then the silent tail is dropped
]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(cmd)}\n{r.stderr[-2000:]}")


def main():
    os.makedirs(WORK, exist_ok=True)
    os.makedirs("output", exist_ok=True)
    segs, total = [], 0.0
    for k, (a, b, zoom) in enumerate(PIECES):
        n = round((b - a) * FPS)
        total += n / FPS
        zw, zh = round(W * zoom / 2) * 2, round(H * zoom / 2) * 2
        vf = (f"scale={zw}:{zh}:flags=lanczos:force_original_aspect_ratio=increase,crop={W}:{H},"
              f"setsar=1,{SHARPEN},{GRADE},fps={FPS}")
        af = f"afade=t=in:d=0.02,afade=t=out:st={n / FPS - 0.03:.3f}:d=0.03,aresample=48000"
        out = f"{WORK}/seg{k:02d}.mkv"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{n / FPS + 0.2:.3f}", "-i", SRC,
             "-vf", vf, "-af", af, "-frames:v", str(n), "-t", f"{n / FPS:.3f}",
             "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
             "-c:a", "pcm_s16le", "-ac", "2", out])
        segs.append(out)
    with open(f"{WORK}/list.txt", "w") as f:
        f.writelines(f"file '{os.path.abspath(s)}'\n" for s in segs)
    af = ("highpass=f=80,afftdn=nr=8:nf=-40,"
          "acompressor=threshold=-20dB:ratio=3:attack=10:release=200:makeup=2,"
          "loudnorm=I=-14:TP=-1:LRA=11,aresample=48000")
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{WORK}/list.txt",
         "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS),
         "-af", af, "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", OUT])
    print(f"wrote {OUT} ({total:.2f}s from 70.82s)")


if __name__ == "__main__":
    main()
