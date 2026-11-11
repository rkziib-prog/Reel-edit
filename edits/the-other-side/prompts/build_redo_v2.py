#!/usr/bin/env python3
"""Regeneration prompts (v2) for panels flagged in the 11 Nov review. Reuses the approved panel prompts from
build_chatgpt_prompts.py unchanged and adds one correction line plus extra Avoid terms. Writes REDO_v2.md."""
import build_chatgpt_prompts as b

FIX = {
 "A6": ("Body build: slim, lean build exactly as in the full-body reference IMG_8759: slender arms, narrow shoulders, no visible muscle definition.",
        ", muscular, athletic build, defined biceps, broad shoulders, gym physique"),
 "A7": ("Body build: slim, lean build exactly as in the full-body reference IMG_8759: slender arms, narrow shoulders, no visible muscle definition.",
        ", muscular, athletic build, defined biceps, broad shoulders, gym physique"),
 "B3": ("Keep the eyes and brows exactly as in the reference; the suspicion is subtle, a slight narrowing only, not a glare; face not thinner.",
        ", glare, scowl, gaunt face, sunken cheeks"),
 "B5": ("The smile must be clearly visible but small: closed lips, the corners of the mouth lifted as in IMG_8813, eyes calm.",
        ", neutral mouth, no smile"),
 "C6": ("Same age and face shape as the reference: show the seven days only through the eyes, under-eyes, lips, skin sheen and hair. Keep the cheeks, eyebrows, nose and beard exactly as in IMG_8749.",
        ", older, aged face, gaunt, hollow cheeks, deep wrinkles, heavier brows, wider nose, different face"),
 "C7": ("The face must stay fully recognisable as the man in IMG_8749: add a soft fill on the shadow side so the eyes, brows and nose read clearly; beard and moustache trimmed exactly as in the reference.",
        ", heavier brows, hooded eyes, wider nose, thicker moustache, older, different face"),
}
out = ["# THE OTHER SIDE — regeneration prompts v2 (11 Nov review)", "",
       "Same steps as before: new chat, attach `tos_identity_board_v2.jpg` + the reference photo(s), paste exactly. "
       "Save as `<panel>_v2.png` in the Drive Edit folder.", ""]
for pid, title, ref, fmt, text, cloth, light, avoid in b.P:
    if pid not in FIX: continue
    fix, extra = FIX[pid]
    body = "\n\n".join([b.IDENTITY, f"Panel {pid}, {title}: {text}", fix, cloth, light or b.LIGHT, b.AVOID + avoid + extra + "."])
    ref2 = ref if pid not in ("A6", "A7") else ref + (" + IMG_8759" if "8759" not in ref else "")
    out += [f"## {pid} — {title} (v2)", "", f"- Attach: `tos_identity_board_v2.jpg` + `{ref2}`", f"- Format: {fmt}",
            f"- Save as: `{pid}_v2.png`", "", "```text", body, "```", ""]
open("REDO_v2.md", "w").write("\n".join(out))
print(len(FIX), "redo prompts written")
