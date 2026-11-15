// ksrtc.js: "KSRTC at plane speed". Test shot first: the speed bump and lift-off (script lines 6-7).
(() => {
  const C = {
    red: '#C63B2E', redDk: '#8E2620', cream: '#F6E6BF', yellow: '#E8B23A', glass: '#9CC9D9', glassDk: '#5D8FA3',
    tyre: '#3A3140', road: '#7A6E66', roadLt: '#9A8D82', laterite: '#B86B45', paddy: '#8DBB5A', paddyDk: '#5E8F3E',
    palm: '#4F7F3A', palmDk: '#35602B', trunk: '#8A6A4A', sky: '#9ED3EA', skyHi: '#D9EEF2', hill: '#7FA6A0',
    skin: '#9A6440', skinDk: '#6E452C', hair: '#2B2233', shirt: '#F3EEE2', mundu: '#FBF6EA', khaki: '#B89A62'
  };

  // ---------- set pieces ----------
  function sky(cy) {
    boilSeed('sky');
    paint(rectPts(-800, cy - 1400, W + 1600, 3000), { wash: C.sky, ink: null });
    paint(ellPts(W * .5, cy + 420, W * .9, 380, 30, 6), { wash: C.skyHi, washOp: 120, ink: null });
  }
  function cloud(x, y, s, key) {
    boilSeed('cl' + key);
    const P = [];
    for (let i = 0; i < 5; i++) P.push(...ellPts(x + (i - 2) * 70 * s, y - (i % 2) * 30 * s, 80 * s, 50 * s, 14, 2));
    paint(ellPts(x, y, 210 * s, 60 * s, 24, 3), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 3; i++) paint(ellPts(x + (i - 1) * 90 * s, y - 40 * s - (i === 1) * 25 * s, 75 * s, 55 * s, 18, 2), { wash: PAL.cream, ink: null });
  }
  // a coconut palm, base at (x, y), height h, sway in radians
  function palm(x, y, h, sway, key) {
    boilSeed('palm' + key);
    const top = [x + h * .18 + sway * 40, y - h];
    paint(ribbon(through([[x, y], [x + h * .08, y - h * .5], top], 4), 16, 9), { wash: C.trunk, ink: PAL.ink, sw: .7 });
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * .55 + sway * .4, L = h * (.42 + .08 * hash(i + key));
      const mid = [top[0] + Math.cos(a) * L * .55, top[1] + Math.sin(a) * L * .35 - 18];
      const end = [top[0] + Math.cos(a) * L, top[1] + Math.sin(a) * L * .3 + L * .35];
      paint(ribbon(through([top, mid, end], 4), 18, 2), { wash: i % 2 ? C.palm : C.palmDk, ink: PAL.ink, sw: .5 });
    }
    paint(ellPts(top[0], top[1] + 12, 16, 12, 10), { wash: C.trunk, ink: PAL.ink, sw: .5 });
  }

  // KSRTC bus, side view facing right. (x, y) = road point under the middle of the bus. s = scale.
  // o: rot (pitch, radians, pivots at the rear wheel), spin (wheel turn), wings 0..1, flap (radians), arms (passenger hands out)
  function bus(x, y, s, o = {}) {
    const L = 920, Hh = 340, r = 52;
    push();
    const rearX = x - L * .3 * s;
    translate(rearX, y); rotate(-(o.rot || 0)); translate(-rearX, -y);
    translate(x, y); scale(s);
    const top = -Hh - r * .9, bot = -r * .9;
    // wings (behind the body): shutter panels hinged at the roof
    if (o.wings > 0) {
      boilSeed('wing');
      const k = easeOut(clamp(o.wings)), fl = o.flap || 0;
      for (const [cx, ph] of [[-160, 0], [140, .6]]) {
        push(); translate(cx, top + 20); rotate(-.1 - k * (.45 + .35 * Math.sin(fl + ph)));
        const w = 340 * k + 10, d = 170;
        paint([[0, 0], [w, -20], [w * .92, d * .6], [0, d * .45]], { wash: C.red, ink: PAL.ink, sw: 1.2 });
        for (let j = 1; j < 6; j++) inkLine([[w * j / 6, -20 * j / 6], [w * j / 6 * .94, d * (.45 + .15 * j / 6)]], .6, C.redDk, 'inkfine', 0);
        pop();
      }
    }
    boilSeed('busbody');
    // body
    paint(rrPts(-L / 2, top, L, Hh, 46, 1.5), { wash: C.red, ink: PAL.ink, sw: 1.6 });
    paint(rrPts(-L / 2 + 6, top + 6, L - 12, 70, 36, 1), { wash: C.cream, ink: null });           // roof band
    paint(rectPts(-L / 2 + 4, top + Hh * .62, L - 8, 22, 1), { wash: C.yellow, ink: null });          // stripe
    // windscreen
    paint([[L / 2 - 120, top + 70], [L / 2 - 8, top + 70], [L / 2 - 4, top + 200], [L / 2 - 120, top + 200]], { wash: C.glass, ink: PAL.ink, sw: 1 });
    // windows with passengers
    for (let i = 0; i < 6; i++) {
      const wx = -L / 2 + 40 + i * 118, wy = top + 82;
      paint(rrPts(wx, wy, 96, 100, 10, 1), { wash: C.glassDk, ink: PAL.ink, sw: .9 });
      boilSeed('pax' + i);
      const hx = wx + 48 + (hash(i) - .5) * 20, hy = wy + 62;
      paint(ellPts(hx, hy, 22, 24, 14, 1), { wash: C.skin, ink: PAL.ink, sw: .6 });
      paint(ellPts(hx, hy - 14, 23, 12, 12, 1), { wash: C.hair, ink: null });
      if (o.arms && i % 2 === 0) paint(ribbon([[hx + 10, hy + 20], [hx + 30, hy - 30 - 30 * o.arms], [hx + 40, hy - 70 * o.arms - 20]], 9, 7), { wash: C.skin, ink: PAL.ink, sw: .6 });
      boilSeed('busbody' + i);
    }
    // door (front, open), headlight
    paint(rectPts(L / 2 - 210, top + 80, 72, Hh - 40, 1), { wash: C.redDk, ink: PAL.ink, sw: .9 });
    paint(ellPts(L / 2 - 14, top + Hh - 70, 14, 18, 12), { wash: C.cream, ink: PAL.ink, sw: .7 });
    // bumper
    paint(rrPts(L / 2 - 40, bot - 40, 56, 30, 8), { wash: '#5E5560', ink: PAL.ink, sw: .8 });
    // wheels
    for (const wx of [-L * .3, L * .3]) {
      boilSeed('wh' + wx);
      paint(ellPts(wx, bot, r + 6, r + 6, 22, 0), { wash: C.redDk, ink: null });
      paint(ellPts(wx, bot, r, r, 22, .8), { wash: C.tyre, ink: PAL.ink, sw: 1 });
      paint(ellPts(wx, bot, r * .45, r * .45, 14, .5), { wash: '#B9B2AE', ink: PAL.ink, sw: .6 });
      const a = o.spin || 0;
      for (let j = 0; j < 3; j++) inkLine([[wx, bot], [wx + Math.cos(a + j * 2.1) * r * .42, bot + Math.sin(a + j * 2.1) * r * .42]], .8, PAL.ink, 'inkfine', 0);
    }
    pop();
    if (o.light) glow(x + (L / 2 - 14) * s, y + (top + Hh - 70) * s, 60 * s, '#FFE7A8', o.light);
  }

  // the speed bump: a yellow-black striped hump, centred at x on the road line y
  function bump(x, y) {
    boilSeed('bump');
    paint(ellPts(x, y, 120, 34, 22, 1).filter(p => p[1] <= y + 1), { wash: C.yellow, ink: PAL.ink, sw: 1.2 });
    for (let i = -2; i <= 2; i++) paint([[x + i * 44 - 12, y - Math.sqrt(Math.max(0, 1 - ((i * 44) / 120) ** 2)) * 30], [x + i * 44 + 8, y - Math.sqrt(Math.max(0, 1 - ((i * 44 + 20) / 120) ** 2)) * 30], [x + i * 44 + 8, y], [x + i * 44 - 12, y]], { wash: PAL.ink, washOp: 220, ink: null });
  }

  // ---------- shot: speed bump + lift-off ----------
  const ROAD = 820;          // road line (world y)
  const BUMP_T = 2.0;        // time the front wheel meets the bump
  function liftoff(t, lt, dur) {
    const speed = 2600;                       // world px / s the scenery scrolls at
    const scroll = lt * speed;
    // after the bump: pitch up, climb
    const up = Math.max(0, lt - BUMP_T);
    const rot = kf(lt, [[BUMP_T, 0], [BUMP_T + .12, .22], [BUMP_T + .6, .32], [dur, .2]], easeOut);
    const climb = up > 0 ? 120 * up * up + 300 * up : 0;
    const camY = 540 - climb * .92 + (lt > BUMP_T && lt < BUMP_T + .35 ? shakeXY(lt, 14)[1] : 0);
    const zoom = kf(lt, [[0, 1.0], [BUMP_T, 1.05], [BUMP_T + 1.2, .92], [dur, .88]], ease);
    camBegin(960, camY, zoom);
    sky(camY);
    const viewBot = camY + 560 / zoom, viewTop = camY - 560 / zoom;
    // far clouds and hills (slow parallax)
    for (let i = 0; i < 14; i++) { const x = ((i * 610 + 900 * hash(i + 4) - scroll * .25) % 2600 + 2600) % 2600 - 400; const cy = 160 - 120 * hash(i + 9) - 190 * i; if (cy > viewTop - 150 && cy < viewBot + 150) cloud(x, cy, .8 + .4 * hash(i), i); }
    if (ROAD - 420 < viewBot) {
    boilSeed('hills');
    paint(ellPts(500, ROAD - 40, 900, 160, 30, 4), { wash: C.hill, washOp: 200, ink: null });
    paint(ellPts(1600, ROAD - 30, 800, 130, 30, 4), { wash: mixCol(C.hill, C.sky, .3), washOp: 200, ink: null });
    // paddy field
    boilSeed('paddy');
    paint(rectPts(-800, ROAD - 70, W + 1600, 80), { wash: C.paddy, ink: null });
    // palms (mid parallax)
    for (let i = 0; i < 8; i++) {
      const gap = 420, x = ((i * gap - scroll * .55) % (gap * 8) + gap * 8) % (gap * 8) - 500;
      palm(x, ROAD - 40, 330 + 90 * hash(i + 3), .12 * Math.sin(t * 2 + i), i);
    }
    // road
    boilSeed('road');
    paint(rectPts(-800, ROAD - 10, W + 1600, 900), { wash: C.road, ink: null });
    inkLine([[-800, ROAD - 10], [W + 800, ROAD - 10]], 1.2, PAL.ink, 'ink', 0);
    for (let i = 0; i < 8; i++) { const x = ((i * 360 - scroll) % 2880 + 2880) % 2880 - 600; boilSeed('dash' + i); paint(rectPts(x, ROAD + 110, 170, 14), { wash: C.cream, washOp: 200, ink: null }); }
    }
    // bump: arrives from the right and meets the front wheel at BUMP_T
    const busX = 760, frontW = busX + 920 * .3 * .95;
    const bx = frontW + (BUMP_T - lt) * speed;
    if (bx > -400 && bx < W + 400) bump(bx, ROAD + 40);
    // speed lines
    for (let i = 0; i < 7; i++) { boilSeed('sl' + i); const y = ROAD - 380 + i * 50 - climb, x = W - ((lt * 3200 + i * 470) % (W + 600)); inkLine([[x, y], [x + 160 + 80 * hash(i), y]], .8, PAL.cream, 'inkfine', 0); }
    // bus
    const bob = up > 0 ? 0 : Math.sin(lt * 28) * 3;
    const wings = seg(lt, BUMP_T + .5, BUMP_T + 1.2);
    bus(busX, ROAD + 40 - climb + bob, .95, { rot, spin: -lt * 30, arms: seg(lt, BUMP_T + .2, BUMP_T + .6), wings, flap: lt * 9 });
    if (lt > BUMP_T - .02 && lt < BUMP_T + .5) {   // dust puff at the bump
      boilSeed('dust');
      const k = seg(lt, BUMP_T - .02, BUMP_T + .5);
      for (let i = 0; i < 5; i++) paint(ellPts(frontW - 40 * i - k * 180, ROAD + 30 - k * 40 * hash(i), 40 * (1 - k * .6), 28 * (1 - k * .6), 12, 2), { wash: C.roadLt, washOp: 220 * (1 - k), ink: null });
    }
    camEnd();
    if (lt < .4) brushWipe(.5 + lt / .8, [C.red, C.yellow]);
  }

  shots([[0, liftoff]]);
})();
