# Sound for the pressure cooker explainer: an upbeat synth music bed + UI SFX (pops for cards, whooshes, beeps, barrier, SMS, stamp).
# Reads work/cooker/timeline.json; writes work/cooker/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/cooker"
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
def hiss(t0, d, g): n = int(d * SR); put(t0, hp(rng.standard_normal(n), 3000) * np.minimum(1, np.arange(n) / (.1 * SR)) * np.minimum(1, (n - np.arange(n)) / (.2 * SR)), g)
def whistle(t0, d, g):
    n = int(d * SR); tt = np.arange(n) / SR; f = 2300 + 150 * np.sin(2 * np.pi * 5 * tt)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .6 + bp(rng.standard_normal(n), 2000, 5000) * .4
    put(t0, x * np.minimum(1, tt / .15) * np.minimum(1, (tt[-1] - tt) / .3), g)
def burner(t0, t1, g): n = int((t1 - t0) * SR); put(t0, lp(rng.standard_normal(n), 400) * np.minimum(1, np.arange(n) / (.3 * SR)) * np.minimum(1, (n - np.arange(n)) / (.3 * SR)), g)
def click(t0, g=.5): n = int(.06 * SR); put(t0, hp(rng.standard_normal(n), 1500) * env(n, .001, .015), g)
burner(S[0], S[1], .2); whoosh(.2, 1.0, .3); pop(.3, .4, 600)
hiss(A[0] + 3.5, 1.5, .25)
whoosh(S[1] + .2, .8, .25); pop(A[1] + .8, .3, 600); pop(A[1] + 1.4)
burner(S[2], S[4], .2); hiss(S[2] + .2, S[4] - S[2] - .4, .06); pop(A[2] + 3.6)
pop(A[3] + 1.6)
click(A[4] + 1.0, .7); pop(A[4] + 1.3)
burner(S[5], S[7], .15)
for k in np.arange(A[5], A[5] + 2.4, .2): pop(k, .08, 500 + 400 * (k - A[5]))
pop(E[6] - 1.2)
for k in np.arange(A[7] + .2, A[7] + 3.4, .25): click(k, .15)
pop(A[7] + 2.0)
whoosh(A[8] + .6, 1.0, .2); pop(A[8] + 1.8)
whistle(A[9] + 1.6, 1.8, .45); pop(E[9] - 1.4)
whoosh(S[10] + .3, 1.6, .2); pop(A[10] + 1.6)
pop(A[11] + 2.6); pop(E[11] - 1.6, .3, 500)
whistle(A[12] + .8, 1.2, .25); pop(A[12] + 1.6)
pop(A[13]); pop(A[13] + .4); pop(A[13] + 3.0); pop(A[13] + 4.2)
pop(E[14] - 1.0, .3)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
