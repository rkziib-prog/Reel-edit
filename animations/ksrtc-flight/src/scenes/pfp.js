// pfp.js: Instagram profile picture for Pathira Chinthakal (render with --loop=pfp, crop the centre 1080x1080).
LOOPS.pfp = (t) => {
  boilSeed('pfpbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1F2550', ink: null });
  paint(ellPts(960, 1150, 760, 560, 30, 6), { wash: '#2F3C7A', washOp: 200, ink: null });
  for (let i = 0; i < 40; i++) { boilSeed('pst' + i); const x = 420 + hash(i) * 1080, y = 20 + hash(i + 50) * 560; paint(starPts(x, y, 4 + 6 * hash(i + 9), .35, 4), { wash: PAL.cream, washOp: 200, ink: null }); }
  glow(470, 760, 420, '#FFB45A', .55);                       // bedside lamp
  glow(600, 280, 150, '#FFF2C8', .25);                       // moon
  boilSeed('moon');
  paint(ellPts(640, 250, 90, 90, 28, .6), { wash: PAL.cream, ink: PAL.ink, sw: .9 });
  paint(ellPts(690, 215, 86, 86, 28, .6), { wash: '#1F2550', ink: null });
  // thought bubble with the flying bus
  boilSeed('bubble');
  for (const [x, y, r] of [[1010, 560, 22], [1060, 490, 34]]) paint(ellPts(x, y, r, r, 16, .6), { wash: PAL.cream, ink: PAL.ink, sw: .9 });
  paint(ellPts(1200, 300, 250, 170, 30, 1.5), { wash: PAL.cream, ink: PAL.ink, sw: 1.2 });
  paint(ellPts(1200, 330, 190, 34, 18, 1), { wash: C.skyHi, ink: null });
  bus(1190, 380, .32, { wings: 1, flap: 1.2, rot: .1, driver: true, arms: 1 });
  // the hero, wide awake at 2 AM
  person(880, 1290, 44, { ...{ key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short' }, eyes: 'wide', mouth: 'grin', brow: 'up', armF: .35, bendF: .3, armB: .1 });
};
LOOPS.pfp.len = 1;
