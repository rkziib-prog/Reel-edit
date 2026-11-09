#!/usr/bin/env python3
"""Ring-light unboxing reel ("Reel edit 2"): a talking-head story cut on her own voice.

Hook -> box arrives -> unbox -> Halo ring light reveal -> assembly -> light on -> modes -> verdict ->
recommendation with her friend -> bye. Every in/out point is snapped to the quietest 10 ms of speech
near the planned time, so no cut lands mid-word. Alternate shots are punched in (zoom) to hide jump cuts.
Run from the repo root:  python3 edits/ring-light-unboxing/make_reel.py
Inputs: input/Reel edit 2/*.mov   Output: output/ring_light_reel.mp4
"""
import os, subprocess, sys
import numpy as np

FPS, W, H = 30, 1080, 1920
SRC = "input/Reel edit 2"
WORK = "work/ring-light-reel"
OUT = "output/ring_light_reel.mp4"
GRADE = "eq=contrast=1.04:saturation=1.06"

# (clip, planned in, planned out, zoom)   zoom 1.0 = full frame, >1 = punch-in
SHOTS = [
    ("IMG_3029", 0.00, 3.46, 1.00),   # hook: excited reaction
    ("IMG_3031", 7.90, 10.44, 1.00),  # "let's unbox"
    ("IMG_3032", 4.40, 6.50, 1.00),   # "so, let's open it"
    ("IMG_3032", 30.40, 36.30, 1.12), # "guys, it's the most beautiful thing ..."
    ("IMG_3032", 38.50, 40.20, 1.00), # "... it's the ring light"
    ("IMG_3034", 15.50, 18.50, 1.00), # tripod comes out
    ("IMG_3034", 39.50, 46.00, 1.10), # ring light assembled
    ("IMG_3035", 0.00, 1.80, 1.00),   # light on: "so this is it, it's very good"
    ("IMG_3035", 5.60, 12.30, 1.00),  # three modes, the room changes colour
    ("IMG_3035", 17.20, 20.50, 1.12), # "I'm so happy ... satisfied customer"
    ("IMG_3041", 0.00, 8.90, 1.00),   # recommendation with her friend
    ("IMG_3041", 18.80, 19.60, 1.10), # "bye"
]
SNAP = 0.20  # seconds either side of a planned point to search for the quietest moment


def run(cmd, capture=False):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(cmd)}\n{r.stderr.decode()[-2000:]}")
    return r.stdout


def duration(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]))


def rms_10ms(path):
    raw = run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"])
    a = np.frombuffer(raw, np.int16).astype(np.float32)
    n = len(a) // 160
    return np.sqrt((a[: n * 160].reshape(n, 160) ** 2).mean(1) + 1e-9)


def snap(rms, t, lo, hi):
    i0, i1 = max(int((t - SNAP) * 100), int(lo * 100)), min(int((t + SNAP) * 100), int(hi * 100))
    if i1 <= i0:
        return t
    return (i0 + int(np.argmin(rms[i0:i1]))) / 100


def main():
    os.makedirs(WORK, exist_ok=True)
    os.makedirs("output", exist_ok=True)
    cache, segs, total = {}, [], 0.0
    for k, (clip, t0, t1, zoom) in enumerate(SHOTS):
        path = f"{SRC}/{clip}.mov"
        if path not in cache:
            cache[path] = (rms_10ms(path), duration(path))
        rms, dur = cache[path]
        a = snap(rms, t0, 0, dur) if t0 > 0 else 0.0
        b = snap(rms, t1, a + 0.5, dur)
        n = round((b - a) * FPS)
        total += n / FPS
        print(f"{k:2d} {clip} {a:6.2f}-{b:6.2f}  ({n / FPS:.2f}s, zoom {zoom})")
        zw, zh = round(W * zoom / 2) * 2, round(H * zoom / 2) * 2
        vf = (f"fps={FPS},scale={zw}:{zh}:force_original_aspect_ratio=increase,"
              f"crop={W}:{H},setsar=1,{GRADE}")
        af = f"afade=t=in:d=0.03,afade=t=out:st={n / FPS - 0.04:.3f}:d=0.04,aresample=48000"
        out = f"{WORK}/seg{k:02d}.mkv"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{n / FPS + 0.2:.3f}", "-i", path,
             "-vf", vf, "-af", af, "-frames:v", str(n), "-t", f"{n / FPS:.3f}",
             "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
             "-c:a", "pcm_s16le", "-ac", "2", out])
        segs.append(out)
    with open(f"{WORK}/list.txt", "w") as f:
        f.writelines(f"file '{os.path.abspath(s)}'\n" for s in segs)
    af = ("highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=10:release=200:makeup=2,"
          "loudnorm=I=-14:TP=-1:LRA=11,aresample=48000")
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{WORK}/list.txt",
         "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-r", str(FPS),
         "-af", af, "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", OUT])
    print(f"wrote {OUT} ({total:.2f}s)")


if __name__ == "__main__":
    main()
