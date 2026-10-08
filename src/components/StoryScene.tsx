import { useEffect, useRef } from "react";
import { scenes, sizes, type SceneName } from "@/lib/story";

/** One of the animated explainer scenes: scope, prove, build, run, or the homepage hero agent. Plays only while `active`. */
export default function StoryScene({ scene, label, active = true }: { scene: SceneName; label: string; active?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const [w, h] = sizes[scene];
  useEffect(() => {
    const mount = scenes[scene];
    if (!ref.current || !active || !mount) return;
    return mount(ref.current, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [scene, active]);
  return <svg ref={ref} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} className="h-full w-full" />;
}
