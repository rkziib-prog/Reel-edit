// ksrtc_lib.js: set pieces and characters for "KSRTC at plane speed" (globals used by ksrtc.js).
const C = {
  red: '#C63B2E', redDk: '#8E2620', cream: '#F6E6BF', yellow: '#E8B23A', glass: '#9CC9D9', glassDk: '#5D8FA3',
  tyre: '#3A3140', road: '#7A6E66', roadLt: '#9A8D82', laterite: '#B86B45', paddy: '#8DBB5A', paddyDk: '#5E8F3E',
  palm: '#4F7F3A', palmDk: '#35602B', trunk: '#8A6A4A', sky: '#9ED3EA', skyHi: '#D9EEF2', hill: '#7FA6A0',
  skin: '#A86B45', skin2: '#8A5634', skin3: '#B97A52', hair: '#2B2233', grey: '#B9B2AE',
  shirt: '#9EC3E3', mundu: '#FBF6EA', khaki: '#B89A62', khakiDk: '#8F7748', saree: '#D9577A', sareeDk: '#A93C5C',
  tee1: '#F2C14E', tee2: '#6FB27A', jeans: '#4A5F8C', wall: '#EADBB8', wallDk: '#CDB98F', seat: '#7A3B2E',
  water: '#3E9C9A', waterLt: '#7CC3B8', boat: '#7A4E2E', thatch: '#D9B77A', tile: '#B5533C', fish: '#9DB4C0'
};

// ---------- scenery ----------
function cloud(x, y, s, key) {
  boilSeed('cl' + key);
  paint(ellPts(x, y, 210 * s, 60 * s, 24, 3), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
  for (let i = 0; i < 3; i++) paint(ellPts(x + (i - 1) * 90 * s, y - 40 * s - (i === 1) * 25 * s, 75 * s, 55 * s, 18, 2), { wash: PAL.cream, ink: null });
}
// clouds in screen space, drifting left at `speed` px/s (for flying shots)
function cloudField(t, speed, yTop = 40, yBot = 1000, n = 7, s0 = .9) {
  for (let i = 0; i < n; i++) {
    const span = W + 700, x = ((i * 397 + 900 * hash(i + 4) - t * speed * (.7 + .5 * hash(i + 7))) % span + span) % span - 350;
    const y = yTop + (yBot - yTop) * hash(i + 11);
    cloud(x, y, s0 * (.6 + .6 * hash(i + 2)), 'f' + i);
  }
}
function speedLines(t, n, y0, y1, speed = 3200, col = PAL.cream) {
  for (let i = 0; i < n; i++) {
    boilSeed('sl' + i);
    const y = y0 + (y1 - y0) * hash(i + 31), x = W + 300 - ((t * speed + i * 470) % (W + 700));
    inkLine([[x, y], [x + 160 + 120 * hash(i), y]], .8, col, 'inkfine', 0);
  }
}
function palm(x, y, h, sway, key, cols) {   // cols: optional [leaf, leafDk, trunk] (night silhouettes)
  boilSeed('palm' + key);
  const ks = typeof key === 'number' ? key : [...String(key)].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 997;
  const top = [x + h * .18 + sway * 40, y - h];
  paint(ribbon(through([[x, y], [x + h * .08, y - h * .5], top], 4), Math.max(5, h * .05), Math.max(3, h * .028)), { wash: cols ? cols[2] : C.trunk, ink: PAL.ink, sw: .7 });
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * .55 + sway * .4, L = h * (.42 + .08 * hash(i + ks));
    const mid = [top[0] + Math.cos(a) * L * .55, top[1] + Math.sin(a) * L * .35 - h * .05];
    const end = [top[0] + Math.cos(a) * L, top[1] + Math.sin(a) * L * .3 + L * .35];
    paint(ribbon(through([top, mid, end], 4), Math.max(h * .055, 9), 2), { wash: cols ? cols[i % 2] : (i % 2 ? C.palm : C.palmDk), ink: PAL.ink, sw: .5 });
  }
}
function skyWash(key = 'sky', col = C.sky, hi = C.skyHi) {
  boilSeed(key);
  paint(rectPts(-100, -100, W + 200, H + 200), { wash: col, ink: null });
  paint(ellPts(W * .5, H * 1.05, W * .9, 420, 30, 6), { wash: hi, washOp: 120, ink: null });
}

// Road scene in world space (call inside camBegin). scroll = how far the scenery has moved (px).
const ROAD = 820;
function roadScene(t, scroll, viewTop = -2000, viewBot = 3000) {
  boilSeed('sky');
  paint(rectPts(-800, Math.min(viewTop, -200) - 400, W + 1600, ROAD + 600 - Math.min(viewTop, -200)), { wash: C.sky, ink: null });
  paint(ellPts(W * .5, ROAD - 60, W * .9, 380, 30, 6), { wash: C.skyHi, washOp: 120, ink: null });
  for (let i = 0; i < 14; i++) {
    const x = ((i * 610 + 900 * hash(i + 4) - scroll * .25) % 2600 + 2600) % 2600 - 400, cy = 160 - 120 * hash(i + 9) - 190 * i;
    if (cy > viewTop - 150 && cy < viewBot + 150) cloud(x, cy, .8 + .4 * hash(i), i);
  }
  if (ROAD - 420 > viewBot) return;
  boilSeed('hills');
  paint(ellPts(500, ROAD - 40, 900, 160, 30, 4), { wash: C.hill, washOp: 200, ink: null });
  paint(ellPts(1600, ROAD - 30, 800, 130, 30, 4), { wash: mixCol(C.hill, C.sky, .3), washOp: 200, ink: null });
  boilSeed('paddy');
  paint(rectPts(-800, ROAD - 70, W + 1600, 80), { wash: C.paddy, ink: null });
  for (let i = 0; i < 8; i++) {
    const gap = 420, x = ((i * gap - scroll * .55) % (gap * 8) + gap * 8) % (gap * 8) - 500;
    palm(x, ROAD - 40, 330 + 90 * hash(i + 3), .12 * Math.sin(t * 2 + i), i);
  }
  boilSeed('road');
  paint(rectPts(-800, ROAD - 10, W + 1600, 900), { wash: C.road, ink: null });
  inkLine([[-800, ROAD - 10], [W + 800, ROAD - 10]], 1.2, PAL.ink, 'ink', 0);
  for (let i = 0; i < 8; i++) { const x = ((i * 360 - scroll) % 2880 + 2880) % 2880 - 600; boilSeed('dash' + i); paint(rectPts(x, ROAD + 110, 170, 14), { wash: C.cream, washOp: 200, ink: null }); }
}

// ---------- the bus ----------
// side view facing right. (x, y) = road point under the middle. o: rot (nose-up pitch, pivots at the rear wheel), spin,
// wings 0..1, flap, arms 0..1 (passengers' hands out), driver (head in the windscreen), door(s) (draw callback, local coords)
const BUS = { L: 920, H: 340, r: 52 };
const busDoor = (x, y, s) => [x + (BUS.L / 2 - 174) * s, y - BUS.r * .9 * s];   // door step (world), unrotated
function bus(x, y, s, o = {}) {
  const { L, H: Hh, r } = BUS;
  push();
  const rearX = x - L * .3 * s;
  translate(rearX, y); rotate(-(o.rot || 0)); translate(-rearX, -y);
  translate(x, y); scale(s, s * (1 - (o.sq || 0)));
  const top = -Hh - r * .9, bot = -r * .9;
  if (o.wings > 0) {
    const k = clamp(o.wings), fl = o.flap || 0;
    // shutter wings: hinged on the roof, sweeping back and up, flapping
    for (const [cx, ph, sc] of [[60, .8, .85], [-60, 0, 1]]) {
      boilSeed('wing' + cx);
      push(); translate(cx, top + 30);
      rotate(.25 + k * (.25 + .35 * Math.sin(fl + ph)));
      const w = (460 * k + 10) * sc, d = 170 * sc;
      paint(through([[40, 0], [-w * .3, -d * .35], [-w * .75, -d * .45], [-w, -d * .3], [-w * .92, -d * .05], [-w * .6, d * .12], [-w * .2, d * .18]], 5), { wash: cx > 0 ? C.redDk : C.red, ink: PAL.ink, sw: 1.2 });
      for (let j = 1; j < 6; j++) inkLine([[-w * j / 6.5, -d * (.3 + .05 * Math.sin(j))], [-w * j / 6.5 + 20, d * .15]], .6, cx > 0 ? C.red : C.redDk, 'inkfine', 0);
      paint(rectPts(-w * .92, -d * .22, w * .7, 10), { wash: C.yellow, ink: null });
      pop();
    }
  }
  boilSeed('busbody');
  paint(rrPts(-L / 2, top, L, Hh, 46, 1.5), { wash: C.red, ink: PAL.ink, sw: 1.6 });
  paint(rrPts(-L / 2 + 6, top + 6, L - 12, 70, 36, 1), { wash: C.cream, ink: null });
  paint(rectPts(-L / 2 + 4, top + Hh * .62, L - 8, 22, 1), { wash: C.yellow, ink: null });
  paint([[L / 2 - 120, top + 70], [L / 2 - 8, top + 70], [L / 2 - 4, top + 200], [L / 2 - 120, top + 200]], { wash: C.glass, ink: PAL.ink, sw: 1 });
  if (o.driver) {
    boilSeed('drv');
    paint(ellPts(L / 2 - 70, top + 150, 26, 30, 14, 1), { wash: C.skin2, ink: PAL.ink, sw: .7 });
    paint(ribbon([[L / 2 - 66, top + 160], [L / 2 - 50, top + 156], [L / 2 - 38, top + 162]], 9, 4), { wash: C.hair, ink: null });
  }
  for (let i = 0; i < 6; i++) {
    const wx = -L / 2 + 40 + i * 118, wy = top + 82;
    boilSeed('win' + i);
    paint(rrPts(wx, wy, 96, 100, 10, 1), { wash: C.glassDk, ink: PAL.ink, sw: .9 });
    const hx = wx + 48 + (hash(i) - .5) * 20, hy = wy + 62;
    paint(ellPts(hx, hy - 10, 25, 20, 12, 1), { wash: C.hair, ink: null });
    paint(ellPts(hx + 3, hy + 2, 21, 22, 14, 1), { wash: [C.skin, C.skin2, C.skin3][i % 3], ink: PAL.ink, sw: .6 });
    paint(ellPts(hx - 2, hy - 14, 21, 9, 12, 1), { wash: C.hair, ink: null });
    if (o.arms && i % 2 === 0) {
      const a = o.arms, sw = Math.sin((o.flap || T * 8) * 1.3 + i) * 8 * a;
      paint(ribbon([[hx + 14, hy + 18], [hx + 26 + sw, hy - 20 - 30 * a], [hx + 30 + sw, hy - 40 - 50 * a]], 10, 8), { wash: C.skin, ink: PAL.ink, sw: .6 });
    }
  }
  boilSeed('busfront');
  paint(rectPts(L / 2 - 210, top + 80, 72, Hh - 40, 1), { wash: o.doorDark ? '#3E2A2E' : C.redDk, ink: PAL.ink, sw: .9 });
  paint(ellPts(L / 2 - 14, top + Hh - 70, 14, 18, 12), { wash: C.cream, ink: PAL.ink, sw: .7 });
  paint(rrPts(L / 2 - 40, bot - 40, 56, 30, 8), { wash: '#5E5560', ink: PAL.ink, sw: .8 });
  for (const wx of [-L * .3, L * .3]) {
    boilSeed('wh' + wx);
    paint(ellPts(wx, bot, r + 6, r + 6, 22, 0), { wash: C.redDk, ink: null });
    paint(ellPts(wx, bot, r, r, 22, .8), { wash: C.tyre, ink: PAL.ink, sw: 1 });
    paint(ellPts(wx, bot, r * .45, r * .45, 14, .5), { wash: C.grey, ink: PAL.ink, sw: .6 });
    const a = o.spin || 0;
    for (let j = 0; j < 3; j++) inkLine([[wx, bot], [wx + Math.cos(a + j * 2.1) * r * .42, bot + Math.sin(a + j * 2.1) * r * .42]], .8, PAL.ink, 'inkfine', 0);
  }
  if (o.door) o.door(L / 2 - 174, bot);   // callback in bus-local space at the door step
  pop();
}
function bump(x, y) {
  boilSeed('bump');
  paint(ellPts(x, y, 120, 34, 22, 1).filter(p => p[1] <= y + 1), { wash: C.yellow, ink: PAL.ink, sw: 1.2 });
  const hy = (dx) => y - Math.sqrt(Math.max(0, 1 - (dx / 120) ** 2)) * 30;
  for (let i = -2; i <= 2; i++) paint([[x + i * 44 - 12, hy(i * 44 - 12)], [x + i * 44 + 8, hy(i * 44 + 8)], [x + i * 44 + 8, y], [x + i * 44 - 12, y]], { wash: PAL.ink, washOp: 220, ink: null });
}
function dust(x, y, k, key = 'dust', n = 5, s = 1) {
  if (k <= 0 || k >= 1) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) paint(ellPts(x - (i - n / 2) * 50 * s * (1 + k), y - k * 50 * s * hash(i), 44 * s * (1 - k * .5), 30 * s * (1 - k * .5), 12, 2), { wash: C.roadLt, washOp: 230 * (1 - k), ink: null });
}

// ---------- people ----------
// person(x, y, u, o): (x, y) = ground point between the feet; ~17u tall; faces right (flip: true faces left).
// o: key, skin, shirt, lower ('mundu'|'pants'|'saree'), lowerCol, hairStyle ('short'|'spiky'|'bun'|'bald'), hair,
//    eyes ('dot'|'wide'|'closed'|'happy'|'half'), mouth ('smile'|'grin'|'o'|'O'|'flat'|'frown'|'open'), brow ('up'|'worry'|'flat'),
//    stache ('small'|'big'), glasses, towel, bag, kasavu, walk (leg phase), sit, armF/armB (angle from straight down, + = forward),
//    bendF/bendB, handF(x, y, u) (prop at the front hand, local space), handB, emote, emoteK, rot, dy (u), sc, hairFly (0..1)
function person(x, y, u, o = {}) {
  const P = { skin: C.skin, shirt: C.shirt, lower: 'mundu', lowerCol: C.mundu, hair: C.hair, hairStyle: 'short', eyes: 'dot', mouth: 'smile', ...o };
  const sw = o.sw || .9, ink = PAL.ink;
  push(); translate(x, y); if (o.rot) rotate(o.rot); if (o.flip) scale(-1, 1); if (o.sc) scale(o.sc); if (o.dy) translate(0, o.dy * u);
  const key = 'p' + (o.key || 0);
  boilSeed(key + 'legs');
  const hipY = -6 * u;
  let fF, fB;
  if (o.sit) { fF = [4.6 * u, 0]; fB = [4.0 * u, 0]; }
  else if (o.walk != null) { const s = Math.sin(o.walk); fF = [s * 1.8 * u, -Math.max(0, Math.cos(o.walk)) * 1.1 * u]; fB = [-s * 1.8 * u, -Math.max(0, -Math.cos(o.walk)) * 1.1 * u]; }
  else { fF = [.9 * u, 0]; fB = [-.9 * u, 0]; }
  if (o.feet) [fF, fB] = o.feet(u);
  const shin = P.lower === 'pants' ? P.lowerCol : P.skin;
  const legs = [[fB, -.7 * u, true], [fF, .7 * u, false]];
  for (const [f, hx, back] of legs) {
    const hip = [hx, hipY + .6 * u];
    let pts;
    if (o.sit) {
      const knee = [hx + 4 * u, hipY + .6 * u];
      paint(ribbon([hip, knee], 1.6 * u, 1.4 * u), { wash: back ? mixCol(P.lowerCol, ink, .15) : P.lowerCol, ink, sw: sw * .8 });
      pts = [knee, [f[0], f[1] - .4 * u]];
    } else pts = [hip, [(hip[0] + f[0]) / 2 + .3 * u, (hip[1] + f[1]) / 2], [f[0], f[1] - .4 * u]];
    paint(ribbon(pts.length > 2 ? through(pts, 3) : pts, 1.2 * u, 1.0 * u), { wash: back ? mixCol(shin, ink, .2) : shin, ink, sw: sw * .8 });
    paint(ellPts(f[0] + .5 * u, f[1] - .35 * u, 1.0 * u, .45 * u, 12, .5), { wash: o.shoe || '#5A3A2A', ink, sw: sw * .7 });
  }
  const sh = [[-1.4 * u, -10.3 * u], [1.2 * u, -10.3 * u]];
  const arm = (s, a, bend, back, hand) => {
    boilSeed(key + 'arm' + back);
    const el = [s[0] + Math.sin(a) * 2.7 * u, s[1] + Math.cos(a) * 2.7 * u], b = a + (bend || 0);
    const hd = [el[0] + Math.sin(b) * 2.6 * u, el[1] + Math.cos(b) * 2.6 * u];
    const sk = back ? mixCol(P.skin, ink, .2) : P.skin;
    paint(ribbon([s, el, hd], 1.1 * u, .9 * u), { wash: sk, ink, sw: sw * .8 });
    paint(ribbon([s, [(s[0] + el[0]) / 2, (s[1] + el[1]) / 2]], 1.5 * u, 1.35 * u), { wash: back ? mixCol(P.shirt, ink, .15) : P.shirt, ink, sw: sw * .8 });
    paint(ellPts(hd[0], hd[1], .7 * u, .7 * u, 12, .4), { wash: sk, ink, sw: sw * .7 });
    if (hand) hand(hd[0], hd[1], u);
  };
  arm(sh[0], o.armB ?? .15, o.bendB ?? .2, true, o.handB);
  // lower garment
  boilSeed(key + 'lower');
  if (o.sit) { /* thighs already carry the colour */ }
  else if (P.lower === 'mundu') {
    paint([[-2.5 * u, hipY], [2.5 * u, hipY], [2.9 * u, -1.3 * u], [-2.9 * u, -1.3 * u]], { wash: P.lowerCol, ink, sw });
    if (o.kasavu !== false) paint(rectPts(-2.85 * u, -2.0 * u, 5.7 * u, .45 * u), { wash: C.yellow, ink: null });
    inkLine([[1.0 * u, hipY + .3 * u], [1.5 * u, -1.6 * u]], sw * .6, mixCol(P.lowerCol, ink, .4), 'inkfine', .3);
  } else if (P.lower === 'pants') {
    paint([[-2.4 * u, hipY], [2.4 * u, hipY], [2.3 * u, hipY + 1.6 * u], [-2.3 * u, hipY + 1.6 * u]], { wash: P.lowerCol, ink, sw });
  } else if (P.lower === 'saree') {
    paint([[-2.6 * u, hipY], [2.6 * u, hipY], [3.3 * u, -.3 * u], [-3.3 * u, -.3 * u]], { wash: P.lowerCol, ink, sw });
    paint(rectPts(-3.25 * u, -1.1 * u, 6.5 * u, .5 * u), { wash: C.yellow, ink: null });
  }
  // torso
  boilSeed(key + 'torso');
  paint([[-2.3 * u, -11 * u], [2.2 * u, -11 * u], [2.6 * u, hipY + .2 * u], [-2.6 * u, hipY + .2 * u]], { wash: P.shirt, ink, sw });
  if (P.lower === 'saree') paint(ribbon([[1.6 * u, -10.8 * u], [-.4 * u, -8 * u], [-2.4 * u, hipY + .6 * u], [-3.4 * u - (o.hairFly || 0) * 3 * u, hipY + 1.6 * u]], 1.6 * u, 1.2 * u), { wash: P.lowerCol, ink, sw: sw * .8 });
  else inkLine([[0, -11 * u], [.9 * u, -9.6 * u], [1.6 * u, -11 * u]], sw * .7, ink, 'inkfine', .2);
  if (o.towel) paint(rrPts(-2.0 * u, -11.6 * u, 2.4 * u, 1.3 * u, .4 * u), { wash: PAL.cream, ink, sw: sw * .7 });
  if (o.bag) {
    paint(ribbon([[1.8 * u, -10.8 * u], [-1.9 * u, -6.5 * u]], .5 * u, .5 * u), { wash: '#5A3A2A', ink: null });
    paint(rrPts(-3.4 * u, -7.2 * u, 2.6 * u, 2.2 * u, .5 * u), { wash: '#6E4A30', ink, sw: sw * .8 });
  }
  // head
  boilSeed(key + 'head');
  const hc = [.5 * u, -13.9 * u];
  paint(rectPts(-.4 * u, -12 * u, 1.6 * u, 1.3 * u), { wash: P.skin, ink: null });
  const fly = o.hairFly || 0;
  if (P.hairStyle === 'bald') paint(ellPts(hc[0] - 2.1 * u, hc[1] + .1 * u, 1.3 * u, 1.9 * u, 14, .5), { wash: o.hair || C.grey, ink, sw: sw * .7 });
  else paint(ellPts(hc[0] - .9 * u - fly * u, hc[1] - .6 * u, 3.1 * u + fly * .6 * u, 3.0 * u, 18, .8), { wash: P.hair, ink, sw: sw * .7 });
  if (P.hairStyle === 'long') {   // shoulder-length hair hanging behind the head
    paint(ellPts(hc[0] - 1.6 * u - fly * u, hc[1] + .9 * u, 2.2 * u + fly * .5 * u, 3.0 * u, 18, .8), { wash: P.hair, ink, sw: sw * .7 });
  }
  if (P.hairStyle === 'bun') {
    paint(ellPts(hc[0] - 3.4 * u - fly * u, hc[1] - .2 * u, 1.4 * u, 1.3 * u, 14, .5), { wash: P.hair, ink, sw: sw * .7 });
    for (let i = 0; i < 4; i++) paint(ellPts(hc[0] - 3.9 * u - fly * u + i * .35 * u, hc[1] - 1.4 * u + i * .5 * u, .3 * u, .3 * u, 8), { wash: PAL.cream, ink, sw: sw * .4 });
  }
  paint(ellPts(hc[0], hc[1], 3.1 * u, 3.3 * u, 22, .6), { wash: P.skin, ink, sw });
  if (P.hairStyle !== 'bald') {
    paint(ellPts(hc[0] - .4 * u - fly * .5 * u, hc[1] - 2.2 * u, 3.0 * u, 1.4 * u, 18, .6, -.08), { wash: P.hair, ink: null });
    if (P.hairStyle === 'spiky') for (let i = 0; i < 4; i++) paint([[hc[0] - 2.2 * u + i * 1.3 * u, hc[1] - 2.8 * u], [hc[0] - 3.2 * u + i * 1.3 * u - fly * 1.5 * u, hc[1] - 4.6 * u], [hc[0] - 1.2 * u + i * 1.3 * u, hc[1] - 3.0 * u]], { wash: P.hair, ink: null });
  } else inkLine([[hc[0] - 1.2 * u, hc[1] - 2.4 * u], [hc[0] + .3 * u, hc[1] - 2.9 * u]], sw * .5, mixCol(P.skin, PAL.cream, .5), 'inkfine', .3);
  paint(ellPts(hc[0] - 1.1 * u, hc[1] + .3 * u, .6 * u, .9 * u, 10, .3), { wash: mixCol(P.skin, ink, .15), ink, sw: sw * .6 });
  // face
  boilSeed(key + 'face');
  const eyes = [[hc[0] + .7 * u, hc[1] - .2 * u], [hc[0] + 2.2 * u, hc[1] - .2 * u]];
  for (const [ex, ey] of eyes) {
    const e = P.eyes;
    if (e === 'wide') { paint(ellPts(ex, ey, .62 * u, .78 * u, 12), { wash: PAL.cream, ink, sw: sw * .7 }); paint(ellPts(ex + .15 * u, ey, .28 * u, .34 * u, 8), { wash: ink, ink: null }); }
    else if (e === 'closed') inkLine([[ex - .45 * u, ey], [ex, ey + .25 * u], [ex + .45 * u, ey]], sw * .9, ink, 'ink', .5);
    else if (e === 'happy') inkLine([[ex - .45 * u, ey + .2 * u], [ex, ey - .3 * u], [ex + .45 * u, ey + .2 * u]], sw * .9, ink, 'ink', .5);
    else if (e === 'half') { paint(ellPts(ex, ey + .15 * u, .3 * u, .25 * u, 8), { wash: ink, ink: null }); inkLine([[ex - .45 * u, ey - .05 * u], [ex + .45 * u, ey - .05 * u]], sw * .9, ink, 'ink', 0); }
    else paint(ellPts(ex, ey, .3 * u, .46 * u, 10), { wash: ink, ink: null });
    if (o.glasses) paint(ellPts(ex, ey, .75 * u, .7 * u, 14), { wash: PAL.cream, washOp: 40, ink, sw: sw * .7 });
    const br = o.brow;
    if (br === 'up') inkLine([[ex - .5 * u, ey - 1.2 * u], [ex + .5 * u, ey - 1.4 * u]], sw * .8, ink, 'ink', 0);
    else if (br === 'worry') inkLine([[ex - .5 * u, ey - 1.3 * u], [ex + .5 * u, ey - .9 * u]], sw * .8, ink, 'ink', 0);
    else if (br === 'flat') inkLine([[ex - .5 * u, ey - 1.0 * u], [ex + .5 * u, ey - 1.0 * u]], sw * .8, ink, 'ink', 0);
  }
  inkLine([[hc[0] + 2.9 * u, hc[1] - .1 * u], [hc[0] + 3.4 * u, hc[1] + .7 * u], [hc[0] + 2.8 * u, hc[1] + .8 * u]], sw * .7, ink, 'inkfine', .5);
  const m = [hc[0] + 1.7 * u, hc[1] + 1.9 * u], mo = P.mouth;
  if (mo === 'smile') inkLine([[m[0] - .8 * u, m[1] - .2 * u], [m[0], m[1] + .35 * u], [m[0] + .8 * u, m[1] - .25 * u]], sw * .9, ink, 'ink', .6);
  else if (mo === 'grin') paint([[m[0] - 1 * u, m[1] - .3 * u], [m[0] + 1 * u, m[1] - .35 * u], [m[0] + .5 * u, m[1] + .6 * u], [m[0] - .5 * u, m[1] + .6 * u]], { wash: PAL.cream, ink, sw: sw * .8, curv: .4 });
  else if (mo === 'o') paint(ellPts(m[0], m[1], .35 * u, .4 * u, 10), { wash: '#5A2A2E', ink, sw: sw * .7 });
  else if (mo === 'O') paint(ellPts(m[0], m[1] + .2 * u, .7 * u, .9 * u, 12), { wash: '#5A2A2E', ink, sw: sw * .8 });
  else if (mo === 'open') paint(ellPts(m[0], m[1] + .1 * u, .9 * u, .6 * u, 12), { wash: '#5A2A2E', ink, sw: sw * .8 });
  else if (mo === 'frown') inkLine([[m[0] - .7 * u, m[1] + .3 * u], [m[0], m[1] - .15 * u], [m[0] + .7 * u, m[1] + .3 * u]], sw * .9, ink, 'ink', .6);
  else inkLine([[m[0] - .7 * u, m[1]], [m[0] + .7 * u, m[1]]], sw * .9, ink, 'ink', 0);
  if (o.stache) { const b = o.stache === 'big' ? 1.4 : 1; paint(ribbon(through([[m[0] - 1.3 * u * b, m[1] - .2 * u], [m[0] - .2 * u, m[1] - .95 * u], [m[0] + 1.0 * u * b, m[1] - .9 * u], [m[0] + 1.4 * u * b, m[1] - .4 * u]], 3), .7 * u * b, .3 * u), { wash: o.stacheCol || C.hair, ink: null }); }
  // front arm last, over the torso
  arm(sh[1], o.armF ?? -.1, o.bendF ?? .25, false, o.handF);
  if (o.emote) emote(o.emote, hc[0] + 3.4 * u, hc[1] - 3.8 * u, u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
  pop();
}
// props (local space around a hand)
function fileProp(x, y, u, rot = 0) { push(); translate(x, y); rotate(rot); boilSeed('file'); paint(rrPts(-.6 * u, -2.6 * u, 3.4 * u, 2.6 * u, .25 * u), { wash: '#4E79B8', ink: PAL.ink, sw: .8 }); paint(rectPts(.6 * u, -1.6 * u, 1.4 * u, .5 * u), { wash: PAL.cream, ink: null }); pop(); }
function fish(x, y, s, rot = 0, key = 'fish') {
  push(); translate(x, y); rotate(rot); boilSeed(key);
  paint(ellPts(0, 0, 40 * s, 14 * s, 14, .6), { wash: C.fish, ink: PAL.ink, sw: .8 });
  paint([[-34 * s, 0], [-58 * s, -16 * s], [-54 * s, 0], [-58 * s, 16 * s]], { wash: C.fish, ink: PAL.ink, sw: .8 });
  paint(ellPts(24 * s, -3 * s, 3 * s, 3 * s, 8), { wash: PAL.ink, ink: null });
  pop();
}
function crow(x, y, s, flap, flip = false, key = 'crow') {
  push(); translate(x, y); if (flip) scale(-1, 1); boilSeed(key);
  const w = Math.sin(flap);
  paint(ribbon([[-10 * s, -4 * s], [-30 * s, -30 * s * w - 6 * s], [-50 * s, -44 * s * w]], 16 * s, 4 * s), { wash: '#3B3540', ink: PAL.ink, sw: .6 });
  paint(ellPts(0, 0, 30 * s, 16 * s, 14, .6), { wash: '#2E2A36', ink: PAL.ink, sw: .7 });
  paint(ellPts(28 * s, -10 * s, 13 * s, 12 * s, 12, .4), { wash: '#2E2A36', ink: PAL.ink, sw: .7 });
  paint([[38 * s, -12 * s], [56 * s, -8 * s], [38 * s, -5 * s]], { wash: '#E0B040', ink: PAL.ink, sw: .5 });
  paint(ellPts(32 * s, -13 * s, 2.5 * s, 2.5 * s, 8), { wash: PAL.cream, ink: null });
  paint([[-26 * s, 0], [-46 * s, -6 * s], [-44 * s, 8 * s]], { wash: '#2E2A36', ink: PAL.ink, sw: .5 });
  paint(ribbon([[0, -2 * s], [-18 * s, -26 * s * w - 4 * s], [-34 * s, -40 * s * w]], 14 * s, 4 * s), { wash: '#4A4452', ink: PAL.ink, sw: .6 });
  pop();
}
function clockFace(x, y, r, hh, mm, key = 'clock') {
  boilSeed(key);
  paint(ellPts(x, y, r, r, 28, .5), { wash: PAL.cream, ink: PAL.ink, sw: 1.4 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[x + Math.sin(a) * r * .8, y - Math.cos(a) * r * .8], [x + Math.sin(a) * r * .92, y - Math.cos(a) * r * .92]], 1, PAL.ink, 'inkfine', 0); }
  const ah = ((hh % 12) + mm / 60) / 12 * TAU, am = mm / 60 * TAU;
  paint(ribbon([[x, y], [x + Math.sin(ah) * r * .5, y - Math.cos(ah) * r * .5]], r * .08, r * .05), { wash: PAL.ink, ink: null });
  paint(ribbon([[x, y], [x + Math.sin(am) * r * .78, y - Math.cos(am) * r * .78]], r * .06, r * .03), { wash: PAL.ink, ink: null });
  paint(ellPts(x, y, r * .06, r * .06, 8), { wash: C.red, ink: null });
}
// bus interior, screen space: wall, a row of windows showing `view` ('green' rushing fields, or 'sky'), seat backs
function interior(t, view, speed = 2400) {
  boilSeed('int');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: C.wall, ink: null });
  for (let i = 0; i < 4; i++) {
    const wx = 60 + i * 470, wy = 150, ww = 400, wh = 330;
    boilSeed('iw' + i);
    paint(rrPts(wx, wy, ww, wh, 22), { wash: view === 'sky' ? C.sky : C.paddy, ink: null });
    if (view === 'sky') {
      for (let j = 0; j < 2; j++) { const cx = wx + ww + 200 - ((t * speed * .5 + j * 300 + i * 170) % (ww + 400)); if (cx > wx - 120 && cx < wx + ww + 120) { boilSeed('ic' + i + j); paint(ellPts(clamp(cx, wx + 60, wx + ww - 60), wy + 90 + 140 * j, 70, 26, 14, 2), { wash: PAL.cream, ink: null }); } }
    } else {
      for (let j = 0; j < 5; j++) { boilSeed('ig' + i + j); const y = wy + 60 + j * 60, x = wx + ww - ((t * speed + j * 230 + i * 90) % (ww + 200)); inkLine([[clamp(x, wx + 10, wx + ww - 10), y], [clamp(x + 160, wx + 10, wx + ww - 10), y]], 3, j % 2 ? C.palmDk : C.palm, 'dry', 0); }
      paint(rectPts(wx, wy + wh - 70, ww, 70), { wash: C.paddyDk, washOp: 160, ink: null });
    }
    boilSeed('iwf' + i);
    { const fr = rrPts(wx, wy, ww, wh, 22); inkLine([...fr, fr[0]], 1.4, PAL.ink, 'ink', 0); }
    inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 2.2, C.wallDk, 'ink', 0);
  }
  boilSeed('rail');
  inkLine([[-50, 90], [W + 50, 90]], 3, '#8C8A92', 'ink', 0);
  for (let i = 0; i < 7; i++) { const x = 140 + i * 280, a = .25 * Math.sin(t * 5 + i); boilSeed('strap' + i); paint(ribbon([[x, 90], [x + Math.sin(a) * 60, 90 + Math.cos(a) * 60]], 6, 6), { wash: '#5A5560', ink: null }); paint(ellPts(x + Math.sin(a) * 75, 90 + Math.cos(a) * 75, 14, 14, 12), { wash: '#5A5560', ink: PAL.ink, sw: .6 }); }
  boilSeed('floor');
  paint(rectPts(-60, 900, W + 120, 300), { wash: '#6B5E58', ink: null });
}
function seatBack(x, y, key) { boilSeed('seat' + key); paint(rrPts(x - 34, y - 300, 68, 300, 20), { wash: C.seat, ink: PAL.ink, sw: 1 }); paint(rrPts(x - 26, y - 330, 52, 50, 14), { wash: '#93503F', ink: PAL.ink, sw: .8 }); }
