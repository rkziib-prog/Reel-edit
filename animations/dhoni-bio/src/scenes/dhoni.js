// dhoni.js: "From Ticket Checker to Captain Cool" (Pathira Chindhakal reel #4, biography tribute). One shot per line.
// A stylised long-haired keeper in plain kits (no team logos). Timing from dhoni_times.js (edits/dhoni-bio/timeline.py).
(() => {
  const K = {
    night: '#141A33', skyDay: '#9ED3EA', warm: '#F2C48D', field: '#5E9A48', fieldDk: '#4A7E3A', pitch: '#C9B07A',
    blue: '#2F6FB5', blueDk: '#24548A', yellow: '#F2C14E', yellowDk: '#C99A2E', gold: '#E8B23A', silver: '#C9CED6',
    coat: '#26262E', trouser: '#E2DCCD', train: '#2E4A7A', ball: '#C63B2E', black: '#0B0D18'
  };
  const MSD = (o = {}) => ({ key: 'msd', skin: '#9A6440', shirt: K.blue, lower: 'pants', lowerCol: K.blueDk, hairStyle: 'long', shoe: '#EDE6DA', ...o });
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .4, col = K.black) => { if (lt < d) flash(1 - easeOut(lt / d), col); };

  // ---------- props ----------
  function bat(x, y, u, ang = 0) { push(); translate(x, y); rotate(ang); boilSeed('bat');
    paint(rectPts(-.25 * u, -1.6 * u, .5 * u, 1.8 * u), { wash: '#3A3140', ink: PAL.ink, sw: .6 });
    paint(rrPts(-.55 * u, -6.6 * u, 1.1 * u, 5.1 * u, .3 * u), { wash: '#E8D2A0', ink: PAL.ink, sw: .8 }); pop(); }
  function gloves(x, y, u) { boilSeed('gloves'); paint(ellPts(x, y - .3 * u, .9 * u, 1.0 * u, 12), { wash: '#F2EEE4', ink: PAL.ink, sw: .7 }); paint(ellPts(x + .5 * u, y - .9 * u, .45 * u, .55 * u, 10), { wash: '#2F6FB5', ink: PAL.ink, sw: .6 }); }
  function ball(x, y, r = 12) { boilSeed('ball' + Math.round(x)); paint(ellPts(x, y, r, r, 12), { wash: K.ball, ink: PAL.ink, sw: .6 }); }
  function stumps(x, y, s, hit = -1) {  // (x, y) = ground; hit = seconds since the ball hit (bails fly)
    push(); translate(x, y); scale(s); boilSeed('stumps');
    for (let i = -1; i <= 1; i++) paint(rectPts(i * 22 - 5, -150, 10, 150), { wash: '#F2E6C8', ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 2; i++) { const k = hit < 0 ? 0 : hit, bx = -14 + i * 26 + k * (i ? 260 : -200), by = -156 - k * 300 + k * k * 500;
      push(); translate(bx, by); rotate(k * (i ? 9 : -7)); paint(rectPts(-12, -3, 24, 6), { wash: '#F2E6C8', ink: PAL.ink, sw: .5 }); pop(); }
    pop();
  }
  function trophy(x, y, s, kind, key) {
    push(); translate(x, y); scale(s); boilSeed('tro' + key);
    paint(rectPts(-60, -40, 120, 40), { wash: '#3A3140', ink: PAL.ink, sw: .8 });
    if (kind === 'cup') { paint(through([[-70, -200], [70, -200], [40, -100], [16, -60], [-16, -60], [-40, -100]], 4), { wash: K.silver, ink: PAL.ink, sw: 1 }); paint(rectPts(-12, -60, 24, 20), { wash: K.silver, ink: PAL.ink, sw: .6 }); }
    else if (kind === 'globe') { paint(through([[-24, -40], [24, -40], [40, -150], [-40, -150]], 3), { wash: K.gold, ink: PAL.ink, sw: 1 }); paint(ellPts(0, -195, 50, 50, 20), { wash: K.gold, ink: PAL.ink, sw: 1 }); inkLine([[-50, -195], [50, -195]], .7, K.yellowDk, 'inkfine', 0); }
    else { paint(rectPts(-14, -110, 28, 70), { wash: K.silver, ink: PAL.ink, sw: .8 }); paint(ellPts(0, -160, 66, 54, 20), { wash: K.silver, ink: PAL.ink, sw: 1 }); paint(ellPts(0, -160, 40, 30, 16), { wash: K.gold, ink: null }); }
    pop();
  }
  function crowd(y0, rows, t, cols, jump = 0, key = 'cr', x0 = -200, x1 = W + 200) {
    for (let r = 0; r < rows; r++) for (let i = 0; i < 30; i++) {
      const x = x0 + (x1 - x0) * (i + .5 * (r % 2)) / 30, y = y0 + r * 46, h = hash(i * 7 + r * 31);
      const dy = jump ? -Math.abs(Math.sin(t * (5 + 3 * h) + i)) * 22 * jump : 0;
      boilSeed(key + r + '_' + i); paint(ellPts(x, y + dy, 18, 20, 10, .6), { wash: cols[Math.floor(h * cols.length)], ink: null });
    }
  }
  function stadium(t, key = 'st') {
    boilSeed(key);
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: K.night, ink: null });
    for (const fx of [120, 1800]) { paint(rectPts(fx - 8, 40, 16, 420), { wash: '#3A3640', ink: null }); glow(fx, 60, 260, '#FFF4D8', .6); paint(rectPts(fx - 50, 30, 100, 40), { wash: '#FFF4D8', ink: null }); }
    paint(ellPts(W / 2, 1150, 1500, 520, 30, 3), { wash: K.field, ink: null });
  }
  function train(x, y, s, n = 3, key = 'tr') {
    for (let c = 0; c < n; c++) { push(); translate(x + c * 760 * s, y); scale(s); boilSeed(key + c);
      paint(rrPts(0, -300, 740, 270, 20), { wash: K.train, ink: PAL.ink, sw: 1.2 }); paint(rectPts(0, -120, 740, 16), { wash: '#C9A44A', ink: null });
      for (let i = 0; i < 6; i++) paint(rectPts(40 + i * 115, -260, 80, 90), { wash: '#FFD9A0', ink: PAL.ink, sw: .6 });
      for (const wx of [100, 640]) paint(ellPts(wx, -20, 34, 34, 14), { wash: '#2E2A36', ink: PAL.ink, sw: .8 }); pop(); }
  }
  function firework(x, y, k, col, key) { if (k <= 0 || k >= 1) return; boilSeed('fw' + key); glow(x, y, 220 * k, col, .8 * (1 - k));
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r0 = 60 * k, r1 = 200 * easeOut(k); inkLine([[x + Math.cos(a) * r0, y + Math.sin(a) * r0 + 40 * k * k], [x + Math.cos(a) * r1, y + Math.sin(a) * r1 + 60 * k * k]], 1.4, col, 'ink', 0); } }

  // 1. A ticket checker on a night platform; a train rushes past
  function s1(t, lt, dur) {
    camBegin(960, 540, 1.0 + .03 * lt);
    boilSeed('p1'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: K.night, ink: null });
    glow(1500, 200, 300, '#FFD9A0', .45); paint(rectPts(1490, 200, 20, 520), { wash: '#3A3640', ink: null });
    train(2100 - lt * 900, 760, .9, 4);
    boilSeed('plat'); paint(rectPts(-300, 760, W + 600, 400), { wash: '#4A4652', ink: PAL.ink, sw: 1 }); paint(rectPts(-300, 760, W + 600, 14), { wash: K.yellow, ink: null });
    person(1500, 1000, 22, MSD({ shirt: '#1A1A22', lowerCol: '#2A2A33', skin: '#2A2A33', hair: '#141018', eyes: 'dot', armF: 1.3, bendF: -.6, handF: (x, y, u) => { boilSeed('pad'); paint(rectPts(x - .4 * u, y - 1.8 * u, 1.6 * u, 2.2 * u), { wash: '#E8E0C8', ink: PAL.ink, sw: .6 }); } }));
    camEnd();
    if (lt < 1.0) flash(1 - easeOut(lt / 1.0), K.black);
  }
  // 2. 7 July 1981, Ranchi
  function s2(t, lt, dur) {
    camBegin(960, 540, 1.0 + .03 * lt);
    skyWash('sky2', K.skyDay, K.warm);
    boilSeed('g2'); paint(rectPts(-300, 800, W + 600, 400), { wash: K.field, ink: null });
    palm(260, 820, 380, .06 * Math.sin(t * 2), 'p2'); palm(1700, 820, 340, .06 * Math.sin(t * 2 + 1), 'p2b');
    boilSeed('house2'); paint(rectPts(700, 520, 520, 290), { wash: '#F1E2C0', ink: PAL.ink, sw: 1.2 }); paint([[640, 540], [1280, 540], [1150, 420], [770, 420]], { wash: C.tile, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(900, 640, 110, 170), { wash: '#6E4A30', ink: PAL.ink, sw: 1 }); paint(rectPts(760, 590, 90, 80), { wash: '#3E7F7A', ink: PAL.ink, sw: .8 });
    boilSeed('cradle'); const sw = .15 * Math.sin(t * 2.2); push(); translate(1380, 600); rotate(sw); inkLine([[0, 0], [0, 140]], 1, PAL.ink, 'inkfine', 0); paint(ellPts(0, 170, 80, 34, 16), { wash: '#C9A44A', ink: PAL.ink, sw: .9 }); paint(ellPts(10, 150, 20, 18, 10), { wash: '#B97A52', ink: PAL.ink, sw: .6 }); pop();
    boilSeed('cal'); paint(rectPts(1340, 120, 360, 240), { wash: PAL.cream, ink: PAL.ink, sw: 1.2 }); paint(rectPts(1340, 120, 360, 60), { wash: C.red, ink: null });
    letter('7 JULY', 1520, 230, 64, PAL.ink, { pop: seg(lt, L(1)[0] + .2, L(1)[0] + .6) * 3 }); letter('1981', 1520, 310, 64, C.red, { pop: seg(lt, L(1)[0] + .6, L(1)[0] + 1.0) * 3 });
    camEnd(); fadeIn(lt);
  }
  // 3. School goalkeeper; the coach points him to wicket-keeping
  function s3(t, lt, dur) {
    const [a, b] = L(2), dive = seg(lt, a + .4, a + 1.0), coach = lt > a + 2.3, glovesOn = lt > b - .9;
    camBegin(960, 560, 1.0);
    skyWash('sky3', K.skyDay, C.skyHi);
    boilSeed('g3'); paint(rectPts(-300, 760, W + 600, 500), { wash: K.field, ink: null });
    boilSeed('goal'); inkLine([[200, 860], [200, 460], [900, 460], [900, 860]], 3, '#F2EEE4', 'ink', 0);
    const bp = arcPt([1500, 860], [560, 560], 160, seg(lt, a, a + 1.0)); if (lt < a + 1.4) ball(bp[0], bp[1], 16);
    if (!coach) person(560, 870, 16, { key: 'kid', skin: '#9A6440', shirt: '#4E9A5A', lower: 'pants', lowerCol: '#2E2A36', hairStyle: 'short', rot: -1.1 * easeOut(dive), dy: -2 * Math.sin(Math.PI * dive), armF: 2.8 * dive, armB: 2.6 * dive, eyes: 'wide', mouth: 'grin' });
    else person(640, 870, 16, { key: 'kid', skin: '#9A6440', shirt: '#4E9A5A', lower: 'pants', lowerCol: '#2E2A36', hairStyle: 'short', eyes: glovesOn ? 'happy' : 'dot', mouth: 'smile', armF: glovesOn ? 1.6 : .2, bendF: -.4, handF: glovesOn ? gloves : null });
    if (coach) person(1250, 880, 19, { key: 'coach', flip: true, skin: '#8A5634', shirt: '#E8E0C8', lower: 'pants', lowerCol: '#5A5560', hairStyle: 'bald', hair: '#5A5560', stache: 'small', eyes: 'dot', mouth: 'smile', armF: 1.6, bendF: 0 });
    camEnd(); fadeIn(lt);
  }
  // 4. Ticket examiner at Kharagpur
  function s4(t, lt, dur) {
    camBegin(960, 540, 1.0 + .04 * lt);
    skyWash('sky4', '#B9D8E6', K.warm);
    train(-200, 760, .9, 4, 'tr4');
    boilSeed('plat4'); paint(rectPts(-300, 760, W + 600, 400), { wash: '#8C8A92', ink: PAL.ink, sw: 1 }); paint(rectPts(-300, 760, W + 600, 14), { wash: K.yellow, ink: null });
    boilSeed('sign'); paint(rectPts(1230, 110, 560, 130), { wash: K.yellow, ink: PAL.ink, sw: 1.4 }); for (const px of [1300, 1720]) paint(rectPts(px, 240, 14, 520), { wash: '#3A3640', ink: null });
    letter('KHARAGPUR', 1510, 178, 70, PAL.ink);
    person(1000, 1010, 24, MSD({ shirt: K.coat, lowerCol: K.trouser, shoe: '#2A2A33', eyes: 'dot', mouth: 'smile', armF: 1.4, bendF: -.6, handF: (x, y, u) => { boilSeed('pad4'); paint(rectPts(x - .4 * u, y - 1.8 * u, 1.6 * u, 2.2 * u), { wash: '#E8E0C8', ink: PAL.ink, sw: .6 }); } }));
    camEnd(); fadeIn(lt);
  }
  // 5. Tickets by day, practice at night
  function s5(t, lt, dur) {
    const night = lt > L(4)[0] + 1.6;
    camBegin(960, 540, 1.02);
    if (!night) {
      boilSeed('tin'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: C.wall, ink: null });
      for (let i = 0; i < 4; i++) { boilSeed('tw' + i); paint(rrPts(80 + i * 470, 150, 380, 300, 20), { wash: C.paddy, ink: PAL.ink, sw: 1.2 }); }
      seatBack(560, 880, 's5'); person(700, 980, 22, { key: 'pass', sit: true, skin: '#B97A52', shirt: '#E27A92', lower: 'saree', lowerCol: '#E27A92', hairStyle: 'bun', armF: 1.4, bendF: -.4, handF: (x, y, u) => { boilSeed('tk5'); paint(rectPts(x - .2 * u, y - 1.2 * u, 1.2 * u, 1.6 * u), { wash: PAL.cream, ink: PAL.ink, sw: .5 }); } });
      person(1300, 1010, 24, MSD({ flip: true, shirt: K.coat, lowerCol: K.trouser, eyes: 'dot', mouth: 'smile', armF: 1.3, bendF: -.3 }));
    } else {
      boilSeed('nnet'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: K.night, ink: null });
      glow(960, 120, 600, '#FFF4D8', .55); paint(rectPts(-300, 860, W + 600, 400), { wash: K.fieldDk, ink: null });
      for (let i = 0; i < 12; i++) inkLine([[300 + i * 110, 200], [300 + i * 110, 870]], .5, '#8C8A92', 'inkfine', 0);
      const sw2 = Math.sin(lt * 4);
      person(900, 960, 26, MSD({ shirt: '#E8E0C8', lowerCol: '#E8E0C8', eyes: 'dot', mouth: 'flat', armF: 1.2 + 1.2 * sw2, bendF: -.3, handF: (x, y, u) => bat(x, y, u, 1.2 + sw2) }));
    }
    camEnd(); fadeIn(lt); if (night && lt < L(4)[0] + 1.9) flash(1 - (lt - L(4)[0] - 1.6) / .3, K.black);
  }
  // 6. 2004 debut: run out for zero
  function s6(t, lt, dur) {
    const [a, b] = L(5), hitT = a + 3.6;
    camBegin(960, 560, 1.0 + .03 * lt);
    stadium(t, 'st6'); crowd(430, 3, t, ['#2F6FB5', '#E8E0C8', '#F2C14E', '#C63B2E'], 0, 'c6');
    boilSeed('pitch6'); paint(rectPts(-300, 860, W + 600, 60), { wash: K.pitch, ink: null });
    stumps(1500, 900, 1, lt > hitT ? lt - hitT : -1);
    const run = seg(lt, a + 1.2, hitT + .3);
    person(lerp(500, 1380, run), 920, 20, MSD({ walk: lt * 14, rot: .2, eyes: 'wide', mouth: 'O', armF: 1.2, handF: (x, y, u) => bat(x, y, u, 1.4) }));
    if (lt < hitT) { const bp = arcPt([400, 700], [1500, 820], 60, seg(lt, hitT - .7, hitT)); if (lt > hitT - .7) ball(bp[0], bp[1]); }
    if (lt > b - 1.0) letter('0', 960, 300, 260, '#F2EEE4', { pop: (lt - (b - 1.0)) * 4 });
    camEnd(); fadeIn(lt);
  }
  // 7. 148 against Pakistan: the long-haired kid from Ranchi
  function s7(t, lt, dur) {
    const [a] = L(6), shots = [a + .6, a + 1.8, a + 3.0];
    camBegin(960, 560, 1.05);
    stadium(t, 'st7'); crowd(430, 3, t, ['#2F6FB5', '#E8E0C8', '#F2C14E', '#4E9A5A'], seg(lt, a + 2, a + 3), 'c7');
    let sw = 0; for (const s of shots) sw = Math.max(sw, Math.exp(-(((lt - s) * 4) ** 2)));
    person(900, 960, 30, MSD({ hairFly: .6 + .4 * sw, eyes: 'dot', mouth: sw > .5 ? 'grin' : 'flat', armF: .6 + 2.2 * sw, bendF: -.2, handF: (x, y, u) => bat(x, y, u, .4 + 2.6 * sw) }));
    for (const s of shots) if (lt > s && lt < s + 1.2) { const p = arcPt([1100, 600], [2100, -100], 260, (lt - s) / 1.2); ball(p[0], p[1], 14); }
    letter('148', 1500, 260, 180, K.yellow, { pop: seg(lt, a + 3.6, a + 4.0) * 3 });
    camEnd(); fadeIn(lt);
  }
  // 8. 2007 T20 World Cup: a young team lifts the cup
  function s8(t, lt, dur) {
    const [a] = L(7), lift = easeOut(seg(lt, a + 3.6, a + 4.3));
    camBegin(960, 560, 1.0 + .03 * lt);
    stadium(t, 'st8'); crowd(430, 3, t, ['#2F6FB5', '#E8E0C8', '#F2C14E'], lift, 'c8');
    for (let i = 0; i < 4; i++) { const x = 360 + i * 300 + (i > 1 ? 340 : 0); person(x, 960, 19, { key: 'tm' + i, skin: ['#9A6440', '#8A5634', '#B97A52', '#A86B45'][i], shirt: K.blue, lower: 'pants', lowerCol: K.blueDk, hairStyle: i % 2 ? 'short' : 'spiky', eyes: lift > .5 ? 'happy' : 'dot', mouth: lift > .5 ? 'grin' : 'smile', armF: .3 + 2.5 * lift, armB: .2 + 2.3 * lift, dy: -Math.abs(Math.sin(lt * 7 + i)) * lift * .6, flip: i > 1 }); }
    person(960, 960, 23, MSD({ eyes: lift > .5 ? 'happy' : 'dot', mouth: 'grin', armF: .4 + 2.6 * lift, bendF: -.2 }));
    trophy(960 + 30, 960 - 23 * (12 + 6 * lift) - 40, .7, 'cup', 't8');
    for (let i = 0; i < 30 * lift; i++) { boilSeed('cf' + i); const x = hash(i) * W, y = frac(hash(i + 9) + lt * .3) * H; paint(rectPts(x, y, 10, 16), { wash: [K.yellow, '#E27A92', '#7FC3E8', PAL.cream][i % 4], ink: null }); }
    camEnd(); fadeIn(lt);
  }
  // 9. 2 April 2011, Wankhede, the World Cup final
  function s9(t, lt, dur) {
    camBegin(960, 520, 1.0 + .05 * lt);
    stadium(t, 'st9');
    crowd(330, 6, t, ['#2F6FB5', '#2F6FB5', '#E8E0C8', '#F2C14E', '#E27A92'], .3, 'c9');
    boilSeed('pitch9'); paint(rectPts(860, 760, 200, 300), { wash: K.pitch, ink: null });
    for (let i = 0; i < 20; i++) { boilSeed('fl' + i); const x = hash(i) * W, y = 330 + hash(i + 5) * 260; if (frac(lt * 2 + hash(i + 2)) < .15) glow(x, y, 30, '#FFFFFF', .7); }
    camEnd(); fadeIn(lt);
  }
  // 10. He finished it with a six: the bat twirl, fireworks
  function s10(t, lt, dur) {
    const [a] = L(9), hitT = a + .5, twirl = seg(lt, a + 1.3, a + 2.1);
    camBegin(960, 560, 1.05);
    stadium(t, 's10'); crowd(430, 3, t, ['#2F6FB5', '#E8E0C8', '#F2C14E'], seg(lt, hitT + .2, hitT + .8), 'c10');
    const sw = lt < hitT ? .5 * seg(lt, hitT - .4, hitT) : 1;
    person(900, 960, 30, MSD({ eyes: lt > hitT + .4 ? 'half' : 'dot', mouth: 'flat', armF: .6 + 2.2 * sw, bendF: -.2, handF: (x, y, u) => bat(x, y, u, .4 + 2.6 * sw + twirl * TAU) }));
    if (lt > hitT && lt < hitT + 1.4) { const p = arcPt([1100, 620], [2200, -200], 320, (lt - hitT) / 1.4); ball(p[0], p[1], 14); }
    for (let i = 0; i < 5; i++) firework(300 + i * 340, 160 + 80 * (i % 2), seg(lt, hitT + .8 + i * .35, hitT + 2.2 + i * .35), [K.yellow, '#7FC3E8', '#E27A92', PAL.cream, K.yellow][i], i);
    camEnd(); fadeIn(lt);
  }
  // 11. Three ICC trophies
  function s11(t, lt, dur) {
    const [a, b] = L(10);
    camBegin(960, 560, 1.0 + .03 * lt);
    boilSeed('bg11'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#1E2547', ink: null });
    paint(rectPts(300, 760, 1320, 80), { wash: '#3A3140', ink: PAL.ink, sw: 1 });
    [['cup', 560, a + .3], ['globe', 960, a + .9], ['ct', 1360, a + 1.6]].forEach(([k, x, t0], i) => { const g = seg(lt, t0, t0 + .5); if (g > 0) { glow(x, 560, 300, '#FFE6A0', .5 * g); trophy(x, 760, 1.4 * easeOut(g), k, 'p' + i); } });
    if (lt > b - 2.2) letter('3', 960, 200, 160, K.yellow, { pop: (lt - (b - 2.2)) * 4 });
    camEnd(); fadeIn(lt);
  }
  // 12. Five IPL titles: a yellow sea of fans, "THALA"
  function s12(t, lt, dur) {
    const [a, b] = L(11);
    camBegin(960, 540, 1.0 + .03 * lt);
    stadium(t, 's12');
    crowd(300, 7, t, [K.yellow, K.yellow, K.yellow, K.yellowDk, '#E8E0C8'], .8, 'c12');
    for (let i = 0; i < 8; i++) { boilSeed('tw12' + i); const x = 120 + i * 240, y = 300 + 60 * (i % 3) + 20 * Math.sin(t * 6 + i); paint(ribbon([[x, y], [x + 40 * Math.sin(t * 8 + i), y - 70]], 26, 18), { wash: K.yellow, ink: PAL.ink, sw: .5 }); }
    person(960, 1060, 26, MSD({ shirt: K.yellow, lowerCol: K.yellowDk, eyes: 'happy', mouth: 'smile', armF: 2.6, bendF: -.2, armB: .2 }));
    for (let i = 0; i < 5; i++) if (lt > a + .4 + i * .5) { boilSeed('cup12' + i); const x = 520 + i * 220; glow(x, 160, 70, '#FFE6A0', .5); trophy(x, 210, .45, 'cup', 'ipl' + i); }
    if (lt > b - .5) letter('THALA!', 960, 520, 150, '#FFF6D8', { pop: (lt - (b - .5)) * 4, stroke: '#3A2A10' });
    camEnd(); fadeIn(lt);
  }
  // 13. 2019 semi-final: the run out (rhymes with shot 6)
  function s13(t, lt, dur) {
    const [a, b] = L(12), hitT = a + 3.2, slow = lt > a + 2.0 ? .35 : 1;
    camBegin(1200, 600, 1.15 + .04 * lt);
    stadium(t, 's13'); crowd(430, 3, t, ['#2F6FB5', '#E8E0C8', '#1E3A6A'], 0, 'c13');
    boilSeed('pitch13'); paint(rectPts(-300, 860, W + 600, 60), { wash: K.pitch, ink: null });
    stumps(1500, 900, 1, lt > hitT ? (lt - hitT) * .5 : -1);
    const run = seg(lt, a + .8, hitT + .4), dive = seg(lt, hitT - .5, hitT + .3);
    person(lerp(700, 1400, run), 920, 20, MSD({ walk: lt * 14 * slow, rot: .2 + 1.0 * dive, eyes: 'wide', mouth: 'flat', armF: 1.4 + dive, handF: (x, y, u) => bat(x, y, u, 1.4 + dive) }));
    if (lt < hitT && lt > hitT - .9) { const bp = [lerp(2100, 1500, seg(lt, hitT - .9, hitT)), 820]; ball(bp[0], bp[1]); }
    camEnd(); fadeIn(lt);
    if (lt > hitT) flash(.35 * seg(lt, hitT, hitT + .4), '#3A4A7A');
  }
  // 14. 15 August 2020, 19:29: one Instagram post
  function s14(t, lt, dur) {
    const [a] = L(13);
    camBegin(960, 540, 1.0 + .05 * lt);
    boilSeed('room14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#141828', ink: null });
    glow(960, 540, 520, '#9FC0FF', .35);
    boilSeed('phone14'); paint(rrPts(700, 60, 520, 960, 50), { wash: '#1E1B24', ink: PAL.ink, sw: 1.4 }); paint(rrPts(730, 100, 460, 880, 30), { wash: '#F3EFE6', ink: null });
    paint(rectPts(760, 230, 400, 400), { wash: '#C9A44A', ink: null }); paint(ellPts(960, 430, 120, 120, 20), { wash: '#E8D2A0', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 4; i++) inkLine([[770, 690 + i * 44], [1140 - i * 70, 690 + i * 44]], 1.2, '#8C8A92', 'inkfine', 0);
    for (const [x, sc] of [[790, 1], [860, 1], [930, 1]]) paint(ellPts(x, 900, 18 * sc, 18 * sc, 10), { wash: '#C63B2E', ink: null });
    letter('19:29', 960, 160, 70, '#1E1B24', { pop: seg(lt, a + 2.0, a + 2.4) * 3 });
    letter('15 AUG 2020', 960, 1060 - 20, 46, '#E8E0C8', { pop: seg(lt, a + .2, a + .6) * 3 });
    camEnd(); fadeIn(lt);
  }
  // 15. From ticket checker to Captain Cool: the walk-off into the sunset
  function s15(t, lt, dur) {
    const black = dur - 1.0;
    camBegin(960, 540, 1.0 + .02 * lt);
    skyWash('sky15', '#E88A5A', '#F6C98E');
    glow(1500, 700, 420, '#FFD28A', .7);
    boilSeed('sun15'); paint(ellPts(1500, 720, 110, 110, 24), { wash: '#FFE0A0', ink: null });
    boilSeed('g15'); paint(rectPts(-300, 760, W + 600, 500), { wash: '#4A6E3A', ink: null });
    const x = lerp(500, 1250, ease(seg(lt, 0, dur - .5)));
    boilSeed('shadow15'); paint(ribbon([[x, 1000], [x - 420, 1050]], 40, 14), { wash: '#2E4A28', washOp: 200, ink: null });
    person(x, 1000, 26, MSD({ walk: lt * 6, eyes: 'half', mouth: 'smile', armF: .3, bendF: .2, handF: gloves, armB: .2 }));
    camEnd(); fadeIn(lt);
    if (lt > black) flash(easeIn(seg(lt, black, black + .7)), K.black);
  }

  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], f]));
})();
