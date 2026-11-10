# Shared blocks (used by A, B and C)

**Attach as reference images in every generation:** `output/tos_identity_board_v2.jpg` (approved identity), plus the
single original photo named for that panel (better face detail than the board). Set the tool's reference strength
to its maximum for face/character.

**IDENTITY (user's identity lock, approved 11 Nov — paste at the top of every prompt)** —
Use the attached Aadhi Identity Board V2 and the matching original photograph as strict identity references. The
character must represent the same real person shown in the photographs. Preserve exact facial structure and natural
facial proportions; preserve eye shape, eyebrows, nose, lips, jawline and ears; maintain the same natural skin tone
and texture; preserve shoulder-length wavy black hair, natural hairline, short beard and moustache; maintain
realistic body proportions. No beautification, face slimming, artificial symmetry or age changes. Never mirror or
flip the character. Do not invent facial details that contradict the reference photographs. Generate only the
requested panel; no extra panels, captions, labels or text. Photorealistic cinematic character-reference
photography, natural skin texture, realistic anatomy, consistent lighting, high detail.

**LIGHT** — soft, even studio light from a large frontal softbox, gentle fill, neutral 5600 K, no hard shadows;
plain seamless mid-grey background (#808080); photorealistic, 85 mm lens look, f/8, sharp focus on the eyes,
true-to-life colour, film-still realism.

**NEGATIVE** — beautified, airbrushed, smoothed or plastic skin, makeup, changed face shape, slimmer face, younger
face, different nose, different eyes, different beard or hairstyle, extra or duplicated facial features, asymmetrical
or melted eyes, extra fingers, distorted hands, necklace, chain, jewellery, artificial symmetry, mirrored or flipped face, extra panels, labels, rings, tattoos not in the references,
logos, printed text on clothing, watermark, captions, cartoon, illustration, 3D render, CGI look, oversaturated,
HDR halo, blurry, low resolution.

**Tool (selected 11 Nov): ChatGPT Image Generation, ChatGPT app on iPad.** Exact per-panel prompts:
`CHATGPT_PANELS.md` (built by `build_chatgpt_prompts.py`). Rules: one panel per new chat; attach Identity Board V2
plus the panel's original photo; keep the identity lock at the top of every prompt; ChatGPT has no negative field, so
the negative prompt is the final "Avoid:" line; originals and the approved board are never edited; no images are
generated in Claude Code.

**Workflow** — generate each panel as its own image (identity holds far better than one big sheet), 2–4 variants
each; I compare every variant against the original photos and assemble the approved panels into the final sheet
locally, as with the identity board. Never mirror or flip any panel.
