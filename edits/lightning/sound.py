# Sound for the lightning explainer: an upbeat synth music bed + UI SFX (pops for cards, whooshes, beeps, barrier, SMS, stamp).
# Reads work/lightning/timeline.json; writes work/lightning/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/lightning"
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
out *= .55   # softer music bed under storm sounds
# UI sounds + storm
def pop(t0, g=.35, f=900):
    n = int(.09 * SR); tt = np.arange(n) / SR; put(t0, np.sin(2 * np.pi * (f + 900 * tt / tt[-1]) * tt) * env(n, .002, .03), g)
def crack(t0, g=.7):
    n = int(.25 * SR); put(t0, hp(rng.standard_normal(n), 1500) * env(n, .001, .04), g)
def thunder(t0, d, g):
    n = int(d * SR); tt = np.arange(n) / SR; x = lp(rng.standard_normal(n), 180) * (1 + .6 * lp(rng.standard_normal(n), 3)) * np.exp(-tt * 1.2) * np.minimum(1, tt / .08)
    put(t0, x / (np.abs(x).max() + 1e-9), g)
def tick(t0, g=.25): n = int(.03 * SR); put(t0, hp(rng.standard_normal(n), 2500) * env(n, .001, .006), g)
rain = bp(rng.standard_normal(N), 1500, 8000); rl = np.interp(t, [0, 1, S[2], S[2] + .5, S[3], S[4], S[4] + .4, S[5], S[6], S[6] + .4, TOTAL - 1, TOTAL], [0, .8, .8, .3, .8, .8, .3, .6, .6, .2, .2, 0])
out += rain / np.abs(rain).max() * rl * .12
crack(S[0] + .2); thunder(S[0] + .5, 3.0, .8); pop(E[0] - .5)
for k in np.arange(S[1] + .2, S[2], .5): tick(k, .15)
pop(A[1] + 1.0)
for k in range(10): pop(A[2] + 1.8 + k * .1, .1, 1200)
pop(A[2] + 2.6)
crack(A[3] + 1.6, .8); thunder(A[3] + 1.7, 2.5, .6); pop(A[3] + 2.6)
n = int(2.0 * SR); tt = np.arange(n) / SR; put(A[4] + .6, np.sin(2 * np.pi * (300 + 600 * tt / 2) * tt) * .3 * np.minimum(1, tt / .1) * np.minimum(1, (2 - tt) / .2), .2)
thunder(A[5] + .3, 3.5, .9); pop(E[5] - 1.4)
pop(A[6] + 1.0); pop(E[6] - 1.0, .3, 600)
n = int(.5 * SR); put(A[7] + .2, bp(rng.standard_normal(n), 2000, 8000) * np.sin(np.pi * np.arange(n) / n), .3)
for k in range(3): pop(A[8] + .4 + k * .5, .12, 300)
crack(A[9] + .8, .6)
for k in range(9): tick(A[9] + 1.2 + k, .3)
thunder(A[9] + 1.2 + 9, 2.0, .5)
pop(A[10] + .2); pop(A[10] + 2.0); pop(A[11] + .3); pop(E[11] - 1.8)
pop(A[12] + .6); pop(A[12] + 1.6, .35, 1300); pop(A[12] + 3.6, .35, 500)
pop(A[13] + .6, .4); pop(E[14] - 1.0, .3)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
