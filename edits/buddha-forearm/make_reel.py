#!/usr/bin/env python3
"""Buddha forearm reel: process montage -> wipe-down -> finished arm -> black on the silence -> hero.

Cuts sit on the soundtrack's bars (123 BPM, librosa beat track). Clips: Drive Edit folder (IMG_8576-8589).
Run from the repo root:  python3 edits/buddha-forearm/make_reel.py
Inputs:  input/reel4/clips/*.MOV, input/reel4/audio/*.mp4   Output: output/buddha_forearm_reel.mp4
"""
import glob, os, subprocess, sys

FPS = 30
W, H = 1080, 1920
SRC = "input/reel4/clips"
AUDIO = "input/reel4/audio/61de736b.mp4"
WORK = "work/buddha-reel"
OUT = "output/buddha_forearm_reel.mp4"
GRADE = "eq=contrast=1.06:saturation=1.08:gamma=0.98"

# (start, end) on the music timeline in seconds, kind, file, source start, speed / zoom
# kind "v" = video clip (speed), "zin"/"zout" = slow zoom on a video clip or photo, "black" = black frame
SHOTS = [
    # process montage: one shot per bar (4 beats at 123 BPM), 1.5x; in points after the dead-start check
    (0.00, 1.97, "v", "IMG_8578.MOV", 2.0, 1.5),    # reference design on the iPad behind the work
    (1.97, 3.97, "v", "IMG_8576.MOV", 3.0, 1.5),    # camera settles at 2.6 s
    (3.97, 5.99, "v", "IMG_8579.MOV", 2.0, 1.5),
    (5.99, 7.80, "v", "IMG_8582.MOV", 2.0, 1.5),
    (7.80, 9.80, "v", "IMG_8583.MOV", 0.5, 1.5),
    (9.80, 11.82, "v", "IMG_8584.MOV", 1.0, 1.5),
    (11.82, 13.63, "v", "IMG_8580.MOV", 0.3, 1.5),  # ends well before the camera jerk at 5.7 s
    (13.63, 15.65, "v", "IMG_8582.MOV", 9.0, 1.5),
    (15.65, 17.65, "v", "IMG_8576.MOV", 10.0, 1.5),
    (17.65, 21.64, "v", "IMG_8585.MOV", 0.0, 1.5),  # wipe-down reveal
    (21.64, 23.66, "v", "IMG_8586.MOV", 0.5, 1.0),  # finished arm
    (23.66, 25.63, "v", "IMG_8588.MOV", 0.5, 1.0),
    (25.63, 27.65, "v", "IMG_8589.MOV", 0.0, 1.0),  # before the camera moves in at 3.3 s
    (27.65, 31.65, "zin", "IMG_8589.MOV", 6.0, 0.06),  # face close-up, slow push-in
    (31.65, 34.92, "v", "IMG_8587.MOV", 0.3, 1.0),
    (34.92, 35.34, "black", None, 0, 0),             # the track's silence
    (35.34, 37.15, "zout", "IMG_8589.MOV", 10.5, 0.12),  # hero on the final hit
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
