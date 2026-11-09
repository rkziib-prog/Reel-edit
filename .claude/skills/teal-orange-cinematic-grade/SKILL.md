---
name: "teal-orange-cinematic-grade"
description: "Apply the Look 01 (by @shakirc.ai) teal-orange cinematic grade to Sony S-Log3 clips (one or a batch), or export the LUT. Use for grading S-Log3 footage in this look."
---

# Teal-orange cinematic grade (Look 01)

The approved look from the KTM event edit: moody teal shadows and sky, orange/skin warmth, crushed blacks, a soft vignette and fine film grain. Every clip in one edit gets **the same** grade. No per-clip looks unless the user asks.

## Inputs
- One or more clips (Sony S-Log3 / S-Gamut3.Cine, usually 10-bit 4:2:2, 59.94p, often vertical).
- The master LUT is **bundled with this skill**: `luts/Look01_TealOrange_Master_SLog3_65.cube` (and a 33-pt `luts/Look01_TealOrange_Master_SLog3_33.cube` for lighter tools). Find it next to this SKILL.md; if the skill folder isn't readable, ask the user to attach the `.cube`.
  - Never fake the look with generic filters and call it Look 01.
  - The LUT expects **S-Log3 / S-Gamut3.Cine** input. For other log profiles, warn the user that colours will be off.

## Where to run
- If the clips are in a connected folder and the device shell has ffmpeg, grade **in place on the device**. No staging.
- Otherwise stage the clips to the cloud workspace, grade there, and commit the results back next to the sources.

## 1. Probe each clip
```bash
ffprobe -v error -show_streams -select_streams v "$f" | grep -E "width|height|r_frame_rate|pix_fmt|color_range|rotation"
```
- A display-matrix `rotation` is common on vertical clips. A plain ffmpeg decode auto-rotates correctly, so **do not add a transpose**.
- Sony tags these files `color_range=pc`, but decode them as **legal range BT.709** (this matches the approved grade).
- Some clips are 30p content doubled into 60p (every frame appears twice). Note it: for slow-mo use every other frame.

## 2. Grade
```bash
LUT="/path/Look01_TealOrange_Master_SLog3_65.cube"
ffmpeg -v error -y -i "$f" -vf "scale=in_range=tv:in_color_matrix=bt709:flags=lanczos,format=rgb48le,lut3d=file='$LUT':interp=tetrahedral,format=rgb24,vignette=PI/8,format=yuv420p,noise=c0s=4:c0f=t" \
  -c:v libx264 -crf 15 -preset slow -pix_fmt yuv420p -color_range tv -c:a copy "${f%.*}_cinematic_01_teal-orange.mp4"
```
- Output name: `<clip>_cinematic_01_teal-orange.mp4`, saved next to the source. Never overwrite the original.
- Keep the source resolution and frame rate.

### Long clips on the device shell
The device shell kills a job when each call ends (about 2–3 min), and 10-bit 60p encodes run slowly (about 14 s of encode per 1 s of footage). For clips over about 10 s:
1. Encode in 480-frame pieces: `-ss <k*480/fps> -i "$f" -frames:v 480 ... part_<k>.mp4`, one piece per call.
2. Concatenate with the concat demuxer and `-c copy`, then mux the original audio back in.
3. Check the frame count of the result equals the source.

## 3. Check
- Make a before/after still at 2–3 timestamps (raw left, graded right) and look at it: skin should stay natural, sky teal, no crushed faces, no banding.
- Send the comparison with the files and say which LUT was used.

## Export the LUT
When asked to "export the LUT" (for Premiere, DaVinci, CapCut, phone apps): copy the 65-pt `.cube` (or the 33-pt one for apps that reject large LUTs) to where the user wants it, and note it expects **S-Log3 / S-Gamut3.Cine input**. Mention that the vignette and grain are not inside the LUT.
---
Look 01 by @shakirc.ai
