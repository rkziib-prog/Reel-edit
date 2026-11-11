#!/usr/bin/env python3
"""Arjuna/Krishna forearm sleeve reel (v1): hook -> lining -> shading -> wipe -> reveal.
Sources read-only in input/tattoo2/. Scratch in work/tattoo2/build/. Output output/tattoo2_reel_v1*.mp4.
Music: input/tattoo2/audio/track.mp4 (0-24 s; beats ~92 BPM, drop 5.18 s)."""
import subprocess, os, sys

R = os.path.dirname(os.path.abspath(__file__)) + "/../.."
CL = f"{R}/input/tattoo2/clips"
W = f"{R}/work/tattoo2/build"
os.makedirs(W, exist_ok=True)
FPS = 30
NOGRADE = "--nograde" in sys.argv          # v2+: user wants the original camera colour
VER = "v2" if NOGRADE else "v1"
FONT = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"

GRADE = ("huesaturation=colors=b:saturation=-0.85:intensity=-0.35:strength=60,"
         "eq=contrast=1.12:saturation=1.06:gamma=0.97,"
         "curves=all='0/0 0.12/0.06 0.5/0.5 0.88/0.94 1/1',"
         "colorbalance=rs=-0.04:bs=0.05:rh=0.03:bh=-0.03,unsharp=5:5:0.5")

# (clip, src_in, reel_start, reel_end, speed, motion)
# motion: punch = beat zoom-in decaying, push = slow push-in, none
CUTS = [
    ("7453", 6.6, 0.00, 1.37, 1.0, "push"),    # HOOK: finished archer under studio light
    ("7417", 0.5, 1.37, 2.58, 2.0, "punch"),   # lining
    ("7419", 2.0, 2.58, 3.83, 2.0, "punch"),
    ("7427", 0.0, 3.83, 4.44, 2.0, "punch"),
    ("7424", 3.0, 4.44, 4.74, 1.0, "punch"),   # flicker build
    ("7425", 2.0, 4.74, 4.96, 1.0, "punch"),
    ("7426", 5.0, 4.96, 5.18, 1.0, "punch"),
    ("7424", 11.0, 5.18, 6.41, 3.0, "punch"),  # DROP: shading
    ("7425", 4.0, 6.41, 7.66, 3.0, "punch"),
    ("7426", 8.0, 7.66, 8.96, 3.0, "punch"),
    ("7424", 15.5, 8.96, 10.40, 2.0, "punch"),
    ("7430", 2.0, 10.40, 12.59, 4.0, "none"),  # foam wipe
    ("7432", 1.0, 12.59, 13.93, 3.0, "none"),  # glove wipe
    ("7431", 7.5, 13.93, 14.58, 1.0, "push"),  # clean arm
    ("7434", 5.0, 14.58, 18.60, 1.0, "push"),  # REVEAL
    ("7453", 8.0, 18.60, 24.00, 0.8, "push"),
]
END = 24.0
# per-clip fixes after the shared grade: tame orange skin, keep reveal highlights
FIX = {"7417": "eq=saturation=0.85", "7419": "eq=saturation=0.85", "7427": "eq=saturation=0.85",
       "7430": "eq=saturation=0.85", "7431": "eq=saturation=0.85", "7432": "eq=saturation=0.85"}
FIX_SEG = {15: "eq=gamma=0.88:contrast=1.06:saturation=0.95", 14: "eq=gamma=0.94"}
FLASHES = [(1.37, 0.20, 0.9), (5.18, 0.22, 1.0), (10.40, 0.15, 0.5), (14.58, 0.30, 1.0), (18.60, 0.18, 0.6)]
LEAKS = [1.30, 5.10, 14.50, 18.55]                 # orange light-leak sweeps
WHOOSH = [1.30, 2.50, 3.75, 10.30, 12.50, 18.50]
BOOM = [0.0, 5.18, 14.58]
RISER = (3.83, 5.18)


def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"FAILED: {cmd}\n{r.stderr[-1500:]}")


def segments():
    for i, (c, src, a, b, sp, mo) in enumerate(CUTS):
        d = b - a
        nf = round(b * FPS) - round(a * FPS)          # exact frames, no drift
        if mo == "punch":
            z = "1+0.10*exp(-t*9)"
        elif mo == "push":
            z = f"1+0.10*t/{d:.3f}"
        else:
            z = "1"
        vf = (f"setpts=(PTS-STARTPTS)/{sp},fps={FPS},scale=1080:1920,"
              f"scale=w='trunc(1080*({z})/2)*2':h=-2:eval=frame,crop=1080:1920,{'null' if NOGRADE else GRADE + ',' + FIX_SEG.get(i, FIX.get(c, 'null'))},"
              f"tpad=stop_mode=clone:stop_duration=1,trim=end_frame={nf},setsar=1")
        af = f"asetpts=PTS-STARTPTS,atempo={sp}" if sp >= 0.5 else "asetpts=PTS-STARTPTS"
        if sp > 2:
            af = f"asetpts=PTS-STARTPTS,atempo=2,atempo={sp/2}"
        run(f'ffmpeg -nostdin -v error -y -ss {src} -t {d*sp+0.5:.3f} -i {CL}/IMG_{c}.mov '
            f'-vf "{vf}" -af "{af},apad,atrim=0:{nf/FPS:.4f},aresample=48000" -ac 2 '
            f'-c:v libx264 -preset fast -crf 14 -pix_fmt yuv420p -c:a pcm_s16le {W}/s{i:02d}.mov')
        print("seg", i, c, f"{a:.2f}-{b:.2f}")


def assets():
    # orange radial light leak (alpha = soft blob from the right edge)
    run(f'ffmpeg -nostdin -v error -y -f lavfi -i color=c={'0xfff4e8' if NOGRADE else '0xff7a1a'}:s=1080x1920:d=1 -vf "format=rgba,'
        f"geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*exp(-((X-1150)*(X-1150)+(Y-700)*(Y-700))/(2*420*420))'\" "
        f'-frames:v 1 {W}/leak.png')
    # SFX synthesised with ffmpeg (stereo 48k)
    run(f'ffmpeg -nostdin -v error -y -f lavfi -i "anoisesrc=d=0.6:c=pink:a=0.9" -af "bandpass=f=1200:w=1600,'
        f"volume='sin(PI*t/0.6)^2':eval=frame,afade=t=out:st=0.4:d=0.2,aresample=48000\" -ac 2 {W}/whoosh.wav")
    run(f'ffmpeg -nostdin -v error -y -f lavfi -i "sine=f=55:d=1.4" -f lavfi -i "anoisesrc=d=0.25:c=brown:a=0.8" '
        f'-filter_complex "[0]volume=\'exp(-t*3.5)\':eval=frame[a];[1]lowpass=f=300,afade=t=out:st=0.05:d=0.2[b];'
        f'[a][b]amix=2:normalize=0,volume=2.2,aresample=48000" -ac 2 {W}/boom.wav')
    rd = RISER[1] - RISER[0]
    run(f'ffmpeg -nostdin -v error -y -f lavfi -i "anoisesrc=d={rd}:c=white:a=0.5" -af "highpass=f=800,'
        f"volume='pow(t/{rd},2.5)':eval=frame,aresample=48000\" -ac 2 {W}/riser.wav")


def assemble(tag, with_music):
    n = len(CUTS)
    lst = f"{W}/list.txt"
    open(lst, "w").write("".join(f"file 's{i:02d}.mov'\n" for i in range(n)))
    run(f"ffmpeg -nostdin -v error -y -f concat -safe 0 -i {lst} -c copy {W}/cat.mov")

    bright = "+".join(f"if(between(t,{s},{s+d}),{p}*(1-(t-{s})/{d}),0)" for s, d, p in FLASHES)
    leak_in = " ".join(f"-loop 1 -t 0.7 -i {W}/leak.png" for _ in LEAKS)
    k = 1 + len(LEAKS)
    fc = [f"[0:v]eq=brightness='{bright}':eval=frame[v0]"]
    last = "v0"
    for j, t in enumerate(LEAKS):
        fc.append(f"[{1+j}:v]format=rgba,fade=t=in:st=0:d=0.15:alpha=1,fade=t=out:st=0.3:d=0.4:alpha=1,"
                  f"setpts=PTS+{t}/TB[l{j}]")
        fc.append(f"[{last}][l{j}]overlay=eof_action=pass:format=auto[v{j+1}]")
        last = f"v{j+1}"
    alpha = "alpha='if(lt(t,0.12),t/0.12,if(lt(t,1.2),1,max(0,(1.37-t)/0.17)))':enable='lt(t,1.37)'"
    line = ("drawtext=fontfile=%s:text='%%s':fontsize=118:fontcolor=white:x=(w-text_w)/2:y=%%s:"
            "shadowcolor=black@0.75:shadowx=0:shadowy=5:" % FONT) + alpha
    txt = (line % ("WAIT FOR", "h*0.17")) + "," + (line % ("THE REVEAL", "h*0.17+140"))
    fc.append(f"[{last}]rgbashift=rh=-14:bh=14:enable='between(t,1.17,1.37)+between(t,5.18,5.28)',"
              f"{txt},{'null' if NOGRADE else 'vignette=PI/5,noise=alls=5:allf=t'},fade=t=out:st={END-0.6}:d=0.6,format=yuv420p[vout]")

    # audio: music + needle bed (process clips, low) + sfx
    sfx_in, mixes = [], []
    idx = k + 1
    def add(f, t, vol):
        nonlocal idx
        sfx_in.append(f"-i {W}/{f}")
        ms = int(t * 1000)
        mixes.append(f"[{idx}:a]volume={vol},adelay={ms}|{ms}[x{idx}]")
        idx += 1
    for t in WHOOSH: add("whoosh.wav", t, 0.35)
    for t in BOOM: add("boom.wav", t, 0.55)
    add("riser.wav", RISER[0], 0.25)
    labels = "".join(f"[x{i}]" for i in range(k + 1, idx))
    music = (f"[{k}:a]atrim=0:{END},afade=t=out:st={END-1.2}:d=1.2,volume=1.0[mu];" if with_music
             else "anullsrc=r=48000:cl=stereo,atrim=0:%s[mu];" % END)
    fa = (music + "[0:a]highpass=f=150,volume=0.35,afade=t=out:st=14.2:d=0.4[bed];" + ";".join(mixes) + ";"
          + f"[mu][bed]{labels}amix={2+len(mixes)}:normalize=0:duration=first,"
          + ("loudnorm=I=-14:TP=-1:LRA=11" if with_music else "alimiter=limit=0.7") + ",aresample=48000[aout]")
    music_in = f"-i {R}/input/tattoo2/audio/track.mp4"
    out = f"{R}/output/tattoo2_reel_{VER}{tag}.mp4"
    run(f'ffmpeg -nostdin -v error -y -i {W}/cat.mov {leak_in} {music_in} {" ".join(sfx_in)} '
        f'-filter_complex "{";".join(fc)};{fa}" -map "[vout]" -map "[aout]" -t {END} '
        f'-c:v libx264 -preset slow -crf 21 -profile:v high -r {FPS} -c:a aac -b:a 160k -movflags +faststart {out}')
    print("wrote", out)


if __name__ == "__main__":
    if "--skip-seg" not in sys.argv:
        segments()
    assets()
    assemble("", True)
    assemble("_nomusic", False)
