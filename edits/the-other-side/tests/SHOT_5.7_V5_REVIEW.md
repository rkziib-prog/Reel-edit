# THE OTHER SIDE — Shot 5.7 keyframe v5: comparison review (15 Nov)

Status: **v5 is a separate CANDIDATE, NOT approved; awaiting your decision.** No image modified, no video, no Kling
credits.

| Version | Drive Edit file (id) | Local read-only copy (sha256) |
| --- | --- | --- |
| **v5 (candidate)** | `5.7_key_v5.png` (`1uat9Zsp4Zae8O8hhDHe3RoOzT30jSSUo`, 17:56) | `input/tos_keyframes/5.7_key_v5.png` (`e5bf340c8de5696c…`) |
| v4 (base) | `5.7_key_v4.png` (`1rsppXP2iYSwGfxFjJodcORngYe72H17f`) | `input/tos_keyframes/5.7_key_v4.png` (`4e185d7e71426919…`, unchanged) |
| Original approved | `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` (`1OSS-agAWJRjwaVxalzPehxnasD0VNp4Y`) | `input/tos_keyframes/C55A5E62-…png` (`e9d3a28fd9f959e4…`, unchanged) |

Sheet: `output/tos_5.7_v5_comparison.jpg` (original, v4, v5 full frames; face crops of v5, v4, original, A2, A1).

## Measurements (support only; the visual check decides)

| | Pitch / yaw / roll | vs v4 | vs A1 | vs A2 | vs B4 | vs original | Face w/h | Mouth-to-chin / h | Mouth w / eye dist | Lip opening / h |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **v5** | −4.7 / **−31.3** / −1.0 | **0.86** | 0.53 | 0.59 | 0.64 | 0.62 | 1.10 | 0.38 | 0.77 | 0.17 |
| v4 | −5.3 / −30.3 / −0.3 | 1.00 | 0.59 | 0.65 | 0.70 | 0.66 | 1.09 | 0.38 | 0.76 | 0.16 |
| Original | −5.1 / +6.9 / −6.2 | 0.66 | 0.63 | 0.55 | 0.70 | 1.00 | 1.05 | 0.43 | 0.80 | 0.28 |
| A2 | +1.7 / −35.9 / −2.1 | 0.65 | 0.78 | 1.00 | 0.73 | 0.55 | 1.11 | 0.40 | 0.81 | 0.16 |
| A1 | +1.2 / +1.5 / +1.4 | 0.59 | 1.00 | 0.78 | 0.85 | 0.63 | 1.19 | 0.43 | 0.85 | 0.14 |

| | Lamp glow (bright warm pixels, right 40% of frame) | Face: lamp side ÷ far side brightness | Frame mean RGB |
| --- | --- | --- | --- |
| Original | x 0.60–1.00, y 0.07–0.78; **2.84%** of frame | **1.12** (lamp side brighter) | 48 / 37 / 25 |
| v4 | x 0.60–1.00, y 0.08–0.80; 1.02% | 0.80 (far side brighter) | 40 / 29 / 20 |
| **v5** | x 0.60–1.00, y 0.00–1.00; **4.27%** | **1.12** (lamp side brighter) | 51 / 35 / 21 |

## Findings

| # | Check | Result |
| --- | --- | --- |
| 1 | **Face identity and natural face shape** | ✅ **Same man as v4** (face-match 0.86, meets the ~0.85 guide); natural face shape (width/height 1.10, v4 1.09, A2 1.11); no gaunt, aged or reshaped drift. ⚠️ Against your photos it scores slightly lower than v4: A1 0.53 (v4 0.59), A2 0.59 (v4 0.65), B4 0.64 (v4 0.70). The prompt's guide was "not lower". The likely cause is the harder lamp shadow now across half the face; face-match drops under strong side light. Against A2 it is still above the original keyframe (0.55). By eye: same nose, brows, beard and hairline as v4; the face reads a little heavier only because of the shadow side |
| 2 | **Lips, chin, jawline, beard** | ✅ Unchanged from v4: lips closed and just parted, no teeth (0.17 vs 0.16); chin 0.38 (v4 0.38); jawline and beard line the same; beard and moustache density the same |
| 3 | **Head angle and eye direction** | ✅ Unchanged: head −31.3° toward frame-left (v4 −30.3°), upright (roll −1.0°); eyes past the left edge, on the mirror, not on the camera |
| 4 | **Lamp size, position, glow** | ✅ **Restored:** the tall glass chimney fills the right edge with its top cropped by the frame and the base at the bottom right, as in the original. ⚠️ **Glow stronger:** the bright area is 4.3% of the frame against 2.8% in the original (the flame and halo are brighter, and the chimney sits a little taller, reaching the frame top). A slightly hotter lamp; easy to tame in the grade |
| 5 | **Warm lighting direction** | ✅ **Restored:** the warm amber key is back on the lamp side of the face (the cheek turned to the camera, the side of the nose, the jaw), with the far side in teal shadow. The lamp-side ÷ far-side ratio is **1.12, exactly the original's** (v4 was 0.80). Frame brightness is back near the original (51/35/21 vs 48/37/25), slightly more saturated amber on the lit cheek |
| 6 | **Hair, shirt, framing** | ✅ Same wet, wavy, shoulder-length hair; same charcoal shirt with the collar and top button open, no necklace; same framing as v4 (face 53% of height, centre x 0.45, 16:9, 1672×941). The head is still left of centre, as you chose to keep |

## Remaining issues

1. **Identity scores against A1 and A2 a little below v4** (0.53/0.59 vs 0.59/0.65), most likely from the harder side
   light. By eye still the same face as v4. Your eye on the full-size image decides.
2. **Lamp glow brighter** than the original (4.3% vs 2.8% of the frame). Can be reduced in the grade without a new image.
3. Unchanged from v4 by your choice: head left of centre, so less space in front of his eyeline.

v5 meets both requested corrections: the lamp size and position, and the warm key on the lamp side. Head, eyes,
mouth, lips, chin, beard, hair, shirt and framing are preserved. **Your decision:** approve v5, approve v4, or ask for
another adjustment. Nothing is approved and no Kling credits are spent until you say so.
