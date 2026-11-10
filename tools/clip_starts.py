#!/usr/bin/env python3
"""Find dead starts in raw clips (camera rolling before the work begins) so they can be trimmed.

For each clip it writes a timestamped strip of the opening seconds (work/starts/<clip>.jpg) to look at, and
measures camera motion (phase correlation between downscaled frames) to suggest when the shot has settled:
the first moment after which the camera stays steady for STEADY seconds. The suggestion is a starting point;
confirm it against the strip (is the needle on skin / is the work happening?) before cutting.

Usage: python3 tools/clip_starts.py <clip or folder> [...] [--seconds 8]
"""
import argparse, glob, json, os, subprocess
import cv2
import numpy as np

STEADY = 1.0     # seconds the camera must stay steady
SHAKE_PX = 6.0   # global shift per 1/10 s (at 270 px wide) above which the camera counts as moving
STEP = 0.1


def frames(path, seconds, width=270):
    cmd = ["ffmpeg", "-v", "error", "-t", str(seconds), "-i", path, "-vf", f"fps={1 / STEP},scale={width}:-2,format=gray",
           "-f", "rawvideo", "-"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    # frame height after ffmpeg applies the clip's rotation, read from one decoded frame
    one = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-frames:v", "1", "-vf", f"scale={width}:-2", "-f", "image2pipe",
                          "-vcodec", "png", "-"], capture_output=True).stdout
    h = cv2.imdecode(np.frombuffer(one, np.uint8), cv2.IMREAD_GRAYSCALE).shape[0]
    n = len(raw) // (width * h)
    return np.frombuffer(raw[: n * width * h], np.uint8).reshape(n, h, width).astype(np.float32)


def analyse(path, seconds):
    f = frames(path, seconds)
    win = cv2.createHanningWindow(f.shape[1:][::-1], cv2.CV_32F)
    shift = [0.0] + [float(np.hypot(*cv2.phaseCorrelate(f[i - 1], f[i], win)[0])) for i in range(1, len(f))]
    need = int(STEADY / STEP)
    settle = None
    for i in range(len(shift) - need):
        if max(shift[i + 1:i + 1 + need]) < SHAKE_PX:
            settle = round(i * STEP, 1)
            break
    name = os.path.splitext(os.path.basename(path))[0]
    os.makedirs("work/starts", exist_ok=True)
    strip = f"work/starts/{name}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-t", str(seconds), "-i", path, "-vf",
                    "fps=2,scale=-2:220,drawtext=text='%{pts\\:flt}':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black,"
                    f"tile={int(seconds * 2)}x1", "-frames:v", "1", strip], check=True)
    motion = "".join("#" if s >= SHAKE_PX * 2 else "+" if s >= SHAKE_PX else "." for s in shift)
    return {"clip": path, "settles_at": settle, "strip": strip, "motion_per_0.1s": motion}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--seconds", type=float, default=8)
    a = ap.parse_args()
    clips = []
    for p in a.paths:
        clips += sorted(glob.glob(os.path.join(p, "*"))) if os.path.isdir(p) else [p]
    clips = [c for c in clips if c.lower().endswith((".mov", ".mp4", ".m4v"))]
    out = [analyse(c, a.seconds) for c in clips]
    for r in out:
        print(f"{os.path.basename(r['clip']):16s} settles at {r['settles_at']}s  {r['motion_per_0.1s']}")
    json.dump(out, open("work/starts/report.json", "w"), indent=1)


if __name__ == "__main__":
    main()
