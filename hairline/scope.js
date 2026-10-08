/**
 * Scope: a miniature plate where a messy process becomes a decision, on its own, in 13 seconds. Six scattered
 * steps (three round sources, two square steps, one join) slide into a flow, lines draw between them and data blocks
 * run through. Three gates rise, each narrower than the last; two provisional dashed paths retract. A verdict then
 * lands on the target pad: a chip (AI fit) or a stack of rule plates (rules, not AI), alternating by cycle, both
 * bright. Everything dissolves back. No pointer; the read-out announces only the verdict. The slider is the cycle, in seconds.
 *
 * The pattern: ambient. One clock of its own on the shared loop, springs nowhere, eased progress per part, and a
 * paint order that is re-sorted when parts pass each other.
 */
const { Cam, EASE_LIFT: ease, clamp, facing, fit, lerp, open, poly, prism, proj, put, reducedMotion, register, rings, ringAt,
  rrect, solid, disposer, flatDot, place, mk, pointer } = HL;

const LOOP = 13, PAD = [134, 50];
const ST = [[12, 18], [12, 50], [12, 84], [36, 34], [36, 66], [58, 50]];
const SC = [[14, 34], [44, 10], [44, 70], [26, 94], [78, 24], [124, 84]];
const SZ = [9, 9, 9, 10, 10, 12], H0 = [10, 4, 8, 5, 11, 7], H1 = [6, 6, 6, 7, 7, 11];
const MAIN = [[0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]], EXTRA = [[0, 4], [2, 3]];
const GX = [78, 96, 114], GW = [13, 10, 7], GH = [24, 19, 14];
const ROUTES = [[0, 3], [1, 3], [1, 4], [2, 4], [0, 3]];
const prog = (t, s, d) => ease(clamp((t - s) / d, 0, 1));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.86);
  fit(C, [[-6, -6, -5], [152, -6, 0], [-6, 106, 0], [152, 106, 0], [78, 50, 26], [134, 50, 14]], 200, 168);
  const P = proj(C), front = facing(C);
  let speed = LOOP / value, T = 0, variant = performance.now() % 2000 < 1000 ? 0 : 1, lastCycle = 0, said = null;

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, 152, 106, 9, 2.2);
  put(solid(g), prism(P, front, pr, pi, -5, 0));
  const flat = mk("g", {}, g);
  mk("path", { d: poly(ringAt(P, rrect(123, 39, 145, 61, 4, 5), 0)), class: "nf dash" }, flat);
  const eye = flatDot(flat, C, 1.3, "dot");
  place(eye, P(PAD[0], PAD[1], 0));
  const lines = [...MAIN, ...EXTRA].map((e, k) => ({ e, k, el: mk("path", { class: k < MAIN.length ? "nf lo" : "nf lo dash" }, flat) }));
  const last = { e: [5, -1], el: mk("path", { class: "nf lo" }, flat) };

  // every part that stands on the plate lives in the one painted-in-order list
  const items = [];
  const add = (key) => { const grp = mk("g", {}, g); const it = { grp, key: 0, s: [] }; items.push(it); return it; };
  const part = (it) => { const s = solid(it.grp); it.s.push(s); return s; };
  const nodes = ST.map((_, i) => { const it = add(); part(it); it.dot = flatDot(it.grp, C, 0.8, i === 5 ? "dot m" : "dot off"); return it; });
  const gates = GX.map((_, k) => { const it = add(); for (let j = 0; j < 4; j++) part(it); return it; });
  const blocks = ROUTES.map(() => { const it = add(); part(it); return it; });
  const chip = add(), pins = []; part(chip); part(chip);
  for (let k = 0; k < 4; k++) pins.push(flatDot(chip.grp, C, 0.7, "dot m"));
  const ledger = add(); [0, 1, 2].forEach(() => part(ledger));
  const rules = mk("path", { class: "nf lo" }, ledger.grp);

  const none = { sil: "", crease: "" };
  const box = (it, i, x0, y0, x1, y1, r, b, z0, z1) => {
    if (z1 - z0 < 0.12) return put(it.s[i], none);
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    put(it.s[i], prism(P, front, ring, inner, z0, z1));
  };

  function draw(t, cycle) {
    const pos = ST.map((s, i) => {
      const m = prog(t, 1 + 0.1 * i, 1.6) * (1 - prog(t, 10.8 + 0.1 * i, 1.5));
      return { x: lerp(SC[i][0], s[0], m), y: lerp(SC[i][1], s[1], m), h: lerp(H0[i], H1[i], m) };
    });
    nodes.forEach((it, i) => {
      const { x, y, h } = pos[i], w = SZ[i] / 2;
      box(it, 0, x - w, y - w, x + w, y + w, i < 3 ? w : 2.4, 1, 0, h);
      place(it.dot, P(x, y, h));
      it.key = x + y;
    });
    // lines: drawn from the first node toward the second, and withdrawn from the end they came
    const seg2 = (a, b, f) => (f < 0.01 ? "" : open([P(a.x, a.y, 0), P(lerp(a.x, b.x, f), lerp(a.y, b.y, f), 0)]));
    lines.forEach(({ e, k, el }) => {
      const main = k < MAIN.length;
      const f = main ? prog(t, 1.9 + 0.15 * k, 1.1) * (1 - prog(t, 10.6 + 0.1 * k, 1)) : prog(t, 2.2 + 0.2 * (k - 6), 1) * (1 - prog(t, 6 + 0.2 * (k - 6), 1.4));
      el.setAttribute("d", seg2(pos[e[0]], pos[e[1]], f));
    });
    last.el.setAttribute("d", seg2(pos[5], { x: PAD[0], y: PAD[1] }, prog(t, 3, 1.4) * (1 - prog(t, 10.6, 1))));
    // gates: funnel frames, each narrower and lower than the one before
    gates.forEach((it, k) => {
      const e = prog(t, 4.2 + 0.45 * k, 0.9) * (1 - prog(t, 10.8 + 0.15 * k, 0.9)), h = GH[k] * e, y0 = 50 - GW[k], y1 = 50 + GW[k], x = GX[k];
      box(it, 0, x - 1.5, y0 - 1.5, x + 1.5, y0 + 1.5, 0.8, 0.5, 0, h < 0.5 ? 0 : h);
      box(it, 1, x - 1.5, y1 - 1.5, x + 1.5, y1 + 1.5, 0.8, 0.5, 0, h < 0.5 ? 0 : h);
      box(it, 2, x - 1.5, y0 - 1.5, x + 1.5, y1 + 1.5, 0.8, 0.5, h < 4 ? 0 : h - 3, h < 4 ? 0 : h);
      // the security gate carries a latch bar reaching in from one post
      box(it, 3, x - 1, y0, x + 1, y0 + (k === 1 ? 6 : 0), 0.4, 0.3, h * 0.42, h < 6 ? 0 : h * 0.42 + 2);
      it.key = x + 50;
    });
    // data blocks hop from a source to a step to the join and into the pad
    blocks.forEach((it, k) => {
      const tt = t - (3.2 + 0.85 * k), hop = Math.floor(tt / 1.15);
      if (tt < 0 || hop > 2) { box(it, 0, 0, 0, 1, 1, 0.3, 0.2, 0, 0); return; }
      const f = ease((tt % 1.15) / 1.15), way = [pos[ROUTES[k][0]], pos[ROUTES[k][1]], pos[5], { x: PAD[0], y: PAD[1] }];
      const x = lerp(way[hop].x, way[hop + 1].x, f), y = lerp(way[hop].y, way[hop + 1].y, f);
      const sc = Math.min(hop === 0 ? clamp(f * 4, 0, 1) : 1, hop === 2 ? clamp((1 - f) * 3.3, 0, 1) : 1) * 1.7;
      box(it, 0, x - sc, y - sc, x + sc, y + sc, 0.6, 0.4, 0, sc * 1.4);
      it.key = x + y;
    });
    // the verdict: a chip, or a stack of rule plates, rising on the target and taking the bright stroke
    const v = prog(t, 7.6, 1) * (1 - prog(t, 10.6, 1)), a = variant === 0 ? v : 0, b = variant === 1 ? v : 0;
    box(chip, 0, 126, 42, 142, 58, 3.2, 1, 0, 7 * a);
    box(chip, 1, 130, 46, 138, 54, 1.6, 0.6, 7 * a, 9.2 * a);
    pins.forEach((el, k) => place(el, P(126 + (k % 2) * 16, 44 + Math.floor(k / 2) * 12, 3.4 * a)));
    chip.s.forEach((s) => s.sil.classList.toggle("hi", a > 0.5));
    [0, 1, 2].forEach((k) => box(ledger, k, 123 + k * 3, 41 + k * 2, 145 - 3 + k * 3, 59 + k * 2 - 4, 3, 1, k * 3.2 * b, (k * 3.2 + 2.4) * b));
    ledger.s.forEach((s, k) => s.sil.classList.toggle("hi", b > 0.5 && k === 2));
    const top = 5.6 * b + 2.4 * b;
    rules.setAttribute("d", b < 0.5 ? "" : [0, 1, 2].map((k) => `M${P(128, 47 + k * 3.4, top).map((n) => n.toFixed(1))}L${P(138, 47 + k * 3.4, top).map((n) => n.toFixed(1))}`).join(""));
    chip.key = ledger.key = 186;
    eye.setAttribute("class", v > 0.05 ? "dot off" : "dot");
    // painted back to front: parts that passed each other swap places
    const order = items.slice().sort((p, q) => p.key - q.key);
    if (order.some((it, i) => it !== items[i])) { items.splice(0, items.length, ...order); order.forEach((it) => g.append(it.grp)); }
    const word = t >= 7.8 && t < 10.8 ? (variant === 0 ? "AI FIT" : "RULES, NOT AI") : "rest"; // only the verdict is announced
    if (word !== said) { said = word; read.textContent = word; }
  }

  const reduced = reducedMotion();
  const B = register(stage, (dt) => {
    if (reduced) { T = 9; draw(9, 0); return false; }
    T += Math.min(dt, 0.1) * speed;
    const cycle = Math.floor(T / LOOP);
    if (cycle !== lastCycle) { lastCycle = cycle; variant = 1 - variant; }
    draw(T % LOOP, cycle);
    return true;
  });
  bag.add(B.unregister);
  // The brief asks for no pointer response. The engine requires a listener, so this one answers nothing.
  bag.add(pointer(stage, { move() {}, leave() {} }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { speed = LOOP / v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "scope",
  means: "Scattered steps become a flow, pass three gates, and land on a verdict: a chip or a rule stack. Then it starts again.",
  rules: [4, 5, 7, 9],
  range: [16, 13, 10],
  mount,
});
