#!/usr/bin/env python3
"""English subtitles for the Zkinwill review reel, burned in reel-style plus an .srt sidecar.

The speech is Malayalam. Whisper large-v3 cannot write Malayalam script (it emits Gurmukhi), so these are its
Malayalam->English translation (timings from the translate pass, work/subs/en.json), hand-corrected where the
recognition was plainly wrong (see the notes on LINES). Lines marked CHECK should be confirmed by the speaker.
Run from the repo root:  python3 edits/zkinwill-review/subtitles.py
Input: output/zkinwill_review_reel.mp4   Outputs: output/zkinwill_review_reel_subtitled.mp4, .srt
"""
import os, subprocess, sys

SRC = "output/zkinwill_review_reel.mp4"
OUT = "output/zkinwill_review_reel_subtitled.mp4"
SRT = "output/zkinwill_review_reel.en.srt"
ASS = "work/subs/zkinwill.ass"
MAX_WORDS = 4

# (start, end, text). Timings are the translate pass's segment times.
LINES = [
    (0.00, 2.36, "At first, I thought confidence was all about lipstick."),
    (3.08, 5.32, "But things have changed since then."),
    (5.32, 7.40, "No matter what I do, I don't feel confident."),
    (7.82, 9.30, "I keep changing perfumes."),
    (9.74, 11.24, "Whether it's an office meeting or anything else,"),
    (11.58, 14.56, "I'm always conscious about how I smell."),
    (14.60, 16.96, "What gives me the most confidence is the smell."),
    (17.18, 18.50, "When it comes from your body, it smells amazing,"),
    (19.52, 20.72, "and I feel really confident."),
    (20.90, 23.86, "That's when they sent me a new product through Instagram."),
    (25.62, 28.10, "I told them I'd only review it if I liked it."),          # CHECK: unclear in the audio
    (29.92, 31.58, "I've been using it for a few days now."),
    (32.28, 33.02, "It's amazing."),
    (33.68, 34.34, "The smell is really good."),
    (34.86, 35.86, "It's very long lasting."),
    (36.34, 38.84, "No need to keep re-spraying perfume."),                  # was "I can smell it when I touch it"
    (39.98, 42.20, "I'm obsessed with the packaging."),
    (42.20, 43.96, "It's perfect to give as a gift."),
    (46.46, 48.12, "The packaging looks premium."),
    (48.58, 50.04, "It's super hydrating."),
    (50.74, 54.20, "Let me show you how fast it absorbs into the skin."),    # merged a repeated line
    (54.30, 56.86, "It's also amazing for daily use."),
    (56.90, 57.98, "It's not sticky at all."),                               # CHECK: was "doesn't have any smell"
    (58.66, 61.00, "If you want this product,"),
    (61.62, 63.94, "I'll put the link in the comments,"),
    (64.54, 65.56, "and I'll share their page too."),
    (66.28, 66.90, "Bye!"),
]

STYLE = ("Style: Reel,Inter ExtraBold,78,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,"
         "-1,0,0,0,100,100,0,0,1,6,2,2,90,90,560,1")


def ts_srt(t):
    ms = round(t * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def ts_ass(t):
    cs = round(t * 100)
    return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"


def chunks(t0, t1, text):
    """Split a line into <= MAX_WORDS-word captions, timed by character share."""
    words = text.split()
    groups = [words[i:i + MAX_WORDS] for i in range(0, len(words), MAX_WORDS)]
    if len(groups) > 1 and len(groups[-1]) == 1:  # no lone last word
        last = groups.pop()
        groups[-1] += last
    total = sum(len(" ".join(g)) for g in groups)
    t, out = t0, []
    for g in groups:
        s = " ".join(g)
        d = (t1 - t0) * len(s) / total
        out.append((t, t + d, s))
        t += d
    return out


def main():
    os.makedirs("work/subs", exist_ok=True)
    with open(SRT, "w") as f:
        for i, (a, b, s) in enumerate(LINES, 1):
            f.write(f"{i}\n{ts_srt(a)} --> {ts_srt(b)}\n{s}\n\n")
    events = []
    for a, b, s in LINES:
        for c0, c1, c in chunks(a, b, s):
            events.append(f"Dialogue: 0,{ts_ass(c0)},{ts_ass(min(c1 + 0.08, b + 0.25))},Reel,,0,0,0,,{c}")
    with open(ASS, "w") as f:
        f.write("[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\nWrapStyle: 0\n\n"
                "[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,"
                "BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,"
                f"Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\n{STYLE}\n\n"
                "[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n"
                + "\n".join(events) + "\n")
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vf", f"ass={ASS}",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
                        "-c:a", "copy", "-movflags", "+faststart", OUT], capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-2000:])
    print(f"wrote {OUT} and {SRT} ({len(events)} captions)")


if __name__ == "__main__":
    main()
