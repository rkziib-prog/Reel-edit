# Meera — AI persona (Instagram)

Fictional adult (24). Every post labelled "AI info" on Instagram; bio says AI creator. Never based on a real person.

## Locked identity
- Face: oval, high cheekbones, almond dark-brown eyes, thick defined brows, straight nose, full lips,
  small mole on her RIGHT cheek just beside the right corner of her mouth (image-left on a front shot),
  warm light-medium brown skin with natural texture (skin tone follows the master image).
- Hair: long wavy black hair, centre part, past the shoulders.
- Body: 5'6", slim athletic build, defined waist, long legs.
- Signature: thin gold nose stud (left nostril), small gold hoop earrings, red-brown lip shade.
- Persona: 24, from Kochi, lives in Bangalore; fashion / travel / lifestyle; confident, warm, playful.

## Step 1 — Master face (ChatGPT image generation, new chat)
Photorealistic close-up portrait of a 24-year-old South Indian woman from Kerala, facing the camera directly,
head and shoulders, neutral relaxed expression with a slight hint of a smile. Oval face, high cheekbones,
almond-shaped dark-brown eyes, thick naturally defined eyebrows, straight nose, full lips with a red-brown
lip shade, a small mole just above the left corner of her upper lip, warm medium-brown skin with natural
texture and visible pores. Long wavy black hair with a centre part, falling past her shoulders. Thin gold
nose stud in the left nostril, small gold hoop earrings. Plain black fitted top. Soft window light from the
front-left, neutral light-grey background. Shot on an 85mm lens, f/2.8, sharp focus on the eyes, natural
colour, no retouching look. Vertical 4:5.
Avoid: makeup-filter skin, plastic or airbrushed skin, cartoon or CGI look, heavy makeup, jewellery other
than the nose stud and hoops, necklace, tattoos, glasses, text, watermark, extra fingers, asymmetrical eyes.

**APPROVED 18 Nov: `meera_master_v1.png`** (read-only copy `input/meera_refs/`). This image overrides the text
above wherever they differ. Never regenerate the master.

## Step 2 — Character sheet (one panel per NEW ChatGPT chat, attach meera_master_v1.png every time)
Start every panel prompt with this identity lock:

> Use the attached photo as the exact identity reference. Same woman: same face shape, eyes, eyebrows, nose,
> lips, the small mole on her right cheek beside the right corner of her mouth, same skin tone and skin
> texture, same long wavy black hair with centre part, thin gold nose stud in her left nostril, small gold
> hoop earrings. Do not change, beautify or idealise her face. Photorealistic, natural skin with pores,
> soft studio light, plain light-grey background, 85mm lens.

Then add the panel line, then the shared Avoid line.

When her thighs are visible (shorts, short dresses), add to the lock:
> She has one small dark mole on the upper front of her right thigh, toward the outer side, a few centimetres below the hem of her shorts.

- **S1 front smile:** Head and shoulders, facing the camera directly, warm natural smile showing a little teeth, plain black fitted top. Vertical 4:5.
- **S2 three-quarter:** Head and shoulders, head turned 45 degrees to her left (face toward frame-right), eyes to the camera, relaxed expression, plain black fitted top. Vertical 4:5.
- **S3 profile:** Head and shoulders, exact side profile facing frame-left (her left side visible, nose stud visible, the mole is on the hidden side), neutral expression, hair tucked behind the ear. Vertical 4:5.
  (Facing frame-right shows her RIGHT side: mole visible, stud hidden. v1 got this wrong; v2 is correct.)
- **S4 full body front:** Full body head to feet, standing straight facing the camera, arms relaxed, 5'6" slim athletic build, defined waist, long legs, fitted black t-shirt, high-waisted blue jeans, white sneakers. Vertical 9:16.
- **S5 full body three-quarter:** Full body head to feet, body turned 45 degrees, one hand on hip, looking over at the camera, same outfit as a fitted black t-shirt, high-waisted blue jeans, white sneakers, same build. Vertical 9:16.
- **S6 confident close-up:** Tight close-up of the face, serious confident expression, direct eye contact, slight head tilt. Vertical 4:5.

Avoid: a different face, changed eye shape, smoothed or plastic skin, heavy makeup, beauty filter, cartoon or
CGI look, extra jewellery, necklace, tattoos, glasses, mole on the wrong side, text, watermark, extra fingers,
distorted hands.

Upload as `meera_S1_v1.png` ... `meera_S6_v1.png` to Drive Edit. Check: the mole must be on her right cheek
(image-left in front shots); ChatGPT sometimes mirrors it.

## Extra references (approved identity, not sheet panels)
- `meera_extra01_kurta.png` (18 Nov): white chikankari kurta, indoor window light, looking off-camera, closed smile.
  Identity match confirmed (mole, nose stud, hoops, brows, hair). Usable as a post / Kling start frame.

## Sheet review (18 Nov)
S1, S2, S4, S5, S6 v1 pass. S3 v1 rejected (stud on wrong nostril, prompt error); S3 v2 passes.
Local read-only copies: `input/meera_sheet/` (S3 v2 saved as `meera_S3_v2.png`; Drive name still `meera_S3_v1.png`).
**ALL PANELS APPROVED and FROZEN (18 Nov).** Never regenerate. Character sheet: `output/meera_character_sheet.jpg`
from `edits/meera-persona/character_sheet.py`. Use the sheet + master as references for every new image/keyframe.
- S7 shorts full body (18 Nov) APPROVED: thigh-mole reference `input/meera_sheet/meera_S7_shorts_v1.png`.
