#!/usr/bin/env python3
"""Tattoo backpiece reel: process montage -> first look -> wipe-down -> beat-cut reveal -> hero.

Cuts sit on the soundtrack's beats (152 BPM, librosa beat track of the "Audio file" track).
Run from the repo root:  python3 edits/tattoo-backpiece/make_reel.py
Inputs:  input/Reel edit/*.MOV|JPG, input/Audio file/*.MP4   Output: output/tattoo_reel.mp4
"""
import glob, os, subprocess, sys

FPS = 30
W, H = 1080, 1920
SRC = "input/Reel edit"
AUDIO = glob.glob("input/Audio file/*.MP4")[0]
WORK = "work/tattoo-reel"
OUT = "output/tattoo_reel.mp4"
GRADE = "eq=contrast=1.06:saturation=1.08:gamma=0.98"

# (start, end) on the music timeline in seconds, kind, file, source start, speed / zoom
# kind "v" = video clip (speed), "zin"/"zout" = slow zoom on a video clip or photo, "black" = black frame
SHOTS = [
    (0.00, 1.76, "v", "IMG_8484.MOV", 1.0, 1.5),   # outline, blue light
    (1.76, 3.32, "v", "IMG_8485.MOV", 2.0, 1.5),
    (3.32, 4.88, "v", "IMG_8494.MOV", 0.5, 1.5),
    (4.88, 6.43, "v", "IMG_8495.MOV", 2.0, 1.5),
    (6.43, 8.01, "v", "IMG_8496.MOV", 2.0, 1.5),
    (8.01, 9.54, "v", "IMG_8497.MOV", 2.0, 1.5),
    (9.54, 11.12, "v", "IMG_8498.MOV", 1.5, 1.5),
    (11.12, 12.68, "v", "IMG_8499.MOV", 3.0, 1.5),
    (12.68, 14.23, "v", "IMG_8500.MOV", 3.0, 1.5),
    (14.23, 15.79, "v", "IMG_8501.MOV", 3.0, 1.5),
    (15.79, 18.90, "v", "IMG_8503.MOV", 1.0, 2.0),   # one 8-beat shot (two cuts of it looked like a glitch)
    (18.90, 22.04, "zin", "IMG_8502.MOV", 0.5, 0.08),  # first full look, slow push-in
    (22.04, 23.59, "zin", "IMG_8504.JPG", 0, 0.06),
    (23.59, 25.15, "zin", "IMG_8506.JPG", 0, 0.06),
    (25.15, 29.02, "v", "IMG_8507.MOV", 0.0, 2.0),   # wipe-down over the breakdown
    (29.02, 29.81, "v", "IMG_8508.MOV", 1.0, 1.0),   # reveal cuts on the hits
    (29.81, 30.60, "v", "IMG_8509.MOV", 1.0, 1.0),
    (30.60, 31.37, "v", "IMG_8510.MOV", 1.5, 1.0),
    (31.37, 32.14, "v", "IMG_8511.MOV", 1.5, 1.0),
    (32.14, 32.75, "v", "IMG_8512.MOV", 1.5, 1.0),
    (32.75, 33.13, "black", None, 0, 0),             # the track's half-second of silence
    (33.13, 34.92, "zout", "IMG_8505.JPG", 0, 0.10), # hero on the last hit
]


def frames(t):
    return round(t * FPS)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(cmd)}\n{r.stderr[-2000:]}")


def segment(i, shot):
    t0, t1, kind, name, ss, arg = shot
    n = frames(t1) - frames(t0)
    out = f"{WORK}/seg{i:02d}.mp4"
    enc = ["-frames:v", str(n), "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "16",
           "-pix_fmt", "yuv420p", "-r", str(FPS), out]
    fit = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"
    if kind == "black":
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=black:s={W}x{H}:r={FPS}"] + enc)
    elif kind == "v":
        src_dur = n / FPS * arg + 0.5
        vf = f"setpts=PTS/{arg},fps={FPS},{fit},{GRADE}"
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-t", str(src_dur), "-i", f"{SRC}/{name}",
             "-vf", vf] + enc)
    else:  # zin / zout: zoompan from a 2x canvas for smooth sub-pixel motion
        z = f"1+{arg}*on/{n}" if kind == "zin" else f"{1 + arg}-{arg}*on/{n}"
        big = f"scale={2 * W}:{2 * H}:force_original_aspect_ratio=increase,crop={2 * W}:{2 * H},setsar=1"
        zp = (f"zoompan=z='{z}':d={1 if name.endswith('.MOV') else n}:x='iw/2-(iw/zoom/2)':"
              f"y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS}")
        if name.endswith(".MOV"):
            inp = ["-ss", str(ss), "-t", str(n / FPS + 0.5), "-i", f"{SRC}/{name}"]
            vf = f"fps={FPS},{big},{zp},{GRADE}"
        else:
            inp = ["-i", f"{SRC}/{name}"]
            vf = f"{big},{zp},{GRADE}"
        run(["ffmpeg", "-v", "error", "-y"] + inp + ["-vf", vf] + enc)
    return out


def main():
    os.makedirs(WORK, exist_ok=True)
    os.makedirs("output", exist_ok=True)
    segs = [segment(i, s) for i, s in enumerate(SHOTS)]
    with open(f"{WORK}/list.txt", "w") as f:
        f.writelines(f"file '{os.path.abspath(s)}'\n" for s in segs)
    end = SHOTS[-1][1]
    af = (f"atrim=0:{end},afade=t=out:st={end - 0.25}:d=0.25,"
          "loudnorm=I=-14:TP=-1:LRA=11,aresample=48000")
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{WORK}/list.txt",
         "-i", AUDIO, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "19",
         "-pix_fmt", "yuv420p", "-r", str(FPS), "-af", af, "-c:a", "aac", "-b:a", "160k",
         "-t", str(end), "-movflags", "+faststart", OUT])
    print("wrote", OUT)


if __name__ == "__main__":
    main()
