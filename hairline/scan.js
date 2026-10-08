/**
 * Scan: three plates stand apart: the workflow (steps and links), the data (a field of pillars) and the constraints
 * (three gates, each narrower). A bright scan line sweeps each in turn, top to bottom, and what it passes comes alive:
 * links draw, steps rise, the field swells into a skyline, the gates stand up. The plates then close into one stack and
 * a verdict rises from it: a chip (AI fit) or a rule stack (rules, not AI), alternating, both bright. Then it opens again.
 * No pointer; the read-out announces only the verdict. The slider is the cycle, in seconds.
 *
 * The pattern: ambient. One clock of its own on the shared loop, eased progress per part, staggered by position.
 */
const { Cam, EASE_LIFT: ease, clamp, facing, fit, lerp, open, poly, prism, proj, put, reducedMotion, register, rings, ringAt,
  rrect, solid, disposer, flatDot, place, mk, pointer } = HL;

const LOOP = 14, W = 80, D = 56, ZE = [0, 42, 84], ZM = [26, 33, 40], SW = [6.4, 4.2, 2.0];
const NODES = [[10, 36, 0], [24, 16, 0], [24, 46, 0], [42, 30, 1], [58, 14, 0], [58, 46, 0], [70, 30, 1]];
const EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]];
const GATES = [[24, 11, 18], [44, 8, 14], [64, 5, 10]];
const none = { sil: "", crease: "" };
const prog = (t, s, d) => ease(clamp((t - s) / d, 0, 1));
const stag = (L, u) => ease(clamp((L - u * 0.55) / 0.45, 0, 1)); // a part's own progress when its layer is lit to L

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, -2], [W, 0, -2], [0, D, -2], [W, D, -2], [0, 0, ZE[2] + 16], [W, D, ZE[2] + 16]], 200, 166);
  const P = proj(C), front = facing(C), pt = (x, y, z) => P(x, y, z).map((n) => n.toFixed(1));
  let speed = LOOP / value, T = 0, variant = performance.now() % 2000 < 1000 ? 0 : 1, lastCycle = 0, said = null, scanOn = 2;
  const root = mk("g", {}, svg), part = (grp, x0, y0, x1, y1, r, b) => ({ s: solid(grp), rb: rings(x0, y0, x1, y1, r, b) });
  const set = (p, z0, z1) => {
    const k = z0.toFixed(2) + z1.toFixed(2);
    if (p.k === k) return;
    p.k = k;
    z1 - z0 < 0.12 ? put(p.s, none) : put(p.s, prism(P, front, p.rb[0], p.rb[1], z0, z1));
  };

  // dashed guide rods at two corners, painted first so each plate covers what it should
  const rods = [0, 1, 2, 3].map(() => mk("path", { class: "nf dash" }, root));
  // the three plates, bottom to top; each holds its parts painted back to front
  const lay = [0, 1, 2].map((k) => { const g = mk("g", {}, root); return { g, plate: part(g, 0, 0, W, D, 7, 1.8), items: [] }; });
  const wf = lay[2], dt = lay[1], cs = lay[0];
  const edges = EDGES.map(() => mk("path", { class: "nf" }, wf.g));
  const eye = flatDot(wf.g, C, 1.3, "dot"), pk = [0, 1, 2, 3].map((i) => flatDot(wf.g, C, 0.8, "dot m"));
  NODES.slice().sort((a, b) => a[0] + a[1] - b[0] - b[1]).forEach(([x, y, sq], i) => {
    const h = sq ? 4.5 : 3.5;
    wf.items.push({ p: part(wf.g, x - h, y - h, x + h, y + h, sq ? 2 : h, 1), u: x / W, kind: "node" });
  });
  const pill = [];
  for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) pill.push([12 + i * 10, 18 + j * 10, i, j]);
  pill.sort((a, b) => a[0] + a[1] - b[0] - b[1]).forEach(([x, y, i, j]) =>
    dt.items.push({ p: part(dt.g, x - 2.5, y - 2.5, x + 2.5, y + 2.5, 1.2, 0.5), u: x / W, kind: "pillar", lo: 1.2 + ((i + j) % 3) * 0.5, hi: 2.5 + (7 * ((i * 2 + j * 3) % 6)) / 5 }));
  const lane = mk("path", { class: "nf dash" }, cs.g);
  GATES.forEach(([x, hw, h], k) => {
    const pl = (y) => part(cs.g, x - 1.5, y - 1.5, x + 1.5, y + 1.5, 0.8, 0.5);
    cs.items.push({ p: pl(36 - hw), u: x / W, kind: "post", h }, { p: pl(36 + hw), u: x / W, kind: "post", h },
      { p: part(cs.g, x - 1.5, 36 - hw - 1.5, x + 1.5, 36 + hw + 1.5, 0.8, 0.5), u: x / W, kind: "lintel", h },
      { p: part(cs.g, x - 1, 36 - hw, x + 1, 36 - hw + (k === 1 ? 6 : 0.4), 0.4, 0.3), u: x / W, kind: "latch", h });
  });

  // the scan line and its frame, and the verdict, painted above the plates they belong to
  const scan = mk("g", {}, root), frame = mk("path", { class: "nf hi" }, scan), bar = mk("path", { class: "nf hi" }, scan);
  const vg = mk("g", {}, root), chip = [part(vg, 25, 15, 55, 41, 4, 1.2), part(vg, 31, 20, 49, 36, 2, 0.7)], pins = [];
  for (let k = 0; k < 6; k++) pins.push(flatDot(vg, C, 0.7, "dot m"));
  const led = [0, 1, 2].map((k) => part(vg, 22 + k * 2, 14 + k * 2, 56 + k * 2 - 4, 40 + k * 2 - 4, 3.5, 1.2));
  const rules = mk("path", { class: "nf lo" }, vg);

  function draw(t) {
    const m = prog(t, 8, 1.4) * (1 - prog(t, 12.2, 1.2)), LZ = ZE.map((z, k) => lerp(z, ZM[k], m));
    const Lk = SW.map((s) => clamp((t - s) / 1.6, 0, 1) * (1 - clamp((t - 12) / 1.3, 0, 1)));
    lay.forEach((l, k) => set(l.plate, LZ[k] - 2, LZ[k]));
    lane.setAttribute("d", open([P(2, 36, LZ[0]), P(78, 36, LZ[0])]));
    // workflow: links draw from the node they leave, steps rise as the line passes
    EDGES.forEach(([a, b], i) => {
      const f = stag(Lk[2], (NODES[a][0] + 4) / W), [x0, y0] = NODES[a], [x1, y1] = NODES[b];
      edges[i].setAttribute("d", f < 0.02 ? "" : open([P(x0, y0, LZ[2]), P(lerp(x0, x1, f), lerp(y0, y1, f), LZ[2])]));
    });
    lay.forEach((l, k) => l.items.forEach((it) => {
      const e = stag(Lk[k], it.u), z = LZ[k];
      if (it.kind === "node") set(it.p, z, z + 3 + 3 * e);
      else if (it.kind === "pillar") set(it.p, z, z + lerp(it.lo, it.hi, e));
      else {
        const h = it.h * e;
        set(it.p, it.kind === "lintel" ? (h < 4 ? z : z + h - 3) : z + (it.kind === "latch" ? h * 0.42 : 0), it.kind === "latch" ? (h < 6 ? z : z + h * 0.42 + 2) : it.kind === "post" ? z + Math.max(1.3, h) : h < 0.5 ? z : z + h);
      }
    }));
    // guide rods between the plates, and data packets running the workflow's links while it is lit
    [[0, D], [W, 0]].forEach(([x, y], i) => [0, 1].forEach((g) => rods[i * 2 + g].setAttribute("d", open([P(x, y, LZ[g] + 0.2), P(x, y, LZ[g + 1] - 2)]))));
    const route = [[0, 1, 3, 4, 6], [0, 2, 3, 5, 6]];
    pk.forEach((el, i) => {
      const r = route[i % 2], u = ((t * 0.32 + i * 0.25) % 1) * 4, h = Math.min(3, Math.floor(u)), f = u - h, a = NODES[r[h]], b = NODES[r[h + 1]];
      place(el, P(lerp(a[0], b[0], f), lerp(a[1], b[1], f), LZ[2] + 0.4));
      el.setAttribute("r", Lk[2] > 0.95 && m < 0.5 ? 0.8 : 0);
    });
    // the scan line: descends to each plate in turn, sweeps across it, then closes
    const tk = [0, 1, 3.4, 4.2, 5.6, 6.4, 7.8], zk = [ZE[2] + 14, ZE[2] + 3, ZE[2] + 3, ZE[1] + 3, ZE[1] + 3, ZE[0] + 3, ZE[0] + 3];
    let zs = zk[6], on = t > 0.9 && t < 7.9;
    for (let i = 0; i < 6; i++) if (t < tk[i + 1]) { zs = lerp(zk[i], zk[i + 1], ease(clamp((t - tk[i]) / (tk[i + 1] - tk[i]), 0, 1))); break; }
    const k = t < 3.8 ? 2 : t < 6 ? 1 : 0, bx = clamp(Lk[k] * (t < 7.9 ? 1 : 0), 0, 1) * W;
    if (k !== scanOn) { scanOn = k; lay[k].g.after(scan); }
    frame.setAttribute("d", on ? poly(ringAt(P, rrect(0, 0, W, D, 7, 5), zs)) : "");
    bar.setAttribute("d", on && bx > 1 ? open([P(bx, 0, zs), P(bx, D, zs)]) : "");
    eye.setAttribute("class", t > 0.9 && t < 12 ? "dot off" : "dot");
    place(eye, P(NODES[0][0], NODES[0][1], LZ[2] + 6.5));
    // the verdict: a chip, or a stack of rule plates, rising from the closed stack
    const v = prog(t, 9.4, 1.1) * (1 - prog(t, 12, 0.9)), a = variant === 0 ? v : 0, b = variant === 1 ? v : 0, z = LZ[2];
    set(chip[0], z, z + 7 * a); set(chip[1], z + 7 * a, z + 10 * a);
    chip.forEach((c) => c.s.sil.classList.toggle("hi", a > 0.5));
    pins.forEach((el, i) => place(el, P(i < 3 ? 25 : 55, 21 + (i % 3) * 7, z + 3.5 * a)));
    led.forEach((l, i) => { set(l, z + i * 3.6 * b, z + (i * 3.6 + 2.6) * b); l.s.sil.classList.toggle("hi", b > 0.5 && i === 2); });
    const top = z + 9.6 * b;
    rules.setAttribute("d", b < 0.5 ? "" : [0, 1, 2].map((i) => `M${pt(31, 22 + i * 5, top)}L${pt(49, 22 + i * 5, top)}`).join(""));
    const word = t >= 9.8 && t < 12 ? (variant === 0 ? "AI FIT" : "RULES, NOT AI") : "rest"; // only the verdict is announced
    if (word !== said) { said = word; read.textContent = word; }
  }

  const reduced = reducedMotion();
  const B = register(stage, (dt) => {
    if (reduced) { draw(10.4); return false; }
    T += Math.min(dt, 0.1) * speed;
    const cycle = Math.floor(T / LOOP);
    if (cycle !== lastCycle) { lastCycle = cycle; variant = 1 - variant; }
    draw(T % LOOP);
    return true;
  });
  bag.add(B.unregister);
  // The brief asks for no pointer response. The engine requires a listener, so this one answers nothing.
  bag.add(pointer(stage, { move() {}, leave() {} }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { speed = LOOP / v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "scan",
  means: "A scan line sweeps the workflow, the data and the constraints; they close into a stack that resolves to a verdict.",
  rules: [4, 5, 6, 7],
  range: [18, 14, 11],
  mount,
});
