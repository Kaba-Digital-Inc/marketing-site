/**
 * "We scope it" as a story you can read: a support workflow is mapped step by step, each step's data is traced,
 * a scanner tests each step on security, cost and accuracy, and each step is marked AI or plain rules.
 * One 14 second loop; it alternates between "AI fits some steps" and "rules are enough". Both end well.
 * Plain SVG driven by one clock; no dependencies. Returns a function that stops it.
 */
const NS = "http://www.w3.org/2000/svg";
export const VIEW = { w: 420, h: 440 };
const LOOP = 14;

const C = { card: "#0f1215", line: "#2a3037", text: "#e6e9ec", mute: "#8a949e", cyan: "#35d6f5", green: "#5fe3a1", amber: "#f2b35e" };
const ROWS = [
  { title: "Triage requests", data: "Inbox" },
  { title: "Look up the order", data: "Orders" },
  { title: "Draft the reply", data: "Policies" },
  { title: "Approve & send", data: "Approvals" },
];
// 0 passes, 1 needs care; order: security, cost, accuracy. A step gets AI only when all three pass.
const VARIANTS = [
  { dots: [[0, 0, 0], [0, 0, 1], [0, 0, 0], [1, 0, 0]], sum: "AI fits 2 of 4 steps. Simple rules run the rest.", tone: C.cyan, end: "Use AI where it earns its place. Plain rules elsewhere." },
  { dots: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]], sum: "Rules are enough here. Faster, cheaper, safer.", tone: C.green, end: "Plain rules do the job. No AI needed." },
];
const PHASES = [
  ["Map the workflow", "Every step, in order, as it really runs."],
  ["Trace the data", "What each step reads and needs."],
  ["Test the constraints", "Security, cost, accuracy: green passes, amber needs care."],
  ["Decide the right tool", ""],
];
const SCATTER = [[-70, -30, -8], [60, -50, 6], [-50, 40, 5], [80, 30, -6]];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const out = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const back = (x: number) => { const t = clamp(x), c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const win = (t: number, s: number, d: number) => clamp((t - s) / d);

type A = Record<string, string | number>;
function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: A, parent?: Element, text?: string) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (text != null) n.textContent = text;
  parent?.appendChild(n);
  return n;
}

export function mountScopeStory(svg: SVGSVGElement, reduced: boolean, at?: number) {
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${VIEW.w} ${VIEW.h}`);
  const defs = el("defs", {}, svg);
  const glow = el("filter", { id: "ss-glow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
  el("feGaussianBlur", { stdDeviation: 3.2, result: "b" }, glow);
  const mg = el("feMerge", {}, glow);
  el("feMergeNode", { in: "b" }, mg); el("feMergeNode", { in: "SourceGraphic" }, mg);
  const beamG = el("linearGradient", { id: "ss-beam", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: 0, "stop-color": C.cyan, "stop-opacity": 0 }, beamG);
  el("stop", { offset: 0.8, "stop-color": C.cyan, "stop-opacity": 0.22 }, beamG);
  el("stop", { offset: 1, "stop-color": C.cyan, "stop-opacity": 0.5 }, beamG);
  const font = "Inter, ui-sans-serif, system-ui, sans-serif", mono = "'IBM Plex Mono', ui-monospace, monospace";

  // header: which of the four stages we are in
  const head = el("g", {}, svg);
  const kicker = el("text", { x: 14, y: 22, fill: C.cyan, "font-size": 10.5, "font-family": mono, "letter-spacing": 1.2 }, head);
  const title = el("text", { x: 14, y: 44, fill: C.text, "font-size": 17, "font-weight": 600, "font-family": font }, head);
  const sub = el("text", { x: 14, y: 62, fill: C.mute, "font-size": 11.5, "font-family": font }, head);
  const pips = [0, 1, 2, 3].map((i) => el("circle", { cx: 336 + i * 24, cy: 20, r: 4, fill: C.line }, head));

  const Y = (i: number) => 84 + i * 68, CW = 150, CX = 146, CH = 48;
  const rows = ROWS.map((r, i) => {
    const g = el("g", {}, svg), y = Y(i), cy = y + CH / 2;
    const link = i < 3 ? el("path", { d: `M${CX + CW / 2} ${y + CH} V${Y(i + 1)}`, stroke: C.line, "stroke-width": 1.6, fill: "none", "stroke-linecap": "round" }, g) : null;
    const arrow = i < 3 ? el("path", { d: `M${CX + CW / 2 - 4} ${Y(i + 1) - 6} L${CX + CW / 2} ${Y(i + 1)} L${CX + CW / 2 + 4} ${Y(i + 1) - 6}`, stroke: C.line, "stroke-width": 1.6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g) : null;
    // data chip and its dotted line
    const dg = el("g", {}, g);
    el("rect", { x: 8, y: cy - 14, width: 98, height: 28, rx: 14, fill: C.card, stroke: C.line }, dg);
    el("ellipse", { cx: 24, cy: cy - 5, rx: 6, ry: 2.6, fill: "none", stroke: C.mute, "stroke-width": 1.2 }, dg);
    el("path", { d: `M18 ${cy - 5} V${cy + 4} A6 2.6 0 0 0 30 ${cy + 4} V${cy - 5}`, fill: "none", stroke: C.mute, "stroke-width": 1.2 }, dg);
    el("text", { x: 38, y: cy + 4, fill: C.text, "font-size": 11.5, "font-family": font }, dg, r.data);
    const dl = el("path", { d: `M106 ${cy} H${CX}`, stroke: C.mute, "stroke-width": 1.3, "stroke-dasharray": "2 4", "stroke-linecap": "round", fill: "none" }, g);
    const packets = [0, 1].map(() => el("circle", { r: 2.6, fill: C.cyan, cy }, g));
    // the step card
    const cg = el("g", {}, g), card = el("rect", { x: CX, y, width: CW, height: CH, rx: 12, fill: C.card, stroke: C.line, "stroke-width": 1.3 }, cg);
    el("circle", { cx: CX + 20, cy, r: 10, fill: "none", stroke: C.mute, "stroke-width": 1.2 }, cg);
    el("text", { x: CX + 20, y: cy + 4, "text-anchor": "middle", fill: C.text, "font-size": 11, "font-family": mono }, cg, String(i + 1));
    el("text", { x: CX + 38, y: cy + 4.5, fill: C.text, "font-size": 12.5, "font-weight": 500, "font-family": font }, cg, r.title);
    // three test dots, then the verdict badge
    const dots = [0, 1, 2].map((k) => el("circle", { cx: 310 + k * 15, cy, r: 4.6, fill: C.green }, g));
    const badge = el("g", {}, g);
    return { g, y, cy, link, arrow, dg, dl, packets, cg, card, dots, badge };
  });

  // what the three dots mean: a lock (security), a coin (cost), a target (accuracy)
  const key = el("g", {}, svg);
  const ky = 76;
  el("rect", { x: 305.5, y: ky - 2, width: 9, height: 7, rx: 1.5, fill: "none", stroke: C.mute, "stroke-width": 1.2 }, key);
  el("path", { d: `M307.5 ${ky - 2} v-2 a2.5 2.5 0 0 1 5 0 v2`, fill: "none", stroke: C.mute, "stroke-width": 1.2 }, key);
  el("circle", { cx: 325, cy: ky + 1.5, r: 4.6, fill: "none", stroke: C.mute, "stroke-width": 1.2 }, key);
  el("path", { d: `M325 ${ky - 0.8} v4.6 M323.3 ${ky + 0.2} h3.4 M323.3 ${ky + 2.9} h3.4`, fill: "none", stroke: C.mute, "stroke-width": 1 }, key);
  el("circle", { cx: 340, cy: ky + 1.5, r: 4.6, fill: "none", stroke: C.mute, "stroke-width": 1.2 }, key);
  el("circle", { cx: 340, cy: ky + 1.5, r: 1.6, fill: C.mute }, key);

  // the scanner
  const beam = el("g", {}, svg);
  el("rect", { x: 0, y: -26, width: VIEW.w, height: 26, fill: "url(#ss-beam)" }, beam);
  el("rect", { x: 0, y: -0.75, width: VIEW.w, height: 1.5, fill: C.cyan, filter: "url(#ss-glow)" }, beam);

  // the summary
  const sum = el("g", {}, svg), sy = 372;
  const sBox = el("rect", { x: 14, y: sy, width: VIEW.w - 28, height: 44, rx: 14, fill: C.card, "stroke-width": 1.5 }, sum);
  const sIcon = el("g", {}, sum), sText = el("text", { x: 50, y: sy + 26.5, fill: C.text, "font-size": 13, "font-weight": 600, "font-family": font }, sum);

  let variant = 0, lastCycle = -1;
  const paint = (k: number) => {
    const v = VARIANTS[k];
    sBox.setAttribute("stroke", v.tone);
    sText.textContent = v.sum;
    sIcon.replaceChildren();
    el("circle", { cx: 32, cy: sy + 22, r: 10, fill: "none", stroke: v.tone, "stroke-width": 1.6 }, sIcon);
    el("path", { d: `M27.5 ${sy + 22} l3.2 3.4 l6 -6.8`, fill: "none", stroke: v.tone, "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" }, sIcon);
    rows.forEach((r, i) => {
      const d = v.dots[i], ai = d.every((x) => x === 0);
      r.dots.forEach((c, j) => c.setAttribute("fill", d[j] ? C.amber : C.green));
      r.badge.replaceChildren();
      const col = ai ? C.cyan : C.green, bx = 350, by = r.cy - 14;
      el("rect", { x: bx, y: by, width: ai ? 58 : 64, height: 28, rx: 14, fill: col, "fill-opacity": 0.14, stroke: col, "stroke-width": 1.3 }, r.badge);
      if (ai) { // a chip
        el("rect", { x: bx + 10, y: by + 8, width: 12, height: 12, rx: 2.5, fill: "none", stroke: col, "stroke-width": 1.4 }, r.badge);
        [0, 1, 2].forEach((p) => { el("path", { d: `M${bx + 13 + p * 3} ${by + 5.5} v2.5 M${bx + 13 + p * 3} ${by + 20} v2.5`, stroke: col, "stroke-width": 1.1 }, r.badge); });
        el("text", { x: bx + 28, y: by + 18.5, fill: col, "font-size": 12, "font-weight": 700, "font-family": font }, r.badge, "AI");
      } else { // a checklist
        el("path", { d: `M${bx + 11} ${by + 10} h10 M${bx + 11} ${by + 14} h10 M${bx + 11} ${by + 18} h7`, stroke: col, "stroke-width": 1.4, "stroke-linecap": "round" }, r.badge);
        el("text", { x: bx + 27, y: by + 18.5, fill: col, "font-size": 12, "font-weight": 700, "font-family": font }, r.badge, "Rules");
      }
    });
  };

  function draw(T: number) {
    const t = T % LOOP, cycle = Math.floor(T / LOOP);
    if (cycle !== lastCycle) { lastCycle = cycle; variant = cycle % 2; paint(variant); }
    const v = VARIANTS[variant], fade = 1 - out(win(t, 13, 0.9)), start = out(win(t, 0, 0.5));
    const ph = t < 3.7 ? 0 : t < 6.5 ? 1 : t < 9.7 ? 2 : 3;
    kicker.textContent = `0${ph + 1} / 04`;
    title.textContent = PHASES[ph][0];
    sub.textContent = ph === 3 ? v.end : PHASES[ph][1];
    pips.forEach((p, i) => p.setAttribute("fill", i === ph ? C.cyan : C.line));
    head.setAttribute("opacity", String(start * fade));

    rows.forEach((r, i) => {
      const e = out(win(t, 0.6 + 0.3 * i, 1.1)), sc = SCATTER[i], q = 1 - e + (1 - fade) * 0.6;
      // each step flies in from a scattered spot and settles in line
      r.cg.setAttribute("transform", `translate(${sc[0] * q} ${sc[1] * q}) rotate(${sc[2] * q} ${CX + CW / 2} ${r.cy})`);
      r.cg.setAttribute("opacity", String(e * fade));
      const lk = out(win(t, 2.2 + 0.25 * i, 0.7));
      r.link?.setAttribute("stroke-dasharray", "30"); r.link?.setAttribute("stroke-dashoffset", String(30 * (1 - lk)));
      r.arrow?.setAttribute("opacity", String(lk * fade)); r.link?.setAttribute("opacity", String(fade));
      // data: the chip slides in and packets run to the step
      const de = out(win(t, 3.9 + 0.3 * i, 0.8));
      r.dg.setAttribute("transform", `translate(${-30 * (1 - de)} 0)`); r.dg.setAttribute("opacity", String(de * fade));
      r.dl.setAttribute("opacity", String(de * fade));
      r.packets.forEach((p, k) => {
        const u = (t * 0.7 + k * 0.5 + i * 0.2) % 1;
        p.setAttribute("cx", String(lerp(106, CX, u)));
        p.setAttribute("opacity", String(de * fade * (t < 12.2 ? 0.95 : 0) * Math.sin(Math.PI * u)));
      });
      // constraints: the dots pop as the scanner passes the step
      const hit = 6.9 + (r.cy - Y(0)) / (Y(3) + CH - Y(0)) * 2.2;
      r.dots.forEach((d, k) => {
        const pop = back(win(t, hit + 0.1 * k, 0.45));
        d.setAttribute("r", String(4.6 * pop)); d.setAttribute("opacity", String(fade));
      });
      // the verdict: the badge pops in and the card takes its colour
      const bt = back(win(t, 10 + 0.3 * i, 0.55)), ai = v.dots[i].every((x) => x === 0), col = ai ? C.cyan : C.green;
      r.badge.setAttribute("transform", `translate(${(1 - bt) * 8} 0)`);
      r.badge.setAttribute("opacity", String(clamp(bt) * fade));
      r.card.setAttribute("stroke", bt > 0.2 ? col : C.line);
      r.card.setAttribute("stroke-opacity", bt > 0.2 ? String(0.35 + 0.65 * clamp(bt)) : "1");
    });
    key.setAttribute("opacity", String(out(win(t, 6.5, 0.5)) * (1 - out(win(t, 12.4, 0.5))) * fade));
    // scanner sweeps down over the steps
    const sw = win(t, 6.9, 2.4), by = lerp(Y(0) - 14, Y(3) + CH + 8, sw);
    beam.setAttribute("transform", `translate(0 ${by})`);
    beam.setAttribute("opacity", String(sw > 0 && sw < 1 ? Math.sin(Math.PI * Math.min(1, sw * 1.15)) : 0));
    // the summary rises
    const se = out(win(t, 11.2, 0.8));
    sum.setAttribute("transform", `translate(0 ${(1 - se) * 14})`);
    sum.setAttribute("opacity", String(se * fade));
  }

  if (at != null || reduced) { draw(at ?? 12); return () => {}; }
  let raf = 0, last = 0, T = 0, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
  io.observe(svg);
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    T += Math.min(0.1, (now - (last || now)) / 1000);
    last = now;
    draw(T);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); };
}
