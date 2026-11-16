#!/usr/bin/env python3
"""Bigg Boss Malayalam S8 street review (Bondu folder), YouTube 16:9, no captions, no title/end card, no grade.
Tightens pauses > ~0.45 s, alternates a subtle punch-in at each jump cut, cleans voice audio.
Source read-only: input/bondu/IMG_3819.MOV (4K, stored rotated 180, ffmpeg auto-rotates).
Output: output/bondu_review_v1.mp4"""
import subprocess, sys, os

R = os.path.abspath(os.path.dirname(os.path.abspath(__file__)) + "/../..")
SRC = f"{R}/input/bondu/IMG_3819.MOV"
OUT = f"{R}/output/bondu_review_v1.mp4"
DUR = 79.80
PAD = 0.12      # keep this much silence on each side of a cut
MIN_GAP = 0.45  # only tighten pauses longer than this
ZOOM = 1.08     # punch-in on alternate pieces (16:9 kept)

# silencedetect noise=-32dB d=0.4 on the source audio
SIL = [(1.02, 1.45), (6.48, 6.94), (10.05, 10.65), (13.95, 14.38), (15.73, 16.14), (26.30, 26.80),
       (49.15, 49.75), (56.43, 58.07), (65.52, 65.95), (70.62, 71.23), (73.54, 74.10), (76.56, 77.12)]


def keeps():
    cuts = [(s + PAD, e - PAD) for s, e in SIL if e - s > MIN_GAP]
    out, t = [], 0.0
    for a, b in cuts:
        out.append((t, a))
        t = b
    out.append((t, DUR))
    return out


def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"FAILED: {cmd[:300]}\n{r.stderr[-1500:]}")


def main():
    """One 4K piece at a time (a single big graph runs out of memory), then join and finish."""
    W = f"{R}/work/bondu/pieces"
    os.makedirs(W, exist_ok=True)
    ks = keeps()
    for i, (a, b) in enumerate(ks):
        z = ZOOM if i % 2 else 1.0
        nf = round(b * 30) - round(a * 30)
        run(f'ffmpeg -nostdin -v error -y -ss {a:.3f} -i {SRC} -t {b-a:.3f} '
            f'-vf "fps=30,scale=w=trunc(1920*{z}/2)*2:h=trunc(1080*{z}/2)*2,crop=1920:1080,setsar=1,'
            f'tpad=stop_mode=clone:stop_duration=0.2,trim=end_frame={nf}" '
            f'-af "apad,atrim=0:{nf/30:.4f},afade=t=in:d=0.02,afade=t=out:st={nf/30-0.02:.4f}:d=0.02,aresample=48000" '
            f'-ac 2 -c:v libx264 -preset fast -crf 14 -pix_fmt yuv420p -c:a pcm_s16le {W}/p{i:02d}.mov')
    open(f"{W}/list.txt", "w").write("".join(f"file 'p{i:02d}.mov'\n" for i in range(len(ks))))
    run(f"ffmpeg -nostdin -v error -y -f concat -safe 0 -i {W}/list.txt -c copy {W}/cat.mov")
    total = sum(round(b * 30) - round(a * 30) for a, b in ks) / 30
    af = (f"highpass=f=90,afftdn=nf=-25,equalizer=f=3000:t=q:w=1.2:g=2,"
          f"acompressor=threshold=-20dB:ratio=3:attack=10:release=150:makeup=2,"
          f"afade=t=out:st={total-0.8:.3f}:d=0.8,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000")
    run(f'ffmpeg -nostdin -v error -y -i {W}/cat.mov -vf "fade=t=in:d=0.3,fade=t=out:st={total-0.8:.3f}:d=0.8,'
        f'format=yuv420p" -af "{af}" -c:v libx264 -preset slow -crf 18 -profile:v high -c:a aac -b:a 192k '
        f'-movflags +faststart {OUT}')
    print(f"wrote {OUT}  pieces={len(ks)}  {DUR:.2f}s -> {total:.2f}s")


if __name__ == "__main__":
    main()
