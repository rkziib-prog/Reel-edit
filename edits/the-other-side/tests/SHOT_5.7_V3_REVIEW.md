# THE OTHER SIDE — Shot 5.7 keyframe v3: comparison record (15 Nov)

## UPDATE 15 Nov 17:27: Drive changed; v3 status back to AWAITING YOUR APPROVAL

- The 17:11 file reviewed below (Drive id `1QCOcDkXnH3pOK5F_x7G-kiEwCoDLXIHv`, sha256 `b1798599caabd250…`) is now **in
  the Drive trash**. My local read-only copy keeps the name `input/tos_keyframes/5.7_key_v3.png`; it is that trashed
  image, called "trashed 17:11 v3" here.
- The file now named **`5.7_key_v3.png`** in Drive Edit (id `19OCPNtkPNOdKR-X_C1YvGsiHnK2-3NBp`, renamed 17:27) is
  **byte-identical to the v2 image** (sha256 `4f45300c32c58797…`; first uploaded 17:03 as `086CA352…png`, then renamed
  `5.7_key_v1.png`, now `5.7_key_v3.png`).
- Approval is not recorded for either until you confirm. The original `C55A5E62…png` is unchanged
  (`e9d3a28fd9f959e4…`).

### Comparison of the current Drive `5.7_key_v3.png` (the v2 image)

Face-match is support only; geometry ratios come from 106 face landmarks and shift with head angle and expression.

| | Yaw | vs A1 | vs A2 | vs original | Face width / height | Mouth-to-chin / face height | Mouth width / eye distance | Lip opening / face height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Original | +6.9° | 0.63 | 0.55 | 1.00 | 1.05 | 0.43 | 0.80 | 0.28 (shouting) |
| **Current `5.7_key_v3.png`** | **+13.7°** | **0.60** | **0.53** | **0.86** | 1.12 | 0.39 | 0.78 | 0.17 |
| Trashed 17:11 v3 | −27.3° | 0.40 | 0.41 | 0.59 | 1.13 | 0.39 | 0.78 | 0.14 |
| A1 (front) | +1.5° | 1.00 | 0.78 | 0.63 | 1.19 | 0.43 | 0.85 | 0.14 |
| A2 (three-quarter left) | −35.9° | 0.78 | 1.00 | 0.55 | 1.11 | 0.40 | 0.81 | 0.16 |
| B4 (anger) | +0.4° | 0.85 | 0.73 | 0.70 | 1.17 | 0.40 | 0.77 | 0.13 |

| Check | Current `5.7_key_v3.png` | Result |
| --- | --- | --- |
| Facial identity | 0.60 vs A1, 0.53 vs A2, 0.86 vs the original: same level as the approved original, far better than the trashed v3 (0.40). By eye the same man as the original: brows, nose, beard, moustache, hairline | ✅ (same as the original) |
| Face shape | width/height 1.12: between A2 (1.11, same turn) and A1 (1.19); slightly narrower than A1, as the original's furrow and wet hair also make it | ✅ within range |
| Lips | closed, lips just parted (0.17), close to A1/A2 at rest (0.14–0.16); mouth width matches B4's anger (0.78 vs 0.77) | ✅ |
| Chin and lower face | mouth-to-chin 0.39 vs A2 0.40, A1 0.43, B4 0.40: within the reference range; beard covers the jawline as in A1 | ✅ |
| **Head angle** | **yaw +13.7°: turned slightly toward frame-RIGHT** (the lamp side); target three-quarter toward frame-LEFT like A2 (−35.9°) | ❌ |
| **Eye direction** | pupils near the lens / slightly left; not clearly on a mirror off frame-left | ❌ |
| Head tilt | roll −11° (original −6°) | ⚠️ |
| Costume | charcoal shirt, collar and top button open; no necklace | ✅ |
| Lighting | amber lamp key from frame-right, teal shadows; lamp-side of the face brighter | ✅ |
| Lamp position | same side, but **larger and closer** than in the original | ⚠️ |
| Framing | MCU, 16:9, 1672×941, face 54% of height, centred | ✅ |

The two fixes needed for 5.7 were the head turn to frame-left and the closed mouth. This file has the closed mouth
and keeps the identity. The trashed 17:11 image had the head turn but lost the identity. Neither has both.

---

**(Superseded record, kept for history.)** Status at 17:11: v3 was recorded as the current approved keyframe (user approval, 15 Nov). Approval is the user's decision and stands;
the identity finding below is recorded for the user's attention before any Kling credits are spent.

| Version | File | Drive (Edit folder) | Local read-only copy (sha256) | Status |
| --- | --- | --- | --- | --- |
| **v3** | `5.7_key_v3.png` | id `1QCOcDkXnH3pOK5F_x7G-kiEwCoDLXIHv`, uploaded 15 Nov 17:11 | `input/tos_keyframes/5.7_key_v3.png` (`b1798599caabd250…`) | **Current approved** |
| Original | `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` | id `1OSS-agAWJRjwaVxalzPehxnasD0VNp4Y` | `input/tos_keyframes/C55A5E62-…png` (`e9d3a28fd9f959e4…`, unchanged) | Original approved version, kept |
| v2 | `5.7_key_v1.png` in Drive (was `086CA352…png`) | id `19OCPNtkPNOdKR-X_C1YvGsiHnK2-3NBp` | `input/tos_keyframes/086CA352-…png` (`4f45300c32c58797…`) | Superseded |

Sheet: `output/tos_5.7_v3_comparison.jpg` (original and v3 full frame; face crops of original, v2, v3, A1, A2;
Identity Board V2).

## Comparison

| Check | Original | v3 | Result |
| --- | --- | --- | --- |
| Head angle (yaw) | +6.9° (near frontal) | **−27.3°**, three-quarter toward frame-LEFT (A2 = −35.9°) | ✅ corrected |
| Head tilt (roll) | −6.2° | −1.6°, upright | ✅ |
| Eye direction | near the lens | toward frame-left, past the edge of frame (the mirror) | ✅ corrected; after the flip he faces screen-right toward the Reflection |
| Mouth | wide open, teeth showing (lip-region 0.176 of face height) | closed, lips just parted (0.082) | ✅ corrected; best starting point for lip-sync |
| Expression | shouting fury | fury with fear, brows down, jaw tight | ✅ |
| Costume | charcoal shirt, collar and top button open, no necklace | same | ✅ |
| Hair, beard, skin | wet, wavy, shoulder-length; beard and moustache; sweat sheen | same style; **beard looks sparser** | ⚠️ see identity |
| Lighting | amber lamp key frame-right, teal shadows | same direction and colour (lamp side slightly brighter) | ✅ |
| Lamp | glass chimney at the right edge | same size and position as the original (v2's enlarged lamp is gone) | ✅ |
| Framing | MCU 16:9, 1672×941, face 58% of height, centred | 1672×941, face 54%, centred | ✅ |
| **Facial identity** | vs A1 0.63 · A2 0.55 · B4 0.70 · C7_v2 0.66 | vs A1 **0.40** · A2 **0.41** · B4 0.50 · C7_v2 0.41 · vs original 0.59 | ⚠️ **drift** |

## Remaining mismatch: identity drift in v3

By eye, against A1, A2 and the Identity Board V2:
- **Face:** narrower and longer, with hollower cheeks.
- **Nose:** longer and sharper.
- **Beard:** sparser.
- **Age:** reads older and more gaunt.

The face-match falls to 0.41 against A2, which shares v3's head angle, and to 0.40 against A1. The original scored 0.55
and 0.63. The turned head explains a little of the drop. The approved panels at their own angles scored 0.73–0.96
against your photos, so most of the drop is the face itself. This is the same kind of drift as the first C6 panel
(aged and gaunt), which was redone.

**Why it matters before Kling:**
- Kling keeps the face of the keyframe.
- 5.7 cuts directly between Reflection close-ups (5.6, 5.8) made from the approved panels.
- A thinner, older Aadhi next to them may read as a different man.

**Options (your call; nothing changes without it):**
1. Use v3 as approved.
2. Make a v4 in ChatGPT that edits v3 for identity only: keep the head angle, eyes, mouth, lamp and framing exactly,
   and restore the face to A1/A2 (fuller cheeks, the shorter straight nose, denser beard, his real age). No Kling
   credits are needed for this.

No video generated, no Kling credits spent.
