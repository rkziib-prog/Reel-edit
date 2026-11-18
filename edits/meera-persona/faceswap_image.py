#!/usr/bin/env python3
"""Put Meera's locked master face onto an AI image (Kling etc.) whose face drifted.

Usage (repo root): python3 edits/meera-persona/faceswap_image.py <target.png> <out.png> [--source master.png]
Swaps the largest face with insightface inswapper_128 (CPU) and prints ArcFace similarity to the master
before and after. Inputs are never modified; the output must be a new file name.
"""
import argparse, os, sys
import cv2
import numpy as np
from insightface.app import FaceAnalysis
import insightface

ap = argparse.ArgumentParser()
ap.add_argument("target"); ap.add_argument("out")
ap.add_argument("--source", default="input/meera_refs/meera_master_v1.png")
a = ap.parse_args()
if os.path.exists(a.out):
    sys.exit(f"refusing to overwrite {a.out}")

app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
app.prepare(ctx_id=-1, det_size=(640, 640))
swapper = insightface.model_zoo.get_model(os.path.expanduser("~/.insightface/models/inswapper_128.onnx"),
                                          providers=["CPUExecutionProvider"])

def biggest(img):
    f = app.get(img)
    if not f:
        sys.exit("no face found")
    return max(f, key=lambda x: (x.bbox[2] - x.bbox[0]) * (x.bbox[3] - x.bbox[1]))

src = biggest(cv2.imread(a.source))
tgt_img = cv2.imread(a.target)
tgt = biggest(tgt_img)
sim = lambda f: float(np.dot(f.normed_embedding, src.normed_embedding))
print(f"face {tgt.bbox.astype(int)}  similarity to master before: {sim(tgt):.3f}")
out = swapper.get(tgt_img, tgt, src, paste_back=True)
print(f"similarity to master after:  {sim(biggest(out)):.3f}")
cv2.imwrite(a.out, out)
print(a.out)
