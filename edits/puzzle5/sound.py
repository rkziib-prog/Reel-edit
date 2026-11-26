# Sound for the Pathira Puzzle #2: an upbeat synth music bed + UI SFX (pops for cards, whooshes, beeps, barrier, SMS, stamp).
# Reads work/puzzle5/timeline.json; writes work/puzzle5/sfx_track.wav (48 kHz mono float).
import json, numpy as np, scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt

SR = 48000
W = "/home/user/Reel-edit/work/puzzle5"
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
out *= .6   # quieter music bed under a puzzle
# UI sounds
def pop(t0, g=.35, f=900):
    n = int(.09 * SR); tt = np.arange(n) / SR; put(t0, np.sin(2 * np.pi * (f + 900 * tt / tt[-1]) * tt) * env(n, .002, .03), g)
def tick(t0, g=.25, f=2500): n = int(.03 * SR); put(t0, hp(rng.standard_normal(n), f) * env(n, .001, .006), g)
def boom(t0, g=.6): n = int(.8 * SR); tt = np.arange(n) / SR; put(t0, (np.sin(2 * np.pi * (60 + 40 * np.exp(-tt * 8)) * tt) * np.exp(-tt * 4) + .3 * lp(rng.standard_normal(n), 800) * np.exp(-tt * 10)), g)
def alarm(t0, g=.3):
    for k in range(3):
        n = int(.15 * SR); tt = np.arange(n) / SR; put(t0 + k * .22, np.sign(np.sin(2 * np.pi * 1200 * tt)) * .5 * env(n, .002, .1), g)
ZERO = A[7] - .1
boom(.15); pop(.5, .4, 600)
pop(2.6, .35, 800); pop(2.8, .3, 1000); pop(3.6, .35, 1300)
pop(A[1], .4, 700); pop(A[1] + 1.8, .4, 400)
for i in range(2, 5):
    n = 5 if i == 3 else 7
    for k in range(n): pop(A[i] + k * .12, .22, 700 + 90 * k)
for k in range(7): pop(A[5] + .3 + k * .12, .25, 600 + 110 * k)
pop(A[6], .4, 500)
for s in np.arange(ZERO - 10, ZERO, 1.0): tick(s, .25 if s < ZERO - 3 else .4)
for s in np.arange(ZERO - 3, ZERO, .5): tick(s + .25, .25, 3000)
alarm(ZERO)
pop(A[7], .4); pop(A[7] + 2.0, .3); pop(A[8], .35); pop(E[8] - 1.6, .35)
out /= np.abs(out).max() + 1e-9
wf.write(f"{W}/sfx_track.wav", SR, (out * .9).astype(np.float32))
print("sfx written", TOTAL)
