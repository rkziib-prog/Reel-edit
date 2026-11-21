# Sound for the UPI explainer: an upbeat synth music bed + UI SFX (pops for cards, whooshes, beeps, barrier, SMS, stamp).
# Reads work/upi/timeline.json; writes work/upi/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/upi"
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
def beep(t0, f, d=.12, g=.25): n = int(d * SR); tt = np.arange(n) / SR; put(t0, np.sin(2 * np.pi * f * tt) * env(n, .003, d * .5), g)
def ting(t0, g=.35):
    for f, d in ((1318.5, 0), (1975.5, .09)): beep(t0 + d, f, .35, g)
beep(S[0] + .9, 1800, .05, .15); ting(A[0] + 3.0); pop(E[0] - 1.6, .3, 600)            # scan, ting, "?"
whoosh(S[1] + .8, 1.0, .25); pop(E[1] - 1.8)
pop(A[2] + .4); pop(E[2] - 1.8)
for d in range(4): beep(A[3] + .4 + d * .3, 900, .05, .15)                             # PIN taps
n = int(.25 * SR); put(A[3] + 2.4, hp(rng.standard_normal(n), 2000) * env(n, .002, .05), .3)   # lock click
pop(E[3] - 1.6)
whoosh(A[4] + .8, 1.6, .3); pop(E[4] - 1.8)
for d in range(5): pop(A[5] + .3 + d * .3, .2, 700 + d * 80)
pop(A[5] + 2.2)
pop(A[6] + 1.6); beep(A[6] + 2.2, 1568, .12, .2); pop(A[6] + 2.6); beep(A[6] + 3.2, 1568, .12, .2)
beep(A[7] + 1.8, 330, .25, .25)                                                          # debit
whoosh(A[8] + 1.2, 1.6, .3); ting(A[8] + 2.8, .25); pop(E[8] - 1.6)
ting(A[9] + .4, .3); pop(E[9] - 2.0)
whoosh(A[10] + .4, 2.0, .15); pop(E[10] - 2.2)
for d in range(8): pop(A[11] + .3 + d * .25, .18, 600 + d * 60)
pop(A[12] + .1); pop(E[12] - 2.6, .4)
beep(E[13] - 1.4, 330, .35, .3); beep(E[13] - 1.05, 262, .45, .3)
n = int(.3 * SR); put(E[13] - 1.4, lp(rng.standard_normal(n), 600) * env(n, .002, .06), .5)
beep(E[14] - 1.0, 880, .1, .25); beep(E[14] - .9, 1320, .15, .25)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
