// hairpin.js: "Hairpin 9" (Pathira Chindhakal reel #5, ghost thriller on Thamarassery Churam). One shot per line.
// Timing from hairpin_times.js (edits/hairpin9/timeline.py).
(() => {
  const N = {
    sky: '#141B36', hill: '#1C2A2E', hillDk: '#141E22', road: '#2E2C34', roadLt: '#4A4652', rail: '#8C8A92', fog: '#AEB8CC',
    lamp: '#FFC27A', head: '#FFF2C8', ghost: '#D8DCE6', ghostSkin: '#B8BCC8', rain: '#8FA6C8', black: '#0B0D18',
    dawn: '#F2C48D', dawnSky: '#E8D6C0', tea: '#C98A4A', coat: '#C9A43A', coatDk: '#9C7E2A'
  };
  const HERO = (o = {}) => ({ key: 'hero', skin: C.skin, shirt: N.coat, lower: 'pants', lowerCol: '#2E3A4E', hairStyle: 'short', shoe: '#2A2A33', ...o });
  const RAJU = (o = {}) => ({ key: 'raju', skin: N.ghostSkin, shirt: N.ghost, lower: 'pants', lowerCol: '#9A9EAC', hairStyle: 'short', hair: '#2A2E3A', eyes: 'dot', mouth: 'flat', shoe: '#6E7280', ...o });
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .4, col = N.black) => { if (lt < d) flash(1 - easeOut(lt / d), col); };

  function rain(t, n = 40, col = N.rain, key = 'rain') {
    for (let i = 0; i < n; i++) { boilSeed(key + i); const x = ((hash(i) * (W + 400) - t * 300) % (W + 400) + W + 400) % (W + 400) - 200, y = ((hash(i + 50) * H + t * 1400) % (H + 200)) - 100;
      inkLine([[x, y], [x - 14, y + 46]], .6, col, 'inkfine', 0); }
  }
  function fog(t, y, k = 1, key = 'fog') {
    for (let i = 0; i < 4; i++) { boilSeed(key + i); const x = ((i * 620 + t * (25 + 10 * i)) % (W + 1200)) - 600; paint(ellPts(x, y + (i % 2) * 60, 560, 80, 22, 4), { wash: N.fog, washOp: 40 * k, ink: null }); }
  }
  function hills(t, scroll = 0, key = 'hills') {
    boilSeed(key);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: N.sky, ink: null });
    for (let i = 0; i < 4; i++) { const x = ((i * 700 - scroll * .2) % 2800 + 2800) % 2800 - 600; paint(ellPts(x, 760, 520, 420, 26, 4), { wash: N.hill, ink: null }); }
    for (let i = 0; i < 4; i++) { const x = ((i * 640 + 300 - scroll * .5) % 2560 + 2560) % 2560 - 500; paint(ellPts(x, 860, 420, 300, 24, 3), { wash: N.hillDk, ink: null }); }
  }
  function bike(x, y, s, o = {}) {           // side view, facing right; (x, y) = ground under the middle
    const r = 58;
    push(); translate(x, y); scale(s); boilSeed('bike' + (o.key || ''));
    for (const wx of [-120, 120]) { paint(ellPts(wx, -r, r, r, 20, .5), { wash: '#1E1B24', ink: PAL.ink, sw: 1 }); paint(ellPts(wx, -r, r * .4, r * .4, 12), { wash: '#6E6A72', ink: PAL.ink, sw: .6 });
      const a = o.spin || 0; for (let j = 0; j < 3; j++) inkLine([[wx, -r], [wx + Math.cos(a + j * 2.1) * r * .38, -r + Math.sin(a + j * 2.1) * r * .38]], .7, PAL.ink, 'inkfine', 0); }
    paint([[-120, -r], [-30, -150], [80, -150], [120, -r], [60, -100], [-60, -100]], { wash: '#8C2A26', ink: PAL.ink, sw: 1 });
    paint(rrPts(-70, -175, 120, 30, 12), { wash: '#2A2630', ink: PAL.ink, sw: .8 });
    paint(rrPts(30, -195, 90, 50, 18), { wash: '#A8302A', ink: PAL.ink, sw: .9 });
    inkLine([[110, -200], [150, -250], [175, -250]], 2, '#3A3640', 'ink', 0);
    paint(ellPts(160, -175, 18, 22, 12), { wash: '#FFF2C8', ink: PAL.ink, sw: .7 });
    pop();
    if (o.light !== false) glow(x + 175 * s, y - 175 * s, 260 * s, N.head, .6 * (o.light ?? 1));
  }
  function streetlight(x, y, h, t, key = 'sl') { boilSeed(key); paint(rectPts(x - 7, y - h, 14, h), { wash: '#3A3640', ink: PAL.ink, sw: .6 }); paint(rectPts(x - 7, y - h, 70, 12), { wash: '#3A3640', ink: null });
    glow(x + 60, y - h + 20, 300, N.lamp, .55 + .08 * Math.sin(t * 13) * Math.sin(t * 5)); boilSeed(key + 'cone'); paint([[x + 40, y - h + 14], [x + 80, y - h + 14], [x + 260, y], [x - 140, y]], { wash: N.lamp, washOp: 26, ink: null }); }
  function guardrail(x0, x1, y, gap = null, key = 'gr') { boilSeed(key);
    for (let x = x0; x < x1; x += 120) { if (gap && x > gap[0] && x < gap[1]) continue; paint(rectPts(x, y - 60, 12, 60), { wash: N.rail, ink: PAL.ink, sw: .5 }); }
    const segs = gap ? [[x0, gap[0]], [gap[1], x1]] : [[x0, x1]]; for (const [a, b] of segs) paint(rectPts(a, y - 58, b - a, 18), { wash: '#B8B4BC', ink: PAL.ink, sw: .6 });
    if (gap) { inkLine([[gap[0], y - 49], [gap[0] + 40, y - 10]], 2, '#B8B4BC', 'ink', 0); inkLine([[gap[1], y - 49], [gap[1] - 30, y - 20]], 2, '#B8B4BC', 'ink', 0); } }
  function face(cx, cy, r, o = {}) {
    const skin = o.skin || C.skin, hair = o.hair || C.hair, ink = PAL.ink, sw = 1.1;
    boilSeed('face' + (o.key || ''));
    paint(ellPts(cx - .3 * r, cy + 1.25 * r, .55 * r, .6 * r, 14), { wash: o.shirt || '#E8E0C8', ink, sw });
    paint(ellPts(cx - .29 * r, cy - .18 * r, r, .97 * r, 24, .6), { wash: hair, ink, sw });
    paint(ellPts(cx, cy, r, 1.06 * r, 28, .5), { wash: skin, ink, sw });
    if (o.bald) paint(ellPts(cx - .5 * r, cy - .2 * r, .5 * r, .6 * r, 16), { wash: hair, ink: null }); else paint(ellPts(cx - .13 * r, cy - .71 * r, .97 * r, .45 * r, 22, .5, -.08), { wash: hair, ink: null });
    paint(ellPts(cx - .35 * r, cy + .1 * r, .19 * r, .29 * r, 12, .3), { wash: mixCol(skin, ink, .15), ink, sw: sw * .7 });
    for (const ex of [cx + .23 * r, cx + .71 * r]) { const ey = cy - .06 * r; paint(ellPts(ex, ey, .09 * r, .14 * r, 10), { wash: ink, ink: null }); inkLine([[ex - .16 * r, ey - .36 * r], [ex + .16 * r, ey - .36 * r]], sw * .9, ink, 'ink', 0); }
    inkLine([[cx + .94 * r, cy - .03 * r], [cx + 1.1 * r, cy + .23 * r], [cx + .9 * r, cy + .26 * r]], sw * .8, ink, 'inkfine', .5);
    if (o.stache) paint(ribbon([[cx + .3 * r, cy + .45 * r], [cx + .6 * r, cy + .38 * r], [cx + .85 * r, cy + .45 * r]], .14 * r, .06 * r), { wash: o.stache, ink: null });
    inkLine([[cx + .4 * r, cy + .62 * r], [cx + .75 * r, cy + .62 * r]], sw, ink, 'ink', 0);
  }

  // 1. The churam at night: hairpin bends, one headlight climbing
  function s1(t, lt, dur) {
    camBegin(960, 540, 1.0 + .04 * lt);
    boilSeed('mt'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.sky, ink: null });
    paint(ellPts(960, 1300, 1400, 1100, 30, 4), { wash: N.hill, ink: null });
    const P = [[300, 1000], [1500, 900], [500, 780], [1450, 660], [600, 560], [1350, 460], [800, 380]];
    boilSeed('zig'); paint(ribbon(through(P, 6), 50, 26), { wash: N.road, ink: PAL.ink, sw: .8 });
    const k = seg(lt, 0, dur), seg_i = Math.min(5, Math.floor(k * 6)), f = k * 6 - seg_i, hp = [lerp(P[seg_i][0], P[seg_i + 1][0], f), lerp(P[seg_i][1], P[seg_i + 1][1], f)];
    glow(hp[0], hp[1], 120, N.head, .9);
    rain(t, 40); fog(t, 600, 1);
    camEnd();
    if (lt < 1.0) flash(1 - easeOut(lt / 1.0), N.black);
  }
  // 2. Riding alone to Wayanad: rain and fog
  function s2(t, lt, dur) {
    camBegin(960, 560, 1.05);
    hills(t, lt * 600);
    boilSeed('road2'); paint(rectPts(-300, 860, W + 600, 400), { wash: N.road, ink: null });
    for (let i = 0; i < 8; i++) { boilSeed('d2' + i); const x = ((i * 360 - lt * 1400) % 2880 + 2880) % 2880 - 400; paint(rectPts(x, 960, 160, 10), { wash: N.roadLt, ink: null }); }
    guardrail(-300, W + 300, 870, null, 'gr2');
    const bob = Math.sin(lt * 18) * 3;
    bike(860, 930 + bob, .9, { spin: -lt * 25 });
    person(860 - 40, 930 + bob - 150, 15, HERO({ sit: true, eyes: 'dot', mouth: 'flat', armF: 1.6, bendF: -.2, armB: 1.5, hairFly: .5 }));
    rain(t, 50); fog(t, 640, .8);
    camEnd(); fadeIn(lt);
  }
  // 3. At the ninth hairpin, a man in a white shirt: "Can you give me a lift?"
  function s3(t, lt, dur) {
    const [a, b] = L(2), wave = lt > b - 1.0;
    camBegin(1000, 560, 1.05 + .04 * lt);
    hills(t, 0, 'h3');
    boilSeed('road3'); paint(rectPts(-300, 860, W + 600, 400), { wash: N.road, ink: null });
    streetlight(1300, 880, 520, t, 'sl3');
    boilSeed('sign9'); paint(rectPts(1560, 640, 140, 120), { wash: '#E8C84A', ink: PAL.ink, sw: 1 }); paint(rectPts(1624, 760, 12, 120), { wash: '#3A3640', ink: null }); letter('9', 1630, 700, 80, PAL.ink);
    person(1360, 890, 20, RAJU({ flip: true, armF: wave ? 2.7 : .1, bendF: -.2, armB: .1 }));
    const bx = lerp(-400, 400, easeOut(seg(lt, 0, dur)));
    bike(bx, 900, .8, { spin: -lt * 20 });
    rain(t, 40); fog(t, 680, .7);
    camEnd(); fadeIn(lt);
  }
  // 4. He gets on; the bike doesn't get any heavier
  function s4(t, lt, dur) {
    const [a] = L(3), climb = seg(lt, a + .7, a + 1.5);
    camBegin(960, 600, 1.25);
    hills(t, 0, 'h4');
    boilSeed('road4'); paint(rectPts(-300, 860, W + 600, 400), { wash: N.road, ink: null });
    streetlight(1400, 880, 520, t, 'sl4');
    bike(900, 900, .95, { spin: 0 });
    person(900 - 40, 900 - 158, 16, HERO({ sit: true, eyes: lt > a + 2.2 ? 'wide' : 'dot', mouth: 'flat', armF: 1.6, bendF: -.2, armB: 1.5 }));
    if (climb < 1) person(lerp(1200, 820, easeOut(climb)), lerp(900, 900 - 160, easeIn(climb)), 16, RAJU({ flip: false }));
    else person(900 - 170, 900 - 160, 16, RAJU({ sit: true, armF: 1.2, armB: 1.0 }));
    boilSeed('shock'); paint(rectPts(1004, 900 - 120, 10, 60), { wash: '#B8B4BC', ink: PAL.ink, sw: .5 });
    rain(t, 40);
    camEnd(); fadeIn(lt);
  }
  // 5. "Where to?" "Up."
  function s5(t, lt, dur) {
    camBegin(900, 520, 1.4);
    hills(t, lt * 600, 'h5');
    boilSeed('road5'); paint(rectPts(-300, 860, W + 600, 400), { wash: N.road, ink: null });
    const bob = Math.sin(lt * 18) * 3;
    bike(900, 930 + bob, .95, { spin: -lt * 25 });
    person(900 - 170, 930 + bob - 160, 16, RAJU({ sit: true, armF: 1.2, armB: 1.0, eyes: 'closed' }));
    boilSeed('shade5'); paint(ellPts(900 - 170 + 8, 930 + bob - 160 - 16 * 13.9, 16 * 3.0, 16 * 3.1, 18), { wash: '#141820', washOp: 210, ink: null });
    person(900 - 40, 930 + bob - 158, 16, HERO({ sit: true, eyes: 'dot', mouth: lt < L(4)[0] + 1.0 ? 'o' : 'flat', armF: 1.6, bendF: -.2, armB: 1.5, hairFly: .5 }));
    rain(t, 50);
    camEnd(); fadeIn(lt);
  }
  // 6. The mirror: nobody behind him
  function s6(t, lt, dur) {
    camBegin(960, 540, 1.0 + .05 * lt);
    boilSeed('bg6'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#10142A', ink: null });
    rain(t, 30, '#5E6E90', 'r6');
    boilSeed('mir'); paint(rectPts(940, 640, 18, 500), { wash: '#3A3640', ink: null });
    paint(ellPts(960, 480, 330, 240, 32, .5), { wash: '#2A2630', ink: PAL.ink, sw: 1.4 });
    paint(ellPts(960, 480, 300, 212, 32, .5), { wash: '#1E2A3E', ink: null });
    paint(ellPts(960, 620, 300, 70, 24), { wash: '#2E2C34', ink: null });
    glow(960, 560, 160, N.lamp, .2);
    for (let i = 0; i < 8; i++) { boilSeed('mr' + i); const x = 700 + 520 * hash(i), y = 300 + ((hash(i + 3) * 300 + t * 600) % 300); inkLine([[x, y], [x - 6, y + 22]], .5, N.rain, 'inkfine', 0); }
    camEnd(); fadeIn(lt);
  }
  // 7. A cold hand on his shoulder, frost spreading
  function s7(t, lt, dur) {
    const [a] = L(6), k = easeOut(seg(lt, a + .6, a + 1.6));
    camBegin(960, 560, 1.0 + .04 * lt);
    boilSeed('bg7'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#10142A', ink: null });
    boilSeed('coat7'); paint(ellPts(1000, 1000, 760, 520, 30, 2), { wash: N.coat, ink: PAL.ink, sw: 1.4 }); inkLine([[700, 620], [900, 700], [1150, 680]], 1.4, N.coatDk, 'ink', .5);
    paint(ellPts(1400, 380, 230, 260, 26), { wash: C.skin, ink: PAL.ink, sw: 1.2 }); paint(ellPts(1360, 300, 230, 170, 22), { wash: C.hair, ink: null });
    const hx = lerp(500, 820, k), hy = lerp(300, 610, k);
    boilSeed('hand7'); paint(ribbon([[hx - 400, hy - 300], [hx - 80, hy - 40], [hx, hy]], 70, 60), { wash: N.ghostSkin, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 4; i++) paint(ribbon([[hx - 10 + i * 30, hy - 10], [hx + 10 + i * 34, hy + 80 - Math.abs(i - 1.5) * 10]], 22, 16), { wash: N.ghostSkin, ink: PAL.ink, sw: .8 });
    if (k > .9) for (let i = 0; i < 9; i++) { boilSeed('frost' + i); const fk = seg(lt, a + 1.6, a + 2.6), aa = i / 9 * TAU; inkLine([[hx + 40, hy + 60], [hx + 40 + Math.cos(aa) * 220 * fk, hy + 60 + Math.sin(aa) * 160 * fk]], 1, '#E6F0FF', 'inkfine', .3); }
    camEnd(); fadeIn(lt);
  }
  // 8. "Slow down. This is the bend where I fell." (broken railing)
  function s8(t, lt, dur) {
    camBegin(lerp(800, 1100, ease(seg(lt, 0, dur))), 560, 1.1);
    hills(t, 0, 'h8');
    boilSeed('road8'); paint(ribbon(through([[-300, 980], [900, 930], [1500, 800], [1800, 600]], 5), 220, 120), { wash: N.road, ink: PAL.ink, sw: .8 });
    guardrail(1000, 1900, 800, [1350, 1600], 'gr8');
    boilSeed('drop'); paint(rectPts(1300, 820, 900, 400), { wash: '#0A0E18', ink: null });
    rain(t, 40); fog(t, 700, 1.1);
    camEnd(); fadeIn(lt);
  }
  // 9. A lorry: blinding headlights, brakes
  function s9(t, lt, dur) {
    const [a, b] = L(8), k = easeIn(seg(lt, a, a + 2.0)), skid = lt > a + 2.2;
    const sh = skid ? shakeXY(lt, 10 * (1 - seg(lt, a + 2.2, dur))) : [0, 0];
    camBegin(960 + sh[0], 540 + sh[1], 1.0);
    hills(t, lt * 300, 'h9');
    boilSeed('road9'); paint(rectPts(-300, 860, W + 600, 400), { wash: N.road, ink: null });
    for (const dx of [-90, 90]) glow(1500 + dx * (1 + 3 * k) - 300 * k, 760, 120 + 500 * k, N.head, .5 + .5 * k);
    const bx = skid ? 700 + 120 * easeOut(seg(lt, a + 2.2, dur)) : 700;
    bike(bx, 930, .9, { spin: skid ? 0 : -lt * 25 });
    person(bx - 40, 930 - 150, 15, HERO({ sit: true, eyes: 'wide', mouth: 'O', armF: 1.6, bendF: -.2, armB: 1.5, rot: skid ? -.1 : 0 }));
    if (skid) dust(bx - 120, 930, seg(lt, a + 2.2, a + 3.2), 'sk9', 5, .8);
    rain(t, 40);
    camEnd();
    flash(.6 * Math.exp(-(((lt - (a + 2.0)) * 5) ** 2)), '#FFFFFF');
    fadeIn(lt);
  }
  // 10. The front wheel at the edge of the drop
  function s10(t, lt, dur) {
    camBegin(1080, 640, 1.35 + .05 * lt);
    boilSeed('bg10'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.sky, ink: null });
    paint(rectPts(-300, 860, 1500, 400), { wash: N.road, ink: null });
    boilSeed('edge'); paint([[1200, 860], [1230, 900], [1180, 1300], [-300, 1300], [-300, 860]], { wash: '#2A2630', ink: PAL.ink, sw: 1 });
    paint(rectPts(1220, 860, 900, 500), { wash: '#06080F', ink: null });
    bike(1000, 870, .9, { spin: 0, light: .7 });
    person(1000 - 40, 870 - 150, 15, HERO({ sit: true, eyes: 'wide', mouth: 'O', brow: 'worry', armF: 1.6, bendF: -.2, armB: 1.5, emote: 'sweat', emoteK: 1 }));
    for (let i = 0; i < 4; i++) { const k = frac(lt * .6 + i * .25); boilSeed('stone' + i); paint(ellPts(1240 + 20 * i, 880 + k * 500, 8, 7, 8), { wash: '#6E6A72', ink: null }); }
    rain(t, 30);
    camEnd(); fadeIn(lt);
  }
  // 11. Nobody there. Only a cold handprint on his jacket
  function s11(t, lt, dur) {
    const [a] = L(10), turned = lt > a + .5;
    camBegin(960, 560, 1.0 + .04 * lt);
    boilSeed('bg11'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#10142A', ink: null });
    if (lt < a + 2.4) {
      bike(1000, 980, 1.5, { spin: 0, light: .4 });
      person(1000 - 70, 980 - 250, 25, HERO({ sit: true, flip: turned, eyes: 'wide', mouth: 'flat', brow: 'worry', armF: 1.6, armB: 1.5 }));
    } else {
      boilSeed('back11'); paint(ellPts(960, 760, 560, 520, 30, 2), { wash: N.coat, ink: PAL.ink, sw: 1.4 }); inkLine([[960, 300], [960, 1100]], 1.2, N.coatDk, 'ink', 0);
      const k = seg(lt, a + 2.5, a + 3.2); boilSeed('print');
      paint(ellPts(1060, 560, 70 * k + 1, 80 * k + 1, 16), { wash: '#E6F0FF', washOp: 200, ink: null });
      for (let i = 0; i < 4; i++) paint(ribbon([[1040 + i * 26, 500], [1030 + i * 30, 420 - Math.abs(i - 1.5) * 12]], 20 * k + 1, 14 * k + 1), { wash: '#E6F0FF', washOp: 200, ink: null });
      paint(ribbon([[990, 560], [940, 500]], 22 * k + 1, 16 * k + 1), { wash: '#E6F0FF', washOp: 200, ink: null });
    }
    rain(t, 30, '#5E6E90', 'r11');
    camEnd(); fadeIn(lt);
  }
  // 12. Dawn: a tea stall past the ghat
  function s12(t, lt, dur) {
    camBegin(960, 540, 1.0 + .03 * lt);
    skyWash('sky12', N.dawnSky, N.dawn);
    glow(1600, 600, 400, '#FFD28A', .55);
    boilSeed('stall'); paint(rectPts(300, 420, 900, 440), { wash: '#7A5A3A', ink: PAL.ink, sw: 1.2 }); paint([[240, 440], [1260, 440], [1180, 340], [320, 340]], { wash: '#3E6A5A', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(340, 640, 820, 40), { wash: '#5A3E2C', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 4; i++) { boilSeed('glass' + i); const x = 460 + i * 90; paint(rectPts(x, 590, 40, 52), { wash: '#E8C48A', ink: PAL.ink, sw: .6 }); for (let s = 0; s < 2; s++) { const k = frac(t * .5 + i * .3 + s * .5); inkLine([[x + 20, 580 - k * 80], [x + 30 + 10 * Math.sin(t * 3 + i), 540 - k * 80]], .8, '#F3EFE6', 'inkfine', .5); } }
    boilSeed('g12'); paint(rectPts(-300, 860, W + 600, 400), { wash: '#5A6E4A', ink: null });
    person(1000, 870, 20, { key: 'teaman', skin: '#8A5634', shirt: '#E8E0C8', lower: 'mundu', hairStyle: 'bald', hair: '#B9B2AE', stache: 'big', stacheCol: '#E8E0C8', flip: true, eyes: 'dot', mouth: 'flat', armF: .6, armB: .2 });
    bike(1550, 900, .7, { light: 0 });
    person(1380, 900, 20, HERO({ eyes: 'dot', mouth: 'o', armF: 1.0, bendF: -.6, armB: .4 }));
    camEnd();
    if (lt < .8) flash(1 - easeOut(lt / .8), '#FFF6E0');
  }
  // 13. "White shirt? That's Raju. He died on that bend ten years ago."
  function s13(t, lt, dur) {
    camBegin(960, 540, 1.0 + .05 * lt);
    skyWash('sky13', N.dawnSky, N.dawn);
    boilSeed('st13'); paint(rectPts(-300, 300, W + 600, 900), { wash: '#7A5A3A', ink: null });
    face(820, 520, 260, { skin: '#8A5634', hair: '#B9B2AE', shirt: '#E8E0C8', bald: true, stache: '#E8E0C8', key: 'tm13' });
    camEnd(); fadeIn(lt, .3);
  }
  // 14. "He never hurts anyone. He rides along so no one else falls."
  function s14(t, lt, dur) {
    camBegin(960, 560, 1.05);
    hills(t, 0, 'h14');
    boilSeed('road14'); paint(rectPts(-300, 860, W + 600, 400), { wash: N.road, ink: null });
    streetlight(1150, 880, 520, t, 'sl14');
    guardrail(-300, W + 300, 870, null, 'gr14');
    glow(1220, 600, 200, '#DDE6FF', .25 + .05 * Math.sin(t * 2));
    person(1220, 890, 20, RAJU({ flip: true, eyes: 'dot', mouth: 'smile', armF: .1, armB: .1 }));
    for (let i = 0; i < 3; i++) { const k = frac(lt * .35 + i / 3), x = lerp(-300, W + 300, k); glow(x, 900, 90, N.head, .6); }
    fog(t, 700, .8);
    camEnd();
    flash(.2, '#3A4A7A'); fadeIn(lt);
  }
  // 15. That night he saved my life. Would you stop?
  function s15(t, lt, dur) {
    const [a, b] = L(14), black = dur - 1.2;
    camBegin(1100, 560, 1.0 + .05 * lt);
    hills(t, 0, 'h15');
    boilSeed('road15'); paint(rectPts(-300, 860, W + 600, 400), { wash: N.road, ink: null });
    streetlight(1300, 880, 520, t, 'sl15');
    boilSeed('sign15'); paint(rectPts(1560, 640, 140, 120), { wash: '#E8C84A', ink: PAL.ink, sw: 1 }); paint(rectPts(1624, 760, 12, 120), { wash: '#3A3640', ink: null }); letter('9', 1630, 700, 80, PAL.ink);
    const wave = lt > b - 2.6;
    person(1360, 890, 20, RAJU({ flip: true, armF: wave ? 2.6 + .2 * Math.sin(lt * 6) : .1, bendF: -.2, armB: .1 }));
    rain(t, 40); fog(t, 680, 1);
    camEnd(); fadeIn(lt);
    if (lt > black) flash(easeIn(seg(lt, black, black + .7)), N.black);
  }

  // a flat base colour under every shot: p5.brush can drop a wash that covers the whole frame, leaving paper showing
  const BASE = [N.sky, N.sky, N.sky, N.sky, N.sky, '#10142A', '#10142A', N.sky, N.sky, N.sky, '#10142A', N.dawnSky, N.dawnSky, N.sky, N.sky];
  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], (t, lt, dur) => { base(BASE[i]); f(t, lt, dur); }]));
})();
