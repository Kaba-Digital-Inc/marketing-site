import { useEffect, useRef, type CSSProperties } from "react";
import {
  Branches,
  Cabinet,
  Dish,
  Elevator,
  Exploded,
  Keyboard,
  Laptop,
  Padlock,
  Patch,
  Phone,
  Phosphor,
  Riffle,
  Router,
  Terminal,
  Terrain,
  Vault,
} from "@lucasmarkes/hairline/react";

const figures = {
  branches: Branches,
  cabinet: Cabinet,
  dish: Dish,
  elevator: Elevator,
  exploded: Exploded,
  keyboard: Keyboard,
  laptop: Laptop,
  padlock: Padlock,
  patch: Patch,
  phone: Phone,
  phosphor: Phosphor,
  riffle: Riffle,
  router: Router,
  terminal: Terminal,
  terrain: Terrain,
  vault: Vault,
} as const;

export type FigureName = keyof typeof figures;

/** Normalised (0 to 1) position of the virtual pointer inside the figure at time t (seconds). */
type Path = (t: number, phase: number) => [number, number];

const wander: Path = (t, p) => [
  0.5 + 0.4 * Math.sin(t * 0.62 + p),
  0.5 + 0.36 * Math.sin(t * 0.47 + p * 1.7 + 1.3),
];

// Figures that read a pointer differently get a path that suits them.
const paths: Partial<Record<FigureName, Path>> = {
  // The dial turns as the pointer circles it.
  vault: (t, p) => [0.5 + 0.3 * Math.cos(t * 1.05 + p), 0.5 + 0.3 * Math.sin(t * 1.05 + p)],
  // The shackle lifts as the pointer approaches, so sweep in and out.
  padlock: (t, p) => [0.5 + 0.06 * Math.sin(t * 0.9 + p), 0.5 + 0.4 * Math.sin(t * 0.75 + p)],
  // A cable only lifts as the pointer crosses it, so sweep quickly along the panel.
  patch: (t, p) => [0.5 + 0.4 * Math.sin(t * 2.1 + p), 0.55 + 0.3 * Math.sin(t * 1.5 + p * 1.3)],
  // The keys sit low and wide in the frame, so sweep across them like a typist.
  keyboard: (t, p) => [0.5 + 0.34 * Math.sin(t * 0.85 + p), 0.6 + 0.2 * Math.sin(t * 1.35 + p * 1.7)],
  // These read the pointer's height, so favour a clear vertical sweep.
  elevator: (t, p) => [0.5 + 0.2 * Math.sin(t * 0.4 + p), 0.5 + 0.42 * Math.sin(t * 0.95 + p)],
  laptop: (t, p) => [0.5 + 0.2 * Math.sin(t * 0.4 + p), 0.5 + 0.42 * Math.sin(t * 0.55 + p)],
  terminal: (t, p) => [0.5 + 0.15 * Math.sin(t * 0.4 + p), 0.5 + 0.4 * Math.sin(t * 0.5 + p)],
  // Cards are picked by the pointer's height, so sweep up and down the tray.
  riffle: (t, p) => [0.5 + 0.12 * Math.sin(t * 0.4 + p), 0.5 + 0.4 * Math.sin(t * 0.6 + p)],
  // The dot matrix is painted by whatever passes over it, so draw wide slow loops.
  phosphor: (t, p) => [0.5 + 0.38 * Math.sin(t * 0.8 + p), 0.5 + 0.3 * Math.sin(t * 1.15 + p * 1.4)],
  cabinet: (t, p) => [0.5 + 0.15 * Math.sin(t * 0.4 + p), 0.5 + 0.4 * Math.sin(t * 0.52 + p)],
};

/** Stable pseudo-random phase per figure, so neighbours never move in step. */
function phaseFor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 997;
  return (h / 997) * Math.PI * 2;
}

type Props = {
  name: FigureName;
  /** Accessible description of what the figure depicts. */
  label?: string;
  intensity?: number;
  /** Surface the figure sits on. Plates are filled, so this must match. */
  plate?: string;
  /** Keep the figure moving on its own when nobody is pointing at it. Default true. */
  idle?: boolean;
  /**
   * CSS selector of an ancestor (for example a card) whose hover should also drive the figure,
   * so the whole card feels alive and not only the drawing.
   */
  followParent?: string;
  className?: string;
};

/**
 * Isometric line figure from @lucasmarkes/hairline, tinted to the Signal palette:
 * cyan for what is lit, cool greys for structure. Mount with client:visible.
 *
 * Hairline figures normally move only under the pointer. When idle is on, a virtual
 * pointer drifts along a gentle path so the figure is alive on its own, and a real
 * pointer takes over the moment it arrives. Motion pauses when the figure is off screen
 * and is skipped entirely for visitors who prefer reduced motion.
 */
export default function Figure({
  name,
  label,
  intensity = 0.6,
  plate = "#0e1012",
  idle = true,
  followParent,
  className,
}: Props) {
  const Component = figures[name];
  const hostRef = useRef<HTMLDivElement | null>(null);

  // Hovering the surrounding card drives the figure too, mapped across the figure's frame.
  useEffect(() => {
    const host = hostRef.current;
    const parent = followParent ? host?.closest(followParent) : null;
    if (!host || !parent) return;

    const svgOf = () => host.querySelector("svg") ?? host;
    const send = (type: string, x: number, y: number, bubbles = true) =>
      svgOf().dispatchEvent(
        new PointerEvent(type, { bubbles, pointerType: "pen", pressure: 0.5, clientX: x, clientY: y }),
      );

    const onMove = (e: Event) => {
      const pe = e as PointerEvent;
      if (!pe.isTrusted || host.contains(pe.target as Node)) return; // the figure handles its own hover
      const pr = parent.getBoundingClientRect();
      const fr = svgOf().getBoundingClientRect();
      if (!pr.width || !fr.width) return;
      const u = Math.min(1, Math.max(0, (pe.clientX - pr.left) / pr.width));
      const v = Math.min(1, Math.max(0, (pe.clientY - pr.top) / pr.height));
      send("pointermove", fr.left + u * fr.width, fr.top + v * fr.height);
    };
    const onLeave = (e: Event) => {
      if (!(e as PointerEvent).isTrusted) return;
      send("pointerleave", 0, 0, false);
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, [followParent]);

  useEffect(() => {
    const host = hostRef.current;
    if (!idle || !host || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parentEl = followParent ? host.closest(followParent) : null;

    const path = paths[name] ?? wander;
    const phase = phaseFor(name);
    let raf = 0;
    let visible = false;
    let lastReal = -Infinity;
    let start = 0;
    let driving = false;
    let lastSent = 0;

    // Real pointer activity (trusted events only) pauses the virtual pointer.
    const onReal = (e: Event) => {
      if (e.isTrusted) lastReal = performance.now();
    };
    host.addEventListener("pointermove", onReal, true);
    host.addEventListener("pointerdown", onReal, true);
    parentEl?.addEventListener("pointermove", onReal, true);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || now - lastReal < 1500) {
        driving = false;
        return;
      }
      // About 30 updates a second is plenty: the figures smooth motion with springs.
      if (now - lastSent < 33) return;
      lastSent = now;
      const target = host.querySelector("svg") ?? host;
      const r = target.getBoundingClientRect();
      if (!r.width) return;
      if (!start) start = now;
      const [u, v] = path((now - start) / 1000, phase);
      driving = true;
      target.dispatchEvent(
        // "pen", not "mouse": several figures gate their mouse path on real hover state that a
        // synthetic event cannot provide, while the pen and touch paths take the position as given.
        new PointerEvent("pointermove", {
          bubbles: true,
          pointerType: "pen",
          pressure: 0.5,
          clientX: r.left + u * r.width,
          clientY: r.top + v * r.height,
        }),
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.15 },
    );
    io.observe(host);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointermove", onReal, true);
      host.removeEventListener("pointerdown", onReal, true);
      parentEl?.removeEventListener("pointermove", onReal, true);
      // Let the figure settle if we were driving it when it unmounts.
      if (driving) host.querySelector("svg")?.dispatchEvent(new PointerEvent("pointerleave", { bubbles: false, pointerType: "pen" }));
    };
  }, [idle, name, followParent]);

  const style = {
    "--hairline-plate": plate,
    "--hairline-hi": "#35d6f5",
    "--hairline-edge": "#a4acb6",
    "--hairline-mid": "#4b535c",
    "--hairline-lo": "#262b31",
    "--hairline-stroke": 1,
  } as CSSProperties;

  return (
    <div className={className} style={style}>
      <Component ref={hostRef} theme="dark" intensity={intensity} label={label} />
    </div>
  );
}
