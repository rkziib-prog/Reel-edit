#!/usr/bin/env python3
"""Sleeve reel v3: before/after hook, a cut on every beat, whip/zoom/flash transitions, shake on hits.
No colour grade (user, 11 Nov). Sources read-only in input/tattoo2/. Scratch work/tattoo2/v3/.
Output output/tattoo2_reel_v3.mp4 (+ _nomusic). Music beats ~92 BPM, drop 5.18 s."""
import subprocess, os, sys

R = os.path.abspath(os.path.dirname(os.path.abspath(__file__)) + "/../..")
CL = f"{R}/input/tattoo2/clips"
W = f"{R}/work/tattoo2/v3"
os.makedirs(W, exist_ok=True)
FPS = 30
FONT = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
END = 24.0

# (clip, src at segment start, speed, motion, transition INTO the next segment)
# cut times = beats; transitions: whipL/whipR/whipU/whipD, zoom, flash, cut
CUTS = [0.74, 1.37, 1.97, 2.58, 3.25, 3.83, 4.44, 4.74, 4.96, 5.18, 5.78, 6.41, 7.01, 7.66, 8.31,
        8.96, 9.68, 10.40, 11.12, 11.87, 12.59, 13.28, 13.93, 14.58, 16.58, 18.60, 20.60]
SEGS = [
    ("7417", 0.3, 1.0, "push", "flash"),   # HOOK: stencil  "FROM THIS"
    ("7453", 6.8, 1.0, "shake", "zoom"),   # HOOK: finished "TO THIS"
    ("7417", 2.0, 2.0, "punch", "whipL"),  # lining
    ("7419", 1.0, 2.0, "punch", "whipU"),
    ("7427", 1.5, 2.0, "punch", "zoom"),
    ("7419", 7.0, 2.0, "punch", "whipR"),
    ("7417", 3.5, 1.5, "punch", "cut"),
    ("7424", 3.0, 1.0, "punch", "cut"),    # build flicker
    ("7425", 2.0, 1.0, "punch", "cut"),
    ("7426", 5.0, 1.0, "punch", "flash"),
    ("7424", 11.0, 3.0, "shake", "whipL"), # DROP: shading
    ("7426", 13.0, 3.0, "punch", "zoom"),
    ("7425", 4.0, 3.0, "punch", "whipU"),
    ("7424", 15.0, 3.0, "punch", "whipR"),
    ("7426", 8.0, 3.0, "punch", "zoom"),
    ("7425", 7.0, 2.0, "punch", "whipD"),
    ("7424", 17.5, 2.0, "punch", "whipL"),
    ("7426", 10.5, 2.0, "punch", "zoom"),
    ("7430", 0.5, 2.0, "punch", "whipU"),  # foam wipe
    ("7430", 3.0, 3.0, "none", "whipR"),
    ("7430", 6.0, 3.0, "none", "zoom"),
    ("7431", 1.0, 3.0, "none", "whipL"),   # glove wipes
    ("7432", 2.5, 3.0, "none", "cut"),
    ("7431", 7.5, 1.0, "push", "flash"),   # clean arm
    ("7434", 5.0, 1.0, "shake", "whipU"),  # REVEAL
    ("7434", 14.6, 1.0, "push", "zoom"),
    ("7453", 7.6, 1.0, "push", "whipR"),
    ("7453", 9.0, 0.75, "push", None),
]
assert len(SEGS) == len(CUTS) + 1
# transition lengths in whole frames (all timing is frame-exact so the xfade chain never drifts)
TDF = {"whipL": 4, "whipR": 4, "whipU": 4, "whipD": 4, "zoom": 1, "flash": 6, "cut": 1}
TD = {k: v / FPS for k, v in TDF.items()}
XF = {"whipL": "slideleft", "whipR": "slideright", "whipU": "slideup", "whipD": "slidedown",
      "zoom": "fade", "flash": "fadewhite", "cut": "fade"}
BOOM = [0.74, 5.18, 14.58]
RISER = (3.83, 5.18)


def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"FAILED: {cmd[:400]}\n{r.stderr[-2000:]}")


def bounds():
    """Frame-exact [a, b] per segment: [prev cut - d/2, next cut + d/2] so xfades centre on the beat."""
    C = [round(t * FPS) for t in CUTS]
    out = []
    for i in range(len(SEGS)):
        a = 0 if i == 0 else C[i - 1] - TDF[SEGS[i - 1][4]] // 2
        b = round(END * FPS) if i == len(SEGS) - 1 else C[i] + TDF[SEGS[i][4]] - TDF[SEGS[i][4]] // 2
        out.append((a / FPS, b / FPS))
    return out


def xoffset(i):
    return (round(CUTS[i] * FPS) - TDF[SEGS[i][4]] // 2) / FPS


def segments():
    for i, ((c, src, sp, mo, _), (a, b)) in enumerate(zip(SEGS, bounds())):
        d = b - a
        nf = round(b * FPS) - round(a * FPS)
        z = {"punch": "1+0.14*exp(-t*11)", "push": f"1+0.08*t/{d:.3f}", "shake": "1.06", "none": "1"}[mo]
        shake = ""
        if mo == "shake":
            shake = (",crop=1080:1920:x='(iw-ow)/2+34*exp(-t*7)*sin(t*71)':"
                     "y='(ih-oh)/2+34*exp(-t*7)*cos(t*83)'")
        vf = (f"setpts=(PTS-STARTPTS)/{sp},fps={FPS},scale=1080:1920,"
              f"scale=w='trunc(1080*({z})/2)*2+{'64' if mo == 'shake' else '0'}':h=-2:eval=frame{shake},"
              f"crop=1080:1920,tpad=stop_mode=clone:stop_duration=1,trim=end_frame={nf},setsar=1")
        run(f'ffmpeg -nostdin -v error -y -ss {src} -t {d*sp+0.5:.3f} -i {CL}/IMG_{c}.mov -vf "{vf}" -an '
            f'-c:v libx264 -preset fast -crf 14 -pix_fmt yuv420p {W}/s{i:02d}.mov')
        print("seg", i, c, f"{a:.2f}-{b:.2f}", flush=True)


def assets():
    run(f'ffmpeg -nostdin -v error -y -f lavfi -i "anoisesrc=d=0.6:c=pink:a=0.9" -af "bandpass=f=1200:w=1600,'
        f"volume='sin(PI*t/0.6)^2':eval=frame,afade=t=out:st=0.4:d=0.2,aresample=48000\" -ac 2 {W}/whoosh.wav")
    run(f'ffmpeg -nostdin -v error -y -f lavfi -i "sine=f=55:d=1.4" -f lavfi -i "anoisesrc=d=0.25:c=brown:a=0.8" '
        f'-filter_complex "[0]volume=\'exp(-t*3.5)\':eval=frame[a];[1]lowpass=f=300,afade=t=out:st=0.05:d=0.2[b];'
        f'[a][b]amix=2:normalize=0,volume=2.2,aresample=48000" -ac 2 {W}/boom.wav')
    rd = RISER[1] - RISER[0]
    run(f'ffmpeg -nostdin -v error -y -f lavfi -i "anoisesrc=d={rd}:c=white:a=0.5" -af "highpass=f=800,'
        f"volume='pow(t/{rd},2.5)':eval=frame,aresample=48000\" -ac 2 {W}/riser.wav")


def video():
    n = len(SEGS)
    ins = " ".join(f"-i {W}/s{i:02d}.mov" for i in range(n))
    fc, last = [], "0:v"
    for i in range(n - 1):
        t = SEGS[i][4]
        off = xoffset(i)
        fc.append(f"[{last}][{i+1}:v]xfade=transition={XF[t]}:duration={TD[t]:.6f}:offset={off:.6f}[x{i}]")
        last = f"x{i}"
    # motion blur on whips, radial-ish blur on zooms, RGB split on the hits
    post = []
    for i in range(n - 1):
        t, T = SEGS[i][4], CUTS[i]
        if t.startswith("whip"):
            ang = 0 if t in ("whipL", "whipR") else 90
            post.append(f"dblur=angle={ang}:radius=60:enable='between(t,{T-0.09:.3f},{T+0.09:.3f})'")
        elif t == "zoom":
            post.append(f"gblur=sigma=18:enable='between(t,{T-0.05:.3f},{T+0.07:.3f})'")
    hits = "+".join(f"between(t,{b},{b+0.12})" for b in BOOM)
    post.append(f"rgbashift=rh=-16:bh=16:enable='{hits}'")
    line = ("drawtext=fontfile=%s:text='%%s':fontsize=124:fontcolor=white:x=(w-text_w)/2:y=h*0.18:"
            "shadowcolor=black@0.75:shadowx=0:shadowy=5:enable='%%s'" % FONT)
    post.append(line % ("FROM THIS", "lt(t,0.74)"))
    post.append(line % ("TO THIS", "between(t,0.74,1.37)"))
    post.append(f"fade=t=out:st={END-0.6}:d=0.6,format=yuv420p")
    fc.append(f"[{last}]" + ",".join(post) + "[vout]")
    run(f'ffmpeg -nostdin -v error -y {ins} -filter_complex "{";".join(fc)}" -map "[vout]" -t {END} '
        f'-c:v libx264 -preset fast -crf 14 -pix_fmt yuv420p {W}/video.mov')


def bed():
    """Needle buzz bed: each clip's own audio for its on-screen part, sped to match."""
    parts = []
    for i, ((c, src, sp, _, _), (a, b)) in enumerate(zip(SEGS, bounds())):
        s0 = 0.0 if i == 0 else CUTS[i - 1]
        s1 = END if i == len(SEGS) - 1 else CUTS[i]
        tempo = f"atempo=2,atempo={sp/2}" if sp > 2 else f"atempo={sp}"
        p = f"{W}/a{i:02d}.wav"
        run(f'ffmpeg -nostdin -v error -y -ss {src + (s0 - a) * sp:.3f} -t {(s1 - s0) * sp + 0.2:.3f} '
            f'-i {CL}/IMG_{c}.mov -vn -af "{tempo},apad,atrim=0:{s1 - s0:.4f},aresample=48000" -ac 2 {p}')
        parts.append(p)
    open(f"{W}/alist.txt", "w").write("".join(f"file '{p}'\n" for p in parts))
    run(f"ffmpeg -nostdin -v error -y -f concat -safe 0 -i {W}/alist.txt -c copy {W}/bed.wav")


def mux(tag, with_music):
    sfx, mixes, idx = [], [], 3
    def add(f, t, vol):
        nonlocal idx
        ms = max(0, int(t * 1000))
        sfx.append(f"-i {W}/{f}")
        mixes.append(f"[{idx}:a]volume={vol},adelay={ms}|{ms}[x{idx}]")
        idx += 1
    for i, t in enumerate(CUTS):
        tr = SEGS[i][4]
        if tr.startswith("whip") or tr == "zoom":
            add("whoosh.wav", t - 0.3, 0.28 if tr == "zoom" else 0.34)
    for t in BOOM: add("boom.wav", t, 0.6)
    add("riser.wav", RISER[0], 0.25)
    labels = "".join(f"[x{i}]" for i in range(3, idx))
    music = (f"[1:a]atrim=0:{END},afade=t=out:st={END-1.2}:d=1.2[mu];" if with_music
             else f"anullsrc=r=48000:cl=stereo,atrim=0:{END}[mu];")
    fa = (music + f"[2:a]highpass=f=150,volume=0.3,afade=t=out:st=14.3:d=0.4[bd];" + ";".join(mixes)
          + f";[mu][bd]{labels}amix={2 + len(mixes)}:normalize=0:duration=first,"
          + ("loudnorm=I=-14:TP=-1:LRA=11" if with_music else "alimiter=limit=0.7") + ",aresample=48000[aout]")
    out = f"{R}/output/tattoo2_reel_v3{tag}.mp4"
    run(f'ffmpeg -nostdin -v error -y -i {W}/video.mov -i {R}/input/tattoo2/audio/track.mp4 -i {W}/bed.wav '
        f'{" ".join(sfx)} -filter_complex "{fa}" -map 0:v -map "[aout]" -t {END} -c:v libx264 -preset slow '
        f'-crf 20 -profile:v high -r {FPS} -c:a aac -b:a 160k -movflags +faststart {out}')
    print("wrote", out)


if __name__ == "__main__":
    if "--skip-seg" not in sys.argv:
        segments()
    assets()
    video()
    bed()
    mux("", True)
    mux("_nomusic", False)
