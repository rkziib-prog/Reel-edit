# THE OTHER SIDE — Shot 5.7 keyframe v5: correction prompt (for your review)

Status: **PROMPT APPROVED by the user exactly as written (15 Nov); ready for image editing in ChatGPT.** Nothing generated; no keyframe approved (v4 still awaiting a decision). No video, no Kling credits. v4, v3
and the original approved keyframe stay unchanged.

| | |
| --- | --- |
| Base image, **the only source of everything except the lamp and its light** | Drive Edit `5.7_key_v4.png` (id `1rsppXP2iYSwGfxFjJodcORngYe72H17f`, sha256 `4e185d7e71426919…`) |
| **Lamp and lighting direction only** | Original approved keyframe `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` (Drive Edit, id `1OSS-agAWJRjwaVxalzPehxnasD0VNp4Y`) |
| Output name | `5.7_key_v5.png`, saved to Drive Edit as a new file (never replaces v4) |
| Tool | ChatGPT Image Generation, new chat, as an **edit** of v4 |

## Attach, in this order

1. `5.7_key_v4.png`: the image to edit; the face, head, eyes, mouth, hair, shirt and framing all come from here
2. `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png`: **the lamp and the light only**; never its face, open mouth or head angle

No identity panels are attached: the face must come from v4 alone.

## What "restore" means here (from the measurements)

| | Original (target) | v4 now |
| --- | --- | --- |
| Lamp | tall glass chimney filling the right edge from near the top of the frame (top cropped) down to the lamp base; flame at about the height of his mouth and chin; bright area about 2.8% of the frame | small chimney at mid-height on the right edge; bright area about 1.0% |
| Light on the face | warm amber key from the lamp at frame-right: the side of the face toward the lamp is the brighter, warmer side; the other side falls into deep teal shadow | warm key falls on the frame-left side of the face; the lamp side is darker; the lamp reads as a rim on the hair |

With his head now turned toward frame-left, the side of his face nearest the lamp is the cheek turned toward the camera.
That cheek, the side of the nose and the jaw on the lamp side take the warm key; the far side of the face goes to teal
shadow.

## Prompt

```text
Edit the FIRST attached image. This is a careful lighting and prop edit, not a new image. The FIRST image is the only source for the man, his face, his pose and the framing.

Make ONLY these two changes:
1. The oil lamp at frame-right: make it the same size and in the same position as the lamp in the SECOND attached image: a tall glass chimney filling the right edge of the frame from near the top (top of the chimney cropped by the frame) down to the lamp base, with the flame at about the height of his mouth and chin. Same warm glow as in the second image. Use the second image ONLY for the lamp; do not copy the man's face, open mouth, head angle or framing from it.
2. The light on his face: the oil lamp at frame-right is the key light, exactly as in the SECOND attached image. The side of his face nearest the lamp, the cheek now turned toward the camera, the side of his nose and his jaw on that side, takes the warm amber light. The far side of his face falls into deep teal shadow. A soft warm rim on the hair on the lamp side. Same amber-against-teal colour and the same overall brightness as the second image.

STRICTLY PRESERVE everything else exactly as it is in the FIRST image:
- His exact face and identity: the same face shape, nose, cheeks, brows, eyes, beard, moustache, hairline and age. Only the light falling on the same face changes. Do not regenerate, redesign, beautify, slim, sharpen, age or reshape the face.
- The same head angle, turned toward the left edge of the image, upright, and the same eye direction: looking past the left edge of the frame at the mirror, not at the camera.
- The same mouth and lips (closed, just parted, no teeth), the same chin and lower face, the same expression: brows down and drawn together, jaw tight, fury with fear.
- The same wet, wavy, shoulder-length hair and the same natural skin texture with pores and sweat sheen.
- The same charcoal-grey shirt with the collar and top button open.
- The same camera framing, his same position and size in the frame, and the same 16:9 composition.

Avoid: a different face, a thinner or longer face, hollow cheeks, an older look, a changed nose, a changed head angle, the eyes looking at the camera, an open mouth, teeth, a smile, beautified or smoothed skin, the face or open mouth of the second image, a light source on the left, a lamp smaller than in the second image, a necklace or chain, text, logos, watermark, a second person, a figure behind him, changed framing, cartoon, 3D render.
```

## How I will check v5 (before you decide)

| Check | v4 now | v5 must show |
| --- | --- | --- |
| Identity vs v4 (same angle, so it should stay high) | — | face-match about 0.85 or higher; same man by eye |
| Identity vs A2 / A1 | 0.65 / 0.59 | not lower |
| Head yaw / roll | −30.3° / −0.3° | unchanged (within a few degrees) |
| Eyes | past the left edge, at the mirror | unchanged |
| Lips / chin / face shape | 0.16 / 0.38 / 1.09 | unchanged |
| Lamp | small, mid-height; bright area ~1.0% of the frame | as the original: tall chimney from near the top; bright area about 2.5–3% |
| Light on the face | frame-left side brighter | **lamp side (frame-right side of the face) brighter and warmer**, far side in teal shadow, as in the original |
| Shirt, hair, skin, framing, 16:9 | — | identical to v4 (including his position left of centre) |

Note: relighting can tempt ChatGPT to redraw the face. If v5 shifts the face, v4 stays available as it is.

Nothing is generated until you approve this prompt and say go.

**Result (15 Nov):** `5.7_key_v5.png` received and reviewed: see `SHOT_5.7_V5_REVIEW.md`. Not approved yet.
