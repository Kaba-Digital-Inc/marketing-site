/** Homepage hero: requests flow into a glowing agent core, pass a guardrail gate (a person approves anything unusual), and come out done. */
import { C, back, clamp, el, icons, lerp, mono, op, out, pill, runLoop, setup, text, win } from "./kit";

const LOOP = 16, W = 460, H = 420, CX = 250, CY = 190, GX = 340;
const YS = [116, 190, 264];
const REQ = [
  { label: "Invoice query", ask: false, base: 1.2, done: "Sent", log: "09:02:11  invoice query · sent" },
  { label: "Refund $2,400", ask: true, base: 5.6, done: "Approved", log: "09:02:19  refund $2,400 · asked Maya · approved" },
  { label: "New address", ask: false, base: 10.6, done: "Sent", log: "09:02:31  new address · sent" },
];
const WORK = ["reading…", "checking policy…", "drafting…"];

export function mountHero(svg: SVGSVGElement, reduced: boolean, frozen?: number) {
  const defs = setup(svg, W, H);
  const rg = el("radialGradient", { id: "h-core" }, defs);
  el("stop", { offset: 0, "stop-color": C.cyan, "stop-opacity": 0.26 }, rg); el("stop", { offset: 1, "stop-color": C.cyan, "stop-opacity": 0 }, rg);
  el("circle", { cx: CX, cy: CY, r: 150, fill: "url(#h-core)" }, svg);

  const top = el("g", {}, svg), live = el("circle", { cx: 20, cy: 24, r: 4, fill: C.green }, top);
  text(top, 32, 28, "Support agent", 13, C.text, 600); text(top, 128, 27.5, "live", 10, C.mute, 400, "start", mono);

  // paths: each request curves into the core, and out through the gate to its result
  const inP = YS.map((y) => el("path", { d: `M138 ${y} C 168 ${y}, 168 ${CY}, ${CX - 66} ${CY}`, fill: "none", stroke: C.line, "stroke-width": 1.4, "stroke-dasharray": "2 5", "stroke-linecap": "round" }, svg));
  const outP = YS.map((y) => el("path", { d: `M${CX + 66} ${CY} C ${GX - 6} ${CY}, ${GX - 6} ${y}, 360 ${y}`, fill: "none", stroke: C.line, "stroke-width": 1.4, "stroke-dasharray": "2 5", "stroke-linecap": "round" }, svg));
  const lens = { i: inP.map((p) => p.getTotalLength()), o: outP.map((p) => p.getTotalLength()) };

  // the guardrail gate
  const gate = el("g", {}, svg), gline = el("path", { d: `M${GX} 92 V288`, stroke: C.cyan, "stroke-width": 1.6, "stroke-dasharray": "3 6", "stroke-linecap": "round", opacity: 0.55 }, gate);
  const gl = el("g", {}, gate); icons.lock(gl, GX, 300, C.cyan); text(gate, GX, 322, "guardrails", 9.5, C.mute, 400, "middle", mono);
  const maya = el("g", {}, svg); const mp = pill(maya, GX - 52, 54, 104, 28, C.amber, "Needs OK", icons.person);

  // the core: slow rings, a spinning arc, a chip
  const core = el("g", {}, svg);
  el("circle", { cx: CX, cy: CY, r: 40, fill: C.card2, stroke: C.cyan, "stroke-width": 1.6 }, core);
  const outer = el("circle", { cx: CX, cy: CY, r: 66, fill: "none", stroke: C.cyan, "stroke-width": 1.2, "stroke-dasharray": "1 9", "stroke-linecap": "round", opacity: 0.6 }, core);
  el("circle", { cx: CX, cy: CY, r: 52, fill: "none", stroke: C.line, "stroke-width": 1.4 }, core);
  const arc = (a0: number, a1: number, r: number) => { const f = (a: number) => [CX + r * Math.cos(a), CY + r * Math.sin(a)]; const [x0, y0] = f(a0), [x1, y1] = f(a1); return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`; };
  const spin = el("g", {}, core);
  [0, 2.1, 4.2].forEach((a) => el("path", { d: arc(a, a + 0.9, 52), fill: "none", stroke: C.cyan, "stroke-width": 2.6, "stroke-linecap": "round", filter: "url(#k-glow)" }, spin));
  const chip = el("g", {}, core); icons.chip(chip, CX, CY, C.cyan); chip.setAttribute("transform", `translate(${CX} ${CY}) scale(2.1) translate(${-CX} ${-CY})`);
  const status = text(svg, CX, CY + 92, "", 10.5, C.cyan, 400, "middle", mono);

  // requests in, results out
  const reqs = REQ.map((r, i) => {
    const g = el("g", {}, svg), y = YS[i] - 22;
    const box = el("rect", { x: 14, y, width: 124, height: 44, rx: 12, fill: C.card, stroke: C.line, "stroke-width": 1.3 }, g);
    icons.mail(g, 34, YS[i], C.mute); text(g, 50, YS[i] + 4.2, r.label, 11.5, C.text, 500);
    return { g, box };
  });
  const res = REQ.map((r, i) => { const g = el("g", {}, svg); pill(g, 360, YS[i] - 16, 90, 32, C.green, r.done, icons.check); return g; });
  const pk = el("circle", { r: 5, fill: C.cyan, filter: "url(#k-glow)" }, svg);

  // numbers and the last decision
  el("path", { d: "M14 350 H446", stroke: C.line, "stroke-width": 1 }, svg);
  const stat = (x: number, lab: string, v: string) => { const n = text(svg, x, 380, v, 22, C.text, 700); text(svg, x, 398, lab, 9.5, C.mute, 400, "start", mono); return n; };
  const hN = stat(14, "HANDLED TODAY", "1,281"); stat(170, "ACCURACY", "97%"); stat(316, "PER TASK", "$0.03");
  const logT = text(svg, 14, 416, "", 10, C.mute, 400, "start", mono);

  const draw = (t: number) => {
    const fade = 1 - out(win(t, 15, 0.9)), start = out(win(t, 0, 0.5));
    op(top, start * fade); op(live, 0.55 + 0.45 * Math.sin(t * 4));
    let k = -1; REQ.forEach((r, i) => { if (t >= r.base - 0.4) k = i; });
    const r = REQ[Math.max(0, k)], lt = k < 0 ? -1 : t - r.base, hold = 2.4;
    const finish = (q: (typeof REQ)[number]) => q.base + (q.ask ? 5.0 : 3.3);
    const completed = REQ.filter((q) => t >= finish(q)).length;

    // the core works while a request is inside it
    const working = lt >= 0.9 && lt < hold, speed = working ? 70 : 12;
    spin.setAttribute("transform", `rotate(${(t * speed) % 360} ${CX} ${CY})`);
    outer.setAttribute("transform", `rotate(${(-t * 6) % 360} ${CX} ${CY})`);
    op(core, start * fade);
    status.textContent = lt < 0 ? "" : lt < 0.9 ? "request in" : lt < hold ? WORK[Math.min(2, Math.floor((lt - 0.9) / 0.5))] : r.ask ? (lt < 4.2 ? "asking a person" : "approved") : "done";
    status.setAttribute("fill", r.ask && lt >= hold && lt < 4.2 ? C.amber : C.cyan); op(status, start * fade);
    op(top, start * fade);

    reqs.forEach((q, i) => {
      const e = out(win(t, 0.3 + 0.2 * i, 0.7)), act = i === k && lt >= 0, over = t >= REQ[i].base + 0.9;
      q.g.setAttribute("transform", `translate(${(1 - e) * -26} 0)`); op(q.g, e * fade * (over ? 0.5 : 1));
      q.box.setAttribute("stroke", act && !over ? C.cyan : C.line);
    });
    inP.forEach((p, i) => op(p, start * fade * (i === k && lt >= 0 && lt < 1 ? 1 : 0.5)));
    outP.forEach((p, i) => op(p, start * fade * (i === k && lt >= hold ? 1 : 0.45)));
    op(gate, start * fade);

    // the travelling packet: in, through the core, then out (held at the gate when a person must approve)
    let pos: [number, number] | null = null, col = C.cyan;
    if (lt >= 0 && lt < 0.9) { const u = out(lt / 0.9), pt = inP[k].getPointAtLength(lens.i[k] * u); pos = [pt.x, pt.y]; }
    else if (lt >= hold) {
      const stopAt = r.ask ? 0.62 : 1, goes = r.ask ? (lt < 4.2 ? out((lt - hold) / 0.9) * stopAt : stopAt + out((lt - 4.2) / 0.8) * (1 - stopAt)) : out((lt - hold) / 0.9);
      if (goes < 1 || lt < finish(r) - r.base + 0.1) { const pt = outP[k].getPointAtLength(lens.o[k] * clamp(goes)); pos = [pt.x, pt.y]; }
      if (r.ask && lt >= hold && lt < 4.2) col = C.amber;
    }
    pk.setAttribute("fill", col);
    if (pos) { pk.setAttribute("cx", String(pos[0])); pk.setAttribute("cy", String(pos[1])); }
    op(pk, pos && lt < finish(r) - r.base ? fade : 0);
    // the gate flashes as something passes; a person approves what the agent is unsure about
    const near = pos ? Math.max(0, 1 - Math.abs(pos[0] - GX) / 18) : 0;
    gline.setAttribute("opacity", String(0.45 + 0.5 * near)); gline.setAttribute("stroke", r.ask && lt >= hold && lt < 4.2 ? C.amber : C.cyan);
    const mE = back(win(lt, hold + 0.2, 0.5)) * (r.ask && lt >= hold && lt < 5.2 ? 1 : 0), approved = r.ask && lt >= 4.2;
    op(maya, clamp(mE) * fade); maya.setAttribute("transform", `translate(0 ${(1 - clamp(mE)) * 8})`);
    mp.setAttribute("opacity", "1");
    mp.querySelector("rect")?.setAttribute("stroke", approved ? C.green : C.amber); mp.querySelector("rect")?.setAttribute("fill", approved ? C.green : C.amber);
    mp.querySelectorAll("text").forEach((n) => { n.textContent = approved ? "Approved" : "Needs OK"; n.setAttribute("fill", approved ? C.green : C.amber); });
    // results pop in at the end of each request
    res.forEach((g, i) => {
      const s = back(win(t - finish(REQ[i]), 0, 0.5)); op(g, clamp(s) * fade); g.setAttribute("transform", `translate(${(1 - clamp(s)) * 12} 0)`);
    });
    hN.textContent = (1281 + completed).toLocaleString("en-US");
    let last = ""; REQ.forEach((q) => { if (t >= finish(q) + 0.2) last = q.log; });
    logT.textContent = last ? `› ${last}` : ""; op(logT, fade);
    void lerp;
  };
  return runLoop(svg, draw, { loop: LOOP, reduced, frozen, rest: 13 });
}
