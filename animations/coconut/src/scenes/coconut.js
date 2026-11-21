// coconut.js: "How does water get inside a coconut?" (Pathira Chindhakal reel #9, explainer). One shot per narration line.
// Same explainer kit (bright scenes, card() labels, BASE colours). Timing from coconut_times.js (edits/coconut/timeline.py).
(() => {
  const F = {
    sky: '#9ED3EA', bg: '#EAF4F8', bgWarm: '#F8F0E2', card: '#FFF8EA', ink: PAL.ink, green: '#3FAF5A', red: '#D8423A', blue: '#3FA7E0',
    navy: '#1F2550', husk: '#6FA84A', huskDk: '#4E8A34', shell: '#7A4E2E', flesh: '#FBF6EA', water: '#BFE3F2', soil: '#8A5A3A', coin: '#E8B23A'
  };
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .25) => { if (lt < d) flash(1 - easeOut(lt / d), '#FFFFFF'); };
  function card(x, y, w, h, title, sub, o = {}) {
    w *= 1.3; h *= 1.3; boilSeed('card' + title + x); paint(rrPts(x - w / 2, y - h / 2, w, h, 22), { wash: o.col || F.card, ink: F.ink, sw: 1.2 });
    const sz = (o.size || 54) * 1.4;
    if (title) letter(title, x, y - (sub ? h * .16 : 0), sz, o.ink || F.ink, { pop: o.pop });
    if (sub) letter(sub, x, y + h * .24, sz * .62, o.subInk || '#5E5A62', { pop: o.pop });
  }
  // cross-section of a coconut: flesh = 0..1 (how much of the water has set into white flesh)
  function section(x, y, r, flesh, key, o = {}) {
    boilSeed('sec' + key);
    paint(ellPts(x, y, r, r * 1.1, 30, .5), { wash: o.mature ? '#A8783E' : F.husk, ink: F.ink, sw: 1.4 });
    paint(ellPts(x, y, r * .72, r * .8, 28, .4), { wash: F.shell, ink: F.ink, sw: 1 });
    paint(ellPts(x, y, r * .66, r * .74, 28, .3), { wash: F.flesh, ink: null });
    const wr = .66 - .4 * flesh;
    paint(ellPts(x, y, r * wr, r * (wr + .08), 26, .3), { wash: F.water, ink: F.ink, sw: .6 });
    if (o.glow) glow(x, y, r, '#BFE3F2', o.glow);
  }
  function coconutBall(x, y, r, key, col = F.husk) { boilSeed('cb' + key); paint(ellPts(x, y, r, r * 1.08, 24, .5), { wash: col, ink: F.ink, sw: 1.2 }); paint(ellPts(x - r * .3, y - r * .35, r * .25, r * .15, 12), { wash: '#FFFFFF', washOp: 90, ink: null }); }
  function drops(x0, y0, x1, y1, t, n, key, col = '#3FA7E0') { for (let i = 0; i < n; i++) { const k = frac(t * .6 + i / n), p = [lerp(x0, x1, k), lerp(y0, y1, k)]; boilSeed(key + i); paint([[p[0], p[1] - 14], [p[0] + 9, p[1] + 4], [p[0], p[1] + 12], [p[0] - 9, p[1] + 4]], { wash: col, ink: null, curv: .5 }); } }

  // 1. How does water get inside a coconut, high up behind a hard shell?
  function s1(t, lt, dur) {
    const [a, b] = L(0), z = kf(lt, [[0, 1.0], [1.2, 1.0], [3.0, 2.4], [dur, 2.5]], ease);
    camBegin(lerp(960, 1030, seg(z, 1, 2.4)), lerp(560, 300, seg(z, 1, 2.4)), z);
    boilSeed('sky1'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null });
    for (let i = 0; i < 3; i++) cloud(260 + i * 700, 140 + 50 * hash(i), .7, 'cc' + i);
    boilSeed('g1'); paint(rectPts(-300, 900, W + 600, 400), { wash: '#7DB85A', ink: null });
    palm(900, 920, 640, .05 * Math.sin(t * 2), 'tall');
    for (let i = 0; i < 4; i++) coconutBall(990 + (i % 2) * 40 - 20, 310 + Math.floor(i / 2) * 40, 26, 'b' + i);
    camEnd();
    emote('?', 960, 160, 90, seg(lt, b - 1.2, b - .9), lt);
    if (lt < .5) flash(1 - easeOut(lt / .5), '#FFFFFF');
  }
  // 2. The tree makes it inside
  function s2(t, lt, dur) {
    const [a] = L(1);
    camBegin(960, 540, 1.0);
    boilSeed('bg2'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bgWarm, ink: null });
    coconutBall(960, 520, 240, 'big2'); glow(960, 520, 300, '#BFE3F2', .3 * seg(lt, a + .4, a + 1.2));
    if (lt > a + .8) card(960, 900, 460, 100, 'MADE INSIDE', null, { pop: (lt - a - .8) * 4, size: 56, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 3. Roots draw water up the trunk
  function s3(t, lt, dur) {
    const [a] = L(2);
    camBegin(960, 540, 1.0);
    boilSeed('bg3'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null }); paint(rectPts(-300, 760, W + 600, 600), { wash: F.soil, ink: null });
    boilSeed('trunk3'); paint(rectPts(880, -100, 160, 860), { wash: '#A8835A', ink: F.ink, sw: 1.4 }); paint(rectPts(925, -100, 70, 860), { wash: '#D8BE90', ink: null });
    for (let i = 0; i < 7; i++) { boilSeed('root' + i); const a2 = Math.PI * (.15 + .7 * i / 6); paint(ribbon([[960, 760], [960 + Math.cos(a2) * 260, 760 + Math.sin(a2) * 200]], 18, 4), { wash: '#8A6A4A', ink: F.ink, sw: .6 }); }
    if (lt > a + .3) drops(960, 980, 960, 760, t * 1.5, 4, 'dr', '#3FA7E0');
    if (lt > a + 1.6) drops(960, 740, 960, -60, t, 8, 'du', '#3FA7E0');
    if (lt > a + .5) card(1450, 900, 300, 90, 'ROOTS', null, { pop: (lt - a - .5) * 4, size: 46 });
    if (lt > a + 2.2) card(1450, 300, 300, 90, 'TRUNK', null, { pop: (lt - a - 2.2) * 4, size: 46 });
    camEnd(); fadeIn(lt);
  }
  // 4. Water + sugars + minerals flow into each coconut
  function s4(t, lt, dur) {
    const [a] = L(3);
    camBegin(960, 520, 1.0);
    boilSeed('bg4'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null });
    boilSeed('crown'); paint(rectPts(900, 600, 120, 600), { wash: '#A8835A', ink: F.ink, sw: 1.2 });
    for (let i = 0; i < 6; i++) { const ang = -Math.PI / 2 + (i - 2.5) * .5; paint(ribbon(through([[960, 600], [960 + Math.cos(ang) * 300, 600 + Math.sin(ang) * 220], [960 + Math.cos(ang) * 560, 700 + Math.sin(ang) * 100]], 4), 40, 6), { wash: i % 2 ? '#4F7F3A' : '#35602B', ink: F.ink, sw: .6 }); }
    for (let i = 0; i < 5; i++) coconutBall(800 + i * 80, 680 + 30 * (i % 2), 56, 'bun' + i);
    drops(960, 1100, 960, 680, t, 5, 'd4');
    if (lt > a + 1.4) card(420, 300, 300, 90, 'SUGAR', null, { pop: (lt - a - 1.4) * 4, size: 46, col: '#FFF0D8' });
    if (lt > a + 2.0) card(1500, 300, 340, 90, 'MINERALS', null, { pop: (lt - a - 2.0) * 4, size: 46, col: '#E6F0FF' });
    camEnd(); fadeIn(lt);
  }
  // 5. A young coconut is full of water: karikku
  function s5(t, lt, dur) {
    const [a, b] = L(4);
    camBegin(960, 540, 1.0);
    boilSeed('bg5'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    section(800, 540, 300, 0, 'young', { glow: .3 });
    for (let i = 0; i < 6; i++) { boilSeed('bub5' + i); const k = frac(t * .4 + i / 6); paint(ellPts(720 + 160 * hash(i), 700 - k * 300, 8, 8, 8), { wash: '#FFFFFF', washOp: 180, ink: null }); }
    if (lt > b - 1.8) card(1460, 540, 380, 140, 'KARIKKU', 'tender coconut', { pop: (lt - (b - 1.8)) * 4, size: 62, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 6. Liquid endosperm: food for the seed
  function s6(t, lt, dur) {
    const [a, b] = L(5);
    camBegin(960, 540, 1.0);
    boilSeed('bg6'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    section(600, 540, 260, 0, 'y6');
    if (lt > a + .8) card(1300, 440, 560, 130, 'LIQUID ENDOSPERM', null, { pop: (lt - a - .8) * 4, size: 48 });
    if (lt > b - 1.4) card(1300, 680, 460, 100, '= food for the seed', null, { pop: (lt - (b - 1.4)) * 4, size: 40, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 7. Water peaks around 6-7 months
  function s7(t, lt, dur) {
    const [a] = L(6), k = seg(lt, a + .2, a + 2.4);
    camBegin(960, 540, 1.0);
    boilSeed('bg7'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    boilSeed('axis'); inkLine([[260, 820], [1660, 820]], 2, F.ink, 'ink', 0);
    for (let m = 0; m <= 12; m += 2) letter(String(m), 260 + m * 116, 870, 44, '#5E5A62');
    const P = []; for (let m = 0; m <= 12 * k; m += .25) P.push([260 + m * 116, 820 - 520 * Math.exp(-(((m - 6.5) / 2.6) ** 2))]);
    if (P.length > 1) inkLine(P, 4, F.blue, 'ink', .3);
    if (k > .6) { boilSeed('peak'); paint(ellPts(260 + 6.5 * 116, 300, 18, 18, 12), { wash: F.blue, ink: F.ink, sw: .8 }); card(260 + 6.5 * 116, 180, 420, 90, '6-7 MONTHS', null, { pop: (k - .6) * 8, size: 44, col: F.coin }); }
    letter('months', 1660, 920, 36, '#5E5A62');
    camEnd(); fadeIn(lt);
  }
  // 8. The water sets into white flesh along the shell
  function s8(t, lt, dur) {
    const [a] = L(7), k = easeInOut2(seg(lt, a + 1.0, a + 4.4));
    camBegin(960, 540, 1.0);
    boilSeed('bg8'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    section(800, 540, 320, k, 's8');
    if (lt > a + 3.0) card(1460, 540, 340, 110, 'FLESH', 'kaampu', { pop: (lt - a - 3.0) * 4, size: 56 });
    camEnd(); fadeIn(lt);
  }
  function easeInOut2(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
  // 9. Mature coconut: more flesh, less water
  function s9(t, lt, dur) {
    const [a] = L(8);
    camBegin(960, 540, 1.0);
    boilSeed('bg9'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    section(560, 500, 240, 0, 'y9'); section(1360, 500, 240, .9, 'm9', { mature: true });
    card(560, 850, 300, 90, 'YOUNG', null, { size: 44 }); card(1360, 850, 300, 90, 'MATURE', null, { size: 44 });
    if (lt > a + 1.6) { boilSeed('bars9'); paint(rectPts(860, 300, 60, 400), { wash: '#E2DDD4', ink: F.ink, sw: .8 }); paint(rectPts(860, 300 + 400 * .1, 60, 400 * .9), { wash: F.water, ink: null });
      paint(rectPts(1660, 300, 60, 400), { wash: '#E2DDD4', ink: F.ink, sw: .8 }); paint(rectPts(1660, 300 + 400 * .8, 60, 400 * .2), { wash: F.water, ink: null }); }
    camEnd(); fadeIn(lt);
  }
  // 10. The three eyes
  function s10(t, lt, dur) {
    const [a] = L(9);
    camBegin(960, 540, 1.0 + .05 * lt);
    boilSeed('bg10'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bgWarm, ink: null });
    boilSeed('end10'); paint(ellPts(960, 540, 360, 360, 32, .6), { wash: '#8A5A34', ink: F.ink, sw: 1.6 });
    for (let i = 0; i < 12; i++) inkLine([[960 + Math.cos(i * .52) * 80, 540 + Math.sin(i * .52) * 80], [960 + Math.cos(i * .52) * 340, 540 + Math.sin(i * .52) * 340]], .8, '#6E4628', 'inkfine', .4);
    [[880, 470], [1040, 470], [960, 610]].forEach(([x, y], i) => { boilSeed('eye' + i); paint(ellPts(x, y, 44, 50, 16), { wash: '#3B2619', ink: F.ink, sw: .8 }); if (lt > a + .4 + i * .3) { const P = ellPts(x, y, 80, 86, 20); inkLine([...P, P[0]], 3, F.coin, 'ink', .3); } });
    camEnd(); fadeIn(lt);
  }
  // 11. Only one eye is soft: the sprout comes out there
  function s11(t, lt, dur) {
    const [a, b] = L(10), sp = easeOut(seg(lt, a + 1.8, b - .2));
    camBegin(960, 540, 1.0);
    boilSeed('bg11'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bgWarm, ink: null });
    boilSeed('end11'); paint(ellPts(960, 600, 300, 300, 32, .6), { wash: '#8A5A34', ink: F.ink, sw: 1.6 });
    [[890, 540], [1030, 540], [960, 660]].forEach(([x, y], i) => { boilSeed('eye11' + i); paint(ellPts(x, y, 38, 44, 16), { wash: i === 2 ? '#C9A46A' : '#3B2619', ink: F.ink, sw: .8 }); });
    glow(960, 660, 120, '#FFE27A', .5 * seg(lt, a + .3, a + 1.0));
    if (lt > a + .6) card(1500, 300, 260, 90, 'SOFT', null, { pop: (lt - a - .6) * 4, size: 46, col: '#E6F6EA' });
    if (sp > 0) { boilSeed('sprout'); paint(ribbon([[960, 660], [960 + 20 * sp, 660 - 260 * sp]], 16, 6), { wash: F.green, ink: F.ink, sw: .8 }); paint(ribbon([[960 + 20 * sp, 660 - 260 * sp], [960 + 120 * sp, 660 - 340 * sp]], 30 * sp + 1, 2), { wash: '#6FBF5A', ink: F.ink, sw: .6 }); }
    camEnd(); fadeIn(lt);
  }
  // 12. Water and flesh: the seedling's first food
  function s12(t, lt, dur) {
    const [a] = L(11);
    camBegin(960, 560, 1.0);
    boilSeed('bg12'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null }); paint(rectPts(-300, 860, W + 600, 400), { wash: F.soil, ink: null });
    section(960, 760, 230, .7, 's12', { mature: true });
    boilSeed('seedl'); paint(ribbon([[960, 560], [970, 220]], 22, 10), { wash: F.green, ink: F.ink, sw: .8 }); for (const d of [-1, 1]) paint(ribbon([[970, 260], [970 + d * 200, 160]], 50, 4), { wash: '#6FBF5A', ink: F.ink, sw: .6 });
    if (lt > a + 1.0) drops(960, 760, 965, 300, t, 4, 'd12', F.coin);
    if (lt > a + 1.8) card(1500, 400, 400, 110, 'FIRST FOOD', null, { pop: (lt - a - 1.8) * 4, size: 50, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 13. A tender coconut is a lunchbox for a baby coconut tree
  function s13(t, lt, dur) {
    const [a, b] = L(12);
    camBegin(960, 540, 1.0);
    boilSeed('bg13'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bgWarm, ink: null });
    coconutBall(900, 620, 250, 'lunch');
    boilSeed('lid'); paint(rrPts(640, 360, 520, 70, 20), { wash: '#D8423A', ink: F.ink, sw: 1.2 }); paint(rectPts(860, 330, 80, 40), { wash: '#D8423A', ink: F.ink, sw: 1 });
    boilSeed('baby'); paint(ribbon([[1360, 860], [1370, 620]], 18, 8), { wash: F.green, ink: F.ink, sw: .8 }); for (const d of [-1, 1]) paint(ribbon([[1370, 650], [1370 + d * 130, 580]], 40, 4), { wash: '#6FBF5A', ink: F.ink, sw: .6 });
    paint(ellPts(1350, 760, 8, 8, 8), { wash: F.ink, ink: null }); paint(ellPts(1385, 760, 8, 8, 8), { wash: F.ink, ink: null }); inkLine([[1350, 790], [1368, 802], [1386, 790]], 1.4, F.ink, 'ink', .5);
    if (lt > b - 2.0) card(960, 180, 520, 110, 'TIFFIN BOX!', null, { pop: (lt - (b - 2.0)) * 4, size: 60, col: F.coin });
    camEnd(); fadeIn(lt);
  }
  // 14. Remember: drink it quickly once opened
  function s14(t, lt, dur) {
    const [a, b] = L(13);
    camBegin(960, 540, 1.0);
    boilSeed('bg14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    card(960, 170, 460, 100, 'REMEMBER', null, { size: 64, col: F.coin });
    coconutBall(700, 600, 200, 'open'); boilSeed('hole'); paint(ellPts(700, 430, 70, 30, 16), { wash: F.water, ink: F.ink, sw: 1 }); inkLine([[700, 430], [760, 240]], 4, '#E8E0C8', 'ink', 0);
    boilSeed('clock14'); paint(ellPts(1300, 560, 150, 150, 26), { wash: '#FFFFFF', ink: F.ink, sw: 1.4 }); const ang = lt * 2; inkLine([[1300, 560], [1300 + Math.sin(ang) * 110, 560 - Math.cos(ang) * 110]], 3, F.ink, 'ink', 0); inkLine([[1300, 560], [1300 + Math.sin(ang / 12) * 70, 560 - Math.cos(ang / 12) * 70]], 4, F.ink, 'ink', 0);
    if (lt > b - 2.0) card(960, 900, 560, 100, 'DRINK IT FRESH', null, { pop: (lt - (b - 2.0)) * 4, size: 52, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 15. Follow
  function s15(t, lt, dur) {
    const [a, b] = L(14), press = lt > b - 1.0;
    camBegin(960, 540, 1.0);
    boilSeed('bg15'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.navy, ink: null });
    for (let i = 0; i < 30; i++) { boilSeed('st15' + i); paint(starPts(hash(i) * W, hash(i + 40) * H, 4, .35, 4), { wash: PAL.cream, washOp: 160, ink: null }); }
    boilSeed('pfp'); paint(ellPts(960, 400, 200, 200, 32), { wash: '#2F3C7A', ink: PAL.cream, sw: 2 });
    person(930, 560, 15, { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'grin', armF: .3, armB: .2 });
    letter('@pathira.chindhakal', 960, 700, 64, PAL.cream);
    card(960, 860, 380, 110, press ? 'Following' : 'Follow', null, { col: press ? '#3A3F6A' : F.blue, ink: '#FFFFFF', size: 56, pop: press ? (lt - (b - 1.0)) * 5 : 1 });
    camEnd(); fadeIn(lt, .3);
    if (lt > dur - .8) flash(seg(lt, dur - .8, dur - .1), '#0B0D18');
  }

  const BASE = [F.sky, F.bgWarm, F.sky, F.sky, F.bg, F.bg, F.bg, F.bg, F.bg, F.bgWarm, F.bgWarm, F.bg, F.bgWarm, F.bg, F.navy];
  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], (t, lt, dur) => { base(BASE[i]); f(t, lt, dur); }]));
})();
