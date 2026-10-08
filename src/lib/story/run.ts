/** "We run it": live quality and cost lines, a drift caught and tuned, then a handover. One loop is a quality drift, the next a cost spike. */
import { C, back, clamp, el, header, icons, mono, op, out, pill, runLoop, setup, text, win, at as move } from "./kit";

const LOOP = 14, W = 420, H = 440, N = 48, SPAN = 5.6;
const PH = [["Watch quality and cost", "Live, on every task."], ["Spot drift early", "Before your customers do."], ["Tune what drifts", "A small change, then measured."], ["Hand it over", "Documentation your team can own."]];
const V = [
  { key: 0, alert: "Quality drift", log: ["prompt v14 → v15", "+40 new real cases", "quality back above 90%"], sum: "Drift caught, tuned, documented. Yours to run." },
  { key: 1, alert: "Cost spike", log: ["cap on long inputs", "cheaper model for sorting", "cost back under $0.05"], sum: "Spike capped, tuned, documented. Yours to run." },
];
// the two series, as functions of loop time s: quality (0..1) and cost per task (dollars)
const dip = (s: number, d: number) => d * out(clamp((s - 4.4) / 2.0)) * (1 - out(clamp((s - 8.3) / 1.5)));
const quality = (s: number, k: number) => 0.945 + 0.006 * Math.sin(s * 7) - (k === 0 ? dip(s, 0.15) : 0);
const cost = (s: number, k: number) => 0.03 + 0.0012 * Math.sin(s * 5 + 1) + (k === 1 ? dip(s, 0.034) : 0);

export function mountRun(svg: SVGSVGElement, reduced: boolean, frozen?: number) {
  setup(svg, W, H);
  const head = header(svg, W);
  let variant = 0, lastCycle = -1;

  const chart = (y: number, h: number, label: string, ic: typeof icons.target, lo: number, hi: number, thr: number, above: boolean, fmt: (v: number) => string) => {
    const g = el("g", {}, svg), top = y + 32, bot = y + h - 10, X0 = 26, X1 = 394;
    el("rect", { x: 14, y, width: 392, height: h, rx: 14, fill: C.card, stroke: C.line, "stroke-width": 1.3 }, g);
    ic(g, 32, y + 17, C.mute); text(g, 44, y + 20.5, label, 10.5, C.mute, 400, "start", mono);
    const val = text(g, 394, y + 23, "", 18, C.text, 700, "end");
    const Yv = (v: number) => bot - ((v - lo) / (hi - lo)) * (bot - top), ty = Yv(thr);
    el("path", { d: `M${X0} ${ty} H${X1}`, stroke: C.mute, "stroke-width": 1, "stroke-dasharray": "3 4", fill: "none", opacity: 0.7 }, g);
    const line = el("path", { fill: "none", stroke: C.cyan, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
    const bad = el("path", { fill: "none", stroke: C.amber, "stroke-width": 2.4, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
    const dotp = el("circle", { r: 4, fill: C.cyan }, g);
    const tag = el("g", {}, g);
    return { g, Yv, X0, X1, val, line, bad, dotp, tag, thr, above, fmt, ty };
  };
  const q = chart(84, 106, "QUALITY", icons.target, 0.78, 0.98, 0.9, false, (v) => `${Math.round(v * 100)}%`);
  const c = chart(200, 86, "COST PER TASK", icons.coin, 0, 0.075, 0.05, true, (v) => `$${v.toFixed(2)}`);

  const lower = el("g", {}, svg), LY = 300;
  const logg = el("g", {}, lower), hand = el("g", {}, lower);
  const logBox = el("rect", { x: 14, y: LY, width: 392, height: 60, rx: 14, fill: C.card, stroke: C.line, "stroke-width": 1.3 }, logg);
  const logLines = [0, 1, 2].map((i) => text(logg, 30, LY + 20 + i * 15, "", 11, C.text, 400, "start", mono));
  el("rect", { x: 14, y: LY, width: 392, height: 60, rx: 14, fill: C.card, stroke: C.line, "stroke-width": 1.3 }, hand);
  ["Runbook", "Dashboards", "Playbook"].forEach((n, i) => { const g = el("g", {}, hand); pill(g, 26 + i * 122, LY + 8, 112, 26, C.cyan, n, icons.doc); });
  [0, 1, 2].forEach((i) => { el("circle", { cx: 38 + i * 14, cy: LY + 46, r: 7.5, fill: C.card2, stroke: C.cyan, "stroke-width": 1.2 }, hand); });
  text(hand, 80, LY + 50, "Your team owns it", 11.5, C.mute, 500);

  const sum = el("g", {}, svg), SY = 376;
  const sbox = el("rect", { x: 14, y: SY, width: 392, height: 44, rx: 14, fill: C.card, stroke: C.green, "stroke-width": 1.5 }, sum);
  const sico = el("g", {}, sum), stx = text(sum, 50, SY + 26.5, "", 13, C.text, 600);
  el("circle", { cx: 32, cy: SY + 22, r: 10, fill: "none", stroke: C.green, "stroke-width": 1.6 }, sico); icons.check(sico, 32, SY + 22, C.green);

  const plot = (ch: ReturnType<typeof chart>, t: number, fn: (s: number) => number, vis: number) => {
    const pts: [number, number, boolean][] = [];
    for (let i = 0; i < N; i++) {
      const s = t - SPAN + (SPAN * i) / (N - 1), v = fn(s), x = ch.X0 + ((ch.X1 - ch.X0) * i) / (N - 1);
      pts.push([x, ch.Yv(v), ch.above ? v > ch.thr : v < ch.thr]);
    }
    ch.line.setAttribute("d", "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L"));
    let d = "", run = false;
    pts.forEach((p, i) => { if (p[2]) { d += `${run ? " L" : " M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`; run = true; } else run = false; void i; });
    ch.bad.setAttribute("d", d);
    const last = pts[N - 1], now = fn(t);
    ch.dotp.setAttribute("cx", String(last[0])); ch.dotp.setAttribute("cy", String(last[1]));
    ch.dotp.setAttribute("fill", last[2] ? C.amber : C.cyan);
    ch.val.textContent = ch.fmt(now); ch.val.setAttribute("fill", last[2] ? C.amber : C.text);
    op(ch.line, vis); op(ch.bad, vis); op(ch.dotp, vis);
  };

  const draw = (t: number, cycle: number) => {
    if (cycle !== lastCycle) { lastCycle = cycle; variant = cycle % 2; }
    const v = V[variant], fade = 1 - out(win(t, 13, 0.9)), start = out(win(t, 0, 0.5));
    const ph = t < 4 ? 0 : t < 7.5 ? 1 : t < 10.5 ? 2 : 3;
    head.set(ph, PH[ph][0], PH[ph][1], start * fade);
    const e0 = out(win(t, 0.5, 0.8)), e1 = out(win(t, 0.8, 0.8));
    move(q.g, 0, (1 - e0) * 14); op(q.g, e0 * fade); move(c.g, 0, (1 - e1) * 14); op(c.g, e1 * fade);
    plot(q, t, (s) => quality(s, v.key), out(win(t, 1.2, 1)) * fade);
    plot(c, t, (s) => cost(s, v.key), out(win(t, 1.4, 1)) * fade);
    // the alert on the chart that is drifting: drift -> tuning -> back to normal
    const ch = v.key === 0 ? q : c, other = v.key === 0 ? c : q;
    ch.tag.replaceChildren(); other.tag.replaceChildren();
    const stage = t < 5.4 ? -1 : t < 8.3 ? 0 : t < 10.2 ? 1 : 2, col = [C.amber, C.cyan, C.green][stage] ?? C.amber;
    if (stage >= 0) {
      const ae = back(win(t, stage === 0 ? 5.4 : stage === 1 ? 8.3 : 10.2, 0.5));
      const g = pill(ch.tag, 150, (v.key === 0 ? 84 : 200) + 7, 150, 24, col, stage === 0 ? v.alert : stage === 1 ? "Tuning…" : "Back to normal", stage === 0 ? icons.alert : stage === 1 ? icons.bolt : icons.check);
      move(g, (1 - clamp(ae)) * 10, 0); op(g, clamp(ae) * fade);
    }
    // below: the tuning log, then the handover
    const le = out(win(t, 8.0, 0.6)) * (1 - out(win(t, 10.6, 0.5))), he = out(win(t, 10.9, 0.6));
    op(logg, le * fade); op(hand, he * fade);
    v.log.forEach((l, i) => { const k = out(win(t, 8.3 + 0.55 * i, 0.4)); logLines[i].textContent = (k > 0 ? "› " : "") + l; op(logLines[i], k); });
    void logBox;
    const se = back(win(t, 11.4, 0.7));
    move(sum, 0, (1 - clamp(se)) * 12); op(sum, clamp(se) * fade); stx.textContent = v.sum; sbox.setAttribute("stroke", C.green);
  };
  return runLoop(svg, draw, { loop: LOOP, reduced, frozen, rest: 12.6 });
}
