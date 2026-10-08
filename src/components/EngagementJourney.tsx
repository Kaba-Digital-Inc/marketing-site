import { useCallback, useEffect, useRef, useState } from "react";
import type { Rive } from "@rive-app/canvas";
import StoryScene from "@/components/StoryScene";
import type { SceneName } from "@/lib/story";

type Step = { title: string; body: string; story: SceneName; storyLabel: string };

const DWELL_MS = 5500;

/**
 * "How an engagement runs": one animated explainer scene per step, with a Rive progress rail under it
 * (rive/engagement, built with the Rive CLI) and the four steps beside it.
 * The rail reads a `step` number; the step buttons write it, clicking a node on the rail writes it too,
 * and it advances by itself until the visitor picks a step. The text is real HTML, so it works without Rive.
 */
export default function EngagementJourney({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rive = useRef<Rive | null>(null);
  const stepProp = useRef<{ value: number } | null>(null);
  const picked = useRef(false);
  const lastSet = useRef(0);
  const visible = useRef(false);

  const go = useCallback((i: number, byUser: boolean) => {
    if (byUser) picked.current = true;
    lastSet.current = i;
    setActive(i);
    if (stepProp.current) stepProp.current.value = i;
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let cancelled = false;
    let ro: ResizeObserver | undefined;

    // Loaded in the browser only: the package is CommonJS and has no server use.
    import("@rive-app/canvas")
      .then((mod) => {
        const { Alignment, Fit, Layout, Rive: RiveCtor, RuntimeLoader } = mod.default ?? mod;
        if (cancelled) return;
        RuntimeLoader.setWasmUrl("/rive/rive.wasm");
        const r: Rive = new RiveCtor({
          src: "/rive/engagement.riv",
          canvas: el,
          autoplay: true,
          autoBind: true,
          stateMachines: "Journey",
          layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
          onLoad: () => {
            r.resizeDrawingSurfaceToCanvas();
            const prop = r.viewModelInstance?.number("step");
            if (prop) {
              stepProp.current = prop;
              prop.on(() => {
                const v = Math.round(prop.value);
                if (v !== lastSet.current) picked.current = true; // a click inside the scene
                lastSet.current = v;
                setActive(v);
              });
            }
            setReady(true);
          },
        });
        rive.current = r;
        ro = new ResizeObserver(() => rive.current?.resizeDrawingSurfaceToCanvas());
        ro.observe(el);
      })
      .catch(() => {
        /* the static picture stays */
      });

    return () => {
      cancelled = true;
      ro?.disconnect();
      rive.current?.cleanup();
      rive.current = null;
      stepProp.current = null;
    };
  }, []);

  // Advance by itself while on screen, until the visitor takes over. Skipped for reduced motion.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting) rive.current?.play();
      else rive.current?.pause();
    });
    io.observe(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => {
      if (reduce || picked.current || !visible.current) return;
      go((lastSet.current + 1) % steps.length, false);
    }, DWELL_MS);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [go, steps.length]);

  return (
    <div ref={wrap} className="grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative flex flex-col justify-center border-b border-line bg-void px-4 py-6 lg:border-b-0 lg:border-r">
        <div className="relative mx-auto aspect-[420/440] w-full max-w-[460px]">
          {steps.map((step, i) => (
            <div
              key={step.title}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-opacity duration-500 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <StoryScene scene={step.story} label={step.storyLabel} active={i === active} />
            </div>
          ))}
        </div>
        <div className="relative mx-auto mt-2 aspect-[640/120] w-full max-w-[540px]">
          <canvas
            ref={canvas}
            role="img"
            aria-label="Progress through the four stages: scope, prove, build, and run. Select a stage."
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>

      <div className="px-7 py-10 sm:px-10 lg:py-12">
        <h2 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-chalk sm:text-[32px]">
          <span className="text-signal">How</span> an engagement runs
        </h2>

        <ol className="mt-8 space-y-2">
          {steps.map((step, i) => {
            const on = i === active;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => go(i, true)}
                  aria-pressed={on}
                  className={`flex w-full gap-5 rounded-xl border p-4 text-left transition-colors ${
                    on ? "border-signal/40 bg-signal/[0.06]" : "border-transparent hover:border-line-2"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] font-medium transition-colors ${
                      on ? "border-signal bg-signal text-[#04222a]" : "border-line-2 text-chalk-mute"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-[17px] font-semibold leading-snug text-chalk">{step.title}</span>
                    <span className={`measure mt-1.5 block text-[14.5px] leading-relaxed text-pretty ${on ? "text-chalk-soft" : "text-chalk-mute"}`}>
                      {step.body}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
