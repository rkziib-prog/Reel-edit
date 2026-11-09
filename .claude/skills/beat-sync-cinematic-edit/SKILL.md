---
name: beat-sync-cinematic-edit
description: Edit clips plus a song into a ~20 s 9:16 cinematic reel: beat-synced speed ramps, smooth transitions, cut-out ride-ins, B&W band, wheel portal, SFX at key cuts. Style by @shakirc.ai.
---

# Beat-synced cinematic edit

Turns a folder of clips and one song into a short, punchy vertical reel (1080x1920, 30 fps, about 20 s), using the rules from the KTM edit by @shakirc.ai (versions v1–v8). Build it with ffmpeg + Python (numpy, opencv, librosa, rembg) in the cloud workspace, then save every version next to the sources.

## 0. Inputs
- Clips (raw S-Log3 or already graded) and a song. Ask only if one is missing.
- If the clips are S-Log3, grade them all first with the `teal-orange-cinematic-grade` skill (same look on every clip).

## 1. Analyse the clips
- Probe each clip (rotation, fps, duration; flag 30p-doubled-into-60p clips and use every other frame for their slow-mo).
- Make a contact sheet per clip (`fps=3`, timestamps burned in) and read it. Note the hero moments: wheelies, stunts, entries, crowd, flags, logo, and any shot with a visible tyre (wheel portal candidate).

## 2. Analyse the song
- Beat grid with librosa (beat_track plus onset strength, refined on the kick band). Find the bars, the dip and the DROP.
- Skip a slow intro: start on a strong bar (KTM song: start at 11.09 s; 120 BPM, a bar every 2 s, dip 12–14 s, drop 14 s).
- Cut on beats; put the biggest transition on the drop.

## 3. Plan the timeline (write `edit.json` before rendering)
One entry per segment: source clip, in/out, speed curve, transition into the next shot, effects, SFX cue. Then check the plan against the rules below.

## Rules
- **Length:** about 20 s.
- **No repeated clips.** The only allowed reuse is one continuous speed-ramp near the end when the song changes. Short B&W snippets inside the band are fine.
- **Transitions must be smooth:** focus-pull blur cut, soft light dissolve, or a ~1 s blur-out/blur-in. **Avoid** slide/whip, glitch, spin and white/whiteout flashes.
- **No big fire circles or visible circular reveals.** The only ring allowed is inside the stunt bike's tyre (wheel portal zoom-through).
- **Speed ramps:** plenty of slow-mo, down to 0.25–0.3x. 60p sources give clean 0.5x; below that, use frame blending. Zoom only subtly, on a few shots.
- **B&W clip band:** not on the first clip; put it after the middle. The band size stays fixed; only the clip inside changes. The cut-out rider stays in colour in front of it.
- **Cut-out ride-in:** the next clip's bike rides **straight onto the first clip's road** with no delay: horizontal entry at road level, a contact shadow, one steady speed through the join, and a soft background dissolve around the cut. Make sure the cut-out bike never freezes during its entry (start the speed grid early enough).
- **Strip transition:** the current shot squeezes into a middle band while the next shot appears in top/bottom bars that snap in on the beat, creep, close in about 2 frames, then the next shot lands with a short vertical smear.
- **SFX only at key transitions:** air for a bike entry, swipes on the strip snap/close, riser + whoosh + hit for the wheel portal, soft air into the logo. Duck the music about 4.5 dB under each.

## 4. Build
- **Speed ramps:** remap output frames to source frames with eased curves (ease in/out cubic) instead of fixed setpts, so ramps feel organic.
- **Cut-outs:** rembg `isnet-general-use` masks per frame for the moving bike/rider, temporally smoothed (median over 3–5 frames), feathered 2–3 px. Composite over the incoming scene with a soft contact shadow.
- **Wheel portal:** track the tyre centre and radius (a gridded contact sheet helps pick coordinates), then zoom through the ring into the next shot over about 0.7 s with radial blur.
- **B&W band:** a fixed-size horizontal band of desaturated clips behind the cut-out rider for about 1.2 s.
- **Logo end:** soft dissolve, a glint, then fade.
- Mix: music + SFX, master around -8 LUFS integrated, -1 dBTP max.
- Render: `libx264 -crf 18 -maxrate 8M -bufsize 16M -pix_fmt yuv420p -r 30`, AAC 256k. About 20 MB per 20 s.

## 5. Check before sending
- Contact sheet of the render at 4 fps; read it. Check: no repeats, no frozen cut-out, transitions on beats, band after the middle, nothing harsh (no flashes or spins).
- Save as `<project>_edit_vN.mp4` (and `edit.json`) next to the clips; never overwrite earlier versions.
- Tell the user what changed from the last version in a few lines.

## Worked example: KTM v7 timeline (120 BPM, bars every 2 s)
- 0–2 s: wheelie at 0.55x with a focus-in open. 0.70–1.45 s: the next bike rides in from the left along the wheelie's road (ease-out cubic, contact shadow); 1.75–2.25 s: its own scene dissolves in behind it. It holds 0.45x until 2.9 s, then ramps 1.2 -> 0.25 -> 0.6x.
- 4.1–5.0 s soft blur transition -> mount shot -> 6.5 s line-up (focus) -> 8.0 s crowd (dissolve).
- 8.5–9.15 s strip transition crowd -> flags (bars snap to 17% each on 8.5, creep to 30%, close at 9.0).
- 9.0 flags -> 11.0 stunt (focus) -> 11.25–12.5 B&W band behind the cut-out stunt bike -> 13.3–14.0 wheel portal -> 14–16.5 pan -> 16.5 logo (dissolve, glint, fade).

---
Style by @shakirc.ai
