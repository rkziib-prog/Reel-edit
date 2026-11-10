#!/usr/bin/env python3
"""Couple face-swap reel: the reference cinema clip with the actors' faces replaced by the couple's.

The user asked for his face in place of the actor's and his girlfriend's in place of the actress's, in the
reference reel they sent (a phone recording of a film on a cinema screen). Each detected face is matched by
identity (ArcFace similarity to the actor at 0.5 s and the actress at 2.0 s; gender detection misread her) and
swapped with insightface's inswapper_128 on CPU. Faces the detector is unsure of (hand over the face, tiny or
turned away: det < 0.72 or similarity < 0.2) are left alone, so the swap never paints over a hand. The other creator's
overlays are removed: the top text band (caption, Instagram icon, handle, music credit) is painted over and our
caption drawn instead, the on-screen handle watermark from ~9 s is blurred, and the clip ends on a held frame and
a fade before the creator's logo card.
Run from the repo root:  python3 edits/couple-cinema/faceswap_reel.py
Inputs: input/couple/reference.mp4, input/couple/IMG_4474.jpg (him), IMG_1938.jpg (her)
Output: output/couple_faceswap_reel.mp4
Models: ~/.insightface/models/buffalo_l (auto-download), ~/.insightface/models/inswapper_128.onnx (official
insightface release: github.com/deepinsight/insightface/releases/download/model-zoo/inswapper_128.onnx).
"""
import os, subprocess
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
import insightface
from insightface.app import FaceAnalysis

HERE = os.path.dirname(os.path.abspath(__file__))
REF = "input/couple/reference.mp4"
HIM, HER = "input/couple/IMG_4474.jpg", "input/couple/IMG_1938.jpg"
OUT = "output/couple_faceswap_reel.mp4"
FPS, W, H = 30, 720, 1280            # source size; upscaled to 1080x1920 on encode
END = 13.77                          # length of the music
LAST = 11.25                         # last source frame before the creator's logo card; held after this
TOP_BAND = (0, 250, W, 412)          # caption / icon / handle / music credit, 0 - 9.2 s
TOP_UNTIL = 9.2
MARK = (18, 755, 236, 852)           # on-screen handle watermark, from 9.0 s
MARK_FROM = 9.0
CAPTION, CAP_IN, CAP_OUT = "BETTER TOGETHER", 0.5, 6.5
FADE = (12.9, END)
ACTOR_AT, ACTRESS_AT = 0.5, 2.0     # frames that show each actor's face clearly
MIN_DET, MIN_SIM = 0.72, 0.2


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def load_face(app, path):
    img = cv2.cvtColor(np.asarray(ImageOps.exif_transpose(Image.open(path)).convert("RGB")), cv2.COLOR_RGB2BGR)
    faces = app.get(img)
    return max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))


def ref_embedding(app, t):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", REF, "-frames:v", "1", "-f", "rawvideo",
                          "-pix_fmt", "bgr24", "-"], capture_output=True).stdout
    img = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
    return max(app.get(img), key=lambda f: f.det_score).normed_embedding


def caption_rgba():
    font = ImageFont.truetype(f"{HERE}/fonts/PermanentMarker.ttf", 40)
    emoji = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", 109)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    tb = d.textbbox((0, 0), CAPTION, font=font)
    heart = Image.new("RGBA", (140, 140), (0, 0, 0, 0))
    ImageDraw.Draw(heart).text((0, 0), "❤️", font=emoji, embedded_color=True)
    heart = heart.crop(heart.getbbox()).resize((36, 34), Image.LANCZOS)
    total = tb[2] - tb[0] + 12 + heart.width
    x0, y0 = (W - total) // 2, 318
    d.text((x0 - tb[0], y0 - tb[1]), CAPTION, font=font, fill=(245, 242, 235, 255))
    layer.alpha_composite(heart, (x0 + tb[2] - tb[0] + 12, y0 + (tb[3] - tb[1] - heart.height) // 2 + 1))
    return np.asarray(layer, np.float32) / 255


def cover_band(img, rng):
    """Paint the top text band with the surrounding dark-ceiling colour, soft edges and matching grain."""
    x0, y0, x1, y1 = TOP_BAND
    above = img[y0 - 12:y0 - 2].reshape(-1, 3).mean(0)
    below = img[y1 + 2:y1 + 12].reshape(-1, 3).mean(0)
    k = np.linspace(0, 1, y1 - y0)[:, None, None]
    fill = above * (1 - k) + below * k + rng.normal(0, 1.6, (y1 - y0, x1 - x0, 1))
    mask = np.ones((y1 - y0, x1 - x0, 1), np.float32)
    f = 10
    ramp = np.linspace(0, 1, f)[:, None, None]
    mask[:f] *= ramp
    mask[-f:] *= ramp[::-1]
    reg = img[y0:y1, x0:x1].astype(np.float32)
    img[y0:y1, x0:x1] = np.clip(reg * (1 - mask) + fill * mask, 0, 255).astype(np.uint8)


def blur_mark(img):
    x0, y0, x1, y1 = MARK
    reg = img[y0:y1, x0:x1]
    small = cv2.resize(reg, ((x1 - x0) // 10, (y1 - y0) // 10), interpolation=cv2.INTER_AREA)
    img[y0:y1, x0:x1] = cv2.GaussianBlur(cv2.resize(small, (x1 - x0, y1 - y0), interpolation=cv2.INTER_LINEAR), (21, 21), 0)


def main():
    os.makedirs("output", exist_ok=True)
    app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
    app.prepare(ctx_id=-1, det_size=(640, 640))
    swapper = insightface.model_zoo.get_model(os.path.expanduser("~/.insightface/models/inswapper_128.onnx"),
                                              providers=["CPUExecutionProvider"])
    him, her = load_face(app, HIM), load_face(app, HER)
    ref_actor, ref_actress = ref_embedding(app, ACTOR_AT), ref_embedding(app, ACTRESS_AT)
    cap = caption_rgba()
    rng = np.random.default_rng(3)

    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", REF, "-t", str(LAST), "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                           stdout=subprocess.PIPE)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                            "-r", str(FPS), "-i", "-", "-i", REF, "-map", "0:v", "-map", "1:a",
                            "-vf", "scale=1080:1920:flags=lanczos",
                            "-af", f"atrim=0:{END},afade=t=out:st={END - 0.4}:d=0.4,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000",
                            "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p",
                            "-c:a", "aac", "-b:a", "160k", "-t", str(END), "-movflags", "+faststart", OUT],
                           stdin=subprocess.PIPE)
    n_total, i, last, stats = round(END * FPS), 0, None, {"him": 0, "her": 0, "skipped": 0}
    while True:
        buf = dec.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        t = i / FPS
        img = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
        for f in app.get(img):
            sa, sb = float(f.normed_embedding @ ref_actor), float(f.normed_embedding @ ref_actress)
            if f.det_score < MIN_DET or max(sa, sb) < MIN_SIM:
                stats["skipped"] += 1
                continue
            who = "him" if sa > sb else "her"
            stats[who] += 1
            img = swapper.get(img, f, him if who == "him" else her, paste_back=True)
        if t < TOP_UNTIL:
            cover_band(img, rng)
        if t >= MARK_FROM:
            blur_mark(img)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255
        if CAP_IN - 0.3 <= t <= CAP_OUT + 0.3:
            a = cap[..., 3:] * ease((t - CAP_IN + 0.3) / 0.3) * (1 - ease((t - CAP_OUT) / 0.3))
            rgb = rgb * (1 - a) + cap[..., :3] * a
        last = rgb
        enc.stdin.write((np.clip(rgb, 0, 1) * 255).astype(np.uint8).tobytes())
        i += 1
        if i % 60 == 0:
            print(f"frame {i} ({t:.1f}s) faces swapped so far {stats}", flush=True)
    # hold the last theatre frame with a slow push-out, then fade, instead of the creator's logo card
    hold = Image.fromarray((np.clip(last, 0, 1) * 255).astype(np.uint8))
    for j in range(i, n_total):
        t = j / FPS
        s = 1 - 0.06 * ease((t - LAST) / (END - LAST))
        im = hold.resize((round(W * s), round(H * s)), Image.LANCZOS)
        canvas = Image.new("RGB", (W, H), (3, 3, 4))
        canvas.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
        frame = np.asarray(canvas, np.float32) / 255 * (1 - ease((t - FADE[0]) / (FADE[1] - FADE[0])))
        enc.stdin.write((np.clip(frame, 0, 1) * 255).astype(np.uint8).tobytes())
    enc.stdin.close()
    enc.wait()
    print("wrote", OUT, "swaps:", stats)


if __name__ == "__main__":
    main()
