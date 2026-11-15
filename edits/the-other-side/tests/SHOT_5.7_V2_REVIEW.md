# THE OTHER SIDE — Shot 5.7 keyframe v2: comparison review (15 Nov)

Status: **v2 NOT approved; awaiting your decision.** The approved original is unchanged and stays the approved
version. No video, no Kling credits.

| | File | Location | sha256 |
| --- | --- | --- | --- |
| Approved original | `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` | Drive Edit (id `1OSS-agAWJRjwaVxalzPehxnasD0VNp4Y`); read-only copy `input/tos_keyframes/` | `e9d3a28fd9f959e4…` (unchanged) |
| Proposed v2 | `086CA352-00B1-4BCA-A7A9-7428FAE0BDA0.png` | Drive Edit (id `19OCPNtkPNOdKR-X_C1YvGsiHnK2-3NBp`, uploaded 15 Nov 17:03); read-only copy `input/tos_keyframes/` | `4f45300c32c58797…` |

**Update 15 Nov 17:04:** this same Drive file (same id, byte-identical, sha256 `4f45300c32c58797…`) was renamed to **`5.7_key_v1.png`**. It is still the proposed v2 (the corrected version), not the approved original; the name `v1` may cause confusion with the original `C55A5E62…png`. No new image has been uploaded since; no file named `5.7_key_v2.png` exists. The v2 above is the only image uploaded after the correction brief;
**please confirm it is your v2.**

Sheets: `output/tos_5.7_v2_comparison.jpg` (full frames + Identity Board V2, A2, B4) and `output/tos_5.7_v2_faces.jpg`
(face crops: original, v2, A1, A2, B4).

## Findings

| Check | Original | v2 | Verdict |
| --- | --- | --- | --- |
| **Head angle** | yaw +6.9° (near frontal) | yaw **+13.7°**: turned slightly toward **frame-RIGHT**, toward the lamp | **MISMATCH.** Target is three-quarter toward frame-LEFT like A2 (A2 measures yaw −35.9°; A1 +1.2°). v2 turned the opposite way. After the flip he would face screen-left, the same way as the Reflection (5.6, 5.8), so the two would not face each other |
| **Eye direction** | eyes near the lens | pupils glance slightly toward frame-left / the lens while the head turns right | **MISMATCH (partial).** The eyes do not clearly hold an off-screen mirror at frame-left; it still reads close to looking at the camera |
| Head tilt (roll) | −6.2° | −11.0° | Noticeable tilt toward his shoulder; acceptable as tension, but a change from the original |
| **Mouth** | wide open mid-shout, teeth showing (lip-region height 0.176 of face height) | nearly closed, lips just parted (0.109) | **FIXED**, as asked. A thin gap between the lips; check at full size that no teeth read |
| Expression | fury, shouting | fury with fear, jaw tight, brows down | Matches B4's anger with the mouth closed ✓ |
| Facial identity | face-match vs A1 0.63, A2 0.55, B4 0.70 | vs A1 0.60, A2 0.53, B4 0.69; **v2 vs original 0.86** | Same man as the original by eye (brows, nose, beard, moustache, hairline). Both keyframes read a little heavier and older than A1 under the wet hair and furrow; no new identity drift in v2 |
| Hair, beard, skin | wet, wavy, shoulder-length; beard and moustache; sweat sheen | same ✓ | Match |
| Costume | charcoal shirt, collar and top button open, no necklace | same ✓ | Match; pocket and wrists out of frame |
| Lighting | lamp key frame-right; face brighter on the right (mean RGB L 86/50/29 vs R 106/55/23) | same direction (L 90/48/27 vs R 107/54/22); amber against teal ✓ | Match |
| **Lamp** | glass chimney at the right edge, top cropped | lamp **larger and closer**: the chimney fills more of the right side | Minor composition change from the original |
| Framing | MCU, 16:9, 1672×941; face 58% of frame height, centred | 1672×941 ✓; face 54%, centred ✓ | Match (slightly wider on him; still well above the lip-sync minimum) |

## Remaining mismatches (what blocks approval for 5.7)

1. **Head turned toward frame-right instead of frame-left** (yaw +13.7°; target about −25° to −35°, as A2).
2. **Eyes not clearly on the mirror at frame-left**: they still read near the lens.
3. Minor: the lamp is larger and closer than in the original; the head tilt increased.

The mouth correction worked and should be kept.

## If you want a v3 (not generated; ChatGPT, no Kling credits)

Attach v2 (`086CA352…png`) first, then Identity Board V2, A1, A2. Same prompt as `SHOT_5.7_KEYFRAME_CORRECTION.md`,
replacing change 1 with:

```text
1. Turn his head about 30 degrees toward the LEFT edge of the image, away from the lamp, exactly like panel A2: his nose points toward the left edge, we see more of the side of his face nearest the lamp, and his eyes look past the left edge of the frame at a mirror off-screen there. Head upright, not tilted. Keep the lamp exactly the size and position it has in the first image.
```

Keep change 2 (mouth nearly closed, lips just parted, no teeth) as v2 already shows it. Save as `5.7_key_v3.png`.

Correction to `SHOT_5.7_READINESS.md`: it gave the original's head angle as "yaw about −5°". That number was the pitch,
because insightface reports pitch, yaw, roll in that order. The original's yaw is +6.9°. The conclusion is unchanged:
near frontal, not three-quarter to frame-left.

Your choices: keep the original, approve v2 as is, or make a v3. Nothing is approved and nothing runs until you say so.

**Update 15 Nov:** the user approved a newer ChatGPT keyframe (v3) as the current version; v2 is superseded. v3's file is not yet in Drive; its comparison is pending.
