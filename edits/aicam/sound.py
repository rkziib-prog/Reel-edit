# Sound for the AI traffic camera explainer: an upbeat synth music bed + UI SFX (pops for cards, whooshes, beeps, barrier, SMS, stamp).
# Reads work/aicam/timeline.json; writes work/aicam/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/aicam"
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
def shutter(t0, g=.4):
    for d in (0, .06): n = int(.05 * SR); put(t0 + d, hp(rng.standard_normal(n), 2500) * env(n, .001, .01), g)
def buzz(t0, g=.3): n = int(.5 * SR); tt = np.arange(n) / SR; put(t0, np.sign(np.sin(2 * np.pi * 150 * tt)) * (np.sin(2 * np.pi * 12 * tt) > 0) * .3, g)
whoosh(S[0] + .2, 2.4, .25); buzz(A[0] + 3.2); pop(E[0] - .8, .3, 600)
whoosh(A[1] + .4, 1.2, .25); pop(A[1] + 1.4)
for k in np.arange(S[2] + .8, A[2] + 3.0, 1.6): shutter(k)
pop(A[2] + 3.0); shutter(A[2] + 3.6, .3)
whoosh(A[3] + .2, 1.0, .2); pop(E[3] - 2.2)
for k in range(18): pop(A[4] + .2 + k * .12, .1, 700 + 30 * k)
pop(A[4] + 2.8); pop(A[4] + 4.4)
for d in (2.0, 2.6, 3.2): beep(A[5] + d, 1400 + 200 * (d - 2), .08, .2)
beep(A[6] + 1.2, 330, .3, .3); pop(E[6] - 1.6)
for d in (.2, 1.4, 2.6): beep(A[7] + d, 330, .2, .2)
for k in range(13): beep(A[8] + 1.0 + k * .14, 1800, .03, .1)
pop(E[8] - 1.8)
whoosh(A[9] + .4, 1.2, .2); pop(A[9] + 2.2)
pop(A[10] + .4); beep(E[10] - 1.6, 1320, .12, .2); beep(E[10] - 1.48, 1760, .16, .2)
buzz(A[11] + .8, .35)
pop(E[12] - 1.6); buzz(E[12] - 1.6, .25)
pop(A[13]); pop(E[13] - 2.4)
beep(E[14] - 1.0, 880, .1, .25); beep(E[14] - .9, 1320, .15, .25)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
