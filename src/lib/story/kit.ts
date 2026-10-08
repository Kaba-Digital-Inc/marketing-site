/** Shared pieces for the animated explainer scenes: colours, easing, small SVG helpers, icons, and the loop clock. */
export const NS = "http://www.w3.org/2000/svg";
export const C = { card: "#0f1215", card2: "#13171b", line: "#2a3037", text: "#e6e9ec", mute: "#8a949e", cyan: "#35d6f5", green: "#5fe3a1", amber: "#f2b35e", red: "#ff7a7a" };
export const font = "Inter, ui-sans-serif, system-ui, sans-serif";
export const mono = "'IBM Plex Mono', ui-monospace, monospace";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const out = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const back = (x: number) => { const t = clamp(x), c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
export const win = (t: number, s: number, d: number) => clamp((t - s) / d);

type A = Record<string, string | number>;
export function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: A, parent?: Element | null, text?: string) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (text != null) n.textContent = text;
  parent?.appendChild(n);
  return n;
}
export const op = (n: Element, v: number) => n.setAttribute("opacity", String(v));
export const at = (n: Element, x: number, y: number, extra = "") => n.setAttribute("transform", `translate(${x} ${y})${extra ? " " + extra : ""}`);
export const text = (p: Element, x: number, y: number, s: string, size = 12, fill = C.text, weight = 500, anchor = "start", fam = font) =>
  el("text", { x, y, fill, "font-size": size, "font-weight": weight, "text-anchor": anchor, "font-family": fam }, p, s);

export function setup(svg: SVGSVGElement, w: number, h: number) {
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const defs = el("defs", {}, svg);
  const glow = el("filter", { id: "k-glow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
  el("feGaussianBlur", { stdDeviation: 3, result: "b" }, glow);
  const mg = el("feMerge", {}, glow);
  el("feMergeNode", { in: "b" }, mg); el("feMergeNode", { in: "SourceGraphic" }, mg);
  const bg = el("linearGradient", { id: "k-beam", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: 0, "stop-color": C.cyan, "stop-opacity": 0 }, bg);
  el("stop", { offset: 1, "stop-color": C.cyan, "stop-opacity": 0.45 }, bg);
  return defs;
}

/** The four-stage header: "01 / 04", a title, a line under it, and four dots. */
export function header(svg: SVGSVGElement, w: number, y = 0) {
  const g = el("g", {}, svg);
  const k = el("text", { x: 14, y: y + 22, fill: C.cyan, "font-size": 10.5, "font-family": mono, "letter-spacing": 1.2 }, g);
  const t = text(g, 14, y + 44, "", 17, C.text, 600), s = text(g, 14, y + 62, "", 11.5, C.mute, 400);
  const pips = [0, 1, 2, 3].map((i) => el("circle", { cx: w - 84 + i * 24, cy: y + 20, r: 4, fill: C.line }, g));
  return {
    g,
    set(ph: number, title: string, sub: string, o: number) {
      k.textContent = `0${ph + 1} / 04`; t.textContent = title; s.textContent = sub;
      pips.forEach((p, i) => p.setAttribute("fill", i === ph ? C.cyan : C.line));
      op(g, o);
    },
  };
}

/** A rounded status pill with an optional icon drawn by `icon` at its left. */
export function pill(p: Element, x: number, y: number, w: number, h: number, col: string, label: string, icon?: (g: Element, cx: number, cy: number, c: string) => void) {
  const g = el("g", {}, p);
  el("rect", { x, y, width: w, height: h, rx: h / 2, fill: col, "fill-opacity": 0.14, stroke: col, "stroke-width": 1.3 }, g);
  if (icon) icon(g, x + 15, y + h / 2, col);
  text(g, x + (icon ? 28 : w / 2), y + h / 2 + 4.3, label, 11.5, col, 700, icon ? "start" : "middle");
  return g;
}

const S = (c: string, w = 1.3) => ({ fill: "none", stroke: c, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" });
export const icons = {
  chip(g: Element, x: number, y: number, c: string) {
    el("rect", { x: x - 6, y: y - 6, width: 12, height: 12, rx: 2.5, ...S(c, 1.4) }, g);
    [-3, 0, 3].forEach((d) => el("path", { d: `M${x + d} ${y - 8.5} v2.5 M${x + d} ${y + 6} v2.5`, ...S(c, 1.1) }, g));
  },
  list(g: Element, x: number, y: number, c: string) { el("path", { d: `M${x - 6} ${y - 4} h12 M${x - 6} ${y} h12 M${x - 6} ${y + 4} h8`, ...S(c, 1.4) }, g); },
  db(g: Element, x: number, y: number, c: string) {
    el("ellipse", { cx: x, cy: y - 5, rx: 6, ry: 2.6, ...S(c, 1.2) }, g);
    el("path", { d: `M${x - 6} ${y - 5} V${y + 4} A6 2.6 0 0 0 ${x + 6} ${y + 4} V${y - 5}`, ...S(c, 1.2) }, g);
  },
  lock(g: Element, x: number, y: number, c: string) {
    el("rect", { x: x - 4.5, y: y - 1.5, width: 9, height: 7, rx: 1.5, ...S(c, 1.2) }, g);
    el("path", { d: `M${x - 2.5} ${y - 1.5} v-2 a2.5 2.5 0 0 1 5 0 v2`, ...S(c, 1.2) }, g);
  },
  coin(g: Element, x: number, y: number, c: string) {
    el("circle", { cx: x, cy: y, r: 4.8, ...S(c, 1.2) }, g);
    el("path", { d: `M${x} ${y - 2.4} v4.8 M${x - 1.8} ${y - 1.2} h3.6 M${x - 1.8} ${y + 1.2} h3.6`, ...S(c, 1) }, g);
  },
  target(g: Element, x: number, y: number, c: string) { el("circle", { cx: x, cy: y, r: 4.8, ...S(c, 1.2) }, g); el("circle", { cx: x, cy: y, r: 1.6, fill: c }, g); },
  check(g: Element, x: number, y: number, c: string) { el("path", { d: `M${x - 4} ${y} l3 3.2 l5.2 -6.2`, ...S(c, 1.8) }, g); },
  cross(g: Element, x: number, y: number, c: string) { el("path", { d: `M${x - 3.5} ${y - 3.5} l7 7 M${x + 3.5} ${y - 3.5} l-7 7`, ...S(c, 1.8) }, g); },
  alert(g: Element, x: number, y: number, c: string) {
    el("path", { d: `M${x} ${y - 6} L${x + 6.2} ${y + 5} H${x - 6.2} Z`, ...S(c, 1.3) }, g);
    el("path", { d: `M${x} ${y - 2} v3.4`, ...S(c, 1.4) }, g); el("circle", { cx: x, cy: y + 3.4, r: 0.7, fill: c }, g);
  },
  doc(g: Element, x: number, y: number, c: string) {
    el("path", { d: `M${x - 5} ${y - 6.5} h6 l4 4 v9 h-10 Z`, ...S(c, 1.2) }, g);
    el("path", { d: `M${x - 2.5} ${y + 1} h5 M${x - 2.5} ${y + 3.6} h3.5`, ...S(c, 1) }, g);
  },
  person(g: Element, x: number, y: number, c: string) { el("circle", { cx: x, cy: y - 2.4, r: 3, ...S(c, 1.2) }, g); el("path", { d: `M${x - 5.5} ${y + 6} a5.5 4.2 0 0 1 11 0`, ...S(c, 1.2) }, g); },
  mail(g: Element, x: number, y: number, c: string) { el("rect", { x: x - 6, y: y - 4.4, width: 12, height: 8.8, rx: 1.8, ...S(c, 1.2) }, g); el("path", { d: `M${x - 5.6} ${y - 3.6} l5.6 4.4 l5.6 -4.4`, ...S(c, 1.2) }, g); },
  bolt(g: Element, x: number, y: number, c: string) { el("path", { d: `M${x + 1.5} ${y - 6.5} L${x - 4} ${y + 1} H${x} L${x - 1.5} ${y + 6.5} L${x + 4} ${y - 1} H${x}Z`, ...S(c, 1.2) }, g); },
  dot(g: Element, x: number, y: number, c: string) { el("circle", { cx: x, cy: y, r: 3, fill: c }, g); },
};

/** Runs `draw(T)` on a loop. Calls `cycle(n)` when a new loop starts. Skips frames while off screen; holds `rest` for reduced motion. */
export function runLoop(svg: SVGSVGElement, draw: (t: number, cycle: number) => void, o: { loop: number; reduced: boolean; frozen?: number; rest: number }) {
  if (o.frozen != null || o.reduced) { const f = o.frozen ?? o.rest; draw(f % o.loop, Math.floor(f / o.loop)); return () => {}; }
  let raf = 0, last = 0, T = 0, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
  io.observe(svg);
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    T += Math.min(0.1, (now - (last || now)) / 1000);
    last = now;
    draw(T % o.loop, Math.floor(T / o.loop));
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); };
}
