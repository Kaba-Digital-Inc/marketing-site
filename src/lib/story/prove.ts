/** "We prove it": pick the riskiest part, build a small prototype, run it on 12 real samples, see the result. Two outcomes, both good. */
import { C, back, clamp, el, header, icons, op, out, pill, runLoop, setup, text, win, at as move } from "./kit";

const LOOP = 14, W = 420, H = 440;
const RISKS = ["Messy scanned invoices", "Rare product names", "Long email threads", "Tricky refunds"];
const V = [
  { levels: [0.86, 0.58, 0.42, 0.3], pick: 0, miss: [4], pct: 92, tone: C.green, headline: "92% correct on real data. Safe to build.", note: "Learned in 2 weeks" },
  { levels: [0.55, 0.9, 0.42, 0.3], pick: 1, miss: [1, 3, 4, 7, 9], pct: 58, tone: C.amber, headline: "58% on rare product names. We change approach now.", note: "Caught before the build" },
];
const PH = [["Pick the riskiest part", "Test what could sink the project, first."], ["Build a small prototype", "Just enough to try it for real."], ["Run it on real data", "Twelve real samples from your business."], ["See what it tells us", ""]];

export function mountProve(svg: SVGSVGElement, reduced: boolean, frozen?: number) {
  setup(svg, W, H);
  const head = header(svg, W);
  const Y0 = 84;
  let variant = 0, lastCycle = -1;

  const rows = RISKS.map((name, i) => {
    const g = el("g", {}, svg), y = Y0 + i * 54;
    el("rect", { x: 14, y, width: 392, height: 42, rx: 12, fill: C.card, stroke: C.line, "stroke-width": 1.3 }, g);
    text(g, 30, y + 25.5, name, 12.5, C.text, 500);
    el("rect", { x: 262, y: y + 24, width: 124, height: 8, rx: 4, fill: C.line }, g);
    const fill = el("rect", { x: 262, y: y + 24, width: 0, height: 8, rx: 4, fill: C.amber }, g);
    const ring = el("rect", { x: 14, y, width: 392, height: 42, rx: 12, fill: "none", stroke: C.cyan, "stroke-width": 1.6, opacity: 0 }, g);
    const tag = el("g", {}, g); icons.alert(tag, 270, y + 14, C.cyan); text(tag, 281, y + 17.5, "RISKIEST", 9.5, C.cyan, 500, "start", "'IBM Plex Mono', ui-monospace, monospace");
    return { g, y, fill, ring, tag };
  });

  // prototype: real data -> prototype -> answer
  const proto = el("g", {}, svg), PY = 146, nodes = [["Real data", icons.db, 14], ["Prototype", icons.chip, 154], ["Answer", icons.doc, 294]] as const;
  const pn = nodes.map(([label, ic, x]) => {
    const g = el("g", {}, proto);
    el("rect", { x, y: PY, width: 112, height: 44, rx: 12, fill: C.card2, stroke: C.line, "stroke-width": 1.3 }, g);
    ic(g, x + 22, PY + 22, C.cyan); text(g, x + 38, PY + 26.5, label, 12, C.text, 600);
    return g;
  });
  const arrows = [126, 266].map((x) => { const p = el("path", { d: `M${x + 2} ${PY + 22} H${x + 26}`, stroke: C.mute, "stroke-width": 1.6, "stroke-dasharray": "3 4", "stroke-linecap": "round", fill: "none" }, proto); return p; });
  const pk = [0, 1, 2, 3].map(() => el("circle", { r: 2.8, fill: C.cyan, cy: PY + 22 }, proto));

  // 12 real samples
  const grid = el("g", {}, svg), tiles = Array.from({ length: 12 }, (_, i) => {
    const x = 34 + (i % 6) * 60, y = 224 + Math.floor(i / 6) * 44, g = el("g", {}, grid);
    const box = el("rect", { x, y, width: 52, height: 34, rx: 9, fill: C.card, stroke: C.line, "stroke-width": 1.2 }, g);
    const ic = el("g", {}, g); icons.doc(ic, x + 18, y + 17, C.mute);
    const res = el("g", {}, g);
    return { g, x, y, box, ic, res };
  });
  const gauge = el("g", {}, svg), gy = 322;
  text(gauge, 14, gy + 8, "ACCURACY", 10.5, C.mute, 400, "start", "'IBM Plex Mono', ui-monospace, monospace");
  el("rect", { x: 96, y: gy, width: 214, height: 10, rx: 5, fill: C.line }, gauge);
  const gfill = el("rect", { x: 96, y: gy, width: 0, height: 10, rx: 5, fill: C.green }, gauge);
  const gnum = text(gauge, 406, gy + 11, "0%", 20, C.text, 700, "end");
  const res = el("g", {}, svg), RY = 358, rbox = el("rect", { x: 14, y: RY, width: 392, height: 60, rx: 14, fill: C.card, "stroke-width": 1.5 }, res);
  const ricon = el("g", {}, res), rtext = text(res, 50, RY + 26, "", 13, C.text, 600), rnote = el("g", {}, res);

  const paint = (k: number) => {
    const v = V[k];
    rbox.setAttribute("stroke", v.tone); rtext.textContent = v.headline;
    gfill.setAttribute("fill", v.tone);
    ricon.replaceChildren(); el("circle", { cx: 32, cy: RY + 30, r: 10, fill: "none", stroke: v.tone, "stroke-width": 1.6 }, ricon); icons.check(ricon, 32, RY + 30, v.tone);
    rnote.replaceChildren(); pill(rnote, 50, RY + 34, 168, 20, v.tone, v.note);
    rows.forEach((r, i) => { r.fill.setAttribute("width", "0"); r.tag.setAttribute("transform", ""); });
    tiles.forEach((tl, i) => {
      tl.res.replaceChildren();
      const miss = v.miss.includes(i), col = miss ? C.amber : C.green;
      (miss ? icons.cross : icons.check)(tl.res, tl.x + 41, tl.y + 8, col);
    });
  };

  const draw = (t: number, cycle: number) => {
    if (cycle !== lastCycle) { lastCycle = cycle; variant = cycle % 2; paint(variant); }
    const v = V[variant], fade = 1 - out(win(t, 13, 0.9)), start = out(win(t, 0, 0.5));
    const ph = t < 3.7 ? 0 : t < 6.5 ? 1 : t < 10.2 ? 2 : 3;
    head.set(ph, PH[ph][0], ph === 3 ? v.note + "." : PH[ph][1], start * fade);

    rows.forEach((r, i) => {
      const e = out(win(t, 0.5 + 0.22 * i, 0.8)), chosen = i === v.pick;
      r.fill.setAttribute("width", String(124 * v.levels[i] * out(win(t, 1.0 + 0.22 * i, 1.4))));
      const gone = chosen ? 0 : out(win(t, 3.8, 0.7)), slide = chosen ? out(win(t, 3.9, 0.8)) : 0;
      move(r.g, 0, (Y0 - r.y) * slide + (chosen ? 0 : 0));
      op(r.g, e * fade * (1 - gone));
      const hi = chosen ? out(win(t, 2.6, 0.6)) : 0;
      op(r.ring, hi); op(r.tag, hi * (1 - slide * 0));
    });
    // prototype assembles
    const pe = out(win(t, 4.3, 0.9));
    pn.forEach((g, i) => { const e = out(win(t, 4.3 + 0.25 * i, 0.7)); move(g, 0, (1 - e) * 14); op(g, e * fade); });
    arrows.forEach((a, i) => op(a, out(win(t, 5.0 + 0.2 * i, 0.5)) * fade));
    pk.forEach((p, i) => {
      const seg = i % 2, u = (t * 0.9 + i * 0.37) % 1, x0 = seg ? 266 : 126;
      p.setAttribute("cx", String(x0 + 2 + 24 * u)); op(p, pe * fade * Math.sin(Math.PI * u) * (t < 10.4 ? 1 : 0));
    });
    // twelve real samples, one after another
    const ge = out(win(t, 6.4, 0.6)); op(grid, ge * fade);
    tiles.forEach((tl, i) => {
      const s = 6.9 + 0.23 * i, run = win(t, s, 0.3), fin = back(win(t, s + 0.28, 0.4)), miss = v.miss.includes(i);
      tl.box.setAttribute("stroke", fin > 0.2 ? (miss ? C.amber : C.green) : run > 0 ? C.cyan : C.line);
      tl.box.setAttribute("stroke-opacity", fin > 0.2 ? "0.8" : "1");
      move(tl.res, 0, 0, `scale(1)`); op(tl.res, clamp(fin));
    });
    op(gauge, ge * fade);
    const gp = out(win(t, 6.9, 3.2)) * v.pct / 100;
    gfill.setAttribute("width", String(214 * gp)); gnum.textContent = `${Math.round(gp * 100)}%`;
    const re = back(win(t, 10.5, 0.7));
    move(res, 0, (1 - clamp(re)) * 12); op(res, clamp(re) * fade);
  };

  return runLoop(svg, draw, { loop: LOOP, reduced, frozen, rest: 12 });
}
