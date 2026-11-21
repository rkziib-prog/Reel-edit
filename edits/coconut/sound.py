# Sound for the coconut explainer: an upbeat synth music bed + UI SFX (pops for cards, whooshes, beeps, barrier, SMS, stamp).
# Reads work/coconut/timeline.json; writes work/coconut/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/coconut"
tl = json.load(open(f"{W}/timeline.json"))
S, A, E, TOTAL = tl["shots"], tl["starts"], tl["ends"], tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(5)
out = np.zeros(N)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'highpass', fs=SR, output='sos'), x)
def put(t, x, g=1.0):
    o = int(t * SR)
    if o >= N or o < 0: return
    x = x[:N - o]; out[o:o + len(x)] += g * x
def env(n, a=.01, r=.2):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / r)
t = np.arange(N) / SR

# music bed: 100 bpm, soft plucked arpeggio over C - G - Am - F, light kick on beats 1 and 3
BEAT = .6; CH = [[261.6, 329.6, 392.0], [196.0, 246.9, 293.7], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6]]
k = 0
for b in np.arange(0, TOTAL - 1.5, BEAT / 2):
    chord = CH[int(b // (BEAT * 4)) % 4]; f = chord[k % 3] * (2 if k % 6 >= 3 else 1); k += 1
    n = int(.4 * SR); tt = np.arange(n) / SR
    put(b, (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 9), .09)
for b in np.arange(0, TOTAL - 1.5, BEAT * 2):
    n = int(.25 * SR); tt = np.arange(n) / SR; put(b, np.sin(2 * np.pi * (55 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14), .25)
fade = np.interp(t, [0, 1, TOTAL - 2, TOTAL - .5], [0, 1, 1, 0]); out *= fade
# UI sounds
def pop(t0, g=.35, f=900):
    n = int(.09 * SR); tt = np.arange(n) / SR; put(t0, np.sin(2 * np.pi * (f + 900 * tt / tt[-1]) * tt) * env(n, .002, .03), g)
def whoosh(t0, d, g):
    n = int(d * SR); x = bp(rng.standard_normal(n), 600, 4000) * np.sin(np.pi * np.arange(n) / n) ** 2; put(t0, x / np.abs(x).max(), g)
def drip(t0, g=.25): n = int(.08 * SR); tt = np.arange(n) / SR; put(t0, np.sin(2 * np.pi * (1500 - 5000 * tt) * tt) * env(n, .001, .02), g)
def chime(t0, g=.2):
    for k, f in enumerate((1046.5, 1318.5, 1568.0)): n = int(.6 * SR); tt = np.arange(n) / SR; put(t0 + k * .08, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 6), g)
whoosh(S[0] + 1.2, 1.8, .25); pop(E[0] - 1.2, .3, 600)
pop(A[1] + .8); chime(A[1] + .4, .12)
for k in np.arange(A[2] + .3, S[3], .35): drip(k, .12)
pop(A[2] + .5); pop(A[2] + 2.2)
for k in np.arange(S[3] + .2, S[4], .4): drip(k, .1)
pop(A[3] + 1.4); pop(A[3] + 2.0)
n = int(1.5 * SR); put(S[4] + .3, bp(rng.standard_normal(n), 200, 900) * np.sin(np.pi * np.arange(n) / n), .15)
pop(E[4] - 1.8); pop(A[5] + .8); pop(E[5] - 1.4)
whoosh(A[6] + .2, 2.2, .15); chime(A[6] + 1.8, .15)
whoosh(A[7] + 1.0, 3.4, .12); pop(A[7] + 3.0)
pop(A[8] + 1.6)
for d in (.4, .7, 1.0): pop(A[9] + d, .25, 700)
pop(A[10] + .6); whoosh(A[10] + 1.8, 1.4, .2)
for k in np.arange(A[11] + 1.0, S[12], .5): drip(k, .12)
pop(A[11] + 1.8); chime(E[12] - 2.0, .2)
pop(A[13]); pop(E[13] - 2.0)
for k in np.arange(S[13] + .5, S[14], 1.0): n = int(.03 * SR); put(k, hp(rng.standard_normal(n), 2500) * env(n, .001, .006), .2)
pop(E[14] - 1.0, .3)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
