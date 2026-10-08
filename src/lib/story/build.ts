/** "We build it": a pipeline of checks (build, tests, guardrails, security) and then a staged release. One loop catches a slowdown and fixes it. */
import { C, back, clamp, el, header, icons, lerp, mono, op, out, runLoop, setup, text, win, at as move } from "./kit";

const LOOP = 14, W = 420, H = 440;
const ROWS = [
  { title: "Build the system", ic: icons.doc, s: 0.7, d: 1.9 },
  { title: "Test on real cases", ic: icons.list, s: 3.5, d: 2.3 },
  { title: "Add guardrails", ic: icons.lock, s: 5.0, d: 1.9 },
  { title: "Review security", ic: icons.target, s: 7.2, d: 1.9 },
  { title: "Release in stages", ic: icons.bolt, s: 9.9, d: 0 },
];
const PH = [["Build it in pieces", "Small parts, each one checked."], ["Test every change", "Measured against real cases."], ["Guard and review", "Before anything touches your data."], ["Release in stages", ""]];
const V = [
  { sub: "A little at a time, with a way back.", lines: [["Released safely, stage by stage.", C.green, 11.4]] },
  { sub: "A slowdown is caught early, and fixed.", lines: [["Paused at 25%: slower than expected.", C.amber, 11.0], ["Fixed in minutes. Released safely.", C.green, 12.1]] },
];

export function mountBuild(svg: SVGSVGElement, reduced: boolean, frozen?: number) {
  setup(svg, W, H);
  const head = header(svg, W);
  const Y = (i: number) => 84 + i * 56, RX = 14, RW = 392, RH = 46;
  let variant = 0, lastCycle = -1;

  const rail = el("path", { d: `M34 ${Y(0) + 23} V${Y(4) + 23}`, stroke: C.line, "stroke-width": 1.6, "stroke-dasharray": "3 5", fill: "none" }, svg);
  const rows = ROWS.map((r, i) => {
    const g = el("g", {}, svg), y = Y(i), cy = y + RH / 2;
    el("rect", { x: RX, y, width: RW, height: RH, rx: 12, fill: C.card, stroke: C.line, "stroke-width": 1.3 }, g);
    const node = el("circle", { cx: 34, cy, r: 12, fill: C.card2, stroke: C.line, "stroke-width": 1.3 }, g);
    r.ic(g, 34, cy, C.cyan);
    text(g, 56, y + 20, r.title, 12.5, C.text, 500);
    if (i < 4) el("rect", { x: 56, y: y + 30, width: 150, height: 3, rx: 1.5, fill: C.line }, g);
    const bar = el("rect", { x: 56, y: y + 30, width: 0, height: 3, rx: 1.5, fill: C.cyan }, g);
    const metric = text(g, 354, cy + 4, "", 11, C.mute, 400, "end", mono);
    const done = el("g", {}, g); el("circle", { cx: 386, cy, r: 9, fill: "none", stroke: C.green, "stroke-width": 1.5 }, done); icons.check(done, 386, cy, C.green);
    return { g, y, cy, node, bar, metric, done };
  });
  // the staged release row: three segments that light in turn
  const stages = [0, 1, 2].map((k) => {
    const g = el("g", {}, rows[4].g), x = 222 + k * 62;
    const box = el("rect", { x, y: Y(4) + 10, width: 54, height: 26, rx: 13, fill: C.cyan, "fill-opacity": 0.04, stroke: C.line, "stroke-width": 1.3 }, g);
    const lab = text(g, x + 27, Y(4) + 27, ["5%", "25%", "100%"][k], 12, C.mute, 700, "middle");
    return { box, lab };
  });
  rows[4].bar.setAttribute("opacity", "0"); rows[4].done.setAttribute("opacity", "0");

  const sum = el("g", {}, svg), SY = 376;
  const sbox = el("rect", { x: 14, y: SY, width: 392, height: 44, rx: 14, fill: C.card, "stroke-width": 1.5 }, sum);
  const sico = el("g", {}, sum), stx = text(sum, 50, SY + 26.5, "", 13, C.text, 600);

  const draw = (t: number, cycle: number) => {
    if (cycle !== lastCycle) { lastCycle = cycle; variant = cycle % 2; }
    const v = V[variant], fade = 1 - out(win(t, 13, 0.9)), start = out(win(t, 0, 0.5));
    const ph = t < 3.4 ? 0 : t < 6.2 ? 1 : t < 9.8 ? 2 : 3;
    head.set(ph, PH[ph][0], ph === 3 ? v.sub : PH[ph][1], start * fade);
    op(rail, out(win(t, 0.8, 1)) * fade);

    rows.forEach((r, i) => {
      const e = out(win(t, 0.5 + 0.2 * i, 0.7)), spec = ROWS[i];
      move(r.g, (1 - e) * 40, 0); op(r.g, e * fade);
      if (i < 4) {
        const p = out(win(t, spec.s, spec.d)), fin = back(win(t, spec.s + spec.d, 0.4));
        r.bar.setAttribute("width", String(150 * p));
        r.node.setAttribute("stroke", fin > 0.2 ? C.green : p > 0 ? C.cyan : C.line);
        op(r.done, clamp(fin));
        r.metric.textContent = [`${Math.round(12 * p)} modules`, `${Math.round(240 * p)} cases · ${Math.round(94 * p)}% pass`, `${Math.round(12 * p)} / 12 blocked`, p < 1 ? "scanning…" : "0 critical"][i];
        r.metric.setAttribute("fill", p >= 1 ? C.text : C.mute);
      } else {
        const act = out(win(t, spec.s, 0.5));
        r.node.setAttribute("stroke", act > 0 ? C.cyan : C.line);
      }
    });
    // staged release: 5%, 25%, 100%; one loop pauses at 25% and fixes it
    stages.forEach((s, k) => {
      const on = t > 10.2 + 0.9 * k, hold = variant === 1 && k === 1 && t > 11.0 && t < 12.1;
      const col = hold ? C.amber : on ? C.green : C.line;
      s.box.setAttribute("stroke", col); s.box.setAttribute("fill", on || hold ? col : C.cyan);
      s.box.setAttribute("fill-opacity", on || hold ? "0.16" : "0.04");
      s.lab.setAttribute("fill", on || hold ? col : C.mute);
    });
    // the summary line, which can change colour mid-way
    const se = back(win(t, 10.8, 0.7));
    move(sum, 0, (1 - clamp(se)) * 12); op(sum, clamp(se) * fade);
    let line = v.lines[0];
    v.lines.forEach((l) => { if (t >= (l[2] as number)) line = l; });
    stx.textContent = line[0] as string; sbox.setAttribute("stroke", line[1] as string);
    sico.replaceChildren();
    el("circle", { cx: 32, cy: SY + 22, r: 10, fill: "none", stroke: line[1] as string, "stroke-width": 1.6 }, sico);
    (line[1] === C.amber ? icons.alert : icons.check)(sico, 32, SY + 22, line[1] as string);
    void lerp;
  };
  return runLoop(svg, draw, { loop: LOOP, reduced, frozen, rest: 12.6 });
}
