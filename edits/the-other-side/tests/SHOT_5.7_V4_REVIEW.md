# THE OTHER SIDE — Shot 5.7 keyframe v4: comparison review (15 Nov)

Status: **AWAITING YOUR FINAL APPROVAL; not approved automatically.** No image modified, no video, no Kling credits.

| Version | Drive Edit file (id) | Local read-only copy (sha256) |
| --- | --- | --- |
| **v4 (for review)** | `5.7_key_v4.png` (`1rsppXP2iYSwGfxFjJodcORngYe72H17f`, 17:44) | `input/tos_keyframes/5.7_key_v4.png` (`4e185d7e71426919…`) |
| v3 (base) | `5.7_key_v3.png` (`19OCPNtkPNOdKR-X_C1YvGsiHnK2-3NBp`) | `input/tos_keyframes/086CA352-00B1-4BCA-A7A9-7428FAE0BDA0.png` (`4f45300c32c58797…`) |
| Original approved | `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` (`1OSS-agAWJRjwaVxalzPehxnasD0VNp4Y`) | `input/tos_keyframes/C55A5E62-…png` (`e9d3a28fd9f959e4…`, unchanged) |

Sheet: `output/tos_5.7_v4_comparison.jpg` (original, v3, v4 full frames; face crops of v4, v3, original, A2, A1).

## Measurements (support only; the visual check decides)

| | Pitch / yaw / roll | vs v3 | vs A1 | vs A2 | vs B4 | vs original | Face w/h | Mouth-to-chin / h | Mouth w / eye dist | Lip opening / h |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **v4** | −5.3 / **−30.3** / −0.3 | 0.68 | 0.59 | **0.65** | 0.70 | 0.66 | 1.09 | 0.38 | 0.76 | 0.16 |
| v3 | −7.4 / +13.7 / −11.0 | 1.00 | 0.60 | 0.53 | 0.69 | 0.86 | 1.12 | 0.39 | 0.78 | 0.17 |
| Original | −5.1 / +6.9 / −6.2 | 0.86 | 0.63 | 0.55 | 0.70 | 1.00 | 1.05 | 0.43 | 0.80 | 0.28 |
| A2 (direction) | +1.7 / −35.9 / −2.1 | 0.53 | 0.78 | 1.00 | 0.73 | 0.55 | 1.11 | 0.40 | 0.81 | 0.16 |
| A1 | +1.2 / +1.5 / +1.4 | 0.60 | 1.00 | 0.78 | 0.85 | 0.63 | 1.19 | 0.43 | 0.85 | 0.14 |

## Findings

| # | Check | Result |
| --- | --- | --- |
| 1 | **Facial identity and face shape** | ✅ **Same man**, natural face shape; no gaunt or aged drift (the trashed 17:11 image scored 0.40 against A1). Against A2, the photo at the same angle, v4 scores **0.65**, the best of any 5.7 keyframe (v3 0.53, original 0.55). Against A1, B4 and the original it holds the original's level (0.59 / 0.70 / 0.66). Against v3 it scores 0.68, below the ~0.8 I set as a guide; most of that is the 44° turn between a near-frontal and a three-quarter face (your own A1 and A2 photos, 37° apart, score 0.78). Face width/height 1.09 against A2's 1.11 at the same angle |
| 2 | **Nose, cheeks, lips, chin, beard** | ✅ Nose straight, same line as v3 and A2 (not the longer, sharper nose of the trashed image); cheeks full, no hollowing; **lips closed, just parted, as in v3** (0.16 vs 0.17), no teeth; chin and lower face in range (0.38 vs A2 0.40, v3 0.39); beard and moustache the same density and line as v3 |
| 3 | **Head and eye direction** | ✅ **Fixed.** Head turned **−30.3°** toward frame-LEFT (target ~−30°, A2 −35.9°), **upright** (roll −0.3°, v3 −11°). The eyes are clearly on the left, past the frame edge: a sideways, furious look at the off-screen mirror, not at the camera. After the flip he faces screen-right toward the Reflection |
| 4 | **Lamp size and position** | ❌ **Not restored to the original.** The lamp is now **much smaller and lower**: only a small chimney and flame at the right edge, about mid-height. In the original, the tall glass chimney fills the right edge from near the top of the frame (top cropped) down to its base. Its bright area is about **1.0% of the frame against 2.8%** in the original. Overcorrected: v3 was too big, v4 too small |
| 5a | **Lighting** | ⚠️ **Key direction changed.** In the original and v3 the side of the face toward the lamp (frame-right) was brighter. In v4 the **frame-left side of his face and forehead carry the warm key**, and the lamp side falls darker (mean face RGB, frame-left half 121/64/33 vs frame-right 96/53/26). The lamp now reads more as a warm rim on the hair at the right. The amber-against-teal palette holds, and the frame is slightly darker overall (mean 40/29/20 vs 48/37/25). For the flipped shot the plan has the lamp key on frame-right |
| 5b | Costume | ✅ Charcoal shirt, collar and top button open, no necklace |
| 5c | **Framing** | ⚠️ Same MCU and 16:9 (1672×941). The head now sits **left of centre** (centre x 0.45 vs 0.50) and slightly smaller (0.52 vs 0.58 of frame height), with more shoulder. Since he now looks to frame-left, the space in front of his eyes is reduced. Usable, but lead room would normally sit on the side he looks toward |

## Summary

v4 achieves both corrections that v2 and v3 could not combine:
- the head turned three-quarter to frame-left with the eyes on the mirror;
- Aadhi's face kept (closest yet to A2 at this angle), with the closed mouth intact.

What remains:
1. **Lamp:** smaller and lower than the original, not "the same size and position" as asked.
2. **Light on the face:** the warm key now falls on the frame-left side of the face, not from the lamp side.
3. Minor: the head sits left of centre, which reduces the space in front of his eyeline.

Your options:
- **Approve v4 as is.** The lamp and lighting differences are visible but do not affect identity or lip-sync.
- **Make a v5:** a small ChatGPT edit of v4 that only enlarges the lamp to the original's size and position and puts the
  warm key back on the lamp side of the face, keeping face, head, eyes and mouth exactly. No Kling credits.

Nothing is approved until you say so.
