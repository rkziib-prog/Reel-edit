# THE OTHER SIDE — Shot 5.7 keyframe v4: correction prompt (for your review)

Status: **PROMPT ONLY, awaiting your review.** Nothing generated. No video, no Kling credits. The base image and the
original approved keyframe stay unchanged.

| | |
| --- | --- |
| Base image (the current v3) | Drive Edit `5.7_key_v3.png` (id `19OCPNtkPNOdKR-X_C1YvGsiHnK2-3NBp`, sha256 `4f45300c32c58797…`; this is the image first uploaded as v2) |
| Direction reference only | A2 `98B62E03-E52E-4E25-850B-A87415D83639.PNG` (head turned three-quarter to frame-left; measured yaw −35.9°) |
| Output name | `5.7_key_v4.png`, saved to Drive Edit as a new file (never replaces v3 or the original) |
| Tool | ChatGPT Image Generation, new chat, as an **edit** of the base image |

## Attach, in this order

1. `5.7_key_v3.png`: the image to edit (the only source of the face)
2. A2 `98B62E03-E52E-4E25-850B-A87415D83639.PNG`: **head direction only**

The Identity Board and A1 are deliberately **not attached**. Here the face must come from v3 itself; more face
references invite ChatGPT to rebuild the face from them, which is what made the trashed 17:11 image gaunt.

## Prompt

```text
Edit the FIRST attached image. This is a careful pose edit, not a new image.

Make ONLY these two changes:
1. Turn the man's head about 30 degrees toward the LEFT edge of the image, the same head direction as the man in the SECOND attached image (use the second image ONLY for the direction of the head; do not copy anything else from it: not his face, hair, clothes, light or background). His nose now points toward the left edge of the image, and the side of his face nearest the lamp turns slightly more toward the camera. Keep the head upright, not tilted to either side, with the same height in the frame.
2. Direct his eyes past the left edge of the image, at a mirror just off-screen at frame-left where his own reflection stands. His eyes are fixed on it, furious and frightened, not on the camera.

STRICTLY PRESERVE everything else exactly as it is in the FIRST image:
- His exact face and identity: the same face shape, cheeks, nose, brows, eyes, beard, moustache, hairline and age. Only the viewing angle of the same face changes. Do not beautify, slim, sharpen, age, reshape or regenerate the face.
- The mouth exactly as it is: lips closed and just parted, the same lip shape; the same chin and lower-face proportions. Do not open, close or reshape the mouth.
- The same expression: brows down and drawn together, jaw tight, fury with fear.
- The same wet, wavy, shoulder-length hair and the same natural skin texture with pores and sweat sheen.
- The same charcoal-grey shirt with the collar and top button open.
- The same lighting: the oil lamp at frame-right as the only key light, warm amber on his face, deep teal shadows, dark background.
- The same lamp: same size, same position, same glow.
- The same camera framing, crop, composition and 16:9 format.

Avoid: a different face, a thinner or longer face, hollow cheeks, an older look, a changed nose, an open mouth, teeth, a smile, beautified or smoothed skin, a head tilt, the eyes looking at the camera, a necklace or chain, text, logos, watermark, a second person, a figure behind him, changed lighting direction, a changed lamp, changed framing, cartoon, 3D render.
```

## How I will check v4 (before you decide)

Measured against the v3 base and the references; the numbers are support, the visual check decides.

| Check | v3 base now | v4 must show |
| --- | --- | --- |
| Head direction (yaw) | +13.7°, toward frame-right | about −25° to −35°, toward frame-left (A2 −35.9°) |
| Head tilt (roll) | −11° | upright, close to 0° |
| Eyes | near the lens | past the left edge, at the mirror |
| Identity vs the v3 base | — | face-match about 0.8 or higher, same man by eye; no gaunt or aged drift (the trashed 17:11 image fell to 0.59 against the original) |
| Identity vs A1 / A2 | 0.60 / 0.53 | not lower than these |
| Face shape (width/height) | 1.12 | about the same, about 1.10–1.15 at the new angle |
| Lips (opening / face height) | 0.17 | unchanged: closed, just parted, no teeth |
| Chin (mouth-to-chin / face height) | 0.39 | unchanged, about 0.38–0.41 |
| Beard, moustache, nose, cheeks, hair, skin | — | as in v3 |
| Shirt, lighting, lamp size, framing | — | identical to v3 |

## One point for you to decide before generating

The lamp in the current v3 is **larger and closer** than in the original approved keyframe `C55A5E62…png`. This prompt
keeps v3's lamp unchanged, since you asked for only the two changes. If you want the original's smaller lamp back, add
this line to change list 1–2 as a third change:

```text
3. Make the oil lamp at frame-right smaller and slightly further back, exactly as in the original keyframe (the glass chimney at the right edge, top cropped).
```

That would mean attaching the original `C55A5E62-52B4-4F3F-B83F-1E5265C1E023.png` as a third image, for the lamp only.

Nothing is generated until you approve this prompt. Kling runs only after a keyframe is approved and you give an
explicit OK to spend credits.
