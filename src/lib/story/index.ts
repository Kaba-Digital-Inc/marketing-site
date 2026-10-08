import { mountScopeStory } from "../scopeStory";
import { mountProve } from "./prove";
import { mountBuild } from "./build";
import { mountRun } from "./run";
import { mountHero } from "./hero";

export type SceneName = "scope" | "prove" | "build" | "run" | "hero";
export type Mount = (svg: SVGSVGElement, reduced: boolean, frozen?: number) => () => void;
export const scenes: Partial<Record<SceneName, Mount>> = { scope: mountScopeStory, prove: mountProve, build: mountBuild, run: mountRun, hero: mountHero };
export const sizes: Record<SceneName, [number, number]> = { scope: [420, 440], prove: [420, 440], build: [420, 440], run: [420, 440], hero: [460, 420] };
