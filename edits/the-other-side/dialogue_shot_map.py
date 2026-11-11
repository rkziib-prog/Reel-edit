#!/usr/bin/env python3
"""THE OTHER SIDE: Dialogue Shot Map, every one of the 59 shots with its dialogue, delivery, lip-sync need,
lip-sync framing and performance. Malayalam and English are copied verbatim from the approved production plan
(Claude Docs export at work/verify/plan.txt), never retyped. Shot order, timing and durations are the plan's.
Checks: shots sum to 268.0 s, every one of the 42 subtitle events is placed exactly once, inside its shot's time.
Run from the repo root: python3 edits/the-other-side/dialogue_shot_map.py -> edits/the-other-side/DIALOGUE_SHOT_MAP.md
"""
import re

PLAN = "work/verify/plan.txt"
OUT = "edits/the-other-side/DIALOGUE_SHOT_MAP.md"


def sec(t):
    m, s = t.split(":")
    return int(m) * 60 + float(s)


def events():
    t = open(PLAN).read()
    a, b = t.index("Dialogue and subtitles"), t.index("The title card at 4:25")
    rows = [x.strip(" |").strip() for x in t[a:b].split("\n")]
    rows = [x for x in rows if x]
    i = rows.index("English subtitle (on screen)") + 1
    ev = {}
    while i + 6 <= len(rows):
        n, t_in, t_out, who, ml, en = rows[i:i + 6]
        ml = ml.replace('\\"', '"').replace(" (locked)", "")
        ev[n] = dict(n=n, t_in=sec(t_in), t_out=sec(t_out), who=who, ml=ml, en=en.replace('\\"', '"'))
        i += 6
    assert len(ev) == 42, len(ev)
    return ev


# delivery codes
SYNC = "On camera, sync"        # the speaker's face is in the shot
VO = "Voice-over"               # narration, not spoken in the scene
PHONE = "Off-screen (phone)"    # Dr. Thomas through the speaker
OFF = "Off-screen (in scene)"   # spoken in the scene, speaker's mouth not in shot
TEXT = "On-screen text only"    # a note, read via subtitle, nobody speaks

# (shot, in, out, picture, flip, [(event, delivery)], lip-sync, lip-sync framing, performance)
SHOTS = [
 ("1.1", "0:00", "0:04", "Black", "-", [], "No", "-", "-"),
 ("1.2", "0:04", "0:12", "Wide, high angle, on the cot (K1)", "Yes", [("1", VO)], "No", "-",
  "Awake and utterly still, eyes open, blinks too rarely (B1)."),
 ("1.3", "0:12", "0:15", "Insert: clock 3:33, running backward", "Yes", [], "No", "-", "-"),
 ("1.4", "0:15", "0:20", "Covered mirror, no actor", "Yes", [("2a", VO), ("2b", VO)], "No", "-", "-"),
 ("1.5", "0:20", "0:23", "Close-up, side-lit, on the pillow", "Yes", [], "No", "-",
  "Completely still; only the eyes move toward frame-left on the knocks. Underplayed unease."),
 ("1.6", "0:23", "0:30", "Follow shot from behind", "Yes", [], "No", "-", "-"),
 ("1.7", "0:30", "0:35", "Medium from the courtyard, in the doorway", "Yes", [("3", SYNC)], "Conditional",
  "Mouth is small at medium in rain. Sync only if the face is at least about 1/6 of frame height and unoccluded; "
  "otherwise lay the line with his head turned to the courtyard.",
  "Cautious, quiet question into the dark; not loud. Mild fear (B2, light)."),
 ("1.8", "0:35", "0:38", "Insert: bolt slides home", "Yes", [], "No", "-", "-"),
 ("1.9", "0:38", "0:42", "Wide, low, small in the corridor", "Yes", [], "No", "-",
  "Stands and listens; does not run. Head slightly turned."),
 ("2.1", "0:42", "0:48", "Overhead: diary and writing hand", "Yes", [("4", OFF)], "No",
  "Face not in shot: whispered sync sound only.", "Whisper while writing, word by word, as if afraid to be heard."),
 ("2.2", "0:48", "0:52", "POV: the written line", "Yes", [], "No", "-", "-"),
 ("2.3", "0:52", "1:04", "Hands turning pages", "Yes", [], "No", "-", "Hands grow uneasy page by page."),
 ("2.4", "1:04", "1:12", "Medium close-up at the desk, slow push-in", "Yes", [("5", SYNC)], "Yes",
  "MCU, face toward camera, lamp on the face, mouth clear of hands; the push-in ends in a close-up.",
  "Barely audible; looks up from the page into the dark; does not blink. Unsettled, onset of fear (B2)."),
 ("3.1", "1:12.0", "1:15.0", "Deep wide, on the floor against the pillar (K3)", "Yes", [], "No", "-",
  "Still; looks down at the buzzing phone (B1)."),
 ("3.2", "1:15.0", "1:16.5", "Insert: phone in his hand, answers", "Yes", [], "No", "-", "-"),
 ("3.3", "1:16.5", "1:30.0", "Slow push-in, call part 1", "Yes", [("6", PHONE), ("7", SYNC), ("8a", PHONE)],
  "Yes (Line 7)", "Medium to MCU, face square to camera, phone held at chest height on speaker so it never "
  "covers the mouth. Listening beats stay mouth-closed.",
  "Listens; confusion. Line 7 a short, half-laughing disbelief. Then a long silence through the static."),
 ("3.4", "1:30.0", "1:33.2", "Insert: the sent message (reuses 3.2)", "Yes", [("8b", PHONE)], "No", "-", "-"),
 ("3.5", "1:33.2", "1:51.5", "Push-in continues to close-up, call part 2", "Yes",
  [("8c", PHONE), ("9", SYNC), ("10a", PHONE), ("10b", PHONE), ("11", SYNC), ("12a", PHONE)],
  "Yes (Lines 9, 11)", "Close-up, face square to camera, mouth unoccluded; split clips cut in the listening beats, "
  "never mid-line.", "Denial (Line 9, faltering); listens; Line 11 sharper, \"who?\"; fear grows (B2)."),
 ("3.6", "1:51.5", "1:58.0", "Deep wide (K3): lowers phone, turns to the mirror", "Yes", [("12b", PHONE)], "No",
  "-", "Slow head turn 1:54.6-1:55.8, then holds, frozen."),
 ("4.1", "1:58", "2:06", "Tracking alongside with the torch", "Yes", [], "No", "-", "Careful breathing."),
 ("4.2", "2:06", "2:09", "Insert: note on a pillar", "Yes", [("N1", TEXT)], "No", "-", "-"),
 ("4.3", "2:09", "2:12", "Insert: note on a door", "Yes", [("N2", TEXT)], "No", "-", "-"),
 ("4.4", "2:12", "2:15", "Insert: note on a window bar", "Yes", [("N3", TEXT)], "No", "-", "-"),
 ("4.5", "2:15", "2:20", "Close-up: ink-stained hand in the beam", "Yes", [], "No", "-", "Slight tremble."),
 ("4.6", "2:20", "2:25", "Medium close-up, lit from below by the torch", "Yes", [("13", SYNC)], "Yes",
  "MCU, face toward camera, torch light reaching the mouth (not only the eyes); slow drift only.",
  "Quiet, confused, frightened; eyes dart across the notes (B2)."),
 ("4.7", "2:25", "2:30", "Over the shoulder into the dark hall", "Yes", [], "No", "-", "Still, listening."),
 ("5.1", "2:30", "2:36", "Dolly behind him toward the mirror", "Yes", [], "No", "-", "-"),
 ("5.2", "2:36", "2:42", "OTS composite: his back + the Reflection in the glass", "5.2a Yes, 5.2b No", [], "No",
  "-", "Reflection: palm flat on the glass, red eyes, utterly still (C6_v3)."),
 ("5.3", "2:42", "2:44", "Insert: torch trembles; the palm does not", "No", [], "No", "-", "-"),
 ("5.4", "2:44", "2:49", "Close-up, the Reflection, locked", "No", [("14", SYNC)], "Yes",
  "CU looking frame-left, lamp from frame-left on the mouth; sync on the clean plate BEFORE the glass haze is added.",
  "Hoarse, almost a whisper; exhausted, pleading (C6_v3). Barely moves."),
 ("5.5", "2:49", "2:53", "Close-up, Aadhi, handheld begins", "Yes", [("15", SYNC)], "Yes",
  "CU looking frame-left; handheld sway kept small so the mouth stays sharp.",
  "Demanding; fear turning to anger (B2 to B4), jaw tight."),
 ("5.6", "2:53", "3:02", "Close-up, the Reflection, slow push-in", "No", [("16", SYNC), ("17a", SYNC), ("17b", SYNC)],
  "Yes", "CU looking frame-left, slightly wider than 5.4; sync before the haze.",
  "A tired, broken laugh on Line 16, then soft, exhausted; never aggressive (C6_v3)."),
 ("5.7", "3:02", "3:05", "Medium close-up, Aadhi, handheld", "Yes", [("18", SYNC)], "Yes",
  "MCU looking frame-left; the shout must read in a wide-open mouth: avoid motion blur on the line.",
  "Shouting, furious and frightened (B4). Loud, not a scream."),
 ("5.8", "3:05", "3:08", "Close-up, the Reflection, gentle", "No", [("19", SYNC)], "Yes",
  "CU as 5.4; eyes lower toward the other man's hand.", "Gentle, almost tender."),
 ("5.9", "3:08", "3:12", "Insert: his ink-stained fingertips", "Yes", [("20", OFF)], "No",
  "Face not in shot: his voice over the insert.", "Shaken; breath catches."),
 ("5.10", "3:12", "3:16", "Close-up, the Reflection, a single tear", "No", [("21", SYNC)], "Yes",
  "CU as 5.4; the tear must not cross the mouth.", "Quiet certainty; one tear (C6_v3)."),
 ("5.11", "3:16", "3:22", "Wide profile two-shot composite", "5.11a Yes, 5.11b No", [("22a", SYNC), ("22b", SYNC)],
  "No", "Wide profile: the mouth is too small to sync convincingly. Lines play on the composite; 22b carries on "
  "over 5.12.", "2 s of silence, both still; then the plea (Reflection), the man outside does not move."),
 ("5.12", "3:22", "3:25", "Tilt to the cloth, pan to the brass lamp; he lifts it", "Yes", [], "No", "-",
  "Line 22b ends over this shot (placed under 5.11)."),
 ("5.13", "3:25", "3:28", "Close-up, the Reflection, both palms on the glass", "No", [("23a", SYNC), ("23b", SYNC)],
  "Yes", "CU as 5.4; palms frame the face but never cover the mouth.", "Panic for the first time; shouting (B2, C6_v3)."),
 ("5.14", "3:28", "3:31", "Extreme close-up, Aadhi in profile, lamp-lit", "Yes", [("24", SYNC)], "Yes",
  "ECU profile facing frame-left: the lip line is clear in profile. If the lip-sync test fails on profile, keep the "
  "plan's framing and sync by edit timing (short line, minimal mouth movement).",
  "Quiet, cold, unblinking; eyes like B5_v2 (no smile)."),
 ("5.15", "3:31", "3:33.08", "Wide, side-on, slow motion: the swing", "Yes", [], "No", "-", "-"),
 ("5.16", "3:33.08", "3:35", "Black", "-", [], "No", "-", "-"),
 ("6.1", "3:35", "3:41", "Reverse wide: shards in sunlight, no actor", "No", [], "No", "-", "-"),
 ("6.2", "3:41", "3:45", "Medium, low: he steps out through the frame", "Yes", [], "No", "-", "Calm, neutral (B1)."),
 ("6.3", "3:45", "3:47", "Insert: clock 8:27", "No", [], "No", "-", "-"),
 ("6.4", "3:47", "3:49", "Insert: note written backwards", "No", [], "No", "-",
  "No subtitle: the reversed note is meant to read as backwards."),
 ("6.5", "3:49", "3:51", "Insert: framed photo of the real Aadhi", "No", [], "No", "-", "-"),
 ("6.6", "3:51", "3:53", "Insert: his hand straightens the frame", "Yes", [], "No", "-", "-"),
 ("6.7", "3:53", "4:04", "Medium close-up, daylight, phone call", "Yes",
  [("25", PHONE), ("26", SYNC), ("27", PHONE), ("28", SYNC), ("29", PHONE)], "Yes (Lines 26, 28)",
  "MCU, phone at the ear on the side away from camera so the mouth stays clear; split clip cuts between 26 and 27.",
  "Warm, steady, new voice; a slow small smile on Line 28 (B5_v2, calm)."),
 ("6.8", "4:04", "4:08", "Very slow push-in on his face", "Yes", [("30", SYNC)], "Yes",
  "MCU to CU, face toward camera, continued from 6.7's last frame.",
  "At ease for the first time; quiet and certain (B5_v2, calm)."),
 ("7.1", "4:08", "4:10", "Medium: picks up the shard", "Yes", [], "No", "-", "-"),
 ("7.2", "4:10", "4:12", "ECU inside the shard: pounding, silent scream", "No", [], "No", "-",
  "Silent scream, desperate (C6_v3, B2). No voice: muffled thuds only."),
 ("7.3", "4:12", "4:13", "Close-up, the imposter, sunlit", "Yes", [], "No", "-", "A slow, satisfied smile (B5_v2)."),
 ("7.4", "4:13", "4:16", "ECU inside the shard: the forced smile", "No", [], "No", "-",
  "Fists stop; against his will the mouth copies the smile while tears run and the eyes fight it (C6_v3 + B5_v2)."),
 ("7.5", "4:16", "4:18", "Top shot: shard folded into the cloth", "Yes", [], "No", "-", "-"),
 ("7.6", "4:18", "4:19", "Black", "-", [], "No", "-", "-"),
 ("7.7", "4:19", "4:24", "K1 mirrored: the real Aadhi on the cot", "No", [("31", VO)], "No", "-",
  "Calm, empty, tear tracks drying; Line 31 flat and numb (V.O.)."),
 ("7.8", "4:24", "4:25", "Black", "-", [], "No", "-", "-"),
 ("7.9", "4:25", "4:28", "Title card", "-", [], "No", "-", "-"),
]


def main():
    ev = events()
    assert len(SHOTS) == 59
    total = sum(sec(b) - sec(a) for _, a, b, *_ in SHOTS)
    assert abs(total - 268.0) < 1e-6, total
    placed = [e for s in SHOTS for e, _ in s[5]]
    assert sorted(placed) == sorted(ev), set(ev) ^ set(placed)
    for shot, a, b, _, _, evs, *_ in SHOTS:
        for e, _ in evs:
            assert sec(a) - 0.01 <= ev[e]["t_in"] < sec(b), (shot, e)   # each line starts inside its shot

    lip = [s for s in SHOTS if s[6].startswith("Yes")]
    cond = [s for s in SHOTS if s[6] == "Conditional"]
    dia = [s for s in SHOTS if any(d != TEXT for _, d in s[5])]
    out = ["# THE OTHER SIDE (മറുവശം) — Dialogue Shot Map", "",
           "All 59 shots of the approved plan (7 scenes, 268.0 s, 24 fps), in film order. Shot order, times and durations "
           "are the production plan's; the Malayalam and English are copied verbatim from it by "
           "`edits/the-other-side/dialogue_shot_map.py` (all 31 lines approved and locked 11 Nov). Nothing is generated "
           "from this map; it is preparation only.", "",
           "## Summary", "",
           f"- Shots with spoken dialogue: **{len(dia)}** of 59; on-screen notes only: 3 (4.2–4.4).",
           f"- Visible lip-sync required: **{len(lip)} shots** — {', '.join(s[0] for s in lip)}.",
           f"- Conditional lip-sync: {', '.join(s[0] for s in cond)} (mouth small at medium; decided on the plate).",
           "- Voice-over: Lines 1, 2a, 2b (1.2, 1.4), 31 (7.7). Dr. Thomas is always off-screen on the phone "
           "(6, 8a–8c, 10a–10b, 12a–12b, 25, 27, 29). Off-screen in scene, face not shown: Line 4 (2.1), Line 20 (5.9). "
           "Wide, too small to sync: 22a–22b (5.11).",
           "- Lip-sync runs on the unflipped clip, before the flip (Aadhi's shots) and before the glass haze "
           "(Reflection's shots); a flip changes neither timing nor audio.",
           "- Shots are fitted to your recorded takes: the times below are the plan's estimates; each line snaps to "
           "your actual words.", "",
           "**Lip-sync framing rules (all sync shots):** close-up or medium close-up; face at least about a third of "
           "frame height; mouth never covered (phone, hands, palms, tears); key light reaching the mouth; camera "
           "movement small enough that the mouth stays sharp on the line; cuts and clip splits only in pauses, never "
           "mid-line.", "",
           "## Shot by shot", "",
           "| Shot | Time | Picture | Flip | Dialogue | Line | Speaker | Approved Malayalam (spoken) | English subtitle | "
           "Delivery | Lip-sync | Lip-sync framing | Performance |",
           "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    for shot, a, b, pic, flip, evs, ls, lf, perf in SHOTS:
        dur = sec(b) - sec(a)
        if not evs:
            out.append(f"| {shot} | {a}–{b} ({dur:g} s) | {pic} | {flip} | No | – | – | – | – | – | {ls} | {lf} | {perf} |")
            continue
        for k, (e, d) in enumerate(evs):
            x = ev[e]
            head = (f"| {shot} | {a}–{b} ({dur:g} s) | {pic} | {flip} | " +
                    ("No (text)" if d == TEXT else "Yes")) if k == 0 else "| ″ | | | | ″"
            tail = f" | {ls} | {lf} | {perf} |" if k == 0 else " | ″ | | |"
            out.append(f"{head} | {e} | {x['who']} | {x['ml']} | {x['en']} | {d}{tail}")
    out += ["", "″ = same shot, next line. Lines 18 and 30 were locked on 10 Nov; all others approved 11 Nov; "
            "Line 31 is covered by the Line 1 approval (intentional repetition).", ""]
    open(OUT, "w").write("\n".join(out))
    print(f"wrote {OUT}: 59 shots, {len(placed)} subtitle events placed, total {total:g} s; "
          f"dialogue shots {len(dia)}, lip-sync {len(lip)}, conditional {len(cond)}")


if __name__ == "__main__":
    main()
