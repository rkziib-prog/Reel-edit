#!/usr/bin/env python3
"""Expand the approved A/B/C panel prompts into exact copy-paste prompts for ChatGPT Image Generation.
Text comes from the approved blocks (identity lock, light, negative, costume). Writes CHATGPT_PANELS.md.
Run from this folder: python3 build_chatgpt_prompts.py"""

IDENTITY = ("Use the attached Aadhi Identity Board V2 and the matching original photograph as strict identity references. "
            "The character must represent the same real person shown in the photographs. Preserve exact facial structure and "
            "natural facial proportions; preserve eye shape, eyebrows, nose, lips, jawline and ears; maintain the same natural "
            "skin tone and texture; preserve shoulder-length wavy black hair, natural hairline, short beard and moustache; "
            "maintain realistic body proportions. No beautification, face slimming, artificial symmetry or age changes. Never "
            "mirror or flip the character. Do not invent facial details that contradict the reference photographs. Generate "
            "only the requested panel; no extra panels, captions, labels or text. Photorealistic cinematic character-reference "
            "photography, natural skin texture, realistic anatomy, consistent lighting, high detail.")
LIGHT = ("Lighting: soft, even studio light from a large frontal softbox, gentle fill, neutral 5600 K, no hard shadows; plain "
         "seamless mid-grey background; 85 mm lens look, f/8, sharp focus on the eyes, true-to-life colour, film-still realism.")
AVOID = ("Avoid: beautified, airbrushed, smoothed or plastic skin, makeup, changed face shape, slimmer face, younger face, "
         "different nose, different eyes, different beard or hairstyle, extra or duplicated facial features, asymmetrical or "
         "melted eyes, extra fingers, distorted hands, necklace, chain, jewellery, artificial symmetry, mirrored or flipped "
         "face, extra panels, labels, rings, tattoos not in the references, logos, printed text on clothing, watermark, "
         "captions, cartoon, illustration, 3D render, CGI look, oversaturated, HDR halo, blurry, low resolution")
BASE = "Clothing: plain charcoal-grey crew-neck T-shirt with no print, plain black knee-length shorts, barefoot."
BASE_TOP = "Clothing: plain charcoal-grey crew-neck T-shirt with no print."
COSTUME = ("Costume: charcoal-grey cotton shirt, full sleeves rolled to the elbow, a single chest pocket on the LEFT side of his "
           "chest, top button open, no logo or label; plain black mundu (Kerala wrap), single fold, ankle length; barefoot; "
           "his own black digital wristwatch (square case, black resin strap, exactly as in the watch reference) on his RIGHT "
           "wrist, display small and unreadable; no necklace, no other jewellery; right hand dominant.")
C_AVOID = ", watch on left wrist, steel or analogue watch, smartwatch, shirt print, two pockets, pocket on the right, buttoned collar, white mundu, coloured border on the mundu, sandals, shoes, trousers, jeans"
EXPR_AVOID = ", exaggerated expression, grimace, cartoonish emotion"

# (id, title, reference photo(s), format, panel text, clothing, light override, extra avoid)
P = [
 ("A1", "Front view", "IMG_8749", "portrait", "Front view, facing the camera directly, eyes to lens, neutral expression, mouth closed, relaxed, chest-up framing.", BASE_TOP, None, ""),
 ("A2", "Three-quarter left", "IMG_8708", "portrait", "Head and body turned 45 degrees to frame-left, eyes following the head, neutral expression, mouth closed, chest-up framing.", BASE_TOP, None, ""),
 ("A3", "Three-quarter right", "IMG_8722", "portrait", "Head and body turned 45 degrees to frame-right, eyes following the head, neutral expression, mouth closed, chest-up framing.", BASE_TOP, None, ""),
 ("A4", "Left profile", "IMG_8729", "portrait", "Exact 90-degree profile facing frame-left, showing his left side, ear, jawline and hairline; neutral expression, mouth closed, chest-up framing.", BASE_TOP, None, ""),
 ("A5", "Right profile", "IMG_8780", "portrait", "Exact 90-degree profile facing frame-right, showing his right side, ear, jawline and hairline; neutral expression, mouth closed, chest-up framing.", BASE_TOP, None, ""),
 ("A6", "Full body front", "IMG_8759", "portrait", "Full body standing, head to bare feet in frame, facing the camera, arms relaxed at his sides, natural posture, neutral expression.", BASE, None, ""),
 ("A7", "Full body three-quarter", "IMG_8708", "portrait", "Full body standing, turned 45 degrees to frame-left, head to bare feet in frame, arms relaxed, neutral expression.", BASE, None, ""),
 ("A8", "Full body back", "IMG_8772", "portrait", "Full body standing, seen from directly behind, head to bare feet in frame, arms relaxed at his sides.", BASE, None, ""),
 ("B1", "Neutral", "IMG_8749", "portrait", "Chest-up, front view, eyes to camera. Expression: calm and neutral, relaxed face, mouth closed, steady gaze.", BASE_TOP, None, EXPR_AVOID),
 ("B2", "Fear", "IMG_8799", "portrait", "Chest-up, front view, eyes to camera. Expression: quiet, underplayed fear: eyes wide, brows raised and drawn together, mouth slightly open, held breath; not screaming. Only the facial muscles change; the face itself stays exactly as in the references.", BASE_TOP, None, EXPR_AVOID),
 ("B3", "Suspicion", "IMG_8749 + IMG_8708", "portrait", "Chest-up, head turned 15 degrees to frame-left with the eyes still on the lens. Expression: suspicion: eyes narrowed slightly, one brow a little lower, lips pressed together. Only the facial muscles change; the face itself stays exactly as in the references.", BASE_TOP, None, EXPR_AVOID),
 ("B4", "Anger", "IMG_8749 + IMG_8799", "portrait", "Chest-up, front view, eyes to camera. Expression: contained anger: brows down and together, jaw clenched, nostrils slightly flared, lips tight; not shouting. Only the facial muscles change; the face itself stays exactly as in the references.", BASE_TOP, None, EXPR_AVOID),
 ("B5", "Cold mysterious smile", "IMG_8813", "portrait", "Chest-up, front view, eyes to camera. Expression: a slight, controlled closed-lip smile; the eyes calm and not smiling; a little too relaxed; unsettling stillness. Only the facial muscles change; the face itself stays exactly as in the references.", BASE_TOP, None, EXPR_AVOID + ", teeth showing"),
 ("C1", "Costume, full body front", "IMG_8759 + IMG_8843 (watch)", "portrait", "Full body standing, head to bare feet in frame, facing the camera, arms relaxed at his sides, both forearms and the watch visible, neutral expression.", COSTUME, None, C_AVOID),
 ("C2", "Costume, full body three-quarter", "IMG_8708 + IMG_8843 (watch)", "portrait", "Full body standing, turned 45 degrees to frame-left, head to bare feet in frame, right forearm with the watch toward the camera, neutral expression.", COSTUME, None, C_AVOID),
 ("C3", "Costume, full body back", "IMG_8772", "portrait", "Full body standing, seen from directly behind, head to bare feet in frame, the mundu fold and the rolled sleeves visible.", COSTUME, None, C_AVOID),
 ("C4", "Detail: watch and hand", "IMG_8843 (watch)", "square", "Close-up of his RIGHT forearm and hand, shirt sleeve rolled to the elbow, his black digital watch on the right wrist, natural skin and hair on the arm, relaxed hand.", COSTUME, None, C_AVOID),
 ("C5", "Detail: pocket and collar", "IMG_8749", "square", "Chest close-up: the open top button, the single pocket on the LEFT side of his chest, plain charcoal cotton weave.", COSTUME, None, C_AVOID),
 ("C6", "Real Aadhi, day 7", "IMG_8749", "portrait", "Chest-up, front view. Seven days without sleep: bloodshot eyes, darker under-eyes, dry cracked lips, damp untidy hair; face shape and features unchanged; an exhausted, pleading expression. The same man, only exhausted.", COSTUME, None, C_AVOID),
 ("C7", "Light test: mirror side", "IMG_8749", "portrait", "Chest-up, front view, damp hair, neutral uneasy expression.", COSTUME, "Lighting: a single oil lamp from frame-left as the only light, warm amber key on his face, deep teal shadows, dark background, night; photorealistic, 85 mm lens look, film-still realism.", C_AVOID),
 ("C8", "Light test: real side", "IMG_8749", "portrait", "Chest-up, front view, dry hair, calm expression.", COSTUME, "Lighting: soft morning daylight through wooden window bars from frame-left, warm and dry, dust in the air, gentle shadows of the bars; photorealistic, 85 mm lens look, film-still realism.", C_AVOID),
]

out = ["# THE OTHER SIDE — ChatGPT Image Generation prompts (one panel at a time)", "",
       "Generated from the approved prompts A, B and C. For each panel: start a NEW chat in the ChatGPT app, attach "
       "`tos_identity_board_v2.jpg` and the reference photo(s) listed, choose the format, paste the prompt block exactly. "
       "ChatGPT has no separate negative-prompt field, so the negative prompt is the final \"Avoid:\" line. "
       "Download the result and upload it to the Drive Edit folder as `<panel>_v1.png` (then `_v2`, ...).", ""]
for pid, title, ref, fmt, text, cloth, light, avoid in P:
    body = "\n\n".join([IDENTITY, f"Panel {pid}, {title}: {text}", cloth, light or LIGHT, AVOID + avoid + "."])
    out += [f"## {pid} — {title}", "", f"- Attach: `tos_identity_board_v2.jpg` + `{ref}`", f"- Format: {fmt}",
            f"- Save as: `{pid}_v1.png`", "", "```text", body, "```", ""]
open("CHATGPT_PANELS.md", "w").write("\n".join(out))
print(len(P), "panels written")
